<template>
  <div class="phone-frame">
    <div class="phone-notch"></div>
    <div class="phone-screen">
      <div class="app-statusbar">
        <span class="as-time">9:41</span>
        <span class="as-icons">📶 🔋</span>
      </div>
      <div class="app-navbar">
        <span class="an-back" v-if="showBack" @click="$emit('back')">&lsaquo;</span>
        <span class="an-title">{{ title }}</span>
      </div>
      <div class="app-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PhoneFrame',
  props: {
    title: { type: String, default: '' },
    showBack: { type: Boolean, default: false }
  }
};
</script>

<style scoped lang="scss">
/* 与移动工作台完全一致的统一手机壳（深色边框 + 绿色状态栏 + 白底导航栏） */
.phone-frame { width: 400px; flex-shrink: 0; background: #1a1a2e; border-radius: 36px; padding: 12px; box-shadow: 0 8px 40px rgba(0,0,0,0.25); }
.phone-notch { width: 120px; height: 24px; background: #1a1a2e; margin: 0 auto 8px; border-radius: 0 0 18px 18px; }
.phone-screen { background: #f5f5f5; border-radius: 24px; overflow: hidden; min-height: 600px; max-height: 650px; display: flex; flex-direction: column; font-size: 12px; }

.app-statusbar { display: flex; justify-content: space-between; padding: 8px 20px; background: #2E7D32; color: #fff; font-size: 10px; }

.app-navbar { display: flex; align-items: center; padding: 8px 16px; background: #fff; border-bottom: 1px solid #eee; min-height: 36px;
  .an-back { font-size: 22px; color: #2E7D32; cursor: pointer; width: 24px; font-weight: 300; line-height: 1; }
  .an-title { flex: 1; text-align: center; font-weight: 600; font-size: 13px; color: #334155; }
}

.app-body { flex: 1; overflow-y: auto; padding: 8px 12px; display: flex; flex-direction: column; gap: 8px; }
</style>
