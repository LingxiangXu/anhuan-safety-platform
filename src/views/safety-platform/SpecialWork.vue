<template>
  <div class="work-page">
    <SceneFlow flow-key="specialwork" />
    <div class="page-header">
      <h2>特殊作业管控</h2>
      <p class="page-subtitle">高处、起重吊装、临时用电与动火作业统一流程：申请→前置核验→分级审批链→监护确认→作业→验收→归档（审批链按「类型+级别」逐级加签，含领导审批节点）</p>
    </div>

    <!-- 作业票申请入口（APP 端 · 现场随手申请） -->
    <section class="permit-entry">
      <h3 class="section-title">作业票申请入口</h3>
      <div class="pe-block">
        <div class="pe-label">📱 APP 端 · 现场随手申请作业票</div>
        <div class="pe-app">
          <PhoneFrame title="我的作业票" :show-back="true" @back="onPhoneBack">
            <WorkTicket bare ref="workTicket" @view-change="wtView = $event" />
          </PhoneFrame>
        </div>
      </div>
    </section>

    <!-- 作业票台账（PC 端 · 规范填报与审批 + 全部作业） -->
    <section class="ledger-section">
      <div class="ledger-header">
        <div class="ledger-title">
          <h3 class="section-title" style="border:none;padding-left:0;margin-bottom:4px;">作业票台账</h3>
          <p class="ledger-sub">高处、起重吊装、临时用电与动火作业 — 统一规范填报、分级审批、全过程留痕</p>
        </div>
        <button class="btn-new-application" @click="showApplicationForm = true">＋ 新增作业票</button>
      </div>

      <!-- 作业类型筛选 -->
      <div class="work-type-tabs">
        <button class="type-tab" :class="{ active: activeType === 'ALL' }" @click="activeType = 'ALL'">全部作业</button>
        <button class="type-tab" :class="{ active: activeType === 'HIGH_ALTITUDE' }" @click="activeType = 'HIGH_ALTITUDE'">🏗️ 高处作业</button>
        <button class="type-tab" :class="{ active: activeType === 'FIRE' }" @click="activeType = 'FIRE'">🔥 动火作业</button>
        <button class="type-tab" :class="{ active: activeType === 'LIFTING' }" @click="activeType = 'LIFTING'">⛓ 起重吊装</button>
        <button class="type-tab" :class="{ active: activeType === 'TEMPORARY_ELECTRICITY' }" @click="activeType = 'TEMPORARY_ELECTRICITY'">⚡ 临时用电</button>
      </div>

      <!-- 台账表格 -->
      <div class="ledger-table-wrap">
        <table class="ledger-table">
          <thead>
            <tr>
              <th>作业票号</th>
              <th>类型</th>
              <th>申请人</th>
              <th>监护人</th>
              <th>计划时间</th>
              <th>状态</th>
              <th class="col-ops">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="wp in filteredPermits" :key="wp.id"
                :class="{ blocked: wp.blocked }" @click="goDetail(wp)">
              <td class="col-id">{{ wp.id }}</td>
              <td class="col-type">{{ typeEmoji[wp.workType] }} {{ getWorkType(wp.workType) }}</td>
              <td>{{ wp.applicantName }}</td>
              <td>{{ wp.guardianName || '待指定' }}</td>
              <td class="col-time">{{ wp.duration || '—' }}</td>
              <td><span class="tag" :class="permitStatusTag(wp.status)">{{ getPermitStatus(wp.status) }}</span></td>
              <td class="col-ops"><button class="btn-link" @click.stop="goDetail(wp)">查看 ›</button></td>
            </tr>
          </tbody>
        </table>
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
            <div class="form-group" v-if="newPermit.workType === 'FIRE'">
              <label class="form-label">动火级别</label>
              <select class="form-input" v-model="newPermit.workLevel">
                <option value="二级">二级动火（有效期72小时）</option>
                <option value="一级">一级动火（有效期8小时）</option>
                <option value="特级">特级动火（有效期8小时）</option>
              </select>
            </div>
          </div>
          <!-- 高处作业级别选择 -->
          <div class="form-row" v-if="newPermit.workType === 'HIGH_ALTITUDE'">
            <div class="form-group">
              <label class="form-label">作业级别（按高度自动对应审批链）</label>
              <select class="form-input" v-model="newPermit.workLevel">
                <option value="一级">一级（2m–5m）</option>
                <option value="二级">二级（5m–15m）</option>
                <option value="三级">三级（15m–30m）</option>
                <option value="特级">特级（30m以上）</option>
              </select>
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
import { workPermits, WORK_TYPE, WORK_PERMIT_STATUS, getApprovalChain, getWorkValidity } from '@/store/safeData';
import WorkTicket from '@/views/safety-platform/WorkTicket.vue';
import SceneFlow from '@/components/safety/SceneFlow.vue';
import PhoneFrame from '@/components/safety/PhoneFrame.vue';

