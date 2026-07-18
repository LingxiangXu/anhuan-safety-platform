<template>
  <div class="product-layout">
    <header class="pl-topbar">
      <div class="pl-topbar-left">
        <router-link to="/" class="pl-back-btn" title="返回产品中心">
          <span class="back-icon">&lsaquo;</span>
          <span class="back-text">产品中心</span>
        </router-link>
        <span class="pl-divider">|</span>
        <BrandLogo variant="mini" :show-text="true" sub-text="安全管理平台" />
        <span class="pl-product-ver">v1.0</span>
      </div>
      <div class="pl-topbar-right">
        <span class="pl-en-name">TZ Safety Management Platform</span>
      </div>
    </header>

    <div class="pl-body">
      <SideNav :items="navItems" />
      <main class="pl-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import SideNav from '@/components/common/SideNav.vue';
import BrandLogo from '@/components/common/BrandLogo.vue';

export default {
  name: 'SafetyIndex',
  components: { SideNav, BrandLogo },
  data() {
    return {
      navItems: [
        {
          key: 'overview', label: '产品概述', icon: '📋', route: '/safety-platform/overview'
        },
        {
          key: 'architecture', label: '平台架构', icon: '🏗️', route: '/safety-platform/architecture/system'
        },
        {
          key: 'roles', label: '角色与终端', icon: '👥', route: '/safety-platform/roles'
        },
        {
          key: 'pc-workstations', label: 'PC端工作台', icon: '💻', route: '/safety-platform/dashboard',
          children: [
            { key: 'pc-dashboard', label: '📊 集团驾驶舱', route: '/safety-platform/dashboard' },
            { key: 'pc-risk', label: '🎯 风险管理', route: '/safety-platform/risk-management' },
            { key: 'pc-hazard', label: '⚠️ 隐患与督办', route: '/safety-platform/hazard-supervision' },
            { key: 'pc-work', label: '🔧 特殊作业管控', route: '/safety-platform/special-work' },
            { key: 'pc-bpm', label: '🔗 BPM审批对接', route: '/safety-platform/bpm-integration' },
            { key: 'pc-training', label: '📖 培训管理', route: '/safety-platform/training-management' }
          ]
        },
        {
          key: 'app-modules', label: 'APP 移动现场', icon: '📱', route: '/safety-platform/mobile-field',
          children: [
            { key: 'app-field', label: '┃ 现场人员视角', route: '', header: true },
            { key: 'app-field-worker', label: '　移动工作台', route: '/safety-platform/mobile-field' },
            { key: 'app-work-ticket', label: '　📋 作业票', route: '/safety-platform/work-ticket' },
            { key: 'app-check-in', label: '　📍 到岗签到', route: '/safety-platform/check-in' },
            { key: 'app-emergency', label: '　🆘 应急求助', route: '/safety-platform/emergency-help' },
            { key: 'app-message', label: '　🔔 消息中心', route: '/safety-platform/message-center' },
            { key: 'app-risk-map', label: '　🗺️ 风险地图', route: '/safety-platform/risk-map' },
            { key: 'app-personal', label: '　👤 个人中心', route: '/safety-platform/personal-center' }
          ]
        },
        {
          key: 'panorama', label: '功能全景', icon: '🌍', route: '/safety-platform/feature-panorama'
        },
        {
          key: 'value', label: '产品成效分析', icon: '📈', route: '/safety-platform/value'
        },
        {
          key: 'plan', label: '建设规划', icon: '📅', route: '/safety-platform/plan'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.product-layout { height: 100vh; display: flex; flex-direction: column; background: $bg-page; }
.pl-topbar {
  height: $topbar-height; background: #fff; border-bottom: 1px solid $border;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 $space-xl; flex-shrink: 0; z-index: 10;
  &-left { display: flex; align-items: center; gap: $space-md; }
  &-right { .pl-en-name { font-size: $font-xs; color: $text-hint; letter-spacing: 1px; font-style: italic; } }
}
.pl-back-btn {
  display: flex; align-items: center; gap: 2px; color: $text-secondary; font-size: $font-sm;
  transition: color 0.2s; padding: 4px 8px; border-radius: $radius-sm;
  &:hover { color: $primary; background: $primary-bg; }
  .back-icon { font-size: 22px; font-weight: 300; line-height: 1; }
}
.pl-divider { color: $border; }
.pl-product-icon { font-size: 20px; }
.pl-product-name { font-size: $font-md; font-weight: 600; color: $text-primary; }
.pl-product-ver { font-size: $font-xs; color: $text-hint; background: $bg-page; padding: 2px 8px; border-radius: $radius-sm; }
.pl-body { flex: 1; display: flex; overflow: hidden; }
.pl-content { flex: 1; overflow-y: auto; padding: $space-xl; background: $bg-page; }
</style>
