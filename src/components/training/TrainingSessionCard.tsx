import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { TrainingSession, Team, Player } from "@/types";
import { format } from "date-fns";

interface TrainingSessionCardProps {
  session: TrainingSession;
  team: Team | undefined;
  players: Player[];
}

const TrainingSessionCard: React.FC<TrainingSessionCardProps> = ({ session, team, players }) => {
  const attendedPlayers = players.filter(player => session.attendedPlayerIds.includes(player.id));

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          Training for {team?.name || "Unknown Team"}
        </CardTitle>
        <Dumbbell className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Date:</span>
          <span className="font-semibold text-foreground">{format(new Date(session.date), "PPP")}</span>
        </div>
        <div className="flex justify-between">
          <span>Attended Players:</span>
          <span className="font-semibold text-foreground">
            {attendedPlayers.length} / {players.filter(p => p.teamId === session.teamId).length}
          </span>
        </div>
        {attendedPlayers.length > 0 && (
          <div>
            <p className="font-medium text-foreground mt-2 mb-1">Attendees:</p>
            <ul className="list-disc list-inside text-xs">
              {attendedPlayers.map(player => (
                <li key={player.id}>{player.name}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingSessionCard;