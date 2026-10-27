import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RunsPage } from "./RunsPage";
import { fetchRuns } from "../services/mockRuns";
import type { Run } from "../types/run";

vi.mock("../services/mockRuns", () => ({
    fetchRuns: vi.fn(),
}));

const testRuns: Run[] = [
    {
        id: "1",
        name: "Auth refactor",
        repository: "web-platform",
        branch: "feature/auth",
        status: "running",
        createdAt: "2026-10-27T10:00:00Z",
        logs: ["Analyzing authentication."],
    },
    {
        id: "2",
        name: "Fix checkout tests",
        repository: "payments",
        branch: "fix/checkout-tests",
        status: "succeeded",
        createdAt: "2026-10-27T09:30:00Z",
        durationSeconds: 145,
        logs: ["Run started.", "All 24 tests passed."],
        result: "Fixed checkout tests.",
    },
    {
        id: "3",
        name: "Update dependencies",
        repository: "api-service",
        branch: "chore/dependencies",
        status: "queued",
        createdAt: "2026-10-27T09:00:00Z",
        logs: ["Waiting for a worker."],
    },
    {
        id: "4",
        name: "Add profile validation",
        repository: "web-platform",
        branch: "feature/profile",
        status: "failed",
        createdAt: "2026-10-27T08:00:00Z",
        logs: ["Validation failed."],
    },
];

async function renderPage() {
    const user = userEvent.setup();

    render(<RunsPage />);

    // Ждём завершения асинхронной загрузки данных
    await screen.findByRole("button", { name: "Auth refactor" });

    return user;
}

describe("RunsPage", () => {
    beforeEach(() => {
        vi.mocked(fetchRuns).mockReset();
        vi.mocked(fetchRuns).mockResolvedValue(testRuns);
    });

    it("фильтрует по каждому статусу и сбрасывает фильтр через All", async () => {
        const user = await renderPage();

        const cases = [
            ["Queued", "Update dependencies"],
            ["Running", "Auth refactor"],
            ["Succeeded", "Fix checkout tests"],
            ["Failed", "Add profile validation"],
        ];

        for (const [status, name] of cases) {
            const button = screen.getByRole("button", { name: status });

            await user.click(button);

            expect(button).toHaveAttribute("aria-pressed", "true");
            expect(screen.getAllByRole("article")).toHaveLength(1);
            expect(
                screen.getByRole("button", { name }),
            ).toBeInTheDocument();
        }

        await user.click(screen.getByRole("button", { name: "All" }));

        expect(screen.getAllByRole("article")).toHaveLength(4);
    });

    it("ищет по названию и репозиторию совместно с фильтром", async () => {
        const user = await renderPage();

        const input = screen.getByRole("searchbox", {
            name: "Поиск запусков",
        });

        // Поиск по названию
        await user.type(input, "  CHECKOUT  ");

        expect(screen.getAllByRole("article")).toHaveLength(1);
        expect(
            screen.getByRole("button", { name: "Fix checkout tests" }),
        ).toBeInTheDocument();

        // Поиск по репозиторию
        await user.clear(input);
        await user.type(input, "WEB-PLATFORM");

        expect(screen.getAllByRole("article")).toHaveLength(2);

        // Поиск и фильтр действуют одновременно
        await user.click(screen.getByRole("button", { name: "Failed" }));

        expect(screen.getAllByRole("article")).toHaveLength(1);
        expect(
            screen.getByRole("button", { name: "Add profile validation" }),
        ).toBeInTheDocument();

        // Название подходит, но статус не совпадает
        await user.clear(input);
        await user.type(input, "checkout");

        expect(screen.queryAllByRole("article")).toHaveLength(0);
        expect(
            screen.getByText("Запуски не найдены."),
        ).toBeInTheDocument();

        // Сброс очищает оба условия
        await user.click(
            screen.getByRole("button", {
                name: "Сбросить поиск и фильтры",
            }),
        );

        expect(input).toHaveValue("");
        expect(
            screen.getByRole("button", { name: "All" }),
        ).toHaveAttribute("aria-pressed", "true");
        expect(screen.getAllByRole("article")).toHaveLength(4);
    });

    it("открывает подробности выбранного запуска", async () => {
        const user = await renderPage();

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: "Fix checkout tests" }),
        );

        const dialog = screen.getByRole("dialog", {
            name: "Fix checkout tests",
        });

        expect(dialog).toHaveAttribute("open");

        // Ищем внутри окна, чтобы не принять текст карточки за детали
        const details = within(dialog);

        for (const text of [
            "payments",
            "fix/checkout-tests",
            "Succeeded",
            "2 мин 25 с",
            "Fixed checkout tests.",
        ]) {
            expect(details.getByText(text)).toBeInTheDocument();
        }

        expect(details.getByText(/Run started\./)).toHaveTextContent(
            "All 24 tests passed.",
        );

        // Проверяем исходную дату независимо от часового пояса машины
        expect(dialog.querySelector("time")).toHaveAttribute(
            "datetime",
            "2026-10-27T09:30:00Z",
        );

        await user.click(
            details.getByRole("button", {
                name: "Закрыть подробности запуска",
            }),
        );

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});