# BBS FS 2.7 trainning

Phòng tập tiếng Việt trên trình duyệt: chọn Replay, đặt key, xem nội suy, làm bài và kiểm tra dữ liệu. Trainer độc lập, không phải Minecraft hoặc bản sao đầy đủ của mod.

## Chạy

Cần Node.js 20 trở lên, không cần cài dependency hoặc tài khoản.

```sh
npm start
```

Mở http://localhost:8080. Ứng dụng dùng ES modules, cần HTTP cục bộ; không mở index.html bằng file://. Chạy offline sau khi tải gói, không dùng CDN/backend. Cảnh 3D cần WebGL.

```sh
npm test
npm run build
```

Build tĩnh ở dist/. Không tự triển khai công khai. mockups/index.html là bản mẫu P3 cũ.

## Đã có mã

| Đợt | Nội dung |
|---|---|
| 1 | Replay, form parts, Position, Visible, keyframe CRUD/kéo/di chuyển bằng tick, timeline, ba kiểu nội suy, playback, Undo/Redo, bài học, lưu/nhập/xuất JSON |
| 2 | States, Hotbar, Equipment, Variables, Pose, Transform, Anchor trong fixture trainer; bài riêng từng nhóm |
| 3 | Model tự tạo, màu Texture, Actions và VFX minh họa; bài riêng từng nhóm |

Danh mục có 21 bài (20 mở được, L04 khóa): 8 cơ bản, 2 phối hợp và 11 chuyên đề. L03 có ba giai đoạn độc lập. Bài tách chế độ có hướng dẫn/tự làm; đáp án không ghi đè bài làm. Bài học và tập tự do lưu riêng.

Đợt 2/3 là tập con có tác dụng trong fixture trainer, nhãn simulator; không khẳng định hỗ trợ mọi trường hay morph BBS FS.

## Giới hạn nghiệm thu

- Kết quả thật trong [REPORT.md](REPORT.md). Browser QA không hỗ trợ WebGL; chưa xác nhận hình ảnh và tương tác 3D.
- L04 khóa chờ fixture góc thử trong game, vì vậy chưa hoàn tất MVP đủ 8 bài.
- Chưa thử Minecraft/BBS FS 2.7, chưa chứng minh commit khảo sát trùng JAR; hai ảnh gốc chưa có trong repo.
- Không BOBJ/film BBS, IK, vật lý, UV, thu âm hoặc xuất video. JSON chỉ dành cho trainer.
- Revision/lease nhiều tab có giới hạn localStorage, không bảo đảm giao dịch nguyên tử.

Chi tiết: [các đợt](docs/PHASES.md), [đặc tả](SPEC.md), [API triển khai](IMPLEMENTATION.md).

Nguồn: [Wemppy4/bbs-fs](https://github.com/Wemppy4/bbs-fs), [Wiki 2.7](https://github.com/Wemppy4/bbs-fs/wiki/2.7.0), commit f48c4fe341df4531f78428ed22bba93d5e6073df. Bằng chứng source trong docs/evidence/.
