import { readFile } from 'node:fs/promises';
import { EOL } from 'node:os';
import { join } from 'node:path';

export async function readLinesFromTextFile(
  relativePath: string
): Promise<string[]> {
  return (
    await readFile(join(process.cwd(), 'input', relativePath), 'utf8')
  ).split(EOL);
}
