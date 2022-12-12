import { readLinesFromTextFile } from '@/util/io';

enum Shape {
  Rock,
  Paper,
  Scissors,
}

enum GameResult {
  Win,
  Draw,
  Lose,
}

const opponentMapping: Record<string, Shape> = {
  A: Shape.Rock,
  B: Shape.Paper,
  C: Shape.Scissors,
};

const myMapping: Record<string, Shape> = {
  X: Shape.Rock,
  Y: Shape.Paper,
  Z: Shape.Scissors,
};

const intendedResultMapping: Record<string, GameResult> = {
  X: GameResult.Lose,
  Y: GameResult.Draw,
  Z: GameResult.Win,
};

interface RockPaperScissorsGame {
  score: number;
}

class StandardRockPaperScissorsGame implements RockPaperScissorsGame {
  private readonly opponentShape: Shape;
  private readonly myShape: Shape;

  private static outcomes: Record<Shape, Record<Shape, GameResult>> = {
    [Shape.Rock]: {
      [Shape.Rock]: GameResult.Draw,
      [Shape.Paper]: GameResult.Lose,
      [Shape.Scissors]: GameResult.Win,
    },
    [Shape.Paper]: {
      [Shape.Rock]: GameResult.Win,
      [Shape.Paper]: GameResult.Draw,
      [Shape.Scissors]: GameResult.Lose,
    },
    [Shape.Scissors]: {
      [Shape.Rock]: GameResult.Lose,
      [Shape.Paper]: GameResult.Win,
      [Shape.Scissors]: GameResult.Draw,
    },
  };

  constructor(opponentShape: Shape, myShape: Shape) {
    this.opponentShape = opponentShape;
    this.myShape = myShape;
  }

  private get shapeScore(): number {
    switch (this.myShape) {
      case Shape.Rock:
        return 1;
      case Shape.Paper:
        return 2;
      case Shape.Scissors:
        return 3;
      default:
        throw new Error(`Unknown shape: ${this.myShape}`);
    }
  }

  get gameResult(): GameResult {
    return StandardRockPaperScissorsGame.outcomes[this.myShape][
      this.opponentShape
    ];
  }

  private get gameScore(): number {
    switch (this.gameResult) {
      case GameResult.Win:
        return 6;
      case GameResult.Draw:
        return 3;
      case GameResult.Lose:
        return 0;
      default:
        throw new Error(`Unknown game result ${this.gameResult}`);
    }
  }

  get score(): number {
    return this.shapeScore + this.gameScore;
  }
}

class ComputingRockPaperScissorsGame implements RockPaperScissorsGame {
  private readonly opponentShape: Shape;
  private readonly intendedGameResult: GameResult;

  constructor(opponentShape: Shape, intendedResult: GameResult) {
    this.opponentShape = opponentShape;
    this.intendedGameResult = intendedResult;
  }

  get score(): number {
    // By simulating the different possible games we can easily determine the correct score
    // Additionally, we re-use existing logic for determining the outcome
    for (const myShape of [Shape.Rock, Shape.Paper, Shape.Scissors]) {
      const game = new StandardRockPaperScissorsGame(
        this.opponentShape,
        myShape
      );

      if (game.gameResult === this.intendedGameResult) return game.score;
    }

    throw new Error('Could not determine score of intended outcome');
  }
}

async function main() {
  const lines = await readLinesFromTextFile('2.txt');

  // Part A:
  // const games = lines.map((x) => {
  //   const [opponentKey, myKey] = x.split(' ');
  //   return new StandardRockPaperScissorsGame(
  //     opponentMapping[opponentKey],
  //     myMapping[myKey]
  //   );
  // });

  const games = lines.map((x) => {
    const [opponentKey, myKey] = x.split(' ');
    return new ComputingRockPaperScissorsGame(
      opponentMapping[opponentKey],
      intendedResultMapping[myKey]
    );
  });

  console.log(games.reduce((acc, x) => acc + x.score, 0));
}

main();
