import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const defaultContextPath = path.resolve(process.cwd(), "docs/company/company-context.md");

export type CompanyContext = {
  content: string;
  path: string;
};

export async function loadCompanyContext(
  contextPath: string = defaultContextPath
): Promise<CompanyContext | null> {
  try {
    await access(contextPath, constants.R_OK);
  } catch {
    return null;
  }

  const content = (await readFile(contextPath, "utf8")).trim();

  if (!content) {
    return null;
  }

  return {
    content,
    path: contextPath
  };
}
