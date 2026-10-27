import type { RunStatus } from "../types/run";

export type StatusFilter = "all" | RunStatus;

type RunsToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: StatusFilter;
    onStatusFilterChange: (value: StatusFilter) => void;
};

const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "queued", label: "Queued" },
    { value: "running", label: "Running" },
    { value: "succeeded", label: "Succeeded" },
    { value: "failed", label: "Failed" },
];

export function RunsToolbar({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
}: RunsToolbarProps) {
    return (
        <div className="runs-toolbar">
            <label className="runs-toolbar__label" htmlFor="runs-search">
                Поиск запусков
            </label>

            <input
                id="runs-search"
                className="runs-toolbar__input"
                type="search"
                placeholder="Название запуска или репозиторий"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
            />

            <div
                className="runs-toolbar__filters"
                role="group"
                aria-label="Фильтр по статусу"
            >
                {statusFilters.map((filter) => (
                    <button
                        key={filter.value}
                        className="runs-toolbar__filter"
                        type="button"
                        aria-pressed={statusFilter === filter.value}
                        onClick={() => onStatusFilterChange(filter.value)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}