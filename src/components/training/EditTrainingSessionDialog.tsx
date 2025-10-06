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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Team, Player, TrainingSession } from '@/types';
import { toast } from 'sonner';
import { CalendarIcon, Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditTrainingSessionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sessionToEdit: TrainingSession;
  teams: Team[];
  players: Player[];
  onEditTrainingSession: (
    originalSession: TrainingSession,
    updatedSessionData: Partial<Omit<TrainingSession, 'id'>>
  ) => void;
}

const EditTrainingSessionDialog: React.FC<EditTrainingSessionDialogProps> = ({
  isOpen,
  onOpenChange,
  sessionToEdit,
  teams,
  players,
  onEditTrainingSession,
}) => {
  const [selectedTeamId, setSelectedTeamId] = React.useState(
    sessionToEdit.teamId
  );
  const [date, setDate] = React.useState<Date | undefined>(
    parseISO(sessionToEdit.date)
  );
  const [attendedPlayerIds, setAttendedPlayerIds] = React.useState<string[]>(
    sessionToEdit.attendedPlayerIds || []
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPosition, setSelectedPosition] = React.useState<string>('All');

  React.useEffect(() => {
    // Reset state when a new sessionToEdit is provided or dialog opens/closes
    if (isOpen && sessionToEdit) {
      setSelectedTeamId(sessionToEdit.teamId);
      setDate(parseISO(sessionToEdit.date));
      setAttendedPlayerIds(sessionToEdit.attendedPlayerIds || []);
      setSearchQuery('');
      setSelectedPosition('All');
    }
  }, [isOpen, sessionToEdit]);

  const teamPlayers = players.filter(
    (player) => player.teamId === selectedTeamId
  );

  // Apply search and position filters
  const filteredPlayers = teamPlayers.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = selectedPosition === 'All' || player.position === selectedPosition;
    return matchesSearch && matchesPosition;
  });

  // Get unique positions from team players
  const positions = ['All', ...Array.from(new Set(teamPlayers.map(p => p.position)))].filter(Boolean);

  const handlePlayerAttendanceChange = (playerId: string, checked: boolean) => {
    setAttendedPlayerIds((prev) =>
      checked ? [...prev, playerId] : prev.filter((id) => id !== playerId)
    );
  };

  const handleSelectAll = () => {
    setAttendedPlayerIds(filteredPlayers.map(p => p.id));
  };

  const handleClearAll = () => {
    setAttendedPlayerIds([]);
  };

  const handleEditSession = async () => {
    if (selectedTeamId && date && attendedPlayerIds.length > 0) {
      try {
        await onEditTrainingSession(sessionToEdit, {
          teamId: selectedTeamId,
          date: format(date, 'yyyy-MM-dd'),
          attendedPlayerIds,
        });
        // Close dialog after successful save
        onOpenChange(false);
      } catch (error) {
        // Error handling is done in the parent component
        console.error('Error editing training session:', error);
      }
    } else {
      toast.error('Please select a team, date, and at least one player.');
    }
  };

  React.useEffect(() => {
    // Reset attended players and filters when team changes in the dialog
    // Only if the team actually changed from the original session's team
    if (selectedTeamId !== sessionToEdit.teamId) {
      setAttendedPlayerIds([]);
      setSearchQuery('');
      setSelectedPosition('All');
    } else {
      // If team is reset to original, restore original attended players
      setAttendedPlayerIds(sessionToEdit.attendedPlayerIds || []);
    }
  }, [selectedTeamId, sessionToEdit.teamId, sessionToEdit.attendedPlayerIds]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Training Session</DialogTitle>
          <DialogDescription>
            Modify the details of this training session.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          {selectedTeamId && teamPlayers.length > 0 && (
            <div className="grid gap-3">
              <Label>Players ({attendedPlayerIds.length} selected)</Label>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Position Filters */}
              <div className="flex flex-wrap gap-2">
                {positions.map((position) => (
                  <Button
                    key={position}
                    variant={selectedPosition === position ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPosition(position)}
                    className="text-xs"
                  >
                    {position}
                  </Button>
                ))}
              </div>

              {/* Bulk Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="flex-1"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex-1"
                >
                  Clear All
                </Button>
              </div>

              {/* Player List */}
              <div className="space-y-1 max-h-64 overflow-y-auto border rounded-md p-3">
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center space-x-2 p-1.5 hover:bg-accent rounded"
                    >
                      <Checkbox
                        id={`player-${player.id}`}
                        checked={attendedPlayerIds.includes(player.id)}
                        onCheckedChange={(checked) =>
                          handlePlayerAttendanceChange(
                            player.id,
                            checked as boolean
                          )
                        }
                      />
                      <label
                        htmlFor={`player-${player.id}`}
                        className="text-sm flex-1 cursor-pointer flex items-center justify-between"
                      >
                        <span>{player.name}</span>
                        <span className="text-xs text-muted-foreground">{player.position}</span>
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No players found matching your criteria.
                  </div>
                )}
              </div>
            </div>
          )}
          {selectedTeamId && teamPlayers.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">
              No players found for this team.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleEditSession}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTrainingSessionDialog;
