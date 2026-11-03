import { getPropertyDefinition, isPropertyApplicable, isValidTrackValue } from './extensions.js';

const MAX_BYTES = 2 * 1024 * 1024;
const numeric = new Set(['x', 'y', 'z', 'pitch', 'yaw', 'headYaw', 'bodyYaw']);
const interpolation = new Set(['linear', 'constant', 'sineInOut']);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const finite = value => typeof value === 'number' && Number.isFinite(value);
const bytes = value => new TextEncoder().encode(value).length;
const safeId = value => typeof value === 'string' && value.length > 0 && value.length <= 200 && !['__proto__', 'constructor', 'prototype'].includes(value);
const shortText = value => typeof value === 'string' && value.length <= 4096;
const errorText = error => error instanceof Error ? error.message : String(error);

/** Validation never mutates the supplied project. Text must be rendered as text, not HTML. */
export function validateProject(input) {
  const errors = [];
  const fail = message => { if (errors.length < 100) errors.push(message); };
  if (!record(input)) return { valid: false, errors: ['Project must be an object'] };
  if (input.schemaVersion !== 1) fail('Unsupported schemaVersion');
  if (!safeId(input.projectId)) fail('Invalid projectId');
  if (!shortText(input.title) || !shortText(input.updatedAt)) fail('Invalid project text');
  if (!finite(input.durationTicks) || input.durationTicks <= 0 || !finite(input.ticksPerSecond) || input.ticksPerSecond <= 0) fail('Invalid duration or tick rate');
  if (!Array.isArray(input.replays) || input.replays.length === 0 || input.replays.length > 20) return { valid: false, errors: [...errors, 'Invalid replay list or limit exceeded'] };
  const replayIds = new Set(), trackIds = new Set(), keyIds = new Set();
  let trackCount = 0, keyCount = 0;
  for (const replay of input.replays) {
    if (!record(replay)) { fail('Invalid replay'); continue; }
    if (!safeId(replay.id) || replayIds.has(replay.id)) fail('Invalid or duplicate replay id');
    replayIds.add(replay.id);
    if (!shortText(replay.label) || !safeId(replay.fixtureId)) fail('Invalid replay metadata');
    if (!record(replay.baseTransform) || [...numeric].some(p => !finite(replay.baseTransform[p]))) fail('Invalid base transform');
    if (!Array.isArray(replay.parts) || !Array.isArray(replay.tracks)) { fail('Invalid replay parts or tracks'); continue; }
    const parts = new Map();
    for (const part of replay.parts) {
      if (!record(part) || !safeId(part.id) || parts.has(part.id)) { fail('Invalid or duplicate part'); continue; }
      parts.set(part.id, part);
      if (!shortText(part.label) || !(part.parentId === null || safeId(part.parentId)) || !Array.isArray(part.supportedProperties) || part.supportedProperties.some(p => !safeId(p) || (p !== 'visible' && getPropertyDefinition(p)?.owner !== 'form')) || new Set(part.supportedProperties).size !== part.supportedProperties.length) fail('Invalid part metadata');
    }
    if (!parts.has('root') || parts.get('root').parentId !== null) fail('Replay requires a root part with no parent');
    for (const part of parts.values()) {
      if (part.id !== 'root' && part.parentId === null) fail('Every part must descend from root');
      let current = part, visited = new Set();
      while (current && current.parentId !== null) {
        if (visited.has(current.id) || !parts.has(current.parentId)) { fail('Invalid part parent reference or cycle'); break; }
        visited.add(current.id); current = parts.get(current.parentId);
      }
    }
    const propertySlots = new Set();
    trackCount += replay.tracks.length;
    for (const track of replay.tracks) {
      if (!record(track)) { fail('Invalid track'); continue; }
      if (!safeId(track.id) || trackIds.has(track.id)) fail('Invalid or duplicate track id');
      trackIds.add(track.id);
      const definition = numeric.has(track.propertyId) ? { type: 'number', owner: 'replay' } : track.propertyId === 'visible' ? { type: 'boolean', owner: 'form' } : getPropertyDefinition(track.propertyId);
      if (!definition || track.owner !== definition.owner || track.valueType !== definition.type || track.replayId !== replay.id) fail('Unknown property, type, or replay ownership');
      if (definition?.rootOnly && track.partId !== 'root') fail('Property requires root part');
      if (getPropertyDefinition(track.propertyId) && !isPropertyApplicable(definition,replay,track.partId)) fail('Property is not supported by this fixture or part');
      if (track.owner === 'replay' ? track.partId !== null : track.owner !== 'form' || !parts.has(track.partId) || !Array.isArray(parts.get(track.partId).supportedProperties) || !parts.get(track.partId).supportedProperties.includes(track.propertyId)) fail('Invalid track part ownership');
      if (!safeId(track.propertyId)) fail('Invalid property id');
      const slot = [track.owner, track.partId, track.propertyId].map(value => typeof value === 'string' ? value : '').join('\u0000');
      if (propertySlots.has(slot)) fail('Duplicate property track');
      propertySlots.add(slot);
      if (!isValidTrackValue(track, track.baseValue)) fail('Invalid track base value');
      if (!Array.isArray(track.keys)) { fail('Invalid key list'); continue; }
      keyCount += track.keys.length;
      let previous = -Infinity;
      for (const key of track.keys) {
        if (!record(key)) { fail('Invalid key'); continue; }
        if (!safeId(key.id) || keyIds.has(key.id)) fail('Invalid or duplicate key id');
        keyIds.add(key.id);
        if (!finite(key.tick) || key.tick < 0 || key.tick > input.durationTicks || key.tick <= previous) fail('Keys must have unique sorted ticks within duration');
        previous = key.tick;
        if (!isValidTrackValue(track, key.value) || !interpolation.has(key.interpolationToNext)) fail('Invalid key value or interpolation');
      }
    }
  }
  if (trackCount > 200 || keyCount > 5000) fail('Track or key limit exceeded');
  try { const json = JSON.stringify(input); if (typeof json !== 'string' || bytes(json) > MAX_BYTES) fail('Project exceeds 2 MB'); }
  catch { fail('Project is not serializable'); }
  return { valid: errors.length === 0, errors };
}

