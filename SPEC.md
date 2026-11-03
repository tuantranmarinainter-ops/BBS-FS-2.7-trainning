# ĐẶC TẢ TỔNG THỂ — BBS FS 2.7 Training
Phiên bản: 0.3 · Ngày: 03/11/2026 · Trạng thái: đề xuất triển khai, chưa nghiệm thu sản phẩm.

## 0. Ưu tiên chủ dự án — hiểu giao diện đã chụp trước
Yêu cầu bổ sung ngày 03/11/2026: “Ưu tiên tôi hiểu được các phần đã chụp, sau đó làm tiếp”.
Đây là thứ tự ưu tiên cao hơn việc phủ nhanh toàn bộ registry. Bản all vẫn là lộ trình, không phải yêu cầu dồn mọi chức năng nâng cao vào màn hình học đầu tiên.

### 0.1 Vòng học ưu tiên U0
1. Đối chiếu ảnh đã chụp, đánh số từng vùng/nút/nhóm track nhìn thấy.
2. Giải thích mỗi vùng bằng tiếng Việt đơn giản: tên English → dùng để làm gì → khi nào dùng → chọn đúng đối tượng nào.
3. Làm một ví dụ ngắn cho từng phần: chọn → đổi giá trị → đặt key nếu cần → phát xem → nhận biết kết quả.
4. Cho người học tự làm lại và hỏi/kiểm tra một kết quả cụ thể; phản hồi lỗi chọn nhầm Replay/track/tick.
5. Chỉ chuyển sang phần kế tiếp sau khi người học xác nhận đã hiểu hoặc hoàn thành thao tác mẫu; người học vẫn có thể chủ động bỏ qua/quay lại.
6. Hoàn thành các phần trong ảnh trước khi mở bài nâng cao ngoài ảnh. Không tự diễn giải im lặng là người học đã hiểu.

Vòng học không tự chặn truy cập Tự do; đây là ưu tiên hướng dẫn và triển khai, không phải khóa bài theo điểm.
Mỗi mục hướng dẫn tối đa một ý chính và một ví dụ ban đầu; giữ inspector và vị trí UI gốc để học xong nhận ra ngay trong game.
Các chức năng thấy trong ảnh nhưng thuộc đợt sau được ưu tiên giải thích/khảo sát trước; logic triển khai vẫn theo dependency để tránh mô phỏng sai.

### 0.2 Danh mục ảnh và giới hạn
Tài liệu trước ghi hai tên ảnh: Capture_20261103_181930_652.png và Capture_20261103_181904_899.png; file ảnh chưa có trong repo.
Không coi tên file hoặc mô tả v0.2 là đã nhìn lại ảnh. Trước khi gắn số vùng/toạ độ hoặc viết “nút trong ảnh của bạn”, cần đọc đúng ảnh gốc.
Các vùng ưu tiên dự kiến từ mô tả đã lưu: Replay list, Body parts, viewport, timeline/keyframe, inspector và các nhóm thuộc tính nhìn thấy. Danh sách chính xác được chốt theo ảnh, không mở rộng mặc định ra cả bảy workspace.
Nếu cần ảnh để bước tiếp theo chính xác, đề nghị người dùng gửi lại hai ảnh; không yêu cầu lại khi ảnh đã có và đọc được.

### 0.3 Điều kiện chuyển sang lộ trình đầy đủ
Mỗi vùng đã chụp có checklist: nhận ra vị trí, nói được công dụng, làm được ví dụ, biết một lỗi thường gặp.
Trạng thái: chưa giải thích / đã giải thích / đã thực hành / người dùng xác nhận hiểu.
Chỉ sau khi hoàn tất vòng này hoặc người dùng chủ động yêu cầu mới ưu tiên các phần ngoài ảnh. Không tự code toàn bộ tám đợt chỉ vì đặc tả đã tồn tại.

## 1. Quyết định phạm vi và nguồn chuẩn
Yêu cầu mới: đặc tả toàn bộ nhóm chức năng và tận dụng tối đa giao diện/chức năng repo BBS FS 2.7.
v0.3 thay thế v0.2 làm đặc tả tổng thể; mở rộng từ 3 lên 8 đợt. Bản cũ được lưu ở [SPEC-v0.2.md](docs/history/SPEC-v0.2.md) để tra fixture/bài tập nền, không còn quyết định giới hạn phạm vi.
Các giới hạn “không có camera/IK/BOBJ” của v0.2 chỉ còn là giới hạn các đợt đầu, không phải loại bỏ khỏi lộ trình toàn bộ.

Nguồn chính: Wemppy4/bbs-fs tại commit f48c4fe341df4531f78428ed22bba93d5e6073df.
gradle.properties tại commit này ghi mod 2.7/Minecraft 1.20.1; chưa xác nhận JAR phát hành trùng hoàn toàn.
[Danh mục nguồn](docs/BBS27-SOURCE-MAP.md) liên kết các lớp đã đọc và toàn bộ registry tích hợp: 14 forms, 19 camera/media clips, 12 action clips.
Phạm vi “all” bao phủ bảy workspace tích hợp, Film/Replay/Forms/Camera/Actions/Keyframes và workflow tài sản–bản ghi–xuất/nhập. Add-on tùy ý và mọi tổ hợp mod không thể coi là mặc nhiên được hỗ trợ; phải đi qua capability registry.
Không tuyên bố đã khảo sát hết từng field kế thừa, từng setting hoặc thuật toán chỉ vì đã đọc registry.

Mỗi tính năng có trạng thái sản phẩm planned/implemented/tested/accepted, và bằng chứng độc lập source/docs/runtime/simulator/pending.
Tất cả tính năng bổ sung trong tài liệu hiện planned; tất cả kiểm thử Minecraft hiện NOT_RUN.
Mốc mã nguồn, label và ảnh runtime phải được ghi cùng nhau trong hồ sơ parity; không dùng ảnh phiên bản khác làm chuẩn.

