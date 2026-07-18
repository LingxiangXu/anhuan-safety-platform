<template>
  <nav class="side-nav">
    <div class="nav-brand">
      <BrandLogo variant="mini" />
      <span class="nav-brand-label">安全平台</span>
    </div>
    <div class="nav-list">
      <template v-for="item in items">
        <div class="nav-item" :class="{ active: isActive(item) }" :key="item.key" @click="goRoute(item)">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.children" class="nav-arrow">{{ isExpanded(item) ? '▾' : '▸' }}</span>
        </div>
        <div v-if="item.children && isExpanded(item)" class="nav-sub" :key="item.key + '-sub'">
          <div
            v-for="child in item.children"
            :key="child.key"
            class="nav-sub-item"
            :class="{ active: isSubActive(child), 'header-item': child.header }"
            @click="child.header ? null : goSubRoute(child)"
          >
            <span class="nav-sub-label">{{ child.label }}</span>
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>

<script>
import BrandLogo from '@/components/common/BrandLogo.vue';

export default {
  name: 'SideNav',
  components: { BrandLogo },
  props: { items: { type: Array, default: () => [] } },
  computed: {
    currentRoute() { return this.$route.path; }
  },
  methods: {
    isActive(item) {
      if (item.children) return item.children.some(c => c.route === this.currentRoute);
      return item.route === this.currentRoute;
    },
    isExpanded(item) {
      if (!item.children) return false;
      return item.children.some(c => c.route === this.currentRoute || c.key === this.currentRoute);
    },
    isSubActive(child) {
      return !child.header && child.route === this.currentRoute;
    },
    goRoute(item) {
      if (item.route) this.$router.push(item.route);
    },
    goSubRoute(child) {
      if (child.route) this.$router.push(child.route);
      if (child.query) this.$router.push({ path: child.route, query: child.query });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.side-nav {
  width: $sidebar-width;
  background: #fff;
  border-right: 1px solid $border;
  overflow-y: auto;
  flex-shrink: 0;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-md $space-lg;
  border-bottom: 1px solid $border;
  &-label {
    font-size: $font-sm;
    font-weight: 600;
    color: $text-secondary;
  }
}

.nav-list { padding: $space-sm 0; }

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px $space-lg;
  cursor: pointer;
  font-size: $font-sm;
  color: $text-secondary;
  transition: all 0.15s;
  gap: $space-sm;
  border-left: 3px solid transparent;

  &:hover { background: $bg-page; color: $text-primary; }
  &.active {
    background: $primary-bg;
    color: $primary;
    border-left-color: $primary;
    font-weight: 500;
  }
}

.nav-icon { font-size: $font-base; width: 20px; text-align: center; }
.nav-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nav-arrow { font-size: 10px; color: $text-hint; }

.nav-sub {
  padding: 2px 0 4px $space-xl;
}

.nav-sub-item {
  padding: 7px $space-md;
  font-size: $font-xs;
  color: $text-secondary;
  cursor: pointer;
  border-radius: $radius-sm;
  margin: 1px 0;
  border-left: 3px solid transparent;

  &:hover { color: $primary; background: $primary-bg; }
  &.active {
    color: $primary;
    background: $primary-bg;
    border-left-color: $primary;
    font-weight: 500;
  }
  &.header-item {
    font-size: 11px;
    color: $text-hint;
    cursor: default;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: $space-xs;
    padding-top: 8px;
    border-top: 1px solid $border;
    &:hover { background: transparent; color: $text-hint; }
  }
}
</style>
