/** Trainer data model. Missing tracks return undefined; mutations reject invalid input. */
export const clone = value => structuredClone(value);
const makeId = prefix => `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;
const finite = (value, name) => { if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`${name} must be a finite number`); };
const interpolationTypes = new Set(['linear', 'constant', 'sineInOut']);
const validValue = (track, value) => {
  if (!['number', 'boolean', 'string'].includes(track.valueType) || typeof value !== track.valueType || (track.valueType === 'number' && !Number.isFinite(value))) throw new Error(`Invalid ${track.valueType} value for track ${track.id}`);
};
const validTick = (project, tick) => { finite(tick, 'Tick'); if (tick < 0 || tick > project.durationTicks) throw new Error(`Tick must be between 0 and ${project.durationTicks}`); };
const requiredTrack = (project, id) => { const track = getTrack(project, id); if (!track) throw new Error(`Track not found: ${id}`); return track; };
const checkOwner = (project, track) => {
  const replay = project.replays.find(r => r.id === track.replayId);
  if (!replay || !replay.tracks.includes(track)) throw new Error('Track has invalid replay ownership');
  if (track.owner === 'replay') { if (track.partId !== null) throw new Error('Replay track must not have a part'); }
  else if (track.owner === 'form') { if (!replay.parts.some(p => p.id === track.partId && p.supportedProperties.includes(track.propertyId))) throw new Error('Track has invalid form ownership'); }
  else throw new Error('Invalid track owner');
};

export function createProject(durationTicks = 100) {
  finite(durationTicks, 'Duration');
  if (durationTicks <= 0) throw new Error('Duration must be positive');
  const specs = [['den', 'Đen', -2, 0, 0], ['wood', 'Gỗ Xưa', 4, 0, 3], ['vfx', 'VFX minh họa', 0, 0, 1]];
  const replays = specs.map(([id, label, x, y, z]) => {
    const baseTransform = { x, y, z, pitch: 0, yaw: 0, headYaw: 0, bodyYaw: 0 };
    const parts = [{ id: 'root', parentId: null, label: 'root', supportedProperties: ['visible'] }];
    if (id === 'vfx') parts.push({ id: 'aura', parentId: 'root', label: 'aura', supportedProperties: ['visible'] });
    const tracks = Object.entries(baseTransform).map(([propertyId, baseValue]) => ({ id: `${id}:replay:${propertyId}`, replayId: id, owner: 'replay', partId: null, propertyId, valueType: 'number', baseValue, keys: [] }));
    for (const part of parts) tracks.push({ id: `${id}:form:${part.id}:visible`, replayId: id, owner: 'form', partId: part.id, propertyId: 'visible', valueType: 'boolean', baseValue: true, keys: [] });
    return { id, label, fixtureId: id, baseTransform, parts, tracks };
  });
  return { schemaVersion: 1, projectId: makeId('project'), title: 'BBS FS Trainer', durationTicks, ticksPerSecond: 20, updatedAt: new Date().toISOString(), replays };
}

export function getTrack(project, trackId) { for (const replay of project.replays) { const track = replay.tracks.find(t => t.id === trackId); if (track) return track; } return undefined; }
export function findTrack(project, replayId, propertyId, partId = null) { return project.replays.find(r => r.id === replayId)?.tracks.find(t => t.propertyId === propertyId && t.partId === partId); }
export function evaluateTrack(track, tick) {
  finite(tick, 'Tick');
  if (!track || !Array.isArray(track.keys)) throw new Error('Invalid track');
  const keys = track.keys;
  if (!keys.length) return track.baseValue;
  if (tick <= keys[0].tick) return keys[0].value;
  if (tick >= keys[keys.length - 1].tick) return keys[keys.length - 1].value;
  for (let i = 1; i < keys.length; i++) {
    const b = keys[i], a = keys[i - 1];
    if (tick === b.tick) return b.value;
    if (tick < b.tick) {
      if (track.valueType !== 'number' || a.interpolationToNext === 'constant') return a.value;
      let u = (tick - a.tick) / (b.tick - a.tick);
      if (a.interpolationToNext === 'sineInOut') u = (1 - Math.cos(Math.PI * u)) / 2;
      return a.value + (b.value - a.value) * u;
    }
  }
}
export function evaluateProject(project, tick) {
  finite(tick, 'Tick');
  // IDs and property names may come from imported data. Null-prototype maps
  // keep names like "__proto__" as data rather than changing object prototypes.
  const result = Object.create(null);
  for (const replay of project.replays) {
    const state = Object.assign(Object.create(null), replay.baseTransform, { parts: Object.create(null) });
    for (const part of replay.parts) state.parts[part.id] = Object.create(null);
    for (const track of replay.tracks) {
      checkOwner(project, track);
      const value = evaluateTrack(track, tick);
      if (track.owner === 'replay') state[track.propertyId] = value;
      else state.parts[track.partId][track.propertyId] = value;
    }
    state.visible = state.parts.root?.visible ?? true;
    result[replay.id] = state;
  }
  return result;
}
const changedProject = (project, trackId) => { const next = clone(project); next.updatedAt = new Date().toISOString(); return [next, requiredTrack(next, trackId)]; };
export function upsertKey(project, trackId, tick, value, interpolation = 'linear') {
  validTick(project, tick); const original = requiredTrack(project, trackId); checkOwner(project, original); validValue(original, value);
  if (!interpolationTypes.has(interpolation)) throw new Error(`Invalid interpolation: ${interpolation}`);
  const [next, track] = changedProject(project, trackId);
  const existing = track.keys.find(key => key.tick === tick);
  if (existing) { existing.value = value; existing.interpolationToNext = interpolation; }
  else track.keys.push({ id: makeId('key'), tick, value, interpolationToNext: interpolation });
  track.keys.sort((a, b) => a.tick - b.tick);
  return next;
}
export function moveKey(project, trackId, keyId, tick) {
  validTick(project, tick); const original = requiredTrack(project, trackId); checkOwner(project, original);
  if (!original.keys.some(k => k.id === keyId)) throw new Error(`Key not found in track: ${keyId}`);
  if (original.keys.some(k => k.tick === tick && k.id !== keyId)) throw new Error(`A key already exists at tick ${tick}`);
  const [next, track] = changedProject(project, trackId); track.keys.find(k => k.id === keyId).tick = tick; track.keys.sort((a, b) => a.tick - b.tick); return next;
}
export function deleteKey(project, trackId, keyId) {
  const original = requiredTrack(project, trackId); checkOwner(project, original);
  if (!original.keys.some(k => k.id === keyId)) throw new Error(`Key not found in track: ${keyId}`);
  const [next, track] = changedProject(project, trackId); track.keys = track.keys.filter(k => k.id !== keyId); return next;
}
export function snapTick(tick, snap = true) { finite(tick, 'Tick'); return snap ? Math.round(tick) : Math.round(tick * 10) / 10; }
export class History {
  constructor(project, limit = 100) { if (!Number.isInteger(limit) || limit < 1) throw new Error('History limit must be a positive integer'); this.project = clone(project); this.limit = limit; this.past = []; this.future = []; }
  get canUndo() { return this.past.length > 0; }
  get canRedo() { return this.future.length > 0; }
  commit(nextProject) { if (nextProject === this.project) return this.project; this.past.push(this.project); if (this.past.length > this.limit) this.past.shift(); this.project = clone(nextProject); this.future = []; return this.project; }
  undo() { if (this.canUndo) { this.future.push(this.project); this.project = this.past.pop(); } return this.project; }
  redo() { if (this.canRedo) { this.past.push(this.project); this.project = this.future.pop(); } return this.project; }
}