### 1.1 Những sửa đổi quan trọng so với v0.2
| Nội dung cũ | Quy định mới |
|---|---|
| Actions được mô tả như clip wave animation | Tách Film Action events và Model ActionsConfig/animation; clip mẫu wave chỉ là bài animation |
| Hotbar chủ yếu là chọn slot, inventory cấu hình tĩnh | Chín ItemStack channels có thể thay đổi theo tick, cộng selected_slot; equipment đủ offhand/head/chest/legs/feet theo source |
| Variables là biến energy tự đặt | Tab Variables gốc có stick/trigger/extra channels; energy chỉ là bài simulator phụ |
| States neutral/crouch | Chỉ là fixture minh họa; danh mục States gốc theo EntityState và kênh replay thực |
| Model/Texture chỉ đổi cấu hình tĩnh | Đợt đầu cho tĩnh; phạm vi đầy đủ có typed property tracks theo khả năng thật và kiểm tra tương thích |
| Anchor chỉ gắn tĩnh, không cho prop có key | Giới hạn bài cơ bản; đợt nâng cao phải theo source anchor track, offset và target space |
| Cấm overlap mọi action | Chỉ áp clip animation mẫu cũ; Film events và layer camera dùng chính sách theo từng loại |
| Scale dương và Euler quy ước trainer | Là giới hạn rig-lite; profile parity phải port transform/rotation thật, không lấy quy ước đó làm chuẩn |
| Camera, IK, physics, audio, BOBJ ngoài phạm vi | Đưa vào đợt 4–8 với điều kiện nguồn, adapter và test tương ứng |

### 1.2 Ba mức thực thi
- Web parity: thao tác và kết quả đã có evaluator tương đương source, được test fixture. Vẫn cần runtime để tuyên bố tương đương JAR.
- Web simulator: mô phỏng world/entity/render đơn giản; hiện nhãn và mô tả phần khác biệt.
- Native/adapter: tác vụ cần game, file codec hoặc backend; web chuẩn bị payload, hướng dẫn và đọc kết quả. Không báo thành công khi chưa có receipt.
Chế độ Học/Tự do là chế độ UX, không thay đổi mức bằng chứng. Không trộn evaluator parity và simulator trong cùng bài mà không ghi rõ.

## 2. Giao diện tận dụng tối đa BBS FS
### 2.1 Khung ứng dụng
Bám UIDashboard và UIFilmPanel: taskbar, danh sách tài liệu, viewport, editor/timeline, inspector; không thay bằng dashboard thẻ lớn xa giao diện gốc.
Bảy workspace: Morphing, Film, Model blocks, Particles, Model editor, Textures, Audio. Settings/Selectors/Utility là lối mở riêng; khu add-on hiển thị theo đăng ký.
- Taskbar có vị trí trên/dưới/trái/phải và pin; lưu theo người dùng trên thiết bị.
- Film có Camera Editor, Replay Editor và Actions mode riêng; chuyển panel giữ playhead, selection hợp lệ và viewport.
- Replay Editor giữ All tracks và thứ tự Replay → Form → Pose → IK → Physics; phần không hỗ trợ vẫn có lời giải thích.
- Replay: Position, States, Hotbar, Equipment, Variables, Velocity theo collector/label nguồn; không tự sắp lại theo sở thích người làm web.
- Body parts/form tree tách với pose bone tree; hiển thị đường dẫn đầy đủ khi tên node trùng.
- Inspector theo kiểu: number, boolean, enum, item, transform, pose, anchor, material, IK, physics, resource.
- Giao diện nền tối, icon/tooltip/selection sát nguồn; English mặc định kèm phụ đề tiếng Việt. Tùy chọn English, Việt song ngữ; ID không đổi theo ngôn ngữ.
- Help/lesson là drawer bổ sung; không đẩy Replay list hoặc thay inspector của giao diện gốc.

### 2.2 Dock, layout và điều hướng
Cho kéo dock, chia vùng, đổi tab, khóa bố cục, maximize panel, reset mặc định, lưu/load preset layout và Undo layout riêng.
Layout undo không trộn với Undo dữ liệu; đổi layout không làm bài cần chấm lại.
Màn hình 1366×768, 1920×1080 và 1024×768 là baseline; màn hình hẹp dùng tab/drawer nhưng giữ topology lựa chọn.
Touch có menu thao tác thay right-click, không tuyên bố mọi gesture mobile giống game.
Panel ẩn phải mở lại được qua menu; preset lỗi khôi phục mặc định, không mất project.
Tour anchor định danh ổn định: film.preview, film.editors, film.timeline, film.properties, film.export theo source nơi đã có; anchor mới đặt namespace trainer.

### 2.3 Chuẩn giao diện và kiểm tra
Mỗi màn hình cần ảnh baseline cùng phiên bản, danh mục widget, labelKey, icon, commandId, enabledCondition và tooltip.
So sánh cấu trúc/nhãn trước, sau đó overlay screenshot ở cùng resolution/UI scale. Sai biệt có giải trình trong UI-PARITY report.
Chưa có ảnh gốc trong repo: phải bổ sung ảnh runtime trước khi nghiệm thu độ giống; không gọi mockup tự dựng là ảnh game.
Không để button giả: nếu pending thì disable với lý do; tính năng native mở workflow native rõ ràng.
Vùng bấm tối thiểu 32 px, focus thấy được, trục có chữ X/Y/Z, không chỉ dùng màu.
Shortcut lấy Keys.java và điều kiện kích hoạt tại call site; xử lý xung đột browser bằng remap có thông báo.
Ví dụ source mặc định Space, Left/Right một tick, Ctrl+Z/Ctrl+Y, Ctrl+C/V; chỉ bắt trong editor hợp lệ, không bắt khi nhập text/dialog.
Có màn hình tra shortcut, restore default, phát hiện trùng; preset BBS-source và Web-safe tách biệt.

## 3. Quản lý Film, Replay và cảnh
### 3.1 Film
New/open/save/save-as/rename/duplicate/delete; tìm kiếm, thư mục, recent, nhiều tab và unsaved indicator.
Metadata gồm title/description, createdAt, thời gian làm việc; trainer ID ổn định khác tên file.
Duplicate deep-copy tạo ID mới và remap mọi internal reference; shared asset tham chiếu theo hash, không nhân binary vô ích.
Delete có xác nhận và cơ chế khôi phục bản sao gần nhất. Rename không phá asset reference.
Film details và player settings hỗ trợ các field source hp/hunger/xp/mobRecordingRadius qua simulator/native đúng nhãn.
Đổi duration nhỏ hơn dữ liệu cuối: đưa danh sách key/clip/marker bị ảnh hưởng, mặc định từ chối; chỉ trim sau preview và xác nhận. Trim là một command undo được.

### 3.2 Replay
Tạo/import/nhân bản/đổi tên/xóa/sắp xếp/nhóm/phân loại/tìm kiếm; multi-select cho thao tác hỗ trợ.
Inspector giữ enabled, label, nameTag, shadow size/follow/offset, looping, actor/pickup, first-person, relative offset, axes preview.
Không đồng nhất enabled, form Visible và muted-preview; mute/solo phục vụ quan sát không tự ghi key hoặc đổi export.
Xóa Replay có camera target, attachment, action hoặc lesson rule phụ thuộc: liệt kê phụ thuộc; chặn hoặc remap có preview, không âm thầm cascade.
Move film/insert time có lựa chọn phạm vi camera/replay/actions/markers; atomically đổi tất cả đối tượng đã chọn.
Recording, teleport, actor và world mutation không được giả lập như đã tác động Minecraft; ghi rõ profile thực thi.

