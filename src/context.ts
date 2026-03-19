import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import type { ContextCategory } from "./workflows.js";

export const defaultContextPath = path.resolve(process.cwd(), "docs/company/company-context.md");
const maxInlineCharacters = 12000;

export type CompanyContextSection = {
  category: ContextCategory;
  content: string;
  metadata: Record<string, string | string[]>;
  path: string;
};

export type CompanyContext = {
  content: string;
  referencedFiles: string[];
  sections: CompanyContextSection[];
  selectedCategories: ContextCategory[];
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

function inferCategory(referencePath: string): ContextCategory {
  const lower = referencePath.toLowerCase();

  if (lower.includes("brand")) {
    return "brand";
  }

  if (lower.includes("message") || lower.includes("position")) {
    return "messaging";
  }

  if (lower.includes("persona") || lower.includes("audience")) {
    return "persona";
  }

  if (lower.includes("legal") || lower.includes("compliance")) {
    return "legal";
  }

  if (lower.includes("governance") || lower.includes("policy")) {
    return "governance";
  }

  if (lower.includes("research") || lower.includes("market")) {
    return "research";
  }

  return "general";
}

function parseFrontmatter(rawContent: string): {
  body: string;
  metadata: Record<string, string | string[]>;
} {
  if (!rawContent.startsWith("---\n")) {
    return { body: rawContent.trim(), metadata: {} };
  }

  const endIndex = rawContent.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { body: rawContent.trim(), metadata: {} };
  }

  const frontmatter = rawContent.slice(4, endIndex).trim();
  const body = rawContent.slice(endIndex + 5).trim();
  const metadata: Record<string, string | string[]> = {};
  let currentArrayKey: string | null = null;

  for (const line of frontmatter.split("\n")) {
    if (line.startsWith("  - ") || line.startsWith("- ")) {
      if (currentArrayKey) {
        const current = metadata[currentArrayKey];
        const nextValue = line.replace(/^(\s*- )/, "").trim();
        metadata[currentArrayKey] = Array.isArray(current) ? [...current, nextValue] : [nextValue];
      }
      continue;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!value) {
      currentArrayKey = key;
      metadata[key] = [];
      continue;
    }

    currentArrayKey = null;
    metadata[key] = value;
  }

  return { body, metadata };
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
  contextPath: string = defaultContextPath,
  preferredCategories: ContextCategory[] = ["general", "brand", "messaging", "persona", "research", "legal", "governance"]
): Promise<CompanyContext | null> {
  try {
    await access(contextPath, constants.R_OK);
  } catch {
    return null;
  }

  const rootRawContent = (await readFile(contextPath, "utf8")).trim();
  const rootParsed = parseFrontmatter(rootRawContent);
  const rootContent = rootParsed.body;

  if (!rootContent) {
    return null;
  }

  const referencedFiles = extractReferencedPaths(rootContent);
  const allSections: CompanyContextSection[] = [
    {
      category: "general",
      content: rootContent,
      metadata: rootParsed.metadata,
      path: contextPath
    }
  ];

  for (const reference of referencedFiles) {
    const resolvedPath = resolveReference(contextPath, reference);
    const referencedRawContent = await readReferencedFile(resolvedPath);

    if (referencedRawContent) {
      const parsed = parseFrontmatter(referencedRawContent);
      allSections.push({
        category: (parsed.metadata.category as ContextCategory | undefined) ?? inferCategory(reference),
        content: parsed.body,
        metadata: parsed.metadata,
        path: reference
      });
    }
  }

  const preferredCategorySet = new Set(preferredCategories);
  const selectedSections = allSections.filter((section) => preferredCategorySet.has(section.category));

  const content = joinSections([
    ...selectedSections.map((section) =>
      section.path === contextPath
        ? `Primary context file:\n\n${section.content}`
        : `Referenced file (${section.category}): ${section.path}
Metadata: ${JSON.stringify(section.metadata)}

${section.content}`
    )
  ]);

  return {
    content,
    referencedFiles,
    sections: selectedSections,
    selectedCategories: preferredCategories,
    path: contextPath
  };
}
