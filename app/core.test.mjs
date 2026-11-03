import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProject, clone, getTrack, findTrack, upsertKey, moveKey, deleteKey, evaluateTrack, evaluateProject, snapTick, History } from './core.js';

test('fixture ownership, base values and missing lookups', () => {
  const p = createProject();
  assert.equal(getTrack(p, 'missing'), undefined);
  assert.equal(findTrack(p, 'den', 'x').baseValue, -2);
  assert.equal(findTrack(p, 'den', 'visible', 'aura'), undefined);
  assert.equal(findTrack(p, 'vfx', 'visible', 'aura').owner, 'form');
  assert.equal(evaluateProject(p, 0).wood.x, 4);
  assert.equal(evaluateProject(p, 0).vfx.parts.aura.visible, true);
  assert.throws(() => createProject(Infinity));
});
test('upsert, move collision, wrong track, deletion and immutable history', () => {
  const p = createProject(), x = findTrack(p, 'den', 'x'), y = findTrack(p, 'den', 'y');
  let a = upsertKey(p, x.id, 40, 2), b = upsertKey(a, x.id, 0, -2), c = upsertKey(b, x.id, 40, 3, 'constant');
  assert.equal(x.keys.length, 0); assert.equal(getTrack(a, x.id).keys.length, 1);
  const keys = getTrack(c, x.id).keys;
  assert.deepEqual(keys.map(k => k.tick), [0, 40]); assert.equal(keys[1].value, 3);
  assert.equal(keys[1].id, getTrack(b, x.id).keys[1].id);
  assert.throws(() => moveKey(c, x.id, keys[0].id, 40), /already exists/);
  assert.throws(() => moveKey(c, y.id, keys[0].id, 5), /not found/);
  assert.throws(() => deleteKey(c, y.id, keys[0].id), /not found/);
  assert.throws(() => upsertKey(c, x.id, 101, 1), /Tick/);
  assert.throws(() => upsertKey(c, x.id, 5, Infinity), /Invalid/);
  assert.throws(() => upsertKey(c, x.id, 5, 1, 'bogus'), /interpolation/);
  const moved = moveKey(c, x.id, keys[0].id, 20);
  const removed = deleteKey(moved, x.id, keys[1].id);
  const history = new History(c); history.commit(moved); history.commit(removed);
  assert.deepEqual(getTrack(history.undo(), x.id).keys.map(k => k.tick), [20, 40]);
  assert.deepEqual(getTrack(history.undo(), x.id).keys.map(k => k.tick), [0, 40]);
  assert.deepEqual(getTrack(history.redo(), x.id).keys.map(k => k.tick), [20, 40]);
  history.commit(removed); assert.equal(history.canRedo, false);
});
test('numeric, boolean and string interpolation honor exact keys and boundaries', () => {
  const base = { id:'n', valueType:'number', baseValue: 9, keys:[] };
  assert.equal(evaluateTrack(base, 2), 9);
  const track = { ...base, keys:[{tick:0,value:-2,interpolationToNext:'linear'}, {tick:40,value:2,interpolationToNext:'constant'}] };
  assert.equal(evaluateTrack(track, -1), -2); assert.equal(evaluateTrack(track, 20), 0);
  assert.equal(evaluateTrack(track, 40), 2); assert.equal(evaluateTrack(track, 41), 2);
  track.keys[0].interpolationToNext = 'constant'; assert.equal(evaluateTrack(track, 39.9), -2);
  track.keys[0].interpolationToNext = 'sineInOut'; assert.ok(Math.abs(evaluateTrack(track, 10) - (-1.41421356237)) < 1e-9);
  const bool = { valueType:'boolean', baseValue:false, keys:[] }; assert.equal(evaluateTrack(bool, 0), false);
  bool.keys = [{tick:0,value:false,interpolationToNext:'linear'}, {tick:30,value:true,interpolationToNext:'linear'}];
  assert.equal(evaluateTrack(bool, 29.9), false); assert.equal(evaluateTrack(bool, 30), true);
  const string = { valueType:'string', baseValue:'', keys:[{tick:0,value:'one',interpolationToNext:'sineInOut'}, {tick:2,value:'two',interpolationToNext:'linear'}] };
  assert.equal(evaluateTrack(string, 1), 'one'); assert.equal(evaluateTrack(string, 2), 'two');
});
test('ownership validation and literal dotted extension properties', () => {
  const p = createProject(), replay = p.replays[0];
  replay.parts[0].supportedProperties.push('texture.color');
  replay.tracks.push({id:'color',replayId:'den',owner:'form',partId:'root',propertyId:'texture.color',valueType:'string',baseValue:'blue',keys:[]});
  const next = upsertKey(p, 'color', 0, 'red');
  assert.equal(evaluateProject(next, 0).den.parts.root['texture.color'], 'red');
  const bad = clone(p); bad.replays[0].tracks.at(-1).partId = 'absent';
  assert.throws(() => upsertKey(bad, 'color', 0, 'red'), /ownership/);
});
test('snap and bounded history', () => {
  assert.equal(snapTick(1.26), 1); assert.equal(snapTick(1.26, false), 1.3); assert.throws(() => snapTick(NaN));
  const h = new History({n:0}, 2); h.commit({n:1}); h.commit({n:2}); h.commit({n:3});
  assert.equal(h.undo().n, 2); assert.equal(h.undo().n, 1); assert.equal(h.canUndo, false);
});
test('independent Replay keys and negative values never cross tracks', () => {
  const p = createProject();
  const den = findTrack(p, 'den', 'x'), wood = findTrack(p, 'wood', 'x');
  let next = upsertKey(p, den.id, 0, -8);
  next = upsertKey(next, wood.id, 0, 11);
  assert.equal(evaluateProject(next, 0).den.x, -8);
  assert.equal(evaluateProject(next, 0).wood.x, 11);
  assert.equal(getTrack(next, den.id).keys.length, 1);
  assert.equal(getTrack(next, wood.id).keys.length, 1);
});
test('evaluation treats special object names as data, never prototypes', () => {
  const p = createProject();
  const replay = p.replays[0];
  replay.id = '__proto__';
  for (const track of replay.tracks) track.replayId = replay.id;
  replay.parts.push({id:'__proto__', parentId:'root', label:'special', supportedProperties:['__proto__']});
  replay.tracks.push({id:'special', replayId:replay.id, owner:'form', partId:'__proto__', propertyId:'__proto__', valueType:'string', baseValue:'safe', keys:[]});
  const state = evaluateProject(p, 0);
  assert.equal(state['__proto__'].parts['__proto__']['__proto__'], 'safe');
  assert.equal(Object.getPrototypeOf(state), null);
  assert.equal(Object.getPrototypeOf(state['__proto__'].parts['__proto__']), null);
  assert.equal({}.polluted, undefined);
});


test('key edits reject values that project validation would reject', async () => {
  const { extendProject } = await import('./extensions.js');
  const { validateProject } = await import('./persistence.js');
  const project = extendProject(createProject());
  for (const [property, invalid] of [
    ['hotbar.slot', -1], ['hotbar.slot', 2.5], ['hotbar.slot', 9],
    ['variable.intensity', 2.1], ['equipment.mainHand', 'banana']
  ]) {
    const track = findTrack(project, 'den', property);
    assert.throws(() => upsertKey(project, track.id, 0, invalid), /Invalid/);
    assert.equal(track.keys.length, 0);
  }
  for (const [property, value] of [['hotbar.slot', 8], ['variable.intensity', 2], ['equipment.mainHand', 'sword']]) {
    const track = findTrack(project, 'den', property);
    assert.equal(validateProject(upsertKey(project, track.id, 0, value)).valid, true);
  }
});
