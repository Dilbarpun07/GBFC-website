export interface Team {
  id: string;
  name: string;
  userId: string; // Added userId to link teams to the owner
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  matchesPlayed: number;
  trainingsAttended: number;
  goals: number;
  assists: number;
}

export interface Match {
  id: string;
  teamId: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
}

export interface TrainingSession {
  id: string;
  teamId: string;
  date: string;
  attendedPlayerIds: string[];
}
