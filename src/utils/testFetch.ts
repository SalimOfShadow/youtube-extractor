export async function fetchVideoData() {
    const response = await fetch('http://localhost:9300/api/retrieve-info');
    const data = await response.json();
    console.log(data);
  }
  fetchVideoData();
  