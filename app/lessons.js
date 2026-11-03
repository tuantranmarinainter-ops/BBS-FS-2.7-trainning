import { createProject, findTrack, evaluateTrack, upsertKey } from './core.js';
import { extendProject } from './extensions.js';

const commonEvidence = ['simulator', 'source'];
export const LESSONS = [
  { id:'L01', title:'Nhận diện', phase:1, description:'Chọn Đen, root, track x và nhận diện ba vùng làm việc.', steps:['Chọn Đen, root và x.', 'Đưa playhead về tick 0.', 'Chỉ viewport, timeline và inspector.'], gameSteps:['Trong Film Editor, nhận diện Replay, track và vùng thời gian trước khi chỉnh.'], evidence:commonEvidence },
  { id:'L02', title:'Hai key', phase:1, description:'Cho Đen di chuyển theo trục X từ -2 đến 2 trong 40 tick.', steps:['Đặt key x tại 0 = -2 và 40 = 2.', 'Chọn Linear và kiểm tra tick 20.'], gameSteps:['Chọn Replay và track vị trí, rồi đặt key tại các thời điểm muốn dùng.'], evidence:commonEvidence },
  { id:'L03', title:'Ba trục', phase:1, description:'Luyện từng trục trong ba cảnh riêng.', stages:[{id:'x',title:'Trục X'},{id:'y',title:'Trục Y'},{id:'z',title:'Trục Z'}], steps:['Chọn giai đoạn X, Y hoặc Z.', 'X: tick 0 = -2, 40 = 2. Y: tick 0 = 0, 30 = 3, 60 = 0. Z: tick 0 = 0, 40 = 3.', 'Dùng Linear và giữ các trục khác.'], gameSteps:['Phân biệt trục thế giới với hướng trên màn hình khi đổi camera.'], evidence:commonEvidence },
  { id:'L04', title:'Góc quay', phase:1, description:'So sánh pitch, yaw, headYaw và bodyYaw.', locked:true, lockReason:'Chờ kiểm thử fixture góc trong BBS FS 2.7 (V02).', steps:['Bài sẽ mở khi fixture góc được xác minh.'], gameSteps:['Ghi lại loại form và rig khi đối chiếu góc trong game.'], evidence:['source','pending'] },
  { id:'L05', title:'Nội suy', phase:1, description:'Thử Linear, Constant và Sine In/Out, sau đó hoàn tất bằng Sine In/Out.', steps:['Đen.x: tick 0 = -2, tick 60 = 4.', 'Thử từng kiểu nội suy, rồi chọn Sine In/Out.'], gameSteps:['Quan sát chuyển động giữa các key, không chỉ tại hai đầu.'], evidence:commonEvidence },
  { id:'L06', title:'Ẩn/hiện', phase:1, description:'Ẩn Gỗ Xưa từ tick 30 đến trước tick 60.', steps:['Chọn Gỗ Xưa / root / visible.', 'Đặt true tại 0, false tại 30 và true tại 60.'], gameSteps:['Chọn đúng form và kiểm tra trước, tại và sau mốc đổi trạng thái.'], evidence:commonEvidence },
  { id:'L07', title:'Hai nhân vật', phase:1, description:'Di chuyển Đen theo X và Gỗ Xưa theo Z cùng lúc.', steps:['Đen.x: 0 = -2, 40 = 1.', 'Gỗ Xưa.z: 0 = 3, 40 = 1.', 'Giữ các trục còn lại.'], gameSteps:['Kiểm tra tên Replay trước mỗi lần đặt key.'], evidence:commonEvidence },
  { id:'L08', title:'Shot tự làm', phase:1, description:'Trong 120 tick, Đen đi từ X = -2 đến X = 1 trong 40 tick rồi đứng yên. Gỗ Xưa nhảy lên Y = 2 ở tick 60, về Y = 0 ở tick 80; ẩn tại tick 90 và hiện lại ở tick 110.', steps:['Tự dựng shot theo đề; chuyển động vị trí tuyến tính.', 'Kiểm tra các đoạn giữ và thời điểm ẩn/hiện.'], gameSteps:['Dựng shot bằng các kênh riêng và kiểm tra lại toàn bộ timeline.'], evidence:commonEvidence },
  { id:'E02', title:'Trạng thái và tư thế', phase:2, description:'Tập phối hợp trạng thái và tư thế của Đen trong trainer.', steps:['Đặt states.sneaking của Đen: false tại tick 0, true tại tick 20 và false tại tick 60.', 'Đặt pose.headX từ 0 tại tick 0 đến 30 tại tick 40.'], gameSteps:['Tìm các nhóm States và Pose phù hợp với form đang dùng.'], evidence:['simulator'] },
  { id:'E03', title:'Màu và hiệu ứng', phase:3, description:'Dựng hiệu ứng minh họa với màu và kích thước thay đổi theo thời gian.', steps:['Đặt texture.color của Đen / root là white tại tick 0 và red tại tick 50.', 'Đặt vfx.kind của VFX / aura là glow tại tick 0, rồi tăng vfx.size từ 1 tại tick 0 lên 2 tại tick 50.'], gameSteps:['Đối chiếu loại form và tài sản trước khi áp dụng trong game.'], evidence:['simulator'] }
];
// Focused extension drills are trainer conventions; they do not claim game parity.
const extensionDrills = [
 ['E02-states','States',2,'Đen / Replay: states.sneaking false tại tick 0, true tại 20 và false tại 60.'],
 ['E02-hotbar','Hotbar',2,'Đen / Replay: hotbar.slot 0 tại tick 0 và 3 tại tick 40.'],
 ['E02-equipment','Equipment',2,'Đen / Replay: equipment.mainHand none tại tick 0 và sword tại tick 40.'],
 ['E02-variables','Variables',2,'VFX / aura: vfx.kind glow tại tick 0. VFX / Replay: variable.intensity 1 tại tick 0, 2 tại tick 40 (Linear).'],
 ['E02-pose','Pose',2,'Đen / root: pose.headX 0 tại tick 0 và 30 tại tick 40 (Linear).'],
 ['E02-transform','Transform',2,'Đen / root: transform.x 0 tại tick 0 và 2 tại tick 40 (Linear).'],
 ['E02-anchor','Anchor',2,'Đen / root: transform.scale 2 tại tick 0; anchor.x 0 tại tick 0 và 1 tại tick 40 (Linear). Quan sát điểm neo khi phóng to.'],
 ['E03-model','Model',3,'Đen / root: model.kind figure tại tick 0 và block tại tick 40.'],
 ['E03-texture','Texture',3,'Đen / root: texture.color white tại tick 0 và red tại tick 40.'],
 ['E03-actions','Actions',3,'Đen / root: action idle tại tick 0 và jump tại tick 40.'],
 ['E03-vfx','VFX',3,'VFX / aura: vfx.kind glow tại tick 0; vfx.size 1 tại tick 0 và 2 tại tick 40 (Linear).']
];
for (const [id,title,phase,target] of extensionDrills) LESSONS.push({
 id,title:`Thực hành ${title}`,phase,description:target,steps:[target,'Giữ các thuộc tính khác của cảnh.'],
 gameSteps:[`Đây là mô phỏng gần đúng trong trainer; khi áp dụng ${title} trong BBS FS, kiểm tra lại form, lựa chọn và hành vi trong game.`],evidence:['simulator']
});
const FIXTURES = {
 L02:[['den','x',null,[[0,-2],[40,2]],'linear']],
 L03:{x:[['den','x',null,[[0,-2],[40,2]],'linear']],y:[['den','y',null,[[0,0],[30,3],[60,0]],'linear']],z:[['den','z',null,[[0,0],[40,3]],'linear']]},
 L05:[['den','x',null,[[0,-2],[60,4]],'sineInOut']],
 L06:[['wood','visible','root',[[0,true],[30,false],[60,true]],'constant']],
 L07:[['den','x',null,[[0,-2],[40,1]],'linear'],['wood','z',null,[[0,3],[40,1]],'linear']],
 L08:[['den','x',null,[[0,-2],[40,1],[120,1]],'linear'],['wood','y',null,[[0,0],[40,0],[60,2],[80,0],[120,0]],'linear'],['wood','visible','root',[[0,true],[90,false],[110,true]],'constant']],
 E02:[['den','states.sneaking',null,[[0,false],[20,true],[60,false]],'constant'],['den','pose.headX','root',[[0,0],[40,30]],'linear']],
 E03:[['den','texture.color','root',[[0,'white'],[50,'red']],'constant'],['vfx','vfx.kind','aura',[[0,'glow']],'constant'],['vfx','vfx.size','aura',[[0,1],[50,2]],'linear']],
 'E02-states':[['den','states.sneaking',null,[[0,false],[20,true],[60,false]],'constant']],
 'E02-hotbar':[['den','hotbar.slot',null,[[0,0],[40,3]],'constant']],
 'E02-equipment':[['den','equipment.mainHand',null,[[0,'none'],[40,'sword']],'constant']],
 'E02-variables':[['vfx','vfx.kind','aura',[[0,'glow']],'constant'],['vfx','variable.intensity',null,[[0,1],[40,2]],'linear']],
 'E02-pose':[['den','pose.headX','root',[[0,0],[40,30]],'linear']],
 'E02-transform':[['den','transform.x','root',[[0,0],[40,2]],'linear']],
 'E02-anchor':[['den','transform.scale','root',[[0,2]],'constant'],['den','anchor.x','root',[[0,0],[40,1]],'linear']],
 'E03-model':[['den','model.kind','root',[[0,'figure'],[40,'block']],'constant']],
 'E03-texture':[['den','texture.color','root',[[0,'white'],[40,'red']],'constant']],
 'E03-actions':[['den','action','root',[[0,'idle'],[40,'jump']],'constant']],
 'E03-vfx':[['vfx','vfx.kind','aura',[[0,'glow']],'constant'],['vfx','vfx.size','aura',[[0,1],[40,2]],'linear']]
};
const lessonById = id => { const lesson=LESSONS.find(l=>l.id===id); if (!lesson) throw new Error(`Bài học không tồn tại: ${id}`); return lesson; };
const specsFor = (id,stageId) => id==='L03' ? FIXTURES.L03[stageId || 'x'] : (FIXTURES[id] || []);
export function createLessonProject(lessonId,stageId) {
  lessonById(lessonId);
  if (lessonId==='L03' && !FIXTURES.L03[stageId || 'x']) throw new Error(`Giai đoạn không tồn tại: ${stageId}`);
  const project=extendProject(createProject(lessonId==='L08' ? 120 : 100));
  project.title=`Bài ${lessonId}${lessonId==='L03' ? ` · ${stageId || 'x'}` : ''}`;
  return project;
}
export function createSolutionProject(lessonId,stageId) {
  let project=createLessonProject(lessonId,stageId);
  for (const [replay,property,part,keys,interp] of specsFor(lessonId,stageId)) {
    const track=findTrack(project,replay,property,part);
    if (!track) throw new Error(`Fixture thiếu track ${replay}/${part ?? 'replay'}/${property}`);
    for (const [tick,value] of keys) project=upsertKey(project,track.id,tick,value,interp);
  }
  return project;
}
const equalValue=(a,b)=>typeof b==='number' ? typeof a==='number' && Math.abs(a-b)<=0.01 : a===b;
const rule=(id,passed,message,current,expected)=>({id,passed,message,...(current!==undefined?{current}:{}),...(expected!==undefined?{expected}:{})});
const describe=(r,p,part)=>`${r === 'den'?'Đen':r === 'wood'?'Gỗ Xưa':'VFX'} / ${part ?? 'Replay'} / ${p}`;
// Compare at every key boundary and multiple interior points, including either side of steps.
function compareCurves(actual,expected,duration) {
 const knots=[...new Set([0,duration,...actual.keys.map(k=>k.tick),...expected.keys.map(k=>k.tick)].filter(t=>t>=0&&t<=duration))].sort((a,b)=>a-b);
 const ticks=[...knots];
 for(let i=1;i<knots.length;i++) { const a=knots[i-1],b=knots[i],d=b-a; for(const u of [0.001,0.25,0.5,0.75,0.999]) ticks.push(a+d*u); }
 for(const tick of ticks.sort((a,b)=>a-b)) { const a=evaluateTrack(actual,tick), b=evaluateTrack(expected,tick); if(!equalValue(a,b)) return {tick,current:a,expected:b}; }
 return null;
}
export function gradeLesson(project,lessonId,context={}) {
 const lesson=lessonById(lessonId);
 if(lesson.locked) return {passed:false,locked:true,rules:[rule('locked',false,lesson.lockReason)]};
 const stageId=context.stageId || 'x', specs=specsFor(lessonId,stageId);
 if(!specs) throw new Error(`Giai đoạn không tồn tại: ${stageId}`);
 const solution=createSolutionProject(lessonId,stageId), rules=[];
 // Lesson fixtures are part of the grading contract; an imported project can reuse
 // a projectId while changing render fixture, base transform, or track defaults.
 const fixtureErrors=[];
 if(project.durationTicks!==solution.durationTicks || project.ticksPerSecond!==solution.ticksPerSecond) fixtureErrors.push('thời lượng hoặc tốc độ tick');
 if(!Array.isArray(project.replays) || project.replays.length!==solution.replays.length) fixtureErrors.push('danh sách Replay');
 for(const expectedReplay of solution.replays) {
   const actualReplay=project.replays?.find(r=>r.id===expectedReplay.id);
   if(!actualReplay) { fixtureErrors.push(`Replay ${expectedReplay.id}`); continue; }
   if(actualReplay.fixtureId!==expectedReplay.fixtureId) fixtureErrors.push(`fixture ${expectedReplay.id}`);
   if(Object.entries(expectedReplay.baseTransform).some(([k,v])=>actualReplay.baseTransform?.[k]!==v)) fixtureErrors.push(`vị trí/góc gốc ${expectedReplay.id}`);
   if(!Array.isArray(actualReplay.parts) || actualReplay.parts.length!==expectedReplay.parts.length || expectedReplay.parts.some(p=>{
     const a=actualReplay.parts?.find(q=>q.id===p.id);
     return !a || a.parentId!==p.parentId || !Array.isArray(a.supportedProperties) || a.supportedProperties.length!==p.supportedProperties.length || p.supportedProperties.some(x=>!a.supportedProperties.includes(x));
   })) fixtureErrors.push(`cấu trúc form ${expectedReplay.id}`);
   if(!Array.isArray(actualReplay.tracks) || actualReplay.tracks.length!==expectedReplay.tracks.length) fixtureErrors.push(`danh sách track ${expectedReplay.id}`);
   else for(const expectedTrack of expectedReplay.tracks) {
     const a=actualReplay.tracks.find(t=>t.propertyId===expectedTrack.propertyId && t.partId===expectedTrack.partId);
     if(!a || a.owner!==expectedTrack.owner || a.replayId!==expectedReplay.id || a.valueType!==expectedTrack.valueType || a.baseValue!==expectedTrack.baseValue) { fixtureErrors.push(`track gốc ${expectedTrack.id}`); break; }
   }
 }
 rules.push(rule('fixture',fixtureErrors.length===0,fixtureErrors.length?`Dữ liệu bài không khớp fixture: ${fixtureErrors.join(', ')}. Hãy đặt lại bài.`:'Fixture bài học hợp lệ.'));
 if(fixtureErrors.length) return {passed:false,rules};
 if(lessonId==='L01') {
   const s=context.selection || {}; const ok=s.replayId==='den' && s.partId==='root' && s.propertyId==='x';
   rules.push(rule('selection',ok,ok?'Đã chọn Đen / root / x.':'Chọn Đen / root / x.',s,{replayId:'den',partId:'root',propertyId:'x'}));
   const tick=context.playhead; rules.push(rule('playhead',typeof tick==='number' && Math.abs(tick)<=0.05,'Đưa playhead về tick 0.',tick,0));
   for(const region of ['viewport','timeline','inspector']) rules.push(rule(`region:${region}`,(context.identifiedRegions || []).includes(region),`Nhận diện vùng ${region}.`));
 }
 if(lessonId==='L05') for(const interp of ['linear','constant','sineInOut']) rules.push(rule(`try:${interp}`,(context.events || []).includes(`interpolation:${interp}`),`Thử nội suy ${interp} trên timeline.`));
 for(const [replay,property,part,keys,interp] of specs) {
   const actual=findTrack(project,replay,property,part), label=describe(replay,property,part);
   const ownership=actual && actual.replayId===replay && actual.owner===(part===null?'replay':'form') && actual.partId===part;
   if(!ownership) { rules.push(rule(`track:${replay}:${part}:${property}`,false,`Thiếu track đúng đối tượng: ${label}.`)); continue; }
   if(lessonId!=='L08') for(const [tick,value] of keys) {
     const key=actual.keys.find(k=>Math.abs(k.tick-tick)<=0.05);
     const ok=!!key && equalValue(key.value,value);
     rules.push(rule(`key:${replay}:${property}:${tick}`,ok,ok?`${label}, tick ${tick}: đúng giá trị.`:`${label}, tick ${tick}: cần key giá trị ${value}.`,key?.value,value));
     if(key && actual.valueType==='number' && tick!==keys.at(-1)[0]) rules.push(rule(`interp:${replay}:${property}:${tick}`,key.interpolationToNext===interp,`${label}, tick ${tick}: cần nội suy ${interp}.`,key.interpolationToNext,interp));
   }
 }
 // Compare every expected track, including unmodified tracks, to catch changes to other objects or axes.
 for(const replay of solution.replays) for(const expected of replay.tracks) {
   const actual=findTrack(project,replay.id,expected.propertyId,expected.partId);
   if(!actual || actual.owner!==expected.owner || actual.replayId!==replay.id) { rules.push(rule(`owner:${expected.id}`,false,`Thiếu hoặc sai chủ sở hữu track ${expected.id}.`)); continue; }
   const mismatch=compareCurves(actual,expected,solution.durationTicks);
   rules.push(rule(`curve:${expected.id}`,!mismatch,mismatch?`${describe(replay.id,expected.propertyId,expected.partId)}, tick ${Number(mismatch.tick.toFixed(3))}: giá trị ${mismatch.current}, cần ${mismatch.expected}.`:`${describe(replay.id,expected.propertyId,expected.partId)}: đúng diễn biến.`,mismatch?.current,mismatch?.expected));
 }
 return {passed:rules.length>0 && rules.every(r=>r.passed),rules};
}
