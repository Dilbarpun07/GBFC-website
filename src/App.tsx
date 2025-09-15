"use client";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";
import SchedulePage from "./pages/SchedulePage";
import TrainingPage from "./pages/TrainingPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AuthWrapper from "./components/layout/AuthWrapper";
import AuthHandler from "./components/auth/AuthHandler";
import { Team, Player, Match, TrainingSession } from "./types";
import { supabase } from "./integrations/supabase/client";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loadingAuth, setLoadingAuth] = React.useState(true);
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [trainingSessions, setTrainingSessions] = React.useState<TrainingSession[]>([]);
  const [loadingData, setLoadingData] = React.useState(false);

  console.log("App render: loadingAuth =", loadingAuth, ", loadingData =", loadingData);

  // --- Data Fetching from Supabase ---
  const fetchTeams = async () => {
    const { data, error } = await supabase.from("teams").select("*");
    if (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams.");
      return [];
    }
    // Map snake_case from Supabase to camelCase for the Team interface
    return (data || []).map((team: any) => ({
      id: team.id,
      name: team.name,
      userId: team.user_id,
    }));
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from("players").select("*");
    if (error) {
      console.error("Error fetching players:", error);
      toast.error("Failed to load players.");
      return [];
    }
    // Map snake_case from Supabase to camelCase for the Player interface
    return (data || []).map((player: any) => ({
      id: player.id,
      name: player.name,
      teamId: player.team_id,
      matchesPlayed: player.matches_played,
      trainingsAttended: player.trainings_attended,
      goals: player.goals,
      assists: player.assists,
    }));
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase.from("matches").select("*");
    if (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to load matches.");
      return [];
    }
    // Map snake_case from Supabase to camelCase for the Match interface
    return (data || []).map((match: any) => ({
      id: match.id,
      teamId: match.team_id,
      opponent: match.opponent,
      date: match.date,
      time: match.time,
      location: match.location,
    }));
  };

  const fetchTrainingSessions = async () => {
    const { data, error } = await supabase.from("training_sessions").select("*");
    if (error) {
      console.error("Error fetching training sessions:", error);
      toast.error("Failed to load training sessions.");
      return [];
    }
    // Map snake_case from Supabase to camelCase for the TrainingSession interface
    return (data || []).map((session: any) => ({
      id: session.id,
      teamId: session.team_id,
      date: session.date,
      attendedPlayerIds: session.attended_player_ids,
    }));
  };

  React.useEffect(() => {
    const loadAllData = async () => {
      console.log("loadAllData called. Current session:", session);
      if (session) {
        setLoadingData(true);
        console.log("setLoadingData(true) in loadAllData. loadingData now:", true);
        try {
          const [teamsData, playersData, matchesData, trainingSessionsData] = await Promise.all([
            fetchTeams(),
            fetchPlayers(),
            fetchMatches(),
            fetchTrainingSessions(),
          ]);
          setTeams(teamsData);
          setPlayers(playersData);
          setMatches(matchesData);
          setTrainingSessions(trainingSessionsData);
          console.log("Data fetched successfully.");
        } catch (error) {
          console.error("Error during Promise.all data fetch:", error);
          toast.error("An error occurred while fetching initial data.");
        } finally {
          setLoadingData(false);
          console.log("setLoadingData(false) in loadAllData. loadingData now:", false);
        }
      } else {
        console.log("No session in loadAllData, clearing data.");
        setTeams([]);
        setPlayers([]);
        setMatches([]);
        setTrainingSessions([]);
        // Ensure loadingData is false if it somehow got stuck true
        if (loadingData) {
          setLoadingData(false);
          console.log("setLoadingData(false) in loadAllData (no session). loadingData now:", false);
        }
      }
    };
    loadAllData();
  }, [session]);

  // --- Handlers for adding/updating data via Supabase ---
  const handleCreateTeam = async (teamName: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create a team.");
      return;
    }
    const { data, error } = await supabase.from("teams").insert({ name: teamName, user_id: session.user.id }).select();
    if (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team.");
    } else {
      toast.success("Team created successfully!");
      fetchTeams().then(setTeams);
    }
  };

  const handleAddPlayer = async (newPlayer: Omit<Player, "id">) => {
    // Map to snake_case for Supabase insert
    const playerToInsert = {
      name: newPlayer.name,
      team_id: newPlayer.teamId,
      matches_played: newPlayer.matchesPlayed,
      trainings_attended: newPlayer.trainingsAttended,
      goals: newPlayer.goals,
      assists: newPlayer.assists,
    };
    const { data, error } = await supabase.from("players").insert(playerToInsert).select();
    if (error) {
      console.error("Error adding player:", error);
      toast.error("Failed to add player.");
    } else {
      toast.success("Player added successfully!");
      fetchPlayers().then(setPlayers);
    }
  };

  const handleAddMatch = async (newMatch: Omit<Match, "id">) => {
    // Map to snake_case for Supabase insert
    const matchToInsert = {
      team_id: newMatch.teamId,
      opponent: newMatch.opponent,
      date: newMatch.date,
      time: newMatch.time,
      location: newMatch.location,
    };
    const { data, error } = await supabase.from("matches").insert(matchToInsert).select();
    if (error) {
      console.error("Error adding match:", error);
      toast.error("Failed to add match.");
    } else {
      toast.success("Match added successfully!");
      fetchMatches().then(setMatches);
    }
  };

  const handleAddTrainingSession = async (newSession: Omit<TrainingSession, "id">) => {
    // Map to snake_case for Supabase insert
    const sessionToInsert = {
      team_id: newSession.teamId,
      date: newSession.date,
      attended_player_ids: newSession.attendedPlayerIds,
    };
    const { data, error } = await supabase.from("training_sessions").insert(sessionToInsert).select();
    if (error) {
      console.error("Error adding training session:", error);
      toast.error("Failed to add training session.");
    } else {
      toast.success("Training session added successfully!");
      fetchTrainingSessions().then(setTrainingSessions);

      // Update players' training attendance
      for (const playerId of newSession.attendedPlayerIds) {
        const playerToUpdate = players.find(p => p.id === playerId);
        if (playerToUpdate) {
          const { error: updateError } = await supabase
            .from("players")
            .update({ trainings_attended: playerToUpdate.trainingsAttended + 1 })
            .eq("id", playerId);
          if (updateError) {
            console.error(`Error updating training count for player ${playerId}:`, updateError);
          }
        }
      }
      fetchPlayers().then(setPlayers);
    }
  };

  // --- Delete Handlers ---
  const handleDeleteTeam = async (teamId: string) => {
    const { error } = await supabase.from("teams").delete().eq("id", teamId);
    if (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team.");
    } else {
      toast.success("Team deleted successfully!");
      fetchTeams().then(setTeams);
      fetchPlayers().then(setPlayers); // Players associated with the team might be deleted via CASCADE
      fetchMatches().then(setMatches); // Matches associated with the team might be deleted via CASCADE
      fetchTrainingSessions().then(setTrainingSessions); // Training sessions associated with the team might be deleted via CASCADE
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    const { error } = await supabase.from("players").delete().eq("id", playerId);
    if (error) {
      console.error("Error deleting player:", error);
      toast.error("Failed to delete player.");
    } else {
      toast.success("Player deleted successfully!");
      fetchPlayers().then(setPlayers);
      fetchTrainingSessions().then(setTrainingSessions); // Update training sessions as player might be removed from attendance lists
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    const { error } = await supabase.from("matches").delete().eq("id", matchId);
    if (error) {
      console.error("Error deleting match:", error);
      toast.error("Failed to delete match.");
    } else {
      toast.success("Match deleted successfully!");
      fetchMatches().then(setMatches);
    }
  };

  const handleDeleteTrainingSession = async (sessionId: string) => {
    const { error } = await supabase.from("training_sessions").delete().eq("id", sessionId);
    if (error) {
      console.error("Error deleting training session:", error);
      toast.error("Failed to delete training session.");
    } else {
      toast.success("Training session deleted successfully!");
      fetchTrainingSessions().then(setTrainingSessions);
      // Note: Player training counts are not decremented on session deletion for simplicity.
      // This could be added if more complex logic is desired.
    }
  };


  if (loadingAuth || loadingData) {
    console.log("Showing loading screen. loadingAuth:", loadingAuth, "loadingData:", loadingData);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthHandler setSession={setSession} setLoadingAuth={setLoadingAuth} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AuthWrapper session={session} />}>
              <Route
                path="/"
                element={
                  <AppLayout
                    teams={teams}
                    players={players}
                    onAddPlayer={handleAddPlayer}
                    matches={matches}
                    onAddMatch={handleAddMatch}
                    trainingSessions={trainingSessions}
                    onAddTrainingSession={handleAddTrainingSession}
                    onCreateTeam={handleCreateTeam}
                    onDeleteTeam={handleDeleteTeam}
                    onDeletePlayer={handleDeletePlayer}
                    onDeleteMatch={handleDeleteMatch}
                    onDeleteTrainingSession={handleDeleteTrainingSession}
                  />
                }
              >
                <Route index element={<DashboardPage />} />
                <Route
                  path="teams"
                  element={
                    <TeamsPage
                      teams={teams}
                      onAddPlayer={handleAddPlayer}
                      onCreateTeam={handleCreateTeam}
                      onDeleteTeam={handleDeleteTeam}
                    />
                  }
                />
                <Route
                  path="players"
                  element={<PlayersPage players={players} teams={teams} onDeletePlayer={handleDeletePlayer} />}
                />
                <Route
                  path="schedule"
                  element={<SchedulePage matches={matches} teams={teams} onAddMatch={handleAddMatch} onDeleteMatch={handleDeleteMatch} />}
                />
                <Route
                  path="training"
                  element={<TrainingPage trainingSessions={trainingSessions} teams={teams} players={players} onAddTrainingSession={handleAddTrainingSession} onDeleteTrainingSession={handleDeleteTrainingSession} />}
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;