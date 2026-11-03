/* Trainer-only extensions. These values are a teaching fixture, not BBS film data. */

const options = (...values) => values.map(([value, label]) => ({ value, label }));
const property = (id, label, type, owner, defaultValue, description, extra = {}) =>
  ({ id, label, type, owner, defaultValue, description, evidence: 'simulator', ...extra });

export const PROPERTY_GROUPS = [
  { id: 'states', label: 'States', phase: 2, description: 'Trạng thái nhân vật minh họa.', properties: [
    property('states.sneaking', 'Sneaking', 'boolean', 'replay', false, 'Minh họa tư thế cúi.'),
    property('states.sprinting', 'Sprinting', 'boolean', 'replay', false, 'Minh họa trạng thái chạy.')
  ] },
  { id: 'hotbar', label: 'Hotbar', phase: 2, description: 'Ô chọn minh họa.', properties: [
    property('hotbar.slot', 'Slot', 'number', 'replay', 0, 'Chọn ô hotbar trong trainer.', { min: 0, max: 8, step: 1 })
  ] },
  { id: 'equipment', label: 'Equipment', phase: 2, description: 'Trang bị minh họa.', properties: [
    property('equipment.mainHand', 'Main hand', 'string', 'replay', 'none', 'Vật cầm minh họa.', { options: options(['none', 'Không'], ['sword', 'Kiếm'], ['pickaxe', 'Cuốc']) }),
    property('equipment.head', 'Head', 'string', 'replay', 'none', 'Trang bị đầu minh họa.', { options: options(['none', 'Không'], ['helmet', 'Mũ']) })
  ] },
  { id: 'variables', label: 'Variables', phase: 2, description: 'Biến minh họa của trainer.', properties: [
    property('variable.intensity', 'Intensity', 'number', 'replay', 1, 'Cường độ minh họa.', { min: 0, max: 2, step: 0.1 })
  ] },
  { id: 'pose', label: 'Pose', phase: 2, description: 'Tư thế đơn giản do trainer quy ước.', properties: [
    property('pose.headX', 'Head X', 'number', 'form', 0, 'Góc đầu minh họa.', { min: -90, max: 90, step: 1 }),
    property('pose.armX', 'Arm X', 'number', 'form', 0, 'Góc tay minh họa.', { min: -180, max: 180, step: 1 })
  ] },
  { id: 'transform', label: 'Transform', phase: 2, description: 'Biến đổi cục bộ minh họa của form.', properties: [
    ...['x', 'y', 'z'].map(axis => property(`transform.${axis}`, axis.toUpperCase(), 'number', 'form', 0, `Dịch form theo trục ${axis.toUpperCase()}.`, { min: -20, max: 20, step: 0.1 })),
    property('transform.scale', 'Scale', 'number', 'form', 1, 'Tỉ lệ form minh họa.', { min: 0.1, max: 4, step: 0.1 })
  ] },
  { id: 'anchor', label: 'Anchor', phase: 2, description: 'Điểm neo minh họa chỉ cho form gốc.', properties: [
    ...['x', 'y', 'z'].map(axis => property(`anchor.${axis}`, axis.toUpperCase(), 'number', 'form', 0, `Điểm neo gốc theo trục ${axis.toUpperCase()}.`, { min: -20, max: 20, step: 0.1, rootOnly: true }))
  ] },
  { id: 'model', label: 'Model', phase: 3, description: 'Hình mẫu trainer tự tạo.', properties: [
    property('model.kind', 'Model kind', 'string', 'form', 'figure', 'Chọn hình mẫu minh họa.', { options: options(['figure', 'Nhân vật'], ['block', 'Khối']) })
  ] },
  { id: 'texture', label: 'Texture', phase: 3, description: 'Màu bề mặt minh họa.', properties: [
    property('texture.color', 'Color', 'string', 'form', 'white', 'Chọn màu minh họa.', { options: options(['white', 'Trắng'], ['red', 'Đỏ'], ['blue', 'Xanh dương'], ['green', 'Xanh lá']) })
  ] },
  { id: 'actions', label: 'Actions', phase: 3, description: 'Hành động minh họa, không thực thi mã.', properties: [
    property('action', 'Action', 'string', 'form', 'idle', 'Chọn hành động trainer.', { options: options(['idle', 'Đứng'], ['wave', 'Vẫy tay'], ['jump', 'Nhảy']) })
  ] },
  { id: 'vfx', label: 'VFX', phase: 3, description: 'Hiệu ứng minh họa của trainer.', properties: [
    property('vfx.kind', 'VFX kind', 'string', 'form', 'none', 'Chọn hiệu ứng minh họa.', { options: options(['none', 'Không'], ['glow', 'Sáng'], ['sparks', 'Tia']) }),
    property('vfx.size', 'VFX size', 'number', 'form', 1, 'Kích cỡ hiệu ứng minh họa.', { min: 0.1, max: 4, step: 0.1 })
  ] }
];

