export interface DesignForm {
  id?: string
  user_id?: string
  user_email?: string
  created_at?: string
  updated_at?: string
  status?: 'draft' | 'submitted'

  // 과제 기본 정보
  iris_number: string
  project_name: string
  main_org: string
  co_org: string

  // 1. 개발 의료제품 정의
  product_definition: string
  product_image_desc: string
  target_items: Array<{ item: string; grade: string; purpose: string }>

  // 2. 적용 형태
  is_single_use: boolean | null
  invasiveness: 'invasive' | 'non-invasive' | 'other' | null
  duration: 'transient' | 'short' | 'long' | 'na' | null
  user_type: 'professional' | 'lay' | null
  usage_description: string

  // 3. 대상군
  target_population: string
  expected_effect: string
  clinical_situation: {
    disease: string
    severity: string
    comorbidity: string
    demographics: string
    geographic: string
    other: string
  }

  // 3-3. 현재 의료현장
  current_products: Array<{ item: string; model: string; manufacturer: string; improvement: string }>

  // 3-4. 미충족의료수요
  unmet_needs: {
    patient: string
    user: string
    facility: string
    system: string
  }

  // 3-5. 해결방안
  solutions: Array<{ priority: number; unmet_need: string; solution: string }>

  // 3-6. 기대되는 결과
  expected_outcomes: {
    performance: string
    safety: string
    convenience: string
    cost: string
    satisfaction: string
    other: string
  }

  // 3-7. 임상 결과 영향
  clinical_impact: 'expected' | 'not_expected' | 'unknown' | null
  clinical_impact_reason: string
}

export const EMPTY_FORM: DesignForm = {
  iris_number: '', project_name: '', main_org: '', co_org: '',
  product_definition: '', product_image_desc: '',
  target_items: [{ item: '', grade: '', purpose: '' }],
  is_single_use: null, invasiveness: null, duration: null, user_type: null,
  usage_description: '',
  target_population: '', expected_effect: '',
  clinical_situation: { disease: '', severity: '', comorbidity: '', demographics: '', geographic: '', other: '' },
  current_products: [{ item: '', model: '', manufacturer: '', improvement: '' }],
  unmet_needs: { patient: '', user: '', facility: '', system: '' },
  solutions: [{ priority: 1, unmet_need: '', solution: '' }],
  expected_outcomes: { performance: '', safety: '', convenience: '', cost: '', satisfaction: '', other: '' },
  clinical_impact: null, clinical_impact_reason: '',
}
