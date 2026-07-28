<template>
  <div class="app-module-page">
    <div class="page-header" v-if="!embedded && !bare">
      <h2>📋 作业票</h2>
      <p class="page-subtitle">查看待办作业票，在线完成监护确认、签字与拍照留证</p>
    </div>

    <div class="app-phone-wrap" :class="{ 'app-phone-wrap--bare': bare }">
      <div class="phone-frame" :class="{ 'phone-frame--bare': bare }">
        <div class="phone-notch" v-if="!bare"></div>
        <div class="phone-screen" :class="{ 'phone-screen--bare': bare }">
          <div class="app-statusbar" v-if="!bare"><span>9:41</span><span>📶 🔋</span></div>
          <div class="app-navbar" v-if="!bare"><span class="an-back" @click="navBack" v-if="currentView!=='list'">&lsaquo;</span><span class="an-title">{{ navTitle }}</span></div>
          <div class="app-body" :class="{ 'app-body--bare': bare }">

            <!-- 列表页 -->
            <template v-if="currentView==='list'">
              <button class="list-new-btn list-new-btn--top" @click="openApply">＋ 新建作业票申请</button>
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

            <!-- 新增作业票（对标业务场景 APP 端新建作业票申请） -->
            <template v-else-if="currentView==='apply'">
              <div class="form-badge">📝 新建作业票申请</div>

              <div class="detail-section">
                <div class="ds-title">作业类型 <span class="req">*</span></div>
                <div class="apply-pills">
                  <span class="apply-pill" v-for="wt in workTypeOptions" :key="wt.value"
                        :class="{ active: applyForm.workType === wt.value }" @click="applyForm.workType = wt.value; syncApplyMeta()">
                    {{ wt.emoji }} {{ wt.label }}
                  </span>
                </div>
              </div>

              <div class="detail-section">
                <div class="ds-title">作业标题 <span class="req">*</span></div>
                <input class="apply-input" v-model="applyForm.title" placeholder="如：厂房屋面通风器检修高处作业" />
                <div class="ds-title" style="margin-top:10px">作业区域 <span class="req">*</span></div>
                <select class="apply-input" v-model="applyForm.zoneName">
                  <option value="" disabled>请选择作业区域</option>
                  <option v-for="z in factoryZones" :key="z.id" :value="z.name">{{ z.name }}</option>
                </select>
                <div class="ds-title" style="margin-top:10px">申请人 <span class="req">*</span></div>
                <input class="apply-input" v-model="applyForm.applicantName" placeholder="作业申请人姓名" />
                <div class="ds-title" style="margin-top:10px">监护人</div>
                <input class="apply-input" v-model="applyForm.guardianName" placeholder="现场监护人姓名（可后续指定）" />
                <div class="ds-title" style="margin-top:10px">计划作业时间</div>
                <input class="apply-input" v-model="applyForm.duration" placeholder="如：2026-07-16 08:00 ~ 17:00" />
              </div>

              <div class="detail-section" v-if="applyForm.workType==='HIGH_ALTITUDE'">
                <div class="ds-title">作业级别 <span class="req">*</span></div>
                <select class="apply-input" v-model="applyForm.workLevel" @change="syncApplyMeta">
                  <option value="一级">一级（2m–5m）</option>
                  <option value="二级">二级（5m–15m）</option>
                  <option value="三级">三级（15m–30m）</option>
                  <option value="特级">特级（30m以上）</option>
                </select>
                <div class="ds-title" style="margin-top:10px">作业高度</div>
                <input class="apply-input" v-model="applyForm.height" placeholder="如：8.5m" />
                <div class="apply-chain" v-if="applyPreview">审批链：{{ applyPreview }}</div>
              </div>

              <div class="detail-section" v-if="applyForm.workType==='FIRE'">
                <div class="ds-title">动火级别 <span class="req">*</span></div>
                <select class="apply-input" v-model="applyForm.workLevel" @change="syncApplyMeta">
                  <option value="二级">二级动火（有效期72小时）</option>
                  <option value="一级">一级动火（有效期8小时）</option>
                  <option value="特级">特级动火（有效期8小时）</option>
                </select>
                <div class="apply-chain" v-if="applyPreview">审批链：{{ applyPreview }}</div>
              </div>

              <div class="detail-section" v-if="applyForm.workType==='LIFTING'">
                <div class="ds-title">吊载重量</div>
                <input class="apply-input" v-model="applyForm.loadWeight" placeholder="如：18t" />
              </div>

              <div class="detail-section" v-if="applyForm.workType==='TEMPORARY_ELECTRICITY'">
                <div class="ds-title">电压 / 功率</div>
                <input class="apply-input" v-model="applyForm.voltage" placeholder="如：380V / 30kW" />
              </div>

              <div class="detail-section">
                <div class="ds-title">作业人员</div>
                <div class="apply-worker-row">
                  <input class="apply-input" v-model="applyWorkerInput.name" placeholder="姓名" style="flex:1" />
                  <input class="apply-input" v-model="applyWorkerInput.role" placeholder="角色" style="flex:2" />
                  <button class="btn-mini" @click="addApplyWorker">+ 添加</button>
                </div>
                <div class="apply-workers" v-if="applyForm.workers.length">
                  <span class="apply-chip" v-for="(w,i) in applyForm.workers" :key="i">
                    {{ w.name }}（{{ w.role }}）
                    <button class="chip-x" @click="removeApplyWorker(i)">✕</button>
                  </span>
                </div>
              </div>

              <div class="detail-section">
                <div class="ds-title">安全措施</div>
                <div class="apply-measures">
                  <label class="apply-measure" v-for="m in safetyMeasureOptions" :key="m">
                    <input type="checkbox" :value="m" v-model="applyForm.safetyMeasures" /> <span>{{ m }}</span>
                  </label>
                </div>
              </div>

              <div class="detail-section">
                <div class="ds-title">风险重点及注意事项</div>
                <textarea v-model="applyRiskInput" placeholder="每行一条风险，如：&#10;坠落高度8.5m&#10;屋面结构承载确认" rows="3"></textarea>
              </div>

              <div class="detail-actions">
                <button class="btn-secondary" @click="cancelApply">取消</button>
                <button class="btn-primary" @click="submitApply">🚀 提交申请</button>
              </div>
            </template>

            <!-- 详情页 — 对齐《危险作业审批表》 -->
            <template v-else-if="currentView==='detail' && selectedPermit">
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
                <button class="btn-primary" v-else-if="selectedPermit.status==='作业中'" @click="enterExecute">🔧 进入作业执行</button>
              </div>
            </template>

            <!-- 作业执行界面 -->
            <template v-else-if="currentView==='execute'">
              <div class="form-badge live">🔧 作业执行中</div>

              <div class="exec-timer">
                <div class="exec-timer-label">已作业时长</div>
                <div class="exec-timer-val">{{ elapsedText }}</div>
                <div class="exec-timer-sub">开工 {{ startedAtText }} ｜ 计划 {{ selectedPermit.duration }}</div>
              </div>

              <div class="detail-section">
                <div class="ds-title">📋 作业概要</div>
                <div class="detail-grid">
                  <div class="dg-item"><span class="dg-label">作业类型</span><span class="dg-val">{{ typeLabels[selectedPermit.workType] }}</span></div>
                  <div class="dg-item"><span class="dg-label">作业地点</span><span class="dg-val">{{ selectedPermit.zoneName }}</span></div>
                  <div class="dg-item"><span class="dg-label">监护人</span><span class="dg-val">{{ selectedPermit.guardianName || '待指定' }}</span></div>
                  <div class="dg-item"><span class="dg-label">作业证号</span><span class="dg-val">{{ selectedPermit.id }}</span></div>
                </div>
              </div>

              <div class="detail-section">
                <div class="ds-title">📝 过程记录（现场留痕）</div>
                <div class="proc-list" v-if="procLogs.length">
                  <div class="proc-item" v-for="(r,i) in procLogs" :key="i">
                    <span class="proc-time">{{ r.time }}</span>
                    <span class="proc-text">{{ r.text }}</span>
                  </div>
                </div>
                <div class="empty-hint" v-else>暂无过程记录，可添加作业进展或异常说明</div>
                <div class="proc-input">
                  <input v-model="procInput" @keyup.enter="addProcLog" placeholder="填写本阶段作业进展 / 异常情况…" />
                  <button class="btn-mini" @click="addProcLog">＋ 记录</button>
                </div>
              </div>

              <div class="detail-section">
                <div class="ds-title">📸 过程留证</div>
                <div class="photo-grid">
                  <div class="photo-item" v-for="i in 4" :key="i"><div class="photo-placeholder">📷<br><small>拍照留证</small></div></div>
                </div>
              </div>

              <div class="detail-actions">
                <button class="btn-secondary" @click="currentView='detail'">返回</button>
                <button class="btn-primary" @click="goReport">📝 作业报工</button>
              </div>
            </template>

            <!-- 报工界面 -->
            <template v-else-if="currentView==='report'">
              <div class="form-badge">📝 作业报工</div>

              <div class="detail-section">
                <div class="ds-title">⏱ 作业时间</div>
                <div class="report-row"><label>实际开工</label><input v-model="reportData.startTime" type="text" placeholder="如 09:20" /></div>
                <div class="report-row"><label>实际完工</label><input v-model="reportData.endTime" type="text" placeholder="如 11:40" /></div>
                <div class="report-row"><label>实际工时(h)</label><input v-model="reportData.hours" type="number" min="0" step="0.5" placeholder="如 2.5" /></div>
                <div class="report-row"><label>作业人数</label><input v-model="reportData.workers" type="number" min="0" placeholder="如 4" /></div>
              </div>

              <div class="detail-section">
                <div class="ds-title">📄 完成情况</div>
                <textarea v-model="reportData.summary" placeholder="描述作业完成情况、遗留问题、后续注意事项…"></textarea>
              </div>

              <div class="detail-section">
                <div class="ds-title">📸 完工照片</div>
                <div class="photo-grid">
                  <div class="photo-item" v-for="i in 4" :key="i"><div class="photo-placeholder">📷<br><small>拍照上传</small></div></div>
                </div>
              </div>

            <div class="detail-actions">
              <button class="btn-secondary" @click="currentView='execute'">返回</button>
              <button class="btn-primary" @click="submitReport">✅ 提交完工验收</button>
            </div>
          </template>

          </div>
        </div>
      </div>
      <div class="phone-caption" v-if="!embedded && !bare">
        <h4>功能说明</h4>
        <ul>
          <li>📋 实时查看名下所有待办/已完成作业票</li>
          <li>✅ 在线逐项确认安全措施，勾选留痕</li>
          <li>📸 现场拍照留证，照片自动关联作业票</li>
          <li>✍️ 监护人在线签字确认，完成流程闭环</li>
          <li>🔧 作业完工后一键上报，触发验收流程</li>
          <li>⏱ 作业中实时计时与过程留痕，过程记录可查</li>
          <li>📝 完工报工填写实际工时与完成情况，提交验收</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { workPermits, workPermitSignForms, getApprovalChain, getWorkValidity, factoryZones } from '@/store/safeData';

