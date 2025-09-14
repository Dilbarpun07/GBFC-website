import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${player.name}`} alt={player.name} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg font-medium">{player.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Matches Played:</span>
          <span className="font-semibold text-foreground">{player.matchesPlayed}</span>
        </div>
        <div className="flex justify-between">
          <span>Trainings Attended:</span>
          <span className="font-semibold text-foreground">{player.trainingsAttended}</span>
        </div>
        <div className="flex justify-between">
          <span>Goals:</span>
          <span className="font-semibold text-foreground">{player.goals}</span>
        </div>
        <div className="flex justify-between">
          <span>Assists:</span>
          <span className="font-semibold text-foreground">{player.assists}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;