type RunsStateProps =
    | { type: "loading" }
    | { type: "error"; message: string; onRetry: () => void }
    | { type: "empty"; onReset?: () => void };

export function RunsState(props: RunsStateProps) {
    if (props.type === "loading") {
        return (
            <div className="runs-state" role="status">
                Загрузка запусков…
            </div>
        );
    }

    if (props.type === "error") {
        return (
            <div className="runs-state">
                <p role="alert">{props.message}</p>

                <button
                    className="runs-state__button"
                    type="button"
                    onClick={props.onRetry}
                >
                    Повторить
                </button>
            </div>
        );
    }

    return (
        <div className="runs-state" role="status">
            <p>Запуски не найдены.</p>

            {props.onReset && (
                <button
                    className="runs-state__button"
                    type="button"
                    onClick={props.onReset}
                >
                    Сбросить поиск и фильтры
                </button>
            )}
        </div>
    );
}