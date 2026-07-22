<template>
  <div class="hazard-page">
    <SceneFlow flow-key="hazard" />
    <div class="page-header">
      <h2>隐患治理与安全督办</h2>
      <p class="page-subtitle">本公司隐患闭环 + 安全督办独立流转，两张单据可互查但不替代</p>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <button class="btn-reset" @click="resetData">恢复演示初始状态</button>
    </div>

    <!-- 隐患登记入口（APP + PC 双通道，置于台账之前） -->
    <section class="ov-section">
      <h3 class="section-title">隐患登记入口</h3>
      <div class="entry-wrap">
        <!-- APP 端随手拍 -->
        <div class="entry-card entry-app">
          <div class="entry-head">📱 APP 移动现场 · 随手拍上报</div>
          <p class="entry-desc">现场人员点击「随手拍」后进入上报界面，拍照取证、选择区域与严重程度、填写描述后一键上报，隐患实时同步至下方台账（与 PC 端数据同源、状态联动）。</p>
          <MobileField embedded embedded-view="hazard-report" />
        </div>
        <!-- PC 端登记 -->
        <div class="entry-card entry-pc">
          <div class="entry-head">💻 PC 端登记</div>
          <p class="entry-desc">安全管理员在 PC 端手工录入隐患信息，适配桌面办公与批量登记场景。</p>
          <button class="btn-new-hazard" @click="showHazardForm = true">➕ 登记新隐患</button>
        </div>
      </div>
    </section>

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
        <div class="detail-actions">
          <button class="btn-sm btn-primary" @click="convertHazardToSupervision(selectedHazard)">🔄 转督办</button>
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

    <!-- 安全督办 -->
    <section class="ov-section">
      <div class="section-title-row">
        <h3 class="section-title">安全督办清单</h3>
        <button class="btn-new-supervision" @click="openSupervisionForm">➕ 发起督办</button>
      </div>
      <div class="section-card" style="padding:0; overflow:hidden">
        <table class="data-table">
          <thead>
            <tr><th>编号</th><th>关联隐患</th><th>所属公司</th><th>严重程度</th><th>状态</th><th>发起人</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="s in localSupervisions" :key="s.id" @click="showSupervisionDetail(s)" style="cursor:pointer">
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
      <h3 class="section-title">安全督办详情</h3>
      <div class="section-card">
        <div class="detail-grid">
          <div class="detail-item"><label>督办编号</label><span>{{ selectedSupervision.id }}</span></div>
          <div class="detail-item"><label>关联隐患</label><span>{{ selectedSupervision.hazardTitle }}</span></div>
          <div class="detail-item"><label>所属公司</label><span>{{ selectedSupervision.orgName }}</span></div>
          <div class="detail-item"><label>责任人</label><span>{{ selectedSupervision.responsibleName || '—' }}</span></div>
          <div class="detail-item"><label>要求完成期限</label><span>{{ selectedSupervision.deadline || '—' }}</span></div>
          <div class="detail-item"><label>状态</label><span class="tag tag-orange">{{ selectedSupervision.status }}</span></div>
        </div>

        <!-- 督办操作 -->
        <div class="detail-actions">
          <button v-if="selectedSupervision.status === '待接收'" class="btn-sm btn-primary" @click="receiveSupervision(selectedSupervision)">接收督办</button>
          <button v-if="selectedSupervision.status !== '已关闭'" class="btn-sm" @click="openFeedbackForm">提交进度反馈</button>
          <button v-if="selectedSupervision.status !== '已关闭'" class="btn-sm btn-danger" @click="closeSupervision(selectedSupervision)">关闭督办</button>
        </div>

        <!-- 督办流转进度 -->
        <div class="hazard-flow-chain">
          <div class="chain-header">
            <span>🔗 督办流转进度</span>
            <span class="chain-badge" :class="supervisionFlowBadgeClass">{{ supervisionFlowBadge }}</span>
          </div>
          <div class="chain-track">
            <div class="chain-fill" :style="{ width: supervisionFlowProgress + '%' }"></div>
            <div v-for="(step, i) in supervisionFlowSteps" :key="step.key"
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

        <!-- 进度反馈输入 -->
        <div class="detail-desc" v-if="showFeedbackForm">
          <label>提交进度反馈</label>
          <textarea class="form-textarea" v-model="feedbackInput" rows="2" placeholder="填写当前处置进度，如：已完成管路排查，正在更换密封件"></textarea>
          <div class="detail-actions" style="margin-top:8px">
            <button class="btn-sm btn-primary" @click="submitFeedback(selectedSupervision)">提交</button>
            <button class="btn-sm" @click="cancelFeedbackForm">取消</button>
          </div>
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
          <strong>⚠️ 独立流转原则：</strong>安全督办是关联原隐患的独立单据。公司关闭督办不等于代替所属公司关闭原隐患，两单状态独立但可互查。
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

    <!-- ====== 发起督办弹窗 ====== -->
    <div class="modal-overlay" v-if="showSupervisionForm" @click.self="cancelSupervisionForm">
      <div class="modal-panel">
        <div class="modal-header">
          <h3>📌 发起安全督办</h3>
          <button class="modal-close" @click="cancelSupervisionForm">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">关联隐患</label>
              <select class="form-input" v-model="newSupervision.hazardId">
                <option value="">— 不关联 —</option>
                <option v-for="h in localHazards" :key="h.id" :value="h.id">{{ h.id }} {{ h.title }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">所属公司 <span class="required">*</span></label>
              <select class="form-input" v-model="newSupervision.orgId">
                <option v-for="o in orgOptions" :key="o.id" :value="o.id">{{ o.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">督办标题 <span class="required">*</span></label>
            <input class="form-input" v-model="newSupervision.title" placeholder="简明扼要描述督办事项" />
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">严重程度 <span class="required">*</span></label>
              <div class="severity-selector">
                <label v-for="sv in severityOptions" :key="sv.value" class="sv-option" :class="{ selected: newSupervision.severity === sv.value }">
                  <input type="radio" v-model="newSupervision.severity" :value="sv.value" />
                  <span class="sv-dot" :style="{ background: sv.color }"></span>
                  <span class="sv-label">{{ sv.value }}</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">要求完成期限 <span class="required">*</span></label>
              <input class="form-input" v-model="newSupervision.deadline" placeholder="如：2026-07-25" />
            </div>
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">责任人</label>
              <input class="form-input" v-model="newSupervision.responsibleName" placeholder="被督办单位责任人" />
            </div>
            <div class="form-group">
              <label class="form-label">发起人 <span class="required">*</span></label>
              <input class="form-input" v-model="newSupervision.initiatorName" placeholder="公司安环发起人" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">督办内容与要求</label>
            <textarea class="form-textarea" v-model="newSupervision.opinion" rows="3" placeholder="明确督办事项、处置要求与反馈频次"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="cancelSupervisionForm">取消</button>
          <button class="btn-submit" @click="submitSupervision">📌 发起督办</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hazards, supervisions, HAZARD_STATUS } from '@/store/safeData';
import MobileField from './MobileField.vue';
import SceneFlow from '@/components/safety/SceneFlow.vue';

export default {
  name: 'HazardSupervision',
  components: { MobileField, SceneFlow },
  data() {
    return {
      // 直接引用 store，使 PC 登记与 APP 移动端上报同源联动（Vue 初始化时 observe 该数组）
      localHazards: hazards,
      seedHazards: null,
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
      },
      // 督办流转定义
      supervisionFlowDef: [
        { key: 'initiate', label: '督办发起', role: '公司安环' },
        { key: 'receive', label: '督办接收', role: '所属公司' },
        { key: 'feedback', label: '进度反馈', role: '所属公司' },
        { key: 'close', label: '督办关闭', role: '公司安环' }
      ],
      supervisionStatusStepMap: {
        '待接收': 1,
        '跟进中': 2,
        '待反馈确认': 3,
        '已关闭': 4
      },
      showFeedbackForm: false,
      feedbackInput: '',
      // 发起督办表单
      showSupervisionForm: false,
      newSupervision: this.createEmptySupervision(),
      orgOptions: [
        { id: 3, name: '铸锻件分公司' },
        { id: 4, name: '矿山分公司' },
        { id: 5, name: '工程起重机公司' },
        { id: 6, name: '太原重工各分子公司' }
      ]
    };
  },
  created() {
    this.seedHazards = JSON.parse(JSON.stringify(hazards));
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
    },
    // 督办流转进度
    supervisionFlowSteps() {
      if (!this.selectedSupervision) return this.supervisionFlowDef.map((s, i) => ({ ...s, done: false, active: false }))
      const total = this.supervisionFlowDef.length
      const sidx = this.supervisionStatusStepMap[this.selectedSupervision.status]
      if (sidx === undefined) return this.supervisionFlowDef.map((s, i) => ({ ...s, done: false, active: i === 0 }))
      return this.supervisionFlowDef.map((s, i) => ({
        ...s,
        done: i < sidx,
        active: i === sidx && sidx < total
      }))
    },
    supervisionFlowProgress() {
      if (!this.selectedSupervision) return 0
      const total = this.supervisionFlowDef.length
      const sidx = this.supervisionStatusStepMap[this.selectedSupervision.status]
      if (sidx === undefined) return 0
      return Math.min(100, Math.round((sidx / total) * 100))
    },
    supervisionFlowBadge() {
      if (!this.selectedSupervision) return '-'
      return this.selectedSupervision.status
    },
    supervisionFlowBadgeClass() {
      if (!this.selectedSupervision) return ''
      const st = this.selectedSupervision.status
      if (st === '已关闭') return 'badge-done'
      if (st === '待接收') return 'badge-progress'
      return 'badge-review'
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
    // ===== 督办操作 =====
    nowStamp() { return new Date().toISOString().replace('T', ' ').slice(0, 16); },
    receiveSupervision(s) {
      if (s.status !== '待接收') return
      s.status = '跟进中'
      s.receiveTime = this.nowStamp()
      s.timeline.push({ time: s.receiveTime, action: '所属公司确认接收督办，启动处置流程', operator: s.orgName + '·安环' })
    },
    openFeedbackForm() {
      this.feedbackInput = ''
      this.showFeedbackForm = true
    },
    cancelFeedbackForm() {
      this.feedbackInput = ''
      this.showFeedbackForm = false
    },
    submitFeedback(s) {
      if (!this.feedbackInput.trim()) {
        alert('请填写反馈内容')
        return
      }
      const t = this.nowStamp()
      s.feedback.push({ time: t, content: this.feedbackInput.trim(), operator: s.orgName + '·安环' })
      s.timeline.push({ time: t, action: '提交处置进度反馈', operator: s.orgName + '·安环' })
      if (s.status === '待接收') s.status = '跟进中'
      if (s.status === '跟进中') s.status = '待反馈确认'
      this.feedbackInput = ''
      this.showFeedbackForm = false
    },
    closeSupervision(s) {
      if (confirm('确认关闭该安全督办？\n注意：关闭督办不等于替代原隐患闭环，两单状态独立。')) {
        s.status = '已关闭'
        const t = this.nowStamp()
        s.timeline.push({ time: t, action: '公司安环关闭督办', operator: '公司安环' })
      }
    },
    reviewHazard(h) {
      if (confirm('确认复查通过，关闭隐患 ' + h.title + '？')) {
        h.status = '已闭环';
        h.timeline.push({ time: '2026-07-16 10:00', action: '复查通过，隐患闭环', operator: '李明辉' });
      }
    },

    // ===== 发起督办 =====
    createEmptySupervision() {
      return {
        id: '', hazardId: '', hazardTitle: '',
        severity: '重大', orgId: 3, orgName: '铸锻件分公司',
        initiatorName: '', status: '待接收',
        opinion: '', responsibleName: '', deadline: '',
        createTime: '', feedback: [], timeline: []
      };
    },
    generateSupervisionId() {
      const now = new Date();
      const y = now.getFullYear().toString();
      const m = (now.getMonth() + 1).toString().padStart(2, '0');
      const d = now.getDate().toString().padStart(2, '0');
      const seq = (this.localSupervisions.length + 1).toString().padStart(3, '0');
      return `DB${y}${m}${d}${seq}`;
    },
    openSupervisionForm() {
      this.newSupervision = this.createEmptySupervision();
      this.showSupervisionForm = true;
    },
    cancelSupervisionForm() {
      this.showSupervisionForm = false;
    },
    submitSupervision() {
      const f = this.newSupervision;
      if (!f.title.trim()) { alert('请填写督办标题'); return; }
      if (!f.deadline.trim()) { alert('请填写要求完成期限'); return; }
      if (!f.initiatorName.trim()) { alert('请填写发起人'); return; }
      const org = this.orgOptions.find(o => o.id === f.orgId) || this.orgOptions[0];
      const hazard = this.localHazards.find(h => h.id === f.hazardId);
      f.hazardTitle = hazard ? hazard.title : (f.title || '（未关联隐患）');
      f.orgName = org.name;
      f.id = this.generateSupervisionId();
      f.status = '待接收';
      const t = this.nowStamp();
      f.createTime = t;
      f.timeline = [{ time: t, action: `公司安环就「${f.hazardTitle}」发起督办`, operator: f.initiatorName }];
      f.feedback = [];
      this.localSupervisions.unshift(JSON.parse(JSON.stringify(f)));
      this.showSupervisionForm = false;
      this.selectedSupervision = this.localSupervisions[0];
      this.selectedHazard = null;
      alert(`安全督办 ${f.id} 已发起，当前状态：待接收。等待 ${org.name} 接收督办。`);
    },
    convertHazardToSupervision(h) {
      const t = this.nowStamp();
      const sup = {
        id: this.generateSupervisionId(),
        hazardId: h.id,
        hazardTitle: h.title,
        severity: h.severity,
        orgId: 3,
        orgName: '铸锻件分公司',
        initiatorName: '公司安环·王总监',
        status: '待接收',
        opinion: '由隐患「' + h.title + '」转督办' + (h.description ? '：' + h.description : ''),
        createTime: t,
        responsibleName: h.rectifierName || '',
        deadline: h.deadline || '',
        feedback: [],
        timeline: [{ time: t, action: `由隐患 ${h.id}「${h.title}」转督办`, operator: '公司安环·王总监' }]
      };
      this.localSupervisions.unshift(sup);
      this.selectedHazard = null;
      this.selectedSupervision = sup;
      alert(`已将隐患 ${h.id} 转为安全督办 ${sup.id}，当前状态：待接收。`);
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
      hazards.unshift(JSON.parse(JSON.stringify(this.newHazard)));
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
      hazards.unshift(JSON.parse(JSON.stringify(this.newHazard)));
      this.showHazardForm = false;
      this.newHazard = this.createEmptyHazard();
      this.selectedSupervision = null;
      this.selectedHazard = this.localHazards[0];
      alert(`隐患 ${this.selectedHazard.id} 已登记，当前状态：待受理。流程将依次经过：受理分派→整改执行→复查验收→闭环归档。`);
    },
    resetData() {
      hazards.length = 0;
      this.seedHazards.forEach(h => hazards.push(JSON.parse(JSON.stringify(h))));
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
.detail-actions { display: flex; flex-wrap: wrap; gap: 8px; margin: $space-md 0; }
.btn-danger { background: $danger-600; color: #fff; border: none; cursor: pointer; &:hover { background: $danger; } }

.ov-section { margin-bottom: $space-2xl; }
.section-title { font-size: $font-md; font-weight: 700; color: $text-primary; margin-bottom: $space-md; padding-left: 12px; border-left: 4px solid $primary; }
.section-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: $space-md; }
.section-title-row .section-title { margin-bottom: 0; }
.app-entry-sub { font-size: $font-sm; color: $text-hint; line-height: 1.7; margin-bottom: $space-md; max-width: 720px; }
/* 隐患登记入口（APP + PC 双通道） */
.entry-wrap { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: $space-xl; align-items: stretch; }
.entry-card { background: #fff; border: 1px solid rgba(15,23,42,.08); border-radius: 16px; padding: $space-lg; box-shadow: 0 2px 12px rgba(15,23,42,.04); display: flex; flex-direction: column; gap: $space-sm; }
.entry-head { font-size: $font-md; font-weight: 700; color: $text-primary; display: flex; align-items: center; gap: 6px; }
.entry-desc { font-size: $font-xs; color: $text-secondary; line-height: 1.7; margin: 0; }
/* 左侧 APP 通道：手机壳缩小并居中 */
.entry-app { align-items: center; justify-content: center; text-align: center; }
.entry-app :deep(.phone-frame) { width: 290px; margin: 0 auto; }
.entry-app :deep(.phone-screen) { min-height: 470px; max-height: 520px; font-size: 11px; }
/* 仅本页内嵌 APP 的「所属区域」下拉框水平居中，文本框保持左对齐 */
.entry-app :deep(.mrf-select) { display: block; width: fit-content; min-width: 55%; max-width: 100%; margin: 0 auto; }
/* 右侧 PC 通道：内容垂直居中 */
.entry-pc { justify-content: center; }
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
.btn-new-supervision {
  padding: 8px 18px;
  background: linear-gradient(135deg, #1a5fdc, $brand-600);
  color: #fff; border: none; border-radius: 12px; font-size: $font-sm; font-weight: 700;
  cursor: pointer; transition: all .2s; box-shadow: 0 4px 14px rgba(26,95,220,.3);
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,95,220,.35); }
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
