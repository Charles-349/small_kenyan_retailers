// import { useEffect, useState } from "react";

// const statuses = ["ASSIGNED", "PICKED UP", "IN TRANSIT", "ARRIVED", "DELIVERED"];

// export default function TrackingScreen() {
//     const [active, setActive] = useState(2);
//     useEffect(() => { const i=setInterval(()=>setActive(v=>v<3?v+1:v), 7000); return ()=>clearInterval(i); }, []);
//     return <div className="tracking-page"><header className="tracking-nav"><div className="brand"><div className="brand-mark">R</div><div><div className="brand-name">reflex</div><div className="brand-tag">live delivery</div></div></div><div className="secure-label">● LIVE TRACKING</div></header><main className="tracking-main"><div className="tracking-copy"><span className="eyebrow">DELIVERY RX1024</span><h1>Your order is on the way.</h1><p>Follow your rider in real time. No app or account required.</p></div><div className="tracking-grid"><section className="tracking-map-card"><div className="big-map"><div className="map-grid"/><div className="map-neighborhood n1">WESTLANDS</div><div className="map-neighborhood n2">KILIMANI</div><div className="map-neighborhood n3">PARKLANDS</div><div className="big-route"/><div className="map-stop start">R</div><div className="rider-live"><span>R</span><i /></div><div className="map-stop end">●</div><div className="map-card-label"><span className="pulse"/> Rider location updates live</div></div></section><aside className="tracking-info"><div className="arrival-card"><span className="eyebrow">ESTIMATED ARRIVAL</span><strong>{active >= 3 ? "Arrived" : "12 min"}</strong><span>{active >= 3 ? "Your rider is at the destination" : "Traffic looks clear"}</span></div><div className="rider-profile"><div className="large-avatar">BK</div><div><small>YOUR RIDER</small><h3>Brian Kamau</h3><p>Reflex rider · ★ 4.9</p></div><button aria-label="Call rider">☎</button></div><div className="timeline">{statuses.map((s,i)=><div className={`timeline-item ${i<=active?"complete":""} ${i===active?"now":""}`} key={s}><div className="timeline-dot">{i<active?"✓":i===active?"•":""}</div><div><strong>{s}</strong><small>{i===active ? (s === "IN TRANSIT" ? "Rider is heading to you" : "Current status") : i<active ? "Completed" : "Up next"}</small></div></div>)}</div><div className="tracking-help">Need help? <strong>Contact the retailer</strong></div></aside></div></main></div>;
// }



import { useEffect, useState } from "react";
import { fetchTrackingInfo } from "../api";
import { DeliveryRequest, DeliveryStatus } from "../types";

const STATUSES: DeliveryStatus[] = [
    "open",
    "assigned",
    "accepted",
    "picked_up",
    "in_transit",
    "delivered",
];

