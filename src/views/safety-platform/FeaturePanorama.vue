<template>
  <div class="panorama-page">
    <div class="page-header">
      <h2>功能全景</h2>
      <p class="page-subtitle">安全管理平台覆盖8大一级模块、30+二级功能，支撑集团-公司-现场三级安全管理体系</p>
    </div>

    <!-- 模块全景概览 -->
    <section class="ov-section">
      <h3 class="section-title">模块全景地图</h3>
      <div class="module-overview">
        <div class="mo-item" v-for="m in modules" :key="m.key" :class="'mo-' + m.color">
          <div class="mo-header">
            <span class="mo-icon">{{ m.icon }}</span>
            <span class="mo-name">{{ m.name }}</span>
            <span class="mo-badge">{{ m.children.length }}项功能</span>
          </div>
          <div class="mo-functions">
            <div class="mof-item" v-for="c in m.children" :key="c">
              {{ c }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能覆盖矩阵 -->
    <section class="ov-section">
      <h3 class="section-title">功能覆盖矩阵</h3>
      <div class="section-card" style="padding:0; overflow:auto">
        <table class="data-table coverage-table">
          <thead>
            <tr>
              <th style="min-width:140px">功能模块</th>
              <th style="text-align:center;min-width:100px">集团领导</th>
              <th style="text-align:center;min-width:100px">集团安环</th>
              <th style="text-align:center;min-width:100px">公司领导</th>
              <th style="text-align:center;min-width:100px">公司安环</th>
              <th style="text-align:center;min-width:100px">车间负责人</th>
              <th style="text-align:center;min-width:100px">现场人员</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in coverageRows" :key="r.func">
              <td><strong>{{ r.func }}</strong></td>
              <td v-for="role in coverageRoles" :key="role" style="text-align:center">
                <span v-if="r.cells[role] === 'full'" class="cov-dot full">●</span>
                <span v-else-if="r.cells[role] === 'partial'" class="cov-dot partial">◐</span>
                <span v-else class="cov-dot none">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="cov-legend">
        <span><span class="cov-dot full">●</span> 核心使用</span>
        <span><span class="cov-dot partial">◐</span> 部分使用/查看</span>
        <span><span class="cov-dot none">-</span> 不涉及</span>
      </div>
    </section>

    <!-- 模块详细说明 -->
    <section class="ov-section">
      <h3 class="section-title">模块详细说明</h3>
      <div class="module-detail-list">
        <div class="md-card" v-for="m in modules" :key="m.key">
          <div class="mdc-header">
            <span class="mdc-icon">{{ m.icon }}</span>
            <div class="mdc-info">
              <div class="mdc-name">{{ m.name }}</div>
              <div class="mdc-desc">{{ m.desc }}</div>
            </div>
          </div>
          <div class="mdc-body">
            <div class="mdc-feature" v-for="f in m.features" :key="f.label">
              <span class="mdcf-icon">{{ f.icon }}</span>
              <div class="mdcf-content">
                <div class="mdcf-label">{{ f.label }}</div>
                <div class="mdcf-desc">{{ f.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'FeaturePanorama',
  data() {
    return {
      modules: [
        {
          key: 'dashboard', name: '集团驾驶舱', icon: '📊', color: 'blue',
desc: '集团/公司级安全态势一屏总览，风险动态实时刷新',
children: ['风险四色图', '公司对比面板', '指标统计卡片', '作业/督办动态'],
features: [
            { icon: '🗺️', label: '厂区风险四色图', desc: '基于GIS/平面图的厂区风险等级可视化，红橙黄蓝四色标注，点击区域查看详情' },
  { icon: '📈', label: '多维度统计', desc: '隐患总数、待整改数、逾限数、本月闭环数、活跃作业票数、督办数，六项核心指标' },
  { icon: '🏭', label: '公司横向对比', desc: '各下属公司安全指标并列展示，支持风险等级排序与穿透下钻' },
  { icon: '🔔', label: '动态信息面板', desc: '实时滚动展示活跃作业票与集团督办事项，点击跳转详情' }
          ]
        },
        {
          key: 'risk-management', name: '风险管理', icon: '🎯', color: 'red',
desc: 'LEC风险评价、风险辨识、四色图、风险告知卡，双重预防机制核心',
children: ['风险辨识录入', '风险台账', 'LEC评价审批', '四色图', '风险告知卡', '风险矩阵'],
features: [
            { icon: '🔍', label: '风险辨识', desc: '按区域/类别/责任人逐项辨识风险单元与危险源，支持增删改' },
  { icon: '📊', label: 'LEC评价与审批', desc: 'L/E/C三参数打分自动计算D值并分级，四步审批链完整流转' },
  { icon: '🗺️', label: '风险四色图', desc: '基于高德真实地图的厂区风险可视化，红橙黄蓝四色标注风险等级' },
  { icon: '📋', label: '风险告知卡', desc: '法定格式告知牌生成，含危险因素/管控措施/责任人/应急电话' }
          ]
        },
        {
          key: 'hazard', name: '隐患治理', icon: '⚠️', color: 'red',
desc: '全生命周期隐患管理：发现→受理→整改→复查→闭环',
children: ['隐患台账', '隐患详情/时间线', '整改任务管理', '复查闭环', '数据恢复'],
features: [
            { icon: '📋', label: '隐患台账', desc: '所属公司全量隐患列表，按状态/严重程度/时间筛选，逾限标红警示' },
  { icon: '🔄', label: '全生命周期', desc: '待受理→待整改→整改中→待复查→已闭环/已退回，六状态流转' },
  { icon: '⏱️', label: '操作时间线', desc: '每条隐患完整操作记录时间线，追溯每个环节的责任人与时间' },
  { icon: '🔍', label: '复查闭环', desc: '公司安环人员对已整改隐患进行复查确认，通过后归档闭环' }
          ]
        },
        {
          key: 'supervision', name: '集团督办', icon: '📣', color: 'orange',
desc: '集团对重大隐患的督办与进度追踪，独立流转不替代原隐患流程',
children: ['督办发起', '督办接收', '进度反馈', '独立闭环'],
features: [
            { icon: '📢', label: '督办发起', desc: '集团安环对重大隐患发起专项督办，填写督办意见并指定责任公司' },
  { icon: '📥', label: '督办接收', desc: '所属公司确认接收督办，启动处置流程并定期反馈进度' },
  { icon: '📝', label: '进度反馈', desc: '支持多次进度反馈，集团实时掌握处置动态' },
  { icon: '🔒', label: '独立闭环原则', desc: '集团关闭督办不等于替代原隐患闭环，两单状态独立但可互查' }
          ]
        },
        {
          key: 'work-permit', name: '特殊作业管控', icon: '🔧', color: 'purple',
desc: '高处/吊装等特殊作业全流程审批与管控',
children: ['作业票申请', '资格校验', '安环审核', '领导审批', '监护确认', '完工验收', '归档'],
features: [
            { icon: '🚦', label: '资格准入闸门', desc: '提交作业申请时系统自动校验人员证件有效期，不满足条件直接阻断' },
  { icon: '🔍', label: '安环审核', desc: '公司安环人员核验作业方案、安全措施与风险控制' },
  { icon: '✍️', label: '领导审批', desc: '授权审批领导对高风险作业进行最终核准' },
  { icon: '🛡️', label: '监护确认', desc: '现场监护人通过APP逐项确认安全条件后允许开工' },
  { icon: '📋', label: '6步流程链', desc: '安环审核→领导审批→监护确认→作业执行→完工验收→归档' }
          ]
        },
        {
          key: 'training', name: '培训管理', icon: '📖', color: 'teal',
desc: '安全培训全流程管理：年度计划、培训记录、证书追踪、到期预警',
children: ['年度培训计划', '培训记录管理', '证书到期预警', '成绩追踪'],
features: [
            { icon: '📅', label: '年度培训计划', desc: '编制年度安全培训计划，跟踪各阶段完成进度' },
  { icon: '📝', label: '培训记录', desc: '按人员/计划/成绩多维度查询培训历史记录' },
  { icon: '🪪', label: '证书管理', desc: '特种作业证、安全资格证到期预警，剩余天数高亮+过期红底' },
  { icon: '📊', label: '完成率统计', desc: '各部门培训完成率对比，未完成人员自动提醒' }
          ]
        },
        {
          key: 'mobile', name: 'APP移动现场', icon: '📱', color: 'green',
desc: '一线现场人员移动工作台，实现现场→系统即时闭环',
children: ['巡检任务', '隐患随手拍', '监护确认', '作业票查看', '到岗签到', '风险地图'],
features: [
            { icon: '📋', label: '巡检任务执行', desc: '接收PC端分派的巡检任务，逐项打勾完成，异常一键跳转隐患上报' },
  { icon: '📸', label: '隐患随手拍', desc: '拍照取证+区域选择+严重程度+文字描述，一键上报隐患' },
  { icon: '🛡️', label: '监护人确认', desc: '开工前逐项核验安全条件，全部通过后允许开工，APP端记录确认时间' },
  { icon: '🟢', label: '到岗签到', desc: 'GPS定位+人脸识别签到，关联排班系统与资质校验' },
          ]
        },
        {
          key: 'foundation', name: '数字底座', icon: '⚙️', color: 'gray',
desc: '统一组织架构、权限体系、数据标准与接口规范',
children: ['组织架构管理', '角色权限体系', '数据字典', 'API网关', '日志审计'],
features: [
            { icon: '🏢', label: '多级组织架构', desc: '集团→公司→分公司/部门，支持多层级树形组织管理与数据隔离' },
  { icon: '🔑', label: '角色权限体系', desc: '6大角色按组织层级赋予差异化权限，支持数据范围与功能范围双重控制' },
  { icon: '📋', label: '统一数据标准', desc: '隐患分类、风险分级、作业类型等基础数据字典标准化管理' },
  { icon: '📡', label: '接口规范', desc: '标准RESTful API接口，支持与ERP/HR/OA等系统数据互通' }
          ]
        }
      ],
      coverageRoles: ['group_leader', 'group_safety', 'company_leader', 'company_safety', 'dept_head', 'field_worker'],
      coverageRows: [
        { func: '驾驶舱看板', cells: { group_leader:'full', group_safety:'full', company_leader:'partial', company_safety:'partial', dept_head:'none', field_worker:'none' } },
        { func: '隐患发现/上报', cells: { group_leader:'none', group_safety:'none', company_leader:'none', company_safety:'partial', dept_head:'full', field_worker:'full' } },
        { func: '隐患受理/分派', cells: { group_leader:'none', group_safety:'none', company_leader:'none', company_safety:'full', dept_head:'none', field_worker:'none' } },
        { func: '隐患整改', cells: { group_leader:'none', group_safety:'none', company_leader:'none', company_safety:'none', dept_head:'full', field_worker:'full' } },
        { func: '隐患复查闭环', cells: { group_leader:'none', group_safety:'none', company_leader:'none', company_safety:'full', dept_head:'none', field_worker:'none' } },
        { func: '集团督办', cells: { group_leader:'partial', group_safety:'full', company_leader:'none', company_safety:'partial', dept_head:'none', field_worker:'none' } },
        { func: '作业票申请', cells: { group_leader:'none', group_safety:'none', company_leader:'none', company_safety:'none', dept_head:'full', field_worker:'partial' } },
        { func: '安环审核', cells: { group_leader:'none', group_safety:'none', company_leader:'none', company_safety:'full', dept_head:'none', field_worker:'none' } },
        { func: '领导审批', cells: { group_leader:'none', group_safety:'none', company_leader:'full', company_safety:'none', dept_head:'none', field_worker:'none' } },
        { func: '监护确认', cells: { group_leader:'none', group_safety:'none', company_leader:'none', company_safety:'none', dept_head:'partial', field_worker:'full' } },
        { func: '完工验收', cells: { group_leader:'none', group_safety:'none', company_leader:'none', company_safety:'full', dept_head:'none', field_worker:'none' } },
        { func: '人员资质管理', cells: { group_leader:'partial', group_safety:'full', company_leader:'partial', company_safety:'full', dept_head:'partial', field_worker:'none' } },
        { func: '培训管理', cells: { group_leader:'partial', group_safety:'full', company_leader:'partial', company_safety:'full', dept_head:'partial', field_worker:'partial' } },
        { func: '风险地图查看', cells: { group_leader:'full', group_safety:'full', company_leader:'full', company_safety:'full', dept_head:'partial', field_worker:'partial' } },
        { func: '风险辨识与LEC评价', cells: { group_leader:'none', group_safety:'partial', company_leader:'partial', company_safety:'full', dept_head:'partial', field_worker:'none' } },
        { func: '风险告知卡管理', cells: { group_leader:'partial', group_safety:'full', company_leader:'partial', company_safety:'full', dept_head:'partial', field_worker:'partial' } }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.panorama-page { max-width: 1100px; }
.page-header {
  margin-bottom: $space-xl;
  h2 { font-size: $font-2xl; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; }
}

.ov-section { margin-bottom: $space-2xl; }
.section-title { font-size: $font-md; font-weight: 600; color: $text-primary; margin-bottom: $space-lg; padding-left: 12px; border-left: 3px solid $primary; }
.section-card { background: #fff; border-radius: $radius-lg; padding: $space-lg $space-xl; border: 1px solid $border; }

// Module Overview Grid
.module-overview { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: $space-base; }
.mo-item {
  background: #fff; border-radius: $radius-lg; border: 1px solid $border; padding: $space-base; overflow: hidden;
  &.mo-blue { border-left: 3px solid $info; }
  &.mo-red { border-left: 3px solid $danger; }
  &.mo-orange { border-left: 3px solid $warning; }
  &.mo-purple { border-left: 3px solid #9333ea; }
  &.mo-teal { border-left: 3px solid #0d9488; }
  &.mo-green { border-left: 3px solid $success; }
  &.mo-gray { border-left: 3px solid #6b7280; }
}
.mo-header { display: flex; align-items: center; gap: $space-sm; margin-bottom: $space-sm; }
.mo-icon { font-size: 22px; }
.mo-name { font-size: $font-base; font-weight: 600; color: $text-primary; flex: 1; }
.mo-badge { font-size: 10px; color: $text-hint; background: $gray-100; padding: 2px 8px; border-radius: 10px; }
.mo-functions { display: flex; flex-wrap: wrap; gap: 4px; }
.mof-item { font-size: 11px; padding: 2px 8px; background: $gray-50; border-radius: 4px; color: $text-secondary; }

// Coverage Table
.data-table { width: 100%; border-collapse: collapse; font-size: $font-sm;
  th { background: $gray-50; padding: 10px $space-md; text-align: left; font-weight: 600; color: $text-primary; border-bottom: 2px solid $border; white-space: nowrap; }
  td { padding: 8px $space-md; border-bottom: 1px solid #f0f0f0; color: $text-secondary; }
  tr:hover td { background: $gray-50; }
}
.cov-dot {
  font-size: 16px;
  &.full { color: $primary; }
  &.partial { color: $warning; }
  &.none { color: #d1d5db; }
}
.cov-legend { display: flex; gap: $space-lg; margin-top: $space-md; font-size: $font-xs; color: $text-hint; }

// Module Detail
.module-detail-list { display: flex; flex-direction: column; gap: $space-lg; }
.md-card { background: #fff; border-radius: $radius-lg; border: 1px solid $border; overflow: hidden; }
.mdc-header {
  display: flex; align-items: center; gap: $space-md; padding: $space-base $space-xl;
  border-bottom: 1px solid $border; background: $gray-50;
  .mdc-icon { font-size: 24px; }
  .mdc-name { font-size: $font-base; font-weight: 600; color: $text-primary; }
  .mdc-desc { font-size: $font-xs; color: $text-hint; margin-top: 2px; }
}
.mdc-body { padding: $space-base $space-xl; display: grid; grid-template-columns: 1fr 1fr; gap: $space-base; }
.mdc-feature { display: flex; gap: $space-sm; padding: $space-sm 0; }
.mdcf-icon { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
.mdcf-label { font-size: $font-sm; font-weight: 500; color: $text-primary; }
.mdcf-desc { font-size: $font-xs; color: $text-hint; margin-top: 2px; line-height: 1.4; }
</style>
