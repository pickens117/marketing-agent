import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WorkflowId } from "./workflows.js";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function buildOutputPath(
  workflow: WorkflowId,
  prompt: string,
  explicitPath?: string
): string {
  if (explicitPath) {
    return path.resolve(process.cwd(), explicitPath);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const slug = slugify(prompt) || workflow;
  return path.resolve(process.cwd(), "outputs", `${timestamp}-${workflow}-${slug}.md`);
}

export async function writeOutputFile(filePath: string, content: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}
