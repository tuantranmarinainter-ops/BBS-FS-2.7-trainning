import test from 'node:test';
import assert from 'node:assert/strict';
import { createProject, findTrack, evaluateProject, upsertKey } from './core.js';
import { PROPERTY_GROUPS, extendProject, getPropertyDefinition, describeExtensions, isPropertyApplicable } from './extensions.js';
import { validateProject } from './persistence.js';

test('registry identifies unique simulator properties with usable defaults', () => {
  const properties = PROPERTY_GROUPS.flatMap(group => group.properties);
  assert.equal(new Set(properties.map(property => property.id)).size, properties.length);
  assert.deepEqual(new Set(PROPERTY_GROUPS.map(group => group.phase)), new Set([2, 3]));
  for (const property of properties) {
    assert.equal(property.evidence, 'simulator');
    assert.equal(getPropertyDefinition(property.id), property);
    assert.equal(typeof property.defaultValue, property.type);
    if (property.options) assert.ok(property.options.some(option => option.value === property.defaultValue));
  }
  assert.ok(describeExtensions().every(text => text.includes('simulator')));
});

test('upgrade is immutable, idempotent and preserves existing animation', () => {
  const original = createProject();
  const snapshot = structuredClone(original);
  const extended = extendProject(original);
  assert.deepEqual(original, snapshot);
  assert.notEqual(extended, original);
  const track = findTrack(extended, 'vfx', 'vfx.size', 'aura');
  const keyed = upsertKey(extended, track.id, 20, 2);
  const again = extendProject(keyed);
  assert.deepEqual(again, keyed);
  assert.notEqual(again, keyed);
  assert.deepEqual(findTrack(again, 'vfx', 'vfx.size', 'aura').keys, findTrack(keyed, 'vfx', 'vfx.size', 'aura').keys);
  assert.deepEqual(validateProject(again), { valid: true, errors: [] });
});

test('tracks have correct owners, parts and unique identifiers', () => {
  const project = extendProject(createProject());
  const ids = project.replays.flatMap(replay => replay.tracks.map(track => track.id));
  assert.equal(new Set(ids).size, ids.length);
  for (const replay of project.replays) {
    for (const group of PROPERTY_GROUPS) for (const definition of group.properties) {
      if (definition.owner === 'replay') {
        const track = findTrack(project, replay.id, definition.id);
        if (isPropertyApplicable(definition, replay, null)) {
          assert.equal(track.owner, 'replay');
          assert.equal(track.partId, null);
        } else assert.equal(track, undefined);
      } else for (const part of replay.parts) {
        const track = findTrack(project, replay.id, definition.id, part.id);
        if (!isPropertyApplicable(definition, replay, part.id)) {
          assert.equal(track, undefined);
          assert.equal(part.supportedProperties.includes(definition.id), false);
        } else {
          assert.equal(track.owner, 'form');
          assert.equal(part.supportedProperties.filter(id => id === definition.id).length, 1);
        }
      }
    }
  }
});

test('character controls are offered only where the scene implements them', () => {
  const project = extendProject(createProject());
  for (const property of ['states.sneaking', 'states.sprinting', 'hotbar.slot', 'equipment.mainHand', 'equipment.head']) {
    assert.ok(findTrack(project, 'den', property));
    assert.equal(findTrack(project, 'vfx', property), undefined);
  }
  for (const property of ['pose.headX', 'pose.armX', 'model.kind', 'texture.color', 'action']) {
    assert.ok(findTrack(project, 'wood', property, 'root'));
    assert.equal(findTrack(project, 'vfx', property, 'root'), undefined);
    assert.equal(findTrack(project, 'vfx', property, 'aura'), undefined);
  }
  assert.ok(findTrack(project, 'vfx', 'vfx.kind', 'aura'));
  assert.ok(findTrack(project, 'vfx', 'transform.x', 'aura'));
  assert.equal(findTrack(project, 'vfx', 'anchor.x', 'aura'), undefined);
});

test('core samples replay and selected form values independently', () => {
  let project = extendProject(createProject());
  const set = (replay, property, part, tick, value, interpolation) => {
    project = upsertKey(project, findTrack(project, replay, property, part).id, tick, value, interpolation);
  };
  set('vfx', 'variable.intensity', null, 0, 0, 'linear');
  set('vfx', 'variable.intensity', null, 20, 2, 'linear');
  set('vfx', 'vfx.kind', 'aura', 0, 'glow', 'linear');
  set('vfx', 'vfx.kind', 'aura', 20, 'sparks', 'linear');
  const sampled = evaluateProject(project, 10).vfx;
  assert.equal(sampled['variable.intensity'], 1);
  assert.equal(sampled.parts.aura['vfx.kind'], 'glow');
  assert.equal(sampled.parts.root['vfx.kind'], 'none');
  assert.equal(evaluateProject(project, 20).vfx.parts.aura['vfx.kind'], 'sparks');
  assert.equal(evaluateProject(project, 10).den['variable.intensity'], 1);
  assert.equal(validateProject(project).valid, true);
});