// These controls have visual implementations only for the character fixtures' root form.
// Keeping the restrictions on the definitions lets imports apply the same rules as creation.
const characterGroups = new Set(['states', 'hotbar', 'equipment', 'pose', 'model', 'texture', 'actions']);
const rootGroups = new Set(['pose', 'model', 'texture', 'actions']);
for (const group of PROPERTY_GROUPS) for (const definition of group.properties) {
  if (characterGroups.has(group.id)) definition.fixtureIds = ['den', 'wood'];
  if (rootGroups.has(group.id)) definition.rootOnly = true;
}

export function isPropertyApplicable(definition, replay, partId) {
  if (!definition || !replay) return false;
  if (definition.fixtureIds && !definition.fixtureIds.includes(replay.fixtureId)) return false;
  if (definition.owner === 'replay') return partId === null;
  if (definition.owner !== 'form' || typeof partId !== 'string') return false;
  return (!definition.rootOnly || partId === 'root') && replay.parts.some(part => part.id === partId);
}

const definitions = new Map(PROPERTY_GROUPS.flatMap(group => group.properties.map(definition => [definition.id, definition])));
export function getPropertyDefinition(propertyId) {
  return definitions.get(propertyId);
}

/** Keep editing and import validation in agreement on property values. */
export function isValidTrackValue(track, value) {
  if (!['number', 'boolean', 'string'].includes(track.valueType) || typeof value !== track.valueType) return false;
  const definition = getPropertyDefinition(track.propertyId);
  if (typeof value === 'number' && (!Number.isFinite(value) || (definition?.min !== undefined && value < definition.min) || (definition?.max !== undefined && value > definition.max))) return false;
  if (track.propertyId === 'hotbar.slot' && !Number.isInteger(value)) return false;
  if (typeof value === 'string' && value.length > 4096) return false;
  if (definition?.options && !definition.options.some(option => option.value === value)) return false;
  return true;
}

export function describeExtensions() {
  return PROPERTY_GROUPS.map(({ label, phase, description }) => `Đợt ${phase} · ${label}: ${description} (simulator)`);
}

/** Add missing tracks without overwriting existing data; safe to apply repeatedly. */
export function extendProject(project) {
  const result = structuredClone(project);
  const usedIds = new Set(result.replays.flatMap(replay => replay.tracks.map(track => track.id)));
  for (const replay of result.replays) {
    const addTrack = (definition, partId) => {
      if (replay.tracks.some(track => track.owner === definition.owner && track.partId === partId && track.propertyId === definition.id)) return;
      const prefix = `${replay.id}:${definition.owner}:${partId ?? 'replay'}:${definition.id}`;
      let id = prefix;
      let suffix = 2;
      while (usedIds.has(id)) id = `${prefix}:${suffix++}`;
      usedIds.add(id);
      replay.tracks.push({ id, replayId: replay.id, owner: definition.owner, partId,
        propertyId: definition.id, valueType: definition.type, baseValue: definition.defaultValue, keys: [] });
    };
    for (const group of PROPERTY_GROUPS) for (const definition of group.properties) {
      if (definition.owner === 'replay') {
        if (isPropertyApplicable(definition, replay, null)) addTrack(definition, null);
      } else {
        for (const part of replay.parts) {
          if (!isPropertyApplicable(definition, replay, part.id)) continue;
          if (!part.supportedProperties.includes(definition.id)) part.supportedProperties.push(definition.id);
          addTrack(definition, part.id);
        }
      }
    }
  }
  return result;
}

