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
      <div class="stat-item" @click="setFilter('major')" :class="{ active: activeFilter === 'major' }">
        <span class="stat-num stat-red">{{ majorHazardCount }}</span><span class="stat-label">重点风险源</span>
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
        <div class="infobox-row text-xs" v-if="activeInfo.risks">
          <span v-for="r in activeInfo.risks" :key="r.id" class="risk-link" @click.stop="$emit('risk-click', r)">⬤ {{ r.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { factoryZones, riskPoints, majorHazardSources, FACTORY_CENTER, PARK_BOUNDARY } from '@/store/safeData';

// 风险等级 → 填充色映射
const LEVEL_COLORS = { '重大': '#fef2f2', '较大': '#fff7ed', '一般': '#fffbeb', '低': '#ecfdf5' };
const LEVEL_STROKES = { '重大': '#ef4444', '较大': '#f59e0b', '一般': '#eab308', '低': '#3b82f6' };
const MARKER_COLORS = { '重大': '#ef4444', '较大': '#f59e0b', '一般': '#eab308', '低': '#3b82f6' };
const HAZARD_LEVEL_COLORS = { '一级': '#7f1d1d', '二级': '#ef4444', '三级': '#f59e0b', '四级': '#3b82f6' };

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
    zoom: { type: Number, default: 16 },
    fitView: { type: Boolean, default: true },
    clickable: { type: Boolean, default: true }
  },
  data() {
    return {
      map: null,
      polygons: [],
      markerList: [],
      hazardMarkers: [],
      activeFilter: 'all',
      activeInfo: null,
      loaded: false
    };
  },
  computed: {
    zoneData() { return this.zones.length ? this.zones : factoryZones; },
    markerData() { return this.markers.length ? this.markers : riskPoints; },
    hazardData() { return majorHazardSources; },
    criticalCount() { return this.zoneData.filter(z => z.riskLevel === '重大').length; },
    dangerCount() { return this.zoneData.filter(z => z.riskLevel === '较大').length; },
    majorHazardCount() { return this.hazardData.length; }
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
        mapStyle: 'amap://styles/light',
        features: ['bg', 'road', 'building', 'point'],
        viewMode: '2D',
        resizeEnable: true
      });
      this.map.on('complete', () => {
        this.loaded = true;
        this.buildLayers();
      });
    },
    buildLayers() {
      this.drawZones();
      this.drawRiskPoints();
      this.drawMajorHazards();
      this.drawWorkPermits();
      this.drawParkBoundary();
      if (this.fitView) {
        this.map.setFitView(null, false, [80, 80, 80, 280]);
      } else {
        this.map.setZoomAndCenter(this.zoom, [this.center.lng, this.center.lat]);
      }
    },
    drawZones() {
      const zones = this.zoneData.filter(z => z.path && z.path.length);
      zones.forEach(z => {
        const color = LEVEL_STROKES[z.riskLevel] || '#999';
        const fillColor = LEVEL_COLORS[z.riskLevel] || '#fafbfc';
        const poly = new window.AMap.Polygon({
          path: z.path,
          fillColor: fillColor,
          fillOpacity: 0.45,
          strokeColor: color,
          strokeWeight: 2,
          strokeStyle: 'dashed',
          strokeDasharray: [8, 4],
          extData: { zone: z }
        });
        if (this.clickable) {
          poly.on('click', (e) => this.onZoneClick(z, e));
        }
        // 区域标签
        const centerPt = this.getPolygonCenter(z.path);
        const label = new window.AMap.Text({
          text: z.name,
          position: centerPt,
          offset: new window.AMap.Pixel(0, -6),
          style: {
            'font-size': '12px', 'font-weight': '600', 'color': '#1e293b',
            'background': 'rgba(255,255,255,0.85)', 'border-radius': '4px',
            'padding': '2px 6px', 'white-space': 'nowrap', 'pointer-events': 'none'
          }
        });
        poly.setMap(this.map);
        label.setMap(this.map);
        this.polygons.push({ poly, zone: z, label });
      });
    },
    drawRiskPoints() {
      this.markerData.forEach(rp => {
        if (!rp.lng || !rp.lat) return;
        const color = MARKER_COLORS[rp.level] || '#999';
        const icon = this.createCircleMarker(rp.name, color, rp.status === '隐患待整改' ? '⚠️' : '🔴');
        const marker = new window.AMap.Marker({
          position: [rp.lng, rp.lat],
          icon: icon,
          offset: new window.AMap.Pixel(-12, -12),
          extData: { riskPoint: rp }
        });
        if (this.clickable) {
          marker.on('click', () => {
            this.activeInfo = {
              name: rp.name,
              level: rp.level,
              color: color,
              desc: rp.category + ' | 责任人: ' + rp.responsibleName + ' | ' + rp.measures,
              risks: []
            };
          });
        }
        // 风险点名称标签
        const label = new window.AMap.Text({
          text: rp.name,
          position: [rp.lng, rp.lat],
          offset: new window.AMap.Pixel(16, -4),
          style: {
            'font-size': '10px', 'color': '#475569',
            'background': 'rgba(255,255,255,0.9)', 'border-radius': '3px',
            'padding': '1px 5px', 'white-space': 'nowrap', 'pointer-events': 'none'
          }
        });
        marker.setMap(this.map);
        label.setMap(this.map);
        this.markerList.push({ marker, riskPoint: rp, label });
      });
    },
    drawMajorHazards() {
      this.hazardData.forEach(mh => {
        if (!mh.lng || !mh.lat) return;
        const color = HAZARD_LEVEL_COLORS[mh.level] || '#ef4444';
        const icon = this.createDangerMarker(color);
        const marker = new window.AMap.Marker({
          position: [mh.lng, mh.lat],
          icon: icon,
          offset: new window.AMap.Pixel(-14, -14),
          extData: { hazard: mh }
        });
        if (this.clickable) {
          marker.on('click', () => {
            this.activeInfo = {
              name: '☢ ' + mh.name,
              level: mh.level + '重大危险源',
              color: color,
              desc: 'R值: ' + mh.R_value + ' | ' + mh.classification.basis,
              monitoring: mh.monitoring
            };
          });
        }
        marker.setMap(this.map);
        // 名称标签
        const label = new window.AMap.Text({
          text: '☢ ' + mh.name.slice(0, 10),
          position: [mh.lng, mh.lat],
          offset: new window.AMap.Pixel(18, -4),
          style: {
            'font-size': '10px', 'font-weight': '600', 'color': color,
            'background': 'rgba(255,255,255,0.95)', 'border': '1px solid ' + color,
            'border-radius': '3px', 'padding': '1px 5px', 'white-space': 'nowrap', 'pointer-events': 'none'
          }
        });
        label.setMap(this.map);
        this.hazardMarkers.push({ marker, hazard: mh, label });
      });
    },
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
      this.activeInfo = {
        name: zone.name,
        level: zone.riskLevel,
        color: LEVEL_STROKES[zone.riskLevel],
        desc: zone.desc,
        risks: zoneRisks
      };
      this.$emit('zone-click', { zone, risks: zoneRisks });
    },
    setFilter(type) {
      this.activeFilter = type;
      this.polygons.forEach(({ poly, zone }) => {
        if (type === 'all') { poly.setOptions({ fillOpacity: 0.45 }); return; }
        if (type === '重大') { poly.setOptions({ fillOpacity: zone.riskLevel === '重大' ? 0.6 : 0.1 }); return; }
        if (type === 'danger') { poly.setOptions({ fillOpacity: zone.riskLevel === '较大' ? 0.6 : 0.1 }); return; }
      });
    },
    clearInfo() { this.activeInfo = null; },
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
    createCircleMarker(name, color, sym) {
      // 使用 SVG data URL 创建圆形标记
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="9" fill="${color}" opacity="0.85" stroke="#fff" stroke-width="2"/><text x="12" y="16" text-anchor="middle" font-size="11" fill="#fff">!</text></svg>`;
      return new window.AMap.Icon({
        size: new window.AMap.Size(24, 24),
        imageSize: new window.AMap.Size(24, 24),
        image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
      });
    },
    createDangerMarker(color) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><polygon points="14,2 26,24 2,24" fill="${color}" opacity="0.9" stroke="#fff" stroke-width="2"/><text x="14" y="18" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">!</text></svg>`;
      return new window.AMap.Icon({
        size: new window.AMap.Size(28, 28),
        imageSize: new window.AMap.Size(28, 28),
        image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
      });
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
  border: 1px solid $gray-200;
}
.map-canvas { width: 100%; height: 100%; }

