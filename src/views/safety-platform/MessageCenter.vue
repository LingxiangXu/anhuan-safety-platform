<template>
  <div class="app-module-page">
    <div class="page-header">
      <h2>🔔 消息中心</h2>
      <p class="page-subtitle">系统通知、预警推送、待办提醒统一入口，不遗漏任何安全提示</p>
    </div>

    <div class="app-phone-wrap">
      <div class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div class="app-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="app-navbar"><span class="an-title">消息中心</span><span class="an-badge">5</span></div>
          <div class="app-body">
            <div class="msg-tabs">
              <span :class="{active:msgTab==='all'}" @click="msgTab='all'">全部</span>
              <span :class="{active:msgTab==='alert'}" @click="msgTab='alert'">预警</span>
              <span :class="{active:msgTab==='todo'}" @click="msgTab='todo'">待办</span>
              <span :class="{active:msgTab==='notice'}" @click="msgTab='notice'">通知</span>
            </div>

            <div class="msg-list">
              <div class="msg-item" v-for="m in filteredMessages" :key="m.id" :class="m.type" @click="openMsg(m)">
                <div class="msg-icon">{{ typeIcons[m.type] }}</div>
                <div class="msg-body">
                  <div class="msg-title">{{ m.title }}<span class="msg-new" v-if="!m.read">NEW</span></div>
                  <div class="msg-desc">{{ m.desc }}</div>
                  <div class="msg-time">{{ m.time }}</div>
                </div>
                <div class="msg-arrow">›</div>
              </div>
            </div>

            <div class="empty-state" v-if="!filteredMessages.length">
              <div class="empty-icon">📭</div>
              <div>暂无消息</div>
            </div>
          </div>
        </div>
      </div>
      <div class="phone-caption">
        <h4>功能说明</h4>
        <ul>
          <li>🔔 预警推送：风险超限、报警触发实时推送到APP</li>
          <li>📋 待办提醒：过期未处理隐患/作业票/培训等自动催办</li>
          <li>📢 系统通知：政策法规更新、停复工通知、会议提醒</li>
          <li>🔍 分类筛选：按预警/待办/通知分类查看</li>
          <li>📊 已读状态跟踪，未读消息红点提醒</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageCenter',
  data() {
    return {
      msgTab: 'all',
      typeIcons: { alert: '🚨', todo: '📋', notice: '📢', info: 'ℹ️' },
      messages: [
        { id: 1, type: 'alert', title: 'OA审批超时预警', desc: '特种作业票（编号 ZYP-2026-0042）审批超48小时未处理', time: '今天 09:15', read: false },
        { id: 2, type: 'todo', title: '隐患复查待办', desc: '锻压车间吊索具磨损隐患已整改待复查', time: '今天 08:30', read: false },
        { id: 3, type: 'alert', title: '特殊作业超时提醒', desc: '厂房屋面通风器高处作业已超计划时间', time: '昨天 17:40', read: false },
        { id: 4, type: 'todo', title: '监护确认待办', desc: '临时用电作业等待监护人现场确认', time: '昨天 16:20', read: false },
        { id: 5, type: 'notice', title: '安全培训通知', desc: '7月18日14:00开展有限空间作业专项培训', time: '昨天 15:00', read: false },
        { id: 6, type: 'notice', title: '安全会议通知', desc: '7月第三周安全例会定于本周五10:00', time: '07-15 周一', read: true },
        { id: 7, type: 'info', title: '法规更新提醒', desc: '《工贸企业重大事故隐患判定标准》新版发布', time: '07-14 周日', read: true },
        { id: 8, type: 'alert', title: '人员资质预警', desc: '张明电焊工证将于7月20日到期，需及时复审', time: '07-13 周六', read: true }
      ]
    };
  },
  computed: {
    filteredMessages() {
      return this.msgTab === 'all' ? this.messages : this.messages.filter(m => m.type === this.msgTab);
    }
  },
  methods: {
    openMsg(m) { m.read = true; alert('详情页: ' + m.title + '\n\n' + m.desc); }
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
.app-navbar { padding: 8px 16px; background: $primary; color: #fff; display: flex; justify-content: space-between; align-items: center; }
.an-title { font-size: 15px; font-weight: 600; }
.an-badge { background: $danger; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 10px; }
.app-body { padding: 12px; max-height: 520px; overflow-y: auto; }

.msg-tabs { display: flex; gap: 0; margin-bottom: 10px; border-radius: 8px; overflow: hidden; border: 1px solid $border; }
.msg-tabs span { flex: 1; text-align: center; padding: 7px; font-size: 12px; cursor: pointer; background: #fff; color: $text-secondary; transition: all 0.2s; }
.msg-tabs span.active { background: $primary; color: #fff; font-weight: 600; }

.msg-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px; background: #fff; border-radius: 10px; border: 1px solid $border-light; margin-bottom: 6px; cursor: pointer; transition: all 0.2s; }
.msg-item:hover { border-color: $primary; }
.msg-item.alert { border-left: 3px solid $danger; }
.msg-item.todo { border-left: 3px solid $warning; }
.msg-item.notice { border-left: 3px solid $primary; }
.msg-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
.msg-body { flex: 1; min-width: 0; }
.msg-title { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
.msg-new { display: inline-block; font-size: 9px; padding: 1px 5px; background: $danger; color: #fff; border-radius: 3px; margin-left: 6px; vertical-align: middle; }
.msg-desc { font-size: 11px; color: $text-hint; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 3px; }
.msg-time { font-size: 10px; color: $text-hint; }
.msg-arrow { font-size: 18px; color: $text-hint; flex-shrink: 0; }

.phone-caption { flex: 1; background: #fff; border-radius: 12px; padding: 20px; border: 1px solid $border; }
.phone-caption h4 { margin: 0 0 12px; font-size: 16px; }
.phone-caption ul { padding-left: 16px; margin: 0; }
.phone-caption li { font-size: 13px; color: $text-secondary; line-height: 2; }
.empty-state { text-align: center; padding: 40px 0; color: $text-hint; }
.empty-icon { font-size: 36px; margin-bottom: 8px; }
</style>