### 3.3 Viewport và gizmo
Orbit/pan/zoom/reset/front/side/top; camera quan sát độc lập camera film.
Pick Replay/form/bone từ viewport; ưu tiên pick phải nhất quán với tree và có cycle khi chồng đối tượng.
Move/rotate/scale gizmo, local/world space, pivot, axis lock và numeric entry; preview drag rồi commit một Undo; Escape hủy.
Hiển thị grid/axes/bounds/selection, đường đi camera và target khi có.
Nền lưới/plane màu/chroma color là tiện ích trainer; không tự thêm vào Film data native.
Thay quality không đổi dữ liệu hoặc kết quả chấm; mất WebGL phải báo lỗi và vẫn cho xuất dữ liệu.

## 4. Keyframe, track và thời gian
### 4.1 Core
Một source of truth project; evaluator thuần theo tick và asset version.
Giữ hợp đồng đặt key rõ ràng của bài cơ bản: nhập preview → Đặt key; phần parity theo đúng gesture gốc với profile ghi rõ.
Numeric hữu hạn, typed value đúng schema; ID đích gồm Replay/form/bone/property, không dùng tên hiển thị.
Track rỗng dùng baseValue, một key giữ giá trị; biên/nội suy theo evaluator được chọn.
Boolean/ID/discrete không nội suy thành số giữa hai đối tượng.

### 4.2 Bộ thao tác đầy đủ
Dope Sheet và Graph Editor; zoom/pan/fit all/fit selected; track filter, section collapse, style màu/icon/tên.
Lock track bảo vệ chỉnh sửa, hide track chỉ ẩn UI; nếu là tiện ích web phải ghi namespace trainer.
Select single/box/multi/all/track/before/after/same time; next/previous key.
Copy/cut/paste/duplicate/delete; paste at cursor giữ relative tick và remap target có bảng mapping.
Scale time, spread, stack, flip/reverse và adjust values dùng command theo source; không suy luận nghĩa từ tên.
Mỗi thao tác nhiều key là transaction: validate toàn tập trước commit, một bước Undo; Escape hủy toàn tập.
Default collision trainer: reject toàn thao tác, không silent overwrite. Parity mode phải theo source và test collision riêng; nếu hành vi khác phải hiển thị trước khi commit.
Undo/Redo tối thiểu 100 command/phiên và history viewer; khi vượt budget bỏ bước cũ có thông báo.
Clipboard sai type/asset thiếu/track locked/time ngoài project: lỗi theo target, dữ liệu cũ giữ nguyên.

### 4.3 Nội suy và Graph
Danh sách interpolation sinh từ Interpolations registry đúng commit, không chỉ Linear/Constant/Sine.
Inspector hiện interpolation/easing, duration và handle lx/ly/rx/ry khi factory hỗ trợ; không bật Bezier cho kiểu rời rạc.
Kéo tangent cập nhật curve/viewport đồng bộ; không tự suy ra angle wrap hoặc quaternion.
Mỗi thuật toán có golden vector đầu/giữa/cuối, overshoot, key trùng và khoảng rất nhỏ; so source evaluator trước khi đưa vào profile parity.
Graph minh họa hiển thị time/value và chỗ đang lấy mẫu; phải phân biệt duration key với khoảng tới key tiếp theo.

### 4.4 Loop và Motion shift
Keyframe loop dùng start/sourceEnd/end, shared ID cho các channel; không nhân bản ghost thành key thật.
Theo KeyframeLoop: period=sourceEnd-start; passes=(end-start)/period, có thể phân số; sourceEnd>start và end>=sourceEnd.
Boundary chính xác của completed pass trả sourceEnd. Fixture start=0/sourceEnd=20/end=50: sourceTick(20)=20, (40)=20, (41)=1, (50)=10.
Tạo loop cần đủ key trong interval, không chồng loop không hợp lệ; resize không đổi speed, move dịch source keys và block cùng nhau.
Xóa loop giữ source keys; kiểm tra behavior phần sau loop qua KeyframeChannel trước parity.
Motion shift là dịch phân bố tiến triển trong segment, KHÔNG phải dịch root position.
Theo Keyframe.java: clamp [-0.49,0.49], vô hiệu với stepped/Constant, endpoint progress giữ nguyên; port remapMotion có test, không thay bằng time offset tuyến tính.
Handle drag có reset về 0, Escape hủy; source interval bị loop che không tạo handle độc lập.

### 4.5 Playback và marker
Tick rate 20 tick/s; render FPS độc lập. Step một tick, next/prev key/clip/marker, jump amount, go-to tick.
Loop playback A–B khác keyframe loop và replay looping; UI dùng nhãn phân biệt.
Playback speed 0.25/0.5/1/2 là tùy chọn trainer; audio phải đổi tốc độ cùng clock hoặc báo không hỗ trợ.
Marker gồm id/tick/label/color; CRUD, tìm kiếm, next/prev; duplicate time hợp lệ nhưng ID duy nhất.
Ẩn tab tạm dừng trong web; resume không tự bù thời gian chạy mất. Đến end dừng hoặc loop theo cấu hình.

## 5. Replay channels, Form, Pose và material
### 5.1 Replay channels
Position x/y/z; pitch/yaw/headYaw/bodyYaw; Velocity vX/vY/vZ; States theo registry EntityState; fall/damage/leaning/roll.
Variables: stick_lx/ly, stick_rx/ry, trigger_l/r, extra1_x/y, extra2_x/y. Giải thích channel consumer từ source, không hứa mọi kênh tự tạo chuyển động.
Hotbar gồm 9 ItemStack tracks + selected_slot; UI slot 1–9, adapter theo index source 0–8.
Equipment đủ offhand/head/chest/legs/feet; item rỗng là trạng thái hợp lệ, không tự dùng slot khác.
Record hotbar ghi cả chín channel ở cursor qua một transaction; chọn slot không làm mất item các slot còn lại.
Entity states source là numeric channels: UI semantic và điều kiện kích hoạt phải đọc consumer trước khi biến thành checkbox; không ép toàn bộ thành enum neutral/crouch.

