import test from 'node:test';
import assert from 'node:assert/strict';
import {createScene} from './scene.js';
import {createProject,findTrack} from './core.js';
import {extendProject} from './extensions.js';

function fixture(){
 let frame=[];
 const renderer={setClearColor(){},setSize(){},render(scene){frame=scene.children.filter(x=>x.visible).map(x=>({matrix:[...x.material.uniforms.m.value.elements],color:[...x.material.uniforms.c.value.toArray()],count:x.geometry.attributes.position?.count}))},dispose(){}};
 const canvas={width:800,height:500,getBoundingClientRect:()=>({width:800,height:500,left:0,top:0}),addEventListener(){},removeEventListener(){}};
 return {scene:createScene(canvas,{rendererFactory:()=>renderer}),frame:()=>JSON.stringify(frame)};
}
test('missing renderer gives error and safe no-op scene',()=>{let message='';const scene=createScene({}, {rendererFactory:()=>{throw Error('no gpu')},onError:m=>message=m});assert.match(message,/WebGL/);assert.doesNotThrow(()=>{scene.render();scene.setView('front');scene.resetView();scene.dispose()})});
test('Three scene is deterministic, non-mutating and previews are reversible',()=>{
 const {scene,frame}=fixture(),project=createProject(),snapshot=structuredClone(project);
 scene.render(project,0);const baseline=frame();assert.ok(JSON.parse(baseline).length>0);scene.render(project,0);assert.equal(frame(),baseline);
 const track=findTrack(project,'den','x');scene.render(project,0,{preview:{trackId:track.id,value:7}});assert.notEqual(frame(),baseline);
 assert.deepEqual(project,snapshot);scene.render(project,0);assert.equal(frame(),baseline);scene.dispose();
});
test('model, equipment and pose alter geometry or transforms',()=>{
 const {scene,frame}=fixture(),project=extendProject(createProject());
 const sample=(property,part,value)=>{scene.render(project,0,{preview:{trackId:findTrack(project,'den',property,part).id,value}});return frame()};
 assert.notEqual(sample('equipment.mainHand',null,'sword'),sample('equipment.mainHand',null,'pickaxe'));
 assert.notEqual(sample('model.kind','root','figure'),sample('model.kind','root','block'));
 assert.notEqual(sample('pose.armX','root',0),sample('pose.armX','root',45));scene.dispose();
});
test('view presets and disposal remain safe',()=>{const {scene}=fixture();scene.render(createProject(),0);for(const view of ['front','side','top','perspective'])scene.setView(view);scene.resetView();scene.dispose()});

test('hidden child and root remove the expected effect geometry',()=>{
 const {scene,frame}=fixture(),project=extendProject(createProject());
 const effect=findTrack(project,'vfx','vfx.kind','aura');
 // Set the value on a cloned project using preview; effect itself supplies geometry.
 const p=structuredClone(project), t=p.replays.flatMap(r=>r.tracks).find(x=>x.id===effect.id);
 t.baseValue='sparks';
 scene.render(p,0);const shown=JSON.parse(frame()).length;
 const child=findTrack(p,'vfx','visible','aura');
 scene.render(p,0,{preview:{trackId:child.id,value:false}});const hiddenChild=JSON.parse(frame()).length;
 const root=findTrack(p,'vfx','visible','root');
 scene.render(p,0,{preview:{trackId:root.id,value:false}});const hiddenRoot=JSON.parse(frame()).length;
 assert.ok(shown>hiddenChild);assert.ok(hiddenChild>hiddenRoot);scene.dispose();
});
