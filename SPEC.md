# ĐẶC TẢ SẢN PHẨM — BBS FS 2.7 trainning
Phiên bản tài liệu: 0.2 · Ngày: 03/11/2026
Trạng thái: Bản đặc tả đề xuất để duyệt; không phải xác nhận ứng dụng đã hoàn thành.
Nguồn yêu cầu: README.md và trao đổi trực tiếp của chủ dự án.
Giai đoạn được yêu cầu hiện tại: viết đặc tả. Chưa triển khai thêm code, chưa xuất bản.

## 1. Mục tiêu và kết quả học
Xây phòng tập trên trình duyệt với bố cục tương tự Film Editor trong hai ảnh tham chiếu.
Người học có thể hiểu và thực hành Replay, Body parts, track, keyframe, timeline và nội suy bằng tiếng Việt, rồi áp dụng trong BBS FS.

Sau lộ trình cơ bản, người học phải:
- Nhận biết mình đang chỉnh Replay, bộ phận và thuộc tính nào.
- Tạo chuyển động từ các keyframe; phân biệt sửa giá trị với lưu key.
- Phân biệt thời điểm key, giá trị thuộc tính và kiểu chuyển tiếp.
- Phát hiện lỗi chọn nhầm đối tượng, nhầm trục, thiếu key hoặc sai thời gian.
- Tự dựng một shot ngắn phối hợp hai nhân vật.

Không đo thành công chỉ bằng số lần bấm hoặc đọc hết hướng dẫn.

## 2. Nguồn chuẩn và giới hạn bằng chứng
| Mã | Nguồn | Giá trị sử dụng |
|---|---|---|
| S01 | https://github.com/Wemppy4/bbs-fs | Repo mod gốc tham chiếu |
| S02 | https://github.com/Wemppy4/bbs-fs/wiki/2.7.0 | Changelog 2.7: nhóm track, Body parts, snap tick, vòng lặp và thao tác mới |
| S03 | https://www.curseforge.com/minecraft/mc-mods/bbs-fs/files/8934314 | Bản phát hành bbs-2.7-1.20.1.jar |
| S04 | https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/gradle.properties | Khai báo Minecraft 1.20.1, mod 2.7 |
| S05 | Cùng commit, src/main/java/mchorse/bbs_mod/film/replays/ReplayKeyframes.java | Kênh vị trí, góc và trạng thái Replay |
| S06 | Cùng commit, src/main/java/mchorse/bbs_mod/film/replays/FormProperties.java | Track thuộc tính form; cần xét loại form |
| S07 | Cùng commit, src/main/java/mchorse/bbs_mod/utils/interps/Interpolations.java | Tên và phân loại nội suy |
| S08 | Capture_20261103_181930_652.png; Capture_20261103_181904_899.png do người dùng cung cấp | Bố cục và các tên track nhìn thấy trong ảnh; ảnh chưa được đưa vào repo |

Mốc f48c4fe341df4531f78428ed22bba93d5e6073df là mốc khảo sát; chưa chứng minh trùng hoàn toàn JAR S03.
Ảnh xác minh giao diện nhìn thấy, không tự chứng minh công thức hoặc hành vi khi thao tác.

Mỗi tính năng/bài học phải gắn nhãn bằng chứng:
- source: đã đọc mã nguồn tại mốc xác định.
- docs: có tài liệu phiên bản.
- runtime: đã thử trong BBS FS 2.7, có ghi nhận kết quả.
- simulator: quy ước riêng của phòng tập, phải ghi rõ.
- pending: chưa đủ bằng chứng; không được dạy như sự thật chính thức.

Hiện chưa có kiểm thử runtime trong game. Changelog không đủ để khẳng định mọi chi tiết chuột/phím tắt.

## 3. Phạm vi
### 3.1 MVP
| ID | Chức năng | Kết quả bắt buộc |
|---|---|---|
| F01 | Chọn Replay | Đen, Gỗ Xưa, VFX minh họa; lựa chọn đồng bộ viewport/timeline/inspector |
| F02 | Body parts | Cây thành phần đúng với fixture mẫu; chọn thành phần đổi danh sách track |
| F03 | Position | x/y/z và pitch/yaw/headYaw/bodyYaw; hướng trục nhìn thấy rõ |
| F04 | Keyframe | Tạo/chọn/sửa/xóa/kéo, xử lý key trùng thời điểm |
| F05 | Timeline | Tua, phát/dừng, về đầu, zoom, cuộn, snap tick |
| F06 | Nội suy | Linear, Constant và Sine In/Out; giải thích tiếng Việt |
| F07 | Visible | Bật/tắt đúng đối tượng và thời điểm |
| F08 | Học có hướng dẫn | Làm mẫu, gợi ý vùng thao tác, tự làm, kiểm tra và phản hồi |
| F09 | Tập tự do | Cảnh riêng không làm mất bài đang học |
| F10 | Lưu/khôi phục | Lưu cục bộ; tải/xuất JSON riêng của trainer |
| F11 | Hoàn tác | Undo/Redo các thay đổi dữ liệu trong phiên |

F02 không đồng nghĩa rig/pose từng xương. Body parts trong MVP là cây thành phần form mẫu; không tự coi là danh sách xương giải phẫu. Nhân vật có thể chỉ có root; fixture ghép có root và aura. Cách ánh xạ cần đối chiếu mã UI trước triển khai.

### 3.2 Đợt sau
- Đợt 2: States, Hotbar, Equipment, Variables; Pose, Transform, Anchor.
- Đợt 3: Model, Texture, Actions, VFX; bài riêng theo loại morph.
- Chưa thuộc MVP: IK, vật lý, model editor/UV, thu âm, xuất video, nhập BOBJ, xuất film BBS, dựng camera theo clip.
- Keyframe loop và motion offset là nội dung 2.7 đã có tài liệu, nhưng chưa cam kết mô phỏng trong MVP.
- Không cần tài khoản, backend, AI chatbot hoặc dịch vụ trả phí để học.

## 4. Thiết kế giao diện
### 4.1 Bố cục
Ưu tiên desktop 1366×768 và 1920×1080; vẫn dùng được ở 1024×768.
- Thanh trên: tên bài/cảnh, chế độ học/tự do, trợ giúp, trạng thái lưu.
- Cột trái khoảng 210–250 px: thuộc tính lựa chọn, danh sách Replay và Body parts ở dưới.
- Vùng giữa: viewport trên, timeline dưới; có thanh kéo đổi chiều cao.
- Cột phải khoảng 280–340 px: inspector của key/track đang chọn.
- Hướng dẫn học là panel thu gọn hoặc drawer riêng, không thay thế inspector.
- Danh sách bài mở bằng nút “Bài học”, không chiếm chỗ danh sách Replay trong bố cục mô phỏng.
- Khi không chọn key, inspector hiển thị thuộc tính đang xem và lời nhắc; không để người học tưởng đã chọn key.

Giữ nền tối, vùng chọn xanh, nhãn English như trong game kèm chú thích tiếng Việt.
Màu X/Y/Z đi kèm chữ; không dùng màu làm dấu hiệu duy nhất.
Icon phải có tooltip; kích thước vùng bấm tối thiểu 32 px trong trainer.
Không thêm nút trang trí có vẻ hoạt động nhưng không làm gì.

Ở màn hình hẹp: các panel chuyển thành tab, giữ nguyên trạng thái; hiện lời nhắc desktop thuận tiện hơn. Không yêu cầu sao chép đầy đủ thao tác game trên điện thoại.

### 4.2 Viewport
Đề xuất cảnh 3D bằng WebGL, mô hình khối tự tạo; không yêu cầu texture/tài sản game bản quyền.
- Sân tập có lưới, mốc X/Y/Z, hai nhân vật phân biệt được.
- Hiện tên và viền đối tượng được chọn.
- Cho orbit/pan/zoom góc xem bằng điều khiển có hướng dẫn; đây là camera quan sát trainer, không phải track camera BBS.
- Nút đặt lại góc nhìn; chế độ nhìn trước/bên/trên giúp học trục.
- Scrub đến cùng thời điểm luôn trả cùng kết quả.
- Thiếu WebGL: báo rõ không thể chạy phần 3D; không âm thầm thay bằng hình tĩnh rồi báo đạt.

