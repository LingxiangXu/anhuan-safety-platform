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
                    <span class="ticket-type-tag" :class="wp.workType">{{ typeIcons[wp.workType] }} {{ typeLabels[wp.workType] || wp.workType }}</span>
                    <span class="ticket-status" :class="wp.status==='待监护确认'?'warn':'normal'">{{ wp.status }}</span>
                  </div>
                  <div class="ticket-card-title">{{ wp.title }}</div>
                  <div class="ticket-card-meta">
                    <span>📍 {{ wp.zoneName }}</span>
                    <span>👤 {{ wp.applicantName }}</span>
                  </div>
                  <div class="ticket-card-time">⏰ {{ wp.duration }}</div>
                </div>
              </div>
              <div class="empty-state" v-else>
                <div class="empty-icon">📋</div>
                <div>暂无作业票</div>
              </div>
            </template>

            <!-- 详情页 — 对齐《危险作业审批表》 -->
            <template v-else-if="selectedPermit">
              <div class="form-badge">危险作业审批表 · {{ typeLabels[selectedPermit.workType] || selectedPermit.workType }}</div>
              <div class="detail-section">
                <div class="detail-hd">{{ selectedPermit.title }}</div>
                <div class="detail-grid">
                  <div class="dg-item"><span class="dg-label">作业类型</span><span class="dg-val">{{ typeLabels[selectedPermit.workType] || selectedPermit.workType }}</span></div>
                  <div class="dg-item"><span class="dg-label">作业部门</span><span class="dg-val">{{ selectedPermit.applicantDept || '—' }}</span></div>
                  <div class="dg-item"><span class="dg-label">作业地点</span><span class="dg-val">{{ selectedPermit.zoneName }}</span></div>
                  <div class="dg-item"><span class="dg-label">作业证编号</span><span class="dg-val">{{ selectedPermit.id }}</span></div>
                  <div class="dg-item" v-if="selectedPermit.workType==='HIGH_ALTITUDE'"><span class="dg-label">作业高度</span><span class="dg-val">{{ selectedPermit.height }}</span></div>
                  <div class="dg-item" v-if="levelText"><span class="dg-label">作业类别</span><span class="dg-val level">{{ levelText }}</span></div>
                  <div class="dg-item" v-if="selectedPermit.validity"><span class="dg-label">许可证有效期</span><span class="dg-val">⏱ {{ selectedPermit.validity }}</span></div>
                  <div class="dg-item"><span class="dg-label">申请人</span><span class="dg-val">{{ selectedPermit.applicantName }}</span></div>
                  <div class="dg-item"><span class="dg-label">监护人</span><span class="dg-val">{{ selectedPermit.guardianName || '待指定' }}</span></div>
                  <div class="dg-item"><span class="dg-label">作业时间</span><span class="dg-val">{{ selectedPermit.duration }}</span></div>
                  <div class="dg-item"><span class="dg-label">当前状态</span><span class="dg-val warn">{{ selectedPermit.status }}</span></div>
                </div>
                <div class="dg-full"><span class="dg-label">作业内容</span><span class="dg-val">{{ selectedPermit.title }}</span></div>
              </div>

              <!-- 危险作业审批表 · 分级审批签字栏（还原 PDF 审批表固定签字栏样式） -->
              <div class="detail-section" v-if="signForm">
                <div class="ds-title">🧾 {{ signForm.label }} · 分级审批签字</div>
                <div class="sign-form-note">
                  作业类型：{{ typeLabels[selectedPermit.workType] || selectedPermit.workType }}
                  ｜ 级别：{{ selectedPermit.fireLevel || selectedPermit.workLevel || '—' }}
                  ｜ 许可证有效期：{{ selectedPermit.validity || '—' }}
                </div>
                <div class="sign-cols">
                  <div v-for="col in signForm.columns" :key="col"
                       class="sign-col" :class="isSignRequired(col) ? 'req' : 'opt'">
                    <div class="sc-title">{{ col }}</div>
                    <div class="sc-line"></div>
                    <div class="sc-foot">
                      <span class="sc-date">签字：　　年　月　日</span>
                      <span class="sc-tag" :class="isSignRequired(col) ? 'req' : 'empty'">
                        {{ isSignRequired(col) ? '需签 ✓' : '本级别不涉及 · 可空缺' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="sign-hint">各部门应根据作业分级审批要求按层级进行审批，审批层级不涉及的部门可空缺</div>
              </div>

              <!-- 作业人员（含相关方） -->
              <div class="detail-section" v-if="selectedPermit.workers && selectedPermit.workers.length">
                <div class="ds-title">👷 作业人员（含相关方）</div>
                <div class="worker-rows">
                  <div class="worker-row" v-for="w in selectedPermit.workers" :key="w.name">
                    <span class="wr-name">{{ w.name }}</span>
                    <span class="wr-role">{{ w.role }}</span>
                    <span class="wr-sign">签字 ✎</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <div class="ds-title">🔒 安全措施确认（{{ activeChecks.length }} 项 · 按作业类型）</div>
                <div class="checklist">
                  <div class="cl-item" v-for="(item, i) in activeChecks" :key="i" @click="item.done=!item.done">
                    <span class="cl-no" v-if="item.no">{{ item.no }}</span>
                    <span class="cl-check" :class="{checked:item.done}">{{ item.done?'✅':'⬜' }}</span>
                    <span class="cl-text" :class="{checked:item.done}">{{ item.label }}</span>
                  </div>
                </div>
                <div class="sign-hint">安全措施确认栏应由确认人对各项措施确认到位后签字</div>
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
import { workPermits, workPermitSignForms } from '@/store/safeData';

export default {
  name: 'WorkTicket',
  data() {
    return {
      currentView: 'list',
      tab: 'todo',
      selectedPermit: null,
      typeIcons: { HIGH_ALTITUDE: '🏗️', FIRE: '🔥', LIFTING: '⛓️', TEMPORARY_ELECTRICITY: '⚡' },
      typeLabels: { HIGH_ALTITUDE: '高处作业', FIRE: '动火作业', LIFTING: '起重吊装', TEMPORARY_ELECTRICITY: '临时用电' },
      // 按作业类型差异化的安全措施确认清单（对齐审批表附件模板）
      checklistByType: {
        HIGH_ALTITUDE: [
          '作业人员身体条件符合要求', '作业人员着装符合工作要求', '作业人员佩戴合格的安全帽',
          '安全带高挂低用，正确系挂', '携带工具袋及安全绳', '脚手架/防护网/围栏符合规定',
          '垂直分层作业有隔离设施', '梯子、绳子符合安全规定', '采光/照明满足作业要求',
          '30m以上配备通讯联络工具', '监护人到场，警戒隔离已设置'
        ],
        FIRE: [
          '已办理动火作业审批表', '动火点周围易燃物已清理隔离', '配备足量消防器材',
          '动火分析合格（可燃气体检测）', '乙炔瓶/氧气瓶安全间距符合要求', '作业人员持有效焊工证',
          '动火监护人全程在场'
        ],
        LIFTING: [
          '起重设备日检记录合格', '吊索具检查合格，载荷标识清晰', '操作/指挥/司索人员资质有效',
          '载荷计算在额定范围内', '警戒区域硬隔离并挂牌', '吊物下方严禁站人', '监护人到场确认',
          '人员出入口和撤离措施已落实'
        ],
        TEMPORARY_ELECTRICITY: [
          '用电设备容量与临时电源匹配', '电缆线路敷设符合规范', '漏电保护器动作正常',
          'TN-S接零保护系统完好', '一机一闸一漏配置', '作业人员持有效电工操作证', '现场配置灭火器材'
        ]
      }
    };
  },
  computed: {
    localPermits() { return JSON.parse(JSON.stringify(workPermits)); },
    todoPermits() { return this.localPermits.filter(p => ['待监护确认', '作业中', '待安环审核', '待领导审批'].includes(p.status)); },
    donePermits() { return this.localPermits.filter(p => ['已归档', '待完工验收'].includes(p.status)); },
    filteredPermits() { return this.tab === 'todo' ? this.todoPermits : this.donePermits; },
    approvalNodes() {
      if (!this.selectedPermit || !this.selectedPermit.approvalChain) return [];
      return this.selectedPermit.approvalChain.split('→').map(s => s.trim()).filter(Boolean);
    },
    signForm() {
      const wp = this.selectedPermit;
      if (!wp || !workPermitSignForms[wp.workType]) return null;
      const form = workPermitSignForms[wp.workType];
      const lvl = wp.fireLevel || wp.workLevel || '—';
      const req = new Set(form.requiredByLevel[lvl] || []);
      return Object.assign({}, form, { requiredSet: req });
    },
    levelText() {
      const p = this.selectedPermit;
      if (!p) return '';
      if (p.workType === 'HIGH_ALTITUDE' && p.workLevel) return `${p.workLevel}高处（${p.heightLevel || ''}）`;
      if (p.workType === 'FIRE') return `${p.fireLevel || p.workLevel || ''}动火`;
      if (p.workType === 'LIFTING' && p.workLevel) return `${p.workLevel}起重吊装`;
      return '';
    },
    activeChecks() {
      const p = this.selectedPermit;
      if (!p) return [];
      const list = this.checklistByType[p.workType] || this.checklistByType.HIGH_ALTITUDE;
      return list.map((label, i) => ({ no: i + 1, label, done: false }));
    }
  },
  methods: {
    isSignRequired(col) {
      return this.signForm ? this.signForm.requiredSet.has(col) : false;
    },
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

.form-badge { display: inline-block; margin-bottom: 8px; padding: 3px 10px; background: $primary; color: #fff; font-size: 11px; font-weight: 600; border-radius: 6px; }
.detail-section { background: #fff; border-radius: 10px; padding: 12px; margin-bottom: 10px; border: 1px solid $border-light; }
.detail-hd { font-size: 15px; font-weight: 700; margin-bottom: 10px; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.dg-item { display: flex; flex-direction: column; }
.dg-label { font-size: 10px; color: $text-hint; }
.dg-val { font-size: 13px; color: $text-primary; font-weight: 500; &.warn { color: $warning; } &.level { color: $primary; font-weight: 700; } }
.dg-full { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed $border-light; }
.ds-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.chain-flow { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; }
.chain-node { display: inline-block; padding: 3px 9px; background: $primary-bg; border: 1px solid $primary; color: $primary; border-radius: 14px; font-size: 11px; font-weight: 600; }
.chain-arrow { color: $primary; font-weight: 700; }
.sign-form-note { font-size: 11px; color: $text-hint; margin-bottom: 8px; padding: 4px 8px; background: $gray-100; border-radius: 6px; }
.sign-cols { display: flex; flex-direction: column; gap: 6px; }
.sign-col { padding: 7px 10px; border-radius: 8px; border: 1px solid $border-light; background: $gray-100; }
.sign-col.req { border-color: $primary; background: $primary-bg; }
.sign-col.opt { opacity: .65; background: #f1f3f5; }
.sc-title { font-size: 12px; font-weight: 600; color: $text-primary; }
.sign-col.req .sc-title { color: $primary; }
.sc-line { height: 1px; background: #cfd6e0; margin: 7px 0 5px; }
.sign-col.opt .sc-line { background: #dee2e8; }
.sc-foot { display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: $text-hint; }
.sc-date { font-weight: 500; }
.sc-tag { font-size: 10px; font-weight: 700; }
.sc-tag.req { color: $primary; }
.sc-tag.empty { color: #aaa; font-weight: 500; }
.worker-rows { display: flex; flex-direction: column; gap: 6px; }
.worker-row { display: flex; align-items: center; gap: 10px; padding: 6px 8px; background: $gray-100; border-radius: 8px; }
.wr-name { font-size: 12px; font-weight: 600; color: $text-primary; }
.wr-role { font-size: 11px; color: $text-hint; flex: 1; }
.wr-sign { font-size: 11px; color: $primary; }
.checklist { display: flex; flex-direction: column; gap: 6px; }
.cl-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; cursor: pointer; }
.cl-no { font-size: 10px; width: 16px; height: 16px; line-height: 16px; text-align: center; background: $primary-bg; color: $primary; border-radius: 50%; flex-shrink: 0; }
.cl-check { font-size: 16px; }
.cl-text { font-size: 12px; color: $text-secondary; &.checked { color: $success; text-decoration: line-through; } }
.sign-hint { margin-top: 8px; font-size: 10px; color: $text-hint; font-style: italic; }
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
