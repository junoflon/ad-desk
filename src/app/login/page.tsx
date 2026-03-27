"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error);
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(mode === "register" ? "가입 후 로그인에 실패했습니다." : "이메일 또는 비밀번호가 올바르지 않습니다.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-text-primary text-center mb-1">
          Ad Desk
        </h1>
        <p className="text-text-muted text-sm text-center mb-8">
          {mode === "login" ? "로그인하여 시작하세요" : "새 계정을 만드세요"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-primary/50"
            />
          )}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-primary/50"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-primary/50"
          />

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        <p className="text-text-muted text-sm text-center mt-6">
          {mode === "login" ? (
            <>
              계정이 없으신가요?{" "}
              <button
                onClick={() => { setMode("register"); setError(""); }}
                className="text-primary hover:text-primary-light"
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{" "}
              <button
                onClick={() => { setMode("login"); setError(""); }}
                className="text-primary hover:text-primary-light"
              >
                로그인
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
