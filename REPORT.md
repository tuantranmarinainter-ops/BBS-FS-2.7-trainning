# Báo cáo triển khai trainer v0.2 — các đợt 1–3

Ngày 03/11/2026. Chủ dự án đã yêu cầu tiếp tục code toàn bộ các đợt, cho phép chuyển từ mockup sang triển khai. Nhóm gồm 6 sub-agent gpt-6.1-terra reasoning high; agent chính tích hợp, rà soát và kiểm thử browser. Không tự merge.

## Đầu ra

- index.html, app/main.js, app/styles.css: editor hoạt động, timeline và inspector, preview/commit, nhóm thuộc tính, lessons/progress, lưu/nhập/xuất, trợ giúp, mobile tabs, bộ lọc bài và điều chỉnh tỷ lệ viewport.
- app/core.js: state, key CRUD, ownership, nội suy và Undo/Redo.
- app/extensions.js: 11 nhóm điều khiển đợt 2/3 có bounds/options/applicability và nhãn simulator.
- app/scene.js: WebGL cục bộ, block fixture, trục/lưới, camera, selection, pose/model/tint/equipment/actions/VFX. Không dependency CDN.
- app/lessons.js: 21 bài, L03 ba giai đoạn; 20 bài mở được, L04 khóa. Có fixture/rules đúng đối tượng, nội suy và thuộc tính giữ nguyên; chống giả đạt bằng thay metadata.
- app/persistence.js: JSON validation giới hạn/schema/hierarchy/ownership, lưu lỗi/quota, revision/lease đa tab và phục hồi bản lưu hỏng sau xác nhận.
- Các *.test.mjs kiểm thử module và tích hợp. scripts/serve.mjs, scripts/build.mjs, package.json hỗ trợ chạy/build không dependency.
- README.md, SPEC.md, IMPLEMENTATION.md, docs/PHASES.md cập nhật phạm vi và giới hạn. Giữ mockup và docs/evidence lịch sử khảo sát.
- docs/qa/trainer-desktop.jpg: ảnh UI thực, có thông báo thiếu WebGL; không phải ảnh nghiệm thu renderer 3D.

## Kết quả kiểm tra

| Lệnh / phép thử | Kết quả | Phạm vi |
|---|---|---|
| npm test | PASS — 35/35 | Core, extensions, lessons, strict validation, storage/conflict, fixture roundtrip/isolation, lệnh vẽ scene qua WebGL stub |
| node --check app/main.js | PASS | Cú pháp module UI |
| npm run build | PASS | Đóng gói static dist/, không cần tải dependency |
| node scripts/serve.mjs + HTTP cục bộ | PASS | /, app/main.js, app/styles.css trả 200 và MIME đúng; cấu hình ẩn trả 404; đã dừng server QA |
| Browser desktop (ảnh QA 1348×926): L02 | PASS | Đặt key0=-2/key40=2; chấm đạt; tick20=0; move vào tick0 bị từ chối không mất key; sửa vô hiệu kết quả; Undo phục hồi và chấm lại đạt |
| Browser: lưu/đáp án | PASS | Mở lại bài sau refresh vẫn có hai key và đạt; đáp án dialog riêng không đổi giá trị bài ở tick20; không ghi đạt chỉ vì xem đáp án |
| Browser: đợt2/3 | PASS | Boolean States đặt được key; Model string block đặt được key; lọc đợt3 hiển thị 5 bài |
| Browser: lỗi bản lưu | PASS | Sau khi đổi cấu trúc fixture trong phát triển, bản lưu cũ không bị tự ghi đè; reset cần xác nhận và khôi phục lưu được |
| WebGL thực, shader/GPU, hình ảnh/label/camera | NOT_RUN | Browser QA không hỗ trợ WebGL; ứng dụng hiển thị lỗi đúng và ghi rõ chấm chỉ kiểm dữ liệu |
| Kéo key bằng pointer, phím tắt, đa tab thực | NOT_RUN toàn bộ | Có mã và test logic/stub tương ứng; chưa nghiệm thu toàn bộ bằng thao tác UI |
| Responsive các kích thước chuẩn/mobile | NOT_RUN visual | Có CSS/tab, chưa xác nhận ảnh ở 1024×768, 1366×768, 1920×1080/mobile |
| Minecraft/BBS FS, hai ảnh gốc, benchmark | NOT_RUN | Không có phiên game/ảnh gốc; chưa đo fps/độ trễ |

## Sửa trong rà soát tích hợp

Tách ownership Replay/form; chặn track không có renderer cho fixture; giữ đúng false và chuỗi; từ chối import rỗng/không root/cây vòng/giá trị sai. Thêm kiểm tra canonical fixture để đổi base metadata không được chấm đạt. L05 chỉ ghi thử curve khi phát đoạn Đen.x giữa hai key. Nhập xóa lịch sử thao tác hiện tại; kết quả cũ bị vô hiệu khi đổi bài làm.

Không tự ghi đè bản lưu lỗi; chặn chuyển khi conflict, hỏi trước khi bỏ thay đổi nếu lưu thất bại. Reset bản JSON hỏng dùng so sánh đúng raw đã quan sát. Theo dõi từng bài/giai đoạn/chế độ và giữ everPassed; sửa numeric không hợp lệ có thể phục hồi lại giá trị hợp lệ. Kết quả rule được thu gọn nhưng lỗi luôn hiển thị.

## Giới hạn và phần còn lại

Có mã cho ba đợt trong phạm vi trainer ghi tại docs/PHASES.md. Chưa hoàn tất nghiệm thu toàn bộ đặc tả: L04 vẫn khóa và MVP không được gọi là hoàn tất đủ 8 bài. Chưa chứng minh commit nguồn trùng JAR; không có runtime game. Đợt2/3 là tập điều khiển minh họa, chưa hỗ trợ toàn bộ morph/field mod, rig Mixamo, texture/UV thật hoặc engine hạt đầy đủ. Đáp án là dữ liệu trong dialog riêng, chưa có cảnh mẫu 3D phát độc lập. Thanh trượt có nhãn thay splitter kéo.

localStorage không có compare-and-swap nguyên tử nên lease/revision chỉ best-effort. WebGL cần thử thêm trên trình duyệt có hỗ trợ trước khi chốt renderer/camera/hình ảnh/hiệu năng. Không xuất BOBJ/film BBS/video, không IK/vật lý. Không tự triển khai công khai hoặc tự merge.
