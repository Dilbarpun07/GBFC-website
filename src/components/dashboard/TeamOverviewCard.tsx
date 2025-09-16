'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, ArrowRight } from 'lucide-react';
import { Team } from '@/types';
import { useNavigate } from 'react-router-dom';

interface TeamOverviewCardProps {
  teams: Team[];
  onCreateTeam?: (teamName: string) => void;
}

const TeamOverviewCard: React.FC<TeamOverviewCardProps> = ({ teams, onCreateTeam }) => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = React.useState(false);
  const [teamName, setTeamName] = React.useState('');

  const handleCardClick = () => {
    navigate('/teams');
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (teamName.trim() && onCreateTeam) {
      onCreateTeam(teamName.trim());
      setTeamName('');
      setIsCreating(false);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCreating(true);
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all duration-200 group" onClick={handleCardClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{teams.length}</div>
        <p className="text-xs text-muted-foreground mb-3">
          {teams.length === 1
            ? '1 team registered'
            : `${teams.length} teams registered`}
        </p>

        {!isCreating ? (
          <Button
            size="sm"
            variant="outline"
            className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleQuickAdd}
          >
            <Plus className="h-3 w-3 mr-1" />
            Quick Add Team
          </Button>
        ) : (
          <form onSubmit={handleCreateTeam} className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Team name..."
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-1">
              <Button type="submit" size="sm" className="flex-1 text-xs h-6">
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex-1 text-xs h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreating(false);
                  setTeamName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamOverviewCard;
