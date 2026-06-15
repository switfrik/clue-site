"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Star, CheckCircle } from "lucide-react";

const ASPECTS = [
  { key: "response_time", label: "응답 속도" },
  { key: "expertise",     label: "전문성" },
  { key: "clarity",       label: "답변 명확성" },
  { key: "helpfulness",   label: "실질적 도움" },
];

function StarRating({ value, onChange, size = 32 }: { value: number; onChange: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  const labels = ["", "매우 불만족", "불만족", "보통", "만족", "매우 만족"];
  return (
    <div>
      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center" }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}>
            <Star size={size} fill={(hover || value) >= n ? "#f59e0b" : "none"}
              color={(hover || value) >= n ? "#f59e0b" : "var(--border)"} strokeWidth={1.5} />
          </button>
        ))}
      </div>
      <p style={{ textAlign:"center", fontSize:"0.8rem", color:"#f59e0b", marginTop:"0.4rem", minHeight:"1.2em", fontWeight:500 }}>
        {(hover || value) > 0 ? labels[hover || value] : ""}
      </p>
    </div>
  );
}

export default function ConsultationRatingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [projectName, setProjectName] = useState("");
  const [rating, setRating] = useState(0);
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else setUser(data.user);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("전체 만족도를 선택해주세요."); return; }
    setSubmitting(true); setError("");
    const { error: err } = await supabase.from("consultation_ratings").insert({
      user_id: user!.id, user_email: user!.email,
      project_name: projectName.trim() || null,
      rating, aspects, comment: comment.trim() || null,
    });
    setSubmitting(false);
    if (err) { setError("제출 중 오류가 발생했습니다."); return; }
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ maxWidth:480, margin:"6rem auto", padding:"0 1.5rem", textAlign:"center" }}>
      <div style={{ width:56, height:56, borderRadius:"50%", background:"var(--teal-pale)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.25rem" }}>
        <CheckCircle size={26} color="var(--teal)" />
      </div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", color:"var(--navy)" }}>평가해 주셔서 감사합니다</h1>
      <p style={{ fontSize:"0.85rem", color:"var(--text-secondary)", marginTop:8, lineHeight:1.7 }}>소중한 의견은 자문 서비스 품질 개선에 활용됩니다.</p>
    </div>
  );

  return (
    <div style={{ maxWidth:560, margin:"0 auto", padding:"3rem 1.5rem" }}>
      <p className="section-label">자문 평가</p>
      <h1 className="section-title">자문 서비스 평가</h1>
      <p style={{ fontSize:"0.88rem", color:"var(--text-secondary)", marginTop:"0.6rem", lineHeight:1.7, maxWidth:440 }}>최근 완료된 자문에 대해 평가해 주세요. 약 1분 소요됩니다.</p>
      <form onSubmit={handleSubmit} style={{ marginTop:"2rem", display:"flex", flexDirection:"column", gap:"1.5rem" }}>
        <div>
          <label className="form-label">평가할 과제명 <span style={{ fontWeight:400, color:"var(--text-muted)", fontSize:"0.78rem" }}>(선택)</span></label>
          <input className="form-input" value={projectName} onChange={e=>setProjectName(e.target.value)} placeholder="연구개발과제명 또는 IRIS 번호" />
        </div>
        <div className="form-section" style={{ padding:"1.5rem", textAlign:"center" }}>
          <p className="form-label" style={{ textAlign:"center", marginBottom:"1rem" }}>전체 만족도 <span style={{ color:"#dc2626" }}>*</span></p>
          <StarRating value={rating} onChange={setRating} size={38} />
        </div>
        <div className="form-section" style={{ padding:"1.5rem" }}>
          <p className="form-label" style={{ marginBottom:"1rem" }}>세부 평가 <span style={{ fontWeight:400, color:"var(--text-muted)", fontSize:"0.78rem" }}>(선택)</span></p>
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            {ASPECTS.map(a => (
              <div key={a.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.5rem" }}>
                <span style={{ fontSize:"0.88rem", color:"var(--text-secondary)", minWidth:100 }}>{a.label}</span>
                <div style={{ display:"flex", gap:"0.2rem" }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={()=>setAspects(p=>({...p,[a.key]:n}))}
                      style={{ background:"none", border:"none", cursor:"pointer", padding:"0.15rem" }}>
                      <Star size={20} fill={(aspects[a.key]||0)>=n?"#f59e0b":"none"}
                        color={(aspects[a.key]||0)>=n?"#f59e0b":"var(--border)"} strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="form-label">의견 <span style={{ fontWeight:400, color:"var(--text-muted)", fontSize:"0.78rem" }}>(선택)</span></label>
          <textarea className="form-textarea" rows={4} value={comment} onChange={e=>setComment(e.target.value)}
            placeholder="자문 과정에서 좋았던 점이나 개선이 필요한 점을 자유롭게 작성해주세요." />
        </div>
        {error && <div style={{ padding:"0.75rem 1rem", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:6, fontSize:"0.82rem", color:"#dc2626" }}>{error}</div>}
        <button type="submit" className="btn-primary" disabled={submitting} style={{ justifyContent:"center" }}>
          {submitting ? "제출 중..." : "평가 제출"}
        </button>
      </form>
    </div>
  );
}
