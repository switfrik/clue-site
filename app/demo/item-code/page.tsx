"use client";
import { useState } from "react";
import { Layers, Search as SearchIcon } from "lucide-react";
import ItemSearch from "@/components/ItemSearch";
import CodeTooltipButton from "@/components/CodeTooltipButton";
import {
  POSITION_1, POSITION_345, POSITION_345_RULE,
  POSITION_6, POSITION_7, getPosition2Options,
} from "@/lib/item-code-spec";
import { RotateCcw, Copy, Check, CheckCircle2, Info } from "lucide-react";

type ActiveTab = "search" | "builder";

export default function ItemCodeDemo() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("search");

  // 빌더 상태
  const [pos1, setPos1] = useState("");
  const [pos2, setPos2] = useState("");
  const [pos345, setPos345] = useState(["", "", ""]);
  const [pos6, setPos6] = useState("");
  const [pos7, setPos7] = useState("");
  const [copied, setCopied] = useState(false);

  const pos2Options = getPosition2Options(pos1);

  const resetBuilder = () => {
    setPos1(""); setPos2(""); setPos345(["", "", ""]); setPos6(""); setPos7(""); setCopied(false);
  };

  const handlePos1 = (code: string) => { setPos1(code); setPos2(""); setCopied(false); };
  const handlePos345 = (idx: number, code: string) => {
    setPos345(prev => { const n = [...prev]; n[idx] = code; return n; });
    setCopied(false);
  };

  const builderCode = `${pos1}${pos2}${pos345.join("")}${pos6}${pos7}`;
  const builderComplete = pos1 && pos2 && pos345.every(c => c) && pos6 && pos7;

  const handleCopy = () => {
    navigator.clipboard.writeText(builderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const TABS = [
    { key: "search" as ActiveTab, icon: SearchIcon, label: "품목 검색", desc: "키워드로 품목명·등급·사용목적 검색" },
    { key: "builder" as ActiveTab, icon: Layers, label: "디지털의료기기의 제품코드 생성기", desc: "자리별 클릭으로 7자리 코드 조립" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
      <p className="section-label">의료기기 품목 정보</p>
      <h1 className="section-title">품목 검색 · 코드 빌더</h1>
      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.5rem", lineHeight: 1.7, maxWidth: 600 }}>
        2,389건의 의료기기 품목 DB에서 검색하고, 7자리 디지털의료제품 품목코드를 직접 조립할 수 있습니다.
      </p>

      {/* Tab selector */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
        {TABS.map(tab => {
          const active = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "0.85rem 1.25rem", borderRadius: 10, cursor: "pointer", textAlign: "left",
              border: `1.5px solid ${active ? "var(--teal)" : "var(--border)"}`,
              background: active ? "var(--teal-pale)" : "var(--white)",
              flex: "1 0 220px", transition: "all 0.15s",
            }}>
              <tab.icon size={18} color={active ? "var(--teal)" : "var(--text-muted)"} />
              <div>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: active ? "var(--teal)" : "var(--navy)", marginBottom: 2 }}>{tab.label}</p>
                <p style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{tab.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ===== 품목 검색 탭 ===== */}
      {activeTab === "search" && (
        <div className="form-section" style={{ marginTop: "1.25rem" }}>
          <p className="form-section-title">의료기기 품목 검색 (식약처 소분류 기준)</p>
          <ItemSearch />
          <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "var(--sand)", borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <Info size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              품목명·ID·사용목적 전문 검색 지원. 항목을 클릭하면 펼쳐서 상세 내용을 확인하고 복사할 수 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* ===== 코드 빌더 탭 ===== */}
      {activeTab === "builder" && (
        <div className="form-section" style={{ marginTop: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
            <p className="form-section-title" style={{ marginBottom: 0, paddingBottom: 0, border: "none" }}>
              7자리 품목코드 조립
            </p>
            <button onClick={resetBuilder} className="btn-outline" style={{ fontSize: "0.78rem", padding: "0.4rem 0.8rem" }}>
              <RotateCcw size={13} /> 초기화
            </button>
          </div>
          <div className="divider" style={{ marginBottom: "1.5rem" }} />

          {/* 완성 코드 미리보기 */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", flexWrap: "wrap",
            padding: "1.25rem", marginBottom: "2rem", borderRadius: 10,
            background: builderComplete ? "var(--teal-pale)" : "var(--sand)",
            border: `1.5px solid ${builderComplete ? "var(--teal)" : "var(--border)"}`,
          }}>
            {[pos1, pos2, pos345[0], pos345[1], pos345[2], pos6, pos7].map((c, idx) => (
              <div key={idx} style={{
                width: 44, height: 52, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Mono',monospace", fontSize: "1.3rem", fontWeight: 600,
                background: c ? "var(--white)" : "transparent",
                border: `1.5px dashed ${c ? "var(--teal)" : "var(--border)"}`,
                color: c ? "var(--navy)" : "var(--text-muted)",
              }}>{c || idx + 1}</div>
            ))}
            {builderComplete && (
              <button onClick={handleCopy} className="btn-outline" style={{ marginLeft: "0.5rem", fontSize: "0.78rem", padding: "0.5rem 0.9rem" }}>
                {copied ? <><Check size={13} /> 복사됨</> : <><Copy size={13} /> 복사</>}
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {/* 1번째 */}
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.7rem" }}>
                1번째 자리 <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "0.74rem" }}>— 사용목적 대분류</span>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {POSITION_1.map(opt => (
                  <CodeTooltipButton key={opt.code} code={opt.code} label={opt.label} desc={opt.desc}
                    selected={pos1 === opt.code} onClick={() => handlePos1(opt.code)} color="#d97706" />
                ))}
              </div>
            </div>

            {/* 2번째 */}
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.7rem" }}>
                2번째 자리 <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "0.74rem" }}>
                  {pos1 ? `— 세부 사용목적 (대분류 "${pos1}" 기준)` : "— 먼저 1번째 자리를 선택하세요"}
                </span>
              </p>
              {!pos1 ? (
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>—</p>
              ) : pos2Options.length === 1 && pos2Options[0].code === "N" ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>주된 사용목적의 수를 숫자로 기재:</span>
                  <input
                    type="number" min={1} max={9}
                    value={pos2}
                    onChange={e => setPos2(e.target.value.slice(-1))}
                    placeholder="예) 2"
                    style={{ width: 60, fontFamily: "'DM Mono',monospace", textAlign: "center", padding: "0.4rem", border: "1.5px solid var(--border)", borderRadius: 6, fontSize: "1rem" }}
                  />
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {pos2Options.map(opt => (
                    <CodeTooltipButton key={opt.code} code={opt.code} label={opt.label} desc={opt.desc}
                      selected={pos2 === opt.code} onClick={() => setPos2(opt.code)} color="#d97706" />
                  ))}
                </div>
              )}
            </div>

            {/* 3~5번째 */}
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.5rem" }}>
                3~5번째 자리 <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "0.74rem" }}>— 적용 디지털기술 (순차 기재)</span>
              </p>
              <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "0.9rem", padding: "0.6rem 0.8rem", background: "var(--sand)", borderRadius: 6 }}>
                {POSITION_345_RULE}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                {[0, 1, 2].map(idx => (
                  <div key={idx}>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.5rem", textAlign: "center" }}>{idx + 3}번째</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", justifyContent: "center" }}>
                      {POSITION_345.map(opt => (
                        <CodeTooltipButton key={opt.code} code={opt.code} label={opt.label} desc={opt.desc}
                          selected={pos345[idx] === opt.code} onClick={() => handlePos345(idx, opt.code)}
                          color="#d97706" size={30} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6번째 */}
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.7rem" }}>
                6번째 자리 <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "0.74rem" }}>— 기본 유형</span>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {POSITION_6.map(opt => (
                  <CodeTooltipButton key={opt.code} code={opt.code} label={opt.label}
                    selected={pos6 === opt.code} onClick={() => setPos6(opt.code)} color="#d97706" />
                ))}
              </div>
            </div>

            {/* 7번째 */}
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.7rem" }}>
                7번째 자리 <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "0.74rem" }}>— 형태</span>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {POSITION_7.map(opt => (
                  <CodeTooltipButton key={opt.code} code={opt.code} label={opt.label}
                    selected={pos7 === opt.code} onClick={() => setPos7(opt.code)} color="#d97706" />
                ))}
              </div>
            </div>
          </div>

          {/* 완성 상태 */}
          <div style={{ marginTop: "1.75rem" }}>
            {!builderComplete ? (
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {[pos1, pos2, ...pos345, pos6, pos7].filter(c => c).length}/7 자리 선택됨
              </p>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--teal)", fontWeight: 600 }}>
                <CheckCircle2 size={16} /> 코드 완성:&nbsp;<span className="font-mono" style={{ letterSpacing: "0.15em" }}>{builderCode}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 하단 안내 */}
      <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "var(--navy)", borderRadius: 10 }}>
        <p style={{ fontSize: "0.82rem", color: "#8a9ab0", lineHeight: 1.8 }}>
          <strong style={{ color: "var(--teal-light)" }}>개발 논의 포인트</strong><br />
          · 품목 검색 결과에서 "이 품목으로 선택" 시 해당 품목의 등급/사용목적을 설계서 폼에 자동 반영하는 연동 가능<br />
          · I(융합제품) 선택 시 2번째 자리 숫자 자유 입력 구현됨 — 최솟값 1, 최댓값 9로 제한 중<br />
          · 3~5번째 X/P 자동 적용 로직 미구현 — 연구자가 규칙 확인 후 직접 선택 방식 유지 중<br />
          · 품목 DB: 식약처 소분류 기준 2,389건 (최종 업데이트: {new Date().toLocaleDateString("ko-KR")})
        </p>
      </div>
    </div>
  );
}
