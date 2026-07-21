<template>
  <div class="work-page">
    <div class="page-header">
      <h2>特殊作业管控</h2>
      <p class="page-subtitle">高处、吊装与临时用电作业统一流程：申请→前置核验→安环审核→领导审批→监护确认→作业→验收→归档</p>
    </div>

    <!-- 作业票申请入口 -->
    <section class="permit-entry">
      <h3 class="section-title">作业票申请入口</h3>
      <div class="pe-block">
        <div class="pe-label">📱 APP 端 · 现场随手申请作业票</div>
        <div class="pe-app">
          <MobileField embedded embedded-view="work-permit-apply" />
        </div>
      </div>
      <div class="pe-block">
        <div class="pe-label">💻 PC 端 · 规范填报与审批</div>
        <button class="btn-new-application" @click="showApplicationForm = true">➕ 新建作业票申请</button>
      </div>
    </section>

    <!-- 态势卡片 v2 -->
    <div class="stat-gallery-sw">
      <div class="sw-stat" v-for="s in swStats" :key="s.label">
        <div class="sw-glow" :style="{ background: s.grad }"></div>
        <div class="sw-icon" :style="{ background: s.grad }">{{ s.icon }}</div>
        <div class="sw-body">
          <span class="sw-value" :style="{ color: s.color }">{{ s.value }}</span>
          <span class="sw-label">{{ s.label }}</span>
        </div>
        <div class="sw-border" :style="{ background: s.grad }"></div>
      </div>
    </div>

    <!-- 作业类型切换 -->
    <div class="work-type-tabs">
      <button class="type-tab" :class="{ active: activeType === 'ALL' }" @click="activeType = 'ALL'">全部作业</button>
      <button class="type-tab" :class="{ active: activeType === 'HIGH_ALTITUDE' }" @click="activeType = 'HIGH_ALTITUDE'">🏗️ 高处作业</button>
      <button class="type-tab" :class="{ active: activeType === 'LIFTING' }" @click="activeType = 'LIFTING'">⛓ 吊装作业</button>
      <button class="type-tab" :class="{ active: activeType === 'TEMPORARY_ELECTRICITY' }" @click="activeType = 'TEMPORARY_ELECTRICITY'">⚡ 临时用电</button>
    </div>

    <!-- 作业票列表 -->
    <section class="ov-section">
      <div class="permit-list">
        <div class="permit-card" v-for="wp in filteredPermits" :key="wp.id" @click="selectPermit(wp)" :class="{ selected: wp === selectedPermit, blocked: wp.blocked }">
          <div class="permit-card-header">
            <span class="permit-id">{{ wp.id }}</span>
            <span class="permit-type">{{ getWorkType(wp.workType) }}</span>
            <span class="tag" :class="permitStatusTag(wp.status)">{{ getPermitStatus(wp.status) }}</span>
          </div>
          <div class="permit-card-title">{{ wp.title }}</div>
          <div class="permit-card-meta">
            <span>{{ wp.zoneName }}</span>
            <span>申请人：{{ wp.applicantName }}</span>
          </div>
          <div class="permit-card-bar" v-if="wp.blocked">
            <span class="block-text">⛔ 资格未满足，提交被阻断</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 选中作业票的详情面板 -->
    <section class="ov-section" v-if="selectedPermit">
      <h3 class="section-title">作业票详情：{{ selectedPermit.title }}</h3>
      <div class="section-card">
        <!-- 流程节点 -->
        <div class="flow-steps">
          <div class="flow-step" v-for="(step, i) in flowSteps" :key="step.key"
            :class="{ done: stepIndex(step.key) < currentStepIndex, current: step.key === currentStep, blocked: selectedPermit.blocked }">
            <div class="step-dot" :class="{ active: stepIndex(step.key) <= currentStepIndex }">{{ step.icon }}</div>
            <div class="step-label">{{ step.label }}</div>
            <div class="step-role">{{ step.role }}</div>
            <div v-if="i < flowSteps.length - 1" class="step-line" :class="{ active: stepIndex(step.key) < currentStepIndex }"></div>
          </div>
        </div>

        <!-- 作业票核心信息 -->
        <div class="permit-info-grid">
          <div class="info-item"><label>作业类型</label><span>{{ getWorkType(selectedPermit.workType) }}</span></div>
          <div class="info-item"><label>责任部门</label><span>{{ selectedPermit.applicantDept }}</span></div>
          <div class="info-item"><label>作业区域</label><span>{{ selectedPermit.zoneName }}</span></div>
          <div class="info-item"><label>作业时间</label><span>{{ selectedPermit.duration }}</span></div>
          <div class="info-item" v-if="selectedPermit.workType === 'HIGH_ALTITUDE'"><label>作业高度</label><span>{{ selectedPermit.height }}</span></div>
          <div class="info-item" v-if="selectedPermit.workType === 'HIGH_ALTITUDE' && selectedPermit.workLevel"><label>作业等级</label><span class="work-level-tag" :class="'level-' + selectedPermit.workLevel">{{ selectedPermit.workLevel }}（{{ selectedPermit.heightLevel }}）</span></div>
          <div class="info-item" v-if="selectedPermit.workType === 'LIFTING'"><label>吊载重量</label><span>{{ selectedPermit.loadWeight }}</span></div>
          <div class="info-item" v-if="selectedPermit.workType === 'TEMPORARY_ELECTRICITY'"><label>用电参数</label><span>{{ selectedPermit.voltage }} / {{ selectedPermit.power }}</span></div>
        </div>

        <!-- 分级审批链 -->
        <div class="approval-chain" v-if="selectedPermit.approvalChain">
          <span class="chain-label">审批层级</span>
          <span class="chain-path">{{ selectedPermit.approvalChain }}</span>
        </div>

        <!-- 作业人员 -->
        <div class="detail-desc">
          <label>作业人员</label>
          <div class="worker-list">
            <div class="worker-item" v-for="w in selectedPermit.workers" :key="w.name">
              <span class="worker-name">{{ w.name }}</span>
              <span class="worker-role">{{ w.role }}</span>
            </div>
          </div>
        </div>

        <!-- 安全措施与检查项 -->
        <div class="detail-desc">
          <label>安全措施</label>
          <div class="measure-list">
            <span class="measure-tag" v-for="m in selectedPermit.safetyMeasures" :key="m">{{ m }}</span>
          </div>
        </div>

        <div class="detail-desc">
          <label>风险重点</label>
          <div class="risk-hl-list">
            <span class="risk-hl" v-for="r in selectedPermit.riskHighlights" :key="r">{{ r }}</span>
          </div>
        </div>

        <div class="detail-desc">
          <label>关键控制证据</label>
          <div class="check-list">
            <div class="check-item" v-for="c in selectedPermit.checks" :key="c.item">
              <span class="check-no" v-if="c.no">{{ c.no }}</span>
              <span class="check-icon">{{ c.checked !== false ? '✅' : '⬜' }}</span>
              <span class="check-text">
                <strong>{{ c.item }}</strong>
                <span class="check-detail" v-if="c.detail"> — {{ c.detail }}</span>
                <span class="check-result">{{ c.result }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- 阻断信息 -->
        <div class="block-panel" v-if="selectedPermit.blocked">
          <div class="block-title">⛔ 提交被阻断</div>
          <div class="block-reason" v-for="(r, i) in selectedPermit.blockReasons" :key="i">
            <div><strong>{{ r.person || '系统' }}</strong> <span class="tag tag-red">阻断</span></div>
            <div class="block-issue">{{ r.issue }}</div>
            <div class="block-action">{{ r.action }}</div>
          </div>
          <button class="btn-fix" @click="fixQualifications(selectedPermit)">演示：补齐资格后恢复提交</button>
        </div>

        <!-- 审批/监护/验收按钮 -->
        <div class="action-buttons" v-if="!selectedPermit.blocked && selectedPermit.status !== '已归档'">
          <button v-if="selectedPermit.status === '待监护确认'" class="btn-act btn-guardian" @click="confirmGuardian(selectedPermit)">
            ✅ 监护人确认开工条件
          </button>
          <button v-if="selectedPermit.status === '作业中'" class="btn-act btn-primary" @click="finishWork(selectedPermit)">
            🏁 完工验收
          </button>
          <button v-if="selectedPermit.status === '待完工验收'" class="btn-act btn-success" @click="archiveWork(selectedPermit)">
            📦 安环归档
          </button>
        </div>

        <!-- 时间线 -->
        <div class="timeline">
          <div class="timeline-item" v-for="(t, i) in selectedPermit.timeline" :key="i">
            <div class="timeline-dot" :class="{ active: i === selectedPermit.timeline.length - 1 }"></div>
            <div class="timeline-content">
              <span class="timeline-time">{{ t.time }}</span>
              <span class="timeline-action">{{ t.action }}</span>
              <span class="timeline-operator">— {{ t.operator }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== 新建作业票申请弹窗 ====== -->
    <div class="modal-overlay" v-if="showApplicationForm" @click.self="cancelApplication">
      <div class="modal-panel">
        <div class="modal-header">
          <h3>📝 新建特殊作业票申请</h3>
          <button class="modal-close" @click="cancelApplication">✕</button>
        </div>
        <div class="modal-body">
          <!-- 作业类型 -->
          <div class="form-group">
            <label class="form-label">作业类型 <span class="required">*</span></label>
            <div class="type-selector">
              <label v-for="wt in workTypeOptions" :key="wt.value"
                class="type-option" :class="{ selected: newPermit.workType === wt.value }">
                <input type="radio" v-model="newPermit.workType" :value="wt.value" />
                <span class="type-emoji">{{ wt.emoji }}</span>
                <span class="type-name">{{ wt.label }}</span>
              </label>
            </div>
          </div>

          <!-- 基本信息行 -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">作业标题 <span class="required">*</span></label>
              <input class="form-input" v-model="newPermit.title" placeholder="如：厂房屋面通风器检修高处作业" />
            </div>
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">申请部门</label>
              <input class="form-input" v-model="newPermit.applicantDept" placeholder="如：设备动力部" />
            </div>
            <div class="form-group">
              <label class="form-label">作业区域</label>
              <input class="form-input" v-model="newPermit.zoneName" placeholder="如：厂房屋面检修区" />
            </div>
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">申请人</label>
              <input class="form-input" v-model="newPermit.applicantName" placeholder="作业申请人姓名" />
            </div>
            <div class="form-group">
              <label class="form-label">监护人</label>
              <input class="form-input" v-model="newPermit.guardianName" placeholder="现场监护人姓名（可后续指定）" />
            </div>
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label class="form-label">计划作业时间</label>
              <input class="form-input" v-model="newPermit.duration" placeholder="如：2026-07-16 08:00 ~ 17:00" />
            </div>
            <div class="form-group" v-if="newPermit.workType === 'HIGH_ALTITUDE'">
              <label class="form-label">作业高度</label>
              <input class="form-input" v-model="newPermit.height" placeholder="如：8.5m" />
            </div>
            <div class="form-group" v-if="newPermit.workType === 'LIFTING'">
              <label class="form-label">吊载重量</label>
              <input class="form-input" v-model="newPermit.loadWeight" placeholder="如：18t" />
            </div>
            <div class="form-group" v-if="newPermit.workType === 'TEMPORARY_ELECTRICITY'">
              <label class="form-label">电压 / 功率</label>
              <input class="form-input" v-model="newPermit.voltage" placeholder="如：380V / 30kW" />
            </div>
          </div>

          <!-- 作业人员 -->
          <div class="form-group">
            <label class="form-label">作业人员</label>
            <div class="worker-input-row">
              <input class="form-input worker-input" v-model="workerInput.name" placeholder="姓名" style="flex:1" />
              <input class="form-input worker-input" v-model="workerInput.role" placeholder="角色（如：作业人、监护人）" style="flex:2" />
              <button class="btn-add-worker" @click="addWorker">+ 添加</button>
            </div>
            <div class="worker-tags" v-if="newPermit.workers.length">
              <span class="worker-chip" v-for="(w, i) in newPermit.workers" :key="i">
                {{ w.name }}（{{ w.role }}）
                <button class="chip-remove" @click="removeWorker(i)">✕</button>
              </span>
            </div>
          </div>

          <!-- 安全措施（快捷勾选） -->
          <div class="form-group">
            <label class="form-label">安全措施</label>
            <div class="measure-checklist">
              <label class="measure-check" v-for="m in safetyMeasureOptions" :key="m">
                <input type="checkbox" :value="m" v-model="newPermit.safetyMeasures" />
                <span>{{ m }}</span>
              </label>
            </div>
          </div>

          <!-- 风险重点 -->
          <div class="form-group">
            <label class="form-label">风险重点及注意事项</label>
            <textarea class="form-textarea" v-model="riskInput" placeholder="每行一条风险，如：&#10;坠落高度8.5m&#10;屋面结构承载确认&#10;工具防掉落措施" rows="3"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="cancelApplication">取消</button>
          <button class="btn-draft" @click="saveDraft">💾 保存草稿</button>
          <button class="btn-submit" @click="submitApplication">🚀 提交申请</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { workPermits, WORK_TYPE, WORK_PERMIT_STATUS, WORK_PERMIT_STEPS } from '@/store/safeData';
import MobileField from '@/views/safety-platform/MobileField.vue';

export default {
  name: 'SpecialWork',
  components: { MobileField },
  data() {
    return {
      localPermits: workPermits,
      selectedPermit: null,
      activeType: 'ALL',
      flowSteps: WORK_PERMIT_STEPS,
      // 新建申请表单
      showApplicationForm: false,
      workerInput: { name: '', role: '' },
      riskInput: '',
      newPermit: this.createEmptyPermit(),
      workTypeOptions: [
        { value: 'HIGH_ALTITUDE', label: '高处作业', emoji: '🏗️' },
        { value: 'LIFTING', label: '吊装作业', emoji: '⛓' },
        { value: 'TEMPORARY_ELECTRICITY', label: '临时用电', emoji: '⚡' }
      ],
      safetyMeasureOptions: [
        '安全帽+安全带+安全绳', '生命线系统', '防坠落网', '警戒区域设置',
        '吊装方案审批', '起重设备日检合格', '警戒区域硬隔离', '人员站位确认',
        '临时用电方案审批', '配电箱漏保测试', '电缆架空敷设', '电缆过路保护',
        '挂牌锁定程序', '通风检测', '通讯设备完好', '消防器材就位', '应急物资就位'
      ]
    };
  },
  computed: {
    filteredPermits() {
      if (this.activeType === 'ALL') return this.localPermits;
      return this.localPermits.filter(p => p.workType === this.activeType);
    },
    activePermits() { return this.localPermits.filter(p => p.status !== '草稿' && p.status !== '已归档'); },
    guardianPending() { return this.localPermits.filter(p => p.status === '待监护确认'); },
    blockedPermits() { return this.localPermits.filter(p => p.blocked); },
    completedPermits() { return this.localPermits.filter(p => p.status === '已归档'); },
    currentStep() { return this.selectedPermit ? this.selectedPermit.status : null; },
    currentStepIndex() {
      if (!this.selectedPermit) return 0;
      const key = this.mapStatusToKey(this.selectedPermit.status);
      const idx = WORK_PERMIT_STEPS.findIndex(s => s.key === key);
      return idx >= 0 ? idx : 0;
    },
    swStats() {
      return [
        { label: '当前待推进', value: this.activePermits.length, icon: '📋', color: '#3b82f6', grad: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
        { label: '现场监护关口', value: this.guardianPending.length, icon: '🛡️', color: '#f59e0b', grad: 'linear-gradient(135deg, #f59e0b, #d97706)' },
        { label: '资格阻断', value: this.blockedPermits.length, icon: '🚫', color: '#ef4444', grad: 'linear-gradient(135deg, #ef4444, #dc2626)' },
        { label: '已归档', value: this.completedPermits.length, icon: '✅', color: '#0ea85e', grad: 'linear-gradient(135deg, #0ea85e, #059669)' }
      ];
    }
  },
  methods: {
    getWorkType(t) { return WORK_TYPE[t] ? WORK_TYPE[t].label : t; },
    getPermitStatus(s) { return WORK_PERMIT_STATUS[s] || s; },
    permitStatusTag(s) {
      if (s === '已驳回') return 'tag-red';
      if (s === '已归档') return 'tag-green';
      if (s === '待监护确认') return 'tag-orange';
      if (s === '作业中') return 'tag-blue';
      if (s === '草稿') return 'tag-gray';
      return 'tag-orange';
    },
    selectPermit(wp) { this.selectedPermit = wp; },
    stepIndex(key) { return WORK_PERMIT_STEPS.findIndex(s => s.key === key); },
    mapStatusToKey(status) {
      const map = {
        '草稿': 'DRAFT',
        '待前置核验': 'PENDING_CHECK',
        '待安环审核': 'PENDING_SAFETY_REVIEW',
        '待领导审批': 'PENDING_LEADER_APPROVAL',
        '待监护确认': 'PENDING_GUARDIAN',
        '作业中': 'IN_PROGRESS',
        '待完工验收': 'PENDING_ACCEPTANCE',
        '已归档': 'ARCHIVED'
      };
      return map[status] || status;
    },

    fixQualifications(wp) {
      wp.blocked = false;
      wp.blockReasons = [];
      wp.checks = [
        { no: 1, item: '作业人员高处作业证', detail: '赵永刚证书已更新至2027-07-10', result: '有效 ✓', checked: true },
        { no: 2, item: '监护人指定', detail: '陈文斌（安全生产管理证有效）', result: '已指定 ✓', checked: true },
        { no: 3, item: '高空作业平台检查', detail: '移动式高空平台检测合格', result: '合格 ✓', checked: true },
        { no: 4, item: '防坠落措施', detail: '安全绳+安全带+防坠网已就位', result: '已就位 ✓', checked: true },
        { no: 5, item: '安全帽佩戴', detail: '安全帽在有效期内', result: '通过 ✓', checked: true }
      ];
      wp.guardianId = 6; wp.guardianName = '陈文斌';
      wp.workers.push({ id: 6, name: '陈文斌', role: '监护人' });
      wp.status = '待安环审核';
      wp.timeline.push({ time: '2026-07-16 09:30', action: '补齐资质：赵永刚高处作业证更新，陈文斌指定为监护人', operator: '系统' });
      wp.timeline.push({ time: '2026-07-16 09:31', action: '资格校验通过，提交恢复', operator: '系统' });
      alert('资格已补齐！赵永刚高处作业证已更新，陈文斌已指定为监护人。作业票状态恢复为"待安环审核"。');
    },
    confirmGuardian(wp) {
      if (confirm('确认开工条件已满足，进入作业执行？')) {
        wp.status = '作业中';
        wp.guardianTime = '2026-07-16 08:00';
        wp.timeline.push({ time: '2026-07-16 08:00', action: '监护人陈文斌确认开工条件，作业开始', operator: '陈文斌' });
        alert('监护确认完成，作业已开始。');
      }
    },
    finishWork(wp) {
      if (confirm('确认作业已完成，提交完工验收？')) {
        wp.status = '待完工验收';
        wp.finishTime = '2026-07-16 11:00';
        wp.timeline.push({ time: '2026-07-16 11:00', action: '作业完成，提交完工申请', operator: wp.applicantName });
        alert('作业完成，等待安环验收。');
      }
    },
    archiveWork(wp) {
      if (confirm('确认验收合格，归档？')) {
        wp.status = '已归档';
        wp.archiveTime = '2026-07-16 14:00';
        wp.archiverName = '李明辉';
        wp.timeline.push({ time: '2026-07-16 14:00', action: '安环验收合格，归档', operator: '李明辉' });
        alert('验收通过，作业票已归档。');
      }
    },

    // ===== 新建申请相关 =====
    createEmptyPermit() {
      return {
        id: '', workType: 'HIGH_ALTITUDE', status: '草稿',
        orgId: 3, deptId: 5, zoneId: '', zoneName: '',
        title: '', applicantId: 9, applicantName: '', applicantDept: '',
        duration: '', height: '', workLevel: '', loadWeight: '', voltage: '',
        approvalChain: '部门负责人 → 安环室 → 分管领导',
        workers: [], guardianId: null, guardianName: '',
        safetyMeasures: [], riskHighlights: [],
        checks: [], timeline: [],
        reviewTime: null, reviewName: null, approveTime: null, approveName: null,
        guardianTime: null, startTime: null, finishTime: null, archiveTime: null
      };
    },
    cancelApplication() {
      this.showApplicationForm = false;
    },
    addWorker() {
      if (!this.workerInput.name.trim()) return;
      this.newPermit.workers.push({
        name: this.workerInput.name.trim(),
        role: this.workerInput.role.trim() || '作业人'
      });
      this.workerInput = { name: '', role: '' };
    },
    removeWorker(index) {
      this.newPermit.workers.splice(index, 1);
    },
    generatePermitId() {
      const now = new Date();
      const y = now.getFullYear().toString();
      const m = (now.getMonth() + 1).toString().padStart(2, '0');
      const d = now.getDate().toString().padStart(2, '0');
      const seq = (this.localPermits.length + 1).toString().padStart(3, '0');
      return `GZ${y}${m}${d}${seq}`;
    },
    saveDraft() {
      if (!this.newPermit.title.trim()) {
        alert('请至少填写作业标题');
        return;
      }
      this.newPermit.id = this.generatePermitId();
      this.newPermit.status = '草稿';
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      this.newPermit.timeline = [
        { time: now, action: `${this.newPermit.applicantName || '申请人'}创建草稿`, operator: this.newPermit.applicantName || '申请人' }
      ];
      this.localPermits.unshift(JSON.parse(JSON.stringify(this.newPermit)));
      this.showApplicationForm = false;
      this.newPermit = this.createEmptyPermit();
      this.riskInput = '';
      this.selectedPermit = this.localPermits[0];
    },
    submitApplication() {
      if (!this.newPermit.title.trim() || !this.newPermit.applicantName.trim()) {
        alert('请至少填写作业标题和申请人');
        return;
      }
      // 自动推时间（精确到今日）并设时长（若未填）
      if (!this.newPermit.duration.trim()) {
        const today = new Date().toISOString().slice(0, 10);
        this.newPermit.duration = `${today} 08:00 ~ ${today} 18:00`;
      }
      // 类型专属默认值
      if (this.newPermit.workType === 'HIGH_ALTITUDE' && !this.newPermit.height) this.newPermit.height = '待确认';
      if (this.newPermit.workType === 'LIFTING' && !this.newPermit.loadWeight) this.newPermit.loadWeight = '待确认';
      if (this.newPermit.workType === 'TEMPORARY_ELECTRICITY' && !this.newPermit.voltage) this.newPermit.voltage = '待确认';

      this.newPermit.id = this.generatePermitId();
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

      // 风险输入按行分割
      this.newPermit.riskHighlights = this.riskInput.split('\n').map(s => s.trim()).filter(Boolean);

      // 构建时间线：申请提交 → 前置核验 → 进入安环审核
      this.newPermit.timeline = [
        { time: now, action: `${this.newPermit.applicantName}提交${this.getWorkType(this.newPermit.workType)}作业申请`, operator: this.newPermit.applicantName },
        { time: now, action: '系统自动前置核验：待安环人员复核', operator: '系统' }
      ];

      // 模拟：如有监护人就正常推进，否则显示阻断提示
      if (this.newPermit.guardianName.trim()) {
        this.newPermit.status = '待安环审核';
        this.newPermit.timeline.push({ time: now, action: '前置核验通过，进入安环审核', operator: '系统' });
      } else {
        this.newPermit.status = '待前置核验';
        this.newPermit.blocked = true;
        this.newPermit.blockReasons = [{
          person: '系统', issue: '未指定监护人（监护确认前需补齐）',
          action: '请在安环审核阶段补充监护人员信息'
        }];
      }

      this.localPermits.unshift(JSON.parse(JSON.stringify(this.newPermit)));
      this.showApplicationForm = false;
      this.newPermit = this.createEmptyPermit();
      this.riskInput = '';
      this.selectedPermit = this.localPermits[0];
      alert(`作业票 ${this.selectedPermit.id} 已提交，当前状态：${this.selectedPermit.status}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.work-page { max-width: 960px; }
.page-header {
  margin-bottom: $space-xl;
  h2 { font-size: $font-2xl; font-weight: 700; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; }
}

/* 新建申请按钮 */
.btn-new-application {
  margin-top: $space-md; padding: 12px 24px;
  background: linear-gradient(135deg, #1e6fff, $brand-700);
  color: #fff; border: none; border-radius: 12px; font-size: $font-sm; font-weight: 700;
  cursor: pointer; transition: all .2s; box-shadow: 0 4px 14px rgba(30,111,255,.3);
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(30,111,255,.35); }
}

/* 作业票申请入口（APP 在上，PC 在下） */
.permit-entry { margin-bottom: $space-2xl; }
.pe-block { margin-bottom: $space-lg; }
.pe-label {
  font-size: 13px; font-weight: 700; color: $text-primary; margin-bottom: $space-sm;
  display: flex; align-items: center; gap: 6px;
}
.pe-app { display: flex; justify-content: flex-start; }
.pe-app :deep(.phone-frame) { width: 340px; margin: 0; }
.pe-app :deep(.phone-screen) { min-height: 520px; max-height: 560px; font-size: 11px; }

/* V2 gradient stat gallery */
.stat-gallery-sw { display: flex; gap: 14px; margin-bottom: $space-xl; }
.sw-stat {
  flex: 1; position: relative; background: #fff; border-radius: 14px;
  padding: 18px 16px; box-shadow: 0 2px 12px rgba(15,23,42,.06); overflow: hidden;
  border: 1px solid rgba(15,23,42,.06); transition: transform .2s, box-shadow .2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(15,23,42,.08); }
}
.sw-glow { position: absolute; top: -16px; right: -16px; width: 56px; height: 56px; border-radius: 50%; opacity: .07; }
.sw-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center;
  justify-content: center; font-size: 16px; margin-bottom: 10px; opacity: .15; }
.sw-body { position: relative; z-index: 1; }
.sw-value { font-size: 28px; font-weight: 900; line-height: 1; display: block; }
.sw-label { font-size: 12px; color: $text-secondary; display: block; margin-top: 4px; }
.sw-border { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; opacity: .5; }

.work-type-tabs { display: flex; gap: $space-sm; margin-bottom: $space-lg; }
.type-tab {
  padding: 7px 18px; border-radius: 20px; font-size: $font-sm; border: 1px solid $gray-200; background: #fff;
  color: $text-secondary; cursor: pointer; font-weight: 600; transition: all .2s;
  &.active { background: $primary; color: #fff; border-color: $primary; box-shadow: 0 2px 8px rgba(26,95,220,.25); }
  &:hover:not(.active) { border-color: $primary; color: $primary; }
}

.ov-section { margin-bottom: $space-2xl; }
.section-title { font-size: $font-md; font-weight: 700; color: $text-primary; margin-bottom: $space-md; padding-left: 12px; border-left: 4px solid $primary; }
.section-card { background: #fff; border-radius: 16px; padding: $space-lg $space-xl; border: 1px solid rgba(15,23,42,.06); box-shadow: 0 2px 12px rgba(15,23,42,.04); }

.permit-list { display: flex; flex-direction: column; gap: $space-sm; }
.permit-card {
  background: #fff; border-radius: 12px; border: 1px solid $gray-200; padding: 14px 16px;
  cursor: pointer; transition: all .2s;
  &:hover { border-color: $primary; box-shadow: 0 4px 16px rgba(15,23,42,.06); transform: translateX(3px); }
  &.selected { border-color: $primary; box-shadow: 0 0 0 3px rgba(26,95,220,.08); background: $primary-bg; }
  &.blocked { border-color: $danger-100; background: #fefafafa; }
  &-header { display: flex; align-items: center; gap: $space-sm; margin-bottom: 4px; }
  &-id { font-family: monospace; font-size: 11px; color: $text-hint; }
  &-type { font-size: $font-sm; font-weight: 700; color: $text-primary; }
  &-title { font-size: $font-sm; color: $text-secondary; margin-bottom: 4px; }
  &-meta { font-size: 11px; color: $text-hint; display: flex; gap: $space-lg; }
  &-bar { margin-top: $space-sm; padding: 6px 12px; background: $danger-100; border-radius: 8px; }
}
.block-text { font-size: 11px; color: $danger; font-weight: 600; }

.flow-steps {
  display: flex; align-items: flex-start; overflow-x: auto; gap: 0;
  padding: 20px 0; margin-bottom: 20px; border-bottom: 1px solid $gray-100;
}
.flow-step {
  display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 84px;
  position: relative; flex-shrink: 0;
  &.blocked { opacity: .4; }
}
.step-dot {
  width: 34px; height: 34px; border-radius: 50%; background: $gray-200; display: flex;
  align-items: center; justify-content: center; font-size: 14px; transition: all .3s;
  border: 3px solid $gray-200;
  &.active { background: #fff; border-color: $primary; box-shadow: 0 0 0 5px rgba(26,95,220,.08); }
}
.step-label { font-size: 11px; color: $text-secondary; text-align: center; font-weight: 600; }
.step-role { font-size: 9px; color: $text-hint; }
.step-line { position: absolute; top: 17px; left: calc(50% + 17px); width: calc(100% - 34px); height: 3px; background: $gray-200; z-index: -1; border-radius: 2px;
  &.active { background: $primary; }
}
.flow-step.done .step-dot { background: $accent-green; border-color: $accent-green; color: #fff; }

.permit-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-sm $space-xl; margin-bottom: $space-lg; }
.info-item {
  label { font-size: 11px; color: $text-hint; display: block; margin-bottom: 2px; }
  span { font-size: $font-sm; color: $text-primary; }
}

.detail-desc { margin-bottom: $space-md;
  label { font-size: 11px; color: $text-hint; display: block; margin-bottom: 4px; }
}
.worker-list { display: flex; gap: $space-sm; }
.worker-item { padding: 6px 12px; background: $gray-50; border-radius: $radius-sm; font-size: $font-xs;
  .worker-name { font-weight: 500; color: $text-primary; }
  .worker-role { color: $text-hint; margin-left: 6px; }
}
.measure-list { display: flex; flex-wrap: wrap; gap: 4px; }
.measure-tag { font-size: 11px; padding: 3px 8px; background: $success-100; color: $success-700; border-radius: $radius-sm; }
.risk-hl-list { display: flex; flex-wrap: wrap; gap: 4px; }
.risk-hl { font-size: 11px; padding: 3px 8px; background: $danger-100; color: $danger-700; border-radius: $radius-sm; }
.check-list { display: flex; flex-direction: column; gap: 6px; }
.check-item { display: flex; align-items: flex-start; gap: 6px; font-size: $font-xs; color: $text-secondary; padding: 4px 0; border-bottom: 1px solid $gray-100; }
.check-no { width: 18px; height: 18px; border-radius: 50%; background: $primary-bg; color: $primary; font-size: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 600; margin-top: 1px; }
.check-icon { font-size: 12px; flex-shrink: 0; margin-top: 1px; }
.check-text { line-height: 1.5;
  strong { color: $text-primary; }
}
.check-detail { color: $text-hint; font-size: 10px; }
.check-result { color: $success; font-size: 10px; margin-left: 4px; }

.approval-chain { display: flex; align-items: center; gap: $space-sm; margin-bottom: $space-lg; padding: 10px 16px; background: $info-bg; border-radius: 10px; border: 1px solid #bae6fd; font-size: $font-xs; font-weight: 600; }
.chain-label { color: $text-hint; flex-shrink: 0; }
.chain-path { color: $primary; font-weight: 700; }

.work-level-tag { display: inline-block; padding: 1px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;
  &.level-一级 { background: #dcfce7; color: $success-700; }
  &.level-二级 { background: #fef9c3; color: $warning-700; }
  &.level-三级 { background: #fed7aa; color: $danger-700; }
  &.level-特级 { background: #fecaca; color: $danger-700; }
}

.block-panel { padding: $space-lg; background: $danger-100; border-radius: 12px; border: 1px solid $danger-100; margin: $space-lg 0; }
.block-title { font-size: $font-base; font-weight: 700; color: $danger-700; margin-bottom: $space-sm; }
.block-reason { margin-bottom: $space-sm; padding-bottom: $space-sm; border-bottom: 1px solid $danger-100; }
.block-issue { font-size: $font-sm; color: $danger; margin: 4px 0; }
.block-action { font-size: $font-xs; color: $text-secondary; }
.btn-fix {
  margin-top: $space-sm; padding: 9px 18px; background: $danger; color: #fff; border: none; border-radius: 10px;
  font-size: $font-sm; font-weight: 600; cursor: pointer; transition: .2s;
  &:hover { background: $danger-600; transform: translateY(-1px); }
}

.action-buttons { display: flex; gap: $space-sm; margin-top: 20px; }
.btn-act {
  padding: 10px 20px; border-radius: 10px; font-size: $font-sm; font-weight: 700; border: none; cursor: pointer; transition: .2s;
  &.btn-guardian { background: linear-gradient(135deg, #f59e0b, $warning-600); color: #fff; box-shadow: 0 2px 8px rgba(245,158,11,.3); &:hover { transform: translateY(-1px); } }
  &.btn-primary { background: $primary; color: #fff; box-shadow: 0 2px 8px rgba(26,95,220,.25); &:hover { transform: translateY(-1px); } }
  &.btn-success { background: linear-gradient(135deg, #0ea85e, $accent-green); color: #fff; box-shadow: 0 2px 8px rgba(14,168,94,.3); &:hover { transform: translateY(-1px); } }
}

.timeline { padding-left: $space-base; margin-top: 20px;
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

/* ====== 申请弹窗样式 ====== */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,.45);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-panel {
  background: #fff; border-radius: 20px; width: 680px; max-height: 85vh;
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
.modal-body {
  padding: 20px 24px; overflow-y: auto; flex: 1;
}
.modal-footer {
  display: flex; gap: $space-sm; justify-content: flex-end;
  padding: 16px 24px; border-top: 1px solid $gray-100;
}

/* 表单元素 */
.form-group { margin-bottom: $space-md; }
.form-label { font-size: 13px; font-weight: 700; color: $text-primary; display: block; margin-bottom: 6px; }
.required { color: $danger; }
.form-row { display: flex; gap: $space-md; margin-bottom: $space-sm;
  &.cols-2 > .form-group { flex: 1; }
}
.form-input {
  width: 100%; padding: 10px 14px; border: 1px solid $gray-200; border-radius: 10px;
  font-size: $font-sm; color: $text-primary; outline: none; transition: border .2s; box-sizing: border-box;
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

/* 作业类型选择器 */
.type-selector { display: flex; gap: $space-sm; }
.type-option {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 14px 10px; border: 2px solid $gray-200; border-radius: 14px; cursor: pointer;
  transition: all .2s; background: #fff;
  input { display: none; }
  .type-emoji { font-size: 24px; }
  .type-name { font-size: 12px; font-weight: 600; color: $text-secondary; }
  &.selected { border-color: $primary; background: $primary-bg; box-shadow: 0 0 0 3px rgba(26,95,220,.06);
    .type-name { color: $primary; }
  }
  &:hover:not(.selected) { border-color: $gray-300; background: $gray-50; }
}

/* 人员添加 */
.worker-input-row { display: flex; gap: $space-sm; margin-bottom: $space-sm; }
.btn-add-worker {
  padding: 8px 16px; background: $primary; color: #fff; border: none; border-radius: 10px;
  font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: .2s;
  &:hover { background: $brand-700; }
}
.worker-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.worker-chip {
  display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px;
  background: $primary-bg; border-radius: 20px; font-size: 12px; color: $primary; font-weight: 500;
  .chip-remove { background: none; border: none; color: $text-hint; cursor: pointer; padding: 0; font-size: 12px;
    &:hover { color: $danger; }
  }
}

/* 安全措施多选 */
.measure-checklist { display: flex; flex-wrap: wrap; gap: 6px; }
.measure-check {
  display: flex; align-items: center; gap: 4px; padding: 6px 12px;
  background: $gray-50; border: 1px solid $gray-200; border-radius: 8px;
  font-size: 12px; color: $text-secondary; cursor: pointer; transition: .2s;
  input { accent-color: $primary; }
  &:hover { border-color: $primary; background: $primary-bg; }
}

/* 弹窗按钮 */
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
