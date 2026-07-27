/**
 * 太重集团安全管理平台 - 统一模拟数据中心
 * 所有页面从此处读取数据，操作后状态同步影响全局
 */

// ==== 组织架构 ====
export const organizations = [
  { id: 1, name: '太重集团', parentId: null, level: 'group' },
  { id: 2, name: '太原重工', parentId: 1, level: 'company' },
  { id: 3, name: '铸锻件分公司', parentId: 2, level: 'branch' },
  { id: 4, name: '工程起重机公司', parentId: 1, level: 'branch' },
  { id: 5, name: '矿山分公司', parentId: 2, level: 'branch' },
  { id: 6, name: '齿轮分公司', parentId: 2, level: 'branch' },
  { id: 7, name: '核电分公司', parentId: 2, level: 'branch' },
  { id: 8, name: '起重机分公司', parentId: 2, level: 'branch' },
  { id: 9, name: '轨道交通分公司', parentId: 2, level: 'branch' }
];

// 铸锻件分公司部门
export const departments = [
  { id: 1, name: '铸造车间', orgId: 3, zone: '熔炼铸造区' },
  { id: 2, name: '锻压车间', orgId: 3, zone: '锻压加工区' },
  { id: 3, name: '热处理车间', orgId: 3, zone: '热处理区' },
  { id: 4, name: '设备动力部', orgId: 3, zone: '能源介质区' },
  { id: 5, name: '生产保障部', orgId: 3, zone: '仓储装卸区' }
];

// ==== 角色定义 ====
export const ROLES = {
  GROUP_LEADER: { id: 'group_leader', name: '集团领导', orgId: 1, terminal: 'PC', permission: 'readonly' },
  GROUP_SAFETY: { id: 'group_safety', name: '集团安环管理人员', orgId: 1, terminal: 'PC', permission: 'supervision' },
  COMPANY_LEADER: { id: 'company_leader', name: '公司领导/授权审批领导', orgId: 3, terminal: 'PC', permission: 'approve' },
  COMPANY_SAFETY: { id: 'company_safety', name: '公司安环管理人员', orgId: 3, terminal: 'PC', permission: 'manage' },
  DEPT_HEAD: { id: 'dept_head', name: '车间/部门负责人', orgId: 3, terminal: 'PC', permission: 'execute' },
  FIELD_WORKER: { id: 'field_worker', name: '现场人员/监护人', orgId: 3, terminal: 'mobile', permission: 'field' }
};

// 铸锻件分公司人员
export const personnel = [
  { id: 1, name: '张建国', orgId: 3, deptId: 1, role: '生产班长', roles: ['dept_head'],
    qualifications: [{ type: '高处作业证', expiry: '2027-05-15', status: 'valid' }, { type: '安全生产管理证', expiry: '2026-12-30', status: 'valid' }],
    training: ['2025年度安全培训', '2026年春季特种作业培训'] },
  { id: 2, name: '李明辉', orgId: 3, deptId: 1, role: '安全员', roles: ['company_safety'],
    qualifications: [{ type: '注册安全工程师', expiry: '2028-03-20', status: 'valid' }, { type: '特种设备管理证', expiry: '2026-08-15', status: 'expiring' }],
    training: ['2025年度安全培训', '2026年风险分级管控培训'] },
  { id: 3, name: '王志强', orgId: 3, deptId: 2, role: '车间主任', roles: ['dept_head', 'company_leader'],
    qualifications: [{ type: '安全生产管理证', expiry: '2027-01-10', status: 'valid' }, { type: '吊装指挥证', expiry: '2026-11-20', status: 'valid' }],
    training: ['2025年度安全培训'] },
  { id: 4, name: '赵永刚', orgId: 3, deptId: 1, role: '钳工', roles: ['field_worker'],
    qualifications: [{ type: '高处作业证', expiry: '2026-04-15', status: 'expired' }, { type: '焊工证', expiry: '2027-06-30', status: 'valid' }],
    training: ['2025年度安全培训', '2026年高处作业专项培训'] },
  { id: 5, name: '孙志明', orgId: 3, deptId: 4, role: '电工', roles: ['field_worker'],
    qualifications: [{ type: '电工操作证', expiry: '2027-08-20', status: 'valid' }, { type: '高处作业证', expiry: '2027-03-10', status: 'valid' }],
    training: ['2025年度安全培训'] },
  { id: 6, name: '陈文斌', orgId: 3, deptId: 5, role: '安全监督', roles: ['field_worker'],
    qualifications: [{ type: '安全生产管理证', expiry: '2027-02-18', status: 'valid' }, { type: '注册安全工程师', expiry: '2027-12-31', status: 'valid' }],
    training: ['2025年度安全培训', '2026年应急管理培训'] },
  { id: 7, name: '刘大伟', orgId: 3, deptId: 2, role: '吊装工', roles: ['field_worker'],
    qualifications: [{ type: '吊装操作证', expiry: '2027-04-22', status: 'valid' }, { type: '司索证', expiry: '2026-10-05', status: 'valid' }],
    training: ['2025年度安全培训', '2026年吊装作业专项培训'] },
  { id: 8, name: '周志远', orgId: 4, deptId: null, role: '安全总监', roles: ['company_safety'],
    qualifications: [{ type: '注册安全工程师', expiry: '2028-06-15', status: 'valid' }],
    training: ['2025年度安全培训'] }
];

// ==== 厂区区域定义 ====
// ==== 厂区中心点 ====
export const FACTORY_CENTER = { lng: 112.51, lat: 37.58, name: '太重智能高端产业园区·机加厂房' };
// 演示优化：区域范围整体放大（绕厂区中心均匀缩放，累计 4 倍），降低四色图密集感、突出重点
const MAP_SCALE = 4;
function scaleLngLat(lng, lat) {
  const f = (v, c) => +(c + MAP_SCALE * (v - c)).toFixed(7);
  return [f(lng, FACTORY_CENTER.lng), f(lat, FACTORY_CENTER.lat)];
}
function scalePath(path) { return path.map(([lng, lat]) => scaleLngLat(lng, lat)); }
// ==== 机加联合厂房边界（约500㎡，顺时针 NW,NE,SE,SW）====
export const PARK_BOUNDARY = scalePath([
  [112.509870,37.580110],
  [112.510130,37.580110],
  [112.510130,37.579890],
  [112.509870,37.579890]
]);

export const factoryZones = [
  { id: 'zone-1', name: '原料存放区', x: 80, y: 60, w: 160, h: 110, riskLevel: '一般', riskColor: '#eab308', deptId: 1, desc: '原材料与坯料存放区域',
    path: [[112.5098908,37.5800185],[112.5099474,37.5800185],[112.5099474,37.5800924],[112.5098908,37.5800924]] },
  { id: 'zone-2', name: '机加工区', x: 280, y: 60, w: 150, h: 110, riskLevel: '较大', riskColor: '#f59e0b', deptId: 2, desc: '车铣刨磨机械加工区域',
    path: [[112.5099474,37.5800185],[112.5100040,37.5800185],[112.5100040,37.5800924],[112.5099474,37.5800924]] },
  { id: 'zone-3', name: '焊接作业区', x: 470, y: 60, w: 140, h: 110, riskLevel: '重大', riskColor: '#ef4444', deptId: 3, desc: '电焊与气体保护焊作业区域',
    path: [[112.5100040,37.5800185],[112.5100606,37.5800185],[112.5100606,37.5800924],[112.5100040,37.5800924]] },
  { id: 'zone-4', name: '装配区', x: 80, y: 210, w: 170, h: 120, riskLevel: '较大', riskColor: '#f59e0b', deptId: 2, desc: '结构件装配与调试区域',
    path: [[112.5100606,37.5800185],[112.5101092,37.5800185],[112.5101092,37.5800924],[112.5100606,37.5800924]] },
  { id: 'zone-5', name: '涂装/危化作业区', x: 290, y: 210, w: 180, h: 120, riskLevel: '重大', riskColor: '#ef4444', deptId: 4, desc: '涂装及危险化学品使用区域',
    path: [[112.5098908,37.5799076],[112.5099663,37.5799076],[112.5099663,37.5799815],[112.5098908,37.5799815]] },
  { id: 'zone-6', name: '仓储区', x: 510, y: 210, w: 140, h: 120, riskLevel: '较大', riskColor: '#f59e0b', deptId: 5, desc: '成品与物料仓储区域',
    path: [[112.5099663,37.5799076],[112.5100417,37.5799076],[112.5100417,37.5799815],[112.5099663,37.5799815]] },
  { id: 'zone-7', name: '设备动力/通道区', x: 200, y: 370, w: 300, h: 100, riskLevel: '一般', riskColor: '#eab308', deptId: 4, desc: '设备动力与物流通道区域',
    path: [[112.5100417,37.5799076],[112.5101092,37.5799076],[112.5101092,37.5799815],[112.5100417,37.5799815]] }
];