Trục thế giới và hướng trái/phải trên màn hình phải được phân biệt. X tăng không luôn có nghĩa đi sang phải màn hình khi đổi camera.

## 5. Hợp đồng tương tác
### 5.1 Chọn và tạo key
1. Chọn Replay → Body part → track.
2. Tua đến tick cần đặt.
3. Nhập giá trị trong inspector: cảnh xem thử thay đổi, đánh dấu “Chưa đặt key”.
4. Bấm “Đặt key” để lưu.
5. Nếu đã có key cùng track và tick, cập nhật key đó; không tạo bản sao.

Nếu đổi lựa chọn/tick khi có thay đổi chưa đặt key: bỏ preview nháp và báo ngắn “Giá trị chưa đặt key đã được bỏ”. Không tự lưu thành key.
Chọn key có sẵn sẽ đưa playhead đến key và nạp dữ liệu vào inspector.
Nhập giá trị không phải số hoặc vô hạn: giữ dữ liệu cũ, hiện lỗi ngay cạnh trường.
Visible dùng switch/boolean, không yêu cầu người học đoán 0/1.

### 5.2 Timeline
- Thời lượng fixture mặc định 100 tick; bài cuối 120 tick.
- Quy ước trainer: 20 tick/giây; tách khỏi tốc độ khung hình render.
- Phát từ playhead; đến cuối tự dừng. Không tự lặp trừ khi bật nút Loop playback.
- Loop playback của trainer không phải tính năng keyframe loop của mod.
- Kéo playhead/click thước thời gian để scrub; dừng playback khi chỉnh dữ liệu.
- Zoom/scroll không đổi dữ liệu key và không đổi tiến độ.
- Snap bật mặc định: lượng tử hóa về tick nguyên. Snap tắt: bước 0.1 tick trong trainer; đây là giới hạn sản phẩm, không khẳng định giới hạn mod.
- Key được chọn có hình/viền riêng; track nhiều key không được mất khả năng chọn khi zoom.
- Kéo key theo trục thời gian. Nếu đích có key khác: không ghi đè âm thầm; trả key về vị trí cũ và giải thích.
- Xóa chỉ tác động key được chọn; Undo khôi phục đúng giá trị, tick và nội suy.
- MVP chọn một key mỗi lần; multi-select và duplicate nâng cao nằm ngoài MVP đầu tiên.

### 5.3 Nội suy và mặc định
Hợp đồng dưới đây là quy ước trainer; phải đối chiếu vị trí lưu/thực thi nội suy của mod trước tuyên bố thao tác tương đương.
- Track rỗng: dùng baseValue của đối tượng, không mặc định mọi đối tượng đều ở gốc.
- Một key: giữ giá trị key trên toàn khoảng thời gian.
- Trước key đầu/sau key cuối: giữ giá trị biên.
- Đúng thời điểm key: trả đúng giá trị key.
- Giữa hai key A/B: u=(t-tA)/(tB-tA).
- Linear: a+(b-a)u.
- Constant: giữ a đến trước B, tại B chuyển b.
- Sine In/Out: a+(b-a)(1-cos(pi*u))/2.
- Visible: giữ trạng thái key trước; không pha trộn boolean.
- Không đặt nhãn “Smooth” chung cho nhiều thuật toán; không thay Constant bằng Step.

Góc quay: mã đã đọc truyền yaw, pitch, headYaw, bodyYaw qua các setter riêng. Không tự cộng các góc lại để giả định hành vi đúng.
Phải xác minh dấu góc, hệ tọa độ, quan hệ đầu/thân và cách xử lý 350→10 độ cho fixture trước phát hành bài 4. Nếu chưa xác minh: khóa bài 4 với lý do, không chấm theo công thức phỏng đoán.

### 5.4 Undo/Redo và phím
- Undo/Redo: thêm, cập nhật, xóa, kéo key; một lần kéo là một bước hoàn tác.
- Tối thiểu 50 bước trong phiên; đổi bài sẽ dùng lịch sử riêng hoặc xóa lịch sử và ghi rõ.
- Chọn đối tượng, zoom, phát/dừng không tạo bước Undo.
- Trainer có thể dùng Space phát/dừng, Ctrl+Z hoàn tác, Ctrl+Shift+Z làm lại.
- Không bắt phím khi con trỏ đang nhập trường hoặc dialog mở.
- Trợ giúp ghi rõ đây là phím của trainer; chỉ thêm bảng phím BBS khi có bằng chứng.
- Không chặn phím trình duyệt ngoài vùng editor cần thiết.

## 6. Nội dung học và bài tập
Mỗi bài có: mục tiêu → giải thích ngắn → làm mẫu → làm theo → tự làm → kiểm tra → áp dụng trong game.
Gợi ý không tự sửa bài. Đáp án mở trong cảnh mẫu riêng, không ghi đè bài làm.
Cho phép học mọi bài; đề xuất thứ tự nhưng không khóa theo điểm.
Tiến độ phân biệt “đạt khi có hướng dẫn” và “đạt tự làm”.

Các con số dưới đây là fixture thiết kế của trainer, không phải bài chính thức của mod.
Hai nhân vật bắt đầu: Đen (-2,0,0), Gỗ Xưa (4,0,3).
Đơn vị vị trí trong bài là tọa độ tuyệt đối của sân tập; mọi mục tiêu hiển thị rõ giá trị ban đầu.

| Bài | Đề bài và dữ liệu đích | Kiểm tra |
|---|---|---|
| L01 Nhận diện | Chọn Đen, root, track x; đưa playhead về 0; nhận diện viewport/timeline/inspector qua thao tác chỉ vùng | Đúng lựa chọn và chuỗi nhận diện, không chỉ mở bài |
| L02 Hai key | Đen.x: (0,-2), (40,2), Linear | Đúng key và giá trị mẫu ở tick 20 = 0 |
| L03 Ba trục | Giai đoạn X: Đen.x (0,-2),(40,2); Y: Đen.y (0,0),(30,3),(60,0); Z: Đen.z (0,0),(40,3), Linear | Mỗi giai đoạn có fixture riêng, không trộn vô tình các trục |
| L04 Góc quay | So sánh từng kênh pitch/yaw/headYaw/bodyYaw trên fixture đã xác minh, giữ vị trí cố định | Khóa nội dung số liệu tới khi giải quyết V02; không ghi đạt giả |
| L05 Nội suy | Đen.x (0,-2),(60,4); thử Linear, Constant, Sine In/Out; hoàn tất với Sine In/Out | Giá trị tại tick 15 xấp xỉ -1.12132, tick 30 = 1; phân biệt ba đường chuyển động |
| L06 Ẩn/hiện | Gỗ Xưa.visible: (0,true),(30,false),(60,true) | Tại 29.9 hiện, 30 ẩn, 59.9 ẩn, 60 hiện |
| L07 Hai nhân vật | Đen.x (0,-2),(40,1); Gỗ Xưa.z (0,3),(40,1), Linear; giữ các trục khác | Cả hai đối tượng đạt đúng thời điểm; không nhầm track |
| L08 Shot tự làm | 120 tick: Đen.x (0,-2),(40,1),(120,1); Gỗ Xưa.y (0,0),(40,0),(60,2),(80,0),(120,0); Gỗ Xưa.visible (0,true),(90,false),(110,true) | Đúng chuyển động, giữ vị trí theo đoạn và lịch hiện/ẩn; không cung cấp chỉ dẫn từng click |

L08 có đề chữ trước; bảng key được coi là đáp án và chỉ mở khi người học yêu cầu.
L04 là hạng mục bắt buộc để tuyên bố hoàn thành đủ 8 bài. Nếu chưa giải quyết V02, chỉ được phát hành preview có giới hạn, không gọi MVP hoàn tất.

## 7. Bộ chấm bài
Không dùng ảnh chụp màn hình hoặc số lần click làm bằng chứng duy nhất.
Đầu vào: project hiện tại, lessonId, stage, ruleSetVersion và sự kiện thao tác cần thiết cho L01.
Đầu ra: passed, danh sách rule đạt/chưa đạt, current/expected, vị trí lỗi và gợi ý.

