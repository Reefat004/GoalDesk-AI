"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cpu, Send, Wifi, WifiOff } from "lucide-react";

export default function DevicePage() {
  const [device, setDevice] = useState<any>(null);
  const [lcd, setLcd] = useState({ line1: "GoalDesk AI     ", line2: "Connecting...   " });
  const [testMsg, setTestMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/device/status")
      .then(res => res.json())
      .then(data => {
        setDevice(data);
        if (data.status === "Offline") {
          setLcd({ line1: "GoalDesk AI     ", line2: "Offline         " });
        } else {
          setLcd({ line1: "GoalDesk AI     ", line2: "Ready           " });
        }
      });
  }, []);

  const handlePreviewNext = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/device/preview-next-task", { method: "POST" });
      const data = await res.json();
      setLcd(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!testMsg) return;
    setLoading(true);
    try {
      const res = await fetch("/api/device/test-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testMsg })
      });
      const data = await res.json();
      if (data.sentMessage) {
        setLcd(data.sentMessage);
        setTestMsg("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNext = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/device/send-next-task", { method: "POST" });
      const data = await res.json();
      if (data.sentMessage) {
        setLcd(data.sentMessage);
      }
      alert("Sent to Particle Argon device (Mocked in Console)");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Particle Argon</h1>
          <p className="text-muted-foreground mt-1">Manage your connected desktop device.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/10 text-sm">
          {device?.status === "Online" ? (
            <><Wifi className="w-4 h-4 text-green-400" /> <span className="text-green-400 font-medium">Online</span></>
          ) : (
            <><WifiOff className="w-4 h-4 text-muted-foreground" /> <span className="text-muted-foreground">Offline / Mock</span></>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LCD Preview */}
        <Card className="glass-card flex flex-col justify-center items-center py-12">
          <CardHeader className="text-center pb-8">
            <CardTitle className="flex items-center justify-center gap-2">
              <Cpu className="w-5 h-5 text-primary" /> LCD Simulator
            </CardTitle>
            <CardDescription>Live preview of the 16x2 hardware display</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-[#1b2b34] p-6 rounded-lg border-4 border-[#111] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <div className="font-mono text-2xl tracking-widest text-[#5EEAD4] drop-shadow-[0_0_5px_rgba(94,234,212,0.5)] whitespace-pre">
                <div>{lcd.line1}</div>
                <div>{lcd.line2}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="space-y-6">
          <Card className="glass border-white/5">
            <CardHeader>
              <CardTitle>Hardware Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handlePreviewNext} disabled={loading}>
                  Preview Next Task
                </Button>
                <Button className="flex-1 soft-glow" onClick={handleSendNext} disabled={loading}>
                  <Send className="w-4 h-4 mr-2" /> Sync to Device
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/5">
            <CardHeader>
              <CardTitle>Send Test Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-msg">Message (Max 16 chars)</Label>
                <div className="flex gap-2">
                  <Input 
                    id="test-msg" 
                    maxLength={16}
                    value={testMsg}
                    onChange={(e) => setTestMsg(e.target.value)}
                    placeholder="Hello World"
                  />
                  <Button onClick={handleSendTest} disabled={!testMsg || loading}>Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
