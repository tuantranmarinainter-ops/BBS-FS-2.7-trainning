import test from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS, createLessonProject, createSolutionProject, gradeLesson } from './lessons.js';
import { findTrack, upsertKey } from './core.js';
const ctx={selection:{replayId:'den',partId:'root',propertyId:'x'},playhead:0,identifiedRegions:['viewport','timeline','inspector'],events:['interpolation:linear','interpolation:constant','interpolation:sineInOut']};
const set=(p,r,prop,part,tick,value,interp='linear')=>upsertKey(p,findTrack(p,r,prop,part).id,tick,value,interp);
test('all unlocked solution fixtures pass, and empty work fails practical lessons',()=>{
 for(const lesson of LESSONS.filter(x=>!x.locked)) for(const stage of lesson.stages || [undefined]) {
   const c={...ctx,stageId:stage?.id};
   const result=gradeLesson(createSolutionProject(lesson.id,stage?.id),lesson.id,c);
   assert.equal(result.passed,true,`${lesson.id} ${stage?.id}: ${JSON.stringify(result.rules.filter(x=>!x.passed))}`);
   if(lesson.id!=='L01') assert.equal(gradeLesson(createLessonProject(lesson.id,stage?.id),lesson.id,c).passed,false,lesson.id);
 }
});
test('L01 requires real identification and selection; L05 requires trying all curves',()=>{
 assert.equal(gradeLesson(createLessonProject('L01'),'L01').passed,false);
 assert.equal(gradeLesson(createLessonProject('L01'),'L01',{...ctx,identifiedRegions:['viewport','timeline']}).passed,false);
 assert.equal(gradeLesson(createSolutionProject('L05'),'L05',{events:['interpolation:linear']}).passed,false);
});
test('wrong replay, unchanged axes, and false visibility are enforced',()=>{
 let p=createLessonProject('L02'); p=set(p,'wood','x',null,0,-2); p=set(p,'wood','x',null,40,2);
 assert.equal(gradeLesson(p,'L02',ctx).passed,false);
 p=createSolutionProject('L07'); p=set(p,'den','y',null,20,3); assert.equal(gradeLesson(p,'L07',ctx).passed,false);
 p=createSolutionProject('L06'); p=set(p,'wood','visible','root',30,true,'constant'); assert.equal(gradeLesson(p,'L06',ctx).passed,false);
});
test('L08 accepts equivalent redundant key and rejects between-key deviation',()=>{
 let p=createSolutionProject('L08'); p=set(p,'den','x',null,20,-0.5); assert.equal(gradeLesson(p,'L08',ctx).passed,true);
 p=set(p,'den','x',null,21,0.5); assert.equal(gradeLesson(p,'L08',ctx).passed,false);
});
test('L04 remains locked and cannot pass with a solution',()=>{
 const result=gradeLesson(createSolutionProject('L04'),'L04',ctx); assert.equal(result.locked,true); assert.equal(result.passed,false);
});
test('a copied project ID cannot conceal altered fixture or base metadata',()=>{
 for (const alter of [
  p=>p.replays[0].fixtureId='wood',
  p=>p.replays[0].baseTransform.x=999,
  p=>findTrack(p,'den','x').baseValue=999,
  p=>p.replays[0].parts[0].parentId='aura',
  p=>p.durationTicks=150
 ]) {
   const p=createSolutionProject('L02'); const id=p.projectId; alter(p); assert.equal(p.projectId,id);
   const result=gradeLesson(p,'L02',ctx); assert.equal(result.passed,false); assert.equal(result.rules.find(x=>x.id==='fixture').passed,false);
 }
});
test('a solution from a different L03 stage does not pass',()=>{
 const p=createSolutionProject('L03','x'); assert.equal(gradeLesson(p,'L03',{...ctx,stageId:'y'}).passed,false);
});
test('E03 uses renderable character color and enables its aura before resizing',()=>{
 const p=createSolutionProject('E03');
 assert.deepEqual(findTrack(p,'den','texture.color','root').keys.map(k=>k.value),['white','red']);
 assert.equal(findTrack(p,'vfx','vfx.kind','aura').keys[0].value,'glow');
 assert.deepEqual(findTrack(p,'vfx','vfx.size','aura').keys.map(k=>k.value),[1,2]);
 assert.equal(findTrack(p,'vfx','texture.color','root'),undefined);
});
test('each focused extension exercise rejects work on a different group',()=>{
 const ids=['E02-states','E02-hotbar','E02-equipment','E02-variables','E02-pose','E02-transform','E02-anchor','E03-model','E03-texture','E03-actions','E03-vfx'];
 for(const id of ids){
  let p=createLessonProject(id);
  // A plausible edit in a separate group cannot replace the requested target.
  p=id==='E02-pose' ? set(p,'den','transform.x','root',40,2) : set(p,'den','pose.headX','root',40,30);
  assert.equal(gradeLesson(p,id,ctx).passed,false,id);
  assert.equal(gradeLesson(createSolutionProject(id),id,ctx).passed,true,id);
 }
});
