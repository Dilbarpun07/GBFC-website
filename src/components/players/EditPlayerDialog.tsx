import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Player, Team } from '@/types';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  playerToEdit: Player;
  teams: Team[];
  onEditPlayer: (
    playerId: string,
    updatedPlayer: Partial<Omit<Player, 'id'>>
  ) => void;
}

const EditPlayerDialog: React.FC<EditPlayerDialogProps> = ({
  isOpen,
  onOpenChange,
  playerToEdit,
  teams,
  onEditPlayer,
}) => {
  const [playerName, setPlayerName] = React.useState(playerToEdit.name);
  const [selectedTeamId, setSelectedTeamId] = React.useState(
    playerToEdit.teamId
  );
  const [matchesPlayed, setMatchesPlayed] = React.useState(
    playerToEdit.matchesPlayed.toString()
  );
  const [trainingsAttended, setTrainingsAttended] = React.useState(
    playerToEdit.trainingsAttended.toString()
  );
  const [goals, setGoals] = React.useState(playerToEdit.goals.toString());
  const [assists, setAssists] = React.useState(playerToEdit.assists.toString());

  React.useEffect(() => {
    if (isOpen && playerToEdit) {
      setPlayerName(playerToEdit.name);
      setSelectedTeamId(playerToEdit.teamId);
      setMatchesPlayed(playerToEdit.matchesPlayed.toString());
      setTrainingsAttended(playerToEdit.trainingsAttended.toString());
      setGoals(playerToEdit.goals.toString());
      setAssists(playerToEdit.assists.toString());
    }
  }, [isOpen, playerToEdit]);

  const handleEditPlayer = async () => {
    const updatedPlayer: Partial<Omit<Player, 'id'>> = {
      name: playerName.trim(),
      teamId: selectedTeamId,
      matchesPlayed: parseInt(matchesPlayed, 10) || 0,
      trainingsAttended: parseInt(trainingsAttended, 10) || 0,
      goals: parseInt(goals, 10) || 0,
      assists: parseInt(assists, 10) || 0,
    };

    // Check if any actual changes were made
    const hasChanges =
      updatedPlayer.name !== playerToEdit.name ||
      updatedPlayer.teamId !== playerToEdit.teamId ||
      updatedPlayer.matchesPlayed !== playerToEdit.matchesPlayed ||
      updatedPlayer.trainingsAttended !== playerToEdit.trainingsAttended ||
      updatedPlayer.goals !== playerToEdit.goals ||
      updatedPlayer.assists !== playerToEdit.assists;

    if (playerName.trim() && selectedTeamId) {
      if (hasChanges) {
        await onEditPlayer(playerToEdit.id, updatedPlayer);
        onOpenChange(false);
      } else {
        toast.info('No changes made to the player details.');
        onOpenChange(false);
      }
    } else {
      toast.error('Player name and team cannot be empty.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
          <DialogDescription>
            Update the player's details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="playerName" className="text-right">
              Name
            </Label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Lionel Messi"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right">
              Team
            </Label>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="matchesPlayed" className="text-right">
              Matches Played
            </Label>
            <Input
              id="matchesPlayed"
              type="number"
              value={matchesPlayed}
              onChange={(e) => setMatchesPlayed(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="trainingsAttended" className="text-right">
              Trainings Attended
            </Label>
            <Input
              id="trainingsAttended"
              type="number"
              value={trainingsAttended}
              onChange={(e) => setTrainingsAttended(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="goals" className="text-right">
              Goals
            </Label>
            <Input
              id="goals"
              type="number"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assists" className="text-right">
              Assists
            </Label>
            <Input
              id="assists"
              type="number"
              value={assists}
              onChange={(e) => setAssists(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleEditPlayer}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlayerDialog;
