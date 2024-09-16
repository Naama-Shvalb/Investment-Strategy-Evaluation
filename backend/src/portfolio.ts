import * as https from "https";
import Strategy from "./strategy";
import { StockData } from "./types";
https.globalAgent.options.rejectUnauthorized = false;

class Portfolio {
  stocksData: StockData[];
  currentDate: string | null;
  startDate: string;
  endDate: string;
  index: number;
  cash: number;
  stocks: number;
  //strategy needs portfolio as field
  strategy?: Strategy;
  investedMoney: number;

  constructor(
    stocksData: StockData[],
    startDate: string,
    endDate: string,
    cash: number,
    index: number = 0,
  ) {
    this.stocksData = stocksData;
    this.startDate = startDate;
    this.endDate = endDate;
    this.currentDate = startDate;
    this.index = index;
    this.cash = cash;
    this.stocks = 0;
    this.investedMoney = 0;
  }
  //strategy needs portfolio as field
  setStrategy(strategy: Strategy) {
    this.strategy = strategy;
    this.strategy.portfolio = this;
  }

  // getStockData(date: string): StockData[] | undefined {
  //   return this.stocksData.find((day) => day.date === date);
  // }

  getNextDate(): string | undefined {
    if (this.stocksData[this.index + 1] !== undefined) {
      this.index++;
      return this.stocksData[this.index].date;
    }
  }

  convertDateToString(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  convertStringToDate(stringDate: string): Date {
    const date = new Date(stringDate);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }
    return date;
  }

  isFirstDayOfMonth(): boolean {
    const currentMonth = this.convertStringToDate(
      this.stocksData[this.index].date,
    ).getMonth();
    const previousMonth = this.convertStringToDate(
      this.stocksData[this.index - 1].date,
    ).getMonth();
    return currentMonth !== previousMonth;
  }

  rangeExecution(): number {
    const startValue = this.cash;
    for (
      let date: string | undefined = this.startDate;
      date && date <= this.endDate;
      date = this.getNextDate()
    ) {
      this.currentDate = date;
      if (date === this.startDate) {
        this.strategy!.firstDayActions();
      } else {
        this?.strategy?.dayActions();
      }
    }
    const finalValue = this.cash + this.checkStockPrice() * this.stocks;
    const profit = finalValue - startValue;
    if (profit === 0) {
      return profit;
    }
    return profit / this.investedMoney;
  }

  buyStocksByDollars(dollars: number): void {
    const stockCost = this.checkStockPrice();
    if (stockCost === 0) {
      return;
    }
    const stocksAmount = dollars / stockCost;
    if (this.cash - dollars >= 0) {
      this.cash -= dollars;
      this.stocks += stocksAmount;
      this.investedMoney += dollars;
    }
  }

  sellStocksByDollars(dollars: number): void {
    const stockCost = this.checkStockPrice();
    if (stockCost === 0) {
      return;
    }
    const stocksAmount = dollars / stockCost;
    this.cash += dollars;
    this.stocks -= stocksAmount;
  }

  sellAll(): void {
    const stockCost = this.checkStockPrice();
    if (stockCost === 0) {
      return;
    }
    this.cash += this.stocks * stockCost;
    this.stocks = 0;
  }

  checkStockPrice(): number {
    const stockData = this.stocksData[this.index];
    if (this.strategy) {
      const stockSymbol = this.strategy.stockSymbol;
      const stockPrice = stockData[stockSymbol];
      if (typeof stockPrice === "number") {
        return stockPrice;
      }
    }
    return 0; // Return 0 if the stock symbol is invalid or not found
  }
}

export default Portfolio;