// ==== 风险点 ====
export const riskPoints = [
  { id: 'rp-1', zoneId: 'zone-1', name: '原料堆垛区', category: '物体打击/坍塌', level: '一般', deptId: 1, responsibleName: '张建国',
    measures: '限高码放、防倾倒支护、通道畅通', lastReview: '2026-07-10', status: '正常', lng: 112.5099191, lat: 37.58007 },
  { id: 'rp-2', zoneId: 'zone-1', name: '坯料吊装点', category: '起重伤害', level: '较大', deptId: 1, responsibleName: '李明辉',
    measures: '吊索具日检、限位器、声光报警、警戒区域', lastReview: '2026-07-08', status: '正常', lng: 112.5099191, lat: 37.580041 },
  { id: 'rp-3', zoneId: 'zone-2', name: '机加工设备工位', category: '机械伤害/噪声', level: '较大', deptId: 2, responsibleName: '王志强',
    measures: '安全光幕、双手操作装置、隔音罩', lastReview: '2026-07-05', status: '正常', lng: 112.5099757, lat: 37.58005545 },
  { id: 'rp-4', zoneId: 'zone-4', name: '装配起重作业区', category: '起重伤害/物体打击', level: '较大', deptId: 2, responsibleName: '刘大伟',
    measures: '吊索具日检、限位器、声光报警、警戒区域', lastReview: '2026-07-12', status: '隐患待整改', lng: 112.5100849, lat: 37.58005545 },
  { id: 'rp-5', zoneId: 'zone-5', name: '涂装作业点', category: '火灾/中毒', level: '重大', deptId: 4, responsibleName: '孙志明',
    measures: '防爆电气、可燃气体报警、通风联锁、MSDS告知', lastReview: '2026-07-03', status: '正常', lng: 112.50992855, lat: 37.57994455 },
  { id: 'rp-6', zoneId: 'zone-6', name: '危险品暂存库', category: '火灾/爆炸/中毒', level: '较大', deptId: 5, responsibleName: '陈文斌',
    measures: '防爆电气、可燃气体报警、通风联锁、MSDS告知', lastReview: '2026-07-09', status: '正常', lng: 112.5100040, lat: 37.57994455 },
  { id: 'rp-7', zoneId: 'zone-7', name: '配电与动力点', category: '触电/火灾', level: '较大', deptId: 4, responsibleName: '孙志明',
    measures: '五防系统、绝缘监测、自动灭火装置', lastReview: '2026-07-01', status: '正常', lng: 112.51007545, lat: 37.57994455 }
];

// 演示优化：风险点坐标随区域一同放大（累计 4 倍，与 factoryZones / PARK_BOUNDARY 保持一致，点仍落在其所属区域内）
riskPoints.forEach(rp => {
  if (rp.lng && rp.lat) { const s = scaleLngLat(rp.lng, rp.lat); rp.lng = s[0]; rp.lat = s[1]; }
});
// 演示优化：区域多边形随厂区范围一同放大（累计 4 倍；x/y/w/h 为 2D 平面图布局坐标，保持不动，避免影响平面图）
factoryZones.forEach(z => { if (z.path && z.path.length) z.path = scalePath(z.path); });

// ==== 责任书签订流程步骤 ====
export const RESPONSIBILITY_STEPS = [
  { key: 'sign', label: '签订责任书', role: '车间/部门负责人' },
  { key: 'approve', label: '主管领导审批', role: '分管领导' },
  { key: 'publish', label: '公示签署', role: '公司安环室' },
  { key: 'assess', label: '定期考核', role: '公司安环室' },
  { key: 'rectify', label: '整改闭环', role: '车间/部门负责人' }
];

// ==== 安全责任书数据 ====
export const responsibilityChains = [
  {
    id: 'ZR-2026-001', title: '2026年度安全生产目标责任书', type: '年度签订',
    period: '2026-01-01 ~ 2026-12-31', orgName: '铸锻件分公司',
    deptName: '铸造车间', responsibleName: '张建国',
    currentStep: 4, // 已完成4步，第5步待整改
    assessment: { score: 92, result: '优秀', issues: ['消防器材月检记录不完整'], improvements: '已补充记录并建立双人复核制度' },
    timeline: [
      { time: '2026-01-05', action: '张建国签署安全生产目标责任书', operator: '张建国' },
      { time: '2026-01-08', action: '分管领导王志强审批通过', operator: '王志强' },
      { time: '2026-01-10', action: '安环室公示签署，存档备案', operator: '李明辉' },
      { time: '2026-07-05', action: '半年度考核：92分（优秀），发现1项改进项', operator: '李明辉' }
    ]
  },
  {
    id: 'ZR-2026-002', title: '2026年度安全生产目标责任书', type: '年度签订',
    period: '2026-01-01 ~ 2026-12-31', orgName: '铸锻件分公司',
    deptName: '锻压车间', responsibleName: '王志强',
    currentStep: 4,
    assessment: { score: 96, result: '优秀', issues: [], improvements: '—' },
    timeline: [
      { time: '2026-01-05', action: '王志强签署安全生产目标责任书', operator: '王志强' },
      { time: '2026-01-08', action: '分管领导审批通过（因本人即审批领导，由公司安环备案）', operator: '李明辉' },
      { time: '2026-01-10', action: '安环室公示签署，存档备案', operator: '李明辉' },
      { time: '2026-07-05', action: '半年度考核：96分（优秀），无整改项', operator: '李明辉' }
    ]
  },
  {
    id: 'ZR-2026-003', title: '2026年度安全生产目标责任书', type: '年度签订',
    period: '2026-01-01 ~ 2026-12-31', orgName: '铸锻件分公司',
    deptName: '热处理车间', responsibleName: '李明辉',
    currentStep: 3, // 完成公示，等待考核
    assessment: null,
    timeline: [
      { time: '2026-01-05', action: '李明辉签署安全生产目标责任书', operator: '李明辉' },
      { time: '2026-01-07', action: '分管领导王志强审批通过', operator: '王志强' },
      { time: '2026-01-10', action: '安环室公示签署，存档备案', operator: '李明辉' }
    ]
  }
];


// ==== 隐患状态枚举 ====
export const HAZARD_STATUS = {
  PENDING_ACCEPT: '待受理',
  PENDING_RECTIFY: '待整改',
  RECTIFYING: '整改中',
  PENDING_REVIEW: '待复查',
  CLOSED: '已闭环',
  REJECTED: '已退回'
};

export const HAZARD_SEVERITY = {
  MAJOR: '重大',
  LARGE: '较大',
  NORMAL: '一般',
  LOW: '低'
};

// ==== 隐患数据 ====
export const hazards = [
  {
    id: 'YH20260712001',
    source: '分公司计划检查', severity: '重大', status: '待整改',
    orgId: 3, deptId: 2, zoneId: 'zone-4', riskPointId: 'rp-4',
    title: '桥式起重机A区吊索具磨损超标',
    description: '巡检发现5T吊带出现纤维断裂，磨损超过报废标准10%',
    deadline: '2026-07-25', rectifierId: 3, rectifierName: '王志强',
    inspectorId: 6, inspectorName: '陈文斌',
    createTime: '2026-07-12 08:30', acceptTime: '2026-07-12 09:15',
    evidence: ['吊带照片_20260712.jpg'], rectificationPlan: '更换磨损吊带，全区域吊索具普查',
    overdue: false,
    timeline: [
      { time: '2026-07-12 08:30', action: '现场人员巡检发现吊索具磨损', operator: '陈文斌' },
      { time: '2026-07-12 09:15', action: '公司安环人员受理并分派至锻压车间', operator: '李明辉' },
      { time: '2026-07-12 09:30', action: '王志强确认接收整改任务', operator: '王志强' }
    ]
  },
  {
    id: 'YH20260710001',
    source: '公司监督检查', severity: '重大', status: '整改中',
    orgId: 3, deptId: 1, zoneId: 'zone-1', riskPointId: 'rp-1',
    title: '中频炉冷却水系统压力偏低',
    description: '中频炉冷却水循环压力低于0.3MPa警戒值，存在炉体过热风险',
    deadline: '2026-07-20', rectifierId: 1, rectifierName: '张建国',
    inspectorId: 2, inspectorName: '李明辉',
    createTime: '2026-07-10 14:00', acceptTime: '2026-07-10 14:30',
    evidence: ['冷却系统压力表读数.jpg'], rectificationPlan: '排查冷却水管路泄漏点，更换老化密封件',
    overdue: false,
    timeline: [
      { time: '2026-07-10 14:00', action: '专项检查发现冷却系统异常', operator: '李明辉' },
      { time: '2026-07-10 14:30', action: '分派至铸造车间限期整改', operator: '李明辉' },
      { time: '2026-07-11 08:00', action: '张建国开始整改：排查管路', operator: '张建国' },
      { time: '2026-07-13 16:00', action: '更换密封件中，预计7月15日完成', operator: '张建国' }
    ]
  },
  {
    id: 'YH20260708001',
    source: '隐患随手拍', severity: '较大', status: '待复查',
    orgId: 3, deptId: 4, zoneId: 'zone-5', riskPointId: 'rp-5',
    title: '屋面通风器防坠落网锈蚀',
    description: '现场人员巡检发现厂房屋面检修区防坠落网多处锈蚀',
    deadline: '2026-07-15', rectifierId: 5, rectifierName: '孙志明',
    inspectorId: 6, inspectorName: '陈文斌', reviewerId: 2,
    createTime: '2026-07-08 10:00', acceptTime: '2026-07-08 11:00',
    evidence: ['防坠落网锈蚀照片_20260708.jpg'],
    rectificationPlan: '更换全部锈蚀网片，刷防锈漆',
    rectifiedAt: '2026-07-13 16:00',
    rectifiedEvidence: ['更换后照片_20260713.jpg'],
    overdue: false,
    timeline: [
      { time: '2026-07-08 10:00', action: '移动巡检上报屋面防坠落网锈蚀', operator: '现场人员' },
      { time: '2026-07-08 11:00', action: '安环人员受理并分派至设备动力部', operator: '李明辉' },
      { time: '2026-07-13 15:00', action: '孙志明完成防坠落网更换', operator: '孙志明' },
      { time: '2026-07-13 16:00', action: '提交整改反馈，等待复查', operator: '孙志明' }
    ]
  },
  {
    id: 'YH20260705001',
    source: '分公司计划检查', severity: '一般', status: '已闭环',
    orgId: 3, deptId: 5, zoneId: 'zone-6', riskPointId: 'rp-6',
    title: '危险品库通风口百叶窗损坏',
    description: '2#通风口百叶窗叶片变形，影响通风量',
    deadline: '2026-07-10', rectifierId: 6, rectifierName: '陈文斌',
    inspectorId: 2, inspectorName: '李明辉',
    createTime: '2026-07-05 09:00', acceptTime: '2026-07-05 09:30',
    evidence: [], rectificationPlan: '更换百叶窗组件',
    rectifiedAt: '2026-07-06 14:00', reviewedAt: '2026-07-07 10:00',
    reviewResult: '整改合格，予以闭环',
    overdue: false,
    timeline: [
      { time: '2026-07-05 09:00', action: '巡检发现百叶窗损坏', operator: '陈文斌' },
      { time: '2026-07-05 09:30', action: '分派至生产保障部整改', operator: '李明辉' },
      { time: '2026-07-06 14:00', action: '完成百叶窗更换', operator: '陈文斌' },
      { time: '2026-07-07 10:00', action: '复查通过，隐患闭环', operator: '李明辉' }
    ]
  },
  {
    id: 'YH20260701001',
    source: '隐患随手拍', severity: '重大', status: '已闭环',
    orgId: 3, deptId: 1, zoneId: 'zone-1', riskPointId: 'rp-2',
    title: '浇注坑区域天车限位器失效',
    description: '天车大车行走限位开关机械卡滞，存在冲顶风险',
    deadline: '2026-07-05', rectifierId: 1, rectifierName: '张建国',
    inspectorId: 6, inspectorName: '陈文斌',
    createTime: '2026-07-01 07:30', acceptTime: '2026-07-01 08:00',
    rectifiedAt: '2026-07-02 16:00', reviewedAt: '2026-07-03 09:00',
    reviewResult: '限位器已更换并测试合格，予以闭环',
    overdue: false,
    timeline: [
      { time: '2026-07-01 07:30', action: '移动巡检发现天车限位器故障', operator: '陈文斌' },
      { time: '2026-07-01 08:00', action: '紧急分派至铸造车间', operator: '李明辉' },
      { time: '2026-07-02 16:00', action: '完成限位器更换与测试', operator: '张建国' },
      { time: '2026-07-03 09:00', action: '复查合格，隐患闭环', operator: '李明辉' }
    ]
  },
  {
    id: 'YH20260726001',
    source: '分公司计划检查', severity: '较大', status: '待复查',
    orgId: 3, deptId: 2, zoneId: 'zone-2', riskPointId: 'rp-3',
    title: '锻压车间行车检修平台临边防护栏杆缺失',
    description: '分公司计划检查发现 8000T 锻压机上方行车检修平台东侧临边防护栏杆脱落，高处作业存在坠落风险',
    deadline: '2026-07-28', rectifierId: 2, rectifierName: '王志强',
    inspectorId: 2, inspectorName: '李明辉',
    createTime: '2026-07-25 09:00', acceptTime: '2026-07-25 09:30',
    evidence: ['检修平台临边照片_20260725.jpg'],
    rectificationPlan: '恢复临边防护栏杆并加固，高处作业前验收',
    rectifiedAt: '2026-07-26 14:00',
    rectifiedEvidence: ['栏杆恢复后照片_20260726.jpg'],
    overdue: false,
    timeline: [
      { time: '2026-07-25 09:00', action: '分公司计划检查发现检修平台临边防护缺失', operator: '班组长' },
      { time: '2026-07-25 09:30', action: '班组长受理并分派至锻压车间整改', operator: '班组长' },
      { time: '2026-07-26 14:00', action: '王志强完成栏杆恢复并加固', operator: '王志强' },
      { time: '2026-07-26 15:00', action: '提交整改反馈，待安全管理人员复查', operator: '王志强' }
    ]
  }
];

