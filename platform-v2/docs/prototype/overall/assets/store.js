/* ============================================================
 * 安全管理平台原型 · 统一状态仓库 store.js
 * 所有页面共享同一份 mock 数据与状态动作（对齐 PRD 数据模型）
 * 后续接入真实 API 时，在 App.actions 中替换为 fetch 调用即可
 * ============================================================ */
(function(){
"use strict";

/* ---------- 工具 ---------- */
function pad(n){return String(n).padStart(2,"0");}
function dstr(d){d=d||new Date();return d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate());}
function now(){var d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+":"+pad(d.getMinutes());}
function seq(prefix){App._seq[prefix]=(App._seq[prefix]||0)+1;return prefix+"-"+pad(App._seq[prefix]);}
function uid(){return "ID-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}

/* ---------- LEC 评价与风险等级 ---------- */
function calcD(L,E,C){return L*E*C;}
function levelOf(D){
  if(D>=320) return {key:"major",name:"重大",cls:"tag-major",color:"#E5484D"};
  if(D>=160) return {key:"big",name:"较大",cls:"tag-big",color:"#F5A623"};
  if(D>=70)  return {key:"common",name:"一般",cls:"tag-common",color:"#E4B23C"};
  return {key:"low",name:"低",cls:"tag-low",color:"#2388D9"};
}
function riskPointMeta(r,source){
  source=source||{};r=r||{};
  return {
    riskName:source.riskName!==undefined?source.riskName:(source.name!==undefined?source.name:r.name),
    org:source.org!==undefined?source.org:r.org,
    location:source.location!==undefined?source.location:r.location,
    category:source.category!==undefined?source.category:r.category,
    responsibilityPost:source.responsibilityPost!==undefined?source.responsibilityPost:(r.responsibilityPost||"班组长"),
    boundaryDescription:source.boundaryDescription!==undefined?source.boundaryDescription:r.boundaryDescription
  };
}
function applyRiskPointMeta(r,source){
  var meta=riskPointMeta(r,source);
  r.name=meta.riskName;r.org=meta.org;r.location=meta.location;r.category=meta.category;r.responsibilityPost=meta.responsibilityPost;r.boundaryDescription=meta.boundaryDescription;
  return meta;
}

/* ---------- 组织与角色 ---------- */
var ORGS=[
  {id:"group",name:"太重集团",children:[
    {id:"tz",name:"太原重工股份有限公司",children:[
      {id:"zj",name:"铸锻件分公司",children:[
        {id:"zaoxing",name:"造型作业区",children:[
          {id:"auto_line",name:"自动线组",children:[]},
          {id:"mould",name:"制模组",children:[]}
        ]}
      ]},
      {id:"jgps",name:"智能加工配送中心",children:[]}
    ]}
  ]}
];
var ROLES=[
  {key:"platform_admin",name:"平台管理员",user:"系统管理员",desc:"查看企业微信同步结果，维护安全业务角色和规则，不代办业务审批"},
  {key:"group_safety",name:"集团监督检查",user:"集团监督检查人员（演示）",desc:"发起集团监督检查、隐患督办和集团统计"},
  {key:"unit_leader",name:"二级单位领导",user:"铸锻件分公司领导（待配置）",desc:"在平台内审批本单位重大、较大风险的最后节点"},
  {key:"company_safety",name:"二级单位安全管理",user:"铸锻件分公司安全管理人员（待配置）",desc:"审核全部风险点；一般、低风险审核后生效，较大、重大风险继续报二级单位领导；负责随手拍及集团监督检查隐患受理、分派"},
  {key:"section_manager",name:"作业区负责人",user:"造型作业区负责人（待配置）",desc:"审核班组长提交的风险点，维护巡检计划，受理巡检隐患并复查整改结果"},
  {key:"team_leader",name:"班组长",user:"张青",desc:"填报风险新增、变更和复评，协调班组任务、解锁转交和现场组织"},
  {key:"team_member",name:"班组成员",user:"李天翔",desc:"领取巡检、现场执行、随手拍和整改反馈"},
  {key:"professional_inspector",name:"集团专业检查",user:"专业检查人员（演示）",desc:"录入并查看同专业部门已闭环检查台账"},
  {key:"management_viewer",name:"管理查看人员",user:"管理查看人员（待配置）",desc:"按授权范围只读查看台账和驾驶舱"},
  {key:"position_mapping_admin",name:"岗位映射管理员",user:"岗位映射管理员（待配置）",desc:"将企业微信人员映射到安全业务角色，不维护组织人员主数据，不代办业务"}
];

/* ---------- 基础 mock 数据 ---------- */
var App={
  version:"1.3.0",
  directorySource:"企业微信",
  _seq:{risk:1,hz:1,sup:1,wp:1,insp:1,ra:1,rv:1,duty:4,account:6,scope:10,scopeException:0,postMap:4,trainingBatch:2},
  orgs:ORGS,
  roles:ROLES,
  currentRole:(function(){try{return sessionStorage.getItem("tz_anquan_role")||"company_safety";}catch(e){return "company_safety";}})(),
  currentUser:function(){var r=this.roleOf(this.currentRole);return r?r.user:"企业微信人员（待配置）";},
  currentOrg:"太重集团 / 太原重工股份有限公司 / 铸锻件分公司 / 造型作业区",
  roleOf:function(k){for(var i=0;i<ROLES.length;i++){if(ROLES[i].key===k)return ROLES[i];}return ROLES[3];},

  /* ================= 风险 ================= */
  /* 风险点版本审批记录。危险源不设置独立审批。 */
  versionApprovals:[],
  changeRequests:[],
  riskNoticeViews:[],
  /* 风险辨识直接从风险点建档开始，不再维护独立辨识任务。 */
  riskTasks:[],
  risks:[
    {
      id:"R-001",code:"RISK-ZX-001",name:"自动线造型作业风险",org:"造型作业区",location:"自动线组造型工位",
      status:"已发布",version:"V1.0",level:"major",updatedAt:"2026-07-16 11:00",source:"双控报告历史导入",approvalExempt:true,responsibilityPost:"班组长",
      hazards:[
        {id:"HZ-R1",name:"砂箱吊运过程中吊具失效或人员进入吊物下方，可能造成起重伤害",accidentTypes:["起重伤害","物体打击"],accidentType:"起重伤害、物体打击",
         L:3,E:6,C:15,D:270,level:levelOf(270),assessmentStatus:"已完成",
         assessment:"D=L×E×C=3×6×15=270，属较大风险",assessor:"王欣宇",assessedAt:"2026-07-15 15:20",
         measures:[
           {id:"M-001",name:"砂箱吊运使用合格吊具并设置吊运警戒区域",type:"工程措施",status:"已落实",checked:true,
            responsibility:"造型作业区",duty:"张青",supervise:"集团监督检查",executor:"自动线组班组长"},
           {id:"M-002",name:"吊运前检查吊具、确认人员撤离吊物下方并记录",type:"管理措施",status:"已落实",checked:true,
            responsibility:"造型作业区",duty:"张青",supervise:"集团监督检查",executor:"自动线组班组长"}
         ]},
        {id:"HZ-R2",name:"造型过程中砂芯或砂箱定位不稳，可能造成物体打击",accidentType:"物体打击",
          L:3,E:6,C:15,D:270,level:levelOf(270),assessmentStatus:"已完成",
         assessment:"D=L×E×C=3×6×15=270，属较大风险",assessor:"王欣宇",assessedAt:"2026-07-31 10:05",
         measures:[
           {id:"M-003",name:"砂芯、砂箱就位后由两人确认定位可靠",type:"管理措施",status:"已落实",checked:true,
            responsibility:"造型作业区",duty:"张青",supervise:"集团监督检查",executor:"自动线组班组长"},
           {id:"M-004",name:"造型工位设置防护挡板和安全警示线",type:"工程措施",status:"待落实",checked:false,
            responsibility:"造型作业区",duty:"王欣宇",supervise:"集团监督检查",executor:"自动线组班组长"}
         ]}
      ]
    },
    {
      id:"R-002",code:"RISK-JP-001",name:"配送作业风险",org:"智能加工配送中心",location:"成品配送作业区",
      status:"已发布",version:"V1.0",level:"common",updatedAt:"2026-07-10 09:00",source:"双控报告历史导入",approvalExempt:true,responsibilityPost:"分公司负责人",
      hazards:[
        {id:"HZ-R3",name:"叉车与人员交叉通行，可能造成车辆伤害",accidentType:"车辆伤害",
         L:3,E:3,C:15,D:135,level:levelOf(135),assessmentStatus:"已完成",
         assessment:"D=L×E×C=3×3×15=135，属一般风险",assessor:"智能加工配送中心负责人（演示）",assessedAt:"2026-07-09 14:00",
         measures:[
           {id:"M-005",name:"人车交叉路口设置隔离护栏、反光镜和限速标识",type:"工程措施",status:"已落实",checked:true,
            responsibility:"智能加工配送中心",duty:"智能加工配送中心负责人（演示）",supervise:"集团监督检查",executor:"配送班组"},
           {id:"M-006",name:"叉车作业前检查制动、灯光和报警装置并记录",type:"管理措施",status:"已落实",checked:true,
            responsibility:"智能加工配送中心",duty:"智能加工配送中心负责人（演示）",supervise:"集团监督检查",executor:"配送班组"}
         ]}
      ]
    },
    {
      id:"R-003",code:"RISK-ZX-002",name:"混砂加料作业风险",org:"造型作业区",location:"自动线组混砂机加料工位",
      status:"已发布",version:"V1.0",level:"common",updatedAt:"2026-08-05 10:20",source:"现场辨识",approvalExempt:false,responsibilityPost:"班组长",category:"作业活动风险",controlLevel:"分公司",checkFreq:{group:"1次/班",branch:"1次/周",company:"1次/月"},mapPosition:{area:"自动线组混砂机加料工位",floor:"1F",x:390,y:285},
      hazards:[
        {id:"HZ-R4",name:"混砂机运行时人员接近旋转部位，可能造成机械伤害",accidentType:"机械伤害",
         L:3,E:3,C:15,D:135,level:levelOf(135),assessmentStatus:"已完成",assessment:"D=L×E×C=3×3×15=135，属一般风险",assessor:"王欣宇",assessedAt:"2026-08-04 15:10",
         controlResponsibilities:[{level:"班组/工部",dept:"造型作业区 / 自动线组",person:"张青",frequency:"每日 1 次"},{level:"分公司",dept:"铸锻件分公司",person:"王欣宇",frequency:"每周 1 次"},{level:"公司",dept:"太原重工股份有限公司",person:"赵志宏",frequency:"每月 1 次"}],
         measures:[
           {id:"M-007",name:"混砂机传动和旋转部位设置固定防护罩及联锁装置",type:"工程技术措施",status:"已落实",checked:true,responsibility:"造型作业区",duty:"张青",supervise:"铸锻件分公司安全管理",executor:"自动线组岗位人员",frequency:"班组/工部每日 1 次；分公司每周 1 次；公司每月 1 次",evidence:"设备点检记录和现场照片"},
           {id:"M-008",name:"开机前确认防护装置完好，清理堵料必须停机挂牌",type:"管理措施",status:"已落实",checked:true,responsibility:"造型作业区",duty:"张青",supervise:"铸锻件分公司安全管理",executor:"自动线组岗位人员",frequency:"班组/工部每日 1 次；分公司每周 1 次；公司每月 1 次",evidence:"班前检查记录"}
         ]},
        {id:"HZ-R5",name:"加料过程中粉尘逸散，人员吸入可能造成职业健康损害",accidentType:"其他伤害",
         L:3,E:6,C:5,D:90,level:levelOf(90),assessmentStatus:"已完成",assessment:"D=L×E×C=3×6×5=90，属一般风险",assessor:"王欣宇",assessedAt:"2026-08-04 15:30",
         controlResponsibilities:[{level:"班组/工部",dept:"造型作业区 / 自动线组",person:"张青",frequency:"每日 1 次"},{level:"分公司",dept:"铸锻件分公司",person:"王欣宇",frequency:"每周 1 次"},{level:"公司",dept:"太原重工股份有限公司",person:"赵志宏",frequency:"每月 1 次"}],
         measures:[
           {id:"M-009",name:"加料口设置局部除尘装置并保持运行有效",type:"工程技术措施",status:"已落实",checked:true,responsibility:"造型作业区",duty:"王欣宇",supervise:"铸锻件分公司安全管理",executor:"自动线组岗位人员",frequency:"班组/工部每日 1 次；分公司每周 1 次；公司每月 1 次",evidence:"除尘设备运行记录"},
           {id:"M-010",name:"加料作业前检查除尘装置，作业人员规范佩戴防尘口罩",type:"管理措施",status:"已落实",checked:true,responsibility:"造型作业区",duty:"王欣宇",supervise:"铸锻件分公司安全管理",executor:"自动线组岗位人员",frequency:"班组/工部每日 1 次；分公司每周 1 次；公司每月 1 次",evidence:"班前检查记录和劳保穿戴记录"}
         ]}
      ]
    },
    {
      id:"R-004",code:"RISK-ZX-003",name:"制模木工作业风险",org:"造型作业区",location:"制模组木模加工区",
      status:"已发布",version:"V1.0",level:"big",updatedAt:"2026-08-06 14:10",source:"现场辨识",approvalExempt:false,responsibilityPost:"班组长",category:"作业活动风险",controlLevel:"分公司",checkFreq:{group:"1次/班",branch:"1次/周",company:"1次/月"},mapPosition:{area:"制模组木模加工区",floor:"1F",x:650,y:340},
      hazards:[
        {id:"HZ-R6",name:"木工圆锯作业时手部接近锯片或木料反弹，可能造成机械伤害",accidentType:"机械伤害",
         L:3,E:6,C:15,D:270,level:levelOf(270),assessmentStatus:"已完成",assessment:"D=L×E×C=3×6×15=270，属较大风险",assessor:"赵志宏",assessedAt:"2026-08-05 11:10",
         controlResponsibilities:[{level:"班组/工部",dept:"造型作业区 / 制模组",person:"李建杰",frequency:"每日 1 次"},{level:"分公司",dept:"铸锻件分公司",person:"赵志宏",frequency:"每周 1 次"},{level:"公司",dept:"太原重工股份有限公司",person:"王欣宇",frequency:"每月 1 次"}],
         measures:[
           {id:"M-011",name:"圆锯安装锯片防护罩、防反弹装置和急停开关",type:"工程技术措施",status:"已落实",checked:true,responsibility:"造型作业区",duty:"李建杰",supervise:"铸锻件分公司安全管理",executor:"制模组岗位人员",frequency:"班组/工部每日 1 次；分公司每周 1 次；公司每月 1 次",evidence:"设备点检记录和现场照片"},
           {id:"M-012",name:"作业前检查防护装置，短料和窄料加工必须使用推料工具",type:"管理措施",status:"已落实",checked:true,responsibility:"造型作业区",duty:"李建杰",supervise:"铸锻件分公司安全管理",executor:"制模组岗位人员",frequency:"班组/工部每日 1 次；分公司每周 1 次；公司每月 1 次",evidence:"木工设备班前检查记录"}
         ]},
        {id:"HZ-R7",name:"木屑粉尘积聚并接触火源，可能引发火灾",accidentType:"火灾",
         L:3,E:3,C:15,D:135,level:levelOf(135),assessmentStatus:"已完成",assessment:"D=L×E×C=3×3×15=135，属一般风险",assessor:"赵志宏",assessedAt:"2026-08-05 11:35",
         controlResponsibilities:[{level:"班组/工部",dept:"造型作业区 / 制模组",person:"李建杰",frequency:"每日 1 次"},{level:"分公司",dept:"铸锻件分公司",person:"赵志宏",frequency:"每周 1 次"},{level:"公司",dept:"太原重工股份有限公司",person:"王欣宇",frequency:"每月 1 次"}],
         measures:[
           {id:"M-013",name:"木工区域配置吸尘设施和适用灭火器材",type:"工程技术措施",status:"已落实",checked:true,responsibility:"造型作业区",duty:"赵志宏",supervise:"铸锻件分公司安全管理",executor:"制模组岗位人员",frequency:"班组/工部每日 1 次；分公司每周 1 次；公司每月 1 次",evidence:"消防器材点检和除尘记录"},
           {id:"M-014",name:"每班清理木屑粉尘，木工区域禁止吸烟和违规动火",type:"管理措施",status:"已落实",checked:true,responsibility:"造型作业区",duty:"赵志宏",supervise:"铸锻件分公司安全管理",executor:"制模组岗位人员",frequency:"班组/工部每日 1 次；分公司每周 1 次；公司每月 1 次",evidence:"现场清扫确认记录"}
         ]}
      ]
    }
  ],
  versions:[
    {id:"RV-1",code:"RISK-ZX-001",version:"V1.0",status:"当前生效",riskName:"自动线造型作业风险",hazardCount:2,measureCount:4,maxLevel:"较大",operator:"历史导入",publishedAt:"2026-07-16 11:00",source:"双控报告历史导入",approvalExempt:true,note:"首批双控报告导入，作为历史版本直接生效"},
    {id:"RV-2",code:"RISK-JP-001",version:"V1.0",status:"当前生效",riskName:"配送作业风险",hazardCount:1,measureCount:2,maxLevel:"一般",operator:"历史导入",publishedAt:"2026-07-10 09:00",source:"双控报告历史导入",approvalExempt:true,note:"首批双控报告导入，作为历史版本直接生效"},
    {id:"RV-3",code:"RISK-ZX-002",version:"V1.0",status:"当前生效",riskName:"混砂加料作业风险",hazardCount:2,measureCount:4,maxLevel:"一般",operator:"王欣宇",publishedAt:"2026-08-05 10:20",source:"现场辨识",note:"风险点整体审批通过并生效"},
    {id:"RV-4",code:"RISK-ZX-003",version:"V1.0",status:"当前生效",riskName:"制模木工作业风险",hazardCount:2,measureCount:4,maxLevel:"较大",operator:"赵志宏",publishedAt:"2026-08-06 14:10",source:"现场辨识",note:"风险点整体审批通过并生效"}
  ],

  /* ================= 巡检 ================= */
  inspectionItems:[
    {id:"IT-01",code:"CHK-001",standardVersionId:"STD-RISK-ZX-001-V1",name:"自动线砂箱吊具及防脱装置完好",standard:"吊具连接牢固，防脱装置无缺失",response:"是非",requiredPhoto:true,sourceMeasure:"M-001",riskCode:"RISK-ZX-001",enabled:true},
    {id:"IT-02",code:"CHK-002",standardVersionId:"STD-RISK-ZX-001-V1",name:"作业前吊运检查记录已填写",standard:"当日检查记录签字完整",response:"是非",requiredPhoto:false,sourceMeasure:"M-002",riskCode:"RISK-ZX-001",enabled:true},
    {id:"IT-03",code:"CHK-003",standardVersionId:"STD-RISK-ZX-001-V1",name:"砂箱定位夹紧确认（双人复核）",standard:"定位夹紧后双人确认并签字",response:"是非",requiredPhoto:true,sourceMeasure:"M-003",riskCode:"RISK-ZX-001",enabled:true},
    {id:"IT-04",code:"CHK-004",standardVersionId:"STD-RISK-ZX-001-V1",name:"落砂飞溅挡板安装到位",standard:"挡板安装牢固、覆盖作业区域",response:"是非",requiredPhoto:true,sourceMeasure:"M-004",riskCode:"RISK-ZX-001",enabled:true},
    {id:"IT-05",code:"CHK-005",standardVersionId:"STD-GENERAL-ZX-001-V1",name:"灭火器压力表指针在绿区",standard:"压力正常、铅封完好",response:"是非",requiredPhoto:false,sourceMeasure:null,riskCode:null,enabled:true}
  ],
  inspectionPlans:[
    {id:"IP-01",code:"INSP-2026-001",name:"造型作业区每日岗位巡检",type:"日常岗位巡检",subtype:"岗位日常",org:"造型作业区",scope:"自动线组、制模组",cycle:"每日",teamId:"T-01",teamName:"自动线组",status:"已发布",startDate:"2026-08-01",endDate:"2026-12-31",createdAt:"2026-07-31 16:20",standardRefs:[{riskCode:"RISK-ZX-001",standardVersion:"V1"}],items:["IT-01","IT-02","IT-03","IT-04","IT-05"]},
    {id:"IP-02",code:"INSP-2026-002",name:"制模组每周监督检查",type:"监督检查",subtype:"专项",org:"造型作业区",scope:"制模组木模加工区",cycle:"每周",teamId:"T-02",teamName:"制模组",status:"草稿",startDate:"2026-08-03",endDate:"2026-12-31",createdAt:"2026-08-01 09:00",standardRefs:[],items:[]}
  ],
  inspectionTasks:[
    {id:"IT-01T",code:"INSP-T-20260801-001",planId:"IP-01",planName:"造型作业区每日巡检计划",org:"造型作业区",teamId:"T-01",teamName:"自动线组",assignee:"张青",window:"2026-08-01 08:00 ~ 12:00",status:"待执行",completionRate:0,unqualified:0,createdAt:"2026-08-01 08:00",results:null},
    {id:"IT-02T",code:"INSP-T-20260731-001",planId:"IP-01",planName:"造型作业区每日巡检计划",org:"造型作业区",teamId:"T-01",teamName:"自动线组",assignee:"张青",window:"2026-07-31 08:00 ~ 12:00",status:"已完成",completionRate:100,unqualified:1,createdAt:"2026-07-31 08:00",completedAt:"2026-07-31 09:40",results:[]}
  ],
  /* ================= 巡检新版演示模型 =================
   * 检查标准草稿按风险点保存；计划引用已发布标准；任务由计划派发。
   * inspectionSpecVersion 用于一次性清理旧版巡检样例，避免旧状态污染新规格演示。
   */
  inspectionSpecVersion:0,
  drafts:{},
  plans:[],
  tasks:[],

  /* ================= 隐患 ================= */
  hazardPhrases:["立即消除现场不安全状态，并确认防护措施有效","完成整改后上传现场照片，确保问题不反弹","整改完成前落实临时隔离和警示措施"],
  hazards:[
    {id:"H-001",code:"HZ-20260730-001",title:"自动线砂箱吊具固定螺栓松动",org:"造型作业区",location:"造型车间自动线组砂箱吊运位",
     source:"INSPECTION",sourceLabel:"巡检发现",sourceRef:"INSP-T-20260730-001",severity:"一般",riskCode:"RISK-ZX-001",rewardEligible:false,rewardStatus:"不参与奖励",
     responsibleDept:"造型作业区 / 自动线组",responsibleUser:"张青",responsiblePersonId:"P-001",deadline:"2026-08-02 18:00",
     status:"待复查",reporter:"张青",createdAt:"2026-07-30 10:20",closedAt:null,
     description:"巡检发现自动线砂箱吊具固定螺栓松动，存在吊具失稳风险。",
     rectification:{plan:"更换 M8×30 高强度螺栓并涂防松胶，紧固力矩按设备手册执行。",completed:"已完成螺栓更换与紧固，力矩 25N·m，防护罩晃动检查通过。",evidenceBefore:true,evidenceAfter:true,submittedAt:"2026-07-31 15:30",reviewStatus:"待复查"},
     actions:[
       {type:"登记",at:"2026-07-30 10:20",by:"张青",note:"巡检不合格一键转隐患"},
       {type:"受理",at:"2026-07-30 10:45",by:"王欣宇",note:"定级：一般隐患"},
       {type:"分派",at:"2026-07-30 10:50",by:"王欣宇",note:"指定责任人张青，期限 08-02"},
       {type:"整改提交",at:"2026-07-31 15:30",by:"张青",note:"已提交整改反馈，待复查"}
     ]},
    {id:"H-002",code:"HZ-20260728-002",title:"车间通道堆放杂物影响疏散",org:"造型作业区",location:"造型车间东侧通道",
      source:"MOBILE_REPORT",sourceLabel:"随手拍",sourceRef:null,severity:"一般",riskCode:null,rewardEligible:true,rewardStatus:"待奖励评定",
     responsibleDept:"造型作业区 / 自动线组",responsibleUser:"张青",responsiblePersonId:"P-001",deadline:"2026-07-30 18:00",
     status:"已闭环",reporter:"李天翔",createdAt:"2026-07-28 09:10",closedAt:"2026-07-30 14:30",
     description:"东侧疏散通道堆放半成品料架，影响紧急疏散。",
     rectification:{plan:"清理通道料架，划定定置线。",completed:"已完成清理并划制定置线。",evidenceBefore:true,evidenceAfter:true,submittedAt:"2026-07-29 16:00",reviewStatus:"通过"},
     actions:[
       {type:"登记",at:"2026-07-28 09:10",by:"李天翔",note:"移动随手拍"},
       {type:"受理",at:"2026-07-28 09:30",by:"王欣宇",note:"定级：一般"},
       {type:"分派",at:"2026-07-28 09:35",by:"王欣宇",note:"责任人张青"},
       {type:"整改提交",at:"2026-07-29 16:00",by:"张青",note:"清理完成"},
       {type:"复查通过",at:"2026-07-30 14:30",by:"王欣宇",note:"现场复查合格，闭环"}
     ]},
    {id:"H-003",code:"HZ-20260801-001",title:"砂箱自动线防护门联锁异常",org:"造型作业区",location:"造型车间自动线组浇注段",
      source:"INSPECTION",sourceLabel:"巡检发现",sourceRef:null,severity:null,riskCode:"RISK-ZX-001",rewardEligible:false,rewardStatus:"不参与奖励",
     responsibleDept:null,responsibleUser:null,deadline:null,
     status:"待受理",reporter:"李天翔",createdAt:"2026-08-01 09:10",closedAt:null,
     description:"执行自动线日常巡检时发现防护门联锁动作异常，人员误入存在机械伤害风险。",
     rectification:null,
     actions:[{type:"登记",at:"2026-08-01 09:10",by:"李天翔",note:"巡检不合格一键转隐患"}]},
    {id:"H-004",code:"HZ-20260810-004",title:"配电柜接地标识缺失",org:"造型作业区",location:"造型车间配电区",
      source:"PROFESSIONAL_DEPT_CHECK",sourceLabel:"集团专业检查",sourceRef:"设备能源部专项检查-20260810",severity:"一般",riskCode:null,rewardEligible:false,rewardStatus:"不参与奖励",professionalDeptId:"equipment_energy",
      inspectionDept:"设备能源部",assessmentResponsible:"李建杰",penaltyAmount:500,oaRequired:false,oaStatus:"不走OA",
      responsibleDept:null,responsibleUser:null,deadline:null,status:"已闭环",reporter:"专业检查人员（演示）",createdAt:"2026-08-10 10:20",closedAt:"2026-08-10 10:20",
      description:"设备能源部专项检查发现配电柜接地标识缺失。",sourceEvidence:{photo:true,note:"专业检查现场照片",label:"集团专业检查证据"},rectification:null,
      actions:[{type:"提交闭环",at:"2026-08-10 10:20",by:"专业检查人员（演示）",note:"集团专业检查登记；考核责任人李建杰，罚款500元；提交即闭环"}]},
    {id:"H-005",code:"HZ-20260810-005",title:"有限空间警示隔离不到位",org:"造型作业区",location:"造型车间有限空间检修位",
      source:"HSE_SUPERVISION",sourceLabel:"集团监督检查",sourceRef:"监督检查-20260810",severity:"重大",riskCode:null,rewardEligible:false,rewardStatus:"不参与奖励",
      inspectionDept:"集团监督检查",assessmentResponsible:null,penaltyAmount:null,oaRequired:true,oaStatus:"审批中",oaInstanceId:"OA-HSE-20260810-005",oaStatusUrl:"oa/index.html?view=detail&instance=OA-HSE-20260810-005",
      responsibleDept:null,responsibleUser:null,deadline:null,status:"审批中",reporter:"集团监督检查人员（演示）",createdAt:"2026-08-10 11:10",closedAt:null,
      description:"监督检查发现有限空间作业区域警示隔离不到位。",sourceEvidence:{photo:true,note:"监督检查现场证据",label:"集团监督检查证据"},rectification:null,
      actions:[{type:"登记",at:"2026-08-10 11:10",by:"集团监督检查人员（演示）",note:"监督检查登记并发起 OA"},{type:"OA受理",at:"2026-08-10 11:20",by:"系统",note:"已返回实例号和审批状态链接；平台不展示 OA 流程"}]}
  ],
  supervisions:[
    {id:"S-001",code:"SUP-2026-001",title:"自动线砂箱吊具整改隐患督办",hazardCode:"HZ-20260730-001",hazardTitle:"自动线砂箱吊具固定螺栓松动",
     level:"集团级",fromOrg:"集团安环部",toOrg:"铸锻件分公司",opinion:"防护装置涉及机械伤害重大风险，请公司按期限完成整改并反馈。",
     deadline:"2026-08-05 18:00",status:"反馈中",createdAt:"2026-07-30 11:00",feedbackCount:1,
     feedbacks:[
       {id:"FB-01",progress:60,text:"已更换螺栓并紧固，待安全管理人员复查。",by:"王欣宇",at:"2026-07-31 15:40",evidence:true}
     ],
     actions:[
       {type:"发起",at:"2026-07-30 11:00",by:"集团监督检查人员（演示）",note:"关联隐患 HZ-20260730-001"},
       {type:"接收",at:"2026-07-30 14:00",by:"王欣宇",note:"分公司确认接收，责任人张青"},
       {type:"反馈",at:"2026-07-31 15:40",by:"王欣宇",note:"第一次进度反馈 60%"}
     ]}
  ],

  /* ================= 培训与证书 ================= */
  trainingRecords:[
    {id:"TR-001",code:"TRAIN-2026-001",user:"王欣宇",org:"造型作业区 / 自动线组",course:"双重预防机制与风险分级管控培训",type:"安全管理培训",method:"集中培训",startDate:"2026-06-18",endDate:"2026-06-18",hours:4,result:"合格",score:92,source:"培训中心同步",sourceRecordId:"TC-20260618-031",status:"已完成"},
    {id:"TR-002",code:"TRAIN-2026-002",user:"张青",org:"造型作业区 / 自动线组",course:"砂箱吊运与自动线岗位安全培训",type:"岗位安全培训",method:"现场培训",startDate:"2026-07-08",endDate:"2026-07-08",hours:3,result:"合格",score:88,source:"培训中心同步",sourceRecordId:"TC-20260708-012",status:"已完成"},
    {id:"TR-003",code:"TRAIN-2026-003",user:"张云龙",org:"造型作业区 / 自动线组",course:"有限空间作业专项安全培训",type:"专项培训",method:"集中培训",startDate:"2026-04-20",endDate:"2026-04-21",hours:8,result:"合格",score:86,source:"培训中心同步",sourceRecordId:"TC-20260421-007",status:"已完成"},
    {id:"TR-004",code:"TRAIN-2026-004",user:"李建杰",org:"造型作业区 / 制模组",course:"班组长安全履职培训",type:"安全管理培训",method:"线上学习",startDate:"2026-05-10",endDate:"2026-05-12",hours:6,result:"合格",score:90,source:"培训中心同步",sourceRecordId:"TC-20260512-023",status:"已完成"},
    {id:"TR-005",code:"TRAIN-2026-005",user:"赵志宏",org:"造型作业区 / 制模组",course:"临时用电作业安全培训",type:"专项培训",method:"集中培训",startDate:"2026-07-16",endDate:"2026-07-16",hours:4,result:"合格",score:91,source:"培训中心同步",sourceRecordId:"TC-20260716-018",status:"已完成"},
    {id:"TR-006",code:"TRAIN-2026-006",user:"李天翔",org:"造型作业区 / 自动线组",course:"新员工三级安全教育",type:"三级安全教育",method:"集中培训",startDate:"2026-03-02",endDate:"2026-03-04",hours:24,result:"合格",score:85,source:"培训中心同步",sourceRecordId:"TC-20260304-005",status:"已完成"}
  ],
  trainingSyncAt:"2026-08-12 18:00",
  trainingSyncBatches:[
    {id:"TSB-002",syncAt:"2026-08-12 18:00",source:"培训中心",total:6,success:6,failed:0,status:"已完成",operator:"系统同步",exceptions:[]},
    {id:"TSB-001",syncAt:"2026-08-01 18:00",source:"培训中心",total:3,success:1,failed:2,status:"部分失败",operator:"系统同步",exceptions:[
      {sourceRecordId:"TC-20260801-041",personName:"演示人员甲",reason:"企业微信人员匹配失败",status:"待处理"},
      {sourceRecordId:"TC-20260801-042",personName:"演示人员乙",reason:"培训结束日期缺失",status:"待处理"}
    ]}
  ],
  certs:[
    {id:"C-001",user:"高远",org:"造型作业区 / 自动线组",role:"作业人员",cert:"动火作业证",code:"T4521***018",issuer:"太原市应急管理部门",issueDate:"2023-12-31",expire:"2026-12-31",source:"平台维护",status:"有效",attachment:true,updatedAt:"2026-07-20 09:30"},
    {id:"C-002",user:"张云龙",org:"造型作业区 / 自动线组",role:"作业人员",cert:"有限空间作业证",code:"QS14***205",issuer:"太原市应急管理部门",issueDate:"2022-11-20",expire:"2025-11-20",source:"历史台账导入",status:"已过期",attachment:true,updatedAt:"2026-07-20 09:32"},
    {id:"C-003",user:"张云龙",org:"造型作业区 / 自动线组",role:"作业人员",cert:"高处作业证",code:"T1401***206",issuer:"太原市应急管理部门",issueDate:"2023-10-15",expire:"2026-10-15",source:"平台维护",status:"临期",attachment:true,updatedAt:"2026-07-20 09:35"},
    {id:"C-004",user:"张青",org:"造型作业区 / 自动线组",role:"班组长/监护人",cert:"安全管理人员资格证",code:"AQ14***077",issuer:"山西省安全培训机构",issueDate:"2024-03-01",expire:"2027-03-01",source:"平台维护",status:"有效",attachment:true,updatedAt:"2026-07-20 09:40"},
    {id:"C-005",user:"高远",org:"造型作业区 / 自动线组",role:"作业人员",cert:"有限空间作业证",code:"QS14***301",issuer:"太原市应急管理部门",issueDate:"2023-09-10",expire:"2026-09-10",source:"平台维护",status:"临期",attachment:true,updatedAt:"2026-07-20 09:45"},
    {id:"C-006",user:"赵志宏",org:"造型作业区 / 制模组",role:"兼职安全员",cert:"电工作业证",code:"T1501***112",issuer:"太原市应急管理部门",issueDate:"2024-05-20",expire:"2027-05-20",source:"平台维护",status:"有效",attachment:true,updatedAt:"2026-07-20 09:50"}
  ],

  /* ================= 相关方管理 ================= */
  partners:[
    {id:"RP-001",code:"PARTY-2026-001",name:"太原华虎机械设备检修有限公司",maintainingOrg:"铸锻件分公司",serviceScope:"自动线设备检修与保养",contact:"刘志强",phone:"13800001201",status:"合作中",updatedAt:"2026-08-25 14:10",people:[{id:"RPP-001",name:"赵海峰",job:"检修钳工",phone:"13800001211",status:"在场",certificates:[{id:"RPC-001",name:"特种设备作业人员证",number:"TS6A142026001",expire:"2028-04-30",attachmentName:"赵海峰-特种设备作业人员证.pdf",attachmentType:"PDF"}]},{id:"RPP-002",name:"陈磊",job:"检修电工",phone:"13800001212",status:"在场",certificates:[{id:"RPC-002",name:"低压电工作业证",number:"T1420260088",expire:"2027-12-31",attachmentName:"陈磊-低压电工作业证.jpg",attachmentType:"图片"}]}]},
    {id:"RP-002",code:"PARTY-2026-002",name:"山西安泰工业服务有限公司",maintainingOrg:"智能加工配送中心",serviceScope:"物流装卸与现场辅助服务",contact:"孙建国",phone:"13800001221",status:"合作中",updatedAt:"2026-08-26 09:40",people:[{id:"RPP-003",name:"周建军",job:"装卸作业人员",phone:"13800001231",status:"在场",certificates:[{id:"RPC-003",name:"叉车司机证",number:"TS6A142025097",expire:"2027-06-30",attachmentName:"周建军-叉车司机证.pdf",attachmentType:"PDF"}]},{id:"RPP-004",name:"马强",job:"现场辅助人员",phone:"13800001232",status:"在场",certificates:[]}]}
  ],
  partyViolations:[
    {id:"RPV-004",code:"RPV-2026-004",partnerId:"RP-001",personId:"RPP-001",date:"2026-08-22",location:"铸锻件分公司自动线检修区域",content:"检修作业完成后未及时清理现场工具",level:"一般违章",evidenceName:"检修现场违章-0822.jpg",handling:"现场教育并完成清理",recordedBy:"铸锻件分公司安全管理"},
    {id:"RPV-001",code:"RPV-2026-001",partnerId:"RP-002",personId:"RPP-003",date:"2026-06-12",location:"智能加工配送中心配送通道",content:"叉车行驶过程中未按规定系安全带",level:"一般违章",evidenceName:"违章现场照片-0612.jpg",handling:"现场教育并记录",recordedBy:"智能加工配送中心安全管理"},
    {id:"RPV-002",code:"RPV-2026-002",partnerId:"RP-002",personId:"RPP-003",date:"2026-07-04",location:"智能加工配送中心装卸区",content:"装卸作业时未按规定佩戴安全帽",level:"一般违章",evidenceName:"违章现场照片-0704.jpg",handling:"书面警示",recordedBy:"智能加工配送中心安全管理"},
    {id:"RPV-003",code:"RPV-2026-003",partnerId:"RP-002",personId:"RPP-003",date:"2026-08-18",location:"智能加工配送中心配送通道",content:"叉车作业区域内违规使用手机",level:"一般违章",evidenceName:"违章现场照片-0818.jpg",handling:"第三次违章，自动标记黑名单",recordedBy:"智能加工配送中心安全管理"}
  ],

  /* ================= 安全知识库与应急管理 ================= */
  knowledgeDocs:[
    {id:"KD-001",code:"LAW-001",category:"法律法规",title:"中华人民共和国安全生产法",level:"国家法律",issuer:"全国人民代表大会常务委员会",publishDate:"2021-06-10",effectiveDate:"2021-09-01",version:"2021修订",status:"现行有效",fileName:"中华人民共和国安全生产法.pdf",pages:42,scope:"全公司",updatedAt:"2026-08-23 09:00",clauses:[{no:"第二十一条",text:"生产经营单位的主要负责人对本单位安全生产工作负有建立健全全员安全生产责任制等职责。"},{no:"第四十一条",text:"生产经营单位应当建立安全风险分级管控制度，按照安全风险分级采取相应的管控措施。"}]},
    {id:"KD-002",code:"SYS-001",category:"安全制度",title:"安全生产责任制管理办法",level:"公司制度",issuer:"太原重工股份有限公司",publishDate:"2026-01-10",effectiveDate:"2026-02-01",version:"V2.0",status:"现行有效",fileName:"安全生产责任制管理办法.pdf",pages:18,scope:"太原重工股份有限公司",updatedAt:"2026-08-23 09:20",clauses:[{no:"第六条",text:"各级组织应将岗位安全职责落实到责任岗位，并按岗位人员变化及时更新承接关系。"},{no:"第十二条",text:"二级单位安全管理人员负责组织检查岗位安全职责落实情况。"}]},
    {id:"KD-003",code:"SYS-002",category:"安全制度",title:"危险作业安全管理制度",level:"公司制度",issuer:"太原重工股份有限公司",publishDate:"2026-03-01",effectiveDate:"2026-03-15",version:"V1.0",status:"现行有效",fileName:"危险作业安全管理制度.pdf",pages:26,scope:"太原重工股份有限公司",updatedAt:"2026-08-23 10:00",clauses:[{no:"第十五条",text:"一级动火作业单次许可时间和每次延期均不得超过八小时。"},{no:"第二十二条",text:"作业开工前应完成现场确认、位置核验和开工影像留存。"}]}
  ],
  emergencyPlans:[
    {id:"EP-001",code:"EP-ZJ-001",title:"铸锻件分公司综合应急预案",type:"综合应急预案",org:"铸锻件分公司",version:"V3.0",publishDate:"2026-04-01",effectiveDate:"2026-04-15",status:"现行有效",fileName:"铸锻件分公司综合应急预案.pdf",pages:58,owner:"铸锻件分公司安全管理",updatedAt:"2026-08-23 10:20",clauses:[{no:"4.2 预警行动",text:"发现事故征兆时，现场人员应立即报告并采取停止作业、警戒和人员撤离措施。"},{no:"6.1 应急响应",text:"现场负责人确认事故等级后启动相应级别响应，组织救援和信息报告。"}]},
    {id:"EP-002",code:"EP-ZX-002",title:"造型作业区火灾现场处置方案",type:"现场处置方案",org:"造型作业区",version:"V1.2",publishDate:"2026-05-10",effectiveDate:"2026-05-20",status:"现行有效",fileName:"造型作业区火灾现场处置方案.pdf",pages:12,owner:"造型作业区负责人",updatedAt:"2026-08-23 10:40",clauses:[{no:"3.1 初期处置",text:"立即停止动火作业，切断相关能源，使用就近灭火器材扑救并组织无关人员撤离。"},{no:"3.3 信息报告",text:"现场人员应报告作业区负责人和二级单位安全管理人员。"}]}
  ],

  /* ================= 目标职责：企业微信目录、平台权限与岗位职责 ================= */
  organizationProfiles:[
    {id:"group",parentId:null,name:"太重集团",path:"太重集团",level:"集团",depth:0,leader:"企业微信待同步",sourceStatus:"正常",safetyEnabled:true,safetyOrg:false,orgType:"集团总部",order:1,syncAt:"2026-08-18 08:30"},
    {id:"tz",parentId:"group",name:"太原重工股份有限公司",path:"太重集团 / 太原重工股份有限公司",level:"公司",depth:1,leader:"企业微信待同步",sourceStatus:"正常",safetyEnabled:true,safetyOrg:false,orgType:"股份公司",order:1,syncAt:"2026-08-18 08:30"},
    {id:"zj",parentId:"tz",name:"铸锻件分公司",path:"太重集团 / 太原重工股份有限公司 / 铸锻件分公司",level:"二级单位",depth:2,leader:"企业微信待同步",sourceStatus:"正常",safetyEnabled:true,safetyOrg:true,orgType:"分公司",order:1,syncAt:"2026-08-18 08:30"},
    {id:"zaoxing",parentId:"zj",name:"造型作业区",path:"太重集团 / 太原重工股份有限公司 / 铸锻件分公司 / 造型作业区",level:"作业区",depth:3,leader:"企业微信待同步",sourceStatus:"正常",safetyEnabled:true,safetyOrg:false,orgType:"作业区",order:1,syncAt:"2026-08-18 08:30"},
    {id:"auto_line",parentId:"zaoxing",name:"自动线组",path:"太重集团 / 太原重工股份有限公司 / 铸锻件分公司 / 造型作业区 / 自动线组",level:"班组",depth:4,leader:"张青",sourceStatus:"正常",safetyEnabled:true,safetyOrg:false,orgType:"班组",order:1,syncAt:"2026-08-18 08:30"},
    {id:"mould",parentId:"zaoxing",name:"制模组",path:"太重集团 / 太原重工股份有限公司 / 铸锻件分公司 / 造型作业区 / 制模组",level:"班组",depth:4,leader:"李建杰",sourceStatus:"正常",safetyEnabled:true,safetyOrg:false,orgType:"班组",order:2,syncAt:"2026-08-18 08:30"},
    {id:"jgps",parentId:"tz",name:"智能加工配送中心",path:"太重集团 / 太原重工股份有限公司 / 智能加工配送中心",level:"二级单位",depth:2,leader:"企业微信待同步",sourceStatus:"正常",safetyEnabled:true,safetyOrg:true,orgType:"中心",order:2,syncAt:"2026-08-18 08:30"}
  ],
  directoryMembers:[
    {id:"P-001",weComId:"wx_zq",name:"张青",orgId:"auto_line",org:"造型作业区 / 自动线组",post:"班组长",leader:"企业微信上级负责人",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-002",weComId:"wx_wxy",name:"王欣宇",orgId:"auto_line",org:"造型作业区 / 自动线组",post:"兼职安全员",leader:"张青",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-003",weComId:"wx_ltx",name:"李天翔",orgId:"auto_line",org:"造型作业区 / 自动线组",post:"班组成员",leader:"张青",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-004",weComId:"wx_gy",name:"高远",orgId:"auto_line",org:"造型作业区 / 自动线组",post:"班组成员",leader:"张青",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-005",weComId:"wx_zyl",name:"张云龙",orgId:"auto_line",org:"造型作业区 / 自动线组",post:"班组成员",leader:"张青",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-006",weComId:"wx_cyh",name:"陈羿航",orgId:"auto_line",org:"造型作业区 / 自动线组",post:"班组成员",leader:"张青",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-007",weComId:"wx_xsl",name:"谢胜龙",orgId:"auto_line",org:"造型作业区 / 自动线组",post:"班组成员",leader:"张青",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-008",weComId:"wx_djs",name:"董佳树",orgId:"auto_line",org:"造型作业区 / 自动线组",post:"班组成员",leader:"张青",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-009",weComId:"wx_lld",name:"李利冬",orgId:"auto_line",org:"造型作业区 / 自动线组",post:"班组成员",leader:"张青",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-010",weComId:"wx_nj",name:"牛剑",orgId:"auto_line",org:"造型作业区 / 自动线组",post:"班组成员",leader:"张青",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-011",weComId:"wx_ljj",name:"李建杰",orgId:"mould",org:"造型作业区 / 制模组",post:"班组长",leader:"企业微信上级负责人",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-012",weComId:"wx_zzh",name:"赵志宏",orgId:"mould",org:"造型作业区 / 制模组",post:"兼职安全员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-013",weComId:"wx_zm",name:"张明",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-014",weComId:"wx_cxm",name:"常兴明",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-015",weComId:"wx_lg",name:"李刚",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-016",weComId:"wx_ght",name:"郭海涛",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-017",weComId:"wx_lt",name:"李涛",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-018",weComId:"wx_gyong",name:"郭勇",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-019",weComId:"wx_lhl",name:"刘化利",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-020",weComId:"wx_hlq",name:"郝利强",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-021",weComId:"wx_lbw",name:"梁博文",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-022",weComId:"wx_wbs",name:"王宝胜",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-023",weComId:"wx_ytc",name:"杨天财",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-024",weComId:"wx_ggr",name:"郭刚明",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-025",weComId:"wx_ln",name:"路宁",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-026",weComId:"wx_flj",name:"范利君",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-027",weComId:"wx_zzx",name:"詹志星",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-028",weComId:"wx_lx",name:"刘翔",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"},
    {id:"P-029",weComId:"wx_zpw",name:"张鹏伟",orgId:"mould",org:"造型作业区 / 制模组",post:"班组成员",leader:"李建杰",status:"在职",syncAt:"2026-08-18 08:30"}
  ],
  platformUsers:[
    {id:"A-001",personId:"P-001",name:"张青",defaultOrgId:"auto_line",accountStatus:"启用",boundStatus:"已绑定",roleKeys:["team_leader"],lastLogin:"2026-08-18 08:12"},
    {id:"A-002",personId:"P-002",name:"王欣宇",defaultOrgId:"auto_line",accountStatus:"启用",boundStatus:"已绑定",roleKeys:["company_safety"],lastLogin:"2026-08-18 08:21"},
    {id:"A-003",personId:"P-003",name:"李天翔",defaultOrgId:"auto_line",accountStatus:"启用",boundStatus:"已绑定",roleKeys:["team_member"],lastLogin:"2026-08-17 16:42"},
    {id:"A-004",personId:"P-011",name:"李建杰",defaultOrgId:"mould",accountStatus:"启用",boundStatus:"已绑定",roleKeys:["team_leader"],lastLogin:"2026-08-18 07:58"},
    {id:"A-005",personId:"P-012",name:"赵志宏",defaultOrgId:"mould",accountStatus:"启用",boundStatus:"已绑定",roleKeys:["team_member"],lastLogin:"2026-08-17 15:30"},
    {id:"A-006",personId:"P-013",name:"张明",defaultOrgId:"mould",accountStatus:"停用",boundStatus:"已绑定",roleKeys:["team_member"],lastLogin:"-"}
  ],
  safetyRoles:[
    {key:"platform_admin",name:"平台管理员",type:"系统管理",level:"集团",permissions:["目录同步","用户启停","业务岗位映射","角色管理","数据权限"],status:"启用",builtin:true},
    {key:"position_mapping_admin",name:"岗位映射管理员",type:"系统管理",level:"授权组织",permissions:["业务岗位映射","用户角色映射","数据权限"],status:"启用",builtin:true},
    {key:"group_safety",name:"集团监督检查",type:"业务角色",level:"集团",permissions:["监督检查登记","督办","集团统计"],status:"启用",builtin:true},
    {key:"professional_inspector",name:"集团专业检查",type:"业务角色",level:"同专业部门",permissions:["专业检查台账录入","同专业台账查看"],status:"启用",builtin:true},
    {key:"unit_leader",name:"二级单位领导",type:"流程岗位",level:"二级单位",permissions:["较大重大风险审批","业务查看"],status:"启用",builtin:true},
    {key:"company_safety",name:"二级单位安全管理人员",type:"流程岗位",level:"二级单位",permissions:["风险审核","隐患受理","隐患分派","职责维护"],status:"启用",builtin:true},
    {key:"section_manager",name:"作业区负责人",type:"流程岗位",level:"作业区",permissions:["风险审核","巡检计划维护","隐患受理","隐患复查"],status:"启用",builtin:true},
    {key:"team_leader",name:"班组长",type:"流程岗位",level:"班组",permissions:["风险填报","任务转交","现场执行"],status:"启用",builtin:true},
    {key:"team_member",name:"班组成员",type:"业务角色",level:"班组",permissions:["任务领取","现场执行","随手拍","整改反馈"],status:"启用",builtin:true},
    {key:"management_viewer",name:"管理查看人员",type:"查看角色",level:"授权组织",permissions:["驾驶舱查看","台账查看"],status:"启用",builtin:true}
  ],
  roleScopes:[
    {id:"S-001",roleKey:"platform_admin",scopeType:"全平台技术范围",resolveBy:"固定平台技术范围",status:"启用"},
    {id:"S-002",roleKey:"position_mapping_admin",scopeType:"授权组织",resolveBy:"按管理员授权组织",status:"启用"},
    {id:"S-003",roleKey:"group_safety",scopeType:"集团及授权组织",resolveBy:"按集团监督检查职责",status:"启用"},
    {id:"S-004",roleKey:"professional_inspector",scopeType:"同专业部门",resolveBy:"按企业微信所属专业部门",status:"启用"},
    {id:"S-005",roleKey:"unit_leader",scopeType:"本二级单位",resolveBy:"按业务岗位责任组织",status:"启用"},
    {id:"S-006",roleKey:"company_safety",scopeType:"本二级单位",resolveBy:"按业务岗位责任组织",status:"启用"},
    {id:"S-007",roleKey:"section_manager",scopeType:"本作业区",resolveBy:"按业务岗位责任组织",status:"启用"},
    {id:"S-008",roleKey:"team_leader",scopeType:"本班组",resolveBy:"按业务岗位责任组织",status:"启用"},
    {id:"S-009",roleKey:"team_member",scopeType:"本人及本班组任务",resolveBy:"按企业微信身份和任务责任",status:"启用"},
    {id:"S-010",roleKey:"management_viewer",scopeType:"授权组织",resolveBy:"按角色授权组织",status:"启用"}
  ],
  scopeExceptions:[],
  businessPostMappings:[
    {id:"BPM-001",personId:"P-001",orgId:"auto_line",businessPost:"班组长",status:"启用",effectiveDate:"2026-08-01",expiry:"长期",updatedAt:"2026-08-12 08:30"},
    {id:"BPM-002",personId:"P-002",orgId:"auto_line",businessPost:"兼职安全员",status:"启用",effectiveDate:"2026-08-01",expiry:"长期",updatedAt:"2026-08-12 08:35"},
    {id:"BPM-003",personId:"P-011",orgId:"mould",businessPost:"班组长",status:"启用",effectiveDate:"2026-08-01",expiry:"长期",updatedAt:"2026-08-12 08:40"},
    {id:"BPM-004",personId:"P-012",orgId:"mould",businessPost:"兼职安全员",status:"启用",effectiveDate:"2026-08-01",expiry:"长期",updatedAt:"2026-08-12 08:45"}
  ],
  responsibilityItems:[
    {id:"D-001",code:"DUTY-001",orgId:"zj",org:"铸锻件分公司",post:"二级单位安全管理人员",responsibleUser:"待企业微信同步",category:"安全管理",basis:"公司安全生产责任制",version:"V1.0",effectiveDate:"2026-08-01",content:"组织本单位风险、巡检、隐患和特殊作业安全管理，落实监督检查和复查要求。",status:"启用",updatedAt:"2026-08-12 09:00",history:[]},
    {id:"D-002",code:"DUTY-002",orgId:"zaoxing",org:"造型作业区",post:"作业区负责人",responsibleUser:"待企业微信同步",category:"属地管理",basis:"公司安全生产责任制",version:"V1.0",effectiveDate:"2026-08-01",content:"组织本作业区安全工作，审核风险点，推动巡检和隐患整改落实。",status:"启用",updatedAt:"2026-08-12 09:10",history:[]},
    {id:"D-003",code:"DUTY-003",orgId:"auto_line",org:"造型作业区 / 自动线组",post:"班组长",responsibleUser:"张青",category:"班组管理",basis:"班组安全生产责任制",version:"V1.0",effectiveDate:"2026-08-01",content:"落实班组安全职责，组织风险填报、巡检领取执行和隐患整改。",status:"启用",updatedAt:"2026-08-12 09:20",history:[]},
    {id:"D-004",code:"DUTY-004",orgId:"mould",org:"造型作业区 / 制模组",post:"班组长",responsibleUser:"李建杰",category:"班组管理",basis:"班组安全生产责任制",version:"V1.0",effectiveDate:"2026-08-01",content:"落实班组安全职责，组织岗位风险告知和现场安全检查。",status:"启用",updatedAt:"2026-08-12 09:30",history:[]}
  ],

  /* ================= 特殊作业 ================= */
  workPermits:[
    {
      id:"W-001",code:"WP-20260801-001",type:"有限空间作业",typeKey:"confined",org:"造型作业区",location:"造型车间自动线组有限空间检修位",
      workContent:"进入设备内部进行清理检修（有限空间作业）。",
      applicant:"张青",applicantPersonId:"P-001",workLeader:"高远",workLeaderPersonId:"P-004",guardian:null,guardianPersonId:null,guardianRequired:true,
      plannedStart:"2026-08-01 14:00",plannedEnd:"2026-08-01 18:00",workLevel:"一级",
      riskLevel:"较大",status:"资格校验失败",createdAt:"2026-08-01 09:30",
      safetyPlan:"作业前气体检测、持续通风、专人监护，严禁无审批进入。",
      emergencyPlan:"人员不适立即停止作业、撤离并启动有限空间救援预案。",
      persons:[
        {id:"WP-P1",personId:"P-004",weComId:"wx_gy",user:"高远",role:"作业人员",certRequired:true,requiredCert:"有限空间作业证",qualification:"有效",checkedAt:"2026-08-01 09:32"},
        {id:"WP-P2",personId:"P-005",weComId:"wx_zyl",user:"张云龙",role:"作业人员",certRequired:true,requiredCert:"有限空间作业证",qualification:"过期",missingCert:"有限空间作业证（QS14***205，2025-11-20 到期）",checkedAt:"2026-08-01 09:32"},
        {id:"WP-P3",personId:"P-001",weComId:"wx_zq",user:"张青",role:"作业负责人",certRequired:true,requiredCert:"安全管理人员资格证",qualification:"有效",checkedAt:"2026-08-01 09:32"}
      ],
      risks:[{id:"WP-R1",ref:"RISK-ZX-001",hazard:"缺氧或有毒气体暴露",control:"检测、通风、监护、救援器材",confirmed:true}],
      checks:[
        {id:"WP-C1",type:"隔离",text:"作业区域隔离、气体检测合格，通风持续",result:"未确认"},
        {id:"WP-C2",type:"人员",text:"作业人员与监护人已到位、证书有效",result:"未确认"},
        {id:"WP-C3",type:"防护",text:"安全帽、劳保鞋穿戴齐全，安全防护用品检查合格",result:"未确认"},
        {id:"WP-C4",type:"天气",text:"风速≤6级、无雷雨",result:"未确认"}
      ],
      actions:[{type:"创建",at:"2026-08-01 09:30",by:"张青",note:"提交有限空间作业申请"},
               {type:"资格校验",at:"2026-08-01 09:32",by:"系统",note:"发现 1 人证书过期，流程阻断；补齐有效证书后按当前审批矩阵推进"}]
    },
    {
      id:"W-002",code:"WP-20260731-002",type:"动火作业",typeKey:"hotwork",org:"造型作业区",location:"造型车间自动线组焊修工位",
      workContent:"对工装夹具进行电焊修补。",
      applicant:"张青",applicantPersonId:"P-001",workLeader:"高远",workLeaderPersonId:"P-004",guardian:"张青",guardianPersonId:"P-001",guardianRequired:true,
      plannedStart:"2026-07-31 15:00",plannedEnd:"2026-07-31 17:00",workLevel:"二级",
      riskLevel:"一般",status:"执行中",createdAt:"2026-07-31 14:20",
      safetyPlan:"焊点周边 10m 内清理可燃物、配备灭火器、专人监护。",
      emergencyPlan:"起火应急：立即灭火、报警、疏散。",
      persons:[
        {id:"WP-P4",personId:"P-004",weComId:"wx_gy",user:"高远",role:"作业人员",certRequired:true,requiredCert:"动火作业证",qualification:"有效",checkedAt:"2026-07-31 14:22"},
        {id:"WP-P5",personId:"P-001",weComId:"wx_zq",user:"张青",role:"监护人",certRequired:true,requiredCert:"安全管理人员资格证",qualification:"有效",checkedAt:"2026-07-31 14:22"}
      ],
      risks:[{id:"WP-R2",ref:null,hazard:"火花引燃可燃物",control:"清理可燃物、配备灭火器、专人监护",confirmed:true}],
      checks:[
        {id:"WP-C5",type:"消防",text:"焊点周边可燃物已清理，灭火器就位",result:"通过",checkedBy:"张青",checkedAt:"2026-07-31 14:40"},
        {id:"WP-C6",type:"人员",text:"作业人员与监护人到位、证书有效",result:"通过",checkedBy:"张青",checkedAt:"2026-07-31 14:40"}
      ],
      actions:[{type:"创建",at:"2026-07-31 14:20",by:"张青",note:"提交动火作业申请"},
               {type:"审批通过",at:"2026-07-31 14:30",by:"高远",note:"作业负责人通过第 1 个审批节点"},
               {type:"审批通过",at:"2026-07-31 14:35",by:"动火安全负责人（待配置）",note:"动火安全负责人通过第 2 个审批节点"},
               {type:"审批通过",at:"2026-07-31 14:37",by:"二级单位安全管理人员（演示）",note:"二级单位安全管理人员通过第 3 个审批节点"},
               {type:"审批通过",at:"2026-07-31 14:38",by:"作业区负责人（待配置）",note:"作业区负责人通过第 4 个审批节点"},
               {type:"监护确认",at:"2026-07-31 14:40",by:"张青",note:"现场条件全部确认通过"},
               {type:"开工",at:"2026-07-31 15:00",by:"张青",note:"作业开工"}]
    },
    {
      id:"W-003",code:"WP-20260730-003",type:"高处作业",typeKey:"height",org:"造型作业区",location:"造型车间屋面",
      workContent:"屋顶照明检修（2m 以上登高）。",
      applicant:"张青",applicantPersonId:"P-001",workLeader:"张云龙",workLeaderPersonId:"P-005",guardian:"张青",guardianPersonId:"P-001",guardianRequired:true,
      plannedStart:"2026-07-30 09:00",plannedEnd:"2026-07-30 12:00",workLevel:"三级",
      riskLevel:"一般",status:"已归档",createdAt:"2026-07-29 16:00",
      safetyPlan:"安全带高挂低用、作业平台稳固、下方警戒。",
      emergencyPlan:"坠落应急：立即急救并送医。",
      persons:[
        {id:"WP-P6",personId:"P-005",weComId:"wx_zyl",user:"张云龙",role:"作业人员",certRequired:true,requiredCert:"高处作业证",qualification:"有效",checkedAt:"2026-07-29 16:02"},
        {id:"WP-P7",personId:"P-001",weComId:"wx_zq",user:"张青",role:"监护人",certRequired:true,requiredCert:"安全管理人员资格证",qualification:"有效",checkedAt:"2026-07-29 16:02"}
      ],
      risks:[{id:"WP-R3",ref:null,hazard:"高处坠落",control:"安全带高挂低用、平台稳固",confirmed:true}],
      checks:[{id:"WP-C7",type:"防护",text:"安全带完好、作业平台稳固",result:"通过",checkedBy:"张青",checkedAt:"2026-07-30 08:55"}],
      actions:[{type:"创建",at:"2026-07-29 16:00",by:"张青",note:"提交高处作业申请"},
               {type:"审批通过",at:"2026-07-29 16:30",by:"张云龙",note:"作业负责人通过第 1 个审批节点"},
               {type:"审批通过",at:"2026-07-29 16:40",by:"高处作业负责人（待配置）",note:"高处作业负责人通过第 2 个审批节点"},
               {type:"审批通过",at:"2026-07-29 16:43",by:"作业区负责人（待配置）",note:"作业区负责人通过第 3 个审批节点"},
               {type:"监护确认",at:"2026-07-30 08:55",by:"张青",note:"确认通过"},
               {type:"开工",at:"2026-07-30 09:00",by:"张青",note:"开工"},
               {type:"完工",at:"2026-07-30 11:40",by:"张云龙",note:"作业完成，现场清理"},
               {type:"验收",at:"2026-07-30 11:50",by:"作业验收人（待配置）",note:"验收合格"},
               {type:"归档",at:"2026-07-30 12:00",by:"作业验收人（待配置）",note:"作业票归档"}]
    }
  ],

  /* ================= 待办与日志 ================= */
  todos:[
    {id:"TD-01",module:"risks",title:"砂箱自动线风险点复评待处理",key:"riskTask",target:"风险台账",pushChannel:"企业微信",pushStatus:"已送达"},
    {id:"TD-02",module:"inspection",title:"今日巡检任务待执行",key:"inspection",target:"巡检任务",pushChannel:"企业微信",pushStatus:"已送达"},
    {id:"TD-03",module:"hazards",title:"隐患 HZ-20260801-001 待受理",key:"hazardAccept",target:"隐患台账",pushChannel:"企业微信",pushStatus:"已送达"},
    {id:"TD-04",module:"hazards",title:"隐患 HZ-20260730-001 待复查",key:"hazardReview",target:"待我复查",pushChannel:"企业微信",pushStatus:"已送达"},
    {id:"TD-05",module:"permits",title:"作业票 WP-20260801-001 资格阻断待处理",key:"permitBlock",target:"作业票台账",pushChannel:"企业微信",pushStatus:"已送达"}
  ],
  logs:[
    {at:"2026-08-01 09:32",by:"系统",module:"特殊作业",text:"WP-20260801-001 资格校验：张云龙有限空间作业证过期，流程阻断"}
  ],
  /* 移动现场端 mock：签到必须绑定业务对象，消息已读不自动完成待办 */
  notifications:[
    {id:"MSG-001",title:"巡检任务待执行",text:"INSP-T-20260801-001 已分派给李天翔",module:"inspection",target:"inspection.html?tab=tasks",channel:"企业微信",read:false,createdAt:"2026-08-01 08:00"},
    {id:"MSG-002",title:"作业票待监护确认",text:"WP-20260801-004 等待现场监护确认",module:"permits",target:"work-permits.html?tab=execute",channel:"企业微信",read:false,createdAt:"2026-08-01 08:30"},
    {id:"MSG-003",title:"隐患整改提醒",text:"HZ-20260801-001 待受理",module:"hazards",target:"hazards.html?tab=ledger",channel:"企业微信",read:true,createdAt:"2026-08-01 09:10"}
  ],
  checkIns:[],
  mobileDrafts:[],
  teams:[
    {id:"T-01",name:"自动线组",shouldParticipate:true,leader:"张青",safetyOfficer:"王欣宇",members:["张青","王欣宇","李天翔","高远","张云龙","陈羿航","谢胜龙","董佳树","李利冬","牛剑"]},
    {id:"T-02",name:"制模组",shouldParticipate:true,leader:"李建杰",safetyOfficer:"赵志宏",members:["李建杰","赵志宏","张明","常兴明","李刚","郭海涛","李涛","郭勇","刘化利","郝利强","梁博文","王宝胜","杨天财","郭刚明","路宁","范利君","詹志星","刘翔","张鹏伟"]}
  ],
  qualificationRules:{
    hotwork:{三级:["动火作业证"],二级:["动火作业证","监护人资格"],一级:["动火作业证","监护人资格"],特级:["动火作业证","监护人资格","现场负责人资格"]},
    height:{三级:["高处作业证"],二级:["高处作业证","监护人资格"],一级:["高处作业证","监护人资格"],特级:["高处作业证","监护人资格","现场负责人资格"]},
    power:{三级:["电工作业证"],二级:["电工作业证","监护人资格"],一级:["电工作业证","监护人资格"],特级:["电工作业证","监护人资格","现场负责人资格"]},
    confined:{三级:["有限空间作业证","气体检测资格"],二级:["有限空间作业证","气体检测资格","监护人资格"],一级:["有限空间作业证","气体检测资格","监护人资格"],特级:["有限空间作业证","气体检测资格","监护人资格","现场负责人资格"]}
  },
  permitApprovalPostOptions:["作业负责人","动火安全负责人","高处作业负责人","电气负责人","气体检测人","作业区负责人","二级单位安全管理人员","二级单位领导","公司领导","作业验收人"],
  permitApprovalRules:{
    hotwork:{name:"动火作业",base:["作业负责人","动火安全负责人"],levels:{三级:["作业区负责人"],二级:["作业区负责人","二级单位安全管理人员"],一级:["作业区负责人","二级单位安全管理人员","二级单位领导"],特级:["作业区负责人","二级单位安全管理人员","二级单位领导","公司领导"]}},
    height:{name:"高处作业",base:["作业负责人","高处作业负责人"],levels:{三级:["作业区负责人"],二级:["作业区负责人","二级单位安全管理人员"],一级:["作业区负责人","二级单位安全管理人员","二级单位领导"],特级:["作业区负责人","二级单位安全管理人员","二级单位领导","公司领导"]}},
    power:{name:"临时用电作业",base:["作业负责人","电气负责人"],levels:{三级:["作业区负责人"],二级:["作业区负责人","二级单位安全管理人员"],一级:["作业区负责人","二级单位安全管理人员","二级单位领导"],特级:["作业区负责人","二级单位安全管理人员","二级单位领导","公司领导"]}},
    confined:{name:"有限空间作业",base:["作业负责人","气体检测人"],levels:{三级:["作业区负责人"],二级:["作业区负责人","二级单位安全管理人员"],一级:["作业区负责人","二级单位安全管理人员","二级单位领导"],特级:["作业区负责人","二级单位安全管理人员","二级单位领导","公司领导"]}}
  }
};

/* 演示数据只保留在当前浏览器标签页；关闭后重新打开原型即恢复初始数据。 */
  /* 相关方管理纳入统一演示数据后，使用新会话键避免旧版页签缓存覆盖初始数据。 */
  App._stateKey="tz_anquan_overall_state_v12";
App.persist=function(){
  try{
    var data={};["_seq","currentRole","currentOrg","riskTasks","risks","versions","versionApprovals","changeRequests","riskNoticeViews","inspectionItems","inspectionPlans","inspectionTasks","inspectionSpecVersion","drafts","plans","tasks","hazardPhrases","hazards","supervisions","workPermits","trainingRecords","trainingSyncAt","trainingSyncBatches","certs","knowledgeDocs","emergencyPlans","organizationProfiles","directoryMembers","platformUsers","safetyRoles","roleScopes","scopeExceptions","businessPostMappings","responsibilityItems","todos","logs","notifications","checkIns","mobileDrafts","teams","permitApprovalRules","partners","partyViolations"].forEach(function(k){data[k]=App[k];});
    sessionStorage.setItem(App._stateKey,JSON.stringify(data));
  }catch(e){}
};
App.resetDemo=function(){try{sessionStorage.removeItem(App._stateKey);sessionStorage.removeItem("tz_anquan_role");localStorage.removeItem("tz_anquan_oa_center_v2");}catch(e){} location.reload();};
(function hydrate(){
  try{
    /* 清理旧版长期缓存，防止历史演示数据再次被读取。 */
    localStorage.removeItem(App._stateKey);
    localStorage.removeItem("tz_anquan_role");
    var query=new URLSearchParams(location.search);
    /* 直接打开首页视为新一轮业务演示；站内返回首页使用 keep=1 保留本轮操作。 */
    if(/(?:^|\/)index\.html$/i.test(location.pathname)&&query.get("keep")!=="1"){
      sessionStorage.removeItem(App._stateKey);
      sessionStorage.removeItem("tz_anquan_role");
      localStorage.removeItem("tz_anquan_oa_center_v2");
    }
    if(query.get("reset")==="1"){sessionStorage.removeItem(App._stateKey);}
    if(query.get("riskReset")==="1"){
      var savedRiskReset=JSON.parse(sessionStorage.getItem(App._stateKey)||"{}");
      ["riskTasks","risks","versions","versionApprovals","changeRequests","riskNoticeViews"].forEach(function(k){delete savedRiskReset[k];});
      sessionStorage.setItem(App._stateKey,JSON.stringify(savedRiskReset));
      var cleanRiskUrl=new URL(location.href);cleanRiskUrl.searchParams.delete("riskReset");history.replaceState(null,"",cleanRiskUrl.pathname+(cleanRiskUrl.search||"")+cleanRiskUrl.hash);
    }
    var raw=sessionStorage.getItem(App._stateKey),saved=raw?JSON.parse(raw):null;
    if(saved){Object.keys(saved).forEach(function(k){if(saved[k]!==undefined)App[k]=saved[k];});}
  }catch(e){}
  /* 初始化当前组织层级与演示班组。源数据直接使用造型作业区场景，不再运行旧机加工字符串替换。 */
  (function normalizeMoldingScene(){
    var currentLeaf=(App.currentOrg||"").split(" / ").pop();
    if(currentLeaf==="智能加工配送中心")App.currentOrg="太重集团 / 太原重工股份有限公司 / 智能加工配送中心";
    else if(["造型作业区","自动线组","制模组"].indexOf(currentLeaf)<0)App.currentOrg="太重集团 / 太原重工股份有限公司 / 铸锻件分公司 / 造型作业区";
    App.risks=(App.risks||[]).filter(function(r){return ["R-001","R-002","R-003","R-004"].indexOf(r.id)>-1;});
    App.versions=(App.versions||[]).filter(function(v){return ["RISK-ZX-001","RISK-ZX-002","RISK-ZX-003","RISK-JP-001"].indexOf(v.code)>-1;});
    App.teams=[
      {id:"T-01",name:"自动线组",shouldParticipate:true,leader:"张青",safetyOfficer:"王欣宇",members:["张青","王欣宇","李天翔","高远","张云龙","陈羿航","谢胜龙","董佳树","李利冬","牛剑"]},
      {id:"T-02",name:"制模组",shouldParticipate:true,leader:"李建杰",safetyOfficer:"赵志宏",members:["李建杰","赵志宏","张明","常兴明","李刚","郭海涛","李涛","郭勇","刘化利","郝利强","梁博文","王宝胜","杨天财","郭刚明","路宁","范利君","詹志星","刘翔","张鹏伟"]},
      {id:"T-03",name:"智能加工配送中心默认班组",shouldParticipate:false,leader:"待配置",safetyOfficer:"待配置",members:[],systemDefault:true}
    ];
  })();
  App.directoryPeople=function(){return (App.directoryMembers||[]).filter(function(p){return p.status==="在职";}).map(function(p){return p.name;});};
  App.isDirectoryPerson=function(name){return App.directoryPeople().indexOf(name)>-1;};
  App.orgProfile=function(id){return (App.organizationProfiles||[]).filter(function(x){return x.id===id;})[0]||null;};
  App.directoryMemberById=function(id){return (App.directoryMembers||[]).filter(function(x){return x.id===id;})[0]||null;};
  App.directoryPersonFor=function(org,post){
    org=String(org||"");post=String(post||"");
    if(post==="二级单位安全管理"||post==="二级单位安全管理人员")return "待企业微信同步";
    if(post==="作业区负责人")return "待企业微信同步";
    if(post==="班组长")return org.indexOf("制模组")>-1?"李建杰":"张青";
    if(post==="兼职安全员")return org.indexOf("制模组")>-1?"赵志宏":"王欣宇";
    if(post==="岗位人员")return org.indexOf("制模组")>-1?"张明":"李天翔";
    return "待企业微信同步";
  };
  App.directoryHoldersFor=function(orgId,post){
    var today=now().slice(0,10),seen={};
    return (App.businessPostMappings||[]).filter(function(m){
      return m.orgId===orgId&&m.businessPost===post&&m.status==="启用"&&(!m.effectiveDate||m.effectiveDate<=today)&&(!m.expiry||m.expiry==="长期"||m.expiry>=today);
    }).map(function(m){return App.directoryMemberById(m.personId);}).filter(function(p){
      if(!p||p.status!=="在职"||seen[p.id])return false;seen[p.id]=true;return true;
    }).map(function(p){return p.name;});
  };
  App.refreshResponsibilityHolders=function(){
    (App.responsibilityItems||[]).forEach(function(item){var holders=App.directoryHoldersFor(item.orgId,item.post);item.responsibleUser=holders.join("、")||"待配置";item.holderMatchStatus=holders.length?"已匹配":"未匹配";});
  };
  App.refreshResponsibilityHolders();
  /* 巡检规格升级：清理旧版“固定计划/固定任务”样例，重建为
   * 风险点标准草稿 → 计划引用 → 任务派发的可演示链路。只执行一次，
   * 后续用户在页面上的操作通过 persist 保留。 */
  if(App.inspectionSpecVersion!==10){
    var area=(App.currentOrg||"").split(" / ").pop()||"造型作业区";
    var sourceRisk=App.risks.filter(function(r){return r.org===area&&(r.status==="已发布"||r.status==="管控中");})[0]||App.risks[0];
    var typeMap={"工程措施":"工程技术措施","培训教育":"培训教育措施","个体防护":"个体防护措施","应急措施":"应急处置措施"};
    var measures=[];
    (sourceRisk&&sourceRisk.hazards||[]).forEach(function(h){(h.measures||[]).forEach(function(m){
      var type=typeMap[m.type]||m.type;
      if(type==="管理措施")measures.push({id:m.id,hazardId:h.id,hazardName:h.name,measureType:type,measureName:m.name,contents:[m.name],contentPhotoRequired:[false],manual:false});
    });});
    if(!measures.length&&(sourceRisk&&sourceRisk.hazards||[]).length){
      var fallback=sourceRisk.hazards[0];measures.push({id:"MANUAL-001",hazardId:fallback.id,hazardName:fallback.name,measureType:"管理措施",measureName:"按现场管理要求核查风险管控措施落实情况",contents:["按现场管理要求核查风险管控措施落实情况"],contentPhotoRequired:[false],manual:true});
    }
    var draft=sourceRisk?{riskId:sourceRisk.id,riskCode:sourceRisk.code,riskName:sourceRisk.name,status:"已发布",version:1,updatedAt:now(),items:measures}:null;
    var planItems=[];(draft?draft.items:[]).forEach(function(it){(it.contents||[]).forEach(function(content,index){content=String(content||"").trim();if(!content)return;planItems.push({id:it.id+"-C"+(index+1),sourceStandardItemId:it.id,riskCode:sourceRisk.code,riskName:sourceRisk.name,riskLocation:sourceRisk.location,hazardId:it.hazardId,hazardName:it.hazardName,measureName:it.measureName,content:content,checkFreq:((sourceRisk.checkFreq||{}).group||"1次/班")+" / "+((sourceRisk.checkFreq||{}).branch||"1次/周")+" / "+((sourceRisk.checkFreq||{}).company||"1次/月"),requiredPhoto:!!((it.contentPhotoRequired||[])[index])});});});
    App.drafts={};if(draft)App.drafts[sourceRisk.id]=draft;
    App.plans=planItems.length?[{id:"PLAN-001",code:"PLAN-001",name:area+"自动线组日常岗位巡检",type:"日常岗位巡检",subtype:"岗位日常",org:area,scope:area+" / 自动线组",standardRefs:[{riskId:sourceRisk.id,riskCode:sourceRisk.code,standardVersion:"V1"}],startDate:"2026-08-12",endDate:"2026-12-31",cycle:"每日",teamId:"T-01",teamName:"自动线组",enabled:true,dispatchTime:"08:00",dispatchWeekday:"",dispatchMonthday:"",items:planItems,createdAt:now()}]:[];
    App.tasks=App.plans.length?[{id:"TASK-001",code:"TASK-001",planId:"PLAN-001",planName:App.plans[0].name,org:area,scope:App.plans[0].scope,standardRefs:App.plans[0].standardRefs,dispatchType:"周期派发",teamId:"T-01",teamName:"自动线组",claimant:null,claimedAt:null,status:"待领取",createdAt:now(),dispatchTime:"今天 08:00",items:planItems.map(function(it){return Object.assign({},it,{result:"",description:"",photoDone:false});}),results:null,completionRate:0,unqualified:0}]:[];
    if(App.tasks.length)App.tasks[0].org=area;
    var deliveryRisk=App.risks.filter(function(r){return r.org==="智能加工配送中心";})[0];
    if(deliveryRisk){
      var deliveryItems=[];(deliveryRisk.hazards||[]).forEach(function(h){(h.measures||[]).forEach(function(m){if(m.type==="管理措施")deliveryItems.push({id:m.id,hazardId:h.id,hazardName:h.name,measureType:"管理措施",measureName:m.name,contents:[m.name],contentPhotoRequired:[false],manual:false});});});
      var deliveryDraft={riskId:deliveryRisk.id,riskCode:deliveryRisk.code,riskName:deliveryRisk.name,status:"已发布",version:1,updatedAt:now(),items:deliveryItems};
      App.drafts[deliveryRisk.id]=deliveryDraft;
      var deliveryPlanItems=[];deliveryItems.forEach(function(it){(it.contents||[]).forEach(function(content,index){deliveryPlanItems.push({id:it.id+"-C"+(index+1),sourceStandardItemId:it.id,riskCode:deliveryRisk.code,riskName:deliveryRisk.name,riskLocation:deliveryRisk.location,hazardId:it.hazardId,hazardName:it.hazardName,measureName:it.measureName,content:content,checkFreq:"1次/班 / 1次/周 / 1次/月",requiredPhoto:!!((it.contentPhotoRequired||[])[index])});});});
      App.plans.push({id:"PLAN-002",code:"PLAN-002",name:"智能加工配送中心车辆通道日常巡检",type:"日常岗位巡检",subtype:"岗位日常",org:"智能加工配送中心",scope:"智能加工配送中心 / 车辆通道",standardRefs:[{riskId:deliveryRisk.id,riskCode:deliveryRisk.code,standardVersion:"V1"}],startDate:"2026-08-12",endDate:"2026-12-31",cycle:"每日",teamId:"T-03",teamName:"智能加工配送中心默认班组",enabled:false,dispatchTime:"08:30",dispatchWeekday:"",dispatchMonthday:"",items:deliveryPlanItems,createdAt:now()});
    }
    App.inspectionItems=[];App.inspectionPlans=[];App.inspectionTasks=[];
    App.tasks.forEach(function(t){t.items.forEach(function(it,i){App.inspectionItems.push({id:it.id,code:"CHK-"+String(i+1).padStart(3,"0"),standardVersionId:"STD-"+it.riskCode+"-V1",name:it.content,standard:it.content,response:"是非",requiredPhoto:!!it.requiredPhoto,sourceMeasure:it.id,riskCode:it.riskCode,enabled:true,status:"已发布",version:1});});});
    App.plans.forEach(function(p){App.inspectionPlans.push({id:p.id,code:p.code,name:p.name,type:p.type,org:p.org||area,scope:p.scope,cycle:p.cycle,teamId:p.teamId,teamName:p.teamName,status:p.enabled?"已发布":"停用",standardRefs:p.standardRefs||[],items:p.items.map(function(it){return it.id;})});});
    App.tasks.forEach(function(t){App.inspectionTasks.push({id:t.id,code:t.code,planId:t.planId,planName:t.planName,org:t.org||area,teamId:t.teamId,teamName:t.teamName,assignee:t.claimant||null,window:t.dispatchTime,status:t.status,completionRate:0,unqualified:0,createdAt:t.createdAt,results:null});});
    App.inspectionSpecVersion=10;
    App.persist();
  }
  /* 清除旧版样例：一期特殊作业严格限定四类；隐患保留四类正式来源。 */
  App.workPermits.forEach(function(w){
    w.guardians=w.guardians&&w.guardians.length?w.guardians:(w.guardian?[w.guardian]:[]);
    w.guardian=w.guardians.join("、");
    /* 兼容旧演示编号 WP-20260801-001，但一期业务语义改为有限空间。 */
    if(w.typeKey==="legacy-confined"){
      w.typeKey="confined";w.type="有限空间作业";w.location="造型车间 B 区有限空间检修位";
      w.workContent="进入设备内部进行清理检修（有限空间作业）。";w.safetyPlan="作业前气体检测、持续通风、专人监护，严禁无审批进入。";
      w.emergencyPlan="人员不适立即停止作业、撤离并启动有限空间救援预案。";
      if(w.risks&&w.risks[0]){w.risks[0].hazard="缺氧或有毒气体暴露";w.risks[0].control="检测、通风、监护、救援器材";}
      if(w.checks&&w.checks[0]){w.checks[0].text="作业区域隔离、气体检测合格，通风持续";w.checks[0].check_text=w.checks[0].text;}
      w.persons=w.persons||[];w.persons.forEach(function(p){if(p.user==="张云龙")p.missingCert="有限空间作业证（待补齐）";});
    }
  });
  App.workPermits=App.workPermits.filter(function(w){return ["hotwork","height","power","confined"].indexOf(w.typeKey)>-1;});
  App.hazards.forEach(function(h){
    /* 隐患正式等级只有一般、重大两级；待受理时允许尚未定级。 */
    if(h.severity==="较大"||h.severity==="特别重大")h.severity="重大";
    if(h.severity==="待确认")h.severity=null;
    h.sourceLabel=({INSPECTION:"巡检发现",MOBILE_REPORT:"随手拍",PROFESSIONAL_DEPT_CHECK:"集团专业检查",HSE_SUPERVISION:"集团监督检查"}[h.source])||h.sourceLabel;
    if(h.source==="PROFESSIONAL_DEPT_CHECK"){
      h.professionalDeptId=h.professionalDeptId||"equipment_energy";
      h.inspectionDept=h.inspectionDept||"设备能源部";
      h.oaRequired=false;h.oaStatus="不走OA";h.status="已闭环";h.closedAt=h.closedAt||h.createdAt;
      h.responsibleDept=null;h.responsibleUser=null;h.deadline=null;h.rectification=null;
      if(!(h.actions||[]).some(function(a){return a.type==="提交闭环";}))(h.actions||(h.actions=[])).push({type:"提交闭环",at:h.closedAt,by:h.reporter||"专业检查人员（演示）",note:"记录考核责任人和罚款后直接形成专业检查台账"});
    }
    var accepted=(h.actions||[]).filter(function(a){return a.type==='受理';})[0];if(accepted){h.acceptedBy=h.acceptedBy||accepted.by;h.acceptedAt=h.acceptedAt||accepted.at;h.acceptanceOpinion=h.acceptanceOpinion||accepted.note||'';}
  });
  App.workPermits.forEach(function(w){w.riskSnapshot=w.riskSnapshot||[];});
  /* 风险演示数据迁移：当前正式版本与工作中的整点草稿分离，确保台账/四色图/告知卡只读取 CURRENT。 */
  App.versionApprovals=App.versionApprovals||[];
  App.changeRequests=App.changeRequests||[];
  App.riskNoticeViews=App.riskNoticeViews||[];
  function copy(o){return JSON.parse(JSON.stringify(o));}
  function assessmentCode(r,h){return "RA-"+r.code+"-"+(h.id||"HZ");}
  App.riskTasks.forEach(function(t){
    t.riskIds=t.riskIds||[];
    if(t.riskId&&t.riskIds.indexOf(t.riskId)<0)t.riskIds.push(t.riskId);
    if(!t.riskIds.length&&(["TASK-ZX-2026-001","TASK-ZX-2026-002"].indexOf(t.code)>=0)){t.riskId="R-001";t.riskIds=["R-001"];}
  });
  App.risks.forEach(function(r,ri){
    r.mapPosition=r.mapPosition||((ri===0)?{area:"自动线组造型工位",floor:"1F",x:150,y:375}:null);
    r.category=r.category||"设备设施风险";
    r.responsibilityPost=["班组长","分公司负责人","总经理","公司领导"].indexOf(r.responsibilityPost)>-1?r.responsibilityPost:"班组长";
    r.controlLevel=r.controlLevel||"分公司";
    r.checkFreq=r.checkFreq||{group:"1次/班",branch:"1次/周",company:"1次/月"};
    r.reason=r.reason||"首次辨识";
    r.status=r.status||"已发布";
    r.versions=r.versions||[];
    /* Keep an immutable history snapshot for the version timeline/diff view. */
    r.versions.forEach(function(v){
      if(!v.snapshot&&v.version===r.version){
        v.snapshot=Object.assign({id:v.id,version:v.version,status:v.status||"当前生效",riskId:r.id,createdAt:v.publishedAt||r.updatedAt||now(),updatedAt:v.publishedAt||r.updatedAt||now(),operator:v.operator||"",hazards:copy(r.hazards||[])},riskPointMeta(r));
      }
      if(v.snapshot)Object.assign(v.snapshot,riskPointMeta(r,v.snapshot));
    });
    if(!r.versions.some(function(v){return v.version===r.version;})){
      var baseGlobal=App.versions.filter(function(v){return v.code===r.code&&v.version===r.version;})[0];
      if(baseGlobal){
        var baseSnapshot=Object.assign({id:baseGlobal.id,version:baseGlobal.version,status:"当前生效",riskId:r.id,createdAt:baseGlobal.publishedAt||r.updatedAt||now(),updatedAt:baseGlobal.publishedAt||r.updatedAt||now(),operator:baseGlobal.operator||"",hazards:copy(r.hazards||[])},riskPointMeta(r));
        baseGlobal.snapshot=baseGlobal.snapshot||baseSnapshot;
        r.versions.push({id:baseGlobal.id,code:r.code,version:baseGlobal.version,status:"当前生效",riskName:r.name,hazardCount:baseGlobal.hazardCount||r.hazards.length,measureCount:baseGlobal.measureCount||0,maxLevel:baseGlobal.maxLevel||"",operator:baseGlobal.operator||"",publishedAt:baseGlobal.publishedAt||r.updatedAt||now(),note:baseGlobal.note||"",snapshot:baseGlobal.snapshot});
      }
    }
    if(r.status==="已发布"&&!r.currentVersion){r.currentVersion=r.version;}
    /* 危险源只维护完成度；审批仅发生在整个风险点版本。 */
    function normalizeHazardStatus(h){
      h.accidentTypes=Array.isArray(h.accidentTypes)?h.accidentTypes:String(h.accidentType||"").split(/[、,，;；]/).map(function(x){return x.trim();}).filter(Boolean);
      h.accidentType=h.accidentTypes.join("、");
      var complete=!!(h.name&&h.accidentType&&h.accidentType!=="-"&&h.level&&(h.direct||+h.D>0));
      h.assessmentStatus=complete?"已完成":"待完善";
      delete h.assessmentLocked;
      delete h.assessmentHistory;
    }
    (r.hazards||[]).forEach(normalizeHazardStatus);
    if(!r.draftVersion&&r.id==="R-001"){
      var hs=copy(r.hazards);
      hs.forEach(function(h){
        normalizeHazardStatus(h);
        h.assessor=h.assessor||"王欣宇";
        h.assessedAt=h.assessedAt||"2026-07-31 10:05";
      });
      r.draftVersion={id:"RV-DRAFT-R1",version:"V2.0",status:"草稿",riskId:r.id,riskName:r.name,org:r.org,location:r.location,category:r.category,responsibilityPost:r.responsibilityPost,trigger:"变更复评",reason:"造型作业场景复评",scope:r.location,createdAt:now(),updatedAt:now(),operator:"王欣宇",hazards:hs,submittedAt:null,returnedReason:""};
    }
    if(r.draftVersion){
      Object.assign(r.draftVersion,riskPointMeta(r,r.draftVersion));
      r.draftVersion.hazards=r.draftVersion.hazards||[];
      r.draftVersion.hazards.forEach(function(h){
        h.level=h.level&&h.level.key?h.level:Object.assign(levelOf(h.D||0),{method:h.direct?"direct":"lec",L:h.L,E:h.E,C:h.C,D:h.D});
        if(h.direct||h.directNote)h.level.basis=h.directNote||h.level.basis||"";
        normalizeHazardStatus(h);
        (h.measures||[]).forEach(function(m){m.type=({工程措施:"工程技术措施",培训教育:"培训教育措施",个体防护:"个体防护措施",应急措施:"应急处置措施"}[m.type]||m.type);m.frequency=m.frequency||"每班/每次作业";m.evidence=m.evidence||"现场记录、照片或台账";m.generateInspection=!!(m.generateInspection||m.checked);m.generateSpecialWork=!!m.generateSpecialWork;});
      });
    }
    (r.hazards||[]).forEach(function(h){
      h.level=h.level&&h.level.key?h.level:Object.assign(levelOf(h.D||0),{method:h.direct?"direct":"lec",L:h.L,E:h.E,C:h.C,D:h.D});
      if(h.direct||h.directNote)h.level.basis=h.directNote||h.level.basis||"";
      normalizeHazardStatus(h);
      (h.measures||[]).forEach(function(m){m.type=({工程措施:"工程技术措施",培训教育:"培训教育措施",个体防护:"个体防护措施",应急措施:"应急处置措施"}[m.type]||m.type);m.frequency=m.frequency||"每班/每次作业";m.evidence=m.evidence||"现场记录、照片或台账";m.generateInspection=!!(m.generateInspection||m.checked);m.generateSpecialWork=!!m.generateSpecialWork;});
    });
  });
})();

/* ============================================================
 * 状态动作（模拟接口。接入真实 API 时替换为 fetch 并刷新视图）
 * 每个动作：写数据 → 写日志 → 通知视图刷新（App._emit）
 * ============================================================ */
App._listeners=[];
App._emit=function(){App.persist();for(var i=0;i<App._listeners.length;i++){try{App._listeners[i]();}catch(e){}}};
App.subscribe=function(fn){App._listeners.push(fn);return function(){var i=App._listeners.indexOf(fn);if(i>-1)App._listeners.splice(i,1);};};
App.log=function(module,text,by){by=by||App.currentUser();App.logs.unshift({at:now(),by:by,module:module,text:text});};
App.toast=function(msg,type){var ev=new CustomEvent("app-toast",{detail:{msg:msg,type:type||"success"}});window.dispatchEvent(ev);};
App.pushWeComTodo=function(module,title,text,target){App.notifications.unshift({id:"MSG-"+Date.now()+"-"+Math.random().toString(36).slice(2,5),title:title,text:text,module:module,target:target,channel:"企业微信",read:false,createdAt:now()});};
App.sourceLabel=function(key){return ({INSPECTION:"巡检发现",MOBILE_REPORT:"随手拍",PROFESSIONAL_DEPT_CHECK:"集团专业检查",PROFESSIONAL_CHECK:"集团专业检查",HSE_SUPERVISION:"集团监督检查"}[key]||key||"-");};
App.inCurrentOrgScope=function(org){
  var leaf=(App.currentOrg||"").split(" / ").pop();
  if(leaf==="智能加工配送中心")return org==="智能加工配送中心";
  if(["造型作业区","自动线组","制模组"].indexOf(leaf)>-1)return org==="造型作业区";
  if(leaf==="铸锻件分公司")return org!=="智能加工配送中心";
  return true;
};
App.approvalPathFor=function(w){
  var rule=(App.permitApprovalRules||{})[w.typeKey]||{},level=w.workLevel||"三级";
  return (rule.base||["作业负责人"]).concat((rule.levels&&rule.levels[level])||[]);
};

/* ---------- 培训记录与证书动作 ---------- */
App.training={
  byId:function(id){return App.trainingRecords.filter(function(x){return x.id===id;})[0];},
  sync:function(){App.trainingSyncAt=now();var batch={id:"TSB-"+String(++App._seq.trainingBatch).padStart(3,"0"),syncAt:App.trainingSyncAt,source:"培训中心",total:App.trainingRecords.length,success:App.trainingRecords.length,failed:0,status:"已完成",operator:App.currentUser(),exceptions:[]};App.trainingSyncBatches=App.trainingSyncBatches||[];App.trainingSyncBatches.unshift(batch);App.log("培训与证书","[培训同步] 已从培训中心刷新只读培训记录，批次 "+batch.id);App.toast("培训记录同步完成，未发现新增记录","success");App._emit();return {ok:true,syncedAt:App.trainingSyncAt,batch:batch};}
};
App.certificate={
  byId:function(id){return App.certs.filter(function(x){return x.id===id;})[0];},
  statusOf:function(c){var end=c&&c.expire&&Date.parse(String(c.expire).replace(/-/g,"/"));if(!end||end<Date.now())return "已过期";return end-Date.now()<=90*24*60*60*1000?"临期":"有效";},
  refresh:function(){App.certs.forEach(function(c){c.status=App.certificate.statusOf(c);});},
  save:function(data,id){
    if(!data||!data.user||!App.isDirectoryPerson(data.user)){App.toast("持证人员必须从企业微信组织人员中选择","error");return {ok:false};}
    if(!data.cert||!data.code||!data.issueDate||!data.expire){App.toast("证书名称、编号、发证日期和有效期均为必填","error");return {ok:false};}
    if(Date.parse(data.expire.replace(/-/g,"/"))<=Date.parse(data.issueDate.replace(/-/g,"/"))){App.toast("证书有效期必须晚于发证日期","error");return {ok:false};}
    var c=id?App.certificate.byId(id):null;
    if(!c){c={id:"C-"+Date.now().toString(36),history:[]};App.certs.unshift(c);}
    var previous=c.expire?{code:c.code,issueDate:c.issueDate,expire:c.expire,updatedAt:c.updatedAt||now()}:null;
    Object.keys(data).forEach(function(k){c[k]=data[k];});c.org=c.org||"造型作业区";c.source=c.source||"平台维护";c.updatedAt=now();c.status=App.certificate.statusOf(c);c.attachment=!!c.attachment;c.history=c.history||[];
    if(previous&&previous.expire!==c.expire)c.history.unshift(previous);
    App.log("培训与证书","[证书"+(id?"维护":"新增")+"] "+c.user+" · "+c.cert+" · "+c.status);App._emit();return {ok:true,certificate:c};
  },
  renew:function(id,data){var c=App.certificate.byId(id);if(!c)return {ok:false};return App.certificate.save(Object.assign({},c,data,{source:"平台维护",attachment:true}),id);},
  validFor:function(user,certName){App.certificate.refresh();return App.certs.filter(function(c){return c.user===user&&c.cert===certName&&c.status!=="已过期";})[0]||null;}
};
App.certificate.refresh();

/* ---------- 目标职责动作 ---------- */
/* ---------- 相关方管理动作 ---------- */
App.partner={
  byId:function(id){return (App.partners||[]).filter(function(x){return x.id===id;})[0]||null;},
  allPeople:function(){var rows=[];(App.partners||[]).forEach(function(p){(p.people||[]).forEach(function(person){rows.push({partner:p,person:person});});});return rows;},
  personById:function(id){return App.partner.allPeople().filter(function(x){return x.person.id===id;})[0]||null;},
  violationsOf:function(personId){return (App.partyViolations||[]).filter(function(x){return x.personId===personId;});},
  violationCount:function(personId){return App.partner.violationsOf(personId).length;},
  isBlacklisted:function(personId){return App.partner.violationCount(personId)>=3;},
  refreshBlacklist:function(){App.partner.allPeople().forEach(function(row){if(row.person.status==="黑名单")row.person.status="在场";});},
  savePartner:function(data,id){
    if(!data.name||!data.maintainingOrg||!data.serviceScope){App.toast("相关方公司、维护单位和服务内容为必填项","error");return {ok:false};}
    var item=id?App.partner.byId(id):null,previousStatus=item&&item.status;if(!item){item={id:"RP-"+Date.now().toString(36),code:"PARTY-"+dstr()+"-"+String((App.partners||[]).length+1).padStart(3,"0"),people:[]};App.partners.unshift(item);}
    Object.keys(data).forEach(function(k){item[k]=data[k];});item.updatedAt=now();item.status=item.status||"合作中";var linkedPeople=0;if(previousStatus!=="已结束"&&item.status==="已结束"){(item.people||[]).forEach(function(person){if(person.status!=="离场"){person.status="离场";linkedPeople++;}});}App.log("相关方管理","[相关方台账"+(id?"维护":"新增")+"] "+item.name+(linkedPeople?" · 联动离场 "+linkedPeople+" 人":""));App._emit();return {ok:true,item:item,linkedPeople:linkedPeople};
  },
  savePerson:function(partnerId,data,id){
    var partner=App.partner.byId(partnerId);if(!partner||!data.name||!data.job){App.toast("人员姓名和岗位为必填项","error");return {ok:false};}
    if(!id&&partner.status==="已结束"){App.toast("合作已结束，不能新增相关方人员","error");return {ok:false};}
    var person=id?(partner.people||[]).filter(function(x){return x.id===id;})[0]:null;if(!person){person={id:"RPP-"+Date.now().toString(36),certificates:[],status:"在场"};partner.people.unshift(person);}
    Object.keys(data).forEach(function(k){person[k]=data[k];});if(person.status==="黑名单")person.status="在场";partner.updatedAt=now();App.log("相关方管理","[相关方人员"+(id?"维护":"新增")+"] "+partner.name+" · "+person.name);App._emit();return {ok:true,person:person};
  },
  saveCertificate:function(personId,data,id){
    var row=App.partner.personById(personId);if(!row||!data.name||!data.number||!data.expire||!data.attachmentName){App.toast("证书名称、编号、有效期和证书附件均为必填项","error");return {ok:false};}
    if(!id&&row.partner.status==="已结束"){App.toast("合作已结束，不能新增人员证书","error");return {ok:false};}
    row.person.certificates=row.person.certificates||[];var cert=id?row.person.certificates.filter(function(x){return x.id===id;})[0]:null;if(!cert){cert={id:"RPC-"+Date.now().toString(36)};row.person.certificates.unshift(cert);}Object.keys(data).forEach(function(k){cert[k]=data[k];});cert.attachmentType=cert.attachmentType||"附件";row.partner.updatedAt=now();App.log("相关方管理","[人员证书"+(id?"维护":"新增")+"] "+row.person.name+" · "+data.name);App._emit();return {ok:true,certificate:cert};
  },
  violationById:function(id){return (App.partyViolations||[]).filter(function(x){return x.id===id;})[0]||null;},
  saveViolation:function(data,id){
    var row=App.partner.personById(data.personId);if(!row||!data.date||!data.location||!data.content){App.toast("违章时间、地点和内容均为必填项","error");return {ok:false};}
    if(!id&&row.partner.status==="已结束"){App.toast("合作已结束，不能新增违章记录","error");return {ok:false};}
    var item=id?App.partner.violationById(id):null;if(!item){item={id:"RPV-"+Date.now().toString(36),code:"RPV-"+dstr()+"-"+String((App.partyViolations||[]).length+1).padStart(3,"0"),recordedBy:App.currentUser()};App.partyViolations.unshift(item);}Object.keys(data).forEach(function(k){item[k]=data[k];});item.partnerId=row.partner.id;item.level=item.level||"一般违章";item.handling=item.handling||"待处理";App.partner.refreshBlacklist();var count=App.partner.violationCount(row.person.id);if(count>=3)App.toast(row.person.name+" 已累计 "+count+" 次违章，已标记黑名单","warn");else App.toast("违章记录已保存，当前累计 "+count+" 次","success");row.partner.updatedAt=now();App.log("相关方管理","[违章"+(id?"维护":"登记")+"] "+row.person.name+" · 累计 "+count+" 次");App._emit();return {ok:true,item:item,blacklisted:count>=3};
  },
  addViolation:function(data){return App.partner.saveViolation(data);},
  deleteViolation:function(id){
    var item=App.partner.violationById(id);if(!item)return {ok:false};var row=App.partner.personById(item.personId),before=row&&App.partner.isBlacklisted(row.person.id);App.partyViolations=(App.partyViolations||[]).filter(function(x){return x.id!==id;});App.partner.refreshBlacklist();if(row)row.partner.updatedAt=now();var after=row&&App.partner.isBlacklisted(row.person.id);App.log("相关方管理","[违章删除] "+(row?row.person.name:"未知人员")+" · "+item.code);App._emit();App.toast(before&&!after?"违章记录已删除，人员黑名单标记已自动取消":"违章记录已删除，累计次数已重新计算","success");return {ok:true};
  }
};
App.partner.refreshBlacklist();

App.canPermissionAdmin=function(){return App.currentRole==="platform_admin"||App.currentRole==="position_mapping_admin";};
App.canMaintainDuties=function(){return App.currentRole==="company_safety"||App.currentRole==="platform_admin";};
App.organization={
  byId:function(id){return App.orgProfile(id);},
  sync:function(kind){
    var stamp=now();
    if(kind==="人员")(App.directoryMembers||[]).forEach(function(x){x.syncAt=stamp;});
    else (App.organizationProfiles||[]).forEach(function(x){x.syncAt=stamp;});
    App.log("目标职责","[企业微信"+kind+"同步] 同步完成");App.toast(kind+"同步完成，当前原型未发现冲突","success");App._emit();return {ok:true,syncedAt:stamp};
  },
  saveProfile:function(id,data){
    if(!App.canPermissionAdmin()){App.toast("只有平台管理员或岗位映射管理员可以配置组织平台属性","error");return {ok:false};}
    var item=App.orgProfile(id);if(!item)return {ok:false};
    item.safetyEnabled=!!data.safetyEnabled;item.safetyOrg=!!data.safetyOrg;item.orgType=data.orgType||item.orgType;item.order=Number(data.order)||item.order;
    App.log("目标职责","[组织平台属性] "+item.path);App.toast("平台补充属性已保存；企业微信源数据未被修改","success");App._emit();return {ok:true,item:item};
  }
};
App.platformUser={
  byId:function(id){return (App.platformUsers||[]).filter(function(x){return x.id===id;})[0]||null;},
  enable:function(personId,defaultOrgId){
    if(!App.canPermissionAdmin()){App.toast("只有平台管理员或岗位映射管理员可以启用平台用户","error");return {ok:false};}
    var person=App.directoryMemberById(personId);if(!person){App.toast("请选择企业微信在职人员","error");return {ok:false};}
    var old=(App.platformUsers||[]).filter(function(x){return x.personId===personId;})[0];
    if(old){old.accountStatus="启用";old.defaultOrgId=defaultOrgId||person.orgId;App.toast("该人员的平台访问已重新启用","success");App._emit();return {ok:true,user:old};}
    var user={id:"A-"+String(++App._seq.account).padStart(3,"0"),personId:person.id,name:person.name,defaultOrgId:defaultOrgId||person.orgId,accountStatus:"启用",boundStatus:"已绑定",roleKeys:[],lastLogin:"-"};
    App.platformUsers.unshift(user);App.log("目标职责","[用户启用] "+user.name+" 已关联企业微信身份");App.toast("平台用户已启用，请继续配置安全业务角色和数据权限","success");App._emit();return {ok:true,user:user};
  },
  toggle:function(id){
    if(!App.canPermissionAdmin()){App.toast("只有平台管理员或岗位映射管理员可以启停平台用户","error");return {ok:false};}
    var user=App.platformUser.byId(id);if(!user)return {ok:false};user.accountStatus=user.accountStatus==="启用"?"停用":"启用";
    App.log("目标职责","[用户"+user.accountStatus+"] "+user.name);App.toast("用户已"+user.accountStatus,"success");App._emit();return {ok:true,user:user};
  },
  setDefaultOrg:function(id,orgId){
    if(!App.canPermissionAdmin())return {ok:false};var user=App.platformUser.byId(id),org=App.orgProfile(orgId);if(!user||!org)return {ok:false};user.defaultOrgId=orgId;
    App.log("目标职责","[默认组织] "+user.name+" → "+org.path);App.toast("默认组织已更新","success");App._emit();return {ok:true,user:user};
  },
  updateRoles:function(id,roleKeys){
    if(!App.canPermissionAdmin()){App.toast("只有平台管理员或岗位映射管理员可以配置用户角色","error");return {ok:false};}
    var user=App.platformUser.byId(id),active=(App.safetyRoles||[]).filter(function(r){return r.status==="启用";}).map(function(r){return r.key;});if(!user)return {ok:false};
    roleKeys=(roleKeys||[]).filter(function(key,i,arr){return active.indexOf(key)>-1&&arr.indexOf(key)===i;});
    user.roleKeys=roleKeys;App.log("目标职责","[用户角色映射] "+user.name+" → "+(roleKeys.join("、")||"未配置"));App.toast("用户安全业务角色已保存","success");App._emit();return {ok:true,user:user};
  }
};
App.businessPostOptions=["二级单位领导","二级单位安全管理人员","作业区负责人","班组长","兼职安全员","岗位人员","分公司负责人","总经理","公司领导","作业负责人","动火安全负责人","高处作业负责人","电气负责人","气体检测人","监护人","特殊作业审批人","作业验收人","隐患受理人","隐患整改人","隐患复查人","督办人员"];
App.businessPostMapping={
  byId:function(id){return (App.businessPostMappings||[]).filter(function(x){return x.id===id;})[0]||null;},
  forPerson:function(personId){return (App.businessPostMappings||[]).filter(function(x){return x.personId===personId;});},
  forDuty:function(orgId,businessPost){return (App.businessPostMappings||[]).filter(function(x){return x.orgId===orgId&&x.businessPost===businessPost;});},
  save:function(data,id){
    data=data||{};if(!App.canPermissionAdmin()){App.toast("只有平台管理员或岗位映射管理员可以配置业务岗位","error");return {ok:false};}
    var person=App.directoryMemberById(data.personId),org=App.orgProfile(data.orgId),posts=App.businessPostOptions||[];
    if(!person||person.status!=="在职"||!org||posts.indexOf(data.businessPost)<0){App.toast("请选择企业微信在职人员、责任组织和安全业务岗位","error");return {ok:false};}
    var user=(App.platformUsers||[]).filter(function(x){return x.personId===person.id&&x.accountStatus==="启用";})[0];if(!user){App.toast("请先启用该人员的平台用户","error");return {ok:false};}
    var duplicate=(App.businessPostMappings||[]).filter(function(x){return x.id!==id&&x.personId===person.id&&x.orgId===data.orgId&&x.businessPost===data.businessPost&&x.status==="启用";})[0];if(duplicate){App.toast("该人员已承担相同组织下的该业务岗位","warn");return {ok:false};}
    var item=id?App.businessPostMapping.byId(id):null;if(!item){item={id:"BPM-"+String(++App._seq.postMap).padStart(3,"0"),status:"启用"};App.businessPostMappings.unshift(item);}
    item.personId=person.id;item.orgId=data.orgId;item.businessPost=data.businessPost;item.effectiveDate=data.effectiveDate||now().slice(0,10);item.expiry=data.expiry||"长期";item.updatedAt=now();
    App.refreshResponsibilityHolders();App.log("目标职责","[业务岗位映射"+(id?"编辑":"配置")+"] "+person.name+" → "+org.name+" / "+item.businessPost);App.toast("业务岗位映射已保存，相关岗位职责承接人员已更新","success");App._emit();return {ok:true,item:item};
  },
  toggle:function(id){
    if(!App.canPermissionAdmin()){App.toast("只有平台管理员或岗位映射管理员可以启停业务岗位映射","error");return {ok:false};}var item=App.businessPostMapping.byId(id);if(!item)return {ok:false};
    var person=App.directoryMemberById(item.personId);if(item.status!=="启用"&&(!person||person.status!=="在职")){App.toast("企业微信人员已不在职，不能重新启用映射","error");return {ok:false};}
    item.status=item.status==="启用"?"停用":"启用";item.updatedAt=now();App.refreshResponsibilityHolders();App.log("目标职责","[业务岗位映射"+item.status+"] "+(person?person.name:item.personId)+" / "+item.businessPost);App.toast("业务岗位映射已"+item.status,"success");App._emit();return {ok:true,item:item};
  }
};
App.safetyRole={
  byKey:function(key){return (App.safetyRoles||[]).filter(function(x){return x.key===key;})[0]||null;},
  save:function(data,key){
    if(!App.canPermissionAdmin()){App.toast("只有平台管理员或岗位映射管理员可以维护角色","error");return {ok:false};}
    data=data||{};if(!String(data.name||"").trim()||!data.type||!data.level||(data.permissions||[]).length===0){App.toast("请填写角色名称、类型、适用层级并至少选择一项功能权限","error");return {ok:false};}
    var role=key?App.safetyRole.byKey(key):null;if(!role){role={key:"custom_role_"+Date.now().toString(36),builtin:false,status:"启用"};App.safetyRoles.push(role);}
    role.name=String(data.name).trim();role.type=data.type;role.level=data.level;role.permissions=data.permissions.slice();
    App.log("目标职责","[角色"+(key?"编辑":"新增")+"] "+role.name);App.toast(key?"角色配置已保存":"角色已新增","success");App._emit();return {ok:true,role:role};
  },
  toggle:function(key){
    if(!App.canPermissionAdmin()){App.toast("只有平台管理员或岗位映射管理员可以启停角色","error");return {ok:false};}
    var role=App.safetyRole.byKey(key);if(!role)return {ok:false};role.status=role.status==="启用"?"停用":"启用";App.log("目标职责","[角色"+role.status+"] "+role.name);App.toast("角色已"+role.status,"success");App._emit();return {ok:true,role:role};
  }
};
App.roleScope={
  byId:function(id){return (App.roleScopes||[]).filter(function(x){return x.id===id;})[0]||null;},
  save:function(data,id){
    if(!App.canPermissionAdmin()){App.toast("只有平台管理员或岗位映射管理员可以维护数据权限","error");return {ok:false};}
    if(!data.roleKey||!data.scopeType||!String(data.resolveBy||"").trim()){App.toast("请选择角色、默认数据范围并填写范围解析依据","error");return {ok:false};}
    var duplicate=(App.roleScopes||[]).filter(function(x){return x.id!==id&&x.roleKey===data.roleKey;})[0];if(duplicate){App.toast("每个角色只维护一条默认数据范围规则","warn");return {ok:false};}
    var item=id?App.roleScope.byId(id):null;if(!item){item={id:"S-"+String(++App._seq.scope).padStart(3,"0"),status:"启用"};App.roleScopes.unshift(item);}
    item.roleKey=data.roleKey;item.scopeType=data.scopeType;item.resolveBy=String(data.resolveBy).trim();
    App.log("目标职责","[角色默认数据范围"+(id?"编辑":"配置")+"] "+item.roleKey+" · "+item.scopeType);App.toast("角色默认数据范围已保存","success");App._emit();return {ok:true,item:item};
  },
  toggle:function(id){
    if(!App.canPermissionAdmin())return {ok:false};var item=App.roleScope.byId(id);if(!item)return {ok:false};item.status=item.status==="启用"?"停用":"启用";App.toast("数据授权已"+item.status,"success");App._emit();return {ok:true,item:item};
  }
};
App.scopeException={
  byId:function(id){return (App.scopeExceptions||[]).filter(function(x){return x.id===id;})[0]||null;},
  save:function(data,id){
    if(!App.canPermissionAdmin()){App.toast("只有平台管理员或岗位映射管理员可以维护例外授权","error");return {ok:false};}
    var person=App.directoryMemberById(data.personId),role=App.safetyRole.byKey(data.roleKey),org=App.orgProfile(data.orgId),user=(App.platformUsers||[]).filter(function(x){return x.personId===data.personId&&x.accountStatus==="启用";})[0];if(!person||person.status!=="在职"||!role||!org||!String(data.reason||"").trim()){App.toast("请选择企业微信在职人员、角色、额外授权组织并填写授权原因","error");return {ok:false};}
    if(!user||(user.roleKeys||[]).indexOf(role.key)<0){App.toast("请先在用户信息维护中为该人员配置所选角色","error");return {ok:false};}
    var item=id?App.scopeException.byId(id):null;if(!item){item={id:"SE-"+String(++App._seq.scopeException).padStart(3,"0"),status:"启用"};App.scopeExceptions.unshift(item);}
    item.personId=person.id;item.roleKey=role.key;item.orgId=org.id;item.reason=String(data.reason).trim();item.effectiveDate=data.effectiveDate||now().slice(0,10);item.expiry=data.expiry||"长期";
    App.log("目标职责","[例外数据授权"+(id?"编辑":"新增")+"] "+person.name+" · "+role.name+" · "+org.name);App.toast("例外授权已保存","success");App._emit();return {ok:true,item:item};
  },
  toggle:function(id){if(!App.canPermissionAdmin())return {ok:false};var item=App.scopeException.byId(id);if(!item)return {ok:false};item.status=item.status==="启用"?"停用":"启用";App.toast("例外授权已"+item.status,"success");App._emit();return {ok:true,item:item};}
};
App.responsibility={
  byId:function(id){return (App.responsibilityItems||[]).filter(function(x){return x.id===id;})[0]||null;},
  save:function(data,id){
    data=data||{};if(!App.canMaintainDuties()){App.toast("只有二级单位安全管理人员可以维护岗位安全职责","error");return {ok:false};}if(!data.orgId||!data.post||!data.category||!String(data.content||"").trim()||!String(data.basis||"").trim()||!data.effectiveDate){App.toast("请完整填写组织、岗位、职责类别、职责内容、依据和生效日期","error");return {ok:false};}
    var item=id?App.responsibility.byId(id):null,profile=App.orgProfile(data.orgId);if(!profile)return {ok:false};
    if(!item){item={id:uid(),code:"DUTY-"+String((App.responsibilityItems||[]).length+1).padStart(3,"0"),status:"启用",version:"V1.0",history:[]};App.responsibilityItems.unshift(item);}
    else {item.history=item.history||[];item.history.unshift({version:item.version,content:item.content,basis:item.basis,effectiveDate:item.effectiveDate,responsibleUser:item.responsibleUser,archivedAt:now(),archivedBy:App.currentUser()});var parts=String(item.version||"V1.0").replace("V","").split(".");item.version="V"+(parts[0]||"1")+"."+(Number(parts[1]||0)+1);}
    item.orgId=data.orgId;item.org=profile.parentId==="zaoxing"?"造型作业区 / "+profile.name:profile.name;item.post=data.post;item.category=data.category;item.basis=String(data.basis).trim();item.effectiveDate=data.effectiveDate;item.content=String(data.content).trim();item.responsibleUser=App.directoryHoldersFor(data.orgId,data.post).join("、")||"待企业微信同步";item.updatedAt=now();
    App.log("目标职责","[职责"+(id?"编辑":"新增")+"] "+item.code+" "+item.post);App.toast(id?"职责已保存":"职责已新增","success");App._emit();return {ok:true,item:item};
  },
  toggle:function(id){if(!App.canMaintainDuties()){App.toast("只有二级单位安全管理人员可以启停职责","error");return {ok:false};}var item=App.responsibility.byId(id);if(!item)return {ok:false};item.status=item.status==="启用"?"停用":"启用";item.updatedAt=now();App.log("目标职责","[职责"+item.status+"] "+item.code);App.toast("职责已"+item.status,"success");App._emit();return {ok:true,item:item};}
};

App.mapPermitStatuses=["审批中","待监护确认","待开工","执行中","已暂停","超时阻断","延期审批中"];
App.workPermits.forEach(function(w){
  w.workLevel=w.workLevel||(w.riskLevel==="较大"?"一级":"三级");
  w.approvalPath=App.approvalPathFor(w);
  if(["待监护确认","待开工","执行中","已暂停"].indexOf(w.status)>-1&&w.plannedEnd&&Date.parse(w.plannedEnd.replace(/-/g,"/"))<Date.now()){
    w.statusBeforeExpiry=w.status;w.status="超时阻断";
    w.actions=w.actions||[];
    if(!w.actions.some(function(a){return a.type==="超时阻断";}))w.actions.push({type:"超时阻断",at:now(),by:"系统",note:"已超过许可结束时间 "+w.plannedEnd+"，延期批准前禁止继续作业、恢复或完工"});
  }
  if(typeof w.approvalIndex!=="number")w.approvalIndex=w.status==="审批中"?0:w.approvalPath.length;
  w.currentApprovalNode=w.status==="审批中"?w.approvalPath[w.approvalIndex]||null:null;
});

/* ---------- 风险动作 ---------- */
App.risk={
  clone:function(o){return JSON.parse(JSON.stringify(o));},
  byId:function(id){return App.risks.filter(function(r){return r.id===id;})[0];},
  draftOf:function(riskId){var r=App.risk.byId(riskId);return r&&r.draftVersion||null;},
  workVersion:function(riskId){var r=App.risk.byId(riskId);return r&&(r.draftVersion||{id:"CURRENT-"+r.id,version:r.version,status:"当前生效",hazards:r.hazards});},
  hazardById:function(riskId,hid){
    var r=App.risk.byId(riskId),d=r&&r.draftVersion;
    var hs=d&&d.hazards||[];var h=hs.filter(function(x){return x.id===hid;})[0];
    return h||(r&&r.hazards||[]).filter(function(x){return x.id===hid;})[0];
  },
  saveAssessment:function(riskId,hid,L,E,C,direct,note){return App.risk.saveAssessmentDraft(riskId,hid,{L:L,E:E,C:C,direct:direct,note:note});},
  saveAssessmentDraft:function(riskId,hid,payload){
    var h=App.risk.hazardById(riskId,hid),r=App.risk.byId(riskId);if(!h||!r)return {ok:false,msg:"危险源不存在"};
    if(h.assessor&&h.assessor!==App.currentUser()){App.toast("仅原评价人可修改该评价，请切换评价人角色","error");return {ok:false,msg:"评价人不匹配"};}
    var L=+payload.L||0,E=+payload.E||0,C=+payload.C||0,direct=!!payload.direct,note=(payload.note||"").trim();
    if(!direct&&(L<1||L>5||E<1||E>6||C<1||C>15)){App.toast("请填写有效的 L/E/C（L 1-5、E 1-6、C 1-15）","error");return {ok:false,msg:"LEC范围不合法"};}
    if(direct&&!note){App.toast("直接判定必须填写判定依据","error");return {ok:false,msg:"缺少直接判定依据"};}
    h.L=L;h.E=E;h.C=C;h.D=direct?320:calcD(L,E,C);h.level=direct?levelOf(320):levelOf(h.D);h.direct=direct;h.directNote=note;
    h.assessment="D=L×E×C="+L+"×"+E+"×"+C+"="+h.D+"，属"+h.level.name+"风险";h.assessor=App.currentUser();h.assessedAt=now();h.assessmentStatus="已完成";
    App.log("风险管理","[风险评价] "+r.code+" / "+h.name+" 已保存完成");App.toast("评价已保存，请继续补全管控措施");App._emit();return {ok:true,hazard:h};
  },
  saveMeasures:function(riskId,hid,measures){var h=App.risk.hazardById(riskId,hid);if(!h)return;h.measures=measures;App.log("风险管理","[措施] 危险源更新 "+measures.length+" 条管控措施");App._emit();},
  updateRisk:function(riskId,patch){
    var r=App.risk.byId(riskId);if(!r)return {ok:false,msg:"风险点不存在"};
    if(!r.draftVersion&&r.status==="已发布"){App.toast("已生效风险点只读，请发起变更/复评","warn");return {ok:false,msg:"当前版本只读"};}
    patch=patch||{};
    if(r.draftVersion){
      Object.keys(patch).forEach(function(k){if(patch[k]!==undefined)r.draftVersion[k==="name"?"riskName":k]=patch[k];});
      r.draftVersion.updatedAt=now();
      if(!r.currentVersion)applyRiskPointMeta(r,r.draftVersion);
    }else Object.keys(patch).forEach(function(k){if(patch[k]!==undefined)r[k]=patch[k];});
    r.updatedAt=now();App.log("风险管理","[风险点编辑] "+r.code+" 更新整点版本基础信息");App._emit();return {ok:true,risk:r};
  },
  deleteRisk:function(riskId){var r=App.risk.byId(riskId);if(!r)return {ok:false};if(r.status==="已发布"&&!r.draftVersion){App.toast("已生效风险点不可物理删除，请发起变更/停用","error");return {ok:false,msg:"正式版本不可删除"};}App.risks=App.risks.filter(function(x){return x.id!==riskId;});App.changeRequests=App.changeRequests.filter(function(x){return x.riskId!==riskId;});App.versionApprovals=App.versionApprovals.filter(function(x){return x.riskId!==riskId;});App.log("风险管理","[风险点删除] 删除草稿风险点 "+r.code);App.toast("草稿风险点已删除");App._emit();return {ok:true};},
  updateHazard:function(riskId,hid,patch){var h=App.risk.hazardById(riskId,hid);if(!h)return {ok:false};Object.keys(patch||{}).forEach(function(k){if(patch[k]!==undefined)h[k]=patch[k];});h.updatedAt=now();App.log("风险管理","[危险源编辑] "+h.name+" 更新辨识字段");App._emit();return {ok:true,hazard:h};},
  updateMeasure:function(riskId,hid,mid,patch){var h=App.risk.hazardById(riskId,hid),m=h&&(h.measures||[]).filter(function(x){return x.id===mid;})[0];if(!m)return {ok:false};Object.keys(patch||{}).forEach(function(k){if(patch[k]!==undefined)m[k]=patch[k];});App.log("风险管理","[措施编辑] "+m.name+" 更新措施与责任字段");App._emit();return {ok:true,measure:m};},
  responsibilityComplete:function(h){return !!(h&&h.measures&&h.measures.length);},
  syncTaskStates:function(riskId){
    App.riskTasks.forEach(function(t){
      if(["已完成","已生效"].indexOf(t.status)>-1)return;
      var ids=(t.riskIds||[]).slice();if(t.riskId&&ids.indexOf(t.riskId)<0)ids.push(t.riskId);if(ids.indexOf(riskId)<0)return;
      var rs=App.risks.filter(function(x){return ids.indexOf(x.id)>-1;});if(!rs.length)return;
      var allEffective=rs.every(function(x){return x.status==="已发布"&&!x.draftVersion;}),states=rs.map(function(x){return x.draftVersion&&x.draftVersion.status||"";}),hasEditable=rs.some(function(x){return x.draftVersion&&["草稿","已退回"].indexOf(x.draftVersion.status)>-1;}),hasPublished=rs.some(function(x){return x.status==="已发布"&&!x.draftVersion;});
      if(allEffective){t.status="已生效";t.version="全部生效";t.currentHandler="-";t.completedAt=now();}
      else if(hasEditable){t.status="辨识中";t.version=hasPublished?"部分生效":"草稿/辨识中";t.currentHandler=App.currentUser();}
      else if(states.indexOf("待作业区负责人审核")>-1){t.status="待作业区负责人审核";t.version=hasPublished?"部分生效":"风险点审批中";t.currentHandler="作业区负责人";}
      else if(states.indexOf("待二级单位安全管理审核")>-1){t.status="待二级单位安全管理审核";t.version=hasPublished?"部分生效":"风险点审批中";t.currentHandler="二级单位安全管理人员";}
      else if(states.indexOf("待二级单位领导审批")>-1){t.status="待二级单位领导审批";t.version=hasPublished?"部分生效":"风险点审批中";t.currentHandler="二级单位领导";}
      else{t.status="辨识中";t.version=hasPublished?"部分生效":"辨识中";t.currentHandler=App.currentUser();}
      t.hazardCount=rs.reduce(function(s,x){var w=x.draftVersion||x;return s+(w.hazards||[]).length;},0);t.updatedAt=now();
    });
  },
  versionCheck:function(riskId){
    var r=App.risk.byId(riskId),d=r&&r.draftVersion;if(!r||!d)return {ok:false,issues:["暂无风险点版本草稿"]};var issues=[];
    if(["班组长","分公司负责人","总经理","公司领导"].indexOf(d.responsibilityPost)<0)issues.push("责任岗位未选择或不在受控岗位范围内");if(!d.hazards.length)issues.push("至少需要 1 条危险源");d.hazards.forEach(function(h){if(!h.name)issues.push("存在未填写描述的危险源");if(!h.accidentType||h.accidentType==="-")issues.push((h.name||"危险源")+"：事故类型未填写");if(!h.level||!(h.direct||h.level.method==="direct"||+h.D>0)||h.assessmentStatus!=="已完成")issues.push((h.name||"危险源")+"：风险评价尚未完成");if(!(h.measures||[]).some(function(m){return m.type==="管理措施";}))issues.push((h.name||"危险源")+"：必须至少填写一条管理措施");});return {ok:issues.length===0,issues:issues};
  },
  submitVersion:function(riskId){
    var r=App.risk.byId(riskId),d=r&&r.draftVersion,check=App.risk.versionCheck(riskId);if(!check.ok){App.toast("风险点审批被阻断："+check.issues[0],"error");return {ok:false,issues:check.issues};}
    if(App.currentRole!=="team_leader"){App.toast("风险点应由班组长填报并提交审核","error");return {ok:false};}
    var first={status:"待作业区负责人审核",role:"section_manager",name:"作业区负责人审核"},wasReturned=d.status==="已退回";d.status=first.status;d.submittedAt=now();d.currentNode=first.name;d.approvalRole=first.role;d.approvalChannel="INTERNAL";d.internalApprovalStatus="审批中";d.returnedReason="";["oaInstanceId","oaStatusUrl","oaStatus","approvalPdfName"].forEach(function(k){delete d[k];delete r[k];});var va=App.risk.ensureVersionApproval(riskId);va.status=d.status;va.currentNode=d.currentNode;va.approvalRole=first.role;va.approvalChannel="INTERNAL";va.history=va.history||[];va.history.unshift({node:"班组长填报",at:d.submittedAt,by:App.currentUser(),status:d.status,note:wasReturned?"修改后重新提交，从作业区负责人审核重新开始":"提交风险点审核"});App.risk.syncTaskStates(riskId);App.log("风险管理","[版本提交] "+r.code+" "+d.version+" → 平台内置审批 / "+first.name);App.toast(wasReturned?"已重新提交，并从作业区负责人审核重新开始":"已提交作业区负责人审核并推送企业微信");App._emit();return {ok:true,channel:"INTERNAL",status:d.status};
  },
  ensureVersionApproval:function(riskId){var r=App.risk.byId(riskId),d=r&&r.draftVersion;if(!r||!d)return null;var v=App.versionApprovals.filter(function(x){return x.riskId===riskId&&x.versionId===d.id;})[0];if(!v){v={id:uid(),code:"RVA-"+r.code+"-"+d.version,riskId:riskId,versionId:d.id,status:d.status,currentNode:d.currentNode||null,history:[]};App.versionApprovals.push(v);}return v;},
  actVersion:function(riskId,pass,note){
    var r=App.risk.byId(riskId),d=r&&r.draftVersion;note=(note||"").trim();if(!d){App.toast("当前风险点没有待审核版本","warn");return {ok:false};}var v=App.risk.ensureVersionApproval(riskId);if(!v)return {ok:false};
    var max=App.risk.maxLevel(d.hazards),steps=[{status:"待作业区负责人审核",role:"section_manager",name:"作业区负责人审核"},{status:"待二级单位安全管理审核",role:"company_safety",name:"二级单位安全管理审核"}];if(max.key==="big"||max.key==="major")steps.push({status:"待二级单位领导审批",role:"unit_leader",name:"二级单位领导审批"});var idx=steps.map(function(x){return x.status;}).indexOf(d.status),step=steps[idx];if(!step){App.toast("当前版本不在风险点审核节点","warn");return {ok:false};}if(!pass&&!note){App.toast("版本退回必须填写意见","error");return {ok:false};}if(App.currentRole!==step.role){App.toast("当前角色无权审核，应由"+step.name+"处理","error");return {ok:false};}
    var next=pass?steps[idx+1]:null;v.history=v.history||[];v.history.unshift({node:step.name,at:now(),by:App.currentUser(),status:pass?(next?next.status:"当前生效"):"已退回",note:pass?(note||"风险点整体审核通过"):note});
    if(!pass){d.status="已退回";d.currentNode="班组长修改";d.approvalRole="team_leader";d.updatedAt=now();d.returnedReason=note;d.internalApprovalStatus="已退回";v.status="已退回";v.currentNode="班组长修改";App.toast("版本已退回班组长；重新提交后从作业区负责人审核开始","warn");App.risk.syncTaskStates(riskId);App.log("风险管理","[版本退回] "+r.code+" "+d.version+"："+step.name+" → 班组长修改");App._emit();return {ok:true,status:"已退回"};}
    if(next){d.status=next.status;d.currentNode=next.name;d.approvalRole=next.role;d.updatedAt=now();d.internalApprovalStatus="审批中";v.status=next.status;v.currentNode=next.name;App.toast("已通过「"+step.name+"」，进入「"+next.name+"","success");App.risk.syncTaskStates(riskId);App.log("风险管理","[版本审核] "+r.code+" "+d.version+"："+step.name+" → "+next.name);App._emit();return {ok:true,status:next.status};}
    d.status="当前生效";d.updatedAt=now();d.returnedReason="";d.internalApprovalStatus="已批准";v.status="当前生效";v.currentNode="当前生效";
    {
      var oldVersion=r.version,snapshot=App.risk.clone(d.hazards),meta=riskPointMeta(r,d),maxLevel=App.risk.maxLevel(snapshot);applyRiskPointMeta(r,meta);r.hazards=snapshot;r.version=d.version;r.currentVersion=d.version;r.status="已发布";r.level=maxLevel.key;r.updatedAt=now();r.lastReviewedAt=now();r.approvalChannel="INTERNAL";r.internalApprovalStatus="已批准";r.versions=r.versions||[];r.versions.forEach(function(x){if(x.status==="当前生效")x.status="已归档";});var nv={id:d.id,code:r.code,version:d.version,status:"当前生效",riskName:meta.riskName,hazardCount:snapshot.length,measureCount:snapshot.reduce(function(s,h){return s+(h.measures||[]).length;},0),maxLevel:maxLevel.name,operator:d.operator||App.currentUser(),publishedAt:now(),note:step.name+"审批通过",approvalRole:step.name,approvalChannel:"INTERNAL",previousVersion:oldVersion};r.versions.unshift(nv);App.versions.forEach(function(x){if(x.code===r.code&&(x.status==="已发布"||x.status==="当前生效"))x.status="已归档";});var globalV={id:nv.id,code:r.code,version:nv.version,status:"当前生效",riskName:meta.riskName,hazardCount:nv.hazardCount,measureCount:nv.measureCount,maxLevel:nv.maxLevel,operator:nv.operator,publishedAt:nv.publishedAt,note:nv.note};App.versions.unshift(globalV);r.draftVersion=null;App.toast(step.name+"批准完成，"+r.code+" "+r.version+" 已生效", "success");
      /* The global/risk timeline entries also carry the immutable snapshot so
         the history view can compare versions without reading the live row. */
      nv.snapshot=v.snapshot=Object.assign({id:d.id,version:d.version,status:"当前生效",riskId:r.id,createdAt:d.createdAt,updatedAt:now(),operator:d.operator||App.currentUser(),hazards:App.risk.clone(snapshot),submittedAt:d.submittedAt,returnedReason:""},meta);
      nv.previousVersion=oldVersion;globalV.snapshot=v.snapshot;globalV.previousVersion=oldVersion;
      v.status="当前生效";v.currentNode="当前生效";
    }
    App.risk.syncTaskStates(riskId);App.log("风险管理","[版本批准] "+r.code+" "+d.version+"："+step.name+" → 当前生效");App._emit();return {ok:true,status:"当前生效"};
  },
  resubmitVersion:function(riskId){var r=App.risk.byId(riskId),d=r&&r.draftVersion;if(!d||d.status!=="已退回"){App.toast("当前版本没有可重新提交的退回记录","warn");return {ok:false};}return App.risk.submitVersion(riskId);},
  maxLevel:function(hazards){var best={key:"low",name:"低"};(hazards||[]).forEach(function(h){var l=h.level&&h.level.key||"low";if((({low:0,common:1,big:2,major:3}[l]||0))>((({low:0,common:1,big:2,major:3}[best.key]||0))))best=h.level;});return best;},
  createVersion:function(riskId,trigger,reason,scope,planDate){
    var r=App.risk.byId(riskId);if(!r)return null;if(r.draftVersion){App.toast("该风险点已有版本草稿，请先完成当前审批","warn");return r.draftVersion;}
    var n=1;(r.versions||[]).forEach(function(v){var m=/V(\d+)\./.exec(v.version||"");if(m)n=Math.max(n,+m[1]+1);});if(!n||n===1)n=2;
    var d=Object.assign({id:uid(),version:"V"+n+".0",status:"草稿",riskId:r.id,createdAt:now(),updatedAt:now(),operator:App.currentUser(),trigger:trigger||"人工复评",reason:reason||"",scope:scope||"",planDate:planDate||"",hazards:App.risk.clone(r.hazards),returnedReason:""},riskPointMeta(r));
    r.draftVersion=d;
    d.hazards.forEach(function(h){h.assessmentStatus="待完善";h.assessmentLocked=false;h.assessor=App.currentUser();h.assessedAt=null;});
    App.changeRequests.unshift({id:uid(),riskId:r.id,versionId:d.id,trigger:trigger||"人工复评",reason:reason||"",scope:scope||"",planDate:planDate||"",createdAt:now(),by:App.currentUser(),status:"草稿"});App.log("风险管理","[发起复评] "+r.code+" 复制整点快照生成 "+d.version);App.toast("已复制整个风险点快照，生成 "+d.version+" 草稿");App._emit();return d;
  },
  updatePosition:function(riskId,pos){var r=App.risk.byId(riskId);if(!r)return;r.mapPosition=pos;App.log("风险管理","[四色图定位] "+r.code+" 保存区域/楼层/X/Y");App.toast("风险点定位已保存，四色图标记已更新");App._emit();},
  noticeView:function(riskId,version){App.riskNoticeViews.unshift({id:uid(),riskId:riskId,version:version,user:App.currentUser(),at:now()});App.log("风险管理","[告知卡查看] "+riskId+" "+version);App._emit();},
  updateTaskStatus:function(taskId,status,note){var t=App.riskTasks.filter(function(x){return x.id===taskId;})[0];if(!t)return {ok:false};t.status=status;t.currentHandler=App.currentUser();t.updatedAt=now();if(status==="待作业区负责人审核"||status==="待二级单位安全管理审核"||status==="待二级单位领导审批")t.submitAt=now();t.actions=t.actions||[];t.actions.unshift({at:now(),by:App.currentUser(),status:status,note:note||""});App.log("风险管理","[任务状态] "+t.code+" → "+status+(note?"："+note:""));App.toast("任务已更新为「"+status+"」");App._emit();return {ok:true,task:t};},
  toInspection:function(measureId){
    var m=null,sourceRisk=null;App.risks.forEach(function(r){(r.hazards||[]).forEach(function(h){(h.measures||[]).forEach(function(x){if(x.id===measureId){m=x;sourceRisk=r;}});});});if(!m)return;
    var existing=App.inspectionItems.filter(function(it){return it.sourceMeasure===measureId;})[0];if(!existing){existing={id:uid(),code:"CHK-"+pad(App.inspectionItems.length+1),standardVersionId:"STD-"+(sourceRisk&&sourceRisk.code||"GENERAL")+"-"+(sourceRisk&&sourceRisk.version||"DRAFT"),name:"检查："+m.name,standard:"按风险措施要求现场核查",response:"是非",requiredPhoto:true,sourceMeasure:measureId,riskCode:sourceRisk&&sourceRisk.code||null,enabled:true,status:"草稿",version:1,sourceVersion:sourceRisk&&sourceRisk.version||"风险措施草稿"};App.inspectionItems.push(existing);}else{existing.status="草稿";existing.version=(existing.version||1)+1;}
    App.log("巡检任务","[关联] 管控措施 "+measureId+" 已关联为独立检查项目草稿");App.toast("已关联并带出检查项目草稿，可独立编辑后发布","success");App._emit();location.href="inspection.html?tab=items&from=risk&measureId="+measureId;
  }
};

/* ---------- 巡检动作 ---------- */
/* Draft content is editable only before version approval starts. Once a
   snapshot is submitted (or published), the workbench is read-only. */
App.risk.draftEditable=function(riskId){
  var r=App.risk.byId(riskId),d=r&&r.draftVersion;
  return !!(d&&["草稿","已退回"].indexOf(d.status)>-1);
};
(function(){
  ["updateRisk","updateHazard","updateMeasure","saveAssessmentDraft"].forEach(function(name){
    var original=App.risk[name];
    App.risk[name]=function(riskId){
      if(!App.risk.draftEditable(riskId)){
        App.toast("当前版本已提交审批或已生效，只读，请先发起退回修改或变更复评","warn");
        return {ok:false,msg:"版本只读"};
      }
      return original.apply(App.risk,arguments);
    };
  });
})();

App.inspection={
  createPlan:function(data){
    if(["日常岗位巡检","监督检查"].indexOf(data.type)<0){App.toast("计划类型仅支持日常岗位巡检或监督检查","error");return null;}
    var p={id:uid(),code:"INSP-"+dstr()+"-"+seq("insp"),status:"草稿",items:[],createdAt:now(),
      name:data.name,type:data.type,subtype:data.subtype||"岗位日常",org:App.currentOrg.split(" / ").pop()||App.currentOrg,scope:data.scope,
      cycle:data.cycle,teamId:data.teamId||null,teamName:data.teamName||null,standardRefs:data.standardRefs||[],startDate:data.startDate,endDate:data.endDate};
    App.inspectionPlans.push(p);
    App.log("巡检任务","[计划] 创建计划 "+p.code+" "+p.name);
    App._emit();
    return p;
  },
  publishPlan:function(id){
    var p=App.inspectionPlans.filter(function(x){return x.id===id;})[0];
    p.status="已发布";
    App.log("巡检任务","[计划] 发布计划 "+p.code);
    App._emit();
  },
  dispatchTask:function(planId,person,temporary){
    var t=App.inspection.generateTask(planId);if(!t)return null;
    t.teamName=person||t.teamName||"执行班组";t.claimant=null;t.status="待领取";
    App.log("巡检任务","[计划生成] "+t.code+" → "+t.teamName);
    App._emit();return t;
  },
  saveItemVersion:function(id,data){
    var it=App.inspectionItems.filter(function(x){return x.id===id;})[0];if(!it)return null;
    Object.keys(data||{}).forEach(function(k){if(["id","sourceMeasure","riskCode"].indexOf(k)<0&&data[k]!==undefined)it[k]=data[k];});
    it.version=(it.version||1)+1;it.status="草稿";it.editedAt=now();
    App.log("巡检任务","[项目编辑] "+it.code+" 保存独立草稿版本 V"+it.version);App._emit();return it;
  },
  publishItemVersion:function(id){
    var it=App.inspectionItems.filter(function(x){return x.id===id;})[0];if(!it)return;
    it.status="已发布";it.publishedAt=now();App.log("巡检任务","[项目发布] "+it.code+" 发布独立版本 V"+(it.version||1));App._emit();
  },
  generateTask:function(planId){
    var p=App.inspectionPlans.filter(function(x){return x.id===planId;})[0];
    if(!p||p.items.length===0){App.toast("计划无检查项目，无法生成任务","error");return;}
    var team=(App.teams||[]).filter(function(x){return x.name===p.teamName||x.id===p.teamId;})[0]||(App.teams||[])[0];
    var sourceItems=(p.items||[]).map(function(ref){var id=typeof ref==="object"?ref.id:ref;return App.inspectionItems.filter(function(x){return x.id===id;})[0];}).filter(Boolean);
    var t={id:uid(),code:"INSP-T-"+dstr()+"-"+seq("insp"),planId:p.id,planName:p.name,org:p.org,scope:p.scope,standardRefs:p.standardRefs||[],
      teamId:team&&team.id,teamName:team&&team.name||p.teamName||"执行班组",claimant:null,claimedAt:null,assignee:null,window:"2026-08-01 08:00 ~ 12:00",status:"待领取",
      items:sourceItems.map(function(it){return {id:it.id,content:it.name,standard:it.standard,requiredPhoto:!!it.requiredPhoto,riskCode:it.riskCode,sourceMeasure:it.sourceMeasure,result:"",description:"",photoDone:false};}),completionRate:0,unqualified:0,createdAt:now(),results:null};
    App.inspectionTasks.unshift(t);
    App.log("巡检任务","[任务] 按计划生成任务 "+t.code);
    App.toast("已生成班组任务 "+t.code+"，等待首位成员领取");
    App._emit();
    return t;
  },
  assignTask:function(taskId,person){
    var t=App.inspectionTasks.filter(function(x){return x.id===taskId;})[0];
    t.teamName=person||t.teamName;t.assignee=null;t.claimant=null;t.claimedAt=null;t.status="待领取";
    App.log("巡检任务","[下发班组] "+t.code+" → "+t.teamName+"，等待首人领取");
    App._emit();
  },
  submitResults:function(taskId,results){
    var t=App.inspectionTasks.filter(function(x){return x.id===taskId;})[0];
    var done=0,unq=0;
    results.forEach(function(res){if(res.result==="合格"||res.result==="不合格")done++;if(res.result==="不合格")unq++;});
    t.results=results;t.completionRate=Math.round(done/results.length*100);t.unqualified=unq;
    t.status=unq>0?"已完成（含不合格）":"已完成";t.completedAt=now();
    App.log("巡检任务","[执行] "+t.code+" 提交结果：完成率 "+t.completionRate+"%，不合格 "+unq+" 项");
    App._emit();
  },
  toHazard:function(taskId,itemId){
    var t=App.inspectionTasks.filter(function(x){return x.id===taskId;})[0];
    var it=App.inspectionItems.filter(function(x){return x.id===itemId;})[0];
    if(!t||!it)return null;
    t.hazardGeneratedIds=t.hazardGeneratedIds||[];
    var existing=t.hazardGeneratedIds.map(function(id){return App.hazards.filter(function(h){return h.id===id;})[0];}).filter(function(h){return h&&h.sourceItemId===itemId;})[0];
    if(existing){App.toast("该不合格检查项已生成隐患，不能重复生成","warn");return existing;}
    var result=(t.results||[]).filter(function(x){return x.itemId===itemId;})[0]||{},description=String(result.description||result.note||"").trim();
    if(!description){App.toast("不合格项缺少说明，不能生成隐患","error");return null;}
    var taskItem=null;(App.tasks||[]).forEach(function(task){(task.items||[]).forEach(function(x){if(x.id===itemId)taskItem=x;});});
    var location=it.riskLocation||it.location||(taskItem&&taskItem.riskLocation)||(it.riskCode?it.riskCode+" 相关区域":"造型作业区现场");
    var h={id:uid(),code:"HZ-"+dstr()+"-"+seq("hz"),title:description,org:t.org,location:location,
      source:"INSPECTION",sourceLabel:"巡检发现",sourceRef:t.code,sourceItemId:itemId,severity:null,riskCode:it.riskCode,rewardEligible:false,rewardStatus:"不参与奖励",
      responsibleDept:null,responsibleUser:null,deadline:null,status:"待受理",
      reporter:t.assignee||App.currentUser(),createdAt:now(),closedAt:null,description:description,
      sourceEvidence:{photo:!!(result.photoDone||result.photo),note:description,label:"巡检现场证据"},
      rectification:null,actions:[{type:"登记",at:now(),by:t.assignee||App.currentUser(),note:"巡检不合格一键转隐患"}]};
    App.hazards.unshift(h);
    t.hazardGeneratedIds.push(h.id);
    App.log("隐患治理","[转隐患] 生成 "+h.code+"（来源 "+t.code+"）");
    App.toast("已生成隐患 "+h.code);
    App._emit();
    return h;
  }
};

/* ---------- 隐患动作 ---------- */
App.hazard={
  byId:function(id){return App.hazards.filter(function(h){return h.id===id;})[0];},
  acceptRole:function(h){if(!h)return "company_safety";if(h.source==="INSPECTION")return "section_manager";if(h.source==="MOBILE_REPORT"||h.source==="HSE_SUPERVISION")return "company_safety";if(h.source==="PROFESSIONAL_DEPT_CHECK")return null;return "company_safety";},
  canAccept:function(h){var role=App.hazard.acceptRole(h);return !!role&&App.currentRole===role;},
  accept:function(id,severity,dept,user,deadline,requirement,opinion,personId){
    var h=App.hazard.byId(id);if(!App.hazard.canAccept(h)){App.toast('当前角色不是该来源隐患的受理岗位','error');return {ok:false,msg:'无受理权限'};}
    if(!h||h.status!=='待受理'){return {ok:false,msg:'隐患不在待受理状态'};}var person=App.directoryMemberById(personId);if(!person||person.status!=="在职"||person.name!==user){App.toast("整改责任人必须从企业微信在职人员中选择","error");return {ok:false,msg:"责任人无效"};}h.severity=severity;h.responsibleDept=dept;h.responsibleUser=user;h.responsiblePersonId=person.id;h.deadline=deadline;
    h.rectificationRequirement=requirement||"";
    h.acceptedBy=App.currentUser();h.acceptedAt=now();h.acceptanceOpinion=opinion||'';
    h.status="待整改";h.actions.push({type:"受理",at:h.acceptedAt,by:h.acceptedBy,note:"定级："+severity+"，分派责任人 "+user+(opinion?"；受理意见："+opinion:" ")});
    App.log("隐患治理","[受理] "+h.code+" 已受理并分派");
    App._emit();
    return {ok:true,hazard:h};
  },
  reject:function(id,reason){
    var h=App.hazard.byId(id);if(!App.hazard.canAccept(h))return {ok:false,msg:"无受理权限"};if(!h||h.status!=="待受理"||!reason)return {ok:false,msg:"状态或原因不符合"};
    h.status="不受理关闭";h.rejectedAt=now();h.rejectedBy=App.currentUser();h.rejectionReason=reason;h.closedAt=h.rejectedAt;
    h.actions.push({type:"不受理关闭",at:h.rejectedAt,by:h.rejectedBy,note:reason});App.log("隐患治理","[不受理] "+h.code+" 已关闭");App._emit();return {ok:true,hazard:h};
  },
  rectify:function(id,summary,evidenceAfter){
    var h=App.hazard.byId(id);
    h.rectification={summary:summary,completed:summary,evidenceBefore:!!(h.sourceEvidence&&h.sourceEvidence.photo),evidenceAfter:!!evidenceAfter,submittedAt:now(),reviewStatus:"待复查"};
    h.status="待复查";h.actions.push({type:"整改提交",at:now(),by:App.currentUser(),note:"已提交整改反馈，待复查"});
    App.log("隐患治理","[整改] "+h.code+" 提交整改反馈");
    App._emit();
  },
  review:function(id,pass,note){
    var h=App.hazard.byId(id);
    if(pass){h.status="已闭环";h.closedAt=now();h.rectification.reviewStatus="通过";if(h.source==="MOBILE_REPORT"&&h.rewardEligible)h.rewardStatus="待奖励评定";h.actions.push({type:"复查通过",at:now(),by:App.currentUser(),note:(note||"复查合格，闭环")+(h.source==="MOBILE_REPORT"&&h.rewardEligible?"；已进入奖励评定":"")});}
    else{h.status="整改中";h.rectification.reviewStatus="退回";h.actions.push({type:"复查退回",at:now(),by:App.currentUser(),note:note||"整改不达标，退回重新整改"});}
    App.log("隐患治理","[复查] "+h.code+(pass?" 复查通过关闭":" 复查退回"));
    App._emit();
  },
  toSupervision:function(id,opinion,deadline){
    var h=App.hazard.byId(id);
    if(!h)return null;
    var s={id:uid(),code:"SUP-"+dstr()+"-"+seq("sup"),title:h.title,hazardCode:h.code,hazardTitle:h.title,
      level:"授权范围",fromOrg:"授权范围内督办",toOrg:h.org.split(" ")[0]||"铸锻件分公司",opinion:opinion,
      deadline:deadline,status:"已发起",createdAt:now(),feedbackCount:0,feedbacks:[],authorizedBy:App.currentUser(),
      actions:[{type:"发起",at:now(),by:App.currentUser(),note:"关联隐患 "+h.code}]};
    App.supervisions.unshift(s);
    App.log("隐患督办","[发起] "+s.code+" 关联 "+h.code+"（隐患状态保持 "+h.status+"）");
    App.toast("已发起督办 "+s.code+"，原隐患状态不受影响");
    App._emit();
    return s;
  },
  createOverdueSuggestion:function(id){
    var h=App.hazard.byId(id);if(!h)return null;
    if(h.supervisionSuggestion)return h.supervisionSuggestion;
    h.supervisionSuggestion={id:uid(),hazardId:h.id,reason:"整改期限已到，建议授权范围内督办",status:"待授权",createdAt:now()};
    App.log("隐患治理","[逾期建议] "+h.code+" 生成督办建议");App._emit();return h.supervisionSuggestion;
  },
  authorizeSupervision:function(hazardId,opinion,deadline){
    var h=App.hazard.byId(hazardId);if(!h)return null;
    var suggestion=h.supervisionSuggestion||App.hazard.createOverdueSuggestion(hazardId);suggestion.status="已授权";
    var s=App.hazard.toSupervision(hazardId,opinion||suggestion.reason,deadline||"2026-08-05");suggestion.supervisionId=s&&s.id;App._emit();return s;
  }
};

/* ---------- 督办动作 ---------- */
App.supervision={
  byId:function(id){return App.supervisions.filter(function(s){return s.id===id;})[0];},
  receive:function(id){
    var s=App.supervision.byId(id);s.status="已接收";s.actions.push({type:"接收",at:now(),by:App.currentUser(),note:"公司确认接收"});
    App.log("隐患督办","[接收] "+s.code+" 已接收");
    App._emit();
  },
  feedback:function(id,progress,text){
    var s=App.supervision.byId(id);
    s.feedbacks.push({id:uid(),progress:progress,text:text,by:App.currentUser(),at:now(),evidence:true});
    s.feedbackCount=s.feedbacks.length;s.status="反馈中";
    s.actions.push({type:"反馈",at:now(),by:App.currentUser(),note:"第 "+s.feedbackCount+" 次进度反馈 "+progress+"%"});
    App.log("隐患督办","[反馈] "+s.code+" 第 "+s.feedbackCount+" 次反馈 "+progress+"%");
    App._emit();
  },
  close:function(id){
    var s=App.supervision.byId(id);s.status="已关闭";s.actions.push({type:"关闭",at:now(),by:App.currentUser(),note:"集团验收通过，督办关闭（原隐患独立流转）"});
    App.log("隐患督办","[关闭] "+s.code+" 验收关闭");
    App.toast("督办已关闭，原隐患状态保持独立");
    App._emit();
  }
};

/* ---------- 特殊作业动作 ---------- */
App.permit={
  byId:function(id){return App.workPermits.filter(function(w){return w.id===id;})[0];},
  isExpired:function(w){return !!(w&&w.plannedEnd&&Date.parse(w.plannedEnd.replace(/-/g,"/"))<Date.now());},
  blockIfExpired:function(w){if(!w||!App.permit.isExpired(w))return false;if(["待监护确认","待开工","执行中","已暂停"].indexOf(w.status)>-1){w.statusBeforeExpiry=w.status;w.status="超时阻断";w.actions=w.actions||[];if(!w.actions.some(function(a){return a.type==="超时阻断";}))w.actions.push({type:"超时阻断",at:now(),by:"系统",note:"作业票超过许可结束时间，延期批准前禁止继续作业、恢复或完工"});App._emit();}return w.status==="超时阻断";},
  qualificationRules:function(w){return App.qualificationRules[w.typeKey]&&App.qualificationRules[w.typeKey][w.workLevel]||[];},
  qualificationCheck:function(id){
    var w=App.permit.byId(id);var failed=[];
    w.persons.forEach(function(p){
      var required=p.requiredCert||(p.missingCert||"").split("（")[0];
      if(!required&&p.certRequired){var rules=App.permit.qualificationRules(w);required=rules[0]||"";}
      if(required){var matched=App.certificate.validFor(p.user,required);p.qualification=matched?matched.status:"过期";p.certificateId=matched&&matched.id||null;p.missingCert=matched?"":(required+"（证书台账无有效记录）");}
      if(p.qualification==="过期"||p.qualification==="不满足")failed.push(p);
    });
    w.qualificationFailed=failed.length>0;
    w.approvalPath=App.approvalPathFor(w);
    if(failed.length===0&&w.status==="资格校验失败"){w.status="审批中";w.approvalIndex=0;w.currentApprovalNode=w.approvalPath[0]||null;}
    else if(failed.length>0){w.currentApprovalNode=null;}
    w.actions.push({type:"资格校验",at:now(),by:"系统",note:failed.length>0?("发现 "+failed.length+" 人证书失效，流程阻断"):"资格校验全部通过，可提交审核"});
    App.log("特殊作业","[资格校验] "+w.code+(failed.length>0?" 阻断（"+failed.length+" 人证书失效）":" 通过"));
    App._emit();
    return {ok:failed.length===0,failed:failed};
  },
  submit:function(id){
    var w=App.permit.byId(id);
    if(w.qualificationFailed){App.toast("资格校验未通过，禁止提交审核","error");return;}
    w.status="审批中";w.approvalIndex=0;w.approvalPath=App.approvalPathFor(w);w.currentApprovalNode=w.approvalPath[0]||null;
    w.actions.push({type:"提交",at:now(),by:App.currentUser(),note:"按类型×级别审批路径提交："+w.approvalPath.join(" → ")});
    App.pushWeComTodo("permits","特殊作业待审批",w.code+" 等待 "+(w.currentApprovalNode||"当前审批岗位")+" 审批","work-permits.html?tab=approve&id="+encodeURIComponent(w.id));
    App.log("特殊作业","[提交] "+w.code+" 进入审批路径");
    App._emit();
  },
  approve:function(id,pass,note){
    var w=App.permit.byId(id);
    if(!w)return {ok:false,msg:"作业票不存在"};
    w.approvalPath=w.approvalPath&&w.approvalPath.length?w.approvalPath:App.approvalPathFor(w);
    if(w.status!=="审批中"){App.toast("当前作业票不在审批中","error");return {ok:false,msg:"状态不是审批中"};}
    var index=typeof w.approvalIndex==="number"?w.approvalIndex:0;
    var node=w.approvalPath[index]||w.approvalPath[0]||"当前审批节点";
    if(!pass){
      w.status="已退回";w.currentApprovalNode=node;
      w.actions.push({type:"审批退回",at:now(),by:App.currentUser(),note:node+"退回："+(note||"未通过")});
      App.toast("已退回申请","warn");
    }else{
      w.actions.push({type:"审批通过",at:now(),by:App.currentUser(),note:node+"通过第 "+(index+1)+" 个审批节点"+(note?"："+note:"")});
      w.approvalIndex=index+1;
      if(w.approvalIndex>=w.approvalPath.length){
        w.status="待监护确认";w.currentApprovalNode=null;
        w.actions.push({type:"审批完成",at:now(),by:App.currentUser(),note:"全部审批节点已通过，进入监护确认"});
        App.toast("审批路径已完成，等待监护确认");
      }else{
        w.status="审批中";w.currentApprovalNode=w.approvalPath[w.approvalIndex];
        App.pushWeComTodo("permits","特殊作业待审批",w.code+" 已进入 "+w.currentApprovalNode,"work-permits.html?tab=approve&id="+encodeURIComponent(w.id));
        App.toast("已通过 "+node+"，下一节点："+w.currentApprovalNode);
      }
    }
    App._emit();
    return {ok:true,status:w.status,node:node,next:w.currentApprovalNode||null};
  },
  guardianConfirm:function(id,results){
    var w=App.permit.byId(id);var allPass=true;
    w.checks.forEach(function(c){
      var r=results[c.id];
      if(r){c.result=r;c.checkedBy=App.currentUser();c.checkedAt=now();if(r!=="通过")allPass=false;}
      else if(c.result!=="通过")allPass=false;
    });
    w.actions.push({type:"监护确认",at:now(),by:App.currentUser(),note:allPass?"现场确认全部通过":"存在未通过项"});
    if(allPass){w.status="待开工";w.reconfirmRequired=false;}
    else{w.status="监护条件不满足";w.actions.push({type:"阻断",at:now(),by:"系统",note:"监护确认未全部通过，禁止开工"});}
    App.log("特殊作业","[监护] "+w.code+" "+(allPass?"确认通过，可开工":"存在未通过项，禁止开工"));
    App._emit();
    return allPass;
  },
  start:function(id,evidence){
    var w=App.permit.byId(id);
    if(App.permit.blockIfExpired(w)){App.toast("作业票已超时，请先申请延期","error");return {ok:false};}
    if(w.status!=="待开工"){App.toast("监护确认未完成，不能开工","error");return;}
    evidence=evidence||{};if(!evidence.photo||evidence.locationPassed===undefined){App.toast("开工必须完成位置校验并上传现场照片","error");return {ok:false};}
    w.startEvidence={location:evidence.location||w.location,locationPassed:!!evidence.locationPassed,locationException:evidence.locationException||"",photo:true,at:now(),by:App.currentUser()};
    w.status="执行中";w.actions.push({type:"开工",at:w.startEvidence.at,by:App.currentUser(),note:"位置校验"+(w.startEvidence.locationPassed?"通过":"异常已说明")+"，已留存开工照片"});
    App._emit();
    return {ok:true};
  },
  pause:function(id){
    var w=App.permit.byId(id);w.status="已暂停";w.actions.push({type:"暂停",at:now(),by:App.currentUser(),note:"作业暂停"});
    App._emit();
  },
  resume:function(id){
    var w=App.permit.byId(id);
    if(App.permit.blockIfExpired(w)){App.toast("作业票已超时，请先申请延期","error");return {ok:false};}
    w.status="待监护确认";w.actions.push({type:"恢复",at:now(),by:App.currentUser(),note:"恢复作业，需重新确认变化项"});
    App.checksNeedReconfirm=true;
    App.toast("已恢复，请重新确认现场变化项","warn");
    App._emit();
    return {ok:true};
  },
  requestChange:function(id,changes){
    var w=App.permit.byId(id);if(!w)return;
    w.changeRequest={changes:changes||[],at:now(),by:App.currentUser(),status:"待重新申请"};
    w.status="待重新申请";w.actions.push({type:"变更重新申请",at:now(),by:App.currentUser(),note:"人员/地点/时间/关键措施发生变化，必须重新申请"});
    App.log("特殊作业","[变更] "+w.code+" 触发重新申请");App._emit();
  },
  requestExtension:function(id,newEnd,reason,safetyReview){
    var w=App.permit.byId(id);if(!w||["执行中","已暂停","超时阻断"].indexOf(w.status)<0){App.toast("当前状态不能申请延期","error");return {ok:false};}if(!newEnd||!reason){App.toast("请填写延期时间和原因","error");return {ok:false};}safetyReview=safetyReview||{};var required=["personnel","guardian","location","environment","measures"],missing=required.filter(function(k){return safetyReview[k]!==true;});if(missing.length){App.toast("延期前必须逐项复核人员、监护、地点、环境和安全措施","error");return {ok:false,msg:"安全条件复核不完整"};}var oldEndAt=Date.parse(w.plannedEnd.replace(/-/g,"/")),newEndAt=Date.parse(newEnd.replace(/-/g,"/"));if(newEndAt<=oldEndAt||newEndAt<=Date.now()){App.toast("延期结束时间必须晚于原结束时间和当前时间","error");return {ok:false};}if(w.typeKey==="hotwork"&&w.workLevel==="一级"&&newEndAt-oldEndAt>8*60*60*1000){App.toast("一级动火每次延期最多延长 8 小时","error");return {ok:false,msg:"超过单次延期上限"};}w.extensionRequests=w.extensionRequests||[];var req={id:uid(),oldEnd:w.plannedEnd,newEnd:newEnd,reason:reason,safetyReview:{personnel:true,guardian:true,location:true,environment:true,measures:true,note:safetyReview.note||""},status:"待审批",createdAt:now(),by:App.currentUser()};w.extensionRequests.unshift(req);w.statusBeforeExtension=w.status;w.status="延期审批中";w.currentApprovalNode="原作业票审批人";w.actions.push({type:"申请延期",at:now(),by:App.currentUser(),note:"申请延长至 "+newEnd+"；"+reason+"。五项安全条件已复核，审批完成前禁止继续作业"});App.pushWeComTodo("permits","特殊作业延期待审批",w.code+" 申请延期至 "+newEnd,"work-permits.html?tab=approve&id="+encodeURIComponent(w.id));App.log("特殊作业","[延期申请] "+w.code+" → "+newEnd);App._emit();return {ok:true,request:req};
  },
  approveExtension:function(id,pass,note){
    var w=App.permit.byId(id),req=w&&w.extensionRequests&&w.extensionRequests[0];if(!w||w.status!=="延期审批中"||!req){App.toast("当前没有待审批的延期申请","warn");return {ok:false};}req.status=pass?"已批准":"已驳回";req.approvedAt=now();req.approvedBy=App.currentUser();req.note=note||"";if(pass){w.plannedEnd=req.newEnd;w.status="已暂停";w.reconfirmRequired=true;(w.checks||[]).forEach(function(c){c.result="未确认";delete c.checkedBy;delete c.checkedAt;});w.actions.push({type:"延期批准",at:now(),by:App.currentUser(),note:"有效期延长至 "+req.newEnd+(note?"；"+note:"")+"；恢复前须重新监护确认"});App.toast("延期已批准，请重新确认现场条件后恢复","success");}else{w.status="超时阻断";w.actions.push({type:"延期驳回",at:now(),by:App.currentUser(),note:(note||"延期未通过")+"；作业保持超时阻断"});App.toast("延期已驳回，作业保持超时阻断","warn");}w.currentApprovalNode=null;w.statusBeforeExtension=null;App._emit();return {ok:true,status:w.status};
  },
  complete:function(id){
    var w=App.permit.byId(id);if(App.permit.blockIfExpired(w)){App.toast("作业票已超时，延期批准前不能完工","error");return {ok:false};}if(!w||w.status!=="执行中"){App.toast("当前状态不能提交完工","error");return {ok:false};}w.status="待验收";w.actions.push({type:"完工",at:now(),by:App.currentUser(),note:"作业完成，申请验收"});
    App._emit();
    return {ok:true};
  },
  acceptAndArchive:function(id){
    var w=App.permit.byId(id);w.status="已归档";w.archivedAt=now();
    w.actions.push({type:"验收",at:now(),by:App.currentUser(),note:"验收合格"});
    w.actions.push({type:"归档",at:now(),by:App.currentUser(),note:"作业票归档"});
    App.log("特殊作业","[归档] "+w.code+" 验收通过并归档");
    App.toast("作业票已验收归档");
    App._emit();
  }
};

/* ---------- 移动现场端动作 ---------- */
App.mobile={
  draft:function(kind,payload,clientKey){
    clientKey=clientKey||uid();var d=App.mobileDrafts.filter(function(x){return x.clientKey===clientKey;})[0];
    if(d)return d;
    d={id:uid(),kind:kind,payload:payload||{},clientKey:clientKey,status:"待重试",attempts:0,updatedAt:now()};App.mobileDrafts.push(d);
    App.log("移动现场端","[本地草稿] "+kind+" 已保存，等待重试");App._emit();return d;
  },
  retryDraft:function(clientKey,online){
    var d=App.mobileDrafts.filter(function(x){return x.clientKey===clientKey;})[0];if(!d)return null;
    d.attempts=(d.attempts||0)+1;if(!online){d.status="待重试";App.toast("当前为弱网，已保留本地草稿","warn");App._emit();return d;}
    d.status="已提交";d.submittedAt=now();App.log("移动现场端","[重试] "+d.kind+" 提交成功（幂等键 "+clientKey+"）");App._emit();return d;
  },
  submitHazard:function(payload,clientKey){
    clientKey=clientKey||uid();var old=App.hazards.filter(function(h){return h.clientKey===clientKey;})[0];if(old)return old;
    var h={id:uid(),code:"HZ-"+dstr()+"-"+seq("hz"),title:payload.title||"移动现场隐患",org:payload.org||((App.currentOrg||"").split(" / ").pop()||"造型作业区"),location:payload.location||"现场待定位",source:"MOBILE_REPORT",sourceLabel:"随手拍",sourceRef:null,severity:null,riskCode:payload.riskCode||null,rewardEligible:true,rewardStatus:"待闭环后评定",responsibleDept:null,responsibleUser:null,deadline:null,status:"待受理",reporter:App.currentUser(),createdAt:now(),clientKey:clientKey,description:payload.description||"移动端现场上报",sourceEvidence:{photo:!!payload.discoveryPhoto,note:payload.description||"",label:"随手拍现场证据"},rectification:null,actions:[{type:"登记",at:now(),by:App.currentUser(),note:"移动随手拍提交"}]};
    App.hazards.unshift(h);App.log("移动现场端","[随手拍] "+h.code+" 已提交");App._emit();return h;
  },
  checkIn:function(binding,clientKey){
    if(!binding||["inspection","permit"].indexOf(binding.kind)<0||!binding.id){App.toast("业务签到必须绑定巡检任务或作业票","error");return {ok:false};}
    clientKey=clientKey||binding.kind+":"+binding.id;var old=App.checkIns.filter(function(x){return x.clientKey===clientKey;})[0];if(old){App.toast("已签到，不重复生成业务记录","warn");return {ok:true,duplicate:true,record:old};}
    var r={id:uid(),clientKey:clientKey,kind:binding.kind,businessId:binding.id,user:App.currentUser(),location:binding.location||"造型作业区现场",at:now()};App.checkIns.push(r);App.log("移动现场端","[业务签到] "+binding.id+" 已签到");App._emit();return {ok:true,record:r};
  },
  markRead:function(id){var n=App.notifications.filter(function(x){return x.id===id;})[0];if(n){n.read=true;App.log("消息中心","[已读] "+n.title);App._emit();}return n;},
  unread:function(){return App.notifications.filter(function(n){return !n.read;}).length;}
};

/* ---------- PC 工作台与企业微信共用业务待办 ---------- */
App.workbenchTodos=function(role){
  role=role||App.currentRole;var user=App.currentUser(),rows=[];
  function add(module,code,title,status,nextAction,target,deadline){rows.push({id:module+":"+code,module:module,businessCode:code,title:title,status:status,nextAction:nextAction,target:target,deadline:deadline||null});}
  (App.risks||[]).forEach(function(r){var d=r.draftVersion;if(!d)return;if(d.status==="已退回"&&role==="team_leader")add("risks",r.code,d.riskName||r.name,d.status,"修改后重新提交","risks.html?tab=ledger&risk="+encodeURIComponent(r.id));if(d.status==="待作业区负责人审核"&&role==="section_manager")add("risks",r.code,d.riskName||r.name,d.status,"审核风险点","risks.html?tab=ledger&risk="+encodeURIComponent(r.id));if(d.status==="待二级单位安全管理审核"&&role==="company_safety")add("risks",r.code,d.riskName||r.name,d.status,"审核风险点","risks.html?tab=ledger&risk="+encodeURIComponent(r.id));if(d.status==="待二级单位领导审批"&&role==="unit_leader")add("risks",r.code,d.riskName||r.name,d.status,"批准风险点","risks.html?tab=ledger&risk="+encodeURIComponent(r.id));});
  (App.hazards||[]).forEach(function(h){
    if(h.status==="待受理"&&App.hazard.acceptRole(h)===role)add("hazards",h.code,h.title,h.status,"受理并分派","hazards.html?tab=ledger&st=待受理",h.deadline);
    if(["待整改","整改中"].indexOf(h.status)>-1&&(h.responsibleUser===user||role==="team_leader"))add("hazards",h.code,h.title,h.status,"提交整改反馈","hazards.html?tab=mine-rect",h.deadline);
    if(h.status==="待复查"&&role==="section_manager")add("hazards",h.code,h.title,h.status,"复查验收","hazards.html?tab=mine-review",h.deadline);
    if(h.source==="HSE_SUPERVISION"&&h.status==="驳回起草人"&&role==="group_safety")add("hazards",h.code,h.title,h.status,"维护后按原 OA 重提","hazards.html?tab=ledger&st=驳回起草人",h.deadline);
  });
  (App.tasks||[]).forEach(function(t){
    if(t.status==="待领取"&&["team_member","team_leader"].indexOf(role)>-1)add("inspection",t.code,t.planName,t.status,"领取任务","inspection.html?tab=tasks");
    if(["已领取","执行中"].indexOf(t.status)>-1&&t.claimant===user)add("inspection",t.code,t.planName,t.status,"现场执行","inspection.html?tab=tasks");
  });
  (App.workPermits||[]).forEach(function(w){
    if(w.status==="延期审批中"&&["section_manager","company_safety","unit_leader"].indexOf(role)>-1)add("permits",w.code,w.type+"延期申请",w.status,"处理延期","work-permits.html?tab=approve&id="+encodeURIComponent(w.id),w.plannedEnd);
    if(["待监护确认","已暂停"].indexOf(w.status)>-1&&(role==="team_leader"||role==="team_member"))add("permits",w.code,w.type+" · "+w.location,w.status,"现场确认","work-permits.html?tab=execute&id="+encodeURIComponent(w.id),w.plannedEnd);
  });
  return rows;
};

/* ---------- 驾驶舱指标（按角色过滤） ---------- */
App.dashboard=function(role){
  role=role||App.currentRole;
  var isGroup=role==="group_safety", isTeam=role==="team_leader";
  var leaf=(App.currentOrg||"").split(" / ").pop();
  function inScope(org){
    if(leaf==="智能加工配送中心")return org==="智能加工配送中心";
    if(["造型作业区","自动线组","制模组"].indexOf(leaf)>-1)return org==="造型作业区";
    if(leaf==="铸锻件分公司")return org!=="智能加工配送中心";
    return true;
  }
  var scopedRisks=App.risks.filter(function(r){return inScope(r.org);});
  var riskCount=scopedRisks.length;
  var majorCount=scopedRisks.filter(function(r){return r.level==="major"||r.level==="big";}).length;
  var hazards=App.hazards.filter(function(h){return inScope(h.org);});
  if(isTeam)hazards=hazards.filter(function(h){return h.status==="整改中"||h.status==="待整改";});
  var pendingHazards=hazards.filter(function(h){return ["待受理","待整改","整改中","待复查"].indexOf(h.status)>-1;}).length;
  var finalHazardStatuses=["已闭环","不受理关闭","已拒绝","已撤销","已终止","已作废"];
  var overdueHazards=hazards.filter(function(h){var due=h.deadline&&Date.parse(String(h.deadline).replace(/-/g,"/"));return due&&due<Date.now()&&finalHazardStatuses.indexOf(h.status)<0&&h.status!=="待受理";}).length;
  var activePermits=App.workPermits.filter(function(w){return inScope(w.org)&&["审批中","待监护确认","待开工","执行中","已暂停","资格校验失败","超时阻断","延期审批中"].indexOf(w.status)>-1;}).length;
  var supOpen=App.supervisions.filter(function(s){return s.status!=="已关闭";}).length;
  App.certificate.refresh();var expiringCerts=App.certs.filter(function(c){return c.status==="临期";}).length;
  var eligibleTeams=(App.teams||[]).filter(function(t){return t.shouldParticipate;});
  var validReports=App.hazards.filter(function(h){return h.source==="MOBILE_REPORT"&&h.status!=="已作废";});
  var submittedTeams=eligibleTeams.filter(function(team){return validReports.some(function(h){return (team.members||[]).indexOf(h.reporter)>-1;});}).length;
  var participation=eligibleTeams.length?Math.round(submittedTeams/eligibleTeams.length*100):0;
  var waitingInspections=(App.tasks||[]).filter(function(t){return (!t.org||inScope(t.org))&&t.status==="待领取";}).length;
  var activeDuties=(App.responsibilityItems||[]).filter(function(d){return d.status==="启用";}).length;
  return {riskCount:riskCount,majorCount:majorCount,pendingHazards:pendingHazards,overdueHazards:overdueHazards,activePermits:activePermits,supOpen:supOpen,expiringCerts:expiringCerts,waitingInspections:waitingInspections,activeDuties:activeDuties,teamParticipation:Math.min(100,participation)};
};

window.App=App;
})();