### 5.2 Mười bốn form
Catalog và picker phải có toàn bộ type trong SOURCE-MAP; capabilities quyết định inspector và track.
| Nhóm | Nội dung đặc tả |
|---|---|
| Model, Mob | Model/entity ID, texture, pose/overlay, bone tracks, supported materials/state; NBT có parser giới hạn và profile native |
| Billboard, Extruded, Label | Texture/crop/billboard, màu/shading; text/font/anchor/background; tiếng Việt và dòng dài |
| Item, Block | ItemStack/block state, transform mode, thuộc tính có miền hợp lệ |
| Particle, Vanilla particles, Trail | Effect/settings, count/frequency/local/paused/length và budget; tái tạo khi scrub |
| Video, Framebuffer | Media seek/loop/offset, resolution/scale; tài nguyên GPU, recursion protection |
| Anchor, Structure | Quan hệ/offset theo lớp cha; structure/biome/origin và asset resolution |

Mỗi form có preset đúng/sai, tutorial, test round-trip, missing asset và transform hierarchy.
Thay type có preview dữ liệu tương thích/không tương thích; cho duplicate Replay mới, không mất track cũ.
Typed Model/Texture/Color/Material/ShapeKey/Actions/Anchor tracks chỉ bật khi registry factory và evaluator nguồn hỗ trợ.
Chuyển model theo tick phải xử lý rig/capability thay đổi: chặn key phụ thuộc không hợp lệ hoặc mapping explicit; không đoán từ tên bone.
Material hỗ trợ texture bindings, color/overlay, lighting/culling/visibility và PBR theo schema source; unsupported renderer ghi khác biệt, không “đạt parity”.

### 5.3 Pose, bone và anchor
Pose/pose overlay/bone tracks/shape keys tách biệt. Hiển thị rest/base/current, local/world, selection path.
Transform compose order, đơn vị, sign rotation, inheritance và angle wrap có test source; không giữ công thức rig-lite như chuẩn mod.
Có copy/paste pose, reset pose, mirror khi có bone mapping explicit; thiếu mapping thì báo rõ.
AnchorForm khác anchor property track và khác socket prop mẫu; inspector phải chỉ đúng loại.
Gắn/tháo/đổi target/offset theo tick; dependency graph kiểm tra self/cycle/missing target; Undo phục hồi mọi reference.
Bài cơ bản có thể giới hạn scale dương; bản đầy đủ chỉ hỗ trợ negative/nonuniform scale khi source adapter và renderer có test.
Animation-to-pose bake: chọn Replay, animation, range, step, affected bones, preview số key; commit nguyên tử, giữ bản animation gốc.
Model ActionsConfig và imported action animation có panel riêng; không sử dụng action-event schema của mục 7.

## 6. Camera Editor và 19 camera/media clips
### 6.1 Timeline clips
Lane/layer, enable, duration, start, offset, selection, duplicate, copy/paste, split/trim, move/scale theo hỗ trợ gốc.
Inspector clip giữ field kế thừa, envelope/relative/component mask khi source có; xem SOURCE-MAP chỉ là field trực tiếp.
Không dùng “clip sau thắng” chung cho mọi loại: base/overwrite, modifier, media và layer order được adapter phân biệt theo evaluator source.
Overlap hiển thị vùng ảnh hưởng; preview trước/sau modifier; converter chỉ mở cho cặp được đăng ký.
Camera preview toggle và free observer tách nhau; chọn clip không ghi camera key ngoài ý muốn.
Các clip timing và camera composition phải kiểm tra cả tĩnh, scrub ngược, export frame stepping và loop.

### 6.2 Yêu cầu từng họ clip
| Loại | Thao tác và kết quả bắt buộc | Case nghiệm thu |
|---|---|---|
| Idle | Chọn vị trí/góc/FOV nền | Trong clip pose camera giữ nguyên |
| Dolly | Distance/yaw/pitch và base position | Đầu/giữa/cuối khớp source |
| Path | Thêm/xóa/sắp điểm; path interpolation | Đúng điểm biên; path rỗng/1 điểm xử lý rõ |
| Keyframe | x/y/z/yaw/pitch/roll/fov/distance; additive | Channel có key và channel thiếu đúng default |
| Translate, Angle | Thay vị trí hoặc góc theo component | Không tác động component không chọn |
| Drag | deterministic/factor/rate và trạng thái mẫu | Cùng tick có kết quả đúng mode; seek không dùng cache sai |
| Shake | amount/noise và seed/cơ chế nguồn | Repeatability hoặc giới hạn nondeterministic công khai |
| Look, Orbit | Target/block/forward/relative/absolute theo loại | Target mất không NaN; đúng tọa độ |
| Math | Parser biểu thức source subset | Không eval JS; lỗi cú pháp/miền có vị trí |
| Remapper | Curve ánh xạ thời gian | Đầu/cuối, reverse/freeze nếu nguồn hỗ trợ |
| Curve | Channels tác động client theo registry | Chỉ áp channel đã có adapter; không suy đoán camera path |
| Tracker | Target/group/active mask/lookAt/FOV | Bone/group thiếu trả lỗi rõ; camera không nhảy ngầm |
| Dolly zoom | Focus và biến đổi FOV/khoảng cách | So kích thước chủ thể với source fixture |
| Audio, Subtitle, Image, Video | Timeline media/overlay | Theo mục 8; không tác động camera pose ngoài field được hỗ trợ |

Preset camera là data có provenance và version; nội dung bài học không hard-code vào renderer.
Math parser chỉ cho AST toán học whitelist, giới hạn node/iteration/time; không network, file, import hoặc command execution.

## 7. Film Actions và ghi chuyển động
### 7.1 Mười hai action events
| ID | Dữ liệu/chức năng cần học | Web/native |
|---|---|---|
| chat | Nội dung message, actor, tick | Log mô phỏng / native gửi trong môi trường test |
| command | Command text, context chạy | Chỉ preview trong web; native cần kiểm tra quyền và xác nhận thực thi |
| place_block | Block state, vị trí, drop | World fixture / world game |
| interact_block | Hit result, face/position, hand, range | Fixture interaction / native |
| break_block | Progress và target block | Tiến trình fixture / native |
| use_item | Item và hand từ base action | Sự kiện sử dụng / native item behavior |
| use_block_item | Item + block hit | Fixture / native |
| release_use_item | Charge, projectile, riptide | Minh họa / native |
| drop_item | Stack, xyz, velocity, relative | Prop fixture / native entity |
| attack | Target và damage theo base class | Event minh họa, tách clip animation / native |
| damage | Actor nhận damage | Fixture state / native |
| swipe | Vung tay | Animation/state theo nguồn, không tự tạo damage |

Giữ lane và menu action nguồn. Event có thể cùng tick; không áp lệnh cấm overlap của clip wave.
Khi scrub, simulator reconstruct từ snapshot + event log theo thứ tự ổn định, không gửi lại lệnh ngoài ứng dụng.
Playback replay/reset phải có runId và event ID; native adapter quy định idempotency, interval/once và rollback hạn chế.
World mutation không luôn undo được trong game; dùng bản world test/snapshot và thông báo trước chạy. Undo editor chỉ sửa dữ liệu sự kiện.
Command và chat trong bài không tự gửi đến server thật; import file không được kích hoạt side effect.
Timeline hiện khác biệt event instantaneous và range action từ source; chốt trigger interval tại V18.

