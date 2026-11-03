import * as THREE from './vendor/three.module.js';
import { evaluateProject } from './core.js';
import { createSoftwareRenderer } from './software-renderer.js';

// These transforms and joint cues are trainer conventions, not verified BBS runtime behavior.
const num=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
const rad=v=>THREE.MathUtils.degToRad(num(v));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const tintColors={white:0xffffff,red:0xff7777,blue:0x77a9ff,green:0x86dc81};
function disposeTree(root){root.traverse(o=>{o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose()})}
function group(parent,name){const g=new THREE.Group();g.name=name;parent.add(g);return g}
function box(parent,name,position,dimensions,color){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...dimensions),new THREE.MeshLambertMaterial({color}));mesh.name=name;mesh.position.set(...position);parent.add(mesh);return mesh}
function line(parent,name,points,color){const geometry=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const object=new THREE.Line(geometry,new THREE.LineBasicMaterial({color}));object.name=name;parent.add(object);return object}
function circle(parent,name,radius,color){const pts=[];for(let i=0;i<=48;i++){const a=i*Math.PI/24;pts.push([Math.cos(a)*radius,.025,Math.sin(a)*radius])}return line(parent,name,pts,color)}
function addFigure(parent,replay,s,root){
 const base=new THREE.Color(replay.fixtureId==='wood'?0x986940:0x557ca8).multiply(new THREE.Color(tintColors[root['texture.color']]??0xffffff));
 const dark=base.clone().multiplyScalar(.55),skin=new THREE.Color(replay.fixtureId==='wood'?0xd4a879:0xd5b498);
 if(root['model.kind']==='block'){box(parent,'model:block',[0,.85,0],[1,1.7,.7],base);box(parent,'block:face',[0,1.32,.355],[.5,.28,.025],skin);return}
 const torso=group(parent,'torso');torso.position.y=s['states.sneaking']?1.03:1.15;torso.rotation.x=rad(s['states.sneaking']?18:0);
 box(torso,'body',[0,0,0],[.75,.85,.4],base);
 box(parent,'left-leg',[-.2,.35,0],[.3,.7,.34],dark);box(parent,'right-leg',[.2,.35,0],[.3,.7,.34],dark);
 const head=group(torso,'head');head.position.y=.69;head.rotation.x=rad(s.pitch)+rad(root['pose.headX']);
 box(head,'head:skin',[0,0,0],[.56,.55,.5],skin);box(head,'head:hair',[0,.2,0],[.57,.15,.51],dark);
 box(head,'eye:left',[-.13,.02,.255],[.055,.065,.022],0x202b36);box(head,'eye:right',[.13,.02,.255],[.055,.065,.022],0x202b36);
 const arm=group(torso,'arm:left');arm.position.set(-.52,.3,0);arm.rotation.x=rad(root['pose.armX'])+(s['states.sprinting']?-.5:0)+(root.action==='wave'?-.9:0);
 box(arm,'arm:left:mesh',[0,-.32,0],[.28,.68,.32],base);box(torso,'arm:right',[.52,-.02,0],[.28,.68,.32],base);
 if(s['equipment.head']==='helmet')box(head,'equipment:helmet',[0,.32,0],[.65,.17,.58],0xd9af51);
 if(s['equipment.mainHand']==='sword'){box(arm,'equipment:sword',[0,-.77,.12],[.12,.55,.12],0xc4c9bf);box(arm,'equipment:sword:guard',[0,-.53,.12],[.32,.07,.12],0x907044)}
 if(s['equipment.mainHand']==='pickaxe'){box(arm,'equipment:pickaxe',[0,-.77,.12],[.09,.65,.09],0x91663b);box(arm,'equipment:pickaxe:head',[0,-1.05,.12],[.42,.1,.14],0xb6c2c5)}
}
function addEffects(parent,part,state){const effect=part['vfx.kind']||'none';if(effect==='none')return;const size=clamp(num(part['vfx.size'],1),.1,4),intensity=clamp(num(state['variable.intensity'],1),0,2)/2,color=new THREE.Color(0xb28fff).multiplyScalar(intensity);circle(parent,'vfx:'+effect,size,color);if(effect==='sparks')for(let i=0;i<6;i++){const a=i*Math.PI/3;box(parent,'spark:'+i,[Math.cos(a)*size,.25+i*.13,Math.sin(a)*size],[.1,.1,.1],color)}}
function applyPreview(project,state,preview){if(!preview)return;for(const replay of project.replays){const track=replay.tracks.find(t=>t.id===preview.trackId);if(!track)continue;const target=track.owner==='form'?state[replay.id]?.parts?.[track.partId]:state[replay.id];if(target)target[track.propertyId]=preview.value;return}}