export function parseProjectJSON(text) {
  if (typeof text !== 'string' || bytes(text) > MAX_BYTES) throw new Error('Invalid JSON or file exceeds 2 MB');
  let project;
  try { project = JSON.parse(text); } catch { throw new Error('Invalid JSON'); }
  const result = validateProject(project);
  if (!result.valid) throw new Error(result.errors.join('; '));
  return project;
}
export function serializeProject(project) {
  const result = validateProject(project);
  if (!result.valid) throw new Error(result.errors.join('; '));
  const text = JSON.stringify(project, null, 2);
  if (bytes(text) > MAX_BYTES) throw new Error('Project exceeds 2 MB');
  return text;
}

/** Revision checks detect changed storage; a short lease coordinates cooperating tabs. */
export function createPersistence(options = {}) {
  const namespace = options.namespace ?? 'bbs-trainer-v1';
  const onConflict = options.onConflict ?? (() => {});
  const eventTarget = options.eventTarget ?? globalThis;
  let storage = options.storage;
  if (storage === undefined) { try { storage = globalThis.localStorage; } catch { storage = null; } }
  const revisions = new Map(), frozen = new Set(), corrupt = new Map();
  const owner = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  const fullKey = key => `${namespace}:${key}`;
  const unpack = raw => {
    if (raw === null) return { revision: null, value: null };
    const obj = JSON.parse(raw);
    if (!record(obj) || obj.version !== 1 || typeof obj.revision !== 'string' || !Object.hasOwn(obj, 'value')) throw new Error('Invalid saved data');
    return obj;
  };
  const markConflict = key => {
    if (!frozen.has(key)) { frozen.add(key); try { onConflict(key); } catch {} }
  };
  const listener = event => {
    if (event.key === null) { for (const key of revisions.keys()) markConflict(key); return; }
    if (!event.key || !event.key.startsWith(`${namespace}:`) || event.key.endsWith(':lease') || (event.storageArea && event.storageArea !== storage)) return;
    const key = event.key.slice(namespace.length + 1);
    if (!revisions.has(key)) return;
    try { if (unpack(event.newValue).revision !== revisions.get(key)) markConflict(key); } catch { markConflict(key); }
  };
  eventTarget?.addEventListener?.('storage', listener);
  function load(key) {
    try {
      if (!storage) throw new Error('Storage unavailable');
      const raw = storage.getItem(fullKey(key));
      let data;
      try { data = unpack(raw); } catch (error) { corrupt.set(key, raw); frozen.delete(key); throw error; }
      revisions.set(key, data.revision); frozen.delete(key); corrupt.delete(key);
      return { ok: true, value: data.value };
    } catch (error) { return { ok: false, error: errorText(error) }; }
  }
  function write(key, value, remove, discardCorrupt = false) {
    let leaseOwned = false;
    const path = fullKey(key), leaseKey = `${path}:lease`;
    try {
      if (!storage) throw new Error('Storage unavailable');
      if (frozen.has(key)) return { ok: false, conflict: true, error: 'Storage conflict; reload before saving' };
      const raw = storage.getItem(path);
      const discarding = remove && discardCorrupt && corrupt.has(key);
      if (discarding && raw !== corrupt.get(key)) { markConflict(key); return { ok: false, conflict: true, error: 'Saved data changed; reload before reset' }; }
      const observed = discarding ? { revision: null } : unpack(raw);
      // A caller that has never loaded this key may create it, but may not overwrite data it has not seen.
      const expected = revisions.has(key) ? revisions.get(key) : null;
      if (!discarding && observed.revision !== expected) { markConflict(key); return { ok: false, conflict: true, error: 'Saved data changed; reload before saving' }; }
      const existingLease = storage.getItem(leaseKey);
      if (existingLease) {
        let lease; try { lease = JSON.parse(existingLease); } catch { throw new Error('Invalid storage lease'); }
        if (lease.expires > Date.now() && lease.owner !== owner) { markConflict(key); return { ok: false, conflict: true, error: 'Another tab is saving' }; }
      }
      const lease = JSON.stringify({ owner, expires: Date.now() + 5000 });
      storage.setItem(leaseKey, lease); leaseOwned = true;
      const currentRaw = storage.getItem(path);
      if (storage.getItem(leaseKey) !== lease || (discarding ? currentRaw !== raw : unpack(currentRaw).revision !== expected)) { markConflict(key); return { ok: false, conflict: true, error: 'Saved data changed; reload before saving' }; }
      if (remove) { storage.removeItem(path); revisions.set(key, null); corrupt.delete(key); }
      else {
        const revision = `${owner}:${Date.now()}:${Math.random()}`;
        const envelope = JSON.stringify({ version: 1, revision, value });
        if (typeof envelope !== 'string' || !Object.hasOwn(JSON.parse(envelope), 'value')) throw new Error('Value is not serializable');
        storage.setItem(path, envelope); revisions.set(key, revision);
      }
      return { ok: true };
    } catch (error) { return { ok: false, error: errorText(error) }; }
    finally { if (leaseOwned) { try { const lease = JSON.parse(storage.getItem(leaseKey)); if (lease?.owner === owner) storage.removeItem(leaseKey); } catch {} } }
  }
  return { load, save: (key, value) => write(key, value, false), remove: (key, options = {}) => write(key, null, true, options.discardCorrupt === true), destroy: () => eventTarget?.removeEventListener?.('storage', listener) };
}

