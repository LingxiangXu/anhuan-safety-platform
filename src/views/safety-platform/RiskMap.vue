<template>
  <div class="app-module-page">
    <div class="page-header">
      <h2>🗺️ 风险地图</h2>
      <p class="page-subtitle">厂区GIS地图 + 风险四色标注，直观掌握全域安全态势</p>
    </div>

    <div class="app-phone-wrap">
      <div class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div class="app-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="app-navbar"><span class="an-title">风险地图</span></div>
          <div class="app-body" style="padding:0">
            <div class="risk-map-container">
              <div class="rm-map">
                <div class="rm-label">太原重工铸锻件分公司 · 风险四色图</div>
                <!-- 厂区模拟地图 -->
                <svg class="factory-svg" viewBox="0 0 340 420">
                  <rect x="20" y="20" width="300" height="380" rx="8" fill="#eee" stroke="#ccc" stroke-width="1"/>
                  <!-- 主厂房区域 -->
                  <rect x="40" y="40" width="120" height="140" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="2" opacity="0.7"/>
                  <text x="100" y="115" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="600">铸造车间</text>
                  <text x="100" y="130" text-anchor="middle" font-size="9" fill="#dc2626">🔴 重大风险</text>

                  <rect x="180" y="40" width="120" height="120" rx="4" fill="#fff7ed" stroke="#ea580c" stroke-width="2" opacity="0.7"/>
                  <text x="240" y="105" text-anchor="middle" font-size="11" fill="#ea580c" font-weight="600">锻压车间</text>
                  <text x="240" y="120" text-anchor="middle" font-size="9" fill="#ea580c">🟠 较大风险</text>

                  <rect x="40" y="200" width="120" height="100" rx="4" fill="#fefce8" stroke="#ca8a04" stroke-width="2" opacity="0.7"/>
                  <text x="100" y="255" text-anchor="middle" font-size="11" fill="#ca8a04" font-weight="600">热处理车间</text>
                  <text x="100" y="270" text-anchor="middle" font-size="9" fill="#ca8a04">🟡 一般风险</text>

                  <rect x="180" y="180" width="120" height="120" rx="4" fill="#E8F4FD" stroke="#0075E6" stroke-width="2" opacity="0.7"/>
                  <text x="240" y="245" text-anchor="middle" font-size="11" fill="#0075E6" font-weight="600">装配成品区</text>
                  <text x="240" y="260" text-anchor="middle" font-size="9" fill="#0075E6">🔵 低风险</text>

                  <!-- 危化品库 -->
                  <rect x="40" y="325" width="70" height="50" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="2" opacity="0.8"/>
                  <text x="75" y="348" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="600">危化品库</text>
                  <text x="75" y="362" text-anchor="middle" font-size="8" fill="#dc2626">🔴重大</text>

                  <!-- 气瓶库 -->
                  <rect x="130" y="325" width="70" height="50" rx="4" fill="#fff7ed" stroke="#ea580c" stroke-width="2" opacity="0.8"/>
                  <text x="165" y="348" text-anchor="middle" font-size="9" fill="#ea580c" font-weight="600">气瓶库</text>
                  <text x="165" y="362" text-anchor="middle" font-size="8" fill="#ea580c">🟠较大</text>

                  <rect x="220" y="325" width="80" height="50" rx="4" fill="#f0fdf4" stroke="#00AA1C" stroke-width="2" opacity="0.7"/>
                  <text x="260" y="355" text-anchor="middle" font-size="9" fill="#00AA1C" font-weight="600">办公区</text>
                </svg>
              </div>

              <div class="rm-legend">
                <div class="rmlg-item"><span class="rmlg-dot red"></span> 重大风险 (2处)</div>
                <div class="rmlg-item"><span class="rmlg-dot orange"></span> 较大风险 (2处)</div>
                <div class="rmlg-item"><span class="rmlg-dot yellow"></span> 一般风险 (1处)</div>
                <div class="rmlg-item"><span class="rmlg-dot blue"></span> 低风险 (1处)</div>
              </div>
            </div>

            <div style="padding:12px">
              <div class="rm-stats">
                <div class="rms-card red">
                  <div class="rms-val">2</div><div class="rms-label">重大风险点</div>
                </div>
                <div class="rms-card orange">
                  <div class="rms-val">2</div><div class="rms-label">较大风险点</div>
                </div>
                <div class="rms-card yellow">
                  <div class="rms-val">1</div><div class="rms-label">一般风险点</div>
                </div>
                <div class="rms-card blue">
                  <div class="rms-val">1</div><div class="rms-label">低风险点</div>
                </div>
              </div>

              <div class="rm-nearby">
                <div class="rmn-title">📍 当前位置附近风险提示</div>
                <div class="rmn-item warn">⚠️ 您距「危化品库」(重大风险) 约80米，请勿吸烟或携带火种</div>
                <div class="rmn-item info">ℹ️ 当前区域：装配成品区（低风险），可正常作业</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="phone-caption">
        <h4>功能说明</h4>
        <ul>
          <li>🗺️ 厂区GIS地图，基于真实坐标逐区域渲染</li>
          <li>🎨 风险四色标注：红(重大)/橙(较大)/黄(一般)/蓝(低)</li>
          <li>📍 GPS实时定位，显示当前位置及周边风险</li>
          <li>🔔 进入高风险区域自动推送安全提示</li>
          <li>📊 风险统计面板，一目了然全域风险分布</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RiskMap',
  data() { return {}; }
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
.app-body { max-height: 520px; overflow-y: auto; }

