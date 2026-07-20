<template>
  <div class="major-hazard">
    <div class="page-header">
      <h1 class="page-title">☢️ 重大危险源管理</h1>
      <p class="page-subtitle">依据 GB 18218-2018《危险化学品重大危险源辨识》与总局令第40号，对重大危险源实施辨识登记、在线监测、定期评估、预案演练、备案告知全周期管控</p>
    </div>

    <!-- 标签切换 -->
    <div class="tab-bar">
      <button v-for="tab in tabs" :key="tab.key" :class="['tab-btn', { active: activeTab === tab.key }]" @click="activeTab = tab.key">{{ tab.label }}</button>
    </div>

    <!-- 全生命周期流程步骤条 -->
    <div class="lifecycle-chain" v-if="selected">
      <div class="chain-header">
        <span>🔄 重大危险源全生命周期</span>
        <span class="chain-badge" :class="'badge-step-' + lifecycleStatus">{{ lifecycleStatusLabel }}</span>
      </div>
      <div class="chain-track">
        <div class="chain-fill" :style="{ width: lifecycleProgress + '%' }"></div>
        <div v-for="(step, i) in lifecycleSteps" :key="step.key"
          :class="['chain-node', { done: step.done, active: step.active }]">
          <div class="node-circle">
            <span v-if="step.done">✓</span>
            <span v-else-if="step.active" class="pulse-dot"></span>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <div class="node-text">
            <div class="node-label">{{ step.label }}</div>
            <div class="node-role">{{ step.role }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计指标 V2 -->
    <div class="stat-gallery-mh">
      <div class="mh-stat" v-for="s in mhStats" :key="s.label">
        <div class="mh-glow" :style="{ background: s.grad }"></div>
        <div class="mh-icon" :style="{ background: s.grad }">{{ s.icon }}</div>
        <div class="mh-body">
          <span class="mh-value" :style="{ color: s.color }">{{ s.value }}</span>
          <span class="mh-label">{{ s.label }}</span>
        </div>
        <div class="mh-border" :style="{ background: s.grad }"></div>
      </div>
    </div>

    <!-- 危险源列表 -->
    <div class="source-list-bar">
      <button v-for="s in sources" :key="s.id" :class="['source-chip', { active: selectedId === s.id }]" @click="selectSource(s.id)">
        <span :class="'dot dot-' + getLevelClass(s.level)">⬤</span>
        <span class="chip-label">{{ s.name }}</span>
        <span :class="'chip-tag tag-' + getLevelClass(s.level)">{{ s.level }}</span>
        <span class="chip-status" v-if="s.status !== '正常'" :class="s.status === '报警' ? 'status-alarm' : 'status-warn'">{{ s.status }}</span>
      </button>
    </div>

    <template v-if="selected">
      <!-- 1. 辨识登记 -->
      <div class="section-card" v-show="activeTab === 'identify'">
        <div class="section-head"><h3 class="section-title">📋 辨识与登记</h3></div>
        <div class="section-body">
          <!-- 基本信息 -->
          <div class="info-grid-4">
            <div class="info-item"><label>危险源编号</label><span class="link">{{ selected.id }}</span></div>
            <div class="info-item"><label>危险源名称</label><span class="fw-700">{{ selected.name }}</span></div>
            <div class="info-item"><label>所在位置</label><span>{{ selected.location }}</span></div>
            <div class="info-item"><label>所属部门</label><span>{{ selected.deptName }}</span></div>
            <div class="info-item"><label>责任人</label><span>{{ selected.responsibleName }}</span></div>
            <div class="info-item"><label>安环监管人</label><span>{{ selected.supervisorName }}</span></div>
            <div class="info-item"><label>辨识日期</label><span>{{ selected.classification.identifiedDate }}</span></div>
            <div class="info-item"><label>辨识机构</label><span>{{ selected.classification.identifiedBy }}</span></div>
          </div>

          <!-- 危险物质清单 -->
          <h4 class="sec-title">🧪 危险物质清单（GB 18218-2018 表1 / 表2）</h4>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>物质名称</th><th>CAS号</th><th>危险类别</th><th>最大存在量 (t)</th><th>临界量 (t)</th><th>q/Q 比值</th><th>占比</th></tr></thead>
              <tbody>
                <tr v-for="(s, i) in selected.substances" :key="i">
                  <td class="fw-600">{{ s.name }}</td>
                  <td class="mono">{{ s.casNo }}</td>
                  <td>{{ s.hazardType }}</td>
                  <td>{{ s.maxQty }}</td>
                  <td>{{ s.threshold }}</td>
                  <td class="fw-700" :class="s.ratio >= 1 ? 'text-red' : 'text-orange'">{{ s.ratio.toFixed(3) }}</td>
                  <td><div class="ratio-bar"><div class="ratio-fill" :style="{ width: (Math.min(s.ratio, 3) / 3 * 100) + '%', background: s.ratio >= 1 ? '#ef4444' : s.ratio >= 0.5 ? '#f59e0b' : '#3b82f6' }"></div></div></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- R值计算与分级 -->
          <div class="r-result">
            <div class="r-left">
              <div class="r-formula-title">R 值计算</div>
              <div class="r-formula">R = Σ(qᵢ / Qᵢ) × α</div>
              <div class="r-detail">{{ selected.R_formula }}</div>
            </div>
            <div class="r-right">
              <div class="r-value-wrap">
                <span class="r-value" :style="{ color: rColor }">R = {{ selected.R_value }}</span>
              </div>
              <div class="r-level" :style="{ background: rColor + '18', borderColor: rColor }">
                <span :style="{ color: rColor, fontSize: '20px', fontWeight: 800 }">{{ selected.level }}重大危险源</span>
                <span class="r-range">（{{ selected.classification.R_range }}）</span>
              </div>
              <div class="r-basis">判定依据：{{ selected.classification.basis }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 在线监测看板 -->
      <div class="section-card" v-show="activeTab === 'monitor'">
        <div class="section-head"><h3 class="section-title">📡 在线监测看板</h3><span class="section-sub">数据更新时间：{{ selected.monitoring.params[0].updateTime }}</span></div>
        <div class="section-body">
          <!-- 监测参数卡片 -->
          <div class="monitor-grid">
            <div class="monitor-card" v-for="p in selected.monitoring.params" :key="p.id" :class="'monitor-' + p.status">
              <div class="monitor-head">
                <span class="monitor-name">{{ p.name }}</span>
                <span :class="'monitor-badge badge-' + p.status">{{ { normal: '正常', warn: '预警', alarm: '报警' }[p.status] }}</span>
              </div>
              <div class="monitor-value-wrap">
                <span class="monitor-value" :class="'text-' + p.status">{{ p.current }}</span>
                <span class="monitor-unit">{{ p.unit }}</span>
              </div>
              <div class="monitor-trend" v-if="p.trend === 'up'">📈 上升趋势</div>
              <div class="monitor-trend stable" v-else>➡️ 稳定</div>
              <div class="monitor-thresholds">
                <span v-if="p.lowWarn !== null" class="thr thr-low">▼ 下限 {{ p.lowWarn }}{{ p.unit }}</span>
                <span v-if="p.highWarn !== null" class="thr thr-high">▲ 上限 {{ p.alarm }}{{ p.unit }}</span>
              </div>
            </div>
          </div>

          <!-- 视频监控 -->
          <h4 class="sec-title">📹 视频监控点位</h4>
          <div class="video-grid">
            <div class="video-card" v-for="v in selected.monitoring.videoSources" :key="v.id">
              <div class="video-preview">
                <span class="video-icon">📷</span>
                <span class="video-name">{{ v.name }}</span>
              </div>
              <div class="video-info">
                <span class="tag tag-green" v-if="v.status === 'online'">在线</span>
                <span class="tag tag-gray" v-else>离线</span>
                <span class="video-check">最近检查：{{ v.lastCheck }}</span>
              </div>
            </div>
          </div>

          <!-- 报警历史 -->
          <h4 class="sec-title">🚨 报警历史</h4>
          <div v-if="selected.monitoring.alarmHistory.length === 0" class="empty-hint">暂无报警记录</div>
          <div class="table-wrap" v-else>
            <table class="data-table">
              <thead><tr><th>时间</th><th>监测参数</th><th>异常值</th><th>级别</th><th>处置人</th><th>处置结果</th></tr></thead>
              <tbody>
                <tr v-for="(a, i) in selected.monitoring.alarmHistory" :key="i">
                  <td>{{ a.time }}</td><td>{{ a.param }}</td>
                  <td class="fw-600 text-red">{{ a.value }}</td>
                  <td><span :class="['tag', a.level === '报警' ? 'tag-red' : 'tag-orange']">{{ a.level }}</span></td>
                  <td>{{ a.handler }}</td><td>{{ a.action }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 3. 安全评估报告 -->
      <div class="section-card" v-show="activeTab === 'assess'">
        <div class="section-head"><h3 class="section-title">📑 安全评估报告</h3></div>
        <div class="section-body">
          <div class="assess-card" :class="{ 'assess-expiring': isAssessExpiring }">
            <div class="assess-left">
              <div class="assess-report-no">{{ selected.safetyAssessment.reportNo }}</div>
              <div class="info-grid-3">
                <div class="info-item"><label>评估机构</label><span>{{ selected.safetyAssessment.agency }}</span></div>
                <div class="info-item"><label>评估日期</label><span>{{ selected.safetyAssessment.assessDate }}</span></div>
                <div class="info-item"><label>有效期至</label><span class="fw-700" :class="isAssessExpiring ? 'text-orange' : 'text-green'">{{ selected.safetyAssessment.validUntil }}</span></div>
                <div class="info-item"><label>下次评估</label><span>{{ selected.safetyAssessment.nextAssessDate }}</span></div>
                <div class="info-item"><label>报告状态</label><span class="tag tag-green">{{ selected.safetyAssessment.status }}</span></div>
                <div class="info-item"><label>评估结论</label><span class="text-green">{{ selected.safetyAssessment.conclusion }}</span></div>
              </div>
            </div>
            <div class="assess-right">
              <div class="assess-deadline">
                <div class="deadline-label">距到期</div>
                <div class="deadline-days" :class="isAssessExpiring ? 'text-red' : ''">{{ assessDaysLeft }}</div>
                <div class="deadline-unit">天</div>
              </div>
              <div class="assess-file" v-if="selected.safetyAssessment.attachment">
                <span>📎 {{ selected.safetyAssessment.attachment }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. 应急预案与演练 -->
      <div class="section-card" v-show="activeTab === 'plan'">
        <div class="section-head"><h3 class="section-title">🆘 应急预案与演练</h3></div>
        <div class="section-body">
          <div class="info-grid-3">
            <div class="info-item"><label>预案名称</label><span class="fw-700">{{ selected.emergencyPlan.planName }}</span></div>
            <div class="info-item"><label>预案编号</label><span>{{ selected.emergencyPlan.planNo }}</span></div>
            <div class="info-item"><label>发布日期</label><span>{{ selected.emergencyPlan.issueDate }}</span></div>
            <div class="info-item"><label>下次演练</label><span class="fw-700" :class="isDrillOverdue ? 'text-red' : 'text-green'">{{ selected.emergencyPlan.nextDue }}</span></div>
            <div class="info-item"><label>演练记录</label><span>{{ selected.emergencyPlan.drills.length }} 次</span></div>
            <div class="info-item"><label>法定频次</label><span class="tag tag-blue">每半年一次</span></div>
          </div>

          <!-- 演练记录 -->
          <h4 class="sec-title">🏋️ 演练记录</h4>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>演练日期</th><th>类型</th><th>参与人数</th><th>时长</th><th>结果</th><th>发现问题</th><th>改进措施</th></tr></thead>
              <tbody>
                <tr v-for="(d, i) in selected.emergencyPlan.drills" :key="i">
                  <td>{{ d.date }}</td>
                  <td><span class="tag tag-blue">{{ d.type }}</span></td>
                  <td>{{ d.participants }}</td><td>{{ d.duration }}</td>
                  <td><span :class="['tag', d.result === '合格' ? 'tag-green' : 'tag-orange']">{{ d.result }}</span></td>
                  <td>{{ d.issues || '-' }}</td><td>{{ d.improvements || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 应急物资 -->
          <h4 class="sec-title">🧯 应急物资清单</h4>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>物资名称</th><th>数量</th><th>存放位置</th><th>上次检查</th></tr></thead>
              <tbody>
                <tr v-for="(s, i) in selected.emergencyPlan.supplies" :key="i">
                  <td>{{ s.name }}</td><td>{{ s.qty }}</td><td>{{ s.location }}</td>
                  <td><span class="tag tag-green">{{ s.lastCheck }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 5. 告知牌与备案 -->
      <div class="section-card" v-show="activeTab === 'notify'">
        <div class="section-head"><h3 class="section-title">📢 告知牌与政府备案</h3></div>
        <div class="section-body">
          <!-- 告知牌 -->
          <h4 class="sec-title">🪧 重大危险源告知牌</h4>
          <div class="notify-board" :class="'board-' + getLevelClass(selected.level)">
            <div class="notify-board-head">重大危险源告知牌</div>
            <div class="notify-board-body">
              <div class="notify-row"><span class="notify-label">危险源名称</span><span class="notify-val">{{ selected.name }}</span></div>
              <div class="notify-row"><span class="notify-label">危险等级</span><span :class="'notify-val notify-level-' + getLevelClass(selected.level)">{{ selected.level }}</span></div>
              <div class="notify-row"><span class="notify-label">有害因素</span><span class="notify-val">{{ selected.substances.map(s => s.hazardType.split('·')[0]).join('、') }}</span></div>
              <div class="notify-row"><span class="notify-label">最大储量</span><span class="notify-val">{{ selected.substances.reduce((sum, s) => sum + s.maxQty, 0).toFixed(2) }} 吨</span></div>
              <div class="notify-row"><span class="notify-label">责任人</span><span class="notify-val">{{ selected.responsibleName }}</span></div>
              <div class="notify-row"><span class="notify-label">应急电话</span><span class="notify-val">0351-636XXXX（24小时）</span></div>
              <div class="notify-row full"><span class="notify-label">应急措施</span><span class="notify-val">1. 立即疏散周边人员  2. 关闭相关阀门/电源  3. 拨打119/120  4. 启动应急预案</span></div>
            </div>
          </div>

          <div class="notify-meta">
            <div class="info-grid-3">
              <div class="info-item"><label>告知牌状态</label><span class="tag tag-green">{{ selected.notification.boardStatus }}</span></div>
              <div class="info-item"><label>设置位置</label><span>{{ selected.notification.boardLocation }}</span></div>
              <div class="info-item"><label>最后更新</label><span>{{ selected.notification.lastUpdated }}</span></div>
            </div>
          </div>

          <!-- 政府备案 -->
          <h4 class="sec-title">🏛️ 政府备案信息</h4>
          <div class="info-grid-3">
            <div class="info-item"><label>备案编号</label><span class="fw-700 link">{{ selected.notification.filingNo }}</span></div>
            <div class="info-item"><label>备案日期</label><span>{{ selected.notification.filingDate }}</span></div>
            <div class="info-item"><label>备案机关</label><span>{{ selected.notification.filingAuthority }}</span></div>
            <div class="info-item"><label>备案状态</label><span class="tag tag-green">{{ selected.notification.filingStatus }}</span></div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="empty-hint large">👆 请选择一个重大危险源查看详情</div>
  </div>
</template>

<script>
import { majorHazardSources, MAJOR_HAZARD_LIFECYCLE_STEPS } from '@/store/safeData'

export default {
  name: 'MajorHazardSource',
  data() {
    return {
      activeTab: 'identify',
      tabs: [
        { key: 'identify', label: '📋 辨识登记' },
        { key: 'monitor', label: '📡 监测看板' },
        { key: 'assess', label: '📑 安全评估' },
        { key: 'plan', label: '🆘 预案演练' },
        { key: 'notify', label: '📢 告知备案' }
      ],
      sources: majorHazardSources,
      selectedId: majorHazardSources[0]?.id || null
    }
  },
  computed: {
    selected() {
      return this.sources.find(s => s.id === this.selectedId) || null
    },
    stats() {
      const d = { level1: 0, level2: 0, level3: 0, level4: 0, total: this.sources.length, warningCount: 0 }
      this.sources.forEach(s => {
        if (s.level === '一级') d.level1++
        else if (s.level === '二级') d.level2++
        else if (s.level === '三级') d.level3++
        else d.level4++
        if (s.status !== '正常') d.warningCount++
      })
      return d
    },
    rColor() {
      const lv = this.selected?.level
      return { '一级': '#ef4444', '二级': '#f59e0b', '三级': '#eab308', '四级': '#3b82f6' }[lv] || '#94a3b8'
    },
    isAssessExpiring() {
      if (!this.selected) return false
      const days = this.assessDaysLeft
      return days > 0 && days < 90
    },
    assessDaysLeft() {
      if (!this.selected) return '-'
      const valid = new Date(this.selected.safetyAssessment.validUntil)
      const diff = Math.ceil((valid - new Date()) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : '已过期'
    },
    isDrillOverdue() {
      if (!this.selected) return false
      return new Date(this.selected.emergencyPlan.nextDue) < new Date()
    },
    lifecycleSteps() {
      if (!this.selected) return MAJOR_HAZARD_LIFECYCLE_STEPS.map((s, i) => ({ ...s, done: false, active: false }))
      const idx = this.selected._lifecycleStep || 0
      return MAJOR_HAZARD_LIFECYCLE_STEPS.map((s, i) => ({
        ...s,
        done: i < idx,
        active: i === idx
      }))
    },
    lifecycleProgress() {
      if (!this.selected) return 0
      return Math.round(((this.selected._lifecycleStep || 0) / (MAJOR_HAZARD_LIFECYCLE_STEPS.length - 1)) * 100)
    },
    lifecycleStatus() {
      if (!this.selected) return 'normal'
      const s = this.selected.status
      if (s === '报警') return 'alarm'
      if (s === '预警') return 'warn'
      return 'normal'
    },
    lifecycleStatusLabel() {
      if (!this.selected) return '-'
      if (this.selected.status === '报警') return '⚠️ 报警状态'
      if (this.selected.status === '预警') return '⚠️ 预警状态'
      return '✅ 运行中'
    },
    mhStats() {
      const d = { level1: 0, level2: 0, level3: 0, level4: 0, total: this.sources.length, warningCount: 0 }
      this.sources.forEach(s => {
        if (s.level === '一级') d.level1++
        else if (s.level === '二级') d.level2++
        else if (s.level === '三级') d.level3++
        else d.level4++
        if (s.status !== '正常') d.warningCount++
      })
      return [
        { label: '一级重大危险源', value: d.level1, icon: '🔴', color: '#ef4444', grad: 'linear-gradient(135deg, #ef4444, #dc2626)' },
        { label: '二级重大危险源', value: d.level2, icon: '🟠', color: '#f59e0b', grad: 'linear-gradient(135deg, #f59e0b, #d97706)' },
        { label: '三级重大危险源', value: d.level3, icon: '🟡', color: '#eab308', grad: 'linear-gradient(135deg, #eab308, #ca8a04)' },
        { label: '四级重大危险源', value: d.level4, icon: '🔵', color: '#3b82f6', grad: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
        { label: '危险源总计', value: d.total, icon: '📊', color: '#6366f1', grad: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
        { label: '预警/报警', value: d.warningCount, icon: '⚠️', color: d.warningCount > 0 ? '#ef4444' : '#0ea85e', grad: d.warningCount > 0 ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #0ea85e, #059669)' }
      ]
    }
  },
  methods: {
    selectSource(id) { this.selectedId = id },
    getLevelClass(level) {
      return { '一级': 'red', '二级': 'orange', '三级': 'yellow', '四级': 'blue' }[level] || 'blue'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.page-header { margin-bottom: $space-lg; }
.page-title { font-size: $font-2xl; font-weight: 800; color: $text-primary; }
.page-subtitle { font-size: $font-sm; color: $text-secondary; margin-top: $space-xs; line-height: 1.6; }

.tab-bar {
  display: inline-flex; gap: 4px; background: #fff; border-radius: $radius-lg; padding: 4px; margin-bottom: $space-lg; box-shadow: $shadow-sm;
}
.tab-btn {
  padding: 8px 18px; border: 0; background: transparent;
  border-radius: $radius-base; cursor: pointer; font-size: $font-sm; color: $text-secondary;
  transition: all .18s;
  &.active { background: $primary; color: #fff; }
  &:hover:not(.active) { background: $bg-page; color: $text-primary; }
}

/* V2 gradient stat gallery */
.stat-gallery-mh { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: $space-lg; }
.mh-stat {
  position: relative; background: #fff; border-radius: 14px;
  padding: 16px 14px; box-shadow: 0 2px 12px rgba(15,23,42,.06); overflow: hidden;
  border: 1px solid rgba(15,23,42,.06); transition: transform .2s, box-shadow .2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(15,23,42,.08); }
}
.mh-glow { position: absolute; top: -14px; right: -14px; width: 48px; height: 48px; border-radius: 50%; opacity: .07; }
.mh-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center;
  justify-content: center; font-size: 14px; margin-bottom: 8px; opacity: .15; }
.mh-body { position: relative; z-index: 1; }
.mh-value { font-size: 26px; font-weight: 900; line-height: 1; display: block; }
.mh-label { font-size: 11px; color: $text-secondary; display: block; margin-top: 4px; }
.mh-border { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; opacity: .5; }

.tab-bar {
  display: inline-flex; gap: 4px; background: #fff; border-radius: 14px; padding: 5px;
  margin-bottom: $space-lg; box-shadow: 0 2px 12px rgba(15,23,42,.06); border: 1px solid rgba(15,23,42,.06);
}
.tab-btn {
  padding: 9px 20px; border: 0; background: transparent;
  border-radius: 10px; cursor: pointer; font-size: $font-sm; color: $text-secondary; font-weight: 600;
  transition: all .2s;
  &.active { background: $primary; color: #fff; box-shadow: 0 2px 8px rgba(26,95,220,.3); }
  &:hover:not(.active) { background: $gray-100; color: $text-primary; }
}

/* ====== 全生命周期流程步骤条 ====== */
.lifecycle-chain {
  background: linear-gradient(135deg, #f8fafc, $gray-100); border-radius: 14px;
  padding: 16px 20px; margin-bottom: $space-lg; border: 1px solid $gray-200;
}
.chain-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
  font-size: $font-sm; font-weight: 700; color: $text-primary;
}
.chain-badge {
  padding: 3px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; color: #fff;
  &.badge-step-normal { background: linear-gradient(135deg, #0ea85e, $accent-green); }
  &.badge-step-warn { background: linear-gradient(135deg, #f59e0b, $warning-600); }
  &.badge-step-alarm { background: linear-gradient(135deg, #ef4444, $danger-600); }
}
.chain-track {
  display: flex; align-items: flex-start; position: relative; gap: 0;
  &::before {
    content: ''; position: absolute; top: 18px; left: 18px; right: 18px; height: 4px;
    background: $gray-200; border-radius: 2px; z-index: 0;
  }
}
.chain-fill {
  position: absolute; top: 18px; left: 18px; height: 4px;
  background: linear-gradient(90deg, #3b82f6, $accent-green); border-radius: 2px;
  z-index: 1; transition: width .6s cubic-bezier(.4,0,.2,1);
}
.chain-node {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;
  position: relative; z-index: 2;
}
.node-circle {
  width: 36px; height: 36px; border-radius: 50%; background: #fff; border: 3px solid $gray-200;
  display: flex; align-items: center; justify-content: center; font-size: 13px;
  font-weight: 700; color: $gray-400; transition: all .4s;
}
.chain-node.done .node-circle {
  background: $accent-green; border-color: $accent-green; color: #fff;
}
.chain-node.active .node-circle {
  background: #fff; border-color: $primary; color: $primary;
  box-shadow: 0 0 0 6px rgba(59,130,246,.12);
  animation: mhNodePulse 2s infinite;
}
@keyframes mhNodePulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(59,130,246,.12); }
  50% { box-shadow: 0 0 0 10px rgba(59,130,246,.06); }
}
.pulse-dot {
  width: 8px; height: 8px; border-radius: 50%; background: $primary; animation: mhDotPulse 1.2s infinite;
}
@keyframes mhDotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .4; transform: scale(1.3); }
}
.node-text { text-align: center; }
.node-label { font-size: 11px; font-weight: 700; color: $text-primary; }
.node-role { font-size: 10px; color: $text-hint; margin-top: 1px; }
.chain-node.done .node-label { color: $accent-green; }
.chain-node.active .node-label { color: $primary; }

.source-list-bar {
  display: flex; gap: $space-sm; margin-bottom: $space-lg; flex-wrap: wrap;
}
.source-chip {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 16px; border: 1px solid $gray-200; background: #fff;
  border-radius: 999px; cursor: pointer; font-size: $font-sm; font-weight: 600; transition: .2s;
  &.active { border-color: $primary; background: $primary-bg; box-shadow: 0 2px 8px rgba(26,95,220,.08); }
  &:hover:not(.active) { border-color: $primary; background: $primary-bg; transform: translateY(-1px); }
}
.dot { font-size: 8px; }
.dot-red { color: $danger; }
.dot-orange { color: $warning-500; }
.dot-yellow { color: #eab308; }
.dot-blue { color: $primary; }
.chip-label { font-weight: 600; color: $text-primary; }
.chip-tag { font-size: $font-xs; padding: 1px 6px; border-radius: 999px; font-weight: 600; }
.tag-red { background: $danger-100; color: $danger; }
.tag-orange { background: #fff7ed; color: $warning-500; }
.tag-yellow { background: #fffbeb; color: #b7791f; }
.tag-blue { background: #e8f0fe; color: $primary; }
.tag-green { background: $success-100; color: $accent-green; }
.tag-gray { background: $gray-100; color: $gray-500; }
.chip-status { font-size: 10px; padding: 0 5px; border-radius: 999px; }
.status-warn { background: #fff7ed; color: $warning-500; }
.status-alarm { background: $danger-100; color: $danger; }

.section-card { background: #fff; border-radius: 16px; box-shadow: 0 2px 16px rgba(15,23,42,.06); margin-bottom: $space-lg; overflow: hidden; border: 1px solid rgba(15,23,42,.06); }
.section-head {
  padding: 16px 20px; border-bottom: 1px solid $gray-100;
  display: flex; align-items: baseline; gap: $space-md;
  background: linear-gradient(to bottom, #fafbfc, #fff);
}
.section-title { font-size: $font-lg; font-weight: 700; color: $text-primary; }
.section-sub { font-size: $font-xs; color: $text-secondary; }
.section-body { padding: $space-lg; }

.info-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: $space-md; margin-bottom: $space-lg; }
.info-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-md; margin-bottom: $space-lg; }
.info-item {
  padding: $space-sm $space-md; background: $bg-page; border-radius: $radius-base;
  label { display: block; font-size: $font-xs; color: $text-secondary; margin-bottom: 4px; }
  span { font-size: $font-sm; color: $text-primary; }
}

.fw-600 { font-weight: 600; }
.fw-700 { font-weight: 700; }
.mono { font-family: 'Consolas', monospace; font-size: $font-xs; }
.text-red { color: $danger; }
.text-orange { color: $warning-500; }
.text-green { color: $accent-green; }
.link { color: $primary; font-weight: 600; }

.sec-title {
  font-size: $font-base; font-weight: 800; color: $text-primary; margin: $space-lg 0 $space-md; padding-left: 9px; border-left: 3px solid $primary;
}

.tag {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: $radius-sm; font-size: $font-xs; font-weight: 600;
}

.table-wrap { overflow-x: auto; }
.data-table {
  width: 100%; border-collapse: collapse;
  th { background: $bg-page; color: $text-secondary; font-size: $font-xs; font-weight: 600; text-align: left; padding: 10px 12px; white-space: nowrap; }
  td { padding: 10px 12px; border-bottom: 1px solid $border; font-size: $font-sm; white-space: nowrap; }
  tr:last-child td { border-bottom: none; }
}

.ratio-bar { width: 80px; height: 6px; background: $gray-200; border-radius: 3px; overflow: hidden; }
.ratio-fill { height: 100%; border-radius: 3px; transition: width .3s; }

.r-result {
  margin-top: $space-lg; padding: $space-lg; background: #fff; border-radius: 16px;
  display: flex; gap: $space-2xl; align-items: center; border: 1px solid $gray-200; box-shadow: 0 2px 12px rgba(15,23,42,.04);
}
.r-left { flex: 1; }
.r-formula-title { font-size: $font-sm; color: $text-secondary; margin-bottom: $space-sm; }
.r-formula { font-size: $font-xl; font-weight: 700; color: $text-primary; }
.r-detail { font-size: $font-xs; color: $text-hint; margin-top: $space-sm; line-height: 1.6; }
.r-right { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.r-value-wrap { margin-bottom: 0; }
.r-value { font-size: 36px; font-weight: 900; }
.r-level {
  padding: 8px 20px; border-radius: 999px; border: 2px solid;
  display: flex; align-items: center; gap: 6px;
}
.r-range { font-size: $font-xs; color: $text-secondary; }
.r-basis { font-size: $font-xs; color: $text-hint; }

/* Monitor */
.monitor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: $space-md; margin-bottom: $space-lg; }
.monitor-card {
  padding: $space-md; border-radius: 14px; border: 2px solid $border; transition: transform .2s;
  &:hover { transform: translateY(-2px); }
  &.monitor-normal { background: $success-100; border-color: $accent-green; }
  &.monitor-warn { background: #fffbeb; border-color: #eab308; }
  &.monitor-alarm { background: $danger-100; border-color: $danger; animation: alarmFlash 2s infinite; }
}
@keyframes alarmFlash {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,.3); }
  50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
}
.monitor-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: $space-sm; }
.monitor-name { font-size: $font-xs; color: $text-secondary; }
.monitor-badge { font-size: $font-xs; padding: 1px 8px; border-radius: 999px; font-weight: 600; }
.badge-normal { background: $accent-green; color: #fff; }
.badge-warn { background: #eab308; color: #fff; }
.badge-alarm { background: $danger; color: #fff; }
.monitor-value-wrap { margin-bottom: $space-sm; }
.monitor-value { font-size: 32px; font-weight: 900; }
.text-normal { color: $accent-green; }
.text-warn { color: #eab308; }
.text-alarm { color: $danger; }
.monitor-unit { font-size: $font-sm; color: $text-secondary; margin-left: 4px; }
.monitor-trend { font-size: $font-xs; color: $warning-500; }
.monitor-trend.stable { color: $text-hint; }
.monitor-thresholds { margin-top: $space-sm; display: flex; gap: $space-md; font-size: 10px; color: $text-hint; }
.thr-low { color: $primary; }
.thr-high { color: $danger; }

.video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: $space-md; margin-bottom: $space-lg; }
.video-card {
  background: $bg-page; border-radius: $radius-lg; overflow: hidden;
}
.video-preview {
  height: 100px; background: #1e293b; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: $space-sm;
}
.video-icon { font-size: 28px; }
.video-name { font-size: $font-xs; color: $gray-400; }
.video-info {
  padding: $space-sm $space-md; display: flex; justify-content: space-between; align-items: center;
}
.video-check { font-size: 10px; color: $text-hint; }

/* Assess */
.assess-card {
  display: flex; gap: $space-2xl; padding: $space-lg; background: #fff; border-radius: 16px; border: 2px solid $accent-green;
  box-shadow: 0 2px 12px rgba(15,23,42,.04);
  &.assess-expiring { border-color: $warning-500; background: #fffbf0; }
}
.assess-left { flex: 1; }
.assess-report-no { font-size: $font-lg; font-weight: 700; color: $primary; margin-bottom: $space-md; }
.assess-right { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: $space-md; }
.assess-deadline { text-align: center; }
.deadline-label { font-size: $font-xs; color: $text-secondary; }
.deadline-days { font-size: 40px; font-weight: 900; color: $accent-green; }
.deadline-unit { font-size: $font-sm; color: $text-secondary; }
.assess-file { font-size: $font-xs; color: $text-secondary; }

/* Notification Board */
.notify-board {
  width: 100%; max-width: 720px; margin: 0 auto $space-lg;
  border: 3px solid; border-radius: $radius-lg; overflow: hidden;
  &.board-red { border-color: $danger; }
  &.board-orange { border-color: $warning-500; }
  &.board-yellow { border-color: #eab308; }
  &.board-blue { border-color: $primary; }
}
.notify-board-head {
  background: #1e293b; color: #fff; text-align: center; padding: $space-md;
  font-size: $font-lg; font-weight: 800;
}
.notify-board-body { padding: $space-md $space-lg; font-size: $font-sm; }
.notify-row {
  display: flex; padding: 8px 0; border-bottom: 1px dashed $border;
  &.full { flex-direction: column; gap: 4px; }
}
.notify-label { width: 100px; flex-shrink: 0; color: $text-secondary; font-weight: 600; }
.notify-val { color: $text-primary; font-weight: 600; flex: 1; }
.notify-level-red { color: $danger; font-size: $font-xl; font-weight: 800; }
.notify-level-orange { color: $warning-500; font-size: $font-xl; font-weight: 800; }
.notify-level-yellow { color: #eab308; font-size: $font-xl; font-weight: 800; }
.notify-level-blue { color: $primary; font-size: $font-xl; font-weight: 800; }
.notify-meta { margin-top: $space-md; }

.empty-hint { padding: $space-3xl; text-align: center; color: $text-secondary; font-size: $font-sm; }
.empty-hint.large { padding: 80px; font-size: $font-base; }
</style>
