"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Check, X, Clock, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);

  const loadTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSchedule = async () => {
    setScheduling(true);
    try {
      const res = await fetch("/api/tasks/schedule", { method: "POST" });
      const data = await res.json();
      alert(data.summary || data.message);
      loadTasks();
    } catch (error) {
      alert("Scheduling failed");
    } finally {
      setScheduling(false);
    }
  };

  const updateStatus = async (id: number, action: "complete" | "skip") => {
    try {
      await fetch(`/api/tasks/${id}/${action}`, { method: "PATCH" });
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const renderTaskList = (status: string) => {
    const filteredTasks = tasks.filter(t => t.status === status);

    if (filteredTasks.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed rounded-lg border-white/10 glass">
          <p className="text-muted-foreground">No tasks in this category.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredTasks.map(task => (
          <Card key={task.id} className="glass-card hover:bg-white/5 transition-colors">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{task.title}</h3>
                  <Badge variant="outline" className="text-xs">{task.goal?.title}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.estimatedMinutes}m
                  </span>
                  {task.scheduledStart && (
                    <span className="flex items-center gap-1 text-primary">
                      <CalendarIcon className="w-3 h-3" /> 
                      {new Date(task.scheduledStart).toLocaleString([], {
                        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </div>

              {(status === "Unscheduled" || status === "Scheduled") && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateStatus(task.id, "skip")} className="hover:bg-red-500/20 hover:text-red-400">
                    <X className="w-4 h-4 mr-1" /> Skip
                  </Button>
                  <Button size="sm" onClick={() => updateStatus(task.id, "complete")} className="bg-green-600/80 hover:bg-green-600 text-white">
                    <Check className="w-4 h-4 mr-1" /> Done
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and schedule your daily actions.</p>
        </div>
        
        <Button onClick={handleSchedule} disabled={scheduling || loading} className="soft-glow bg-primary hover:bg-primary/90 text-primary-foreground">
          {scheduling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CalendarIcon className="w-4 h-4 mr-2" />}
          Schedule Tasks
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading tasks...</div>
      ) : (
        <Tabs defaultValue="scheduled" className="flex-1 flex flex-col">
          <TabsList className="glass border-white/10 self-start mb-6">
            <TabsTrigger value="scheduled">Scheduled ({tasks.filter(t=>t.status==="Scheduled").length})</TabsTrigger>
            <TabsTrigger value="unscheduled">Unscheduled ({tasks.filter(t=>t.status==="Unscheduled").length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({tasks.filter(t=>t.status==="Completed").length})</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 pb-10 pr-4">
            <TabsContent value="scheduled" className="mt-0">{renderTaskList("Scheduled")}</TabsContent>
            <TabsContent value="unscheduled" className="mt-0">{renderTaskList("Unscheduled")}</TabsContent>
            <TabsContent value="completed" className="mt-0">{renderTaskList("Completed")}</TabsContent>
          </ScrollArea>
        </Tabs>
      )}
    </div>
  );
}