.risk-map-container { border-bottom: 1px solid $border; }
.rm-map { position: relative; padding: 10px; }
.rm-label { font-size: 11px; font-weight: 600; text-align: center; margin-bottom: 8px; color: $text-secondary; }
.factory-svg { width: 100%; height: auto; }

.rm-legend { display: flex; flex-wrap: wrap; gap: 8px; padding: 8px 12px; background: $gray-50; }
.rmlg-item { font-size: 10px; display: flex; align-items: center; gap: 4px; color: $text-secondary; }
.rmlg-dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
.rmlg-dot.red { background: $danger-600; } .rmlg-dot.orange { background: #ea580c; }
.rmlg-dot.yellow { background: #ca8a04; } .rmlg-dot.blue { background: $primary; }

.rm-stats { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px; margin-bottom: 10px; }
.rms-card { text-align: center; padding: 8px 4px; border-radius: 8px; }
.rms-card.red { background: $danger-100; } .rms-card.orange { background: #fff7ed; }
.rms-card.yellow { background: #fefce8; } .rms-card.blue { background: #E8F4FD; }
.rms-val { font-size: 18px; font-weight: 700; }
.rms-card.red .rms-val { color: $danger-600; } .rms-card.orange .rms-val { color: #ea580c; }
.rms-card.yellow .rms-val { color: #ca8a04; } .rms-card.blue .rms-val { color: $primary; }
.rms-label { font-size: 9px; color: $text-hint; }

.rm-nearby { margin-top: 8px; }
.rmn-title { font-size: 12px; font-weight: 600; margin-bottom: 6px; }
.rmn-item { font-size: 11px; padding: 8px; border-radius: 8px; margin-bottom: 4px; }
.rmn-item.warn { background: #fffbeb; color: #92400e; }
.rmn-item.info { background: #E8F4FD; color: $primary; }

.phone-caption { flex: 1; background: #fff; border-radius: 12px; padding: 20px; border: 1px solid $border; }
.phone-caption h4 { margin: 0 0 12px; font-size: 16px; }
.phone-caption ul { padding-left: 16px; margin: 0; }
.phone-caption li { font-size: 13px; color: $text-secondary; line-height: 2; }
</style>
