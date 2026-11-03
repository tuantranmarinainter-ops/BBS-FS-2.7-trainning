// A small, CPU-based perspective renderer for the trainer's untextured geometry.
// Triangles are clipped in homogeneous coordinates and painted back-to-front.
import * as THREE from './vendor/three.module.js';

export function createSoftwareRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Không thể mở canvas 2D cho chế độ 3D dự phòng.');
  let width = Math.max(1, canvas.width || 1), height = Math.max(1, canvas.height || 1), disposed = false;
  const planes = [v => v.w + v.x, v => v.w - v.x, v => v.w + v.y, v => v.w - v.y, v => v.w + v.z, v => v.w - v.z];
  function clip(vertices) {
    let points = vertices;
    for (const distance of planes) {
      const next = [];
      if (!points.length) break;
      let a = points[points.length - 1], da = distance(a);
      for (const b of points) {
        const db = distance(b), aInside = da >= 0, bInside = db >= 0;
        if (aInside !== bInside) next.push(a.clone().lerp(b, da / (da - db)));
        if (bInside) next.push(b);
        a = b; da = db;
      }
      points = next;
    }
    return points;
  }
  function clipLine(a, b) {
    let lo = 0, hi = 1;
    for (const distance of planes) {
      const da = distance(a), db = distance(b);
      if (da < 0 && db < 0) return [];
      if ((da < 0) !== (db < 0)) {
        const t = da / (da - db);
        if (da < 0) lo = Math.max(lo, t); else hi = Math.min(hi, t);
      }
    }
    return lo <= hi ? [a.clone().lerp(b, lo), a.clone().lerp(b, hi)] : [];
  }
  function screen(v) { return [(v.x / v.w * .5 + .5) * width, (-v.y / v.w * .5 + .5) * height]; }
  function rgb(color, factor = 1) {
    // Three colors are linear; convert to sRGB as a browser renderer would.
    const c = color.clone().multiplyScalar(Math.max(0, factor)).convertLinearToSRGB();
    const channel = n => Math.round(Math.max(0, Math.min(1, n)) * 255);
    return `rgb(${channel(c.r)},${channel(c.g)},${channel(c.b)})`;
  }
  function render(scene, camera) {
    if (disposed) return;
    scene.updateMatrixWorld(true); camera.updateMatrixWorld(true);
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    const background = scene.background?.isColor ? rgb(scene.background) : '#182631';
    ctx.globalAlpha = 1; ctx.fillStyle = background; ctx.fillRect(0, 0, width, height);
    const lights = [], primitives = [];
    let ambient = 0;
    scene.traverseVisible(o => {
      if (o.isAmbientLight || o.isHemisphereLight) ambient += o.intensity * (o.isHemisphereLight ? .7 : 1);
      if (o.isDirectionalLight) {
        const position = new THREE.Vector3().setFromMatrixPosition(o.matrixWorld);
        const target = new THREE.Vector3().setFromMatrixPosition(o.target.matrixWorld);
        lights.push({ direction: position.sub(target).normalize(), intensity: o.intensity });
      }
    });
    const viewProjection = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    scene.traverseVisible(object => {
      if ((!object.isMesh && !object.isLine) || !object.geometry?.attributes?.position || !object.material) return;
      const geometry = object.geometry, position = geometry.attributes.position, index = geometry.index;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      const mvp = new THREE.Matrix4().multiplyMatrices(viewProjection, object.matrixWorld);
      const vector = i => new THREE.Vector3().fromBufferAttribute(position, i);
      const projected = i => { const v = vector(i); return new THREE.Vector4(v.x, v.y, v.z, 1).applyMatrix4(mvp); };
      const indexAt = i => index ? index.getX(i) : i;
      const count = index ? index.count : position.count;
      const primitiveColor = (material, indices) => {
        const color = (material.color || new THREE.Color('white')).clone();
        const attribute = material.vertexColors && geometry.attributes.color;
        if (attribute) {
          const average = new THREE.Color(0, 0, 0);
          for (const vertex of indices) average.r += attribute.getX(vertex), average.g += attribute.getY(vertex), average.b += attribute.getZ(vertex);
          average.multiplyScalar(1 / indices.length); color.multiply(average);
        }
        return color;
      };
      const drawStart = Math.max(0, geometry.drawRange.start || 0), drawEnd = Math.min(count, drawStart + geometry.drawRange.count);
      const materialAt = i => {
        if (materials.length === 1) return materials[0];
        const group = geometry.groups.find(g => i >= g.start && i < g.start + g.count);
        return materials[group?.materialIndex ?? 0];
      };
      if (object.isMesh) {
        for (let i = drawStart; i + 2 < drawEnd; i += 3) {
          const material = materialAt(i); if (!material || material.visible === false || material.opacity <= 0) continue;
          const ia = indexAt(i), ib = indexAt(i + 1), ic = indexAt(i + 2);
          const clipped = clip([projected(ia), projected(ib), projected(ic)]); if (clipped.length < 3) continue;
          const pts = clipped.map(screen);
          const area = (pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) - (pts[1][1] - pts[0][1]) * (pts[2][0] - pts[0][0]);
          if (Math.abs(area) < 1e-8 || (material.side === THREE.FrontSide && area >= 0) || (material.side === THREE.BackSide && area <= 0)) continue;
          let light = 1;
          if (!material.isMeshBasicMaterial) {
            const a = vector(ia).applyMatrix4(object.matrixWorld), b = vector(ib).applyMatrix4(object.matrixWorld), c = vector(ic).applyMatrix4(object.matrixWorld);
            const normal = b.sub(a).cross(c.sub(a)).normalize();
            if (area > 0 && material.side === THREE.DoubleSide) normal.negate();
            light = ambient;
            for (const source of lights) light += Math.max(0, normal.dot(source.direction)) * source.intensity;
            light = Math.max(.12, Math.min(1.5, light));
          }
          primitives.push({ kind: 'polygon', pts, depth: clipped.reduce((sum, v) => sum + v.z / v.w, 0) / clipped.length, color: rgb(primitiveColor(material, [ia, ib, ic]), light), opacity: material.opacity ?? 1, order: object.renderOrder });
        }
      } else {
        const step = object.isLineSegments ? 2 : 1;
        for (let i = drawStart; i + 1 < drawEnd; i += step) {
          const material = materialAt(i); if (!material || material.visible === false || material.opacity <= 0) continue;
          const points = clipLine(projected(indexAt(i)), projected(indexAt(i + 1)));
          if (points.length < 2) continue;
          primitives.push({ kind: 'line', pts: [screen(points[0]), screen(points[points.length - 1])], depth: points.reduce((s, v) => s + v.z / v.w, 0) / points.length, color: rgb(primitiveColor(material, [indexAt(i), indexAt(i + 1)])), opacity: material.opacity ?? 1, order: object.renderOrder, lineWidth: material.linewidth || 1 });
        }
      }
    });
    primitives.sort((a, b) => a.order - b.order || b.depth - a.depth);
    for (const p of primitives) {
      ctx.globalAlpha = p.opacity; ctx.beginPath(); ctx.moveTo(...p.pts[0]);
      for (let i = 1; i < p.pts.length; i++) ctx.lineTo(...p.pts[i]);
      if (p.kind === 'polygon') { ctx.closePath(); ctx.fillStyle = p.color; ctx.fill(); }
      else { ctx.strokeStyle = p.color; ctx.lineWidth = p.lineWidth; ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
  }
  return {
    render,
    setSize(w, h) { if (!(w > 0 && h > 0 && Number.isFinite(w) && Number.isFinite(h))) throw new Error('Canvas size must be positive'); width = Math.round(w); height = Math.round(h); canvas.width = width; canvas.height = height; },
    dispose() { disposed = true; }
  };
}
