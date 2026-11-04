"use client";

// react imports
import React from "react";

// lib imports
import { LIFTS, LiftKey, Unit } from "@/app/lib/program/beefcake";
import { LiftProgress } from "@/app/lib/hooks/useProgramState";
import { formatWeight } from "@/app/lib/helpers/global-functions";

interface LiftTabsProps {
  lifts: Record<LiftKey, LiftProgress>;
  selectedLift: LiftKey;
  unit: Unit;
  onSelect: (lift: LiftKey) => void;
}

export default function LiftTabs({
  lifts,
  selectedLift,
  unit,
  onSelect,
}: LiftTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Lifts"
      className="grid grid-cols-4 border border-ui-2 divide-x divide-ui-2"
    >
      {LIFTS.map((lift) => {
        const progress = lifts[lift.key];
        const isSelected = lift.key === selectedLift;
        return (
          <button
            key={lift.key}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(lift.key)}
            className={`flex flex-col items-start gap-0.5 px-2.5 py-2.5 sm:px-4 sm:py-3 text-left transition-colors ${
              isSelected
                ? "bg-text-1 text-ui-background"
                : "text-text-2 hover:bg-ui-1"
            }`}
          >
            <span
              className={`text-[11px] sm:text-xs ${
                isSelected ? "text-ui-2" : "text-text-5"
              }`}
            >
              {lift.day.slice(0, 3)}
            </span>
            <span className="text-sm sm:text-base font-semibold leading-tight">
              {lift.shortName}
            </span>
            <span
              className={`font-mono text-[11px] sm:text-xs ${
                isSelected ? "text-ui-2" : "text-text-5"
              }`}
            >
              {progress.trainingMax === null ? (
                "no TM"
              ) : (
                <>
                  <span className="hidden sm:inline">W{progress.week} · </span>
                  {formatWeight(progress.trainingMax)}
                  {unit}
                </>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
