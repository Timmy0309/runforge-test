import type { Run } from "../types/run";
import { runs } from "../data/runs"

export function fetchRuns(): Promise<Run[]> {
    return new Promise((resolve) => {setTimeout(() => resolve(runs), 1000)});
}