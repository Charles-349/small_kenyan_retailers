import { useState, type FormEvent } from "react";
import { createDeliveryRequest } from "../api";
import { DeliveryRequest } from "../types";

export default function RetailerScreen() {
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [address, setAddress] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastCreated, setLastCreated] = useState<DeliveryRequest | null>(null);

    const canSubmit = Boolean(customerName && customerPhone && address && itemDescription && !submitting);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true); setError(null);
        try {
            const created = await createDeliveryRequest({ retailerId: "retailer-demo-1", customerName, customerPhone, address, itemDescription });
            setLastCreated(created);
            setCustomerName(""); setCustomerPhone(""); setAddress(""); setItemDescription("");
        } catch (err: any) {
            setError(err.message ?? "We couldn't create the delivery. Please try again.");
        } finally { setSubmitting(false); }
    };

    const trackingToken = lastCreated?.trackingToken ?? lastCreated?.id;
    const trackingUrl = trackingToken ? `${window.location.origin}/track/${trackingToken}` : "";

    return (
        <section className="screen-modern">
            <div className="page-heading">
                <div>
                    <span className="eyebrow">RETAILER WORKSPACE</span>
                    <h1>Send it. We’ll move it.</h1>
                    <p>Request a rider in under a minute and share live tracking with your customer.</p>
                </div>
                <div className="heading-chip"><span className="pulse" /> Riders nearby</div>
            </div>

            <div className="retailer-grid">
                <div className="panel request-panel">
                    <div className="panel-heading">
                        <div><h3>Request a delivery</h3><p>Tell us where the order needs to go.</p></div>
                        <span className="step-badge">01</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="field-modern"><label>Customer name</label><input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Amina Otieno" /></div>
                            <div className="field-modern"><label>Phone number</label><input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="07XX XXX XXX" /></div>
                        </div>
                        <div className="field-modern"><label>Delivery location</label><div className="input-with-icon"><span>⌖</span><input value={address} onChange={e => setAddress(e.target.value)} placeholder="Area, street or landmark" /></div></div>
                        <div className="field-modern"><label>Package details</label><textarea value={itemDescription} onChange={e => setItemDescription(e.target.value)} placeholder="What are we delivering?" rows={3} /></div>
                        {error && <div className="error-box">{error}</div>}
                        <button className="primary-btn" type="submit" disabled={!canSubmit}>{submitting ? <><span className="spinner" /> Finding a rider...</> : <>Request a rider <span>→</span></>}</button>
                    </form>
                </div>

                <div className="side-stack">
                    <div className="dark-card route-preview">
                        <div className="dark-card-top"><span>LIVE DELIVERY NETWORK</span><span className="live-pill">● LIVE</span></div>
                        <div className="mini-map"><div className="map-grid" /><div className="map-road road-a" /><div className="map-road road-b" /><div className="map-pin pin-one">R</div><div className="map-pin pin-two">●</div><div className="map-route" /></div>
                        <div className="network-stats"><div><strong>12</strong><span>riders online</span></div><div><strong>4.8★</strong><span>avg. rating</span></div></div>
                    </div>
                    <div className="panel reassurance"><span className="reassurance-icon">✓</span><div><strong>Customer gets a live link</strong><p>Once assigned, you can share a simple tracking link. No app or account needed.</p></div></div>
                </div>
            </div>

            {lastCreated && <div className="success-panel"><div className="success-icon">✓</div><div className="success-copy"><span className="eyebrow">DELIVERY REQUESTED</span><h3>Order {lastCreated.id} is in the queue.</h3><p>We’re matching the order with the best nearby rider.</p></div><div className="tracking-share"><small>Customer tracking link</small><div><code>{trackingUrl}</code><button onClick={() => navigator.clipboard?.writeText(trackingUrl)}>Copy</button></div></div></div>}
        </section>
    );
}
