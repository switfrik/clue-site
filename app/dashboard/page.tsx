"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { FileEdit, Plus, Clock, CheckCircle, Trash2 } from "lucide-react";
import Link from "next/link";

interface FormRecord {
  id: string;
  project_name: string;
  iris_number: string;
  main_org: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [forms, setForms] = useState<FormRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUser(data.user);
      supabase.from("design_forms")
        .select("id,project_name,iris_number,main_org,status,created_at,updated_at")
        .order("updated_at", { ascending: false })
        .then(({ data: forms }) => { setForms(forms || []); setLoading(false); });
    });
  }, []);

  const deleteForm = async (id: string) => {
    if (!confirm("설계서를 삭제할까요?")) return;
    await supabase.from("design_forms").delete().eq("id", id);
    setForms(f => f.filter(x => x.id !== id));
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <p className="section-label">내 설계서</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", color:"var(--navy)", marginTop:"0.4rem" }}>대시보드</h1>
          {user && <p style={{ fontSize:"0.82rem", color:"var(--text-muted)", marginTop:4 }}>{user.email}</p>}
        </div>
        <Link href="/form/new" className="btn-primary">
          <Plus size={15} /> 새 설계서 작성
        </Link>
      </div>

      {loading ? (
        <p style={{ color:"var(--text-muted)", fontSize:"0.9rem" }}>불러오는 중...</p>
      ) : forms.length === 0 ? (
        <div style={{ textAlign:"center", padding:"4rem 2rem", background:"var(--sand)", borderRadius:10, border:"2px dashed var(--border)" }}>
          <FileEdit size={36} color="var(--text-muted)" style={{ margin:"0 auto 1rem" }} strokeWidth={1} />
          <p style={{ fontSize:"1rem", fontWeight:600, color:"var(--navy)" }}>작성한 설계서가 없습니다</p>
          <p style={{ fontSize:"0.85rem", color:"var(--text-muted)", marginTop:6 }}>새 설계서 작성 버튼을 눌러 시작해보세요.</p>
          <Link href="/form/new" className="btn-primary" style={{ marginTop:"1.5rem", display:"inline-flex" }}>
            <Plus size={15} /> 설계서 작성 시작
          </Link>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          {forms.map(f => (
            <div key={f.id} className="card" style={{ padding:"1.25rem 1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"1rem", flexWrap:"wrap" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:4 }}>
                  {f.status === "submitted"
                    ? <CheckCircle size={14} color="var(--teal)" />
                    : <Clock size={14} color="#f59e0b" />
                  }
                  <span style={{ fontSize:"0.72rem", fontFamily:"'DM Mono',monospace", color: f.status==="submitted" ? "var(--teal)" : "#d97706", fontWeight:500 }}>
                    {f.status === "submitted" ? "제출 완료" : "작성 중"}
                  </span>
                  {f.iris_number && <span style={{ fontSize:"0.72rem", color:"var(--text-muted)", fontFamily:"'DM Mono',monospace" }}>{f.iris_number}</span>}
                </div>
                <p style={{ fontSize:"0.95rem", fontWeight:600, color:"var(--navy)" }}>{f.project_name || "(제목 없음)"}</p>
                <p style={{ fontSize:"0.78rem", color:"var(--text-muted)", marginTop:2 }}>
                  {f.main_org && `${f.main_org} · `}
                  최종 수정: {new Date(f.updated_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <div style={{ display:"flex", gap:"0.5rem" }}>
                <Link href={`/form/${f.id}`} className="btn-outline" style={{ padding:"0.45rem 0.9rem", fontSize:"0.8rem" }}>
                  <FileEdit size={13} /> {f.status === "submitted" ? "보기" : "이어 작성"}
                </Link>
                <button onClick={() => deleteForm(f.id)} style={{ background:"none", border:"1px solid var(--border)", borderRadius:6, padding:"0.45rem 0.6rem", cursor:"pointer", color:"var(--text-muted)", display:"flex", alignItems:"center" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