// ==== 安全督办状态枚举 ====
export const SUPERVISION_STATUS = {
  PENDING_RECEIVE: '待接收',
  FOLLOWING: '跟进中',
  PENDING_FEEDBACK: '待反馈确认',
  CLOSED: '已关闭'
};

// ==== 安全督办数据 ====
export const supervisions = [
  {
    id: 'DB20260713001',
    hazardId: 'YH20260712001', hazardTitle: '桥式起重机A区吊索具磨损超标',
    severity: '重大', orgId: 3, orgName: '铸锻件分公司',
    initiatorName: '公司安环·王总监', status: '跟进中',
    opinion: '桥式起重机吊索具磨损涉及重大起重伤害风险，请铸锻件分公司立即组织排查、更换，并在2日内反馈处置进度',
    createTime: '2026-07-13 10:00', receiveTime: '2026-07-13 10:30',
    feedback: [],
    timeline: [
      { time: '2026-07-13 10:00', action: '公司安环发起重大隐患督办', operator: '公司安环·王总监' },
      { time: '2026-07-13 10:30', action: '铸锻件分公司确认接收督办', operator: '李明辉' }
    ]
  },
  {
    id: 'DB20260714001',
    hazardId: 'YH20260710001', hazardTitle: '中频炉冷却水系统压力偏低',
    severity: '重大', orgId: 3, orgName: '铸锻件分公司',
    initiatorName: '公司安环·王总监', status: '跟进中',
    opinion: '中频炉属于重大危险源，请每日汇报冷却系统检修进度，确保7月20日前完成',
    createTime: '2026-07-14 09:00', receiveTime: '2026-07-14 09:15',
    feedback: [
      { time: '2026-07-14 16:00', content: '已完成管路排查，发现两处微漏点，正在更换密封件，预计7月16日完成', operator: '李明辉' }
    ],
    timeline: [
      { time: '2026-07-14 09:00', action: '公司安环就冷却系统隐患发起督办', operator: '公司安环·王总监' },
      { time: '2026-07-14 09:15', action: '铸锻件分公司接收督办', operator: '李明辉' },
      { time: '2026-07-14 16:00', action: '提交首次处置进度反馈', operator: '李明辉' }
    ]
  }
];

// ==== 特殊作业票状态枚举 ====
export const WORK_TYPE = {
  HIGH_ALTITUDE: { key: 'HIGH_ALTITUDE', label: '高处作业', icon: '🏗️' },
  FIRE: { key: 'FIRE', label: '动火作业', icon: '🔥' },
  LIFTING: { key: 'LIFTING', label: '起重吊装', icon: '⛓️' },
  TEMPORARY_ELECTRICITY: { key: 'TEMPORARY_ELECTRICITY', label: '临时用电', icon: '⚡' }
};

export const WORK_PERMIT_STATUS = {
  DRAFT: '草稿',
  PENDING_SAFETY_REVIEW: '待安环审核',
  PENDING_LEADER_APPROVAL: '待领导审批',
  PENDING_GUARDIAN: '待监护确认',
  IN_PROGRESS: '作业中',
  PENDING_ACCEPTANCE: '待完工验收',
  ARCHIVED: '已归档',
  REJECTED: '已驳回',
  PAUSED: '已暂停'
};

export const WORK_PERMIT_STEPS = [
  { key: 'DRAFT', label: '提交申请', role: '作业申请人', icon: '📝' },
  { key: 'PENDING_CHECK', label: '前置核验', role: '系统自动', icon: '🔍' },
  { key: 'PENDING_SAFETY_REVIEW', label: '分级审批链', role: '公司安环人员', icon: '👀' },
  { key: 'PENDING_GUARDIAN', label: '监护确认', role: '现场监护人', icon: '✅' },
  { key: 'IN_PROGRESS', label: '作业执行', role: '作业人员', icon: '🔧' },
  { key: 'PENDING_ACCEPTANCE', label: '完工验收', role: '公司安环人员', icon: '📋' },
  { key: 'ARCHIVED', label: '归档', role: '公司安环人员', icon: '📁' }
];

// ==== 危险作业分级审批矩阵（依据 TYHI/ZDJ-B0523-2025/A 危险作业安全管控制度）====
// 按「作业类型 + 作业级别」差异化审批链，逐级加签；validity 为安全作业许可证有效期
export const workApprovalMatrix = {
  HIGH_ALTITUDE: {
    label: '高处作业',
    levels: [
      { level: '一级', range: '2m–5m（含5m）', validity: '—',
        chain: ['作业申请部门负责人', '作业现场部门负责人', '分公司健康安全管理室负责人'] },
      { level: '二级', range: '5m–15m（含15m）', validity: '—',
        chain: ['作业申请部门负责人', '作业现场部门负责人', '分公司健康安全管理室负责人', '作业申请部门分管领导'] },
      { level: '三级', range: '15m–30m（含30m）', validity: '—',
        chain: ['作业申请部门负责人', '作业现场部门负责人', '分公司健康安全管理室负责人', '作业申请部门分管领导', '分公司主要负责人'] },
      { level: '特级', range: '30m以上', validity: '—',
        chain: ['作业申请部门负责人', '作业现场部门负责人', '分公司健康安全管理室负责人', '作业申请部门分管领导', '分公司主要负责人', '集团健康安全环保部'] }
    ]
  },
  TEMPORARY_ELECTRICITY: {
    label: '临时用电作业',
    levels: [
      { level: '—', range: '临时电气线路作业', validity: '15天',
        chain: ['作业申请部门负责人', '作业现场部门负责人', '分公司设备能源室', '分公司健康安全管理室'] }
    ]
  },
  LIFTING: {
    label: '特殊起重吊装作业',
    levels: [
      { level: '特殊', range: '大型/超重/交叉吊装', validity: '—',
        // 依据制度附件3《吊装作业安全管理实施细则》第十三条 + 附件3-1《特殊起重吊装作业审批表》签字栏
        // 审查节点为：作业现场部门负责人 → 设备能源室 → 技术工艺室（非健康安全管理室），报申请部门分管领导审批
        chain: ['作业申请部门负责人', '作业现场部门负责人', '分公司设备能源室', '技术工艺室负责人', '作业申请部门分管领导'] }
    ]
  },
  FIRE: {
    label: '动火作业',
    levels: [
      { level: '二级', range: '一般动火（有效期72小时）', validity: '72小时',
        chain: ['作业申请部门负责人', '作业现场部门负责人', '分公司健康安全管理室负责人'] },
      { level: '一级', range: '较大动火（有效期8小时）', validity: '8小时',
        chain: ['作业申请部门负责人', '作业现场部门负责人', '分公司健康安全管理室负责人', '分公司主要负责人'] },
      { level: '特级', range: '重大动火（有效期8小时）', validity: '8小时',
        chain: ['作业申请部门负责人', '作业现场部门负责人', '分公司健康安全管理室负责人', '分公司主要负责人', '集团公司武保部（或能源管理部门）'] }
    ]
  }
};

