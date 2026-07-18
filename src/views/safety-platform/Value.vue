<template>
  <div class="value-page">
    <div class="page-header">
      <h2>产品成效分析</h2>
      <p class="page-subtitle">安全管理平台上线后的预期成效量化分析，涵盖效率提升、风险管控、合规保障三个维度</p>
    </div>

    <!-- 成效总览 -->
    <section class="ov-section">
      <h3 class="section-title">预期成效总览</h3>
      <div class="kpi-grid">
        <div class="kpi-card red">
          <div class="kpi-icon">⚠️</div>
          <div class="kpi-num">≥60%</div>
          <div class="kpi-label">隐患闭环效率提升</div>
          <div class="kpi-desc">全流程线上化，从发现到闭环周期缩短60%以上</div>
        </div>
        <div class="kpi-card blue">
          <div class="kpi-icon">📋</div>
          <div class="kpi-num">100%</div>
          <div class="kpi-label">特殊作业票线上化</div>
          <div class="kpi-desc">高风险作业全量在线审批，杜绝私下作业</div>
        </div>
        <div class="kpi-card green">
          <div class="kpi-icon">🛡️</div>
          <div class="kpi-num">0</div>
          <div class="kpi-label">资格缺陷入场</div>
          <div class="kpi-desc">准入闸门自动校验，证件过期人员无法提交作业申请</div>
        </div>
        <div class="kpi-card orange">
          <div class="kpi-icon">📱</div>
          <div class="kpi-num">30分钟内</div>
          <div class="kpi-label">现场隐患上报响应</div>
          <div class="kpi-desc">移动端随手拍上报，安环人员受理响应时效承诺</div>
        </div>
      </div>
    </section>

    <!-- 效率对比 -->
    <section class="ov-section">
      <h3 class="section-title">线上化前后对比</h3>
      <div class="compare-grid">
        <div class="cg-item">
          <div class="cgi-label">隐患全流程周期</div>
          <div class="cgi-bars">
            <div class="cgib-before">
              <span class="cgib-name">线上化前</span>
              <div class="cgib-track"><div class="cgib-fill gray" style="width:100%"><span>7-15 天</span></div></div>
            </div>
            <div class="cgib-after">
              <span class="cgib-name">线上化后</span>
              <div class="cgib-track"><div class="cgib-fill green" style="width:40%"><span>2-5 天</span></div></div>
            </div>
          </div>
          <div class="cgi-improve">提升 60%+</div>
        </div>
        <div class="cg-item">
          <div class="cgi-label">作业票审批耗时</div>
          <div class="cgi-bars">
            <div class="cgib-before">
              <span class="cgib-name">线上化前</span>
              <div class="cgib-track"><div class="cgib-fill gray" style="width:100%"><span>1-3 天</span></div></div>
            </div>
            <div class="cgib-after">
              <span class="cgib-name">线上化后</span>
              <div class="cgib-track"><div class="cgib-fill green" style="width:25%"><span>2-4 小时</span></div></div>
            </div>
          </div>
          <div class="cgi-improve">提升 80%+</div>
        </div>
        <div class="cg-item">
          <div class="cgi-label">集团督办反馈时效</div>
          <div class="cgi-bars">
            <div class="cgib-before">
              <span class="cgib-name">线上化前</span>
              <div class="cgib-track"><div class="cgib-fill gray" style="width:100%"><span>3-7 天</span></div></div>
            </div>
            <div class="cgib-after">
              <span class="cgib-name">线上化后</span>
              <div class="cgib-track"><div class="cgib-fill green" style="width:35%"><span>1 天内</span></div></div>
            </div>
          </div>
          <div class="cgi-improve">提升 70%+</div>
        </div>
        <div class="cg-item">
          <div class="cgi-label">巡检任务完成率</div>
          <div class="cgi-bars">
            <div class="cgib-before">
              <span class="cgib-name">线上化前</span>
              <div class="cgib-track"><div class="cgib-fill gray" style="width:100%"><span>70-80%</span></div></div>
            </div>
            <div class="cgib-after">
              <span class="cgib-name">线上化后</span>
              <div class="cgib-track"><div class="cgib-fill green" style="width:120%"><span>≥95%</span></div></div>
            </div>
          </div>
          <div class="cgi-improve">提升 20%+</div>
        </div>
      </div>
    </section>

    <!-- 三大价值维度 -->
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
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>隐患自动流转分派，无需人工通知与催办</span>
            </div>
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>作业票线上逐级审批，替代纸质签字跑腿</span>
            </div>
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>移动端巡检打勾+随手拍，替代纸质检查表</span>
            </div>
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>集团督办在线反馈，替代邮件/电话/会议</span>
            </div>
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
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>准入闸门源头拦截不合规作业人员</span>
            </div>
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>风险四色图实时可视化，风险分布一目了然</span>
            </div>
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>证书到期30天自动预警，杜绝"过期仍用"</span>
            </div>
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>逾限隐患自动高亮警示，防止"遗忘式拖延"</span>
            </div>
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
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>全链路操作留痕，任一环节可追溯</span>
            </div>
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>隐患/作业票/督办完整时间线，应付检查一键导出</span>
            </div>
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>RACI责任矩阵明确分工，杜绝推诿扯皮</span>
            </div>
            <div class="vccb-item">
              <span class="vccb-bullet">✓</span>
              <span>培训记录与证书管理电子化，合规审计有据可查</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 对标指标 -->
    <section class="ov-section">
      <h3 class="section-title">量化指标对标</h3>
      <div class="section-card" style="padding:0; overflow:hidden">
        <table class="data-table">
          <thead>
            <tr><th>指标</th><th>现状（线下）</th><th>目标（上线后）</th><th>提升幅度</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>隐患从发现到闭环周期</strong></td>
              <td>7-15天</td>
              <td><span class="target-highlight">2-5天</span></td>
              <td><span class="tag tag-green">↓ 60-70%</span></td>
            </tr>
            <tr>
              <td><strong>作业票审批耗时</strong></td>
              <td>1-3天</td>
              <td><span class="target-highlight">2-4小时</span></td>
              <td><span class="tag tag-green">↓ 80%+</span></td>
            </tr>
            <tr>
              <td><strong>集团督办响应时效</strong></td>
              <td>3-7天</td>
              <td><span class="target-highlight">1天内</span></td>
              <td><span class="tag tag-green">↓ 70%+</span></td>
            </tr>
            <tr>
              <td><strong>巡检任务完成率</strong></td>
              <td>70-80%</td>
              <td><span class="target-highlight">≥95%</span></td>
              <td><span class="tag tag-green">↑ 20%+</span></td>
            </tr>
            <tr>
              <td><strong>隐患逾限率</strong></td>
              <td>15-25%</td>
              <td><span class="target-highlight">≤5%</span></td>
              <td><span class="tag tag-green">↓ 70%+</span></td>
            </tr>
            <tr>
              <td><strong>证书到期未处理率</strong></td>
              <td>30-40%</td>
              <td><span class="target-highlight">≤5%</span></td>
              <td><span class="tag tag-green">↓ 85%+</span></td>
            </tr>
            <tr>
              <td><strong>私下作业发生率</strong></td>
              <td>偶有发生</td>
              <td><span class="target-highlight">0</span></td>
              <td><span class="tag tag-green">杜绝</span></td>
            </tr>
            <tr>
              <td><strong>操作记录可追溯率</strong></td>
              <td>≤30%</td>
              <td><span class="target-highlight">100%</span></td>
              <td><span class="tag tag-green">↑ 70%+</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ROI简述 -->
    <section class="ov-section">
      <h3 class="section-title">投入产出分析</h3>
      <div class="section-card">
        <div class="roi-summary">
          <div class="rois-item">
            <div class="rois-num">~3-6月</div>
            <div class="rois-label">建设周期</div>
            <div class="rois-desc">分两期交付，一期覆盖核心流程，二期扩展深度功能</div>
          </div>
          <div class="rois-item">
            <div class="rois-num">6-12月</div>
            <div class="rois-label">投资回收期</div>
            <div class="rois-desc">通过减少事故损失、降低管理成本、提升合规效率快速回收投资</div>
          </div>
          <div class="rois-item">
            <div class="rois-num">3X</div>
            <div class="rois-label">年化ROI</div>
            <div class="rois-desc">每年避免的工伤赔偿+停工损失+管理效率提升的综合回报</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SafetyValue'
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.value-page { max-width: 960px; }
.page-header {
  margin-bottom: $space-xl;
  h2 { font-size: $font-2xl; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; }
}

