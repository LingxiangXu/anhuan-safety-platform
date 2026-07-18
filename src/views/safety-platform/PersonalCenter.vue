<template>
  <div class="app-module-page">
    <div class="page-header">
      <h2>👤 个人中心</h2>
      <p class="page-subtitle">员工信息、资质证书、培训记录、安全绩效与设置管理</p>
    </div>

    <div class="app-phone-wrap">
      <div class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div class="app-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="app-navbar"><span class="an-title">个人中心</span></div>
          <div class="app-body">
            <div class="pc-profile">
              <div class="pc-avatar">👷</div>
              <div class="pc-info">
                <div class="pc-name">陈文斌</div>
                <div class="pc-role">安全监督 · 太原重工铸锻件分公司</div>
                <div class="pc-id">工号: ZD-2021-0037</div>
              </div>
              <div class="pc-qr">⬜</div>
            </div>

            <div class="pc-menu">
              <div class="pcm-item" @click="showPanel='cert'">
                <span class="pcm-icon">📜</span><span>我的资质证书</span>
                <span class="pcm-count" :class="{warn:expiringCount}">{{ certs.length }}本<span v-if="expiringCount" style="color:#dc2626"> ({{ expiringCount }}即将到期)</span></span>
                <span class="pcm-arrow">›</span>
              </div>
              <div class="pcm-item" @click="showPanel='training'">
                <span class="pcm-icon">📖</span><span>培训记录</span>
                <span class="pcm-count">{{ trainingRecords.length }}次</span>
                <span class="pcm-arrow">›</span>
              </div>
              <div class="pcm-item" @click="showPanel='score'">
                <span class="pcm-icon">🏆</span><span>安全积分</span>
                <span class="pcm-count score">860 分</span>
                <span class="pcm-arrow">›</span>
              </div>
              <div class="pcm-item" @click="showPanel='checkin'">
                <span class="pcm-icon">📊</span><span>出勤统计</span>
                <span class="pcm-count">本月全勤</span>
                <span class="pcm-arrow">›</span>
              </div>
            </div>

            <!-- 证书面板 -->
            <div class="pc-panel" v-if="showPanel==='cert'">
              <div class="pcp-back" @click="showPanel=null">&lsaquo; 返回</div>
              <div class="pcp-title">资质证书</div>
              <div class="cert-card" v-for="c in certs" :key="c.id" :class="{expiring:c.expiring}">
                <div class="cc-hd">
                  <span class="cc-icon">🏅</span>
                  <span class="cc-name">{{ c.name }}</span>
                  <span class="cc-badge" :class="c.expiring?'expiring':'valid'">{{ c.expiring?'即将到期':'有效' }}</span>
                </div>
                <div class="cc-meta">发证日期: {{ c.issueDate }} · 有效期至: {{ c.expiryDate }}</div>
              </div>
            </div>

            <!-- 培训记录面板 -->
            <div class="pc-panel" v-if="showPanel==='training'">
              <div class="pcp-back" @click="showPanel=null">&lsaquo; 返回</div>
              <div class="pcp-title">培训记录</div>
              <div class="train-item" v-for="t in trainingRecords" :key="t.id">
                <div class="train-date">{{ t.date }}</div>
                <div class="train-title">{{ t.name }}</div>
                <div class="train-status" :class="t.passed?'pass':'fail'">{{ t.passed?'✅ 已通过':'❌ 未通过' }}</div>
              </div>
            </div>

            <!-- 安全积分面板 -->
            <div class="pc-panel" v-if="showPanel==='score'">
              <div class="pcp-back" @click="showPanel=null">&lsaquo; 返回</div>
              <div class="pcp-title">安全积分</div>
              <div class="score-hero">
                <div class="score-big">860</div>
                <div class="score-rank">🏆 分公司排名第 3 位</div>
              </div>
              <div class="score-records">
                <div class="sr-row" v-for="r in scoreRecords" :key="r.id">
                  <span>{{ r.date }}</span><span>{{ r.reason }}</span><span :class="r.change>0?'plus':'minus'">{{ r.change>0?'+'+r.change:r.change }}</span>
                </div>
              </div>
            </div>

            <!-- 出勤统计面板 -->
            <div class="pc-panel" v-if="showPanel==='checkin'">
              <div class="pcp-back" @click="showPanel=null">&lsaquo; 返回</div>
              <div class="pcp-title">本月出勤</div>
              <div class="attend-grid">
                <div class="ag-day" v-for="d in 22" :key="d" :class="d<=new Date().getDate()?'present':'future'">
                  <span>{{ d }}</span><span class="ag-dot">●</span>
                </div>
              </div>
              <div class="attend-summary">
                <div class="as-item"><span class="as-val green">{{ new Date().getDate() }}</span><span class="as-label">正常出勤</span></div>
                <div class="as-item"><span class="as-val orange">1</span><span class="as-label">迟到</span></div>
                <div class="as-item"><span class="as-val">0</span><span class="as-label">缺勤</span></div>
              </div>
            </div>

            <div class="pc-settings">
              <div class="pcs-title">设置</div>
              <div class="pcs-item">🔔 消息通知<span class="pcs-toggle on">ON</span></div>
              <div class="pcs-item">📍 位置权限<span class="pcs-toggle on">ON</span></div>
              <div class="pcs-item">📸 相机权限<span class="pcs-toggle on">ON</span></div>
              <div class="pcs-item">🔒 修改密码<span class="pcs-arrow">›</span></div>
              <div class="pcs-item">🚪 退出登录<span class="pcs-arrow">›</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="phone-caption">
        <h4>功能说明</h4>
        <ul>
          <li>👤 个人基本信息、工号、所属部门展示</li>
          <li>📜 资质证书管理：列表查看、到期提醒、在线续证申请</li>
          <li>📖 培训记录：历史培训课程列表及通过状态</li>
          <li>🏆 安全积分：累积安全行为得分、排名展示、积分明细</li>
          <li>📊 出勤统计：日历视图展示每月签到记录</li>
          <li>⚙️ 设置中心：消息/位置/相机权限管理、密码修改</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalCenter',
  data() {
    return {
      showPanel: null,
      certs: [
        { id: 1, name: '注册安全工程师', issueDate: '2020-03-15', expiryDate: '2026-03-14', expiring: false },
        { id: 2, name: '特种设备安全管理A证', issueDate: '2021-06-01', expiryDate: '2026-05-31', expiring: false },
        { id: 3, name: '电工作业操作证', issueDate: '2019-08-20', expiryDate: '2026-08-19', expiring: true }
      ],
      trainingRecords: [
        { id: 1, date: '2026-07-10', name: '有限空间作业安全培训', passed: true },
        { id: 2, date: '2026-06-15', name: '消防安全知识培训', passed: true },
        { id: 3, date: '2026-05-20', name: '危险化学品管理培训', passed: true },
        { id: 4, date: '2026-04-08', name: '高处作业安全规程', passed: false }
      ],
      scoreRecords: [
        { id: 1, date: '07-16', reason: '完成每日巡检', change: 10 },
        { id: 2, date: '07-15', reason: '发现并上报隐患', change: 30 },
        { id: 3, date: '07-14', reason: '参加安全培训', change: 20 },
        { id: 4, date: '07-13', reason: '监护作业确认', change: 15 }
      ]
    };
  },
  computed: {
    expiringCount() { return this.certs.filter(c => c.expiring).length; }
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
.an-title { font-size: 15px; font-weight: 600; }
.app-body { padding: 12px; max-height: 520px; overflow-y: auto; }

.pc-profile { display: flex; align-items: center; gap: 12px; padding: 14px; background: linear-gradient(135deg, $primary, $brand-600); border-radius: 14px; color: #fff; margin-bottom: 14px; }
.pc-avatar { font-size: 44px; }
.pc-name { font-size: 17px; font-weight: 700; }
.pc-role { font-size: 11px; opacity: 0.85; }
.pc-id { font-size: 10px; opacity: 0.7; margin-top: 2px; }
.pc-qr { margin-left: auto; font-size: 36px; opacity: 0.5; }

.pc-menu { background: #fff; border-radius: 12px; border: 1px solid $border-light; overflow: hidden; margin-bottom: 14px; }
.pcm-item { display: flex; align-items: center; gap: 10px; padding: 14px 12px; cursor: pointer; border-bottom: 1px solid $border-light; font-size: 13px; transition: background 0.2s; }
.pcm-item:last-child { border: 0; }
.pcm-item:hover { background: $gray-50; }
.pcm-icon { font-size: 20px; }
.pcm-count { margin-left: auto; font-size: 11px; color: $text-hint; }
.pcm-count.score { color: $warning; font-weight: 600; }
.pcm-arrow { font-size: 18px; color: $text-hint; }

.pc-panel { margin-bottom: 14px; }
.pcp-back { font-size: 13px; color: $primary; cursor: pointer; margin-bottom: 8px; }
.pcp-title { font-size: 15px; font-weight: 700; margin-bottom: 10px; }

.cert-card { background: #fff; border: 1px solid $border-light; border-radius: 10px; padding: 10px; margin-bottom: 6px; }
.cert-card.expiring { border-color: $warning; background: #fffbeb; }
.cc-hd { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.cc-icon { font-size: 20px; }
.cc-name { font-size: 13px; font-weight: 600; }
.cc-badge { font-size: 10px; padding: 2px 8px; border-radius: 10px; margin-left: auto; }
.cc-badge.valid { background: #e6f9eb; color: $accent-green; }
.cc-badge.expiring { background: #fef3c7; color: $warning-600; }
.cc-meta { font-size: 10px; color: $text-hint; }

.train-item { display: flex; align-items: center; gap: 10px; padding: 10px; background: #fff; border-radius: 8px; border: 1px solid $border-light; margin-bottom: 4px; }
.train-date { font-size: 10px; color: $text-hint; width: 65px; }
.train-title { flex: 1; font-size: 12px; }
.train-status { font-size: 10px; }
.train-status.pass { color: $accent-green; } .train-status.fail { color: $danger; }

.score-hero { text-align: center; padding: 16px; background: linear-gradient(135deg, #fffbeb, #fef3c7); border-radius: 12px; margin-bottom: 10px; }
.score-big { font-size: 42px; font-weight: 800; color: $warning; }
.score-rank { font-size: 12px; color: $text-secondary; margin-top: 4px; }
.score-records { background: #fff; border-radius: 10px; border: 1px solid $border-light; }
.sr-row { display: flex; justify-content: space-between; padding: 8px 12px; font-size: 11px; border-bottom: 1px solid $border-light; color: $text-secondary; }
.sr-row:last-child { border: 0; }
.plus { color: $accent-green; font-weight: 600; } .minus { color: $danger; font-weight: 600; }

.attend-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 10px; }
.ag-day { text-align: center; padding: 6px 2px; border-radius: 6px; font-size: 11px; }
.ag-day.present { background: #e6f9eb; color: $accent-green; }
.ag-day.future { background: $gray-50; color: $text-hint; }
.ag-dot { display: block; font-size: 8px; }
.attend-summary { display: flex; gap: 8px; }
.as-item { flex: 1; text-align: center; padding: 10px; background: #fff; border-radius: 8px; border: 1px solid $border-light; }
.as-val { display: block; font-size: 22px; font-weight: 700; }
.as-val.green { color: $accent-green; } .as-val.orange { color: $warning; }
.as-label { font-size: 10px; color: $text-hint; }

.pc-settings { background: #fff; border-radius: 12px; border: 1px solid $border-light; overflow: hidden; }
.pcs-title { font-size: 13px; font-weight: 600; padding: 10px 12px; border-bottom: 1px solid $border-light; color: $text-hint; }
.pcs-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; font-size: 13px; border-bottom: 1px solid $border-light; }
.pcs-item:last-child { border: 0; }
.pcs-toggle { font-size: 10px; padding: 2px 10px; border-radius: 10px; }
.pcs-toggle.on { background: $accent-green; color: #fff; }
.pcs-arrow { font-size: 16px; color: $text-hint; }

.phone-caption { flex: 1; background: #fff; border-radius: 12px; padding: 20px; border: 1px solid $border; }
.phone-caption h4 { margin: 0 0 12px; font-size: 16px; }
.phone-caption ul { padding-left: 16px; margin: 0; }
.phone-caption li { font-size: 13px; color: $text-secondary; line-height: 2; }
</style>