### 7.2 Recording
Workflow: chọn Film/Replay → nguồn player/mob/controller → channels/groups → start/countdown → record → stop → preview → accept/discard.
Chọn record position/rotation/controller/hotbar/actions theo khả năng nguồn; không ghi đè ngoài channel/range đã chọn.
Overdub có replace/merge preview; key collision rõ ràng. Accept một transaction; discard giữ nguyên take trước.
Web ghi gizmo/controller fixture được gắn nhãn trainer recording; player/mob recording trong Minecraft cần native.
Có take metadata: source version, tick rate, range, samples, channels và event count.
Test stop sớm, disconnect, tab hidden, duration limit và missing device; bản ghi chưa accept không được tính bài đạt.
Actor/first-person/relative positioning phải kiểm tra camera/entity đúng nguồn, không chỉ đổi tên nút.

## 8. Audio, ảnh, video, phụ đề và xuất bản dựng
Audio workspace có import/catalog/preview, waveform, trim/offset/volume và clip placement; native codec và browser codec tách capability.
Audio clock/master timeline đồng bộ: play/pause/seek/loop/speed; drift budget trainer 1 tick (50 ms) khi playback, export offline không drift tích lũy.
Browser autoplay bị chặn phải yêu cầu thao tác Play; không hiển thị “đang có tiếng” khi audio context chưa chạy.
Image/Video overlay có placement, transform, color/fullscreen/smooth theo schema; giữ aspect ratio và crop explicit.
Subtitle có nội dung/font/size/color/background/shadow/line wrapping; tiếng Việt, xuống dòng và font thiếu có test.
Video seek cần decoded frame đúng timestamp; nếu chưa có thì loading, không render frame cũ như kết quả đúng.
Media offline được đóng gói theo hash và license; không yêu cầu URL internet để mở bài mẫu.
Microphone recording là tiện ích tùy chọn native/browser permission; không tự ghi âm khi mở bài.

### 8.1 Export
Hai đầu ra tách biệt: video hình ảnh và dữ liệu Film/animation.
Export video: range, width/height, FPS, codec/container, audio, alpha nếu codec hỗ trợ, output name, estimate và cancel.
Offline export lấy tick = startTick + frameIndex × 20/FPS; số frame ceil(durationTicks × FPS/20), không dùng tốc độ requestAnimationFrame.
Frame sequence là fallback chính xác; live capture phải ghi có thể drop frame. Không hứa MP4 ở browser khi codec không khả dụng.
Queue export snapshot project+assets khi xếp hàng; chỉnh project sau đó không đổi job cũ.
Render error/cancel giữ log và output tạm riêng; chỉ đánh dấu completed khi file tồn tại và kiểm tra được.
Native export giữ UI lựa chọn tương ứng recorder nguồn; adapter ghi version/toolchain và không tự xuất bản lên mạng.

## 9. IK, constraints, physics và chuyển động nâng cao
IK UI theo model capability: chain/root/tip, target, pole, weight, iteration/tolerance nếu source có.
Chọn target qua viewport hoặc tree; hiệu ứng solve hiển thị skeleton debug và error distance.
Target unreachable, chain cycle, zero bone length, singular pose phải ra kết quả/diagnostic xác định; không NaN.
Bone constraints có enable, axes/limits và tham chiếu; thứ tự action → pose → constraints → IK → physics phải chốt từ source solver, không coi thứ tự đề xuất này là nguồn chuẩn.
Physics/wind có chain controls/targets/weight/seed/fixed timestep theo hỗ trợ; profile renderer/collision world ghi rõ.
Simulation state được checkpoint; scrub ngược reset và resimulate từ checkpoint hợp lệ, không lấy state của tương lai.
Giới hạn budget/step phải báo trước; không chấm physics bằng ảnh snapshot duy nhất.
Bake IK/physics → pose keys: range/step/bones, preview số key, disable procedural option, commit một Undo, giữ cấu hình gốc.
Sai số bake đề xuất 0.01 block vị trí, 0.5 độ góc ở sample và midpoint; phải ghi nếu solver nguồn không đạt.
Procedural model states/CEM: idle/walk/look/attack/swim và assignments theo nguồn khi có; không retarget tự động theo tên mà thiếu mapping.
Mirror/retarget Mixamo/Blender là adapter ở đợt 7, không mặc định mọi rig đều cùng 65 bone.

## 10. Các workspace tài sản đầy đủ
| Workspace | Luồng chức năng | Nghiệm thu tối thiểu |
|---|---|---|
| Morphing | Browse/search/category/favorite/preset, chọn/tạo/sửa form, nested body parts | Đúng type/capability; preset không ghi đè bài |
| Model blocks | Chọn model block, transform/form, đặt trong world fixture hoặc game | Local/world đúng; native placement có receipt |
| Particles | Scheme mới/mở/lưu, emitter/lifetime/shape/appearance/motion theo schema nguồn, preview | Seed/timeline/budget đúng; unsupported component báo rõ |
| Model editor | Model hierarchy, bone/pivot/transform, geometry/UV/material, animation/procedural config theo capability | Edit/undo/round-trip; asset dùng chung không bị sửa ngầm |
| Textures | New/open/save-as, layers/frames/resize/crop, model preview theo source | Alpha/layer order/frame duration đúng; cancel giữ bản cũ |
| Audio | Catalog/preview/waveform/trim/volume/export supported format | Sample range và clipping test; source audio giữ nguyên |
| Settings/Utility/Selectors | UI scale, keybinds, layout, assets, render settings, selectors/search và debug | Versioned preferences; reset có scope; không reset bài làm |

Mỗi workspace phải có manifest widget/property riêng trước code; entrypoint đã thấy trong source không đủ để suy ra thuật toán công cụ bên trong.
Model editor không được gọi là Blender đầy đủ. Tính năng geometry/UV từng loại phải đối chiếu nguồn; unsupported mesh chỉ xem hoặc route adapter.
Texture clone-on-write cho tài sản đang được nhiều Replay dùng; hỏi lựa chọn “tạo bản sao” hoặc “áp cho mọi nơi” với danh sách ảnh hưởng.
Asset delete có dependency report; missing font/texture/model/audio giữ reference để relink, không silently fallback rồi export thành công.
Asset browser hỗ trợ file type, kích thước, preview, origin/license, hash và remap; path relative canonical, chặn traversal.
Setting game-only mở giải thích/native route, không giả vờ đổi đồ họa Minecraft từ browser.

