"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { stripePromise } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Monitor,
  Shield,
  Zap,
  Upload,
  Lock,
  Globe,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function HomePage() {
  // Tab state for auth form
  const [activeTab, setActiveTab] = useState("login");
  
  // Track selected plan for post-registration redirect
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business' | null>(null);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
    general: ""
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Registration form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [registerErrors, setRegisterErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: ""
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) {
      score += 25;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[a-z]/.test(password)) {
      score += 25;
    } else {
      feedback.push("Lowercase letter");
    }

    if (/[A-Z]/.test(password)) {
      score += 25;
    } else {
      feedback.push("Uppercase letter");
    }

    if (/[0-9]/.test(password)) {
      score += 25;
    } else {
      feedback.push("Number");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 25;
    } else {
      feedback.push("Special character");
    }

    let strength = "Very Weak";
    let color = "bg-red-500";

    if (score >= 100) {
      strength = "Very Strong";
      color = "bg-green-500";
    } else if (score >= 75) {
      strength = "Strong";
      color = "bg-green-400";
    } else if (score >= 50) {
      strength = "Medium";
      color = "bg-yellow-500";
    } else if (score >= 25) {
      strength = "Weak";
      color = "bg-orange-500";
    }

    return { score: Math.min(score, 100), strength, color, feedback };
  };

  const passwordStrength = calculatePasswordStrength(registerData.password);

  // Get session data
  const { data: session, status } = useSession();

  // Handle "Get Started Free" button click
  const handleGetStartedFree = () => {
    setActiveTab("register");
    // Scroll to the auth form
    const authForm = document.getElementById("auth-form");
    if (authForm) {
      authForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle paid plan purchase
  const handlePurchasePlan = async (planType: 'pro' | 'business') => {
    try {
      // Check if user is authenticated
      if (!session) {
        // Store the selected plan for post-registration redirect
        setSelectedPlan(planType);
        // If not authenticated, scroll to register form and switch to register tab
        setActiveTab("register");
        const authForm = document.getElementById("auth-form");
        if (authForm) {
          authForm.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      // Create Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process');
    }
  };

  // Social login handlers
  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleMicrosoftLogin = () => {
    // Microsoft login would be implemented here with OAuth 2.0
    alert("Microsoft login would be implemented here with OAuth 2.0");
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginErrors({ email: "", password: "", general: "" });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setLoginErrors({ ...loginErrors, general: data.error || 'Login failed' });
      }
    } catch (error) {
      setLoginErrors({ ...loginErrors, general: 'Network error. Please try again.' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegisterErrors({ name: "", email: "", password: "", confirmPassword: "", general: "" });

    // Basic validation
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterErrors({ ...registerErrors, confirmPassword: "Passwords do not match" });
      setIsRegistering(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful, now login
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: registerData.email,
            password: registerData.password,
          }),
        });

        if (loginResponse.ok) {
          // Check if user selected a paid plan before registration
          if (selectedPlan) {
            // Redirect to Stripe checkout for the selected plan
            try {
              const checkoutResponse = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ planType: selectedPlan }),
              });

              const checkoutData = await checkoutResponse.json();

              if (checkoutResponse.ok && checkoutData.url) {
                // Clear selected plan and redirect to Stripe
                setSelectedPlan(null);
                window.location.href = checkoutData.url;
                return;
              } else {
                console.error('Checkout error:', checkoutData.error);
                // Fall back to dashboard if checkout fails
                window.location.href = '/dashboard';
              }
            } catch (error) {
              console.error('Checkout error:', error);
              // Fall back to dashboard if checkout fails
              window.location.href = '/dashboard';
            }
          } else {
            // No plan selected, go to dashboard
            window.location.href = '/dashboard';
          }
        } else {
          setRegisterErrors({ ...registerErrors, general: 'Registration successful, but login failed. Please try logging in.' });
        }
      } else {
        setRegisterErrors({ ...registerErrors, general: data.error || 'Registration failed' });
      }
    } catch (error) {
      setRegisterErrors({ ...registerErrors, general: 'Network error. Please try again.' });
    } finally {
      setIsRegistering(false);
    }
  };

  const benefits = [
    {
      icon: Monitor,
      title: "Works with Any Smart TV",
      description: "No hardware needed - just open a browser"
    },
    {
      icon: Zap,
      title: "Instant Display",
      description: "Upload and display in seconds"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Unique screen codes for each session"
    },
    {
      icon: Upload,
      title: "Multiple Formats",
      description: "PDF, PowerPoint, images, and more"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white font-bold text-2xl w-10 h-10 rounded-lg flex items-center justify-center">
                Z
              </div>
              <span className="text-xl font-semibold text-gray-900">creens</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/features">
                <Button variant="ghost">Features</Button>
              </Link>
              <Link href="/support">
                <Button variant="ghost">Support</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Instant Slideshows on Any Smart TV
          </h1>
          <p className="text-xl text-gray-600 mb-2">No Equipment Needed</p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Sign in or register to start sharing your presentations to any screen in seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Authentication Form */}
          <Card className="h-fit" id="auth-form">
            <CardHeader>
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  {/* Social Login Buttons */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleLogin}
                      disabled={isLoggingIn}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleMicrosoftLogin}
                      disabled={isLoggingIn}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#F25022" d="M1 1h10v10H1z"/>
                        <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                        <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                        <path fill="#FFB900" d="M13 13h10v10H13z"/>
                      </svg>
                      Continue with Microsoft
                    </Button>
                  </div>

                  {/* OAuth Setup Notice */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-amber-700">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Google OAuth Setup Required</span>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      To enable Google login, configure OAuth credentials in Google Cloud Console. 
                      See <code className="bg-amber-100 px-1 rounded">GOOGLE_OAUTH_SETUP.md</code> for instructions.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="Enter your email"
                        required
                        disabled={isLoggingIn}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                        disabled={isLoggingIn}
                      />
                    </div>
                    
                    {loginErrors.general && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-600">
                          {loginErrors.general}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>

                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  {/* Social Login Buttons */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleLogin}
                      disabled={isRegistering}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleMicrosoftLogin}
                      disabled={isRegistering}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#F25022" d="M1 1h10v10H1z"/>
                        <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                        <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                        <path fill="#FFB900" d="M13 13h10v10H13z"/>
                      </svg>
                      Continue with Microsoft
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">Or register with email</span>
                    </div>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                        disabled={isRegistering}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        placeholder="Enter your email"
                        required
                        disabled={isRegistering}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          placeholder="Create a password"
                          required
                          disabled={isRegistering}
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isRegistering}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {registerData.password && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Password strength:</span>
                            <span className={`text-sm font-medium ${
                              passwordStrength.strength === "Very Strong" ? "text-green-600" :
                              passwordStrength.strength === "Strong" ? "text-green-500" :
                              passwordStrength.strength === "Medium" ? "text-yellow-600" :
                              passwordStrength.strength === "Weak" ? "text-orange-600" :
                              "text-red-600"
                            }`}>
                              {passwordStrength.strength}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength.strength === "Very Strong" ? "bg-green-500" :
                                passwordStrength.strength === "Strong" ? "bg-green-400" :
                                passwordStrength.strength === "Medium" ? "bg-yellow-500" :
                                passwordStrength.strength === "Weak" ? "bg-orange-500" :
                                "bg-red-500"
                              }`}
                              style={{ width: `${passwordStrength.score}%` }}
                            />
                          </div>
                          {passwordStrength.feedback.length > 0 && (
                            <div className="text-xs text-gray-500">
                              Missing: {passwordStrength.feedback.join(", ")}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        placeholder="Confirm your password"
                        required
                        disabled={isRegistering}
                        minLength={6}
                      />
                    </div>
                    
                    {registerErrors.general && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-600">
                          {registerErrors.general}
                        </AlertDescription>
                      </Alert>
                    )}

                    {registerErrors.confirmPassword && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-600">
                          {registerErrors.confirmPassword}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isRegistering}
                    >
                      {isRegistering ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">Why Choose zcreens?</h3>
            <div className="grid gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <benefit.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <Card className="p-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Lock className="w-4 h-4" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </Card>

            {/* Database Status */}
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">MongoDB Database Connected</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                User authentication and file storage ready
              </p>
            </Card>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include secure file storage and instant screen sharing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl font-bold text-gray-900">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">Free</span>
                </div>
                <CardDescription className="mt-2">Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">100MB storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">1 screen connection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Basic file formats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Email support</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={handleGetStartedFree}>
                  Get Started Free
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-blue-500 shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl font-bold text-gray-900">Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">$9</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="mt-2">For professionals and teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">1GB storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Up to 10 screens</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">All file formats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Offline downloads</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handlePurchasePlan('pro')}>
                  Subscribe Now
                </Button>
              </CardFooter>
            </Card>

            {/* Business Plan */}
            <Card className="relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl font-bold text-gray-900">Business</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="mt-2">For large teams and enterprises</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">5GB storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Unlimited screens</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Team management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Analytics & reporting</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">24/7 phone support</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => handlePurchasePlan('business')}>
                  Start Business Plan
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              All plans include 30-day money-back guarantee • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 text-white font-bold text-lg w-8 h-8 rounded flex items-center justify-center">
                  Z
                </div>
                <span className="font-semibold">creens</span>
              </div>
              <p className="text-gray-400 text-sm">
                Display presentations on any screen, instantly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features"><Button variant="link" className="p-0 h-auto text-gray-400">Features</Button></Link></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Pricing</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">API</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help"><Button variant="link" className="p-0 h-auto text-gray-400">Help Center</Button></Link></li>
                <li><Link href="/support"><Button variant="link" className="p-0 h-auto text-gray-400">Contact Us</Button></Link></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Status</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Privacy Policy</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Terms of Service</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">Security</Button></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2024 zcreens. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
