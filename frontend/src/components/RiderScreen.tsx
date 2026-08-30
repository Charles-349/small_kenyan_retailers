// import { useEffect, useState } from "react";
// import { fetchRiderDeliveries, updateDeliveryStatus } from "../api";
// import { DeliveryRequest, DeliveryStatus } from "../types";

// const RIDER_ID = "rider-demo-1";
// const STEPS: DeliveryStatus[] = ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "ARRIVED", "DELIVERED"];

// export default function RiderScreen() {
//     const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]); const [loading, setLoading] = useState(true); const [scanTarget, setScanTarget] = useState<string|null>(null); const [scanInput, setScanInput] = useState(""); const [error, setError] = useState<string|null>(null);
//     const load = async () => { try { const data = await fetchRiderDeliveries(RIDER_ID); setDeliveries(data.filter(d => d.status !== "DELIVERED")); } catch {} finally { setLoading(false); } };
//     useEffect(() => { load(); }, []);
//     const advance = async (d: DeliveryRequest) => { const next: Record<string, DeliveryStatus> = { ASSIGNED:"PICKED_UP", PICKED_UP:"IN_TRANSIT", IN_TRANSIT:"ARRIVED", ARRIVED:"DELIVERED" }; const status = next[d.status]; if (!status) return; if (status === "DELIVERED") { setScanTarget(d.id); return; } await updateDeliveryStatus(d.id, status as "PICKED_UP" | "DELIVERED"); load(); };
//     const confirm = async (id:string) => { setError(null); try { await updateDeliveryStatus(id,"DELIVERED",scanInput); setScanTarget(null); setScanInput(""); load(); } catch(e:any){setError(e.message ?? "The QR code could not be verified.");} };

//     return <section className="screen-modern"><div className="page-heading"><div><span className="eyebrow">RIDER APP</span><h1>Ready when you are.</h1><p>Your route, your next action, and delivery proof — all in one place.</p></div><div className="rider-status-chip"><span /> ON DUTY</div></div>
//         {loading ? <div className="panel loading-panel">Loading your route…</div> : deliveries.length === 0 ? <div className="panel empty-modern"><div className="empty-icon">⌁</div><h3>No active deliveries</h3><p>You're all clear. New assignments will appear here.</p></div> : <div className="rider-delivery-list">{deliveries.map(d => { const idx = Math.max(0, STEPS.indexOf(d.status)); return <div className="panel rider-delivery" key={d.id}><div className="delivery-top"><div><span className="eyebrow">ACTIVE DELIVERY · #{d.id.slice(-5)}</span><h3>{d.customerName}</h3><p>{d.address}</p></div><span className={`status-pill status-${d.status}`}>{d.status.replace("_"," ")}</span></div><div className="progress-steps">{STEPS.map((s,i)=><div className={`progress-step ${i<=idx?"done":""} ${i===idx?"current":""}`} key={s}><div className="step-dot">{i<idx?"✓":i+1}</div><span>{s.replace("_"," ")}</span></div>)}</div><div className="delivery-details"><div><small>PACKAGE</small><strong>{d.itemDescription}</strong></div><div><small>DESTINATION</small><strong>{d.address}</strong></div></div>{scanTarget === d.id ? <div className="verify-box"><span className="verify-icon">⌗</span><div><strong>Verify delivery</strong><p>Scan the customer's QR code to complete this order.</p><input value={scanInput} onChange={e=>setScanInput(e.target.value)} placeholder="Scanned code" autoFocus />{error&&<p className="error-text">{error}</p>}<div className="verify-actions"><button className="secondary-btn" onClick={()=>setScanTarget(null)}>Cancel</button><button className="primary-btn compact" disabled={!scanInput} onClick={()=>confirm(d.id)}>Confirm delivery</button></div></div></div> : <button className="primary-btn" onClick={()=>advance(d)}>{d.status === "ARRIVED" ? "Scan QR & complete" : d.status === "ASSIGNED" ? "Accept & pick up" : d.status === "PICKED_UP" ? "Start delivery" : "Mark as arrived"}<span>→</span></button>}</div>})}</div>}
//     </section>;
// }



import { useEffect, useState } from "react";
import {
    fetchRiderDeliveries,
    acceptAssignment,
    rejectAssignment,
    markPickedUp,
    markInTransit,
    verifyDelivery,
} from "../api";
import { DeliveryRequest, DeliveryStatus } from "../types";

const ACTIVE_STATUSES: DeliveryStatus[] = [
    "assigned",
    "accepted",
    "picked_up",
    "in_transit",
];