## 11. BOBJ, Film và pipeline ngoài game
### 11.1 Ba định dạng tách biệt
- Trainer JSON: lưu học tập, UI và fixtures của web.
- Native Film: serializer đúng phiên bản BBS, reference tài sản đúng game.
- BOBJ: model/armature/animation theo parser nguồn; không phải JSON đổi đuôi.

### 11.2 Import/export workflow
Chọn file → nhận diện type/version → đọc metadata → dependency/rig mapping → preview → validate → import bản sao.
Export có target profile/version, range, FPS/sample rate, coordinate/unit/rotation convention và loss report.
Không tự loại channel/bone/material không hỗ trợ. Có lựa chọn chỉ xuất subset được đánh dấu rõ, yêu cầu người dùng xác nhận mất dữ liệu.
BOBJ import test: mesh, normals/UV/material, hierarchy, rest pose, action names, channel timing; kiểm giới hạn count/size/truncated file.
BOBJ export chỉ bật khi có writer đã đối chiếu loader và round-trip bằng fixture thật; có loader không chứng minh có writer.
Tách model và animation-only nếu format/loader target hỗ trợ; kiểm rig signature và mapping trước gán animation.
Film export validate full serializer, asset refs, replay IDs, actions và camera; mở lại trong đúng Minecraft/BBS rồi so đầu/giữa/cuối.
FBX/iClone/Blender/Mixamo dùng adapter ngoài web hoặc toolchain đã đóng gói; ghi phiên bản, licenses, scale, coordinate, bone mapping và root motion.
Không coi UUID policy từ repo khác là yêu cầu tự động của dự án này; ID trainer/native được adapter chuyển đúng schema.

### 11.3 Gói bàn giao pipeline
Manifest gồm producerVersion, targetVersion, sourceCommit, file hashes, assets, skeleton signature, clips, duration và conversion warnings.
Có import dry-run, validation log và native receipt. Export success nghĩa là file tạo hợp lệ; compatibility success phải có round-trip runtime riêng.
Golden scene: hai nhân vật, một chuyển động root, một pose/action, camera, Visible và asset references; kiểm tra mất dữ liệu theo từng nhóm.

## 12. Hệ thống học và đánh giá
Mỗi bài có mục tiêu → giải thích → demo riêng → làm theo → tự làm → chấm → áp dụng game.
Có từ điển English–Việt tìm kiếm, shortcut trainer/game, tour ngữ cảnh và bài sửa lỗi.
Không khóa bài vì điểm; chỉ khóa thao tác không đủ capability/bằng chứng.
Đáp án không sửa bài làm; demo có namespace riêng. Guided/independent/assisted có trạng thái khác nhau.
Chấm data/evaluator/event trace đúng Replay/target/property/version; không dùng số click hoặc ảnh làm bằng chứng duy nhất.
Numeric tolerances mặc định tick 0.05, position 0.01, angle 0.5 độ; discrete exact; asset ID/hash và action event identity exact.
So quỹ đạo toàn interval hoặc phương pháp có bound sai số; nếu chỉ sampling phải công bố giới hạn và không chấp nhận mọi key thừa tương đương.
Sau chỉnh dữ liệu, current result stale; lịch sử đạt vẫn giữ. Đổi layout/camera quan sát không stale.
Native-only bài gồm checklist và receipt/evidence; không tự chấm “đã làm trong game” từ việc bấm nút.
Bài sửa lỗi: sai Replay, trục, key chưa lưu, slot sai, clip overlap, missing asset, loop biên, IK target và import rig sai.

### 12.1 Lộ trình 60 bài
[Fixture và điều kiện đạt L23–L60](docs/LESSON-FIXTURES-v0.3.md) bổ sung dữ liệu đầu, nhiệm vụ và test family cho từng bài.
L01–L22 giữ mục tiêu nền trong v0.2 nhưng sửa thuật ngữ/fixture theo mục 1.1; không giữ đáp án simulator như đáp án native.
| Đợt | Bài | Nội dung |
|---|---|---|
| D1 | L01–L08 | Nhận diện, hai key, XYZ, góc, nội suy, Visible, hai nhân vật, shot nền |
| D2 | L09–L16 | States, Hotbar, Equipment, Variables, Pose, Transform, Anchor, shot thuộc tính |
| D3 | L17–L22 | Model/capability, Texture, Model animation, timing animation, VFX, shot tổng hợp |
| D3 | L23–L28 | Quản lý Film/Replay; multi-key/clipboard; Graph; keyframe loop; motion shift; marker/layout/shortcut |
| D4 | L29–L36 | Camera nền; Path/Keyframe; modifiers; target/Tracker; Remapper/Math/Curve; audio; subtitle/image/video; shot có camera |
| D5 | L37–L42 | Action events; block/item events; actor/recording; IK; constraints/physics/wind; bake |
| D6 | L43–L50 | Morphing; Model blocks; Particles; Model hierarchy; geometry/UV; texture layers/frames; audio workspace; asset repair/settings |
| D7 | L51–L56 | Trainer JSON; native Film; BOBJ model; animation-only; Blender/FBX mapping; round-trip hai nhân vật |
| D8 | L57–L60 | Tìm lỗi; tối ưu quality; export queue/audio-video; bài cuối dựng–xuất–mở lại |

Với L23–L60, mỗi bài sử dụng case nghiệm thu tương ứng ở mục 16; trước code phải có fixture versioned, trạng thái đầu/đích và rule set machine-readable.
Không gọi đã viết xong nội dung giảng dạy từng câu chỉ vì đã có danh mục 60 bài.

## 13. Kiến trúc và schema tổng thể
Tách UI shell/dock, command bus, core evaluator, source-parity adapters, renderer, event simulator, lessons, asset manager, persistence và native bridge.
UI không giữ bản dữ liệu animation thứ hai. Các tác vụ nặng dùng worker; renderer chỉ đọc evaluated frame.

### 13.1 Data contract
| Đối tượng | Trường chính/ràng buộc |
|---|---|
| Project | format, schemaVersion, producerVersion, sourceProfile, id, revision, title, durationTicks, tickRate, films/assets |
| Film | id, cameraClips, replays, replayCategories, markers, playerSettings, metadata |
| Replay | id, formGraph, sourceChannels, eventClips, settings, modelAnimationBindings |
| Track | stable target path, propertyId, valueType, baseValue, keys, loopBlocks, source adapter |
| Key | id, tick, value, interpolation, easing/handles, duration, motionShift, style |
| Clip | id, typeId, start, duration, layer, enabled, envelope, typed payload, sourceVersion |
| FormNode | id, parent/bodyPart path, typeId, properties, capabilityVersion, asset references |
| Asset | id, hash, mediaType, relativePath, version, license/provenance, dependencies |
| Layout | dock tree, sizes, hidden/pinned panels, tab state, UI scale; tách project |
| Lesson/Result | lessonVersion, ruleSetVersion, fixtureVersion, projectRevision, rules, guided/independent/evidence |
| NativeJob | id, runId, operation, targetProfile, input hashes, status, output hashes, diagnostics |

