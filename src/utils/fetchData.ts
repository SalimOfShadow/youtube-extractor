import * as fs from 'fs';
import { getVideoDescription } from './getVideoDescription';
import { parseEntry } from './parseEntry';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

if (!fs.existsSync('../.env')) {
  console.log('The .env file does not exist.');
}

const API_KEY = process.env.YOUTUBE_API_KEY;
const channelID = process.env.CHANNEL_ID;
const resultsNumber = process.env.RESULT_NUMBER;

export interface IdAndDescription {
  videoId: string;
  description: string;
}

export interface VideoInfo {
  videoId: string;
  myCharacter: string;
  opponentsCharacter: string;
  roundsSetting: number;
  roundsWon: number;
  roundsLost: number;
  winner: string;
}

export async function fetchData(channelId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${resultsNumber}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    const idAndDescription = await Promise.all(
      data.items.map(
        async (item: {
          id: { videoId: any };
          snippet: { description: any };
        }) => {
          const description = await getVideoDescription(
            item.id.videoId,
            API_KEY!
          );

          // Check if the description contains "Match Result"
          if (description.includes('Match Details')) {
            return {
              videoId: item.id.videoId,
              description: description,
            };
          }
          // Return null or undefined to filter out items that do not match
          return null;
        }
      )
    );

    const videosResult: VideoInfo[] = idAndDescription
      .filter((item) => item !== null)
      .map(parseEntry);

    try {
      fs.writeFileSync('../result.json', JSON.stringify(videosResult));
      console.log('File written successfully');
      return true;
    } catch (err: unknown) {
      console.error('File write error:', err);
      return false;
    }
  } catch (err: unknown) {
    console.error('Error fetching or processing data:', err);
    return false;
  }
}

setInterval(async () => {
  await fetchData(channelID!);
}, 1000 * 60 * 60 * 12);
