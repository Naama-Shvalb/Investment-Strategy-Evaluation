import express, { Request, Response } from "express";
import morgan from "morgan";

export const app = express();
app.use(morgan("combined"));
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  console.log("kuku");
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
