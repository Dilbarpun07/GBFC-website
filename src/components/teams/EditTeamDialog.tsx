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
import { Team } from '@/types';
import { toast } from 'sonner';

interface EditTeamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamToEdit: Team;
  onEditTeam: (teamId: string, newName: string) => void;
}

const EditTeamDialog: React.FC<EditTeamDialogProps> = ({
  isOpen,
  onOpenChange,
  teamToEdit,
  onEditTeam,
}) => {
  const [teamName, setTeamName] = React.useState(teamToEdit.name);

  React.useEffect(() => {
    if (isOpen && teamToEdit) {
      setTeamName(teamToEdit.name);
    }
  }, [isOpen, teamToEdit]);

  const handleEditTeam = async () => {
    if (teamName.trim() && teamName.trim() !== teamToEdit.name) {
      await onEditTeam(teamToEdit.id, teamName.trim());
      onOpenChange(false);
    } else if (teamName.trim() === teamToEdit.name) {
      toast.info('No changes made to the team name.');
      onOpenChange(false);
    } else {
      toast.error('Team name cannot be empty.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>
            Update the name of your team. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teamName" className="text-right">
              Team Name
            </Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Falcons"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleEditTeam}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamDialog;
