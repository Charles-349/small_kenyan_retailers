
import { FormEvent, useState } from "react";
import { loginUser } from "../api";

interface LoginProps {
    onRegister: () => void;
}

export default function Login({ onRegister }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await loginUser(email, password);

            console.log("Login successful:", result.user);

            // App.tsx will detect the saved token
            // and load the authenticated user.
            window.location.reload();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Login failed"
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

                    <h1>Welcome back</h1>

                    <p>
                        Sign in to continue to your delivery
                        dashboard.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>
                </form>

                <div className="auth-switch">
                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        onClick={onRegister}
                    >
                        Create one
                    </button>
                </div>
            </div>
        </section>
    );
}

