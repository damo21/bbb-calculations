"use client";

// react imports
import React from "react";

// lib imports
import {
  Lift,
  Unit,
  WeekScheme,
  calculateWeight,
  supplementalWeight,
} from "@/app/lib/program/beefcake";
import { formatWeight } from "@/app/lib/helpers/global-functions";

interface SessionCardProps {
  lift: Lift;
  scheme: WeekScheme;
  trainingMax: number | null;
  unit: Unit;
}

// laid out the same way the article lists each day
export default function SessionCard({
  lift,
  scheme,
  trainingMax,
  unit,
}: SessionCardProps) {
  const weight = (value: number | null) =>
    value === null ? "—" : formatWeight(value);

  return (
    <section className="border border-ui-2">
      <header className="flex items-baseline justify-between gap-3 border-b border-ui-2 px-4 py-3">
        <h3 className="font-semibold text-text-4">{lift.name}</h3>
        <span className="text-sm text-text-5">
          Week {scheme.week} · {scheme.label}
        </span>
      </header>

      <table className="w-full font-mono">
        <tbody>
          {scheme.main.map((set, index) => (
            <tr
              key={index}
              className="border-b border-ui-2 last:border-0"
            >
              <td className="w-16 py-3 pl-4 text-sm text-text-5">
                {Math.round(set.percentage * 100)}%
              </td>
              <td className="py-3 text-2xl font-medium text-text-4">
                {trainingMax === null
                  ? "—"
                  : weight(calculateWeight(trainingMax, set.percentage, unit))}
                <span className="ml-1.5 text-sm text-text-5">{unit}</span>
              </td>
              <td
                className={`py-3 pr-4 text-right text-xl ${
                  set.isAmrap ? "text-accent" : "text-text-2"
                }`}
              >
                ×{set.reps}
                {set.isAmrap ? "+" : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="border-t border-ui-2 bg-ui-1/60 px-4 py-3 text-sm">
        {scheme.hasSupplemental ? (
          <>
            <Line label={`${lift.shortName} 5×10`}>
              <span className="font-mono text-base text-text-4">
                {trainingMax === null
                  ? "—"
                  : weight(supplementalWeight(trainingMax, scheme, unit))}{" "}
                <span className="text-text-5">{unit}</span>
              </span>
            </Line>
            {lift.hasRows && (
              <Line label="Rows 5×10">
                <span className="text-text-5">any row</span>
              </Line>
            )}
          </>
        ) : (
          <Line label="Supplemental">
            <span className="text-text-5">none on deload</span>
          </Line>
        )}
        <Line label="Assistance">
          <span className="text-right text-text-2">
            {lift.assistance.join(", ")}
          </span>
        </Line>
      </dl>
    </section>
  );
}

function Line({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <dt className="shrink-0 text-text-2">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
