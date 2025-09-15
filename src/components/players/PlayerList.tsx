import React from "react";
import PlayerCard from "./PlayerCard";
import { Player } from "@/types";

interface PlayerListProps {
  players: Player[];
  teams: { id: string; name: string }[]; // To display team name
  onDeletePlayer: (playerId: string) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, teams, onDeletePlayer }) => {
  if (players.length === 0) {
    return (
      <p className="text-muted-foreground">No players added yet. Add one from a team!</p>
    );
  }

  // Group players by team for better organization
  const playersByTeam: { [teamId: string]: Player[] } = players.reduce((acc, player) => {
    if (!acc[player.teamId]) {
      acc[player.teamId] = [];
    }
    acc[player.teamId].push(player);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.keys(playersByTeam).map((teamId) => {
        const team = teams.find((t) => t.id === teamId);
        return (
          <div key={teamId}>
            <h3 className="text-xl font-semibold mb-4">
              {team ? team.name : "Unassigned Players"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playersByTeam[teamId].map((player) => (
                <PlayerCard key={player.id} player={player} onDeletePlayer={onDeletePlayer} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerList;