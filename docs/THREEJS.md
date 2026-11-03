# Cảnh Three.js

Three.js r186 được đóng gói trong app/vendor/, đã kiểm tra blob SHA với tag upstream r186 và kèm giấy phép MIT. Mã ứng dụng không tải thư viện từ CDN.

Chạy npm start rồi mở localhost:8080. Canvas dùng Scene, Group, Mesh, PerspectiveCamera và Raycaster thực. Position, Visible, Pose, equipment, tint/model, actions và VFX đọc từ cùng project state; preview không sửa key.

## Hai chế độ dựng hình

- WebGL2: Three.WebGLRenderer, ưu tiên khi trình duyệt hỗ trợ.
- Phần mềm: vẫn là scene graph, geometry, ma trận camera và phép chiếu Three.js; vẽ tam giác/đường lên Canvas2D. Có thể xoay góc nhìn, chọn vật thể, tua/phát và xem nhân vật di chuyển. Nhãn UI ghi rõ đang dùng phần mềm. Ánh sáng phẳng và occlusion đơn giản, không texture/shadow đầy đủ; không thay thế nghiệm thu GPU.

Nếu cả hai backend không khởi tạo được, ứng dụng báo lỗi 3D. Không âm thầm dùng ảnh tĩnh.

## Thao tác

Kéo trái để orbit, Shift+kéo hoặc chuột giữa/phải để pan, cuộn để zoom. Bấm nhân vật để chọn Replay; dùng Trước/Bên/Trên/Phối cảnh hoặc đặt lại góc nhìn. Sửa giá trị chỉ xem trước, bấm Đặt key mới lưu. Các góc và tư thế vẫn là quy ước trainer; L04 chờ kiểm thử game.

Browser QA đã kiểm tra backend phần mềm: hình nhân vật, lưới, orbit, Raycaster, preview và tua L02. GPU/WebGL2 chưa được thử trong phiên này. Xem REPORT.md cho kết quả và ảnh docs/qa/threejs-desktop.jpg.
