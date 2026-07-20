<template>
  <div class="hazard-page">
    <div class="page-header">
      <h2>隐患治理与集团督办</h2>
      <p class="page-subtitle">本公司隐患闭环 + 集团督办独立流转，两张单据可互查但不替代</p>
      <button class="btn-new-hazard" @click="showHazardForm = true">➕ 登记新隐患</button>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <span class="role-badge">当前角色：公司安环管理人员（铸锻件分公司）</span>
      <button class="btn-reset" @click="resetData">恢复演示初始状态</button>
    </div>

    <section class="ov-section">
      <h3 class="section-title">隐患台账</h3>
      <div class="section-card" style="padding:0; overflow:hidden">
        <table class="data-table">
          <thead>
            <tr><th>编号</th><th>标题</th><th>严重程度</th><th>状态</th><th>责任人</th><th>期限</th><th>逾限</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="h in localHazards" :key="h.id" :class="{ 'row-overdue': h.overdue }">
              <td class="mono">{{ h.id }}</td>
              <td><strong>{{ h.title }}</strong></td>
              <td><span class="tag" :class="severityClass(h.severity)">{{ h.severity }}</span></td>
              <td><span class="tag" :class="statusClass(h.status)">{{ getStatus(h.status) }}</span></td>
              <td>{{ h.rectifierName }}</td>
              <td>{{ h.deadline }}</td>
              <td>{{ h.overdue ? '是' : '否' }}</td>
              <td>
                <button class="btn-sm" @click="showDetail(h)">详情</button>
                <button v-if="h.status === '待复查'" class="btn-sm btn-primary" @click="reviewHazard(h)">复查</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 隐患详情 -->
    <section class="ov-section" v-if="selectedHazard">
      <h3 class="section-title">隐患详情：{{ selectedHazard.title }}</h3>
      <div class="section-card">
        <div class="detail-grid">
          <div class="detail-item"><label>编号</label><span>{{ selectedHazard.id }}</span></div>
          <div class="detail-item"><label>来源</label><span>{{ selectedHazard.source }}</span></div>
          <div class="detail-item"><label>严重程度</label><span class="tag" :class="severityClass(selectedHazard.severity)">{{ selectedHazard.severity }}</span></div>
          <div class="detail-item"><label>状态</label><span class="tag" :class="statusClass(selectedHazard.status)">{{ getStatus(selectedHazard.status) }}</span></div>
          <div class="detail-item"><label>整改责任人</label><span>{{ selectedHazard.rectifierName }}</span></div>
          <div class="detail-item"><label>期限</label><span>{{ selectedHazard.deadline }}</span></div>
        </div>
        <div class="detail-desc">
          <label>隐患描述</label>
          <p>{{ selectedHazard.description }}</p>
        </div>
        <div class="detail-desc">
          <label>整改方案</label>
          <p>{{ selectedHazard.rectificationPlan || '待制定' }}</p>
        </div>
        <!-- 流程步骤条 -->
        <div class="hazard-flow-chain">
          <div class="chain-header">
            <span>🔗 隐患治理流程</span>
            <span class="chain-badge" :class="hazardFlowBadgeClass">{{ hazardFlowBadge }}</span>
          </div>
          <div class="chain-track">
            <div class="chain-fill" :style="{ width: hazardFlowProgress + '%' }"></div>
            <div v-for="(step, i) in hazardFlowSteps" :key="step.key"
              :class="['chain-node', { done: step.done, active: step.active, rejected: hazardFlowRejected }]">
              <div class="node-circle">
                <span v-if="step.done">✓</span>
                <span v-else-if="step.active && hazardFlowRejected">✕</span>
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

        <!-- 时间线 -->
        <div class="timeline">
          <div class="timeline-item" v-for="(t, i) in selectedHazard.timeline" :key="i">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-time">{{ t.time }}</span>
              <span class="timeline-action">{{ t.action }}</span>
              <span class="timeline-operator">— {{ t.operator }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 集团督办 -->
    <section class="ov-section">
      <h3 class="section-title">集团督办清单</h3>
      <div class="section-card" style="padding:0; overflow:hidden">
        <table class="data-table">
          <thead>
            <tr><th>编号</th><th>关联隐患</th><th>所属公司</th><th>严重程度</th><th>状态</th><th>发起人</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="s in localSupervisions" :key="s.id">
              <td class="mono">{{ s.id }}</td>
              <td>{{ s.hazardTitle }}</td>
              <td>{{ s.orgName }}</td>
              <td><span class="tag tag-red">{{ s.severity }}</span></td>
              <td><span class="tag tag-orange">{{ s.status }}</span></td>
              <td>{{ s.initiatorName }}</td>
              <td>
                <button class="btn-sm" @click="showSupervisionDetail(s)">详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 督办详情 -->
    <section class="ov-section" v-if="selectedSupervision">
      <h3 class="section-title">集团督办详情</h3>
      <div class="section-card">
        <div class="detail-grid">
          <div class="detail-item"><label>督办编号</label><span>{{ selectedSupervision.id }}</span></div>
          <div class="detail-item"><label>关联隐患</label><span>{{ selectedSupervision.hazardTitle }}</span></div>
          <div class="detail-item"><label>所属公司</label><span>{{ selectedSupervision.orgName }}</span></div>
          <div class="detail-item"><label>状态</label><span class="tag tag-orange">{{ selectedSupervision.status }}</span></div>
        </div>
        <div class="detail-desc">
          <label>督办意见</label>
          <p>{{ selectedSupervision.opinion }}</p>
        </div>
        <div class="detail-desc" v-if="selectedSupervision.feedback.length">
          <label>反馈记录</label>
          <div v-for="(f, i) in selectedSupervision.feedback" :key="i" class="feedback-item">
            <span class="feedback-time">{{ f.time }}</span>
            <p class="feedback-content">{{ f.content }}</p>
            <span class="feedback-operator">— {{ f.operator }}</span>
          </div>
        </div>
        <div class="timeline">
          <div class="timeline-item" v-for="(t, i) in selectedSupervision.timeline" :key="i">
            <div class="timeline-dot" :class="{ active: i === selectedSupervision.timeline.length - 1 }"></div>
            <div class="timeline-content">
              <span class="timeline-time">{{ t.time }}</span>
              <span class="timeline-action">{{ t.action }}</span>
              <span class="timeline-operator">— {{ t.operator }}</span>
            </div>
          </div>
        </div>
        <div class="warning-box">
          <strong>⚠️ 独立流转原则：</strong>集团督办是关联原隐患的独立单据。集团关闭督办不等于代替所属公司关闭原隐患，两单状态独立但可互查。
        </div>
      </div>
    </section>

    <!-- ====== 登记新隐患弹窗 ====== -->
    <div class="modal-overlay" v-if="showHazardForm" @click.self="cancelHazardForm">
      <div class="modal-panel">
        <div class="modal-header">
          <h3>⚠️ 登记新隐患</h3>
          <button class="modal-close" @click="cancelHazardForm">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">发现来源 <span class="required">*</span></label>
              <select class="form-input" v-model="newHazard.source">
                <option v-for="s in sourceOptions" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">严重程度 <span class="required">*</span></label>
              <div class="severity-selector">
                <label v-for="sv in severityOptions" :key="sv.value" class="sv-option" :class="{ selected: newHazard.severity === sv.value }">
                  <input type="radio" v-model="newHazard.severity" :value="sv.value" />
                  <span class="sv-dot" :style="{ background: sv.color }"></span>
                  <span class="sv-label">{{ sv.value }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">所属区域</label>
              <input class="form-input" v-model="newHazard.zoneName" placeholder="如：锻压车间 / 储罐区" />
            </div>
            <div class="form-group">
              <label class="form-label">整改期限 <span class="required">*</span></label>
              <input class="form-input" v-model="newHazard.deadline" placeholder="如：2026-07-25" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">隐患标题 <span class="required">*</span></label>
            <input class="form-input" v-model="newHazard.title" placeholder="简明扼要描述隐患问题" />
          </div>
          <div class="form-group">
            <label class="form-label">隐患描述</label>
            <textarea class="form-textarea" v-model="newHazard.description" placeholder="详细描述隐患情况、位置、发现过程等" rows="3"></textarea>
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">整改责任人</label>
              <input class="form-input" v-model="newHazard.rectifierName" placeholder="指定整改责任人姓名" />
            </div>
            <div class="form-group">
              <label class="form-label">检查人</label>
              <input class="form-input" v-model="newHazard.inspectorName" placeholder="发现人/检查人姓名" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">整改方案建议</label>
            <textarea class="form-textarea" v-model="newHazard.rectificationPlan" placeholder="初步整改建议或方案（可后续补充）" rows="2"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="cancelHazardForm">取消</button>
          <button class="btn-draft" @click="saveHazardDraft">💾 暂存草稿</button>
          <button class="btn-submit" @click="submitHazard">📋 提交登记</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hazards, supervisions, HAZARD_STATUS } from '@/store/safeData';

export default {
  name: 'HazardSupervision',
  data() {
    return {
      localHazards: JSON.parse(JSON.stringify(hazards)),
      localSupervisions: JSON.parse(JSON.stringify(supervisions)),
      selectedHazard: null,
      selectedSupervision: null,
      // 登记新隐患表单
      showHazardForm: false,
      newHazard: this.createEmptyHazard(),
      sourceOptions: ['日常巡检', '专项检查', '上级督查', '员工举报', '设备监测', '其他'],
      severityOptions: [
        { value: '重大', color: '#ef4444' },
        { value: '较大', color: '#f59e0b' },
        { value: '一般', color: '#3b82f6' },
        { value: '低', color: '#6b7280' }
      ],
      hazardFlowDef: [
        { key: 'discover', label: '发现登记', role: '巡检/现场人员' },
        { key: 'accept', label: '受理分派', role: '公司安环室' },
        { key: 'rectify', label: '整改执行', role: '车间/部门负责人' },
        { key: 'review', label: '复查验收', role: '公司安环室' },
        { key: 'close', label: '闭环归档', role: '系统' }
      ],
      hazardStatusStepMap: {
        '待受理': 0,
        '待整改': 1,
        '整改中': 2,
        '待复查': 3,
        '已闭环': 4,
        '已退回': -1
      }
    };
  },
  computed: {
    hazardFlowSteps() {
      if (!this.selectedHazard) return this.hazardFlowDef.map((s, i) => ({ ...s, done: false, active: false }))
      const sidx = this.hazardStatusStepMap[this.selectedHazard.status]
      if (sidx === undefined || sidx === -1) {
        return this.hazardFlowDef.map((s, i) => ({ ...s, done: false, active: i === 0 }))
      }
      return this.hazardFlowDef.map((s, i) => ({
        ...s,
        done: i < sidx,
        active: i === sidx
      }))
    },
    hazardFlowRejected() {
      if (!this.selectedHazard) return false
      return this.selectedHazard.status === '已退回'
    },
    hazardFlowProgress() {
      if (!this.selectedHazard) return 0
      const sidx = this.hazardStatusStepMap[this.selectedHazard.status]
      if (sidx === undefined || sidx === -1) return 0
      return Math.round((sidx / (this.hazardFlowDef.length - 1)) * 100)
    },
    hazardFlowBadge() {
      if (!this.selectedHazard) return '-'
      return this.selectedHazard.status
    },
    hazardFlowBadgeClass() {
      if (!this.selectedHazard) return ''
      if (this.selectedHazard.status === '已闭环') return 'badge-done'
      if (this.selectedHazard.status === '已退回') return 'badge-reject'
      if (this.selectedHazard.status === '待复查') return 'badge-review'
      return 'badge-progress'
    }
  },
  methods: {
    getStatus(s) { return HAZARD_STATUS[s] || s; },
    severityClass(s) {
      if (s === '重大') return 'tag-red';
      if (s === '较大') return 'tag-orange';
      if (s === '一般') return 'tag-blue';
      return 'tag-gray';
    },
    statusClass(s) {
      if (s === '已闭环') return 'tag-green';
      if (s === '已退回') return 'tag-red';
      if (s === '待复查') return 'tag-blue';
      if (s === '整改中') return 'tag-orange';
      return 'tag-orange';
    },
    showDetail(h) { this.selectedSupervision = null; this.selectedHazard = h; },
    showSupervisionDetail(s) { this.selectedHazard = null; this.selectedSupervision = s; },
    reviewHazard(h) {
      if (confirm('确认复查通过，关闭隐患 ' + h.title + '？')) {
        h.status = '已闭环';
        h.timeline.push({ time: '2026-07-16 10:00', action: '复查通过，隐患闭环', operator: '李明辉' });
      }
    },

    // ===== 登记新隐患 =====
    createEmptyHazard() {
      return {
        id: '', source: '日常巡检', severity: '一般', status: '待受理',
        zoneName: '', deptId: '', riskPointId: '',
        title: '', description: '', deadline: '', rectifierName: '', inspectorName: '',
        rectificationPlan: '', evidence: [], overdue: false,
        createTime: '', acceptTime: '', reviewTime: '',
        timeline: []
      };
    },
    generateHazardId() {
      const now = new Date();
      const y = now.getFullYear().toString();
      const m = (now.getMonth() + 1).toString().padStart(2, '0');
      const d = now.getDate().toString().padStart(2, '0');
      const seq = (this.localHazards.length + 1).toString().padStart(3, '0');
      return `YH${y}${m}${d}${seq}`;
    },
    cancelHazardForm() {
      this.showHazardForm = false;
    },
    saveHazardDraft() {
      if (!this.newHazard.title.trim()) {
        alert('请至少填写隐患标题');
        return;
      }
      this.newHazard.id = this.generateHazardId();
      this.newHazard.status = '草稿';
      this.newHazard.createTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
      this.newHazard.timeline = [
        { time: this.newHazard.createTime, action: `${this.newHazard.inspectorName || '检查人'}登记隐患草稿：${this.newHazard.title}`, operator: this.newHazard.inspectorName || '检查人' }
      ];
      this.localHazards.unshift(JSON.parse(JSON.stringify(this.newHazard)));
      this.showHazardForm = false;
      this.newHazard = this.createEmptyHazard();
      this.selectedSupervision = null;
      this.selectedHazard = this.localHazards[0];
    },
    submitHazard() {
      if (!this.newHazard.title.trim()) {
        alert('请填写隐患标题');
        return;
      }
      if (!this.newHazard.deadline.trim()) {
        alert('请填写整改期限');
        return;
      }
      this.newHazard.id = this.generateHazardId();
      this.newHazard.status = '待受理';
      this.newHazard.createTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
      this.newHazard.timeline = [
        { time: this.newHazard.createTime, action: `${this.newHazard.inspectorName || '检查人'}发现并登记隐患：${this.newHazard.title}`, operator: this.newHazard.inspectorName || '检查人' },
        { time: this.newHazard.createTime, action: '隐患已提交，等待安环室受理分派', operator: '系统' }
      ];
      this.localHazards.unshift(JSON.parse(JSON.stringify(this.newHazard)));
      this.showHazardForm = false;
      this.newHazard = this.createEmptyHazard();
      this.selectedSupervision = null;
      this.selectedHazard = this.localHazards[0];
      alert(`隐患 ${this.selectedHazard.id} 已登记，当前状态：待受理。流程将依次经过：受理分派→整改执行→复查验收→闭环归档。`);
    },
    resetData() {
      this.localHazards = JSON.parse(JSON.stringify(hazards));
      this.localSupervisions = JSON.parse(JSON.stringify(supervisions));
      this.selectedHazard = null;
      this.selectedSupervision = null;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.hazard-page { max-width: 960px; }
.page-header {
  margin-bottom: $space-xl;
  h2 { font-size: $font-2xl; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; }
}

.action-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: $space-lg; }
.role-badge { font-size: $font-xs; color: $text-hint; background: $gray-100; padding: 4px 12px; border-radius: 20px; }
.btn-reset { font-size: $font-xs; color: $text-hint; background: #fff; border: 1px solid $border; padding: 4px 12px; border-radius: $radius-sm; cursor: pointer; &:hover { color: $primary; border-color: $primary; } }
.btn-sm { font-size: 11px; padding: 3px 10px; border-radius: $radius-sm; border: 1px solid $border; background: #fff; color: $text-secondary; cursor: pointer; &:hover { border-color: $primary; color: $primary; } }
.btn-primary { background: $primary; color: #fff; border: none; &:hover { background: $primary-dark; } }

.ov-section { margin-bottom: $space-2xl; }
.section-title { font-size: $font-md; font-weight: 700; color: $text-primary; margin-bottom: $space-md; padding-left: 12px; border-left: 4px solid $primary; }
.section-card { background: #fff; border-radius: 16px; padding: $space-lg $space-xl; border: 1px solid rgba(15,23,42,.06); box-shadow: 0 2px 12px rgba(15,23,42,.04); }

.data-table {
  width: 100%; border-collapse: collapse; font-size: $font-sm;
  th { background: $gray-50; padding: 10px $space-md; text-align: left; font-weight: 600; color: $text-primary; border-bottom: 2px solid $border; white-space: nowrap; }
  td { padding: 10px $space-md; border-bottom: 1px solid #f0f0f0; color: $text-secondary; }
  tr:hover td { background: $gray-50; }
  .row-overdue td { background: $danger-100; }
  .mono { font-family: monospace; font-size: 11px; }
}

.detail-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-sm $space-xl; margin-bottom: $space-lg;
}
.detail-item {
  label { font-size: 11px; color: $text-hint; display: block; margin-bottom: 2px; }
  span { font-size: $font-sm; color: $text-primary; }
}
.detail-desc {
  margin-bottom: $space-md;
  label { font-size: 11px; color: $text-hint; display: block; margin-bottom: 4px; }
  p { font-size: $font-sm; color: $text-secondary; line-height: 1.6; background: $gray-50; padding: 10px; border-radius: $radius-sm; }
}

.timeline { margin-top: $space-lg; padding-left: $space-base;
  position: relative;
  &::before { content: ''; position: absolute; left: 20px; top: 8px; bottom: 8px; width: 2px; background: $gray-200; }
}
.timeline-item { display: flex; gap: $space-md; padding: 10px 0; position: relative; }
.timeline-dot {
  width: 12px; height: 12px; border-radius: 50%; background: $gray-200; flex-shrink: 0; margin-top: 3px;
  position: relative; z-index: 1; border: 2px solid #fff;
  &.active { background: $primary; box-shadow: 0 0 0 4px rgba(26,95,220,.15); }
}
.timeline-content { display: flex; flex-direction: column; font-size: $font-xs; }
.timeline-time { color: $text-hint; font-size: 11px; }
.timeline-action { color: $text-primary; font-weight: 600; }
.timeline-operator { color: $text-hint; }

.feedback-item { margin-bottom: 6px; }
.feedback-time { color: $text-hint; font-size: $font-xs; }
.feedback-content { font-size: $font-sm; color: $text-secondary; margin: 2px 0; }
.feedback-operator { font-size: 11px; color: $text-hint; }

.warning-box {
  margin-top: $space-lg; padding: $space-base; background: #fffbeb; border-radius: 12px;
  border-left: 4px solid $warning; font-size: $font-xs; color: #92400e; line-height: 1.6;
  strong { color: #92400e; }
}

/* ====== 隐患流程步骤条 ====== */
.hazard-flow-chain {
  background: linear-gradient(135deg, #f8fafc, $gray-100); border-radius: 14px;
  padding: 16px 20px; margin: $space-lg 0; border: 1px solid $gray-200;
}
.chain-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
  font-size: $font-sm; font-weight: 700; color: $text-primary;
}
.chain-badge {
  padding: 3px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; color: #fff;
  &.badge-done { background: linear-gradient(135deg, #0ea85e, $accent-green); }
  &.badge-progress { background: linear-gradient(135deg, #f59e0b, $warning-600); }
  &.badge-review { background: linear-gradient(135deg, #3b82f6, $brand-600); }
  &.badge-reject { background: linear-gradient(135deg, #ef4444, $danger-600); }
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
  &.rejected {
    .node-circle { border-color: $danger-100; color: $danger; }
  }
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
  animation: hzNodePulse 2s infinite;
}
.chain-node.active.rejected .node-circle {
  background: $danger-100; border-color: $danger; color: $danger;
  box-shadow: 0 0 0 6px rgba(239,68,68,.12);
  animation: hzNodePulse 2s infinite;
}
@keyframes hzNodePulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(59,130,246,.12); }
  50% { box-shadow: 0 0 0 10px rgba(59,130,246,.06); }
}
.pulse-dot {
  width: 8px; height: 8px; border-radius: 50%; background: $primary; animation: hzDotPulse 1.2s infinite;
}
@keyframes hzDotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .4; transform: scale(1.3); }
}
.node-text { text-align: center; }
.node-label { font-size: 11px; font-weight: 700; color: $text-primary; }
.node-role { font-size: 10px; color: $text-hint; margin-top: 1px; }
.chain-node.done .node-label { color: $accent-green; }
.chain-node.active .node-label { color: $primary; }
.chain-node.active.rejected .node-label { color: $danger; }

/* ====== 登记新隐患按钮 ====== */
.btn-new-hazard {
  margin-top: $space-md; padding: 12px 24px;
  background: linear-gradient(135deg, #f59e0b, $warning-600);
  color: #fff; border: none; border-radius: 12px; font-size: $font-sm; font-weight: 700;
  cursor: pointer; transition: all .2s; box-shadow: 0 4px 14px rgba(245,158,11,.3);
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245,158,11,.35); }
}

/* ====== 登记弹窗复用 ====== */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,.45);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-panel {
  background: #fff; border-radius: 20px; width: 640px; max-height: 85vh;
  display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(15,23,42,.15);
  overflow: hidden;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid $gray-100;
  h3 { font-size: $font-lg; font-weight: 700; color: $text-primary; margin: 0; }
}
.modal-close {
  width: 32px; height: 32px; border-radius: 50%; border: 1px solid $gray-200;
  background: #fff; font-size: 14px; cursor: pointer; color: $text-hint;
  display: flex; align-items: center; justify-content: center; transition: .2s;
  &:hover { background: $gray-100; color: $text-primary; }
}
.modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }
.modal-footer {
  display: flex; gap: $space-sm; justify-content: flex-end;
  padding: 16px 24px; border-top: 1px solid $gray-100;
}

.form-group { margin-bottom: $space-md; }
.form-label { font-size: 13px; font-weight: 700; color: $text-primary; display: block; margin-bottom: 6px; }
.required { color: $danger; }
.form-row { display: flex; gap: $space-md; margin-bottom: $space-sm;
  &.cols-2 > .form-group { flex: 1; }
}
.form-input, select.form-input {
  width: 100%; padding: 10px 14px; border: 1px solid $gray-200; border-radius: 10px;
  font-size: $font-sm; color: $text-primary; outline: none; transition: border .2s; box-sizing: border-box;
  background: #fff;
  &::placeholder { color: $gray-300; }
  &:focus { border-color: $primary; box-shadow: 0 0 0 3px rgba(26,95,220,.08); }
}
.form-textarea {
  width: 100%; padding: 10px 14px; border: 1px solid $gray-200; border-radius: 10px;
  font-size: $font-sm; color: $text-primary; outline: none; resize: vertical; box-sizing: border-box;
  font-family: inherit;
  &::placeholder { color: $gray-300; }
  &:focus { border-color: $primary; box-shadow: 0 0 0 3px rgba(26,95,220,.08); }
}

/* 严重程度选择器 */
.severity-selector { display: flex; gap: 6px; }
.sv-option {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 10px 6px; border: 2px solid $gray-200; border-radius: 12px; cursor: pointer;
  transition: all .2s; background: #fff;
  input { display: none; }
  .sv-dot { width: 10px; height: 10px; border-radius: 50%; }
  .sv-label { font-size: 12px; font-weight: 600; color: $text-secondary; }
  &.selected { border-color: var(--sv-color, $primary); background: $primary-bg; }
  &:hover:not(.selected) { border-color: $gray-300; background: $gray-50; }
}

.btn-cancel {
  padding: 10px 20px; background: $gray-100; color: $text-secondary; border: none;
  border-radius: 10px; font-size: $font-sm; font-weight: 600; cursor: pointer; transition: .2s;
  &:hover { background: $gray-200; }
}
.btn-draft {
  padding: 10px 20px; background: #fff; color: $primary; border: 2px solid $primary;
  border-radius: 10px; font-size: $font-sm; font-weight: 600; cursor: pointer; transition: .2s;
  &:hover { background: $primary-bg; }
}
.btn-submit {
  padding: 10px 20px; background: linear-gradient(135deg, #0ea85e, $accent-green);
  color: #fff; border: none; border-radius: 10px; font-size: $font-sm; font-weight: 700;
  cursor: pointer; transition: .2s; box-shadow: 0 2px 8px rgba(14,168,94,.25);
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(14,168,94,.3); }
}
</style>
