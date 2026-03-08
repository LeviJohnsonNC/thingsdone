import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import authBg from "@/assets/auth-bg.png";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error: authError } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (authError) {
      setError(authError.message);
    } else if (isSignUp) {
      setMessage("Check your email for a confirmation link.");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Background image */}
      <img
        src={authBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" />

      {/* Auth card */}
      <Card className="relative z-10 w-full max-w-md border-border/50 bg-card/95 shadow-2xl shadow-black/10 backdrop-blur-md">
        <CardContent className="p-8">
          {/* Back to home link - subtle, inside card */}
          <Link
            to="/"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Home
          </Link>

          {/* Brand wordmark - small, secondary */}
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Things Done.
          </p>

          {/* Primary heading - functional */}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {isSignUp ? "Create your account" : "Sign in"}
          </h1>

          {/* Form with proper labels */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-background/50 transition-shadow focus-visible:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 bg-background/50 transition-shadow focus-visible:ring-primary/50"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            {message && (
              <p className="text-sm text-success-green">{message}</p>
            )}

            <Button
              type="submit"
              className="h-11 w-full text-base font-medium"
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </Button>
          </form>

          {/* Alternate auth path */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setMessage("");
              }}
              className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>

          {/* Trust signal */}
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/70">
            <Lock className="h-3 w-3" />
            Your data stays private
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
