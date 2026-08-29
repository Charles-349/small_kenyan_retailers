import { useEffect, useState } from "react";
import { assignRider, fetchRequestsByStatus, fetchRiders } from "../api";
import { DeliveryRequest, Rider } from "../types";

const POLL_INTERVAL_MS = 10000;

export default function DispatcherScreen() {
    const [requests, setRequests] = useState<DeliveryRequest[]>([]);
    const [riders, setRiders] = useState<Rider[]>([]);
    const [selectedRider, setSelectedRider] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState<string | null>(null);

    const load = async () => { try { const [r, rs] = await Promise.all([fetchRequestsByStatus("OPEN"), fetchRiders()]); setRequests(r); setRiders(rs); } catch {} finally { setLoading(false); } };
    useEffect(() => { load(); const i = setInterval(load, POLL_INTERVAL_MS); return () => clearInterval(i); }, []);

    const handleAssign = async (id: string) => { const riderId = selectedRider[id]; if (!riderId) return; setAssigning(id); try { await assignRider(id, riderId); setRequests(prev => prev.filter(r => r.id !== id)); } finally { setAssigning(null); } };
    const available = riders.filter(r => r.status !== "OFFLINE");

    return <section className="screen-modern">
        <div className="page-heading"><div><span className="eyebrow">DISPATCH CONTROL</span><h1>Keep the city moving.</h1><p>See incoming requests and pair each order with the closest available rider.</p></div><div className="heading-metrics"><div><strong>{requests.length}</strong><span>open requests</span></div><div><strong>{available.length}</strong><span>riders online</span></div></div></div>
        <div className="dispatch-layout">
            <div className="panel requests-panel"><div className="panel-heading"><div><h3>Incoming requests</h3><p>New requests refresh automatically.</p></div><span className="refresh-badge">↻ Live</span></div>
                {loading ? <div className="skeleton-list"><div /><div /><div /></div> : requests.length === 0 ? <div className="empty-modern"><div className="empty-icon">✓</div><h3>Queue is clear</h3><p>New delivery requests will appear here automatically.</p></div> : requests.map(req => {
                    const best = [...available].sort((a,b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))[0];
                    return <div className="request-row" key={req.id}><div className="request-number">#{req.id.slice(-5)}</div><div className="request-info"><div className="request-title"><strong>{req.customerName}</strong><span className="status-pill status-OPEN">OPEN</span></div><p>{req.address}</p><small>{req.itemDescription}</small></div><div className="assignment"><span className="nearest-label">BEST MATCH</span><select value={selectedRider[req.id] ?? best?.id ?? ""} onChange={e => setSelectedRider(prev => ({...prev, [req.id]: e.target.value}))}><option value="">Select rider</option>{available.map(r => <option key={r.id} value={r.id}>{r.name}{r.distanceKm != null ? ` · ${r.distanceKm} km` : ""}</option>)}</select><button className="assign-btn" onClick={() => handleAssign(req.id)} disabled={assigning === req.id || !(selectedRider[req.id] ?? best?.id)}>{assigning === req.id ? "Assigning…" : "Assign →"}</button></div></div>
                })}
            </div>
            <div className="panel rider-panel"><div className="panel-heading"><div><h3>Rider network</h3><p>Availability at a glance.</p></div></div><div className="rider-map"><div className="map-grid" /><div className="dispatch-route-line" />{available.slice(0,5).map((r,i) => <div key={r.id} className={`rider-map-dot dot-${i}`}><span>{r.name.charAt(0)}</span></div>)}</div><div className="rider-list">{available.slice(0,4).map(r => <div className="rider-list-row" key={r.id}><div className="rider-avatar">{r.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><div><strong>{r.name}</strong><small>{r.status === "BUSY" ? "On delivery" : "Available"}</small></div><span className="distance">{r.distanceKm != null ? `${r.distanceKm} km` : "—"}</span></div>)}</div></div>
        </div>
    </section>;
}