Trainer IDs và source serialized IDs khác namespace; mapping lưu trong adapter, không thay tên display.
Shared base schema không được áp interval [start,end) cho tất cả source event/keyframe loop: mỗi evaluator giữ boundary semantics nguồn.
Snapshot cached theo projectRevision+assetHash+profile+tick; không dùng cache sau thay asset/seed.
Physics state checkpoint có source version và hash cấu hình; Undo thay cấu hình làm invalidate checkpoint.

### 13.2 Phiên bản và persistence
D1–D3 có thể dùng schema 1–3 theo kế hoạch cũ; phạm vi đầy đủ dùng schema 4 có type registry/versioned payload.
Migration tuần tự trên bản copy, validate trước replace; backup original; future version không tự đoán.
Unknown native payload cho phép read-only và raw preservation; editing/export compatibility bị chặn nếu không round-trip được.
Autosave debounce, save status, crash recovery, backups nhiều revision, restore-as-copy; quota full vẫn cho export.
Multi-tab optimistic revision check; conflict mở compare/keep-copy/reload, không silent overwrite.
Offline bundle có local dependencies; mở qua local server được hướng dẫn, không cam kết file:// hỗ trợ mọi browser API.

### 13.3 Giới hạn sản phẩm
Bài cơ bản giữ 2 MB JSON/20 Replay/200 track/5.000 key như v0.2.
Profile nâng cao đề xuất 20 MB JSON/50 Replay/1.000 track/50.000 key/500 clips/100 effects; import binary riêng tối đa 100 MB/file, 500 MB/gói.
Đây là budget trainer cần benchmark, không phải giới hạn BBS. Vượt budget phải báo estimated cost trước load và cho chia gói.
Parser depth tối đa 32, strings nội dung tối đa 16 KiB trừ field có schema riêng; reject prototype keys, path traversal và invalid numbers.
Expression AST, NBT/schema và media decoder có timeout/size budget; không chạy executable/script trong asset.

## 14. Hiệu năng, chất lượng và khả năng tiếp cận
| Preset | Render scale | Shadow/effects | Chú thích |
|---|---|---|---|
| Thấp | 0.75, DPR tối đa 1 | Tắt shadow; giản lược hiển thị effect | Dữ liệu/evaluator giữ nguyên |
| Vừa | 1, DPR tối đa 1.5 | Shadow cơ bản, effect budget vừa | Mặc định trainer |
| Cao | 1, DPR tối đa 2 | Shadow/effect đầy đủ trong budget | Không hứa đạt 60 fps mọi máy |
| Tùy chỉnh | Giá trị hợp lệ | Từng tùy chọn | Có reset và ước lượng chi phí |

Auto quality chỉ đổi render, hiển thị thông báo; bài cần quan sát effect bị giản lược phải cảnh báo, không giấu đối tượng mục tiêu.
Target fixture bài: p95 input dưới 100 ms, 60 fps mục tiêu; full-budget fixture báo số đo riêng.
Đo thiết bị/OS/browser/GPU/RAM/viewport và 60 giây playback sau warm-up, 100 thao tác input; ghi median/p95 và memory.
Không tải toàn bộ asset catalog vào GPU; lazy load, cache theo budget, dispose khi bỏ tham chiếu.
Keyboard navigation, focus visible, screen-readable labels cho tree/inspector, reduced motion cho tour. Flash/VFX preview có nút dừng rõ.
WebGL/codec/device thiếu: capability screen và đường tiếp tục phù hợp, không crash/mất bài.

## 15. Tám đợt triển khai và bàn giao
| Đợt | Gói triển khai | Phụ thuộc | Điều kiện hoàn thành |
|---|---|---|---|
| D1 | 01 source baseline; 02 UI shell/mockup; 03 core/schema; 04 viewport; 05 timeline; 06 save; 07 L01–08; 08 QA | Chốt source/thiết kế | Core cơ bản và 8 bài, chưa gọi parity nếu V còn mở |
| D2 | 01 replay channels; 02 typed inspector; 03 pose/anchor; 04 hotbar/equipment; 05 L09–16; 06 QA | D1 | Track thật và fixture simulator phân biệt rõ |
| D3 | 01 form catalog; 02 materials/model animation; 03 multi-key/graph; 04 loops/motion shift; 05 Film management/dock; 06 L17–28; 07 QA | D2 | Typed registry, advanced editing và 28 bài |
| D4 | 01 clip core; 02 camera base; 03 modifiers; 04 media; 05 L29–36; 06 QA | D3 | Đủ 19 camera/media types trong profile có capability |
| D5 | 01 action simulator; 02 recording bridge; 03 IK; 04 constraints/physics; 05 bake; 06 L37–42; 07 QA | D3; D4 cho shot | Đủ 12 event types; native limitations rõ |
| D6 | 01 workspace shell; 02 morph/model blocks; 03 particles; 04 model editor; 05 textures; 06 audio/settings; 07 L43–50; 08 QA | D3, các adapter D4/D5 | Bảy workspace có chức năng thật hoặc native route được kiểm tra |
| D7 | 01 format contract; 02 import validators; 03 native Film; 04 BOBJ; 05 FBX/Blender; 06 L51–56; 07 round-trip | D4–D6 | File và compatibility receipts, không chỉ export thành công |
| D8 | 01 backups/offline; 02 quality/accessibility; 03 export/queue; 04 L57–60; 05 full regression; 06 release package | Các đợt trước | Tất cả test bắt buộc có bằng chứng, known limits công khai |

Ưu tiên U0 ở mục 0 chạy trước các gói triển khai rộng: giải thích các vùng trong ảnh và thu nhận phản hồi người học. D1 là nền triển khai đầu tiên sau bước này.
Mỗi gói: source review → detailed widget/schema/fixture → mockup duyệt → code → test → report/PR.
Tên nhánh đề xuất feat/dN-NN-short-name; PR nêu dependencies và base thật, không tự merge.
Yêu cầu hiện tại chỉ đặc tả; chưa triển khai code, publish hay tạo bridge.
Không khóa nghiên cứu đợt sau vì đợt trước chưa xong; chỉ triển khai phần phụ thuộc sau khi contract ổn định.
Lịch ngày/chi phí chưa ước lượng vì chưa có benchmark/native environment; không hứa số ngày thiếu cơ sở.

