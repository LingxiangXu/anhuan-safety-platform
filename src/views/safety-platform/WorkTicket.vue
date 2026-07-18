<template>
  <div class="app-module-page">
    <div class="page-header">
      <h2>📋 作业票</h2>
      <p class="page-subtitle">查看待办作业票，在线完成监护确认、签字与拍照留证</p>
    </div>

    <div class="app-phone-wrap">
      <div class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div class="app-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="app-navbar"><span class="an-back" @click="currentView='list'" v-if="currentView!=='list'">&lsaquo;</span><span class="an-title">{{ currentView==='list'?'我的作业票':selectedPermit?selectedPermit.title:'作业票详情' }}</span></div>
          <div class="app-body">

            <!-- 列表页 -->
            <template v-if="currentView==='list'">
              <div class="ticket-tabs">
                <span :class="{active:tab==='todo'}" @click="tab='todo'">待办 ({{ todoPermits.length }})</span>
                <span :class="{active:tab==='done'}" @click="tab='done'">已完成 ({{ donePermits.length }})</span>
              </div>
              <div class="ticket-list" v-if="filteredPermits.length">
                <div class="ticket-card" v-for="wp in filteredPermits" :key="wp.id" @click="selectPermit(wp)">
                  <div class="ticket-card-hd">
                    <span class="ticket-type-tag" :class="wp.type">{{ typeIcons[wp.type] }} {{ typeLabels[wp.type] }}</span>
                    <span class="ticket-status" :class="wp.status==='待监护确认'?'warn':'normal'">{{ wp.status }}</span>
                  </div>
                  <div class="ticket-card-title">{{ wp.title }}</div>
                  <div class="ticket-card-meta">
                    <span>📍 {{ wp.location }}</span>
                    <span>👤 {{ wp.applicant }}</span>
                  </div>
                  <div class="ticket-card-time">⏰ {{ wp.plannedTime }}</div>
                </div>
              </div>
              <div class="empty-state" v-else>
                <div class="empty-icon">📋</div>
                <div>暂无作业票</div>
              </div>
            </template>

            <!-- 详情页 -->
            <template v-else-if="selectedPermit">
              <div class="detail-section">
                <div class="detail-hd">{{ selectedPermit.title }}</div>
                <div class="detail-grid">
                  <div class="dg-item"><span class="dg-label">作业类型</span><span class="dg-val">{{ typeLabels[selectedPermit.type] || selectedPermit.type }}</span></div>
                  <div class="dg-item"><span class="dg-label">作业区域</span><span class="dg-val">{{ selectedPermit.location }}</span></div>
                  <div class="dg-item"><span class="dg-label">申请人</span><span class="dg-val">{{ selectedPermit.applicant }}</span></div>
                  <div class="dg-item"><span class="dg-label">监护人</span><span class="dg-val">{{ selectedPermit.guardian || '待指定' }}</span></div>
                  <div class="dg-item"><span class="dg-label">计划时间</span><span class="dg-val">{{ selectedPermit.plannedTime }}</span></div>
                  <div class="dg-item"><span class="dg-label">当前状态</span><span class="dg-val warn">{{ selectedPermit.status }}</span></div>
                </div>
              </div>

              <div class="detail-section">
                <div class="ds-title">🔒 安全措施确认</div>
                <div class="checklist">
                  <div class="cl-item" v-for="(item, i) in safetyChecks" :key="i" @click="item.done=!item.done">
                    <span class="cl-check" :class="{checked:item.done}">{{ item.done?'✅':'⬜' }}</span>
                    <span class="cl-text" :class="{checked:item.done}">{{ item.label }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <div class="ds-title">📸 现场照片</div>
                <div class="photo-grid">
                  <div class="photo-item" v-for="i in 4" :key="i">
                    <div class="photo-placeholder">📷<br><small>拍照留证</small></div>
                  </div>
                </div>
              </div>

              <div class="detail-actions">
                <button class="btn-secondary" @click="currentView='list'">返回</button>
                <button class="btn-primary" v-if="selectedPermit.status==='待监护确认'" @click="confirmGuardian">✅ 监护确认</button>
                <button class="btn-primary" v-else-if="selectedPermit.status==='作业中'" @click="completeWork">🔧 完工上报</button>
              </div>
            </template>

          </div>
        </div>
      </div>
      <div class="phone-caption">
        <h4>功能说明</h4>
        <ul>
          <li>📋 实时查看名下所有待办/已完成作业票</li>
          <li>✅ 在线逐项确认安全措施，勾选留痕</li>
          <li>📸 现场拍照留证，照片自动关联作业票</li>
          <li>✍️ 监护人在线签字确认，完成流程闭环</li>
          <li>🔧 作业完工后一键上报，触发验收流程</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { workPermits } from '@/store/safeData';

export default {
  name: 'WorkTicket',
  data() {
    return {
      currentView: 'list',
      tab: 'todo',
      selectedPermit: null,
      typeIcons: { HIGH_ALTITUDE: '🏗️', LIFTING: '⛓️', TEMPORARY_ELECTRICITY: '⚡' },
      typeLabels: { HIGH_ALTITUDE: '高处作业', LIFTING: '吊装作业', TEMPORARY_ELECTRICITY: '临时用电' },
      safetyChecks: [
        { label: '作业人员持有效操作证', done: false },
        { label: '安全帽/安全带/防护用品穿戴齐全', done: false },
        { label: '作业区域设置警示围栏', done: false },
        { label: '灭火器材配备到位', done: false },
        { label: '监护人已到场确认', done: false },
        { label: '作业环境通风良好', done: false },
        { label: '应急通道畅通无阻', done: false },
        { label: '工器具检查完好', done: false }
      ]
    };
  },
  computed: {
    localPermits() { return JSON.parse(JSON.stringify(workPermits)); },
    todoPermits() { return this.localPermits.filter(p => ['待监护确认', '作业中'].includes(p.status)); },
    donePermits() { return this.localPermits.filter(p => ['已归档', '待完工验收'].includes(p.status)); },
    filteredPermits() { return this.tab === 'todo' ? this.todoPermits : this.donePermits; }
  },
  methods: {
    selectPermit(wp) { this.selectedPermit = wp; this.currentView = 'detail'; },
    confirmGuardian() {
      alert('监护确认成功！签名已上传。');
      this.selectedPermit.status = '作业中';
    },
    completeWork() {
      if (confirm('确认作业已完成，提交完工验收？')) {
        alert('完工上报成功，等待安环验收。');
        this.selectedPermit.status = '待完工验收';
        this.currentView = 'list';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.app-module-page { animation: fadeInUp 0.4s ease both; }
.app-phone-wrap { display: flex; gap: $space-2xl; align-items: flex-start; margin-top: $space-lg; }
.phone-frame { width: 375px; flex-shrink: 0; border: 3px solid #333; border-radius: 36px; overflow: hidden; background: #f5f5f5; box-shadow: $shadow-lg; }
.phone-notch { height: 24px; background: #333; }
.phone-screen { min-height: 600px; background: #fff; }
.app-statusbar { display: flex; justify-content: space-between; padding: 6px 20px; font-size: 11px; color: #333; background: #f8f8f8; }
.app-navbar { padding: 8px 16px; background: $primary; color: #fff; }
.an-back { cursor: pointer; margin-right: 8px; }
.an-title { font-size: 15px; font-weight: 600; }
.app-body { padding: 12px; max-height: 520px; overflow-y: auto; }

.ticket-tabs { display: flex; gap: 0; margin-bottom: 12px; border-radius: 8px; overflow: hidden; border: 1px solid $border; }
.ticket-tabs span { flex: 1; text-align: center; padding: 8px; font-size: 13px; cursor: pointer; background: #fff; color: $text-secondary; transition: all 0.2s; }
.ticket-tabs span.active { background: $primary; color: #fff; font-weight: 600; }
.ticket-card { background: #fff; border: 1px solid $border-light; border-radius: 10px; padding: 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
.ticket-card:hover { border-color: $primary; box-shadow: $shadow-sm; }
.ticket-card-hd { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.ticket-type-tag { font-size: 11px; padding: 2px 6px; border-radius: 4px; background: $primary-bg; color: $primary; }
.ticket-status { font-size: 11px; &.warn { color: $warning; } &.normal { color: $text-hint; } }
.ticket-card-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.ticket-card-meta { font-size: 11px; color: $text-hint; display: flex; gap: 12px; }
.ticket-card-time { font-size: 11px; color: $text-hint; margin-top: 4px; }

.detail-section { background: #fff; border-radius: 10px; padding: 12px; margin-bottom: 10px; border: 1px solid $border-light; }
.detail-hd { font-size: 15px; font-weight: 700; margin-bottom: 10px; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.dg-item { display: flex; flex-direction: column; }
.dg-label { font-size: 10px; color: $text-hint; }
.dg-val { font-size: 13px; color: $text-primary; font-weight: 500; &.warn { color: $warning; } }
.ds-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.checklist { display: flex; flex-direction: column; gap: 6px; }
.cl-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; cursor: pointer; }
.cl-check { font-size: 16px; }
.cl-text { font-size: 12px; color: $text-secondary; &.checked { color: $success; text-decoration: line-through; } }
.photo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.photo-item { aspect-ratio: 1; background: $gray-100; border-radius: 8px; border: 1px dashed $gray-300; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.photo-placeholder { text-align: center; font-size: 24px; color: $text-hint; small { display: block; font-size: 10px; margin-top: 4px; } }
.detail-actions { display: flex; gap: 8px; margin-top: 10px; padding-bottom: 12px; }
.btn-primary { flex: 1; padding: 10px; background: $primary; color: #fff; border: 0; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; }
.btn-secondary { padding: 10px 16px; background: $gray-100; border: 0; border-radius: 10px; font-size: 14px; cursor: pointer; }

.phone-caption { flex: 1; background: #fff; border-radius: 12px; padding: 20px; border: 1px solid $border; }
.phone-caption h4 { margin: 0 0 12px; font-size: 16px; }
.phone-caption ul { padding-left: 16px; margin: 0; }
.phone-caption li { font-size: 13px; color: $text-secondary; line-height: 2; }
.empty-state { text-align: center; padding: 40px 0; color: $text-hint; }
.empty-icon { font-size: 40px; margin-bottom: 8px; }
</style>
