// =========================================================
// 미충족의료수요 기반 의료제품 설계서 - 품목코드 7자리 체계
// (회의 확정본 기준)
// =========================================================

export interface CodeOption {
  code: string;
  label: string;
  desc?: string;
}

// ── 1번째 자리: 사용목적 대분류 ──
export const POSITION_1: CodeOption[] = [
  { code: "A", label: "검사", desc: "측정·촬영 등" },
  { code: "B", label: "진단", desc: "진단 또는 의료적 판단 지원 등" },
  { code: "C", label: "치료", desc: "치료 또는 치료의 보조 등" },
  { code: "D", label: "임상적 관리 유도", desc: "예측·예방 등" },
  { code: "E", label: "장애보조·경감", desc: "" },
  { code: "F", label: "정보제공·관리", desc: "모니터링" },
  { code: "G", label: "의약품보조", desc: "" },
  { code: "H", label: "그 밖의 목적", desc: "" },
  { code: "I", label: "융합제품", desc: "" },
];

// ── 2번째 자리: 1번째 자리에 종속된 세부 사용목적 ──
// I(융합제품)를 선택한 경우는 숫자 대신 N(주된 사용목적 개수)을 기재
export const POSITION_2_BY_PARENT: Record<string, CodeOption[]> = {
  A: [
    { code: "1", label: "(의료)영상" },
    { code: "2", label: "생체신호" },
    { code: "3", label: "체외진단지표" },
    { code: "4", label: "기타" },
    { code: "5", label: "2개 이상" },
  ],
  B: [
    { code: "1", label: "(의료)영상" },
    { code: "2", label: "생체신호" },
    { code: "3", label: "체외진단지표" },
    { code: "4", label: "기타" },
    { code: "5", label: "2개 이상" },
  ],
  C: [
    { code: "1", label: "수술 또는 시술(지원)" },
    { code: "2", label: "치료계획 및 모의시술" },
    { code: "3", label: "디지털치료기기" },
    { code: "4", label: "기타" },
  ],
  D: [
    { code: "1", label: "(의료)영상" },
    { code: "2", label: "생체신호" },
    { code: "3", label: "체외진단지표" },
    { code: "4", label: "기타" },
    { code: "5", label: "2개 이상" },
  ],
  E: [
    { code: "1", label: "운동장치" },
    { code: "2", label: "기능보조" },
    { code: "3", label: "기타" },
  ],
  F: [
    { code: "1", label: "의료영상" },
    { code: "2", label: "기타" },
  ],
  G: [
    { code: "1", label: "복약모니터링(이식형) 등" },
    { code: "2", label: "약물주입량 등 계산" },
    { code: "3", label: "동반진단" },
    { code: "4", label: "병용요법·활용 등" },
  ],
  H: [
    { code: "1", label: "마약류 중독 재활" },
    { code: "2", label: "기타" },
  ],
  I: [
    { code: "N", label: "주된 사용목적의 수를 숫자로 기재", desc: "예: 2개 목적이면 '2' 기재" },
  ],
};

// ── 3~5번째 자리: 적용된 디지털기술 (순차 기재) ──
export const POSITION_345: CodeOption[] = [
  { code: "A", label: "독립형소프트웨어기술" },
  { code: "B", label: "인공지능기술" },
  { code: "C", label: "지능형로봇기술" },
  { code: "D", label: "초고성능컴퓨팅기술" },
  { code: "E", label: "가상·융합기술" },
  { code: "X", label: "공란 처리", desc: "디지털기술이 1개 또는 2개만 적용된 경우, 4·5번째 코드를 'X'로 기재" },
  { code: "P", label: "4개 이상 적용", desc: "디지털기술이 4개 이상 적용되는 경우 5번째 코드를 'P'로 기재" },
];

// 3~5번째 자리 작성 규칙 안내문
export const POSITION_345_RULE =
  "A부터 적용되는 디지털기술을 순차적으로 기재합니다. 디지털기술이 1개 또는 2개만 적용된 경우 4번째 및/또는 5번째 코드를 'X'로, 4개 이상 기술이 적용되는 경우 5번째 코드를 'P'로 기재합니다.";

// ── 6번째 자리: 기본 유형 ──
export const POSITION_6: CodeOption[] = [
  { code: "A", label: "의료기기" },
  { code: "B", label: "체외진단의료기기" },
  { code: "C", label: "(A+B) 둘 다 해당" },
];

// ── 7번째 자리: 형태 ──
export const POSITION_7: CodeOption[] = [
  { code: "1", label: "독립형 디지털의료기기소프트웨어" },
  { code: "2", label: "소프트웨어 내장 디지털의료기기" },
  { code: "3", label: "(1+2) 둘 다 해당" },
];

export function getPosition2Options(parentCode: string): CodeOption[] {
  return POSITION_2_BY_PARENT[parentCode] || [];
}
