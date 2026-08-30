
import { FormEvent, useState } from "react";
import { registerUser } from "../api";

type Role = "retailer" | "dispatcher" | "rider";

interface RegisterProps {
    onLogin: () => void;
}

export default function Register({ onLogin }: RegisterProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role>("retailer");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await registerUser({
                firstName,
                lastName,
                email,
                phone,
                password,
                role,
            });

            setSuccess(
                "Account created successfully. You can now sign in."
            );

            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setPassword("");
            setRole("retailer");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-screen">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="eyebrow">REFLEX</span>

                    <h1>Create your account</h1>

                    <p>
                        Set up your account to access the delivery
                        workspace.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="auth-form-row">
                        <div className="form-group">
                            <label htmlFor="first-name">
                                First name
                            </label>

                            <input
                                id="first-name"
                                type="text"
                                value={firstName}
                                onChange={(e) =>
                                    setFirstName(e.target.value)
                                }
                                placeholder="e.g. Keith"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last-name">
                                Last name
                            </label>

                            <input
                                id="last-name"
                                type="text"
                                value={lastName}
                                onChange={(e) =>
                                    setLastName(e.target.value)
                                }
                                placeholder="e.g. Lalai"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-email">
                            Email
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-phone">
                            Phone number
                        </label>

                        <input
                            id="register-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                            placeholder="07XX XXX XXX"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-password">
                            Password
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Create a password"
                            minLength={6}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">
                            Account type
                        </label>

                        <select
                            id="role"
                            value={role}
                            onChange={(e) =>
                                setRole(
                                    e.target.value as Role
                                )
                            }
                        >
                            <option value="retailer">
                                Retailer
                            </option>

                            <option value="dispatcher">
                                Dispatcher
                            </option>

                            <option value="rider">
                                Rider
                            </option>
                        </select>
                    </div>

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="auth-success">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create account"}
                    </button>
                </form>

                <div className="auth-switch">
                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={onLogin}
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </section>
    );
}

