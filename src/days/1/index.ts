import { readLinesFromTextFile } from '@/util/io';

function maxSum(values: number[]): number {
  if (!values?.length) throw new Error('Values cannot be empty or undefined');

  let max = values[0];

  for (const value of values) {
    if (value > max) max = value;
  }

  return max;
}

async function main() {
  const lines = await readLinesFromTextFile('1.txt');

  const reduced = lines.reduce(
    (prev, x) => {
      if (x === '') {
        prev.push(0);
        return prev;
      }

      const numericValue = +x;

      if (isNaN(numericValue)) throw new Error(`Value is not a number: ${x}`);

      prev[prev.length - 1] += numericValue;

      return prev;
    },
    [0]
  );

  console.log(maxSum(reduced));
}

main();