// 依据作业类型 + 级别取审批链字符串（用于列表/详情展示）
export function getApprovalChain(workType, level) {
  const cfg = workApprovalMatrix[workType];
  if (!cfg) return '';
  const hit = cfg.levels.find(l => l.level === level) || cfg.levels[0];
  return hit ? hit.chain.join(' → ') : '';
}

// 依据作业类型 + 级别取有效期
export function getWorkValidity(workType, level) {
  const cfg = workApprovalMatrix[workType];
  if (!cfg) return '—';
  const hit = cfg.levels.find(l => l.level === level) || cfg.levels[0];
  return hit ? hit.validity : '—';
}

// ==== 危险作业审批表签字栏（还原 PDF《危险作业审批表》固定签字栏样式）====
// 每个作业类型列出审批表完整签字格（依据制度附件 1-1~4-2），
// 并按「作业类型 + 级别」标记哪些环节需签、哪些层级不涉及可空缺。
export const workPermitSignForms = {
  HIGH_ALTITUDE: {
    label: '高处作业审批表',
    columns: [
      '申请部门负责人意见', '作业现场负责人意见', '健康安全环保室负责人意见',
      '申请部门分管领导意见', '分公司主要负责人意见', '公司安全管理部门意见'
    ],
    requiredByLevel: {
      '一级': ['申请部门负责人意见', '作业现场负责人意见', '健康安全环保室负责人意见'],
      '二级': ['申请部门负责人意见', '作业现场负责人意见', '健康安全环保室负责人意见', '申请部门分管领导意见'],
      '三级': ['申请部门负责人意见', '作业现场负责人意见', '健康安全环保室负责人意见', '申请部门分管领导意见', '分公司主要负责人意见'],
      '特级': ['申请部门负责人意见', '作业现场负责人意见', '健康安全环保室负责人意见', '申请部门分管领导意见', '分公司主要负责人意见', '公司安全管理部门意见']
    }
  },
  TEMPORARY_ELECTRICITY: {
    label: '临时用电审批表',
    columns: [
      '申请部门（单位）负责人意见', '作业现场负责人意见', '设备能源室负责人意见', '健康安全环保室（备案）意见'
    ],
    requiredByLevel: {
      '—': ['申请部门（单位）负责人意见', '作业现场负责人意见', '设备能源室负责人意见', '健康安全环保室（备案）意见']
    }
  },
  LIFTING: {
    label: '特殊起重吊装作业审批表',
    columns: [
      '申请部门负责人意见', '作业场所负责人意见', '设备能源室负责人意见', '技术工艺室负责人意见', '申请部门分管副经理意见'
    ],
    requiredByLevel: {
      '特殊': ['申请部门负责人意见', '作业场所负责人意见', '设备能源室负责人意见', '技术工艺室负责人意见', '申请部门分管副经理意见']
    }
  },
  FIRE: {
    label: '动火作业审批表',
    columns: [
      '申请部门（车间）负责人意见', '作业现场负责人意见', '安全管理部门意见', '分公司领导（主要负责人）意见', '公司能源管理部门（或武装保卫部）意见', '完工验收意见'
    ],
    requiredByLevel: {
      '二级': ['申请部门（车间）负责人意见', '作业现场负责人意见', '安全管理部门意见'],
      '一级': ['申请部门（车间）负责人意见', '作业现场负责人意见', '安全管理部门意见', '分公司领导（主要负责人）意见', '公司能源管理部门（或武装保卫部）意见'],
      '特级': ['申请部门（车间）负责人意见', '作业现场负责人意见', '安全管理部门意见', '分公司领导（主要负责人）意见', '公司能源管理部门（或武装保卫部）意见']
    }
  }
};

// ==== 隐患排查治理流程配置（依据《平台流程节点》隐患排查治理）====
// 三套来源对应差异化流转节点
export const hazardFlowConfig = {
  COMPANY_SUPERVISION: {
    key: 'COMPANY_SUPERVISION',
    label: '公司监督检查',
    desc: '公司层级组织的监督检查，问题闭环需经部门领导与人力资源部',
    nodes: ['起草人', '检查组组长', '部门领导', '责任单位负责人', '整改牵头人', '责任单位负责人', '起草人', '部门领导', '人力资源部']
  },
  BRANCH_PLAN: {
    key: 'BRANCH_PLAN',
    label: '分公司计划检查',
    desc: '分公司按计划开展的日常检查，班组—安全管理人员闭环',
    nodes: ['起草人', '班组长/起草人', '班组长', '安全管理人员', '整改责任人', '安全管理人员']
  },
  QUICK_SNAP: {
    key: 'QUICK_SNAP',
    label: '隐患随手拍',
    desc: '员工移动端随手上报，流程与分公司计划检查一致',
    nodes: ['起草人', '班组长/起草人', '班组长', '安全管理人员', '整改责任人', '安全管理人员']
  }
};

// 隐患来源文案 → 流程配置 key 的映射
export const hazardSourceToFlow = {
  // 三套制度来源（规范命名，直接对应流程节点）
  '公司监督检查': 'COMPANY_SUPERVISION',
  '分公司计划检查': 'BRANCH_PLAN',
  '隐患随手拍': 'QUICK_SNAP',
  // 兼容既有演示数据的来源文案
  '日常巡检': 'BRANCH_PLAN',
  '专项检查': 'COMPANY_SUPERVISION',
  '移动巡检': 'QUICK_SNAP',
  '上级督查': 'COMPANY_SUPERVISION',
  '投诉举报': 'QUICK_SNAP',
  '员工举报': 'QUICK_SNAP',
  '设备监测': 'BRANCH_PLAN',
  '其他': 'BRANCH_PLAN'
};

