import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

export async function bootstrapCompanyPack(destination = "docs/company"): Promise<string> {
  const source = path.resolve(process.cwd(), "docs/company/example-pack");
  const target = path.resolve(process.cwd(), destination);
  await mkdir(target, { recursive: true });
  await cp(source, target, { recursive: true });
  return target;
}
