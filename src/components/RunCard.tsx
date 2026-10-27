import type { Run } from "../types/run";
import { RunStatusBadge } from "./RunStatusBadge";
import { formatDate, formatDuration } from "../utils/formatters";

type RunCardProps = {
    run: Run;
    onOpen: (runId: string) => void;
};

export function RunCard({ run, onOpen }: RunCardProps) {
    return (
        <article className="run-card">
            <div className="run-card__header">
                <h3 className="run-card__title">
                    <button
                        className="run-card__open"
                        type="button"
                        aria-haspopup="dialog"
                        onClick={() => onOpen(run.id)}
                    >
                        {run.name}
                    </button>
                </h3>
                <RunStatusBadge status={run.status} />
            </div>

            <dl className="run-card__details">
                <div className="run-card__field">
                    <dt>Репозиторий</dt>
                    <dd>{run.repository}</dd>
                </div>

                <div className="run-card__field">
                    <dt>Ветка</dt>
                    <dd>{run.branch}</dd>
                </div>

                <div className="run-card__field">
                    <dt>Создан</dt>
                    <dd>
                        <time dateTime={run.createdAt}>
                            {formatDate(run.createdAt)}
                        </time>
                    </dd>
                </div>

                <div className="run-card__field">
                    <dt>Длительность</dt>
                    <dd>
                        {run.durationSeconds !== undefined
                            ? formatDuration(run.durationSeconds)
                            : "Не указана"}
                    </dd>
                </div>
            </dl>
        </article>
    );
}