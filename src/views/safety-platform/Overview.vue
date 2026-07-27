<template>
  <div class="overview-page">
    <div class="page-header">
      <h2>安全管理平台</h2>
      <p class="page-subtitle">被动应对 → 主动防控</p>
    </div>

    <section class="ov-section">
      <h3 class="section-title">项目概述</h3>
      <div class="positioning-highlight">
        <p>依据行业安全管理标准，结合太重安全管理现状，建设涵盖<strong>安全双控体系（风险辨识、隐患治理）、特殊作业管控（作业票）、安全督办、培训中心集成</strong>等功能的安全综合管理平台，实现<strong>安全制度落地、风险分级管控与隐患排查治理</strong>等安全管理需求全面数字化管理，进一步提升公司安全管理水平。</p>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">核心价值</h3>
      <div class="value-grid">
        <div class="value-card">
          <div class="value-icon">🗺️</div>
          <h4>风险看得见</h4>
          <div class="vc-sub">从"经验判断"到"数据透视"</div>
      <ul class="vc-list">
        <li><span class="vc-bullet">✓</span><span>构建"一张图"全景视图：将已辨识危险源形成红橙黄蓝四色风险分布图，点位、等级、分布直观掌握</span></li>
        <li><span class="vc-bullet">✓</span><span>推行"挂图作战"：风险点逐一标注类型/等级/责任人/措施，看图即识险</span></li>
      </ul>
        </div>

        <div class="value-card">
          <div class="value-icon">🛡️</div>
          <h4>隐患管得住</h4>
          <div class="vc-sub">从"粗放管理"到"精准施策"</div>
          <ul class="vc-list">
            <li><span class="vc-bullet">✓</span><span>清单化精准治理：建立排查标准清单，一点一档案、一险一管控，避免管理真空</span></li>
            <li><span class="vc-bullet">✓</span><span>源头防控纠偏：常态化巡检+前置培训，从事后追责转向事前清零</span></li>
          </ul>
        </div>

        <div class="value-card">
          <div class="value-icon">🔄</div>
          <h4>治理能闭环</h4>
          <div class="vc-sub">从"单点整改"到"系统提升"</div>
      <ul class="vc-list">
        <li><span class="vc-bullet">✓</span><span>特殊作业管控：动火等危险作业线上申请、分级审批、监护确认、完工归档，全流程受控</span></li>
        <li><span class="vc-bullet">✓</span><span>快速响应：发现→上报→处置→反馈全流程线上，复核确认方可关闭</span></li>
      </ul>
        </div>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">组织覆盖范围</h3>
      <div class="org-tree">
        <div class="org-root">
          <span class="org-root-name">太原重工</span>
          <span class="org-root-role">查看全公司态势 · 发起督办</span>
        </div>
        <div class="org-trunk">
          <div class="org-company">
            <div class="org-company-node branch-group">
              <span class="branch-item">起重机分公司、矿山分公司、铸锻件分公司、冶金分公司 <span class="branch-item muted">…</span></span>
            </div>
          </div>
          <div class="org-company">
            <div class="org-company-node">
              <span class="org-company-name">轨道公司</span>
            </div>
          </div>
          <div class="org-company">
            <div class="org-company-node">
              <span class="org-company-name">工程起重机公司</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">三端协同</h3>
      <div class="section-card">
        <div class="terminal-grid">
          <div class="terminal-card">
            <div class="terminal-icon" style="background: #fffbeb; color: #f59e0b;">📱</div>
            <h4>微信小程序端</h4>
            <p>现场人员巡检上报、整改反馈、监护确认。数据实时同步 PC 工作台和驾驶舱。</p>
          </div>
          <div class="terminal-card">
            <div class="terminal-icon" style="background: #ecfdf5; color: #0ea85e;">💻</div>
            <h4>PC 管理工作台</h4>
            <p>相关负责人在本组织内完成隐患受理/复查、作业审批/归档等全部日常业务。</p>
          </div>
          <div class="terminal-card">
            <div class="terminal-icon" style="background: #e8f0fe; color: #1a5fdc;">📊</div>
            <h4>驾驶舱</h4>
            <p>态势总览、四色图下钻、组织对比、督办跟踪。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">预期成效</h3>
      <div class="section-card">
        <div ref="metricChart" class="chart-box"></div>
        <p class="chart-note">注：条形长度为相对改善幅度，标签为「现状 → 目标」真实值，颜色越绿代表改善越显著。</p>
      </div>
    </section>

  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'Overview',
  data() {
    return {
      metricImproves: [
        { name: '私自作业', value: 100, before: '偶有发生', after: '0（杜绝）' },
        { name: '证书逾期率', value: 85, before: '30–40%', after: '≤5%' },
        { name: '作业票审批', value: 80, before: '1–3天', after: '2–4小时' },
        { name: '督办响应', value: 70, before: '3–7天', after: '1天内' },
        { name: '隐患逾限率', value: 70, before: '15–25%', after: '≤5%' },
        { name: '可追溯率', value: 70, before: '≤30%', after: '100%' },
        { name: '隐患闭环周期', value: 65, before: '7–15天', after: '2–5天' },
        { name: '巡检完成率', value: 25, before: '70–80%', after: '≥95%' }
      ]
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initMetricChart();
    });
  },
  beforeDestroy() {
    this._metricChart && this._metricChart.dispose();
  },
  methods: {
    initMetricChart() {
      if (!this.$refs.metricChart) return;
      const data = this.metricImproves;
      this._metricChart = echarts.init(this.$refs.metricChart);
      this._metricChart.setOption({
        tooltip: {
          trigger: 'item',
          backgroundColor: '#fff',
          borderColor: '#e5e7eb',
          textStyle: { color: '#111827', fontSize: 12 },
          formatter: function (p) {
            const d = data[p.dataIndex];
            return '<strong>' + d.name + '</strong><br/>现状：' + d.before + ' → 目标：' + d.after + '<br/>相对改善幅度：' + d.value + '%';
          }
        },
        grid: { left: 96, right: 220, top: 10, bottom: 16 },
        xAxis: {
          type: 'value',
          max: 100,
          axisLabel: { color: '#9ca3af', fontSize: 11, formatter: '{value}%' },
          splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
          axisLine: { show: false }
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: data.map(function (d) { return d.name; }),
          axisLabel: { color: '#475569', fontSize: 12, fontWeight: 500 },
          axisTick: { show: false },
          axisLine: { lineStyle: { color: '#e5e7eb' } }
        },
        series: [{
          type: 'bar',
          barWidth: 20,
          data: data.map(function (d) {
            return {
              value: d.value,
              itemStyle: {
                color: d.value >= 80 ? '#0ea85e' : (d.value >= 60 ? '#1a5fdc' : '#60a5fa'),
                borderRadius: [0, 6, 6, 0]
              }
            };
          }),
          label: {
            show: true,
            position: 'right',
            color: '#475569',
            fontSize: 11,
            formatter: function (p) { return data[p.dataIndex].before + ' → ' + data[p.dataIndex].after; }
          }
        }]
      });
      window.addEventListener('resize', () => this._metricChart && this._metricChart.resize());
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.overview-page { max-width: 900px; }
.page-header {
  margin-bottom: $space-2xl;
  h2 { font-size: $font-2xl; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-base; font-weight: 700; color: $primary; }
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

.positioning-highlight {
  position: relative;
  background: linear-gradient(180deg, #EEF7FF 0%, #F4FAFF 100%);
  border: 1px solid $brand-100;
  border-left: 4px solid $primary;
  border-radius: $radius-xl;
  padding: $space-xl $space-2xl;
  box-shadow: $shadow-glow-blue;
  p {
    font-size: $font-lg;
    line-height: 2;
    font-weight: 500;
    color: $text-primary;
    margin: 0;
  }
  strong { color: $primary; font-weight: 700; }
}

.value-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-base; }
.value-card {
  background: #fff; border-radius: 16px; padding: $space-lg;
  border: 1px solid rgba(15,23,42,.06); text-align: left;
  box-shadow: 0 2px 12px rgba(15,23,42,.04); transition: transform .2s, box-shadow .2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(15,23,42,.1); }
  .value-icon { font-size: 28px; margin-bottom: $space-sm; }
  h4 { font-size: $font-base; font-weight: 700; color: $text-primary; margin-bottom: 4px; }
  .vc-sub { font-size: $font-xs; color: $text-hint; margin-bottom: $space-sm; }
  .vc-list { list-style: none; margin: 0; padding: 0; }
  .vc-list li { display: flex; gap: $space-sm; font-size: $font-xs; color: $text-secondary; line-height: 1.6; padding: 4px 0; }
  .vc-bullet { color: $success; font-weight: 700; flex-shrink: 0; }
}

// 组织覆盖范围（重排版）
.org-tree { display: flex; flex-direction: column; gap: $space-lg; }
.org-root {
  display: flex; align-items: center; justify-content: space-between; gap: $space-md;
  background: linear-gradient(90deg, #1a5fdc 0%, #3b82f6 100%);
  color: #fff; border-radius: 14px; padding: $space-base $space-xl;
  box-shadow: 0 6px 18px rgba(26,95,220,.18);
  .org-root-name { font-size: $font-lg; font-weight: 700; }
  .org-root-role { font-size: $font-xs; opacity: .92; }
}
.org-trunk {
  position: relative; margin-left: 22px; padding-left: 34px;
  border-left: 2px solid #dbeafe;
  display: flex; flex-direction: column; gap: $space-xl;
}
.org-company { position: relative; }
.org-company::before {
  content: ''; position: absolute; left: -34px; top: 19px;
  width: 34px; height: 2px; background: #dbeafe;
}
.org-company-node {
  display: inline-flex; align-items: baseline; flex-wrap: wrap; gap: $space-sm;
  background: #fff; border: 1px solid rgba(15,23,42,.08); border-radius: 10px;
  padding: 8px 16px; box-shadow: 0 2px 8px rgba(15,23,42,.04);
  .org-company-name { font-size: $font-base; font-weight: 700; color: $text-primary; }
  .org-company-role { font-size: $font-xs; color: $text-hint; }
  .branch-item { font-size: $font-base; font-weight: 700; color: $text-primary; }
  .branch-item.muted { color: $primary; font-weight: 700; }
}
.org-branches {
  position: relative; margin-top: $space-sm; margin-left: 16px; padding-left: 22px;
  border-left: 2px solid #eef2f7;
  display: flex; flex-wrap: wrap; gap: $space-sm; align-content: flex-start;
}
.org-branches::before {
  content: ''; position: absolute; left: -22px; top: 17px;
  width: 22px; height: 2px; background: #eef2f7;
}
.org-branches.is-root-level {
  margin-left: 0; margin-top: 0;
  &::before { left: -34px; width: 34px; height: 2px; background: #dbeafe; }
}
.org-branch.chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 10px; font-size: $font-xs; font-weight: 500;
  background: #f8fafc; border: 1px solid #e2e8f0; color: $text-secondary;
  &.highlight { background: $primary-bg; border: 1.5px solid $primary; color: $primary; font-weight: 600; }
  &.muted { background: transparent; border-style: dashed; color: $text-hint; }
  &.ellipsis { background: #fafbfc; border: 1px dashed #d0d5dd; color: $text-hint; font-size: 16px; padding: 7px 12px; cursor: default; }
}
.ob-tag { font-size: 10px; padding: 1px 7px; border-radius: 8px; background: $primary; color: #fff; font-weight: 600; }

.module-table {
  width: 100%; border-collapse: collapse; font-size: $font-sm;
  th { background: $gray-50; padding: 10px $space-md; text-align: left; font-weight: 600; color: $text-primary; border-bottom: 2px solid $border; }
  td { padding: 10px $space-md; border-bottom: 1px solid #f0f0f0; color: $text-secondary; }
  tr:hover td { background: $gray-50; }
}

// 三端协同
.terminal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-base; }
.terminal-card {
  text-align: center; padding: $space-lg;
  .terminal-icon { width: 48px; height: 48px; border-radius: $radius-lg; margin: 0 auto $space-sm; display: flex; align-items: center; justify-content: center; font-size: 22px; }
  h4 { font-size: $font-sm; font-weight: 600; margin-bottom: $space-xs; }
  p { font-size: $font-xs; color: $text-secondary; line-height: 1.5; }
}

// 量化指标分析（对比图）
.chart-box { width: 100%; height: 420px; }
.chart-note { margin: $space-md 0 0; font-size: $font-xs; color: $text-hint; line-height: 1.6; }
</style>
