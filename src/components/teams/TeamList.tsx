import React from "react";
import TeamCard from "./TeamCard";

interface Team {
  id: string;
  name: string;
}

interface TeamListProps {
  teams: Team[];
}

const TeamList: React.FC<TeamListProps> = ({ teams }) => {
  if (teams.length === 0) {
    return (
      <p className="text-muted-foreground">No teams added yet. Create one above!</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
};

export default TeamList;