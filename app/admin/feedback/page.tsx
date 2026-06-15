"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { AlertCircle, Wrench, Lightbulb, MessageSquare, CheckCircle, Clock, Eye } from "lucide-react";

const CATEGORY_META: Record<string, { label: string; color: string; Icon: React.ComponentType<{size:number;color:string}> }> = {
  system_error:    { label: "시스템 오류",    color: "#dc2626", Icon: AlertCircle },
  inconvenience:   { label: "사용 불편",      color: "#d97706", Icon: Wrench },
  feature_request: { label: "기능 추가 요청", color: "#2563eb", Icon: Lightbulb },
  other:           { label: "기타 의견",      color: "var(--teal)", Icon: MessageSquare },
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  new:       { label: "신규",    color: "#dc2626" },
  reviewing: { label: "검토 중", color: "#d97706" },
  resolved:  { label: "처리 완료", color: "var(--teal)" },
};

interface FeedbackItem {
  id: string;
  category: string;
  content: string;
  email: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
}

export default function AdminFeedbackPage() {
  const router = useRouter();
  const supabase = createClient();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selected, setSelected] = useState<FeedbackItem | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: adminCheck } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).single();
    if (!adminCheck) { router.push("/"); return; }
    loadFeedback();
  };

  const loadFeedback = async () => {
    const { data } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string, adminNote: string) => {
    setSaving(true);
    await supabase.from("feedback").update({ status, admin_note: adminNote || null }).eq("id", id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, status, admin_note: adminNote } : i));
    setSelected(prev => prev ? { ...prev, status, admin_note: adminNote } : null);
    setSaving(false);
  };

  const filtered = items.filter(i =>
    (filterStatus === "all" || i.status === filterStatus) &&
    (filterCategory === "all" || i.category === filterCategory)
  );

  const counts = {
    new: items.filter(i => i.status === "new").length,
    reviewing: items.filter(i => i.status === "reviewing").length,
    resolved: items.filter(i => i.status === "resolved").length,
  };

  if (loading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}><p style={{ color:"var(--text-muted)" }}>로딩 중...</p></div>;

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem 1.5rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <p className="section-label">관리자</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", color:"var(--navy)", marginTop:"0.3rem" }}>피드백 관리</h1>
        </div>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <a href="/admin/survey" className="btn-outline" style={{ fontSize:"0.82rem", padding:"0.45rem 0.9rem" }}>만족도 조사 관리</a>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
        {[
          { label:"신규", count:counts.new, color:"#dc2626", icon:AlertCircle },
          { label:"검토 중", count:counts.reviewing, color:"#d97706", icon:Clock },
          { label:"처리 완료", count:counts.resolved, color:"var(--teal)", icon:CheckCircle },
          { label:"전체", count:items.length, color:"var(--navy)", icon:Eye },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding:"1.25rem", textAlign:"center" }}>
            <s.icon size={20} color={s.color} style={{ margin:"0 auto 0.5rem" }} />
            <p style={{ fontSize:"1.6rem", fontWeight:600, color:s.color, lineHeight:1 }}>{s.count}</p>
            <p style={{ fontSize:"0.78rem", color:"var(--text-muted)", marginTop:4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.25rem", flexWrap:"wrap" }}>
        {["all","new","reviewing","resolved"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ padding:"0.4rem 0.9rem", borderRadius:6, border:`1px solid ${filterStatus===s?"var(--navy)":"var(--border)"}`,
              background:filterStatus===s?"var(--navy)":"var(--white)", color:filterStatus===s?"white":"var(--text-secondary)",
              fontSize:"0.8rem", cursor:"pointer" }}>
            {s==="all"?"전체":STATUS_META[s]?.label}
          </button>
        ))}
        <span style={{ width:1, background:"var(--border)", margin:"0 0.25rem" }}/>
        {["all",...Object.keys(CATEGORY_META)].map(c => (
          <button key={c} onClick={() => setFilterCategory(c)}
            style={{ padding:"0.4rem 0.9rem", borderRadius:6, border:`1px solid ${filterCategory===c?"var(--teal)":"var(--border)"}`,
              background:filterCategory===c?"var(--teal-pale)":"var(--white)", color:filterCategory===c?"var(--teal)":"var(--text-secondary)",
              fontSize:"0.8rem", cursor:"pointer" }}>
            {c==="all"?"전체 유형":CATEGORY_META[c]?.label}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap:"1.5rem" }}>
        {/* List */}
        <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
          {filtered.length === 0 ? (
            <p style={{ color:"var(--text-muted)", fontSize:"0.88rem", padding:"2rem 0" }}>해당하는 피드백이 없습니다.</p>
          ) : filtered.map(item => {
            const meta = CATEGORY_META[item.category];
            const statusM = STATUS_META[item.status];
            return (
              <div key={item.id} className="card" onClick={() => { setSelected(item); setNote(item.admin_note || ""); }}
                style={{ padding:"1rem 1.25rem", cursor:"pointer", borderLeft:`3px solid ${meta?.color||"var(--border)"}`,
                  background: selected?.id===item.id ? "var(--sand)" : "var(--white)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.5rem" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:"0.7rem", fontWeight:500, color:meta?.color, background:`${meta?.color}15`, padding:"2px 8px", borderRadius:4 }}>{meta?.label}</span>
                      <span style={{ fontSize:"0.7rem", fontWeight:500, color:statusM?.color, background:`${statusM?.color}15`, padding:"2px 8px", borderRadius:4 }}>{statusM?.label}</span>
                    </div>
                    <p style={{ fontSize:"0.88rem", color:"var(--navy)", lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.content}</p>
                    <p style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginTop:3 }}>
                      {item.email || "익명"} · {new Date(item.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card" style={{ padding:"1.5rem", alignSelf:"start", position:"sticky", top:80 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
              <p style={{ fontSize:"0.88rem", fontWeight:600, color:"var(--navy)" }}>상세 내용</p>
              <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", fontSize:"1.2rem" }}>×</button>
            </div>
            <div style={{ marginBottom:"1rem" }}>
              <p className="form-hint" style={{ marginBottom:4 }}>유형</p>
              <span style={{ fontSize:"0.82rem", fontWeight:500, color:CATEGORY_META[selected.category]?.color }}>{CATEGORY_META[selected.category]?.label}</span>
            </div>
            <div style={{ marginBottom:"1rem" }}>
              <p className="form-hint" style={{ marginBottom:4 }}>제출자</p>
              <p style={{ fontSize:"0.85rem", color:"var(--navy)" }}>{selected.email || "익명"}</p>
            </div>
            <div style={{ marginBottom:"1rem" }}>
              <p className="form-hint" style={{ marginBottom:4 }}>내용</p>
              <p style={{ fontSize:"0.85rem", color:"var(--navy)", lineHeight:1.7, background:"var(--sand)", padding:"0.75rem", borderRadius:6 }}>{selected.content}</p>
            </div>
            <div style={{ marginBottom:"1rem" }}>
              <p className="form-hint" style={{ marginBottom:4 }}>제출일</p>
              <p style={{ fontSize:"0.82rem", color:"var(--text-secondary)" }}>{new Date(selected.created_at).toLocaleString("ko-KR")}</p>
            </div>
            <div style={{ marginBottom:"1rem" }}>
              <label className="form-label" style={{ fontSize:"0.78rem" }}>처리 상태 변경</label>
              <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                {["new","reviewing","resolved"].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s, note)}
                    style={{ padding:"0.35rem 0.75rem", borderRadius:6, border:`1px solid ${selected.status===s?"var(--teal)":"var(--border)"}`,
                      background:selected.status===s?"var(--teal-pale)":"var(--white)", color:selected.status===s?"var(--teal)":"var(--text-secondary)",
                      fontSize:"0.78rem", cursor:"pointer" }}>
                    {STATUS_META[s].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label" style={{ fontSize:"0.78rem" }}>관리자 메모</label>
              <textarea className="form-textarea" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="내부 처리 메모 (사용자에게 비공개)" style={{ fontSize:"0.82rem" }} />
              <button onClick={() => updateStatus(selected.id, selected.status, note)} className="btn-primary"
                disabled={saving} style={{ marginTop:"0.5rem", width:"100%", justifyContent:"center", fontSize:"0.82rem", padding:"0.5rem" }}>
                {saving ? "저장 중..." : "메모 저장"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
