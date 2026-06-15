"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Save, Printer, Plus, Trash2, ChevronRight, ChevronLeft, Send } from "lucide-react";
import { EMPTY_FORM, DesignForm } from "@/lib/types";

const STEPS = ["과제 기본정보", "의료제품 정의", "적용 형태", "대상군 및 미충족수요", "해결방안 및 결과"];

export default function NewFormPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<DesignForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
    });
  }, []);

  const update = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }));
  const updateNested = (parent: string, field: string, value: unknown) =>
    setForm(f => ({ ...f, [parent]: { ...(f[parent as keyof DesignForm] as object), [field]: value } }));

  const saveForm = async (status: "draft" | "submitted" = "draft") => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const payload = {
      user_id: user.id,
      user_email: user.email,
      status,
      iris_number: form.iris_number,
      project_name: form.project_name,
      main_org: form.main_org,
      co_org: form.co_org,
      form_data: form,
    };

    let error;
    if (formId) {
      ({ error } = await supabase.from("design_forms").update(payload).eq("id", formId));
    } else {
      const { data, error: err } = await supabase.from("design_forms").insert(payload).select().single();
      if (data) setFormId(data.id);
      error = err;
    }
    setSaving(false);
    if (!error) {
      setSaveMsg(status === "submitted" ? "제출 완료!" : "저장됨");
      setTimeout(() => setSaveMsg(""), 2000);
      if (status === "submitted") router.push("/dashboard");
    }
  };

  const handlePrint = () => window.print();

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      {/* Header */}
      <div className="no-print" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <p className="section-label">설계서 작성</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", color:"var(--navy)", marginTop:"0.4rem" }}>
            미충족의료수요 기반 의료제품 설계서
          </h1>
          <p style={{ fontSize:"0.8rem", color:"var(--text-muted)", marginTop:4 }}>1단계 기초양식 — 치료/예방 목적 의료제품</p>
        </div>
        <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
          {saveMsg && <span style={{ fontSize:"0.8rem", color:"var(--teal)", alignSelf:"center" }}>{saveMsg}</span>}
          <button onClick={() => saveForm("draft")} className="btn-outline" disabled={saving} style={{ padding:"0.5rem 1rem", fontSize:"0.82rem" }}>
            <Save size={14} />{saving ? "저장 중..." : "임시저장"}
          </button>
          <button onClick={handlePrint} className="btn-outline" style={{ padding:"0.5rem 1rem", fontSize:"0.82rem" }}>
            <Printer size={14} /> 인쇄/PDF
          </button>
          <button onClick={() => saveForm("submitted")} className="btn-primary" style={{ padding:"0.5rem 1rem", fontSize:"0.82rem" }}>
            <Send size={14} /> 제출
          </button>
        </div>
      </div>

      {/* Step indicator */}
      <div className="no-print" style={{ display:"flex", gap:0, marginBottom:"2rem", overflowX:"auto" }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex:"1 0 auto", padding:"0.6rem 0.5rem", fontSize:"0.75rem", fontWeight: i===step ? 600 : 400,
            color: i===step ? "var(--teal)" : i < step ? "var(--navy)" : "var(--text-muted)",
            background: i===step ? "var(--teal-pale)" : "var(--white)",
            border:"1px solid var(--border)", borderRight: i<STEPS.length-1 ? "none" : "1px solid var(--border)",
            borderRadius: i===0 ? "6px 0 0 6px" : i===STEPS.length-1 ? "0 6px 6px 0" : 0,
            cursor:"pointer", textAlign:"center", whiteSpace:"nowrap",
          }}>
            <span style={{ display:"block", fontSize:"0.65rem", color: i<=step?"var(--teal)":"var(--text-muted)", marginBottom:2 }}>
              {String(i+1).padStart(2,"0")}
            </span>
            {s}
          </button>
        ))}
      </div>

      {/* STEP 0: 과제 기본정보 */}
      {step === 0 && (
        <div className="form-section">
          <p className="form-section-title">알려두기 및 과제 기본 정보</p>
          <div style={{ padding:"1rem", background:"var(--teal-pale)", borderRadius:8, marginBottom:"1.5rem", fontSize:"0.82rem", color:"var(--text-secondary)", lineHeight:1.8 }}>
            <strong style={{ color:"var(--teal)" }}>작성 시기와 용도</strong><br/>
            의료제품 개발 아이디어 발굴 및 기획 단계에서 작성하며, 미충족의료수요(clinical unmet needs)의 구체화와 의료제품 개발 방향 설정을 위한 기초양식입니다.
          </div>
          <div className="form-row" style={{ gridTemplateColumns:"1fr 1fr" }}>
            <div>
              <label className="form-label">연구개발과제번호 (IRIS)</label>
              <input className="form-input" value={form.iris_number} onChange={e=>update("iris_number",e.target.value)} placeholder="IRIS 번호" />
            </div>
            <div>
              <label className="form-label">연구개발과제명</label>
              <input className="form-input" value={form.project_name} onChange={e=>update("project_name",e.target.value)} placeholder="과제명" />
            </div>
          </div>
          <div className="form-row" style={{ gridTemplateColumns:"1fr 1fr" }}>
            <div>
              <label className="form-label">주관연구개발기관 (연구책임자명)</label>
              <input className="form-input" value={form.main_org} onChange={e=>update("main_org",e.target.value)} placeholder="기관명 (책임자)" />
            </div>
            <div>
              <label className="form-label">공동연구개발기관 (책임자명)</label>
              <input className="form-input" value={form.co_org} onChange={e=>update("co_org",e.target.value)} placeholder="기관명 (책임자)" />
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: 의료제품 정의 */}
      {step === 1 && (
        <>
          <div className="form-section">
            <p className="form-section-title">1. 개발 의료제품의 정의 및 개요도</p>
            <label className="form-label">의료제품 정의 <span style={{color:"var(--text-muted)",fontWeight:400}}>(누가/언제/어디에서/누구에게/무엇을/어떻게/왜 사용하는 의료제품)</span></label>
            <textarea className="form-textarea" rows={4} value={form.product_definition} onChange={e=>update("product_definition",e.target.value)} placeholder="예) 상급종합병원의 심장내과 전문의가, 심방세동 환자의 시술 계획 수립 시, 3D 심장 모델링 소프트웨어를 이용하여 최적 시술 경로를 시뮬레이션하는 의료기기" />
            <label className="form-label" style={{marginTop:"1rem"}}>의료제품 시제품 이미지 또는 개요도 설명</label>
            <textarea className="form-textarea" rows={2} value={form.product_image_desc} onChange={e=>update("product_image_desc",e.target.value)} placeholder="이미지 첨부 불가 시 제품 구성 및 외형을 텍스트로 설명" />
          </div>

          <div className="form-section">
            <p className="form-section-title">2-1. 목표하는 의료제품 품목 및 등급</p>
            {form.target_items.map((item, idx) => (
              <div key={idx} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 2fr auto", gap:"0.75rem", marginBottom:"0.75rem", alignItems:"end" }}>
                <div>
                  {idx===0 && <label className="form-label">품목</label>}
                  <input className="form-input" value={item.item} onChange={e=>{const arr=[...form.target_items];arr[idx].item=e.target.value;update("target_items",arr)}} placeholder="예) 의료영상처리소프트웨어" />
                </div>
                <div>
                  {idx===0 && <label className="form-label">등급</label>}
                  <input className="form-input" value={item.grade} onChange={e=>{const arr=[...form.target_items];arr[idx].grade=e.target.value;update("target_items",arr)}} placeholder="예) 2등급" />
                </div>
                <div>
                  {idx===0 && <label className="form-label">사용목적 정의</label>}
                  <input className="form-input" value={item.purpose} onChange={e=>{const arr=[...form.target_items];arr[idx].purpose=e.target.value;update("target_items",arr)}} placeholder="식약처 고시 사용목적 인용" />
                </div>
                <button onClick={()=>{if(form.target_items.length>1){const arr=form.target_items.filter((_,i)=>i!==idx);update("target_items",arr)}}} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",padding:"0.5rem",alignSelf:"center"}}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button className="btn-outline" style={{fontSize:"0.78rem",padding:"0.4rem 0.8rem"}} onClick={()=>update("target_items",[...form.target_items,{item:"",grade:"",purpose:""}])}>
              <Plus size={13} /> 행 추가
            </button>
          </div>
        </>
      )}

      {/* STEP 2: 적용 형태 */}
      {step === 2 && (
        <div className="form-section">
          <p className="form-section-title">2-2. 의료제품 적용 형태</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1.5rem",marginBottom:"1.5rem"}}>
            <div>
              <label className="form-label">일회용 여부</label>
              <div className="radio-group">
                {[{v:true,l:"예"},{v:false,l:"아니오"}].map(o=>(
                  <label key={String(o.v)} className="radio-label"><input type="radio" name="single_use" onChange={()=>update("is_single_use",o.v)} checked={form.is_single_use===o.v} style={{accentColor:"var(--teal)"}} />{o.l}</label>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label">침습 정도</label>
              <div className="radio-group">
                {[{v:"invasive",l:"침습형"},{v:"non-invasive",l:"비침습형"},{v:"other",l:"기타(IVD/SaMD)"}].map(o=>(
                  <label key={o.v} className="radio-label"><input type="radio" name="invasive" onChange={()=>update("invasiveness",o.v)} checked={form.invasiveness===o.v} style={{accentColor:"var(--teal)"}} />{o.l}</label>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label">적용기간</label>
              <div className="radio-group">
                {[{v:"transient",l:"일시사용(60분 미만)"},{v:"short",l:"단기사용(60분~30일)"},{v:"long",l:"장기사용(30일 초과)"},{v:"na",l:"해당없음"}].map(o=>(
                  <label key={o.v} className="radio-label"><input type="radio" name="duration" onChange={()=>update("duration",o.v)} checked={form.duration===o.v} style={{accentColor:"var(--teal)"}} />{o.l}</label>
                ))}
              </div>
            </div>
          </div>
          <p className="form-section-title" style={{marginTop:"1.5rem"}}>2-3. 목표 사용자와 사용방법</p>
          <div style={{marginBottom:"1rem"}}>
            <label className="form-label">목표 사용자</label>
            <div className="radio-group">
              {[{v:"professional",l:"전문가 (Professional user)"},{v:"lay",l:"일반사용자 (Lay user)"}].map(o=>(
                <label key={o.v} className="radio-label"><input type="radio" name="user_type" onChange={()=>update("user_type",o.v)} checked={form.user_type===o.v} style={{accentColor:"var(--teal)"}} />{o.l}</label>
              ))}
            </div>
          </div>
          <div>
            <label className="form-label">사용방법 간략 서술</label>
            <textarea className="form-textarea" rows={3} value={form.usage_description} onChange={e=>update("usage_description",e.target.value)} placeholder="의료제품의 사용 순서와 방법을 간략히 서술" />
          </div>
        </div>
      )}

      {/* STEP 3: 대상군 및 미충족수요 */}
      {step === 3 && (
        <>
          <div className="form-section">
            <p className="form-section-title">3-1. 대상군과 기대하는 효과</p>
            <div style={{marginBottom:"1rem"}}>
              <label className="form-label">대상군의 질환 또는 상태</label>
              <textarea className="form-textarea" rows={2} value={form.target_population} onChange={e=>update("target_population",e.target.value)} placeholder="예) 심방세동으로 진단받은 성인 환자" />
            </div>
            <div>
              <label className="form-label">기대하는 효과</label>
              <textarea className="form-textarea" rows={2} value={form.expected_effect} onChange={e=>update("expected_effect",e.target.value)} placeholder="예) 시술 시간 단축 및 성공률 향상" />
            </div>
          </div>

          <div className="form-section">
            <p className="form-section-title">3-2. 구체적인 임상 상황</p>
            {[
              {key:"disease",label:"질환/상태",placeholder:"적용 목표 대상을 대표하는 질환이나 상태"},
              {key:"severity",label:"중증도",placeholder:"대상이 되는 중증도를 구체적으로 서술"},
              {key:"comorbidity",label:"동반질환/상태",placeholder:"동반 질환·상태로 인한 적용 불가/가능 조건"},
              {key:"demographics",label:"인구학적 특성",placeholder:"성별, 연령, 인종적 특성"},
              {key:"geographic",label:"지리적/사회적 특성",placeholder:"지리적 접근성, 종교·사회적 특성 등"},
              {key:"other",label:"기타",placeholder:"위에 해당하지 않는 특성"},
            ].map(f=>(
              <div key={f.key} style={{marginBottom:"1rem"}}>
                <label className="form-label">{f.label}</label>
                <textarea className="form-textarea" rows={2} value={form.clinical_situation[f.key as keyof typeof form.clinical_situation]} onChange={e=>updateNested("clinical_situation",f.key,e.target.value)} placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          <div className="form-section">
            <p className="form-section-title">3-3. 현재 의료현장의 의료제품/의료행위</p>
            {form.current_products.map((p,idx)=>(
              <div key={idx} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 2fr auto",gap:"0.6rem",marginBottom:"0.6rem",alignItems:"end"}}>
                {idx===0 && <>
                  {["품목","모델명","제조사","개선하고자 하는 점"].map(h=><label key={h} className="form-label">{h}</label>)}
                  <span/>
                </>}
                <input className="form-input" value={p.item} onChange={e=>{const arr=[...form.current_products];arr[idx].item=e.target.value;update("current_products",arr)}} placeholder="품목"/>
                <input className="form-input" value={p.model} onChange={e=>{const arr=[...form.current_products];arr[idx].model=e.target.value;update("current_products",arr)}} placeholder="모델명"/>
                <input className="form-input" value={p.manufacturer} onChange={e=>{const arr=[...form.current_products];arr[idx].manufacturer=e.target.value;update("current_products",arr)}} placeholder="제조사"/>
                <input className="form-input" value={p.improvement} onChange={e=>{const arr=[...form.current_products];arr[idx].improvement=e.target.value;update("current_products",arr)}} placeholder="개선점"/>
                <button onClick={()=>{if(form.current_products.length>1){const arr=form.current_products.filter((_,i)=>i!==idx);update("current_products",arr)}}} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)"}}>
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
            <button className="btn-outline" style={{fontSize:"0.78rem",padding:"0.4rem 0.8rem"}} onClick={()=>update("current_products",[...form.current_products,{item:"",model:"",manufacturer:"",improvement:""}])}>
              <Plus size={13}/> 행 추가
            </button>
          </div>

          <div className="form-section">
            <p className="form-section-title">3-4. 미충족의료수요</p>
            {[
              {key:"patient",label:"대상자(환자) 관점",placeholder:"만족도, 비용, 접근성, 부작용 등 개선 필요점"},
              {key:"user",label:"사용자(의료인 등) 관점",placeholder:"사용 편의, learning curve, 오류방지, 안전 등"},
              {key:"facility",label:"사용처(의료기관 등) 관점",placeholder:"전기, 공간, 통신, 보관환경 등"},
              {key:"system",label:"시스템 이슈",placeholder:"공급망, 보험급여, 사회/문화적 차이 등"},
            ].map(f=>(
              <div key={f.key} style={{marginBottom:"1rem"}}>
                <label className="form-label">{f.label}</label>
                <textarea className="form-textarea" rows={3} value={form.unmet_needs[f.key as keyof typeof form.unmet_needs]} onChange={e=>updateNested("unmet_needs",f.key,e.target.value)} placeholder={f.placeholder}/>
              </div>
            ))}
          </div>
        </>
      )}

      {/* STEP 4: 해결방안 및 결과 */}
      {step === 4 && (
        <>
          <div className="form-section">
            <p className="form-section-title">3-5. 미충족의료수요 우선순위 및 해결방안</p>
            {form.solutions.map((s,idx)=>(
              <div key={idx} style={{display:"grid",gridTemplateColumns:"60px 1fr 2fr auto",gap:"0.75rem",marginBottom:"0.75rem",alignItems:"end"}}>
                {idx===0 && <>
                  {["우선순위","미충족의료수요","해결방안"].map(h=><label key={h} className="form-label">{h}</label>)}
                  <span/>
                </>}
                <input className="form-input" type="number" min={1} value={s.priority} onChange={e=>{const arr=[...form.solutions];arr[idx].priority=Number(e.target.value);update("solutions",arr)}}/>
                <input className="form-input" value={s.unmet_need} onChange={e=>{const arr=[...form.solutions];arr[idx].unmet_need=e.target.value;update("solutions",arr)}} placeholder="미충족수요 요약"/>
                <input className="form-input" value={s.solution} onChange={e=>{const arr=[...form.solutions];arr[idx].solution=e.target.value;update("solutions",arr)}} placeholder="해결방안 및 기술요소"/>
                <button onClick={()=>{if(form.solutions.length>1){const arr=form.solutions.filter((_,i)=>i!==idx);update("solutions",arr)}}} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)"}}>
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
            <button className="btn-outline" style={{fontSize:"0.78rem",padding:"0.4rem 0.8rem"}} onClick={()=>update("solutions",[...form.solutions,{priority:form.solutions.length+1,unmet_need:"",solution:""}])}>
              <Plus size={13}/> 행 추가
            </button>
          </div>

          <div className="form-section">
            <p className="form-section-title">3-6. 기대되는 결과</p>
            {[
              {key:"performance",label:"기기 성능",placeholder:""},
              {key:"safety",label:"안전성 (환자, 사용자)",placeholder:""},
              {key:"convenience",label:"편의성",placeholder:""},
              {key:"cost",label:"비용",placeholder:""},
              {key:"satisfaction",label:"만족도",placeholder:""},
              {key:"other",label:"기타",placeholder:""},
            ].map(f=>(
              <div key={f.key} style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:"0.75rem",marginBottom:"0.75rem",alignItems:"center"}}>
                <label className="form-label" style={{marginBottom:0}}>{f.label}</label>
                <input className="form-input" value={form.expected_outcomes[f.key as keyof typeof form.expected_outcomes]} onChange={e=>updateNested("expected_outcomes",f.key,e.target.value)} placeholder={f.placeholder}/>
              </div>
            ))}
          </div>

          <div className="form-section">
            <p className="form-section-title">3-7. 미충족의료수요 해결에 따른 임상 결과 영향</p>
            <div style={{marginBottom:"1rem"}}>
              <div className="radio-group">
                {[{v:"expected",l:"영향이 있을 것으로 예상"},{v:"not_expected",l:"영향이 없을 것으로 예상"},{v:"unknown",l:"잘 모르겠음"}].map(o=>(
                  <label key={o.v} className="radio-label"><input type="radio" name="clinical_impact" onChange={()=>update("clinical_impact",o.v)} checked={form.clinical_impact===o.v} style={{accentColor:"var(--teal)"}}/>{o.l}</label>
                ))}
              </div>
            </div>
            <label className="form-label">위와 같이 예상하는 이유</label>
            <p className="form-hint" style={{marginBottom:"0.5rem"}}>임상 연구를 통해 정량적으로 검증 가능한 결과 지표로 설명해 주시기 바랍니다. (예: 혈압 감소, HbA1c 개선, 합병증 발생률 감소, 상처 치유 기간 단축, 재입원율 감소 등)</p>
            <textarea className="form-textarea" rows={4} value={form.clinical_impact_reason} onChange={e=>update("clinical_impact_reason",e.target.value)} placeholder="구체적인 근거와 예상 지표를 기술해 주세요"/>
          </div>

          <div style={{display:"flex",justifyContent:"center",gap:"1rem",marginTop:"2rem"}} className="no-print">
            <button onClick={()=>saveForm("draft")} className="btn-outline">
              <Save size={14}/> 임시저장
            </button>
            <button onClick={()=>saveForm("submitted")} className="btn-primary" style={{padding:"0.75rem 2rem"}}>
              <Send size={14}/> 최종 제출
            </button>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="no-print" style={{display:"flex",justifyContent:"space-between",marginTop:"2rem"}}>
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} className="btn-outline" disabled={step===0}>
          <ChevronLeft size={15}/> 이전
        </button>
        {step < STEPS.length-1 && (
          <button onClick={()=>{saveForm("draft");setStep(s=>Math.min(STEPS.length-1,s+1))}} className="btn-primary">
            다음 <ChevronRight size={15}/>
          </button>
        )}
      </div>
    </div>
  );
}
