import React from "react";
import PlayerList from "@/components/players/PlayerList";
import { Player, Team } from "@/types";

interface PlayersPageProps {
  players: Player[];
  teams: Team[];
}

const PlayersPage: React.FC<PlayersPageProps> = ({ players, teams }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Players</h1>
      <p className="text-lg text-muted-foreground mb-6">
        View and manage individual players across all your teams.
      </p>

      <div className="mt-8">
        <PlayerList players={players} teams={teams} />
      </div>
    </div>
  );
};

export default PlayersPage;