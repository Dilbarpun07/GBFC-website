import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Match, Team } from "@/types";
import { toast } from "sonner";
import { CalendarIcon, Trash2, Pencil } from "lucide-react"; // Added Pencil icon
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
import EditMatchDialog from "@/components/schedule/EditMatchDialog"; // Import the new dialog

interface SchedulePageProps {
  matches: Match[];
  teams: Team[];
  onAddMatch: (match: Omit<Match, "id">) => void;
  onDeleteMatch: (matchId: string) => void;
  onEditMatch: (matchId: string, updatedMatch: Partial<Omit<Match, "id">>) => void; // Added onEditMatch prop
}

const SchedulePage: React.FC<SchedulePageProps> = ({ matches, teams, onAddMatch, onDeleteMatch, onEditMatch }) => {
  const [isAddMatchDialogOpen, setIsAddMatchDialogOpen] = React.useState(false);
  const [isEditMatchDialogOpen, setIsEditMatchDialogOpen] = React.useState(false);
  const [matchToEdit, setMatchToEdit] = React.useState<Match | null>(null);

  const [opponent, setOpponent] = React.useState("");
  const [selectedTeamId, setSelectedTeamId] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [time, setTime] = React.useState("");
  const [location, setLocation] = React.useState("");

  const handleAddMatch = async () => {
    if (opponent.trim() && selectedTeamId && date && time.trim() && location.trim()) {
      await onAddMatch({
        teamId: selectedTeamId,
        opponent: opponent.trim(),
        date: format(date, "yyyy-MM-dd"), // Consistent date format
        time: time.trim(),
        location: location.trim(),
      });
      setOpponent("");
      setSelectedTeamId("");
      setDate(undefined);
      setTime("");
      setLocation("");
      setIsAddMatchDialogOpen(false);
    } else {
      toast.error("Please fill in all match details.");
    }
  };

  const openEditDialog = (match: Match) => {
    setMatchToEdit(match);
    setIsEditMatchDialogOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Schedule</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Organize and view your team's game and practice schedules.
      </p>

      <Dialog open={isAddMatchDialogOpen} onOpenChange={setIsAddMatchDialogOpen}>
        <DialogTrigger asChild>
          <Button>Add New Match</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Match</DialogTitle>
            <DialogDescription>
              Enter the details for the new match.
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
            <Button type="submit" onClick={handleAddMatch}>
              Add Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Matches</h2>
        {matches.length === 0 ? (
          <p className="text-muted-foreground">No matches scheduled yet. Add one above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => {
              const team = teams.find(t => t.id === match.teamId);
              return (
                <div key={match.id} className="bg-card p-4 rounded-lg shadow-sm border flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{team?.name} vs {match.opponent}</h3>
                    <p className="text-sm text-muted-foreground">
                      {match.date} at {match.time}
                    </p>
                    <p className="text-sm text-muted-foreground">{match.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      onClick={() => openEditDialog(match)}
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
                            This action cannot be undone. This will permanently delete the match "{team?.name} vs {match.opponent}" on {match.date}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteMatch(match.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {matchToEdit && (
        <EditMatchDialog
          isOpen={isEditMatchDialogOpen}
          onOpenChange={setIsEditMatchDialogOpen}
          matchToEdit={matchToEdit}
          teams={teams}
          onEditMatch={onEditMatch}
        />
      )}
    </div>
  );
};

export default SchedulePage;