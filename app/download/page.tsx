import { Download, FileText, File, FileSpreadsheet } from "lucide-react";
const files = [
  {category:"설계서",items:[
    {name:"CLUE 설계서 (전체)",desc:"미충족의료수요 기반 의료제품 사용목적 설계서 전문",type:"PDF",href:"/downloads/CLUE_full.pdf",icon:FileText},
    {name:"CLUE 설계서 요약본",desc:"핵심 내용 요약 버전",type:"PDF",href:"/downloads/CLUE_summary.pdf",icon:FileText},
  ]},
  {category:"작성 양식",items:[
    {name:"CLUE 작성 양식",desc:"설계서 작성을 위한 표준 양식",type:"DOCX",href:"/downloads/CLUE_form.docx",icon:File},
    {name:"CLUE 작성 가이드",desc:"항목별 작성 방법 안내",type:"PDF",href:"/downloads/CLUE_guide.pdf",icon:FileText},
    {name:"CLUE 체크리스트",desc:"작성 완료 후 검토용 체크리스트",type:"XLSX",href:"/downloads/CLUE_checklist.xlsx",icon:FileSpreadsheet},
  ]},
];
const typeColors: Record<string,string> = {PDF:"#dc2626",DOCX:"#2563eb",XLSX:"#16a34a"};
export default function DownloadPage() {
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"3rem 1.5rem"}}>
      <p className="section-label">자료실</p>
      <h1 className="section-title">설계서 · 양식 다운로드</h1>
      <div style={{marginTop:"2.5rem",display:"flex",flexDirection:"column",gap:"2.5rem"}}>
        {files.map(group=>(
          <div key={group.category}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",color:"var(--navy)",marginBottom:"1rem",fontWeight:600}}>{group.category}</h2>
            <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
              {group.items.map(file=>(
                <div key={file.name} className="card" style={{padding:"1.25rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                    <div style={{width:40,height:40,borderRadius:8,background:"var(--teal-pale)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <file.icon size={18} color="var(--teal)" strokeWidth={1.5}/>
                    </div>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <p style={{fontSize:"0.92rem",fontWeight:600,color:"var(--navy)"}}>{file.name}</p>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.65rem",fontWeight:500,color:typeColors[file.type],background:`${typeColors[file.type]}15`,padding:"2px 6px",borderRadius:4}}>{file.type}</span>
                      </div>
                      <p style={{fontSize:"0.8rem",color:"var(--text-muted)",marginTop:2}}>{file.desc}</p>
                    </div>
                  </div>
                  <a href={file.href} download className="btn-outline" style={{flexShrink:0}}><Download size={14}/> 다운로드</a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
