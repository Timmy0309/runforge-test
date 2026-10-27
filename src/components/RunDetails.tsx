import { useEffect, useRef } from "react";
import type { Run } from "../types/run";
import { formatDate, formatDuration } from "../utils/formatters";
import { RunStatusBadge } from "./RunStatusBadge";
import "./RunDetails.css";

type RunDetailsProps = {
    run: Run;
    onClose: () => void;
};

export function RunDetails({ run, onClose }: RunDetailsProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        dialog.showModal();

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return (
        <dialog
            ref={dialogRef}
            className="run-details"
            aria-labelledby="run-details-title"
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            onClick={(event) => {
                if (event.target !== event.currentTarget) return;

                const rect = event.currentTarget.getBoundingClientRect();

                const clickedOutside =
                    event.clientX < rect.left ||
                    event.clientX > rect.right ||
                    event.clientY < rect.top ||
                    event.clientY > rect.bottom;

                if (clickedOutside) {
                    onClose();
                }
            }}
        >
            <div className="run-details__content">
                <header className="run-details__header">
                    <h2 id="run-details-title" className="run-details__title">
                        {run.name}
                    </h2>

                    <button
                        className="run-details__close"
                        type="button"
                        aria-label="Закрыть подробности запуска"
                        onClick={onClose}
                        autoFocus
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </header>

                <dl className="run-details__info">
                    <div className="run-details__field">
                        <dt>ID запуска</dt>
                        <dd>{run.id}</dd>
                    </div>

                    <div className="run-details__field">
                        <dt>Статус</dt>
                        <dd>
                            <RunStatusBadge status={run.status} />
                        </dd>
                    </div>

                    <div className="run-details__field">
                        <dt>Репозиторий</dt>
                        <dd>{run.repository}</dd>
                    </div>

                    <div className="run-details__field">
                        <dt>Ветка</dt>
                        <dd>{run.branch}</dd>
                    </div>

                    <div className="run-details__field">
                        <dt>Создан</dt>
                        <dd>
                            <time dateTime={run.createdAt}>
                                {formatDate(run.createdAt)}
                            </time>
                        </dd>
                    </div>

                    <div className="run-details__field">
                        <dt>Длительность</dt>
                        <dd>
                            {run.durationSeconds !== undefined
                                ? formatDuration(run.durationSeconds)
                                : "Не указана"}
                        </dd>
                    </div>
                </dl>

                <section
                    className="run-details__section"
                    aria-labelledby="run-logs-title"
                >
                    <h3 id="run-logs-title" className="run-details__subtitle">
                        Логи
                    </h3>

                    {run.logs.length > 0 ? (
                        <pre className="run-details__logs">
                            <code>{run.logs.join("\n")}</code>
                        </pre>
                    ) : (
                        <p className="run-details__muted">Логи пока отсутствуют.</p>
                    )}
                </section>

                {run.result && (
                    <section
                        className="run-details__section"
                        aria-labelledby="run-result-title"
                    >
                        <h3 id="run-result-title" className="run-details__subtitle">
                            Результат
                        </h3>

                        <p className="run-details__result">{run.result}</p>
                    </section>
                )}
            </div>
        </dialog>
    );
}