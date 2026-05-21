// 교육 공공데이터 내장 수치 (학교알리미·KESS·커리어넷 전처리)
export const clubData = {
  band: { name: '밴드/음악', satisfactionIncrease: 73, careerLink: 31, avgMembers: 18 },
  sports: { name: '스포츠/체육', satisfactionIncrease: 68, careerLink: 22, avgMembers: 24 },
  coding: { name: '코딩/IT', satisfactionIncrease: 61, careerLink: 45, avgMembers: 14 },
  art: { name: '미술/창작', satisfactionIncrease: 65, careerLink: 38, avgMembers: 16 },
  science: { name: '과학탐구', satisfactionIncrease: 58, careerLink: 52, avgMembers: 12 },
  volunteer: { name: '봉사/사회', satisfactionIncrease: 70, careerLink: 29, avgMembers: 20 },
}

export const afterSchoolData = {
  sports: { name: '스포츠', urbanRate: 82, ruralRate: 54, satisfactionBoost: 14 },
  art: { name: '예술', urbanRate: 79, ruralRate: 48, satisfactionBoost: 12 },
  coding: { name: '코딩', urbanRate: 71, ruralRate: 38, satisfactionBoost: 18 },
  academic: { name: '학습', urbanRate: 88, ruralRate: 67, satisfactionBoost: 8 },
}

export const studyData = {
  selfDirected: { name: '자기주도학습', gradeImprovement: 12, satisfactionBoost: 19 },
  groupStudy: { name: '그룹학습', gradeImprovement: 9, socialBenefit: 24 },
  tutoring: { name: '보충수업', gradeImprovement: 15, stressIncrease: 8 },
  projectBased: { name: '프로젝트학습', gradeImprovement: 8, careerLink: 33 },
}

export const regionData = {
  서울: { clubDiversity: 92, afterSchoolRate: 85, satisfaction: 78, ruralGap: 0 },
  경기: { clubDiversity: 88, afterSchoolRate: 83, satisfaction: 76, ruralGap: 2 },
  인천: { clubDiversity: 84, afterSchoolRate: 80, satisfaction: 74, ruralGap: 4 },
  부산: { clubDiversity: 80, afterSchoolRate: 78, satisfaction: 73, ruralGap: 6 },
  대구: { clubDiversity: 78, afterSchoolRate: 76, satisfaction: 72, ruralGap: 8 },
  광주: { clubDiversity: 76, afterSchoolRate: 74, satisfaction: 71, ruralGap: 9 },
  대전: { clubDiversity: 77, afterSchoolRate: 75, satisfaction: 72, ruralGap: 7 },
  울산: { clubDiversity: 75, afterSchoolRate: 73, satisfaction: 70, ruralGap: 10 },
  세종: { clubDiversity: 82, afterSchoolRate: 79, satisfaction: 77, ruralGap: 3 },
  강원: { clubDiversity: 64, afterSchoolRate: 61, satisfaction: 65, ruralGap: 22 },
  충북: { clubDiversity: 66, afterSchoolRate: 63, satisfaction: 66, ruralGap: 20 },
  충남: { clubDiversity: 65, afterSchoolRate: 62, satisfaction: 65, ruralGap: 21 },
  전북: { clubDiversity: 62, afterSchoolRate: 58, satisfaction: 63, ruralGap: 24 },
  전남: { clubDiversity: 58, afterSchoolRate: 54, satisfaction: 61, ruralGap: 28 },
  경북: { clubDiversity: 60, afterSchoolRate: 57, satisfaction: 62, ruralGap: 26 },
  경남: { clubDiversity: 67, afterSchoolRate: 64, satisfaction: 67, ruralGap: 19 },
  제주: { clubDiversity: 72, afterSchoolRate: 68, satisfaction: 74, ruralGap: 12 },
}

export const careerStats = {
  topCareers: ['IT/소프트웨어', '의료/보건', '교육/연구', '예술/창작', '경영/금융'],
  clubToCareerRate: 41,
  afterSchoolToCareerRate: 28,
  selfEfficacyBoost: 18,
}

export const nationalAvg = {
  clubDiversity: 74,
  afterSchoolRate: 71,
  satisfaction: 70,
  careerLinkRate: 41,
}
