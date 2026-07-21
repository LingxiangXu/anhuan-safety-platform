<template>
  <div class="plan-page">
    <div class="page-header">
      <h2>建设规划</h2>
      <p class="page-subtitle">分两期交付：一期重工2个试点单位上线，二期重工深化并面向全集团推广使用</p>
    </div>
    <!-- 一期 / 二期 卡片 -->
    <section class="ov-section">
      <h3 class="section-title">建设分期</h3>
      <div class="phase-cards">
        <div class="phase-card" v-for="(p, i) in phases" :key="i" :class="{ future: p.future }">
          <div class="pc-head">
            <span class="pc-badge" :class="p.future ? 'p2' : 'p1'">{{ p.tag }}</span>
            <h4 class="pc-title">{{ p.title }}</h4>
          </div>
          <p class="pc-goal">{{ p.goal }}</p>
          <div class="pc-timeline" v-if="p.timeline && p.timeline.length">
            <div class="pc-tl-item" v-for="(t, ti) in p.timeline" :key="ti">
              <span class="pc-tl-dot" :class="p.future ? 'p2' : 'p1'"></span>
              <span class="pc-tl-text">{{ t }}</span>
            </div>
          </div>
          <div class="pc-feat">
            <div class="pc-feat-label">{{ p.featLabel }}</div>
            <div class="pc-feat-tags">
              <span class="pc-tag" :class="p.future ? 'p2' : 'p1'" v-for="(f, fi) in p.features" :key="fi">{{ f }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 人力资源需求 -->
    <!-- ====== 项目报价 ====== -->
    <section class="ov-section">
      <h3 class="section-title">项目报价</h3>
      <p class="section-note">以下为项目整体报价，实际价格以商务合同为准。</p>
      <div class="pricing-block">
        <!-- 项目报价明细（11 行 × 6 列） -->
        <p class="section-note">按任务逐项测算：人天单价 1,500 元/人天；小计 = 人天/数量 × 单价，各小计之和见合计行。开发人天按项目总预算 72 万元、服务器资源 5 万元，等比放大至 447 人天（小计合计约 72.05 万元）。</p>
        <div class="section-card" style="padding:0; overflow:hidden">
          <table class="data-table pricing-table">
            <thead>
              <tr>
                <th style="width:55px">序号</th>
                <th style="width:120px">任务名称</th>
                <th style="width:110px">人天/数量</th>
                <th style="width:130px">人天单价（元）</th>
                <th style="width:130px">小计（元）</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="tc">1</td><td class="tc">风险管理</td><td class="tc">50</td><td class="tc">1,500</td><td class="tc">75,000</td></tr>
              <tr><td class="tc">2</td><td class="tc">巡检任务管理</td><td class="tc">41</td><td class="tc">1,500</td><td class="tc">61,500</td></tr>
              <tr><td class="tc">3</td><td class="tc">隐患与督办</td><td class="tc">47</td><td class="tc">1,500</td><td class="tc">70,500</td></tr>
              <tr><td class="tc">4</td><td class="tc">特殊作业管控</td><td class="tc">37</td><td class="tc">1,500</td><td class="tc">55,500</td></tr>
              <tr><td class="tc">5</td><td class="tc">驾驶舱</td><td class="tc">38</td><td class="tc">1,500</td><td class="tc">57,000</td></tr>
              <tr><td class="tc">6</td><td class="tc">系统集成</td><td class="tc">30</td><td class="tc">1,500</td><td class="tc">45,000</td></tr>
              <tr><td class="tc">7</td><td class="tc">移动端开发</td><td class="tc">136</td><td class="tc">1,500</td><td class="tc">204,000</td></tr>
              <tr><td class="tc">8</td><td class="tc">项目实施</td><td class="tc">68</td><td class="tc">1,500</td><td class="tc">102,000</td></tr>
              <tr><td class="tc">9</td><td class="tc">服务器资源</td><td class="tc">—</td><td class="tc">—</td><td class="tc">50,000</td></tr>
              <tr class="total-row"><td class="tc">—</td><td class="tc"><strong>合计</strong></td><td class="tc"><strong>447</strong></td><td class="tc">—</td><td class="tc"><strong>720,500</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: 'SafetyPlan',
  data() {
    return {
      phases: [
        {
          tag: '一期', future: false,
          title: '重工2个试点单位上线',
          goal: '以重工2个试点单位率先上线，跑通安全管理核心业务全流程，打通公司-现场数据联动，实现"从纸质到数字"的跨越。',
          timeline: ['2 个月主要功能上线', '4 个月收尾（优化、培训、验收）'],
          featLabel: '核心功能模块',
          features: ['风险管理', '巡检任务管理', '隐患与督办', '特殊作业管控', '驾驶舱', 'OA审批集成', '培训中心集成']
        },
        {
          tag: '二期', future: true,
          title: '重工深化 · 全集团推广',
          goal: '在一期试点经验与数据积累基础上深化重工应用能力，并面向全集团各单位推广使用，实现安全管理从"数字化"到"数智化"升级。',
          timeline: [],
          featLabel: '深化与推广方向',
          features: ['重工应用深化', '面向全集团推广', '多单位数据汇聚', '制度化管理', '应急管理', '设备设施安全', '双控统计与预测预警']
        }
      ],
    };
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
.plan-page { max-width: 960px; }
.page-header {
  margin-bottom: $space-xl;
  h2 { font-size: $font-2xl; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; }
}
.ov-section { margin-bottom: $space-2xl; }
.section-title { font-size: $font-md; font-weight: 600; color: $text-primary; margin-bottom: $space-lg; padding-left: 12px; border-left: 3px solid $primary; }
.section-card { background: #fff; border-radius: $radius-lg; padding: $space-lg $space-xl; border: 1px solid $border; }
// Phase Cards
.phase-cards { display: grid; grid-template-columns: 1fr 1fr; gap: $space-lg; align-items: stretch; }
.phase-card { background: #fff; border-radius: $radius-lg; border: 1px solid $border; padding: $space-xl; display: flex; flex-direction: column; position: relative; overflow: hidden; transition: box-shadow .2s, transform .2s;
  &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, $primary, $brand-600); }
  &.future::before { background: linear-gradient(90deg, $accent-green-500, #4ade80); }
  &:hover { box-shadow: 0 8px 24px rgba(15,23,42,.1); transform: translateY(-2px); }
}
.pc-head { display: flex; align-items: center; gap: $space-md; margin-bottom: $space-base; }
.pc-badge { flex-shrink: 0; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 20px; color: #fff;
  &.p1 { background: linear-gradient(135deg, $primary, $brand-700); }
  &.p2 { background: linear-gradient(135deg, $accent-green-500, #16a34a); }
}
.pc-title { font-size: $font-lg; font-weight: 700; color: $text-primary; margin: 0; }
.pc-goal { font-size: $font-sm; color: $text-secondary; line-height: 1.8; margin-bottom: $space-lg; }
.pc-timeline { display: flex; flex-direction: column; gap: $space-sm; margin-bottom: $space-lg; padding: $space-base $space-lg; background: #f0f7ff; border-radius: $radius-base; }
.phase-card.future .pc-timeline { background: #f0fdf4; }
.pc-tl-item { display: flex; align-items: center; gap: $space-sm; }
.pc-tl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  &.p1 { background: $primary; }
  &.p2 { background: $accent-green-500; }
}
.pc-tl-text { font-size: $font-sm; color: $text-primary; font-weight: 500; }
.pc-feat { margin-top: auto; }
.pc-feat-label { font-size: $font-xs; color: $text-hint; margin-bottom: $space-sm; }
.pc-feat-tags { display: flex; flex-wrap: wrap; gap: $space-xs; }
.pc-tag { font-size: 12px; padding: 4px 12px; border-radius: 6px; font-weight: 500;
  &.p1 { background: #e8f0fe; color: #1d4ed8; }
  &.p2 { background: #dcfce7; color: #15803d; }
}
@media (max-width: 720px) {
  .phase-cards { grid-template-columns: 1fr; }
}
// Data Table
.data-table { width: 100%; border-collapse: collapse; font-size: $font-sm;
  th { background: $gray-50; padding: 10px $space-md; text-align: left; font-weight: 600; color: $text-primary; border-bottom: 2px solid $border; }
  td { padding: 10px $space-md; border-bottom: 1px solid #f0f0f0; color: $text-secondary; }
  tr:hover td { background: $gray-50; }
}
// Risk Cards
.risk-cards { display: grid; grid-template-columns: 1fr 1fr; gap: $space-base; }
.rc-card { background: #fff; border-radius: $radius-lg; border: 1px solid $border; overflow: hidden; }
.rcc-header { display: flex; align-items: center; gap: $space-md; padding: $space-base $space-lg; border-bottom: 1px solid #f0f0f0; }
.rcc-level { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff;
  &.high { background: $danger; }
  &.mid { background: $warning; }
  &.low { background: $info; }
}
.rcc-title { font-size: $font-base; font-weight: 600; color: $text-primary; }
.rcc-body { padding: $space-base $space-lg;
  p { font-size: $font-xs; color: $text-secondary; margin-bottom: $space-sm; line-height: 1.6; }
}
.rcc-measure { font-size: $font-xs; color: $text-secondary; background: $gray-50; padding: $space-sm; border-radius: $radius-sm; line-height: 1.6;
  strong { color: $primary; }
}
// ====== 报价模块 ======
.section-note { font-size: $font-xs; color: $text-hint; margin-bottom: $space-xl; }
.pricing-block { margin-bottom: $space-xl; }
.pricing-subtitle { font-size: $font-base; font-weight: 600; color: $text-primary; margin-bottom: $space-base; display: flex; align-items: center; gap: $space-sm; }
.ps-badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 10px; color: #fff;
  &.phase1 { background: $primary; }
  &.phase2 { background: $info; }
  &.app { background: $accent-green; }
}
.pricing-table {
  table-layout: fixed;
  th { font-size: 11px; text-align: center; padding: 10px $space-sm; }
  td { font-size: 12px; padding: 9px $space-sm; vertical-align: middle; text-align: center; }
  .tc { text-align: center; }
  .tr { text-align: right; }
  .td-func { font-size: 11px; color: $text-hint; line-height: 1.5; }
}
.sum-row { background: #f0f7ff;
  td { font-size: 13px; color: $primary; }
}
.total-row { background: linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 100%);
  td { font-size: 14px; color: $primary; padding: 14px $space-sm; }
}
.subtotal-row { background: #f8fafc;
  td { font-weight: 600; color: $text-primary; }
}
</style>
