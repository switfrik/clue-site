export interface SurveyQuestion {
  id: string;
  type: "rating5" | "text";
  label: string;
  required: boolean;
}

export const ADVISOR_SURVEY_QUESTIONS: SurveyQuestion[] = [
  { id: "q1", type: "rating5", label: "매칭된 과제의 전공·분야 적합성이 충분했다", required: true },
  { id: "q2", type: "rating5", label: "Stage 1(과제팀 작성) 내용이 Stage 2 자문 작성에 충분한 정보를 제공했다", required: true },
  { id: "q3", type: "rating5", label: "Kick-off meeting이 과제 이해에 도움이 되었다", required: true },
  { id: "q4", type: "rating5", label: "개별 자문 시간이 충분했다", required: true },
  { id: "q5", type: "rating5", label: "Stage 2 작성 양식(항목 구성)이 명확하고 작성하기 적절했다", required: true },
  { id: "q6", type: "rating5", label: "대한의학회의 인증·점검 절차가 합리적이었다", required: true },
  { id: "q7", type: "rating5", label: "전산시스템(설계서 작성·제출)이 사용하기 편리했다", required: true },
  { id: "q8", type: "rating5", label: "자문료 및 계약 절차에 만족한다", required: true },
  { id: "q9", type: "text",    label: "Stage 2 작성 과정에서 가장 어려웠던 점 또는 개선 제안", required: false },
];

export const TEAM_SURVEY_QUESTIONS: SurveyQuestion[] = [
  { id: "q1", type: "rating5", label: "Stage 1 작성 과정에서 설계서 양식이 명확했다", required: true },
  { id: "q2", type: "rating5", label: "매칭된 자문위원 3인의 전문성이 과제에 적합했다", required: true },
  { id: "q3", type: "rating5", label: "Kick-off meeting이 자문 방향 설정에 도움이 되었다", required: true },
  { id: "q4", type: "rating5", label: "개별 자문에서 받은 의견이 실질적이고 구체적이었다", required: true },
  { id: "q5", type: "rating5", label: "Stage 2 자문 결과가 Stage 3·4 작성에 실질적 도움이 되었다", required: true },
  { id: "q6", type: "rating5", label: "자문 일정(Kick-off~개별자문~인증) 진행이 적절한 속도로 이루어졌다", required: true },
  { id: "q7", type: "rating5", label: "대한의학회의 인증 절차 및 안내가 명확했다", required: true },
  { id: "q8", type: "rating5", label: "전산시스템(과제 등록, 설계서 제출, 자문 매칭 확인)이 사용하기 편리했다", required: true },
  { id: "q9", type: "rating5", label: "본 자문 경험이 향후 임상시험/제품개발 계획 구체화에 도움이 될 것이다", required: true },
  { id: "q10", type: "text",   label: "자문 과정에서 가장 어려웠던 점 또는 개선 제안", required: false },
];

export const SURVEY_TARGET_META = {
  advisor: { label: "자문위원 대상", questions: ADVISOR_SURVEY_QUESTIONS },
  team:    { label: "과제팀 대상", questions: TEAM_SURVEY_QUESTIONS },
} as const;

export type SurveyTarget = keyof typeof SURVEY_TARGET_META;
