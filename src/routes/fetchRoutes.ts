import express, { Request, Response } from "express";
import * as fs from "fs";
const filePath = "../result.json";
import { fetchData } from "../utils/fetchData";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const router = express.Router();

const channelID = process.env.CHANNEL_ID;

router.get("/retrieve-info", async (req: Request, res: Response) => {
  try {
    console.log("Route hit");
    if (!fs.existsSync(filePath)) {
      const writeFileResult = await fetchData(channelID!);
      if (writeFileResult === true) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const videoData = JSON.parse(fileContent);
        res.status(200).send(videoData);
      } else {
        res
          .status(500)
          .send({ message: "Encountered an error while fetching" });
      }
    } else {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const videoData = JSON.parse(fileContent);
      res.status(200).send(videoData);
    }
  } catch (err: unknown) {
    console.log(err as String);
    res
      .status(500)
      .send({ message: "Encountered an error while fetching the data." });
  }
});
export default router;
