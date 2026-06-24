"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Clock, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    planningRangeStart: "09:00",
    planningRangeEnd: "22:00"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.planningRangeStart) {
          setSettings(data);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      alert("Settings saved successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your GoalDesk preferences.</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Scheduling Engine
          </CardTitle>
          <CardDescription>
            Define the daily time window when GoalDesk AI is allowed to schedule tasks for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {loading ? (
            <div className="text-muted-foreground">Loading settings...</div>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="start">Start Time</Label>
                <Input 
                  id="start" 
                  type="time" 
                  value={settings.planningRangeStart}
                  onChange={(e) => setSettings({...settings, planningRangeStart: e.target.value})}
                  className="bg-background/50 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Time</Label>
                <Input 
                  id="end" 
                  type="time" 
                  value={settings.planningRangeEnd}
                  onChange={(e) => setSettings({...settings, planningRangeEnd: e.target.value})}
                  className="bg-background/50 text-lg"
                />
              </div>
            </div>
          )}
          
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4 text-sm text-blue-200">
            <strong>Note:</strong> Changing this range will only affect tasks scheduled in the future. Existing scheduled tasks will remain in their current slots.
          </div>

        </CardContent>
        <CardFooter className="border-t border-white/5 pt-4">
          <Button onClick={handleSave} disabled={loading || saving} className="soft-glow bg-primary hover:bg-primary/90 text-primary-foreground ml-auto">
            <Save className="w-4 h-4 mr-2" /> Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
