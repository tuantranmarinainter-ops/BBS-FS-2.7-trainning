> Tài liệu lịch sử P3. Ứng dụng hiện tại ở index.html; chủ dự án đã yêu cầu code các đợt, xem docs/PHASES.md và REPORT.md.

# Hướng dẫn xem và duyệt mockup P3

## Mở bản mẫu

Mở trực tiếp `mockups/index.html` bằng trình duyệt hiện đại. Bản mẫu chạy offline, không cần cài đặt hoặc khởi chạy máy chủ. Nên xem ở kích thước desktop; trên màn hình hẹp dùng các tab Replay, Sân tập và Inspector.

## Có thể thao tác

- Chọn Replay, Body part và track để xem lựa chọn được phản ánh ở nhãn và inspector. VFX có thêm thành phần `aura` trong fixture đề xuất. Timeline là ví dụ cố định của Đen / root / x ở L02, không đổi theo lựa chọn.
- Mở danh sách bài học, giới hạn bản mẫu và nội dung cần duyệt; thu gọn hoặc mở hướng dẫn. Trên màn hình hẹp, chuyển tab vẫn giữ lựa chọn trong phiên xem.

Các lựa chọn này phục vụ điều hướng và xem thiết kế, không thay đổi dữ liệu bài làm. Cảnh SVG 2D là hình minh họa tĩnh, không phải WebGL hay kết quả tính animation. Key và playhead chỉ minh họa vị trí trên timeline.

## Chưa triển khai

Tạo, chọn, sửa, xóa hoặc kéo key; tua, phát/dừng, zoom và nội suy; chỉnh giá trị, Undo/Redo; bài học tương tác, chấm bài, lưu tiến độ và nhập/xuất dữ liệu đều thuộc giai đoạn sau. Các điều khiển liên quan đang bị vô hiệu hóa hoặc chỉ được trình bày để duyệt. Không có kết quả kiểm thử trong game từ mockup này.

## Các điểm cần duyệt

1. Bố cục Replay và Body parts bên trái, viewport và timeline ở giữa, inspector bên phải; cách bố trí ở màn hình hẹp.
2. Nhãn chức năng tiếng Anh kèm giải thích tiếng Việt, màu chọn, độ dễ đọc và cách mở hướng dẫn/danh sách bài.
3. Fixture và cách trình bày track, trạng thái chưa chọn key; ánh xạ Body parts còn chờ đối chiếu V03, nội dung góc quay còn chờ V02.
4. Hai ảnh tham chiếu gốc chưa có trong repo, vì vậy chưa thể đối chiếu trực tiếp độ giống. Cần bổ sung ảnh để xem lại trước khi chốt giao diện.

SPEC v0.1 và mockup đều là đề xuất, chưa được xác nhận duyệt. P4 chỉ bắt đầu sau khi giao diện được duyệt; việc mở hoặc thao tác bản mẫu không gửi quyết định duyệt.