## 16. Ma trận nghiệm thu tổng thể
Giữ A01–A36 trong tài liệu lịch sử làm checklist regression nền; cập nhật expectation simulator theo mục 1.1 trước dùng.
Bộ mới G01–G32 là test families, mỗi family có nhiều case; không coi số family là số test đã chạy.

| ID | Nội dung | Fixture/thao tác | Kết quả bắt buộc |
|---|---|---|---|
| G01 | Source/UI registry | So 7 workspace/14 forms/19 clips/12 events | Đủ entry và route; type mới báo thiếu adapter |
| G02 | Dock/layout | Move/split/hide/reset/Undo; resize | Không mất panel/project; layout history riêng |
| G03 | Film CRUD/backup | Duplicate scene có reference; restore copy | ID remap đúng; bản gốc giữ nguyên |
| G04 | Replay CRUD | Xóa target đang được anchor/camera dùng | Dependency report; không reference mồ côi |
| G05 | Selection/gizmo | Hai Replay cùng tên track; drag/Escape | Đúng target; cancel không đổi data |
| G06 | Key core | Empty/one/multiple key, biên và collision | Evaluator đúng profile, không NaN/mất key |
| G07 | Multi-key | Copy 3 tracks, paste xung đột 1 track | Transaction đúng policy; Undo nguyên vẹn |
| G08 | Graph/interpolation | Golden vectors từng registry algorithm | Đầu/giữa/cuối/handles đúng bound |
| G09 | Keyframe loop | 0–20 end50, move/resize/delete | sourceTick 20/40/41/50 = 20/20/1/10 |
| G10 | Motion shift | 0, ±0.49, Constant, reset/Escape | Clamp/support/endpoints khớp source |
| G11 | Playback/markers | Step/next/loop A–B/hidden tab | Tick đúng; không duplicate event |
| G12 | Hotbar/equipment | 9 slots, empty, selected, 5 dress slots | Đúng item theo tick; không lệch index |
| G13 | States/Variables | Consumer fixture từng channel | Không biến kênh không biết thành animation giả |
| G14 | Forms/materials | Mỗi 14 type + asset thiếu + swap | Capability/typed inspector/round-trip đúng |
| G15 | Pose/anchor | Local/world, parent chain, target đổi, cycle | Không sai transform hoặc chu trình |
| G16 | Camera clips | Mỗi 19 type: đầu/giữa/cuối và overlap | Composition đúng adapter nguồn |
| G17 | Media | Seek/loop/pause/speed, font thiếu | Clock đúng; không dùng frame cũ như đúng |
| G18 | Action events | Mỗi 12 type; cùng tick; scrub qua lại | Simulator xác định; không phát side effect ngoài |
| G19 | Recording | Take/overdub/discard/disconnect | Chỉ channel/range được chọn thay đổi |
| G20 | IK/constraints | Reachable/unreachable/zero length | Không NaN; solve/diagnostic đúng nguồn |
| G21 | Physics/bake | Scrub forward/back; bake/cancel | Resimulate đúng; sai số bake trong bound |
| G22 | Asset workspaces | Save-as/delete dependency/layer Undo | Không đổi asset chia sẻ ngoài ý muốn |
| G23 | Import safety | Truncated/large/unknown schema/path sai | Không mất project; lỗi có field/file |
| G24 | Trainer migration | Schema 1/2/3→4, quota fail | ID/value/interp giữ; bản gốc phục hồi được |
| G25 | Native Film | Export/import đúng game version | Camera/replay/actions/assets còn đủ |
| G26 | BOBJ/rig | Mesh+animation/animation-only, rig sai | Map đúng hoặc reject; không đổi đuôi JSON |
| G27 | Export video | Range120 ticks, 30fps, audio | 180 frames theo timestamp; queue snapshot cố định |
| G28 | Quality | Cùng tick ở Low/Medium/High | Evaluator/bộ chấm giống nhau; chỉ render khác |
| G29 | Performance | Fixture bài và fixture budget riêng | Ghi p95/frame/memory thật; không PASS giả |
| G30 | Learning | Đáp án riêng, stale result, wrong target | Không đạt giả; feedback chỉ đúng lỗi |
| G31 | Offline/accessibility | Mất mạng/WebGL/storage; keyboard | Luồng lỗi rõ, xuất dữ liệu được khi có thể |
| G32 | Full round-trip | Hai nhân vật + camera + audio/event + output | Truy vết input→export→native receipt và loss report |

Báo cáo ghi PASS/FAIL/NOT_RUN/BLOCKED, command thực chạy, input hash, output, source/runtime version và giới hạn.
G25/G26/G32 không thể PASS chỉ bằng test JavaScript; phải có native import và bằng chứng.
UI parity không thể PASS chỉ bằng code snapshot; cần ảnh/video thao tác ở đúng version.

## 17. Điểm cần xác minh và cổng phát hành
V01–V16 từ v0.2 vẫn là checklist gốc; bổ sung:
| ID | Việc cần chốt | Cổng bị chặn |
|---|---|---|
| V17 | Clip layers/envelope/relative/composition và converter semantics | Camera parity |
| V18 | Event once/range/order/side effects và record capture | Actions/native recording |
| V19 | Solver order/IK/constraints/physics checkpoint semantics | Procedural parity/bake |
| V20 | Film serializer, BOBJ loader/writer, animation-only compatibility | Native import/export |
| V21 | Recorder/export backend, codecs/audio/frame stepping | Video parity |
| V22 | GUI baseline/screenshots/keys/docking/menu/focus | Tuyên bố giao diện sát nguồn |
| V23 | Asset tool fields kế thừa/UV/texture frames/audio operations | Bảy workspace hoàn chỉnh |
| V24 | License/dependency/native adapter packaging và offline | Gói phát hành có thể phân phối |

Từng V lưu nguồn/commit, observation, test recipe, runtime evidence và owner khi bắt đầu triển khai.
Không đóng V chỉ do đọc tên lớp/label. Bảng SOURCE-MAP là điểm bắt đầu để giảm bỏ sót, không thay source audit sâu.
Release có capability manifest công khai: available/simulator/native/pending theo từng type/property.
Hoàn thành “toàn bộ” chỉ khi mọi built-in trong registry đã có route, bài/fixture và test; những phần native phải có adapter đã kiểm chứng hoặc được ghi rõ chưa hoàn thành, không tính complete bằng nút hướng dẫn.
Tiêu chí xuất bản: không mất dữ liệu, không đạt bài giả, không chạy command ngoài ý muốn, không sai nhãn simulator/native, không giấu failure.
Tài liệu này hoàn thành quy hoạch phạm vi; triển khai chi tiết từng widget/solver/native codec tiếp tục trong gói tương ứng trước khi code.
