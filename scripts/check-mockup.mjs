#!/usr/bin/env node
// Dependency-free DOM smoke test for the mockup; this is not a real browser test.
import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../mockups/index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];
assert.ok(scripts.length, 'Expected an embedded script');
const code = scripts.map(m => m[1]).join('\n');
const script = new Script(code, { filename: 'mockups/index.html' });
const elements = [];
const ids = new Map();
class Element {
  constructor(tag, attrs = {}) {
    this.tagName = tag.toLowerCase(); this.attributes = { ...attrs }; this.children = [];
    this.parentElement = null; this.listeners = {}; this.textContent = ''; this.open = false;
    this.dataset = new Proxy({}, {
      get: (_, key) => this.attributes['data-' + String(key).replace(/[A-Z]/g, c => '-' + c.toLowerCase())],
      set: (_, key, value) => { this.attributes['data-' + String(key).replace(/[A-Z]/g, c => '-' + c.toLowerCase())] = String(value); return true; }
    });
    this.classList = { toggle: (name, force) => {
      const classes = new Set((this.attributes.class || '').split(/\s+/).filter(Boolean));
      const add = force === undefined ? !classes.has(name) : force;
      if (add) classes.add(name); else classes.delete(name);
      this.attributes.class = [...classes].join(' '); return add;
    }, contains: name => (this.attributes.class || '').split(/\s+/).includes(name) };
  }
  get id() { return this.attributes.id || ''; }
  get hidden() { return 'hidden' in this.attributes; }
  set hidden(value) { if (value) this.attributes.hidden = ''; else delete this.attributes.hidden; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  toggleAttribute(name, force) { const on = force === undefined ? !(name in this.attributes) : force; if (on) this.attributes[name] = ''; else delete this.attributes[name]; return on; }
  append(child) { child.parentElement = this; this.children.push(child); elements.push(child); }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  click() { assert.ok(!this.hidden, `Cannot click hidden ${this.tagName}`); for (const fn of this.listeners.click || []) fn({ currentTarget: this, target: this }); }
  closest(tag) { let node = this; while (node && node.tagName !== tag) node = node.parentElement; return node; }
  showModal() { assert.equal(this.tagName, 'dialog'); this.open = true; }
  close() { this.open = false; }
}
const stack = [];
const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
// Only structural markup is needed by this stub; skip CSS and script contents.
const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
for (const token of markup.matchAll(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>/g)) {
  const raw = token[0]; if (raw.startsWith('<!--')) continue;
  const close = /^<\//.test(raw); const tag = raw.match(/^<\/?([\w:-]+)/)[1].toLowerCase();
  if (close) { while (stack.length && stack.pop().tagName !== tag) {} continue; }
  const attrs = {};
  const rest = raw.slice(raw.indexOf(tag) + tag.length, raw.length - 1);
  for (const m of rest.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[m[1]] = m[2] ?? m[3] ?? m[4] ?? '';
  const el = new Element(tag, attrs); elements.push(el);
  if (stack.length) { el.parentElement = stack.at(-1); stack.at(-1).children.push(el); }
  if (el.id) { assert.ok(!ids.has(el.id), `Duplicate id: ${el.id}`); ids.set(el.id, el); }
  if (!voidTags.has(tag) && !/\/\s*>$/.test(raw)) stack.push(el);
}
function matches(el, selector) {
  const attr = selector.match(/^\[([^=\]]+)(?:=["']?([^"'\]]+)["']?)?\]$/);
  if (attr) return attr[1] in el.attributes && (attr[2] === undefined || el.attributes[attr[1]] === attr[2]);
  if (selector === '.workspace>aside,.workspace>.center') return el.parentElement?.classList.contains('workspace') && (el.tagName === 'aside' || el.classList.contains('center'));
  throw new Error(`DOM stub does not support selector: ${selector}`);
}
const document = {
  getElementById: id => ids.get(id) || null,
  querySelectorAll: selector => elements.filter(el => matches(el, selector)),
  querySelector: selector => elements.find(el => matches(el, selector)) || null,
  createElement: tag => new Element(tag)
};
for (const m of code.matchAll(/getElementById\(\s*['"]([^'"]+)['"]\s*\)/g)) assert.ok(ids.has(m[1]), `Missing id referenced by script: ${m[1]}`);
for (const el of elements.filter(e => e.dataset.dialog)) assert.equal(ids.get(el.dataset.dialog)?.tagName, 'dialog', `Missing dialog: ${el.dataset.dialog}`);
for (const el of elements.filter(e => e.getAttribute('aria-controls'))) for (const id of el.getAttribute('aria-controls').split(/\s+/)) assert.ok(ids.has(id), `Missing aria-controls target: ${id}`);
script.runInContext(createContext({ document }));
const one = selector => { const el = document.querySelector(selector); assert.ok(el, `Missing ${selector}`); return el; };
const id = name => { const el = document.getElementById(name); assert.ok(el, `Missing #${name}`); return el; };
const pressed = (selector, value) => assert.equal(one(selector).getAttribute('aria-pressed'), String(value), selector);
assert.ok(document.querySelectorAll('[data-track]').length > 1, 'Track controls should be created');
one('[data-track="y"]').click();
assert.match(id('inspector-title').textContent, /^y\s*\//);
pressed('[data-track="y"]', true);
one('[data-replay="vfx"]').click();
assert.equal(one('[data-part="aura"]').hidden, false);
one('[data-part="aura"]').click();
assert.equal(id('inspector-part').textContent, 'aura');
assert.match(id('breadcrumb').textContent, /aura/);
assert.equal(id('outline-vfx').hidden, false);
assert.equal(id('outline-den').hidden, true);
one('[data-replay="wood"]').click();
assert.equal(one('[data-part="aura"]').hidden, true);
assert.equal(id('inspector-part').textContent, 'root', 'Replay change resets part');
pressed('[data-part="root"]', true);
pressed('[data-part="aura"]', false);
pressed('[data-replay="wood"]', true);
assert.equal(id('outline-wood').hidden, false);
assert.equal(id('outline-vfx').hidden, true);
assert.equal(id('inspector-replay').textContent, 'Gỗ Xưa');
assert.match(id('breadcrumb').textContent, /root\s*\/\s*y$/, 'Replay change preserves selected track');
one('[data-panel="right"]').click();
pressed('[data-panel="right"]', true);
assert.equal(id('right').classList.contains('mobile-active'), true);
assert.equal(id('center').classList.contains('mobile-active'), false);
one('[data-panel="left"]').click();
assert.equal(id('inspector-part').textContent, 'root', 'Panel navigation preserves selection');
assert.equal(id('inspector-replay').textContent, 'Gỗ Xưa');
for (const button of document.querySelectorAll('[data-dialog]')) {
  const dialog = id(button.dataset.dialog); button.click(); assert.equal(dialog.open, true, `${dialog.id} opens`);
  const close = document.querySelectorAll('[data-close]').find(e => e.closest('dialog') === dialog);
  assert.ok(close, `${dialog.id} needs a close control`); close.click(); assert.equal(dialog.open, false, `${dialog.id} closes`);
}
const guide = id('guide'), toggle = id('guide-toggle');
const initiallyHidden = guide.hidden; toggle.click(); assert.notEqual(guide.hidden, initiallyHidden);
assert.equal(toggle.getAttribute('aria-expanded'), String(!guide.hidden));
toggle.click(); assert.equal(guide.hidden, initiallyHidden);
assert.equal(toggle.getAttribute('aria-expanded'), String(!guide.hidden));
console.log('Mockup DOM smoke check passed (not a real browser test).');
