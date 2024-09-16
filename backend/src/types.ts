export interface ExecutionResult {
  date: string;
  result: number;
}

export interface StockData {
  date: string;
  [stockSymbol: string]: number | string; // date is a string, but other fields are numbers
}

export interface PortfolioArgs {
  firstDayIndex: number;
  lastDay: string;
}
