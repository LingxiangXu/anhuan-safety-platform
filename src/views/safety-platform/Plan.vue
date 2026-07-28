<template>
  <div class="plan-page">
    <div class="page-header">
      <h2>建设规划</h2>
      <p class="page-subtitle">分两期交付：一期重工试点单位上线跑通核心业务，二期重工深化并面向各生产经营单位推广复用，从"数字化"迈向"数智化"</p>
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
          <div class="pc-progress" v-if="p.progress && p.progress.length">
            <div class="pc-progress-bar">
              <div class="pc-progress-seg p1" v-for="(seg, sgi) in p.progress" :key="sgi" :style="{ flex: seg.weight || 1 }">
                <span>{{ seg.label }}</span>
              </div>
            </div>
            <div class="pc-progress-caption" v-if="p.progressNote">{{ p.progressNote }}</div>
          </div>
          <div class="pc-deliver" v-if="p.deliverables && p.deliverables.length">
            <div class="pc-deliver-label">{{ p.deliverLabel || '核心交付成果' }}</div>
            <div class="pc-deliver-item" v-for="(d, di) in p.deliverables" :key="di">{{ d }}</div>
          </div>
          <div class="pc-feat">
            <div class="pc-feat-label">{{ p.featLabel }}</div>
            <template v-if="p.directions && p.directions.length">
              <div class="pc-dir" v-for="(d, di) in p.directions" :key="di" :class="{ 'ai-dir': d.ai }">
                <div class="pc-dir-title" :class="{ 'ai-title': d.ai }">{{ d.title }}</div>
                <template v-if="d.ai">
                  <div class="ai-item" v-for="(f, fi) in d.items" :key="fi">
                    <div class="ai-ico">{{ aiIconOf(f) }}</div>
                    <div class="ai-txt"><div class="ai-b">{{ splitAi(f).name }}</div><div class="ai-d">{{ splitAi(f).desc }}</div></div>
                  </div>
                </template>
                <div class="pc-feat-tags" v-else>
                  <span class="pc-tag no-box" v-for="(f, fi) in d.items" :key="fi">{{ f }}</span>
                </div>
              </div>
            </template>
            <div class="pc-feat-text" v-else>{{ p.features.join('、') }}</div>
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
        <p class="section-note">按任务逐项测算：人天单价 1,500 元/人天；小计 = 人天/数量 × 单价，各任务小计与服务器资源费用之和即为项目预计费用成本。项目预计费用成本为 720,500 元（其中开发人天 447 人天、服务器资源 50,000 元）。</p>
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
              <tr class="total-row"><td class="tc">—</td><td class="tc"><strong>项目预计费用成本</strong></td><td class="tc"><strong>447</strong></td><td class="tc">—</td><td class="tc"><strong>720,500</strong></td></tr>
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
          title: '重工试点单位上线',
          goal: '以重工试点单位率先上线，覆盖 PC 端、APP 端与微信小程序（企业微信扫码发起）三端协同，跑通安全管理核心业务全流程，打通公司-现场数据联动，实现"从纸质到数字"的跨越。',
          progress: [
            { label: '2 个月', weight: 1 },
            { label: '4 个月', weight: 2 }
          ],
          progressNote: '里程碑：2 个月主要功能上线 → 4 个月收尾（优化·培训·验收）',
          deliverLabel: '核心交付成果',
          deliverables: [
            '7 大核心模块上线（风险 / 巡检 / 隐患 / 作业 / 驾驶舱 / OA / 培训）',
            'PC · APP · 微信小程序三端协同打通',
            '纸质安全台账全面数字化，公司-现场数据联动'
          ],
          featLabel: '核心功能模块',
          features: ['风险管理', '巡检任务管理', '隐患与督办', '特殊作业管控', '驾驶舱', 'OA审批集成', '培训与证书']
        },
        {
          tag: '二期', future: true,
          title: '重工深化·AI赋能·推广复用',
          goal: '在一期核心业务跑通与数据积累基础上，深化应用能力并向各生产经营单位推广复用，从"数字化"迈向"数智化"——以 AI 赋能实现主动防控，补齐双控体系与现场管理短板、贯通制度与培训管理体系。',
          featLabel: '深化与推广方向',
          directions: [
            { title: '一、重工深化', items: [
              '设备·相关方·职业健康·劳保管理补全',
              '双控数据统计与预警深化',
              '制度化管理与全员履职贯通',
              '教育培训全体系打通',
              '应急管理与持续改进闭环'
            ]},
            { title: '二、AI赋能', ai: true, items: [
              'AI 视觉识别：现场违章与隐患图像智能识别、实时告警',
              '风险预测预警：基于历史与物联数据的事故风险趋势预测',
              '安全大模型助手：制度/规程智能问答与作业方案辅助生成'
            ]},
            { title: '三、推广复用', items: [
              '多单位标准化快速复用'
            ]}
          ]
        }
      ],
    };
  },
  methods: {
    // AI 赋能区块：按「名称：描述」拆分，用于图标+两行列表排版
    splitAi(f) {
      const idx = f.indexOf('：');
      if (idx === -1) return { name: f, desc: '' };
      return { name: f.slice(0, idx), desc: f.slice(idx + 1) };
    },
    aiIconOf(f) {
      if (f.includes('视觉') || f.includes('识别')) return '📷';
      if (f.includes('预测') || f.includes('风险')) return '📈';
      if (f.includes('大模型') || f.includes('助手')) return '🤖';
      return '🤖';
    }
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
.phase-cards { display: grid; grid-template-columns: 1fr 1fr; gap: $space-lg; align-items: start; }
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
.pc-feat { margin-top: $space-lg; }
.pc-feat-label { font-size: $font-xs; color: $text-hint; margin-bottom: $space-sm; }
.pc-feat-tags { display: flex; flex-wrap: wrap; gap: $space-xs; }
.pc-feat-text { font-size: 12px; color: $text-secondary; line-height: 1.9; }
.pc-dir { margin-top: $space-base; }
.pc-dir:first-of-type { margin-top: 0; }
.pc-dir-title { font-size: $font-xs; font-weight: 600; color: $text-secondary; margin-bottom: $space-xs; line-height: 1.5; }
.pc-tag { font-size: 12px; padding: 4px 12px; border-radius: 6px; font-weight: 500;
  &.p1 { background: #e8f0fe; color: #1d4ed8; }
  &.p2 { background: #dcfce7; color: #15803d; }
  &.no-box { background: transparent; color: $text-secondary; padding: 4px 0; }
  &.ai-box { background: #dcfce7; color: #15803d; border: 1px solid $accent-green-500; font-weight: 600; }
}
.pc-dir.ai-dir { border: 1.5px solid $accent-green-500; border-radius: 10px; padding: 12px 14px; background: #f0fdf4; margin-top: $space-base; }
.pc-dir.ai-dir .pc-dir-title { color: #15803d; font-weight: 700; }
.ai-item { display: flex; gap: 10px; align-items: flex-start; padding: 8px 0; border-top: 1px dashed #c7eccd; }
.ai-item:first-of-type { border-top: none; }
.ai-ico { flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%; background: #dcfce7; color: #15803d; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.ai-txt { flex: 1; min-width: 0; }
.ai-b { font-size: 13px; font-weight: 600; color: #334155; }
.ai-d { font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 2px; }
.pc-progress { margin-bottom: $space-lg; }
.pc-progress-bar { display: flex; height: 30px; border-radius: $radius-base; overflow: hidden; background: #f1f5f9; }
.pc-progress-seg { display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; color: #fff;
  &.p1 { background: $primary; }
}
.pc-progress-caption { font-size: $font-xs; color: $text-hint; margin-top: $space-xs; line-height: 1.5; }
.pc-deliver { margin-bottom: $space-lg; }
.pc-deliver-label { font-size: $font-xs; color: $text-hint; margin-bottom: $space-xs; }
.pc-deliver-item { position: relative; padding-left: 16px; font-size: $font-sm; color: $text-secondary; line-height: 1.8; }
.pc-deliver-item::before { content: ''; position: absolute; left: 2px; top: 10px; width: 6px; height: 6px; border-radius: 50%; background: $primary; }
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
