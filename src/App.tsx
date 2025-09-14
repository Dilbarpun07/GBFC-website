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

  // --- Supabase Auth State Management ---
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Data Fetching from Supabase ---
  const fetchTeams = async () => {
    const { data, error } = await supabase.from("teams").select("*");
    if (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams.");
      return [];
    }
    return data || [];
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from("players").select("*");
    if (error) {
      console.error("Error fetching players:", error);
      toast.error("Failed to load players.");
      return [];
    }
    return data || [];
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase.from("matches").select("*");
    if (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to load matches.");
      return [];
    }
    return data || [];
  };

  const fetchTrainingSessions = async () => {
    const { data, error } = await supabase.from("training_sessions").select("*");
    if (error) {
      console.error("Error fetching training sessions:", error);
      toast.error("Failed to load training sessions.");
      return [];
    }
    return data || [];
  };

  React.useEffect(() => {
    const loadAllData = async () => {
      if (session) {
        setLoadingData(true);
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
        setLoadingData(false);
      } else {
        // Clear data if no session
        setTeams([]);
        setPlayers([]);
        setMatches([]);
        setTrainingSessions([]);
      }
    };
    loadAllData();
  }, [session]);

  // --- Handlers for adding/updating data via Supabase ---
  const handleCreateTeam = async (teamName: string) => {
    const { data, error } = await supabase.from("teams").insert({ name: teamName }).select();
    if (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team.");
    } else {
      toast.success("Team created successfully!");
      fetchTeams().then(setTeams);
    }
  };

  const handleAddPlayer = async (newPlayer: Omit<Player, "id">) => {
    const { data, error } = await supabase.from("players").insert(newPlayer).select();
    if (error) {
      console.error("Error adding player:", error);
      toast.error("Failed to add player.");
    } else {
      toast.success("Player added successfully!");
      fetchPlayers().then(setPlayers);
    }
  };

  const handleAddMatch = async (newMatch: Omit<Match, "id">) => {
    const { data, error } = await supabase.from("matches").insert(newMatch).select();
    if (error) {
      console.error("Error adding match:", error);
      toast.error("Failed to add match.");
    } else {
      toast.success("Match added successfully!");
      fetchMatches().then(setMatches);
    }
  };

  const handleAddTrainingSession = async (newSession: Omit<TrainingSession, "id">) => {
    const { data, error } = await supabase.from("training_sessions").insert(newSession).select();
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

  if (loadingAuth || loadingData) {
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
                    />
                  }
                />
                <Route
                  path="players"
                  element={<PlayersPage players={players} teams={teams} />}
                />
                <Route
                  path="schedule"
                  element={<SchedulePage matches={matches} teams={teams} onAddMatch={handleAddMatch} />}
                />
                <Route
                  path="training"
                  element={<TrainingPage trainingSessions={trainingSessions} teams={teams} players={players} onAddTrainingSession={handleAddTrainingSession} />}
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