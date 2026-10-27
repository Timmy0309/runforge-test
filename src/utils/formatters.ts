const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

export function formatDate(value: string): string {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "Дата неизвестна"
        : dateFormatter.format(date);
}

export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return minutes > 0
        ? `${minutes} мин ${remainingSeconds} с`
        : `${remainingSeconds} с`;
}
