import Link from "next/link";
import { ArrowRight, FileText, Download, Video, PenLine, Mail, FileEdit, MessageSquarePlus, ClipboardCheck } from "lucide-react";
const sections = [
  {href:"/clue",icon:FileText,label:"CLUE 원형문서",desc:"JKMS 게재 원형 논문 열람"},
  {href:"/download",icon:Download,label:"양식 다운로드",desc:"설계서 및 작성 양식 제공"},
  {href:"/form/new",icon:FileEdit,label:"설계서 작성",desc:"온라인 작성 및 저장"},
  {href:"/lecture",icon:Video,label:"강의 · 영상",desc:"범부처 강의자료 및 유튜브"},
  {href:"/contract",icon:PenLine,label:"설계서 계약",desc:"전자계약 (모두사인 연동 예정)"},
  {href:"/survey",icon:ClipboardCheck,label:"만족도 조사",desc:"자문위원·과제팀 대상 정기 설문"},
  {href:"/feedback",icon:MessageSquarePlus,label:"피드백 제출",desc:"불편사항 및 개선요청 접수"},
  {href:"/contact",icon:Mail,label:"Contact",desc:"문의 및 협업 제안"},
];
export default function HomePage() {
  return (
    <>
      <section style={{background:"var(--navy)",padding:"5rem 1.5rem 4rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-80,right:-80,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle, rgba(26,138,114,0.12) 0%, transparent 70%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <p className="section-label fade-up" style={{color:"var(--teal-light)"}}>Clinically-grounded Landscape for Unmet-need Evidence</p>
          <h1 className="fade-up fade-up-delay-1" style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:700,color:"white",lineHeight:1.2,marginTop:"0.75rem",maxWidth:700}}>
            미충족의료수요 기반<br/>의료제품 설계서
          </h1>
          <p className="fade-up fade-up-delay-2" style={{fontSize:"1rem",color:"#8a9ab0",marginTop:"1.25rem",maxWidth:560,lineHeight:1.75}}>
            CLUE는 의료현장의 미충족 수요로부터 출발하여 의료제품의 사용목적을 체계적으로 설계하기 위한 프레임워크입니다.
          </p>
          <div className="fade-up fade-up-delay-2" style={{marginTop:"2rem",display:"flex",gap:"1rem",flexWrap:"wrap"}}>
            <Link href="/form/new" className="btn-primary">설계서 작성 시작 <ArrowRight size={15}/></Link>
            <Link href="/clue" className="btn-outline" style={{color:"white",borderColor:"#2d4a6b"}}>원형문서 보기</Link>
          </div>
          <div style={{marginTop:"2.5rem",display:"inline-flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"0.5rem 1rem"}}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.7rem",color:"var(--teal-light)"}}>JKMS</span>
            <span style={{width:1,height:14,background:"#2d4a6b",display:"inline-block"}}/>
            <span style={{fontSize:"0.75rem",color:"#6b7fa0"}}>2024;39:e311 · doi:10.3346/jkms.2024.39.e311</span>
          </div>
        </div>
      </section>
      <section style={{padding:"4rem 1.5rem"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <p className="section-label">사이트 구성</p>
          <h2 className="section-title">바로가기</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"1rem",marginTop:"1.5rem"}}>
            {sections.map(item=>(
              <Link key={item.href} href={item.href} style={{textDecoration:"none"}}>
                <div className="card" style={{padding:"1.25rem",height:"100%"}}>
                  <item.icon size={20} color="var(--teal)" strokeWidth={1.5}/>
                  <p style={{fontSize:"0.9rem",fontWeight:600,color:"var(--navy)",margin:"0.6rem 0 0.25rem"}}>{item.label}</p>
                  <p style={{fontSize:"0.78rem",color:"var(--text-muted)",lineHeight:1.5}}>{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