Quy tắc:
- So sánh đúng replayId, partId, propertyId; không chỉ so giá trị.
- Tick sai số tối đa 0.05; vị trí 0.01 block; góc 0.5 độ sau khi xác minh; boolean khớp tuyệt đối.
- Bài hướng dẫn L02–L07 kiểm tra key yêu cầu và các mẫu chuyển động; key thừa không mặc định sai nếu không làm sai quỹ đạo và đề không giới hạn số key.
- L08 chấm theo các đoạn hành vi và mốc yêu cầu; chấp nhận cách đặt thêm key tương đương.
- Nội suy chỉ bị chấm bắt buộc ở bài có yêu cầu tên kiểu.
- Kiểm tra thuộc tính phải giữ nguyên; không cho đạt nếu vô tình dịch chuyển cả cảnh.
- Không đánh dấu đạt chỉ do “Xem đáp án”.
- Chỉnh bài sau khi đạt: trạng thái hiện tại chuyển “Đã thay đổi, cần kiểm tra lại”; lịch sử đã từng đạt vẫn lưu riêng.
- Reset bài: xóa bài làm và kết quả hiện tại của bài đó; không xóa bài khác.
- Thông báo cụ thể: “Đang sửa Gỗ Xưa; bài yêu cầu Đen”, hoặc “Tick 40: X hiện là 4, yêu cầu 2”.

## 8. Mô hình dữ liệu
Dữ liệu là định dạng riêng trainer, không tương thích film BBS.
| Đối tượng | Trường chính |
|---|---|
| Project | schemaVersion, projectId, title, durationTicks, ticksPerSecond, replays[], updatedAt |
| Replay | id, label, fixtureId, baseTransform, parts[], tracks[] |
| Part | id, parentId, label, supportedProperties[] |
| Track | id, replayId, partId, propertyId, valueType, baseValue, keys[] |
| Key | id, tick, value, interpolationToNext |
| Lesson | id, version, title, objectives[], fixtureId, stages[], rules[], help[], evidence[] |
| UIState | selectedReplayId, selectedPartId, selectedTrackId, selectedKeyId, playhead, zoom, scroll, snap |
| Progress | lessonId, lessonVersion, guidedPass, independentPass, currentValidation, attempts, lastCheckedAt |

Ràng buộc:
- ID ổn định, duy nhất; không dùng tên hiển thị làm khóa.
- Track phải thuộc đúng đối tượng và chỉ dùng thuộc tính được hỗ trợ.
- Key sắp tăng dần; không trùng tick trong một track; tick trong [0,durationTicks].
- Numeric phải hữu hạn; valueType phải khớp.
- interpolationToNext là quy ước dữ liệu trainer, không khẳng định cách mod lưu.
- Tên/key JSON nhập vào chỉ hiển thị như văn bản; không thực thi script hoặc HTML.

## 9. Lưu và khôi phục
- Lưu cục bộ sau thay đổi dữ liệu với debounce ngắn; hiển thị đã lưu/lưu lỗi.
- Tách namespace bài học, bài làm và sandbox.
- Khôi phục khi mở lại; không tự mở playback.
- Có nút xuất JSON, nhập JSON và tải bài mẫu.
- Nhập phải validate toàn bộ trước khi thay trạng thái; dữ liệu sai không làm mất dự án đang mở.
- Giới hạn dự kiến: file 2 MB, 20 Replay, 200 track, 5.000 key toàn dự án.
- Khi nhập thay thế hoặc reset: hỏi xác nhận trong UI; cung cấp xuất dự phòng trước khi thay nếu cần.
- Storage không khả dụng/đầy: vẫn chỉnh được trong phiên, báo chưa lưu và cho xuất JSON.
- Phiên bản schema chưa hỗ trợ: từ chối rõ ràng, không đoán cấu trúc.
- Nhiều tab: phát hiện thay đổi ngoài tab, báo xung đột và yêu cầu tải bản mới hoặc xuất bản hiện tại; không âm thầm ghi đè.

## 10. Kiến trúc dự kiến
Đề xuất HTML/CSS/JavaScript chạy phía client, WebGL cho cảnh 3D. Chọn thư viện sau khi duyệt mockup và kiểm tra phụ thuộc.
Tách các phần:
- scene: dựng fixture và hiển thị trạng thái đã tính.
- timeline: lựa chọn, zoom, kéo key/playhead.
- animation-core: tính giá trị theo thời gian, độc lập UI.
- commands: thay đổi dữ liệu và Undo/Redo.
- lessons: nội dung và quy tắc chấm.
- persistence: validate, lưu, nhập/xuất.
- help: thuật ngữ và nguồn bằng chứng.

Cảnh và timeline cùng đọc một project state. Không để canvas giữ bản dữ liệu riêng.
Playback dùng thời gian thực đã trôi qua; không cộng một tick mỗi lần requestAnimationFrame.
Không yêu cầu triển khai công khai. Bản offline nên đóng gói phụ thuộc cục bộ; không cam kết một file duy nhất nếu cần nhiều tài nguyên.

## 11. Bảng nghiệm thu
| ID | Kiểm thử | Đạt khi |
|---|---|---|
| A01 | Chọn hai Replay có cùng property x | Inspector/key thay đổi đúng đối tượng, không sửa nhầm |
| A02 | Đổi Body part | Chỉ hiện track hợp lệ; không bịa track của loại form khác |
| A03 | Đặt/sửa key trùng tick | Chỉ còn một key và đúng giá trị mới |
| A04 | Kéo key đến tick đã có key | Không mất dữ liệu; có thông báo |
| A05 | Xóa/Undo/Redo | Khôi phục chính xác tick, giá trị và nội suy |
| A06 | Linear/Constant/Sine InOut | Kết quả đầu/giữa/cuối và biên key đúng hợp đồng |
| A07 | Tua qua lại | Cùng tick cho cùng trạng thái, không phụ thuộc lịch sử phát |
| A08 | Visible | Chuyển trạng thái đúng tại mốc, không mờ dần |
| A09 | Playback | 100 tick tương ứng khoảng 5 giây ở 20 tick/s; ẩn tab thì tạm dừng |
| A10 | Lưu và mở lại | Bài làm và tiến độ khôi phục; playback dừng |
| A11 | JSON lỗi/schema sai/storage đầy | Không phá bài đang mở; thông báo và đường khôi phục rõ |
| A12 | Chấm sai Replay/track/tick/value | Báo đúng nguyên nhân, không chấm đạt giả |
| A13 | Xem đáp án | Không thay bài làm hoặc tự ghi nhận đạt |
| A14 | Zoom/resize | Key vẫn chọn được; không đổi dữ liệu |
| A15 | Bàn phím | Không bắt Space/Undo khi nhập liệu; focus nhìn thấy |
| A16 | Độ trung thực | Track/góc/phím đã đối chiếu hoặc ghi rõ giới hạn |
| A17 | Lộ trình | Mỗi bài có mẫu, hướng dẫn, tự làm, phản hồi và bước áp dụng trong game |

Mục tiêu hiệu năng: thao tác thông thường phản hồi dưới 100 ms và playback mục tiêu 60 fps với fixture MVP trên Chrome desktop có WebGL. Đây là mục tiêu chưa đo, không phải kết quả đã kiểm thử.
QA phải ghi thiết bị/trình duyệt và điều kiện đo. Kiểm thử lõi nội suy, lựa chọn, lưu và chấm bài là bắt buộc; không cần test chỉ lặp lại HTML tĩnh.

## 12. Điểm cần xác minh trước triển khai tương ứng
| Mã | Việc cần giải quyết | Ảnh hưởng |
|---|---|---|
| V01 | Liên hệ commit khảo sát với JAR phát hành | Giới hạn tuyên bố “đúng bản 2.7” |
| V02 | Hướng trục/góc và quan hệ yaw/headYaw/bodyYaw trên fixture | Chặn hoàn thiện bài 4 và renderer góc |
| V03 | Body parts là thành phần form nào và danh sách track hợp lệ | Chặn F02 |
| V04 | Nội suy gắn key nào, tên hiển thị và biên đoạn thực tế | Chặn tuyên bố tương đương mod cho F06 |
| V05 | Thao tác chọn/tạo/kéo key, chuột/phím thật | Chặn bảng hướng dẫn phím BBS; trainer vẫn phải ghi nhãn riêng |
| V06 | Tài sản nhân vật được phép dùng | MVP dùng khối tự tạo, không tự tải skin/model riêng |

