import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, upsertKey } from './core.js';
import { extendProject } from './extensions.js';
import { validateProject, parseProjectJSON, serializeProject, createPersistence } from './persistence.js';

const project = () => extendProject(createProject());
test('imports cannot forge a character-only control onto the VFX fixture', () => {
  const p=project(),vfx=p.replays.find(r=>r.fixtureId==='vfx');
  const track=structuredClone(p.replays[0].tracks.find(t=>t.propertyId==='model.kind'));
  track.id='forged-vfx-model';track.replayId=vfx.id;
  vfx.parts[0].supportedProperties.push('model.kind');vfx.tracks.push(track);
  assert.equal(validateProject(p).valid,false);
});
test('validates a round trip and preserves false values', () => {
  let p = project(); const t = p.replays[0].tracks.find(t => t.propertyId === 'visible');
  p = upsertKey(p, t.id, 30, false, 'constant');
  assert.equal(validateProject(p).valid, true);
  assert.equal(parseProjectJSON(serializeProject(p)).replays[0].tracks.find(track => track.id === t.id).keys[0].value, false);
});
test('rejects corrupt imports, unknown schema, unsafe ids and invalid values without mutating current work', () => {
  const current = project(), before = structuredClone(current);
  const bad = structuredClone(current); bad.schemaVersion = 2;
  assert.throws(() => parseProjectJSON(JSON.stringify(bad)), /schemaVersion/);
  assert.throws(() => parseProjectJSON('{bad'));
  assert.deepEqual(current, before);
  bad.schemaVersion = 1; bad.replays[0].id = '__proto__'; assert.equal(validateProject(bad).valid, false);
  const p = project(), slot = p.replays[0].tracks.find(t => t.propertyId === 'hotbar.slot'); slot.baseValue = 3.5; assert.equal(validateProject(p).valid, false);
  slot.baseValue = 2; const eq = p.replays[0].tracks.find(t => t.propertyId === 'equipment.head'); eq.baseValue = '<script>'; assert.equal(validateProject(p).valid, false);
  const track = p.replays[0].tracks.find(t => t.propertyId === 'x'); track.keys = [{id:'a',tick:2,value:0,interpolationToNext:'linear'}, {id:'b',tick:2,value:1,interpolationToNext:'linear'}]; assert.equal(validateProject(p).valid, false);
});
test('enforces data size and model count limits', () => {
  assert.throws(() => parseProjectJSON(' '.repeat(2 * 1024 * 1024 + 1)), /2 MB/);
  let p = createProject(); p.replays = Array.from({length:21}, (_, i) => ({...structuredClone(p.replays[0]), id:`r${i}`})); assert.equal(validateProject(p).valid, false);
  p = project(); const t = p.replays[0].tracks[0]; t.keys = Array.from({length:5001}, (_,i) => ({id:`k${i}`,tick:i/100,value:i,interpolationToNext:'linear'})); assert.equal(validateProject(p).valid, false);
});
class Storage {
  data = new Map(); getItem(k) { return this.data.get(k) ?? null; } setItem(k,v) { this.data.set(k,String(v)); } removeItem(k) { this.data.delete(k); }
}
test('revision check freezes stale writes until load; storage event also freezes', () => {
  const storage = new Storage(), events = new EventTarget(); let conflict;
  const a = createPersistence({storage, eventTarget:events}), b = createPersistence({storage, eventTarget:events, onConflict:k => { conflict = k; }});
  assert.deepEqual(a.load('lesson'), {ok:true,value:null}); assert.equal(b.load('lesson').ok,true);
  assert.equal(a.save('lesson',{progress:1}).ok,true);
  assert.equal(b.save('lesson',{progress:2}).conflict,true); assert.equal(conflict,'lesson');
  assert.equal(b.save('lesson',{progress:3}).conflict,true);
  assert.deepEqual(b.load('lesson').value,{progress:1}); assert.equal(b.save('lesson',{progress:2}).ok,true);
  assert.equal(a.save('lesson',{progress:3}).conflict,true); assert.deepEqual(a.load('lesson').value,{progress:2});
  assert.equal(b.save('lesson',{progress:4}).ok,true);
  const event = new Event('storage'); Object.assign(event,{key:'bbs-trainer-v1:lesson',newValue:storage.getItem('bbs-trainer-v1:lesson'),storageArea:storage}); events.dispatchEvent(event);
  assert.equal(a.save('lesson',{progress:5}).conflict,true); assert.deepEqual(a.load('lesson').value,{progress:4});
  a.destroy(); b.destroy();
});
test('storage unavailable and quota errors do not throw or destroy saved data', () => {
  const no = createPersistence({storage:null}); assert.equal(no.load('x').ok,false); assert.equal(no.save('x',{}).ok,false); assert.equal(no.remove('x').ok,false);
  const storage = new Storage(); const p = createPersistence({storage}); p.load('x'); assert.equal(p.save('x',{v:1}).ok,true);
  const original = storage.setItem.bind(storage); storage.setItem = (key,value) => { if (!key.endsWith(':lease')) throw new Error('quota'); original(key,value); };
  assert.match(p.save('x',{v:2}).error,/quota/); assert.deepEqual(p.load('x').value,{v:1});
});

 test('rejects missing replays, missing root, detached parts, cycles, and unknown supported properties', () => {
  let p = project(); p.replays = []; assert.equal(validateProject(p).valid, false);
  p = project(); p.replays[0].parts = []; assert.equal(validateProject(p).valid, false);
  p = project(); p.replays[0].parts[0].parentId = 'root'; assert.equal(validateProject(p).valid, false);
  p = project(); p.replays[2].parts[1].parentId = 'aura'; assert.equal(validateProject(p).valid, false);
  p = project(); p.replays[2].parts[1].parentId = null; assert.equal(validateProject(p).valid, false);
  p = project(); p.replays[0].parts[0].supportedProperties.push('invented'); assert.equal(validateProject(p).valid, false);
  p = project(); p.replays[0].tracks[0].keys.push({id:'constructor',tick:1,value:0,interpolationToNext:'linear'}); assert.equal(validateProject(p).valid, false);
});

