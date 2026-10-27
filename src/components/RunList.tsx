import type { Run } from "../types/run";
import { RunCard } from "./RunCard";

type RunListProps = {
    runs: Run[];
    onOpenRun: (runId: string) => void;
};

export function RunList({ runs, onOpenRun }: RunListProps) {
    return (
        <ul className="run-list">
            {runs.map((run) => (
                <li key={run.id}>
                    <RunCard run={run} onOpen={onOpenRun} />
                </li>
            ))}
        </ul>
    );
}