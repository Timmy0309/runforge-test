import { useEffect, useState } from "react";
import type { Run } from "../types/run";
import { fetchRuns } from "../services/mockRuns";
import { RunList } from "../components/RunList";
import { RunsState } from "../components/RunsState";
import {
    RunsToolbar,
    type StatusFilter,
} from "../components/RunsToolbar";
import "./RunsPage.css";


export function RunsPage() {
    const [runs, setRuns] = useState<Run[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requestAttempt, setRequestAttempt] = useState(0);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    useEffect(() => {
        let ignore = false;

        async function loadRuns() {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchRuns();

                if (!ignore) {
                    setRuns(data);
                }
            } catch {
                if (!ignore) {
                    setError("Не удалось загрузить запуски. Попробуйте ещё раз.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        void loadRuns();

        return () => {
            ignore = true;
        };
    }, [requestAttempt]);

    function retryLoading() {
        setRequestAttempt((attempt) => attempt + 1);
    }

    const normalizedSearch = search.trim().toLowerCase();

    const filteredRuns = runs.filter((run) => {
        const matchesSearch =
            run.name.toLowerCase().includes(normalizedSearch) ||
            run.repository.toLowerCase().includes(normalizedSearch);

        const matchesStatus =
            statusFilter === "all" || run.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const hasActiveFilters = search.length > 0 || statusFilter !== "all";

    function resetFilters() {
        setSearch("");
        setStatusFilter("all");
    }

    return (
        <div className="runs-page">
            <header className="runs-page__header">
                <p className="runs-page__eyebrow">Workspace / Runs</p>
                <h1 className="runs-page__title">Runs</h1>
                <p className="runs-page__description">
                    Запуски AI-агентов, их статусы и результаты.
                </p>
            </header>

            <section className="runs-panel" aria-labelledby="runs-list-title">
                <header className="runs-panel__header">
                    <h2 id="runs-list-title" className="runs-panel__title">
                        Последние запуски
                    </h2>
                </header>

                <RunsToolbar
                    search={search}
                    onSearchChange={setSearch}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                />

                <div className="runs-panel__content" aria-busy={loading}>
                    {loading ? (
                        <RunsState type="loading" />
                    ) : error ? (
                        <RunsState
                            type="error"
                            message={error}
                            onRetry={retryLoading}
                        />
                    ) : filteredRuns.length === 0 ? (
                        <RunsState
                            type="empty"
                            onReset={hasActiveFilters ? resetFilters : undefined}
                        />
                    ) : (
                        <RunList runs={filteredRuns} />
                    )}
                </div>
            </section>
        </div>
    );
}