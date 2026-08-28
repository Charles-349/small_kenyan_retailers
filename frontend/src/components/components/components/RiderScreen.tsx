import { useEffect, useState } from "react";
import { fetchRiderDeliveries, updateDeliveryStatus } from "../api";
import { DeliveryRequest } from "../types";

const RIDER_ID = "rider-demo-1";

const STEPS: DeliveryRequest["status"][] = ["ASSIGNED", "PICKED_UP", "DELIVERED"];

function RouteTrack({ status }: { status: DeliveryRequest["status"] }) {
    const currentIndex = STEPS.indexOf(status);
    return (
        <div className="route-track">
            {STEPS.map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
                    <div className={`route-dot ${i <= currentIndex ? "filled" : ""}`} />
                    {i < STEPS.length - 1 && (
                        <div className={`route-line ${i < currentIndex ? "filled" : ""}`} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function RiderScreen() {
    const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [scanTarget, setScanTarget] = useState<string | null>(null);
    const [scanInput, setScanInput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        try {
            const data = await fetchRiderDeliveries(RIDER_ID);
            setDeliveries(data.filter((d) => d.status !== "DELIVERED"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handlePickUp = async (id: string) => {
        await updateDeliveryStatus(id, "PICKED_UP");
        load();
    };

    const confirmDelivery = async (id: string) => {
        setError(null);
        try {
            await updateDeliveryStatus(id, "DELIVERED", scanInput);
            setScanTarget(null);
            setScanInput("");
            load();
        } catch (err: any) {
            setError(err.message ?? "Scanned code didn't match this delivery.");
        }
    };

    if (loading) return <div className="screen empty-state">Loading your deliveries...</div>;

    if (deliveries.length === 0) {
        return <div className="screen empty-state">No active deliveries assigned to you right now.</div>;
    }

    return (
        <div className="screen">
            {deliveries.map((d) => (
                <div className="card" key={d.id}>
                    <div className="card-top">
                        <div>
                            <p className="card-title">{d.customerName}</p>
                            <p className="card-sub">{d.address}</p>
                        </div>
                        <span className={`status-pill status-${d.status}`}>{d.status.replace("_", " ")}</span>
                    </div>
                    <RouteTrack status={d.status} />

                    {d.status === "ASSIGNED" && (
                        <button className="btn" style={{ marginTop: 12 }} onClick={() => handlePickUp(d.id)}>
                            Mark picked up
                        </button>
                    )}

                    {d.status === "PICKED_UP" && scanTarget !== d.id && (
                        <button
                            className="btn"
                            style={{ marginTop: 12 }}
                            onClick={() => setScanTarget(d.id)}
                        >
                            Scan to confirm delivery
                        </button>
                    )}

                    {scanTarget === d.id && (
                        <div style={{ marginTop: 12 }}>
                            <div className="field">
                                <label>Scanned code</label>
                                <input
                                    value={scanInput}
                                    onChange={(e) => setScanInput(e.target.value)}
                                    placeholder="Scan or paste the delivery's QR code"
                                    autoFocus
                                />
                            </div>
                            {error && <p className="error-text">{error}</p>}
                            <button className="btn" onClick={() => confirmDelivery(d.id)} disabled={!scanInput}>
                                Confirm delivery
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
