import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Trash2, Pencil } from "lucide-react"; // Added Pencil icon
import { TrainingSession, Team, Player } from "@/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditTrainingSessionDialog from "./EditTrainingSessionDialog"; // Import the new dialog

interface TrainingSessionCardProps {
  session: TrainingSession;
  team: Team | undefined;
  players: Player[];
  onDeleteTrainingSession: (sessionId: string) => void;
  onEditTrainingSession: (
    originalSession: TrainingSession,
    updatedSessionData: Partial<Omit<TrainingSession, "id">>
  ) => void;
}

const TrainingSessionCard: React.FC<TrainingSessionCardProps> = ({
  session,
  team,
  players,
  onDeleteTrainingSession,
  onEditTrainingSession,
}) => {
  const [isEditSessionDialogOpen, setIsEditSessionDialogOpen] = React.useState(false);
  const attendedPlayers = players.filter(player => session.attendedPlayerIds.includes(player.id));

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          Training for {team?.name || "Unknown Team"}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={() => setIsEditSessionDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the training session for "{team?.name || "Unknown Team"}" on {format(new Date(session.date), "PPP")}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteTrainingSession(session.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
      <EditTrainingSessionDialog
        isOpen={isEditSessionDialogOpen}
        onOpenChange={setIsEditSessionDialogOpen}
        sessionToEdit={session}
        teams={teams}
        players={players}
        onEditTrainingSession={onEditTrainingSession}
      />
    </Card>
  );
};

export default TrainingSessionCard;