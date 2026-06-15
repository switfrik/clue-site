"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Plus, ToggleLeft, ToggleRight, Star, BarChart3, Stethoscope, Users } from "lucide-react";
import { SURVEY_TARGET_META, SurveyTarget } from "@/lib/survey-questions";

interface SurveyRow { id: string; title: string; period: string; is_active: boolean; target: string; created_at: string; }
interface RatingRow { id: string; user_email: string; project_name: string; rating: number; aspects: Record<string,number>; comment: string; created_at: string; }
type Answers = Record<string, number | string>;

export default function AdminSurveyPage() {
  const router = useRouter();
  const supabase = createClient();
  const [surveys, setSurveys] = useState<SurveyRow[]>([]);
  const [ratings, setRatings] = useState<RatingRow[]>([]);
  const [tab, setTab] = useState<"surveys"|"ratings">("surveys");
  const [newTarget, setNewTarget] = useState<SurveyTarget>("advisor");
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newPeriod, setNewPeriod] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyRow|null>(null);
  const [responses, setResponses] = useState<{user_email:string;answers:Answers;created_at:string}[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: adminCheck } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).single();
      if (!adminCheck) { router.push("/"); return; }
      const [{ data: s }, { data: r }] = await Promise.all([
        supabase.from("surveys").select("*").order("created_at", { ascending: false }),
        supabase.from("consultation_ratings").select("*").order("created_at", { ascending: false }),
      ]);
      setSurveys(s || []); setRatings(r || []); setLoading(false);
    };
    init();
  }, []);

  const createSurvey = async () => {
    if (!newTitle.trim() || !newPeriod.trim()) return;
    setCreating(true);
    const { data } = await supabase.from("surveys").insert({ title: newTitle.trim(), period: newPeriod.trim(), is_active: false, target: newTarget }).select().single();
    if (data) setSurveys(prev => [data, ...prev]);
    setNewTitle(""); setNewPeriod(""); setCreating(false);
  };

  // 같은 target 내에서만 단일 활성화 (advisor / team 독립적으로 운영 가능)
  const toggleActive = async (id: string, current: boolean, target: string) => {
    if (!current) {
      await supabase.from("surveys").update({ is_active: false }).eq("target", target);
    }
    await supabase.from("surveys").update({ is_active: !current }).eq("id", id);
    setSurveys(prev => prev.map(s => {
      if (s.id === id) return { ...s, is_active: !current };
      if (s.target === target && !current) return { ...s, is_active: false };
      return s;
    }));
  };

  const loadResponses = async (survey: SurveyRow) => {
    setSelectedSurvey(survey);
    const { data } = await supabase.from("survey_responses").select("user_email,answers,created_at").eq("survey_id", survey.id).order("created_at", { ascending: false });
    setResponses(data || []);
  };

  const avgRating = ratings.length > 0 ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1) : "-";

  // 선택된 설문 문항 메타 (라벨 매핑용)
  const questionMeta = selectedSurvey ? SURVEY_TARGET_META[selectedSurvey.target as SurveyTarget]?.questions : undefined;

  // 5점 문항 평균 계산
  const computeAverages = () => {
    if (!questionMeta || responses.length === 0) return [];
    return questionMeta.filter(q => q.type === "rating5").map(q => {
      const vals = responses.map(r => r.answers[q.id]).filter(v => typeof v === "number") as number[];
      const avg = vals.length > 0 ? (vals.reduce((a,b)=>a+b,0) / vals.length) : 0;
      return { id: q.id, label: q.label, avg, count: vals.length };
    });
  };
  const averages = computeAverages();

  if (loading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}><p style={{ color:"var(--text-muted)" }}>로딩 중...</p></div>;

  const TARGET_ICON = { advisor: Stethoscope, team: Users };
  const TARGET_COLOR = { advisor: "#2563eb", team: "var(--teal)" };

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <p className="section-label">관리자</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", color:"var(--navy)", marginTop:"0.3rem" }}>만족도 조사 관리</h1>
        </div>
        <a href="/admin/feedback" className="btn-outline" style={{ fontSize:"0.82rem", padding:"0.45rem 0.9rem" }}>피드백 관리</a>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:"2rem" }}>
        {[{k:"surveys",l:"정기 만족도 조사 (자문위원/과제팀)"},{k:"ratings",l:"자문 직후 평가"}].map(t => (
          <button key={t.k} onClick={() => setTab(t.k as "surveys"|"ratings")}
            style={{ padding:"0.75rem 1.25rem", background:"none", border:"none", cursor:"pointer", fontSize:"0.88rem",
              fontWeight:tab===t.k?600:400, color:tab===t.k?"var(--navy)":"var(--text-muted)",
              borderBottom:tab===t.k?"2px solid var(--navy)":"2px solid transparent", marginBottom:"-1px" }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Surveys tab */}
      {tab === "surveys" && (
        <div style={{ display:"grid", gridTemplateColumns: selectedSurvey ? "1fr 1fr" : "1fr", gap:"1.5rem" }}>
          <div>
            {/* Create new */}
            <div className="card" style={{ padding:"1.25rem", marginBottom:"1.25rem" }}>
              <p style={{ fontSize:"0.88rem", fontWeight:600, color:"var(--navy)", marginBottom:"0.75rem" }}>새 조사 생성</p>
              <div style={{ marginBottom:"0.6rem" }}>
                <div style={{ display:"flex", gap:"0.5rem" }}>
                  {(["advisor","team"] as const).map(t => (
                    <button key={t} type="button" onClick={() => setNewTarget(t)}
                      style={{ flex:1, padding:"0.5rem", borderRadius:6, border:`1.5px solid ${newTarget===t?TARGET_COLOR[t]:"var(--border)"}`,
                        background:newTarget===t?`${TARGET_COLOR[t]}10`:"var(--white)", cursor:"pointer",
                        fontSize:"0.8rem", fontWeight:newTarget===t?600:400, color:newTarget===t?TARGET_COLOR[t]:"var(--text-secondary)",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      {t==="advisor" ? <Stethoscope size={14}/> : <Users size={14}/>}
                      {SURVEY_TARGET_META[t].label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem", marginBottom:"0.6rem" }}>
                <input className="form-input" value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="제목 (예: 2025년 상반기 만족도)" style={{ fontSize:"0.82rem" }}/>
                <input className="form-input" value={newPeriod} onChange={e=>setNewPeriod(e.target.value)} placeholder="기간 (예: 2025년 상반기)" style={{ fontSize:"0.82rem" }}/>
              </div>
              <button onClick={createSurvey} className="btn-primary" disabled={creating||!newTitle||!newPeriod} style={{ fontSize:"0.82rem", padding:"0.5rem 1rem" }}>
                <Plus size={13}/> {creating?"생성 중...":"조사 생성"}
              </button>
            </div>

            {(["advisor","team"] as const).map(target => {
              const targetSurveys = surveys.filter(s => s.target === target);
              if (targetSurveys.length === 0) return null;
              const Icon = TARGET_ICON[target];
              return (
                <div key={target} style={{ marginBottom:"1.5rem" }}>
                  <p style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8rem", fontWeight:600, color:TARGET_COLOR[target], marginBottom:"0.6rem" }}>
                    <Icon size={14}/> {SURVEY_TARGET_META[target].label}
                  </p>
                  {targetSurveys.map(s => (
                    <div key={s.id} className="card" style={{ padding:"1.25rem", marginBottom:"0.6rem",
                      borderLeft:`3px solid ${s.is_active?TARGET_COLOR[target]:"var(--border)"}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.5rem" }}>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                            {s.is_active && <span style={{ fontSize:"0.68rem", fontWeight:500, color:TARGET_COLOR[target], background:`${TARGET_COLOR[target]}15`, padding:"2px 7px", borderRadius:4 }}>진행 중</span>}
                            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", color:"var(--text-muted)" }}>{s.period}</span>
                          </div>
                          <p style={{ fontSize:"0.9rem", fontWeight:600, color:"var(--navy)" }}>{s.title}</p>
                        </div>
                        <div style={{ display:"flex", gap:"0.4rem", flexShrink:0 }}>
                          <button onClick={() => loadResponses(s)} className="btn-outline"
                            style={{ fontSize:"0.75rem", padding:"0.35rem 0.7rem" }}>
                            <BarChart3 size={12}/> 응답
                          </button>
                          <button onClick={() => toggleActive(s.id, s.is_active, s.target)}
                            style={{ background:"none", border:"none", cursor:"pointer", color: s.is_active?TARGET_COLOR[target]:"var(--text-muted)" }}>
                            {s.is_active ? <ToggleRight size={22}/> : <ToggleLeft size={22}/>}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Responses panel */}
          {selectedSurvey && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.75rem" }}>
                <p style={{ fontSize:"0.88rem", fontWeight:600, color:"var(--navy)" }}>
                  {SURVEY_TARGET_META[selectedSurvey.target as SurveyTarget]?.label} · 응답 ({responses.length}건)
                </p>
                <button onClick={() => setSelectedSurvey(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", fontSize:"1.1rem" }}>×</button>
              </div>

              {responses.length === 0 ? (
                <p style={{ color:"var(--text-muted)", fontSize:"0.85rem" }}>아직 응답이 없습니다.</p>
              ) : (
                <>
                  {/* Average scores summary */}
                  <div className="card" style={{ padding:"1.25rem", marginBottom:"1rem" }}>
                    <p style={{ fontSize:"0.8rem", fontWeight:600, color:"var(--navy)", marginBottom:"0.75rem" }}>문항별 평균 (5점 만점)</p>
                    {averages.map((a, idx) => (
                      <div key={a.id} style={{ marginBottom:"0.6rem" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                          <span style={{ fontSize:"0.75rem", color:"var(--text-secondary)", lineHeight:1.4 }}>
                            Q{idx+1}. {a.label.length > 28 ? a.label.slice(0,28)+"…" : a.label}
                          </span>
                          <span style={{ fontSize:"0.75rem", fontWeight:600, color:"#f59e0b", flexShrink:0, marginLeft:8 }}>{a.avg.toFixed(2)}</span>
                        </div>
                        <div style={{ height:5, background:"var(--sand)", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${(a.avg/5)*100}%`, background:"#f59e0b" }}/>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Individual responses */}
                  {responses.map((r, i) => (
                    <div key={i} className="card" style={{ padding:"1rem", marginBottom:"0.6rem" }}>
                      <p style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginBottom:6 }}>
                        {r.user_email} · {new Date(r.created_at).toLocaleDateString("ko-KR")}
                      </p>
                      {questionMeta?.map(q => {
                        const v = r.answers[q.id];
                        if (v === undefined || v === "") return null;
                        return (
                          <div key={q.id} style={{ fontSize:"0.8rem", color:"var(--text-secondary)", marginBottom:3 }}>
                            <span style={{ color:"var(--text-muted)", marginRight:6 }}>{q.label.length > 20 ? q.label.slice(0,20)+"…" : q.label}</span>
                            {typeof v === "number" ? (
                              <span style={{ color:"#f59e0b" }}>{"★".repeat(v)}{"☆".repeat(5-v)} ({v})</span>
                            ) : (
                              <span>{v as string}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ratings tab (자문 직후 평가) */}
      {tab === "ratings" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"1rem", marginBottom:"1.5rem" }}>
            {[
              { label:"평균 별점", value: avgRating, icon: Star, color:"#f59e0b" },
              { label:"총 평가 수", value: ratings.length, icon: BarChart3, color:"var(--teal)" },
              { label:"5점", value: ratings.filter(r=>r.rating===5).length, icon: Star, color:"var(--teal)" },
              { label:"3점 이하", value: ratings.filter(r=>r.rating<=3).length, icon: Star, color:"#dc2626" },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding:"1.25rem", textAlign:"center" }}>
                <s.icon size={18} color={s.color} style={{ margin:"0 auto 0.5rem" }} />
                <p style={{ fontSize:"1.5rem", fontWeight:600, color:s.color, lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginTop:4 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
            {ratings.map(r => (
              <div key={r.id} className="card" style={{ padding:"1.25rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"0.5rem" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ color:"#f59e0b", fontSize:"1rem", letterSpacing:1 }}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.7rem", color:"var(--text-muted)" }}>{r.rating}.0</span>
                    </div>
                    {r.project_name && <p style={{ fontSize:"0.8rem", color:"var(--teal)", marginBottom:2 }}>{r.project_name}</p>}
                    {r.comment && <p style={{ fontSize:"0.85rem", color:"var(--text-secondary)", lineHeight:1.6 }}>{r.comment}</p>}
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>{r.user_email}</p>
                    <p style={{ fontSize:"0.72rem", color:"var(--text-muted)" }}>{new Date(r.created_at).toLocaleDateString("ko-KR")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
