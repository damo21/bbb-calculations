"use client";

// react imports
import React from "react";

// lib imports
import {
  Unit,
  WEEKS,
  WeekNumber,
  WeekScheme,
  calculateWeight,
  supplementalWeight,
} from "@/app/lib/program/beefcake";
import { formatWeight } from "@/app/lib/helpers/global-functions";

interface CycleTableProps {
  trainingMax: number | null;
  nextTrainingMax: number | null;
  cycle: number;
  currentWeek: WeekNumber;
  unit: Unit;
}

export default function CycleTable({
  trainingMax,
  nextTrainingMax,
  cycle,
  currentWeek,
  unit,
}: CycleTableProps) {
  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-text-2">
          Cycle {cycle}
          {trainingMax !== null && (
            <span className="font-normal text-text-5">
              {" "}
              · TM {formatWeight(trainingMax)} {unit}
            </span>
          )}
        </h3>
        <span className="text-xs text-text-5">weights in {unit}</span>
      </div>
      <div className="overflow-x-auto border border-ui-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ui-2 text-left text-xs text-text-5">
              <th className="py-2 pl-3 font-normal">Week</th>
              <th className="py-2 font-normal">Set 1</th>
              <th className="py-2 font-normal">Set 2</th>
              <th className="py-2 font-normal">Set 3</th>
              <th className="py-2 pr-3 text-right font-normal">5×10</th>
            </tr>
          </thead>
          <tbody>
            {WEEKS.map((scheme) => (
              <WeekRow
                key={scheme.week}
                scheme={scheme}
                trainingMax={trainingMax}
                unit={unit}
                status={
                  scheme.week < currentWeek
                    ? "done"
                    : scheme.week === currentWeek
                    ? "current"
                    : "upcoming"
                }
                note={
                  scheme.week === currentWeek - 1
                    ? "last week"
                    : scheme.week === currentWeek
                    ? "this week"
                    : undefined
                }
              />
            ))}
            {nextTrainingMax !== null && (
              <>
                <tr>
                  <td
                    colSpan={5}
                    className="border-t border-dashed border-ui-3 px-3 pt-3 pb-1 text-xs text-text-5"
                  >
                    Cycle {cycle + 1} · TM goes up to{" "}
                    <span className="font-mono text-success">
                      {formatWeight(nextTrainingMax)} {unit}
                    </span>
                  </td>
                </tr>
                <WeekRow
                  scheme={WEEKS[0]}
                  trainingMax={nextTrainingMax}
                  unit={unit}
                  status="upcoming"
                />
              </>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function WeekRow({
  scheme,
  trainingMax,
  unit,
  status,
  note,
}: {
  scheme: WeekScheme;
  trainingMax: number | null;
  unit: Unit;
  status: "done" | "current" | "upcoming";
  note?: string;
}) {
  const cell = (value: number) =>
    trainingMax === null ? "—" : formatWeight(value);

  return (
    <tr
      className={`border-b border-ui-2 last:border-0 font-mono ${
        status === "current"
          ? "bg-ui-1 text-text-4 shadow-[inset_3px_0_0_theme(colors.accent.DEFAULT)]"
          : status === "done"
          ? "text-text-3"
          : "text-text-2"
      }`}
    >
      <td className="py-2.5 pl-3 font-sans">
        <span className="block leading-tight">
          {scheme.week} <span className="text-text-5">{scheme.label}</span>
        </span>
        {note && (
          <span
            className={`block text-[11px] leading-tight ${
              status === "current" ? "text-accent" : "text-text-5"
            }`}
          >
            {note}
          </span>
        )}
      </td>
      {scheme.main.map((set, index) => (
        <td key={index} className="py-2.5">
          {cell(calculateWeight(trainingMax ?? 0, set.percentage, unit))}
          <span className="block text-xs text-text-5 sm:ml-1 sm:inline">
            ×{set.reps}
            {set.isAmrap ? "+" : ""}
          </span>
        </td>
      ))}
      <td className="py-2.5 pr-3 text-right">
        {scheme.hasSupplemental
          ? cell(supplementalWeight(trainingMax ?? 0, scheme, unit))
          : "—"}
      </td>
    </tr>
  );
}