// ==== 特殊作业数据 ====
export const workPermits = [
  // 草稿状态 — 展示新建申请流程的起点
  {
    id: 'GZ20260716003', workType: 'TEMPORARY_ELECTRICITY', status: '草稿',
    orgId: 3, deptId: 5, zoneId: 'zone-3', zoneName: '机加工车间南跨',
    title: '机加工车间南跨临时用电接线',
    applicantId: 9, applicantName: '赵明辉', applicantDept: '机加工车间',
    duration: '2026-07-16 08:00 ~ 2026-07-16 18:00',
    voltage: '380V', power: '30kW', validity: '15天',
    approvalChain: '作业申请部门负责人 → 作业现场部门负责人 → 分公司设备能源室 → 分公司健康安全管理室',
    workers: [],
    guardianId: null, guardianName: null,
    safetyMeasures: [],
    riskHighlights: [],
    checks: [],
    reviewTime: null, reviewName: null,
    approveTime: null, approveName: null,
    guardianTime: null, startTime: null, finishTime: null, archiveTime: null,
    timeline: []
  },
  {
    id: 'GZ20260715001', workType: 'HIGH_ALTITUDE', status: '待监护确认',
    orgId: 3, deptId: 4, zoneId: 'zone-5', zoneName: '厂房屋面检修区',
    title: '厂房屋面通风器检修高处作业',
    applicantId: 5, applicantName: '孙志明', applicantDept: '设备动力部',
    height: '8.5m', workLevel: '二级', heightLevel: '5m–15m',
    approvalChain: '作业申请部门负责人 → 作业现场部门负责人 → 分公司健康安全管理室负责人 → 作业申请部门分管领导', duration: '2026-07-15 08:00 ~ 2026-07-15 17:00',
    workers: [{ id: 5, name: '孙志明', role: '作业人' }, { id: 6, name: '陈文斌', role: '监护人' }],
    guardianId: 6, guardianName: '陈文斌',
    safetyMeasures: ['安全帽+安全带+安全绳', '生命线系统', '防坠落网', '警戒区域设置'],
    weatherCheck: '晴，风力3级，温度26°C', weatherPass: true,
    riskHighlights: ['坠落高度8.5m', '屋面结构承载确认', '工具防掉落措施'],
    checks: [
      { no: 1, item: '作业人员身体条件符合', detail: '无高血压、心脏病、癫痫等禁忌症，健康体检合格', result: '通过 ✓', checked: true },
      { no: 2, item: '作业人员着装符合要求', detail: '工作服、防滑鞋穿戴整齐', result: '通过 ✓', checked: true },
      { no: 3, item: '作业人员佩戴合格安全帽', detail: '安全帽在有效期内，帽衬帽壳完好', result: '通过 ✓', checked: true },
      { no: 4, item: '安全带已正确系挂', detail: '高挂低用，挂点牢固可靠', result: '通过 ✓', checked: true },
      { no: 5, item: '已配备工具袋', detail: '工具、零件放入工具袋，不得随身携带或抛掷', result: '通过 ✓', checked: true },
      { no: 6, item: '脚手架/作业平台已验收', detail: '搭设完毕，经验收挂牌合格', result: '移动式高空平台检测合格 ✓', checked: true },
      { no: 7, item: '作业区域已设置警戒隔离', detail: '下方设围栏+警示标志，专人监护', result: '已设置 ✓', checked: true },
      { no: 8, item: '梯子已检查并固定牢固', detail: '梯脚防滑，角度符合，上端固定', result: '通过 ✓', checked: true },
      { no: 9, item: '照明满足作业要求', detail: '作业面照度充足，夜间有补充照明', result: '日间自然光充足 ✓', checked: true },
      { no: 10, item: '通讯设备完好', detail: '监护人-作业人对讲畅通，备用通讯方式确认', result: '对讲机测试正常 ✓', checked: true },
      { no: 11, item: '其他安全措施', detail: '天气条件：晴、风力3级、无雷电预警；应急物资：急救箱+消防器材就位', result: '已确认 ✓', checked: true }
    ],
    reviewTime: '2026-07-14 16:00', reviewName: '李明辉',
    approveTime: '2026-07-14 16:30', approveName: '王志强',
    guardianTime: null, startTime: null, finishTime: null, archiveTime: null,
    timeline: [
      { time: '2026-07-14 14:00', action: '孙志明提交高处作业申请', operator: '孙志明' },
      { time: '2026-07-14 14:15', action: '系统校验人员资格：通过', operator: '系统' },
      { time: '2026-07-14 16:00', action: '公司安环审核通过', operator: '李明辉' },
      { time: '2026-07-14 16:30', action: '授权审批领导王志强审批通过', operator: '王志强' }
    ]
  },
  {
    id: 'GZ20260715002', workType: 'LIFTING', status: '待领导审批',
    orgId: 3, deptId: 2, zoneId: 'zone-4', zoneName: '大型构件吊装区',
    title: '锻压机底座更换吊装作业',
    applicantId: 3, applicantName: '王志强', applicantDept: '锻压车间',
    loadWeight: '18t', equipmentType: '160T桥式起重机', workLevel: '特殊',
    approvalChain: '作业申请部门负责人 → 作业现场部门负责人 → 分公司设备能源室 → 技术工艺室负责人 → 作业申请部门分管领导',
    duration: '2026-07-16 08:00 ~ 2026-07-16 12:00',
    workers: [
      { id: 7, name: '刘大伟', role: '吊装操作' },
      { id: 3, name: '王志强', role: '吊装指挥' },
      { id: 6, name: '陈文斌', role: '监护人' }
    ],
    guardianId: 6, guardianName: '陈文斌',
    safetyMeasures: ['吊装方案审批', '起重设备日检合格', '警戒区域硬隔离', '人员站位确认'],
    riskHighlights: ['额定载荷160T > 实际18T（载荷比11%）', '司索与指挥双人确认', '吊物下方严禁站人'],
    checks: [
      { item: '起重设备日检记录', result: '桥式起重机7月15日日检合格 ✓' },
      { item: '吊索具检查', result: '专用吊具检测合格，载荷标识清晰 ✓' },
      { item: '操作人员资质', result: '刘大伟（吊装操作证）、王志强（吊装指挥证）均有效 ✓' },
      { item: '载荷计算', result: '构件重量18t，吊具总重0.8t，总额定载荷18.8t < 160T × 90% ✓' },
      { item: '警戒区域', result: '需设置半径15m警戒区，挂牌警示 ✓' },
      { item: '监护人确认', result: '陈文斌（安全生产管理证有效）✓' }
    ],
    reviewTime: '2026-07-15 09:00', reviewName: '李明辉',
    approveTime: null, approveName: null,
    guardianTime: null, startTime: null, finishTime: null, archiveTime: null,
    timeline: [
      { time: '2026-07-15 08:00', action: '王志强提交吊装作业申请', operator: '王志强' },
      { time: '2026-07-15 08:10', action: '系统校验通过：人员+设备+方案', operator: '系统' },
      { time: '2026-07-15 09:00', action: '公司安环审核通过', operator: '李明辉' }
    ]
  },
  {
    id: 'GZ20260714001', workType: 'LIFTING', status: '已归档',
    orgId: 3, deptId: 2, zoneId: 'zone-4', zoneName: '大型构件吊装区',
    title: '热处理炉体转运吊装作业',
    applicantId: 7, applicantName: '刘大伟', applicantDept: '锻压车间',
    loadWeight: '12t', equipmentType: '100T桥式起重机', workLevel: '特殊',
    approvalChain: '作业申请部门负责人 → 作业现场部门负责人 → 分公司设备能源室 → 技术工艺室负责人 → 作业申请部门分管领导',
    duration: '2026-07-14 08:00 ~ 2026-07-14 14:00',
    workers: [{ id: 7, name: '刘大伟', role: '吊装操作' }, { id: 3, name: '王志强', role: '吊装指挥' }],
    guardianId: 6, guardianName: '陈文斌',
    safetyMeasures: ['吊装方案审批', '起重设备日检', '警戒区域', '人员站位'],
    riskHighlights: [],
    checks: [
      { item: '设备日检', result: '合格 ✓' },
      { item: '人员资质', result: '合格 ✓' },
      { item: '警戒区域', result: '已设置 ✓' }
    ],
    reviewTime: '2026-07-13 16:00', reviewName: '李明辉',
    approveTime: '2026-07-13 17:00', approveName: '王志强',
    guardianTime: '2026-07-14 07:45', startTime: '2026-07-14 08:00',
    finishTime: '2026-07-14 13:30', archiveTime: '2026-07-14 15:00',
    archiverName: '李明辉',
    timeline: [
      { time: '2026-07-13 15:00', action: '刘大伟提交吊装作业申请', operator: '刘大伟' },
      { time: '2026-07-13 16:00', action: '公司安环审核通过', operator: '李明辉' },
      { time: '2026-07-13 17:00', action: '授权审批领导王志强审批通过', operator: '王志强' },
      { time: '2026-07-14 07:45', action: '监护人陈文斌确认开工条件', operator: '陈文斌' },
      { time: '2026-07-14 08:00', action: '吊装作业开始', operator: '系统' },
      { time: '2026-07-14 13:30', action: '吊装完成，提交完工申请', operator: '刘大伟' },
      { time: '2026-07-14 15:00', action: '安环验收合格，归档', operator: '李明辉' }
    ]
  },
  {
    id: 'GZ20260715003', workType: 'HIGH_ALTITUDE', status: '草稿',
    orgId: 3, deptId: 1, zoneId: 'zone-1', zoneName: '熔炼铸造区',
    title: '铸造车间天车轨道检修高处作业（资格未满足）',
    applicantId: 4, applicantName: '赵永刚', applicantDept: '铸造车间',
    height: '12m', workLevel: '二级', heightLevel: '5m–15m',
    approvalChain: '作业申请部门负责人 → 作业现场部门负责人 → 分公司健康安全管理室负责人 → 作业申请部门分管领导',
    duration: '2026-07-17 08:00 ~ 2026-07-17 17:00',
    workers: [{ id: 4, name: '赵永刚', role: '作业人' }],
    guardianId: null, guardianName: null,
    safetyMeasures: ['安全帽+安全带', '生命线'],
    riskHighlights: [],
    checks: [],
    reviewTime: null, approveTime: null,
    guardianTime: null, startTime: null, finishTime: null, archiveTime: null,
    blocked: true,
    blockReasons: [
      { person: '赵永刚', issue: '高处作业证已于2026-04-15过期', action: '需重新培训取证' },
      { person: null, issue: '未指定监护人', action: '需指定具备安全生产管理证的监护人' }
    ],
    timeline: [
      { time: '2026-07-15 10:00', action: '赵永刚提交高处作业申请', operator: '赵永刚' },
      { time: '2026-07-15 10:01', action: '系统校验：赵永刚高处作业证已过期，且未指定监护人', operator: '系统' },
      { time: '2026-07-15 10:01', action: '提交被阻断，作业票状态锁定为草稿', operator: '系统' }
    ]
  },
  {
    id: 'GZ20260716001', workType: 'TEMPORARY_ELECTRICITY', status: '待监护确认',
    orgId: 3, deptId: 4, zoneId: 'zone-7', zoneName: '能源介质区',
    title: '热处理车间设备检修临时用电',
    applicantId: 5, applicantName: '孙志明', applicantDept: '设备动力部',
    voltage: '380V', power: '15kW', validity: '15天',
    approvalChain: '作业申请部门负责人 → 作业现场部门负责人 → 分公司设备能源室 → 分公司健康安全管理室',
    duration: '2026-07-16 08:00 ~ 2026-07-16 18:00',
    workers: [{ id: 5, name: '孙志明', role: '作业人（电工）' }, { id: 6, name: '陈文斌', role: '监护人' }],
    guardianId: 6, guardianName: '陈文斌',
    safetyMeasures: ['TN-S三相五线制接零保护', '一机一闸一漏配置', '电缆过路穿管保护', '配电箱设置漏电保护器'],
    riskHighlights: ['380V临时接线', '高温作业环境', '电缆跨越人行通道'],
    checks: [
      { no: 1, item: '用电设备容量与临时电源匹配', detail: '380V/15kW，临时配电箱额定容量40kW', result: '匹配 ✓', checked: true },
      { no: 2, item: '电缆线路敷设符合规范', detail: '架空≥2.5m，过路处穿钢管保护', result: '符合 ✓', checked: true },
      { no: 3, item: '漏电保护器动作正常', detail: '配电箱/开关箱均配置，测试动作灵敏', result: '正常 ✓', checked: true },
      { no: 4, item: 'TN-S接零保护系统完好', detail: '三相五线制，PE线专用，重复接地可靠', result: '完好 ✓', checked: true },
      { no: 5, item: '一机一闸一漏配置', detail: '每台用电设备独立开关箱，严禁一闸多机', result: '已配置 ✓', checked: true },
      { no: 6, item: '作业人员持有效电工操作证', detail: '孙志明电工操作证有效期至2027-08-20', result: '有效 ✓', checked: true },
      { no: 7, item: '现场已配置灭火器材', detail: '干粉灭火器2具，置于配电箱旁', result: '已配置 ✓', checked: true }
    ],
    reviewTime: '2026-07-15 17:00', reviewName: '李明辉',
    approveTime: '2026-07-15 17:30', approveName: '王志强',
    guardianTime: null, startTime: null, finishTime: null, archiveTime: null,
    timeline: [
      { time: '2026-07-15 16:00', action: '孙志明提交临时用电申请', operator: '孙志明' },
      { time: '2026-07-15 16:05', action: '系统校验：孙志明电工操作证有效 ✓', operator: '系统' },
      { time: '2026-07-15 17:00', action: '公司安环审核通过', operator: '李明辉' },
      { time: '2026-07-15 17:30', action: '授权审批领导王志强审批通过', operator: '王志强' }
    ]
  },
  {
    id: 'GZ20260716002', workType: 'HIGH_ALTITUDE', status: '待安环审核',
    orgId: 3, deptId: 2, zoneId: 'zone-4', zoneName: '大型构件吊装区',
    title: '锻压车间屋面彩钢板更换高处作业',
    applicantId: 3, applicantName: '王志强', applicantDept: '锻压车间',
    height: '22m', workLevel: '三级', heightLevel: '15m–30m',
    approvalChain: '作业申请部门负责人 → 作业现场部门负责人 → 分公司健康安全管理室负责人 → 作业申请部门分管领导 → 分公司主要负责人',
    duration: '2026-07-17 08:00 ~ 2026-07-20 18:00',
    workers: [
      { id: 3, name: '王志强', role: '现场负责人' },
      { id: 5, name: '孙志明', role: '作业人' },
      { id: 6, name: '陈文斌', role: '监护人' }
    ],
    guardianId: 6, guardianName: '陈文斌',
    safetyMeasures: ['安全帽+全身式安全带+双钩安全绳', '生命线系统', '防坠落网', '警戒隔离区半径10m', '专项施工方案已审批'],
    weatherCheck: '晴转多云，风力2-4级，温度24-32°C', weatherPass: true,
    riskHighlights: ['坠落高度22m（三级）', '屋面结构承载需逐点确认', '彩钢板吊运交叉作业', '高温时段防暑措施'],
    checks: [
      { no: 1, item: '作业人员身体条件符合', detail: '全员体检合格，无高空禁忌症', result: '通过 ✓', checked: true },
      { no: 2, item: '作业人员着装符合要求', detail: '工作服、防滑鞋穿戴整齐', result: '通过 ✓', checked: true },
      { no: 3, item: '作业人员佩戴合格安全帽', detail: '3人安全帽均在有效期内', result: '通过 ✓', checked: true },
      { no: 4, item: '安全带已正确系挂', detail: '全身式安全带+双钩，高挂低用', result: '通过 ✓', checked: true },
      { no: 5, item: '已配备工具袋', detail: '彩钢板紧固工具装入工具袋，严禁抛掷', result: '已配备 ✓', checked: true },
      { no: 6, item: '脚手架/作业平台已验收', detail: '屋面作业平台搭设完毕，挂牌验收合格', result: '验收合格 ✓', checked: true },
      { no: 7, item: '作业区域已设置警戒隔离', detail: '半径10m硬隔离，双人监护', result: '已设置 ✓', checked: true },
      { no: 8, item: '梯子已检查并固定牢固', detail: '屋面通道梯固定可靠', result: '已固定 ✓', checked: true },
      { no: 9, item: '照明满足作业要求', detail: '屋面作业面日间自然光照充足', result: '充足 ✓', checked: true },
      { no: 10, item: '通讯设备完好', detail: '3人配发对讲机，频道已统一测试', result: '正常 ✓', checked: true },
      { no: 11, item: '其他安全措施', detail: '专项施工方案已审批；彩钢板吊运与屋面作业分区进行；配备防暑药品与饮水', result: '已确认 ✓', checked: true }
    ],
    reviewTime: null, reviewName: null,
    approveTime: null, approveName: null,
    guardianTime: null, startTime: null, finishTime: null, archiveTime: null,
    timeline: [
      { time: '2026-07-16 09:00', action: '王志强提交三级高处作业申请（22m）', operator: '王志强' },
      { time: '2026-07-16 09:02', action: '系统校验：三级高处作业需逐级审批至主要负责人', operator: '系统' }
    ]
  },
  {
    id: 'GZ20260716004', workType: 'FIRE', status: '待安环审核',
    orgId: 3, deptId: 2, zoneId: 'zone-2', zoneName: '锻压加工区',
    title: '锻压车间工艺管道焊接动火作业',
    applicantId: 3, applicantName: '王志强', applicantDept: '锻压车间',
    fireLevel: '二级', workLevel: '二级', validity: '72小时',
    approvalChain: '作业申请部门负责人 → 作业现场部门负责人 → 分公司健康安全管理室负责人',
    duration: '2026-07-17 08:00 ~ 2026-07-19 18:00',
    workers: [
      { id: 3, name: '王志强', role: '作业负责人' },
      { id: 7, name: '刘大伟', role: '动火作业人（焊工）' },
      { id: 6, name: '陈文斌', role: '动火监护人' }
    ],
    guardianId: 6, guardianName: '陈文斌',
    safetyMeasures: ['动火点周围易燃物清理隔离', '配备干粉灭火器4具+消防沙箱', '乙炔瓶与氧气瓶间距≥5m并防晒', '动火前动火分析合格', '专人监护全程在场'],
    riskHighlights: ['二级动火有效期不超过72小时', '动火点10m内禁止可燃溶剂清洗', '五级风以上禁止露天动火', '作业环境变更立即停火'],
    checks: [
      { no: 1, item: '动火作业审批表已办理', detail: '二级动火，有效期72小时内', result: '办理中 ⏳', checked: false },
      { no: 2, item: '动火点周围易燃物已清理', detail: '10m范围内可燃物清除或封盖', result: '已清理 ✓', checked: true },
      { no: 3, item: '消防器材已配备', detail: '干粉灭火器4具、消防沙箱1个就位', result: '已配备 ✓', checked: true },
      { no: 4, item: '动火分析合格', detail: '便携式可燃气体检测仪检测，浓度合格', result: '合格 ✓', checked: true },
      { no: 5, item: '气瓶安全间距符合要求', detail: '乙炔瓶直立，与氧气瓶≥5m，距作业点≥10m', result: '符合 ✓', checked: true },
      { no: 6, item: '作业人员持有效焊工证', detail: '刘大伟焊工操作证有效', result: '有效 ✓', checked: true },
      { no: 7, item: '动火监护人到场', detail: '陈文斌（安全生产管理证有效）全程监护', result: '到场 ✓', checked: true }
    ],
    reviewTime: null, reviewName: null,
    approveTime: null, approveName: null,
    guardianTime: null, startTime: null, finishTime: null, archiveTime: null,
    timeline: [
      { time: '2026-07-16 10:30', action: '王志强提交二级动火作业申请', operator: '王志强' },
      { time: '2026-07-16 10:32', action: '系统校验：焊工证有效、动火分析待复核', operator: '系统' }
    ]
  }
];

