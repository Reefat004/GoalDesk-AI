"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingFor, setGeneratingFor] = useState<number | null>(null);
  
  // Form state (using simple state instead of react-hook-form for MVP)
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Learning",
    description: "",
    deadline: "",
    priority: "Medium",
    preferredTimeOfDay: "Flexible",
    dailyMinutes: 30
  });

  const loadGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();
      setGoals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setOpen(false);
      loadGoals();
    } catch (error) {
      console.error("Failed to create goal", error);
    }
  };

  const handleGenerateTasks = async (goalId: number) => {
    setGeneratingFor(goalId);
    try {
      await fetch(`/api/goals/${goalId}/generate-tasks`, { method: "POST" });
      alert("Generated 7 days of tasks successfully! Check the Tasks page.");
    } catch (error) {
      alert("Failed to generate tasks.");
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-1">Manage your long-term objectives.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="soft-glow" type="button">
              <Plus className="w-4 h-4 mr-2" /> Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glass">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Define what you want to achieve. AI will help break this down.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Learn Next.js" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v || ""})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Learning">Learning</SelectItem>
                      <SelectItem value="School">School</SelectItem>
                      <SelectItem value="Career">Career</SelectItem>
                      <SelectItem value="Project">Project</SelectItem>
                      <SelectItem value="Wellness">Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={v => setFormData({...formData, priority: v || ""})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preferred Time</Label>
                  <Select value={formData.preferredTimeOfDay} onValueChange={v => setFormData({...formData, preferredTimeOfDay: v || ""})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Afternoon">Afternoon</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                      <SelectItem value="Night">Night</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Daily Minutes</Label>
                  <Input type="number" min="5" required value={formData.dailyMinutes} onChange={e => setFormData({...formData, dailyMinutes: parseInt(e.target.value) || 0})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description (Optional)</Label>
                <Textarea id="desc" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <DialogFooter>
                <Button type="submit">Save Goal</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-muted-foreground text-center py-12">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg border-white/20 glass">
          <p className="text-muted-foreground">You have no goals yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="glass-card flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant={goal.status === 'Active' ? 'default' : 'secondary'} className="mb-2">
                    {goal.category}
                  </Badge>
                  <Badge variant="outline" className={goal.priority === 'High' ? 'text-red-400 border-red-400/30' : ''}>
                    {goal.priority}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{goal.title}</CardTitle>
                {goal.description && <CardDescription className="line-clamp-2">{goal.description}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-1 text-sm text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span>Deadline:</span>
                  <span className="text-foreground">{new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Commitment:</span>
                  <span className="text-foreground">{goal.dailyMinutes} mins</span>
                </div>
                <div className="flex justify-between">
                  <span>Prefers:</span>
                  <span className="text-foreground">{goal.preferredTimeOfDay}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-white/5">
                <Button 
                  variant="secondary" 
                  className="w-full bg-white/5 hover:bg-white/10 text-primary hover:text-primary transition-all"
                  onClick={() => handleGenerateTasks(goal.id)}
                  disabled={generatingFor === goal.id}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generatingFor === goal.id ? "Generating..." : "Generate AI Tasks"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
