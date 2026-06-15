"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, FileEdit, MessageSquarePlus } from "lucide-react";
import { createClient } from "@/lib/supabase";

const navItems = [
  { href: "/", label: "소개" },
  { href: "/clue", label: "CLUE 원형문서" },
  { href: "/download", label: "다운로드" },
  { href: "/lecture", label: "강의·영상" },
  { href: "/contract", label: "설계서 계약" },
  { href: "/contact", label: "Contact" },
   { href: "/survey", label: "Survey" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).single();
        setIsAdmin(!!data);
      }
    };
    init();
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setIsAdmin(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header style={{ position:"sticky", top:0, zIndex:100, background:"rgba(253,252,249,0.95)", backdropFilter:"blur(8px)", borderBottom:"1px solid var(--border)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 1.5rem", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ textDecoration:"none", display:"flex", alignItems:"baseline", gap:8 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"1.05rem", fontWeight:500, color:"var(--teal)", letterSpacing:"0.04em" }}>CLUE</span>
          <span style={{ fontSize:"0.68rem", color:"var(--text-muted)" }} className="hidden sm:inline">미충족의료수요 기반 의료제품 설계서</span>
        </Link>

        <nav className="hidden md:flex" style={{ display:"flex", alignItems:"center", gap:"1.75rem" }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? "active" : ""}`}>{item.label}</Link>
          ))}
        </nav>

        <div className="hidden md:flex" style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
          {/* Feedback button - always visible */}
          <Link href="/feedback" style={{
            display:"inline-flex", alignItems:"center", gap:5,
            fontSize:"0.78rem", fontWeight:500, color:"var(--text-secondary)",
            padding:"0.35rem 0.8rem", borderRadius:20,
            border:"1px solid var(--border)", textDecoration:"none",
            transition:"all 0.15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="var(--teal)"; (e.currentTarget as HTMLElement).style.color="var(--teal)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="var(--border)"; (e.currentTarget as HTMLElement).style.color="var(--text-secondary)"; }}>
            <MessageSquarePlus size={13} /> 피드백
          </Link>


          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin/feedback" style={{ fontSize:"0.75rem", color:"var(--teal)", textDecoration:"none", fontWeight:500 }}>관리자</Link>
              )}
              <Link href="/form/new" className="btn-primary" style={{ padding:"0.45rem 0.9rem", fontSize:"0.8rem" }}>
                <FileEdit size={13} /> 설계서 작성
              </Link>
              <Link href="/dashboard" style={{ fontSize:"0.78rem", color:"var(--text-muted)", textDecoration:"none" }}>내 설계서</Link>
              <button onClick={handleSignOut} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", display:"flex", alignItems:"center", gap:4, fontSize:"0.78rem" }}>
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-outline" style={{ padding:"0.45rem 0.9rem", fontSize:"0.8rem" }}>
              <LogIn size={13} /> 로그인
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--navy)", padding:4 }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div style={{ background:"var(--cream)", borderTop:"1px solid var(--border)", padding:"1rem 1.5rem" }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              style={{ display:"block", padding:"0.6rem 0", fontSize:"0.9rem", color:pathname===item.href?"var(--teal)":"var(--text-secondary)", textDecoration:"none", borderBottom:"1px solid var(--border)" }}>
              {item.label}
            </Link>
          ))}
          <Link href="/feedback" onClick={() => setOpen(false)} style={{ display:"block", padding:"0.6rem 0", fontSize:"0.9rem", color:"var(--teal)", textDecoration:"none", borderBottom:"1px solid var(--border)" }}>
            💬 피드백 제출
          </Link>
          {user ? (
            <Link href="/form/new" onClick={() => setOpen(false)} style={{ display:"block", padding:"0.6rem 0", fontSize:"0.9rem", color:"var(--teal)", textDecoration:"none" }}>설계서 작성</Link>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} style={{ display:"block", padding:"0.6rem 0", fontSize:"0.9rem", color:"var(--teal)", textDecoration:"none" }}>로그인</Link>
          )}
        </div>
      )}
    </header>
  );
}