// ==== 驾驶舱统计数据 ====
export const dashboardStats = {
  totalHazards: 5,
  pendingHazards: 3,   // 待受理+待整改+整改中+待复查
  overdueHazards: 0,
  closedThisMonth: 2,
  criticalHazards: 3,        // 重大隐患数（severity=重大）
  rectificationRate: 40,     // 整改率 % = 已闭环 / 隐患总数
  bpmPendingCount: 3,        // OA 待审批（兜底值，与 BPM 页口径一致）
  bpmAvgTime: '4.6',         // OA 平均审批时长（小时）
  activeSupervisions: 2,
  activeWorkPermits: 4,
  criticalRisks: [
    { zone: '熔炼铸造区', count: 3, level: '重大' },
    { zone: '锻压加工区', count: 2, level: '重大' },
    { zone: '大型构件吊装区', count: 1, level: '重大' }
  ],
  orgComparison: [
    { name: '铸锻件分公司', hazards: 5, activePermits: 2, supervisions: 2, riskLevel: '橙色' },
    { name: '工程起重机公司', hazards: 1, activePermits: 0, supervisions: 0, riskLevel: '蓝色' }
  ]
};

// ==== 巡检任务 ====
export const inspectionTasks = [
  { id: 'XJ20260715001', type: '日常巡检', title: '铸造车间区域巡检', assigneeId: 6, assigneeName: '陈文斌',
    zoneId: 'zone-1', zoneName: '熔炼铸造区', status: 'pending', deadline: '2026-07-15 17:00', checkItems: 12,
    checklist: [
      { label: '炉前防护挡板完好', done: false, result: '正常' },
      { label: '自动测温报警装置运行正常', done: false, result: '正常' },
      { label: '紧急倾炉装置测试合格', done: false, result: '正常' },
      { label: '浇注坑围栏无损坏', done: false, result: '正常' },
      { label: '天车限位装置灵敏', done: false, result: '正常' },
      { label: '高温警示标识清晰', done: false, result: '正常' },
      { label: '作业人员劳保穿戴规范', done: false, result: '正常' },
      { label: '消防器材在位有效', done: false, result: '正常' },
      { label: '安全通道畅通', done: false, result: '正常' },
      { label: '电气线路无裸露', done: false, result: '正常' },
      { label: '通风系统运行正常', done: false, result: '正常' },
      { label: '应急照明测试合格', done: false, result: '正常' }
    ] },
  { id: 'XJ20260715002', type: '日常巡检', title: '锻压车间区域巡检', assigneeId: 6, assigneeName: '陈文斌',
    zoneId: 'zone-2', zoneName: '锻压加工区', status: 'completed', deadline: '2026-07-15 12:00', checkItems: 10,
    completedAt: '2026-07-15 10:30', result: '正常，发现吊索具磨损已上报',
    checklist: [
      { label: '锻压设备安全光幕完好', done: true, result: '正常' },
      { label: '双手操作装置灵敏', done: true, result: '正常' },
      { label: '设备接地可靠', done: true, result: '正常' },
      { label: '液压系统无泄漏', done: true, result: '正常' },
      { label: '吊装作业警戒到位', done: true, result: '正常' },
      { label: '作业人员劳保穿戴规范', done: true, result: '正常' },
      { label: '设备急停按钮有效', done: true, result: '正常' },
      { label: '安全通道畅通', done: true, result: '正常' },
      { label: '消防设施在位有效', done: true, result: '正常' },
      { label: '交接班记录完整', done: true, result: '正常' }
    ] },

  // 周期自动下发任务（模板，可按周期生成执行实例）
  { id: 'XJ-CYCLE-001', type: '日常巡检', title: '熔炼铸造区班前安全巡检', assigneeId: 6, assigneeName: '陈文斌',
    zoneId: 'zone-1', zoneName: '熔炼铸造区', status: 'cycle', dispatchMode: 'cycle', cycle: '每日', nextDispatch: '2026-07-21 07:30',
    checkItems: 8, desc: '每班次开班前由现场人员完成安全确认后上岗',
    checklist: [
      { label: '炉前防护挡板完好无变形', done: false, result: '正常' },
      { label: '自动测温报警装置运行正常', done: false, result: '正常' },
      { label: '紧急倾炉装置现场测试合格', done: false, result: '正常' },
      { label: '浇注坑围栏及盖板完好', done: false, result: '正常' },
      { label: '天车大车/小车限位器灵敏', done: false, result: '正常' },
      { label: '作业人员安全帽/防护镜/阻燃服穿戴规范', done: false, result: '正常' },
      { label: '炉前消防沙箱及灭火器在位有效', done: false, result: '正常' },
      { label: '应急通道畅通无堆积', done: false, result: '正常' }
    ] },
  { id: 'XJ-CYCLE-002', type: '专项巡检', title: '全厂起重设备周安全巡检', assigneeId: 3, assigneeName: '王志强',
    zoneId: 'zone-4', zoneName: '大型构件吊装区', status: 'cycle', dispatchMode: 'cycle', cycle: '每周一', nextDispatch: '2026-07-20 08:00',
    checkItems: 6, desc: '每周一由车间主任组织起重设备专项安全确认',
    checklist: [
      { label: '桥式起重机吊索具无磨损/无断丝', done: false, result: '正常' },
      { label: '吊钩防脱装置有效', done: false, result: '正常' },
      { label: '起升/运行限位器动作灵敏', done: false, result: '正常' },
      { label: '声光报警及警示装置正常', done: false, result: '正常' },
      { label: '钢丝绳润滑及排列状态良好', done: false, result: '正常' },
      { label: '起重机轨道及行走区域无障碍', done: false, result: '正常' }
    ] }
];

