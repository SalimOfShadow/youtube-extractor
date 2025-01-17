import * as dotenv from "dotenv";
import * as fs from "fs";
dotenv.config({ path: "../../.env" });

interface VideoInfo {
  videoId: string;
  description: string;
}

const API_KEY = process.env.YOUTUBE_API_KEY;
const resultsNumber = process.env.RESULT_NUMBER;

export async function fetchData(channelId: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${resultsNumber}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    const videosResult: VideoInfo[] = data.items.map(
      (item: { id: { videoId: any }; snippet: { description: any } }) => ({
        videoId: item.id.videoId,
        description: item.snippet.description,
      })
    );

    try {
      fs.writeFile(
        "../result.json",
        JSON.stringify(videosResult),
        function (err) {
          if (err) {
            throw new Error(`Failed to write to file: ${err.message}`);
          }
        }
      );
    } catch (err: unknown) {
      console.error("File write error:", err);
      throw err;
    }
  } catch (err: unknown) {
    console.error("Error fetching or processing data:", err);
    throw err;
  }
}

setInterval(async () => {
  await fetchData("UChyN8KYX-0MZc_lRuVC1tRw");
}, 1000 * 60 * 60 * 12); // Every 12 hours
