import { useEffect, useState } from "react";
import { fetchRequestsByStatus, fetchRiders, assignRider } from "../api";
import { DeliveryRequest, Rider } from "../types";

const POLL_INTERVAL_MS = 10000;

export default function DispatcherScreen() {
    const [requests, setRequests] = useState<DeliveryRequest[]>([]);
    const [riders, setRiders] = useState<Rider[]>([]);
    const [selectedRider, setSelectedRider] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const [openRequests, riderList] = await Promise.all([
                fetchRequestsByStatus("OPEN"),
                fetchRiders(),
            ]);
            setRequests(openRequests);
            setRiders(riderList);
        } catch {
            // Silent on poll failures - next poll will retry.
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        const interval = setInterval(load, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    const handleAssign = async (requestId: string) => {
        const riderId = selectedRider[requestId];
        if (!riderId) return;
        await assignRider(requestId, riderId);
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
    };

    if (loading) return <div className="screen empty-state">Loading open requests...</div>;

    if (requests.length === 0) {
        return (
            <div className="screen">
                <div className="empty-state">No open requests right now. New ones will appear here automatically.</div>
            </div>
        );
    }

    return (
        <div className="screen">
            {requests.map((req) => (
                <div className="card" key={req.id}>
                    <div className="card-top">
                        <div>
                            <p className="card-title">{req.customerName}</p>
                            <p className="card-sub">{req.address}</p>
                        </div>
                        <span className={`status-pill status-${req.status}`}>{req.status}</span>
                    </div>
                    <p className="card-sub">{req.itemDescription}</p>
                    <div className="select-row">
                        <select
                            value={selectedRider[req.id] ?? ""}
                            onChange={(e) =>
                                setSelectedRider((prev) => ({ ...prev, [req.id]: e.target.value }))
                            }
                        >
                            <option value="">Select rider...</option>
                            {riders.map((rider) => (
                                <option key={rider.id} value={rider.id}>
                                    {rider.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={() => handleAssign(req.id)} disabled={!selectedRider[req.id]}>
                            Assign
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
                          }
