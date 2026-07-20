<template>
  <div class="factory-map">
    <svg viewBox="0 0 680 500" width="100%" role="img" xmlns="http://www.w3.org/2000/svg">
      <title>铸锻件分公司厂区风险四色图</title>
      <desc>风险四色区域示意：红/橙/黄/蓝对应重大/较大/一般/低风险</desc>

      <!-- 厂区轮廓背景 -->
      <rect x="40" y="20" width="620" height="440" rx="12" fill="#fafbfc" stroke="#d1d5db" stroke-width="1"/>

      <!-- 熔炼铸造区 红色 -->
      <rect x="60" y="45" width="170" height="110" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="145" y="70" text-anchor="middle" font-size="14" font-weight="600" fill="#ef4444">熔炼铸造区</text>
      <text x="145" y="90" text-anchor="middle" font-size="11" fill="#991b1b">重大风险</text>
      <circle cx="80" cy="120" r="5" fill="#ef4444" opacity="0.6"/><text x="92" y="124" font-size="10" fill="#b91c1c">中频炉</text>
      <circle cx="80" cy="138" r="5" fill="#ef4444" opacity="0.6"/><text x="92" y="142" font-size="10" fill="#b91c1c">浇注坑</text>

      <!-- 锻压加工区 红色 -->
      <rect x="260" y="45" width="160" height="110" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="340" y="70" text-anchor="middle" font-size="14" font-weight="600" fill="#ef4444">锻压加工区</text>
      <text x="340" y="90" text-anchor="middle" font-size="11" fill="#991b1b">重大风险</text>
      <circle cx="280" cy="120" r="5" fill="#ef4444" opacity="0.6"/><text x="292" y="124" font-size="10" fill="#b91c1c">8000T锻压机</text>

      <!-- 热处理区 橙色 -->
      <rect x="450" y="45" width="150" height="110" rx="8" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="525" y="70" text-anchor="middle" font-size="14" font-weight="600" fill="#f59e0b">热处理区</text>
      <text x="525" y="90" text-anchor="middle" font-size="11" fill="#92400e">较大风险</text>

      <!-- 大型构件吊装区 红色 + 作业标记 -->
      <rect x="60" y="180" width="180" height="110" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="150" y="205" text-anchor="middle" font-size="14" font-weight="600" fill="#ef4444">大型构件吊装区</text>
      <text x="150" y="225" text-anchor="middle" font-size="11" fill="#991b1b">重大风险</text>
      <circle cx="100" cy="255" r="5" fill="#ef4444" opacity="0.6"/><text x="112" y="259" font-size="10" fill="#b91c1c">桥式起重机</text>
      <!-- 作业中标记 -->
      <rect x="130" y="240" width="90" height="28" rx="14" fill="#3b82f6" opacity="0.9"/>
      <text x="175" y="258" text-anchor="middle" font-size="10" fill="#fff" font-weight="500">吊装作业中</text>

      <!-- 厂房屋面检修区 橙色 + 作业标记 -->
      <rect x="270" y="180" width="170" height="110" rx="8" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="355" y="205" text-anchor="middle" font-size="14" font-weight="600" fill="#f59e0b">厂房屋面检修区</text>
      <text x="355" y="225" text-anchor="middle" font-size="11" fill="#92400e">较大风险</text>
      <rect x="300" y="245" width="95" height="28" rx="14" fill="#0ea85e" opacity="0.85"/>
      <text x="347" y="263" text-anchor="middle" font-size="10" fill="#fff" font-weight="500">高处待监护</text>

      <!-- 仓储装卸区 黄色 -->
      <rect x="470" y="180" width="150" height="110" rx="8" fill="#fefce8" stroke="#eab308" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="545" y="205" text-anchor="middle" font-size="14" font-weight="600" fill="#eab308">仓储装卸区</text>
      <text x="545" y="225" text-anchor="middle" font-size="11" fill="#854d0e">一般风险</text>

      <!-- 能源介质区 橙色 -->
      <rect x="150" y="320" width="380" height="100" rx="8" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="340" y="350" text-anchor="middle" font-size="14" font-weight="600" fill="#f59e0b">能源介质区</text>
      <text x="340" y="370" text-anchor="middle" font-size="11" fill="#92400e">较大风险</text>
      <circle cx="220" cy="390" r="4" fill="#f59e0b" opacity="0.6"/><text x="230" y="394" font-size="10" fill="#92400e">变电站</text>
      <circle cx="390" cy="390" r="4" fill="#f59e0b" opacity="0.6"/><text x="400" y="394" font-size="10" fill="#92400e">燃气调压站</text>

      <!-- 图例 -->
      <rect x="60" y="450" width="8" height="8" rx="2" fill="#ef4444"/>
      <text x="74" y="458" font-size="10" fill="#6b7280">重大风险</text>
      <rect x="140" y="450" width="8" height="8" rx="2" fill="#f59e0b"/>
      <text x="154" y="458" font-size="10" fill="#6b7280">较大风险</text>
      <rect x="220" y="450" width="8" height="8" rx="2" fill="#eab308"/>
      <text x="234" y="458" font-size="10" fill="#6b7280">一般风险</text>
      <rect x="300" y="450" width="8" height="8" rx="2" fill="#3b82f6"/>
      <text x="314" y="458" font-size="10" fill="#6b7280">低风险</text>
      <circle cx="400" cy="454" r="4" fill="#ef4444" opacity="0.6"/>
      <text x="410" y="458" font-size="10" fill="#6b7280">风险点</text>
      <rect x="460" y="446" width="60" height="16" rx="8" fill="#3b82f6" opacity="0.8"/>
      <text x="490" y="458" text-anchor="middle" font-size="9" fill="#fff">作业标记</text>
    </svg>
  </div>
</template>

<script>
export default { name: 'FactoryMap' };
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
.factory-map { background: #fff; border-radius: $radius-lg; border: 1px solid $border; padding: $space-base; }
</style>
