# Hợp đồng triển khai các đợt

Chủ dự án yêu cầu ngày 03/11/2026: huy động tiếp code toàn bộ các đợt. Yêu cầu này cho phép chuyển từ mockup sang triển khai. Không tự merge PR. Chưa có đặc tả mở rộng nào trên main ngoài SPEC v0.1; đợt 2/3 triển khai như chức năng trainer có nhãn simulator, không tuyên bố sao chép đầy đủ mod. Không bao gồm IK, vật lý, BOBJ, film BBS hoặc xuất video.

## File và API phối hợp

ES modules buildless, không phụ thuộc CDN/backend. `index.html` tại gốc, `app/styles.css`, `app/main.js`, `app/core.js`, `app/lessons.js`, `app/extensions.js`, `app/persistence.js`, `app/scene.js`. Node tests `.test.mjs`; package.json type module, `npm test` chạy node --test.

### Core (app/core.js)
- `createProject(durationTicks=100)` tạo project `schemaVersion:1`, `projectId`, `title`, `durationTicks`, `ticksPerSecond:20`, `updatedAt`, `replays`.
- Replay id `den`,`wood`,`vfx`, label `Đen`,`Gỗ Xưa`,`VFX minh họa`, fixtureId, baseTransform, parts[], tracks[]. Vị trí gốc den(-2,0,0), wood(4,0,3), vfx(0,0,1).
- Parts `root` và `aura` chỉ với vfx; `id,parentId,label,supportedProperties`.
- Track `{id,replayId,owner:'replay'|'form',partId:null|'root'|'aura',propertyId,valueType:'number'|'boolean'|'string',baseValue,keys:[]}`. Position/góc thuộc replay với partId null; visible thuộc form.
- Key `{id,tick,value,interpolationToNext:'linear'|'constant'|'sineInOut'}`.
- `getTrack(project,trackId)`, `findTrack(project,replayId,propertyId,partId=null)`; `evaluateTrack(track,tick)`; `evaluateProject(project,tick)` trả object map replayId → `{x,y,z,pitch,yaw,headYaw,bodyYaw,visible,parts:{root:{visible,...},aura:{visible,...}},...}`. Replay-owned property nằm top-level, form-owned property nằm parts[partId].
- `upsertKey(project,trackId,tick,value,interpolation='linear')`, `moveKey(project,trackId,keyId,tick)`, `deleteKey(project,trackId,keyId)` trả project mới, không mutate. Throw Error rõ khi sai/trùng tick move. `snapTick(tick,snap=true)` bước 1 hoặc 0.1. `clone(value)` deep copy.
- `History(project,limit=100)` với `.project`, `.commit(nextProject)`, `.undo()`, `.redo()` trả current project; `.canUndo/.canRedo` boolean.
- baseValue khi không key; giữ biên; key chính xác trả giá trị key; boolean/string luôn hold; không wrap góc tự động.

### Extensions (app/extensions.js)
- `extendProject(project)` immutable và idempotent, thêm track và supportedProperties cho đợt 2/3.
- `PROPERTY_GROUPS` array `{id,label,phase,description,properties:[{id,label,type:'number'|'boolean'|'string',owner:'replay'|'form',defaultValue,min?,max?,step?,options?:[{value,label}],description,evidence:'simulator'}]}`.
- Đợt 2 States/Hotbar/Equipment/Variables/Pose/Transform/Anchor. Đợt 3 Model/Texture/Actions/VFX. Chọn subset rõ ràng có tác động: states sneaking/sprinting, hotbar.slot, equipment.mainHand/head, variable.intensity, pose.headX/armX, transform.x/y/z/scale, anchor.x/y/z (root only), model.kind, texture.color, action, vfx.kind/size. Track dot names consistent.
- `getPropertyDefinition(propertyId)` và `describeExtensions()` cho help. Dữ liệu thuộc trainer, không chạy code/string action.
- `sampleExtendedState(project,tick)` optional nếu cần; scene nên đọc evaluateProject output.

