export interface Artist {
  id: string;
  name: string;
  country?: string;
  disambiguation?: string;
}

export interface Track {
  id: string;
  title: string;
  lengthMs: number;
}

export interface Album {
  id: string;
  title: string;
  releaseDate?: string;
  tracks?: Track[];
  averageTrackLengthMs?: number;
}
