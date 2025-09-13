import React from "react";

const SchedulePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Schedule</h1>
      <p className="text-lg text-muted-foreground">
        Organize and view your team's game and practice schedules.
      </p>
      {/* Future: Add calendar, event list, etc. */}
    </div>
  );
};

export default SchedulePage;