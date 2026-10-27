import type { Run } from "../types/run";
import { RunStatusBadge } from "./RunStatusBadge";

type RunCardProps = {
    run: Run;
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

function formatDate(value: string): string {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "Дата неизвестна"
        : dateFormatter.format(date);
}

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return minutes > 0
        ? `${minutes} мин ${remainingSeconds} с`
        : `${remainingSeconds} с`;
}

export function RunCard({ run }: RunCardProps) {
    return (
        <article className="run-card">
            <div className="run-card__header">
                <h3 className="run-card__title">{run.name}</h3>
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