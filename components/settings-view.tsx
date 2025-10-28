"use client"

import { motion } from "framer-motion"
import { Settings, Clock, Trash2, Moon, Sun, Monitor, AlertTriangle } from "lucide-react"
import { usePlanStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SettingsView() {
  const { resetTime, setResetTime, clearAllData } = usePlanStore()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [showClearDialog, setShowClearDialog] = useState(false)

  const handleResetTimeChange = (value: "00:00" | "06:00") => {
    setResetTime(value)
    toast({
      title: "Reset time updated",
      description: `Your daily plan will now reset at ${value === "00:00" ? "midnight" : "6:00 AM"}.`,
    })
  }

  const handleClearData = () => {
    clearAllData()
    setShowClearDialog(false)
    toast({
      title: "Data cleared",
      description: "All your goals, plans, and history have been deleted.",
    })
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Customize your experience</p>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">Appearance</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme" className="mb-3 block">
                Theme
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-sm">Light</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-sm">Dark</span>
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-sm">System</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Plan Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">Plan Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reset-time" className="mb-3 block">
                Daily Reset Time
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Choose when your daily plan should automatically regenerate
              </p>
              <Select value={resetTime} onValueChange={handleResetTimeChange}>
                <SelectTrigger id="reset-time" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="00:00">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Midnight (12:00 AM)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="06:00">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Morning (6:00 AM)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-6 border-destructive/20">
          <h2 className="text-xl font-bold mb-4 text-foreground">Data Management</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Clear All Data</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This will permanently delete all your goals, plans, and history. This action cannot be undone.
                </p>
                <Button variant="destructive" onClick={() => setShowClearDialog(true)}>
                  <Trash2 className="w-4 h-4" />
                  Clear All Data
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Clear Data Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete all your goals, daily plans, and history from
              your device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearData}>
              Yes, clear all data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
