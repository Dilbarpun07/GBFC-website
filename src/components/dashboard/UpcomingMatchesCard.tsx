"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { Match, Team } from "@/types";
import { format, parse } from "date-fns"; // Import parse from date-fns

interface UpcomingMatchesCardProps {
  matches: Match[];
  teams: Team[];
}

const UpcomingMatchesCard: React.FC<UpcomingMatchesCardProps> = ({ matches, teams }) => {
  const now = new Date(); // Capture current time once for consistent comparison

  const sortedMatches = [...matches].sort((a, b) => {
    // Use parse for robust date string parsing
    const dateA = parse(`${a.date} ${a.time}`, 'yyyy-MM-dd HH:mm', new Date());
    const dateB = parse(`${b.date} ${b.time}`, 'yyyy-MM-dd HH:mm', new Date());
    return dateA.getTime() - dateB.getTime();
  });

  const upcomingMatches = sortedMatches.filter(match => {
    // Use parse for robust date string parsing
    const matchDateTime = parse(`${match.date} ${match.time}`, 'yyyy-MM-dd HH:mm', new Date());
    return matchDateTime > now; // Compare against the single 'now' timestamp
  }).slice(0, 3); // Show up to 3 upcoming matches

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Matches</CardTitle>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {upcomingMatches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming matches scheduled.</p>
        ) : (
          <div className="space-y-3">
            {upcomingMatches.map((match) => {
              const team = teams.find(t => t.id === match.teamId);
              return (
                <div key={match.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                  <p className="text-sm font-medium">
                    {team?.name} vs {match.opponent}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(parse(`${match.date} ${match.time}`, 'yyyy-MM-dd HH:mm', new Date()), "MMM d, yyyy 'at' h:mm a")} - {match.location}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingMatchesCard;