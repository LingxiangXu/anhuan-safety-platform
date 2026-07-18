/**
 * 太重集团安全管理平台 - 统一模拟数据中心
 * 所有页面从此处读取数据，操作后状态同步影响全局
 */

// ==== 组织架构 ====
export const organizations = [
  { id: 1, name: '太重集团', parentId: null, level: 'group' },
  { id: 2, name: '太原重工', parentId: 1, level: 'company' },
  { id: 3, name: '太原重工铸锻件分公司', parentId: 2, level: 'branch' },
  { id: 4, name: '山西太重工程机械有限公司', parentId: 1, level: 'branch' }
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
// ==== 厂区中心点（太原重工铸锻件分公司，太原市清徐县东大街1号） ====
export const FACTORY_CENTER = { lng: 112.3538, lat: 37.605, address: '太原市清徐县东大街1号' };

export const factoryZones = [
  { id: 'zone-1', name: '熔炼铸造区', x: 80, y: 60, w: 160, h: 110, riskLevel: '重大', riskColor: '#ef4444', deptId: 1, desc: '高温熔炼、浇注作业区域',
    path: [[112.3520,37.6065],[112.3533,37.6065],[112.3533,37.6055],[112.3520,37.6055]] },
  { id: 'zone-2', name: '锻压加工区', x: 280, y: 60, w: 150, h: 110, riskLevel: '重大', riskColor: '#ef4444', deptId: 2, desc: '大型锻压设备运行区域',
    path: [[112.3536,37.6065],[112.3548,37.6065],[112.3548,37.6055],[112.3536,37.6055]] },
  { id: 'zone-3', name: '热处理区', x: 470, y: 60, w: 140, h: 110, riskLevel: '较大', riskColor: '#f59e0b', deptId: 3, desc: '热处理炉与淬火作业区域',
    path: [[112.3550,37.6065],[112.3560,37.6065],[112.3560,37.6055],[112.3550,37.6055]] },
  { id: 'zone-4', name: '大型构件吊装区', x: 80, y: 210, w: 170, h: 120, riskLevel: '重大', riskColor: '#ef4444', deptId: 2, desc: '大型构件吊装与转运区域',
    path: [[112.3520,37.6053],[112.3533,37.6053],[112.3533,37.6043],[112.3520,37.6043]] },
  { id: 'zone-5', name: '厂房屋面检修区', x: 290, y: 210, w: 180, h: 120, riskLevel: '较大', riskColor: '#f59e0b', deptId: 4, desc: '厂房屋面及高处设备检修区域',
    path: [[112.3536,37.6053],[112.3550,37.6053],[112.3550,37.6043],[112.3536,37.6043]] },
  { id: 'zone-6', name: '仓储装卸区', x: 510, y: 210, w: 140, h: 120, riskLevel: '一般', riskColor: '#eab308', deptId: 5, desc: '物料仓储与装卸作业区域',
    path: [[112.3552,37.6053],[112.3563,37.6053],[112.3563,37.6043],[112.3552,37.6043]] },
  { id: 'zone-7', name: '能源介质区', x: 200, y: 370, w: 300, h: 100, riskLevel: '较大', riskColor: '#f59e0b', deptId: 4, desc: '变配电、压缩空气、燃气调压区域',
    path: [[112.3528,37.6041],[112.3556,37.6041],[112.3556,37.6035],[112.3528,37.6035]] }
];

// ==== 风险点 ====
export const riskPoints = [
  { id: 'rp-1', zoneId: 'zone-1', name: '中频炉作业平台', category: '灼烫/爆炸', level: '重大', deptId: 1, responsibleName: '张建国',
    measures: '炉前防护挡板、自动测温报警、紧急倾炉装置', lastReview: '2026-07-10', status: '正常', lng: 112.3526, lat: 37.6062 },
  { id: 'rp-2', zoneId: 'zone-1', name: '浇注坑区域', category: '灼烫/起重伤害', level: '重大', deptId: 1, responsibleName: '李明辉',
    measures: '浇注坑围栏、天车限位装置、高温警示', lastReview: '2026-07-08', status: '正常', lng: 112.3523, lat: 37.6059 },
  { id: 'rp-3', zoneId: 'zone-2', name: '8000T锻压机工位', category: '机械伤害/噪声', level: '重大', deptId: 2, responsibleName: '王志强',
    measures: '安全光幕、双手操作装置、隔音罩', lastReview: '2026-07-05', status: '正常', lng: 112.3542, lat: 37.6062 },
  { id: 'rp-4', zoneId: 'zone-4', name: '桥式起重机A区', category: '起重伤害/物体打击', level: '重大', deptId: 2, responsibleName: '刘大伟',
    measures: '吊索具日检、限位器、声光报警、警戒区域', lastReview: '2026-07-12', status: '隐患待整改', lng: 112.3525, lat: 37.6049 },
  { id: 'rp-5', zoneId: 'zone-5', name: '厂房屋面通风器检修口', category: '高处坠落', level: '较大', deptId: 4, responsibleName: '孙志明',
    measures: '安全护栏、生命线系统、防坠落网', lastReview: '2026-07-03', status: '正常', lng: 112.3544, lat: 37.6049 },
  { id: 'rp-6', zoneId: 'zone-6', name: '危险品暂存库', category: '火灾/爆炸/中毒', level: '较大', deptId: 5, responsibleName: '陈文斌',
    measures: '防爆电气、可燃气体报警、通风联锁、MSDS告知', lastReview: '2026-07-09', status: '正常', lng: 112.3557, lat: 37.6049 },
  { id: 'rp-7', zoneId: 'zone-7', name: '35kV变电站', category: '触电/火灾', level: '较大', deptId: 4, responsibleName: '孙志明',
    measures: '五防系统、绝缘监测、自动灭火装置', lastReview: '2026-07-01', status: '正常', lng: 112.3532, lat: 37.6038 }
];

// ==== 重大危险源等级枚举（GB 18218-2018）====
export const MAJOR_HAZARD_LEVEL = {
  LEVEL_1: '一级',
  LEVEL_2: '二级',
  LEVEL_3: '三级',
  LEVEL_4: '四级'
};

export const MAJOR_HAZARD_STATUS = {
  NORMAL: '正常',
  WARNING: '预警',
  ALARM: '报警'
};

// ==== 重大危险源生命周期步骤 ====
export const MAJOR_HAZARD_LIFECYCLE_STEPS = [
  { key: 'identify', label: '辨识评估', role: '第三方评价机构', icon: '🔍' },
  { key: 'register', label: '登记建档', role: '安全环保部', icon: '📋' },
  { key: 'filing', label: '报备告知', role: '政府应急管理部门', icon: '🏛️' },
  { key: 'monitor', label: '在线监测', role: '设备动力部·安环室', icon: '📡' },
  { key: 'assess', label: '定期评估', role: '第三方评价机构', icon: '📑' },
  { key: 'drill', label: '预案演练', role: '安全环保部·各车间', icon: '🆘' }
];

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
    period: '2026-01-01 ~ 2026-12-31', orgName: '太原重工铸锻件分公司',
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
    period: '2026-01-01 ~ 2026-12-31', orgName: '太原重工铸锻件分公司',
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
    period: '2026-01-01 ~ 2026-12-31', orgName: '太原重工铸锻件分公司',
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

// ==== 重大危险源数据 ====
export const majorHazardSources = [
  {
    id: 'MHS-001',
    name: '危险品暂存库（油漆/稀释剂/固化剂）',
    level: '二级',
    levelNum: 2,
    status: '正常',
    _lifecycleStep: 3, // 当前处于在线监测阶段
    location: '仓储装卸区 危险品暂存库',
    deptId: 5,
    deptName: '生产保障部',
    zoneId: 'zone-6',
    lng: 112.3557, lat: 37.6049,
    responsibleId: 6,
    responsibleName: '陈文斌',
    supervisorId: 2,
    supervisorName: '李明辉',

    // 危险物质清单
    substances: [
      { name: '二甲苯', casNo: '95-47-6', hazardType: '易燃液体·类别3', maxQty: 4.2, unit: '吨', threshold: 10, ratio: 0.42 },
      { name: '正丁醇', casNo: '71-36-3', hazardType: '易燃液体·类别3', maxQty: 3.5, unit: '吨', threshold: 50, ratio: 0.07 },
      { name: '乙酸乙酯', casNo: '141-78-6', hazardType: '易燃液体·类别2', maxQty: 2.1, unit: '吨', threshold: 10, ratio: 0.21 },
      { name: '环氧树脂固化剂（含胺类）', casNo: '-', hazardType: '急性毒性·类别3', maxQty: 0.8, unit: '吨', threshold: 50, ratio: 0.016 },
      { name: '乙炔（溶解）', casNo: '74-86-2', hazardType: '易燃气体·类别1', maxQty: 0.06, unit: '吨', threshold: 1, ratio: 0.06 }
    ],
    R_value: 68.5, // Σ(q/Q) × 修正系数
    R_formula: 'Σ(qᵢ/Qᵢ) = 0.42 + 0.07 + 0.21 + 0.016 + 0.06 = 0.776 × α(88.3)',

    // 分级判定
    classification: {
      level: '二级',
      levelNum: 2,
      R_range: '50 ≤ R < 100',
      basis: 'GB 18218-2018 第4.2.2条',
      identifiedDate: '2024-06-15',
      identifiedBy: '山西信诚寰宇科技有限公司'
    },

    // 在线监测参数
    monitoring: {
      params: [
        { id: 'mon-1-1', name: '可燃气体浓度（LEL%）', current: 3.2, unit: '%LEL', lowWarn: 20, highWarn: 40, alarm: 60, status: 'normal', trend: 'stable', updateTime: '2026-07-16 11:30' },
        { id: 'mon-1-2', name: '库内温度', current: 26.5, unit: '°C', lowWarn: 5, highWarn: 35, alarm: 40, status: 'normal', trend: 'up', updateTime: '2026-07-16 11:30' },
        { id: 'mon-1-3', name: '通风系统风速', current: 1.2, unit: 'm/s', lowWarn: 0.5, highWarn: null, alarm: 0.3, status: 'normal', trend: 'stable', updateTime: '2026-07-16 11:30' }
      ],
      videoSources: [
        { id: 'cam-1-1', name: '库内全景', status: 'online', url: '#', lastCheck: '2026-07-16 08:00' },
        { id: 'cam-1-2', name: '出入口', status: 'online', url: '#', lastCheck: '2026-07-16 08:00' }
      ],
      alarmHistory: [
        { time: '2026-07-13 14:22', param: '库内温度', value: '37.8°C', level: '预警', handled: true, handler: '陈文斌', action: '开启辅助通风，温度恢复正常' }
      ]
    },

    // 安全评估报告
    safetyAssessment: {
      reportNo: '晋安评[2024]第0831号',
      agency: '山西信诚寰宇科技有限公司',
      assessDate: '2024-06-20',
      validUntil: '2027-06-19',
      nextAssessDate: '2027-03-01',
      status: '有效',
      conclusion: '个人风险和社会风险均可接受，现有管控措施有效',
      attachment: '太重铸锻件分公司_危险品库_安全评估报告_2024.pdf'
    },

    // 应急预案与演练
    emergencyPlan: {
      planName: '危险品暂存库火灾爆炸事故专项应急预案',
      planNo: 'TZZDJ-YJ-003',
      issueDate: '2024-08-01',
      drills: [
        { date: '2026-06-20', type: '实操演练', participants: 28, duration: '45min', result: '合格', issues: '个别人员疏散路线不熟悉', improvements: '已组织补训' },
        { date: '2025-12-15', type: '桌面推演', participants: 15, duration: '60min', result: '合格', issues: '通讯联络响应偏慢', improvements: '已增加备用通讯方式' },
        { date: '2025-06-18', type: '实操演练', participants: 32, duration: '50min', result: '合格', issues: '', improvements: '' }
      ],
      nextDue: '2026-12-20',
      supplies: [
        { name: '干粉灭火器（8kg）', qty: 6, location: '库门两侧', lastCheck: '2026-07-01' },
        { name: '消防沙箱', qty: 2, location: '库外消防点', lastCheck: '2026-07-01' },
        { name: '防毒面具', qty: 4, location: '应急器材柜', lastCheck: '2026-07-01' },
        { name: '防爆对讲机', qty: 2, location: '值班室', lastCheck: '2026-07-01' }
      ]
    },

    // 告知牌与备案
    notification: {
      boardStatus: '已设置',
      boardLocation: '危险品库入口',
      lastUpdated: '2025-06-01',
      content: '危险化学品：二甲苯、正丁醇、乙酸乙酯等  ·  最大储量：10.66吨  ·  危害特性：易燃、有毒  ·  应急措施：疏散→报警→灭火  ·  责任人：陈文斌  ·  24小时应急电话：0351-636XXXX',
      filingNo: '晋太应急危备[2024]039号',
      filingDate: '2024-07-15',
      filingAuthority: '太原市应急管理局',
      filingStatus: '已备案'
    }
  },
  {
    id: 'MHS-002',
    name: '氧气/乙炔工业气瓶库',
    level: '三级',
    levelNum: 3,
    status: '正常',
    _lifecycleStep: 3,
    location: '能源介质区 气瓶库',
    deptId: 4,
    deptName: '设备动力部',
    zoneId: 'zone-7',
    lng: 112.3533, lat: 37.6038,
    responsibleId: 5,
    responsibleName: '孙志明',
    supervisorId: 2,
    supervisorName: '李明辉',

    substances: [
      { name: '氧气（压缩）', casNo: '7782-44-7', hazardType: '氧化性气体·类别1', maxQty: 1.6, unit: '吨', threshold: 200, ratio: 0.008 },
      { name: '乙炔（溶解）', casNo: '74-86-2', hazardType: '易燃气体·类别1', maxQty: 0.15, unit: '吨', threshold: 1, ratio: 0.15 },
      { name: '液化石油气', casNo: '68476-85-7', hazardType: '易燃气体·类别1', maxQty: 0.5, unit: '吨', threshold: 10, ratio: 0.05 }
    ],
    R_value: 24.3,
    R_formula: 'Σ(qᵢ/Qᵢ) = 0.008 + 0.15 + 0.05 = 0.208 × α(116.8)',

    classification: {
      level: '三级',
      levelNum: 3,
      R_range: '10 ≤ R < 50',
      basis: 'GB 18218-2018 第4.2.2条',
      identifiedDate: '2024-06-15',
      identifiedBy: '山西信诚寰宇科技有限公司'
    },

    monitoring: {
      params: [
        { id: 'mon-2-1', name: '可燃气体浓度（LEL%）', current: 1.5, unit: '%LEL', lowWarn: 20, highWarn: 40, alarm: 60, status: 'normal', trend: 'stable', updateTime: '2026-07-16 11:30' },
        { id: 'mon-2-2', name: '氧气浓度', current: 20.8, unit: '%vol', lowWarn: 19.5, highWarn: 23, alarm: 18, status: 'normal', trend: 'stable', updateTime: '2026-07-16 11:30' },
        { id: 'mon-2-3', name: '库内温度', current: 28.1, unit: '°C', lowWarn: 5, highWarn: 40, alarm: 45, status: 'normal', trend: 'up', updateTime: '2026-07-16 11:30' }
      ],
      videoSources: [
        { id: 'cam-2-1', name: '气瓶库全景', status: 'online', url: '#', lastCheck: '2026-07-16 08:00' }
      ],
      alarmHistory: []
    },

    safetyAssessment: {
      reportNo: '晋安评[2024]第0832号',
      agency: '山西信诚寰宇科技有限公司',
      assessDate: '2024-06-20',
      validUntil: '2027-06-19',
      nextAssessDate: '2027-03-01',
      status: '有效',
      conclusion: '个人风险和社会风险均可接受',
      attachment: '太重铸锻件分公司_气瓶库_安全评估报告_2024.pdf'
    },

    emergencyPlan: {
      planName: '气瓶库泄漏火灾爆炸事故专项应急预案',
      planNo: 'TZZDJ-YJ-004',
      issueDate: '2024-08-01',
      drills: [
        { date: '2026-05-20', type: '实操演练', participants: 18, duration: '40min', result: '合格', issues: '', improvements: '' },
        { date: '2025-11-18', type: '桌面推演', participants: 12, duration: '50min', result: '合格', issues: '气瓶阀门关闭操作需强化', improvements: '已增加实操培训' }
      ],
      nextDue: '2026-11-20',
      supplies: [
        { name: '干粉灭火器（8kg）', qty: 4, location: '气瓶库入口', lastCheck: '2026-07-01' },
        { name: '气瓶推车（防倒链）', qty: 3, location: '库内', lastCheck: '2026-07-01' },
        { name: '防爆扳手', qty: 2, location: '应急器材柜', lastCheck: '2026-07-01' }
      ]
    },

    notification: {
      boardStatus: '已设置',
      boardLocation: '气瓶库入口',
      lastUpdated: '2025-06-01',
      content: '危险化学品：氧气（氧化性）、乙炔（易燃易爆）、液化石油气（易燃易爆）  ·  危害特性：助燃/爆炸  ·  应急措施：关阀→疏散→报警  ·  责任人：孙志明  ·  24小时应急电话：0351-636XXXX',
      filingNo: '晋太应急危备[2024]040号',
      filingDate: '2024-07-15',
      filingAuthority: '太原市应急管理局',
      filingStatus: '已备案'
    }
  },
  {
    id: 'MHS-003',
    name: '80t电炉/中频炉高温熔融金属作业单元',
    level: '三级',
    levelNum: 3,
    status: '正常',
    _lifecycleStep: 3,
    location: '联合厂房 熔炼铸造区',
    deptId: 1,
    deptName: '铸造车间',
    zoneId: 'zone-1',
    lng: 112.3526, lat: 37.6060,
    responsibleId: 1,
    responsibleName: '张建国',
    supervisorId: 2,
    supervisorName: '李明辉',

    substances: [
      { name: '高温熔融钢水（>1500°C）', casNo: '-', hazardType: '高温熔融金属', maxQty: 85, unit: '吨', threshold: 30, ratio: 2.83 }
    ],
    R_value: 12.5,
    R_formula: 'Σ(qᵢ/Qᵢ) = 85/30 = 2.83 × α(4.4)',

    classification: {
      level: '三级',
      levelNum: 3,
      R_range: '10 ≤ R < 50',
      basis: '冶金行业重大事故隐患判定标准 + GB 18218-2018',
      identifiedDate: '2024-06-15',
      identifiedBy: '山西信诚寰宇科技有限公司'
    },

    monitoring: {
      params: [
        { id: 'mon-3-1', name: '炉壁温度', current: 218, unit: '°C', lowWarn: null, highWarn: 300, alarm: 350, status: 'normal', trend: 'stable', updateTime: '2026-07-16 11:30' },
        { id: 'mon-3-2', name: '冷却水进水温度', current: 24.5, unit: '°C', lowWarn: null, highWarn: 35, alarm: 40, status: 'normal', trend: 'stable', updateTime: '2026-07-16 11:30' },
        { id: 'mon-3-3', name: '冷却水出水温度', current: 32.1, unit: '°C', lowWarn: null, highWarn: 45, alarm: 55, status: 'normal', trend: 'stable', updateTime: '2026-07-16 11:30' },
        { id: 'mon-3-4', name: '冷却水流量', current: 18.5, unit: 'm³/h', lowWarn: 15, highWarn: null, alarm: 12, status: 'normal', trend: 'stable', updateTime: '2026-07-16 11:30' },
        { id: 'mon-3-5', name: '炉前CO浓度', current: 4.2, unit: 'ppm', lowWarn: null, highWarn: 24, alarm: 35, status: 'normal', trend: 'stable', updateTime: '2026-07-16 11:30' }
      ],
      videoSources: [
        { id: 'cam-3-1', name: '电炉操作台', status: 'online', url: '#', lastCheck: '2026-07-16 08:00' },
        { id: 'cam-3-2', name: '浇注区', status: 'online', url: '#', lastCheck: '2026-07-16 08:00' },
        { id: 'cam-3-3', name: '冷却水系统', status: 'online', url: '#', lastCheck: '2026-07-16 08:00' }
      ],
      alarmHistory: [
        { time: '2026-07-10 09:45', param: '冷却水流量', value: '11.8 m³/h', level: '预警', handled: true, handler: '张建国', action: '排查管路发现微漏，紧急补水恢复流量' }
      ]
    },

    safetyAssessment: {
      reportNo: '晋安评[2024]第0833号',
      agency: '山西信诚寰宇科技有限公司',
      assessDate: '2024-06-20',
      validUntil: '2027-06-19',
      nextAssessDate: '2027-03-01',
      status: '有效',
      conclusion: '高温熔融金属作业单元管控措施有效，冷却水双路供水已落实',
      attachment: '太重铸锻件分公司_电炉单元_安全评估报告_2024.pdf'
    },

    emergencyPlan: {
      planName: '高温熔融金属泄漏爆炸事故专项应急预案',
      planNo: 'TZZDJ-YJ-001',
      issueDate: '2024-08-01',
      drills: [
        { date: '2026-04-15', type: '实操演练', participants: 35, duration: '60min', result: '合格', issues: '应急倾炉装置响应延迟2秒', improvements: '已调整液压系统' },
        { date: '2025-10-20', type: '桌面推演', participants: 20, duration: '90min', result: '合格', issues: '', improvements: '' },
        { date: '2025-04-10', type: '实操演练', participants: 40, duration: '55min', result: '合格', issues: '', improvements: '' }
      ],
      nextDue: '2026-10-15',
      supplies: [
        { name: '应急倾炉液压装置', qty: 1, location: '电炉操作台', lastCheck: '2026-07-01' },
        { name: '高温防护服', qty: 6, location: '炉前应急器材柜', lastCheck: '2026-07-01' },
        { name: '消防沙池', qty: 1, location: '炉前区域', lastCheck: '2026-07-01' },
        { name: '备用冷却水泵', qty: 2, location: '冷却水泵房', lastCheck: '2026-07-01' },
        { name: '急救箱', qty: 2, location: '车间值班室', lastCheck: '2026-07-01' }
      ]
    },

    notification: {
      boardStatus: '已设置',
      boardLocation: '熔炼铸造区入口',
      lastUpdated: '2025-06-01',
      content: '重大危险源：80t电炉高温熔融金属作业单元  ·  危害特性：高温烫伤/喷溅爆炸/CO中毒  ·  最大熔炼量：85吨  ·  应急措施：紧急倾炉→人员疏散→关闭能源介质→报警  ·  责任人：张建国  ·  24小时应急电话：0351-636XXXX',
      filingNo: '晋太应急危备[2024]041号',
      filingDate: '2024-07-15',
      filingAuthority: '太原市应急管理局',
      filingStatus: '已备案'
    }
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
    source: '日常巡检', severity: '重大', status: '待整改',
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
    source: '专项检查', severity: '重大', status: '整改中',
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
    source: '移动巡检', severity: '较大', status: '待复查',
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
    source: '日常巡检', severity: '一般', status: '已闭环',
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
    source: '移动巡检', severity: '重大', status: '已闭环',
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
  }
];

// ==== 集团督办状态枚举 ====
export const SUPERVISION_STATUS = {
  PENDING_RECEIVE: '待接收',
  FOLLOWING: '跟进中',
  PENDING_FEEDBACK: '待反馈确认',
  CLOSED: '已关闭'
};

// ==== 集团督办数据 ====
export const supervisions = [
  {
    id: 'DB20260713001',
    hazardId: 'YH20260712001', hazardTitle: '桥式起重机A区吊索具磨损超标',
    severity: '重大', orgId: 3, orgName: '太原重工铸锻件分公司',
    initiatorName: '集团安环·王总监', status: '跟进中',
    opinion: '桥式起重机吊索具磨损涉及重大起重伤害风险，请太原重工铸锻件分公司立即组织排查、更换，并在2日内反馈处置进度',
    createTime: '2026-07-13 10:00', receiveTime: '2026-07-13 10:30',
    feedback: [],
    timeline: [
      { time: '2026-07-13 10:00', action: '集团安环发起重大隐患督办', operator: '集团安环·王总监' },
      { time: '2026-07-13 10:30', action: '太原重工铸锻件分公司确认接收督办', operator: '李明辉' }
    ]
  },
  {
    id: 'DB20260714001',
    hazardId: 'YH20260710001', hazardTitle: '中频炉冷却水系统压力偏低',
    severity: '重大', orgId: 3, orgName: '太原重工铸锻件分公司',
    initiatorName: '集团安环·王总监', status: '跟进中',
    opinion: '中频炉属于重大危险源，请每日汇报冷却系统检修进度，确保7月20日前完成',
    createTime: '2026-07-14 09:00', receiveTime: '2026-07-14 09:15',
    feedback: [
      { time: '2026-07-14 16:00', content: '已完成管路排查，发现两处微漏点，正在更换密封件，预计7月16日完成', operator: '李明辉' }
    ],
    timeline: [
      { time: '2026-07-14 09:00', action: '集团安环就冷却系统隐患发起督办', operator: '集团安环·王总监' },
      { time: '2026-07-14 09:15', action: '太原重工铸锻件分公司接收督办', operator: '李明辉' },
      { time: '2026-07-14 16:00', action: '提交首次处置进度反馈', operator: '李明辉' }
    ]
  }
];

// ==== 特殊作业票状态枚举 ====
export const WORK_TYPE = {
  HIGH_ALTITUDE: { key: 'HIGH_ALTITUDE', label: '高处作业', icon: '🏗️' },
  LIFTING: { key: 'LIFTING', label: '吊装作业', icon: '⛓️' },
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
  { key: 'PENDING_SAFETY_REVIEW', label: '安环审核', role: '公司安环人员', icon: '👀' },
  { key: 'PENDING_LEADER_APPROVAL', label: '领导审批', role: '授权审批领导', icon: '✍️' },
  { key: 'PENDING_GUARDIAN', label: '监护确认', role: '现场监护人', icon: '✅' },
  { key: 'IN_PROGRESS', label: '作业执行', role: '作业人员', icon: '🔧' },
  { key: 'PENDING_ACCEPTANCE', label: '完工验收', role: '公司安环人员', icon: '📋' },
  { key: 'ARCHIVED', label: '归档', role: '公司安环人员', icon: '📁' }
];

// ==== 特殊作业数据 ====
export const workPermits = [
  // 草稿状态 — 展示新建申请流程的起点
  {
    id: 'GZ20260716001', workType: 'TEMPORARY_ELECTRICITY', status: '草稿',
    orgId: 3, deptId: 5, zoneId: 'zone-3', zoneName: '机加工车间南跨',
    title: '机加工车间南跨临时用电接线',
    applicantId: 9, applicantName: '赵明辉', applicantDept: '机加工车间',
    duration: '2026-07-16 08:00 ~ 2026-07-16 18:00',
    voltage: '380V', power: '30kW',
    approvalChain: '部门负责人 → 安环室 → 分管领导',
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
    approvalChain: '部门负责人 → 安环室 → 分管领导', duration: '2026-07-15 08:00 ~ 2026-07-15 17:00',
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
    loadWeight: '18t', equipmentType: '160T桥式起重机',
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
    loadWeight: '12t', equipmentType: '100T桥式起重机',
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
    height: '12m', duration: '2026-07-17 08:00 ~ 2026-07-17 17:00',
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
    voltage: '380V', power: '15kW', duration: '2026-07-16 08:00 ~ 2026-07-16 18:00',
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
    approvalChain: '部门负责人 → 安环室 → 分管领导 → 主要负责人',
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
  }
];

// ==== 驾驶舱统计数据 ====
export const dashboardStats = {
  totalHazards: 5,
  pendingHazards: 3,   // 待受理+待整改+整改中+待复查
  overdueHazards: 0,
  closedThisMonth: 2,
  activeSupervisions: 2,
  activeWorkPermits: 4,
  majorHazardTotal: 3,
  majorHazardWarning: 0,
  criticalRisks: [
    { zone: '熔炼铸造区', count: 3, level: '重大' },
    { zone: '锻压加工区', count: 2, level: '重大' },
    { zone: '大型构件吊装区', count: 1, level: '重大' }
  ],
  orgComparison: [
    { name: '太原重工铸锻件分公司', hazards: 5, activePermits: 2, supervisions: 2, riskLevel: '橙色' },
    { name: '山西太重工程机械有限公司', hazards: 1, activePermits: 0, supervisions: 0, riskLevel: '蓝色' }
  ]
};

// ==== 巡检任务 ====
export const inspectionTasks = [
  { id: 'XJ20260715001', type: '日常巡检', title: '铸造车间区域巡检', assigneeId: 6, assigneeName: '陈文斌',
    zoneId: 'zone-1', status: 'pending', deadline: '2026-07-15 17:00', checkItems: 12 },
  { id: 'XJ20260715002', type: '日常巡检', title: '锻压车间区域巡检', assigneeId: 6, assigneeName: '陈文斌',
    zoneId: 'zone-2', status: 'completed', deadline: '2026-07-15 12:00', checkItems: 10,
    completedAt: '2026-07-15 10:30', result: '正常，发现吊索具磨损已上报' }
];

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

// ==== 培训管理状态枚举 ====
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
  hazardSources: ['日常巡检', '专项检查', '移动巡检', '上级督查', '投诉举报'],
  hazardCategories: ['设备设施', '作业安全', '人员行为', '环境因素', '管理缺陷', '消防'],
  workTypes: [
    { key: 'HIGH_ALTITUDE', label: '高处作业', level: '一级/二级/三级/特级', measuresCount: 7 },
    { key: 'LIFTING', label: '吊装作业', level: '常规/特殊', measuresCount: 8 },
    { key: 'TEMPORARY_ELECTRICITY', label: '临时用电', level: '—', measuresCount: 7 }
  ],
  trainingTypes: ['专项培训', '年度培训', '三级教育', '复训', '应急演练'],
  majorHazardLevels: [
    { key: '一级', R_range: 'R ≥ 100', color: '#DC2626', desc: '社会风险不可接受，需立即整改降级' },
    { key: '二级', R_range: '50 ≤ R < 100', color: '#D97706', desc: '需制定严格管控措施，增加监测频次' },
    { key: '三级', R_range: '10 ≤ R < 50', color: '#CA8A04', desc: '常规管控，定期评估' },
    { key: '四级', R_range: 'R < 10', color: '#0075E6', desc: '一般管理，按计划复查' }
  ]
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
