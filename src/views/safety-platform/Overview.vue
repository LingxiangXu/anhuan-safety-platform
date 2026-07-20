<template>
  <div class="overview-page">
    <div class="page-header">
      <h2>安全管理平台 — 项目总览</h2>
      <p class="page-subtitle">集团穿透 · 公司主责 · 现场闭环</p>
    </div>

    <section class="ov-section">
      <h3 class="section-title">平台定位</h3>
      <div class="positioning-highlight">
        <p>安全管理平台是一套<strong>集团级安全生产管控体系</strong>，面向<strong>太重集团及下属各公司</strong>，实现从集团宏观态势洞察到现场隐患闭环的全链路数字化安全管理。</p>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">管理支撑</h3>
      <div class="value-grid">
        <div class="value-card" v-for="v in values" :key="v.title">
          <div class="value-icon" :style="{ color: v.color }">{{ v.icon }}</div>
          <h4>{{ v.title }}</h4>
          <p>{{ v.desc }}</p>
        </div>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">核心价值维度</h3>
      <div class="value-cards">
        <div class="vc-card">
          <div class="vcc-header">
            <span class="vcc-icon">⚡</span>
            <div>
              <div class="vcc-title">效率提升</div>
              <div class="vcc-sub">从"人找事"到"事找人"</div>
            </div>
          </div>
          <div class="vcc-body">
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>隐患自动流转分派，无需人工通知与催办</span></div>
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>作业票线上逐级审批，替代纸质签字跑腿</span></div>
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>移动端巡检打勾+随手拍，替代纸质检查表</span></div>
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>集团督办在线反馈，替代邮件/电话/会议</span></div>
          </div>
        </div>

        <div class="vc-card">
          <div class="vcc-header">
            <span class="vcc-icon">🔒</span>
            <div>
              <div class="vcc-title">风险管控</div>
              <div class="vcc-sub">从"事后追责"到"事前预防"</div>
            </div>
          </div>
          <div class="vcc-body">
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>准入闸门源头拦截不合规作业人员</span></div>
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>风险四色图实时可视化，风险分布一目了然</span></div>
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>证书到期30天自动预警，杜绝"过期仍用"</span></div>
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>逾限隐患自动高亮警示，防止"遗忘式拖延"</span></div>
          </div>
        </div>

        <div class="vc-card">
          <div class="vcc-header">
            <span class="vcc-icon">📋</span>
            <div>
              <div class="vcc-title">合规保障</div>
              <div class="vcc-sub">从"人治"到"数治"</div>
            </div>
          </div>
          <div class="vcc-body">
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>全链路操作留痕，任一环节可追溯</span></div>
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>隐患/作业票/督办完整时间线，应付检查一键导出</span></div>
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>RACI责任矩阵明确分工，杜绝推诿扯皮</span></div>
            <div class="vccb-item"><span class="vccb-bullet">✓</span><span>培训记录与证书管理电子化，合规审计有据可查</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">三端协同</h3>
      <div class="section-card">
        <div class="terminal-grid">
          <div class="terminal-card">
            <div class="terminal-icon" style="background: #e8f0fe; color: #1a5fdc;">📊</div>
            <h4>集团驾驶舱</h4>
            <p>态势总览、四色图下钻、组织对比、督办跟踪。集团领导只读，集团安环可发起督办。</p>
          </div>
          <div class="terminal-card">
            <div class="terminal-icon" style="background: #ecfdf5; color: #0ea85e;">💻</div>
            <h4>PC 管理工作台</h4>
            <p>公司安环和部门负责人在本组织内完成隐患受理/复查、作业审批/归档等全部日常业务。</p>
          </div>
          <div class="terminal-card">
            <div class="terminal-icon" style="background: #fffbeb; color: #f59e0b;">📱</div>
            <h4>移动现场端</h4>
            <p>现场人员巡检上报、整改反馈、监护确认。数据实时同步 PC 工作台和集团驾驶舱。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">组织覆盖范围</h3>
      <div class="org-tree">
        <div class="org-root">
          <span class="org-root-name">太重集团</span>
          <span class="org-root-role">查看全集团态势 · 发起集团督办</span>
        </div>
        <div class="org-trunk">
          <div class="org-company">
            <div class="org-company-node">
              <span class="org-company-name">太原重工</span>
              <span class="org-company-role">查看本公司及下属单位 · 办理本单位事项</span>
            </div>
            <div class="org-branches">
              <div class="org-branch chip"><span class="ob-name">铸锻件分公司</span></div>
              <div class="org-branch chip"><span class="ob-name">矿山分公司</span></div>
              <div class="org-branch chip"><span class="ob-name">齿轮分公司</span></div>
              <div class="org-branch chip"><span class="ob-name">核电分公司</span></div>
              <div class="org-branch chip"><span class="ob-name">起重机分公司</span></div>
              <div class="org-branch chip"><span class="ob-name">轨道交通分公司</span></div>
              <div class="org-branch chip ellipsis"><span class="ob-name">…</span></div>
            </div>
          </div>
          <div class="org-company">
            <div class="org-company-node">
              <span class="org-company-name">山西太重工程机械有限公司</span>
              <span class="org-company-role">办理本公司安全事项</span>
            </div>
            <div class="org-branches">
              <div class="org-branch chip muted"><span class="ob-name">无下属分公司</span></div>
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
      <h3 class="section-title">量化指标分析</h3>
      <div class="section-card">
        <div ref="metricChart" class="chart-box"></div>
        <p class="chart-note">注：条形长度为相对改善幅度，标签为「现状 → 目标」真实值，颜色越绿代表改善越显著。</p>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">功能总览</h3>
      <div class="phase-overview">
        <div class="po-phase current">
          <div class="pop-badge">一期</div>
          <div class="pop-title">核心流程上线</div>
          <div class="pop-time">2026 Q3-Q4 · 3个月</div>
          <div class="pop-items">
            <div class="popi" v-for="item in phase1Items" :key="item">{{ item }}</div>
          </div>
        </div>
        <div class="po-arrow">→</div>
        <div class="po-phase future">
          <div class="pop-badge">二期</div>
          <div class="pop-title">深度能力扩展</div>
          <div class="pop-time">2027 Q1-Q2 · 3个月</div>
          <div class="pop-items">
            <div class="popi" v-for="item in phase2Items" :key="item">{{ item }}</div>
          </div>
        </div>
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
      values: [
        { icon: '🔍', title: '集团穿透', desc: '集团领导可查看各公司安全态势，驾驶舱下钻至区域、风险点和隐患详情', color: '#1a5fdc' },
        { icon: '🏢', title: '公司主责', desc: '各所属公司在自身组织范围内独立完成隐患发现/整改/复查、作业审批/归档等全部日常安全业务', color: '#0ea85e' },
        { icon: '📱', title: '现场闭环', desc: '现场人员通过移动端完成巡检上报、整改反馈、作业监护确认，数据实时回写 PC 端驾驶舱与工作台', color: '#f59e0b' }
      ],
      principles: [
        { num: '01', title: '穿透可见，归口办理', desc: '数据按集团—二级—三级层层可见，业务流程始终归母属公司完成，集团仅就重大/逾期事项发起督办。' },
        { num: '02', title: '督办不代行', desc: '集团督办是关联原隐患的独立单据；关闭督办不等于关闭原隐患，两单状态独立、可互查。' },
        { num: '03', title: '一处改动，处处联动', desc: '所有页面共享同一状态源，任一操作都会同步更新业务对象的状态、待办、时间线与驾驶舱指标。' },
        { num: '04', title: '持证方能作业', desc: '培训、证照、履职记录不是孤立展示页，而是特殊作业申请的前置校验；资格不达标即阻断提交并提示缺失项。' }
      ],
      phase1Items: [
        '隐患全生命周期治理',
        '集团督办独立流转',
        '特殊作业票全流程管控',
        '驾驶舱与风险四色图',
        '风险管理与BPM审批对接',
        '培训管理与证书预警',
        'APP移动巡检与随手拍',
        '组织架构与角色权限'
      ],
      phase2Items: [
        '应急管理（物资/预案/演练）',
        '制度化管理（法规/规章/规程）',
        '目标职责深化（履职/全员参与）',
        '设备设施安全管理（6类特种设备）',
        '职业健康与劳保用品',
        '双控数据统计与预测预警',
        '相关方管理（名录/人员/项目监控）'
      ],
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
  border: 1px solid rgba(15,23,42,.06); text-align: center;
  box-shadow: 0 2px 12px rgba(15,23,42,.04); transition: transform .2s, box-shadow .2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(15,23,42,.1); }
  .value-icon { font-size: 32px; margin-bottom: $space-sm; }
  h4 { font-size: $font-base; font-weight: 700; color: $text-primary; margin-bottom: $space-xs; }
  p { font-size: $font-xs; color: $text-secondary; line-height: 1.6; }
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
.org-branch.chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 10px; font-size: $font-xs; font-weight: 500;
  background: #f8fafc; border: 1px solid #e2e8f0; color: $text-secondary;
  &.highlight { background: $primary-bg; border: 1.5px solid $primary; color: $primary; font-weight: 600; }
  &.muted { background: transparent; border-style: dashed; color: $text-hint; }
  &.ellipsis { background: #fafbfc; border: 1px dashed #d0d5dd; color: $text-hint; font-size: 16px; padding: 7px 12px; cursor: default; }
}
.ob-tag { font-size: 10px; padding: 1px 7px; border-radius: 8px; background: $primary; color: #fff; font-weight: 600; }

.principles-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: $space-base; }
.principle-card {
  background: $brand-500; border-radius: 16px; padding: $space-lg;
  border: 1px solid rgba(255,255,255,.15); display: flex; gap: $space-base;
  box-shadow: 0 6px 18px rgba(0,117,230,.25); transition: transform .2s;
  &:hover { transform: translateY(-2px); }
  .principle-num {
    width: 36px; height: 36px; border-radius: 10px; background: #fff;
    color: $brand-600; font-weight: 700; font-size: $font-sm;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  h4 { font-size: $font-sm; font-weight: 700; color: #fff; margin-bottom: 4px; }
  p { font-size: $font-xs; color: rgba(255,255,255,.88); line-height: 1.5; }
}

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

// 分期总览
.phase-overview { display: flex; align-items: flex-start; gap: $space-xl; }
.po-phase {
  flex: 1; background: #fff; border-radius: 16px; padding: $space-xl;
  border: 1px solid rgba(15,23,42,.06); box-shadow: 0 2px 12px rgba(15,23,42,.04);
  &.current { border-color: $primary; border-width: 2px; }
  &.future { border-color: $info; }
}
.pop-badge { display: inline-block; font-size: $font-xs; font-weight: 700; padding: 3px 14px; border-radius: 12px; margin-bottom: $space-sm;
  .current & { background: $primary; color: #fff; }
  .future & { background: $info; color: #fff; }
}
.pop-title { font-size: $font-lg; font-weight: 700; color: $text-primary; margin-bottom: $space-xs; }
.pop-time { font-size: $font-xs; color: $text-hint; margin-bottom: $space-base; }
.pop-items { display: flex; flex-direction: column; gap: 4px; }
.popi { font-size: $font-xs; color: $text-secondary; padding: 3px 0; &::before { content: '▸ '; color: $primary; } }
.po-arrow { font-size: 28px; color: $text-hint; padding-top: 40px; flex-shrink: 0; }

// 核心价值维度
.value-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-base; }
.vc-card { background: #fff; border-radius: 16px; border: 1px solid rgba(15,23,42,.06); overflow: hidden; box-shadow: 0 2px 12px rgba(15,23,42,.04); }
.vcc-header { display: flex; align-items: center; gap: $space-md; padding: $space-base $space-lg; background: $gray-50; border-bottom: 1px solid #f0f0f0; }
.vcc-icon { font-size: 28px; }
.vcc-title { font-size: $font-base; font-weight: 600; color: $text-primary; }
.vcc-sub { font-size: $font-xs; color: $text-hint; }
.vcc-body { padding: $space-base $space-lg; }
.vccb-item { display: flex; gap: $space-sm; padding: 6px 0; font-size: $font-xs; color: $text-secondary; line-height: 1.5;
  .vccb-bullet { color: $success; flex-shrink: 0; font-weight: 700; }
}

// 量化指标分析（对比图）
.chart-box { width: 100%; height: 420px; }
.chart-note { margin: $space-md 0 0; font-size: $font-xs; color: $text-hint; line-height: 1.6; }
</style>
