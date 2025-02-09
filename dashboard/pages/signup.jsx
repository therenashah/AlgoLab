import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signup } from "@/firebase/auth";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

    const handleSubmit = async () => {
        setError("");
        
        if (!validateEmail(email)) {
            setError("Invalid email address.");
            return;
        }
        if (!validatePassword(password)) {
            setError("Password must be 8+ characters, include 1 uppercase, 1 lowercase, and 1 number.");
            return;
        }

        setLoading(true);
        try {
            const user = await signup(email, password, username);
            router.push("/profiling");
        } catch (err) {
            setError(err?.message || "Signup failed. Try again.");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4">
                <h1 className="text-2xl font-bold text-center">Sign Up</h1>
                <p className="text-gray-500 text-center">
                    Enter your information to create an account.
                </p>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        placeholder="Lee Robinson"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                        Must be 8+ characters, include 1 uppercase, 1 lowercase, and 1 number.
                    </p>
                </div>

                <Button
                    className="w-full bg-black text-white"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Signing Up..." : "Sign Up"}
                </Button>

                <p className="text-xs text-center text-gray-500">
                    By clicking Sign Up, you agree to our{" "}
                    <Link className="underline" href="#">
                        Terms and Conditions
                    </Link>.
                </p>
            </div>
        </div>
    );
}