.ov-section { margin-bottom: $space-2xl; }
.section-title { font-size: $font-md; font-weight: 600; color: $text-primary; margin-bottom: $space-lg; padding-left: 12px; border-left: 3px solid $primary; }
.section-card { background: #fff; border-radius: $radius-lg; padding: $space-lg $space-xl; border: 1px solid $border; }

// KPI Cards
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: $space-base; }
.kpi-card { background: #fff; border-radius: $radius-lg; padding: $space-lg; text-align: center; border: 1px solid $border; border-top: 3px solid;
  &.red { border-top-color: $danger; }
  &.blue { border-top-color: $info; }
  &.green { border-top-color: $success; }
  &.orange { border-top-color: $warning; }
}
.kpi-icon { font-size: 32px; margin-bottom: $space-sm; }
.kpi-num { font-size: $font-2xl; font-weight: 800; color: $text-primary; margin-bottom: $space-xs; }
.kpi-label { font-size: $font-sm; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
.kpi-desc { font-size: $font-xs; color: $text-hint; line-height: 1.4; }

// Compare Bars
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: $space-base; }
.cg-item { background: #fff; border-radius: $radius-lg; padding: $space-lg; border: 1px solid $border; }
.cgi-label { font-size: $font-sm; font-weight: 600; color: $text-primary; margin-bottom: $space-md; }
.cgi-bars { display: flex; flex-direction: column; gap: $space-md; }
.cgib-name { font-size: 10px; color: $text-hint; display: block; margin-bottom: 3px; }
.cgib-track { height: 28px; background: $gray-100; border-radius: 4px; overflow: hidden; }
.cgib-fill { height: 100%; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; font-size: 10px; font-weight: 600; color: #fff; border-radius: 4px; min-width: 50px;
  &.gray { background: #9ca3af; }
  &.green { background: linear-gradient(90deg, #43A047, #66BB6A); }
}
.cgi-improve { font-size: 14px; font-weight: 700; color: #43A047; margin-top: $space-sm; }

// Value Cards
.value-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-base; }
.vc-card { background: #fff; border-radius: $radius-lg; border: 1px solid $border; overflow: hidden; }
.vcc-header { display: flex; align-items: center; gap: $space-md; padding: $space-base $space-lg; background: $gray-50; border-bottom: 1px solid $border; }
.vcc-icon { font-size: 28px; }
.vcc-title { font-size: $font-base; font-weight: 600; color: $text-primary; }
.vcc-sub { font-size: $font-xs; color: $text-hint; }
.vcc-body { padding: $space-base $space-lg; }
.vccb-item { display: flex; gap: $space-sm; padding: 6px 0; font-size: $font-xs; color: $text-secondary; line-height: 1.5;
  .vccb-bullet { color: $success; flex-shrink: 0; font-weight: 700; }
}

// Data Table
.data-table { width: 100%; border-collapse: collapse; font-size: $font-sm;
  th { background: $gray-50; padding: 10px $space-md; text-align: left; font-weight: 600; color: $text-primary; border-bottom: 2px solid $border; }
  td { padding: 10px $space-md; border-bottom: 1px solid #f0f0f0; color: $text-secondary; }
  tr:hover td { background: $gray-50; }
}
.target-highlight { color: $primary; font-weight: 600; }
.tag { font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 500; }
.tag-green { background: #f0fdf4; color: $success-700; }

// ROI
.roi-summary { display: flex; gap: $space-2xl; }
.rois-item { flex: 1; text-align: center; }
.rois-num { font-size: $font-2xl; font-weight: 800; color: $primary; margin-bottom: $space-xs; }
.rois-label { font-size: $font-sm; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
.rois-desc { font-size: $font-xs; color: $text-hint; line-height: 1.5; }
</style>
