import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from './vendor/three.module.js';
import { createSoftwareRenderer } from './software-renderer.js';
function fixture() {
  const commands = [];
  const ctx = new Proxy({}, { get(target, key) { if (key in target) return target[key]; return (...args) => commands.push([key, ...args]); }, set(target, key, value) { target[key] = value; commands.push([key, value]); return true; } });
  const canvas = { width:300, height:200, getContext: type => type === '2d' ? ctx : null };
  const renderer = createSoftwareRenderer(canvas); renderer.setSize(300, 200);
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#1c2834'); scene.add(new THREE.AmbientLight(0xffffff, .5));
  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color:'red'})); scene.add(box);
  const camera = new THREE.PerspectiveCamera(50, 1.5, .1, 100); camera.position.set(3, 2, 4); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
  return {commands, scene, camera, box, renderer};
}
test('renders projected triangles deterministically and responds to camera and visibility', () => {
  const {commands, scene, camera, box, renderer} = fixture();
  renderer.render(scene, camera); const first = JSON.stringify(commands); assert.ok(commands.some(c => c[0] === 'fill'));
  commands.length = 0; renderer.render(scene, camera); assert.equal(JSON.stringify(commands), first);
  camera.position.set(-4, 2, 3); camera.lookAt(0, 0, 0); commands.length = 0; renderer.render(scene, camera); assert.notEqual(JSON.stringify(commands), first);
  box.visible = false; commands.length = 0; renderer.render(scene, camera); assert.equal(commands.filter(c => c[0] === 'fill').length, 0);
});
test('renders clipped lines and triangles without unbounded coordinates', () => {
  const {commands, scene, camera, renderer} = fixture();
  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1000,0,0), new THREE.Vector3(1000,0,0)]);
  scene.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({color:'white'})));
  renderer.render(scene, camera); assert.ok(commands.some(c => c[0] === 'stroke'));
  for (const cmd of commands.filter(c => c[0] === 'moveTo' || c[0] === 'lineTo')) assert.ok(cmd.slice(1).every(n => Number.isFinite(n) && Math.abs(n) <= 301));
});
test('missing 2D context throws and dispose stops rendering', () => {
  assert.throws(() => createSoftwareRenderer({getContext:()=>null}), /2D/);
  const {commands, scene, camera, renderer} = fixture(); renderer.dispose(); commands.length = 0; renderer.render(scene, camera); assert.equal(commands.length, 0);
});
test('renderOrder places ground before actors even when its average depth is nearer', () => {
  const {commands, scene, camera, renderer} = fixture();
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({color:'blue', side:THREE.DoubleSide}));
  ground.position.set(0, 0, 1.5); ground.renderOrder = -100; scene.add(ground);
  renderer.render(scene, camera);
  const fills = commands.filter(c => c[0] === 'fillStyle').map(c => c[1]);
  assert.ok(fills.findIndex(c => c === 'rgb(0,0,255)') > 0);
  assert.ok(fills.findIndex(c => c === 'rgb(0,0,255)') < fills.findIndex(c => c.startsWith('rgb(') && c !== 'rgb(0,0,255)' && c !== fills[0]));
});
test('line and mesh vertex colors multiply material colors', () => {
  const {commands, scene, camera, renderer} = fixture();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1,0,1, 1,0,1], 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute([1,0,0, 1,0,0], 3));
  scene.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({color:0xffffff, vertexColors:true})));
  const triangle = new THREE.BufferGeometry();
  triangle.setAttribute('position', new THREE.Float32BufferAttribute([-1,0,1, 1,0,1, 0,1,1], 3));
  triangle.setAttribute('color', new THREE.Float32BufferAttribute([0,1,0, 0,1,0, 0,1,0], 3));
  scene.add(new THREE.Mesh(triangle, new THREE.MeshBasicMaterial({color:0xffffff, vertexColors:true, side:THREE.DoubleSide})));
  renderer.render(scene, camera);
  assert.ok(commands.some(c => c[0] === 'strokeStyle' && c[1] === 'rgb(255,0,0)'));
  assert.ok(commands.some(c => c[0] === 'fillStyle' && c[1] === 'rgb(0,255,0)'));
});
