<template>
  <div class="inspection-mgmt">
    <!-- 头部 -->
    <div class="ov-header">
      <div class="ov-head-left">
        <h2 class="ov-title">巡检任务管理</h2>
        <p class="ov-sub">由安环管理人员分派巡检任务至现场人员移动端，跟踪执行与完成情况</p>
      </div>
      <button class="btn-new" @click="openForm">➕ 发起巡检任务</button>
    </div>

    <!-- 统计卡 -->
    <div class="stat-row">
      <div class="stat-card"><div class="sc-val">{{ tasks.length }}</div><div class="sc-label">任务总数</div></div>
      <div class="stat-card"><div class="sc-val" style="color:#f59e0b">{{ pendingCount }}</div><div class="sc-label">待执行</div></div>
      <div class="stat-card"><div class="sc-val" style="color:#16a34a">{{ completedCount }}</div><div class="sc-label">已完成</div></div>
      <div class="stat-card"><div class="sc-val">{{ avgProgress }}%</div><div class="sc-label">平均进度</div></div>
    </div>

    <!-- 任务清单 -->
    <section class="ov-section">
      <h3 class="section-title">巡检任务清单</h3>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>任务编号</th><th>下发方式</th><th>类型</th><th>巡检标题</th><th>区域</th>
              <th>责任人</th><th>截止/下次</th><th>进度</th><th>状态</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in tasks" :key="t.id">
              <td class="mono">{{ t.id }}</td>
              <td>
                <span class="tag" :class="t.dispatchMode === 'cycle' ? 'tag-blue' : 'tag-gray'">
                  {{ t.dispatchMode === 'cycle' ? '周期·' + t.cycle : '手动' }}
                </span>
              </td>
              <td>{{ t.type }}</td>
              <td>{{ t.title }}</td>
              <td>{{ t.zoneName || zoneName(t.zoneId) }}</td>
              <td>{{ t.assigneeName }}</td>
              <td>{{ t.dispatchMode === 'cycle' ? (t.nextDispatch || '-') : (t.deadline || '-') }}</td>
              <td>
                <template v-if="t.status === 'cycle'">—</template>
                <template v-else>
                  <div class="prog"><div class="prog-fill" :class="progress(t) >= 100 ? 'done' : ''" :style="{ width: progress(t) + '%' }"></div></div>
                  <span class="prog-txt">{{ progress(t) }}%</span>
                </template>
              </td>
              <td><span class="tag" :class="statusClass(t.status)">{{ statusText(t.status) }}</span></td>
              <td>
                <button class="btn-sm danger" v-if="t.status === 'pending'" @click="revoke(t)">撤销</button>
                <button class="btn-sm primary" v-else-if="t.dispatchMode === 'cycle'" @click="generateInstance(t)">生成本次</button>
                <span v-else class="muted">—</span>
              </td>
            </tr>
            <tr v-if="!tasks.length">
              <td colspan="10" class="empty">暂无巡检任务，点击右上角「发起巡检任务」下发</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- APP 端效果预览 -->
    <section class="ov-section ip-app-section">
      <h3 class="section-title">📱 移动现场（APP 端）效果</h3>
      <p class="ip-app-sub">以下直接嵌入「APP 移动现场」组件（与该页面同一份代码，彻底同源）。可从移动工作台九宫格「巡检任务」入口点入，完整演示「列表 → 执行 → 上报隐患」全流程；本页 PC 端下发的任务与 APP 端共用同一数据源，完成后上方清单的进度与状态同步刷新。</p>
      <div class="ip-app-body">
        <!-- 直接引用移动端组件（embedded 模式仅显示手机壳） -->
        <MobileField embedded />
        <!-- 说明 -->
        <div class="ip-notes">
          <div class="ip-note-card"><h4>🔄 同源实时联动</h4><p>PC 端下发的任务通过同一数据源实时同步至现场人员手机，无需刷新即可在下方看到。</p></div>
          <div class="ip-note-card"><h4>📋 移动端执行</h4><p>现场人员逐项勾选检查内容，提交后任务状态变为「已完成」，进度回写 100%。</p></div>
          <div class="ip-note-card"><h4>📈 回写 PC 清单</h4><p>APP 端完成后，上方「巡检任务清单」的进度条与状态标签同步刷新，形成闭环。</p></div>
        </div>
      </div>
    </section>

    <!-- 发起巡检任务弹窗 -->
    <div class="modal-mask" v-if="showForm" @click.self="closeForm">
      <div class="modal">
        <div class="modal-head">
          <h3>发起巡检任务</h3>
          <span class="modal-close" @click="closeForm">✕</span>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>下发方式 <span class="req">*</span></label>
              <select v-model="form.dispatchMode">
                <option value="manual">手动下发</option>
                <option value="cycle">周期自动</option>
              </select>
            </div>
            <div class="form-group" v-if="form.dispatchMode === 'cycle'">
              <label>执行周期 <span class="req">*</span></label>
              <select v-model="form.cycle">
                <option>每日</option>
                <option>每周一</option>
                <option>每周五</option>
                <option>每月1日</option>
                <option>每季度首月1日</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>巡检类型 <span class="req">*</span></label>
              <select v-model="form.type">
                <option>日常巡检</option>
                <option>专项巡检</option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ form.dispatchMode === 'cycle' ? '下次下发时间' : '截止时间' }} <span class="req">*</span></label>
              <input v-model="form.deadline" :placeholder="form.dispatchMode === 'cycle' ? '如：2026-07-21 07:30' : '如：2026-07-21 17:00'" />
            </div>
          </div>

          <div class="form-group">
            <label>巡检标题 <span class="req">*</span></label>
            <input v-model="form.title" placeholder="如：铸造车间区域巡检" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>所属区域 <span class="req">*</span></label>
              <select v-model="form.zoneId">
                <option v-for="z in zones" :key="z.id" :value="z.id">{{ z.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>责任人 <span class="req">*</span></label>
              <select v-model="form.assigneeId">
                <option v-for="p in fieldPersons" :key="p.id" :value="p.id">{{ p.name }}（{{ deptName(p.deptId) }}）</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>检查项内容 <span class="req">*</span> <span class="hint">逐项填写具体检查内容（共 {{ form.checklist.length }} 项）</span></label>
            <div class="checklist-editor">
              <div class="check-item" v-for="(c, i) in form.checklist" :key="i">
                <span class="ci-no">{{ i + 1 }}</span>
                <input v-model="c.label" :placeholder="'第 ' + (i + 1) + ' 项检查内容，如：炉前防护挡板完好'" />
                <span class="ci-del" @click="removeCheckItem(i)">✕</span>
              </div>
              <button class="btn-add-item" @click="addCheckItem">+ 添加检查项</button>
            </div>
          </div>

          <div class="form-group">
            <label>任务说明</label>
            <textarea v-model="form.desc" rows="2" placeholder="巡检重点与要求（选填）"></textarea>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn-cancel" @click="closeForm">取消</button>
          <button class="btn-submit" @click="submit">📋 下发任务</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  inspectionTasks, factoryZones, personnel, departments,
  COMMON_CHECK_ITEMS, generateInspectionId, getInspectionProgress
} from '@/store/safeData';
import MobileField from './MobileField.vue';

export default {
  name: 'InspectionManagement',
  components: { MobileField },
  data() {
    return {
      tasks: inspectionTasks,
      zones: factoryZones,
      persons: personnel,
      depts: departments,
      showForm: false,
      form: this.createEmptyForm()
    };
  },
  computed: {
    fieldPersons() {
      return this.persons.filter((p) => p.roles && p.roles.includes('field_worker'));
    },
    pendingCount() {
      return this.tasks.filter((t) => t.status === 'pending').length;
    },
    completedCount() {
      return this.tasks.filter((t) => t.status === 'completed').length;
    },
    avgProgress() {
      const list = this.tasks.filter((t) => t.status !== 'cycle');
      if (!list.length) return 0;
      const sum = list.reduce((acc, t) => acc + getInspectionProgress(t), 0);
      return Math.round(sum / list.length);
    }
  },
  methods: {
    createEmptyForm() {
      return {
        dispatchMode: 'manual', cycle: '每日', type: '日常巡检', title: '', zoneId: 'zone-1',
        assigneeId: 6, deadline: '', desc: '',
        checklist: COMMON_CHECK_ITEMS.slice(0, 4).map((label) => ({ label }))
      };
    },
    zoneName(id) {
      const z = this.zones.find((z) => z.id === id);
      return z ? z.name : '-';
    },
    deptName(id) {
      const d = this.depts.find((d) => d.id === id);
      return d ? d.name : '-';
    },
    progress(t) {
      return getInspectionProgress(t);
    },
    statusText(s) {
      if (s === 'cycle') return '周期模板';
      if (s === 'completed') return '已完成';
      if (s === 'in_progress') return '执行中';
      return '待执行';
    },
    statusClass(s) {
      if (s === 'cycle') return 'tag-blue';
      if (s === 'completed') return 'tag-green';
      return 'tag-orange';
    },
    openForm() {
      this.form = this.createEmptyForm();
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
    },
    submit() {
      const items = this.form.checklist.map((c) => (c.label || '').trim()).filter(Boolean);
      const dateLabel = this.form.dispatchMode === 'cycle' ? '下次下发时间' : '截止时间';
      if (!this.form.title || !this.form.deadline) {
        alert('请填写巡检标题与' + dateLabel);
        return;
      }
      if (!items.length) {
        alert('请至少填写一项具体检查内容');
        return;
      }
      const assignee = this.persons.find((p) => p.id === this.form.assigneeId);
      const zone = this.zones.find((z) => z.id === this.form.zoneId);
      const isCycle = this.form.dispatchMode === 'cycle';
      const task = {
        id: generateInspectionId(),
        type: this.form.type,
        title: this.form.title,
        assigneeId: this.form.assigneeId,
        assigneeName: assignee ? assignee.name : '-',
        zoneId: this.form.zoneId,
        zoneName: zone ? zone.name : '-',
        status: isCycle ? 'cycle' : 'pending',
        dispatchMode: this.form.dispatchMode,
        cycle: isCycle ? this.form.cycle : '',
        nextDispatch: isCycle ? this.form.deadline : '',
        deadline: this.form.deadline,
        checkItems: items.length,
        checklist: items.map((label) => ({ label, done: false, result: '正常' })),
        desc: this.form.desc || '',
        createdAt: this.nowStr()
      };
      inspectionTasks.push(task);
      this.closeForm();
      alert(isCycle
        ? `周期巡检「${task.title}」已配置（${task.cycle}），可在列表点击「生成本次」下发`
        : `巡检任务 ${task.id} 已下发至 ${task.assigneeName} 的移动端`);
    },
    addCheckItem() {
      this.form.checklist.push({ label: '' });
    },
    removeCheckItem(i) {
      this.form.checklist.splice(i, 1);
    },
    generateInstance(t) {
      const instance = {
        id: generateInspectionId(),
        type: t.type,
        title: t.title,
        assigneeId: t.assigneeId,
        assigneeName: t.assigneeName,
        zoneId: t.zoneId,
        zoneName: t.zoneName,
        status: 'pending',
        dispatchMode: 'manual',
        cycle: '',
        nextDispatch: '',
        deadline: t.nextDispatch || t.deadline,
        checkItems: (t.checklist || []).length,
        checklist: (t.checklist || []).map((c) => ({ label: c.label, done: false, result: '正常' })),
        desc: t.desc || '',
        createdAt: this.nowStr(),
        fromCycle: t.id
      };
      inspectionTasks.push(instance);
      t.nextDispatch = this.advanceCycle(t.nextDispatch, t.cycle);
      alert(`已生成巡检实例 ${instance.id} 并下发至 ${instance.assigneeName} 的移动端`);
    },
    advanceCycle(dateStr, cycle) {
      const d = new Date(String(dateStr).replace(/-/g, '/'));
      if (isNaN(d.getTime())) return dateStr;
      if (cycle === '每日') d.setDate(d.getDate() + 1);
      else if (cycle && cycle.indexOf('每周') === 0) d.setDate(d.getDate() + 7);
      else if (cycle && cycle.indexOf('月') > -1) d.setMonth(d.getMonth() + 1);
      const p = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
    },
    revoke(t) {
      const i = inspectionTasks.indexOf(t);
      if (i > -1) inspectionTasks.splice(i, 1);
    },
    nowStr() {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.inspection-mgmt { max-width: 1100px; }

.ov-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: $space-lg; gap: $space-md; flex-wrap: wrap;
  .ov-title { font-size: $font-lg; font-weight: 700; color: $text-primary; }
  .ov-sub { font-size: $font-sm; color: $text-secondary; margin-top: 4px; }
}
.btn-new {
  padding: 10px 20px; background: $primary; color: #fff; border: none;
  border-radius: $radius-md; font-size: $font-sm; font-weight: 600; cursor: pointer;
  transition: all .2s; white-space: nowrap;
  &:hover { background: $primary-dark; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,117,230,.25); }
}

.stat-row { display: flex; gap: $space-md; margin-bottom: $space-lg; flex-wrap: wrap; }
.stat-card {
  flex: 1; min-width: 130px; background: #fff; border: 1px solid $border; border-radius: $radius-lg;
  padding: $space-lg; text-align: center; box-shadow: 0 2px 8px rgba(15,23,42,.04);
  .sc-val { font-size: 26px; font-weight: 700; color: $text-primary; line-height: 1.2; }
  .sc-label { font-size: $font-xs; color: $text-hint; margin-top: 4px; }
}

.ov-section { background: #fff; border: 1px solid $border; border-radius: $radius-lg; padding: $space-lg; }
.section-title {
  font-size: $font-md; font-weight: 700; color: $text-primary; margin-bottom: $space-md;
  padding-left: 12px; border-left: 4px solid $primary;
}
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: $font-sm; }
.data-table th, .data-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid $border; }
.data-table th { background: #f8fafc; color: $text-secondary; font-weight: 600; white-space: nowrap; }
.data-table td { color: $text-primary; }
.data-table .mono { font-family: monospace; color: $text-secondary; }
.data-table .empty { text-align: center; color: $text-hint; padding: 28px 0; }

.prog { width: 90px; height: 6px; background: #eef2f7; border-radius: 4px; overflow: hidden; display: inline-block; vertical-align: middle; }
.prog-fill { height: 100%; background: $primary; border-radius: 4px; transition: width .3s; }
.prog-fill.done { background: #16a34a; }
.prog-txt { margin-left: 6px; font-size: 11px; color: $text-hint; }

.tag { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
.tag-orange { background: #fff7ed; color: #ea580c; }
.tag-green { background: #f0fdf4; color: #16a34a; }
.muted { color: $text-hint; }

.btn-sm { font-size: 11px; padding: 3px 10px; border-radius: $radius-sm; border: 1px solid $border; background: #fff; color: $text-secondary; cursor: pointer;
  &.danger { border-color: #fecaca; color: #dc2626; &:hover { background: #fef2f2; } }
}

/* 弹窗 */
.modal-mask { position: fixed; inset: 0; background: rgba(15,23,42,.45); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { width: 540px; max-width: 92vw; max-height: 88vh; overflow-y: auto; background: #fff; border-radius: $radius-lg; box-shadow: 0 20px 60px rgba(0,0,0,.25); }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: $space-lg $space-lg $space-md; border-bottom: 1px solid $border;
  h3 { font-size: $font-md; font-weight: 700; color: $text-primary; } }
.modal-close { font-size: 18px; color: $text-hint; cursor: pointer; &:hover { color: $text-primary; } }
.modal-body { padding: $space-lg; }
.modal-foot { display: flex; justify-content: flex-end; gap: $space-sm; padding: $space-md $space-lg $space-lg; border-top: 1px solid $border; }

.form-row { display: flex; gap: $space-md; }
.form-row .form-group { flex: 1; }
.form-group { margin-bottom: $space-md;
  label { display: block; font-size: $font-sm; color: $text-secondary; margin-bottom: 6px; }
  .req { color: #dc2626; }
  input, select, textarea {
    width: 100%; padding: 9px 12px; border: 1px solid $border; border-radius: $radius-sm;
    font-size: $font-sm; color: $text-primary; background: #fff; outline: none; font-family: inherit;
    &:focus { border-color: $primary; box-shadow: 0 0 0 3px rgba(0,117,230,.12); }
  }
  textarea { resize: vertical; }
}
.btn-cancel { padding: 9px 20px; border: 1px solid $border; background: #fff; color: $text-secondary; border-radius: $radius-sm; font-size: $font-sm; cursor: pointer; &:hover { border-color: $text-hint; } }
.btn-submit { padding: 9px 20px; border: none; background: $primary; color: #fff; border-radius: $radius-sm; font-size: $font-sm; font-weight: 600; cursor: pointer; &:hover { background: $primary-dark; } }
.btn-sm.primary { border-color: $primary; color: $primary; &:hover { background: #f0f7ff; } }

.tag-gray { background: #f1f5f9; color: #475569; }
.tag-blue { background: #e6f1fb; color: #185fa5; }
.hint { color: $text-hint; font-weight: 400; margin-left: 4px; font-size: 12px; }

.checklist-editor { border: 1px dashed $border; border-radius: $radius-sm; padding: $space-sm; background: #fafbfc; }
.check-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.ci-no { flex: 0 0 22px; height: 22px; line-height: 22px; text-align: center; background: $primary; color: #fff; border-radius: 50%; font-size: 11px; }
.check-item input { flex: 1; padding: 9px 12px; border: 1px solid $border; border-radius: $radius-sm; font-size: $font-sm; color: $text-primary; background: #fff; outline: none; font-family: inherit; &:focus { border-color: $primary; box-shadow: 0 0 0 3px rgba(0,117,230,.12); } }
.ci-del { flex: 0 0 22px; text-align: center; color: #dc2626; cursor: pointer; font-size: 13px; &:hover { color: #ef4444; } }
.btn-add-item { margin-top: 2px; padding: 6px 14px; border: 1px dashed $primary; background: #fff; color: $primary; border-radius: $radius-sm; font-size: $font-sm; cursor: pointer; &:hover { background: #f0f7ff; } }

/* APP 端效果预览 */
.ip-app-section { margin-top: $space-lg; }
.ip-app-sub { font-size: $font-sm; color: $text-secondary; margin-bottom: $space-md; }
.ip-app-body { display: flex; gap: $space-xl; align-items: flex-start; flex-wrap: wrap; }
.ip-notes { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: $space-md; }
.ip-note-card { background: #f8fafc; border: 1px solid $border; border-radius: 12px; padding: $space-md;
  h4 { font-size: $font-sm; font-weight: 700; color: $text-primary; margin-bottom: 4px; }
  p { font-size: $font-xs; color: $text-secondary; line-height: 1.6; } }
</style>
