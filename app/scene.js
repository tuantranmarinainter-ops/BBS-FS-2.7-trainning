import { evaluateProject } from './core.js';

// Scene values and joint rotations are trainer conventions, pending BBS runtime verification.
const I=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
function mul(a,b){const r=new Float32Array(16);for(let c=0;c<4;c++)for(let row=0;row<4;row++)for(let k=0;k<4;k++)r[c*4+row]+=a[k*4+row]*b[c*4+k];return r}
function translate(x,y,z){const m=I();m[12]=x;m[13]=y;m[14]=z;return m}
function scale(x,y,z){const m=I();m[0]=x;m[5]=y;m[10]=z;return m}
function rotateX(a){const m=I(),c=Math.cos(a),s=Math.sin(a);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m}
function rotateY(a){const m=I(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m}
const rad=n=>(Number(n)||0)*Math.PI/180;
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),m=new Float32Array(16);m[0]=f/aspect;m[5]=f;m[10]=(far+near)/(near-far);m[11]=-1;m[14]=2*far*near/(near-far);return m}
function lookAt(e,t){let z=norm([e[0]-t[0],e[1]-t[1],e[2]-t[2]]),x=norm([z[2],0,-z[0]]);if(Math.hypot(...x)<.01)x=[1,0,0];const y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,e),-dot(y,e),-dot(z,e),1])}
function norm(v){const n=Math.hypot(...v)||1;return v.map(x=>x/n)}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function transform(m,p){return [0,1,2,3].map(row=>m[row]*p[0]+m[4+row]*p[1]+m[8+row]*p[2]+m[12+row])}
function color(value,fallback){if(typeof value!=='string')return fallback;const named={red:'#c45151',blue:'#528bd1',green:'#69a65f',purple:'#9b70cb',gold:'#e6b45a',white:'#eeeeee',black:'#303540',wood:'#ad8054',default:''};let s=named[value.toLowerCase()]??value;if(/^#[0-9a-f]{3}$/i.test(s))s='#'+[...s.slice(1)].map(x=>x+x).join('');if(!/^#[0-9a-f]{6}$/i.test(s))return fallback;return [1,3,5].map(i=>parseInt(s.slice(i,i+2),16)/255)}
const numeric=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
const enabled=v=>v===true || (typeof v==='string'&&!['','none','off','false','0'].includes(v.toLowerCase()));

export function createScene(canvas,{onSelect=()=>{},onError=()=>{}}={}){
 let gl;try{gl=canvas.getContext('webgl',{antialias:true,alpha:false});}catch{};
 if(!gl){onError('Không thể chạy cảnh 3D: trình duyệt không hỗ trợ WebGL.');return {render(){},setView(){},resetView(){},dispose(){}}}
 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
 let program;
 try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec3 p; uniform mat4 m; void main(){gl_Position=m*vec4(p,1.0);}'));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision mediump float; uniform vec3 c; void main(){gl_FragColor=vec4(c,1.0);}'));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));}catch(e){onError('Không thể khởi tạo WebGL: '+e.message);return {render(){},setView(){},resetView(){},dispose(){}}}
 const pos=gl.getAttribLocation(program,'p'),matrix=gl.getUniformLocation(program,'m'),colour=gl.getUniformLocation(program,'c');
 const cube=new Float32Array([ // triangles, centered unit cube
 -.5,-.5,.5,.5,-.5,.5,.5,.5,.5, -.5,-.5,.5,.5,.5,.5,-.5,.5,.5,
 .5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5, .5,-.5,-.5,-.5,.5,-.5,.5,.5,-.5,
 -.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5, -.5,-.5,-.5,-.5,.5,.5,-.5,.5,-.5,
 .5,-.5,.5,.5,-.5,-.5,.5,.5,-.5, .5,-.5,.5,.5,.5,-.5,.5,.5,.5,
 -.5,.5,.5,.5,.5,.5,.5,.5,-.5, -.5,.5,.5,.5,.5,-.5,-.5,.5,-.5,
 -.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5, -.5,-.5,-.5,.5,-.5,.5,-.5,-.5,.5]);
 const cubeBuffer=gl.createBuffer(),lineBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,cubeBuffer);gl.bufferData(gl.ARRAY_BUFFER,cube,gl.STATIC_DRAW);
 // Labels live over the canvas so they remain legible at any scale and never intercept input.
 const parent=canvas.parentElement,doc=canvas.ownerDocument,labelLayer=parent&&doc?.createElement?doc.createElement('div'):null;
 if(labelLayer){Object.assign(labelLayer.style,{position:'absolute',inset:'0',overflow:'hidden',pointerEvents:'none'});labelLayer.setAttribute('aria-hidden','true');parent.appendChild(labelLayer)}
 const initial={azimuth:.75,elevation:.48,distance:17,target:[.8,1,1]};let camera={...initial,target:[...initial.target]},last=null,drag=null,picks=[];
 function draw(buffer,vertices,mode,model,c){gl.bindBuffer(gl.ARRAY_BUFFER,buffer);if(vertices)gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(pos);gl.uniformMatrix4fv(matrix,false,mul(vp,model));gl.uniform3fv(colour,c);gl.drawArrays(mode,0,vertices?vertices.length/3:36)}
 let vp=I();function box(parent,x,y,z,w,h,d,c){draw(cubeBuffer,null,gl.TRIANGLES,mul(mul(parent,translate(x,y,z)),scale(w,h,d)),c)}
 function lines(vertices,c){draw(lineBuffer,vertices,gl.LINES,I(),c)}
 function resize(){const rect=canvas.getBoundingClientRect(),ratio=Math.min(globalThis.devicePixelRatio||1,2),w=Math.max(1,Math.round(rect.width*ratio)),h=Math.max(1,Math.round(rect.height*ratio));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h)}
 function drawFrame(){if(!last)return;resize();gl.enable(gl.DEPTH_TEST);gl.clearColor(.065,.11,.15,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);
 const {azimuth:a,elevation:e,distance:d,target:t}=camera,eye=[t[0]+d*Math.cos(e)*Math.sin(a),t[1]+d*Math.sin(e),t[2]+d*Math.cos(e)*Math.cos(a)];vp=mul(perspective(Math.PI/4,canvas.width/canvas.height,.1,150),lookAt(eye,t));
 const grid=[];for(let i=-10;i<=10;i++)grid.push(i,0,-10,i,0,10,-10,0,i,10,0,i);lines(grid,[.20,.29,.35]);lines([0,.01,0,4,.01,0],[.8,.34,.35]);lines([0,.01,0,0,3,0],[.36,.74,.43]);lines([0,.01,0,0,.01,4],[.34,.55,.87]);
 const state=evaluateProject(last.project,last.tick);if(last.options.preview){const {trackId,value}=last.options.preview;for(const replay of last.project.replays){const track=replay.tracks.find(x=>x.id===trackId);if(track&&state[replay.id]){if(track.owner==='form'){state[replay.id].parts??={};state[replay.id].parts[track.partId]??={};state[replay.id].parts[track.partId][track.propertyId]=value}else state[replay.id][track.propertyId]=value;break}}}
 if(labelLayer)labelLayer.replaceChildren();
 picks=[];for(const replay of last.project.replays){const s=state[replay.id];if(!s)continue;const root=s.parts?.root||{},isVfx=replay.fixtureId==='vfx';const size=Math.max(.1,Math.min(4,numeric(root['transform.scale'],1))),anchor=[numeric(root['anchor.x']),numeric(root['anchor.y']),numeric(root['anchor.z'])];
 // Local form translation is rotated with the Replay. Anchor is a scale pivot, not another position offset.
 let base=mul(mul(translate(numeric(s.x),numeric(s.y)+(root.action==='jump'?Math.abs(Math.sin(last.tick*Math.PI/20))*.7:0),numeric(s.z)),rotateY(rad(s.yaw))),translate(numeric(root['transform.x']),numeric(root['transform.y']),numeric(root['transform.z'])));
 base=mul(mul(mul(base,translate(...anchor)),scale(size,size,size)),translate(...anchor.map(v=>-v)));
 const [x,y,z]=transform(base,[0,0,0]),visible=root.visible!==false;
 const selected=last.options.selectedReplayId===replay.id;if(selected){const b=.85*size;lines([x-b,.025+y,z-b,x+b,.025+y,z-b,x+b,.025+y,z-b,x+b,.025+y,z+b,x+b,.025+y,z+b,x-b,.025+y,z+b,x-b,.025+y,z+b,x-b,.025+y,z-b],[.47,.84,1])}
 const clip=transform(vp,[x,y+size*(isVfx?.6:1.1),z]);if(clip[3]>0)picks.push({id:replay.id,x:clip[0]/clip[3],y:clip[1]/clip[3],depth:clip[3],radius:Math.min(.35,2.2*size/clip[3])});
 if(labelLayer){const labelPos=transform(vp,[x,y+size*(isVfx?1.0:2.35),z]),nx=labelPos[0]/labelPos[3],ny=labelPos[1]/labelPos[3];if(labelPos[3]>0&&Math.abs(nx)<1&&Math.abs(ny)<1){const cr=canvas.getBoundingClientRect(),pr=parent.getBoundingClientRect(),label=doc.createElement('span');label.textContent=replay.label+(numeric(s['hotbar.slot'])>0?' · ô '+numeric(s['hotbar.slot']):'')+(visible?'':' · ẩn');Object.assign(label.style,{position:'absolute',left:(cr.left-pr.left+(nx+1)*cr.width/2)+'px',top:(cr.top-pr.top+(1-ny)*cr.height/2)+'px',transform:'translate(-50%,-100%)',padding:'2px 6px',borderRadius:'4px',whiteSpace:'nowrap',font:'12px system-ui, sans-serif',color:'#e6f3ff',background:selected?'#245875':'#10202bdc',border:selected?'1px solid #8bd2ff':'1px solid #587083'});labelLayer.appendChild(label)}}
 if(!visible)continue;
 // These two world-space indicators expose the separate angle channels without combining them.
 if(numeric(s.bodyYaw)!==0){const a=rad(s.bodyYaw);lines([x,y+.04,z,x+Math.sin(a)*1.15,y+.04,z+Math.cos(a)*1.15],[.96,.67,.32])}
 if(numeric(s.headYaw)!==0){const a=rad(s.headYaw);lines([x,y+2*size,z,x+Math.sin(a)*.85,y+2*size,z+Math.cos(a)*.85],[.84,.56,.94])}
 if(!isVfx){const fixture=replay.fixtureId==='wood'?[.60,.40,.24]:[.27,.34,.45],tint=color(root['texture.color'],[1,1,1]),body=fixture.map((v,i)=>v*tint[i]),skin=[.81,.68,.56],dark=body.map(v=>v*.65),kind=String(root['model.kind']||'').toLowerCase(),sneak=enabled(s['states.sneaking']),sprint=enabled(s['states.sprinting']),action=String(root.action||s.action||'').toLowerCase();const torsoY=sneak?1.0:1.15,torso=mul(base,mul(translate(0,torsoY,0),rotateX(rad(sneak?18:0))));if(kind==='block'){box(base,0,.8,0,1,1.6,.65,body)}else{box(torso,0,0,0,.75,.85,.38,body);box(base,-.2,.35,0,.3,.7,.34,dark);box(base,.2,.35,0,.3,.7,.34,dark);
 let head=mul(torso,mul(translate(0,.68,0),mul(I(),rotateX(rad(s.pitch)+rad(root['pose.headX'])))));box(head,0,0,0,.56,.55,.5,skin);box(head,0,.19,-.02,.57,.16,.51,dark);
 const armAngle=rad(root['pose.armX'])+(sprint?-.5:0)+(action==='wave'?-.9:0);let arm=mul(torso,mul(translate(-.52,.3,0),rotateX(armAngle)));box(arm,0,-.32,0,.28,.68,.32,body);box(torso,.52,-.02,0,.28,.68,.32,body);
 if(enabled(s['equipment.head']))box(head,0,.3,0,.64,.15,.58,[.83,.68,.3]);
 const item=s['equipment.mainHand'];if(item==='sword'){box(arm,0,-.76,.12,.12,.55,.12,[.78,.79,.69]);box(arm,0,-.53,.12,.32,.07,.12,[.57,.44,.25])}else if(item==='pickaxe'){box(arm,0,-.76,.12,.09,.65,.09,[.57,.40,.22]);box(arm,0,-1.05,.12,.42,.09,.14,[.72,.76,.78])} 
 }
 }
 if(isVfx)box(base,0,.25,0,.3,.3,.3,[.58,.4,.8]);for(const part of Object.values(s.parts||{})){const effect=String(part['vfx.kind']??'none').toLowerCase();if(effect!=='none'&&effect!=='off'&&part.visible!==false){const [fx,fy,fz]=part===root?[x,y,z]:transform(base,[numeric(part['transform.x']),numeric(part['transform.y']),numeric(part['transform.z'])]),radius=Math.max(.1,Math.min(4,numeric(part['vfx.size'],1)))*size*(part===root?1:Math.max(.1,Math.min(4,numeric(part['transform.scale'],1)))),intensity=Math.max(0,Math.min(2,numeric(s['variable.intensity'],1)))/2,v=[];for(let i=0;i<32;i++){const a=i*Math.PI/16,b=(i+1)*Math.PI/16;v.push(fx+Math.cos(a)*radius,fy+.05,fz+Math.sin(a)*radius,fx+Math.cos(b)*radius,fy+.05,fz+Math.sin(b)*radius)}lines(v,[.65*intensity,.48*intensity,.95*intensity]);if(effect.includes('spark')||effect.includes('particle'))for(let i=0;i<6;i++){const a=i*Math.PI/3;box(translate(fx,fy,fz),Math.cos(a)*radius,.25+i*.15,Math.sin(a)*radius,.09,.09,.09,[.8,.65,1])}}}
 }
 }
 function render(project,tick,options={}){last={project,tick,options};drawFrame()}
 function setView(view){if(view==='front'){camera.azimuth=0;camera.elevation=.15}else if(view==='side'){camera.azimuth=Math.PI/2;camera.elevation=.15}else if(view==='top'){camera.azimuth=0;camera.elevation=Math.PI/2-.01}else if(view==='perspective'){camera={...initial,target:[...initial.target]}}drawFrame()}
 function resetView(){camera={...initial,target:[...initial.target]};drawFrame()}
 function down(e){if(e.button!==0&&e.button!==1&&e.button!==2)return;drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,pan:e.button!==0||e.shiftKey};canvas.setPointerCapture(e.pointerId)}
 function move(e){if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;if(drag.pan){const k=camera.distance*.0018;camera.target[0]-=dx*k*Math.cos(camera.azimuth);camera.target[2]+=dx*k*Math.sin(camera.azimuth);camera.target[1]+=dy*k}else{camera.azimuth-=dx*.008;camera.elevation=Math.max(-1.48,Math.min(1.56,camera.elevation+dy*.008))}drawFrame()}
 function up(e){if(!drag)return;if(!drag.pan&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<5){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*2-1,y=1-(e.clientY-r.top)/r.height*2,aspect=r.width/r.height;const found=picks.filter(p=>Math.hypot((x-p.x)*aspect,y-p.y)<Math.max(.07,p.radius)).sort((a,b)=>a.depth-b.depth)[0];if(found)onSelect(found.id)}drag=null}
 function wheel(e){e.preventDefault();camera.distance=Math.max(3,Math.min(60,camera.distance*Math.exp(e.deltaY*.001)));drawFrame()}
 function context(e){e.preventDefault()}
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('wheel',wheel,{passive:false});canvas.addEventListener('contextmenu',context);
 const observer=typeof ResizeObserver==='function'?new ResizeObserver(()=>drawFrame()):null;observer?.observe(canvas);
 function dispose(){observer?.disconnect();for(const [name,fn] of [['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['wheel',wheel],['contextmenu',context]])canvas.removeEventListener(name,fn);gl.deleteBuffer(cubeBuffer);gl.deleteBuffer(lineBuffer);gl.deleteProgram(program);labelLayer?.remove();last=null}
 return {render,setView,resetView,dispose};
}
