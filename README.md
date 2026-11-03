# BBS FS 2.7 trainning

Phòng tập HTML học BBS FS 2.7 bằng tiếng Việt: mô phỏng Film Editor, hướng dẫn từng bước và bài tập có kiểm tra.

## Trạng thái
Đang khảo sát và đặc tả. Chưa có ứng dụng hoàn thiện trong repo.
Đã có bản thử sơ bộ ngoài repo, chưa được duyệt hoặc đối chiếu đầy đủ; không coi là bản chuẩn.
Theo yêu cầu chủ dự án: lập kế hoạch trước, duyệt giao diện trước khi triển khai tiếp.

## Mục tiêu
Hiểu chức năng → xem mẫu → làm theo → tự thực hành → áp dụng trong Minecraft.
Giao diện tham chiếu hai ảnh người dùng cung cấp: Replay bên trái, viewport phía trên, timeline phía dưới và inspector bên phải.

## Phạm vi MVP
- Chọn Replay: Đen, Gỗ Xưa và hiệu ứng minh họa.
- Chọn Body parts và hiển thị các track tương ứng.
- Position: x, y, z, pitch, yaw, headYaw, bodyYaw.
- Tạo, chọn, sửa, xóa, kéo keyframe; tua timeline; phát/dừng.
- Nội suy: Linear, Constant và một kiểu Ease In/Out đã đối chiếu.
- Visible: bật/tắt hiển thị.
- Học có hướng dẫn, tập tự do, kiểm tra dữ liệu bài làm, lưu tiến độ.

## Kế hoạch
1. Khảo sát nguồn: xác minh phiên bản, lập bảng chức năng và trạng thái bằng chứng.
2. Đặc tả: luồng thao tác, mô hình dữ liệu, bài tập và tiêu chí nghiệm thu.
3. Mockup: duyệt bố cục giống Film Editor trước khi hoàn thiện logic.
4. Mô phỏng: triển khai cảnh, timeline, inspector và tương tác.
5. Bài tập: mục tiêu, làm mẫu, làm theo, tự làm, chấm bài, hướng dẫn chuyển sang game.
6. QA: đối chiếu BBS FS 2.7; ghi rõ phần đơn giản hóa hoặc chưa xác minh.

## Bài học dự kiến
1. Nhận biết giao diện, Replay và track.
2. Hai keyframe tạo chuyển động.
3. Phân biệt X/Y/Z.
4. Phân biệt góc thân, đầu và cúi/ngẩng.
5. So sánh nội suy.
6. Ẩn/hiện đúng thời điểm.
7. Phối hợp hai nhân vật.
8. Tự dựng một shot ngắn.

## Phần mở rộng
- Đợt 2: States, Hotbar, Equipment, Variables; Pose, Transform, Anchor.
- Đợt 3: Model, Texture, Actions, VFX và bài học theo loại morph.
- Camera, IK, vật lý, nhập BOBJ và xuất film cần khảo sát riêng; chưa cam kết trong MVP.

## Tiêu chí nghiệm thu
- Bố cục bám ảnh tham chiếu, tên chức năng giữ nguyên kèm giải thích tiếng Việt.
- Thao tác thực sự làm thay đổi cảnh và dữ liệu.
- Chấm bài theo đúng Replay, track, thời điểm và giá trị; giải thích lỗi cụ thể.
- Không đồng nhất Step với Constant; không dùng tên Smooth chung thay cho tên nội suy của mod.
- Không trình bày phím tắt tự đặt như phím tắt chính thức.
- Phân biệt rõ điều đã xác minh bằng mã nguồn, bằng tài liệu và điều chưa thử trong game.
- Không coi bản HTML là Minecraft hoặc bản sao đầy đủ của mod.

## Nguồn tham chiếu
- Repo: https://github.com/Wemppy4/bbs-fs
- Wiki 2.7: https://github.com/Wemppy4/bbs-fs/wiki/2.7.0
- Bản phát hành 1.20.1: https://www.curseforge.com/minecraft/mc-mods/bbs-fs/files/8934314
- Mốc mã nguồn khảo sát: f48c4fe341df4531f78428ed22bba93d5e6073df.
  gradle.properties ghi minecraft_version=1.20.1 và mod_version=2.7.
  Chưa xác minh mốc này trùng hoàn toàn với JAR phát hành.

Dự án học tập độc lập, không phải sản phẩm chính thức của Mojang hoặc nhóm BBS FS.
