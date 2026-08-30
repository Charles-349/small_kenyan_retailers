
import { useEffect, useState } from "react";
import RetailerScreen from "./components/RetailerScreen";
import DispatcherScreen from "./components/DispatcherScreen";
import RiderScreen from "./components/RiderScreen";
import TrackingScreen from "./components/TrackingScreen";
import Login from "./components/login";
import Register from "./components/Register";
import { getCurrentUser, logoutUser } from "./api";
import "./styles.css";

type Role = "retailer" | "dispatcher" | "rider";

export interface CurrentUser {
    id: number;
    role: Role;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
}

export default function App() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [tracking, setTracking] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(
            window.location.search
        );

        const isTracking =
            window.location.pathname.startsWith("/track") ||
            params.has("track");

        setTracking(isTracking);

        if (isTracking) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        getCurrentUser()
            .then((currentUser) => {
                setUser(currentUser as CurrentUser);
            })
            .catch((error) => {
                console.error(
                    "Failed to load current user:",
                    error
                );

                logoutUser();
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    /*
     * Public tracking page
     */
    if (tracking) {
        return <TrackingScreen />;
    }

    /*
     * Authentication loading state
     */
    if (loading) {
        return (
            <div className="auth-loading">
                <p>Loading...</p>
            </div>
        );
    }

    /*
     * User is not logged in
     */
    if (!user) {
        if (showRegister) {
            return (
                <Register
                    onLogin={() =>
                        setShowRegister(false)
                    }
                />
            );
        }

        return (
            <Login
                onRegister={() =>
                    setShowRegister(true)
                }
            />
        );
    }

    /*
     * Logout
     */
    const handleLogout = () => {
        logoutUser();
        setUser(null);
    };

    /*
     * Safely determine the user's display name.
     *
     * The current backend may only return:
     * { id, role }
     *
     * so we must not assume name exists.
     */
    const displayName =
        user.name ||
        [user.firstName, user.lastName]
            .filter(Boolean)
            .join(" ") ||
        "User";

    /*
     * Create initials safely for the avatar.
     */
    const initials = displayName
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-mark">
                        R
                    </div>

                    <div>
                        <div className="brand-name">
                            reflex
                        </div>

                        <div className="brand-tag">
                            last-mile, simplified
                        </div>
                    </div>
                </div>

                <div className="sidebar-copy">
                    <span className="eyebrow">
                        OPERATIONS HUB
                    </span>

                    <h2>
                        Move every order with confidence.
                    </h2>

                    <p>
                        One calm workspace for retailers,
                        dispatchers and riders.
                    </p>
                </div>

                <div className="sidebar-user">
                    <strong>
                        {displayName}
                    </strong>

                    <small>
                        {user.role}
                    </small>
                </div>

                <div className="sidebar-footer">
                    <div className="live-dot">
                        <span />
                        Live system
                    </div>

                    <small>
                        Built for fast, human delivery.
                    </small>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </div>
            </aside>

            <main className="main-area">
                <header className="topbar">
                    <div>
                        <span className="mobile-brand">
                            reflex
                        </span>

                        <span className="topbar-context">
                            Operations / {user.role}
                        </span>
                    </div>

                    <div className="topbar-right">
                        <span className="status-online">
                            <span />
                            All systems operational
                        </span>

                        <div className="avatar">
                            {initials}
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    {user.role === "retailer" && (
                        <RetailerScreen />
                    )}

                    {user.role === "dispatcher" && (
                        <DispatcherScreen user={user} />
                    )}

                    {user.role === "rider" && (
                        <RiderScreen />
                    )}
                </div>
            </main>
        </div>
    );
}
