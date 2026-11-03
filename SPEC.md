# ĐẶC TẢ SẢN PHẨM — BBS FS 2.7 trainning
Phiên bản tài liệu: 0.1 · Ngày: 03/11/2026
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
| P2 | SPEC.md v0.1 | Bản này, chờ duyệt |
| P3 | Mockup desktop và màn hình hẹp | Đã có đề xuất trong mockups/index.html; chờ duyệt, xem docs/MOCKUP-REVIEW.md |
| P4 | Core, timeline, cảnh, lưu | Chưa thực hiện theo đặc tả |
| P5 | 8 bài và bộ chấm | Chưa thực hiện theo đặc tả |
| P6 | Báo cáo QA và đối chiếu game | Chưa thực hiện |

Bản HTML thử trước đây không phải nguồn chuẩn và chưa được nghiệm thu.
Cổng triển khai: chủ dự án duyệt đặc tả, sau đó duyệt mockup trước khi hoàn thiện logic.
Thay đổi phạm vi phải ghi quyết định và cập nhật đặc tả; không tự coi đợt 2/3 thuộc MVP.

## 14. Bổ sung khảo sát cho bước P3 (03/11/2026)

Mockup chỉ có điều hướng bố cục; cảnh SVG và timeline là minh họa. Chưa triển khai P4, chưa duyệt giao diện, chưa xác nhận hoàn thành MVP.

Kết quả khảo sát mới được ghi riêng để không coi hợp đồng trainer v0.1 là hành vi đã thử trong game:

- [V02 — Góc](docs/evidence/V02-angles.md): bốn kênh riêng, các đường render có điều kiện; vẫn cần fixture runtime trước khi mở L04.
- [V03 — Body parts](docs/evidence/V03-body-parts.md): cây form gốc/form con; x/y/z và các góc thuộc Replay, còn visible thuộc form. Trước P4 cần sửa mô hình Track ở mục 8 để phân biệt chủ sở hữu Replay và form; không tạo bản sao kênh Position cho từng part. Chuỗi Replay → part → track là luồng chọn UI, không phải bằng chứng sở hữu dữ liệu.
- [V04 — Nội suy](docs/evidence/V04-interpolation.md): đường channel khảo sát dùng nội suy của key đầu đoạn; nhãn nguồn là Sine In/out. Constant và Step khác nhau. Tương đương runtime, tick phân số và từng loại track còn cần kiểm tra.

Các kết quả trên là bằng chứng source tại commit khảo sát, không đổi thành runtime; V01 và việc đối chiếu hai ảnh gốc vẫn chưa giải quyết.

