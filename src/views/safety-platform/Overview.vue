<template>
  <div class="overview-page">
    <div class="page-header">
      <h2>安全管理平台 — 产品总览</h2>
      <p class="page-subtitle">集团穿透 · 公司自治 · 现场闭环</p>
    </div>

    <section class="ov-section">
      <h3 class="section-title">产品定位</h3>
      <div class="overview-text">
        <p>安全管理平台是一套<strong>集团级安全生产管控体系</strong>，面向<strong>太重集团及下属各公司</strong>，实现从集团宏观态势洞察到现场隐患闭环的全链路数字化安全管理。</p>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">核心价值主张</h3>
      <div class="value-grid">
        <div class="value-card" v-for="v in values" :key="v.title">
          <div class="value-icon" :style="{ color: v.color }">{{ v.icon }}</div>
          <h4>{{ v.title }}</h4>
          <p>{{ v.desc }}</p>
        </div>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">组织覆盖范围</h3>
      <div class="section-card">
        <div class="org-tree">
          <div class="org-node root">
            <span class="org-name">太重集团</span>
            <span class="org-role">查看全集团 / 发起集团督办</span>
          </div>
          <div class="org-children">
            <div class="org-branch">
              <div class="org-node company">
                <span class="org-name">太原重工</span>
                <span class="org-role">查看本公司及下属公司 / 办理本公司事项</span>
              </div>
              <div class="org-sub">
                <div class="org-node branch">
                  <span class="org-name">太原重工铸锻件分公司</span>
                  <span class="org-role">（本次 Demo 重点演示）</span>
                </div>
              </div>
            </div>
            <div class="org-branch">
              <div class="org-node company">
                <span class="org-name">山西太重工程机械有限公司</span>
                <span class="org-role">办理本公司安全事项</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">核心原则</h3>
      <div class="principles-grid">
        <div class="principle-card" v-for="p in principles" :key="p.title">
          <div class="principle-num">{{ p.num }}</div>
          <div class="principle-body">
            <h4>{{ p.title }}</h4>
            <p>{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">Demo 覆盖范围</h3>
      <div class="section-card">
        <table class="module-table">
          <thead><tr><th>一级模块</th><th>Demo 深度</th><th>表达方式</th></tr></thead>
          <tbody>
            <tr><td>目标职责</td><td>L1/L2</td><td>组织职责、履职任务、人员资格准入</td></tr>
            <tr><td>制度化管理</td><td>L2</td><td>专业资料工作台与适用识别入口</td></tr>
            <tr><td>教育培训</td><td>L2</td><td>年度培训计划、培训记录、证书到期预警、完成率统计</td></tr>
            <tr><td>现场管理</td><td>L1/L2</td><td>高处/吊装作业真实闭环</td></tr>
            <tr><td>双控体系</td><td>L2</td><td>风险辨识/台账/LEC评价/四色图/告知卡 + BPM审批对接/状态同步/超时预警</td></tr>
            <tr><td>持续改进</td><td>L2</td><td>班组标准化、统计报表工作台</td></tr>
            <tr><td>系统管理</td><td>L1/L2/L3</td><td>组织配置、流程参数、功能全景</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Overview',
  data() {
    return {
      values: [
        { icon: '🔍', title: '集团穿透', desc: '集团领导可查看各公司安全态势，驾驶舱下钻至区域、风险点和隐患详情，但不代替下级办理业务', color: '#1a5fdc' },
        { icon: '🏢', title: '公司自治', desc: '各所属公司在自身组织范围内独立完成隐患发现/整改/复查、作业审批/归档等全部日常安全业务', color: '#0ea85e' },
        { icon: '📱', title: '现场闭环', desc: '现场人员通过移动端完成巡检上报、整改反馈、作业监护确认，数据实时回写 PC 端驾驶舱与工作台', color: '#f59e0b' }
      ],
      principles: [
        { num: '01', title: '能看见不等于能办理', desc: '数据权限按集团—二级—三级穿透可见，但业务流程始终由事项所属公司及其内部组织完成。集团仅对重大/逾期事项发起独立督办。' },
        { num: '02', title: '督办不等于替代', desc: '集团督办是关联原隐患的独立单据。集团关闭督办不等于代替所属公司关闭原隐患，两单状态独立但可互查。' },
        { num: '03', title: '动作必有回响', desc: '所有页面从同一状态源读取数据。任一操作会同步改变至少一个业务对象的状态、待办、时间线或驾驶舱指标。' },
        { num: '04', title: '资格即门禁', desc: '培训、证照、履职记录不是独立展示页，而是特殊作业申请的前置校验条件。资格不满足则阻断提交并指明缺失项。' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.overview-page { max-width: 900px; }
.page-header {
  margin-bottom: $space-2xl;
  h2 { font-size: $font-2xl; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; }
}

.ov-section { margin-bottom: $space-2xl; }
.section-title {
  font-size: $font-md; font-weight: 700; color: $text-primary;
  margin-bottom: $space-md; padding-left: 12px; border-left: 4px solid $primary;
}
.section-card {
  background: #fff; border-radius: 16px; padding: $space-lg $space-xl;
  border: 1px solid rgba(15,23,42,.06); box-shadow: 0 2px 12px rgba(15,23,42,.04);
}

.overview-text {
  background: #f8fafc; border-radius: 12px; padding: $space-lg;
  border-left: 4px solid $primary; line-height: 1.9;
  p { font-size: $font-sm; color: $text-secondary; }
  strong { color: $primary; font-weight: 700; }
}

.value-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-base; }
.value-card {
  background: #fff; border-radius: 16px; padding: $space-lg;
  border: 1px solid rgba(15,23,42,.06); text-align: center;
  box-shadow: 0 2px 12px rgba(15,23,42,.04); transition: transform .2s, box-shadow .2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(15,23,42,.1); }
  .value-icon { font-size: 32px; margin-bottom: $space-sm; }
  h4 { font-size: $font-base; font-weight: 700; color: $text-primary; margin-bottom: $space-xs; }
  p { font-size: $font-xs; color: $text-secondary; line-height: 1.6; }
}

.org-tree { display: flex; flex-direction: column; align-items: center; gap: $space-md; }
.org-node {
  padding: $space-sm $space-lg; border-radius: 12px; text-align: center;
  &.root { background: $primary-bg; border: 2px solid #bfdbfe; }
  &.company { background: #f0fdf4; border: 2px solid #bbf7d0; }
  &.branch { background: #fffbf0; border: 2px solid #fde68a; }
  .org-name { font-size: $font-base; font-weight: 700; color: $text-primary; display: block; }
  .org-role { font-size: $font-xs; color: $text-hint; margin-top: 2px; }
}
.org-children { display: flex; gap: $space-2xl; }
.org-branch { display: flex; flex-direction: column; align-items: center; gap: $space-sm; }
.org-sub { padding-left: $space-2xl; padding-top: $space-sm; border-top: 1px dashed $border; position: relative; }

.principles-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: $space-base; }
.principle-card {
  background: #fff; border-radius: 16px; padding: $space-lg;
  border: 1px solid rgba(15,23,42,.06); display: flex; gap: $space-base;
  box-shadow: 0 2px 12px rgba(15,23,42,.04); transition: transform .2s;
  &:hover { transform: translateY(-2px); }
  .principle-num {
    width: 36px; height: 36px; border-radius: 10px; background: $primary-light;
    color: $primary; font-weight: 700; font-size: $font-sm;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  h4 { font-size: $font-sm; font-weight: 700; color: $text-primary; margin-bottom: 4px; }
  p { font-size: $font-xs; color: $text-secondary; line-height: 1.5; }
}

.module-table {
  width: 100%; border-collapse: collapse; font-size: $font-sm;
  th { background: $gray-50; padding: 10px $space-md; text-align: left; font-weight: 600; color: $text-primary; border-bottom: 2px solid $border; }
  td { padding: 10px $space-md; border-bottom: 1px solid #f0f0f0; color: $text-secondary; }
  tr:hover td { background: $gray-50; }
}
</style>
