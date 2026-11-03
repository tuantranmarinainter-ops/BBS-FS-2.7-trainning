import test from 'node:test';
import assert from 'node:assert/strict';
import {createScene} from './scene.js';
import {createProject,findTrack} from './core.js';

test('reports unavailable WebGL and returns safe controls',()=>{let message='';const scene=createScene({getContext:()=>null},{onError:m=>message=m});assert.match(message,/WebGL/);assert.doesNotThrow(()=>{scene.render();scene.setView('front');scene.resetView();scene.dispose()})});

test('drawing a preview does not mutate data and repeated frames are deterministic',()=>{
 const calls=[];const gl={ARRAY_BUFFER:1,STATIC_DRAW:2,DYNAMIC_DRAW:3,FLOAT:4,TRIANGLES:5,LINES:6,VERTEX_SHADER:7,FRAGMENT_SHADER:8,COMPILE_STATUS:9,LINK_STATUS:10,DEPTH_TEST:11,COLOR_BUFFER_BIT:1,DEPTH_BUFFER_BIT:2,
 createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>true,createProgram:()=>({}),attachShader(){},linkProgram(){},getProgramParameter:()=>true,getAttribLocation:()=>0,getUniformLocation:(_,name)=>name,createBuffer:()=>({}),bindBuffer(){},bufferData(){},viewport(){},enable(){},clearColor(){},clear(){calls.length=0},useProgram(){},vertexAttribPointer(){},enableVertexAttribArray(){},uniformMatrix4fv(_p,_t,m){calls.push([...m])},uniform3fv(){},drawArrays(){},deleteBuffer(){},deleteProgram(){}};
 const canvas={width:0,height:0,getContext:()=>gl,getBoundingClientRect:()=>({width:800,height:500,left:0,top:0}),addEventListener(){},removeEventListener(){}};
 const project=createProject(),snapshot=structuredClone(project),scene=createScene(canvas);scene.render(project,0);const original=JSON.stringify(calls);scene.render(project,0);assert.equal(JSON.stringify(calls),original);const track=findTrack(project,'den','x');scene.render(project,0,{preview:{trackId:track.id,value:7}});assert.notEqual(JSON.stringify(calls),original);assert.deepEqual(project,snapshot);scene.render(project,0);assert.equal(JSON.stringify(calls),original);scene.dispose();
});

test('nested visibility suppresses the effect and a hidden root suppresses its descendants',async()=>{
 const {extendProject}=await import('./extensions.js');
 const {upsertKey}=await import('./core.js');
 let count=0;const gl={ARRAY_BUFFER:1,STATIC_DRAW:2,DYNAMIC_DRAW:3,FLOAT:4,TRIANGLES:5,LINES:6,VERTEX_SHADER:7,FRAGMENT_SHADER:8,COMPILE_STATUS:9,LINK_STATUS:10,DEPTH_TEST:11,COLOR_BUFFER_BIT:1,DEPTH_BUFFER_BIT:2,createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>true,createProgram:()=>({}),attachShader(){},linkProgram(){},getProgramParameter:()=>true,getAttribLocation:()=>0,getUniformLocation:(_,n)=>n,createBuffer:()=>({}),bindBuffer(){},bufferData(){},viewport(){},enable(){},clearColor(){},clear(){count=0},useProgram(){},vertexAttribPointer(){},enableVertexAttribArray(){},uniformMatrix4fv(){},uniform3fv(){},drawArrays(){count++},deleteBuffer(){},deleteProgram(){}};
 const canvas={width:0,height:0,getContext:()=>gl,getBoundingClientRect:()=>({width:800,height:500,left:0,top:0}),addEventListener(){},removeEventListener(){}};
 const scene=createScene(canvas);let project=extendProject(createProject());
 const effect=findTrack(project,'vfx','vfx.kind','aura');project=upsertKey(project,effect.id,0,'sparks');scene.render(project,0);const shown=count;
 const child=findTrack(project,'vfx','visible','aura');scene.render(project,0,{preview:{trackId:child.id,value:false}});const hiddenChild=count;
 const root=findTrack(project,'vfx','visible','root');scene.render(project,0,{preview:{trackId:root.id,value:false}});const hiddenRoot=count;
 assert.ok(shown>hiddenChild,'visible child draws its effect');assert.ok(hiddenChild>hiddenRoot,'hidden root also removes its own fixture');
 scene.dispose();
});

test('model, pose and equipment selections produce distinct drawing commands',async()=>{
 const {extendProject}=await import('./extensions.js');let commands=[];
 const gl={ARRAY_BUFFER:1,STATIC_DRAW:2,DYNAMIC_DRAW:3,FLOAT:4,TRIANGLES:5,LINES:6,VERTEX_SHADER:7,FRAGMENT_SHADER:8,COMPILE_STATUS:9,LINK_STATUS:10,DEPTH_TEST:11,COLOR_BUFFER_BIT:1,DEPTH_BUFFER_BIT:2,createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>true,createProgram:()=>({}),attachShader(){},linkProgram(){},getProgramParameter:()=>true,getAttribLocation:()=>0,getUniformLocation:(_,n)=>n,createBuffer:()=>({}),bindBuffer(){},bufferData(){},viewport(){},enable(){},clearColor(){},clear(){commands=[]},useProgram(){},vertexAttribPointer(){},enableVertexAttribArray(){},uniformMatrix4fv(_p,_t,m){commands.push([...m])},uniform3fv(_p,c){commands.push([...c])},drawArrays(mode,_first,count){commands.push([mode,count])},deleteBuffer(){},deleteProgram(){}};
 const canvas={width:0,height:0,getContext:()=>gl,getBoundingClientRect:()=>({width:800,height:500,left:0,top:0}),addEventListener(){},removeEventListener(){}};const scene=createScene(canvas),project=extendProject(createProject());
 const frame=(property,part,value)=>{scene.render(project,0,{preview:{trackId:findTrack(project,'den',property,part).id,value}});return JSON.stringify(commands)};
 assert.notEqual(frame('equipment.mainHand',null,'sword'),frame('equipment.mainHand',null,'pickaxe'));
 assert.notEqual(frame('model.kind','root','figure'),frame('model.kind','root','block'));
 assert.notEqual(frame('pose.armX','root',0),frame('pose.armX','root',45));
 scene.dispose();
});
