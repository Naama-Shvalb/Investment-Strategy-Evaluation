import Portfolio from "../src/portfolio";
import RangesExecutor from "../src/rangesExecuter";
import Strategy from "../src/strategy";

describe("RangesExecutor", () => {
  let mockStockData: { date: string; AAPL: number }[];
  let mockStrategy: Strategy;
  let mockPortfolio: Portfolio;

  beforeEach(() => {
    // Setup mock stock data (JSON array)
    mockStockData = [
      { date: "2023-01-01", AAPL: 150 },
      { date: "2023-02-01", AAPL: 155 },
      { date: "2023-03-01", AAPL: 160 },
      { date: "2023-04-01", AAPL: 170 },
      // You can add more mock data entries as needed
    ];

    // Mock the Strategy object
    mockStrategy = new Strategy("AAPL", 100, 1);
    mockStrategy.firstDayActions = jest.fn();
    mockStrategy.dayActions = jest.fn();

    // Mock the Portfolio object
    mockPortfolio = new Portfolio(
      mockStockData,
      "2023-01-01",
      "2023-03-01",
      10000,
      0,
    );
    //mockPortfolio.rangeExecution = jest.fn().mockReturnValue(500); // Mock rangeExecution to return a profit value
  });

  it("should execute all ranges and return execution results", () => {
    // Create an instance of RangesExecutor
    const rangesExecutor = new RangesExecutor(
      mockStockData,
      mockStrategy,
      10000,
      3,
    );

    const results = rangesExecutor.allRangesExecution();
    console.log("results", results);
    // Assertions
    expect(results).toHaveLength(3); // Since sampleSize is 2
    expect(results[0].date).toBe("2023-01-01");
    //expect(results[0].result).toBe(500);
    expect(results[1].date).toBe("2023-02-01");
    //expect(results[1].result).toBe(500);

    // Check that the firstDayActions method was called once
    expect(mockStrategy.firstDayActions).toHaveBeenCalledTimes(3);
    // Check that rangeExecution was called twice
    //expect(mockPortfolio.rangeExecution).toHaveBeenCalledTimes(3);
  });

  it("by and hold", () => {
    mockStrategy.firstDayActions = function () {
      this.portfolio?.buyStocksByDollars(100);
    };

    const rangesExecutor = new RangesExecutor(
      mockStockData,
      mockStrategy,
      10000,
      3,
    );

    const results = rangesExecutor.allRangesExecution();
    console.log("results", results);
    // Assertions
    expect(results).toHaveLength(3); // Since sampleSize is 2
    expect(results[0].date).toBe("2023-01-01");
    //expect(results[0].result).toBe(500);
    expect(results[1].date).toBe("2023-02-01");
    //expect(results[1].result).toBe(500);

    // Check that the firstDayActions method was called once
    //expect(mockStrategy.firstDayActions).toHaveBeenCalledTimes(3);
    // Check that rangeExecution was called twice
    //expect(mockPortfolio.rangeExecution).toHaveBeenCalledTimes(3);
  });
});
