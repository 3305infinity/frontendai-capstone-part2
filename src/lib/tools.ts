import { z } from "zod";
import { readFile } from "fs/promises";

export const repositoryAnalyzerInputSchema = z.object({
  analysisType: z.enum([
    "overview",
    "architecture",
    "tech-stack",
    "documentation",
  ]),
});

export type RepositoryAnalyzerInput = z.infer<typeof repositoryAnalyzerInputSchema>;

export interface RepositoryAnalysisResult {
  projectName: string;
  framework: string;
  language: string;
  dependencies: string[];
  scripts: Record<string, string>;
  architectureSummary: string;
  documentationStatus: string;
  recommendations: string[];
}

async function readFileIfExists(filename: string): Promise<string> {
  try {
    return await readFile(filename, "utf-8");
  } catch {
    return "";
  }
}

interface PackageJsonData {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

function parsePackageJson(content: string): PackageJsonData | null {
  try {
    const pkg = JSON.parse(content) as PackageJsonData;
    return pkg;
  } catch {
    return null;
  }
}

function extractProjectName(readmeContent: string): string {
  const h1Match = readmeContent.match(/^#\s+(.+)$/m);
  return h1Match ? h1Match[1].trim() : "Unknown Project";
}

function detectFramework(pkg: PackageJsonData): string {
  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  if (allDeps.next) return "Next.js";
  if (allDeps.express) return "Express.js";
  if (allDeps.vue) return "Vue.js";
  if (allDeps.ng) return "Angular";
  if (allDeps.react) return "React";
  return "Unknown";
}

function detectLanguage(pkg: PackageJsonData): string {
  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  if (allDeps.typescript || Object.keys(pkg.devDependencies || {}).some((k) => k.includes("typescript"))) {
    return "TypeScript";
  }
  if (allDeps["@types/node"]) {
    return "TypeScript";
  }
  return "JavaScript";
}

function getAllDependencies(pkg: PackageJsonData): string[] {
  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  return Object.keys(allDeps).sort();
}

function generateArchitectureSummary(
  readmeContent: string,
  pkg: PackageJsonData | null,
  optionalFiles: { buildLog: string; architecture: string; workflow: string }
): string {
  const sections: string[] = [];
  
  if (readmeContent) {
    const overviewMatch = readmeContent.match(/##\s+(?:Project Overview|Overview|Architecture)/i);
    if (overviewMatch) {
      sections.push("Project overview documented in README.md");
    }
  }
  
  if (pkg?.scripts) {
    const scriptKeys = Object.keys(pkg.scripts);
    if (scriptKeys.includes("dev") || scriptKeys.includes("build")) {
      sections.push("Build pipeline configured with npm scripts");
    }
  }
  
  if (optionalFiles.architecture) {
    sections.push("ARCHITECTURE.md provides detailed architectural documentation");
  }
  
  if (optionalFiles.workflow) {
    sections.push("workflow.md contains development workflow documentation");
  }
  
  return sections.length > 0 ? sections.join(", ") : "No significant architectural documentation found";
}

function generateDocumentationStatus(
  readmeContent: string,
  optionalFiles: { buildLog: string; architecture: string; workflow: string }
): string {
  const status: string[] = [];
  
  if (readmeContent) {
    status.push("README.md ✓");
  }
  
  if (optionalFiles.buildLog) {
    status.push("BUILD_LOG.md ✓");
  }
  
  if (optionalFiles.architecture) {
    status.push("ARCHITECTURE.md ✓");
  }
  
  if (optionalFiles.workflow) {
    status.push("workflow.md ✓");
  }
  
  return status.length > 0 ? status.join(", ") : "Only README.md present";
}

function generateRecommendations(
  pkg: PackageJsonData | null,
  optionalFiles: { buildLog: string; architecture: string; workflow: string }
): string[] {
  const recommendations: string[] = [];
  
  if (!optionalFiles.architecture) {
    recommendations.push("Add ARCHITECTURE.md to document system design");
  }
  
  if (!optionalFiles.workflow) {
    recommendations.push("Add workflow.md for development process documentation");
  }
  
  if (!optionalFiles.buildLog) {
    recommendations.push("Add BUILD_LOG.md to track build history and issues");
  }
  
  if (pkg?.scripts?.test && !Object.keys(pkg.scripts).some((k) => k.includes("test"))) {
    recommendations.push("Configure proper test scripts in package.json");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Documentation is comprehensive - consider adding API docs");
  }
  
  return recommendations;
}

export async function analyzeRepository(input: RepositoryAnalyzerInput): Promise<RepositoryAnalysisResult> {
  void input;
  const [readmeContent, packageJsonContent] = await Promise.all([
    readFileIfExists("README.md"),
    readFileIfExists("package.json"),
  ]);
  
  const [buildLog, architecture, workflow] = await Promise.all([
    readFileIfExists("BUILD_LOG.md"),
    readFileIfExists("ARCHITECTURE.md"),
    readFileIfExists("workflow.md"),
  ]);
  
  const optionalFiles = {
    buildLog,
    architecture,
    workflow,
  };
  
  const pkg = packageJsonContent ? parsePackageJson(packageJsonContent) : null;
  
  const projectName = readmeContent ? extractProjectName(readmeContent) : (pkg?.name || "Unknown Project");
  const framework = pkg ? detectFramework(pkg) : "Unknown";
  const language = pkg ? detectLanguage(pkg) : "JavaScript";
  const dependencies = pkg ? getAllDependencies(pkg) : [];
  const scripts = pkg?.scripts || {};
  const architectureSummary = generateArchitectureSummary(readmeContent, pkg, optionalFiles);
  const documentationStatus = generateDocumentationStatus(readmeContent, optionalFiles);
  const recommendations = generateRecommendations(pkg, optionalFiles);
  
  return {
    projectName,
    framework,
    language,
    dependencies,
    scripts,
    architectureSummary,
    documentationStatus,
    recommendations,
  };
}