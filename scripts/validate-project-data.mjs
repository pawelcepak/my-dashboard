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

const [project, releases, roadmap, features, decisions, context, modules, issues, aiInterface] =
  await Promise.all([
    readJson('project.json'),
    readJson('releases.json'),
    readJson('roadmap.json'),
    readJson('features.json'),
    readJson('decisions.json'),
    readJson('current-context.json'),
    readJson('modules.json'),
    readJson('issues.json'),
    readJson('ai-interface.json'),
  ]);

assert(project.id === 'chb', 'project.json: expected id "chb".');
assert(project.sourceOfTruth === 'docs/data', 'project.json: sourceOfTruth must be docs/data.');
assert(
  project.currentVersion === context.currentVersion,
  'project/context currentVersion mismatch.'
);
assert(project.currentSprint === context.currentSprint, 'project/context currentSprint mismatch.');
assertUnique(releases.releases, (item) => item.version, 'releases.json');

const roadmapRecords = roadmap.blocks.filter((item) => item.id);
assertUnique(roadmapRecords, (item) => item.id, 'roadmap.json');
const roadmapIds = new Set(roadmapRecords.map((item) => item.id));
for (const block of roadmap.blocks)
  if (block.parentId)
    assert(roadmapIds.has(block.parentId), `roadmap.json: missing parent ${block.parentId}.`);

assertUnique(features.features, (item) => item.id, 'features.json');
const taskIds = new Set(
  roadmap.blocks.filter((item) => item.type === 'task').map((item) => item.id)
);
for (const feature of features.features)
  assert(
    taskIds.has(feature.roadmapItemId),
    `features.json: ${feature.id} references missing roadmap item ${feature.roadmapItemId}.`
  );

assertUnique(modules.modules, (item) => item.id, 'modules.json');
const moduleIds = new Set(modules.modules.map((item) => item.id));
for (const module of modules.modules)
  for (const dependency of module.dependsOn)
    assert(
      moduleIds.has(dependency),
      `modules.json: ${module.id} references missing dependency ${dependency}.`
    );

assertUnique(issues.issues, (item) => item.id, 'issues.json');
for (const issue of issues.issues)
  assert(
    moduleIds.has(issue.moduleId),
    `issues.json: ${issue.id} references missing module ${issue.moduleId}.`
  );

assertUnique(decisions.decisions, (item) => item.id, 'decisions.json');
const featureIds = new Set(features.features.map((item) => item.id));
for (const decision of decisions.decisions)
  for (const featureId of decision.relatedFeatures ?? [])
    assert(
      featureIds.has(featureId),
      `decisions.json: ${decision.id} references missing feature ${featureId}.`
    );

assert(aiInterface.vendorNeutral === true, 'ai-interface.json: vendorNeutral must be true.');
assertUnique(aiInterface.generatedAdapters, (item) => item.id, 'ai-interface adapters');
const canonicalSources = new Set(aiInterface.canonicalSources);
for (const required of [
  'docs/data/project.json',
  'docs/data/current-context.json',
  'docs/data/modules.json',
  'docs/data/issues.json',
])
  assert(
    canonicalSources.has(required),
    `ai-interface.json: missing canonical source ${required}.`
  );

console.log('Project data validation passed.');
console.log(`Roadmap blocks: ${roadmap.blocks.length}`);
console.log(`Features: ${features.features.length}`);
console.log(`Decisions: ${decisions.decisions.length}`);
console.log(`Modules: ${modules.modules.length}`);
console.log(`Issues: ${issues.issues.length}`);
console.log(`AI adapters: ${aiInterface.generatedAdapters.length}`);
console.log(`Releases: ${releases.releases.length}`);
