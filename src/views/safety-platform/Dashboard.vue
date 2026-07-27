<template>
  <div class="dashboard-v2">
    <!-- === 顶部统计长廊：渐变卡片 === -->
    <div class="stat-gallery">
      <div class="stat-card-v2" v-for="(s, i) in topStats" :key="s.label"
        :style="{ animationDelay: i * 0.06 + 's' }"
        :class="['a-fade-up', 'a-delay-' + (i+1)]">
        <div class="scv2-glow" :style="{ background: s.grad }"></div>
        <div class="scv2-icon" :style="{ background: s.grad }">{{ s.icon }}</div>
        <div class="scv2-body">
          <span class="scv2-label">{{ s.label }}</span>
          <span class="scv2-value" :style="{ color: s.color }">
            <span class="count-num">{{ s.value }}</span>
            <span class="count-unit" v-if="s.unit">{{ s.unit }}</span>
          </span>
          <span class="scv2-sub">{{ s.sub }}</span>
        </div>
        <div class="scv2-border" :style="{ background: s.grad }"></div>
      </div>
    </div>

    <!-- === 中部三栏：ECharts 图表 === -->
    <div class="chart-row">
      <div class="glass-card chart-panel a-fade-up a-delay-6">
        <div class="chart-panel-head">
          <span class="cp-title">📈 隐患月度趋势</span>
          <span class="cp-sub">近 6 个月</span>
        </div>
        <div ref="trendChart" class="chart-box"></div>
      </div>
      <div class="glass-card chart-panel a-fade-up a-delay-7">
        <div class="chart-panel-head">
          <span class="cp-title">🎯 风险等级分布</span>
          <span class="cp-sub">共 {{ riskTotal }} 个风险点</span>
        </div>
        <div ref="pieChart" class="chart-box"></div>
      </div>
      <div class="glass-card chart-panel a-fade-up a-delay-8">
        <div class="chart-panel-head">
          <span class="cp-title">📊 各部门隐患对比</span>
          <span class="cp-sub">本月统计</span>
        </div>
        <div ref="barChart" class="chart-box"></div>
      </div>
    </div>

    <!-- === 下部：作业流程 + 组织态势 === -->
    <div class="dash-bottom">
      <!-- 左侧：组织安全态势 -->
      <div class="glass-card dash-left-v2 a-fade-up a-delay-9">
        <div class="panel-header-v2">
          <span>🏭 组织安全态势</span>
        </div>
        <div class="panel-body-v2">
          <div class="org-compare-v2" v-for="org in dashboardStats.orgComparison" :key="org.name">
            <div class="ocv2-top">
              <span class="ocv2-name">{{ org.name }}</span>
              <span :class="['tag', org.riskLevel === '橙色' ? 'tag-orange' : 'tag-blue']">{{ org.riskLevel }}</span>
            </div>
            <div class="ocv2-stats">
              <div class="ocv2-stat">
                <div class="ocv2-val" :style="{ color: org.hazards > 3 ? '#dc2626' : '#16a34a' }">{{ org.hazards }}</div>
                <div class="ocv2-lbl">隐患</div>
              </div>
              <div class="ocv2-stat">
                <div class="ocv2-val">{{ org.activePermits }}</div>
                <div class="ocv2-lbl">作业票</div>
              </div>
              <div class="ocv2-stat">
                <div class="ocv2-val" :style="{ color: org.supervisions > 0 ? '#d97706' : '#9ca3af' }">{{ org.supervisions }}</div>
                <div class="ocv2-lbl">督办</div>
              </div>
            </div>
          </div>
          <div class="dv2-divider"></div>
          <div class="dv2-mini-label">⚠️ 高风险区域</div>
          <div class="risk-list-v2">
            <div class="rlv2-item" v-for="r in dashboardStats.criticalRisks" :key="r.zone">
              <span class="rlv2-name">{{ r.zone }}</span>
              <span class="tag tag-red">{{ r.count }}项</span>
            </div>
          </div>
          <div class="dv2-link" @click="$router.push('/safety-platform/hazard-supervision')">
            进入隐患与督办 →
          </div>
        </div>
      </div>

      <!-- 中间：厂区地图 -->
      <div class="dash-center-v2 a-fade-up a-delay-10">
        <div class="map-title-bar-v2">
          <span>铸锻件分公司 · 厂区风险四色图</span>
          <span class="tag tag-blue">高德地图</span>
        </div>
        <RealMap :height="'100%'" :zoom="18" :fit-view="false" />
      </div>

      <!-- 右侧：特殊作业 + 督办 -->
      <div class="glass-card dash-right-v2 a-fade-up a-delay-11">
        <div class="panel-header-v2">
          <span>🔧 作业与督办</span>
        </div>
        <div class="panel-body-v2">
          <!-- 作业统计 -->
          <div class="mini-stats-row">
            <div class="mini-stat-v2">
              <div class="msv2-val" style="color:#3b82f6">{{ activeWorkPermits.length }}</div>
              <div class="msv2-lbl">进行中</div>
            </div>
            <div class="mini-stat-v2 warn" v-if="blockedPermits.length">
              <div class="msv2-val" style="color:#ef4444">{{ blockedPermits.length }}</div>
              <div class="msv2-lbl">资格阻断</div>
            </div>
            <div class="mini-stat-v2">
              <div class="msv2-val" style="color:#0ea85e">{{ completedPermits }}</div>
              <div class="msv2-lbl">已闭环</div>
            </div>
          </div>

          <!-- 作业列表 -->
          <div class="work-list-v2">
            <div class="wlv2-item" v-for="wp in activeWorkPermits" :key="wp.id"
              @click="$router.push('/safety-platform/special-work')">
              <span class="wlv2-dot" :class="wp.blocked ? 'dot-danger' : 'dot-active'"></span>
              <span class="wlv2-type">{{ getWorkTypeIcon(wp.workType) }}</span>
              <span class="wlv2-name">{{ wp.title }}</span>
              <span class="tag" :class="workStatusTag(wp.status)">{{ getWorkStatus(wp.status) }}</span>
            </div>
          </div>

          <div class="dv2-divider"></div>
          <div class="dv2-mini-label">📨 安全督办</div>
          <div class="wlv2-item" v-for="s in activeSupervisions" :key="s.id"
            @click="$router.push('/safety-platform/hazard-supervision')">
            <span class="wlv2-dot dot-warn"></span>
            <span class="wlv2-name" style="flex:1">{{ s.hazardTitle }}</span>
            <span class="tag tag-orange">{{ getSupervisionStatus(s.status) }}</span>
          </div>
          <div class="dv2-link" @click="$router.push('/safety-platform/special-work')">
            进入特殊作业管控 →
          </div>
        </div>
      </div>
    </div>

    <!-- === 快捷操作栏 === -->
    <div class="quick-bar-v2 a-fade-up a-delay-12">
      <button class="qbv2-btn" @click="$router.push('/safety-platform/hazard-supervision')">
        <span>⚠️</span> 登记隐患
      </button>
      <button class="qbv2-btn" @click="$router.push('/safety-platform/special-work')">
        <span>🔧</span> 申请作业票
      </button>
      <button class="qbv2-btn" @click="$router.push('/safety-platform/bpm-integration')">
        <span>🔗</span> OA审批集成
      </button>
      <button class="qbv2-btn" @click="$router.push('/safety-platform/risk-management')">
        <span>🎯</span> 评价风险点
      </button>
      <button class="qbv2-btn" @click="$router.push('/safety-platform/training-management')">
        <span>📖</span> 发布培训
      </button>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import RealMap from '@/components/safety/RealMap.vue';
