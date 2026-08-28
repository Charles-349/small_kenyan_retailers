import { useState } from "react";
import { createDeliveryRequest } from "../api";

export default function RetailerScreen() {
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [address, setAddress] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastCreated, setLastCreated] = useState<string | null>(null);

    const canSubmit = customerName && customerPhone && address && itemDescription && !submitting;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const created = await createDeliveryRequest({
                retailerId: "retailer-demo-1",
                customerName,
                customerPhone,
                address,
                itemDescription,
            });
            setLastCreated(created.id);
            setCustomerName("");
            setCustomerPhone("");
            setAddress("");
            setItemDescription("");
        } catch (err: any) {
            setError(err.message ?? "Could not log this delivery. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="screen">
            {lastCreated && (
                <div className="toast">Delivery logged. Waiting for a dispatcher to assign a rider.</div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="customerName">Customer name</label>
                    <input
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Amina Otieno"
                    />
                </div>
                <div className="field">
                    <label htmlFor="customerPhone">Customer phone</label>
                    <input
                        id="customerPhone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="07XX XXX XXX"
                    />
                </div>
                <div className="field">
                    <label htmlFor="address">Delivery address</label>
                    <input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, area, landmark"
                    />
                </div>
                <div className="field">
                    <label htmlFor="itemDescription">Item</label>
                    <textarea
                        id="itemDescription"
                        rows={2}
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        placeholder="What's being delivered"
                    />
                </div>
                {error && <p className="error-text">{error}</p>}
                <button className="btn" type="submit" disabled={!canSubmit}>
                    {submitting ? "Logging..." : "Log delivery request"}
                </button>
            </form>
        </div>
    );
                  }
