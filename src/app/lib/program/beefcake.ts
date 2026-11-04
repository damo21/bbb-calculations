// Boring But Big: Beefcake Training (Jim Wendler)
// https://www.jimwendler.com/blogs/jimwendler-com/boring-but-big-beefcake-training
// - Main lifts are done 5/3/1 style
// - Supplemental 5x10 is done with FSL (first set last) weights, all 50 reps in ~20 minutes
// - Rows 5x10 on press and bench day, not programmed: "just row something"
// - Week 4 is a deload (5/3/1 Second Edition) with no supplemental work
// - Each finished cycle adds 2.5kg / 5lb to press and bench, 5kg / 10lb to squat and deadlift

export type LiftKey = "squat" | "press" | "deadlift" | "bench";
export type Unit = "kg" | "lb";
export type WeekNumber = 1 | 2 | 3 | 4;

export interface ProgramSet {
  percentage: number;
  reps: number;
  isAmrap?: boolean;
}

export interface WeekScheme {
  week: WeekNumber;
  label: string;
  main: ProgramSet[];
  hasSupplemental: boolean;
}

export interface Lift {
  key: LiftKey;
  name: string;
  shortName: string;
  day: string;
  isUpperBody: boolean;
  hasRows: boolean;
  assistance: string[];
}

export const LIFTS: Lift[] = [
  {
    key: "squat",
    name: "Squat",
    shortName: "Squat",
    day: "Monday",
    isUpperBody: false,
    hasRows: false,
    assistance: ["Dips × 50", "Chins × 50"],
  },
  {
    key: "press",
    name: "Overhead Press",
    shortName: "Press",
    day: "Tuesday",
    isUpperBody: true,
    hasRows: true,
    assistance: ["Ab work × 50", "Single leg work × 25/leg (optional)"],
  },
  {
    key: "deadlift",
    name: "Deadlift",
    shortName: "Deadlift",
    day: "Thursday",
    isUpperBody: false,
    hasRows: false,
    assistance: ["Dips × 50", "Face pulls × 100"],
  },
  {
    key: "bench",
    name: "Bench Press",
    shortName: "Bench",
    day: "Friday",
    isUpperBody: true,
    hasRows: true,
    assistance: ["Ab work × 50", "Single leg work × 25/leg (optional)"],
  },
];

export const WEEKS: WeekScheme[] = [
  {
    week: 1,
    label: "5s",
    main: [
      { percentage: 0.65, reps: 5 },
      { percentage: 0.75, reps: 5 },
      { percentage: 0.85, reps: 5, isAmrap: true },
    ],
    hasSupplemental: true,
  },
  {
    week: 2,
    label: "3s",
    main: [
      { percentage: 0.7, reps: 3 },
      { percentage: 0.8, reps: 3 },
      { percentage: 0.9, reps: 3, isAmrap: true },
    ],
    hasSupplemental: true,
  },
  {
    week: 3,
    label: "5/3/1",
    main: [
      { percentage: 0.75, reps: 5 },
      { percentage: 0.85, reps: 3 },
      { percentage: 0.95, reps: 1, isAmrap: true },
    ],
    hasSupplemental: true,
  },
  {
    week: 4,
    label: "Deload",
    main: [
      { percentage: 0.4, reps: 5 },
      { percentage: 0.5, reps: 5 },
      { percentage: 0.6, reps: 5 },
    ],
    hasSupplemental: false,
  },
];

export const UNIT_SETTINGS: Record<
  Unit,
  { rounding: number; upperIncrement: number; lowerIncrement: number }
> = {
  kg: { rounding: 2.5, upperIncrement: 2.5, lowerIncrement: 5 },
  lb: { rounding: 5, upperIncrement: 5, lowerIncrement: 10 },
};

export const roundToPlate = (weight: number, rounding: number): number => {
  const rounded = Math.round(weight / rounding) * rounding;
  // avoid floating point noise like 72.50000001
  return Math.round(rounded * 100) / 100;
};

export const calculateWeight = (
  trainingMax: number,
  percentage: number,
  unit: Unit
): number => roundToPlate(trainingMax * percentage, UNIT_SETTINGS[unit].rounding);

// FSL: the 5x10 uses the first working set's weight
export const supplementalWeight = (
  trainingMax: number,
  scheme: WeekScheme,
  unit: Unit
): number => calculateWeight(trainingMax, scheme.main[0].percentage, unit);

export const incrementFor = (lift: Lift, unit: Unit): number =>
  lift.isUpperBody
    ? UNIT_SETTINGS[unit].upperIncrement
    : UNIT_SETTINGS[unit].lowerIncrement;

export const getWeekScheme = (week: WeekNumber): WeekScheme =>
  WEEKS.find((scheme) => scheme.week === week) ?? WEEKS[0];

export const getLift = (key: LiftKey): Lift =>
  LIFTS.find((lift) => lift.key === key) ?? LIFTS[0];
