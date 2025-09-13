import React from "react";

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-lg text-muted-foreground">
        Welcome to your SportEasy app! This is your central hub for managing teams, players, and schedules.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Placeholder for dashboard cards */}
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Upcoming Games</h2>
          <p className="text-muted-foreground">No games scheduled soon.</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Team Roster</h2>
          <p className="text-muted-foreground">View and manage your team members.</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Recent Activities</h2>
          <p className="text-muted-foreground">No recent activities.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;