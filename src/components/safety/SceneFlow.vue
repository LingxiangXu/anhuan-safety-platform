<template>
  <div class="scene-flow" :class="{ 'sf-collapsed': collapsed }">
    <button class="sf-head" type="button" @click="collapsed = !collapsed">
      <span class="sf-icon">🔄</span>
      <span class="sf-title">{{ flow.title }}</span>
      <span class="sf-toggle">{{ collapsed ? '展开 ▾' : '收起 ▴' }}</span>
    </button>
    <transition name="sf-expand">
      <div v-show="!collapsed" class="sf-body">
        <div v-if="flow.subtitle" class="sf-subtitle">📌 {{ flow.subtitle }}</div>
        <template v-if="flow.groups">
          <div class="sf-group" v-for="(g, gi) in flow.groups" :key="'g-' + gi">
            <div class="sf-group-title" v-if="g.title">{{ g.title }}</div>
            <div class="sf-steps">
              <template v-for="(s, i) in g.steps">
                <div class="sf-step" :key="'g' + gi + '-step-' + i">
                  <div class="sf-dot">{{ i + 1 }}</div>
                  <div class="sf-step-body">
                    <div class="sf-step-name">{{ s.name }}</div>
                    <div v-if="s.desc" class="sf-step-desc">{{ s.desc }}</div>
                  </div>
                </div>
                <div v-if="i < g.steps.length - 1" class="sf-arrow" :key="'g' + gi + '-arrow-' + i">→</div>
              </template>
            </div>
          </div>
        </template>
        <div class="sf-steps" v-else>
          <template v-for="(s, i) in flow.steps">
            <div class="sf-step" :key="'step-' + i">
              <div class="sf-dot">{{ i + 1 }}</div>
              <div class="sf-step-body">
                <div class="sf-step-name">{{ s.name }}</div>
                <div v-if="s.desc" class="sf-step-desc">{{ s.desc }}</div>
              </div>
            </div>
            <div v-if="i < flow.steps.length - 1" class="sf-arrow" :key="'arrow-' + i">→</div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { sceneFlows } from '@/data/sceneFlows';

export default {
  name: 'SceneFlow',
  props: {
    flowKey: { type: String, required: true }
  },
  data() {
    return {
      collapsed: false
    };
  },
  computed: {
    flow() {
      return sceneFlows[this.flowKey] || { title: '本场景主流程', steps: [] };
    }
  }
};
</script>

<style scoped>
.scene-flow {
  background: linear-gradient(180deg, #f4f9ff 0%, #eef5ff 100%);
  border: 1px solid #cfe0f5;
  border-left: 4px solid #0075E6;
  border-radius: 12px;
  margin: 0 0 18px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 117, 230, 0.08);
}
.sf-collapsed {
  background: #f4f9ff;
}
.sf-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
}
.sf-head:hover { background: rgba(0, 117, 230, 0.06); }
.sf-icon { font-size: 16px; }
.sf-title {
  font-size: 15px;
  font-weight: 700;
  color: #0b3d91;
  letter-spacing: .3px;
}
.sf-count {
  font-size: 12px;
  color: #0075E6;
  background: #e1edff;
  border-radius: 20px;
  padding: 2px 10px;
  font-weight: 600;
}
.sf-subtitle {
  margin: 0 16px 12px;
  padding: 7px 12px;
  background: #fff7e6;
  border: 1px solid #ffe0a3;
  border-radius: 8px;
  font-size: 12.5px;
  color: #8a5a00;
  line-height: 1.5;
}
.sf-toggle {
  margin-left: auto;
  font-size: 12px;
  color: #5b7aa8;
  font-weight: 600;
}
.sf-body {
  padding: 4px 16px 16px;
}
.sf-steps {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 4px 0;
}
.sf-group { margin-top: 12px; }
.sf-group:first-of-type { margin-top: 0; }
.sf-group-title {
  font-size: 12px;
  font-weight: 700;
  color: #0b3d91;
  margin: 0 0 8px;
  padding-left: 10px;
  border-left: 3px solid #0075E6;
  line-height: 1.2;
}
.sf-group + .sf-group { border-top: 1px dashed #cfe0f5; padding-top: 12px; }
.sf-step {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e2ecf7;
  border-radius: 10px;
  padding: 8px 12px;
  min-width: 150px;
  flex: 0 1 auto;
}
.sf-dot {
  flex: 0 0 22px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #0075E6;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sf-step-body { display: flex; flex-direction: column; }
.sf-step-name { font-size: 13px; font-weight: 600; color: #14315e; }
.sf-step-desc { font-size: 11px; color: #6b7d99; margin-top: 1px; line-height: 1.35; }
.sf-arrow {
  flex: 0 0 auto;
  color: #9bb4d6;
  font-size: 15px;
  font-weight: 700;
  padding: 0 6px;
  display: flex;
  align-items: center;
}
.sf-expand-enter-active, .sf-expand-leave-active {
  transition: opacity .2s ease;
}
.sf-expand-enter, .sf-expand-leave-to { opacity: 0; }

@media (max-width: 1100px) {
  .sf-arrow { display: none; }
  .sf-step { flex: 1 1 100%; }
}
</style>
