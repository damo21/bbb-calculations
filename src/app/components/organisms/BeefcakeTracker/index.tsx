"use client";

// react imports
import React, { useEffect, useState } from "react";

// tabler icons imports
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

// component imports
import LiftTabs from "@/app/components/molecules/LiftTabs";
import SessionCard from "@/app/components/molecules/SessionCard";
import CycleTable from "@/app/components/molecules/CycleTable";

// lib imports
import {
  Unit,
  getLift,
  getWeekScheme,
  incrementFor,
} from "@/app/lib/program/beefcake";
import { useProgramState } from "@/app/lib/hooks/useProgramState";
import { formatWeight } from "@/app/lib/helpers/global-functions";

export default function BeefcakeTracker() {
  const {
    state,
    isLoaded,
    selectLift,
    setTrainingMax,
    setUnit,
    advanceWeek,
    previousWeek,
  } = useProgramState();

  const { unit, selectedLift } = state;
  const lift = getLift(selectedLift);
  const progress = state.lifts[selectedLift];
  const scheme = getWeekScheme(progress.week);
  const nextTrainingMax =
    progress.trainingMax === null
      ? null
      : progress.trainingMax + incrementFor(lift, unit);
  const canGoBack = progress.week > 1 || progress.history.length > 0;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-20 pt-6 sm:pt-10">
      <header className="flex items-end justify-between gap-4 border-b border-ui-2 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-4 sm:text-3xl">
            Boring But Big: Beefcake
          </h1>
          <p className="mt-1 text-sm text-text-5">
            Main lifts 5/3/1, then 5×10 at your first set weight.
          </p>
        </div>
        <UnitToggle unit={unit} onChange={setUnit} />
      </header>

      {/* avoid flashing empty values before localStorage has loaded */}
      <div
        className={`flex flex-col gap-6 transition-opacity ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <LiftTabs
          lifts={state.lifts}
          selectedLift={selectedLift}
          unit={unit}
          onSelect={selectLift}
        />

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-text-5">{lift.day}</p>
            <h2 className="text-xl font-semibold text-text-4">
              Cycle {progress.cycle}, week {progress.week} of 4
            </h2>
          </div>
          <TrainingMaxInput
            key={`${selectedLift}-${unit}`}
            value={progress.trainingMax}
            unit={unit}
            onChange={(value) => setTrainingMax(selectedLift, value)}
          />
        </div>

        {progress.trainingMax === null && (
          <p className="border-l-2 border-accent bg-ui-1 px-4 py-3 text-sm text-text-2">
            Enter your {lift.name.toLowerCase()} training max and every weight
            for the cycle is worked out for you. It&apos;s saved on this device.
          </p>
        )}

        <SessionCard
          lift={lift}
          scheme={scheme}
          trainingMax={progress.trainingMax}
          unit={unit}
        />

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={!canGoBack}
            onClick={() => previousWeek(selectedLift)}
            className="flex items-center gap-1.5 px-1 py-2 text-sm text-text-5 transition-colors hover:text-text-2 disabled:invisible"
          >
            <IconArrowLeft size={16} />
            {progress.week === 1 ? "Undo last increase" : "Previous week"}
          </button>
          <button
            type="button"
            disabled={progress.trainingMax === null}
            onClick={() => advanceWeek(selectedLift)}
            className="flex items-center gap-2 bg-accent px-4 py-2.5 text-sm font-semibold text-ui-background transition-colors hover:bg-accent-alt disabled:cursor-not-allowed disabled:bg-ui-2 disabled:text-text-3"
          >
            {progress.week < 4 ? (
              <>Done, go to week {progress.week + 1}</>
            ) : (
              <>
                Finish cycle, TM to{" "}
                {nextTrainingMax === null ? "—" : formatWeight(nextTrainingMax)}{" "}
                {unit}
              </>
            )}
            <IconArrowRight size={16} />
          </button>
        </div>

        <CycleTable
          trainingMax={progress.trainingMax}
          nextTrainingMax={nextTrainingMax}
          cycle={progress.cycle}
          currentWeek={progress.week}
          unit={unit}
        />

        {progress.history.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold text-text-2">
              Training max history
            </h3>
            <ol className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm text-text-5">
              {progress.history.map((entry) => (
                <li key={entry.completedAt}>
                  C{entry.cycle}{" "}
                  <span className="text-text-2">
                    {formatWeight(entry.trainingMax)}
                  </span>
                </li>
              ))}
              {progress.trainingMax !== null && (
                <li>
                  C{progress.cycle}{" "}
                  <span className="text-accent">
                    {formatWeight(progress.trainingMax)}
                  </span>{" "}
                  now
                </li>
              )}
            </ol>
          </section>
        )}
      </div>
    </main>
  );
}

function UnitToggle({
  unit,
  onChange,
}: {
  unit: Unit;
  onChange: (unit: Unit) => void;
}) {
  return (
    <div className="flex shrink-0 border border-ui-2 text-sm">
      {(["kg", "lb"] as Unit[]).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={unit === option}
          onClick={() => onChange(option)}
          className={`px-3 py-1.5 font-mono transition-colors ${
            unit === option
              ? "bg-text-1 text-ui-background"
              : "text-text-5 hover:text-text-2"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function TrainingMaxInput({
  value,
  unit,
  onChange,
}: {
  value: number | null;
  unit: Unit;
  onChange: (value: number | null) => void;
}) {
  // keep the raw text so values like "102." can be typed
  const [text, setText] = useState(value === null ? "" : formatWeight(value));

  // follow outside changes (cycle increments, storage loading)
  useEffect(() => {
    setText((current) => {
      if (value === null) return current === "" ? current : "";
      return parseFloat(current) === value ? current : formatWeight(value);
    });
  }, [value]);

  return (
    <label className="flex items-center gap-3 border border-ui-2 px-3 py-2 focus-within:border-text-2">
      <span className="text-sm text-text-5">Training max</span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        placeholder="0"
        value={text}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          const parsed = parseFloat(next);
          onChange(Number.isFinite(parsed) && parsed > 0 ? parsed : null);
        }}
        className="w-20 bg-transparent text-right font-mono text-lg text-text-4 outline-none placeholder:text-text-3 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <span className="font-mono text-sm text-text-5">{unit}</span>
    </label>
  );
}