Giải quyết bằng đọc mã đúng mốc và thử thao tác trong game khi có môi trường. Nếu chưa đủ bằng chứng, đánh dấu pending; không tự đổi thành runtime-verified.

## 13. Thứ tự bàn giao và trạng thái
| Giai đoạn | Đầu ra | Trạng thái |
|---|---|---|
| P1 | Repo và khảo sát ban đầu | Đã có; còn V01–V06 |
| P2 | SPEC.md v0.2 — đặc tả ba đợt | Bản này, chờ duyệt |
| P3 | Mockup desktop và màn hình hẹp | Chưa thực hiện theo đặc tả |
| P4 | Core, timeline, cảnh, lưu | Chưa thực hiện theo đặc tả |
| P5 | 8 bài và bộ chấm | Chưa thực hiện theo đặc tả |
| P6 | Báo cáo QA và đối chiếu game | Chưa thực hiện |

Bản HTML thử trước đây không phải nguồn chuẩn và chưa được nghiệm thu.
Cổng triển khai: chủ dự án duyệt đặc tả, sau đó duyệt mockup trước khi hoàn thiện logic.
Thay đổi phạm vi phải ghi quyết định và cập nhật đặc tả; không tự coi đợt 2/3 thuộc MVP.


## 14. Kế hoạch toàn bộ các đợt — bổ sung v0.2
Phạm vi “toàn bộ các đợt” trong tài liệu này là ba đợt đã có trong README: Đợt 1 (MVP), Đợt 2 và Đợt 3. P1–P6 ở mục 13 là các bước bàn giao, không phải sáu đợt tính năng. Các nội dung khảo sát thêm ở mục 22 không tự trở thành đợt đã cam kết.

Yêu cầu ngày 03/11/2026: viết tiếp đặc tả cho toàn bộ các đợt. Yêu cầu này cho phép mở rộng tài liệu; không đồng nghĩa đã duyệt mockup, triển khai code hoặc xuất bản ứng dụng. Mục 1–13 tiếp tục là hợp đồng nền; mục 14–22 bổ sung cho các đợt sau. Nếu một quy tắc được mở rộng, mục bổ sung phải nêu rõ phạm vi áp dụng.

| Đợt | Mục tiêu học | Phạm vi | Bài học | Cổng hoàn thành |
|---|---|---|---|---|
| D1 — Nền tảng | Chọn đúng đối tượng, tạo và kiểm tra chuyển động | F01–F11, mục 3.1 | L01–L08 | A01–A17; giải quyết các điểm chặn tương ứng V01–V06 |
| D2 — Thuộc tính và cấu trúc | Phân biệt trạng thái, trang bị, biến, pose, transform và anchor | F12–F18, mục 16 | L09–L16 | A18–A27; V07–V12; hồi quy D1 |
| D3 — Morph và dựng shot | Chọn tài sản phù hợp, phối hợp action và VFX theo loại morph | F19–F23, mục 17 | L17–L22 | A28–A36; V13–V16; hồi quy D1–D2 |

Mỗi đợt đi qua: bằng chứng → đặc tả được duyệt → mockup được duyệt → triển khai → QA → bàn giao.
Có thể phát hành preview thiếu tính năng nếu công khai giới hạn. Không gọi “hoàn tất đợt” khi bài bắt buộc còn bị chặn.
Bài học không bị khóa vì điểm bài trước; chỉ khóa vì chưa đủ bằng chứng hoặc fixture không hỗ trợ.

### 14.1 Mức độ trung thực
Mỗi chức năng có hai đánh giá riêng:
- Trạng thái sản phẩm: planned / implemented / tested / accepted.
- Bằng chứng: danh sách source / docs / runtime / simulator / pending, kèm tham chiếu cụ thể.
Một chức năng có thể vừa source vừa simulator; không gộp thành một dấu “đã xác minh”.
Toàn bộ chức năng D2–D3 bên dưới hiện là planned; quy ước trainer là simulator; ánh xạ sang game là pending nếu chưa có biên bản đối chiếu.

### 14.2 Đầu ra bắt buộc mỗi đợt
- Danh mục chức năng, fixture, thuộc tính hỗ trợ và các giới hạn.
- Mockup các trạng thái bình thường, không hỗ trợ, dữ liệu lỗi và chưa lưu.
- Nội dung từng bài: mục tiêu, ví dụ, làm theo, tự làm, đáp án riêng, bộ chấm và cách áp dụng trong game.
- Dữ liệu mẫu có phiên bản, kiểm thử lõi và báo cáo QA.
- Bảng so sánh trainer/game với bằng chứng; danh sách lỗi và phần chưa chạy.
- Gói chạy cục bộ và hướng dẫn mở chỉ khi đến bước triển khai; đặc tả này chưa tạo gói ứng dụng.

## 15. Đợt 1 — phân rã triển khai MVP
Đợt 1 giữ toàn bộ hành vi và số liệu ở mục 4–11; không thay bằng bản demo chỉ có hình minh họa.

| Gói | Nội dung | Phụ thuộc | Điều kiện bàn giao |
|---|---|---|---|
| D1.01 | Hồ sơ V01–V06; registry fixture và track | Nguồn S01–S08 | Ghi rõ điều xác minh được, điều còn pending; không tự đóng V02/V03 |
| D1.02 | Mockup desktop, 1024×768, màn hình hẹp; trạng thái chọn và nháp | D1.01 cho nhãn có bằng chứng | Người dùng duyệt; không có nút giả |
| D1.03 | Project, validator, evaluator, command và Undo/Redo | Đặc tả nền được duyệt | Track rỗng/1 key/nhiều key/biên/nội suy hoạt động đúng |
| D1.04 | Viewport, Replay, Body parts, inspector | D1.02–D1.03; V02/V03 tương ứng | Đổi lựa chọn không sửa nhầm; dữ liệu nháp phân biệt với key |
| D1.05 | Timeline, scrub, playback, zoom, snap và kéo key | D1.03–D1.04 | A03–A09, A14–A15 |
| D1.06 | Lưu, phục hồi, nhập/xuất trainer JSON, xung đột tab | D1.03 | A10–A11; không mất bài đang mở khi import lỗi |
| D1.07 | L01–L08, guided/independent, bộ chấm và đáp án riêng | D1.04–D1.06; V02 cho L04 | A12–A13, A17; bài sai không đạt giả |
| D1.08 | QA, đối chiếu game, gói bàn giao | Các gói trên | A01–A17 có kết quả và bằng chứng; giới hạn còn lại được công bố |

Các lớp trạng thái phải tách biệt: project đã lưu key, preview nháp, lựa chọn UI, kết quả chấm và lịch sử từng đạt.
Mọi thay đổi dữ liệu làm kết quả hiện tại cần kiểm tra lại; camera quan sát, zoom và chọn track không làm mất kết quả.
Khi đổi bài, bài cũ phải được lưu hoặc báo lưu lỗi; không tự xóa vì chuyển sang sandbox.

## 16. Đợt 2 — States, Hotbar, Equipment, Variables, Pose, Transform, Anchor
### 16.1 Phạm vi và khả năng theo fixture
| ID | Nhóm | Người học thực hiện | Điều kiện hỗ trợ |
|---|---|---|---|
| F12 | States | Đặt trạng thái rời rạc theo thời gian, quan sát thay đổi | Registry khai báo tên, kiểu và miền giá trị đã đối chiếu |
| F13 | Hotbar | Chọn ô và quan sát vật đang cầm | Fixture humanoid của trainer; ánh xạ game chờ V08 |
| F14 | Equipment | Gán/xóa vật ở slot hỗ trợ | Slot và item có ID; không coi mọi morph đều có trang bị |
| F15 | Variables | Đặt biến có kiểu, quan sát consumer minh họa | Chỉ biến được fixture khai báo; không thực thi mã nhập vào |
| F16 | Pose | Chọn bộ phận rig mẫu và chỉnh tư thế | Fixture rig-lite riêng, không suy ra xương từ Body parts |
| F17 | Transform | Chỉnh local translation/rotation/scale của thành phần | Có local axes và base transform rõ ràng |
| F18 | Anchor | Gắn thành phần vào anchor và quan sát quan hệ cha–con | Đồ thị hợp lệ, không chu trình; chờ V12 để dạy tương đương game |

