import * as https from "https";
import Portfolio from "./portfolio";

https.globalAgent.options.rejectUnauthorized = false;

class Strategy {
  stockSymbol: string;
  quantity: number;
  months: number;
  portfolio: Portfolio | null; // Use the Portfolio type and allow it to be null initially

  constructor(stockSymbol: string, quantity: number, months: number = 60) {
    this.stockSymbol = stockSymbol;
    this.quantity = quantity;
    this.months = months;
    this.portfolio = null;
  }

  firstDayActions(): void {
    console.warn("firstDayActions() must be implemented");
  }

  dayActions(): void {
    console.warn("dayActions() must be implemented");
  }

  clone(): Strategy {
    const strategyPrototype = new Strategy(
      this.stockSymbol,
      this.quantity,
      this.months,
    );
    strategyPrototype.firstDayActions = this.firstDayActions;
    strategyPrototype.dayActions = this.dayActions;
    return strategyPrototype;
  }
}

export default Strategy;