/** Build a real Three.js scene graph. Numeric angle channels are independent trainer cues. */
export function createWorld(){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x102331);
 const camera=new THREE.PerspectiveCamera(45,1,.1,150);
 scene.add(new THREE.HemisphereLight(0xd9edff,0x40505b,2));const sun=new THREE.DirectionalLight(0xffffff,1.7);sun.position.set(6,12,8);scene.add(sun);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshLambertMaterial({color:0x142731,side:THREE.DoubleSide}));floor.name='floor';floor.renderOrder=-100;floor.rotation.x=-Math.PI/2;floor.position.y=-.025;scene.add(floor);
 const grid=new THREE.GridHelper(20,20,0x8bb3c7,0x496878);grid.name='grid';grid.renderOrder=-90;scene.add(grid);
 const axes=new THREE.AxesHelper(3);axes.name='axes';axes.renderOrder=-80;scene.add(axes);
 const objects=group(scene,'replays');
 function applyProject(project,tick,options={}){
  for(const child of [...objects.children]){objects.remove(child);disposeTree(child)}
  const state=evaluateProject(project,tick);applyPreview(project,state,options.preview);
  for(const replay of project.replays){const s=state[replay.id];if(!s)continue;const root=s.parts?.root||{};
   const replayGroup=group(objects,'replay:'+replay.id);replayGroup.userData.replayId=replay.id;replayGroup.userData.label=replay.label;replayGroup.userData.fixtureId=replay.fixtureId;replayGroup.userData.slot=num(s['hotbar.slot']);replayGroup.userData.formVisible=root.visible!==false;
   replayGroup.position.set(num(s.x),num(s.y)+(root.action==='jump'?Math.abs(Math.sin(tick*Math.PI/20))*.7:0),num(s.z));replayGroup.rotation.y=rad(s.yaw);
   const form=group(replayGroup,'form:root');form.position.set(num(root['transform.x']),num(root['transform.y']),num(root['transform.z']));form.visible=root.visible!==false;
   const anchor=group(form,'anchor:pivot');anchor.position.set(num(root['anchor.x']),num(root['anchor.y']),num(root['anchor.z']));anchor.scale.setScalar(clamp(num(root['transform.scale'],1),.1,4));const content=group(anchor,'anchor:content');content.position.copy(anchor.position).multiplyScalar(-1);
   if(replay.fixtureId==='vfx')box(content,'vfx:fixture',[0,.25,0],[.3,.3,.3],0xa37bd3);else addFigure(content,replay,s,root);
   addEffects(content,root,s);
   for(const part of replay.parts){if(part.id==='root')continue;const data=s.parts?.[part.id]||{};const nested=group(content,'form:'+part.id);nested.visible=data.visible!==false;nested.position.set(num(data['transform.x']),num(data['transform.y']),num(data['transform.z']));nested.scale.setScalar(clamp(num(data['transform.scale'],1),.1,4));addEffects(nested,data,s)}
   if(options.selectedReplayId===replay.id){const marker=circle(replayGroup,'selection',.9,0x8bdcff);marker.position.copy(form.position)}
   // Body and head yaw are shown as separate world-space markers, not summed into yaw.
   for(const [key,color,height,length] of [['bodyYaw',0xf4ad52,.06,1.2],['headYaw',0xd590ef,2.2,.9]])if(num(s[key])!==0){const a=rad(s[key])-replayGroup.rotation.y;const cue=line(replayGroup,'angle:'+key,[[0,height,0],[Math.sin(a)*length,height,Math.cos(a)*length]],color);cue.position.copy(form.position)}
  }
  scene.updateMatrixWorld(true);
 }
 function dispose(){disposeTree(scene);scene.clear()}
 return {scene,camera,applyProject,dispose};
}
export function createSceneGraph(project,tick=0,options={}){const world=createWorld();world.applyProject(project,tick,options);return world}