export default {
  name: 'SpecialWork',
  components: { WorkTicket, SceneFlow, PhoneFrame },
  data() {
    return {
      localPermits: workPermits,
      activeType: 'ALL',
      wtView: 'list',
      showApplicationForm: false,
      workerInput: { name: '', role: '' },
      riskInput: '',
      newPermit: this.createEmptyPermit(),
      workTypeOptions: [
        { value: 'HIGH_ALTITUDE', label: '高处作业', emoji: '🏗️' },
        { value: 'FIRE', label: '动火作业', emoji: '🔥' },
        { value: 'LIFTING', label: '起重吊装', emoji: '⛓' },
        { value: 'TEMPORARY_ELECTRICITY', label: '临时用电', emoji: '⚡' }
      ],
      typeEmoji: { HIGH_ALTITUDE: '🏗️', FIRE: '🔥', LIFTING: '⛓', TEMPORARY_ELECTRICITY: '⚡' },
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
    goDetail(wp) {
      this.$router.push({ name: 'WorkPermitDetail', params: { id: wp.id } });
    },
    // APP 端预览的返回键：列表页→退出回移动工作台；非列表页→WorkTicket 内部返回
    onPhoneBack() {
      if (this.wtView === 'list') {
        // 列表页点返回 → 退出作业票，回到移动工作台首页
        this.$router.push('/safety-platform/mobile-field');
        return;
      }
      const wt = this.$refs.workTicket;
      if (wt && typeof wt.navBack === 'function') wt.navBack();
    },


    // ===== 新建申请相关 =====
    createEmptyPermit() {
      return {
        id: '', workType: 'HIGH_ALTITUDE', status: '草稿',
        orgId: 3, deptId: 5, zoneId: '', zoneName: '',
        title: '', applicantId: 9, applicantName: '', applicantDept: '',
        duration: '', height: '', workLevel: '二级', loadWeight: '', voltage: '',
        fireLevel: '', validity: '',
        approvalChain: getApprovalChain('HIGH_ALTITUDE', '二级'),
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
    syncApprovalMeta() {
      // 按作业类型+级别自动对齐审批链与有效期（依据危险作业安全管控制度）
      const t = this.newPermit.workType;
      const lvl = this.newPermit.workLevel;
      this.newPermit.approvalChain = getApprovalChain(t, lvl);
      this.newPermit.validity = getWorkValidity(t, lvl);
      if (t === 'FIRE') this.newPermit.fireLevel = lvl;
    },
    saveDraft() {
      if (!this.newPermit.title.trim()) {
        alert('请至少填写作业标题');
        return;
      }
      this.syncApprovalMeta();
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
      if (this.newPermit.workType === 'LIFTING') this.newPermit.workLevel = '特殊';
      this.syncApprovalMeta();

      this.newPermit.id = this.generatePermitId();
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

      // 风险输入按行分割
      this.newPermit.riskHighlights = this.riskInput.split('\n').map(s => s.trim()).filter(Boolean);

      // 构建时间线：申请提交 → 前置核验 → 进入分级审批链
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
          action: '请在分级审批链阶段补充监护人员信息'
        }];
      }

      this.localPermits.unshift(JSON.parse(JSON.stringify(this.newPermit)));
      this.showApplicationForm = false;
      this.newPermit = this.createEmptyPermit();
      this.riskInput = '';
      const created = this.localPermits[0];
      alert(`作业票 ${created.id} 已提交，当前状态：${created.status}`);
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
  flex-shrink: 0; padding: 11px 22px;
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

/* ====== 作业票台账 ====== */
.ledger-section { margin-bottom: $space-2xl; }
.ledger-header { display: flex; align-items: flex-end; justify-content: space-between; gap: $space-md; margin-bottom: $space-lg; }
.ledger-sub { font-size: 12px; color: $text-hint; margin: 0; }

.work-type-tabs { display: flex; gap: $space-sm; margin-bottom: $space-md; flex-wrap: wrap; }
.type-tab {
  padding: 7px 18px; border-radius: 20px; font-size: $font-sm; border: 1px solid $gray-200; background: #fff;
  color: $text-secondary; cursor: pointer; font-weight: 600; transition: all .2s;
  &.active { background: $primary; color: #fff; border-color: $primary; box-shadow: 0 2px 8px rgba(26,95,220,.25); }
  &:hover:not(.active) { border-color: $primary; color: $primary; }
}

.ledger-table-wrap {
  overflow-x: auto; background: #fff; border-radius: 14px;
  border: 1px solid rgba(15,23,42,.06); box-shadow: 0 2px 12px rgba(15,23,42,.04);
}
.ledger-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 720px; }
.ledger-table th {
  text-align: left; padding: 12px 14px; background: #f8fafc; color: $text-secondary;
  font-weight: 700; border-bottom: 1px solid $gray-200; white-space: nowrap; font-size: 12px;
}
.ledger-table td {
  padding: 11px 14px; border-bottom: 1px solid $gray-100; color: $text-primary; vertical-align: middle;
}
.ledger-table tbody tr { cursor: pointer; transition: background .15s; }
.ledger-table tbody tr:hover { background: $primary-bg; }
.ledger-table tbody tr.selected { background: $primary-bg; box-shadow: inset 3px 0 0 $primary; }
.ledger-table tbody tr.blocked { background: #fff5f5; }
.col-id { font-family: monospace; font-size: 11px; color: $text-hint; white-space: nowrap; }
.col-type { white-space: nowrap; font-weight: 600; }
.col-time { white-space: nowrap; font-size: 11px; color: $text-hint; }
.col-ops { white-space: nowrap; text-align: center; }
.btn-link {
  background: none; border: none; color: $primary; font-weight: 600; cursor: pointer;
  font-size: 12px; padding: 2px 4px;
  &:hover { text-decoration: underline; }
}

.section-title { font-size: $font-md; font-weight: 700; color: $text-primary; margin-bottom: $space-md; padding-left: 12px; border-left: 4px solid $primary; }

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
