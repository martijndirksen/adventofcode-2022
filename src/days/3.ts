import { readLinesFromTextFile } from '@/util/io';

const CHUNK_COUNT = 2;
const CHAR_A = 65;
const CHAR_Z = 90;
const CHAR_a = 97;
const CHAR_z = 122;
const OFFSET_UPPERCASE = -38;
const OFFSET_LOWERCASE = -96;

function splitIntoChunks(input: string, count: number): string[] {
  if (count < 1) throw new Error(`Invalid count specified: ${count}`);

  const chunkSize = Math.ceil(input.length / count);
  const chunks: string[] = [];

  for (let i = 0; i < count; i++) {
    chunks.push(input.slice(i * chunkSize, (i + 1) * chunkSize));
  }

  return chunks;
}

function chunk<T>(input: T[], chunkSize: number): T[][] {
  if (chunkSize < 1)
    throw new Error('Chunk size must be larger than or equal to 1');
  if (!input?.length) return [];

  let i = 0;
  let j = 0;
  const result = [];

  while (i < input.length) {
    result[j++] = input.slice(i, (i += chunkSize));
  }

  return result;
}

function getPriority(input: string) {
  if (!input) throw new Error('Input cannot be empty');
  if (input.length > 1)
    throw new Error(`Expected a string of length 1, but found ${input.length}`);

  const charCode = input.charCodeAt(0);

  if (charCode >= CHAR_A && charCode <= CHAR_Z) {
    return charCode + OFFSET_UPPERCASE;
  }

  if (charCode >= CHAR_a && charCode <= CHAR_z) {
    return charCode + OFFSET_LOWERCASE;
  }

  throw new Error(`Unexpected character: ${input}`);
}

function intersect<T>(...sets: Set<T>[]): Set<T> {
  if (!sets.length) return new Set();
  if (sets.length === 1) return sets[0];

  const other = sets.slice(1);
  return new Set([...sets[0]].filter((x) => other.every((y) => y.has(x))));
}

async function main() {
  const lines = await readLinesFromTextFile('3.txt');

  // Part A:
  // const sum = lines
  //   .map((x) => splitIntoNChunks(x, CHUNK_COUNT).map((x) => new Set(x)))
  //   .map((x) =>
  //     [...intersect(...x)].reduce((acc, y) => acc + getPriority(y), 0)
  //   )
  //   .reduce((acc, x) => acc + x, 0);
  // console.log(sum);

  const sum = chunk(lines, 3)
    .map((x) =>
      [...intersect<string>(...x.map((y) => new Set(y)))].reduce(
        (acc, y) => acc + getPriority(y),
        0
      )
    )
    .reduce((acc, x) => acc + x, 0);

  // I guess this was a challenge of how many maps and reduces i can write in a single file...
  console.log(sum);
}

main();
