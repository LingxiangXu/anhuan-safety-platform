<template>
  <div class="roles-page">
    <div class="page-header"><h2>角色与终端</h2><p class="page-subtitle">6类角色 · PC与移动双终端 · 权限穿透不越界</p></div>

    <section class="ov-section">
      <h3 class="section-title">组织与数据范围</h3>
      <div class="section-card">
        <table class="role-table">
          <thead><tr><th>组织层级</th><th>数据范围</th><th>日常业务责任</th></tr></thead>
          <tbody>
            <tr><td><strong>太重集团</strong></td><td>查看全部组织及明细</td><td>集团安环可发起/跟踪/关闭集团级督办；集团领导只查看和下钻</td></tr>
            <tr><td>太原重工</td><td>查看本公司及下属各分子公司</td><td>只办理本公司所属事项，不代替下级公司办理其事项</td></tr>
            <tr><td>太原重工各分子公司</td><td>查看并办理本公司事项</td><td>在本公司内部完成隐患、作业、人员和台账管理</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">角色职责矩阵</h3>
      <div class="section-card">
        <table class="role-table">
          <thead><tr><th>角色</th><th>主要终端</th><th>权限</th><th>关键动作</th></tr></thead>
          <tbody>
            <tr>
              <td><span class="role-icon">👨‍💼</span> 集团领导</td><td><span class="tag tag-blue">📊 驾驶舱端</span></td><td><span class="tag tag-gray">全集团只读</span></td>
              <td>看驾驶舱、四色图、下钻异常和督办成效</td>
            </tr>
            <tr>
              <td><span class="role-icon">👮</span> 集团安环管理人员</td><td><span class="tag tag-gray">💻 PC端</span></td><td><span class="tag tag-orange">督办权限</span></td>
              <td>发起、催办、查看反馈、关闭集团级督办</td>
            </tr>
            <tr>
              <td><span class="role-icon">👨‍⚖️</span> 分子公司领导/授权审批领导</td><td><span class="tag tag-gray">💻 PC端</span></td><td><span class="tag tag-blue">审批权限</span></td>
              <td>查看本分子公司态势；完成本分子公司内特殊作业审批</td>
            </tr>
            <tr>
              <td><span class="role-icon">👨‍🔬</span> 分子公司安环管理人员</td><td><span class="tag tag-gray">💻 PC端</span></td><td><span class="tag tag-blue">管理权限</span></td>
              <td>风险管理、隐患受理/复查、作业审核、归档</td>
            </tr>
            <tr>
              <td><span class="role-icon">👷</span> 车间/部门负责人</td><td><span class="tag tag-gray">💻 PC端</span></td><td><span class="tag tag-blue">执行权限</span></td>
              <td>发起事项、推进整改、管理部门作业与人员</td>
            </tr>
            <tr>
              <td><span class="role-icon">👨‍🏭</span> 现场人员/监护人</td><td><span class="tag tag-green">📱 移动端</span></td><td><span class="tag tag-green">现场权限</span></td>
              <td>巡检、拍照上报、整改反馈、开工/监护确认</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">关键权限原则</h3>
      <div class="principle-box">
        <div class="p-item"><span class="p-num">01</span> <div><strong>能看见不等于能办理</strong><p>数据权限按集团—二级—三级穿透可见；业务流程始终由事项所属公司及其内部组织完成。</p></div></div>
        <div class="p-item"><span class="p-num">02</span> <div><strong>集团督办独立于原业务流程</strong><p>集团安环对重大或逾期事项发起督办，督办为关联原单的独立单据，不替代所属公司办理原业务。</p></div></div>
        <div class="p-item"><span class="p-num">03</span> <div><strong>角色切换数据隔离</strong><p>切换角色后，组织树、数据范围、按钮权限和待办数量保持一致；上级只能查看下级数据，不能代办原单。</p></div></div>
      </div>
    </section>

    <section class="ov-section">
      <h3 class="section-title">示例：铸锻件分公司</h3>
      <div class="dept-grid">
        <div class="dept-card" v-for="d in depts" :key="d.name">
          <span class="dept-icon">🏭</span>
          <span class="dept-name">{{ d.name }}</span>
          <span class="dept-zone">关联区域：{{ d.zone }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { departments } from '@/store/safeData';
export default {
  name: 'Roles',
  data() {
    return { depts: JSON.parse(JSON.stringify(departments)) };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.roles-page { max-width: 900px; }
.page-header {
  margin-bottom: $space-2xl;
  h2 { font-size: $font-2xl; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; }
}
.ov-section { margin-bottom: $space-2xl; }
.section-title { font-size: $font-md; font-weight: 600; color: $text-primary; margin-bottom: $space-md; padding-left: 12px; border-left: 3px solid $primary; }
.section-card { background: #fff; border-radius: $radius-lg; padding: $space-lg $space-xl; border: 1px solid $border; }

.role-table {
  width: 100%; border-collapse: collapse; font-size: $font-sm;
  th { background: $gray-50; padding: 10px $space-md; text-align: left; font-weight: 600; color: $text-primary; border-bottom: 2px solid $border; }
  td { padding: 10px $space-md; border-bottom: 1px solid #f0f0f0; color: $text-secondary; }
  tr:hover td { background: $gray-50; }
}
.role-icon { margin-right: 4px; }

.principle-box { display: flex; flex-direction: column; gap: $space-base; }
.p-item { display: flex; gap: $space-base; padding: $space-base; background: $gray-50; border-radius: $radius-base; align-items: flex-start;
  .p-num { width: 28px; height: 28px; border-radius: $radius-sm; background: $primary-bg; color: $primary; font-weight: 600; font-size: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  strong { font-size: $font-sm; color: $text-primary; display: block; margin-bottom: 2px; }
  p { font-size: $font-xs; color: $text-secondary; }
}

.dept-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-sm; }
.dept-card {
  background: $gray-50; border-radius: $radius-base; padding: $space-base; text-align: center; border: 1px solid $border;
  .dept-icon { font-size: 20px; display: block; margin-bottom: 4px; }
  .dept-name { font-size: $font-sm; font-weight: 500; color: $text-primary; display: block; }
  .dept-zone { font-size: 10px; color: $text-hint; }
}
</style>
