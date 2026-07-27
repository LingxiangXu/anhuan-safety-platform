<template>
  <div class="bpm-integration">
    <div class="page-header">
      <h2>OA审批集成对接</h2>
      <p class="page-subtitle">对接企业OA审批系统，实现安全审批业务统一流转：特殊作业许可、隐患整改督办、风险评价复核等审批环节推送至OA审批，审批结果实时回调同步</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stat-gallery">
      <div class="sc-v2" v-for="(s, i) in bpmStats" :key="s.label" :style="{ animationDelay: i * 0.05 + 's' }">
        <div class="scv2-glow" :style="{ background: s.grad }"></div>
        <div class="scv2-icon" :style="{ background: s.grad }">{{ s.icon }}</div>
        <div class="scv2-body">
          <span class="scv2-label">{{ s.label }}</span>
          <span class="scv2-value" :style="{ color: s.color }">{{ s.value }}</span>
          <span class="scv2-sub">{{ s.sub }}</span>
        </div>
        <div class="scv2-border" :style="{ background: s.grad }"></div>
      </div>
    </div>

    <!-- 对接架构图 -->
    <div class="section-card">
      <div class="section-head">
        <h3 class="section-title">🏗️ 对接架构总览</h3>
        <span class="section-sub">安全平台通过标准RESTful API与OA审批平台双向通信</span>
      </div>
      <div class="arch-diagram">
        <div class="arch-layer arch-source">
          <div class="arch-layer-title">安全平台（业务发起方）</div>
          <div class="arch-nodes">
            <div class="arch-node" v-for="m in sourceModules" :key="m.name">
              <span class="arch-node-icon">{{ m.icon }}</span>
              <span class="arch-node-name">{{ m.name }}</span>
            </div>
          </div>
        </div>
        <div class="arch-arrow">→</div>
        <div class="arch-layer arch-api">
          <div class="arch-layer-title">接口中间层（API Gateway）</div>
          <div class="arch-api-box">
            <div class="api-item" v-for="api in apiList" :key="api.name">
              <span class="api-method" :class="'m-' + api.method.toLowerCase()">{{ api.method }}</span>
              <span class="api-path">{{ api.path }}</span>
            </div>
          </div>
        </div>
        <div class="arch-arrow">→</div>
        <div class="arch-layer arch-target">
          <div class="arch-layer-title">企业OA审批平台（审批执行方）</div>
          <div class="arch-nodes">
            <div class="arch-node bpm-node" v-for="b in bpmFunctions" :key="b">
              <span class="arch-node-name">{{ b }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 审批流程配置 -->
    <div class="section-card">
      <div class="section-head">
        <h3 class="section-title">⚙️ 审批流程配置</h3>
        <span class="section-sub">以下业务审批环节已配置为走OA审批</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 60px">序号</th>
            <th>业务模块</th>
            <th>审批环节</th>
            <th>OA审批流程编码</th>
            <th>审批节点</th>
            <th style="width: 80px">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in flowConfig" :key="idx">
            <td class="center">{{ idx + 1 }}</td>
            <td>{{ row.module }}</td>
            <td>{{ row.step }}</td>
            <td><code class="flow-code">{{ row.bpmCode }}</code></td>
            <td>{{ row.nodes }}</td>
            <td class="center"><span :class="['status-badge', row.status === '已上线' ? 'badge-success' : 'badge-warning']">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 接口清单 -->
    <div class="section-card">
      <div class="section-head">
        <h3 class="section-title">🔌 接口清单</h3>
        <span class="section-sub">安全平台与OA审批系统之间的标准接口定义</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 60px">序号</th>
            <th style="width: 70px">方法</th>
            <th>接口路径</th>
            <th>功能说明</th>
            <th>方向</th>
            <th style="width: 80px">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in apiList" :key="idx">
            <td class="center">{{ idx + 1 }}</td>
            <td class="center"><span :class="['api-badge', 'm-' + row.method.toLowerCase()]">{{ row.method }}</span></td>
            <td><code class="api-path-cell">{{ row.path }}</code></td>
            <td>{{ row.desc }}</td>
            <td class="center">{{ row.direction }}</td>
            <td class="center"><span :class="['status-badge', row.status === '已联调' ? 'badge-success' : 'badge-info']">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 对接流程步骤条 -->
    <div class="section-card">
      <div class="section-head">
        <h3 class="section-title">🛠️ 对接实施流程</h3>
        <span class="section-sub">从需求分析到上线运行，共5个阶段</span>
      </div>
      <div class="flow-steps">
        <div class="flow-step" v-for="(step, idx) in implSteps" :key="idx"
          :class="{ done: idx < currentStep, active: idx === currentStep, pending: idx > currentStep }">
          <div class="step-circle">
            <span v-if="idx < currentStep">✓</span>
            <span v-else-if="idx === currentStep" class="pulse-dot"></span>
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <div class="step-content">
            <span class="step-label">{{ step.label }}</span>
            <span class="step-role">{{ step.role }}</span>
            <span class="step-desc">{{ step.desc }}</span>
          </div>
          <div class="step-connector" v-if="idx < implSteps.length - 1"></div>
        </div>
      </div>
    </div>

    <!-- 审批记录列表 -->
    <div class="section-card">
      <div class="section-head">
        <h3 class="section-title">📝 最近审批记录</h3>
        <span class="section-sub">通过OA审批系统流转的审批记录（最近10条）</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>审批编号</th>
            <th>业务类型</th>
            <th>标题</th>
            <th>发起人</th>
            <th>当前审批人</th>
            <th>发起时间</th>
            <th style="width: 80px">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in approvalRecords" :key="row.id">
            <td><code class="rec-id">{{ row.id }}</code></td>
            <td>{{ row.type }}</td>
            <td>{{ row.title }}</td>
            <td>{{ row.applicant }}</td>
            <td>{{ row.approver }}</td>
            <td class="muted">{{ row.time }}</td>
            <td class="center"><span :class="['status-badge', 'badge-' + row.badge]">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 对接说明 -->
    <div class="section-card">
      <div class="section-head">
        <h3 class="section-title">💡 对接说明</h3>
      </div>
      <div class="notes-grid">
        <div class="note-item" v-for="n in notes" :key="n.title">
          <div class="note-icon">{{ n.icon }}</div>
          <div class="note-body">
            <h5>{{ n.title }}</h5>
            <p>{{ n.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { workApprovalMatrix } from '@/store/safeData';

export default {
  name: 'BpmIntegration',
  data() {
    return {
      currentStep: 3,
      bpmStats: [
        { icon: '🔗', label: '已对接接口', value: '8', sub: '全部联调通过', grad: 'linear-gradient(135deg, #0075E6, #57A3FF)', color: '#0075E6' },
        { icon: '✅', label: '配置审批流', value: '11', sub: '9已上线 / 2待上线', grad: 'linear-gradient(135deg, #009118, #42D056)', color: '#009118' },
        { icon: '📊', label: '审批通过率', value: '94.2%', sub: '近30天统计', grad: 'linear-gradient(135deg, #007714, #00AA1C)', color: '#00AA1C' },
        { icon: '⏱️', label: '平均审批时长', value: '4.6h', sub: '较线下缩短68%', grad: 'linear-gradient(135deg, #D97706, #FBBF24)', color: '#D97706' }
      ],
      sourceModules: [
        { icon: '⚙️', name: '特殊作业管控' },
        { icon: '🔍', name: '隐患治理督办' },
        { icon: '⚠️', name: '风险管理' }
      ],
      bpmFunctions: [
        '流程定义引擎',
        '审批节点路由',
        '待办任务管理',
        '审批历史记录',
        '消息通知推送',
        '超时催办机制'
      ],
      apiList: [
        { method: 'POST', path: '/api/oa/flow/start', desc: '发起审批流程（推送业务数据到OA）', direction: '安全平台→OA', status: '已联调' },
        { method: 'GET', path: '/api/oa/flow/status', desc: '查询流程审批状态（待办/已办/已驳回）', direction: '安全平台→OA', status: '已联调' },
        { method: 'GET', path: '/api/oa/todo/list', desc: '获取当前用户待办任务列表', direction: '安全平台→OA', status: '已联调' },
        { method: 'GET', path: '/api/oa/flow/history', desc: '获取流程审批历史记录', direction: '安全平台→OA', status: '已联调' },
        { method: 'POST', path: '/api/oa/flow/urge', desc: '催办待审批任务（超时自动触发）', direction: '安全平台→OA', status: '已联调' },
        { method: 'POST', path: '/api/safety/approval/callback', desc: '审批结果回调（OA推送审批结果到安全平台）', direction: 'OA→安全平台', status: '已联调' },
        { method: 'POST', path: '/api/safety/approval/terminate', desc: '流程终止通知（OA通知安全平台流程被终止）', direction: 'OA→安全平台', status: '已联调' },
        { method: 'GET', path: '/api/oa/user/approvers', desc: '获取可用的审批人列表（按角色/部门）', direction: '安全平台→OA', status: '已联调' }
      ],
      implSteps: [
        { label: '需求分析', role: '业务+研发', desc: '梳理安全审批场景，确认走OA的审批环节，定义流程编码和审批节点' },
        { label: '接口设计', role: '双方研发', desc: '设计RESTful接口规范，定义请求/响应JSON结构，约定鉴权方式（OAuth2 Token）' },
        { label: '接口开发', role: '双方研发', desc: '安全平台开发推送逻辑，OA侧配置流程模板和回调接口' },
        { label: '联调测试', role: '双方研发+测试', desc: '端到端联调，覆盖正常审批/驳回/超时/终止等场景，验证数据一致性' },
        { label: '上线运行', role: '运维+业务', desc: '灰度上线，监控接口调用成功率和响应时间，逐步全量切换' }
      ],
      approvalRecords: [
        { id: 'OA-20260717-008', type: '特殊作业', title: 'GZ20260716001 临时用电作业许可', applicant: '王志强', approver: '李明亮（安环主管）', time: '2026-07-17 09:15', status: '审批中', badge: 'info' },
        { id: 'OA-20260717-007', type: '风险管理', title: 'LEC-006 风险评价复核', applicant: '赵海峰', approver: '李明亮（安环主管）', time: '2026-07-17 08:40', status: '已通过', badge: 'success' },
        { id: 'OA-20260716-012', type: '特殊作业', title: 'GZ20260715003 高处作业许可', applicant: '孙伟', approver: '张建国（车间主任）', time: '2026-07-16 16:20', status: '已通过', badge: 'success' },
        { id: 'OA-20260716-011', type: '特殊作业', title: 'GZ20260715002 吊装作业许可', applicant: '刘洋', approver: '张建国（车间主任）', time: '2026-07-16 14:05', status: '已驳回', badge: 'danger' },
        { id: 'OA-20260716-010', type: '风险管理', title: 'LEC-005 风险评价复核', applicant: '赵海峰', approver: '李明亮（安环主管）', time: '2026-07-16 10:30', status: '已通过', badge: 'success' },
        { id: 'OA-20260715-009', type: '特殊作业', title: 'GZ20260714001 高处作业许可', applicant: '孙伟', approver: '张建国（车间主任）', time: '2026-07-15 15:45', status: '已通过', badge: 'success' },
        { id: 'OA-20260715-008', type: '特殊作业', title: 'GZ20260714002 临时用电作业许可', applicant: '王志强', approver: '李明亮（安环主管）', time: '2026-07-15 11:20', status: '已通过', badge: 'success' },
        { id: 'OA-20260714-007', type: '风险管理', title: 'LEC-004 风险评价复核', applicant: '赵海峰', approver: '李明亮（安环主管）', time: '2026-07-14 09:30', status: '已通过', badge: 'success' },
        { id: 'OA-20260714-006', type: '特殊作业', title: 'GZ20260713001 吊装作业许可', applicant: '刘洋', approver: '张建国（车间主任）', time: '2026-07-14 08:15', status: '已通过', badge: 'success' },
        { id: 'OA-20260713-005', type: '特殊作业', title: 'GZ20260712002 高处作业许可', applicant: '孙伟', approver: '张建国（车间主任）', time: '2026-07-13 14:50', status: '已通过', badge: 'success' }
      ],
      notes: [
        { icon: '🔐', title: '鉴权方式', text: '采用OAuth2 Client Credentials模式，安全平台和OA审批系统互为可信客户端，Token有效期2小时，自动刷新。' },
        { icon: '🔄', title: '数据同步', text: '审批状态变更通过Webhook回调实时同步，同时每5分钟全量轮询补偿，确保数据最终一致性。' },
        { icon: '📄', title: '数据格式', text: '统一使用JSON格式，业务数据包含流程编码、业务ID、标题、发起人、审批人列表、附件URL等字段。' },
        { icon: '⏰', title: '超时处理', text: 'OA侧配置审批超时规则（普通24h/紧急4h），超时自动催办并通知安全平台，安全平台同步展示预警。' },
        { icon: '🔁', title: '重试机制', text: '接口调用失败自动重试3次（间隔10s/30s/60s），仍失败则记录异常日志并告警运维。' },
        { icon: '📡', title: '监控告警', text: '接口调用成功率、响应时间、待办积压量等指标接入统一监控面板，异常自动钉钉/邮件告警。' }
      ]
    };
  },
  computed: {
    /**
     * 审批流程配置：特殊作业管控按「作业类型 + 级别」从审批矩阵动态生成 OA 审批节点，
     * 其余业务（隐患治理、风险管理）保持固定配置。
     */
    flowConfig() {
      const swRows = [];
      const order = ['HIGH_ALTITUDE', 'FIRE', 'LIFTING', 'TEMPORARY_ELECTRICITY'];
      order.forEach((key, i) => {
        const cfg = workApprovalMatrix[key];
        if (!cfg) return;
        // 取该类型最高级别的审批链（代表最完整的 OA 路由），并补"作业申请/现场部门负责人"通用前置
        const topLevel = cfg.levels[cfg.levels.length - 1];
        const chain = topLevel ? topLevel.chain : [];
        const nodes = chain.join(' → ');
        swRows.push({
          module: '特殊作业管控',
          step: `分级审批（${cfg.label}）`,
          bpmCode: `SW-${key}-APPROVAL-${String(i + 1).padStart(3, '0')}`,
          nodes,
          status: '已上线'
        });
        swRows.push({
          module: '特殊作业管控',
          step: `完工验收（${cfg.label}）`,
          bpmCode: `SW-${key}-ACCEPT-${String(i + 1).padStart(3, '0')}`,
          nodes: '现场监护人 → 安环室',
          status: '已上线'
        });
      });
      return [
        ...swRows,
        { module: '隐患治理督办', step: '隐患整改分派', bpmCode: 'HZ-DISPATCH-001', nodes: '安环科→责任部门', status: '待上线' },
        { module: '隐患治理督办', step: '复查验收闭环', bpmCode: 'HZ-REVIEW-002', nodes: '整改人→安环科', status: '待上线' },
        { module: '风险管理', step: 'LEC评价复核', bpmCode: 'RM-LEC-REVIEW-001', nodes: '安环专员→安环主管', status: '已上线' }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.bpm-integration { max-width: $content-max-width; margin: 0 auto; }

.page-header {
  margin-bottom: $space-xl;
  h2 { font-size: $font-2xl; font-weight: 700; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; line-height: 1.6; }
}

/* 统计卡片 */
.stat-gallery {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: $space-lg; margin-bottom: $space-xl;
}
.sc-v2 {
  position: relative; background: $bg-card; border-radius: $radius-lg; padding: $space-lg;
  display: flex; align-items: center; gap: $space-md; overflow: hidden;
  box-shadow: $shadow-sm; animation: fadeInUp 0.5s $transition-smooth both;
  transition: transform 0.3s $transition-smooth, box-shadow 0.3s $transition-smooth;
  &:hover { transform: translateY(-3px); box-shadow: $shadow-md; }
}
.scv2-glow { position: absolute; top: -40px; right: -40px; width: 100px; height: 100px; border-radius: 50%; opacity: 0.08; }
.scv2-icon { width: 44px; height: 44px; border-radius: $radius-md; display: flex; align-items: center; justify-content: center; font-size: 22px; color: $text-inverse; flex-shrink: 0; }
.scv2-body { display: flex; flex-direction: column; gap: 2px; z-index: 1; }
.scv2-label { font-size: $font-xs; color: $text-hint; font-weight: 500; }
.scv2-value { font-size: $font-2xl; font-weight: 800; line-height: 1.2; }
.scv2-sub { font-size: 10px; color: $text-hint; }
.scv2-border { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }

/* 区块卡片 */
.section-card {
  background: $bg-card; border-radius: $radius-lg; padding: $space-xl;
  margin-bottom: $space-lg; box-shadow: $shadow-sm;
}
.section-head { display: flex; align-items: center; gap: $space-md; margin-bottom: $space-lg; flex-wrap: wrap; }
.section-title { font-size: $font-lg; font-weight: 700; color: $text-primary; margin: 0; }
.section-sub { font-size: $font-xs; color: $text-hint; }

/* 架构图 */
.arch-diagram { display: flex; flex-direction: column; align-items: center; gap: $space-md; }
.arch-layer {
  width: 100%; border-radius: $radius-lg; padding: $space-lg;
  &.arch-source { background: linear-gradient(135deg, #E8F4FD, #F0F8FF); border: 2px solid $brand-200; }
  &.arch-api { background: linear-gradient(135deg, #FFF7ED, #FFFBEB); border: 2px solid #FDBA74; }
  &.arch-target { background: linear-gradient(135deg, #f0fdf4, #ECFDF5); border: 2px solid #86EFAC; }
}
.arch-layer-title { font-size: $font-sm; font-weight: 700; color: $text-secondary; margin-bottom: $space-md; text-align: center; }
.arch-nodes { display: flex; flex-wrap: wrap; gap: $space-md; justify-content: center; }
.arch-node {
  background: $bg-card; border-radius: $radius-md; padding: $space-sm $space-md;
  display: flex; align-items: center; gap: $space-sm; box-shadow: $shadow-xs;
  &.bpm-node { border: 1px solid #86EFAC; }
}
.arch-node-icon { font-size: 18px; }
.arch-node-name { font-size: $font-sm; font-weight: 600; color: $text-primary; }
.arch-arrow { font-size: 24px; color: $text-hint; line-height: 1; }
.arch-api-box { display: flex; flex-direction: column; gap: $space-sm; max-width: 600px; margin: 0 auto; }
.api-item {
  background: $bg-card; border-radius: $radius-sm; padding: $space-sm $space-md;
  display: flex; align-items: center; gap: $space-sm; box-shadow: $shadow-xs;
}
.api-method { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: $radius-xs; color: $text-inverse; }
.m-get { background: $accent-green; }
.m-post { background: $primary; }
.api-path { font-family: $font-mono; font-size: $font-xs; color: $text-secondary; }

/* 数据表格 */
.data-table {
  width: 100%; border-collapse: collapse; font-size: $font-sm;
  thead { tr { border-bottom: 2px solid $border; } th { padding: $space-md $space-sm; text-align: left; font-weight: 600; color: $text-secondary; font-size: $font-xs; white-space: nowrap; } }
  tbody { tr { border-bottom: 1px solid $border-light; transition: background 0.15s; &:hover { background: $primary-bg; } } td { padding: $space-md $space-sm; color: $text-primary; } }
  .center { text-align: center; }
  .muted { color: $text-hint; font-size: $font-xs; }
}
.flow-code { font-family: $font-mono; font-size: $font-xs; background: $gray-100; padding: 2px 6px; border-radius: $radius-xs; color: $primary; }
.api-path-cell { font-family: $font-mono; font-size: $font-xs; color: $text-secondary; }
.rec-id { font-family: $font-mono; font-size: $font-xs; color: $primary; font-weight: 600; }
.api-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: $radius-xs; color: $text-inverse; display: inline-block; }
.status-badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: $radius-full; display: inline-block; }
.badge-success { background: $success-100; color: $success-700; }
.badge-warning { background: $warning-100; color: $warning-700; }
.badge-info { background: $info-bg; color: $primary; }
.badge-danger { background: $danger-100; color: $danger-700; }

/* 流程步骤条 */
.flow-steps { display: flex; align-items: flex-start; gap: 0; overflow-x: auto; padding-bottom: $space-sm; }
.flow-step { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 180px; position: relative; }
.step-circle {
  width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: $font-sm; font-weight: 700; z-index: 2; position: relative;
  transition: all 0.3s $transition-smooth;
}
.flow-step.done .step-circle { background: $accent-green; color: $text-inverse; box-shadow: 0 2px 8px rgba(0,170,28,0.3); }
.flow-step.active .step-circle { background: $primary; color: $text-inverse; box-shadow: 0 2px 12px rgba(0,117,230,0.4); }
.flow-step.pending .step-circle { background: $gray-100; color: $text-hint; border: 2px solid $gray-200; }
.pulse-dot { width: 10px; height: 10px; border-radius: 50%; background: $bg-card; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
.step-content { display: flex; flex-direction: column; align-items: center; gap: 2px; margin-top: $space-sm; text-align: center; }
.step-label { font-size: $font-sm; font-weight: 600; color: $text-primary; }
.step-role { font-size: 10px; color: $text-hint; }
.step-desc { font-size: $font-xs; color: $text-secondary; line-height: 1.5; max-width: 160px; margin-top: 2px; }
.step-connector { position: absolute; top: 18px; left: 50%; width: 100%; height: 3px; background: $gray-200; z-index: 1; }
.flow-step.done .step-connector { background: $accent-green; }

/* 对接说明 */
.notes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-lg; }
.note-item { display: flex; gap: $space-md; padding: $space-md; background: $gray-50; border-radius: $radius-md; }
.note-icon { font-size: 24px; flex-shrink: 0; }
.note-body { h5 { font-size: $font-sm; font-weight: 700; color: $text-primary; margin: 0 0 $space-xs; } p { font-size: $font-xs; color: $text-secondary; line-height: 1.6; margin: 0; } }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
</style>
