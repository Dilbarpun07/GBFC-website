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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Player, Team } from '@/types';
import { toast } from 'sonner';
import { validatePlayerData } from '@/utils/validation';

interface AddPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  teams?: Team[];
  teamId?: string;
}

const AddPlayerDialog: React.FC<AddPlayerDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddPlayer,
  teams,
  teamId,
}) => {
  const [playerName, setPlayerName] = React.useState('');
  const [selectedTeamId, setSelectedTeamId] = React.useState(teamId || '');
  const [position, setPosition] = React.useState('');

  // Use effect to update selectedTeamId when teamId prop changes
  React.useEffect(() => {
    if (teamId) {
      setSelectedTeamId(teamId);
    }
  }, [teamId]);

  const handleAddPlayer = async () => {
    try {
      const effectiveTeamId = teamId || selectedTeamId;

      if (!effectiveTeamId) {
        toast.error('Please select a team.');
        return;
      }

      // Validate and sanitize player data
      const playerData = validatePlayerData({
        name: playerName,
        position: position,
        matchesPlayed: 0,
        trainingsAttended: 0,
        goals: 0,
        assists: 0,
      });

      await onAddPlayer({
        ...playerData,
        teamId: effectiveTeamId,
      });

      setPlayerName('');
      setPosition('');
      if (!teamId) { // Only clear selection if using teams dropdown
        setSelectedTeamId('');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid player data');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
          <DialogDescription>
            {teams && !teamId
              ? "Enter the player's name and select a team. Click save when you're done."
              : "Enter the player's name. Click save when you're done."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="playerName" className="text-right">
              Player Name
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
            <Label htmlFor="position" className="text-right">
              Position
            </Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select position (optional)" />
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
          {teams && !teamId && (
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
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddPlayer}>
            Add Player
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlayerDialog;