.map-legend {
  position: absolute; bottom: 56px; left: 10px;
  display: flex; gap: 12px; padding: 6px 10px;
  background: rgba(255,255,255,0.92); border-radius: 6px;
  font-size: 11px; color: #475569;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1); z-index: 100;
}
.legend-item { display: flex; align-items: center; gap: 4px; }
.legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 2px; }

.map-stats {
  position: absolute; bottom: 8px; left: 8px; right: 8px;
  display: flex; gap: 4px; z-index: 100;
  .stat-item {
    flex: 1; text-align: center; padding: 4px 0;
    background: rgba(255,255,255,0.9); border-radius: 6px;
    cursor: pointer; transition: all .15s;
    font-size: 11px; color: $gray-500;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    &:hover { background: #fff; }
    &.active { background: #1e293b; color: #fff; }
    .stat-num { display: block; font-size: 16px; font-weight: 700; }
    .stat-label { font-size: 10px; }
    .stat-red { color: $danger; } .stat-orange { color: $warning-500; }
  }
}

.map-infobox {
  position: absolute; top: 10px; right: 10px; left: 10px; z-index: 101;
  background: rgba(255,255,255,0.96); border-radius: 8px;
  padding: 10px 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  .infobox-header {
    display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
    strong { font-size: 13px; color: #1e293b; }
    .infobox-level {
      padding: 1px 8px; border-radius: 10px; font-size: 10px; color: #fff; font-weight: 600;
    }
  }
  .infobox-body { font-size: 11px; color: #475569; }
  .infobox-row { margin-bottom: 4px; }
  .monitor-tag {
    display: inline-block; margin: 2px 4px 2px 0; padding: 1px 6px;
    border-radius: 8px; font-size: 10px; background: #e8f5e9; color: #2e7d32;
    &.warning { background: #fff3e0; color: #e65100; }
    &.alarm { background: #ffebee; color: #c62828; }
  }
  .risk-link { color: $primary; cursor: pointer; text-decoration: underline; margin-right: 8px; }
  .text-xs { font-size: 10px; }
}
</style>
