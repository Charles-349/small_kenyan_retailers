
import { useEffect, useState } from "react";
import {
    autoAssignRider,
    fetchAssignedDeliveries,
    fetchOpenDeliveries,
} from "../api";
import { DeliveryRequest } from "../types";
import type { CurrentUser } from "../App";

const POLL_INTERVAL_MS = 10000;

interface DispatcherScreenProps {
    user: CurrentUser;
}

export default function DispatcherScreen({
    user,
}: DispatcherScreenProps) {
    const [requests, setRequests] = useState<
        DeliveryRequest[]
    >([]);

    const [assigned, setAssigned] = useState<
        DeliveryRequest[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState<number | null>(
        null
    );

    const [error, setError] = useState("");

    const load = async () => {
        try {
            setError("");

            const [
                openRequests,
                assignedRequests,
            ] = await Promise.all([
                fetchOpenDeliveries(),
                fetchAssignedDeliveries(),
            ]);

            setRequests(openRequests);
            setAssigned(assignedRequests);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load dispatcher data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();

        const interval = setInterval(
            load,
            POLL_INTERVAL_MS
        );

        return () => clearInterval(interval);
    }, []);

    const handleAutoAssign = async (
        deliveryRequestId: number
    ) => {
        setAssigning(deliveryRequestId);
        setError("");

        try {
            await autoAssignRider(
            deliveryRequestId
            );

            await load();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to assign rider."
            );
        } finally {
            setAssigning(null);
        }
    };

    /*
     * The backend currently returns only id + role
     * from /auth/me, so name and email may be missing.
     */
    const displayName =
        user.name ||
        [user.firstName, user.lastName]
            .filter(Boolean)
            .join(" ") ||
        "Dispatcher";

    const initials = displayName
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <section className="screen-modern">
            <div className="page-heading">
                <div>
                    <span className="eyebrow">
                        DISPATCH CONTROL
                    </span>

                    <h1>
                        Keep the city moving.
                    </h1>

                    <p>
                        Monitor incoming requests and assign
                        them to the nearest available rider.
                    </p>
                </div>

                <div className="heading-metrics">
                    <div>
                        <strong>
                            {requests.length}
                        </strong>

                        <span>
                            open requests
                        </span>
                    </div>

                    <div>
                        <strong>
                            {assigned.length}
                        </strong>

                        <span>
                            assigned
                        </span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}

            <div className="dispatch-layout">
                <div className="panel requests-panel">
                    <div className="panel-heading">
                        <div>
                            <h3>
                                Incoming requests
                            </h3>

                            <p>
                                New requests refresh
                                automatically.
                            </p>
                        </div>

                        <span className="refresh-badge">
                            ↻ Live
                        </span>
                    </div>

                    {loading ? (
                        <div className="skeleton-list">
                            <div />
                            <div />
                            <div />
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="empty-modern">
                            <div className="empty-icon">
                                ✓
                            </div>

                            <h3>
                                Queue is clear
                            </h3>

                            <p>
                                New delivery requests will
                                appear here automatically.
                            </p>
                        </div>
                    ) : (
                        requests.map((req) => (
                            <div
                                className="request-row"
                                key={req.id}
                            >
                                <div className="request-number">
                                    #{req.id}
                                </div>

                                <div className="request-info">
                                    <div className="request-title">
                                        <strong>
                                            {req.customerName}
                                        </strong>

                                        <span className="status-pill status-OPEN">
                                            {req.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <p>
                                        {req.deliveryAddress}
                                    </p>

                                    <small>
                                        {req.itemDescription}
                                    </small>
                                </div>

                                <div className="assignment">
                                    <span className="nearest-label">
                                        NEAREST RIDER
                                    </span>

                                    <button
                                        className="assign-btn"
                                        onClick={() =>
                                            handleAutoAssign(
                                                req.id
                                            )
                                        }
                                        disabled={
                                            assigning ===
                                            req.id
                                        }
                                    >
                                        {assigning ===
                                        req.id
                                            ? "Assigning…"
                                            : "Auto-assign →"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="panel rider-panel">
                    <div className="panel-heading">
                        <div>
                            <h3>
                                Dispatcher account
                            </h3>

                            <p>
                                Currently signed in.
                            </p>
                        </div>
                    </div>

                    <div className="sidebar-user">
                        <strong>
                            {displayName}
                        </strong>

                        {user.email && (
                            <small>
                                {user.email}
                            </small>
                        )}

                        <small>
                            Dispatcher ID: {user.id}
                        </small>
                    </div>

                    <div className="rider-list">
                        <div className="rider-list-row">
                            <div className="rider-avatar">
                                {initials}
                            </div>

                            <div>
                                <strong>
                                    Dispatcher
                                </strong>

                                <small>
                                    Managing delivery
                                    assignments
                                </small>
                            </div>

                            <span className="distance">
                                {assigned.length} assigned
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

