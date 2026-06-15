"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Send, CheckCircle, AlertCircle, Wrench, Lightbulb, MessageSquare } from "lucide-react";

const CATEGORIES = [
  { value: "system_error",     label: "시스템 오류",     icon: AlertCircle,    color: "#dc2626" },
  { value: "inconvenience",    label: "사용 불편",       icon: Wrench,         color: "#d97706" },
  { value: "feature_request",  label: "기능 추가 요청",  icon: Lightbulb,      color: "#2563eb" },
  { value: "other",            label: "기타 의견",       icon: MessageSquare,  color: "var(--teal)" },
];

export default function FeedbackPage() {
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) { setError("카테고리를 선택해주세요."); return; }
    if (content.trim().length < 10) { setError("내용을 10자 이상 입력해주세요."); return; }
    setLoading(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    const { error: err } = await supabase.from("feedback").insert({
      category, content: content.trim(),
      email: email.trim() || null,
      user_id: user?.id || null,
    });
    setLoading(false);
    if (err) { setError("제출 중 오류가 발생했습니다. 다시 시도해주세요."); return; }
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ maxWidth: 560, margin: "6rem auto", padding: "0 1.5rem", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--teal-pale)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
        <CheckCircle size={26} color="var(--teal)" />
      </div>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", color: "var(--navy)" }}>소중한 의견 감사합니다</h1>
      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.7 }}>
        접수된 피드백은 담당자가 검토 후 시스템 개선에 반영합니다.
        {email && <><br />입력하신 이메일로 처리 결과를 안내해드릴 수 있습니다.</>}
      </p>
      <button onClick={() => { setSubmitted(false); setCategory(""); setContent(""); setEmail(""); }}
        className="btn-outline" style={{ marginTop: "1.5rem" }}>
        추가 피드백 제출
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <p className="section-label">의견 제출</p>
      <h1 className="section-title">피드백 제출</h1>
      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.6rem", lineHeight: 1.7, maxWidth: 480 }}>
        전산시스템 이용 중 불편하신 점이나 개선 아이디어를 알려주세요.
        로그인 없이도 제출할 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
        {/* Category */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label className="form-label">유형 선택 <span style={{ color: "#dc2626" }}>*</span></label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", marginTop: "0.5rem" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.value} type="button"
                onClick={() => { setCategory(cat.value); setError(""); }}
                style={{
                  padding: "0.85rem 0.75rem", borderRadius: 8, border: `1.5px solid ${category === cat.value ? cat.color : "var(--border)"}`,
                  background: category === cat.value ? `${cat.color}10` : "var(--white)",
                  cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                }}>
                <cat.icon size={18} color={category === cat.value ? cat.color : "var(--text-muted)"} style={{ margin: "0 auto 0.4rem" }} />
                <p style={{ fontSize: "0.82rem", fontWeight: category === cat.value ? 600 : 400, color: category === cat.value ? cat.color : "var(--text-secondary)" }}>
                  {cat.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label className="form-label">
            내용 <span style={{ color: "#dc2626" }}>*</span>
            <span style={{ float: "right", fontWeight: 400, color: "var(--text-muted)", fontSize: "0.75rem" }}>{content.length} / 500</span>
          </label>
          <textarea
            className="form-textarea" rows={6}
            maxLength={500}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="불편하신 점, 오류 내용, 개선 아이디어 등을 구체적으로 작성해주세요. 스크린샷이나 재현 방법이 있으면 함께 기술해 주시면 더 빠른 처리가 가능합니다."
          />
        </div>

        {/* Email (optional) */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label className="form-label">
            이메일 <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "0.78rem" }}>(선택 — 처리 결과 안내 희망 시)</span>
          </label>
          <input
            type="email" className="form-input"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="example@hospital.ac.kr"
          />
        </div>

        {error && (
          <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, fontSize: "0.82rem", color: "#dc2626" }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
          <Send size={15} /> {loading ? "제출 중..." : "피드백 제출"}
        </button>

        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1rem", textAlign: "center", lineHeight: 1.6 }}>
          이메일을 입력하지 않으면 익명으로 처리됩니다.
        </p>
      </form>
    </div>
  );
}
