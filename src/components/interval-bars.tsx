"use client";

import type { IntervalBarAnnotation } from "@/types/graph";

import styles from "./interval-bars.module.css";

type IntervalBarsProps = {
  annotation: IntervalBarAnnotation;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function IntervalBars({ annotation, selectedId, onSelect }: IntervalBarsProps) {
  const { intervals, highlightIds } = annotation;
  const axisMin = annotation.axisMin ?? Math.min(...intervals.map((i) => i.start));
  const axisMax = annotation.axisMax ?? Math.max(...intervals.map((i) => i.end));
  const range = axisMax - axisMin;

  // When an interval is selected, highlight it + all overlapping intervals
  const selectedInterval =
    selectedId !== null ? intervals.find((i) => i.id === selectedId) : undefined;

  let activeIds: string[];
  if (selectedInterval) {
    activeIds = intervals
      .filter((i) => i.start <= selectedInterval.end && i.end >= selectedInterval.start)
      .map((i) => i.id);
  } else {
    activeIds = highlightIds ?? [];
  }

  const hasHighlight = activeIds.length > 0;
  const highlightSet = new Set(activeIds);

  function toPercent(value: number): number {
    return ((value - axisMin) / range) * 100;
  }

  // Generate integer tick marks
  const ticks: number[] = [];
  for (let v = Math.ceil(axisMin); v <= Math.floor(axisMax); v++) {
    ticks.push(v);
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["chartArea"]}>
        <div className={styles["bars"]}>
          {intervals.map((interval) => {
            const dimmed = hasHighlight && !highlightSet.has(interval.id);
            const selected = selectedId === interval.id;
            return (
              <button
                key={interval.id}
                className={`${styles["row"]} ${selected ? styles["selected"] : ""}`}
                onClick={() => onSelect(interval.id)}
                type="button"
              >
                <span
                  className={styles["barLabel"]}
                  style={{ opacity: dimmed ? 0.3 : 1 }}
                >
                  {interval.label}
                </span>
                <div className={styles["track"]}>
                  <div
                    className={styles["bar"]}
                    style={{
                      left: `${toPercent(interval.start)}%`,
                      width: `${toPercent(interval.end) - toPercent(interval.start)}%`,
                      backgroundColor: interval.color,
                      opacity: dimmed ? 0.2 : 1,
                    }}
                  >
                    <span className={styles["intervalRange"]}>
                      [{interval.start}, {interval.end}]
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className={styles["axis"]}>
          {ticks.map((v) => (
            <span
              key={v}
              className={styles["tick"]}
              style={{ left: `${toPercent(v)}%` }}
            >
              {v}
            </span>
          ))}
        </div>
        {selectedInterval && (
          <div className={styles["rangeOverlay"]}>
            <div
              className={styles["rangeLine"]}
              style={{ left: `${toPercent(selectedInterval.start)}%` }}
            />
            <div
              className={styles["rangeLine"]}
              style={{ left: `${toPercent(selectedInterval.end)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
