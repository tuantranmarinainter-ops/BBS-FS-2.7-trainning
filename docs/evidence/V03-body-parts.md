# V03 — Body parts và phạm vi track

Trạng thái: **source**, đã đọc tại commit [`f48c4fe341df4531f78428ed22bba93d5e6073df`](https://github.com/Wemppy4/bbs-fs/tree/f48c4fe341df4531f78428ed22bba93d5e6073df). Chưa kiểm thử runtime; chưa chứng minh commit này trùng hoàn toàn JAR phát hành 2.7. Kết luận dưới đây áp dụng cho mã tại mốc này, không tự động áp dụng cho mọi phiên bản.

## Bằng chứng mã nguồn

| Vấn đề | Mã nguồn xác nhận |
|---|---|
| Mục Body parts | [UIReplaysListPanel.java, dòng 39–54 và 81–108](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/film/replays/UIReplaysListPanel.java#L39-L54) tạo `UIForms`, chuyển path của hàng được chọn và nạp form của Replay; phần này hiện khi có Replay. |
| Cây hàng | [UIForms.java, dòng 60–110](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/forms/editors/UIForms.java#L60-L110) thêm form gốc, rồi duyệt đệ quy các `BodyPart` và form con; path gốc rỗng và path con được ghép từ ID part ([dòng 287–290](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/forms/editors/UIForms.java#L287-L290)). Khi path cũ không còn, chọn trở lại gốc. |
| Body part và bone | [BodyPart.java, dòng 27–32 và 57–60](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/BodyPart.java#L27-L32) có form được chứa và trường `bone` riêng để gắn; body part không mặc nhiên là bone giải phẫu. [TrackCatalog.java, dòng 172–191, 268–290](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/film/replays/tracks/TrackCatalog.java#L172-L191) xử lý bone tracks riêng theo model/rig và điều kiện hỗ trợ. |
| Chọn part | [UIReplaysEditor.java, dòng 546–564](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/film/replays/UIReplaysEditor.java#L546-L564) lưu path theo Replay và dựng lại danh sách; [TrackCatalog.java, dòng 81–96](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/film/replays/tracks/TrackCatalog.java#L81-L96) giữ track có form path đúng path chọn. |
| Track Replay | [UIReplaysEditor.java, dòng 647–665](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/film/replays/UIReplaysEditor.java#L647-L665) thêm curated Replay channels bên cạnh track của form được chọn, trước khi lọc category. [ReplayKeyframes.java, dòng 70–95](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/film/replays/ReplayKeyframes.java#L70-L95) định nghĩa `x`, `y`, `z`, `pitch`, `yaw`, `headYaw`, `bodyYaw` là channel của Replay. Chúng không trở thành track riêng của mỗi part khi đổi hàng. Category và bộ lọc có thể ẩn một số hàng. |
| Track form | [TrackCatalog.java, dòng 200–267](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/film/replays/tracks/TrackCatalog.java#L200-L267) lấy giá trị visible và có keyframe factory của form, thêm các track chuyên biệt có điều kiện; loại trừ `anchor` của form con. Shape keys và CEM cũng phụ thuộc model. [Form.java, dòng 48–49, 70–74, 98–99 và 147–160](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/Form.java#L48-L49) khai báo `visible`, `transform`, `anchor`, `parts` và thêm các giá trị form. Không suy ra mọi giá trị được khai báo đều là track hợp lệ. |

## Áp dụng cho trainer — suy luận thiết kế

- Fixture có thể có một form gốc duy nhất hoặc có thêm form con `aura` do trainer tự đặt. `root`/`aura` là tên và cấu trúc fixture minh họa, không phải danh sách part mặc định của mọi nhân vật BBS. Không tự thêm head, arm, leg vào cây như các bone có sẵn.
- Tách định danh track theo **chủ sở hữu**: kênh Replay (`x/y/z`, góc) thuộc Replay, còn `visible` thuộc form được chọn. Đổi part có thể đổi các track form mà không tạo bản sao độc lập của kênh Replay. Inspector nên nói rõ chủ sở hữu. Các track form chỉ bật khi fixture khai báo phù hợp; không gán chung toàn bộ track mọi loại form.
- Các path/ID và schema trainer là quy ước riêng; không tuyên bố dữ liệu trainer tương thích file film. Bone/pose là tính năng riêng ngoài F02 MVP.

## Còn pending

- Chưa thử game: xác nhận hiển thị thực tế, tên/nhãn, filter, thao tác chuột, hiệu ứng chọn, cũng như tác động thực tế của `visible` với một form con và con cháu.
- Chưa đối chiếu fixture `root`/`aura` với asset cụ thể hoặc hai ảnh tham chiếu; không khẳng định fixture đó tồn tại sẵn trong game.
- Chưa đối chiếu tính tương đương commit với JAR phát hành. Danh mục track cụ thể cần xét loại form, model, cấu hình và filter tại runtime; bảng trên không phải danh sách toàn diện.
