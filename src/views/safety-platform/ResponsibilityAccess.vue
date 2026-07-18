<template>
  <div class="resp-page">
    <div class="page-header">
      <h2>责任与准入管理</h2>
      <p class="page-subtitle">人员资质、安全培训、准入闸门 —— 确保"人"这个最不可控因素始终处于受控状态</p>
    </div>

    <!-- 核心原则 -->
    <section class="ov-section">
      <h3 class="section-title">准入闸门机制</h3>
      <div class="gate-diagram">
        <div class="gate-node staff">
          <div class="gn-icon">👷</div>
          <div class="gn-label">作业人员</div>
        </div>
        <div class="gate-arrow">→</div>
        <div class="gate-node check">
          <div class="gn-icon">🔍</div>
          <div class="gn-label">资质核验</div>
          <div class="gn-detail">系统自动校验</div>
        </div>
        <div class="gate-arrow" :class="{ blocked: showBlocked }">→</div>
        <div class="gate-node decision">
          <div class="gn-icon">{{ showBlocked ? '🚫' : '✅' }}</div>
          <div class="gn-label">{{ showBlocked ? '准入被拒' : '准入通过' }}</div>
          <div class="gn-detail">{{ showBlocked ? '不满足条件' : '可参与作业' }}</div>
        </div>
        <div class="gate-arrow" v-if="!showBlocked">→</div>
        <div class="gate-node work" v-if="!showBlocked">
          <div class="gn-icon">🔧</div>
          <div class="gn-label">安全作业</div>
        </div>
      </div>
      <div class="gate-rules">
        <div class="gate-rule"><span class="gr-num">1</span>每项特殊作业必须指定持有有效证件的作业人员与监护人</div>
        <div class="gate-rule"><span class="gr-num">2</span>证件过期或缺失 → 系统自动阻断，作业票无法提交</div>
        <div class="gate-rule"><span class="gr-num">3</span>新员工/转岗人员须完成安全培训后方可获得准入资格</div>
        <div class="gate-rule"><span class="gr-num">4</span>特种作业证到期前30天系统预警，到期后自动冻结准入</div>
      </div>
      <div class="toggle-bar">
        <button class="btn-toggle" @click="showBlocked = !showBlocked">
          切换演示：{{ showBlocked ? '准入通过' : '准入阻断' }}
        </button>
        <span class="toggle-hint">
          {{ showBlocked ? '当前：赵永刚 高处作业证已过期，系统阻断' : '当前：孙志明 全部证件有效，准予作业' }}
        </span>
      </div>
    </section>

    <!-- 人员资质台账 -->
    <section class="ov-section">
      <h3 class="section-title">人员资质台账</h3>
      <div class="section-card" style="padding:0; overflow:hidden">
        <table class="data-table">
          <thead>
            <tr>
              <th>姓名</th><th>所属部门</th><th>岗位</th><th>持证情况</th><th>证书状态</th><th>最近培训</th><th>准入状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in personnelList" :key="p.id" :class="{ 'row-danger': p.accessStatus === '已冻结' }">
              <td><strong>{{ p.name }}</strong></td>
              <td>{{ p.deptName }}</td>
              <td>{{ p.role }}</td>
              <td>
                <span v-for="(q, qi) in p.qualifications" :key="qi" class="cert-tag" :class="certClass(q)">
                  {{ q.type }}
                </span>
              </td>
              <td>
                <span v-for="(q, qi) in p.qualifications" :key="qi" class="tag" :class="certStatusTag(q)">
                  {{ certStatusText(q) }}
                </span>
              </td>
              <td>{{ p.lastTraining }}</td>
              <td>
                <span class="tag" :class="p.accessStatus === '正常' ? 'tag-green' : 'tag-red'">
                  {{ p.accessStatus === '正常' ? '✅ 正常' : '🚫 已冻结' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 资质详情卡片 -->
    <section class="ov-section">
      <h3 class="section-title">重点人员资质详情</h3>
      <div class="cards-row">
        <div class="persona-card" v-for="p in keyPersonnel" :key="p.id" :class="{ blocked: p.blocked }">
          <div class="pc-header">
            <span class="pc-avatar">👷</span>
            <div class="pc-info">
              <div class="pc-name">{{ p.name }}</div>
              <div class="pc-role">{{ p.role }} · {{ p.deptName }}</div>
            </div>
            <span class="pc-status" :class="p.blocked ? 'frozen' : 'active'">
              {{ p.blocked ? '已冻结' : '正常' }}
            </span>
          </div>
          <div class="pc-body">
            <div class="pc-row" v-for="(q, qi) in p.qualifications" :key="qi">
              <span class="pcr-label">{{ q.type }}</span>
              <span class="pcr-expiry">有效期至 {{ q.expiry }}</span>
              <span class="tag tag-sm" :class="certStatusTag(q)">{{ certStatusText(q) }}</span>
            </div>
          </div>
          <div class="pc-training">
            <div class="pct-label">培训记录</div>
            <div class="pct-item" v-for="(t, ti) in p.training" :key="ti">{{ ti + 1 }}. {{ t }}</div>
          </div>
          <div class="pc-block-reason" v-if="p.blocked">
            <strong>⚠️ 准入阻断原因</strong>
            <div v-for="(r, ri) in p.blockReasons" :key="ri">{{ r }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 安全责任矩阵 -->
    <section class="ov-section">
      <h3 class="section-title">安全责任矩阵</h3>
      <div class="section-card" style="padding:0; overflow:auto">
        <table class="data-table matrix-table">
          <thead>
            <tr>
              <th style="min-width:120px">角色/职能</th>
              <th v-for="duty in dutyList" :key="duty.key" style="text-align:center;min-width:90px">{{ duty.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in matrixRoles" :key="r.key">
              <td><strong>{{ r.label }}</strong></td>
              <td v-for="duty in dutyList" :key="duty.key" style="text-align:center">
                <span v-if="r.duties[duty.key] === 'R'" class="matrix-badge responsible" title="负责">R</span>
                <span v-else-if="r.duties[duty.key] === 'A'" class="matrix-badge accountable" title="审批">A</span>
                <span v-else-if="r.duties[duty.key] === 'C'" class="matrix-badge consulted" title="咨询">C</span>
                <span v-else-if="r.duties[duty.key] === 'I'" class="matrix-badge informed" title="知会">I</span>
                <span v-else class="matrix-badge none">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="matrix-legend">
        <span class="ml-item"><span class="matrix-badge responsible">R</span> 负责执行</span>
        <span class="ml-item"><span class="matrix-badge accountable">A</span> 审批核准</span>
        <span class="ml-item"><span class="matrix-badge consulted">C</span> 咨询意见</span>
        <span class="ml-item"><span class="matrix-badge informed">I</span> 知会告知</span>
      </div>
    </section>

    <!-- 安全责任书签订与管理流程 -->
    <section class="ov-section">
      <h3 class="section-title">安全责任书签订与管理流程</h3>
      <div class="section-card">
        <!-- 责任书选择 -->
        <div class="resp-select-bar">
          <button v-for="r in respChains" :key="r.id"
            :class="['resp-chip', { active: selectedRespId === r.id }]"
            @click="selectedRespId = r.id">
            <span class="chip-icon">📄</span>
            <span class="chip-name">{{ r.deptName }}</span>
            <span class="chip-person">{{ r.responsibleName }}</span>
            <span :class="['chip-score', r.assessment ? 'score-high' : 'score-pending']">
              {{ r.assessment ? r.assessment.score + '分' : '待考核' }}
            </span>
          </button>
        </div>

        <template v-if="selectedResp">
          <!-- 流程步骤条 -->
          <div class="resp-flow-chain">
            <div class="chain-header">
              <span>🔗 {{ selectedResp.title }}</span>
              <span class="chain-badge" :class="respBadgeClass">{{ respBadge }}</span>
            </div>
            <div class="chain-track">
              <div class="chain-fill" :style="{ width: respProgress + '%' }"></div>
              <div v-for="(step, i) in respFlowSteps" :key="step.key"
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

          <!-- 基本信息 -->
          <div class="resp-info-grid">
            <div class="resp-info-item">
              <label>责任部门</label><span>{{ selectedResp.orgName }} · {{ selectedResp.deptName }}</span>
            </div>
            <div class="resp-info-item">
              <label>责任人</label><span class="fw-700">{{ selectedResp.responsibleName }}</span>
            </div>
            <div class="resp-info-item">
              <label>有效期</label><span>{{ selectedResp.period }}</span>
            </div>
            <div class="resp-info-item">
              <label>类型</label><span class="tag tag-blue">{{ selectedResp.type }}</span>
            </div>
          </div>

          <!-- 考核结果 -->
          <div class="resp-assess" v-if="selectedResp.assessment">
            <div class="assess-head">
              <span>📊 {{ selectedResp.currentStep >= 4 ? '最近考核结果' : '等待考核' }}</span>
              <span class="assess-score" :class="selectedResp.assessment.score >= 90 ? 'score-high' : 'score-mid'">
                {{ selectedResp.assessment.score }} 分 · {{ selectedResp.assessment.result }}
              </span>
            </div>
            <div class="assess-detail">
              <div><strong>发现问题：</strong>{{ selectedResp.assessment.issues.length ? selectedResp.assessment.issues.join('；') : '无' }}</div>
              <div><strong>改进措施：</strong>{{ selectedResp.assessment.improvements }}</div>
            </div>
          </div>

          <!-- 时间线 -->
          <div class="resp-timeline">
            <div class="tl-title">📜 操作记录</div>
            <div class="tl-item" v-for="(t, i) in selectedResp.timeline" :key="i">
              <div class="tl-dot" :class="{ last: i === selectedResp.timeline.length - 1 }"></div>
              <div class="tl-content">
                <span class="tl-time">{{ t.time }}</span>
                <span class="tl-action">{{ t.action }}</span>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="empty-hint">👆 请选择一个部门的责任书查看流程详情</div>
      </div>
    </section>

    <!-- 培训管理 -->
    <section class="ov-section">
      <h3 class="section-title">安全培训管理</h3>
      <div class="section-card">
        <div class="training-stats">
          <div class="ts-card">
            <div class="tsc-num">8</div><div class="tsc-label">在册人员</div>
          </div>
          <div class="ts-card">
            <div class="tsc-num">100%</div><div class="tsc-label">年度培训完成率</div>
          </div>
          <div class="ts-card warn">
            <div class="tsc-num">1</div><div class="tsc-label">持证异常人数</div>
          </div>
          <div class="ts-card ok">
            <div class="tsc-num">6</div><div class="tsc-label">特种作业持证人数</div>
          </div>
        </div>
        <div class="training-list">
          <div class="tl-title">近期培训记录</div>
          <div class="tl-item" v-for="(t, i) in recentTraining" :key="i">
            <span class="tli-icon">{{ t.icon }}</span>
            <span class="tli-name">{{ t.name }}</span>
            <span class="tli-date">{{ t.date }}</span>
            <span class="tli-count">{{ t.count }}人参训</span>
            <span class="tag tag-green">已完成</span>
          </div>
        </div>
        <div class="warning-box">
          <strong>⚠️ 即将到期提醒：</strong>李明辉的「特种设备管理证」将于2026-08-15到期（剩余30天），请督促完成换证培训。
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { personnel, departments, responsibilityChains, RESPONSIBILITY_STEPS } from '@/store/safeData';

export default {
  name: 'ResponsibilityAccess',
  data() {
    return {
      showBlocked: true,
      selectedRespId: responsibilityChains[0]?.id || null,
      respChains: responsibilityChains,
      respSteps: RESPONSIBILITY_STEPS,
      dutyList: [
        { key: 'hazard_discover', label: '隐患发现' },
        { key: 'hazard_rectify', label: '整改执行' },
        { key: 'hazard_review', label: '复查闭环' },
        { key: 'work_apply', label: '作业申请' },
        { key: 'work_approve', label: '作业审批' },
        { key: 'work_guardian', label: '现场监护' },
        { key: 'work_execute', label: '作业执行' },
        { key: 'supervision', label: '集团督办' },
        { key: 'training', label: '培训管理' }
      ],
      matrixRoles: [
        { key: 'group_leader', label: '集团领导', duties: { hazard_discover:'I', hazard_rectify:'I', hazard_review:'I', work_apply:'I', work_approve:'I', work_guardian:'I', work_execute:'I', supervision:'A', training:'I' } },
        { key: 'group_safety', label: '集团安环', duties: { hazard_discover:'C', hazard_rectify:'C', hazard_review:'I', work_apply:'I', work_approve:'I', work_guardian:'I', work_execute:'I', supervision:'R', training:'A' } },
        { key: 'company_leader', label: '公司领导', duties: { hazard_discover:'I', hazard_rectify:'I', hazard_review:'I', work_apply:'I', work_approve:'A', work_guardian:'I', work_execute:'I', supervision:'C', training:'I' } },
        { key: 'company_safety', label: '公司安环', duties: { hazard_discover:'C', hazard_rectify:'I', hazard_review:'A', work_apply:'I', work_approve:'C', work_guardian:'I', work_execute:'I', supervision:'C', training:'R' } },
        { key: 'dept_head', label: '车间负责人', duties: { hazard_discover:'R', hazard_rectify:'A', hazard_review:'C', work_apply:'A', work_approve:'C', work_guardian:'R', work_execute:'C', supervision:'I', training:'C' } },
        { key: 'field_worker', label: '现场人员/监护人', duties: { hazard_discover:'R', hazard_rectify:'R', hazard_review:'C', work_apply:'R', work_approve:'I', work_guardian:'R', work_execute:'R', supervision:'I', training:'I' } }
      ],
      recentTraining: [
        { icon: '📚', name: '2026年春季特种作业培训', date: '2026-04', count: 6 },
        { icon: '📚', name: '2026年风险分级管控培训', date: '2026-03', count: 8 },
        { icon: '📚', name: '2026年高处作业专项培训', date: '2026-03', count: 3 },
        { icon: '📚', name: '2026年应急管理培训', date: '2026-02', count: 8 },
        { icon: '📚', name: '2025年度安全培训', date: '2025-12', count: 8 }
      ]
    };
  },
  computed: {
    personnelList() {
      return personnel.map(p => ({
        ...p,
        deptName: this.getDeptName(p.deptId),
        lastTraining: p.training.length ? p.training[0].replace('2026年', '').replace('2025年', '') : '-',
        accessStatus: p.qualifications.some(q => q.status === 'expired') ? '已冻结' : '正常'
      }));
    },
    keyPersonnel() {
      return personnel.map(p => ({
        ...p,
        deptName: this.getDeptName(p.deptId),
        blocked: p.qualifications.some(q => q.status === 'expired'),
        blockReasons: p.qualifications
          .filter(q => q.status === 'expired')
          .map(q => q.type + '已于' + q.expiry + '过期，需重新培训取证')
      }));
    },
    selectedResp() {
      return this.respChains.find(r => r.id === this.selectedRespId) || null
    },
    respFlowSteps() {
      if (!this.selectedResp) return this.respSteps.map((s, i) => ({ ...s, done: false, active: false }))
      const idx = this.selectedResp.currentStep || 0
      const allDone = idx >= this.respSteps.length
      return this.respSteps.map((s, i) => ({
        ...s,
        done: allDone ? true : i < idx,
        active: allDone ? false : i === idx
      }))
    },
    respProgress() {
      if (!this.selectedResp) return 0
      const idx = this.selectedResp.currentStep || 0
      return Math.round((idx / (this.respSteps.length - 1)) * 100)
    },
    respBadge() {
      if (!this.selectedResp) return '-'
      const idx = this.selectedResp.currentStep || 0
      if (idx >= this.respSteps.length) return '全部完成'
      if (idx === this.respSteps.length - 1) return '待整改'
      if (idx === 0) return '签订中'
      return '流转中'
    },
    respBadgeClass() {
      if (!this.selectedResp) return ''
      const idx = this.selectedResp.currentStep || 0
      if (idx >= this.respSteps.length) return 'badge-done'
      if (idx === this.respSteps.length - 1) return 'badge-warn'
      return 'badge-progress'
    }
  },
  methods: {
    getDeptName(deptId) {
      const d = departments.find(d => d.id === deptId);
      return d ? d.name : '集团';
    },
    certClass(q) {
      if (q.status === 'expired') return 'cert-expired';
      if (q.status === 'expiring') return 'cert-expiring';
      return 'cert-valid';
    },
    certStatusTag(q) {
      if (q.status === 'expired') return 'tag-red';
      if (q.status === 'expiring') return 'tag-orange';
      return 'tag-green';
    },
    certStatusText(q) {
      if (q.status === 'expired') return '已过期';
      if (q.status === 'expiring') return '即将到期';
      return '有效';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.resp-page { max-width: 1000px; }
.page-header {
  margin-bottom: $space-xl;
  h2 { font-size: $font-2xl; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; }
}

.ov-section { margin-bottom: $space-2xl; }
.section-title { font-size: $font-md; font-weight: 600; color: $text-primary; margin-bottom: $space-md; padding-left: 12px; border-left: 3px solid $primary; }
.section-card { background: #fff; border-radius: $radius-lg; padding: $space-lg $space-xl; border: 1px solid $border; }

// Gate Diagram
.gate-diagram {
  display: flex; align-items: center; justify-content: center; gap: $space-base;
  background: #fff; border-radius: $radius-lg; padding: $space-xl; border: 1px solid $border;
  flex-wrap: wrap; margin-bottom: $space-base;
}
.gate-node {
  text-align: center; padding: $space-base $space-lg; border-radius: $radius-base; min-width: 100px;
  &.staff { background: #e8f0fe; border: 2px solid $info; }
  &.check { background: #fffbeb; border: 2px solid $warning; }
  &.decision { background: #f0fdf4; border: 2px solid $success; }
  &.work { background: #f3e8ff; border: 2px solid #9333ea; }
}
.gn-icon { font-size: 28px; margin-bottom: $space-xs; }
.gn-label { font-size: $font-sm; font-weight: 600; color: $text-primary; }
.gn-detail { font-size: $font-xs; color: $text-hint; margin-top: 2px; }
.gate-arrow { font-size: 20px; color: $text-hint; font-weight: bold; &.blocked { color: $danger; } }

.gate-rules {
  display: grid; grid-template-columns: 1fr 1fr; gap: $space-sm; margin-bottom: $space-md;
}
.gate-rule { font-size: $font-xs; color: $text-secondary; display: flex; align-items: flex-start; gap: $space-sm; background: $gray-50; padding: $space-sm $space-base; border-radius: $radius-sm; }
.gr-num { width: 20px; height: 20px; background: $primary; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; flex-shrink: 0; }

.toggle-bar { display: flex; align-items: center; gap: $space-md; }
.btn-toggle { font-size: $font-xs; padding: 4px 14px; border-radius: $radius-sm; background: $primary; color: #fff; border: none; cursor: pointer; &:hover { background: $primary-dark; } }
.toggle-hint { font-size: $font-xs; color: $text-hint; }

// Data Table
.data-table {
  width: 100%; border-collapse: collapse; font-size: $font-sm;
  th { background: $gray-50; padding: 10px $space-md; text-align: left; font-weight: 600; color: $text-primary; border-bottom: 2px solid $border; white-space: nowrap; }
  td { padding: 10px $space-md; border-bottom: 1px solid #f0f0f0; color: $text-secondary; vertical-align: middle; }
  tr:hover td { background: $gray-50; }
  .row-danger td { background: $danger-100; }
}
.tag { font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 500; white-space: nowrap; display: inline-block; margin-right: 4px; }
.tag-sm { font-size: 10px; padding: 1px 6px; }
.tag-green { background: #f0fdf4; color: $success-700; }
.tag-red { background: $danger-100; color: $danger-700; }
.tag-orange { background: #fff7ed; color: $danger-700; }
.tag-blue { background: #eff6ff; color: #1e40af; }
.cert-tag { font-size: 10px; padding: 1px 6px; border-radius: 4px; display: inline-block; margin: 2px 2px; background: #f0f0f0; color: #666; }
.cert-expired { background: $danger-100; color: $danger-700; }
.cert-expiring { background: #fff7ed; color: $danger-700; }

// Persona Cards
.cards-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: $space-base; }
.persona-card {
  background: #fff; border-radius: $radius-lg; border: 1px solid $border; overflow: hidden;
  &.blocked { border-color: $danger; }
  .pc-header {
    display: flex; align-items: center; gap: $space-md; padding: $space-base; border-bottom: 1px solid #f0f0f0;
  }
  .pc-avatar { font-size: 28px; }
  .pc-info { flex: 1; }
  .pc-name { font-size: $font-base; font-weight: 600; color: $text-primary; }
  .pc-role { font-size: $font-xs; color: $text-hint; }
  .pc-status { font-size: 10px; padding: 2px 10px; border-radius: 10px; font-weight: 500;
    &.active { background: #f0fdf4; color: $success-700; }
    &.frozen { background: $danger-100; color: $danger-700; }
  }
  .pc-body { padding: $space-sm $space-base; }
  .pc-row { display: flex; align-items: center; gap: $space-sm; padding: 4px 0; font-size: $font-xs; }
  .pcr-label { flex: 1; color: $text-secondary; font-weight: 500; }
  .pcr-expiry { color: $text-hint; font-size: 10px; }
  .pc-training { padding: $space-sm $space-base; background: $gray-50; }
  .pct-label { font-size: 10px; color: $text-hint; margin-bottom: 2px; text-transform: uppercase; }
  .pct-item { font-size: $font-xs; color: $text-secondary; padding: 1px 0; }
  .pc-block-reason {
    padding: $space-sm $space-base; background: $danger-100; border-top: 1px solid #fecaca; font-size: $font-xs; color: $danger-700;
    strong { display: block; margin-bottom: 2px; }
  }
}

// Matrix
.matrix-table { min-width: 800px; }
.matrix-table td, .matrix-table th { text-align: center; }
.matrix-badge {
  display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center;
  border-radius: 50%; font-size: 11px; font-weight: 700;
  &.responsible { background: #dbeafe; color: #1d4ed8; }
  &.accountable { background: #fce7f3; color: #9d174d; }
  &.consulted { background: #fef3c7; color: #92400e; }
  &.informed { background: #e0e7ff; color: #4338ca; }
  &.none { color: #d1d5db; }
}
.matrix-legend { display: flex; gap: $space-lg; margin-top: $space-md; font-size: $font-xs; color: $text-hint; }
.ml-item { display: flex; align-items: center; gap: $space-xs; }

// Training
.training-stats { display: flex; gap: $space-base; margin-bottom: $space-lg; }
.ts-card {
  flex: 1; text-align: center; padding: $space-base; background: $gray-50; border-radius: $radius-base;
  .tsc-num { font-size: $font-2xl; font-weight: 700; color: $text-primary; }
  .tsc-label { font-size: $font-xs; color: $text-hint; margin-top: 2px; }
  &.warn .tsc-num { color: $warning; }
  &.ok .tsc-num { color: $success; }
}
.training-list { margin-bottom: $space-base; }
.tl-title { font-size: $font-sm; font-weight: 600; color: $text-primary; margin-bottom: $space-sm; }
.tl-item {
  display: flex; align-items: center; gap: $space-md; padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size: $font-xs;
  .tli-icon { font-size: 16px; }
  .tli-name { flex: 1; color: $text-secondary; }
  .tli-date { color: $text-hint; }
  .tli-count { color: $text-hint; }
}
.warning-box {
  padding: $space-base; background: #fffbeb; border-radius: $radius-base;
  border-left: 3px solid $warning; font-size: $font-xs; color: #92400e; line-height: 1.6;
}

/* ====== 责任书流程 ====== */
.resp-select-bar { display: flex; gap: $space-sm; margin-bottom: $space-lg; flex-wrap: wrap; }
.resp-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; border: 1px solid $gray-200; background: #fff;
  border-radius: 12px; cursor: pointer; transition: all .2s;
  &.active { border-color: $primary; background: $primary-bg; box-shadow: 0 2px 8px rgba(26,95,220,.08); }
  &:hover:not(.active) { border-color: $primary; background: #fafcff; transform: translateY(-1px); }
}
.chip-icon { font-size: 16px; }
.chip-name { font-weight: 700; font-size: $font-sm; color: $text-primary; }
.chip-person { font-size: $font-xs; color: $text-hint; }
.chip-score { font-size: $font-xs; padding: 2px 8px; border-radius: 999px; font-weight: 700; }
.score-high { background: $success-100; color: $accent-green; }
.score-pending { background: $gray-100; color: $gray-400; }

.resp-flow-chain {
  background: linear-gradient(135deg, #f8fafc, $gray-100); border-radius: 14px;
  padding: 16px 20px; margin-bottom: $space-lg; border: 1px solid $gray-200;
}
.chain-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
  font-size: $font-sm; font-weight: 700; color: $text-primary;
}
.chain-badge {
  padding: 3px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; color: #fff;
  &.badge-done { background: linear-gradient(135deg, #0ea85e, $accent-green); }
  &.badge-progress { background: linear-gradient(135deg, #3b82f6, $brand-600); }
  &.badge-warn { background: linear-gradient(135deg, #f59e0b, $warning-600); }
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
  animation: respNodePulse 2s infinite;
}
@keyframes respNodePulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(59,130,246,.12); }
  50% { box-shadow: 0 0 0 10px rgba(59,130,246,.06); }
}
.pulse-dot {
  width: 8px; height: 8px; border-radius: 50%; background: $primary; animation: respDotPulse 1.2s infinite;
}
@keyframes respDotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .4; transform: scale(1.3); }
}
.node-text { text-align: center; }
.node-label { font-size: 11px; font-weight: 700; color: $text-primary; }
.node-role { font-size: 10px; color: $text-hint; margin-top: 1px; }
.chain-node.done .node-label { color: $accent-green; }
.chain-node.active .node-label { color: $primary; }

.resp-info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: $space-md; margin-bottom: $space-lg; }
.resp-info-item {
  padding: $space-sm $space-md; background: $bg-page; border-radius: $radius-base;
  label { display: block; font-size: $font-xs; color: $text-secondary; margin-bottom: 4px; }
  span { font-size: $font-sm; color: $text-primary; }
}

.resp-assess {
  padding: $space-md; background: linear-gradient(135deg, #f8fafc, $primary-bg);
  border-radius: 12px; border: 1px solid $gray-200; margin-bottom: $space-lg;
}
.assess-head { display: flex; align-items: center; justify-content: space-between; font-size: $font-sm; font-weight: 700; color: $text-primary; margin-bottom: $space-sm; }
.assess-score { font-size: $font-base; }
.assess-score.score-high { color: $accent-green; }
.assess-score.score-mid { color: $warning-500; }
.assess-detail { font-size: $font-xs; color: $text-secondary; display: flex; flex-direction: column; gap: 4px; }

.resp-timeline {
  position: relative; padding-left: $space-base;
  &::before { content: ''; position: absolute; left: 20px; top: 8px; bottom: 8px; width: 2px; background: $gray-200; }
}
.tl-title { font-size: $font-sm; font-weight: 700; color: $text-primary; margin-bottom: $space-sm; }
.tl-item { display: flex; gap: $space-md; padding: 8px 0; position: relative; }
.tl-dot {
  width: 12px; height: 12px; border-radius: 50%; background: $gray-200; flex-shrink: 0; margin-top: 3px;
  position: relative; z-index: 1; border: 2px solid #fff;
  &.last { background: $primary; box-shadow: 0 0 0 4px rgba(26,95,220,.15); }
}
.tl-content { display: flex; flex-direction: column; font-size: $font-xs; }
.tl-time { color: $text-hint; font-size: 11px; }
.tl-action { color: $text-primary; font-weight: 600; }

.empty-hint { padding: $space-2xl; text-align: center; color: $text-secondary; font-size: $font-sm; }
.fw-700 { font-weight: 700; }
</style>
