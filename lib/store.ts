"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Meal {
  name: string
  calories: number
  protein: number
  details: string
}

export interface DailyPlan {
  wake_time: string
  hydration: string
  meals: Meal[]
  workout: string
  checklist: string[]
  beard_care?: string
  lifestyle_tips?: string[]
}

export interface WeeklyPlan {
  startDate: string // ISO date string for the week start (Monday)
  days: {
    [key: string]: DailyPlan // key is day name: "Monday", "Tuesday", etc.
  }
}

export interface GroceryItem {
  id: string
  name: string
  category: "produce" | "protein" | "dairy" | "grains" | "other"
  purchased: boolean
}

export interface PlanHistory {
  date: string
  plan: DailyPlan
  completedChecklist: boolean[]
}

export interface UserProfile {
  age?: string
  height?: string
  weight?: string
  gender?: string
  fitnessGoals?: string
  dietaryPreferences?: string
  hasBeard?: boolean
  beardLength?: string
  beardStyle?: string
  beardCarePreferences?: string
  otherPreferences?: string
}

interface PlanStore {
  userProfile: UserProfile
  goals: string
  currentPlan: DailyPlan | null
  weeklyPlan: WeeklyPlan | null
  currentDayIndex: number // 0-6 for Monday-Sunday
  groceryList: GroceryItem[]
  lastGenerated: string | null
  history: PlanHistory[]
  completedChecklist: boolean[]
  resetTime: "00:00" | "06:00"

  setUserProfile: (profile: UserProfile) => void
  setGoals: (goals: string) => void
  setCurrentPlan: (plan: DailyPlan) => void
  setWeeklyPlan: (plan: WeeklyPlan) => void
  setCurrentDayIndex: (index: number) => void
  nextDay: () => void
  previousDay: () => void
  setGroceryList: (items: GroceryItem[]) => void
  toggleGroceryItem: (id: string) => void
  setLastGenerated: (date: string) => void
  toggleChecklistItem: (index: number) => void
  addToHistory: (plan: DailyPlan, completed: boolean[]) => void
  checkAndRegeneratePlan: () => boolean
  setResetTime: (time: "00:00" | "06:00") => void
  clearAllData: () => void
}

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      userProfile: {},
      goals: "",
      currentPlan: null,
      weeklyPlan: null,
      currentDayIndex: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, // Monday = 0
      groceryList: [],
      lastGenerated: null,
      history: [],
      completedChecklist: [],
      resetTime: "06:00",

      setUserProfile: (profile) => set({ userProfile: profile }),

      setGoals: (goals) => set({ goals }),

      setCurrentPlan: (plan) =>
        set({
          currentPlan: plan,
          completedChecklist: new Array(plan.checklist.length).fill(false),
        }),

      setWeeklyPlan: (plan) => set({ weeklyPlan: plan }),

      setCurrentDayIndex: (index) => set({ currentDayIndex: index }),

      nextDay: () =>
        set((state) => ({
          currentDayIndex: (state.currentDayIndex + 1) % 7,
        })),

      previousDay: () =>
        set((state) => ({
          currentDayIndex: state.currentDayIndex === 0 ? 6 : state.currentDayIndex - 1,
        })),

      setGroceryList: (items) => set({ groceryList: items }),

      toggleGroceryItem: (id) =>
        set((state) => ({
          groceryList: state.groceryList.map((item) =>
            item.id === id ? { ...item, purchased: !item.purchased } : item,
          ),
        })),

      setLastGenerated: (date) => set({ lastGenerated: date }),

      toggleChecklistItem: (index) =>
        set((state) => {
          const newChecklist = [...state.completedChecklist]
          newChecklist[index] = !newChecklist[index]
          return { completedChecklist: newChecklist }
        }),

      addToHistory: (plan, completed) =>
        set((state) => ({
          history: [
            {
              date: new Date().toISOString(),
              plan,
              completedChecklist: completed,
            },
            ...state.history,
          ].slice(0, 30),
        })),

      checkAndRegeneratePlan: () => {
        const state = get()
        if (!state.lastGenerated) return true

        const lastGen = new Date(state.lastGenerated)
        const now = new Date()
        const resetHour = Number.parseInt(state.resetTime.split(":")[0])

        const lastResetTime = new Date(lastGen)
        lastResetTime.setHours(resetHour, 0, 0, 0)
        if (lastGen < lastResetTime) {
          lastResetTime.setDate(lastResetTime.getDate() - 1)
        }

        const nextResetTime = new Date(lastResetTime)
        nextResetTime.setDate(nextResetTime.getDate() + 1)

        if (now >= nextResetTime) {
          if (state.currentPlan) {
            get().addToHistory(state.currentPlan, state.completedChecklist)
          }
          return true
        }

        return false
      },

      setResetTime: (time) => set({ resetTime: time }),

      clearAllData: () =>
        set({
          userProfile: {},
          goals: "",
          currentPlan: null,
          weeklyPlan: null,
          currentDayIndex: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
          groceryList: [],
          lastGenerated: null,
          history: [],
          completedChecklist: [],
        }),
    }),
    {
      name: "kaio-plan-storage",
    },
  ),
)
