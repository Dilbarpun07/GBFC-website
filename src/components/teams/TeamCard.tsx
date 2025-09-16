import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, PlusCircle, Trash2, Pencil } from 'lucide-react'; // Added Pencil icon
import { Team, Player } from '@/types';
import AddPlayerDialog from '@/components/players/AddPlayerDialog';
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
} from '@/components/ui/alert-dialog';
import EditTeamDialog from './EditTeamDialog'; // Import the new dialog

interface TeamCardProps {
  team: Team;
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  onDeleteTeam: (teamId: string) => void;
  onEditTeam: (teamId: string, newName: string) => void; // Added onEditTeam prop
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onAddPlayer,
  onDeleteTeam,
  onEditTeam,
}) => {
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] =
    React.useState(false);
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = React.useState(false); // State for edit dialog

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{team.name}</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={() => setIsEditTeamDialogOpen(true)} // Open edit dialog
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Users className="h-5 w-5 text-muted-foreground" />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  team "{team.name}" and all associated players, matches, and
                  training sessions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteTeam(team.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Manage players and schedule for this team.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsAddPlayerDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Player
        </Button>
        <AddPlayerDialog
          isOpen={isAddPlayerDialogOpen}
          onOpenChange={setIsAddPlayerDialogOpen}
          onAddPlayer={onAddPlayer}
          teamId={team.id}
        />
        <EditTeamDialog
          isOpen={isEditTeamDialogOpen}
          onOpenChange={setIsEditTeamDialogOpen}
          teamToEdit={team}
          onEditTeam={onEditTeam}
        />
      </CardContent>
    </Card>
  );
};

export default TeamCard;
