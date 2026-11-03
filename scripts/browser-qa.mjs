/** Run from repository root: node scripts/browser-qa.mjs. Requires Playwright + Chromium. */
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const out = 'artifacts/qa';
await mkdir(out, { recursive: true });
const result = { startedAt: new Date().toISOString(), status: 'FAIL', checks: [], errors: [], screenshots: [], limitations: ['Ảnh kiểm thử trình duyệt, không chứng minh giống giao diện Minecraft hoặc GPU thực.'] };
let server, browser, page;
const check = async (name, action) => {
  try { await action(); result.checks.push({ name, status: 'PASS' }); console.log(`PASS ${name}`); }
  catch (error) { result.checks.push({ name, status: 'FAIL', error: String(error.message || error) }); throw error; }
};
const assert = (value, message) => { if (!value) throw new Error(message); };
const freePort = () => new Promise((resolve, reject) => { const s = createServer(); s.once('error', reject); s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => resolve(port)); }); });
try {
  const port = await freePort();
  const url = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  let serverError = ''; server.stderr.on('data', data => { serverError += data; });
  server.on('error', error => { serverError += String(error); });
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error(`Server exited: ${serverError}`);
    try { if ((await fetch(url)).ok) { ready = true; break; } } catch {}
    await delay(100);
  }
  assert(ready, `Server did not become ready: ${serverError}`);
  const { chromium } = require('playwright');
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
  page = await context.newPage();
  page.on('pageerror', error => result.errors.push(`pageerror: ${error.message}`));
  await check('Mở ứng dụng và dựng cảnh 3D', async () => {
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    assert(response?.ok(), `HTTP ${response?.status()}`);
    await page.locator('#replays [data-replay]').first().waitFor();
    await page.waitForFunction(() => !document.querySelector('#renderer-status').textContent.includes('đang khởi tạo'));
    assert(await page.locator('#scene-error').isHidden(), await page.locator('#scene-error').textContent());
    result.renderer = await page.locator('#renderer-status').textContent();
  });
  await check('Chọn Replay và track', async () => {
    const choices = page.locator('#replays [data-replay]');
    assert(await choices.count() >= 2, 'Thiếu hai Replay');
    await choices.nth(1).click();
    assert((await page.locator('#breadcrumb').textContent()).includes('Gỗ Xưa'), 'Chọn Replay không cập nhật breadcrumb');
    await page.locator('#replays [data-replay="den"]').click();
    await page.locator('#tracks [data-track="x"]').click();
  });
  await check('Đặt hai key và xem giá trị giữa', async () => {
    await page.locator('#seek-tick').fill('0'); await page.locator('#seek-go').click();
    await page.locator('#value').fill('-2'); await page.locator('#put-key').click();
    await page.locator('#seek-tick').fill('40'); await page.locator('#seek-go').click();
    await page.locator('#value').fill('2'); await page.locator('#put-key').click();
    await page.locator('#seek-tick').fill('20'); await page.locator('#seek-go').click();
    assert(Math.abs(Number(await page.locator('#value').inputValue())) < 0.01, 'Giá trị x tại tick 20 phải là 0');
    assert(await page.locator('#timeline-inner [data-key]').count() >= 2, 'Chưa thấy hai key');
  });
  await check('Lưu bài và khôi phục khi tải lại', async () => {
    await page.waitForFunction(() => document.querySelector('#save-status').textContent.includes('Đã lưu'), null, { timeout: 10000 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('#replays [data-replay="den"]').waitFor();
    await page.locator('#seek-tick').fill('20'); await page.locator('#seek-go').click();
    assert(Math.abs(Number(await page.locator('#value').inputValue())) < 0.01, 'Không khôi phục đúng giá trị ở tick 20');
    assert(await page.locator('#timeline-inner [data-key]').count() >= 2, 'Không khôi phục hai key');
  });
  await check('Ảnh giao diện hiện tại', async () => {
    await page.locator('#ui-mode').selectOption('current');
    const file = `${out}/current.png`; await page.screenshot({ path: file, fullPage: true }); result.screenshots.push(file);
  });
  await check('Chuyển và khôi phục giao diện BBS', async () => {
    await page.locator('#ui-mode').selectOption('bbs');
    assert(await page.locator('body').getAttribute('data-interface') === 'bbs', 'Không chuyển sang BBS');
    const file = `${out}/bbs.png`; await page.screenshot({ path: file, fullPage: true }); result.screenshots.push(file);
    await page.reload({ waitUntil: 'networkidle' });
    assert(await page.locator('#ui-mode').inputValue() === 'bbs', 'Không nhớ lựa chọn giao diện');
    assert(await page.locator('body').getAttribute('data-interface') === 'bbs', 'Không khôi phục theme BBS');
  });
  await check('Không có lỗi JavaScript', async () => assert(result.errors.length === 0, result.errors.join('\n')));
  result.status = 'PASS';
} catch (error) {
  result.errors.push(String(error.stack || error));
  console.error(error);
  if (page) try { const file = `${out}/failure.png`; await page.screenshot({ path: file, fullPage: true }); result.screenshots.push(file); } catch {}
} finally {
  result.finishedAt = new Date().toISOString();
  try { await browser?.close(); } catch {}
  if (server && server.exitCode === null) server.kill('SIGTERM');
  await writeFile(`${out}/report.json`, JSON.stringify(result, null, 2) + '\n');
  const lines = ['# Báo cáo kiểm thử trình duyệt', '', `Kết quả: **${result.status}**`, `Thời gian: ${result.finishedAt}`, `Renderer: ${result.renderer || 'chưa khởi tạo'}`, '', ...result.checks.map(c => `- ${c.status}: ${c.name}${c.error ? ` — ${c.error}` : ''}`), '', ...result.screenshots.map(p => `- Ảnh: ${p}`), '', ...result.limitations.map(s => `- Giới hạn: ${s}`), '', ...result.errors.map(e => `- Lỗi: ${e.replaceAll('\n', ' ')}`), ''];
  await writeFile(`${out}/report.md`, lines.join('\n'));
}
if (result.status !== 'PASS') process.exitCode = 1;
