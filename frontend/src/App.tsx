import { useState } from "react";
import RetailerScreen from "./components/RetailerScreen";
import DispatcherScreen from "./components/DispatcherScreen";
import RiderScreen from "./components/RiderScreen";
import "./styles.css";

type Persona = "retailer" | "dispatcher" | "rider";

const TABS: { id: Persona; label: string }[] = [
    { id: "retailer", label: "Retailer" },
    { id: "dispatcher", label: "Dispatcher" },
    { id: "rider", label: "Rider" },
];

export default function App() {
    const [persona, setPersona] = useState<Persona>("retailer");

    return (
        <div className="app">
            <div className="app-header">
                <h1>Reflex</h1>
                <p>Delivery tracking, without the WhatsApp guesswork</p>
            </div>

            <div className="tabs" role="tablist">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={persona === tab.id}
                        className="tab"
                        onClick={() => setPersona(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {persona === "retailer" && <RetailerScreen />}
            {persona === "dispatcher" && <DispatcherScreen />}
            {persona === "rider" && <RiderScreen />}
        </div>
    );
}