test('confirmed reset discards only the corrupt record actually observed', () => {
  const storage = new Storage(); storage.setItem('bbs-trainer-v1:bad', '{broken');
  const p = createPersistence({storage});
  assert.equal(p.load('bad').ok, false);
  assert.equal(p.save('bad', {safe:true}).ok, false);
  assert.equal(p.remove('bad').ok, false);
  assert.equal(storage.getItem('bbs-trainer-v1:bad'), '{broken');
  storage.setItem('bbs-trainer-v1:bad', '{changed');
  assert.equal(p.remove('bad', {discardCorrupt:true}).conflict, true);
  assert.equal(storage.getItem('bbs-trainer-v1:bad'), '{changed');
  assert.equal(p.load('bad').ok, false);
  assert.equal(p.remove('bad', {discardCorrupt:true}).ok, true);
  assert.equal(storage.getItem('bbs-trainer-v1:bad'), null);
  assert.equal(p.save('bad', {fresh:true}).ok, true);
});



test('invalid edits cannot replace the last valid saved project', () => {
  const storage = new Storage();
  const store = createPersistence({storage, validate: value => validateProject(value?.project)});
  const project = extendProject(createProject());
  assert.equal(store.load('sandbox').ok, true);
  assert.equal(store.save('sandbox', {project}).ok, true);
  const invalid = structuredClone(project);
  invalid.title = 'x'.repeat(4097);
  const result = store.save('sandbox', {project: invalid});
  assert.equal(result.ok, false);
  assert.match(result.error, /invalid data/i);
  assert.deepEqual(store.load('sandbox').value.project, project);
});
