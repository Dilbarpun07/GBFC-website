'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shirt, Plus, ArrowRight } from 'lucide-react';
import { Player } from '@/types';
import { useNavigate } from 'react-router-dom';
import AddPlayerDialog from '@/components/players/AddPlayerDialog';

interface PlayerOverviewCardProps {
  players: Player[];
  teams?: any[];
  onAddPlayer?: (player: any) => void;
}

const PlayerOverviewCard: React.FC<PlayerOverviewCardProps> = ({ players, teams, onAddPlayer }) => {
  const navigate = useNavigate();
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = React.useState(false);

  const handleCardClick = () => {
    navigate('/players');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (teams && teams.length > 0) {
      setIsAddPlayerDialogOpen(true);
    }
  };

  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 group" onClick={handleCardClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Players</CardTitle>
          <div className="flex items-center gap-2">
            <Shirt className="h-4 w-4 text-muted-foreground" />
            <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{players.length}</div>
          <p className="text-xs text-muted-foreground mb-3">
            {players.length === 1
              ? '1 player registered'
              : `${players.length} players registered`}
          </p>

          {teams && teams.length > 0 ? (
            <Button
              size="sm"
              variant="outline"
              className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleQuickAdd}
            >
              <Plus className="h-3 w-3 mr-1" />
              Quick Add Player
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Create a team first to add players
            </p>
          )}
        </CardContent>
      </Card>

      {teams && onAddPlayer && (
        <AddPlayerDialog
          isOpen={isAddPlayerDialogOpen}
          onOpenChange={setIsAddPlayerDialogOpen}
          teams={teams}
          onAddPlayer={onAddPlayer}
        />
      )}
    </>
  );
};

export default PlayerOverviewCard;
