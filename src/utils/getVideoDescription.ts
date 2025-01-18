export async function getVideoDescription(id: string, API_KEY: string) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items[0]?.snippet?.description || '';
}
