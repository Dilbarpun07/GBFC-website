import React from "react";
import TrainingSessionCard from "./TrainingSessionCard";
import { TrainingSession, Team, Player } from "@/types";

interface TrainingSessionListProps {
  trainingSessions: TrainingSession[];
  teams: Team[];
  players: Player[];
}

const TrainingSessionList: React.FC<TrainingSessionListProps> = ({
  trainingSessions,
  teams,
  players,
}) => {
  if (trainingSessions.length === 0) {
    return (
      <p className="text-muted-foreground">No training sessions recorded yet. Add one above!</p>
    );
  }

  // Sort sessions by date, newest first
  const sortedSessions = [...trainingSessions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedSessions.map((session) => {
        const team = teams.find((t) => t.id === session.teamId);
        return (
          <TrainingSessionCard
            key={session.id}
            session={session}
            team={team}
            players={players}
          />
        );
      })}
    </div>
  );
};

export default TrainingSessionList;