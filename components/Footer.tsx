export default function Footer() {
  return (
    <footer style={{ background:"var(--navy)", color:"var(--text-muted)", padding:"2.5rem 1.5rem", marginTop:"4rem" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))", gap:"2rem", marginBottom:"2rem" }}>
          <div>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"1rem", fontWeight:500, color:"var(--teal-light)", marginBottom:8 }}>CLUE</p>
            <p style={{ fontSize:"0.8rem", lineHeight:1.7, color:"#6b7fa0" }}>미충족의료수요 기반<br/>의료제품 사용목적 설계서</p>
          </div>
          <div>
            <p style={{ fontSize:"0.72rem", fontWeight:500, color:"#8a9ab0", marginBottom:12, letterSpacing:"0.08em", textTransform:"uppercase" }}>바로가기</p>
            {[{href:"/clue",label:"CLUE 원형문서"},{href:"/download",label:"양식 다운로드"},{href:"/form/new",label:"설계서 작성"},{href:"/contact",label:"Contact"}].map(i=>(
              <a key={i.href} href={i.href} style={{ display:"block", fontSize:"0.82rem", color:"#6b7fa0", textDecoration:"none", marginBottom:6 }}>{i.label}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop:"1px solid #1e3050", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <p style={{ fontSize:"0.75rem", color:"#4a5a70" }}>© {new Date().getFullYear()} CLUE. 저작권은 개발자에게 있습니다.</p>
          <p style={{ fontSize:"0.75rem", color:"#4a5a70" }}>JKMS 2024;39:e311</p>
        </div>
      </div>
    </footer>
  );
}
