import type { RunStatus } from "../types/run";

const statusLabels: Record<RunStatus, string> = {
    queued: "Queued",
    running: "Running",
    succeeded: "Succeeded",
    failed: "Failed",
};

type RunStatusBadgeProps = {
    status: RunStatus;
};

export function RunStatusBadge({ status }: RunStatusBadgeProps) {
    return (
        <span className={`run-status run-status--${status}`}>
            {statusLabels[status]}
        </span>
    );
}