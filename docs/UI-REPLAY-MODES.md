# Giao diện Replay: nguồn và giới hạn đối chiếu

Có hai lựa chọn ở thanh trên: **Hiện tại** (mặc định) và **BBS / Minecraft**.
Chuyển giao diện không đổi project, keyframe, tiến độ bài hay nội dung đã nhập.
Lựa chọn được lưu riêng trên thiết bị; nếu trình duyệt chặn lưu, lựa chọn vẫn dùng được trong phiên.

BBS / Minecraft là giao diện mô phỏng phục vụ học tập, **chưa khẳng định giống hệt mod**.
Hai ảnh tham chiếu đã được nhắc trong SPEC chưa có trong repo; cần ảnh gốc cùng phiên bản để so sánh vị trí và chi tiết.

Nguồn kiểm tra tại commit `f48c4fe341df4531f78428ed22bba93d5e6073df`:

- [UIReplaysListPanel.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/film/replays/UIReplaysListPanel.java): Replay list, thanh thêm/tìm kiếm và Body parts ở dưới. Giao diện mới xếp Body parts xuống cuối cột trái trên desktop. Thanh thêm/tìm kiếm chưa được triển khai.
- [UIReplaysEditor.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/film/replays/UIReplaysEditor.java): nhóm Replay, Form, Pose, IK, Physics; thanh category, thu gọn section và Actions. Trainer hiện dùng danh sách nhóm Track có sẵn; chưa mô phỏng đầy đủ category bar, IK/Physics hoặc Actions timeline thật.
- [UIFilmPanel.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/film/UIFilmPanel.java): camera/replay/actions và layout dock. Trainer vẫn dùng bố cục ba cột và thanh đổi chiều cao; chưa có hệ thống dock tương đương.

Ảnh gốc, hành vi trong Minecraft, tỷ lệ UI và các menu thật chưa kiểm thử runtime. Không có nút giả để biểu diễn phần chưa triển khai.
