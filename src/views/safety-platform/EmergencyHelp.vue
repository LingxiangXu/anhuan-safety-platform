<template>
  <div class="app-module-page">
    <div class="page-header">
      <h2>🆘 应急求助</h2>
      <p class="page-subtitle">一键SOS报警，自动上传GPS位置，同步通知周边人员与应急中心</p>
    </div>

    <div class="app-phone-wrap">
      <div class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div class="app-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="app-navbar emergency"><span class="an-title">🆘 应急求助</span></div>
          <div class="app-body">
            <div v-if="!sosSent">
              <div class="sos-hero" @click="triggerSOS">
                <div class="sos-ring-outer">
                  <div class="sos-ring-inner">
                    <div class="sos-btn">SOS</div>
                  </div>
                </div>
                <div class="sos-hint">长按 3 秒或点击触发紧急求助</div>
              </div>

              <div class="emergency-types">
                <div class="et-title">选择求助类型</div>
                <div class="et-grid">
                  <div class="et-item" v-for="t in emergencyTypes" :key="t.key" @click="selectType(t.key)" :class="{selected:selectedType===t.key}">
                    <div class="et-icon">{{ t.icon }}</div>
                    <div class="et-label">{{ t.label }}</div>
                  </div>
                </div>
              </div>

              <div class="emergency-desc">
                <textarea v-model="desc" placeholder="补充描述现场情况（可选）..."></textarea>
              </div>
            </div>

            <div v-else class="sos-sent">
              <div class="sent-icon">📡</div>
              <div class="sent-title">求助信号已发出！</div>
              <div class="sent-info">
                <div class="si-row"><span>求助类型</span><span>{{ typeLabels[selectedType] }}</span></div>
                <div class="si-row"><span>发送时间</span><span>{{ sentTime }}</span></div>
                <div class="si-row"><span>GPS位置</span><span>清徐县东大街1号·锻压车间B区</span></div>
                <div class="si-row"><span>通知范围</span><span>周边8人·安环中心</span></div>
              </div>
              <div class="sent-respondents">
                <div class="sr-title">响应人员（3人已确认）</div>
                <div class="sr-list">
                  <div class="sr-item" v-for="r in respondents" :key="r.name">
                    <span class="sr-avatar">{{ r.avatar }}</span>
                    <span>{{ r.name }}</span>
                    <span class="sr-dist">{{ r.distance }}</span>
                    <span class="sr-eta">{{ r.eta }}</span>
                  </div>
                </div>
              </div>
              <button class="cancel-sos-btn" @click="cancelSOS">❌ 取消求助（误触）</button>
            </div>

            <div class="emergency-guide">
              <div class="eg-title">📖 应急指引</div>
              <div class="eg-card" v-for="g in guides" :key="g.title">
                <div class="eg-card-icon">{{ g.icon }}</div>
                <div class="eg-card-content">
                  <strong>{{ g.title }}</strong>
                  <span>{{ g.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="phone-caption">
        <h4>功能说明</h4>
        <ul>
          <li>🆘 一键SOS：长按或点击紧急按钮，立即触发求助</li>
          <li>📍 自动上传GPS位置，无需手动描述地址</li>
          <li>📢 同步通知：自动推送给周边同事 + 安环中心 + 应急值班</li>
          <li>🗺️ 响应追踪：地图上实时显示响应人员位置与到达时间</li>
          <li>📞 误触可取消：30秒内可取消误触发</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmergencyHelp',
  data() {
    return {
      sosSent: false,
      selectedType: 'injury',
      desc: '',
      sentTime: '',
      emergencyTypes: [
        { key: 'injury', icon: '🤕', label: '人员受伤' },
        { key: 'fire', icon: '🔥', label: '火灾险情' },
        { key: 'leak', icon: '☠️', label: '危化品泄漏' },
        { key: 'collapse', icon: '🏚️', label: '坍塌/坠落' },
        { key: 'electric', icon: '⚡', label: '触电事故' },
        { key: 'other', icon: '❗', label: '其他紧急' }
      ],
      typeLabels: { injury: '人员受伤', fire: '火灾险情', leak: '危化品泄漏', collapse: '坍塌/坠落', electric: '触电事故', other: '其他紧急' },
      respondents: [
        { name: '李明辉', avatar: '👨‍💼', distance: '35m', eta: '约30秒' },
        { name: '王建国', avatar: '👷', distance: '80m', eta: '约1分钟' },
        { name: '赵小刚', avatar: '👨‍🔧', distance: '120m', eta: '约2分钟' }
      ],
      guides: [
        { icon: '🤕', title: '人员受伤', desc: '立即拨打120，不要移动伤员，保持呼吸道通畅' },
        { icon: '🔥', title: '火灾应急', desc: '立即报警119，使用灭火器初期扑救，沿安全通道撤离' },
        { icon: '☠️', title: '危化品泄漏', desc: '立即撤离上风向，佩戴防毒面具，封锁泄漏区域' }
      ]
    };
  },
  methods: {
    selectType(key) { this.selectedType = key; },
    triggerSOS() {
      const now = new Date();
      this.sentTime = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0') + ':' + now.getSeconds().toString().padStart(2,'0');
      this.sosSent = true;
    },
    cancelSOS() {
      if (confirm('确认取消本次求助？')) { this.sosSent = false; }
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
.app-navbar { padding: 8px 16px; color: #fff; background: $primary; &.emergency { background: $danger; } }
.an-title { font-size: 15px; font-weight: 600; }
.app-body { padding: 12px; max-height: 520px; overflow-y: auto; }

.sos-hero { text-align: center; padding: 20px 0; cursor: pointer; }
.sos-ring-outer { width: 120px; height: 120px; border-radius: 50%; background: rgba(220,38,38,0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; animation: pulse-glow 2s infinite; }
.sos-ring-inner { width: 90px; height: 90px; border-radius: 50%; background: rgba(220,38,38,0.2); display: flex; align-items: center; justify-content: center; }
.sos-btn { width: 70px; height: 70px; border-radius: 50%; background: $danger; color: #fff; font-size: 22px; font-weight: 900; display: flex; align-items: center; justify-content: center; letter-spacing: 1px; box-shadow: 0 4px 20px rgba(220,38,38,0.5); }
.sos-hint { font-size: 11px; color: $text-hint; margin-top: 8px; }

.emergency-types { margin-top: 14px; }
.et-title { font-size: 12px; font-weight: 600; margin-bottom: 8px; }
.et-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
.et-item { padding: 10px 6px; text-align: center; border-radius: 8px; border: 1px solid $border; cursor: pointer; transition: all 0.2s; }
.et-item.selected { border-color: $danger; background: $danger-100; }
.et-icon { font-size: 22px; margin-bottom: 4px; }
.et-label { font-size: 10px; color: $text-secondary; }

.emergency-desc textarea { width: 100%; height: 50px; border: 1px solid $border; border-radius: 8px; padding: 8px; font-size: 12px; margin-top: 10px; resize: none; }

.sos-sent { text-align: center; }
.sent-icon { font-size: 48px; margin-bottom: 8px; }
.sent-title { font-size: 17px; font-weight: 700; color: $danger; margin-bottom: 12px; }
.sent-info { background: $danger-100; border-radius: 10px; padding: 12px; margin-bottom: 12px; }
.si-row { display: flex; justify-content: space-between; font-size: 12px; padding: 5px 0; color: $text-secondary; border-bottom: 1px solid #fee2e2; }
.si-row:last-child { border: 0; }
.sent-respondents { background: #fff; border-radius: 10px; padding: 12px; margin-bottom: 10px; border: 1px solid $border-light; }
.sr-title { font-size: 12px; font-weight: 600; margin-bottom: 8px; }
.sr-item { display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 6px 0; color: $text-secondary; }
.sr-avatar { font-size: 20px; }
.sr-dist { margin-left: auto; color: $text-hint; font-size: 10px; }
.sr-eta { color: $accent-green; font-size: 10px; }
.cancel-sos-btn { width: 100%; padding: 10px; border: 1px solid $border; border-radius: 10px; background: #fff; font-size: 13px; color: $text-hint; cursor: pointer; margin-bottom: 10px; }

.emergency-guide { margin-top: 14px; }
.eg-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.eg-card { display: flex; gap: 10px; padding: 10px; background: #fff; border-radius: 8px; border: 1px solid $border-light; margin-bottom: 6px; align-items: center; }
.eg-card-icon { font-size: 24px; }
.eg-card-content strong { display: block; font-size: 12px; }
.eg-card-content span { font-size: 10px; color: $text-hint; }

.phone-caption { flex: 1; background: #fff; border-radius: 12px; padding: 20px; border: 1px solid $border; }
.phone-caption h4 { margin: 0 0 12px; font-size: 16px; }
.phone-caption ul { padding-left: 16px; margin: 0; }
.phone-caption li { font-size: 13px; color: $text-secondary; line-height: 2; }
</style>
