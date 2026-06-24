"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Timer, Play, Square, CheckCircle2 } from "lucide-react";

export default function FocusPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  
  // Timer State
  const [session, setSession] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Load scheduled tasks that can be focused on
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => {
        const focusable = data.filter((t: any) => t.status === "Scheduled" || t.status === "InProgress" || t.status === "Unscheduled");
        setTasks(focusable);
      });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Automatically end session or play sound? For MVP, just stop.
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = async () => {
    if (!selectedTaskId) return alert("Select a task first");
    const task = tasks.find(t => t.id === parseInt(selectedTaskId));
    if (!task) return;

    try {
      const res = await fetch("/api/focus/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          plannedMinutes: task.estimatedMinutes
        })
      });
      const newSession = await res.json();
      setSession(newSession);
      setTimeLeft(task.estimatedMinutes * 60);
      setIsActive(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleComplete = async () => {
    if (!session) return;
    try {
      await fetch(`/api/tasks/${session.taskId}/complete`, { method: "PATCH" });
      setSession(null);
      setIsActive(false);
      setTimeLeft(0);
      alert("Task marked as complete! Great job.");
      // Reload tasks
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data.filter((t: any) => t.status === "Scheduled" || t.status === "InProgress" || t.status === "Unscheduled"));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    setIsActive(false);
    setSession(null);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col items-center justify-center py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Focus Mode</h1>
        <p className="text-muted-foreground mt-2">Zero distractions. One task at a time.</p>
      </div>

      <Card className="glass-card w-full max-w-md mx-auto relative overflow-hidden">
        {isActive && (
          <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        )}
        <CardHeader className="text-center pb-2 relative z-10">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Timer className={isActive ? "text-primary animate-pulse" : "text-muted-foreground"} />
            {session ? "Deep Work" : "Setup Session"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8 relative z-10">
          
          {!session ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Select value={selectedTaskId} onValueChange={(val) => setSelectedTaskId(val || "")}>
                  <SelectTrigger className="w-full h-14 text-lg bg-background/50">
                    <SelectValue placeholder="Select a task to focus on..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map(t => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.title} ({t.estimatedMinutes}m)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full h-14 text-lg soft-glow font-semibold" 
                onClick={handleStart}
                disabled={!selectedTaskId}
              >
                <Play className="w-5 h-5 mr-2" /> Start Focus
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-medium text-foreground">
                  {tasks.find(t => t.id === session.taskId)?.title}
                </h3>
              </div>
              
              <div className="text-7xl font-mono font-light tracking-tighter text-primary drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                {formatTime(timeLeft)}
              </div>
              
              <div className="flex items-center gap-4 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={handleCancel}
                >
                  <Square className="w-4 h-4 mr-2" /> Stop
                </Button>
                <Button 
                  className="flex-1 h-12 bg-green-600/80 hover:bg-green-600 text-white soft-glow"
                  onClick={handleComplete}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Complete Task
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
