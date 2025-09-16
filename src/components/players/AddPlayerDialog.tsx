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

  // Use effect to update selectedTeamId when teamId prop changes
  React.useEffect(() => {
    if (teamId) {
      setSelectedTeamId(teamId);
    }
  }, [teamId]);

  const handleAddPlayer = async () => {
    const effectiveTeamId = teamId || selectedTeamId;

    if (playerName.trim() && effectiveTeamId) {
      await onAddPlayer({
        name: playerName.trim(),
        teamId: effectiveTeamId,
        matchesPlayed: 0,
        trainingsAttended: 0,
        goals: 0,
        assists: 0,
      });
      setPlayerName('');
      if (!teamId) { // Only clear selection if using teams dropdown
        setSelectedTeamId('');
      }
      onOpenChange(false);
    } else {
      if (!playerName.trim()) {
        toast.error('Player name cannot be empty.');
      } else if (!effectiveTeamId) {
        toast.error('Please select a team.');
      }
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
