"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { TrainingSession } from "@/types";

interface TrainingOverviewCardProps {
  trainingSessions: TrainingSession[];
}

const TrainingOverviewCard: React.FC<TrainingOverviewCardProps> = ({ trainingSessions }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Trainings</CardTitle>
        <Dumbbell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{trainingSessions.length}</div>
        <p className="text-xs text-muted-foreground">
          {trainingSessions.length === 1 ? "1 session recorded" : `${trainingSessions.length} sessions recorded`}
        </p>
      </CardContent>
    </Card>
  );
};

export default TrainingOverviewCard;