// 通用巡检检查项模板（用于 PC 端新建任务时生成检查清单）
export const COMMON_CHECK_ITEMS = [
  '安全防护设施完好',
  '设备运行正常无异常声响',
  '安全警示标识清晰',
  '作业人员劳保穿戴规范',
  '消防器材在位有效',
  '安全通道畅通',
  '电气线路无裸露',
  '应急照明测试合格',
  '通风/除尘系统运行正常',
  '作业区域无杂物堆积',
  '特种作业人员持证上岗',
  '交接班记录完整'
];

// 根据检查项数生成检查清单
export function buildInspectionChecklist(n) {
  const list = [];
  const count = Math.max(1, Math.min(20, Number(n) || 10));
  for (let i = 0; i < count; i++) {
    list.push({ label: COMMON_CHECK_ITEMS[i % COMMON_CHECK_ITEMS.length], done: false, result: '正常' });
  }
  return list;
}

// 生成巡检任务编号：XJ + 日期 + 序号
export function generateInspectionId() {
  const d = new Date();
  const p = (x) => String(x).padStart(2, '0');
  const ymd = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
  const seq = String(inspectionTasks.length + 1).padStart(3, '0');
  return `XJ${ymd}${seq}`;
}

// 计算巡检任务完成进度（百分比）
export function getInspectionProgress(task) {
  if (!task || !task.checklist || !task.checklist.length) return task && task.status === 'completed' ? 100 : 0;
  const done = task.checklist.filter((i) => i.done).length;
  return Math.round((done / task.checklist.length) * 100);
}

// ==== 风险等级枚举（LEC评价法） ====
export const RISK_LEVEL = {
  CRITICAL: '重大',
  MAJOR: '较大',
  MODERATE: '一般',
  LOW: '低'
};

export const RISK_STATUS = {
  CONTROLLED: '管控中',
  PENDING_REVIEW: '待复核',
  PENDING_MEASURES: '待补充措施'
};

// ==== 风险管理 — 风险台账（含LEC评价结果） ====
export const riskLedger = [
  { id: 'RK-2026-001', name: '1号储罐区泄漏风险', area: '储罐区', category: '火灾爆炸',
    L: 3, E: 6, C: 15, D: 270, level: '重大', ownerId: 1, ownerName: '张建国',
    measures: 6, status: '管控中', lastReview: '2026-07-05',
    _approvalState: 'approved', _approvalHistory: [
      { time: '2026-06-20 14:30', action: '提交LEC评价', operator: '张建国', detail: 'D=270 重大' },
      { time: '2026-06-21 09:00', action: '安环室复核通过', operator: '李明辉', detail: '评价参数合理，等级判定准确' },
      { time: '2026-06-22 10:30', action: '分管领导批准', operator: '王志强', detail: '同意，按一级管控执行' }
    ],
    hazardousSources: ['易燃介质管道腐蚀', '法兰密封老化', '操作失误'],
    controls: [
      { item: '每日巡检并记录压力与密封状态', dept: '铸造车间', freq: '每日', responsibleName: '张建国' },
      { item: '可燃气体报警器24小时在线监测', dept: '安全环保部', freq: '实时', responsibleName: '李明辉' },
      { item: '季度法兰螺栓力矩校验', dept: '设备动力部', freq: '每季度', responsibleName: '孙志明' },
      { item: '安装自动喷淋降温系统', dept: '设备动力部', freq: '持续', responsibleName: '孙志明' },
      { item: '防爆电气设备定期检测', dept: '设备动力部', freq: '每月', responsibleName: '孙志明' },
      { item: '应急疏散预案演练', dept: '安全环保部', freq: '每半年', responsibleName: '李明辉' }
    ] },
  { id: 'RK-2026-002', name: '动火作业火灾风险', area: '锻压加工区', category: '火灾',
    L: 4, E: 3, C: 7, D: 84, level: '较大', ownerId: 3, ownerName: '王志强',
    measures: 8, status: '管控中', lastReview: '2026-07-08',
    _approvalState: 'approved', _approvalHistory: [
      { time: '2026-07-05 16:00', action: '提交LEC评价', operator: '王志强', detail: 'D=84 较大' },
      { time: '2026-07-08 08:30', action: '安环室复核通过', operator: '李明辉', detail: '评价参数合理' }
    ],
    hazardousSources: ['焊接火花', '切割高温熔渣', '可燃物堆积'],
    controls: [
      { item: '动火审批与现场确认制度', dept: '锻压车间', freq: '每次', responsibleName: '王志强' },
      { item: '配备灭火器材与消防沙', dept: '锻压车间', freq: '持续', responsibleName: '王志强' }
    ] },
  { id: 'RK-2026-003', name: '高处坠落风险（检修区域）', area: '厂房屋面检修区', category: '高处坠落',
    L: 3, E: 4, C: 7, D: 84, level: '较大', ownerId: 5, ownerName: '孙志明',
    measures: 5, status: '待复核', lastReview: '2026-07-03',
    _approvalState: 'pending_review', _approvalHistory: [
      { time: '2026-07-03 11:00', action: '提交LEC评价', operator: '孙志明', detail: 'D=84 较大' }
    ],
    hazardousSources: ['屋面边缘无护栏', '检修口未封闭', '安全带挂点不足'],
    controls: [
      { item: '安全护栏与生命线系统', dept: '设备动力部', freq: '持续', responsibleName: '孙志明' },
      { item: '高处作业证持证上岗', dept: '安全环保部', freq: '每次', responsibleName: '李明辉' }
    ] },
  { id: 'RK-2026-004', name: '叉车碰撞风险', area: '仓储装卸区', category: '车辆伤害',
    L: 4, E: 5, C: 3, D: 60, level: '一般', ownerId: 6, ownerName: '陈文斌',
    measures: 4, status: '管控中', lastReview: '2026-07-10',
    _approvalState: 'draft', _approvalHistory: [],
    hazardousSources: ['叉车与行人混行', '盲区视线受限', '超速行驶'],
    controls: [
      { item: '人车分流通道标线', dept: '生产保障部', freq: '持续', responsibleName: '陈文斌' },
      { item: '叉车限速5km/h', dept: '生产保障部', freq: '持续', responsibleName: '陈文斌' }
    ] },
  { id: 'RK-2026-005', name: '有限空间中毒窒息风险', area: '热处理区', category: '中毒窒息',
    L: 2, E: 3, C: 15, D: 90, level: '较大', ownerId: 2, ownerName: '李明辉',
    measures: 7, status: '管控中', lastReview: '2026-07-12',
    _approvalState: 'approved', _approvalHistory: [
      { time: '2026-07-10 15:00', action: '提交LEC评价', operator: '李明辉', detail: 'D=90 较大' },
      { time: '2026-07-12 09:00', action: '安环室复核通过', operator: '李明辉', detail: '有限空间风险等级确认' }
    ],
    hazardousSources: ['热处理炉废气积聚', '通风不足', '未佩戴检测仪'],
    controls: [
      { item: '作业前气体检测（O₂/H₂S/CO）', dept: '热处理车间', freq: '每次', responsibleName: '李明辉' },
      { item: '强制通风装置运行', dept: '设备动力部', freq: '持续', responsibleName: '孙志明' }
    ] },
  { id: 'RK-2026-006', name: '噪声职业危害风险', area: '锻压加工区', category: '职业危害',
    L: 5, E: 6, C: 1, D: 30, level: '低', ownerId: 3, ownerName: '王志强',
    measures: 3, status: '管控中', lastReview: '2026-06-28',
    _approvalState: 'draft', _approvalHistory: [],
    hazardousSources: ['锻压机冲击噪声', '空压机运行噪声'],
    controls: [
      { item: '配备耳塞/耳罩并监督佩戴', dept: '锻压车间', freq: '持续', responsibleName: '王志强' },
      { item: '每年职业健康体检', dept: '安全环保部', freq: '每年', responsibleName: '李明辉' }
    ] }
];

