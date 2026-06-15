"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Stethoscope, Users, ArrowRight, CheckCircle } from "lucide-react";

export default function SurveyEntryPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<Record<string, { active: boolean; title?: string; period?: string; submitted?: boolean }>>({
    advisor: { active: false },
    team: { active: false },
  });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const result: typeof statuses = { advisor: { active: false }, team: { active: false } };

      for (const target of ["advisor", "team"] as const) {
        const { data: survey } = await supabase
          .from("surveys").select("id,title,period").eq("is_active", true).eq("target", target).single();
        if (survey) {
          const { data: existing } = await supabase
            .from("survey_responses").select("id").eq("survey_id", survey.id).eq("user_id", user.id).single();
          result[target] = { active: true, title: survey.title, period: survey.period, submitted: !!existing };
        }
      }
      setStatuses(result);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <p style={{ color: "var(--text-muted)" }}>로딩 중...</p>
    </div>
  );

  const cards = [
    {
      key: "advisor", href: "/survey/advisor",
      icon: Stethoscope, label: "자문위원 대상 설문",
      desc: "Stage 2 작성·인증 경험, 매칭 적절성, 전산시스템 사용성에 대한 의견을 수집합니다.",
    },
    {
      key: "team", href: "/survey/team",
      icon: Users, label: "과제팀 대상 설문",
      desc: "자문 수행 경험, Stage 3·4 연계 도움 정도, 전산시스템 사용성에 대한 의견을 수집합니다.",
    },
  ];

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <p className="section-label">만족도 조사</p>
      <h1 className="section-title">정기 만족도 조사</h1>
      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.6rem", lineHeight: 1.7, maxWidth: 560 }}>
        해당하시는 역할의 설문에 참여해 주세요. 진행 중인 조사가 없으면 안내 문구가 표시됩니다.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
        {cards.map(card => {
          const status = statuses[card.key];
          return (
            <div key={card.key} className="card" style={{ padding: "1.75rem" }}>
              <card.icon size={24} color="var(--teal)" strokeWidth={1.5} />
              <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--navy)", margin: "0.75rem 0 0.4rem" }}>{card.label}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "1.25rem" }}>{card.desc}</p>

              {!status.active ? (
                <div style={{ padding: "0.6rem 0.9rem", background: "var(--sand)", borderRadius: 6, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  현재 진행 중인 조사가 없습니다
                </div>
              ) : status.submitted ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.6rem 0.9rem", background: "var(--teal-pale)", borderRadius: 6, fontSize: "0.8rem", color: "var(--teal)" }}>
                  <CheckCircle size={15} /> [{status.period}] 응답 완료
                </div>
              ) : (
                <a href={card.href} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  [{status.period}] 설문 참여 <ArrowRight size={14} />
                </a>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "2.5rem", padding: "1rem 1.5rem", background: "var(--sand)", borderRadius: 8, border: "1px solid var(--border)" }}>
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          자문 1건이 종료된 직후의 평가는 <a href="/survey/rating" style={{ color: "var(--teal)" }}>자문 직후 평가</a> 페이지를 이용해 주세요.
          이 페이지의 정기 조사는 사업 기간 중 별도로 안내되는 시점에 진행됩니다.
        </p>
      </div>
    </div>
  );
}
