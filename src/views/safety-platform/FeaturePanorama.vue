<template>
  <div class="panorama-page">
    <div class="page-header">
      <h2>功能全景</h2>
      <p class="page-subtitle">安全管理平台覆盖6大一级模块、30+二级功能，支撑公司-现场两级安全管理体系</p>
    </div>

    <!-- 模块全景概览 -->
    <section class="ov-section">
      <div class="module-overview">
        <div class="mo-item" v-for="m in modules" :key="m.key" :class="'mo-' + m.color">
          <div class="mo-header">
            <span class="mo-icon">{{ m.icon }}</span>
            <span class="mo-name">{{ m.name }}</span>
            <span class="mo-platforms">
              <span v-for="p in m.platform" :key="p" class="mo-plat" :class="'plat-' + p.toLowerCase()">{{ p }}</span>
            </span>
          </div>
          <div class="mo-functions">
            <div class="mof-item" v-for="c in m.children" :key="c">
              {{ c }}
            </div>
          </div>
        </div>
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
          key: 'risk-management', name: '风险管理', icon: '🎯', color: 'red', platform: ['PC', 'APP'],
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
          key: 'hazard', name: '隐患治理', icon: '⚠️', color: 'red', platform: ['PC', 'APP'],
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
          key: 'work-permit', name: '特殊作业管控', icon: '🔧', color: 'purple', platform: ['PC', 'APP'],
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
          key: 'training', name: '培训中心集成', icon: '📖', color: 'teal', platform: ['PC', 'APP'],
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
          key: 'supervision', name: '安全督办', icon: '📣', color: 'orange', platform: ['PC'],
desc: '公司对重大隐患的督办与进度追踪，独立流转不替代原隐患流程',
children: ['督办发起', '督办接收', '进度反馈', '独立闭环'],
features: [
            { icon: '📢', label: '督办发起', desc: '公司安环对重大隐患发起专项督办，填写督办意见并指定责任公司' },
  { icon: '📥', label: '督办接收', desc: '所属公司确认接收督办，启动处置流程并定期反馈进度' },
  { icon: '📝', label: '进度反馈', desc: '支持多次进度反馈，公司实时掌握处置动态' },
  { icon: '🔒', label: '独立闭环原则', desc: '公司关闭督办不等于替代原隐患闭环，两单状态独立但可互查' }
          ]
        },
        {
          key: 'dashboard', name: '驾驶舱', icon: '📊', color: 'blue', platform: ['PC'],
desc: '公司级安全态势一屏总览，风险动态实时刷新',
children: ['风险四色图', '公司对比面板', '指标统计卡片', '作业/督办动态'],
features: [
            { icon: '🗺️', label: '厂区风险四色图', desc: '基于GIS/平面图的厂区风险等级可视化，红橙黄蓝四色标注，点击区域查看详情' },
  { icon: '📈', label: '多维度统计', desc: '隐患总数、待整改数、逾限数、本月闭环数、活跃作业票数、督办数，六项核心指标' },
  { icon: '🏭', label: '公司横向对比', desc: '各下属公司安全指标并列展示，支持风险等级排序与穿透下钻' },
  { icon: '🔔', label: '动态信息面板', desc: '实时滚动展示活跃作业票与安全督办事项，点击跳转详情' }
          ]
        }
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
.mo-platforms { display: inline-flex; gap: 4px; }
.mo-plat {
  font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; line-height: 1.6;
  &.plat-pc { color: #fff; background: $primary; }
  &.plat-app { color: #fff; background: $success; }
}
.mo-functions { display: flex; flex-wrap: wrap; gap: 4px; }
.mof-item { font-size: 11px; padding: 2px 8px; background: $gray-50; border-radius: 4px; color: $text-secondary; }

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
