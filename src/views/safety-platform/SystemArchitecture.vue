<template>
  <div class="arch-page">
    <div class="page-header">
      <h2>平台架构</h2>
      <p class="page-subtitle">业务应用 · 协同工作 · 数字底座</p>
    </div>

    <section class="ov-section">
      <h3 class="section-title">架构分层</h3>
      <div class="arch-layers">
        <div class="arch-layer layer-app">
          <div class="layer-label">业务应用层</div>
          <div class="layer-items">
            <span class="layer-tag">目标职责</span><span class="layer-tag">制度化管理</span><span class="layer-tag">教育培训</span>
            <span class="layer-tag">现场管理</span><span class="layer-tag">风险管理</span>
            <span class="layer-tag">BPM审批对接</span><span class="layer-tag">隐患治理</span>
            <span class="layer-tag">持续改进</span><span class="layer-tag">系统管理</span>
          </div>
        </div>
        <div class="arch-arrow">&darr;</div>
        <div class="arch-layer layer-collab">
          <div class="layer-label">协同工作层</div>
          <div class="layer-items">
            <span class="layer-tag green">流程引擎</span><span class="layer-tag green">消息通知</span>
            <span class="layer-tag green">权限管理</span><span class="layer-tag green">组织架构</span>
            <span class="layer-tag green">待办中心</span><span class="layer-tag green">操作日志</span>
          </div>
        </div>
        <div class="arch-arrow">&darr;</div>
        <div class="arch-layer layer-data">
          <div class="layer-label">数字底座</div>
          <div class="layer-items">
            <span class="layer-tag orange">风险数据库</span><span class="layer-tag orange">隐患台账</span>
            <span class="layer-tag orange">人员档案</span><span class="layer-tag orange">作业档案</span>
            <span class="layer-tag orange">证照库</span><span class="layer-tag orange">法规库</span>
          </div>
        </div>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">技术架构要求</h3>
      <div class="section-card">
        <table class="arch-table">
          <thead><tr><th>层面</th><th>要求</th></tr></thead>
          <tbody>
            <tr><td>部署方式</td><td>本地化部署，无需外网、外部地图或公共 CDN</td></tr>
            <tr><td>数据管理</td><td>所有页面从同一业务状态源读取，操作同步联动</td></tr>
            <tr><td>角色权限</td><td>数据可见性按组织层级穿透，业务办理限事项所属组织</td></tr>
            <tr><td>离线支持</td><td>系统可在无外网环境中运行，所有资产随包携带</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
export default { name: 'SystemArchitecture' };
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.arch-page { max-width: 900px; }
.page-header {
  margin-bottom: $space-2xl;
  h2 { font-size: $font-2xl; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; }
}
.ov-section { margin-bottom: $space-2xl; }
.section-title {
  font-size: $font-md; font-weight: 600; color: $text-primary;
  margin-bottom: $space-md; padding-left: 12px; border-left: 3px solid $primary;
}
.section-card { background: #fff; border-radius: $radius-lg; padding: $space-lg $space-xl; border: 1px solid $border; }

.arch-layers { display: flex; flex-direction: column; align-items: center; gap: $space-sm; }
.arch-layer {
  width: 100%; max-width: 680px; border-radius: $radius-lg; padding: $space-lg;
  display: flex; flex-direction: column; gap: $space-sm;
  &.layer-app { background: #e8f0fe; border: 1px solid #b5d4f4; }
  &.layer-collab { background: $success-100; border: 1px solid #a7f3d0; }
  &.layer-data { background: #fffbeb; border: 1px solid #fde68a; }
}
.layer-label { font-size: $font-base; font-weight: 600; color: $text-primary; }
.layer-items { display: flex; gap: $space-sm; flex-wrap: wrap; }
.layer-tag {
  font-size: $font-xs; padding: 3px 10px; border-radius: 20px;
  background: $primary-bg; color: $primary;
  &.green { background: $success-100; color: $success-700; }
  &.orange { background: #fffbeb; color: #92400e; }
}
.arch-arrow { font-size: 18px; color: $text-hint; }

.arch-table { width: 100%; border-collapse: collapse; font-size: $font-sm;
  th { background: $gray-50; padding: 10px $space-md; text-align: left; font-weight: 600; color: $text-primary; border-bottom: 2px solid $border; }
  td { padding: 10px $space-md; border-bottom: 1px solid #f0f0f0; color: $text-secondary; }
}
</style>