import { dashboardStats, workPermits, supervisions, WORK_PERMIT_STATUS, SUPERVISION_STATUS, WORK_TYPE, riskLedger, personnel } from '@/store/safeData';

export default {
  name: 'DashboardV2',
  components: { RealMap },
  data() {
    return {
      dashboardStats: JSON.parse(JSON.stringify(dashboardStats)),
      activeWorkPermits: workPermits.filter(w => w.status !== '草稿' && w.status !== '已归档'),
      blockedPermits: workPermits.filter(w => w.blocked),
      activeSupervisions: supervisions.filter(s => s.status !== '已关闭'),
      personnel
    };
  },
  computed: {
    completedPermits() {
      return workPermits.filter(w => w.status === '已归档').length;
    },
    topStats() {
      const ds = this.dashboardStats;
      return [
        { label: '隐患总数', value: ds.totalHazards, icon: '⚠️', color: '#dc2626', grad: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)', sub: '含重大 ' + ds.criticalHazards + ' 项', unit: '' },
        { label: '待处置隐患', value: ds.pendingHazards, icon: '⏳', color: '#d97706', grad: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)', sub: '需立即处理', unit: '' },
        { label: '进行中作业', value: ds.activeWorkPermits, icon: '🔧', color: '#2563eb', grad: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', sub: '含阻断 ' + this.blockedPermits.length + ' 项', unit: '' },
        { label: '安全督办', value: ds.activeSupervisions, icon: '📨', color: '#dc2626', grad: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)', sub: '跟进中', unit: '' },
        { label: 'OA待审批', value: ds.bpmPendingCount || 3, icon: '🔗', color: '#0058AD', grad: 'linear-gradient(135deg, #0058AD 0%, #0075E6 100%)', sub: '平均' + (ds.bpmAvgTime || '4.6') + 'h审批', unit: '' },
        { label: '本月闭环', value: ds.closedThisMonth, icon: '✅', color: '#16a34a', grad: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)', sub: '整改率 ' + ds.rectificationRate + '%', unit: '' }
      ];
    },
    riskTotal() {
      return riskLedger.length;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initTrendChart();
      this.initPieChart();
      this.initBarChart();
    });
  },
  beforeDestroy() {
    this._trendChart && this._trendChart.dispose();
    this._pieChart && this._pieChart.dispose();
    this._barChart && this._barChart.dispose();
  },
  methods: {
    riskTagClass(level) { return level === '橙色' ? 'tag-orange' : 'tag-blue'; },
    getWorkTypeIcon(type) { return WORK_TYPE[type] ? WORK_TYPE[type].icon : ''; },
    getWorkStatus(status) { return WORK_PERMIT_STATUS[status] || status; },
    getSupervisionStatus(status) { return SUPERVISION_STATUS[status] || status; },
    workStatusTag(status) {
      if (status === 'IN_PROGRESS' || status === '作业中') return 'tag-blue';
      if (status === 'PENDING_GUARDIAN' || status === '待监护确认') return 'tag-orange';
      return 'tag-gray';
    },

    // === ECharts 初始化 ===
    initTrendChart() {
      if (!this.$refs.trendChart) return;
      this._trendChart = echarts.init(this.$refs.trendChart);
      const months = ['2月','3月','4月','5月','6月','7月'];
      this._trendChart.setOption({
        tooltip: { trigger: 'axis', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#111827', fontSize: 12 }, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
        grid: { left: 12, right: 16, top: 16, bottom: 12 },
        xAxis: { type: 'category', data: months, axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#9ca3af', fontSize: 11 }, axisTick: { show: false } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } }, axisLabel: { color: '#9ca3af', fontSize: 11 } },
        series: [{
          type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
          data: [3, 4, 5, 6, 4, 5],
          lineStyle: { color: '#3b82f6', width: 3 },
          itemStyle: { color: '#3b82f6', borderColor: '#fff', borderWidth: 2 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59,130,246,0.2)' }, { offset: 1, color: 'rgba(59,130,246,0)' }
          ]) }
        }, {
          type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
          data: [2, 3, 4, 4, 3, 4],
          lineStyle: { color: '#22c55e', width: 3 },
          itemStyle: { color: '#22c55e', borderColor: '#fff', borderWidth: 2 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(34,197,94,0.2)' }, { offset: 1, color: 'rgba(34,197,94,0)' }
          ]) }
        }]
      });
      window.addEventListener('resize', () => this._trendChart && this._trendChart.resize());
    },

    initPieChart() {
      if (!this.$refs.pieChart) return;
      this._pieChart = echarts.init(this.$refs.pieChart);
      const stats = { critical: 0, major: 0, moderate: 0, low: 0 };
      riskLedger.forEach(r => {
        if (r.level === '重大') stats.critical++;
        else if (r.level === '较大') stats.major++;
        else if (r.level === '一般') stats.moderate++;
        else stats.low++;
      });
      this._pieChart.setOption({
        tooltip: { trigger: 'item', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#111827', fontSize: 12 }, formatter: '{b}: {c} 项 ({d}%)' },
        series: [{
          type: 'pie', radius: ['55%', '82%'], center: ['50%', '52%'],
          avoidLabelOverlap: false, itemStyle: { borderColor: '#fff', borderWidth: 3, borderRadius: 6 },
          label: { show: false },
          emphasis: { scaleSize: 8, label: { show: true, fontSize: 14, fontWeight: 'bold' } },
          data: [
            { value: stats.critical, name: '重大', itemStyle: { color: '#dc2626' } },
            { value: stats.major, name: '较大', itemStyle: { color: '#ea580c' } },
            { value: stats.moderate, name: '一般', itemStyle: { color: '#ca8a04' } },
            { value: stats.low, name: '低', itemStyle: { color: '#2563eb' } }
          ]
        }]
      });
      window.addEventListener('resize', () => this._pieChart && this._pieChart.resize());
    },

    initBarChart() {
      if (!this.$refs.barChart) return;
      this._barChart = echarts.init(this.$refs.barChart);
      const orgs = this.dashboardStats.orgComparison || [];
      this._barChart.setOption({
        tooltip: { trigger: 'axis', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#111827', fontSize: 12 } },
        grid: { left: 12, right: 12, top: 16, bottom: 12 },
        xAxis: { type: 'category', data: orgs.map(o => o.name), axisLabel: { color: '#9ca3af', fontSize: 10, rotate: 0 }, axisTick: { show: false }, axisLine: { lineStyle: { color: '#e5e7eb' } } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } }, axisLabel: { color: '#9ca3af', fontSize: 11 } },
        series: [
          { name: '隐患', type: 'bar', barWidth: 16, itemStyle: { borderRadius: [6,6,0,0], color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#ef4444'},{offset:1,color:'#fca5a5'}]) }, data: orgs.map(o => o.hazards) },
          { name: '作业票', type: 'bar', barWidth: 16, itemStyle: { borderRadius: [6,6,0,0], color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#3b82f6'},{offset:1,color:'#93c5fd'}]) }, data: orgs.map(o => o.activePermits) },
          { name: '督办', type: 'bar', barWidth: 16, itemStyle: { borderRadius: [6,6,0,0], color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#f59e0b'},{offset:1,color:'#fcd34d'}]) }, data: orgs.map(o => o.supervisions) }
        ]
      });
      window.addEventListener('resize', () => this._barChart && this._barChart.resize());
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.dashboard-v2 {
  width: 100%; min-height: calc(100vh - #{$topbar-height} - #{$space-3xl});
  display: flex; flex-direction: column; gap: $space-4;
}

/* === 统计画廊 === */
.stat-gallery {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: $space-3;
}
.stat-card-v2 {
  position: relative; overflow: hidden;
  background: $bg-card; border-radius: $radius-lg;
  padding: $space-4; display: flex; align-items: center; gap: $space-3;
  box-shadow: $shadow-sm; cursor: default;
  transition: transform $transition-base, box-shadow $transition-base;
  &:hover { transform: translateY(-3px); box-shadow: $shadow-md; }
  .scv2-glow {
    position: absolute; top: -30%; right: -20%;
    width: 80px; height: 80px; border-radius: 50%; opacity: .15; pointer-events: none;
  }
  .scv2-border {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  }
  .scv2-icon {
    width: 44px; height: 44px; border-radius: $radius-md;
    display: flex; align-items: center; justify-content: center;
    font-size: $font-xl; color: #fff; flex-shrink: 0;
  }
  .scv2-body { flex: 1; min-width: 0; }
  .scv2-label { font-size: $font-xs; color: $text-hint; display: block; }
  .scv2-value { font-size: $font-2xl; font-weight: 800; line-height: 1.1; display: flex; align-items: baseline; gap: 2px; }
  .count-num { display: inline-block; }
  .count-unit { font-size: $font-xs; font-weight: 500; color: $text-hint; }
  .scv2-sub { font-size: 10px; color: $text-hint; display: block; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
}

/* === 图表行 === */
.chart-row {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: $space-4;
}
.chart-panel {
  padding: 0; overflow: hidden;
}
.chart-panel-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: $space-3 $space-4; border-bottom: 1px solid $border-light;
  .cp-title { font-size: $font-sm; font-weight: 700; color: $text-primary; }
  .cp-sub { font-size: $font-xs; color: $text-hint; }
}
.chart-box {
  width: 100%; height: 220px;
}

/* === 底部三栏 === */
.dash-bottom {
  display: flex; gap: $space-4; flex: 1; min-height: 0;
}
.dash-left-v2 {
  width: 260px; flex-shrink: 0; padding: 0; overflow: hidden; display: flex; flex-direction: column;
}
.dash-center-v2 {
  flex: 1; display: flex; flex-direction: column; min-width: 0; border-radius: $radius-lg; overflow: hidden;
  box-shadow: $shadow-sm; border: 1px solid $border;
}
.dash-right-v2 {
  width: 280px; flex-shrink: 0; padding: 0; overflow: hidden; display: flex; flex-direction: column;
}

/* 面板通用 */
.panel-header-v2 {
  padding: $space-3 $space-4; border-bottom: 1px solid $border-light;
  font-size: $font-sm; font-weight: 700; color: $text-primary;
}
.panel-body-v2 {
  padding: $space-3 $space-4; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: $space-2;
}

/* 地图标题 */
.map-title-bar-v2 {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px $space-4; background: #fff; border-bottom: 1px solid $border-light;
  font-size: $font-sm; font-weight: 600; color: $text-primary;
}

/* 组织对比 */
.org-compare-v2 {
  padding: $space-3; background: $gray-50; border-radius: $radius-base; transition: background $transition-fast;
  &:hover { background: $gray-100; }
}
.ocv2-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: $space-2; }
.ocv2-name { font-size: $font-sm; font-weight: 700; color: $text-primary; }
.ocv2-stats { display: flex; gap: $space-4; }
.ocv2-stat { text-align: center; flex: 1; }
.ocv2-val { font-size: $font-lg; font-weight: 800; }
.ocv2-lbl { font-size: 10px; color: $text-hint; }

.dv2-divider { border-top: 1px solid $border-light; margin: $space-1 0; }
.dv2-mini-label { font-size: 10px; color: $text-hint; text-transform: uppercase; letter-spacing: 0.5px; }
.dv2-link {
  text-align: center; font-size: 11px; color: $brand-600; cursor: pointer; padding: $space-2;
  margin-top: auto; border-top: 1px solid $border-light; border-radius: 0 0 $radius-lg $radius-lg;
  transition: background $transition-fast;
  &:hover { background: $brand-50; }
}

/* 风险列表 */
.risk-list-v2 { display: flex; flex-direction: column; gap: $space-1; }
.rlv2-item { display: flex; justify-content: space-between; align-items: center; padding: $space-1 0; }
.rlv2-name { font-size: $font-xs; color: $text-secondary; }

/* 迷你统计 */
.mini-stats-row { display: flex; gap: $space-2; }
.mini-stat-v2 {
  flex: 1; text-align: center; padding: $space-2; border-radius: $radius-base;
  background: #f0fdf4; &.warn { background: $danger-100; }
}
.msv2-val { font-size: $font-xl; font-weight: 800; }
.msv2-lbl { font-size: 10px; color: $text-hint; }

/* 作业列表 */
.work-list-v2 { display: flex; flex-direction: column; gap: 4px; }
.wlv2-item {
  display: flex; align-items: center; gap: $space-2; padding: $space-2;
  border-radius: $radius-sm; cursor: pointer; transition: all $transition-fast;
  &:hover { background: $brand-50; }
}
.wlv2-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  &.dot-active { background: $success-500; }
  &.dot-danger { background: $danger-500; animation: pulse-glow 2s infinite; }
  &.dot-warn { background: $warning-500; animation: badge-pulse 2s infinite; }
}
.wlv2-type { font-size: 14px; flex-shrink: 0; }
.wlv2-name { font-size: 11px; color: $text-secondary; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 快捷操作栏 */
.quick-bar-v2 {
  display: flex; gap: $space-2; justify-content: center; flex-wrap: wrap;
  padding: $space-3; background: $bg-card; border-radius: $radius-lg;
  box-shadow: $shadow-sm; border: 1px solid $border;
}
.qbv2-btn {
  display: flex; align-items: center; gap: 4px;
  padding: $space-2 $space-4; border: 1px solid $border; background: #fff;
  border-radius: 999px; cursor: pointer; font-size: $font-sm; color: $text-primary;
  transition: all $transition-fast; white-space: nowrap;
  &:hover { border-color: $brand-500; color: $brand-600; background: $brand-50; transform: translateY(-1px); box-shadow: $shadow-sm; }
  span { font-size: 15px; }
}
</style>
