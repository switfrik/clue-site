"use client";
import { useState } from "react";
import { Send, Mail, Building2 } from "lucide-react";
export default function ContactPage() {
  const [submitted,setSubmitted]=useState(false);
  const [form,setForm]=useState({name:"",org:"",email:"",purpose:"",message:""});
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"3rem 1.5rem"}}>
      <p className="section-label">문의</p>
      <h1 className="section-title">Contact</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"3rem",marginTop:"2.5rem"}}>
        <div>
          {[{icon:Mail,label:"이메일",value:"contact@example.com"},{icon:Building2,label:"소속",value:"기관명을 입력하세요"}].map(item=>(
            <div key={item.label} style={{display:"flex",gap:12,marginBottom:"1.25rem"}}>
              <div style={{width:36,height:36,borderRadius:8,background:"var(--teal-pale)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <item.icon size={16} color="var(--teal)" strokeWidth={1.5}/>
              </div>
              <div>
                <p style={{fontSize:"0.72rem",color:"var(--text-muted)",fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"'DM Mono',monospace"}}>{item.label}</p>
                <p style={{fontSize:"0.88rem",color:"var(--navy)",marginTop:2}}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          {submitted ? (
            <div style={{padding:"2.5rem",background:"var(--teal-pale)",borderRadius:8,textAlign:"center"}}>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",color:"var(--navy)",fontWeight:600}}>문의가 접수되었습니다</p>
              <button onClick={()=>setSubmitted(false)} className="btn-outline" style={{marginTop:"1.5rem"}}>새 문의 작성</button>
            </div>
          ) : (
            <form onSubmit={e=>{e.preventDefault();setSubmitted(true)}} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              {[{key:"name",label:"이름 *",type:"text",ph:"홍길동"},{key:"org",label:"소속 기관",type:"text",ph:"기관명"},{key:"email",label:"이메일 *",type:"email",ph:"example@email.com"}].map(f=>(
                <div key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <input type={f.type} className="form-input" required={f.label.includes("*")} value={form[f.key as keyof typeof form]} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.ph}/>
                </div>
              ))}
              <div>
                <label className="form-label">문의 유형 *</label>
                <select required className="form-input" value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})}>
                  <option value="">선택해주세요</option>
                  <option value="commercial">상업적 이용 계약</option>
                  <option value="research">연구 협력</option>
                  <option value="lecture">강의 요청</option>
                  <option value="other">기타 문의</option>
                </select>
              </div>
              <div>
                <label className="form-label">문의 내용 *</label>
                <textarea required rows={5} className="form-textarea" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="문의 내용을 자세히 작성해 주세요."/>
              </div>
              <button type="submit" className="btn-primary" style={{alignSelf:"flex-start"}}><Send size={14}/> 문의 보내기</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
