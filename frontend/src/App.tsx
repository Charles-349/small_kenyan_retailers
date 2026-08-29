import { useEffect, useState } from "react";
import RetailerScreen from "./components/RetailerScreen";
import DispatcherScreen from "./components/DispatcherScreen";
import RiderScreen from "./components/RiderScreen";
import TrackingScreen from "./components/TrackingScreen";
import "./styles.css";

type Persona = "retailer" | "dispatcher" | "rider";

const TABS: { id: Persona; label: string; icon: string }[] = [
    { id: "retailer", label: "Retailer", icon: "▣" },
    { id: "dispatcher", label: "Dispatch", icon: "⌁" },
    { id: "rider", label: "Rider", icon: "↗" },
];

export default function App() {
    const [persona, setPersona] = useState<Persona>("retailer");
    const [tracking, setTracking] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setTracking(window.location.pathname.startsWith("/track") || params.has("track"));
    }, []);

    if (tracking) return <TrackingScreen />;

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-mark">R</div>
                    <div>
                        <div className="brand-name">reflex</div>
                        <div className="brand-tag">last-mile, simplified</div>
                    </div>
                </div>

                <div className="sidebar-copy">
                    <span className="eyebrow">OPERATIONS HUB</span>
                    <h2>Move every order with confidence.</h2>
                    <p>One calm workspace for retailers, dispatchers and riders.</p>
                </div>

                <nav className="side-nav" aria-label="Workspace">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`side-nav-item ${persona === tab.id ? "active" : ""}`}
                            onClick={() => setPersona(tab.id)}
                        >
                            <span className="nav-icon">{tab.icon}</span>
                            <span>{tab.label}</span>
                            {persona === tab.id && <span className="nav-arrow">→</span>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="live-dot"><span /> Live system</div>
                    <small>Built for fast, human delivery.</small>
                </div>
            </aside>

            <main className="main-area">
                <header className="topbar">
                    <div>
                        <span className="mobile-brand">reflex</span>
                        <span className="topbar-context">Operations / {persona}</span>
                    </div>
                    <div className="topbar-right">
                        <span className="status-online"><span /> All systems operational</span>
                        <div className="avatar">EK</div>
                    </div>
                </header>

                <div className="content-area">
                    {persona === "retailer" && <RetailerScreen />}
                    {persona === "dispatcher" && <DispatcherScreen />}
                    {persona === "rider" && <RiderScreen />}
                </div>
            </main>
        </div>
    );
}
