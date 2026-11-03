# P3 — Mockup và khảo sát bổ sung

Ngày: 03/11/2026. Đầu ra để duyệt, chưa phải MVP hoàn chỉnh. Thực hiện với 6 sub-agent `gpt-6.1-terra`, reasoning `high`; agent chính tích hợp và kiểm tra trình duyệt.

## File

- `mockups/index.html`: mockup offline tự chứa, điều hướng Replay/part/track, dialog, hướng dẫn và panel màn hình hẹp. Cảnh SVG; timeline L02 cố định, có ghi rõ giới hạn.
- `mockups/preview-desktop.jpg`: ảnh trình duyệt của bản mẫu, kích thước viewport 1363×936.
- `scripts/check-mockup.mjs`: smoke check JavaScript/DOM không cần dependency.
- `docs/MOCKUP-REVIEW.md`: cách mở và các điểm cần duyệt.
- `docs/evidence/V02-angles.md`, `V03-body-parts.md`, `V04-interpolation.md`: permalink nguồn tại commit khảo sát, kết luận có điều kiện và việc còn pending.
- `README.md`, `SPEC.md`: trạng thái P3 và các ảnh hưởng cần giải quyết trước P4.

## Kiểm tra

| Lệnh / thao tác | Kết quả | Phạm vi |
|---|---|---|
| `node scripts/check-mockup.mjs` | PASS | Parse JS; ID, aria-controls, dialog targets; chọn Replay/part/track, reset part, panel mobile, dialog, hướng dẫn trong DOM stub |
| Trình duyệt qua preview được hỗ trợ, viewport 1363×936 | PASS | Bố cục desktop, chọn Gỗ Xưa, VFX/aura/visible, mở/đóng danh sách 8 bài; đã chụp ảnh |
| Visual ở 1024×768, 1366×768, 1920×1080 và mobile | NOT_RUN | Có CSS responsive và smoke check tab; chưa xác nhận hình ảnh tại các kích thước này |
| So sánh hai ảnh tham chiếu gốc | NOT_RUN | Ảnh chưa có trong repo |
| WebGL, timeline editor, playback, undo, chấm bài, persistence | NOT_RUN | Chưa triển khai P4/P5 |
| Thử trong Minecraft/BBS FS 2.7 | NOT_RUN | Không có phiên game; các khảo sát chỉ ở mức source |

Không tính kiểm tra source hoặc DOM stub là runtime trong game. Chưa xác nhận JAR phát hành trùng commit khảo sát. L04 vẫn khóa.

## Bước tiếp theo

Duyệt đặc tả và mockup theo cổng bàn giao trong SPEC; đối chiếu ảnh gốc. Trước P4, tách ownership kênh Replay và form trong schema Track theo V03. Sau đó mới triển khai core/timeline/WebGL/lưu và bộ chấm bài. Không tự merge PR.
