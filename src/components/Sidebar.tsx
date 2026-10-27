export function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar__brand">Runforge</div>

            <nav className="sidebar__nav" aria-label="Основная навигация">
                <p className="sidebar__label">Workspace</p>

                <a className="sidebar__link" href="/" aria-current="page">
                    Runs
                </a>
            </nav>
        </aside>
    );
}