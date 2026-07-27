<template>
  <div class="real-map-container" :style="{ height: height || '420px' }">
    <div ref="mapContainer" class="map-canvas"></div>

    <!-- 覆盖层：图例 -->
    <div class="map-legend" v-if="showLegend !== false">
      <div class="legend-item"><span class="legend-dot" style="background:#ef4444"></span> 重大</div>
      <div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span> 较大</div>
      <div class="legend-item"><span class="legend-dot" style="background:#eab308"></span> 一般</div>
      <div class="legend-item"><span class="legend-dot" style="background:#3b82f6"></span> 低</div>
    </div>

    <!-- 覆盖层：底部统计条 -->
    <div class="map-stats" v-if="filters !== false">
      <div class="stat-item" @click="setFilter('all')" :class="{ active: activeFilter === 'all' }">
        <span class="stat-num">{{ polygons.length }}</span><span class="stat-label">风险区域</span>
      </div>
      <div class="stat-item" @click="setFilter('重大')" :class="{ active: activeFilter === '重大' }">
        <span class="stat-num stat-red">{{ criticalCount }}</span><span class="stat-label">重大</span>
      </div>
      <div class="stat-item" @click="setFilter('danger')" :class="{ active: activeFilter === 'danger' }">
        <span class="stat-num stat-orange">{{ dangerCount }}</span><span class="stat-label">较大</span>
      </div>
    </div>

    <!-- 覆盖层：信息面板 -->
    <div class="map-infobox" v-if="activeInfo" @click="clearInfo">
      <div class="infobox-header">
        <strong>{{ activeInfo.name }}</strong>
        <span class="infobox-level" :style="{ background: activeInfo.color || '#666' }">{{ activeInfo.level || activeInfo.riskLevel || '-' }}</span>
      </div>
      <div class="infobox-body">
        <div v-if="activeInfo.desc" class="infobox-row">{{ activeInfo.desc }}</div>
        <div v-if="activeInfo.monitoring" class="infobox-row">
          <span v-for="p in activeInfo.monitoring.params" :key="p.name" class="monitor-tag" :class="p.status">
            {{ p.name.replace(/（.*）/, '') }}: {{ p.current }}{{ p.unit }}
          </span>
        </div>
        <div class="infobox-row text-xs comp-row" v-if="activeInfo.composition && activeInfo.composition.length">
          风险构成：<span v-for="c in activeInfo.composition" :key="c.level" class="comp-tag" :style="{ background: levelColor(c.level) }">{{ c.level }}×{{ c.count }}</span>
        </div>
        <div class="infobox-row text-xs risk-list" v-if="activeInfo.risks && activeInfo.risks.length">
          <div v-for="r in activeInfo.risks" :key="r.id" class="risk-item" @click.stop="$emit('risk-click', r)">
            <span class="risk-dot" :style="{ background: levelColor(r.level) }"></span>
            <b>{{ r.level }}</b> · {{ r.category }} · 责任人 {{ r.responsibleName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { factoryZones, riskPoints, FACTORY_CENTER, PARK_BOUNDARY } from '@/store/safeData';

// 风险等级 → 填充色映射（深色底图下用饱和色，形成"发光色块"质感）
const LEVEL_COLORS = { '重大': '#ef4444', '较大': '#f59e0b', '一般': '#eab308', '低': '#3b82f6' };
const LEVEL_STROKES = { '重大': '#ef4444', '较大': '#f59e0b', '一般': '#eab308', '低': '#3b82f6' };
const MARKER_COLORS = { '重大': '#ef4444', '较大': '#f59e0b', '一般': '#eab308', '低': '#3b82f6' };
// 风险等级排序：用于取"区内最高风险等级"（双重预防机制：区域等级=下属风险点最大值）
const LEVEL_ORDER = { '低': 1, '一般': 2, '较大': 3, '重大': 4 };
function maxLevel(levels) {
  let best = null;
  (levels || []).forEach(l => { if (LEVEL_ORDER[l] && (!best || LEVEL_ORDER[l] > LEVEL_ORDER[best])) best = l; });
  return best;
}

export default {
  name: 'RealMap',
  props: {
    height: String,
    showLegend: { type: Boolean, default: true },
    filters: { type: Boolean, default: true },
    zones: { type: Array, default: () => [] },
    markers: { type: Array, default: () => [] },
    workPermits: { type: Array, default: () => [] },
    center: { type: Object, default: () => ({ lng: 112.51, lat: 37.58 }) },
    zoom: { type: Number, default: 18 },
    fitView: { type: Boolean, default: true },
    clickable: { type: Boolean, default: true },
    showLabels: { type: Boolean, default: false }
  },
  data() {
    return {
      map: null,
      polygons: [],
      markerList: [],
      activeFilter: 'all',
      activeInfo: null,
      pinned: false,
      loaded: false
    };
  },
  computed: {
    zoneData() { return this.zones.length ? this.zones : factoryZones; },
    markerData() { return this.markers.length ? this.markers : riskPoints; },
    // 区域风险等级 = 区内所有风险点的"最高等级"（取最大值）；无风险点的区域回退到手填值
    enrichedZones() {
      return this.zoneData.map(z => {
        const pts = this.markerData.filter(r => r.zoneId === z.id);
        const derived = maxLevel(pts.map(p => p.level));
        const level = derived || z.riskLevel || '低';
        const composition = { '重大': 0, '较大': 0, '一般': 0, '低': 0 };
        pts.forEach(p => { if (composition[p.level] !== undefined) composition[p.level]++; });
        return Object.assign({}, z, { effectiveLevel: level, pointCount: pts.length, composition: composition, points: pts });
      });
    },
    criticalCount() { return this.enrichedZones.filter(z => z.effectiveLevel === '重大').length; },
    dangerCount() { return this.enrichedZones.filter(z => z.effectiveLevel === '较大').length; }
  },
  mounted() {
    this.waitForAMap();
  },
  beforeDestroy() {
    if (this.map) { this.map.destroy(); this.map = null; }
  },
  methods: {
    waitForAMap() {
      if (window.AMap) { this.initMap(); return; }
      setTimeout(() => this.waitForAMap(), 200);
    },
    initMap() {
      if (!this.$refs.mapContainer) return;
      this.map = new window.AMap.Map(this.$refs.mapContainer, {
        center: [this.center.lng, this.center.lat],
        zoom: this.zoom,
        mapStyle: 'amap://styles/dark',
        features: ['bg', 'road', 'building', 'point'],
        viewMode: '2D',
        resizeEnable: true,
        scrollWheel: true,
        zoomEnable: true
      });
      // 添加 +/- 缩放控件，方便演示现场手动放大/缩小
      try {
        if (window.AMap && window.AMap.Zoom) {
          this.map.addControl(new window.AMap.Zoom({ position: 'LT' }));
        }
      } catch (e) { /* 控件不可用不影响主功能 */ }
      this.map.on('complete', () => {
        this.loaded = true;
        this.buildLayers();
      });
    },
    buildLayers() {
      this.drawZones();
      this.drawRiskPoints();
      this.drawWorkPermits();
      this.drawParkBoundary();
      if (this.fitView) {
        // 仅按风险区域与风险点自适应，排除庞大的厂区边界，避免整图被缩得太小
        const overlays = [
          ...this.polygons.map(p => p.poly),
          ...this.markerList.map(m => m.marker)
        ];
        this.map.setFitView(overlays.length ? overlays : null, false, [40, 40, 80, 40]);
        // 设最低缩放下限，保证默认视野足够大、看得清
        if (this.map.getZoom() < this.zoom) {
          this.map.setZoom(this.zoom);
        }
      } else {
        this.map.setZoomAndCenter(this.zoom, [this.center.lng, this.center.lat]);
      }
    },
    drawZones() {
      const zones = this.enrichedZones.filter(z => z.path && z.path.length);
      // 深色底图下：饱和色半透明填充形成发光质感，低等级更淡、不抢视线
      const levelOpacity = { '重大': 0.42, '较大': 0.36, '一般': 0.28, '低': 0.18 };
      const levelStrokeW = { '重大': 2.5, '较大': 2, '一般': 1, '低': 1 };
      zones.forEach(z => {
        const lvl = z.effectiveLevel;
        const color = LEVEL_STROKES[lvl] || '#999';
        const fillColor = LEVEL_COLORS[lvl] || '#fafbfc';
        const poly = new window.AMap.Polygon({
          path: z.path,
          fillColor: fillColor,
          fillOpacity: levelOpacity[lvl] || 0.4,
          strokeColor: color,
          strokeWeight: levelStrokeW[lvl] || 2,
          strokeStyle: 'solid',
          extData: { zone: z }
        });
        if (this.clickable) {
          poly.on('click', (e) => this.onZoneClick(z, e));
          // 悬浮即显示区域信息，点击则固定（点到哪、讲到哪）
          poly.on('mouseover', () => this.onZoneOver(z));
          poly.on('mouseout', () => this.onZoneOut());
        }
        // 始终显示"等级 pill"（取区内最高风险等级），替代冗长区域名——一眼知重点
        const centerPt = this.getPolygonCenter(z.path);
        const pillText = z.pointCount > 1 ? (lvl + ' ·' + z.pointCount) : lvl;
        const pill = new window.AMap.Text({
          text: pillText,
          position: centerPt,
          anchor: 'center',
          offset: new window.AMap.Pixel(0, -30),
          style: {
            'font-size': '11px', 'font-weight': '700', 'color': '#fff',
            'background': color, 'border-radius': '10px', 'padding': '1px 8px',
            'white-space': 'nowrap', 'box-shadow': '0 1px 3px rgba(0,0,0,0.3)',
            'border': '1px solid rgba(255,255,255,0.7)', 'pointer-events': 'none'
          }
        });
        pill.setMap(this.map);
        // 区域全名标签默认隐藏（showLabels 时显示）
        let label = null;
        if (this.showLabels) {
          label = new window.AMap.Text({
            text: z.name,
            position: centerPt,
            offset: new window.AMap.Pixel(0, -6),
            style: {
              'font-size': '12px', 'font-weight': '600', 'color': '#1e293b',
              'background': 'rgba(255,255,255,0.85)', 'border-radius': '4px',
              'padding': '2px 6px', 'white-space': 'nowrap', 'pointer-events': 'none'
            }
          });
          label.setMap(this.map);
        }
        poly.setMap(this.map);
        this.polygons.push({ poly, zone: z, label, pill });
      });
    },
    drawRiskPoints() {
      // 同区内多个风险点按索引做像素级扇形展开，避免坐标重叠（坐标本身不变，仅视觉偏移）
      const byZone = {};
      this.markerData.forEach(rp => { (byZone[rp.zoneId] = byZone[rp.zoneId] || []).push(rp); });
      this.markerData.forEach(rp => {
        if (!rp.lng || !rp.lat) return;
        const color = MARKER_COLORS[rp.level] || '#999';
        const group = byZone[rp.zoneId] || [rp];
        const idx = group.indexOf(rp);
        const n = group.length;
        let dx = 0, dy = 0;
        if (n > 1) {
          const spread = 22;
          dx = (idx - (n - 1) / 2) * spread;
          dy = (idx % 2 === 0 ? -12 : 12);
        }
        const marker = new window.AMap.Marker({
          position: [rp.lng, rp.lat],
          content: this.createBadge(rp, color),
          offset: new window.AMap.Pixel(-11 + dx, -11 + dy),
          extData: { riskPoint: rp }
        });
        if (this.clickable) {
          // 悬浮预览、点击固定；名称不再常显，避免与区域标签叠加密集
          marker.on('mouseover', () => { if (!this.pinned) this.activeInfo = this.buildRiskInfo(rp, color); });
          marker.on('mouseout', () => { if (!this.pinned) this.activeInfo = null; });
          marker.on('click', () => { this.pinned = true; this.activeInfo = this.buildRiskInfo(rp, color); });
        }
        marker.setMap(this.map);
        this.markerList.push({ marker, riskPoint: rp, label: null });
      });
    },
    buildRiskInfo(rp, color) {
      return {
        name: rp.name,
        level: rp.level,
        color: color,
        desc: rp.category + ' | 责任人: ' + rp.responsibleName + ' | ' + rp.measures,
        risks: []
      };
    },
    levelColor(level) { return MARKER_COLORS[level] || '#999'; },
    drawWorkPermits() {
      if (!this.workPermits.length) return;
      this.workPermits.forEach(wp => {
        const pt = this.getWorkPermitPosition(wp);
        if (!pt) return;
        const content = '<div style="padding:2px 6px;font-size:10px;font-weight:600;color:#fff;background:#f59e0b;border-radius:10px;white-space:nowrap">🔧 作业中</div>';
        const marker = new window.AMap.Marker({
          position: pt,
          content: content,
          offset: new window.AMap.Pixel(-28, -10),
          extData: { workPermit: wp }
        });
        if (this.clickable) {
          marker.on('click', () => {
            const wNames = (wp.workers && wp.workers.length)
              ? wp.workers.map(w => w.name || w).join(', ')
              : '-';
            this.activeInfo = {
              name: '🔧 ' + (wp.workTypeLabel || wp.title || '作业票'),
              level: wp.statusLabel || wp.status || '作业中',
              color: '#f59e0b',
              desc: [
                wp.desc || wp.title || '-',
                wp.location || wp.zoneName || '-',
                '作业人: ' + wNames
              ].join(' | ')
            };
          });
        }
        marker.setMap(this.map);
      });
    },
    drawParkBoundary() {
      if (!PARK_BOUNDARY || !PARK_BOUNDARY.length) return;
      const poly = new window.AMap.Polygon({
        path: PARK_BOUNDARY,
        fillColor: '#0075E6',
        fillOpacity: 0.04,
        strokeColor: '#0075E6',
        strokeWeight: 3,
        strokeStyle: 'solid',
        zIndex: 10
      });
      poly.setMap(this.map);
    },
    onZoneClick(zone, e) {
      const zoneRisks = this.markerData.filter(r => r.zoneId === zone.id);
      const compList = ['重大', '较大', '一般', '低'].filter(l => (zone.composition || {})[l] > 0).map(l => ({ level: l, count: zone.composition[l] }));
      this.pinned = true;
      this.activeInfo = {
        name: zone.name,
        level: zone.effectiveLevel,
        color: LEVEL_STROKES[zone.effectiveLevel],
        desc: zone.desc,
        composition: compList,
        risks: zoneRisks
      };
      this.$emit('zone-click', { zone, risks: zoneRisks });
    },
    onZoneOver(zone) {
      if (this.pinned) return;
      const zoneRisks = this.markerData.filter(r => r.zoneId === zone.id);
      const compList = ['重大', '较大', '一般', '低'].filter(l => (zone.composition || {})[l] > 0).map(l => ({ level: l, count: zone.composition[l] }));
      this.activeInfo = {
        name: zone.name,
        level: zone.effectiveLevel,
        color: LEVEL_STROKES[zone.effectiveLevel],
        desc: zone.desc,
        composition: compList,
        risks: zoneRisks
      };
    },
    onZoneOut() {
      if (this.pinned) return;
      this.activeInfo = null;
    },
    setFilter(type) {
      this.activeFilter = type;
      this.polygons.forEach(({ poly, zone }) => {
        const lvl = zone.effectiveLevel || zone.riskLevel;
        if (type === 'all') { poly.setOptions({ fillOpacity: 0.45 }); return; }
        if (type === '重大') { poly.setOptions({ fillOpacity: lvl === '重大' ? 0.6 : 0.1 }); return; }
        if (type === 'danger') { poly.setOptions({ fillOpacity: lvl === '较大' ? 0.6 : 0.1 }); return; }
      });
    },
    clearInfo() { this.activeInfo = null; this.pinned = false; },
    getPolygonCenter(path) {
      if (!path || !path.length) return [112.51, 37.58];
      const sum = path.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1]], [0, 0]);
      return [sum[0] / path.length, sum[1] / path.length];
    },
    getWorkPermitPosition(wp) {
      if (wp.lng && wp.lat) return [wp.lng, wp.lat];
      const zone = this.zoneData.find(z => z.id === wp.zoneId);
      if (zone && zone.path) return this.getPolygonCenter(zone.path);
      return null;
    },
    createBadge(rp, color) {
      // 风险点徽章：彩色圆 + 白边 + 阴影；重大风险加脉冲动画（risk-badge 样式在文件末尾全局 style 中定义）
      const isMajor = rp.level === '重大';
      const cls = 'risk-badge' + (isMajor ? ' major' : '');
      const sym = rp.status === '隐患待整改' ? '⚠' : (isMajor ? '!' : '');
      return '<div class="' + cls + '" style="--c:' + color + '"><span>' + sym + '</span></div>';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.real-map-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.12);
}
.map-canvas { width: 100%; height: 100%; }

