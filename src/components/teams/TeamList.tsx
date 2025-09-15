import React from "react";
import TeamCard from "./TeamCard";
import { Team, Player } from "@/types";

interface TeamListProps {
  teams: Team[];
  onAddPlayer: (player: Omit<Player, "id">) => void;
  onDeleteTeam: (teamId: string) => void;
  onEditTeam: (teamId: string, newName: string) => void; // Added onEditTeam prop
}

const TeamList: React.FC<TeamListProps> = ({ teams, onAddPlayer, onDeleteTeam, onEditTeam }) => {
  if (teams.length === 0) {
    return (
      <p className="text-muted-foreground">No teams added yet. Create one above!</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} onAddPlayer={onAddPlayer} onDeleteTeam={onDeleteTeam} onEditTeam={onEditTeam} />
      ))}
    </div>
  );
};

export default TeamList;