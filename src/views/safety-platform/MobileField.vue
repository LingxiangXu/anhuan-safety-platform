<template>
  <div class="mobile-page">
    <div class="page-header">
      <h2>APP 移动现场</h2>
      <p class="page-subtitle">现场人员通过移动APP完成巡检上报、隐患提报、监护确认等操作，实现"现场 → 系统"的即时闭环</p>
    </div>

    <!-- 功能概述 -->
    <section class="ov-section">
      <h3 class="section-title">功能概述</h3>
      <div class="overview-text">
        <p>移动现场APP是安全管理平台向<strong>一线现场人员</strong>延伸的终端。现场人员通过手机完成<strong>巡检任务执行、隐患随手拍上报、特殊作业监护人确认、作业现场拍照留证</strong>等操作，确保安全管理从PC端的"管理视角"延伸到APP端的"现场视角"，实现<strong>发现即上报、上报即受理、受理即追踪</strong>的现场闭环。</p>
      </div>
    </section>

    <!-- 移动工作台 -->
    <section class="ov-section">
      <h3 class="section-title">操作界面 Demo — 移动工作台</h3>
      <div class="app-demo-wrap">
        <div class="phone-frame">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <div class="app-statusbar">
              <span class="as-time">9:41</span>
              <span class="as-icons">📶 🔋</span>
            </div>
            <div class="app-navbar">
              <span class="an-title" v-if="currentView === 'main'">安全管理 · 太重集团</span>
              <span class="an-back" v-else @click="currentView='main'">&lsaquo;</span>
              <span class="an-title" v-else>{{ viewTitle }}</span>
            </div>
            <div class="app-body">

              <!-- ===== 主页面 ===== -->
              <template v-if="currentView === 'main'">
                <div class="mob-user-card">
                  <div class="muc-avatar">👷</div>
                  <div class="muc-info">
                    <div class="muc-name">陈文斌</div>
                    <div class="muc-role">安全监督 · 太原重工铸锻件分公司</div>
                  </div>
                  <div class="muc-status on">🟢 在岗</div>
                </div>

                <div class="mob-menu-grid">
                  <div class="mm-item" v-for="m in mainMenu" :key="m.key" @click="currentView = m.key">
                    <div class="mm-icon">{{ m.icon }}</div>
                    <div class="mm-label">{{ m.label }}</div>
                    <div class="mm-badge" v-if="m.badge">{{ m.badge }}</div>
                  </div>
                </div>

                <div class="mob-section-title">今日任务</div>
                <div class="mob-task-card" @click="currentView='inspection'">
                  <div class="mtc-header">
                    <span class="mtc-title">📋 铸造车间区域巡检</span>
                    <span class="tag tag-orange">待执行</span>
                  </div>
                  <div class="mtc-meta">检查项 12 项 · 截止 17:00</div>
                  <div class="mtc-bar"><div class="mtc-fill" style="width:0%"></div></div>
                </div>

                <div class="mob-task-card done" @click="currentView='hazard-report'">
                  <div class="mtc-header">
                    <span class="mtc-title">⚠️ 锻压车间巡检上报</span>
                    <span class="tag tag-green">已完成</span>
                  </div>
                  <div class="mtc-meta">发现吊索具磨损已上报 · 10:30完成</div>
                </div>

                <div class="mob-section-title">待处理事项</div>
                <div class="mob-pending-card" @click="currentView='guardian'">
                  <div class="mpc-icon">✅</div>
                  <div class="mpc-content">
                    <div class="mpc-title">监护确认待办</div>
                    <div class="mpc-desc">高处作业 · 厂房屋面通风器检修</div>
                    <div class="mpc-time">提交于 07-14 16:30</div>
                  </div>
                  <div class="mpc-arrow">›</div>
                </div>
              </template>

              <!-- ===== 巡检执行 ===== -->
              <template v-else-if="currentView === 'inspection'">
                <div class="mob-inspect">
                  <div class="mi-header">
                    <div class="mih-title">📋 铸造车间区域巡检</div>
                    <div class="mih-loc">📍 熔炼铸造区 · 12项检查</div>
                  </div>
                  <div class="mi-checklist">
                    <div class="mic-item" v-for="(item, i) in inspectionItems" :key="i" :class="{ done: item.done }" @click="item.done = !item.done">
                      <span class="mic-chk">{{ item.done ? '✅' : '☐' }}</span>
                      <span class="mic-label">{{ item.label }}</span>
                      <span class="mic-result" v-if="item.done">{{ item.result }}</span>
                    </div>
                  </div>
                  <div class="mi-abnormal">
                    <div class="mia-label">发现异常？</div>
                    <button class="ph-btn danger" @click="currentView='hazard-report'">⚠️ 立即上报隐患</button>
                  </div>
                  <button class="ph-btn primary" @click="currentView='main'">提交巡检结果</button>
                </div>
              </template>

              <!-- ===== 隐患上报 ===== -->
              <template v-else-if="currentView === 'hazard-report'">
                <div class="mob-report">
                  <div class="mr-form">
                    <div class="mrf-group">
                      <div class="mrf-label">隐患标题 <span class="req">*</span></div>
                      <div class="mrf-input filled">桥式起重机A区吊索具磨损超标</div>
                    </div>
                    <div class="mrf-group">
                      <div class="mrf-label">所属区域 <span class="req">*</span></div>
                      <div class="mrf-select filled">大型构件吊装区 <span class="arrow">▾</span></div>
                    </div>
                    <div class="mrf-group">
                      <div class="mrf-label">严重程度 <span class="req">*</span></div>
                      <div class="mrf-pills">
                        <span class="mrfp active danger">重大</span>
                        <span class="mrfp">较大</span>
                        <span class="mrfp">一般</span>
                        <span class="mrfp">低</span>
                      </div>
                    </div>
                    <div class="mrf-group">
                      <div class="mrf-label">隐患描述 <span class="req">*</span></div>
                      <div class="mrf-textarea filled">巡检发现5T吊带出现纤维断裂，磨损超过报废标准10%，已暂停该区域吊装作业</div>
                    </div>
                    <div class="mrf-photos">
                      <div class="mrfp-label">现场照片</div>
                      <div class="mrfp-grid">
                        <div class="mrfpg-item done">📸 吊带照片</div>
                        <div class="mrfpg-item">+ 添加</div>
                      </div>
                    </div>
                  </div>
                  <button class="ph-btn primary" @click="currentView='report-ok'">上报隐患</button>
                </div>
              </template>

              <template v-else-if="currentView === 'report-ok'">
                <div class="ph-result success">
                  <div class="phr-icon">✅</div>
                  <div class="phr-title">隐患已上报</div>
                  <div class="phr-desc">编号 YH20260712001</div>
                  <div class="phr-info">
                    <div class="phri-row"><span>严重程度</span><span class="tag tag-red">重大</span></div>
                    <div class="phri-row"><span>上报时间</span><span>2026-07-12 08:30</span></div>
                    <div class="phri-row"><span>状态</span><span class="tag tag-orange">待受理</span></div>
                  </div>
                  <button class="ph-btn outline" @click="currentView='main'">返回首页</button>
                </div>
              </template>

              <!-- ===== 监护确认 ===== -->
              <template v-else-if="currentView === 'guardian'">
                <div class="mob-guardian">
                  <div class="mg-header">🛡️ 监护人确认</div>
                  <div class="mg-card">
                    <div class="mgc-row"><span>作业票编号</span><strong>GZ20260715001</strong></div>
                    <div class="mgc-row"><span>作业类型</span><strong>🏗️ 高处作业</strong></div>
                    <div class="mgc-row"><span>作业内容</span><strong>厂房屋面通风器检修</strong></div>
                    <div class="mgc-row"><span>作业区域</span><strong>厂房屋面检修区</strong></div>
                    <div class="mgc-row"><span>作业高度</span><strong>8.5m</strong></div>
                    <div class="mgc-row"><span>作业人员</span><strong>孙志明</strong></div>
                    <div class="mgc-row"><span>计划时间</span><strong>07-15 08:00~17:00</strong></div>
                  </div>
                  <div class="mg-check">
                    <div class="mgch-title">开工前安全确认</div>
                    <div class="mgch-item" v-for="c in guardianChecks" :key="c" :class="{ ok: checkedItems[c] }" @click="toggleCheck(c)">
                      <span class="mgch-chk">{{ checkedItems[c] ? '✅' : '☐' }}</span>
                      {{ c }}
                    </div>
                  </div>
                  <button class="ph-btn primary" :disabled="!allChecked" @click="currentView='guardian-ok'">
                    {{ allChecked ? '确认并允许开工' : '请完成全部安全确认' }}
                  </button>
                </div>
              </template>

              <template v-else-if="currentView === 'guardian-ok'">
                <div class="ph-result success">
                  <div class="phr-icon">🛡️</div>
                  <div class="phr-title">监护确认完成</div>
                  <div class="phr-desc">作业票 GZ20260715001 已进入作业执行状态</div>
                  <div class="phr-info">
                    <div class="phri-row"><span>确认人</span><span>陈文斌</span></div>
                    <div class="phri-row"><span>确认时间</span><span>2026-07-15 07:45</span></div>
                    <div class="phri-row"><span>状态</span><span class="tag tag-blue">作业中</span></div>
                  </div>
                  <button class="ph-btn outline" @click="currentView='main'">返回首页</button>
                </div>
              </template>

            </div>
          </div>
        </div>

        <!-- 右侧注释卡 -->
        <div class="app-demo-notes">
          <div class="note-card"><h4>📱 移动工作台</h4><p>现场人员登录后的主面板，顶部展示个人身份与在岗状态，9宫格入口覆盖全部现场操作。底部展示今日待执行任务与待处理事项。</p></div>
          <div class="note-card"><h4>📋 巡检执行</h4><p>逐项打勾完成巡检检查表，发现异常时可一键跳转隐患上报，实现"巡检→发现→上报"无缝衔接。</p></div>
          <div class="note-card"><h4>⚠️ 随手拍上报</h4><p>现场人员发现隐患后拍照取证、选择区域与严重程度、填写描述后一键上报。系统自动生成隐患编号并进入公司安环受理流程。</p></div>
          <div class="note-card"><h4>🛡️ 监护人确认</h4><p>特殊作业开工前，监护人通过APP逐项确认安全条件（人员证件、防护措施、天气等），全部通过后方可允许开工。系统记录确认时间与操作人。</p></div>
          <div class="note-card"><h4>🔄 与PC端协同</h4><p>移动端上报的隐患实时同步至PC端隐患台账，PC端分派的巡检任务实时推送至移动端。两端数据同源、状态联动。</p></div>
        </div>
      </div>
    </section>

    <!-- 移动端功能模块全景 -->
    <section class="ov-section">
      <h3 class="section-title">APP功能模块全景</h3>
      <div class="section-card">
        <div class="app-module-grid">
          <div class="am-card" v-for="m in appModules" :key="m.key">
            <div class="am-icon">{{ m.icon }}</div>
            <div class="am-name">{{ m.name }}</div>
            <div class="am-desc">{{ m.desc }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'MobileField',
  data() {
    return {
      currentView: 'main',
      checkedItems: {},
      mainMenu: [
        { key: 'inspection', icon: '📋', label: '巡检任务', badge: 1 },
        { key: 'hazard-report', icon: '⚠️', label: '隐患上报' },
        { key: 'guardian', icon: '🛡️', label: '监护确认', badge: 1 },
        { key: 'work-permit', icon: '📝', label: '作业票' },
        { key: 'duty-sign', icon: '🟢', label: '到岗签到' },
        { key: 'emergency', icon: '🆘', label: '应急求助' },
        { key: 'message', icon: '🔔', label: '消息中心', badge: 3 },
        { key: 'risk-map', icon: '🗺️', label: '风险地图' },
        { key: 'profile', icon: '👤', label: '个人中心' }
      ],
      inspectionItems: [
        { label: '炉前防护挡板完好', done: false, result: '正常' },
        { label: '自动测温报警装置运行正常', done: false, result: '正常' },
        { label: '紧急倾炉装置测试合格', done: false, result: '正常' },
        { label: '浇注坑围栏无损坏', done: false, result: '正常' },
        { label: '天车限位装置灵敏', done: false, result: '正常' },
        { label: '高温警示标识清晰', done: false, result: '正常' },
        { label: '作业人员劳保穿戴规范', done: false, result: '正常' },
        { label: '消防器材在位有效', done: false, result: '正常' },
        { label: '安全通道畅通', done: false, result: '正常' },
        { label: '电气线路无裸露', done: false, result: '正常' },
        { label: '通风系统运行正常', done: false, result: '正常' },
        { label: '应急照明测试合格', done: false, result: '正常' }
      ],
      guardianChecks: [
        '作业人员高处作业证有效',
        '安全帽/安全带/安全绳已穿戴',
        '生命线系统已检查连接',
        '防坠落网已就位',
        '警戒区域已设置',
        '天气条件满足（晴/风力<5级）',
        '通讯设备正常',
        '急救箱在场'
      ],
      appModules: [
        { key: 'inspection', icon: '📋', name: '巡检任务', desc: '接收并执行PC端分派的日常/专项巡检任务，逐项打勾完成' },
        { key: 'hazard', icon: '⚠️', name: '隐患上报', desc: '随手拍+描述+分级，一键上报隐患至公司安环受理中心' },
        { key: 'guardian', icon: '🛡️', name: '监护确认', desc: '开工前逐项核验安全条件，确认后允许作业开工' },
        { key: 'permit', icon: '📝', name: '作业票', desc: '查看个人关联的作业票，确认作业内容与安全措施' },
        { key: 'signin', icon: '🟢', name: '到岗签到', desc: 'GPS定位+人脸识别签到，关联排班与资质校验' },
        { key: 'emergency', icon: '🆘', name: '应急求助', desc: '一键SOS求助，自动推送位置与个人信息至安环中心' },
        { key: 'message', icon: '🔔', name: '消息中心', desc: '接收隐患分派、督办通知、证件到期提醒等推送' },
        { key: 'riskmap', icon: '🗺️', name: '风险地图', desc: '查看所在厂区四色风险分布图与实时风险点状态' }
      ]
    };
  },
  computed: {
    viewTitle() {
      const map = {
        'inspection': '巡检任务', 'hazard-report': '隐患上报',
        'report-ok': '上报结果', 'guardian': '监护人确认',
        'guardian-ok': '确认结果'
      };
      return map[this.currentView] || '';
    },
    allChecked() {
      return this.guardianChecks.every(c => this.checkedItems[c]);
    }
  },
  methods: {
    toggleCheck(item) {
      this.$set(this.checkedItems, item, !this.checkedItems[item]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.mobile-page { max-width: 1000px; }
.page-header {
  margin-bottom: $space-xl;
  h2 { font-size: $font-2xl; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; }
}

.ov-section { margin-bottom: $space-2xl; }
.section-title { font-size: $font-md; font-weight: 600; color: $text-primary; margin-bottom: $space-lg; padding-left: 12px; border-left: 3px solid $primary; }
.section-card { background: #fff; border-radius: $radius-lg; padding: $space-lg $space-xl; border: 1px solid $border; }

.overview-text { background: $gray-50; border-radius: $radius-base; padding: $space-lg; font-size: $font-sm; color: $text-secondary; line-height: 1.9; border-left: 3px solid $primary;
  strong { color: $primary; }
}

// ==== APP Demo 布局 ====
.app-demo-wrap { display: flex; gap: $space-2xl; align-items: flex-start; }

// ==== 手机壳 ====
.phone-frame { width: 400px; flex-shrink: 0; background: #1a1a2e; border-radius: 36px; padding: 12px; box-shadow: 0 8px 40px rgba(0,0,0,0.25); }
.phone-notch { width: 120px; height: 24px; background: #1a1a2e; margin: 0 auto 8px; border-radius: 0 0 18px 18px; }
.phone-screen { background: #f5f5f5; border-radius: 24px; overflow: hidden; min-height: 600px; max-height: 650px; display: flex; flex-direction: column; font-size: 12px; }

.app-statusbar { display: flex; justify-content: space-between; padding: 8px 20px; background: #2E7D32; color: #fff; font-size: 10px; }
.app-navbar { display: flex; align-items: center; padding: 8px 16px; background: #fff; border-bottom: 1px solid #eee; min-height: 36px;
  .an-back { font-size: 22px; color: #2E7D32; cursor: pointer; width: 24px; font-weight: 300; line-height: 1; }
  .an-title { flex: 1; text-align: center; font-weight: 600; font-size: 13px; color: $text-primary; }
}
.app-body { flex: 1; overflow-y: auto; padding: 8px 12px; display: flex; flex-direction: column; gap: 8px; }

// ==== 通用按钮 ====
.ph-btn { width: 100%; padding: 10px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 8px;
  &.primary { background: linear-gradient(135deg, #43A047, #66BB6A); color: #fff; }
  &.outline { background: #fff; color: #43A047; border: 1px solid #43A047; }
  &.danger { background: #fff; color: #C62828; border: 1px solid #C62828; }
  &:disabled { background: #ccc; cursor: not-allowed; }
}

.ph-result { text-align: center; padding: 30px 16px;
  .phr-icon { font-size: 48px; margin-bottom: 12px; }
  .phr-title { font-size: 18px; font-weight: 700; color: #333; margin-bottom: 4px; }
  .phr-desc { font-size: 12px; color: #999; margin-bottom: 16px; }
  .phr-info { background: #fff; border-radius: 8px; padding: 10px; text-align: left; margin-bottom: 12px; }
  .phri-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 11px; border-bottom: 1px solid #f5f5f5;
    &:last-child { border: none; }
    span:first-child { color: #999; }
    span:last-child { color: #333; font-weight: 500; }
  }
}

.tag { font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 500; }
.tag-green { background: #f0fdf4; color: $success-700; }
.tag-red { background: $danger-100; color: $danger-700; }
.tag-orange { background: #fff7ed; color: $danger-700; }
.tag-blue { background: #eff6ff; color: #1e40af; }

// ==== 主页面 ====
.mob-user-card { background: linear-gradient(135deg, #43A047, #66BB6A); border-radius: 10px; padding: 12px; color: #fff; display: flex; align-items: center; gap: 10px; }
.muc-avatar { font-size: 30px; }
.muc-info { flex: 1; }
.muc-name { font-size: 14px; font-weight: 700; }
.muc-role { font-size: 10px; opacity: 0.85; }
.muc-status { font-size: 10px; background: rgba(255,255,255,0.2); border-radius: 12px; padding: 3px 10px; font-weight: 500; }

.mob-menu-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.mm-item { background: #fff; border-radius: 8px; padding: 12px 6px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.06); position: relative; cursor: pointer;
  &:active { background: #f0f0f0; }
}
.mm-icon { font-size: 22px; margin-bottom: 4px; }
.mm-label { font-size: 10px; color: #333; font-weight: 500; }
.mm-badge { position: absolute; top: 4px; right: 4px; background: #F44336; color: #fff; font-size: 8px; min-width: 14px; height: 14px; line-height: 14px; border-radius: 7px; text-align: center; padding: 0 3px; }

.mob-section-title { font-size: 12px; font-weight: 600; color: #333; padding-left: 2px; margin-top: 4px; }

.mob-task-card { background: #fff; border-radius: 10px; padding: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); cursor: pointer;
  &.done { opacity: 0.7; }
  .mtc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .mtc-title { font-size: 12px; font-weight: 600; color: #333; }
  .mtc-meta { font-size: 10px; color: #999; margin-bottom: 6px; }
  .mtc-bar { height: 4px; background: #e0e0e0; border-radius: 2px; overflow: hidden; }
  .mtc-fill { height: 100%; background: linear-gradient(90deg, #43A047, #66BB6A); border-radius: 2px; }
}

.mob-pending-card {
  display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 10px; padding: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06); cursor: pointer; border-left: 3px solid $warning;
  .mpc-icon { font-size: 24px; }
  .mpc-content { flex: 1; }
  .mpc-title { font-size: 12px; font-weight: 600; color: #333; }
  .mpc-desc { font-size: 10px; color: #666; }
  .mpc-time { font-size: 9px; color: #999; }
  .mpc-arrow { font-size: 18px; color: #ccc; }
}

// ==== 巡检 ====
.mob-inspect { display: flex; flex-direction: column; gap: 8px; }
.mi-header { text-align: center; padding: 8px; background: #E3F2FD; border-radius: 8px; }
.mih-title { font-size: 13px; font-weight: 700; color: #1565C0; }
.mih-loc { font-size: 10px; color: #666; margin-top: 2px; }
.mi-checklist { display: flex; flex-direction: column; gap: 3px; }
.mic-item { display: flex; align-items: center; gap: 8px; padding: 7px 8px; background: #fff; border-radius: 6px; cursor: pointer; font-size: 11px;
  &.done { background: #f0fdf4; }
  .mic-chk { font-size: 14px; width: 20px; text-align: center; }
  .mic-label { flex: 1; color: #333; }
  .mic-result { font-size: 9px; color: #43A047; }
}
.mi-abnormal { text-align: center; padding: 8px; background: #FFF3E0; border-radius: 8px; }
.mia-label { font-size: 10px; color: #E65100; margin-bottom: 4px; font-weight: 500; }

// ==== 隐患上报表单 ====
.mob-report { display: flex; flex-direction: column; gap: 6px; }
.mrf-group { margin-bottom: 4px; }
.mrf-label { font-size: 10px; color: #999; margin-bottom: 2px; .req { color: #F44336; } }
.mrf-input, .mrf-select, .mrf-textarea { background: #fff; padding: 8px 10px; border-radius: 6px; border: 1px solid #e0e0e0; font-size: 11px; color: #333;
  &.filled { border-color: #43A047; }
}
.mrf-select { display: flex; justify-content: space-between; .arrow { color: #ccc; } }
.mrf-textarea { min-height: 60px; line-height: 1.5; }
.mrf-pills { display: flex; gap: 6px;
  .mrfp { padding: 4px 12px; border-radius: 12px; font-size: 10px; background: #f0f0f0; color: #666; cursor: pointer;
    &.active.danger { background: $danger-100; color: $danger-700; font-weight: 600; }
  }
}
.mrf-photos { .mrfp-label { font-size: 10px; color: #999; margin-bottom: 4px; } }
.mrfp-grid { display: flex; gap: 6px; }
.mrfpg-item { width: 70px; height: 70px; border-radius: 6px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 9px; color: #999;
  &.done { border-color: #43A047; background: #f0fdf4; color: #333; font-weight: 500; }
}

// ==== 监护确认 ====
.mob-guardian { display: flex; flex-direction: column; gap: 8px; }
.mg-header { font-size: 14px; font-weight: 700; color: #2E7D32; margin-bottom: 2px; }
.mg-card { background: #fff; border-radius: 8px; padding: 10px; border: 1px solid #e0e0e0; }
.mgc-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 11px; border-bottom: 1px solid #f5f5f5;
  &:last-child { border: none; }
  span { color: #999; }
  strong { color: #333; }
}
.mg-check { .mgch-title { font-size: 12px; font-weight: 600; color: #333; margin-bottom: 6px; } }
.mgch-item { padding: 7px 8px; border-radius: 6px; cursor: pointer; font-size: 11px; color: #555;
  &.ok { background: #f0fdf4; color: #333; }
  .mgch-chk { margin-right: 6px; }
}

// ==== 右侧注释卡 ====
.app-demo-notes { flex: 1; display: flex; flex-direction: column; gap: $space-base; min-width: 240px; }
.note-card { background: #fff; border-radius: $radius-base; padding: $space-base $space-lg; border: 1px solid $border; border-left: 3px solid #4CAF50;
  h4 { font-size: $font-sm; color: $text-primary; margin-bottom: $space-xs; }
  p { font-size: $font-xs; color: $text-secondary; line-height: 1.5; }
}

// ==== APP功能模块全景 ====
.app-module-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: $space-base; }
.am-card { text-align: center; padding: $space-lg $space-base; border: 1px solid $border; border-radius: $radius-base;
  &:hover { border-color: #43A047; background: #f9fdf9; }
}
.am-icon { font-size: 28px; margin-bottom: $space-sm; }
.am-name { font-size: $font-sm; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
.am-desc { font-size: $font-xs; color: $text-hint; line-height: 1.4; }
</style>