Tên trạng thái, slot và property thực trong BBS chỉ đưa vào tài liệu học sau V07–V12. Những tên ví dụ dưới đây là ID nội bộ của trainer, không phải tên API mod.

### 16.2 Hợp đồng thao tác chung
Giữ chuỗi chọn Replay → thành phần → nhóm → thuộc tính → tick → preview → Đặt key.
- Dropdown/switch/resource picker phục vụ giá trị rời rạc; trường số dùng cho numeric.
- State, slot, item và enum giữ giá trị key trước; không chạy Linear/Sine giữa hai ID.
- Xóa key khác với chọn giá trị rỗng. Xóa key khôi phục đường đánh giá track; giá trị null chỉ hợp lệ cho property cho phép bỏ trang bị.
- Inspector hiển thị kiểu dữ liệu, đơn vị, baseValue và lý do không hỗ trợ.
- Track không hỗ trợ bị ẩn trong danh sách mặc định; panel khả năng vẫn giải thích vì sao không có.
- Mọi thay đổi hợp lệ đi qua command; Undo/Redo phục hồi cả tham chiếu và giá trị.
- Khi playback, thao tác chỉnh dừng phát trước khi tạo nháp. Không tự ghi một chuỗi key theo mỗi frame.

### 16.3 States, Hotbar và Equipment
Fixture humanoid-lite có trạng thái trainer.state với enum neutral/crouch; hotbar có 9 ô, UI ghi 1–9, dữ liệu lưu 0–8.
Đây là quy ước mô phỏng để viết bài, chưa khẳng định tên enum hay ánh xạ hotbar trong game.
Catalog ban đầu dùng hình khối tự tạo: prop-block, prop-stick, prop-shield. Không cho nhập lệnh Minecraft.

- Hotbar lưu cấu hình slot item trong fixture/project; track activeSlot chọn ô theo thời gian.
- Equipment MVP D2 hỗ trợ slot offhand và head trên fixture; slot không hỗ trợ bị từ chối khi nhập.
- Vật mainhand lấy từ activeSlot; không đồng thời cho equipment ghi đè mainhand trong fixture này.
- Ô trống làm bàn tay trống; không tự lấy item ở ô gần nhất.
- Thay item trong catalog không âm thầm đổi mọi fixture: asset ID và version phải ổn định.
- State chỉ đổi pose minh họa đã khai báo; không suy diễn chạy vật lý, va chạm hoặc AI.
- State không tự tạo key Position. Cúi người không làm root di chuyển nếu bài yêu cầu giữ root.

### 16.4 Variables
Đợt 2 chỉ hỗ trợ biến number/boolean/enum khai báo sẵn trong fixture, có default và miền giá trị.
Ví dụ trainer.energy thuộc [0,1] điều khiển thanh năng lượng minh họa trong viewport; đây là consumer của trainer.
- Sửa biến không ảnh hưởng bất kỳ đối tượng nào ngoài consumer được khai báo.
- Biến number cho phép Linear/Constant/Sine InOut; boolean/enum chỉ Constant.
- Không có eval, JavaScript, biểu thức tự do hoặc gọi mạng.
- Ngoài miền: báo lỗi và giữ giá trị cũ, không clamp âm thầm.
- Đổi loại/đổi tên biến có dữ liệu nằm ngoài D2; import chứa biến không biết bị từ chối.
- Bài phải chỉ rõ biến nào được đọc bởi thành phần nào; không dạy rằng mọi biến đều tự tạo hiệu ứng.

### 16.5 Pose và Transform
Fixture rig-lite dùng root và các node mẫu torso, head, armL, armR, legL, legR. Đây là rig đào tạo, không phải Mixamo 65 xương và không phải cam kết rig của BBS.
Body parts tiếp tục là cây form; danh sách bone/pose có panel riêng.
- Hiển thị local axes của node được chọn, rest pose và thao tác đặt lại nháp.
- Translation dùng block, rotation nhập độ, scale không có đơn vị.
- D2 dùng các track scalar riêng cho từng trục; không ngầm đổi sang quaternion hoặc blend pose.
- Quy ước renderer trainer dùng ma trận cột: local = T × Rz × Ry × Rx × S; world = parentWorld × local.
- Góc nội suy số trực tiếp theo từng trục, không tự chọn cung ngắn. Gắn nhãn simulator; không áp quy tắc này cho L04 trước V02.
- Scale fixture cho phép [0.1,4] mỗi trục; không hỗ trợ scale âm hoặc 0 trong D2.
- Base local transform được áp trước delta pose: local = baseLocal × poseDelta. UI phải phân biệt base và delta.
- State crouch chọn base pose; poseDelta áp sau state. Tắt state khôi phục base trung tính và giữ nguyên delta.
- Reset pose đưa delta về neutral trong preview; chỉ ghi key khi bấm Đặt key.
- Không có IK, constraints, retargeting, vật lý hoặc chỉnh trọng số skin.

### 16.6 Anchor
Anchor của trainer là socket cố định trong fixture, có transform và ID; quan hệ attachment là cấu hình cảnh, không keyframe trong D2.
- Chọn đối tượng gắn → chọn Replay/node/anchor đích → xem trước → Xác nhận gắn.
- Gắn theo local offset, không hứa giữ nguyên vị trí thế giới; preview phải hiển thị vị trí sau gắn trước xác nhận.
- Công thức worldAttached = worldTargetNode × anchorLocal × attachmentOffset.
- Không gắn vào chính mình, con của mình, hoặc đối tượng không tồn tại. Validator phát hiện chu trình trước commit.
- D2 không cho scale thay đổi trên đường tổ tiên của anchor; hiện lý do. Quy tắc này tránh decomposition mơ hồ khi tháo.
- Tháo giữ world transform tại playhead bằng cách chuyển thành baseTransform mới; thao tác chỉ hợp lệ với prop không có transform track.
- Prop đã có transform track không được gắn/tháo trong D2; hướng dẫn dùng prop mới, không tự xóa key.
- Replay/part có đối tượng phụ thuộc không được xóa cho đến khi tháo phụ thuộc; không cascade delete.
- Undo một thao tác gắn/tháo phục hồi nguyên quan hệ, base transform và selection hợp lệ.

### 16.7 Bài tập D2
Các bài độc lập, duration 100 tick trừ L16 là 120; mỗi bài có đủ vòng học ở mục 6.

| Bài | Fixture và nhiệm vụ tự làm | Bộ chấm bắt buộc |
|---|---|---|
| L09 States | humanoid-lite: neutral tại 0, crouch tại 20, neutral tại 60 | 19.9/20/59.9/60; root giữ nguyên |
| L10 Hotbar | slot 1 chứa prop-block, slot 2 chứa prop-stick; chọn 1 tại 0, 2 tại 40 | UI 1/2 ánh xạ data 0/1; item đúng, không đổi offhand |
| L11 Equipment | offhand trống tại 0, prop-shield tại 30, trống tại 70 | 29.9/30/69.9/70; mainhand giữ nguyên |
| L12 Variables | trainer.energy: (0,0),(40,1), Linear | tick 20 = 0.5; đúng consumer; root không đổi |
| L13 Pose | armR rotation X delta: (0,0),(30,60),(60,0), Linear | tick 15/30/45 = 30/60/30 độ; armL và root không đổi |
| L14 Transform | prop local X: (0,0),(40,2); scale giữ (1,1,1) | tick 20 local X=1; world position tính đúng theo parent của fixture |
| L15 Anchor | prop mới gắn vào socket handR, offset zero; đổi pose tay | quan hệ đúng; world prop khớp công thức tại 0/20/40; không kiểm tra bằng ảnh đơn thuần |
| L16 Tổng hợp | 120 tick: đổi slot tại 40; crouch 60–80; offhand shield 20–100; root đứng yên | đúng biên từng đoạn và các track giữ nguyên; không hướng dẫn từng click |

