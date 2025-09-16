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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Match, Team } from '@/types';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditMatchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  matchToEdit: Match;
  teams: Team[];
  onEditMatch: (
    matchId: string,
    updatedMatch: Partial<Omit<Match, 'id'>>
  ) => void;
}

const EditMatchDialog: React.FC<EditMatchDialogProps> = ({
  isOpen,
  onOpenChange,
  matchToEdit,
  teams,
  onEditMatch,
}) => {
  const [opponent, setOpponent] = React.useState(matchToEdit.opponent);
  const [selectedTeamId, setSelectedTeamId] = React.useState(
    matchToEdit.teamId
  );
  const [date, setDate] = React.useState<Date | undefined>(
    parseISO(matchToEdit.date)
  );
  const [time, setTime] = React.useState(matchToEdit.time);
  const [location, setLocation] = React.useState(matchToEdit.location);

  React.useEffect(() => {
    if (isOpen && matchToEdit) {
      setOpponent(matchToEdit.opponent);
      setSelectedTeamId(matchToEdit.teamId);
      setDate(parseISO(matchToEdit.date));
      setTime(matchToEdit.time);
      setLocation(matchToEdit.location);
    }
  }, [isOpen, matchToEdit]);

  const handleEditMatch = async () => {
    const updatedMatch: Partial<Omit<Match, 'id'>> = {
      teamId: selectedTeamId,
      opponent: opponent.trim(),
      date: date ? format(date, 'yyyy-MM-dd') : '',
      time: time.trim(),
      location: location.trim(),
    };

    // Check if any actual changes were made
    const hasChanges =
      updatedMatch.teamId !== matchToEdit.teamId ||
      updatedMatch.opponent !== matchToEdit.opponent ||
      updatedMatch.date !== matchToEdit.date ||
      updatedMatch.time !== matchToEdit.time ||
      updatedMatch.location !== matchToEdit.location;

    if (
      opponent.trim() &&
      selectedTeamId &&
      date &&
      time.trim() &&
      location.trim()
    ) {
      if (hasChanges) {
        await onEditMatch(matchToEdit.id, updatedMatch);
        onOpenChange(false);
      } else {
        toast.info('No changes made to the match details.');
        onOpenChange(false);
      }
    } else {
      toast.error('Please fill in all match details.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Match</DialogTitle>
          <DialogDescription>
            Update the details for this match.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right">
              Your Team
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
            <Label htmlFor="opponent" className="text-right">
              Opponent
            </Label>
            <Input
              id="opponent"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Rival FC"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'col-span-3 justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Central Park Field 1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleEditMatch}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMatchDialog;
