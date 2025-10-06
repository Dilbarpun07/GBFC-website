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
import { validatePlayerData } from '@/utils/validation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditPlayerDialogProps {
  player: Player;
  teams: Team[];
  onClose: () => void;
  onSave: (updatedPlayer: Partial<Omit<Player, 'id'>>) => void;
}

const EditPlayerDialog: React.FC<EditPlayerDialogProps> = ({
  player,
  teams,
  onClose,
  onSave,
}) => {
  const [playerName, setPlayerName] = React.useState(player.name);
  const [selectedTeamId, setSelectedTeamId] = React.useState(player.teamId);
  const [position, setPosition] = React.useState(player.position || '');
  const [matchesPlayed, setMatchesPlayed] = React.useState(
    player.matchesPlayed.toString()
  );
  const [trainingsAttended, setTrainingsAttended] = React.useState(
    player.trainingsAttended.toString()
  );
  const [goals, setGoals] = React.useState(player.goals.toString());
  const [assists, setAssists] = React.useState(player.assists.toString());

  React.useEffect(() => {
    setPlayerName(player.name);
    setSelectedTeamId(player.teamId);
    setPosition(player.position || '');
    setMatchesPlayed(player.matchesPlayed.toString());
    setTrainingsAttended(player.trainingsAttended.toString());
    setGoals(player.goals.toString());
    setAssists(player.assists.toString());
  }, [player]);

  const handleSave = async () => {
    try {
      if (!selectedTeamId) {
        toast.error('Please select a team.');
        return;
      }

      // Validate and sanitize player data
      const validatedData = validatePlayerData({
        name: playerName,
        position: position,
        matchesPlayed: parseInt(matchesPlayed, 10) || 0,
        trainingsAttended: parseInt(trainingsAttended, 10) || 0,
        goals: parseInt(goals, 10) || 0,
        assists: parseInt(assists, 10) || 0,
      });

      const updatedPlayer: Partial<Omit<Player, 'id'>> = {
        ...validatedData,
        teamId: selectedTeamId,
      };

      // Check if any actual changes were made
      const hasChanges =
        updatedPlayer.name !== player.name ||
        updatedPlayer.teamId !== player.teamId ||
        updatedPlayer.position !== (player.position || '') ||
        updatedPlayer.matchesPlayed !== player.matchesPlayed ||
        updatedPlayer.trainingsAttended !== player.trainingsAttended ||
        updatedPlayer.goals !== player.goals ||
        updatedPlayer.assists !== player.assists;

      if (hasChanges) {
        await onSave(updatedPlayer);
      } else {
        toast.info('No changes made to the player details.');
        onClose();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid player data');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
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
            <Label htmlFor="position" className="text-right">
              Position
            </Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                <SelectItem value="Defender">Defender</SelectItem>
                <SelectItem value="Midfielder">Midfielder</SelectItem>
                <SelectItem value="Forward">Forward</SelectItem>
                <SelectItem value="Striker">Striker</SelectItem>
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlayerDialog;
