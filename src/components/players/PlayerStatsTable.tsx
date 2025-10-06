import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EditPlayerDialog from './EditPlayerDialog';
import { Player, Team } from '@/types';

interface PlayerStatsTableProps {
  players: Player[];
  teams: Team[];
  onDeletePlayer: (playerId: string) => void;
  onEditPlayer: (
    playerId: string,
    updatedPlayer: Partial<Omit<Player, 'id'>>
  ) => void;
}

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({
  players,
  teams,
  onDeletePlayer,
  onEditPlayer,
}) => {
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  if (players.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No players added yet. Add players from the teams section!
        </p>
      </div>
    );
  }

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team?.name || 'Unknown Team';
  };

  const calculateAttendanceRate = (player: Player) => {
    // Simple calculation - in real app you might want to track total sessions offered
    if (player.trainingsAttended === 0) return 0;
    // Assume maximum attendance based on some heuristic
    const estimatedTotalSessions = Math.max(player.trainingsAttended, 10);
    return Math.round((player.trainingsAttended / estimatedTotalSessions) * 100);
  };

  const getPositionBadgeColor = (position: string) => {
    const colors: { [key: string]: string } = {
      'Goalkeeper': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Defender': 'bg-blue-100 text-blue-800 border-blue-300',
      'Midfielder': 'bg-green-100 text-green-800 border-green-300',
      'Forward': 'bg-red-100 text-red-800 border-red-300',
      'Striker': 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return colors[position] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-center">Games Played</TableHead>
              <TableHead className="text-center">Goals</TableHead>
              <TableHead className="text-center">Assists</TableHead>
              <TableHead className="text-center">Training Attendance</TableHead>
              <TableHead className="text-center">Attendance Rate</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell>{getTeamName(player.teamId)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getPositionBadgeColor(player.position)}
                  >
                    {player.position || 'Not Set'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{player.matchesPlayed}</TableCell>
                <TableCell className="text-center">{player.goals}</TableCell>
                <TableCell className="text-center">{player.assists}</TableCell>
                <TableCell className="text-center">{player.trainingsAttended}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <span className="mr-2">{calculateAttendanceRate(player)}%</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(calculateAttendanceRate(player), 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingPlayer(player)}
                        className="cursor-pointer"
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Player
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeletePlayer(player.id)}
                        className="cursor-pointer text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Player
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingPlayer && (
        <EditPlayerDialog
          player={editingPlayer}
          teams={teams}
          onClose={() => setEditingPlayer(null)}
          onSave={(updatedPlayer) => {
            onEditPlayer(editingPlayer.id, updatedPlayer);
            setEditingPlayer(null);
          }}
        />
      )}
    </>
  );
};

export default PlayerStatsTable;