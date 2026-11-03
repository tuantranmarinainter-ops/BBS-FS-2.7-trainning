import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorld,createScene} from './scene.js';
import {createProject,findTrack,upsertKey} from './core.js';
import {extendProject} from './extensions.js';

const set=(p,replay,property,part,tick,value,interpolation='linear')=>upsertKey(p,findTrack(p,replay,property,part).id,tick,value,interpolation);
const get=(scene,replay,name)=>scene.getObjectByName(`replay:${replay}`)?.getObjectByName(name);
const visible=o=>{for(let n=o;n;n=n.parent)if(!n.visible)return false;return !!o};
const snapshot=scene=>{const out=[];scene.getObjectByName('replays').traverse(o=>{out.push([o.name,o.visible,...o.matrixWorld.elements.map(v=>+v.toFixed(8)),o.material?.color?.getHex()??null])});return out};

test('actual Three scene evaluates keys deterministically and preview never edits the project',()=>{
 let p=extendProject(createProject());p=set(p,'den','x',null,0,-2);p=set(p,'den','x',null,40,2);const saved=structuredClone(p),world=createWorld();
 world.applyProject(p,20);assert.equal(world.scene.getObjectByName('replay:den').position.x,0);const first=snapshot(world.scene);
 world.applyProject(p,20);assert.deepEqual(snapshot(world.scene),first);
 world.applyProject(p,20,{preview:{trackId:findTrack(p,'den','x').id,value:7}});assert.equal(world.scene.getObjectByName('replay:den').position.x,7);assert.deepEqual(p,saved);
 world.applyProject(p,20);assert.deepEqual(snapshot(world.scene),first);world.dispose();
});
test('hidden child and root suppress descendants while preserving other replays',()=>{
 let p=extendProject(createProject());p=set(p,'vfx','vfx.kind','aura',0,'sparks');const world=createWorld();
 world.applyProject(p,0);let effect=get(world.scene,'vfx','vfx:sparks');assert.ok(effect&&visible(effect));assert.ok(visible(get(world.scene,'den','body')));
 world.applyProject(p,0,{preview:{trackId:findTrack(p,'vfx','visible','aura').id,value:false}});effect=get(world.scene,'vfx','vfx:sparks');assert.ok(effect&&!visible(effect));assert.ok(visible(get(world.scene,'vfx','vfx:fixture')));
 world.applyProject(p,0,{preview:{trackId:findTrack(p,'vfx','visible','root').id,value:false}});effect=get(world.scene,'vfx','vfx:sparks');assert.ok(effect&&!visible(effect));assert.ok(!visible(get(world.scene,'vfx','vfx:fixture')));assert.ok(visible(get(world.scene,'den','body')));world.dispose();
});
test('model, equipment, and pose alter real meshes or world transforms',()=>{
 const p=extendProject(createProject()),world=createWorld();const draw=(property,part,value)=>world.applyProject(p,0,{preview:{trackId:findTrack(p,'den',property,part).id,value}});
 draw('model.kind','root','figure');assert.ok(get(world.scene,'den','body')?.isMesh);assert.equal(get(world.scene,'den','model:block'),undefined);
 draw('model.kind','root','block');assert.ok(get(world.scene,'den','model:block')?.isMesh);assert.equal(get(world.scene,'den','body'),undefined);
 draw('equipment.mainHand',null,'sword');assert.ok(get(world.scene,'den','equipment:sword')?.isMesh);assert.equal(get(world.scene,'den','equipment:pickaxe'),undefined);
 draw('equipment.mainHand',null,'pickaxe');assert.ok(get(world.scene,'den','equipment:pickaxe')?.isMesh);assert.equal(get(world.scene,'den','equipment:sword'),undefined);
 draw('pose.armX','root',0);const before=[...get(world.scene,'den','arm:left:mesh').matrixWorld.elements];draw('pose.armX','root',45);assert.notDeepEqual([...get(world.scene,'den','arm:left:mesh').matrixWorld.elements],before);world.dispose();
});
test('rebuilding disposes replaced geometry and materials; world disposal releases remaining resources',()=>{
 const p=extendProject(createProject()),world=createWorld();world.applyProject(p,0);let mesh=get(world.scene,'den','body');let geometryDisposals=0,materialDisposals=0;mesh.geometry.addEventListener('dispose',()=>geometryDisposals++);mesh.material.addEventListener('dispose',()=>materialDisposals++);
 const count=world.scene.getObjectByName('replays').children.length;world.applyProject(p,0);assert.equal(geometryDisposals,1);assert.equal(materialDisposals,1);assert.equal(world.scene.getObjectByName('replays').children.length,count);
 mesh=get(world.scene,'den','body');let finalGeometry=0,finalMaterial=0;mesh.geometry.addEventListener('dispose',()=>finalGeometry++);mesh.material.addEventListener('dispose',()=>finalMaterial++);world.dispose();assert.equal(finalGeometry,1);assert.equal(finalMaterial,1);assert.equal(world.scene.children.length,0);
});
test('scene controls remove registered pointer and wheel handlers on dispose',()=>{
 const listeners=new Map(),ctx={};const canvas={width:300,height:200,getContext:type=>type==='2d'?ctx:null,addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:(name,fn)=>{if(listeners.get(name)===fn)listeners.delete(name)},getBoundingClientRect:()=>({width:300,height:200,left:0,top:0})};
 let status;const scene=createScene(canvas,{onStatus:s=>status=s});assert.equal(status.mode,'software');assert.ok(listeners.has('wheel'));assert.ok(listeners.has('pointerdown'));scene.setView('front');scene.resetView();scene.dispose();assert.equal(listeners.size,0);
});