Các bài L09–L15 có chế độ mẫu và làm theo; đáp án L16 mở riêng. Khi chưa giải quyết bằng chứng tương ứng, chỉ cung cấp bài mô phỏng gắn nhãn; phần “áp dụng trong game” chưa được xác nhận và không tính đạt toàn đợt.

## 17. Đợt 3 — Model, Texture, Actions, VFX và loại morph
### 17.1 Khả năng và catalog
| ID | Chức năng | Đầu ra |
|---|---|---|
| F19 | Model | Chọn mẫu từ catalog đã đóng gói; xem khả năng và rig đi kèm |
| F20 | Texture | Đổi texture tương thích material slot; khôi phục mặc định |
| F21 | Actions | Đặt clip hành động lên lane theo thời gian; tua có kết quả xác định |
| F22 | VFX | Đặt hiệu ứng mẫu, điều chỉnh tham số hữu hạn; tua lùi tái tạo được |
| F23 | Theo loại morph | Bài học và track lọc theo capability, không chỉ dựa vào tên morph |

D3 dùng các profile trainer: humanoid-lite, rig-lite, static-prop, effect-lite.
Tên morph thật và danh sách thuộc tính phải bổ sung từ V13; các profile này không được ghi như danh sách chính thức của BBS.
Catalog gồm assetId, version, loại, đường dẫn tương đối trong gói, hash, license/source, thumbnail, capabilities và compatibilityId.
Không nhập model tùy ý, không tải tài sản từ URL người học và không xử lý BOBJ ở D3.

### 17.2 Model và Texture
Model/texture trong D3 là cấu hình của Replay, không phải track chuyển model/texture theo tick.
- Chọn model mở preview riêng; thay thật phải có bảng tác động tới parts, tracks, actions, equipment và attachments.
- Cho thay trực tiếp khi cùng compatibilityId và mọi tham chiếu vẫn hợp lệ.
- Khác compatibilityId mà đã có dữ liệu phụ thuộc: chặn thay, cho tạo Replay mới. Không tự retarget hoặc xóa key.
- Undo thay model khôi phục model, texture và cấu hình trước đó.
- Texture chỉ chọn trong catalog, đúng material slot và compatibilityId; UV thuộc asset.
- Asset thiếu khi mở project: hiển thị lỗi có ID, giữ nguyên dữ liệu để xuất dự phòng, không chấm đạt với placeholder.
- Đổi texture không đổi rig, key hoặc lesson progress ngoài việc đánh dấu cần kiểm tra lại nếu asset là một rule của bài.
- Thông báo tải lỗi có nút thử lại; không dùng fallback rồi báo model đã tải đúng.

### 17.3 Actions
Action là clip mẫu của trainer; tên/ý nghĩa action thật trong BBS chờ V14.
Mỗi clip khai báo duration, rig compatibility, các node bị tác động và sampling function.
Một action instance gồm id, replayId, clipId, startTick, sourceIn, sourceOut, speed.
- speed hữu hạn thuộc [0.25,4]; sourceIn >= 0, sourceOut > sourceIn và không vượt clip.duration.
- endTick = startTick + (sourceOut-sourceIn)/speed; phải nằm trong duration dự án.
- Khoảng hoạt động [startTick,endTick); ngoài khoảng trả base pose cộng poseDelta.
- sourceTick = sourceIn + (projectTick-startTick) × speed.
- Không hỗ trợ reverse, blend, action loop hoặc nhiều action chồng nhau trên cùng Replay ở D3.
- Khi tạo/kéo/đổi speed gây overlap: từ chối toàn thao tác, giữ clip cũ và báo clip xung đột.
- Hai clip có end/start bằng nhau hợp lệ; tại biên chỉ clip sau hoạt động.
- Action clip thay base pose trên các node khai báo; state base áp cho node còn lại; poseDelta từ D2 áp sau kết quả đó.
- Root motion tắt trong các clip mẫu; Position track vẫn là nguồn vị trí Replay.
- Thay source range/speed không tự dời clip sau. Một thao tác là một bước Undo.
- Scrub gọi trực tiếp sampler; không cần phát từ đầu để có pose đúng.

### 17.4 VFX
Hiệu ứng mẫu gồm flash và burst bằng hình học đơn giản tự tạo; không cam kết renderer giống particle của Minecraft.
Instance gồm id, effectId, replayId, partId/anchorId tùy chọn, startTick, durationTicks, seed và params.
- Flash có intensity [0,1], color RGB mỗi thành phần [0,1]; burst có count nguyên [1,100], lifetimeTicks [1,40].
- durationTicks > 0, nằm trọn trong project; burst.durationTicks phải >= lifetimeTicks.
- D3 tối đa 20 effect instance và 500 hạt đang sống. Cấu hình vượt ngân sách bị từ chối; không cắt bớt để chấm đạt.
- seed nguyên không âm 32-bit; cùng project/tick/seed sinh cùng trạng thái.
- Burst sinh một đợt ở startTick. Hạt được tính từ tuổi tuyệt đối và seed, không tích lũy theo frame.
- Hiệu ứng hoạt động trong [startTick,startTick+durationTicks); đúng cuối phải biến mất.
- VFX gắn anchor dùng world anchor hiện tại; hiệu ứng burst mẫu dùng local space, nên đi cùng anchor suốt vòng đời. Đây là lựa chọn trainer.
- Visible=false trên đối tượng gắn làm VFX ẩn nhưng tuổi vẫn tiến theo timeline; hiện lại không phát lại từ đầu.
- Pause đóng băng thời gian hiệu ứng; scrub lùi hoặc loop playback không nhân đôi hạt.
- Thay seed/params là command; không tự đổi seed mỗi lần bấm Play.
- Giảm chất lượng render chỉ giảm chi phí hiển thị; dữ liệu evaluator và bộ chấm không thay đổi.

### 17.5 Bài tập D3
| Bài | Nhiệm vụ | Điều kiện đạt |
|---|---|---|
| L17 Model/capability | Chọn rig-lite cho bài Pose, xem vì sao static-prop không hỗ trợ Pose | Đúng asset/capability; lựa chọn không hỗ trợ phải bị từ chối, không tự chuyển fixture |
| L18 Texture | Đổi texture-compatible của prop sang mẫu blue-check trong catalog | Đúng asset/material slot; transform/key không đổi; Undo phục hồi |
| L19 Action | Clip wave mẫu dài 40 tick; đặt start=20, source 0–40, speed=1 | Bắt đầu 20, kết thúc 60; sample 40 tương ứng source 20; 60 về base |
| L20 Timing action | Clip dài 40, start=20, source 0–40, speed=2 | Kết thúc 40; tick 30 đọc source 20; root không trôi |
| L21 VFX | Burst start=40, duration=20, lifetime=20, count=20, seed=7 | Trước 40 không có hạt; 40 sinh đúng; 60 hết; tua 50→30→50 cho cùng trạng thái |
| L22 Shot tổng hợp | 120 tick: Đen đi X -2→1 trong 0–40; wave 40–80; Gỗ Xưa ẩn 90–110; burst tại Đen 60–80; texture theo đề | Quỹ đạo và khoảng clip/VFX đúng; không overlap; asset đúng; không nhầm Replay |

L22 là bài tự làm; rubric chia chuyển động, action, VFX, visibility và tính toàn vẹn dữ liệu. Chỉ passed khi mọi nhóm bắt buộc đạt, không lấy tổng điểm để bỏ qua nhóm sai.
Tất cả bài vẫn có phần chuyển sang game; phần chưa được xác minh phải ghi cụ thể thao tác còn thiếu bằng chứng.

## 18. Hợp đồng dữ liệu mở rộng và khả năng tương thích
### 18.1 Phiên bản
Đề xuất schemaVersion 1 cho D1, 2 cho D2, 3 cho D3; đây là kế hoạch schema, chưa phải các phiên bản đã phát hành.
Không thay âm thầm ý nghĩa field cũ. File xuất có format="bbs-fs-trainer", schemaVersion và producerVersion; không đổi đuôi thành .bobj.
Phần format/producerVersion là bổ sung cho Project ở mục 8, áp dụng từ lần triển khai đầu tiên.

