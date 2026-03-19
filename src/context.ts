import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

export const defaultContextPath = path.resolve(process.cwd(), "docs/company/company-context.md");
const maxInlineCharacters = 12000;

export type CompanyContext = {
  content: string;
  referencedFiles: string[];
  path: string;
};

function resolveReference(basePath: string, referencePath: string): string {
  return path.resolve(path.dirname(basePath), referencePath);
}

function extractReferencedPaths(content: string): string[] {
  return Array.from(
    new Set(
      Array.from(content.matchAll(/@([^\s]+)/g), (match) => match[1]?.trim()).filter(Boolean) as string[]
    )
  );
}

async function readReferencedFile(referencePath: string): Promise<string | null> {
  try {
    await access(referencePath, constants.R_OK);
  } catch {
    return null;
  }

  const content = (await readFile(referencePath, "utf8")).trim();
  return content || null;
}

function joinSections(sections: string[]): string {
  let total = 0;
  const accepted: string[] = [];

  for (const section of sections) {
    if (total + section.length > maxInlineCharacters) {
      break;
    }

    accepted.push(section);
    total += section.length;
  }

  return accepted.join("\n\n");
}

export async function loadCompanyContext(
  contextPath: string = defaultContextPath
): Promise<CompanyContext | null> {
  try {
    await access(contextPath, constants.R_OK);
  } catch {
    return null;
  }

  const rootContent = (await readFile(contextPath, "utf8")).trim();

  if (!rootContent) {
    return null;
  }

  const referencedFiles = extractReferencedPaths(rootContent);
  const referencedSections: string[] = [];

  for (const reference of referencedFiles) {
    const resolvedPath = resolveReference(contextPath, reference);
    const referencedContent = await readReferencedFile(resolvedPath);

    if (referencedContent) {
      referencedSections.push(`Referenced file: ${reference}\n\n${referencedContent}`);
    }
  }

  const content = joinSections([
    `Primary context file:\n\n${rootContent}`,
    ...referencedSections
  ]);

  return {
    content,
    referencedFiles,
    path: contextPath
  };
}
