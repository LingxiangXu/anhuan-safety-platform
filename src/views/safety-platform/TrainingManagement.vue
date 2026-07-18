<template>
  <div class="training-management">
    <!-- 标签切换 -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-btn', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >{{ tab.icon }} {{ tab.label }}</button>
    </div>

    <!-- 统计指标 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ trainingPlans.length }}</div>
        <div class="stat-label">📋 培训计划</div>
      </div>
      <div class="stat-card orange">
        <div class="stat-value">{{ stats.inProgress }}</div>
        <div class="stat-label">📖 进行中</div>
      </div>
      <div class="stat-card green">
        <div class="stat-value">{{ stats.avgPass }}%</div>
        <div class="stat-label">📊 平均通过率</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-value">{{ stats.validCerts }}</div>
        <div class="stat-label">✅ 有效证书</div>
      </div>
      <div class="stat-card red">
        <div class="stat-value">{{ stats.warnCerts }}</div>
        <div class="stat-label">⚠️ 到期/过期</div>
      </div>
    </div>

    <!-- 培训计划 -->
    <div class="section-card" v-show="activeTab === 'plan'">
      <div class="section-head">
        <h3 class="section-title">📖 培训计划</h3>
        <span class="section-sub">制定计划、选择课程、分配人员并发布培训，共 {{ trainingPlans.length }} 项</span>
      </div>

      <!-- 流程步骤 -->
      <div class="flow-steps">
        <div v-for="(s, i) in flowLabels" :key="i" :class="['flow-step', { done: i < 2, active: i === 2 }]">
          <div class="step-circle">{{ i < 2 ? '✓' : i + 1 }}</div>
          <div class="step-text">{{ s }}</div>
        </div>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>编号</th><th>培训名称</th><th>类型</th><th>应参加</th><th>已完成</th>
                <th>通过率</th><th>讲师</th><th>考试</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in trainingPlans" :key="p.id" @click="selectPlan(p)" class="clickable">
              <td class="link">{{ p.id }}</td>
              <td>{{ p.name }}</td>
              <td><span class="tag tag-blue">{{ p.type }}</span></td>
              <td>{{ p.people }} 人</td>
              <td>{{ p.completed }} 人</td>
              <td>{{ p.passRate }}</td>
              <td>{{ p.teacher }}</td>
              <td>{{ p.exam }}</td>
              <td><span :class="['tag', getStatusTag(p.status)]">{{ p.status }}</span></td>
              <td><button class="btn-sm" @click.stop="selectPlan(p)">{{ p.step < 4 ? '处理' : '查看' }}</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 培训记录 -->
    <div class="section-card" v-show="activeTab === 'record'">
      <div class="section-head">
        <h3 class="section-title">📝 培训记录</h3>
        <span class="section-sub">按计划、人员、结果查询培训完成情况，共 {{ trainingRecords.length }} 条</span>
      </div>
      <div class="filter-row">
        <select class="filter-select"><option>全部计划</option><option>夏季防暑</option><option>有限空间</option></select>
        <select class="filter-select"><option>全部结果</option><option>通过</option><option>未完成</option></select>
        <button class="btn-sm">查询</button>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>人员</th><th>培训主题</th><th>所属计划</th><th>类型</th><th>日期</th><th>成绩</th><th>结果</th></tr>
          </thead>
          <tbody>
            <tr v-for="r in trainingRecords" :key="r.id">
              <td>{{ r.personName }}</td>
              <td>{{ r.topic }}</td>
              <td>{{ getPlanName(r.planId) }}</td>
              <td><span class="tag tag-blue">{{ r.type }}</span></td>
              <td>{{ r.date }}</td>
              <td>{{ r.score || '-' }}</td>
              <td><span :class="['tag', r.result === '通过' ? 'tag-green' : 'tag-orange']">{{ r.result }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 证书管理 -->
    <div class="section-card" v-show="activeTab === 'cert'">
      <div class="section-head">
        <h3 class="section-title">📜 证书管理</h3>
        <span class="section-sub">特种作业证、安全管理证等资质证书有效期管理，共 {{ certificates.length }} 张证书</span>
      </div>

      <!-- 到期预警 -->
      <div class="alert-bar" v-if="expiringCerts.length > 0">
        ⚠️ 以下证书即将到期或已过期，请及时处理：
        <span v-for="c in expiringCerts" :key="c.id" class="alert-badge">{{ c.personName }} — {{ c.type }}（{{ c.status === 'expired' ? '已过期' : getDaysLeft(c.expiryDate) }}）</span>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>持证人员</th><th>证书类型</th><th>发证日期</th><th>有效期限</th><th>剩余天数</th><th>发证机关</th><th>状态</th><th>备注</th></tr>
          </thead>
          <tbody>
            <tr v-for="c in certificates" :key="c.id" :class="getCertRowClass(c)">
              <td>{{ c.personName }}</td>
              <td>{{ c.type }}</td>
              <td>{{ c.issueDate }}</td>
              <td>{{ c.expiryDate }}</td>
              <td :class="{ 'text-danger': getDaysLeftNum(c.expiryDate) <= 30 }">
                <strong>{{ getDaysLeft(c.expiryDate) }}</strong>
              </td>
              <td>{{ c.issuingAuthority }}</td>
              <td><span :class="['tag', getCertTag(c.status)]">{{ getCertLabel(c.status) }}</span></td>
              <td class="text-hint">{{ c.remarks || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 培训详情抽屉 -->
    <div v-if="selectedPlan" class="drawer-mask" @click="selectedPlan = null"></div>
    <div v-if="selectedPlan" class="drawer">
      <div class="drawer-head">
        <div>
          <h2 class="drawer-title">{{ selectedPlan.name }}</h2>
          <span class="drawer-sub">{{ selectedPlan.id }} · {{ selectedPlan.status }}</span>
        </div>
        <button class="close-btn" @click="selectedPlan = null">✕</button>
      </div>
      <div class="drawer-body">
        <div class="detail-grid-3">
          <div class="detail-item"><dt>培训类型</dt><dd>{{ selectedPlan.type }}</dd></div>
          <div class="detail-item"><dt>时间</dt><dd>{{ selectedPlan.startDate }} ~ {{ selectedPlan.endDate }}</dd></div>
          <div class="detail-item"><dt>讲师</dt><dd>{{ selectedPlan.teacher }}</dd></div>
          <div class="detail-item"><dt>应参加</dt><dd>{{ selectedPlan.people }} 人</dd></div>
          <div class="detail-item"><dt>已完成</dt><dd>{{ selectedPlan.completed }} 人</dd></div>
          <div class="detail-item"><dt>通过率</dt><dd>{{ selectedPlan.passRate }}</dd></div>
        </div>

        <h4 class="sec-title">🎯 培训内容</h4>
        <p class="content-text">{{ selectedPlan.content }}</p>

        <h4 class="sec-title">👥 目标部门</h4>
        <div class="dept-tags">
          <span v-for="d in selectedPlan.targetDepts" :key="d" class="tag tag-blue">{{ d }}</span>
        </div>

        <h4 class="sec-title">📊 完成进度</h4>
        <div class="progress-bar">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: (selectedPlan.completed / selectedPlan.people * 100) + '%' }"></div>
          </div>
          <span class="progress-text">{{ Math.round(selectedPlan.completed / selectedPlan.people * 100) }}%</span>
        </div>

        <h4 class="sec-title">📝 学习记录</h4>
        <table class="data-table">
          <thead><tr><th>人员</th><th>日期</th><th>成绩</th><th>结果</th></tr></thead>
          <tbody>
            <tr v-for="r in getPlanRecords(selectedPlan.id)" :key="r.id">
              <td>{{ r.personName }}</td>
              <td>{{ r.date }}</td>
              <td>{{ r.score || '-' }}</td>
              <td><span :class="['tag', r.result === '通过' ? 'tag-green' : 'tag-orange']">{{ r.result }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="drawer-foot">
        <button class="btn-action" @click="selectedPlan = null">关闭</button>
        <button v-if="selectedPlan.step < 4" class="btn-action primary" @click="advancePlan(selectedPlan)">{{ ['发布', '推进至学习签到', '推进至归档'][selectedPlan.step - 1] || '推进' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { trainingPlans, trainingRecords, certificates } from '@/store/safeData'

export default {
  name: 'TrainingManagement',
  data() {
    return {
      activeTab: 'plan',
      tabs: [
        { key: 'plan', label: '培训计划', icon: '📖' },
        { key: 'record', label: '培训记录', icon: '📝' },
        { key: 'cert', label: '证书管理', icon: '📜' }
      ],
      flowLabels: ['制定计划', '分配人员', '学习签到', '考试评分', '形成档案'],
      trainingPlans,
      trainingRecords,
      certificates,
      selectedPlan: null
    }
  },
  computed: {
    stats() {
      let inProgress = 0, avgPass = 0, passCount = 0
      this.trainingPlans.forEach(p => {
        if (p.status === '进行中') inProgress++
        if (p.passRate !== '-') { passCount++; avgPass += parseInt(p.passRate) }
      })
      const validCerts = this.certificates.filter(c => c.status === 'valid').length
      const warnCerts = this.certificates.filter(c => c.status !== 'valid').length
      return { inProgress, avgPass: passCount ? Math.round(avgPass / passCount) : 0, validCerts, warnCerts }
    },
    expiringCerts() {
      return this.certificates.filter(c => c.status !== 'valid')
    }
  },
  methods: {
    selectPlan(p) { this.selectedPlan = p },
    getStatusTag(status) {
      return { '待发布': 'tag-gray', '进行中': 'tag-blue', '待归档': 'tag-orange', '已归档': 'tag-green' }[status] || 'tag-gray'
    },
    getPlanName(planId) {
      const p = this.trainingPlans.find(x => x.id === planId)
      return p ? p.name : planId
    },
    getPlanRecords(planId) {
      return this.trainingRecords.filter(r => r.planId === planId)
    },
    getDaysLeft(expiryDate) {
      const now = new Date()
      const exp = new Date(expiryDate)
      const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))
      if (days < 0) return '已过期 ' + Math.abs(days) + ' 天'
      if (days <= 30) return '剩余 ' + days + ' 天'
      return '还有 ' + days + ' 天'
    },
    getDaysLeftNum(expiryDate) {
      return Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
    },
    getCertTag(status) {
      return { valid: 'tag-green', expiring: 'tag-orange', expired: 'tag-red' }[status] || 'tag-gray'
    },
    getCertLabel(status) {
      return { valid: '有效', expiring: '即将到期', expired: '已过期' }[status] || status
    },
    getCertRowClass(cert) {
      if (cert.status === 'expired') return 'row-expired'
      if (cert.status === 'expiring') return 'row-expiring'
      return ''
    },
    advancePlan(plan) {
      plan.step++
      const statuses = ['', '进行中', '进行中', '待归档', '已归档']
      plan.status = statuses[plan.step] || '已归档'
      if (plan.step >= 3) plan.completed = plan.people
      alert('✅ ' + plan.name + ' 已推进至：' + plan.status)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.tab-bar {
  display: inline-flex; gap: 4px; margin-bottom: $space-lg;
  background: #fff; border-radius: $radius-lg; padding: 4px; box-shadow: $shadow-sm;
}
.tab-btn {
  padding: 8px 20px; border: 0; background: transparent;
  border-radius: $radius-base; cursor: pointer; font-size: $font-base; color: $text-secondary;
  transition: all .18s;
  &.active { background: $primary; color: #fff; }
  &:hover:not(.active) { background: $bg-page; color: $text-primary; }
}

.stats-row {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: $space-md; margin-bottom: $space-lg;
}
.stat-card {
  background: #fff; padding: $space-md $space-lg; border-radius: $radius-lg;
  text-align: center; box-shadow: $shadow-sm; border-left: 3px solid $border;
  &.orange { border-color: $warning-500; }
  &.green { border-color: $accent-green; }
  &.blue { border-color: $primary; }
  &.red { border-color: $danger; }
}
.stat-value { font-size: 28px; font-weight: 800; color: $text-primary; }
.stat-label { font-size: $font-xs; color: $text-secondary; margin-top: 4px; }

.section-card {
  background: #fff; border-radius: $radius-lg; box-shadow: $shadow-sm;
  margin-bottom: $space-lg; overflow: hidden;
}
.section-head {
  padding: $space-md $space-lg; border-bottom: 1px solid $border;
  display: flex; align-items: baseline; gap: $space-md;
}
.section-title { font-size: $font-lg; font-weight: 700; color: $text-primary; }
.section-sub { font-size: $font-xs; color: $text-secondary; }

/* Flow */
.flow-steps {
  display: flex; align-items: flex-start; padding: $space-lg $space-xl;
  overflow-x: auto; gap: 0;
}
.flow-step {
  flex: 1; min-width: 90px; text-align: center; position: relative;
  &:not(:last-child)::after {
    content: ''; position: absolute; top: 19px; left: calc(50% + 22px); right: calc(-50% + 22px);
    height: 2px; background: $border;
  }
  &.done:not(:last-child)::after { background: $accent-green; }
}
.step-circle {
  width: 38px; height: 38px; border: 2px solid $border; background: #fff;
  border-radius: 50%; margin: 0 auto 6px; display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: $text-secondary; position: relative; z-index: 1;
}
.flow-step.done .step-circle { background: $accent-green; border-color: $accent-green; color: #fff; }
.flow-step.active .step-circle { background: $primary; border-color: $primary; color: #fff; box-shadow: 0 0 0 5px $primary-light; }
.step-text { font-size: $font-xs; font-weight: 600; color: $text-secondary; }
.flow-step.active .step-text { color: $primary; }

.table-wrap { overflow-x: auto; }
.data-table {
  width: 100%; border-collapse: collapse;
  th {
    background: $bg-page; color: $text-secondary; font-size: $font-xs; font-weight: 600;
    text-align: left; padding: 10px 12px; white-space: nowrap;
    &:first-child { padding-left: $space-lg; }
    &:last-child { padding-right: $space-lg; }
  }
  td {
    padding: 10px 12px; border-bottom: 1px solid $border; font-size: $font-sm;
    white-space: nowrap;
    &:first-child { padding-left: $space-lg; }
    &:last-child { padding-right: $space-lg; }
  }
  tr.clickable { cursor: pointer; transition: background .12s; }
  tr.clickable:hover { background: $bg-page; }
  tr:last-child td { border-bottom: none; }
  tr.row-expired { background: $danger-100; }
  tr.row-expiring { background: #fffbeb; }
}

.link { color: $primary; font-weight: 500; cursor: pointer; }

.tag {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: $radius-sm; font-size: $font-xs; font-weight: 600;
}
.tag-red { background: $danger-100; color: $danger; }
.tag-orange { background: #fff7ed; color: $warning-500; }
.tag-yellow { background: #fffbeb; color: #b7791f; }
.tag-blue { background: #e8f0fe; color: $primary; }
.tag-green { background: $success-100; color: $accent-green; }
.tag-gray { background: $bg-page; color: $text-secondary; }

.text-danger { color: $danger; }
.text-hint { color: $text-secondary; }

.btn-sm {
  padding: 4px 10px; border: 1px solid $border; background: #fff;
  border-radius: $radius-sm; font-size: $font-xs; cursor: pointer; color: $primary;
  &:hover { border-color: $primary; background: $primary-light; }
}

.filter-row { display: flex; gap: $space-sm; align-items: center; padding: $space-md $space-lg; }
.filter-select {
  padding: 5px 10px; border: 1px solid $border; border-radius: $radius-base;
  font-size: $font-xs; outline: none; min-width: 120px;
  &:focus { border-color: $primary; }
}

.alert-bar {
  margin: $space-md $space-lg; padding: 10px 14px;
  background: #fffbeb; border: 1px solid $warning-400; border-radius: $radius-base;
  font-size: $font-sm; color: #92400e; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
}
.alert-badge {
  padding: 2px 8px; background: #fef3c7; border-radius: 999px; font-size: $font-xs; white-space: nowrap;
}

/* Detail Drawer */
.drawer-mask {
  position: fixed; inset: 0; background: rgba(15, 23, 42, .36); z-index: 90;
}
.drawer {
  position: fixed; inset: 0 0 0 auto; width: min(720px, 94vw);
  background: #fff; z-index: 91; box-shadow: -16px 0 48px rgba(15, 23, 42, .16);
  display: flex; flex-direction: column; overflow-y: auto;
}
.drawer-head {
  padding: 20px 24px; border-bottom: 1px solid $border;
  display: flex; align-items: flex-start; justify-content: space-between;
}
.drawer-title { font-size: $font-xl; font-weight: 800; }
.drawer-sub { font-size: $font-xs; color: $text-secondary; display: block; margin-top: 4px; }
.close-btn {
  width: 30px; height: 30px; border: 0; background: $bg-page; border-radius: 50%;
  cursor: pointer; font-size: 18px; color: $text-secondary; line-height: 1;
}
.drawer-body { padding: 20px 24px; flex: 1; }
.drawer-foot { padding: 14px 24px; border-top: 1px solid $border; display: flex; gap: 8px; justify-content: flex-end; }

.detail-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-md; margin-bottom: $space-lg; }
.detail-item {
  padding: $space-sm $space-md; background: $bg-page; border-radius: $radius-base;
  dt { font-size: $font-xs; color: $text-secondary; margin-bottom: 4px; }
  dd { font-size: $font-sm; font-weight: 600; color: $text-primary; }
}
.sec-title { font-size: $font-base; font-weight: 800; color: $text-primary; margin: $space-lg 0 $space-md; padding-left: 9px; border-left: 3px solid $primary; }
.content-text { font-size: $font-sm; color: $text-secondary; line-height: 1.8; }
.dept-tags { display: flex; gap: $space-sm; flex-wrap: wrap; }

.progress-bar { display: flex; align-items: center; gap: $space-md; }
.progress-track { flex: 1; height: 10px; background: $bg-page; border-radius: 999px; overflow: hidden; }
.progress-fill { height: 100%; background: $primary; border-radius: 999px; transition: width .3s; }
.progress-text { font-size: $font-sm; font-weight: 700; color: $primary; }

.btn-action {
  padding: 8px 18px; border-radius: 999px; border: 1px solid $border;
  background: #fff; cursor: pointer; font-size: $font-sm; transition: .15s;
  &.primary { background: $primary; color: #fff; border-color: $primary; }
  &.primary:hover { background: $primary-dark; }
  &:hover:not(.primary) { border-color: $primary; color: $primary; }
}
</style>
