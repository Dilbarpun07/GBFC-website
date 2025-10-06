import React, { useState } from 'react';
import PlayerList from '@/components/players/PlayerList';
import PlayerStatsTable from '@/components/players/PlayerStatsTable';
import { Button } from '@/components/ui/button';
import { Table, LayoutGrid } from 'lucide-react';
import { Player, Team } from '@/types';

interface PlayersPageProps {
  players: Player[];
  teams: Team[];
  onDeletePlayer: (playerId: string) => void;
  onEditPlayer: (
    playerId: string,
    updatedPlayer: Partial<Omit<Player, 'id'>>
  ) => void; // Added onEditPlayer prop
}

const PlayersPage: React.FC<PlayersPageProps> = ({
  players,
  teams,
  onDeletePlayer,
  onEditPlayer,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Players</h1>
          <p className="text-lg text-muted-foreground">
            View and manage individual players across all your teams.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <Table className="w-4 h-4 mr-2" />
            Table View
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Card View
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {viewMode === 'table' ? (
          <PlayerStatsTable
            players={players}
            teams={teams}
            onDeletePlayer={onDeletePlayer}
            onEditPlayer={onEditPlayer}
          />
        ) : (
          <PlayerList
            players={players}
            teams={teams}
            onDeletePlayer={onDeletePlayer}
            onEditPlayer={onEditPlayer}
          />
        )}
      </div>
    </div>
  );
};

export default PlayersPage;