export function createScene(canvas,{onSelect=()=>{},onError=()=>{},onStatus=()=>{}}={}){
 let renderer,mode='webgl';try{const context=canvas.getContext('webgl2',{antialias:true,alpha:false});if(!context)throw new Error('WebGL2 không khả dụng');renderer=new THREE.WebGLRenderer({canvas,context,antialias:true});renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,2));onStatus({mode,message:'Three.js · WebGL'});}catch(webglError){try{renderer=createSoftwareRenderer(canvas);mode='software';onStatus({mode,message:'Three.js · dựng hình phần mềm (không có WebGL2)'});}catch(error){onError('Không thể khởi tạo cảnh Three.js: '+(error?.message||webglError?.message));return {render(){},setView(){},resetView(){},dispose(){}}}}
 const world=createWorld(),{scene,camera}=world;let last=null,drag=null;const initial={azimuth:.75,elevation:.48,distance:13,target:new THREE.Vector3(.8,1,1)};let view={...initial,target:initial.target.clone()};
 const parent=canvas.parentElement,doc=canvas.ownerDocument,labelLayer=parent&&doc?.createElement?doc.createElement('div'):null;if(labelLayer){Object.assign(labelLayer.style,{position:'absolute',inset:'0',overflow:'hidden',pointerEvents:'none'});labelLayer.setAttribute('aria-hidden','true');parent.appendChild(labelLayer)}
 function updateCamera(){const {azimuth:a,elevation:e,distance:d,target:t}=view;camera.position.set(t.x+d*Math.cos(e)*Math.sin(a),t.y+d*Math.sin(e),t.z+d*Math.cos(e)*Math.cos(a));camera.lookAt(t);camera.updateMatrixWorld();}
 function labels(){if(!labelLayer)return;labelLayer.replaceChildren();const cr=canvas.getBoundingClientRect(),pr=parent.getBoundingClientRect();for(const g of scene.getObjectByName('replays').children){const p=new THREE.Vector3(),form=g.getObjectByName('anchor:content');(form||g).getWorldPosition(p);const scale=new THREE.Vector3();(form||g).getWorldScale(scale);p.y+=(g.userData.fixtureId==='vfx'?1:2.5)*scale.y;p.project(camera);if(p.z < -1||p.z>1||Math.abs(p.x)>1||Math.abs(p.y)>1)continue;const label=doc.createElement('span'),selected=last?.options.selectedReplayId===g.userData.replayId;label.textContent=g.userData.label+(g.userData.slot>0?' · ô '+g.userData.slot:'')+(g.userData.formVisible?'':' · ẩn');Object.assign(label.style,{position:'absolute',left:(cr.left-pr.left+(p.x+1)*cr.width/2)+'px',top:(cr.top-pr.top+(1-p.y)*cr.height/2)+'px',transform:'translate(-50%,-100%)',padding:'2px 6px',borderRadius:'4px',whiteSpace:'nowrap',font:'12px system-ui, sans-serif',color:'#e6f3ff',background:selected?'#245875':'#10202bdc',border:selected?'1px solid #8bd2ff':'1px solid #587083'});labelLayer.appendChild(label)}}
 function draw(){if(!last)return;const r=canvas.getBoundingClientRect(),w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();updateCamera();renderer.render(scene,camera);labels()}
 function render(project,tick,options={}){last={project,tick,options};world.applyProject(project,tick,options);draw()}
 function resetView(){view={...initial,target:initial.target.clone()};draw()}
 function setView(name){if(name==='perspective'){resetView();return}if(name==='front'){view.azimuth=0;view.elevation=.15}else if(name==='side'){view.azimuth=Math.PI/2;view.elevation=.15}else if(name==='top'){view.azimuth=0;view.elevation=Math.PI/2-.01}draw()}
 const raycaster=new THREE.Raycaster();function down(e){if(![0,1,2].includes(e.button))return;drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,pan:e.button!==0||e.shiftKey};canvas.setPointerCapture(e.pointerId)}
 function move(e){if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;if(drag.pan){const k=view.distance*.0018;view.target.x-=dx*k*Math.cos(view.azimuth);view.target.z+=dx*k*Math.sin(view.azimuth);view.target.y+=dy*k}else{view.azimuth-=dx*.008;view.elevation=clamp(view.elevation+dy*.008,-1.48,1.56)}draw()}
 function up(e){if(!drag)return;if(!drag.pan&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<5){const r=canvas.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2),camera);const hits=raycaster.intersectObjects(scene.getObjectByName('replays').children,true);for(const hit of hits){let obj=hit.object,visible=true;while(obj&&!obj.userData.replayId){if(!obj.visible)visible=false;obj=obj.parent}if(visible&&obj?.visible&&obj.userData.replayId){onSelect(obj.userData.replayId);break}}}drag=null}
 function cancel(){drag=null}function wheel(e){e.preventDefault();view.distance=clamp(view.distance*Math.exp(e.deltaY*.001),3,60);draw()}function context(e){e.preventDefault()}
 const listeners=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',cancel],['wheel',wheel],['contextmenu',context]];for(const [n,f] of listeners)canvas.addEventListener(n,f,n==='wheel'?{passive:false}:undefined);
 const observer=typeof ResizeObserver==='function'?new ResizeObserver(draw):null;observer?.observe(canvas);
 function dispose(){observer?.disconnect();for(const [n,f] of listeners)canvas.removeEventListener(n,f);labelLayer?.remove();renderer.dispose();world.dispose();last=null}
 return {render,setView,resetView,dispose};
}
