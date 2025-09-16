'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Plus, ArrowRight } from 'lucide-react';
import { TrainingSession } from '@/types';
import { useNavigate } from 'react-router-dom';

interface TrainingOverviewCardProps {
  trainingSessions: TrainingSession[];
  teams?: any[];
  onAddTrainingSession?: (session: any) => void;
}

const TrainingOverviewCard: React.FC<TrainingOverviewCardProps> = ({
  trainingSessions,
  teams,
  onAddTrainingSession,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/training');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/training');
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all duration-200 group" onClick={handleCardClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Trainings</CardTitle>
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
          <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{trainingSessions.length}</div>
        <p className="text-xs text-muted-foreground mb-3">
          {trainingSessions.length === 1
            ? '1 session recorded'
            : `${trainingSessions.length} sessions recorded`}
        </p>

        {teams && teams.length > 0 ? (
          <Button
            size="sm"
            variant="outline"
            className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleQuickAdd}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Training Session
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Create a team first to add training sessions
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingOverviewCard;
