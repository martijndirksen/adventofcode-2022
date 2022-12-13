import { readLinesFromTextFile } from '@/util/io';

class Range {
  readonly min: number;
  readonly max: number;

  constructor(min: number, max: number) {
    if (min > max) throw new Error('Invalid range specified');

    this.min = min;
    this.max = max;
  }

  public isContainedInRange(range: Range): boolean {
    return this.min >= range.min && this.max <= range.max;
  }

  public isContainedInRanges(...ranges: Range[]): boolean {
    return ranges.some((x) => this.isContainedInRange(x));
  }
}

function parseToRange(rangeString: string): Range {
  const [min, max] = rangeString.split('-');
  return new Range(+min, +max);
}

function someRangeIsContainedByOthers(pair: Range[]): boolean {
  for (let i = 0; i < pair.length; i++) {
    for (let j = 0; j < pair.length; j++) {
      if (i === j) continue;
      if (pair[i].isContainedInRange(pair[j])) {
        return true;
      }
    }
  }
  return false;
}

async function main() {
  const lines = await readLinesFromTextFile('4.txt');

  const pairs = lines.map((x) => x.split(',').map(parseToRange));
  let count = 0;

  for (const pair of pairs) {
    if (pair.length < 2) continue;
    if (someRangeIsContainedByOthers(pair)) count++;
  }

  console.log(count);
}

main();
