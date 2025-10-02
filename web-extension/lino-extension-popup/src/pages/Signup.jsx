import { useState } from "react";
import { useSignup } from "../hooks/useSignup.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [formData, setFormData] = useState(null);
    const { response, loading, error } = useSignup(formData);

    const handleSignUp = (e) => {
        e.preventDefault();
        setFormData({ username, email, password });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted/30">
            <Card className="w-[380px] shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Create an Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing up..." : "Sign Up"}
                        </Button>
                    </form>

                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {response && (
                        <Alert className="mt-4">
                            <AlertDescription>
                                {response.message || "Signup successful!"}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground text-center">
                    Already have an account? <span className="ml-1 text-primary">Login</span>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Signup;