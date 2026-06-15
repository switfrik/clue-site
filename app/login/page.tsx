"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError("이메일 발송에 실패했습니다. 다시 시도해주세요.");
    else setSent(true);
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem 1.5rem" }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div className="card" style={{ padding:"2.5rem" }}>
          {sent ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"var(--teal-pale)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.25rem" }}>
                <CheckCircle size={24} color="var(--teal)" />
              </div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", color:"var(--navy)", marginBottom:"0.75rem" }}>메일을 확인해주세요</h1>
              <p style={{ fontSize:"0.88rem", color:"var(--text-secondary)", lineHeight:1.7 }}>
                <strong>{email}</strong>으로<br/>로그인 링크를 발송했습니다.<br/>
                링크를 클릭하면 자동으로 로그인됩니다.
              </p>
              <p style={{ fontSize:"0.78rem", color:"var(--text-muted)", marginTop:"1.25rem", lineHeight:1.6 }}>
                메일이 오지 않으면 스팸함을 확인하거나<br/>
                <button onClick={() => setSent(false)} style={{ background:"none", border:"none", color:"var(--teal)", cursor:"pointer", fontSize:"0.78rem", textDecoration:"underline" }}>다시 시도</button>하세요.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom:"2rem" }}>
                <p className="section-label">로그인</p>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", color:"var(--navy)", marginTop:"0.5rem" }}>설계서 작성 시작</h1>
                <p style={{ fontSize:"0.85rem", color:"var(--text-secondary)", marginTop:"0.6rem", lineHeight:1.6 }}>
                  이메일 주소를 입력하면 로그인 링크를 보내드립니다.<br/>비밀번호가 필요 없습니다.
                </p>
              </div>
              <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <div>
                  <label className="form-label">이메일 주소</label>
                  <div style={{ position:"relative" }}>
                    <Mail size={15} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)" }} />
                    <input
                      type="email" required
                      value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="example@hospital.ac.kr"
                      className="form-input" style={{ paddingLeft:"2.1rem" }}
                    />
                  </div>
                </div>
                {error && <p style={{ fontSize:"0.8rem", color:"#dc2626" }}>{error}</p>}
                <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent:"center" }}>
                  {loading ? "발송 중..." : <><span>로그인 링크 받기</span><ArrowRight size={15} /></>}
                </button>
              </form>
              <p style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginTop:"1.5rem", lineHeight:1.6, textAlign:"center" }}>
                로그인 시 설계서 작성·저장·조회가 가능합니다.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
