import {
  createIdea,
  createProject,
  exportWorkspaceJson,
  getCompletionLog,
  getFilteredIdeas,
  getIdeasForProject,
  getProjectStats,
  getVisibleProjects,
  importLegacyProjects,
  importWorkspaceJson,
  moveIdea,
  moveProject,
  toggleIdeaDone,
  toggleIdeaPin,
  toggleProjectPin,
  updateIdea,
  updateProject,
} from "../src/index.js";

const assert = (condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

const legacy = [
  {
    id: "project-a",
    name: "Legacy Project",
    description: "Imported from Project Idea Studio",
    category: "CI",
    startDate: "2026-01-01",
    dueDate: "2026-02-01",
    pinned: true,
    ideas: [
      {
        id: "idea-a",
        text: "Keep legacy idea",
        done: true,
        createdAt: 1767225600000,
        finishedAt: "2026-01-03T00:00:00.000Z",
        pinned: true,
      },
      {
        id: "idea-b",
        text: "Keep todo idea",
        done: false,
      },
    ],
  },
];

let workspace = importLegacyProjects(legacy, "smoke-device");
assert(workspace.schemaVersion === 1, "workspace schema should be v1");
assert(workspace.projects.length === 1, "legacy project should import");
assert(workspace.ideas.length === 2, "legacy ideas should flatten");
assert(workspace.ideas.every((idea) => idea.projectId === "project-a"), "ideas should keep projectId");
assert(getProjectStats(workspace, "project-a").percent === 50, "legacy stats should compute");
assert(getCompletionLog(workspace).length === 1, "legacy completed idea should appear in log");

const projectResult = createProject(workspace, {
  name: "New Project",
  description: "Core smoke",
  category: "MP",
});
workspace = projectResult.workspace;
assert(getVisibleProjects(workspace).length === 2, "new project should be visible");

workspace = updateProject(workspace, projectResult.project.id, {
  name: "Renamed Project",
  dueDate: "2026-06-30",
});
assert(
  getVisibleProjects(workspace).some((project) => project.name === "Renamed Project"),
  "project update should persist"
);

const ideaResult = createIdea(workspace, projectResult.project.id, "Write core test");
workspace = ideaResult.workspace;
workspace = updateIdea(workspace, ideaResult.idea.id, { text: "Write better core test" });
workspace = toggleIdeaPin(workspace, ideaResult.idea.id);
workspace = toggleIdeaDone(workspace, ideaResult.idea.id);

assert(getProjectStats(workspace, projectResult.project.id).done === 1, "done toggle should update stats");
assert(getFilteredIdeas(workspace, projectResult.project.id, "done").length === 1, "done filter should work");
assert(
  getIdeasForProject(workspace, projectResult.project.id)[0]?.text === "Write better core test",
  "idea update should persist"
);

workspace = toggleProjectPin(workspace, projectResult.project.id);
workspace = moveProject(workspace, projectResult.project.id, -1);
workspace = moveIdea(workspace, projectResult.project.id, ideaResult.idea.id, -1);

const exported = exportWorkspaceJson(workspace);
const imported = importWorkspaceJson(exported, "smoke-device");
assert(imported.projects.length === workspace.projects.length, "export/import should preserve projects");
assert(imported.ideas.length === workspace.ideas.length, "export/import should preserve ideas");

console.log("core smoke passed");