.map-legend {
  position: absolute; bottom: 56px; left: 10px;
  display: flex; gap: 12px; padding: 6px 10px;
  background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px;
  font-size: 11px; color: #cbd5e1;
  box-shadow: 0 1px 6px rgba(0,0,0,0.45); z-index: 100;
}
.legend-item { display: flex; align-items: center; gap: 4px; }
.legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 2px; }

.map-stats {
  position: absolute; bottom: 8px; left: 8px; right: 8px;
  display: flex; gap: 4px; z-index: 100;
  .stat-item {
    flex: 1; text-align: center; padding: 4px 0;
    background: rgba(15,23,42,0.85); border-radius: 6px;
    cursor: pointer; transition: all .15s;
    font-size: 11px; color: #cbd5e1;
    box-shadow: 0 1px 6px rgba(0,0,0,0.4);
    &:hover { background: rgba(30,41,59,0.95); }
    &.active { background: rgba(0,117,230,0.92); color: #fff; }
    .stat-num { display: block; font-size: 16px; font-weight: 700; }
    .stat-label { font-size: 10px; }
    .stat-red { color: #f87171; } .stat-orange { color: #fbbf24; }
  }
}

.map-infobox {
  position: absolute; top: 10px; right: 10px; left: 10px; z-index: 101;
  background: rgba(15,23,42,0.92); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
  padding: 10px 12px; box-shadow: 0 2px 16px rgba(0,0,0,0.5);
  cursor: pointer;
  .infobox-header {
    display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
    strong { font-size: 13px; color: #f1f5f9; }
    .infobox-level {
      padding: 1px 8px; border-radius: 10px; font-size: 10px; color: #fff; font-weight: 600;
    }
  }
  .infobox-body { font-size: 11px; color: #cbd5e1; }
  .infobox-row { margin-bottom: 4px; }
  .monitor-tag {
    display: inline-block; margin: 2px 4px 2px 0; padding: 1px 6px;
    border-radius: 8px; font-size: 10px; background: #14331f; color: #86efac;
    &.warning { background: #3a2a10; color: #fdba74; }
    &.alarm { background: #3a1717; color: #fca5a5; }
  }
  .risk-link { color: #60a5fa; cursor: pointer; text-decoration: underline; margin-right: 8px; }
  .text-xs { font-size: 10px; }

  .comp-tag {
    display: inline-block; margin: 0 3px; padding: 1px 6px; border-radius: 8px;
    color: #fff; font-size: 10px; font-weight: 600;
  }
  .risk-list { max-height: 132px; overflow-y: auto; }
  .risk-item {
    display: flex; align-items: center; gap: 6px; padding: 2px 0; cursor: pointer;
    color: #e2e8f0;
    &:hover { color: #fff; }
    .risk-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
  }
}
</style>
<style lang="scss">
// 风险点徽章由高德注入到地图 DOM（组件作用域外），需全局样式命中
.risk-badge {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--c); border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 12px; font-weight: 700;
  span { line-height: 1; }
  &.major { animation: badgePulse 1.6s ease-out infinite; }
}
@keyframes badgePulse {
  0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
  70% { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
  100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
}
</style>
</style>
