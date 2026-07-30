<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { ElTag } from 'element-plus'
import 'element-plus/es/components/tag/style/css'

type Pilot = {
  company: string
  workArea: string
  phase: string
  focus: string[]
}

const pilot = ref<Pilot>({
  company: '铸锻件分公司',
  workArea: '机加工作业区',
  phase: '生产底座与首条闭环',
  focus: ['机械伤害', '起重吊装', '临时用电', '设备点检', '油液泄漏', '通道管理']
})

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/v1/system/pilot')
    pilot.value = data.data
  } catch {
    // 后端未启动时仍展示已冻结的样板区基线。
  }
})

const modules = [
  { name: '风险台账', status: '待开发', description: '危险源、分级、管控措施与责任人' },
  { name: '巡检任务', status: '待开发', description: '计划生成、现场执行与结果留痕' },
  { name: '隐患治理', status: '待开发', description: '上报、整改、复查、关闭与逾期督办' },
  { name: '组织权限', status: '建模中', description: '六个作业区统一组织与数据权限' }
]
</script>

<template>
  <div class="page">
    <header>
      <div>
        <p class="eyebrow">安全管理平台 · 一期样板点</p>
        <h1>{{ pilot.workArea }}</h1>
        <p>{{ pilot.company }} · {{ pilot.phase }}</p>
      </div>
      <el-tag type="success" effect="dark">范围已冻结</el-tag>
    </header>

    <main>
      <section class="panel">
        <div class="section-title">
          <div>
            <span>现场风险重点</span>
            <h2>先围绕真实检查场景建闭环</h2>
          </div>
          <small>首轮调研基线</small>
        </div>
        <div class="focus-grid">
          <div v-for="(item, index) in pilot.focus" :key="item" class="focus-item">
            <strong>{{ String(index + 1).padStart(2, '0') }}</strong>
            <span>{{ item }}</span>
          </div>
        </div>
      </section>

      <section class="module-grid">
        <article v-for="item in modules" :key="item.name" class="module-card">
          <div>
            <h3>{{ item.name }}</h3>
            <el-tag size="small" :type="item.status === '建模中' ? 'warning' : 'info'">
              {{ item.status }}
            </el-tag>
          </div>
          <p>{{ item.description }}</p>
        </article>
      </section>

      <section class="flow">
        <span>巡检发现</span><b>→</b><span>隐患上报</span><b>→</b>
        <span>责任整改</span><b>→</b><span>安环复查</span><b>→</b><span>闭环归档</span>
      </section>
    </main>
  </div>
</template>