// LEC风险等级判定
export function getRiskLevelByD(D) {
  if (D >= 160) return { level: '重大', color: '#DC2626', tag: 'red' };
  if (D >= 70) return { level: '较大', color: '#D97706', tag: 'orange' };
  if (D >= 20) return { level: '一般', color: '#CA8A04', tag: 'yellow' };
  return { level: '低', color: '#0075E6', tag: 'blue' };
}

// ==== 培训中心集成状态枚举 ====
export const TRAINING_STATUS = {
  DRAFT: '待发布',
  IN_PROGRESS: '进行中',
  PENDING_ARCHIVE: '待归档',
  ARCHIVED: '已归档'
};

// ==== 培训计划数据 ====
export const trainingPlans = [
  { id: 'TR-2026-018', name: '夏季防暑与应急处置培训', type: '专项培训', people: 86, completed: 72,
    passRate: '94%', teacher: '李明辉', exam: '已配置', status: '进行中', step: 2,
    startDate: '2026-07-05', endDate: '2026-07-25', targetDepts: ['铸造车间', '锻压车间', '热处理车间'],
    content: '中暑预防、高温作业防护、急救技能、应急疏散流程' },
  { id: 'TR-2026-017', name: '有限空间作业专项培训', type: '专项培训', people: 34, completed: 34,
    passRate: '100%', teacher: '集团安环·王总监', exam: '已完成', status: '待归档', step: 3,
    startDate: '2026-06-20', endDate: '2026-07-10', targetDepts: ['铸造车间', '热处理车间'],
    content: '有限空间定义与辨识、气体检测操作、应急救援器材使用、应急预案演练' },
  { id: 'TR-2026-019', name: '新员工三级安全教育', type: '三级教育', people: 18, completed: 0,
    passRate: '-', teacher: '李明辉', exam: '待配置', status: '待发布', step: 1,
    startDate: '2026-07-20', endDate: '2026-07-30', targetDepts: ['铸造车间', '锻压车间'],
    content: '厂级安全教育、车间级安全教育、班组级安全教育' },
  { id: 'TR-2026-015', name: '动火作业监护人复训', type: '年度培训', people: 25, completed: 25,
    passRate: '96%', teacher: '集团安环·王总监', exam: '已完成', status: '已归档', step: 4,
    startDate: '2026-06-01', endDate: '2026-06-15', targetDepts: ['锻压车间', '设备动力部'],
    content: '动火作业分级审批制度更新、监护人职责、消防器材操作、事故案例警示' }
];

// ==== 培训记录 ====
export const trainingRecords = [
  { id: 'REC-001', planId: 'TR-2026-018', personId: 1, personName: '张建国', topic: '夏季防暑与应急处置培训',
    type: '必修', date: '2026-07-08', result: '通过', score: 92 },
  { id: 'REC-002', planId: 'TR-2026-018', personId: 3, personName: '王志强', topic: '夏季防暑与应急处置培训',
    type: '必修', date: '2026-07-08', result: '通过', score: 88 },
  { id: 'REC-003', planId: 'TR-2026-018', personId: 4, personName: '赵永刚', topic: '夏季防暑与应急处置培训',
    type: '必修', date: '-', result: '未完成', score: 0 },
  { id: 'REC-004', planId: 'TR-2026-017', personId: 6, personName: '陈文斌', topic: '有限空间作业专项培训',
    type: '必修', date: '2026-06-28', result: '通过', score: 95 },
  { id: 'REC-005', planId: 'TR-2026-015', personId: 3, personName: '王志强', topic: '动火作业监护人复训',
    type: '必修', date: '2026-06-05', result: '通过', score: 90 },
  { id: 'REC-006', planId: 'TR-2026-015', personId: 6, personName: '陈文斌', topic: '动火作业监护人复训',
    type: '必修', date: '2026-06-05', result: '通过', score: 98 }
];

// ==== 证书管理 ====
export const certificates = [
  { id: 'CERT-001', personId: 4, personName: '赵永刚', type: '高处作业证', issueDate: '2020-04-15',
    expiryDate: '2026-04-15', status: 'expired', issuingAuthority: '太原市应急管理局', remarks: '需重新培训取证' },
  { id: 'CERT-002', personId: 4, personName: '赵永刚', type: '焊工证', issueDate: '2021-06-30',
    expiryDate: '2027-06-30', status: 'valid', issuingAuthority: '太原市应急管理局', remarks: '' },
  { id: 'CERT-003', personId: 5, personName: '孙志明', type: '高处作业证', issueDate: '2021-03-10',
    expiryDate: '2027-03-10', status: 'valid', issuingAuthority: '太原市应急管理局', remarks: '' },
  { id: 'CERT-004', personId: 5, personName: '孙志明', type: '电工操作证', issueDate: '2021-08-20',
    expiryDate: '2027-08-20', status: 'valid', issuingAuthority: '太原市应急管理局', remarks: '' },
  { id: 'CERT-005', personId: 7, personName: '刘大伟', type: '吊装操作证', issueDate: '2021-04-22',
    expiryDate: '2027-04-22', status: 'valid', issuingAuthority: '太原市市场监督管理局', remarks: '' },
  { id: 'CERT-006', personId: 7, personName: '刘大伟', type: '司索证', issueDate: '2020-10-05',
    expiryDate: '2026-10-05', status: 'expiring', issuingAuthority: '太原市市场监督管理局', remarks: '距到期不足3个月' },
  { id: 'CERT-007', personId: 2, personName: '李明辉', type: '注册安全工程师', issueDate: '2022-03-20',
    expiryDate: '2028-03-20', status: 'valid', issuingAuthority: '国家应急管理部', remarks: '' },
  { id: 'CERT-008', personId: 2, personName: '李明辉', type: '特种设备管理证', issueDate: '2020-08-15',
    expiryDate: '2026-08-15', status: 'expiring', issuingAuthority: '太原市市场监督管理局', remarks: '距到期不足1个月' },
  { id: 'CERT-009', personId: 6, personName: '陈文斌', type: '安全生产管理证', issueDate: '2021-02-18',
    expiryDate: '2027-02-18', status: 'valid', issuingAuthority: '太原市应急管理局', remarks: '' },
  { id: 'CERT-010', personId: 6, personName: '陈文斌', type: '注册安全工程师', issueDate: '2021-12-31',
    expiryDate: '2027-12-31', status: 'valid', issuingAuthority: '国家应急管理部', remarks: '' }
];

// ==== 基础支撑 — 数据字典 ====
export const dataDictionary = {
  riskLevels: [
    { key: '重大', D_range: 'D ≥ 160', color: '#DC2626', desc: '可能导致多人伤亡或重大财产损失' },
    { key: '较大', D_range: '70 ≤ D < 160', color: '#D97706', desc: '可能导致人员重伤或较大财产损失' },
    { key: '一般', D_range: '20 ≤ D < 70', color: '#CA8A04', desc: '可能导致人员轻伤或一般财产损失' },
    { key: '低', D_range: 'D < 20', color: '#0075E6', desc: '风险可控，需持续关注' }
  ],
  hazardSources: ['分公司计划检查', '公司监督检查', '隐患随手拍', '上级督查', '投诉举报'],
  hazardCategories: ['设备设施', '作业安全', '人员行为', '环境因素', '管理缺陷', '消防'],
  workTypes: [
    { key: 'HIGH_ALTITUDE', label: '高处作业', level: '一级/二级/三级/特级', validity: '—', measuresCount: 11 },
    { key: 'LIFTING', label: '特殊起重吊装作业', level: '特殊', validity: '—', measuresCount: 8 },
    { key: 'TEMPORARY_ELECTRICITY', label: '临时用电作业', level: '—', validity: '15天', measuresCount: 7 },
    { key: 'FIRE', label: '动火作业', level: '一级/二级/特级', validity: '8h/72h', measuresCount: 7 }
  ],
  trainingTypes: ['专项培训', '年度培训', '三级教育', '复训', '应急演练'],
};

// ==== 工具函数 ====
export function getOrgName(orgId) {
  const org = organizations.find(o => o.id === orgId);
  return org ? org.name : '-';
}

export function getDeptName(deptId) {
  const dept = departments.find(d => d.id === deptId);
  return dept ? dept.name : '-';
}

export function getPersonById(id) {
  return personnel.find(p => p.id === id) || null;
}

export function getHazardsByStatus(orgId) {
  return hazards.filter(h => !orgId || h.orgId === orgId);
}

export function getActiveWorkPermits(orgId) {
  return workPermits.filter(w => (!orgId || w.orgId === orgId) && w.status !== '草稿' && w.status !== '已归档');
}

export function getActiveSupervisions(orgId) {
  return supervisions.filter(s => (!orgId || s.orgId === orgId) && s.status !== '已关闭');
}

// 恢复初始演示数据（深拷贝）
export function resetAllData() {
  return {
    organizations: JSON.parse(JSON.stringify(organizations)),
    departments: JSON.parse(JSON.stringify(departments)),
    personnel: JSON.parse(JSON.stringify(personnel)),
    factoryZones: JSON.parse(JSON.stringify(factoryZones)),
    riskPoints: JSON.parse(JSON.stringify(riskPoints)),
    hazards: JSON.parse(JSON.stringify(hazards)),
    supervisions: JSON.parse(JSON.stringify(supervisions)),
    workPermits: JSON.parse(JSON.stringify(workPermits)),
    inspectionTasks: JSON.parse(JSON.stringify(inspectionTasks)),
    dashboardStats: JSON.parse(JSON.stringify(dashboardStats))
  };
}
