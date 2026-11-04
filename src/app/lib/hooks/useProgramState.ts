"use client";

// react imports
import { useCallback, useEffect, useState } from "react";

// lib imports
import {
  LIFTS,
  LiftKey,
  Unit,
  UNIT_SETTINGS,
  WeekNumber,
  getLift,
  incrementFor,
  roundToPlate,
} from "@/app/lib/program/beefcake";

const STORAGE_KEY = "bbb-beefcake:v2";
const LEGACY_STORAGE_KEY = "bbb-beefcake:v1";
const KG_TO_LB = 2.20462;

export interface CycleHistoryEntry {
  cycle: number;
  trainingMax: number;
  completedAt: string;
}

// every lift moves through its own weeks and cycles
export interface LiftProgress {
  trainingMax: number | null;
  cycle: number;
  week: WeekNumber;
  history: CycleHistoryEntry[];
}

export interface ProgramState {
  unit: Unit;
  selectedLift: LiftKey;
  lifts: Record<LiftKey, LiftProgress>;
}

const emptyLift = (): LiftProgress => ({
  trainingMax: null,
  cycle: 1,
  week: 1,
  history: [],
});

const DEFAULT_STATE: ProgramState = {
  unit: "kg",
  selectedLift: "squat",
  lifts: {
    squat: emptyLift(),
    press: emptyLift(),
    deadlift: emptyLift(),
    bench: emptyLift(),
  },
};

const readStoredState = (): ProgramState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProgramState>;
      return {
        ...DEFAULT_STATE,
        ...parsed,
        lifts: { ...DEFAULT_STATE.lifts, ...parsed.lifts },
      };
    }

    // carry training maxes over from the first version of the tracker
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as {
        unit?: Unit;
        trainingMaxes?: Partial<Record<LiftKey, number | null>>;
      };
      const lifts = { ...DEFAULT_STATE.lifts };
      LIFTS.forEach(({ key }) => {
        lifts[key] = {
          ...emptyLift(),
          trainingMax: parsed.trainingMaxes?.[key] ?? null,
        };
      });
      return { ...DEFAULT_STATE, unit: parsed.unit ?? "kg", lifts };
    }
  } catch {
    // corrupted storage, start fresh
  }
  return DEFAULT_STATE;
};

export function useProgramState() {
  const [state, setState] = useState<ProgramState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorage only exists in the browser, so load after mount to avoid hydration mismatches
  useEffect(() => {
    setState(readStoredState());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage can be unavailable (private mode / quota), the app still works for this visit
    }
  }, [state, isLoaded]);

  const updateLift = useCallback(
    (key: LiftKey, update: (lift: LiftProgress, unit: Unit) => LiftProgress) => {
      setState((prev) => ({
        ...prev,
        lifts: { ...prev.lifts, [key]: update(prev.lifts[key], prev.unit) },
      }));
    },
    []
  );

  const selectLift = useCallback((selectedLift: LiftKey) => {
    setState((prev) => ({ ...prev, selectedLift }));
  }, []);

  const setTrainingMax = useCallback(
    (key: LiftKey, trainingMax: number | null) =>
      updateLift(key, (lift) => ({ ...lift, trainingMax })),
    [updateLift]
  );

  const setUnit = useCallback((unit: Unit) => {
    setState((prev) => {
      if (prev.unit === unit) return prev;
      const factor = unit === "lb" ? KG_TO_LB : 1 / KG_TO_LB;
      const convert = (value: number) =>
        roundToPlate(value * factor, UNIT_SETTINGS[unit].rounding);
      const lifts = { ...prev.lifts };
      LIFTS.forEach(({ key }) => {
        const lift = lifts[key];
        lifts[key] = {
          ...lift,
          trainingMax:
            lift.trainingMax === null ? null : convert(lift.trainingMax),
          history: lift.history.map((entry) => ({
            ...entry,
            trainingMax: convert(entry.trainingMax),
          })),
        };
      });
      return { ...prev, unit, lifts };
    });
  }, []);

  // finishing week 4 is the auto increment: log the cycle, add the increment, back to week 1
  const advanceWeek = useCallback(
    (key: LiftKey) =>
      updateLift(key, (lift, unit) => {
        if (lift.week < 4) {
          return { ...lift, week: (lift.week + 1) as WeekNumber };
        }
        if (lift.trainingMax === null) return lift;
        return {
          trainingMax: lift.trainingMax + incrementFor(getLift(key), unit),
          cycle: lift.cycle + 1,
          week: 1,
          history: [
            ...lift.history,
            {
              cycle: lift.cycle,
              trainingMax: lift.trainingMax,
              completedAt: new Date().toISOString(),
            },
          ],
        };
      }),
    [updateLift]
  );

  // stepping back from week 1 undoes the last increment
  const previousWeek = useCallback(
    (key: LiftKey) =>
      updateLift(key, (lift) => {
        if (lift.week > 1) {
          return { ...lift, week: (lift.week - 1) as WeekNumber };
        }
        const last = lift.history[lift.history.length - 1];
        if (!last) return lift;
        return {
          trainingMax: last.trainingMax,
          cycle: last.cycle,
          week: 4,
          history: lift.history.slice(0, -1),
        };
      }),
    [updateLift]
  );

  return {
    state,
    isLoaded,
    selectLift,
    setTrainingMax,
    setUnit,
    advanceWeek,
    previousWeek,
  };
}
