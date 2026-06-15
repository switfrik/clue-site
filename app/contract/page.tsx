import { PenLine, Clock } from "lucide-react";
export default function ContractPage() {
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"3rem 1.5rem"}}>
      <p className="section-label">설계서 계약</p>
      <h1 className="section-title">CLUE 설계서 계약</h1>
      <div style={{marginTop:"2rem",padding:"1rem 1.5rem",background:"#fffbeb",border:"1px solid #f59e0b",borderRadius:8,display:"flex",alignItems:"center",gap:12}}>
        <Clock size={18} color="#d97706" style={{flexShrink:0}}/>
        <div>
          <p style={{fontSize:"0.88rem",fontWeight:600,color:"#92400e"}}>전자계약 시스템 준비 중</p>
          <p style={{fontSize:"0.8rem",color:"#b45309",marginTop:2}}>모두사인 API 연동 작업이 진행 중입니다. 현재는 Contact 페이지를 통해 계약 문의를 접수합니다.</p>
        </div>
      </div>
      <div style={{marginTop:"3rem",border:"2px dashed var(--border)",borderRadius:8,padding:"3rem",textAlign:"center",background:"var(--sand)"}}>
        <PenLine size={32} color="var(--text-muted)" style={{margin:"0 auto 1rem"}} strokeWidth={1}/>
        <p style={{fontSize:"0.9rem",fontWeight:600,color:"var(--text-secondary)"}}>모두사인 전자계약 위젯</p>
        <p style={{fontSize:"0.8rem",color:"var(--text-muted)",marginTop:6,lineHeight:1.6}}>모두사인 API 연동 후 이 영역에서 직접 전자서명을 진행할 수 있습니다.</p>
        <a href="/contact" className="btn-primary" style={{marginTop:"1.5rem",display:"inline-flex"}}>계약 문의하기</a>
      </div>
    </div>
  );
}
