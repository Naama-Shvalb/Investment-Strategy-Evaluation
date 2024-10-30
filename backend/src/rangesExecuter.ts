import { after } from "node:test";
import Portfolio from "./portfolio";
import Strategy from "./strategy";
import { ExecutionResult, StockData, PortfolioArgs } from "./types";

class RangesExecutor {
  stocksData: StockData[];
  //portfolio needs strategy so its define in allRangesExecution
  portfolio?: Portfolio;
  strategy: Strategy;
  cash: number;
  sampleSize: number;

  constructor(
    stocksData: StockData[],
    strategy: Strategy,
    cash: number,
    sampleSize: number,
  ) {
    this.stocksData = stocksData;
    this.strategy = strategy;
    this.cash = cash;
    this.sampleSize = sampleSize;
  }

  private calculateIndexJump(): number {
    let indexJump: number = Math.floor(
      this.stocksData.length / this.sampleSize,
    );
    if (indexJump <= 1) {
      indexJump = 1;
    }
    return indexJump;
  }

  private getPortfolioArgsSet() {
    const indexJump: number = this.calculateIndexJump();
    const portfolioArgs: PortfolioArgs[] = [];
    for (
      let index: number = 0;
      index < this.stocksData.length - indexJump;
      index += indexJump
    ) {
      const lastDay: string = this.findLastDay(index);
      portfolioArgs.push({ firstDayIndex: index, lastDay: lastDay });
      if (lastDay > this.stocksData[this.stocksData.length - 1].date) break;
    }
    return portfolioArgs;
  }

  allRangesExecution(): ExecutionResult[] {
    const args: PortfolioArgs[] = this.getPortfolioArgsSet();
    const portfolios: Portfolio[] = args.map(({ firstDayIndex, lastDay }) => {
      const tempPortfolio: Portfolio = new Portfolio(
        this.stocksData,
        this.stocksData[firstDayIndex].date,
        lastDay,
        this.cash,
        firstDayIndex,
      );
      const strategyClone = this.strategy.clone();
      tempPortfolio.setStrategy(strategyClone);
      return tempPortfolio;
    });
    const executionsResults: ExecutionResult[] = portfolios.map(
      (portfolio: Portfolio) => {
        return {
          date: portfolio.startDate,
          result: portfolio.rangeExecution(),
        };
      },
    );

    return executionsResults;
  }

  findLastDay(index: number): string {
    const lastDay: Date = this.convertStringToDate(this.stocksData[index].date);
    console.log("Converted Date:", lastDay); // Log converted date
    lastDay.setMonth(lastDay.getMonth() + this.strategy.months);
    console.log("Modified Date (after adding months):", lastDay); // Log modified date
    const lastDayString: string = this.convertDateToString(lastDay);
    console.log("Last Day String:", lastDayString); // Log final string
    return lastDayString;
  }

  convertDateToString(date: Date): string {
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${date}`);
    }
    return date.toISOString().split("T")[0];
  }

  convertStringToDate(stringDate: string): Date {
    return new Date(stringDate);
  }
}

export default RangesExecutor;
