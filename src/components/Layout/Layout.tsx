import type { ReactNode } from "react";
import { Sidebar } from "../Sidebar";
import "./Layout.css";


type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>

      <Sidebar />

      <main id="main-content" className="layout__main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}