export default function TrackingScreen() {
    const [delivery, setDelivery] =
        useState<DeliveryRequest | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getTrackingToken = () => {
        const pathParts =
            window.location.pathname
                .split("/")
                .filter(Boolean);

        const trackIndex =
            pathParts.indexOf("track");

        if (
            trackIndex !== -1 &&
            pathParts[trackIndex + 1]
        ) {
            return pathParts[trackIndex + 1];
        }

        const params = new URLSearchParams(
            window.location.search,
        );

        return params.get("track");
    };

    const loadTracking = async () => {
        const token = getTrackingToken();

        if (!token) {
            setError(
                "No tracking number was provided.",
            );
            setLoading(false);
            return;
        }

        try {
            const data =
                await fetchTrackingInfo(token);

            setDelivery(
                data as DeliveryRequest,
            );

            setError(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load tracking information.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTracking();

        /*
         * Refresh the tracking information every
         * 10 seconds so the customer sees status
         * changes made by the rider.
         */
        const interval = setInterval(
            loadTracking,
            10000,
        );

        return () =>
            clearInterval(interval);
    }, []);

    const getStatusIndex = (
        status: DeliveryStatus,
    ) => {
        const index =
            STATUSES.indexOf(status);

        return index === -1 ? 0 : index;
    };

    const getStatusMessage = (
        status: DeliveryStatus,
    ) => {
        switch (status) {
            case "open":
                return "Your delivery request has been received.";

            case "assigned":
                return "A rider has been assigned to your order.";

            case "accepted":
                return "Your rider has accepted the delivery.";

            case "picked_up":
                return "Your package has been picked up.";

            case "in_transit":
                return "Your rider is heading to you.";

            case "delivered":
                return "Your order has been delivered.";

            default:
                return "Your delivery is being processed.";
        }
    };

    const getStatusTitle = (
        status: DeliveryStatus,
    ) => {
        switch (status) {
            case "open":
                return "Delivery request received";

            case "assigned":
                return "Rider assigned";

            case "accepted":
                return "Rider accepted";

            case "picked_up":
                return "Package picked up";

            case "in_transit":
                return "Your order is on the way";

            case "delivered":
                return "Your order has arrived";

            default:
                return "Delivery update";
        }
    };

    if (loading) {
        return (
            <div className="tracking-page">
                <header className="tracking-nav">
                    <div className="brand">
                        <div className="brand-mark">
                            R
                        </div>

                        <div>
                            <div className="brand-name">
                                reflex
                            </div>

                            <div className="brand-tag">
                                live delivery
                            </div>
                        </div>
                    </div>

                    <div className="secure-label">
                        ● LIVE TRACKING
                    </div>
                </header>

                <main className="tracking-main">
                    <div className="panel loading-panel">
                        Loading tracking information…
                    </div>
                </main>
            </div>
        );
    }

    if (error || !delivery) {
        return (
            <div className="tracking-page">
                <header className="tracking-nav">
                    <div className="brand">
                        <div className="brand-mark">
                            R
                        </div>

                        <div>
                            <div className="brand-name">
                                reflex
                            </div>

                            <div className="brand-tag">
                                live delivery
                            </div>
                        </div>
                    </div>

                    <div className="secure-label">
                        ● LIVE TRACKING
                    </div>
                </header>

                <main className="tracking-main">
                    <div className="panel empty-modern">
                        <div className="empty-icon">
                            !
                        </div>

                        <h3>
                            Tracking unavailable
                        </h3>

                        <p>
                            {error ??
                                "We couldn't find this delivery."}
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    const activeIndex =
        getStatusIndex(delivery.status);

    const trackingNumber =
        delivery.trackingToken ??
        delivery.id;

    const isDelivered =
        delivery.status === "delivered";

    const riderAssigned =
        delivery.riderId !== null;

    return (
        <div className="tracking-page">
            <header className="tracking-nav">
                <div className="brand">
                    <div className="brand-mark">
                        R
                    </div>

                    <div>
                        <div className="brand-name">
                            reflex
                        </div>

                        <div className="brand-tag">
                            live delivery
                        </div>
                    </div>
                </div>

                <div className="secure-label">
                    ● LIVE TRACKING
                </div>
            </header>

            <main className="tracking-main">
                <div className="tracking-copy">
                    <span className="eyebrow">
                        DELIVERY #{trackingNumber}
                    </span>

                    <h1>
                        {getStatusTitle(
                            delivery.status,
                        )}
                    </h1>

                    <p>
                        {getStatusMessage(
                            delivery.status,
                        )}
                    </p>
                </div>

                <div className="tracking-grid">
                    <section className="tracking-map-card">
                        <div className="big-map">
                            <div className="map-grid" />

                            <div className="map-neighborhood n1">
                                DELIVERY
                            </div>

                            <div className="map-neighborhood n2">
                                ROUTE
                            </div>

                            <div className="map-neighborhood n3">
                                DESTINATION
                            </div>

                            <div className="big-route" />

                            <div className="map-stop start">
                                R
                            </div>

                            {riderAssigned &&
                                !isDelivered && (
                                    <div className="rider-live">
                                        <span>
                                            R
                                        </span>

                                        <i />
                                    </div>
                                )}

                            <div className="map-stop end">
                                ●
                            </div>

                            <div className="map-card-label">
                                <span className="pulse" />

                                {isDelivered
                                    ? "Delivery completed"
                                    : riderAssigned
                                      ? "Delivery status updates live"
                                      : "Waiting for rider assignment"}
                            </div>
                        </div>
                    </section>

                    <aside className="tracking-info">
                        <div className="arrival-card">
                            <span className="eyebrow">
                                DELIVERY STATUS
                            </span>

                            <strong>
                                {isDelivered
                                    ? "Delivered"
                                    : delivery.status ===
                                        "in_transit"
                                      ? "On the way"
                                      : delivery.status ===
                                          "picked_up"
                                        ? "Picked up"
                                        : delivery.status ===
                                            "accepted"
                                          ? "Accepted"
                                          : delivery.status ===
                                              "assigned"
                                            ? "Rider assigned"
                                            : "Processing"}
                            </strong>

                            <span>
                                {getStatusMessage(
                                    delivery.status,
                                )}
                            </span>
                        </div>

                        <div className="rider-profile">
                            <div className="large-avatar">
                                {riderAssigned
                                    ? "R"
                                    : "?"}
                            </div>

                            <div>
                                <small>
                                    YOUR RIDER
                                </small>

                                <h3>
                                    {riderAssigned
                                        ? "Rider assigned"
                                        : "Not assigned yet"}
                                </h3>

                                <p>
                                    {riderAssigned
                                        ? "Your rider is handling this delivery."
                                        : "We'll show rider details once assigned."}
                                </p>
                            </div>
                        </div>

                        <div className="timeline">
                            {STATUSES.map(
                                (status, index) => {
                                    const complete =
                                        index <
                                        activeIndex;

                                    const current =
                                        index ===
                                        activeIndex;

                                    return (
                                        <div
                                            className={`timeline-item ${
                                                complete ||
                                                current
                                                    ? "complete"
                                                    : ""
                                            } ${
                                                current
                                                    ? "now"
                                                    : ""
                                            }`}
                                            key={
                                                status
                                            }
                                        >
                                            <div className="timeline-dot">
                                                {complete
                                                    ? "✓"
                                                    : current
                                                      ? "•"
                                                      : ""}
                                            </div>

                                            <div>
                                                <strong>
                                                    {status
                                                        .replace(
                                                            "_",
                                                            " ",
                                                        )
                                                        .toUpperCase()}
                                                </strong>

                                                <small>
                                                    {current
                                                        ? getStatusMessage(
                                                              status,
                                                          )
                                                        : complete
                                                          ? "Completed"
                                                          : "Up next"}
                                                </small>
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>

                        <div className="tracking-help">
                            Need help?{" "}
                            <strong>
                                Contact the retailer
                            </strong>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

