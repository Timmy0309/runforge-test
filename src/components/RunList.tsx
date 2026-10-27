import type { Run } from "../types/run";
import { RunCard } from "./RunCard";

type RunListProps = {
    runs: Run[];
};

export function RunList({ runs }: RunListProps) {
    return (
        <ul className="run-list">
            {runs.map((run) => (
                <li key={run.id}>
                    <RunCard run={run} />
                </li>
            ))}
        </ul>
    );
}