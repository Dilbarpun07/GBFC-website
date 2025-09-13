import React from "react";

const PlayersPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Players</h1>
      <p className="text-lg text-muted-foreground">
        Manage individual players across your teams.
      </p>
      {/* Future: Add player list, add player button, etc. */}
    </div>
  );
};

export default PlayersPage;