"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shirt } from "lucide-react";
import { Player } from "@/types";

interface PlayerOverviewCardProps {
  players: Player[];
}

const PlayerOverviewCard: React.FC<PlayerOverviewCardProps> = ({ players }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Players</CardTitle>
        <Shirt className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{players.length}</div>
        <p className="text-xs text-muted-foreground">
          {players.length === 1 ? "1 player registered" : `${players.length} players registered`}
        </p>
      </CardContent>
    </Card>
  );
};

export default PlayerOverviewCard;