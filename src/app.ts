import express from "express";
import fetchRoutes from "./routes/fetchRoutes";
import cors from "cors";
import * as dotenv from "dotenv";
import https from "https";
import * as fs from "fs";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 9300;

const options = {
  key: fs.readFileSync("keys/privkey.pem"),
  cert: fs.readFileSync("keys/fullchain.pem"),
};

app.use(
  cors({
    origin: [/http:\/\/localhost:\d+$/, "https://washizaki.pro"],
  })
);

app.use(express.json());
app.use("/api", fetchRoutes);

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log("HTTPS server running on port 9300");
});
