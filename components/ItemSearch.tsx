"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, ChevronDown, ChevronUp, ClipboardCopy, Check } from "lucide-react";

interface MDItem {
  id: string;
  name: string;
  grade: number;
  purpose: string;
}

const GRADE_COLOR: Record<number, string> = {
  1: "#16a34a",
  2: "#2563eb",
  3: "#d97706",
  4: "#dc2626",
};

interface Props {
  compact?: boolean;
}

export default function ItemSearch({ compact }: Props) {
  const [items, setItems] = useState<MDItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MDItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 데이터 로드 (최초 1회)
  useEffect(() => {
    fetch("/md_items.json")
      .then(r => r.json())
      .then((data: MDItem[]) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // 검색 (한글/영문 모두, ID도 포함)
  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    setExpanded(null);
    if (!q.trim() || q.trim().length < 1) { setResults([]); return; }
    const kw = q.trim().toLowerCase();
    const matched = items.filter(i =>
      i.name.toLowerCase().includes(kw) ||
      i.id.toLowerCase().includes(kw) ||
      i.purpose.toLowerCase().includes(kw)
    ).slice(0, 50); // 최대 50건
    setResults(matched);
  }, [items]);

  const handleCopy = (item: MDItem, field: "name" | "purpose" | "id") => {
    const val = field === "name" ? item.name : field === "purpose" ? item.purpose : item.id;
    navigator.clipboard.writeText(val);
    setCopied(`${item.id}-${field}`);
    setTimeout(() => setCopied(null), 1500);
  };

  const clearSearch = () => { setQuery(""); setResults([]); setExpanded(null); inputRef.current?.focus(); };

  return (
    <div>
      {/* 검색 입력 */}
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        <input
          ref={inputRef}
          className="form-input"
          style={{ paddingLeft: "2.2rem", paddingRight: query ? "2.2rem" : "0.85rem" }}
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder={loading ? "데이터 로딩 중..." : "품목명, 품목ID 또는 사용목적 키워드로 검색 (예: 진료대, 내시경, MRI)"}
          disabled={loading}
        />
        {query && (
          <button onClick={clearSearch} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}>
            <X size={15} />
          </button>
        )}
      </div>

      {/* 결과 요약 */}
      {query.trim() && (
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
          {results.length === 0
            ? "검색 결과가 없습니다."
            : results.length === 50
              ? `50건 이상 — 더 구체적인 키워드를 입력하세요. (총 ${items.length}건 중 검색)`
              : `${results.length}건 검색됨 (총 ${items.length}건 중)`
          }
        </p>
      )}

      {/* 결과 목록 */}
      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: compact ? 400 : 600, overflowY: "auto", overflowX: "hidden" }}>
          {results.map(item => {
            const isOpen = expanded === item.id;
            return (
              <div key={item.id} style={{
                border: `1px solid ${isOpen ? "var(--teal)" : "var(--border)"}`,
                borderRadius: 8,
                flexShrink: 0,  /* 핵심: 압축 방지 */
                background: isOpen ? "var(--teal-pale)" : "var(--white)",
                overflow: "hidden", transition: "border-color 0.15s",
              }}>
                {/* 헤더 행 */}
                <div
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  style={{ padding: "0.75rem 1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {/* 품목ID */}
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.72rem", color: "var(--text-muted)", flexShrink: 0, minWidth: 74 }}>
                    {item.id}
                  </span>
                  {/* 등급 배지 */}
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 600, flexShrink: 0,
                    color: GRADE_COLOR[item.grade] || "var(--text-muted)",
                    background: `${GRADE_COLOR[item.grade] || "#888"}18`,
                    padding: "2px 7px", borderRadius: 4,
                  }}>{item.grade}등급</span>
                  {/* 품목명 */}
                  <span style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--navy)", flex: 1, lineHeight: 1.4 }}>
                    {item.name}
                  </span>
                  {/* 펼치기 */}
                  {isOpen ? <ChevronUp size={15} color="var(--teal)" style={{ flexShrink: 0 }} /> : <ChevronDown size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                </div>

                {/* 펼침 상세 */}
                {isOpen && (
                  <div style={{ borderTop: "1px solid var(--border)", padding: "0.9rem 1rem", background: "var(--white)" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.4rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>사용목적 정의</p>
                    <p style={{ fontSize: "0.84rem", color: "var(--navy)", lineHeight: 1.7, marginBottom: "0.9rem" }}>
                      {item.purpose}
                    </p>
                    {/* 복사 버튼들 */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {[
                        { field: "name" as const, label: "품목명 복사" },
                        { field: "purpose" as const, label: "사용목적 복사" },
                        { field: "id" as const, label: "품목코드 복사" },
                      ].map(btn => {
                        const isCopied = copied === `${item.id}-${btn.field}`;
                        return (
                          <button key={btn.field} onClick={() => handleCopy(item, btn.field)} style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            fontSize: "0.74rem", padding: "0.35rem 0.75rem", borderRadius: 6,
                            border: `1px solid ${isCopied ? "var(--teal)" : "var(--border)"}`,
                            background: isCopied ? "var(--teal-pale)" : "var(--white)",
                            color: isCopied ? "var(--teal)" : "var(--text-secondary)",
                            cursor: "pointer",
                          }}>
                            {isCopied ? <Check size={12} /> : <ClipboardCopy size={12} />}
                            {isCopied ? "복사됨" : btn.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 초기 안내 */}
      {!query.trim() && !loading && (
        <div style={{ padding: "1.5rem", textAlign: "center", background: "var(--sand)", borderRadius: 8, border: "1px dashed var(--border)" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
            총 <strong style={{ color: "var(--navy)" }}>{items.length.toLocaleString()}건</strong>의 의료기기 품목이 검색 가능합니다.<br />
            품목명, 품목ID, 사용목적 키워드로 검색할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