export default function RiderScreen() {
    const [deliveries, setDeliveries] = useState<
        DeliveryRequest[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(
        null,
    );

    const [scanTarget, setScanTarget] = useState<number | null>(
        null,
    );

    const [scanInput, setScanInput] = useState("");
    const [recipientName, setRecipientName] = useState("");

    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        try {
            setError("");

            const data = await fetchRiderDeliveries();

            setDeliveries(
                data.filter((delivery) =>
                    ACTIVE_STATUSES.includes(
                        delivery.status,
                    ),
                ),
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load your deliveries.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleAccept = async (
        delivery: DeliveryRequest,
    ) => {
        if (!delivery.assignmentId) {
            setError(
                `Assignment ID is missing for delivery #${delivery.id}.`,
            );
            return;
        }

        setProcessingId(delivery.id);
        setError(null);

        try {
            await acceptAssignment(
                delivery.assignmentId,
            );

            await load();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to accept the assignment.",
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (
        delivery: DeliveryRequest,
    ) => {
        if (!delivery.assignmentId) {
            setError(
                `Assignment ID is missing for delivery #${delivery.id}.`,
            );
            return;
        }

        setProcessingId(delivery.id);
        setError(null);

        try {
            await rejectAssignment(
                delivery.assignmentId,
            );

            await load();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to reject the assignment.",
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handlePickedUp = async (
        delivery: DeliveryRequest,
    ) => {
        setProcessingId(delivery.id);
        setError(null);

        try {
            await markPickedUp(delivery.id);

            await load();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to mark the delivery as picked up.",
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleInTransit = async (
        delivery: DeliveryRequest,
    ) => {
        setProcessingId(delivery.id);
        setError(null);

        try {
            await markInTransit(delivery.id);

            await load();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to start the delivery.",
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleVerifyDelivery = async (
        delivery: DeliveryRequest,
    ) => {
        if (!scanInput.trim()) return;

        setProcessingId(delivery.id);
        setError(null);

        try {
            await verifyDelivery(
                delivery.id,
                scanInput.trim(),
                recipientName.trim() || undefined,
            );

            setScanTarget(null);
            setScanInput("");
            setRecipientName("");

            await load();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "The QR code could not be verified.",
            );
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusLabel = (
        status: DeliveryStatus,
    ) => {
        return status.replace("_", " ").toUpperCase();
    };

    const getStatusIndex = (
        status: DeliveryStatus,
    ) => {
        const steps: DeliveryStatus[] = [
            "assigned",
            "accepted",
            "picked_up",
            "in_transit",
            "delivered",
        ];

        return Math.max(0, steps.indexOf(status));
    };

    const steps: DeliveryStatus[] = [
        "assigned",
        "accepted",
        "picked_up",
        "in_transit",
        "delivered",
    ];

    return (
        <section className="screen-modern">
            <div className="page-heading">
                <div>
                    <span className="eyebrow">
                        RIDER APP
                    </span>

                    <h1>Ready when you are.</h1>

                    <p>
                        Your assignments, next action and
                        delivery verification — all in one
                        place.
                    </p>
                </div>

                <div className="rider-status-chip">
                    <span />
                    ON DUTY
                </div>
            </div>

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="panel loading-panel">
                    Loading your route…
                </div>
            ) : deliveries.length === 0 ? (
                <div className="panel empty-modern">
                    <div className="empty-icon">
                        ⌁
                    </div>

                    <h3>No active deliveries</h3>

                    <p>
                        You're all clear. New assignments
                        will appear here.
                    </p>
                </div>
            ) : (
                <div className="rider-delivery-list">
                    {deliveries.map((delivery) => {
                        const currentIndex =
                            getStatusIndex(
                                delivery.status,
                            );

                        const processing =
                            processingId ===
                            delivery.id;

                        return (
                            <div
                                className="panel rider-delivery"
                                key={delivery.id}
                            >
                                <div className="delivery-top">
                                    <div>
                                        <span className="eyebrow">
                                            ACTIVE DELIVERY · #
                                            {delivery.id}
                                        </span>

                                        <h3>
                                            {
                                                delivery.customerName
                                            }
                                        </h3>

                                        <p>
                                            {
                                                delivery.deliveryAddress
                                            }
                                        </p>
                                    </div>

                                    <span
                                        className={`status-pill status-${delivery.status}`}
                                    >
                                        {getStatusLabel(
                                            delivery.status,
                                        )}
                                    </span>
                                </div>

                                <div className="progress-steps">
                                    {steps.map(
                                        (
                                            step,
                                            index,
                                        ) => (
                                            <div
                                                className={`progress-step ${
                                                    index <=
                                                    currentIndex
                                                        ? "done"
                                                        : ""
                                                } ${
                                                    index ===
                                                    currentIndex
                                                        ? "current"
                                                        : ""
                                                }`}
                                                key={step}
                                            >
                                                <div className="step-dot">
                                                    {index <
                                                    currentIndex
                                                        ? "✓"
                                                        : index +
                                                          1}
                                                </div>

                                                <span>
                                                    {getStatusLabel(
                                                        step,
                                                    )}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>

                                <div className="delivery-details">
                                    <div>
                                        <small>
                                            PACKAGE
                                        </small>

                                        <strong>
                                            {
                                                delivery.itemDescription
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <small>
                                            DESTINATION
                                        </small>

                                        <strong>
                                            {
                                                delivery.deliveryAddress
                                            }
                                        </strong>
                                    </div>
                                </div>

                                {scanTarget ===
                                delivery.id ? (
                                    <div className="verify-box">
                                        <span className="verify-icon">
                                            ⌗
                                        </span>

                                        <div>
                                            <strong>
                                                Verify delivery
                                            </strong>

                                            <p>
                                                Enter or scan
                                                the customer's
                                                QR code to
                                                complete this
                                                order.
                                            </p>

                                            <input
                                                value={
                                                    scanInput
                                                }
                                                onChange={(
                                                    e,
                                                ) =>
                                                    setScanInput(
                                                        e
                                                            .target
                                                            .value,
                                                    )
                                                }
                                                placeholder="Scanned QR code"
                                                autoFocus
                                            />

                                            <input
                                                value={
                                                    recipientName
                                                }
                                                onChange={(
                                                    e,
                                                ) =>
                                                    setRecipientName(
                                                        e
                                                            .target
                                                            .value,
                                                    )
                                                }
                                                placeholder="Recipient name (optional)"
                                            />

                                            <div className="verify-actions">
                                                <button
                                                    className="secondary-btn"
                                                    type="button"
                                                    onClick={() => {
                                                        setScanTarget(
                                                            null,
                                                        );
                                                        setScanInput(
                                                            "",
                                                        );
                                                        setRecipientName(
                                                            "",
                                                        );
                                                    }}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    className="primary-btn compact"
                                                    type="button"
                                                    disabled={
                                                        !scanInput.trim() ||
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        handleVerifyDelivery(
                                                            delivery,
                                                        )
                                                    }
                                                >
                                                    {processing
                                                        ? "Verifying…"
                                                        : "Confirm delivery"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {delivery.status ===
                                            "assigned" && (
                                            <div className="verify-actions">
                                                <button
                                                    className="secondary-btn"
                                                    type="button"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        handleReject(
                                                            delivery,
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                                <button
                                                    className="primary-btn"
                                                    type="button"
                                                    disabled={
                                                        processing
                                                    }
                                                    onClick={() =>
                                                        handleAccept(
                                                            delivery,
                                                        )
                                                    }
                                                >
                                                    {processing
                                                        ? "Processing…"
                                                        : "Accept assignment"}
                                                    <span>
                                                        →
                                                    </span>
                                                </button>
                                            </div>
                                        )}

                                        {delivery.status ===
                                            "accepted" && (
                                            <button
                                                className="primary-btn"
                                                type="button"
                                                disabled={
                                                    processing
                                                }
                                                onClick={() =>
                                                    handlePickedUp(
                                                        delivery,
                                                    )
                                                }
                                            >
                                                {processing
                                                    ? "Updating…"
                                                    : "Mark as picked up"}
                                                <span>
                                                    →
                                                </span>
                                            </button>
                                        )}

                                        {delivery.status ===
                                            "picked_up" && (
                                            <button
                                                className="primary-btn"
                                                type="button"
                                                disabled={
                                                    processing
                                                }
                                                onClick={() =>
                                                    handleInTransit(
                                                        delivery,
                                                    )
                                                }
                                            >
                                                {processing
                                                    ? "Updating…"
                                                    : "Start delivery"}
                                                <span>
                                                    →
                                                </span>
                                            </button>
                                        )}

                                        {delivery.status ===
                                            "in_transit" && (
                                            <button
                                                className="primary-btn"
                                                type="button"
                                                onClick={() =>
                                                    setScanTarget(
                                                        delivery.id,
                                                    )
                                                }
                                            >
                                                Scan QR & complete
                                                <span>
                                                    →
                                                </span>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

