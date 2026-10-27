import { useEffect, useState } from "react";
import type { Run, RunSort } from "../types/run";
import { fetchRuns } from "../services/mockRuns";
import { RunList } from "../components/RunList";
import { RunsState } from "../components/RunsState";
import {
    RunsToolbar,
    type StatusFilter,
} from "../components/RunsToolbar";
import { RunDetails } from "../components/RunDetails";
import "./RunsPage.css";

function readUrlState() {
    const params = new URLSearchParams(window.location.search);

    const rawStatus = params.get("status");
    const rawSort = params.get("sort");

    const status: StatusFilter =
        rawStatus === "queued" ||
            rawStatus === "running" ||
            rawStatus === "succeeded" ||
            rawStatus === "failed"
            ? rawStatus
            : "all";

    const sort: RunSort =
        rawSort === "date-asc" ||
            rawSort === "duration-desc" ||
            rawSort === "duration-asc"
            ? rawSort
            : "date-desc";

    return {
        search: params.get("search") ?? "",
        status,
        sort,
    };
}

export function RunsPage() {
    const [runs, setRuns] = useState<Run[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requestAttempt, setRequestAttempt] = useState(0);
    const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
    const [search, setSearch] = useState(() => readUrlState().search);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>(() => readUrlState().status);
    const [sort, setSort] = useState<RunSort>(() => readUrlState().sort);

    useEffect(() => {
        const url = new URL(window.location.href);

        if (search) {
            url.searchParams.set("search", search);
        } else {
            url.searchParams.delete("search");
        }

        if (statusFilter !== "all") {
            url.searchParams.set("status", statusFilter);
        } else {
            url.searchParams.delete("status");
        }

        if (sort !== "date-desc") {
            url.searchParams.set("sort", sort);
        } else {
            url.searchParams.delete("sort");
        }

        window.history.replaceState(window.history.state, "", url);
    }, [search, statusFilter, sort]);

    useEffect(() => {
        function handlePopState() {
            const state = readUrlState();

            setSearch(state.search);
            setStatusFilter(state.status);
            setSort(state.sort);
        }

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

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

    const sortedRuns = [...filteredRuns].sort((a, b) => {
        if (sort === "date-desc" || sort === "date-asc") {
            const difference =
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime();

            return sort === "date-asc" ? difference : -difference;
        }

        if (
            a.durationSeconds === undefined &&
            b.durationSeconds === undefined
        ) {
            return 0;
        }

        if (a.durationSeconds === undefined) return 1;
        if (b.durationSeconds === undefined) return -1;

        const difference = a.durationSeconds - b.durationSeconds;

        return sort === "duration-asc" ? difference : -difference;
    });

    const hasActiveFilters = search.length > 0 || statusFilter !== "all";

    function resetFilters() {
        setSearch("");
        setStatusFilter("all");
    }

    const selectedRun = runs.find((run) => run.id === selectedRunId);

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
                    sort={sort}
                    onSortChange={setSort}
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
                        <RunList runs={sortedRuns} onOpenRun={setSelectedRunId} />
                    )}
                </div>
            </section>
            {selectedRun && (
                <RunDetails
                    key={selectedRun.id}
                    run={selectedRun}
                    onClose={() => setSelectedRunId(null)}
                />
            )}
        </div>
    );
}