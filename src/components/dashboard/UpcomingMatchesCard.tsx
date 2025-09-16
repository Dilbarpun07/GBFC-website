'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Plus, ArrowRight } from 'lucide-react';
import { Match, Team } from '@/types';
import { format, parse } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface UpcomingMatchesCardProps {
  matches: Match[];
  teams: Team[];
  onAddMatch?: (match: any) => void;
}

const UpcomingMatchesCard: React.FC<UpcomingMatchesCardProps> = ({
  matches,
  teams,
  onAddMatch,
}) => {
  const navigate = useNavigate();
  const now = new Date(); // Capture current time once for consistent comparison
  console.log('Current time (now):', now);
  console.log('Raw matches data:', matches);

  const sortedMatches = [...matches].sort((a, b) => {
    // Use parse for robust date string parsing
    const dateA = parse(`${a.date} ${a.time}`, 'yyyy-MM-dd HH:mm', new Date());
    const dateB = parse(`${b.date} ${b.time}`, 'yyyy-MM-dd HH:mm', new Date());
    console.log(
      `Match A (${a.opponent}): Raw=${a.date} ${a.time}, Parsed=${dateA}`
    );
    console.log(
      `Match B (${b.opponent}): Raw=${b.date} ${b.time}, Parsed=${dateB}`
    );
    return dateA.getTime() - dateB.getTime();
  });

  const upcomingMatches = sortedMatches
    .filter((match) => {
      // Use parse for robust date string parsing
      const matchDateTime = parse(
        `${match.date} ${match.time}`,
        'yyyy-MM-dd HH:mm',
        new Date()
      );
      console.log(
        `Filtering match (${match.opponent}): Raw=${match.date} ${match.time}, Parsed=${matchDateTime}, Is future? ${matchDateTime > now}`
      );
      return matchDateTime > now; // Compare against the single 'now' timestamp
    })
    .slice(0, 3); // Show up to 3 upcoming matches

  console.log('Upcoming matches after filter:', upcomingMatches);

  const handleCardClick = () => {
    navigate('/schedule');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/schedule');
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all duration-200 group" onClick={handleCardClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Matches</CardTitle>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardHeader>
      <CardContent>
        {upcomingMatches.length === 0 ? (
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              No upcoming matches scheduled.
            </p>
            {teams && teams.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleQuickAdd}
              >
                <Plus className="h-3 w-3 mr-1" />
                Schedule Match
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingMatches.map((match) => {
              const team = teams.find((t) => t.id === match.teamId);
              return (
                <div
                  key={match.id}
                  className="border-b pb-2 last:border-b-0 last:pb-0"
                >
                  <p className="text-sm font-medium">
                    {team?.name} vs {match.opponent}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      parse(
                        `${match.date} ${match.time}`,
                        'yyyy-MM-dd HH:mm',
                        new Date()
                      ),
                      "MMM d, yyyy 'at' h:mm a"
                    )}{' '}
                    - {match.location}
                  </p>
                </div>
              );
            })}
            {teams && teams.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="w-full opacity-0 group-hover:opacity-100 transition-opacity mt-3"
                onClick={handleQuickAdd}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Match
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingMatchesCard;
