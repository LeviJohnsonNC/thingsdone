import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="w-full border-border shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-semibold">Things Done.</CardTitle>
            <CardDescription>
              {isSignUp ? "Create your account" : "Sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              {message && <p className="text-sm text-success-green">{message}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </form>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage(""); }}
              className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
