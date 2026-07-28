<template>
  <div class="detail-page">
    <div class="detail-top">
      <button class="back-btn" @click="goBack">‹ 返回台账</button>
      <span class="tag" :class="permit ? permitStatusTag(permit.status) : ''" v-if="permit">{{ getPermitStatus(permit.status) }}</span>
    </div>

    <div v-if="permit" class="section-card">
      <h3 class="detail-head">作业票详情：{{ permit.title }}</h3>

      <!-- 流程节点 -->
      <div class="flow-steps">
        <div class="flow-step" v-for="(step, i) in dynamicFlowSteps" :key="step.key + i"
          :class="{ done: dynamicStepIndex(step.key, i) < currentDynamicStepIndex, current: step.key === currentStep, blocked: permit.blocked }">
          <div class="step-dot" :class="{ active: dynamicStepIndex(step.key, i) <= currentDynamicStepIndex }">{{ step.icon }}</div>
          <div class="step-label">{{ step.label }}</div>
          <div class="step-role">{{ step.role }}</div>
          <div v-if="i < dynamicFlowSteps.length - 1" class="step-line" :class="{ active: dynamicStepIndex(step.key, i) < currentDynamicStepIndex }"></div>
        </div>
      </div>

      <!-- 作业票核心信息 -->
      <div class="permit-info-grid">
        <div class="info-item"><label>作业票号</label><span>{{ permit.id }}</span></div>
        <div class="info-item"><label>作业类型</label><span>{{ getWorkType(permit.workType) }}</span></div>
        <div class="info-item"><label>责任部门</label><span>{{ permit.applicantDept }}</span></div>
        <div class="info-item"><label>作业区域</label><span>{{ permit.zoneName }}</span></div>
        <div class="info-item"><label>作业时间</label><span>{{ permit.duration }}</span></div>
        <div class="info-item" v-if="permit.workType === 'HIGH_ALTITUDE'"><label>作业高度</label><span>{{ permit.height }}</span></div>
        <div class="info-item" v-if="permit.workType === 'HIGH_ALTITUDE' && permit.workLevel"><label>作业等级</label><span class="work-level-tag" :class="'level-' + permit.workLevel">{{ permit.workLevel }}（{{ permit.heightLevel }}）</span></div>
        <div class="info-item" v-if="permit.workType === 'LIFTING'"><label>吊载重量</label><span>{{ permit.loadWeight }}</span></div>
        <div class="info-item" v-if="permit.workType === 'LIFTING' && permit.workLevel"><label>作业类别</label><span class="work-level-tag level-特殊">{{ permit.workLevel }}起重吊装</span></div>
        <div class="info-item" v-if="permit.workType === 'TEMPORARY_ELECTRICITY'"><label>用电参数</label><span>{{ permit.voltage }} / {{ permit.power }}</span></div>
        <div class="info-item" v-if="permit.workType === 'FIRE'"><label>动火级别</label><span class="work-level-tag" :class="'level-' + permit.workLevel">{{ permit.fireLevel || permit.workLevel }}动火</span></div>
        <div class="info-item" v-if="permit.validity"><label>许可证有效期</label><span class="validity-tag">⏱ {{ permit.validity }}</span></div>
      </div>

      <!-- 分级审批链（按作业类型+级别差异化，依据危险作业安全管控制度） -->
      <div class="approval-chain-box" v-if="permit.approvalChain">
        <div class="chain-head">
          <span class="chain-label">分级审批链</span>
          <span class="chain-tip">按「{{ getWorkType(permit.workType) }}
            <template v-if="permit.workLevel">· {{ permit.workLevel }}</template>」逐级审批（{{ approvalNodes.length }} 个节点）</span>
        </div>
        <div class="chain-nodes">
          <template v-for="(node, i) in approvalNodes">
            <span class="chain-node" :key="'n-' + i">{{ node }}</span>
            <span v-if="i < approvalNodes.length - 1" class="chain-sep" :key="'s-' + i">→</span>
          </template>
        </div>
      </div>

      <!-- 作业人员 -->
      <div class="detail-desc">
        <label>作业人员</label>
        <div class="worker-list">
          <div class="worker-item" v-for="w in permit.workers" :key="w.name">
            <span class="worker-name">{{ w.name }}</span>
            <span class="worker-role">{{ w.role }}</span>
          </div>
        </div>
      </div>

      <!-- 安全措施与检查项 -->
      <div class="detail-desc">
        <label>安全措施</label>
        <div class="measure-list">
          <span class="measure-tag" v-for="m in permit.safetyMeasures" :key="m">{{ m }}</span>
        </div>
      </div>

      <div class="detail-desc">
        <label>风险重点</label>
        <div class="risk-hl-list">
          <span class="risk-hl" v-for="r in permit.riskHighlights" :key="r">{{ r }}</span>
        </div>
      </div>

      <div class="detail-desc">
        <label>关键控制证据</label>
        <div class="check-list">
          <div class="check-item" v-for="c in permit.checks" :key="c.item">
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
      <div class="block-panel" v-if="permit.blocked">
        <div class="block-title">⛔ 提交被阻断</div>
        <div class="block-reason" v-for="(r, i) in permit.blockReasons" :key="i">
          <div><strong>{{ r.person || '系统' }}</strong> <span class="tag tag-red">阻断</span></div>
          <div class="block-issue">{{ r.issue }}</div>
          <div class="block-action">{{ r.action }}</div>
        </div>
        <button class="btn-fix" @click="fixQualifications(permit)">演示：补齐资格后恢复提交</button>
      </div>

      <!-- 审批/监护/验收按钮 -->
      <div class="action-buttons" v-if="!permit.blocked && permit.status !== '已归档'">
        <button v-if="permit.status === '待监护确认'" class="btn-act btn-guardian" @click="confirmGuardian(permit)">
          ✅ 监护人确认开工条件
        </button>
        <button v-if="permit.status === '作业中'" class="btn-act btn-primary" @click="finishWork(permit)">
          🏁 完工验收
        </button>
        <button v-if="permit.status === '待完工验收'" class="btn-act btn-success" @click="archiveWork(permit)">
          📦 安环归档
        </button>
      </div>

      <!-- 时间线 -->
      <div class="timeline">
        <div class="timeline-item" v-for="(t, i) in permit.timeline" :key="i">
          <div class="timeline-dot" :class="{ active: i === permit.timeline.length - 1 }"></div>
          <div class="timeline-content">
            <span class="timeline-time">{{ t.time }}</span>
            <span class="timeline-action">{{ t.action }}</span>
            <span class="timeline-operator">— {{ t.operator }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">🔍</div>
      <div>未找到该作业票（{{ $route.params.id }}）</div>
      <button class="back-btn" @click="goBack">返回台账</button>
    </div>
  </div>
</template>

<script>
import { workPermits, WORK_TYPE, WORK_PERMIT_STATUS, WORK_PERMIT_STEPS } from '@/store/safeData';

export default {
  name: 'WorkPermitDetail',
  computed: {
    permit() {
      return workPermits.find(p => p.id === this.$route.params.id) || null;
    },
    currentStep() { return this.permit ? this.permit.status : null; },
    currentStepIndex() {
      if (!this.permit) return 0;
      const key = this.mapStatusToKey(this.permit.status);
      const idx = this.dynamicFlowSteps.findIndex(s => s.key === key);
      return idx >= 0 ? idx : 0;
    },
    currentDynamicStepIndex() { return this.currentStepIndex; },
    approvalNodes() {
      if (!this.permit || !this.permit.approvalChain) return [];
      return this.permit.approvalChain.split('→').map(s => s.trim()).filter(Boolean);
    },
    dynamicFlowSteps() {
      if (!this.permit) return WORK_PERMIT_STEPS;
      const chain = this.approvalNodes;
      if (!chain.length) return WORK_PERMIT_STEPS;
      const fixedStart = WORK_PERMIT_STEPS.slice(0, 2);
      const fixedEnd = WORK_PERMIT_STEPS.slice(3);
      const steps = [
        ...fixedStart,
        { key: 'PENDING_SAFETY_REVIEW', label: '分级审批链', role: chain.join(' → ') || '公司安环人员', icon: '👀' }
      ];
      return [...steps, ...fixedEnd];
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
    dynamicStepIndex(key, i) { return i; },
    mapStatusToKey(status) {
      const map = {
        '草稿': 'DRAFT',
        '待前置核验': 'PENDING_CHECK',
        '待安环审核': 'PENDING_SAFETY_REVIEW',
        '待领导审批': 'PENDING_SAFETY_REVIEW',
        '待监护确认': 'PENDING_GUARDIAN',
        '作业中': 'IN_PROGRESS',
        '待完工验收': 'PENDING_ACCEPTANCE',
        '已归档': 'ARCHIVED'
      };
      return map[status] || status;
    },
    goBack() { this.$router.push({ name: 'SpecialWork' }); },
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.detail-page { max-width: 960px; margin: 0 auto; }
.detail-top { display: flex; align-items: center; gap: 12px; margin-bottom: $space-lg; }
.back-btn {
  padding: 8px 16px; border: 1px solid $gray-200; background: #fff; color: $text-secondary;
  border-radius: 10px; font-size: $font-sm; font-weight: 600; cursor: pointer; transition: .2s;
  &:hover { border-color: $primary; color: $primary; }
}
.detail-head { font-size: $font-lg; font-weight: 700; color: $text-primary; margin-bottom: $space-lg; }

.section-card { background: #fff; border-radius: 16px; padding: $space-lg $space-xl; border: 1px solid rgba(15,23,42,.06); box-shadow: 0 2px 12px rgba(15,23,42,.04); }

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

.approval-chain-box { margin-bottom: $space-lg; padding: 12px 16px; background: $info-bg; border-radius: 10px; border: 1px solid #bae6fd; }
.chain-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.chain-head .chain-label { font-size: $font-sm; font-weight: 700; color: $primary; }
.chain-tip { font-size: 12px; color: $text-hint; font-weight: 500; }
.chain-nodes { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.chain-node { display: inline-block; padding: 4px 12px; background: #fff; border: 1px solid $primary; border-radius: 16px; font-size: 12px; font-weight: 600; color: $primary; }
.chain-sep { color: $primary; font-weight: 700; margin: 0 1px; }

.validity-tag { display: inline-block; padding: 1px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; background: #fef3c7; color: #92600a; }

.work-level-tag { display: inline-block; padding: 1px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;
  &.level-一级 { background: #dcfce7; color: $success-700; }
  &.level-二级 { background: #fef9c3; color: $warning-700; }
  &.level-三级 { background: #fed7aa; color: $danger-700; }
  &.level-特级 { background: #fecaca; color: $danger-700; }
  &.level-特殊 { background: #e0e7ff; color: #4338ca; }
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

.empty-state { text-align: center; padding: 60px 20px; color: $text-hint; }
.empty-icon { font-size: 40px; margin-bottom: 12px; }
</style>
