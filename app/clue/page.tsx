import { ExternalLink } from "lucide-react";
export default function CluePage() {
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"3rem 1.5rem"}}>
      <p className="section-label">원형 문서</p>
      <h1 className="section-title">CLUE 원형문서</h1>
      <div style={{margin:"2rem 0",padding:"1.25rem 1.5rem",background:"var(--sand)",border:"1px solid var(--border)",borderLeft:"4px solid var(--teal)",borderRadius:"0 8px 8px 0"}}>
        <p style={{fontSize:"0.8rem",fontFamily:"'DM Mono',monospace",color:"var(--text-muted)",marginBottom:6}}>CITATION</p>
        <p style={{fontSize:"0.88rem",color:"var(--text-secondary)",lineHeight:1.7}}>
          미충족의료수요 기반 의료제품 사용목적 설계서(CLUE). <em>J Korean Med Sci.</em> 2024;39:e311.
        </p>
        <a href="https://www.jkms.org/search.php?where=aview&id=10.3346/jkms.2024.39.e311&code=0063JKMS&vmode=SM" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{marginTop:"1rem",display:"inline-flex"}}>
          JKMS 원문 열람 <ExternalLink size={14}/>
        </a>
      </div>
      <div style={{border:"1px solid var(--border)",borderRadius:8,overflow:"hidden",background:"var(--white)"}}>
        <iframe src="https://www.jkms.org/search.php?where=aview&id=10.3346/jkms.2024.39.e311&code=0063JKMS&vmode=SM" style={{width:"100%",height:"75vh",border:"none"}} title="CLUE 원형문서"/>
      </div>
    </div>
  );
}
