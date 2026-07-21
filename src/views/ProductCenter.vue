<template>
  <div class="product-center">
    <header class="pc-header">
      <div class="pc-header-inner">
        <div class="pc-brand">
          <div class="pc-brand-icon">TZ</div>
          <div class="pc-brand-text">
            <h1>山西太重数智科技股份有限公司</h1>
            <p>产品中心</p>
          </div>
        </div>
        <div class="pc-header-tag">AI-Driven Product Design</div>
      </div>
    </header>

    <main class="pc-main">
      <div class="pc-grid">
        <div
          class="product-card"
          v-for="product in products"
          :key="product.id"
          @click="goProduct(product.route)"
        >
          <div class="product-card-icon" :style="{ background: product.gradient }">
            <span class="icon-text">{{ product.icon }}</span>
          </div>
          <div class="product-card-body">
            <h3 class="product-card-name">{{ product.name }}</h3>
            <p class="product-card-desc">{{ product.desc }}</p>
            <div class="product-card-tags">
              <span class="tag" v-for="tag in product.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="product-card-arrow">&rarr;</div>
        </div>
      </div>
    </main>

    <footer class="pc-footer">
      <span>&copy; 2026 山西太重数智科技股份有限公司 &middot; 产品中心</span>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'ProductCenter',
  data() {
    return {
      products: [
        {
          id: 1,
          name: '众云智运',
          desc: '园区内部运输调度管理系统 —— 覆盖甩挂车等七类车型，实现运输需求从发起、调度、执行到结算的全链路数字化管理',
          icon: '🚛',
          gradient: 'linear-gradient(135deg, #1a5fdc, #4facfe)',
          tags: ['运输调度', 'GIS地图', '甩挂车', '自动结算'],
          route: '/smart-logistics'
        },
        {
          id: 2,
          name: '安全管理平台',
          desc: '依据行业安全管理标准，建设涵盖安全双控体系（风险辨识、隐患治理）、特殊作业管控（作业票）、安全督办、培训中心集成的安全综合管理平台，实现安全制度落地、风险分级管控与隐患排查治理全面数字化管理',
          icon: '🛡️',
          gradient: 'linear-gradient(135deg, #c62828, #ef5350)',
          tags: ['双控体系', '风险辨识', '隐患治理', '特殊作业', '安全督办'],
          route: '/safety-platform'
        }
      ]
    };
  },
  methods: {
    goProduct(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.product-center {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f0f4ff 0%, $bg-page 100%);
}

.pc-header {
  background: #fff;
  border-bottom: 1px solid $border;
  padding: 0 $space-3xl;
  height: 72px;
  display: flex;
  align-items: center;
  &-inner {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-tag {
    font-size: $font-sm;
    color: $primary;
    background: $primary-bg;
    padding: 4px 14px;
    border-radius: 20px;
    font-weight: 500;
  }
}

.pc-brand {
  display: flex;
  align-items: center;
  gap: $space-base;
  &-icon {
    width: 42px; height: 42px;
    background: $primary;
    color: #fff;
    border-radius: $radius-base;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
    font-size: $font-md;
  }
  &-text {
    h1 { font-size: $font-md; font-weight: 600; color: $text-primary; line-height: 1.3; }
    p { font-size: $font-xs; color: $text-hint; letter-spacing: 2px; }
  }
}

.pc-main {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: $space-3xl $space-xl;
}

.pc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: $space-xl;
  max-width: 950px;
  width: 100%;
}

.product-card {
  background: #fff;
  border-radius: $radius-xl;
  padding: $space-2xl;
  display: flex;
  align-items: flex-start;
  gap: $space-lg;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid $border;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-xl;
    border-color: $primary-light;
    .product-card-arrow { opacity: 1; transform: translateX(0); }
  }

  &-icon {
    width: 56px; height: 56px;
    border-radius: $radius-lg;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    .icon-text { font-size: 28px; }
  }
  &-body { flex: 1; min-width: 0; }
  &-name { font-size: $font-lg; font-weight: 600; color: $text-primary; margin-bottom: $space-sm; }
  &-desc {
    font-size: $font-sm; color: $text-secondary; line-height: 1.6; margin-bottom: $space-md;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  &-tags { display: flex; gap: $space-xs; flex-wrap: wrap; }
  .tag {
    font-size: $font-xs; color: $primary; background: $primary-bg;
    padding: 2px 10px; border-radius: $radius-sm;
  }
  &-arrow {
    position: absolute; right: 20px; top: 50%;
    transform: translateY(-50%) translateX(-8px);
    font-size: $font-xl; color: $primary; opacity: 0; transition: all 0.25s ease;
  }
}

.pc-footer {
  text-align: center;
  padding: $space-lg;
  font-size: $font-xs;
  color: $text-hint;
}
</style>
