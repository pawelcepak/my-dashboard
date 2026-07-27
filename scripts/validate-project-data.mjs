import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dataDir = resolve(process.cwd(), 'docs/data');
const readJson = async (name) => JSON.parse(await readFile(resolve(dataDir, name), 'utf8'));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

function assertUnique(items, selector, label) {
  const seen = new Set();
  for (const item of items) {
    const value = selector(item);
    assert(typeof value === 'string' && value.length > 0, `${label} contains an empty ID.`);
    assert(!seen.has(value), `${label} contains duplicate ID: ${value}`);
    seen.add(value);
  }
}

const [project, releases, roadmap, features, decisions, context] = await Promise.all([
  readJson('project.json'),
  readJson('releases.json'),
  readJson('roadmap.json'),
  readJson('features.json'),
  readJson('decisions.json'),
  readJson('current-context.json'),
]);

assert(project.id === 'chb', 'project.json: expected id "chb".');
assert(project.sourceOfTruth === 'docs/data', 'project.json: sourceOfTruth must be docs/data.');
assertUnique(releases.releases, (item) => item.version, 'releases.json');
const roadmapIds = roadmap.blocks.filter((item) => item.id).map((item) => item.id);
assertUnique(
  roadmapIds.map((id) => ({ id })),
  (item) => item.id,
  'roadmap.json'
);
const knownRoadmapIds = new Set(roadmapIds);
for (const block of roadmap.blocks)
  if (block.parentId)
    assert(knownRoadmapIds.has(block.parentId), `roadmap.json: missing parent ${block.parentId}.`);
assertUnique(features.features, (item) => item.id, 'features.json');
const taskIds = new Set(
  roadmap.blocks.filter((item) => item.type === 'task').map((item) => item.id)
);
for (const feature of features.features)
  assert(
    taskIds.has(feature.roadmapItemId),
    `features.json: ${feature.id} references missing roadmap item ${feature.roadmapItemId}.`
  );
assertUnique(decisions.decisions, (item) => item.id, 'decisions.json');
assert(
  context.currentVersion === project.currentVersion,
  'current-context.json: currentVersion differs from project.json.'
);
assert(
  context.currentSprint === project.currentSprint,
  'current-context.json: currentSprint differs from project.json.'
);

console.log('Project data validation passed.');
console.log(`Roadmap blocks: ${roadmap.blocks.length}`);
console.log(`Features: ${features.features.length}`);
console.log(`Decisions: ${decisions.decisions.length}`);
console.log(`Releases: ${releases.releases.length}`);
