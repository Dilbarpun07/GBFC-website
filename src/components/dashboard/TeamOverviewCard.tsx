"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Team } from "@/types";

interface TeamOverviewCardProps {
  teams: Team[];
}

const TeamOverviewCard: React.FC<TeamOverviewCardProps> = ({ teams }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{teams.length}</div>
        <p className="text-xs text-muted-foreground">
          {teams.length === 1 ? "1 team registered" : `${teams.length} teams registered`}
        </p>
      </CardContent>
    </Card>
  );
};

export default TeamOverviewCard;