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
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${resultsNumber}`
  );
  const data = await response.json();

  const videosResult: VideoInfo[] = data.items.map(
    (item: { id: { videoId: any }; snippet: { description: any } }) => ({
      videoId: item.id.videoId,
      description: item.snippet.description,
    })
  );

  fs.writeFile("../result.json", JSON.stringify(videosResult), function (err) {
    if (err) {
      console.log(err);
    }
  });
}
