import express, { Request, Response } from "express";
import * as fs from "fs";
import videoData from "../result.json";
import { fetchData } from "../utils/fetchData";

const router = express.Router();

router.get("/retrieve-info", async (req: Request, res: Response) => {
  try {
    if (!videoData) {
      await fetchData("UChyN8KYX-0MZc_lRuVC1tRw");
    }
    res.status(200).send(videoData);
  } catch (err: unknown) {
    console.log(err as String);
    res
      .status(500)
      .send({ message: "Encountered an error while fetching the data." });
  }
});
export default router;