| Dữ liệu bổ sung | Trường và ràng buộc |
|---|---|
| FixtureDefinition | id, version, formParts, poseNodes, anchors, propertyDefinitions, capabilities, defaults |
| PropertyDefinition | id, valueType, unit, allowedValues/range, nullable, interpolationModes, evidenceIds |
| Replay D2 | fixtureVersion, hotbarSlots, variableDefinitions, attachment tùy chọn; cấu hình equipment base theo slot |
| Track D2 | targetKind=formPart/poseNode/variable/replay; targetId; propertyId vẫn xác định kiểu |
| Attachment | targetReplayId, targetNodeId, anchorId, offsetTransform; kiểm tra chu trình toàn graph |
| Project D3 | catalogVersion; actions[]; effects[]; assets tham chiếu catalog đóng gói |
| Replay D3 | modelAssetId, textureBindings theo materialSlotId |
| ActionInstance | Các field mục 17.3; endTick được suy ra, không lưu hai nguồn chân lý |
| EffectInstance | Các field mục 17.4; params validate theo effectId |
| EvidenceRecord | id, featureId, kind, sourceRef, commit/version, observation, limitation, checkedAt |
| ValidationResult | lessonId, lessonVersion, ruleSetVersion, projectRevision, passed, rules[], checkedAt |

### 18.2 Thứ tự đánh giá một tick
1. Xác thực cấu hình, fixture và tài sản trước khi mở project.
2. Đọc Position/Visible và các track rời rạc của Replay.
3. Tính state base, action pose, rồi poseDelta theo mục 16–17.
4. Tính local/world transforms theo thứ tự cha trước con.
5. Giải attachment graph theo topo; cập nhật equipment và consumer biến.
6. Tính VFX từ tick tuyệt đối/seed và visibility.
7. Renderer và bộ chấm cùng dùng kết quả evaluator này.

Evaluator là hàm thuần theo project, fixture/catalog version và tick; không đọc DOM, đồng hồ hệ thống hoặc random không seed.
Nếu graph/asset không hợp lệ, trả lỗi; không một phần render đúng rồi vẫn báo bài đạt.

### 18.3 Nhập, migration, lưu
- D2 đọc schema 1 bằng migration copy sang schema 2; D3 đọc 1/2 qua chuỗi migration tuần tự.
- Migration giữ ID, tick, value, interpolation, baseValue, nhãn và các trục cũ; field mới nhận mặc định trung tính.
- Track cũ chuyển targetKind=formPart, targetId=partId; không tự chuyển Body parts thành bone.
- Giữ bản gốc tới khi validate và lưu bản mới thành công. Migration lỗi không thay project đang mở.
- Schema tương lai, capability không hỗ trợ hoặc asset ID không có: từ chối mở để chỉnh, cho giữ/tải file gốc.
- Không cung cấp downgrade mất dữ liệu; export luôn theo schema hiện hành.
- Progress cũ giữ lịch sử từng đạt; lessonVersion/ruleSetVersion thay đổi làm currentValidation cần kiểm tra lại.
- Undo history chỉ trong phiên, không bắt buộc serialize vào project.
- Giữ giới hạn 2 MB, 20 Replay, 200 track, 5.000 key từ mục 9 cho cả ba đợt; D3 thêm tối đa 100 action instance và 20 effect instance.
- Không nhúng binary texture/model vào JSON; các tài sản được đóng gói riêng.
- Parser kiểm tra kích thước trước parse; độ sâu cấu trúc tối đa 32, chuỗi tối đa 1.024 ký tự; từ chối khóa __proto__, prototype, constructor trong dữ liệu nhập.
- Chỉ dựng đối tượng theo allowlist schema; không merge trực tiếp object nhập vào cấu hình ứng dụng.

## 19. Ma trận nghiệm thu bổ sung
Mỗi test cần fixture đầu vào, thao tác, kết quả mong đợi và bằng chứng đầu ra. Tất cả dòng sau là tiêu chí dự kiến, chưa phải kết quả PASS.

| ID | Đợt | Kịch bản | Kết quả bắt buộc |
|---|---|---|---|
| A18 | D2 | State tại 19.9/20/60 | Chuyển đúng biên; Position giữ nguyên |
| A19 | D2 | Slot UI 1/9, data 0/8; ô trống | Không lệch chỉ số; ô trống không tự lấy item |
| A20 | D2 | Equipment null, item sai, slot sai | Null hợp lệ khi cho phép; dữ liệu sai không commit |
| A21 | D2 | Variable sai kiểu/ngoài miền | Giữ dữ liệu cũ; consumer đúng đối tượng |
| A22 | D2 | Pose armR khi root/state thay đổi | Đúng thứ tự base × delta; armL không bị sửa |
| A23 | D2 | Parent xoay và child dịch local X | World transform đúng công thức; phân biệt local/world |
| A24 | D2 | Anchor tự trỏ/chu trình/đích mất | Từ chối nguyên thao tác; không treo renderer |
| A25 | D2 | Gắn/tháo/Undo và prop có key | Prop hợp lệ phục hồi chính xác; prop có track bị chặn |
| A26 | D2 | Mở schema 1, lỗi migration, storage đầy | Bảo toàn bản gốc, ID/key; báo chưa lưu |
| A27 | D2 | L09–L16 sai một thuộc tính bắt buộc | Không đạt; báo đúng target/tick/giá trị |
| A28 | D3 | Thay model tương thích/không tương thích | Giữ dữ liệu hợp lệ hoặc chặn; không xóa key ngầm |
| A29 | D3 | Texture sai slot/asset mất | Thông báo đúng ID; không dùng placeholder để đạt |
| A30 | D3 | Action speed 0/NaN/overlap/clip biên | Từ chối sai; end==start clip sau hợp lệ |
| A31 | D3 | Scrub action từ hai hướng | Cùng tick cho cùng pose; Position không bị root motion |
| A32 | D3 | Action + state + poseDelta | Đúng precedence và node mask ở mục 17.3 |
| A33 | D3 | VFX seed cố định, pause và tua lùi | Không nhân đôi; đúng biên kết thúc; kết quả xác định |
| A34 | D3 | Vượt ngân sách hạt/instance | Từ chối trước commit, không cắt dữ liệu âm thầm |
| A35 | D3 | Migration 1→3, 2→3; import sai catalog | Giữ ngữ nghĩa D1/D2; lỗi không phá bài đang mở |
| A36 | D3 | L17–L22 và hồi quy L01–L16 | Mẫu đúng đạt; mẫu sai từng rule không đạt giả |

### 19.1 Chấm chuyển động tương đương
Kiểm tra vài tick chỉ là tối thiểu, không đủ chứng minh toàn quỹ đạo.
- Với số/nội suy: so trên hợp các mốc key của bài làm và đáp án; kiểm tra biên và sai lệch cực đại của từng đoạn.
- Dùng nghiệm/đánh giá có chặn sai số cho Linear/Constant/Sine; nếu chưa có thuật toán bảo đảm, bài đó giới hạn cấu trúc key được chấp nhận và ghi rõ trong đề.
- Không dùng lấy mẫu thưa rồi tuyên bố hỗ trợ mọi cấu trúc key tương đương.
- Với boolean/enum: so các khoảng hằng số và mốc chuyển của cả hai tập key.
- Action/VFX: kiểm tra cấu hình, khoảng hoạt động và sampler; không chỉ dựa vào thumbnail.
- Với invariant như root đứng yên: kiểm tra toàn khoảng, kể cả key thừa.

### 19.2 QA giao diện và hiệu năng
- Kiểm tra 1366×768, 1920×1080, 1024×768 và chế độ tab hẹp; inspector/hướng dẫn không che nút đặt key.
- Kiểm tra focus, label, tương phản, thao tác bàn phím và lỗi nhập liệu cho cả dropdown/picker.
- Mất WebGL/context, asset tải lỗi, storage lỗi: hiện trạng thái và giữ dữ liệu để xuất khi có thể.
- Đo fixture bài học và fixture giới hạn dữ liệu riêng; ghi CPU/GPU/RAM, OS, browser, kích thước viewport, số key/action/hạt.
- Mục tiêu dưới 100 ms đo từ thao tác đến cập nhật hiển thị, báo p95 của tối thiểu 100 thao tác.
- Mục tiêu 60 fps đo playback liên tục 60 giây sau warm-up; ghi median/p95 frame time, không chỉ FPS trung bình.
- Cả mục tiêu và kết quả đo phải ghi rõ điều kiện; không khẳng định hỗ trợ mọi máy có 32 GB RAM.
- Bản preview chưa đạt hiệu năng phải ghi giới hạn; không giảm độ chính xác evaluator để đạt số FPS.
- Toàn bộ runtime trong Minecraft hiện NOT_RUN; chỉ đổi trạng thái khi có bằng chứng thực tế.

