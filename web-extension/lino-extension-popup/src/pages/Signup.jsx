import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, User, Lock, CheckCircle2, AlertCircle, ArrowLeft, Github } from 'lucide-react';

const SignupPage = ({ onNavigate }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });

    // Helper function to set cookie
    const setCookie = (name, value, days = 7) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const checkPasswordStrength = (password) => {
        let score = 0;
        const feedback = [];

        if (password.length >= 8) score++;
        else feedback.push('8+ characters');

        if (/[A-Z]/.test(password)) score++;
        else feedback.push('uppercase letter');

        if (/[a-z]/.test(password)) score++;
        else feedback.push('lowercase letter');

        if (/\d/.test(password)) score++;
        else feedback.push('number');

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        else feedback.push('special character');

        return { score, feedback };
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email || !validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (passwordStrength.score < 3) {
            newErrors.password = 'Password is too weak';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!acceptTerms) {
            newErrors.terms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setSuccess('');

        if (validateForm()) {
            setIsLoading(true);

            // Simulate API call
            setTimeout(() => {
                setCookie('xyz', 'authenticated_user_token');
                setSuccess('Account created successfully! Redirecting...');
                setIsLoading(false);

                setTimeout(() => {
                    onNavigate && onNavigate('home');
                }, 2000);
            }, 1500);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength.score <= 2) return 'destructive';
        if (passwordStrength.score === 3) return 'default';
        if (passwordStrength.score === 4) return 'secondary';
        return 'default';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength.score <= 2) return 'Weak';
        if (passwordStrength.score === 3) return 'Good';
        if (passwordStrength.score === 4) return 'Strong';
        return 'Very Strong';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
            {/* Navigation */}
            <nav className="border-b bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1
                                className="text-2xl font-bold text-blue-600 cursor-pointer"
                                onClick={() => onNavigate && onNavigate('home')}
                            >
                                LiNo
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => onNavigate && onNavigate('home')}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Home
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onNavigate && onNavigate('login')}
                            >
                                Sign In
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                        <CardDescription className="text-center">
                            Enter your details below to create your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {success && (
                            <Alert>
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" onClick={() => alert('GitHub OAuth integration')}>
                                <Github className="mr-2 h-4 w-4" />
                                GitHub
                            </Button>
                            <Button variant="outline" onClick={() => alert('Google OAuth integration')}>
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Username Field */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`pl-10 ${errors.username ? 'border-destructive' : ''}`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>

                            {/* Password Strength */}
                            {formData.password && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Password strength:</span>
                                        <Badge variant={getPasswordStrengthColor()} className="text-xs">
                                            {getPasswordStrengthText()}
                                        </Badge>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                passwordStrength.score <= 2 ? 'bg-destructive' :
                                                    passwordStrength.score === 3 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                        />
                                    </div>
                                    {passwordStrength.feedback.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Missing: {passwordStrength.feedback.join(', ')}
                                        </p>
                                    )}
                                </div>
                            )}

                            {errors.password && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                checked={acceptTerms}
                                onCheckedChange={setAcceptTerms}
                            />
                            <Label
                                htmlFor="terms"
                                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I accept the{' '}
                                <Button variant="link" className="p-0 h-auto text-sm">
                                    Terms of Service
                                </Button>{' '}
                                and{' '}
                                <Button variant="link" className="p-0 h-auto text-sm">
                                    Privacy Policy
                                </Button>
                            </Label>
                        </div>
                        {errors.terms && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.terms}
                            </p>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            onClick={handleSignup}
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Button
                                variant="link"
                                className="p-0"
                                onClick={() => onNavigate && onNavigate('login')}
                            >
                                Sign in
                            </Button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SignupPage;