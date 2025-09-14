import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Team, Player, TrainingSession } from "@/types";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddTrainingSessionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTrainingSession: (session: Omit<TrainingSession, "id">) => void;
  teams: Team[];
  players: Player[];
}

const AddTrainingSessionDialog: React.FC<AddTrainingSessionDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddTrainingSession,
  teams,
  players,
}) => {
  const [selectedTeamId, setSelectedTeamId] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [attendedPlayerIds, setAttendedPlayerIds] = React.useState<string[]>([]);

  const filteredPlayers = players.filter((player) => player.teamId === selectedTeamId);

  const handlePlayerAttendanceChange = (playerId: string, checked: boolean) => {
    setAttendedPlayerIds((prev) =>
      checked ? [...prev, playerId] : prev.filter((id) => id !== playerId)
    );
  };

  const handleAddSession = async () => {
    if (selectedTeamId && date && attendedPlayerIds.length > 0) {
      await onAddTrainingSession({
        teamId: selectedTeamId,
        date: format(date, "yyyy-MM-dd"), // Consistent date format
        attendedPlayerIds,
      });
      // Reset form
      setSelectedTeamId("");
      setDate(undefined);
      setAttendedPlayerIds([]);
      onOpenChange(false);
    } else {
      toast.error("Please select a team, date, and at least one player.");
    }
  };

  React.useEffect(() => {
    // Reset attended players when team changes
    setAttendedPlayerIds([]);
  }, [selectedTeamId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Training Session</DialogTitle>
          <DialogDescription>
            Record a training session for a team and mark player attendance.
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
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
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
          {selectedTeamId && filteredPlayers.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right mt-2">Players</Label>
              <div className="col-span-3 space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                {filteredPlayers.map((player) => (
                  <div key={player.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`player-${player.id}`}
                      checked={attendedPlayerIds.includes(player.id)}
                      onCheckedChange={(checked) =>
                        handlePlayerAttendanceChange(player.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`player-${player.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {player.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedTeamId && filteredPlayers.length === 0 && (
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4 text-center text-sm text-muted-foreground">
                No players found for this team.
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddSession}>
            Add Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTrainingSessionDialog;