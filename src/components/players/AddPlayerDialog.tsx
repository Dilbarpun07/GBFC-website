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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Player } from "@/types";
import { toast } from "sonner";

interface AddPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlayer: (player: Omit<Player, "id">) => void;
  teamId: string;
}

const AddPlayerDialog: React.FC<AddPlayerDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddPlayer,
  teamId,
}) => {
  const [playerName, setPlayerName] = React.useState("");

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      onAddPlayer({
        name: playerName.trim(),
        teamId,
        matchesPlayed: 0,
        trainingsAttended: 0,
        goals: 0,
        assists: 0,
      });
      setPlayerName("");
      onOpenChange(false);
      toast.success("Player added successfully!");
    } else {
      toast.error("Player name cannot be empty.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
          <DialogDescription>
            Enter the player's name. Click save when you're done.
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