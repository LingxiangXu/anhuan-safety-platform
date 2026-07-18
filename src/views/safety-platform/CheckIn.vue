<template>
  <div class="app-module-page">
    <div class="page-header">
      <h2>📍 到岗签到</h2>
      <p class="page-subtitle">GPS定位 + 人脸识别确认到岗，自动记录考勤与轨迹</p>
    </div>

    <div class="app-phone-wrap">
      <div class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div class="app-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="app-navbar"><span class="an-title">到岗签到</span></div>
          <div class="app-body">
            <div class="checkin-map">
              <div class="map-sim">
                <div class="map-marker" @click="doCheckIn">
                  <div class="marker-dot"></div>
                  <div class="marker-pulse"></div>
                </div>
                <div class="map-location-badge">
                  <div class="map-loc-icon">📍</div>
                  <div class="map-loc-text">
                    <strong>太原重工铸锻件分公司</strong>
                    <small>清徐县东大街1号</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="checkin-card">
              <div class="cc-avatar">👷</div>
              <div class="cc-info">
                <div class="cc-name">陈文斌</div>
                <div class="cc-dept">安全监督 · 锻造车间</div>
              </div>
              <div class="cc-status" :class="checkedIn?'on':'off'">{{ checkedIn?'🟢 已签到':'⚪ 未签到' }}</div>
            </div>

            <div class="checkin-detail" v-if="checkedIn">
              <div class="cd-row"><span>签到时间</span><span>{{ checkinTime }}</span></div>
              <div class="cd-row"><span>签到位置</span><span>清徐县东大街1号</span></div>
              <div class="cd-row"><span>定位精度</span><span class="green">&lt; 5米 ✓</span></div>
              <div class="cd-row"><span>人脸验证</span><span class="green">已通过 ✓</span></div>
            </div>

            <button class="checkin-btn" :class="{done:checkedIn}" @click="doCheckIn" :disabled="checkedIn">
              {{ checkedIn ? '✅ 今日已签到' : '📍 点击签到' }}
            </button>

            <div class="checkin-history">
              <div class="ch-title">近7天签到记录</div>
              <div class="ch-row" v-for="r in recentRecords" :key="r.date">
                <span>{{ r.date }}</span><span class="ch-time">{{ r.time }}</span><span :class="r.status==='正常'?'green':'red'">{{ r.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="phone-caption">
        <h4>功能说明</h4>
        <ul>
          <li>📍 GPS 自动定位，进入厂区范围内方可签到</li>
          <li>📸 人脸识别验证，防止代签、替签</li>
          <li>📊 自动生成签到轨迹与考勤统计</li>
          <li>🔔 未签到自动提醒，超时告警通知班组长</li>
          <li>📅 支持排班查看与历史签到回溯</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckIn',
  data() {
    return {
      checkedIn: false,
      checkinTime: '',
      recentRecords: [
        { date: '07-16 周四', time: '07:52', status: '正常' },
        { date: '07-15 周三', time: '07:48', status: '正常' },
        { date: '07-14 周二', time: '08:05', status: '迟到' },
        { date: '07-13 周一', time: '07:55', status: '正常' },
        { date: '07-10 周五', time: '07:50', status: '正常' },
        { date: '07-09 周四', time: '08:12', status: '迟到' },
        { date: '07-08 周三', time: '07:45', status: '正常' }
      ]
    };
  },
  methods: {
    doCheckIn() {
      if (this.checkedIn) return;
      const now = new Date();
      this.checkinTime = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0') + ':' + now.getSeconds().toString().padStart(2,'0');
      this.checkedIn = true;
      alert('签到成功！定位：清徐县东大街1号，人脸验证已通过。');
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
.an-title { font-size: 15px; font-weight: 600; }
.app-body { padding: 12px; max-height: 520px; overflow-y: auto; }

.checkin-map { margin-bottom: 12px; }
.map-sim { position: relative; height: 160px; background: linear-gradient(135deg, #d4e6f1, #aed6f1, #85c1e9); border-radius: 12px; overflow: hidden; }
.map-marker { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); cursor: pointer; }
.marker-dot { width: 16px; height: 16px; background: $primary; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
.marker-pulse { position: absolute; top: -8px; left: -8px; width: 32px; height: 32px; border-radius: 50%; background: rgba(0,117,230,0.3); animation: pulse-scale 1.5s infinite; }
.map-location-badge { position: absolute; bottom: 10px; left: 10px; right: 10px; background: rgba(255,255,255,0.95); border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; }
.map-loc-icon { font-size: 20px; }
.map-loc-text strong { display: block; font-size: 13px; }
.map-loc-text small { font-size: 10px; color: $text-hint; }

.checkin-card { display: flex; align-items: center; gap: 10px; padding: 12px; background: #fff; border-radius: 12px; border: 1px solid $border-light; margin-bottom: 10px; }
.cc-avatar { font-size: 36px; }
.cc-name { font-size: 15px; font-weight: 700; }
.cc-dept { font-size: 11px; color: $text-hint; }
.cc-status { margin-left: auto; font-size: 12px; padding: 4px 10px; border-radius: 12px; background: $gray-100; &.on { background: #e6f9eb; } }

.checkin-detail { background: #fff; border-radius: 10px; padding: 12px; margin-bottom: 10px; border: 1px solid $border-light; }
.cd-row { display: flex; justify-content: space-between; font-size: 12px; padding: 6px 0; border-bottom: 1px solid $border-light; color: $text-secondary; }
.cd-row:last-child { border: 0; }
.green { color: $accent-green; font-weight: 500; }

.checkin-btn { width: 100%; padding: 14px; border: 0; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; background: $primary; color: #fff; transition: all 0.2s; margin-bottom: 14px; }
.checkin-btn:active { transform: scale(0.97); }
.checkin-btn.done { background: $accent-green; cursor: default; }
.checkin-btn:disabled { opacity: 0.9; }

.checkin-history { background: #fff; border-radius: 10px; padding: 12px; border: 1px solid $border-light; }
.ch-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.ch-row { display: flex; justify-content: space-between; font-size: 11px; padding: 5px 0; color: $text-secondary; }
.ch-time { color: $text-hint; }
.green { color: $accent-green; }
.red { color: $danger; }

.phone-caption { flex: 1; background: #fff; border-radius: 12px; padding: 20px; border: 1px solid $border; }
.phone-caption h4 { margin: 0 0 12px; font-size: 16px; }
.phone-caption ul { padding-left: 16px; margin: 0; }
.phone-caption li { font-size: 13px; color: $text-secondary; line-height: 2; }
</style>