### Lessons (app/lessons.js)
- `LESSONS` metadata `{id,title,phase,description,locked?,lockReason?,stages?:[{id,title}],steps:[],gameSteps:[],evidence}` gồm L01..L08 và lesson đợt 2/3 `E02`,`E03`.
- `createLessonProject(lessonId,stageId?)`, `createSolutionProject(lessonId,stageId?)` trả project đã extendProject.
- `gradeLesson(project,lessonId,context={stageId,selection:{replayId,partId,propertyId},playhead,identifiedRegions:[],mode:'guided'|'independent',events:[]})` → `{passed,rules:[{id,passed,message,current?,expected?}],locked?:true}`.
- L04 khóa chờ runtime; L01 cần chọn + nhận diện viewport/timeline/inspector. L03 stages x/y/z riêng. L05 context.events có các chuỗi `'interpolation:linear'`, `'interpolation:constant'`, `'interpolation:sineInOut'` để ghi thử nghiệm thực, không tự tính khi xem đáp án. L08 đề chữ, đáp án riêng.
- Chấm hành vi đúng + kênh khác giữ nguyên, không chỉ sample thưa; kiểm key và biên, không cho sai Replay/track đạt. Key thêm tương đương có thể chấp nhận.

### Persistence (app/persistence.js)
- `validateProject(input)` → `{valid,errors}` không mutate; kiểm giới hạn/schema/ownership/unique id/finite/types/duration/references.
- `parseProjectJSON(text)` trả project hoặc throw Error.
- `serializeProject(project)` trả JSON hoặc throw.
- `createPersistence({storage=globalThis.localStorage,namespace='bbs-trainer-v1',onConflict=()=>{}}={})` → `{load(key),save(key,value),remove(key),destroy()}`. load/save generic envelope project + progress; key lesson/sandbox riêng. save trả `{ok,error?,conflict?}`, load `{ok,value,error?}`; no throw on storage unavailable. revision conflict detect via storage event and lease comparison; không overwrite sau conflict.
- UI import validates trước replacement; export current backup; confirmation dialog trước import/reset. Progress mỗi bài independent/guided riêng, không đánh dấu khi xem đáp án.

### Scene (app/scene.js)
- `createScene(canvas,{onSelect=()=>{},onError=()=>{}}={})` → `{render(project,tick,{selectedReplayId,preview?,quality?}={}),setView('front'|'side'|'top'|'perspective'),resetView(),dispose()}`. preview optional `{trackId,value}` áp dụng visual only.
- Three.js r186 vendored, WebGL2 hoặc renderer phần mềm cùng scene graph; 3D block fixtures + grid/axes, orbit/pan/zoom. visible/position/góc preview (nhãn simulator góc pending), đợt 2/3 đọc properties từ evaluateProject. Render state deterministic. Renderer phần mềm có nhãn rõ; nếu cả GPU và Canvas2D đều lỗi thì báo không thể chạy 3D.
- `render` reads project only, no own mutable animation data. Scene may import core.evaluateProject and clone.

### UI (root index.html, app/styles.css, app/main.js)
Import các module API trên. Một project state + per-mode/lesson snapshots. Editor replay/part/group/track, pending preview không auto-key; inspector boolean/number/select theo definition; keyframe CRUD/move/collision; timeline ruler scrub + drag/playhead/zoom/snap; transport elapsed realtime20tps pause hidden; undo/redo; keyboard excludes form/dialog; scene render.
Lesson drawer phase tabs, steps, identify regions L01, guided/independent, show answer in isolated modal/project scene or explicit sample view (never overwrite), grade with messages, persist result invalidation. Sandbox namespace separate.
Save debounce+status; import validated and confirm; reset confirm; storage conflict banner reload/export actions. Responsive tabs, splitter if feasible. All buttons meaningful or disabled with reason; no false runtime claims.

## Kiểm tra
Mỗi module owner viết test ý nghĩa cho module mình; root tích hợp và browser QA theo Sites preview/CUA, không cài browser khác. Evidence/source docs giữ nguyên. Root cập nhật README/SPEC/REPORT sau kết quả thật.