## 20. Kế hoạch triển khai D2–D3 và hồ sơ bàn giao
| Gói | Công việc | Phụ thuộc | Nghiệm thu chính |
|---|---|---|---|
| D2.01 | Xác minh V07–V12, capability registry, mockup các picker | Core D1 ổn định | Bảng hỗ trợ và điểm chưa xác minh |
| D2.02 | Schema 2, migration, discrete evaluator, Hotbar/Equipment/Variables | D2.01 và mockup duyệt | A18–A21, A26 |
| D2.03 | Pose, Transform, local/world và Anchor graph | D2.02; V10–V12 tương ứng | A22–A25 |
| D2.04 | L09–L16, bộ chấm và hướng dẫn áp dụng | D2.02–D2.03 | A27; hồi quy A01–A17 |
| D2.05 | QA và gói D2 | D2.04 | A18–A27; giới hạn và bằng chứng |
| D3.01 | V13–V16, asset catalog/license và mockup Actions/VFX | D2 và đặc tả D3 duyệt | Catalog/khả năng/nguồn rõ ràng |
| D3.02 | Schema 3, migration, model/texture picker | D3.01 | A28–A29, A35 |
| D3.03 | Action lane, sampler, collision, Undo | D3.02 | A30–A32 |
| D3.04 | VFX xác định theo tick/seed và ngân sách | D3.02, transform D2 | A33–A34 |
| D3.05 | L17–L22 và shot tổng hợp | D3.03–D3.04 | A36 |
| D3.06 | QA toàn lộ trình và gói D3 | D3.05 | A01–A36; báo cáo đối chiếu |

Cấu trúc file dự kiến khi triển khai, chưa phải file đã tồn tại:
- docs/evidence/: hồ sơ phiên bản, track, ảnh và biên bản runtime.
- docs/mockups/: giao diện từng đợt và quyết định duyệt.
- src/core/: schema, validator, evaluator, transforms, commands.
- src/editor/: timeline, inspector, selectors và các picker.
- src/scene/: renderer, fixture, action/VFX samplers.
- src/lessons/ và fixtures/: bài, rubric, mẫu đúng/sai có version.
- src/persistence/: migration, storage, import/export.
- tests/: unit lõi, integration dữ liệu, UI và fixture chấm bài.
- docs/reports/: báo cáo theo gói và tổng hợp từng đợt.
Cây này là đề xuất phân vùng trách nhiệm, không buộc chọn framework trước khi duyệt mockup.

Mỗi gói triển khai đi trên nhánh riêng, PR có phạm vi và phụ thuộc rõ; không tự merge.
Tên đề xuất: docs/dN-spec-..., feat/dN-NN-..., fix/dN-NN-...; tên chính thức được chốt khi mở việc.
Nếu phụ thuộc chưa vào main, phải ghi rõ nhánh nền/PR phụ thuộc; không tuyên bố nhánh độc lập từ main khi chưa đúng.
REPORT của mỗi gói ghi: commit nền/đầu, file thay đổi, yêu cầu đáp ứng, lệnh thực chạy, PASS/FAIL/NOT_RUN, môi trường, bằng chứng và lỗi còn lại.
Không ghi PASS cho lệnh chưa chạy hoặc biến checklist thành bằng chứng test.

## 21. Danh sách xác minh mở rộng và quyết định còn chờ
| Mã | Cần xác minh bằng nguồn và/hoặc game | Chặn phần nào |
|---|---|---|
| V07 | Tên States, kiểu giá trị, default, cách giữ trạng thái theo tick | Ánh xạ và hướng dẫn game F12 |
| V08 | Slot Hotbar/Equipment, thứ tự ưu tiên và item representation | F13–F14 tương đương game |
| V09 | Scope/kiểu Variables, consumer và cơ chế biểu thức thật | Phần áp dụng F15; trainer không chạy biểu thức |
| V10 | Pose node, đơn vị góc, rest pose và quan hệ với Body parts | Ánh xạ F16 |
| V11 | Thứ tự Transform, local/world, rotation, scale và góc biên | Ánh xạ F17 |
| V12 | Anchor/socket, attachment, giữ world hay local khi gắn/tháo | Ánh xạ F18 |
| V13 | Loại morph, khả năng Model/Texture, slot vật liệu và tương thích | Ánh xạ F19–F20/F23 |
| V14 | Actions là clip/state/event gì theo từng morph; timing và ưu tiên | Ánh xạ F21 |
| V15 | Loại VFX, tham số, seed, local/world space và visibility | Ánh xạ F22 |
| V16 | Đối chiếu shot D3 đầu/cuối/biên và phối hợp hai Replay trong game | Nghiệm thu phần chuyển từ trainer sang game |

Mỗi V có owner khi bắt đầu triển khai, trạng thái open/in-progress/resolved, commit/JAR mục tiêu, kết quả quan sát và người kiểm tra.
Resolved phải có bằng chứng đủ cho đúng tuyên bố; đọc source không thay thế việc thử runtime.
S08 chưa có trong repo: phải thu thập lại hoặc nhận ảnh được phép dùng trước nghiệm thu độ giống giao diện. Không dựng ảnh giả rồi coi là ảnh gốc.
Không đưa thông tin định danh/tài sản riêng trong ảnh vào repo công khai nếu chưa được phép.

Quyết định thiết kế đã đề xuất trong v0.2:
- Giữ ba đợt, tổng 22 bài; D1 vẫn chỉ có 8 bài.
- D2/D3 dùng catalog và fixture hữu hạn để kiểm chứng được; không nhập tài sản tùy ý.
- Mở rộng schema theo đợt, không đổi nghĩa định dạng trainer thành định dạng mod.
- Những giới hạn action/anchor/pose được ghi là simulator; cần duyệt cùng mockup.
Đây là quyết định đề xuất để duyệt, không ghi là người dùng đã chấp thuận chi tiết.

## 22. Nội dung ngoài ba đợt và điều kiện mở rộng
| Nhóm | Trạng thái | Cần có trước khi viết đặc tả triển khai |
|---|---|---|
| Keyframe loop, motion offset | Có nhắc trong tài liệu 2.7; chưa thuộc D1–D3 | Chốt ngữ nghĩa biên, offset tích lũy, loại track, Undo và bài học; không nhầm Loop playback |
| Multi-select/duplicate key | Backlog | Chọn vùng, trùng tick, paste offset và command nguyên tử |
| Camera theo clip | Khảo sát riêng | Track camera thật, góc nhìn/FOV, chuyển shot và bộ chấm |
| IK, physics, constraints | Ngoài phạm vi | Solver, tính xác định và chi phí hiệu năng |
| Model editor/UV | Ngoài phạm vi | Pipeline tài sản, bản quyền và định dạng |
| Import BOBJ, xuất film BBS | Ngoài phạm vi | Định dạng/schema chuẩn, fixture thật, round-trip trong đúng bản game |
| FBX/Mixamo/iClone/Blender | Dự án pipeline riêng | Mapping rig, đơn vị, root motion, quyền dùng asset và xuất/nhập kiểm chứng |
| Thu âm/xuất video | Ngoài phạm vi | Đồng bộ audio, codec, tài nguyên và quyền media |
| Tài khoản/backend/AI | Không cần cho lộ trình hiện tại | Nhu cầu mới được duyệt, mô hình dữ liệu và vận hành |

Hoàn thành ba đợt nghĩa là hoàn thành phòng tập theo phạm vi trên, không có nghĩa thay thế Film Editor hay xuất được animation vào Minecraft.
Mọi mở rộng phải có yêu cầu, bằng chứng, bài tập, test và cổng duyệt riêng trước khi đưa vào cam kết.
