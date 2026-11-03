# BBS FS 2.7 Training

Phòng tập học BBS FS 2.7 bằng tiếng Việt, bám giao diện và chức năng mã nguồn gốc.

## Ưu tiên hiện tại
**Giúp người dùng hiểu các phần trong ảnh đã chụp trước, rồi mới làm tiếp phần mở rộng.**
Mỗi phần: tên và công dụng → thao tác → ví dụ ngắn → tự thực hành → xác nhận đã hiểu. Giữ tên English kèm giải thích Việt và đúng vị trí giao diện.
Hai ảnh tham chiếu được ghi tên trong SPEC nhưng chưa có file trong repo; phải đọc đúng ảnh trước khi đánh số vùng/nút. Chưa coi người học đã hiểu chỉ vì đã mở bài.

## Tài liệu
- [SPEC v0.3 — ưu tiên học từ ảnh và đặc tả toàn bộ](SPEC.md)
- [Bảng đối chiếu mã nguồn BBS FS 2.7](docs/BBS27-SOURCE-MAP.md)
- [Fixture và điều kiện đạt cho bài L23–L60](docs/LESSON-FIXTURES-v0.3.md)
- [Đặc tả v0.2 lưu lịch sử, gồm fixture L01–L22](docs/history/SPEC-v0.2.md)

## Trạng thái
Đang đặc tả; chưa có ứng dụng hoàn thiện trong repo. Tài liệu chưa phải kết quả triển khai hoặc nghiệm thu.
Đặc tả tổng thể mở rộng thành 8 đợt, 60 bài; người học bắt đầu bằng các phần trong ảnh, không học toàn bộ cùng lúc.
Mockup và logic cần đi theo nguồn đã đối chiếu. Tác vụ Minecraft/native không được báo đã chạy chỉ bằng mô phỏng web.

| Đợt | Phạm vi |
|---|---|
| D1 | Giao diện nền, Replay, keyframe, timeline, lưu và bài cơ bản |
| D2 | States, Hotbar, Equipment, Variables, Pose, Transform, Anchor |
| D3 | Forms/materials/model animation, multi-key, graph, loop, motion shift, quản lý Film/layout |
| D4 | Camera Editor, camera clips, âm thanh/ảnh/video/phụ đề |
| D5 | Film Actions, recording, IK, constraints, physics, bake |
| D6 | Morphing, Model blocks, Particles, Model editor, Textures, Audio, Settings |
| D7 | Trainer JSON, native Film, BOBJ, Blender/FBX và round-trip |
| D8 | Quality, offline/backup, export queue, bài cuối và QA toàn bộ |

## Nguồn chuẩn
[Wemppy4/bbs-fs](https://github.com/Wemppy4/bbs-fs), commit f48c4fe341df4531f78428ed22bba93d5e6073df: gradle.properties ghi mod 2.7 / Minecraft 1.20.1.
Đã lập danh mục 14 forms, 19 camera/media clips và 12 action clips tích hợp từ registry nguồn. Chưa xác minh JAR phát hành trùng commit, chưa chạy kiểm thử Minecraft.
Java/Fabric UI cần port/adapters để chạy web; ưu tiên tận dụng bố cục, label, cấu trúc dữ liệu và thuật toán có test. Giữ license/attribution khi tái sử dụng nguồn.

Mỗi gói triển khai có PR và báo cáo PASS/FAIL/NOT_RUN/BLOCKED; không tự merge hoặc xuất bản.
Dự án học tập độc lập, không phải sản phẩm chính thức của Mojang hoặc nhóm BBS FS.
