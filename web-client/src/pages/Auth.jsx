import React, {useState} from 'react';
import {Lock, Mail, User, Clock} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {useApi} from '@/hooks/index.js';
import {toast} from 'sonner';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const api = useApi();

    // Login form state
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    // Register form state
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Handle login
    const handleLogin = async () => {
        setLoading(true);

        try {
            const {data, success, message} = await api.post('/auth/login', {
                email: loginData.email,
                password: loginData.password,
            });

            if (success) {
                localStorage.setItem('user', data?.name);
                toast.success(message || 'Login successful!');
                window.location.href = '/';
                // Handle successful login (e.g., redirect, store token)
            }
        } catch (err) {
            toast.error(err?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle registration
    const handleRegister = async () => {
        // Validate passwords match
        if (registerData.password !== registerData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        setLoading(true);

        try {
            const {data, success, message} = await api.post('/auth/signup', {
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
            });

            if (success) {
                toast.success(message || 'Account created successfully!');
                // Optionally switch to login or auto-login
                setIsLogin(true);
                setRegisterData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
            }
        } catch (err) {
            toast.error(
                err?.message || 'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e, handler) => {
        if (e.key === 'Enter') {
            handler();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
            </div>

            <Card className="w-full max-w-md relative vintage-shadow border-border">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-primary/10 vintage-glow">
                            <Clock className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-serif tracking-wide">
                        LiNo
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {isLogin
                            ? 'Welcome back to your notes'
                            : 'Begin your journey'}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isLogin ? (
                        // Login Form
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="login-email"
                                    className="text-foreground"
                                >
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="pl-10 bg-muted/50 border-border focus:border-primary"
                                        value={loginData.email}
                                        onChange={(e) =>
                                            setLoginData({
                                                ...loginData,
                                                email: e.target.value,
                                            })
                                        }
                                        onKeyPress={(e) =>
                                            handleKeyPress(e, handleLogin)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="login-password"
                                    className="text-foreground"
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 bg-muted/50 border-border focus:border-primary"
                                        value={loginData.password}
                                        onChange={(e) =>
                                            setLoginData({
                                                ...loginData,
                                                password: e.target.value,
                                            })
                                        }
                                        onKeyPress={(e) =>
                                            handleKeyPress(e, handleLogin)
                                        }
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleLogin}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </div>
                    ) : (
                        // Register Form
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="register-name"
                                    className="text-foreground"
                                >
                                    Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="register-name"
                                        type="text"
                                        placeholder="Your name"
                                        className="pl-10 bg-muted/50 border-border focus:border-primary"
                                        value={registerData.name}
                                        onChange={(e) =>
                                            setRegisterData({
                                                ...registerData,
                                                name: e.target.value,
                                            })
                                        }
                                        onKeyPress={(e) =>
                                            handleKeyPress(e, handleRegister)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="register-email"
                                    className="text-foreground"
                                >
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="register-email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="pl-10 bg-muted/50 border-border focus:border-primary"
                                        value={registerData.email}
                                        onChange={(e) =>
                                            setRegisterData({
                                                ...registerData,
                                                email: e.target.value,
                                            })
                                        }
                                        onKeyPress={(e) =>
                                            handleKeyPress(e, handleRegister)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="register-password"
                                    className="text-foreground"
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="register-password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 bg-muted/50 border-border focus:border-primary"
                                        value={registerData.password}
                                        onChange={(e) =>
                                            setRegisterData({
                                                ...registerData,
                                                password: e.target.value,
                                            })
                                        }
                                        onKeyPress={(e) =>
                                            handleKeyPress(e, handleRegister)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="register-confirm"
                                    className="text-foreground"
                                >
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="register-confirm"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 bg-muted/50 border-border focus:border-primary"
                                        value={registerData.confirmPassword}
                                        onChange={(e) =>
                                            setRegisterData({
                                                ...registerData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        onKeyPress={(e) =>
                                            handleKeyPress(e, handleRegister)
                                        }
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleRegister}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                                disabled={loading}
                            >
                                {loading
                                    ? 'Creating account...'
                                    : 'Create Account'}
                            </Button>
                        </div>
                    )}

                    {/* Toggle between login and register */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {isLogin
                                ? "Don't have an account?"
                                : 'Already have an account?'}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}