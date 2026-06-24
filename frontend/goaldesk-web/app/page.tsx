"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, ArrowRight, Target, CheckSquare, Calendar as CalendarIcon } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeGoals: 0,
    scheduledTasks: 0,
    unscheduledTasks: 0,
  });
  const [nextTask, setNextTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [goalsRes, tasksRes] = await Promise.all([
          fetch("/api/goals"),
          fetch("/api/tasks")
        ]);
        
        const goals = await goalsRes.json();
        const tasks = await tasksRes.json();

        setStats({
          activeGoals: goals.filter((g: any) => g.status === "Active").length,
          scheduledTasks: tasks.filter((t: any) => t.status === "Scheduled").length,
          unscheduledTasks: tasks.filter((t: any) => t.status === "Unscheduled").length,
        });

        const upcomingTasks = tasks
          .filter((t: any) => t.status === "Scheduled" && t.scheduledStart)
          .sort((a: any, b: any) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime());
        
        if (upcomingTasks.length > 0) {
          setNextTask(upcomingTasks[0]);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Good Morning.</h1>
        <p className="text-muted-foreground mt-2 text-lg">Here&apos;s what your day looks like.</p>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Next Task Card */}
          <Card className="glass-card md:col-span-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-primary" />
                Up Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextTask ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{nextTask.title}</h3>
                    <p className="text-muted-foreground">{nextTask.goal?.title || "No goal attached"}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                      {new Date(nextTask.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-muted-foreground">{nextTask.estimatedMinutes} min</span>
                  </div>
                  <Link href="/focus">
                    <Button className="w-full sm:w-auto mt-4 soft-glow">
                      Start Focus Session <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  <p>You have no tasks scheduled.</p>
                  <Link href="/tasks">
                    <Button variant="outline" className="mt-4">Go to Tasks</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats Column */}
          <div className="space-y-6">
            <Card className="glass border-white/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold">{stats.activeGoals}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled Tasks</p>
                  <p className="text-2xl font-bold">{stats.scheduledTasks}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-orange-500/20 text-orange-400">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unscheduled</p>
                  <p className="text-2xl font-bold">{stats.unscheduledTasks}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
