# Tự chạy, kiểm thử và chụp ảnh

Workflow [Trainer QA](../.github/workflows/auto-qa.yml) chạy khi có push, pull request hoặc được khởi động thủ công trong tab **Actions**. Nó chỉ đọc mã, không merge và không xuất bản ứng dụng.

Mỗi lượt: chạy npm test, npm run build, cài Chromium, chạy scripts/browser-qa.mjs. Màn hình và báo cáo nằm trong artifact **trainer-qa** của lượt chạy, giữ 14 ngày. Trong GitHub: Actions → Trainer QA → chọn lượt chạy → kéo xuống Artifacts → trainer-qa. Mở report.md và hai ảnh current.png, bbs.png trong thư mục qa; ci-summary.md và các log cho biết bước thất bại hay bị bỏ qua.

Lệnh tự chạy trên máy đã có Node và quyền cài package:

```bash
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium
npm test
npm run build
node scripts/browser-qa.mjs
```

Chromium Linux có thể cần `npx playwright install --with-deps chromium` và quyền cài phụ thuộc hệ điều hành. Script ghi artifacts/qa/. Workflow cài dependency để test, không làm Playwright trở thành dependency khi chạy app thông thường.

Kết quả browser là thử nghiệm trên máy CI; không khẳng định GPU thật, Minecraft, BOBJ hoặc độ giống pixel với ảnh tham chiếu. Nếu cài browser lỗi, bước browser bị bỏ qua và workflow vẫn đánh dấu thất bại; ảnh có thể không tồn tại. Chỉ gọi PASS khi cả test/build/browser đều thành công. Báo cáo không tự gửi tin nhắn hay tải lên dịch vụ ngoài GitHub Actions.
