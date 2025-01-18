import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { getVideoDescription } from './getVideoDescription';
import { parseEntry } from './parseEntry';
dotenv.config({ path: '../.env' });

if (!fs.existsSync('../.env')) {
  console.log('The .env file does not exist.');
}

const API_KEY = process.env.YOUTUBE_API_KEY;
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
  matchWon: boolean;
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
        }) => ({
          videoId: item.id.videoId,
          description: await getVideoDescription(item.id.videoId, API_KEY!),
        })
      )
    );

    const videosResult: VideoInfo[] = idAndDescription.map(parseEntry);

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
  await fetchData('UChyN8KYX-0MZc_lRuVC1tRw');
}, 1000 * 60 * 60 * 12);
