import { ExternalLink, PlayCircle } from "lucide-react";
const videos = [
  {title:"CLUE 설계서 개요 및 활용 방법",desc:"미충족의료수요 기반 의료제품 사용목적 설계서의 개요와 실제 활용 방법을 소개합니다.",youtubeId:"",source:"범부처전주기의료기기연구개발사업단",duration:""},
  {title:"CLUE 작성 실습 워크숍",desc:"설계서 각 항목을 직접 작성해보는 실습 강의입니다.",youtubeId:"",source:"범부처전주기의료기기연구개발사업단",duration:""},
];
export default function LecturePage() {
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"3rem 1.5rem"}}>
      <p className="section-label">교육 자료</p>
      <h1 className="section-title">강의 · 영상</h1>
      <div style={{marginTop:"2.5rem",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"1.5rem"}}>
        {videos.map(video=>(
          <div key={video.title} className="card" style={{overflow:"hidden"}}>
            <div style={{position:"relative",paddingTop:"56.25%",background:"var(--navy-mid)"}}>
              {!video.youtubeId ? (
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <PlayCircle size={40} color="rgba(255,255,255,0.3)" strokeWidth={1}/>
                  <p style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.4)",marginTop:8,textAlign:"center",padding:"0 1rem"}}>YouTube ID를 설정하면 영상이 표시됩니다</p>
                </div>
              ) : (
                <iframe src={`https://www.youtube.com/embed/${video.youtubeId}`} style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}} allowFullScreen title={video.title}/>
              )}
            </div>
            <div style={{padding:"1.25rem"}}>
              <p style={{fontSize:"0.92rem",fontWeight:600,color:"var(--navy)",lineHeight:1.4}}>{video.title}</p>
              <p style={{fontSize:"0.8rem",color:"var(--text-secondary)",marginTop:6,lineHeight:1.6}}>{video.desc}</p>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.68rem",color:"var(--teal)",background:"var(--teal-pale)",padding:"3px 8px",borderRadius:4,display:"inline-block",marginTop:"0.75rem"}}>{video.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
