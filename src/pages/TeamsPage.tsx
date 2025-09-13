import React from "react";

const TeamsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      <p className="text-lg text-muted-foreground">
        Manage your sports teams here. You can add, edit, or remove teams.
      </p>
      {/* Future: Add team list, add team button, etc. */}
    </div>
  );
};

export default TeamsPage;