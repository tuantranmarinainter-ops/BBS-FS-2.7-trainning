import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS,createLessonProject,createSolutionProject,gradeLesson} from './lessons.js';
import {validateProject,parseProjectJSON,serializeProject,createPersistence} from './persistence.js';
import {createProject,findTrack,upsertKey} from './core.js';
import {extendProject} from './extensions.js';

test('every lesson fixture and solution survives strict persistence roundtrip',()=>{
 for(const lesson of LESSONS) for(const stage of lesson.stages?.length?lesson.stages:[{id:undefined}]){
  for(const factory of [createLessonProject,createSolutionProject]){
   const p=factory(lesson.id,stage.id),result=validateProject(p);
   assert.equal(result.valid,true,`${lesson.id}/${stage.id}: ${result.errors.join('; ')}`);
   assert.deepEqual(parseProjectJSON(serializeProject(p)),p);
  }
  if(!lesson.locked){
   const p=createSolutionProject(lesson.id,stage.id);
   const context={stageId:stage.id,playhead:0,selection:{replayId:'den',partId:'root',propertyId:'x'},identifiedRegions:['viewport','timeline','inspector'],events:['interpolation:linear','interpolation:constant','interpolation:sineInOut']};
   assert.equal(gradeLesson(parseProjectJSON(serializeProject(p)),lesson.id,context).passed,true,lesson.id);
  }
 }
});

test('saved sandbox and lesson states remain separate across restoration',()=>{
 const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const store=createPersistence({storage,namespace:'test-isolation'});
 const sandbox=extendProject(createProject());
 const lesson=createSolutionProject('L02');
 const t=findTrack(sandbox,'wood','x');
 const edited=upsertKey(sandbox,t.id,0,-7);
 assert.equal(store.save('sandbox',{project:edited}).ok,true);
 assert.equal(store.save('lesson:L02:default:guided',{project:lesson}).ok,true);
 assert.equal(findTrack(store.load('sandbox').value.project,'wood','x').keys[0].value,-7);
 assert.equal(findTrack(store.load('lesson:L02:default:guided').value.project,'wood','x').keys.length,0);
 store.destroy();
});