export default {
  name: 'WorkTicket',
  props: {
    embedded: { type: Boolean, default: false },
    bare: { type: Boolean, default: false }
  },
  data() {
    return {
      currentView: 'list',
      tab: 'todo',
      selectedPermit: null,
      // 与台账/移动工作台共享同一份数据源，保证提交报工后台账同步变更
      localPermits: workPermits,
      applyForm: {
        workType: 'HIGH_ALTITUDE', title: '', zoneName: '', applicantName: '', applicantDept: '',
        guardianName: '', duration: '', workLevel: '二级',
        height: '', loadWeight: '', voltage: '', fireLevel: '',
        workers: [], safetyMeasures: []
      },
      applyWorkerInput: { name: '', role: '' },
      applyRiskInput: '',
      workTypeOptions: [
        { value: 'HIGH_ALTITUDE', label: '高处作业', emoji: '🏗️' },
        { value: 'FIRE', label: '动火作业', emoji: '🔥' },
        { value: 'LIFTING', label: '起重吊装', emoji: '⛓' },
        { value: 'TEMPORARY_ELECTRICITY', label: '临时用电', emoji: '⚡' }
      ],
      safetyMeasureOptions: [
        '安全帽+安全带+安全绳', '生命线系统', '防坠落网', '警戒区域设置',
        '吊装方案审批', '起重设备日检合格', '警戒区域硬隔离', '人员站位确认',
        '临时用电方案审批', '配电箱漏保测试', '电缆架空敷设', '电缆过路保护',
        '挂牌锁定程序', '通风检测', '通讯设备完好', '消防器材就位', '应急物资就位'
      ],
      factoryZones,
      execStartedAt: null,
      now: Date.now(),
      procLogs: [],
      procInput: '',
      reportData: { startTime: '', endTime: '', hours: '', workers: '', summary: '' },
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
    todoPermits() { return this.localPermits.filter(p => ['待监护确认', '作业中', '待安环审核', '待领导审批'].includes(p.status)); },
    donePermits() { return this.localPermits.filter(p => ['已归档', '待完工验收'].includes(p.status)); },
    filteredPermits() { return this.tab === 'todo' ? this.todoPermits : this.donePermits; },
    applyPreview() {
      const f = this.applyForm;
      const lvl = f.workType === 'FIRE' ? f.workLevel : (f.workType === 'LIFTING' ? '特殊' : f.workLevel);
      return getApprovalChain(f.workType, lvl);
    },
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
    },
    navTitle() {
      if (this.currentView === 'list') return '我的作业票';
      if (this.currentView === 'apply') return '新建作业票申请';
      if (this.currentView === 'execute') return '作业执行';
      if (this.currentView === 'report') return '作业报工';
      return this.selectedPermit ? this.selectedPermit.title : '作业票详情';
    },
    elapsedText() {
      if (!this.execStartedAt) return '00:00:00';
      const s = Math.max(0, Math.floor((this.now - this.execStartedAt) / 1000));
      const h = String(Math.floor(s / 3600)).padStart(2, '0');
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      return `${h}:${m}:${ss}`;
    },
    startedAtText() {
      if (!this.execStartedAt) return '—';
      const d = new Date(this.execStartedAt);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
  },
  methods: {
    isSignRequired(col) {
      return this.signForm ? this.signForm.requiredSet.has(col) : false;
    },
    selectPermit(wp) {
      this.selectedPermit = wp;
      // 作业执行中 → 进作业执行界面（计时器+过程记录）；待完工验收 → 进报工界面
      if (wp.status === '作业中') {
        this.currentView = 'execute';
        this.execStartedAt = Date.now(); // 开始计时
      } else if (wp.status === '待完工验收') {
        this.currentView = 'report';
        this.execStartedAt = null;
      } else {
        this.currentView = 'detail';
        this.execStartedAt = null;
      }
      this.procLogs = [];
    },
    confirmGuardian() {
      alert('监护确认成功！签名已上传。');
      this.selectedPermit.status = '作业中';
    },
    enterExecute() {
      if (!this.execStartedAt) this.execStartedAt = Date.now();
      this.currentView = 'execute';
    },
    goReport() { this.currentView = 'report'; },
    addProcLog() {
      const t = (this.procInput || '').trim();
      if (!t) return;
      this.procLogs.push({ time: this.nowTimeText(), text: t });
      this.procInput = '';
    },
    nowTimeText() {
      const d = new Date();
      const p = n => String(n).padStart(2, '0');
      return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    },
    navBack() {
      if (this.currentView === 'execute') this.currentView = 'detail';
      else if (this.currentView === 'report') this.currentView = 'execute';
      else if (this.currentView === 'apply') this.currentView = 'list';
      else this.currentView = 'list';
    },
    submitReport() {
      if (!confirm('确认提交作业报工，进入完工验收？')) return;
      if (this.selectedPermit) {
        this.selectedPermit.status = '待完工验收';
        this.selectedPermit.report = Object.assign({}, this.reportData);
      }
      alert('作业报工已提交，等待安环验收。');
      this.currentView = 'list';
    },
    // ===== 新增作业票（对标业务场景 APP 端新建作业票申请）=====
    openApply() {
      this.applyForm = {
        workType: 'HIGH_ALTITUDE', title: '', zoneName: '', applicantName: '', applicantDept: '',
        guardianName: '', duration: '', workLevel: '二级',
        height: '', loadWeight: '', voltage: '', fireLevel: '',
        workers: [], safetyMeasures: []
      };
      this.applyWorkerInput = { name: '', role: '' };
      this.applyRiskInput = '';
      this.currentView = 'apply';
    },
    cancelApply() { this.currentView = 'list'; },
    addApplyWorker() {
      const n = (this.applyWorkerInput.name || '').trim();
      if (!n) return;
      this.applyForm.workers.push({ name: n, role: (this.applyWorkerInput.role || '').trim() || '作业人' });
      this.applyWorkerInput = { name: '', role: '' };
    },
    removeApplyWorker(i) { this.applyForm.workers.splice(i, 1); },
    syncApplyMeta() { /* 审批链由 applyPreview 计算属性实时给出 */ },
    genApplyId() {
      const d = new Date();
      const p = n => String(n).padStart(2, '0');
      const seq = (this.localPermits.length + 1).toString().padStart(3, '0');
      return `GZ${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${seq}`;
    },
    submitApply() {
      const f = this.applyForm;
      if (!f.title.trim() || !f.applicantName.trim() || !f.zoneName) {
        alert('请填写作业标题、申请人与作业区域');
        return;
      }
      const t = f.workType;
      const lvl = t === 'FIRE' ? f.workLevel : (t === 'LIFTING' ? '特殊' : f.workLevel);
      if (!f.duration.trim()) {
        const today = new Date().toISOString().slice(0, 10);
        f.duration = `${today} 08:00 ~ ${today} 18:00`;
      }
      const id = this.genApplyId();
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const permit = {
        id,
        workType: t,
        title: f.title,
        zoneName: f.zoneName,
        applicantName: f.applicantName,
        applicantDept: f.applicantDept || '—',
        guardianName: f.guardianName,
        duration: f.duration,
        workLevel: lvl,
        fireLevel: t === 'FIRE' ? lvl : '',
        height: t === 'HIGH_ALTITUDE' ? f.height : '',
        loadWeight: t === 'LIFTING' ? f.loadWeight : '',
        voltage: t === 'TEMPORARY_ELECTRICITY' ? f.voltage : '',
        workers: JSON.parse(JSON.stringify(f.workers)),
        safetyMeasures: JSON.parse(JSON.stringify(f.safetyMeasures)),
        riskHighlights: (this.applyRiskInput || '').split('\n').map(s => s.trim()).filter(Boolean),
        approvalChain: getApprovalChain(t, lvl),
        validity: getWorkValidity(t, lvl),
        status: f.guardianName ? '待安环审核' : '待监护确认',
        checks: [],
        timeline: [{ time: now, action: `${f.applicantName}提交${this.typeLabels[t]}作业申请`, operator: f.applicantName }]
      };
      this.localPermits.unshift(JSON.parse(JSON.stringify(permit)));
      this.tab = 'todo';
      this.currentView = 'list';
      alert(`作业票 ${id} 已提交，当前状态：${permit.status}`);
    }
  },
  watch: {
    currentView(val) { this.$emit('view-change', val); }
  },
  mounted() {
    this._timer = setInterval(() => { this.now = Date.now(); }, 1000);
  },
  beforeDestroy() {
    if (this._timer) clearInterval(this._timer);
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

/* bare 模式：作为移动工作台内嵌内容，由宿主提供电话壳与导航条，自身不渲染外壳 */
.app-phone-wrap--bare { display: block; margin-top: 0; gap: 0; }
.phone-frame--bare { width: 100%; flex-shrink: 1; border: none; border-radius: 0; overflow: visible; background: transparent; box-shadow: none; }
.phone-screen--bare { min-height: auto; max-height: none; background: transparent; border-radius: 0; overflow: visible; display: block; }
.app-body--bare { max-height: none; overflow: visible; padding: 0; }

/* 列表底部「新建作业票申请」按钮 */
.list-new-btn { width: 100%; margin-top: 12px; padding: 12px; border: 1px dashed #0075E6; border-radius: 10px; background: rgba(0,117,230,0.06); color: #0075E6; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.list-new-btn--top { margin-top: 0; margin-bottom: 12px; }
.list-new-btn:hover { background: rgba(0,117,230,0.12); }

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

/* 作业执行 / 报工 新增样式 */
.form-badge.live { background: $warning; animation: badgeLive 1.6s ease-in-out infinite; }
@keyframes badgeLive { 0%, 100% { opacity: 1; } 50% { opacity: .72; } }
.exec-timer { background: linear-gradient(135deg, $primary, #1d4ed8); color: #fff; border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; text-align: center; }
.exec-timer-label { font-size: 11px; opacity: .85; }
.exec-timer-val { font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: 1px; margin: 2px 0; }
.exec-timer-sub { font-size: 11px; opacity: .8; }
.proc-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
.proc-item { display: flex; gap: 8px; padding: 7px 10px; background: $gray-100; border-radius: 8px; }
.proc-time { font-size: 11px; color: $primary; font-weight: 600; flex-shrink: 0; font-variant-numeric: tabular-nums; }
.proc-text { font-size: 12px; color: $text-secondary; }
.empty-hint { font-size: 11px; color: $text-hint; padding: 8px 0; }
.proc-input { display: flex; gap: 6px; }
.proc-input input { flex: 1; padding: 8px 10px; border: 1px solid $border; border-radius: 8px; font-size: 12px; }
.btn-mini { padding: 0 12px; background: $primary; color: #fff; border: 0; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; }
.report-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.report-row label { width: 78px; font-size: 12px; color: $text-hint; flex-shrink: 0; }
.report-row input { flex: 1; padding: 8px 10px; border: 1px solid $border; border-radius: 8px; font-size: 12px; }
textarea { width: 100%; min-height: 80px; padding: 10px; border: 1px solid $border; border-radius: 8px; font-size: 12px; resize: vertical; box-sizing: border-box; font-family: inherit; }

/* 新增作业票 */
.an-action { margin-left: auto; background: rgba(255,255,255,.18); color: #fff; border: 1px solid rgba(255,255,255,.45); border-radius: 14px; padding: 3px 12px; font-size: 12px; font-weight: 600; cursor: pointer; }
.an-action:hover { background: rgba(255,255,255,.32); }
.req { color: #ef4444; }
.apply-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.apply-pill { padding: 6px 12px; border: 1px solid $border-light; border-radius: 10px; font-size: 12px; cursor: pointer; background: #fff; transition: all .2s; }
.apply-pill.active { background: $primary; color: #fff; border-color: $primary; font-weight: 600; }
.apply-input { width: 100%; padding: 8px 10px; border: 1px solid $border; border-radius: 8px; font-size: 12px; box-sizing: border-box; background: #fff; }
.apply-chain { margin-top: 8px; font-size: 11px; color: $primary; background: $primary-bg; padding: 6px 10px; border-radius: 8px; }
.apply-worker-row { display: flex; gap: 6px; }
.apply-workers { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.apply-chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: $primary-bg; border-radius: 16px; font-size: 11px; color: $primary; }
.chip-x { background: none; border: none; color: $text-hint; cursor: pointer; padding: 0; font-size: 11px; }
.chip-x:hover { color: #ef4444; }
.apply-measures { display: flex; flex-wrap: wrap; gap: 6px; }
.apply-measure { display: flex; align-items: center; gap: 4px; padding: 5px 10px; background: $gray-100; border: 1px solid $border-light; border-radius: 8px; font-size: 11px; cursor: pointer; }
</style>
