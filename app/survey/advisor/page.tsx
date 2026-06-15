"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { CheckCircle, Star } from "lucide-react";
import { ADVISOR_SURVEY_QUESTIONS } from "@/lib/survey-questions";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "0.25rem" }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0.2rem" }}>
          <Star size={28}
            fill={(hover || value) >= n ? "#f59e0b" : "none"}
            color={(hover || value) >= n ? "#f59e0b" : "var(--border)"}
            strokeWidth={1.5}
          />
        </button>
      ))}
      {value > 0 && (
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", alignSelf: "center", marginLeft: 6 }}>
          {["", "전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"][value]}
        </span>
      )}
    </div>
  );
}

export default function AdvisorSurveyPage() {
  const router = useRouter();
  const supabase = createClient();
  const [activeSurvey, setActiveSurvey] = useState<{ id: string; title: string; period: string } | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: survey } = await supabase
        .from("surveys").select("id,title,period").eq("is_active", true).eq("target", "advisor").single();

      if (!survey) { setLoading(false); return; }
      setActiveSurvey(survey);

      const { data: existing } = await supabase
        .from("survey_responses")
        .select("id").eq("survey_id", survey.id).eq("user_id", user.id).single();
      if (existing) setAlreadySubmitted(true);
      setLoading(false);
    };
    init();
  }, []);

  const setAnswer = (id: string, val: number | string) =>
    setAnswers(prev => ({ ...prev, [id]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = ADVISOR_SURVEY_QUESTIONS.filter(q => q.required && !answers[q.id]);
    if (missing.length > 0) { setError("필수 항목을 모두 응답해주세요."); return; }

    setSubmitting(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    const { error: err } = await supabase.from("survey_responses").insert({
      survey_id: activeSurvey!.id,
      user_id: user!.id,
      user_email: user!.email,
      answers,
    });
    setSubmitting(false);
    if (err) { setError("제출 중 오류가 발생했습니다."); return; }
    setSubmitted(true);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <p style={{ color: "var(--text-muted)" }}>로딩 중...</p>
    </div>
  );

  if (!activeSurvey) return (
    <div style={{ maxWidth: 560, margin: "6rem auto", padding: "0 1.5rem", textAlign: "center" }}>
      <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--navy)" }}>현재 진행 중인 자문위원 만족도 조사가 없습니다</p>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 8, lineHeight: 1.7 }}>
        조사가 시작되면 별도로 안내 드리겠습니다.
      </p>
    </div>
  );

  if (alreadySubmitted) return (
    <div style={{ maxWidth: 560, margin: "6rem auto", padding: "0 1.5rem", textAlign: "center" }}>
      <CheckCircle size={40} color="var(--teal)" style={{ margin: "0 auto 1rem" }} />
      <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--navy)" }}>이미 응답하셨습니다</p>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 8 }}>
        [{activeSurvey.period}] 자문위원 만족도 조사에 응답해 주셔서 감사합니다.
      </p>
    </div>
  );

  if (submitted) return (
    <div style={{ maxWidth: 560, margin: "6rem auto", padding: "0 1.5rem", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--teal-pale)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
        <CheckCircle size={26} color="var(--teal)" />
      </div>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", color: "var(--navy)" }}>응답해 주셔서 감사합니다</h1>
      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.7 }}>
        소중한 의견은 자문 체계 개선에 적극 반영하겠습니다.
      </p>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <p className="section-label">자문위원 만족도 조사</p>
      <h1 className="section-title">{activeSurvey.title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "0.6rem", marginBottom: "2rem" }}>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.72rem", color: "var(--teal)", background: "var(--teal-pale)", padding: "3px 10px", borderRadius: 4 }}>
          {activeSurvey.period}
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>· 소요 시간 약 3분</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {ADVISOR_SURVEY_QUESTIONS.map((q, idx) => (
          <div key={q.id} className="form-section" style={{ padding: "1.5rem" }}>
            <label className="form-label" style={{ marginBottom: "0.75rem", display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.68rem", color: "var(--teal)" }}>
                Q{String(idx + 1).padStart(2, "0")}
              </span>
              {q.label}
              {q.required && <span style={{ color: "#dc2626", fontWeight: 400 }}>*</span>}
            </label>
            {q.type === "rating5" ? (
              <StarRating
                value={(answers[q.id] as number) || 0}
                onChange={v => setAnswer(q.id, v)}
              />
            ) : (
              <textarea
                className="form-textarea" rows={3}
                value={(answers[q.id] as string) || ""}
                onChange={e => setAnswer(q.id, e.target.value)}
                placeholder="자유롭게 작성해주세요"
              />
            )}
          </div>
        ))}

        {error && (
          <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, fontSize: "0.82rem", color: "#dc2626" }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={submitting} style={{ justifyContent: "center" }}>
          {submitting ? "제출 중..." : "만족도 조사 제출"}
        </button>
      </form>
    </div>
  );
}
