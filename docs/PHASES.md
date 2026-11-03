# Triển khai các đợt — trainer v0.2

Ngày 03/11/2026, chủ dự án yêu cầu huy động tiếp code toàn bộ các đợt. Yêu cầu cho phép tiếp tục từ P3 vào mã ứng dụng, không tự merge. Main lúc bắt đầu chỉ có SPEC v0.1; đợt 2/3 mới nêu danh sách nhóm chức năng. Bảng này ghi tập điều khiển thực tế, không coi là sao chép toàn bộ mod.

## Đợt 1

- Replay Đen, Gỗ Xưa, VFX; form root và aura của VFX. Position/góc thuộc Replay; Visible thuộc form; đổi part không sao chép Position.
- Chọn track → tua tick → sửa giá trị xem trước → Đặt key. Đổi lựa chọn/tick sẽ bỏ nháp. Cập nhật key cùng tick, từ chối di chuyển vào key khác.
- Chọn/xóa/kéo key hoặc nhập tick đích; Undo/Redo 100 bước. Tua bằng thước hoặc ô số và nút; snap 1 hoặc 0.1 tick. Zoom/cuộn không đổi dữ liệu.
- Linear, Constant, Sine In/Out cho số; boolean/string giữ giá trị; giữ biên ngoài đoạn. Không tự wrap góc 350→10, không đồng nhất Constant/Step.
- Playback theo thời gian thực 20 tick/s, lặp playback riêng trainer; dừng khi ẩn tab.
- Three.js (WebGL2 hoặc dựng phần mềm có phối cảnh), sân lưới/trục, nhân vật khối tự tạo, chọn đối tượng, preset trước/bên/trên/phối cảnh. Kéo trái orbit; Shift+kéo hoặc kéo giữa/phải pan; cuộn zoom. Chế độ dựng hình được ghi rõ; khi cả GPU và Canvas2D không khả dụng thì báo lỗi. Chấm bài vẫn kiểm tra dữ liệu.
- L01–L08, L03 tách X/Y/Z, L04 khóa chờ V02. Có hướng dẫn/tự làm, đáp án dữ liệu riêng, chấm rule, giữ lịch sử từng đạt và yêu cầu kiểm tra lại sau sửa.
- Lưu theo bài/giai đoạn/chế độ và sandbox. JSON schema 1, validate trước thay thế, giới hạn 2 MB/20 Replay/200 track/5.000 key. Nhập/reset có xác nhận; có xuất dự phòng. Bản lưu lỗi không bị ghi đè; reset có xác nhận chỉ bỏ đúng bản lỗi đã quan sát nếu chưa có thay đổi khác.
- Xung đột tab khóa ghi và cho xuất/tải lại. Revision/lease best-effort vì localStorage không có compare-and-swap nguyên tử.

## Đợt 2

Tất cả là simulator, không thực thi lệnh game/script. Chỉ hiện track có renderer tương ứng. Số có giới hạn được kiểm tra khi chỉnh/nhập.

| Nhóm | Property | Phạm vi | Bài tập |
|---|---|---|---|
| States | states.sneaking/sprinting | Replay nhân vật, tư thế mẫu | E02-states |
| Hotbar | hotbar.slot (0–8) | Replay nhân vật, nhãn ô và vật cầm | E02-hotbar |
| Equipment | equipment.mainHand (none/sword/pickaxe), equipment.head (none/helmet) | Replay nhân vật, vật cầm và mũ tự tạo | E02-equipment |
| Variables | variable.intensity (0–2) | Replay, cường độ VFX đã bật | E02-variables |
| Pose | pose.headX/armX | Form root nhân vật, góc đầu/tay mẫu | E02-pose |
| Transform | transform.x/y/z/scale | Form hợp lệ, dịch cục bộ/tỉ lệ | E02-transform |
| Anchor | anchor.x/y/z | Root, điểm neo scale; cần scale khác 1 | E02-anchor |

E02 là bài phối hợp. Pose không chỉnh toàn rig Mixamo; Hotbar/Equipment không phải inventory Minecraft. Variables chỉ có biến cường độ, chưa có biểu thức tùy ý.

## Đợt 3

| Nhóm | Property | Phạm vi | Bài tập |
|---|---|---|---|
| Model | model.kind (figure/block) | Root nhân vật, khối tự tạo | E03-model |
| Texture | texture.color (white/red/blue/green) | Root nhân vật, tint bề mặt | E03-texture |
| Actions | action (idle/wave/jump) | Root nhân vật, chuyển động mẫu theo tick | E03-actions |
| VFX | vfx.kind (none/glow/sparks), vfx.size | Form hợp lệ, vòng/tia tự tạo và Visible | E03-vfx |

E03 phối hợp màu nhân vật và aura. Model không tải tài sản BBS, Texture chưa chỉnh texture/UV, Actions chưa bao phủ toàn bộ action mod, VFX chưa phải engine hạt/vật lý đầy đủ. Chưa có bộ bài cho mọi loại morph của mod.

## Kiến trúc và nghiệm thu

core.js giữ project/nội suy; extensions.js khai báo thuộc tính; lessons.js giữ fixture/rule; persistence.js validate/lưu; scene.js đọc state để vẽ; main.js điều khiển UI. Preview không sửa project. Không có dependency runtime ngoài.

Xem [REPORT.md](../REPORT.md). Node test scene dùng scene graph Three.js thật và kiểm tra phép chiếu phần mềm. Browser QA đã xác nhận cảnh/điều khiển 3D phần mềm, chưa thử nhánh WebGL2/GPU; chưa thử game, chốt V01/V02/V05 hoặc đối chiếu ảnh gốc. Hiệu năng và các kích thước responsive cần nghiệm thu thêm. L04 còn khóa nên đây là preview có giới hạn, chưa hoàn tất MVP trong SPEC.
