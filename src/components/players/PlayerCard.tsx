import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Trash2, Pencil } from "lucide-react"; // Added Pencil icon
import { Player, Team } from "@/types";
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
import EditPlayerDialog from "./EditPlayerDialog"; // Import the new dialog

interface PlayerCardProps {
  player: Player;
  teams: Team[]; // Added teams prop to pass to EditPlayerDialog
  onDeletePlayer: (playerId: string) => void;
  onEditPlayer: (playerId: string, updatedPlayer: Partial<Omit<Player, "id">>) => void; // Added onEditPlayer prop
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, teams, onDeletePlayer, onEditPlayer }) => {
  const [isEditPlayerDialogOpen, setIsEditPlayerDialogOpen] = React.useState(false); // State for edit dialog

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${player.name}`} alt={player.name} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg font-medium">{player.name}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={() => setIsEditPlayerDialogOpen(true)} // Open edit dialog
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
                  This action cannot be undone. This will permanently delete the player "{player.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeletePlayer(player.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
      <EditPlayerDialog
        isOpen={isEditPlayerDialogOpen}
        onOpenChange={setIsEditPlayerDialogOpen}
        playerToEdit={player}
        teams={teams}
        onEditPlayer={onEditPlayer}
      />
    </Card>
  );
};

export default PlayerCard;