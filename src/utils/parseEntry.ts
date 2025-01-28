import { IdAndDescription, VideoInfo } from './fetchData';

export function parseEntry(entry: IdAndDescription): VideoInfo {
  if (!entry) {
    return {
      videoId: 'INVALID',
      myCharacter: 'Bison',
      opponentsCharacter: 'Bison',
      roundsWon: 0,
      roundsLost: 0,
      roundsSetting: 0,
      winner: 'P1',
    };
  }

  const description = entry.description;
  console.log(description);

  const matches = (description.match(/\[([^\]]+)\]/g) || []).map((match) =>
    match.slice(1, -1).trim()
  );

  console.log(matches);

  if (matches.length < 7) {
    return {
      videoId: entry.videoId,
      myCharacter: 'Bison',
      opponentsCharacter: 'Bison',
      roundsSetting: 7,
      roundsWon: 0,
      roundsLost: 0,
      winner: 'P1',
    };
  }

  return {
    videoId: entry.videoId,
    myCharacter: matches[1],
    opponentsCharacter: matches[2],
    roundsSetting: parseInt(matches[3], 10),
    roundsWon: parseInt(matches[4], 10),
    roundsLost: parseInt(matches[5], 10),
    winner: matches[6].toUpperCase(),
  };
}
