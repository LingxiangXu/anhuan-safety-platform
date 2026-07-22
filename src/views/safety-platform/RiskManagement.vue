<template>
  <div class="risk-management">
    <SceneFlow flow-key="risk" />
    <!-- 标签切换 -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-btn', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >{{ tab.icon }} {{ tab.label }}</button>
    </div>

    <!-- 统计卡片 - 渐变玻璃态 -->
    <div class="stat-gallery">
      <div class="sc-v2" v-for="(s, i) in riskStats" :key="s.label"
        :style="{ animationDelay: i * 0.05 + 's' }">
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

    <!-- ====== 辨识登记 ====== -->
    <div class="section-card" v-show="activeTab === 'identify'">
      <div class="section-head">
        <h3 class="section-title">🔍 风险辨识与登记</h3>
        <span class="section-sub">划分风险单元 → 辨识危险源 → 制定管控措施，共 {{ riskLedger.length }} 个风险点</span>
        <button class="btn-add-risk" @click="openNewRiskForm">＋ 新增风险点</button>
      </div>

      <!-- 双侧布局：左侧列表 + 右侧编辑 -->
      <div class="identify-layout">
        <div class="identify-left">
          <div class="left-search">
            <input v-model="identifySearch" placeholder="搜索风险点..." class="search-input" />
          </div>
          <div class="unit-list">
            <div v-for="r in filteredRiskLedger" :key="r.id"
              :class="['unit-row', { active: editingRiskId === r.id }]"
              @click="startEdit(r.id)">
              <div class="unit-top">
                <span class="unit-name">{{ r.name }}</span>
                <span :class="['tag', 'tag-' + getLevelTag(r.level)]">⬤ {{ r.level }}</span>
              </div>
              <div class="unit-meta">{{ r.area }} · {{ r.category }} · {{ r.hazardousSources.length }}危险源 · {{ r.controls.length }}管控措施</div>
            </div>
            <div v-if="filteredRiskLedger.length === 0" class="empty-hint">无匹配风险点</div>
          </div>
        </div>

        <div class="identify-right" v-if="editTarget">
          <!-- 基本信息 -->
          <div class="edit-section">
            <h5 class="sec-title">📌 基本信息</h5>
            <div class="form-grid-2">
              <div class="form-item">
                <label>风险点编号</label>
                <input :value="editTarget.id" disabled class="input-disabled" />
              </div>
              <div class="form-item">
                <label>风险点名称 <span class="required">*</span></label>
                <input v-model="editTarget.name" />
              </div>
              <div class="form-item">
                <label>所属区域</label>
                <input v-model="editTarget.area" />
              </div>
              <div class="form-item">
                <label>风险类别</label>
                <input v-model="editTarget.category" />
              </div>
              <div class="form-item">
                <label>责任人</label>
                <select v-model="editTarget.ownerId" class="form-select">
                  <option v-for="p in personnelList" :key="p.id" :value="p.id">{{ p.name }}（{{ p.role }}）</option>
                </select>
              </div>
              <div class="form-item">
                <label>状态</label>
                <select v-model="editTarget.status" class="form-select">
                  <option value="管控中">管控中</option>
                  <option value="待复核">待复核</option>
                  <option value="待补充措施">待补充措施</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 危险源辨识 -->
          <div class="edit-section">
            <div class="sec-head-row">
              <h5 class="sec-title">⚠️ 危险源辨识（{{ editTarget.hazardousSources.length }} 项）</h5>
              <span class="sec-desc">辨识该风险点内可能导致事故的危险因素</span>
            </div>
            <div class="source-list-edit">
              <div v-for="(s, i) in editTarget.hazardousSources" :key="'hs-'+i" class="source-row">
                <span class="source-no">{{ i + 1 }}</span>
                <input v-model="editTarget.hazardousSources[i]" class="source-input" />
                <button class="btn-icon-remove" title="删除危险源" @click="editTarget.hazardousSources.splice(i, 1)">×</button>
              </div>
            </div>
            <div class="add-row">
              <input v-model="editingNewSource" placeholder="输入新的危险源描述，如：设备高温表面裸露" class="add-input"
                @keyup.enter="addHazardSource" />
              <button class="btn-add-sm" @click="addHazardSource" :disabled="!editingNewSource.trim()">＋ 添加危险源</button>
            </div>
          </div>

          <!-- 管控措施 -->
          <div class="edit-section">
            <div class="sec-head-row">
              <h5 class="sec-title">🛡️ 管控措施（{{ editTarget.controls.length }} 项）</h5>
              <span class="sec-desc">从工程技术、管理、教育培训、个体防护、应急五个方面制定</span>
            </div>
            <table class="mini-table" v-if="editTarget.controls.length">
              <thead><tr><th style="width:38px">#</th><th>措施内容</th><th>责任部门</th><th>频次</th><th>责任人</th><th style="width:40px"></th></tr></thead>
              <tbody>
                <tr v-for="(c, i) in editTarget.controls" :key="'ctrl-'+i">
                  <td>{{ i + 1 }}</td>
                  <td><input v-model="c.item" class="table-input" /></td>
                  <td><input v-model="c.dept" class="table-input" style="width:90px" /></td>
                  <td><input v-model="c.freq" class="table-input" style="width:60px" /></td>
                  <td><input v-model="c.responsibleName" class="table-input" style="width:70px" /></td>
                  <td><button class="btn-icon-remove" @click="editTarget.controls.splice(i, 1)">×</button></td>
                </tr>
              </tbody>
            </table>
            <div class="add-row" style="margin-top:8px">
              <button class="btn-add-sm" @click="addControl">＋ 新增管控措施</button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="edit-actions">
            <button class="btn-action danger" @click="deleteRisk">🗑 删除此风险点</button>
            <button class="btn-action" @click="cancelEdit">取消</button>
            <button class="btn-action primary" @click="saveEdit">💾 保存</button>
            <button class="btn-action outline" @click="jumpToLEC(editTarget.id)">→ 跳转LEC评价</button>
          </div>
        </div>

        <div class="identify-right" v-else>
          <div class="identify-empty">
            <p>👈 请从左侧选择一个风险点，开始辨识危险源和制定管控措施。</p>
            <p>或点击右上角「＋ 新增风险点」创建一个新的风险单元。</p>
          </div>
        </div>
      </div>

      <!-- 新增风险点弹窗 -->
      <div v-if="showNewRiskForm" class="dialog-mask" @click.self="cancelNewRisk"></div>
      <div v-if="showNewRiskForm" class="dialog-card">
        <h4>新增风险点</h4>
        <div class="form-grid-2">
          <div class="form-item">
            <label>风险点名称 <span class="required">*</span></label>
            <input v-model="newRisk.name" placeholder="如：中频炉作业平台" />
          </div>
          <div class="form-item">
            <label>所属区域 <span class="required">*</span></label>
            <input v-model="newRisk.area" placeholder="如：熔炼铸造区" />
          </div>
          <div class="form-item">
            <label>风险类别 <span class="required">*</span></label>
            <input v-model="newRisk.category" placeholder="如：灼烫/爆炸" />
          </div>
          <div class="form-item">
            <label>责任人</label>
            <select v-model="newRisk.ownerId" class="form-select">
              <option :value="null">-- 暂不指定 --</option>
              <option v-for="p in personnelList" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="btn-action" @click="cancelNewRisk">取消</button>
          <button class="btn-action primary" @click="confirmNewRisk" :disabled="!canCreateRisk">创建并开始辨识</button>
        </div>
      </div>
    </div>

    <!-- ====== 风险台账 ====== -->
    <div class="section-card" v-show="activeTab === 'ledger'">
      <div class="section-head">
        <h3 class="section-title">📋 风险点台账</h3>
        <span class="section-sub">统一维护风险点、所属区域、责任人与当前等级，共 {{ riskLedger.length }} 项</span>
        <button class="btn-add-risk" @click="openNewRiskFormAndSwitch">＋ 新增</button>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>编号</th><th>风险点名称</th><th>所属区域</th><th>类别</th>
              <th>L</th><th>E</th><th>C</th><th>D值</th>
              <th>风险等级</th><th>危险源</th><th>管控措施</th><th>责任人</th><th>状态</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in riskLedger" :key="r.id" @click="selectRisk(r)" class="clickable">
              <td class="link">{{ r.id }}</td>
              <td>{{ r.name }}</td>
              <td>{{ r.area }}</td>
              <td>{{ r.category }}</td>
              <td>{{ r.L }}</td><td>{{ r.E }}</td><td>{{ r.C }}</td>
              <td><strong>{{ r.D }}</strong></td>
              <td><span :class="['tag', 'tag-' + getLevelTag(r.level)]">⬤ {{ r.level }}</span></td>
              <td>{{ r.hazardousSources.length }} 项</td>
              <td>{{ r.controls.length }} 项</td>
              <td>{{ r.ownerName }}</td>
              <td><span :class="['tag', r.status === '管控中' ? 'tag-green' : 'tag-orange']">{{ r.status }}</span></td>
              <td>
                <button class="btn-sm" @click.stop="selectRisk(r)">详情</button>
                <button class="btn-sm" style="margin-left:4px;color:#ef4444" @click.stop="confirmDelete(r)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ====== LEC 评价（含审批链） ====== -->
    <div class="section-card" v-show="activeTab === 'lec'">
      <div class="section-head">
        <h3 class="section-title">🔢 LEC 风险评价与审批</h3>
        <span class="section-sub">评价 → 安环室复核 → 分管领导批准 → 生效归档</span>
      </div>

      <div class="lec-selector">
        <label>选择风险点：</label>
        <select v-model="lecRiskId" class="lec-select">
          <option value="">-- 请选择 --</option>
          <option v-for="r in riskLedger" :key="r.id" :value="r.id">{{ r.id }} {{ r.name }}</option>
        </select>
        <span v-if="lecTarget" style="margin-left:12px;font-size:12px;color:#64748b">当前审批角色：</span>
        <select v-if="lecTarget" v-model="approvalRole" class="lec-select" style="min-width:120px;width:auto">
          <option value="operator">安全员（评价人）</option>
          <option value="safety">安环室（复核人）</option>
          <option value="leader">分管领导（批准人）</option>
          <option value="admin">管理员（全部权限）</option>
        </select>
      </div>

      <div v-if="lecTarget" class="lec-form">
        <!-- 审批链可视化步骤条 -->
        <div class="approval-chain-v2">
          <div class="chain-v2-header">
            <span>🔗 审批链路</span>
            <span class="chain-v2-badge" :style="{ background: chainStatusColor }">{{ chainStatusLabel }}</span>
          </div>
          <div class="chain-v2-track">
            <div class="chain-v2-fill" :style="{ width: chainProgress + '%' }"></div>
            <div v-for="(step, i) in chainStepsV2" :key="step.key"
              :class="['chain-v2-node', { done: step.done, active: step.active }]">
              <div class="node-circle">
                <span v-if="step.done">✓</span>
                <span v-else-if="step.active" class="pulse-dot"></span>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <div class="node-text">
                <div class="node-label">{{ step.label }}</div>
                <div class="node-role">{{ step.role }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- LEC 打分区域（仅 draft 或 rejected 时显示） -->
        <div v-if="lecTarget._approvalState === 'draft' || lecTarget._approvalState === 'rejected' || approvalRole === 'admin'">
          <div class="lec-params">
            <div class="lec-param">
              <div class="lec-label">L — 事故发生的可能性</div>
              <div class="lec-options">
                <button v-for="o in L_options" :key="o.value"
                  :class="['lec-opt', { active: lecL === o.value }]" @click="lecL = o.value">
                  <span class="opt-num">{{ o.value }}</span><span class="opt-desc">{{ o.label }}</span>
                  <span class="opt-check" v-if="lecL === o.value">✓</span>
                </button>
              </div>
            </div>
            <div class="lec-param">
              <div class="lec-label">E — 人员暴露于危险环境的频率</div>
              <div class="lec-options">
                <button v-for="o in E_options" :key="o.value"
                  :class="['lec-opt', { active: lecE === o.value }]" @click="lecE = o.value">
                  <span class="opt-num">{{ o.value }}</span><span class="opt-desc">{{ o.label }}</span>
                  <span class="opt-check" v-if="lecE === o.value">✓</span>
                </button>
              </div>
            </div>
            <div class="lec-param">
              <div class="lec-label">C — 发生事故产生的后果</div>
              <div class="lec-options">
                <button v-for="o in C_options" :key="o.value"
                  :class="['lec-opt', { active: lecC === o.value }]" @click="lecC = o.value">
                  <span class="opt-num">{{ o.value }}</span><span class="opt-desc">{{ o.label }}</span>
                  <span class="opt-check" v-if="lecC === o.value">✓</span>
                </button>
              </div>
            </div>
          </div>
          <div class="lec-result-v2">
            <div class="result-gauge">
              <svg viewBox="0 0 100 100" class="gauge-svg">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                <circle cx="50" cy="50" r="42" fill="none" :stroke="lecResult.color" stroke-width="8"
                  stroke-linecap="round" :stroke-dasharray="264" :stroke-dashoffset="264 - (lecD / 320) * 264"
                  transform="rotate(-90 50 50)" style="transition: stroke-dashoffset .8s ease"/>
              </svg>
              <div class="gauge-value" :style="{ color: lecResult.color }">{{ lecD || '?' }}</div>
              <div class="gauge-sub">D 值</div>
            </div>
            <div class="result-info-v2">
              <div class="result-formula-v2">
                D = <span class="r-l">{{ lecL }}</span> × <span class="r-e">{{ lecE }}</span> × <span class="r-c">{{ lecC }}</span>
              </div>
              <div class="result-level-v2" :style="{ background: lecResult.color + '12', borderColor: lecResult.color }">
                <span :style="{ color: lecResult.color }">{{ lecResult.level }}</span>
                <span class="result-range-v2">（{{ lecResult.range }}）</span>
              </div>
              <button class="btn-action-v2 primary" @click="submitLEC" :disabled="!lecL || !lecE || !lecC">
                <span>📤</span> 提交评价
              </button>
            </div>
          </div>
        </div>

        <!-- 只读展示已评价的 LEC 参数 -->
        <div v-else class="lec-readonly">
          <div class="readonly-params">
            <span><strong>L = {{ lecTarget.L }}</strong>（事故可能性）</span>
            <span><strong>E = {{ lecTarget.E }}</strong>（暴露频率）</span>
            <span><strong>C = {{ lecTarget.C }}</strong>（后果严重度）</span>
            <span class="readonly-result" :style="{ color: getRiskColor(lecTarget.level) }">
              <strong>D = {{ lecTarget.D }}</strong> → {{ lecTarget.level }}
            </span>
          </div>
        </div>

        <!-- 审批操作按钮 -->
        <div class="approval-actions" v-if="lecTarget._approvalState !== 'approved' && lecTarget._approvalState !== 'rejected'">
          <button v-if="canReview" class="btn-action primary" @click="doApprove('review')">
            ✅ 安环室复核通过
          </button>
          <button v-if="canReview" class="btn-action danger" @click="doReject('review')" style="margin-left:8px">
            ❌ 安环室驳回
          </button>
          <button v-if="canApprove" class="btn-action primary" @click="doApprove('approve')">
            ✅ 分管领导批准
          </button>
          <button v-if="canApprove" class="btn-action danger" @click="doReject('approve')" style="margin-left:8px">
            ❌ 分管领导驳回
          </button>
        </div>
        <div v-else-if="lecTarget._approvalState === 'rejected'" class="approval-rejected">
          <span>⛔ 已被驳回，请重新评价后提交</span>
          <button class="btn-action primary" @click="lecTarget._approvalState = 'draft'; lecL=lecTarget.L; lecE=lecTarget.E; lecC=lecTarget.C">重新评价</button>
        </div>

        <!-- 审批历史 -->
        <div class="lec-history" v-if="lecTarget._approvalHistory && lecTarget._approvalHistory.length">
          <h5 class="sec-title-sm">📜 评价与审批记录</h5>
          <div class="history-list">
            <div v-for="h in lecTarget._approvalHistory.slice().reverse()" :key="h.time" class="history-item">
              <span class="history-time">{{ h.time }}</span>
              <span class="history-detail">{{ h.action }}</span>
              <span class="history-operator">{{ h.operator }}</span>
              <span class="history-note" v-if="h.detail">{{ h.detail }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="lec-empty">
        <p>👆 请先选择一个风险点，然后设定 L/E/C 参数进行评价</p>
      </div>
    </div>

    <!-- ====== 四色图 ====== -->
    <div class="section-card" v-show="activeTab === 'map'">
      <div class="section-head">
        <h3 class="section-title">🗺️ 风险四色图</h3>
        <span class="section-sub">基于高德地图真实地理位置，展现厂区 7 大风险区域与 7 个风险点、3 个重点风险源</span>
      </div>
      <div class="map-wrap">
        <RealMap
          :height="'460px'"
          :zones="zoneData"
          :markers="markerData"
          :work-permits="activeWorkPermits"
          :zoom="19"
          :fit-view="false"
          @zone-click="onMapZoneClick"
          @risk-click="jumpToLEC"
        />
      </div>

      <div style="padding:0 16px 16px;display:flex;gap:16px;align-items:center" v-if="selectedZone">
        <span class="section-sub">📍 {{ selectedZone }}：</span>
        <span v-for="r in zoneRisks" :key="r.id" :class="['tag', 'tag-' + getLevelTag(r.level)]" style="cursor:pointer" @click="jumpToLEC(r.id)">⬤ {{ r.id }} {{ r.name }}</span>
      </div>

      <!-- APP 端：现场人员使用流程 -->
      <div class="section-head" style="border-top:1px solid #e2e8f0; margin-top:16px">
        <h3 class="section-title">📱 APP 端 — 现场人员使用流程</h3>
        <span class="section-sub">现场人员登录工作台 → 点击「风险地图」→ 查看厂区四色风险分布，点击风险点下钻详情</span>
      </div>
      <div class="app-risk-wrap">
        <!-- 手机壳 -->
        <div class="phone-frame">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <div class="app-statusbar">
              <span class="as-time">9:41</span>
              <span class="as-icons">📶 🔋</span>
            </div>
            <div class="app-navbar">
              <span class="an-back" v-if="appView !== 'home'" @click="appView='home'">&lsaquo;</span>
              <span class="an-title" v-if="appView === 'home'">安全管理 · 铸锻件分公司</span>
              <span class="an-title" v-else-if="appView === 'risk-map'">风险地图</span>
              <span class="an-title" v-else-if="appView === 'tasks'">我的任务</span>
              <span class="an-title" v-else-if="appView === 'profile'">个人中心</span>
              <span class="an-title" v-else>{{ appModuleLabel || '功能模块' }}</span>
            </div>

            <!-- 主体（滚动） -->
            <div class="app-body">
              <!-- 前置页面：移动工作台 -->
              <template v-if="appView === 'home'">
                <div class="mob-user-card">
                  <div class="muc-avatar">👷</div>
                  <div class="muc-info">
                    <div class="muc-name">陈文斌</div>
                    <div class="muc-role">安全监督 · 铸锻件分公司</div>
                  </div>
                  <div class="muc-status on">🟢 在岗</div>
                </div>
                <div class="mob-menu-grid">
                  <div class="mm-item" v-for="m in appHomeMenu" :key="m.key" @click="appGo(m.key)">
                    <div class="mm-icon">{{ m.icon }}</div>
                    <div class="mm-label">{{ m.label }}</div>
                    <div class="mm-badge" v-if="m.badge">{{ m.badge }}</div>
                  </div>
                </div>
                <div class="mob-banner" @click="appView='risk-map'">
                  <div class="mb-icon">🗺️</div>
                  <div class="mb-text">
                    <div class="mb-title">厂区风险四色图</div>
                    <div class="mb-desc">查看重大/较大/一般风险分布，点风险点看详情</div>
                  </div>
                  <div class="mb-arrow">›</div>
                </div>
                <div class="mob-section-title">今日任务</div>
                <div class="mob-task-card" @click="appView='tasks'">
                  <div class="mtc-header">
                    <span class="mtc-title">📋 起重设备专项巡检</span>
                    <span class="tag tag-orange">待执行</span>
                  </div>
                  <div class="mtc-meta">检查项 8 项 · 截止 今日 17:00</div>
                  <div class="mtc-bar"><div class="mtc-fill" style="width:0%"></div></div>
                </div>
                <div class="mob-section-title">待处理事项</div>
                <div class="mob-pending-card" @click="appView='tasks'">
                  <div class="mpc-icon">✅</div>
                  <div class="mpc-content">
                    <div class="mpc-title">监护确认待办</div>
                    <div class="mpc-desc">高处作业 · 厂房屋面通风器检修</div>
                    <div class="mpc-time">提交于 07-14 16:30</div>
                  </div>
                  <div class="mpc-arrow">›</div>
                </div>
              </template>

              <!-- 风险地图页 -->
              <template v-else-if="appView === 'risk-map'">
                <div class="mob-riskmap">
                  <div class="mrm-legend">
                    <span class="mrl-item"><i class="dot major"></i>重大</span>
                    <span class="mrl-item"><i class="dot larger"></i>较大</span>
                    <span class="mrl-item"><i class="dot normal"></i>一般</span>
                    <span class="mrl-tip">点击风险点查看详情</span>
                  </div>
                  <div class="mrm-map">
                    <svg viewBox="0 0 640 440" class="mrm-svg" preserveAspectRatio="xMidYMid meet">
                      <g v-for="z in appRiskZones" :key="z.id">
                        <rect :x="z.x" :y="z.y" :width="z.w" :height="z.h" :fill="z.fill" :stroke="z.color" stroke-width="1.5" rx="6"></rect>
                        <text :x="z.x + 8" :y="z.y + 18" font-size="11" :fill="z.color" font-weight="600">{{ z.name }}</text>
                        <text :x="z.x + z.w - 8" :y="z.y + 18" font-size="9" :fill="z.color" text-anchor="end">{{ z.level }}</text>
                      </g>
                      <g v-for="p in appRiskPoints" :key="p.id" class="mrm-point" @click="appSelectRisk(p.id)">
                        <circle :cx="p.px" :cy="p.py" r="9" :fill="getRiskColor(p.level)" stroke="#fff" stroke-width="2"></circle>
                        <circle v-if="p.status !== '正常'" :cx="p.px" :cy="p.py" r="9" fill="none" :stroke="getRiskColor(p.level)" stroke-width="2" class="mrm-pulse"></circle>
                        <text :x="p.px" :y="p.py + 3.5" font-size="9" fill="#fff" text-anchor="middle" font-weight="700">{{ appRpIndex(p.id) }}</text>
                      </g>
                    </svg>
                  </div>
                  <div class="mrm-detail" v-if="appSelectedRisk">
                    <div class="mrmd-head">
                      <span class="mrmd-name">{{ appSelectedRisk.name }}</span>
                      <span class="tag" :class="getLevelTag(appSelectedRisk.level)">{{ appSelectedRisk.level }}</span>
                      <span class="mrmd-close" @click="appSelectedRiskId = null">✕</span>
                    </div>
                    <div class="mrmd-grid">
                      <div class="mrmd-row"><span>风险分类</span><b>{{ appSelectedRisk.category }}</b></div>
                      <div class="mrmd-row"><span>所属部门</span><b>{{ appSelectedRisk.dept }}</b></div>
                      <div class="mrmd-row"><span>责任人</span><b>{{ appSelectedRisk.responsible }}</b></div>
                      <div class="mrmd-row"><span>最近排查</span><b>{{ appSelectedRisk.lastReview }}</b></div>
                      <div class="mrmd-row"><span>当前状态</span><b :class="appStatusClass(appSelectedRisk.status)">{{ appSelectedRisk.status }}</b></div>
                    </div>
                    <div class="mrmd-measures">
                      <div class="mrmdm-label">管控措施</div>
                      <div class="mrmdm-text">{{ appSelectedRisk.measures }}</div>
                    </div>
                  </div>
                  <div class="mrm-empty" v-else>👆 点击地图上的风险点，查看风险详情与管控措施</div>
                  <div class="mrm-list">
                    <div class="mrmli" v-for="p in appRiskPoints" :key="p.id" :class="{ active: appSelectedRiskId === p.id }" @click="appSelectRisk(p.id)">
                      <span class="mrmli-dot" :style="{ background: getRiskColor(p.level) }"></span>
                      <span class="mrmli-name">{{ p.name }}</span>
                      <span class="mrmli-level" :class="getLevelTag(p.level)">{{ p.level }}</span>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 我的任务 -->
              <template v-else-if="appView === 'tasks'">
                <div class="mob-section-title">今日巡检</div>
                <div class="mob-task-card" @click="appView='home'">
                  <div class="mtc-header">
                    <span class="mtc-title">📋 起重设备专项巡检</span>
                    <span class="tag tag-orange">待执行</span>
                  </div>
                  <div class="mtc-meta">检查项 8 项 · 截止 今日 17:00</div>
                  <div class="mtc-bar"><div class="mtc-fill" style="width:0%"></div></div>
                </div>
                <div class="mob-section-title">待处理事项</div>
                <div class="mob-pending-card" @click="appView='home'">
                  <div class="mpc-icon">✅</div>
                  <div class="mpc-content">
                    <div class="mpc-title">监护确认待办</div>
                    <div class="mpc-desc">高处作业 · 厂房屋面通风器检修</div>
                    <div class="mpc-time">提交于 07-14 16:30</div>
                  </div>
                  <div class="mpc-arrow">›</div>
                </div>
                <div class="mob-empty">更多任务请在移动工作台查看</div>
              </template>

              <!-- 个人中心 -->
              <template v-else-if="appView === 'profile'">
                <div class="mob-profile">
                  <div class="mpf-top">
                    <div class="mpf-avatar">👷</div>
                    <div class="mpf-name">陈文斌</div>
                    <div class="mpf-role">安全监督 · 铸锻件分公司</div>
                  </div>
                  <div class="mpf-stats">
                    <div class="mpf-stat"><b>12</b><span>本月巡检</span></div>
                    <div class="mpf-stat"><b>3</b><span>上报隐患</span></div>
                    <div class="mpf-stat"><b>5</b><span>监护确认</span></div>
                  </div>
                  <div class="mpf-list">
                    <div class="mpf-row"><span>所属组织</span><b>太原重工 · 铸锻件分公司</b></div>
                    <div class="mpf-row"><span>证件状态</span><b class="st-ok">有效期内</b></div>
                    <div class="mpf-row"><span>当前状态</span><b class="st-ok">🟢 在岗</b></div>
                  </div>
                </div>
              </template>

              <!-- 其他模块占位 -->
              <template v-else>
                <div class="mob-module">
                  <div class="mmd-icon">{{ (appHomeMenu.find(m=>m.label===appModuleLabel)||{}).icon || '📦' }}</div>
                  <div class="mmd-name">{{ appModuleLabel }}</div>
                  <div class="mmd-desc">该模块与「移动工作台」同源，本演示聚焦风险地图模块，其余功能以同样架构接入。</div>
                  <button class="ph-btn outline" @click="appView='home'">返回首页</button>
                </div>
              </template>
            </div>

            <!-- 底部 Tab 栏（标准手机导航） -->
            <div class="app-bottom-bar">
              <div class="abb-item" :class="{ active: appView === 'home' }" @click="appView='home'">
                <span class="abb-icon">🏠</span><span class="abb-label">首页</span>
              </div>
              <div class="abb-item" :class="{ active: appView === 'tasks' }" @click="appView='tasks'">
                <span class="abb-icon">📋</span><span class="abb-label">任务</span>
              </div>
              <div class="abb-item" :class="{ active: appView === 'profile' }" @click="appView='profile'">
                <span class="abb-icon">👤</span><span class="abb-label">我的</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧注释卡 -->
        <div class="app-ui-notes">
          <div class="note-card"><h4>🏠 移动工作台（前置页）</h4><p>现场人员登录后的主面板：顶部展示身份与在岗状态，九宫格覆盖全部现场操作，底部「首页/任务/我的」为标准手机导航。点「风险地图」或横幅进入地图。</p></div>
          <div class="note-card"><h4>🗺️ 风险四色图</h4><p>APP 自动按风险等级对厂区各区域着色，红/橙/黄呈现重大、较大、一般风险分布。</p></div>
          <div class="note-card"><h4>👆 点击查看详情</h4><p>现场人员点击地图上的风险点，下钻查看风险分类、责任人、最近排查时间与管控措施。</p></div>
          <div class="note-card"><h4>🔄 与 PC 端同源</h4><p>APP 风险地图与 PC 端四色图、风险台账数据同源，状态实时同步，发现问题可一键跳转随手拍上报。</p></div>
        </div>
      </div>
    </div>

    <!-- ====== 风险告知卡 ====== -->
    <div class="section-card" v-show="activeTab === 'card'">
      <div class="section-head">
        <h3 class="section-title">🃏 风险告知卡</h3>
        <span class="section-sub">自动生成标准化安全风险告知牌，可打印张贴于风险点现场</span>
        <select v-model="cardRiskId" class="lec-select" style="min-width:260px;margin-left:auto">
          <option value="">-- 选择风险点 --</option>
          <option v-for="r in riskLedger" :key="r.id" :value="r.id">{{ r.id }} {{ r.name }}</option>
        </select>
      </div>

      <div v-if="cardTarget" class="card-body">
        <div id="riskCard" class="risk-card">
          <!-- 卡片头部 -->
          <div class="card-header" :style="{ background: getRiskColor(cardTarget.level) }">
            <div class="card-badge">安全风险告知牌</div>
            <div class="card-level">{{ cardTarget.level }}风险</div>
          </div>

          <!-- 风险信息 -->
          <div class="card-grid">
            <div class="card-cell">
              <div class="card-label">风险点名称</div>
              <div class="card-value">{{ cardTarget.name }}</div>
            </div>
            <div class="card-cell">
              <div class="card-label">所属区域</div>
              <div class="card-value">{{ cardTarget.area }}</div>
            </div>
            <div class="card-cell">
              <div class="card-label">风险类别</div>
              <div class="card-value">{{ cardTarget.category }}</div>
            </div>
            <div class="card-cell">
              <div class="card-label">D值 / 等级</div>
              <div class="card-value" :style="{ color: getRiskColor(cardTarget.level), fontWeight: 800 }">D={{ cardTarget.D }} / {{ cardTarget.level }}</div>
            </div>
          </div>

          <!-- 危险源 -->
          <div class="card-section">
            <div class="card-section-title" style="color:#ef4444">⚠️ 主要危险因素</div>
            <div class="card-list">
              <div v-for="(s, i) in cardTarget.hazardousSources" :key="i" class="card-list-item">
                <span class="card-dot">●</span> {{ s }}
              </div>
              <div v-if="!cardTarget.hazardousSources || cardTarget.hazardousSources.length === 0" class="card-list-item">
                <span class="card-dot">●</span> 待辨识
              </div>
            </div>
          </div>

          <!-- 管控措施 -->
          <div class="card-section">
            <div class="card-section-title" style="color:#f59e0b">🛡️ 管控措施</div>
            <div class="card-list">
              <div v-for="(c, i) in (cardTarget.controls || []).slice(0, 6)" :key="i" class="card-list-item">
                <span class="card-dot" style="color:#f59e0b">●</span>
                {{ c.item }}<span class="card-meta">（{{ c.dept }} · {{ c.freq }}）</span>
              </div>
            </div>
          </div>

          <!-- 应急措施 -->
          <div class="card-section">
            <div class="card-section-title" style="color:#0ea85e">🚨 应急措施</div>
            <div class="card-list">
              <div v-for="(e, i) in getEmergencyMeasures(cardTarget)" :key="i" class="card-list-item">
                <span class="card-dot" style="color:#0ea85e">●</span> {{ e }}
              </div>
            </div>
          </div>

          <!-- 责任人与监管信息 -->
          <div class="card-footer-grid">
            <div class="card-cell">
              <div class="card-label">责任人</div>
              <div class="card-value">{{ cardTarget.ownerName }}</div>
            </div>
            <div class="card-cell">
              <div class="card-label">联系电话</div>
              <div class="card-value">0351-6366XXX（安环室）</div>
            </div>
            <div class="card-cell">
              <div class="card-label">监管部门</div>
              <div class="card-value">健康安全环保部 · 标准化室</div>
            </div>
            <div class="card-cell">
              <div class="card-label">举报电话</div>
              <div class="card-value">0351-6366XXX（安委办）</div>
            </div>
          </div>

          <!-- 日期 -->
          <div class="card-date">
            编制日期：{{ cardTarget.lastReview || '—' }}　|　有效期至：{{ getValidUntil(cardTarget) }}　|　铸锻件分公司
          </div>
        </div>

        <div class="card-actions-bar">
          <button class="btn-action outline" @click="printCard">🖨️ 打印告知卡</button>
        </div>
      </div>

      <div v-else class="lec-empty">
        <p>👆 请先选择需要生成告知卡的风险点</p>
      </div>
    </div>

    <!-- ====== 风险点详情抽屉（可编辑） ====== -->
    <div v-if="selectedRisk" class="drawer-mask" @click="selectedRisk = null"></div>
    <div v-if="selectedRisk" class="drawer">
      <div class="drawer-head">
        <div>
          <h2 class="drawer-title">{{ selectedRisk.name }}</h2>
          <span class="drawer-sub">{{ selectedRisk.id }} · {{ selectedRisk.area }}</span>
        </div>
        <button class="close-btn" @click="selectedRisk = null">✕</button>
      </div>
      <div class="drawer-body">
        <!-- 风险信息 -->
        <div class="detail-grid-3">
          <div class="detail-item"><dt>风险类别</dt><dd>{{ selectedRisk.category }}</dd></div>
          <div class="detail-item">
            <dt>风险等级</dt>
            <dd><span :class="['tag', 'tag-' + getLevelTag(selectedRisk.level)]">⬤ {{ selectedRisk.level }}</span></dd>
          </div>
          <div class="detail-item"><dt>D值</dt><dd>{{ selectedRisk.D }}（L{{ selectedRisk.L }}×E{{ selectedRisk.E }}×C{{ selectedRisk.C }}）</dd></div>
          <div class="detail-item"><dt>L</dt><dd>{{ selectedRisk.L }} — 事故可能性</dd></div>
          <div class="detail-item"><dt>E</dt><dd>{{ selectedRisk.E }} — 暴露频率</dd></div>
          <div class="detail-item"><dt>C</dt><dd>{{ selectedRisk.C }} — 后果严重度</dd></div>
          <div class="detail-item"><dt>责任人</dt><dd>{{ selectedRisk.ownerName }}</dd></div>
          <div class="detail-item"><dt>最后复核</dt><dd>{{ selectedRisk.lastReview }}</dd></div>
          <div class="detail-item">
            <dt>状态</dt>
            <dd><span :class="['tag', selectedRisk.status === '管控中' ? 'tag-green' : 'tag-orange']">{{ selectedRisk.status }}</span></dd>
          </div>
        </div>

        <h4 class="sec-title">⚠️ 危险源清单（{{ selectedRisk.hazardousSources.length }} 项）</h4>
        <div class="source-list-edit">
          <div v-for="(s, i) in selectedRisk.hazardousSources" :key="'dr-hs-'+i" class="source-row">
            <span class="source-no">{{ i + 1 }}</span>
            <input v-model="selectedRisk.hazardousSources[i]" class="source-input" />
            <button class="btn-icon-remove" @click="selectedRisk.hazardousSources.splice(i, 1)">×</button>
          </div>
        </div>
        <div class="add-row" style="margin-bottom:16px">
          <input v-model="drawerNewSource" placeholder="新增危险源..." class="add-input"
            @keyup.enter="addDrawerSource" />
          <button class="btn-add-sm" @click="addDrawerSource" :disabled="!drawerNewSource.trim()">＋ 添加</button>
        </div>

        <h4 class="sec-title">🛡️ 管控措施（{{ selectedRisk.controls.length }} 项）</h4>
        <table class="data-table">
          <thead><tr><th>序号</th><th>措施内容</th><th>责任部门</th><th>频次</th><th>责任人</th><th></th></tr></thead>
          <tbody>
            <tr v-for="(c, i) in selectedRisk.controls" :key="'dr-c-'+i">
              <td>{{ i + 1 }}</td>
              <td><input v-model="c.item" class="table-input" /></td>
              <td><input v-model="c.dept" class="table-input" style="width:90px" /></td>
              <td><input v-model="c.freq" class="table-input" style="width:60px" /></td>
              <td><input v-model="c.responsibleName" class="table-input" style="width:70px" /></td>
              <td><button class="btn-icon-remove" @click="selectedRisk.controls.splice(i, 1)">×</button></td>
            </tr>
          </tbody>
        </table>
        <div class="add-row" style="margin-top:8px">
          <button class="btn-add-sm" @click="addDrawerControl">＋ 新增管控措施</button>
        </div>

        <!-- 审批历史 -->
        <div v-if="selectedRisk._approvalHistory && selectedRisk._approvalHistory.length" style="margin-top:20px">
          <h4 class="sec-title">📜 评价与审批记录</h4>
          <div class="history-list">
            <div v-for="h in selectedRisk._approvalHistory.slice().reverse()" :key="h.time" class="history-item">
              <span class="history-time">{{ h.time }}</span>
              <span class="history-detail">{{ h.action }}</span>
              <span class="history-operator">{{ h.operator }}</span>
              <span class="history-note" v-if="h.detail">{{ h.detail }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="drawer-foot">
        <button class="btn-action danger" style="margin-right:auto" @click="deleteFromDrawer">🗑 删除此风险点</button>
        <button class="btn-action" @click="selectedRisk = null">关闭</button>
        <button class="btn-action primary" @click="jumpToLEC(selectedRisk.id); selectedRisk = null">→ 跳转LEC评价</button>
      </div>
    </div>
  </div>
</template>

<script>
import { riskLedger, getRiskLevelByD, personnel, factoryZones, riskPoints, workPermits } from '@/store/safeData'
import RealMap from '@/components/safety/RealMap.vue'
import SceneFlow from '@/components/safety/SceneFlow.vue';

const L_options = [
  { value: 1, label: '完全不可能' }, { value: 2, label: '较不可能' },
  { value: 3, label: '可能，但不经常' }, { value: 4, label: '较可能' }, { value: 5, label: '非常可能' }
]
const E_options = [
  { value: 1, label: '每年一次' }, { value: 2, label: '每月一次' },
  { value: 3, label: '每周一次' }, { value: 4, label: '每日一次' },
  { value: 5, label: '连续暴露' }, { value: 6, label: '每班多次' }
]
const C_options = [
  { value: 1, label: '轻微伤害' }, { value: 3, label: '轻伤' },
  { value: 5, label: '重伤' }, { value: 7, label: '严重伤残' },
  { value: 10, label: '1人死亡' }, { value: 15, label: '多人死亡' }
]

let _idCounter = 7 // 从 RK-2026-007 开始

export default {
  name: 'RiskManagement',
  components: { RealMap, SceneFlow },
  data() {
    return {
      activeTab: 'identify',
      tabs: [
        { key: 'identify', label: '风险辨识', icon: '🔍' },
        { key: 'lec', label: 'LEC 评价', icon: '🔢' },
        { key: 'map', label: '四色图', icon: '🗺️' },
        { key: 'card', label: '风险告知卡', icon: '🃏' },
        { key: 'ledger', label: '风险台账', icon: '📋' }
      ],
      riskLedger,
      personnelList: personnel,

      // 辨识 Tab
      editingRiskId: null,
      editingNewSource: '',
      identifySearch: '',

      // 新增风险点弹窗
      showNewRiskForm: false,
      newRisk: { name: '', area: '', category: '', ownerId: null },

      // 台账详情抽屉
      selectedRisk: null,
      drawerNewSource: '',

      // LEC 评价
      lecRiskId: '',
      lecL: 0, lecE: 0, lecC: 0,
      L_options, E_options, C_options,

      // 审批链模拟
      approvalRole: 'operator', // 'operator' | 'safety' | 'leader' | 'admin'

      // 风险告知卡
      cardRiskId: '',

      // 四色图
      selectedZone: '',
      zoneData: factoryZones,
      markerData: riskPoints,
      workPermits,

      // APP 端风险地图
      appSelectedRiskId: null,
      appRiskZones: [
        { id: 'zone-1', name: '熔炼铸造区', x: 60, y: 45, w: 170, h: 110, level: '重大', color: '#ef4444', fill: '#fef2f2' },
        { id: 'zone-2', name: '锻压加工区', x: 260, y: 45, w: 160, h: 110, level: '重大', color: '#ef4444', fill: '#fef2f2' },
        { id: 'zone-3', name: '热处理区', x: 450, y: 45, w: 150, h: 110, level: '较大', color: '#f59e0b', fill: '#fffbeb' },
        { id: 'zone-4', name: '大型构件吊装区', x: 60, y: 180, w: 180, h: 110, level: '重大', color: '#ef4444', fill: '#fef2f2' },
        { id: 'zone-5', name: '厂房屋面检修区', x: 270, y: 180, w: 170, h: 110, level: '较大', color: '#f59e0b', fill: '#fffbeb' },
        { id: 'zone-6', name: '仓储装卸区', x: 470, y: 180, w: 150, h: 110, level: '一般', color: '#eab308', fill: '#fefce8' },
        { id: 'zone-7', name: '能源介质区', x: 150, y: 320, w: 380, h: 100, level: '较大', color: '#f59e0b', fill: '#fffbeb' }
      ],
      appRiskPoints: [
        { id: 'rp-1', name: '中频炉作业平台', category: '灼烫/爆炸', level: '重大', dept: '铸造车间', responsible: '张建国', measures: '炉前防护挡板、自动测温报警、紧急倾炉装置', lastReview: '2026-07-10', status: '正常', px: 110, py: 100 },
        { id: 'rp-2', name: '浇注坑区域', category: '灼烫/起重伤害', level: '重大', dept: '铸造车间', responsible: '李明辉', measures: '浇注坑围栏、天车限位装置、高温警示', lastReview: '2026-07-08', status: '正常', px: 150, py: 135 },
        { id: 'rp-3', name: '8000T锻压机工位', category: '机械伤害/噪声', level: '重大', dept: '锻压车间', responsible: '王志强', measures: '安全光幕、双手操作装置、隔音罩', lastReview: '2026-07-05', status: '正常', px: 350, py: 120 },
        { id: 'rp-4', name: '桥式起重机A区', category: '起重伤害/物体打击', level: '重大', dept: '铸造车间', responsible: '刘大伟', measures: '吊索具日检、限位器、声光报警、警戒区域', lastReview: '2026-07-12', status: '隐患待整改', px: 150, py: 270 },
        { id: 'rp-5', name: '厂房屋面通风器检修口', category: '高处坠落', level: '较大', dept: '机修车间', responsible: '孙志明', measures: '安全护栏、生命线系统、防坠落网', lastReview: '2026-07-03', status: '正常', px: 370, py: 270 },
        { id: 'rp-6', name: '危险品暂存库', category: '火灾/爆炸/中毒', level: '较大', dept: '仓储车间', responsible: '陈文斌', measures: '防爆电气、可燃气体报警、通风联锁、MSDS告知', lastReview: '2026-07-09', status: '正常', px: 575, py: 265 },
        { id: 'rp-7', name: '35kV变电站', category: '触电/火灾', level: '较大', dept: '动力车间', responsible: '孙志明', measures: '五防系统、绝缘监测、自动灭火装置', lastReview: '2026-07-01', status: '正常', px: 260, py: 415 }
      ],

      // APP 端视图导航
      appView: 'home',
      appModuleLabel: '',
      appHomeMenu: [
        { key: 'inspection', icon: '📋', label: '巡检任务' },
        { key: 'hazard-report', icon: '📸', label: '随手拍' },
        { key: 'guardian', icon: '🛡️', label: '监护确认', badge: 1 },
        { key: 'work-permit', icon: '📝', label: '作业票' },
        { key: 'duty-sign', icon: '🟢', label: '到岗签到' },
        { key: 'message', icon: '🔔', label: '消息中心' },
        { key: 'risk-map', icon: '🗺️', label: '风险地图' },
        { key: 'profile', icon: '👤', label: '个人中心' }
      ]
    }
  },
  computed: {
    stats() {
      const d = { critical: 0, major: 0, moderate: 0, low: 0 }
      this.riskLedger.forEach(r => {
        if (r.level === '重大') d.critical++
        else if (r.level === '较大') d.major++
        else if (r.level === '一般') d.moderate++
        else d.low++
      })
      return d
    },
    riskStats() {
      const d = { critical: 0, major: 0, moderate: 0, low: 0 }
      this.riskLedger.forEach(r => {
        if (r.level === '重大') d.critical++
        else if (r.level === '较大') d.major++
        else if (r.level === '一般') d.moderate++
        else d.low++
      })
      const inControl = this.riskLedger.filter(r => r.status === '管控中').length
      return [
        { label: '重大风险', value: d.critical, sub: 'D ≥ 160', icon: '🔴', color: '#DC2626', grad: 'linear-gradient(135deg, #DC2626, #B91C1C)' },
        { label: '较大风险', value: d.major, sub: '70 ≤ D < 160', icon: '🟠', color: '#D97706', grad: 'linear-gradient(135deg, #D97706, #B45309)' },
        { label: '一般风险', value: d.moderate, sub: '20 ≤ D < 70', icon: '🟡', color: '#CA8A04', grad: 'linear-gradient(135deg, #CA8A04, #A16207)' },
        { label: '低风险', value: d.low, sub: 'D < 20', icon: '🔵', color: '#0075E6', grad: 'linear-gradient(135deg, #0075E6, #0058AD)' },
        { label: '管控中', value: inControl, sub: this.riskLedger.length + ' 个风险点', icon: '✅', color: '#009118', grad: 'linear-gradient(135deg, #009118, #007714)' }
      ]
    },
    editTarget() {
      return this.editingRiskId ? this.riskLedger.find(r => r.id === this.editingRiskId) : null
    },
    filteredRiskLedger() {
      if (!this.identifySearch.trim()) return this.riskLedger
      const q = this.identifySearch.toLowerCase()
      return this.riskLedger.filter(r =>
        r.name.toLowerCase().includes(q) || r.area.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
      )
    },
    canCreateRisk() {
      return this.newRisk.name.trim() && this.newRisk.area.trim() && this.newRisk.category.trim()
    },
    cardTarget() {
      return this.cardRiskId ? this.riskLedger.find(r => r.id === this.cardRiskId) : null
    },
    canReview() {
      if (!this.lecTarget) return false
      const s = this.lecTarget._approvalState
      return (s === 'pending_review') && (this.approvalRole === 'safety' || this.approvalRole === 'admin')
    },
    canApprove() {
      if (!this.lecTarget) return false
      const s = this.lecTarget._approvalState
      return (s === 'pending_approval') && (this.approvalRole === 'leader' || this.approvalRole === 'admin')
    },
    chainStatusLabel() {
      const map = { draft: '待评价', pending_review: '待安环室复核', pending_approval: '待分管领导批准', approved: '已生效', rejected: '已驳回' }
      return this.lecTarget ? (map[this.lecTarget._approvalState] || '-') : '-'
    },
    chainStatusColor() {
      const map = { draft: '#94a3b8', pending_review: '#f59e0b', pending_approval: '#f59e0b', approved: '#0ea85e', rejected: '#ef4444' }
      return this.lecTarget ? (map[this.lecTarget._approvalState] || '#94a3b8') : '#94a3b8'
    },
    chainStepsV2() {
      if (!this.lecTarget) return []
      const s = this.lecTarget._approvalState
      const order = ['draft', 'pending_review', 'pending_approval', 'approved']
      const idx = s === 'rejected' ? 0 : order.indexOf(s)
      return [
        { key: 'draft', label: '提交评价', role: '安全员', done: idx > 0, active: idx === 0 },
        { key: 'pending_review', label: '安环室复核', role: '安环室', done: idx > 1, active: idx === 1 },
        { key: 'pending_approval', label: '分管领导批准', role: '分管领导', done: idx > 2, active: idx === 2 },
        { key: 'approved', label: '生效归档', role: '系统', done: idx > 3, active: idx >= 3 }
      ]
    },
    chainProgress() {
      if (!this.lecTarget) return 0
      const s = this.lecTarget._approvalState
      if (s === 'rejected') return 0
      const p = { draft: 0, pending_review: 33, pending_approval: 66, approved: 100 }
      return p[s] || 0
    },
    zoneRisks() {
      if (!this.selectedZone) return []
      return this.riskLedger.filter(r => r.area === this.selectedZone)
    },
    appSelectedRisk() {
      return this.appRiskPoints.find(p => p.id === this.appSelectedRiskId) || null
    },
    activeWorkPermits() {
      return this.workPermits.filter(w => w.status !== '草稿' && w.status !== '已归档')
    },
    lecTarget() {
      return this.lecRiskId ? this.riskLedger.find(r => r.id === this.lecRiskId) : null
    },
    lecD() {
      return this.lecL * this.lecE * this.lecC
    },
    lecResult() {
      if (!this.lecD) return { level: '-', color: '#94a3b8', range: '-' }
      const r = getRiskLevelByD(this.lecD)
      const ranges = { '重大': 'D ≥ 160', '较大': '70 ≤ D < 160', '一般': '20 ≤ D < 70', '低': 'D < 20' }
      return { ...r, range: ranges[r.level] || '-' }
    }
  },
  methods: {
    // ==== 辨识 Tab ====
    startEdit(id) {
      this.editingRiskId = id
    },
    cancelEdit() {
      this.editingRiskId = null
      this.editingNewSource = ''
    },
    saveEdit() {
      if (!this.editTarget) return
      const t = this.editTarget
      t.ownerName = (personnel.find(p => p.id === t.ownerId) || {}).name || '-'
      t.measures = t.controls.length
      t.lastReview = new Date().toISOString().slice(0, 10)
      alert('✅ 风险点「' + t.name + '」已保存')
    },
    addHazardSource() {
      if (!this.editingNewSource.trim() || !this.editTarget) return
      this.editTarget.hazardousSources.push(this.editingNewSource.trim())
      this.editingNewSource = ''
    },
    addControl() {
      if (!this.editTarget) return
      this.editTarget.controls.push({ item: '新措施', dept: '-', freq: '每日', responsibleName: '-' })
    },
    deleteRisk() {
      if (!this.editTarget) return
      if (!confirm('⚠️ 确定删除风险点「' + this.editTarget.name + '」？此操作不可恢复。')) return
      const idx = this.riskLedger.indexOf(this.editTarget)
      if (idx >= 0) this.riskLedger.splice(idx, 1)
      this.editingRiskId = null
    },

    // ==== 新增风险点 ====
    openNewRiskForm() {
      this.showNewRiskForm = true
    },
    openNewRiskFormAndSwitch() {
      this.activeTab = 'identify'
      this.$nextTick(() => { this.showNewRiskForm = true })
    },
    cancelNewRisk() {
      this.showNewRiskForm = false
      this.newRisk = { name: '', area: '', category: '', ownerId: null }
    },
    confirmNewRisk() {
      if (!this.canCreateRisk) return
      const id = 'RK-2026-' + String(_idCounter++).padStart(3, '0')
      const owner = this.newRisk.ownerId ? personnel.find(p => p.id === this.newRisk.ownerId) : null
      this.riskLedger.push({
        id, name: this.newRisk.name.trim(), area: this.newRisk.area.trim(),
        category: this.newRisk.category.trim(), level: '低',
        L: 0, E: 0, C: 0, D: 0,
        ownerId: this.newRisk.ownerId, ownerName: owner ? owner.name : '未指定',
        measures: 0, status: '待补充措施',
        lastReview: new Date().toISOString().slice(0, 10),
        hazardousSources: [],
        controls: [],
        _approvalState: 'draft',
        _approvalHistory: []
      })
      this.cancelNewRisk()
      this.editingRiskId = id
    },

    // ==== 台账 Tab ====
    selectRisk(r) { this.selectedRisk = r },
    confirmDelete(r) {
      if (!confirm('⚠️ 确定删除风险点「' + r.name + '」？')) return
      const idx = this.riskLedger.indexOf(r)
      if (idx >= 0) this.riskLedger.splice(idx, 1)
    },
    getLevelTag(level) {
      return { '重大': 'red', '较大': 'orange', '一般': 'yellow', '低': 'blue' }[level] || 'blue'
    },

    // ==== 抽屉内操作 ====
    addDrawerSource() {
      if (!this.drawerNewSource.trim() || !this.selectedRisk) return
      this.selectedRisk.hazardousSources.push(this.drawerNewSource.trim())
      this.drawerNewSource = ''
    },
    addDrawerControl() {
      if (!this.selectedRisk) return
      this.selectedRisk.controls.push({ item: '新措施', dept: '-', freq: '每日', responsibleName: '-' })
    },
    deleteFromDrawer() {
      if (!this.selectedRisk) return
      if (!confirm('⚠️ 确定删除「' + this.selectedRisk.name + '」？')) return
      const idx = this.riskLedger.indexOf(this.selectedRisk)
      if (idx >= 0) this.riskLedger.splice(idx, 1)
      this.selectedRisk = null
    },

    // ==== LEC 评价 + 审批链 ====
    jumpToLEC(id) {
      this.activeTab = 'lec'
      this.$nextTick(() => { this.lecRiskId = id })
    },
    submitLEC() {
      if (!this.lecTarget || !this.lecD) return
      const t = this.lecTarget
      t.L = this.lecL; t.E = this.lecE; t.C = this.lecC; t.D = this.lecD
      t.level = this.lecResult.level
      t.status = '待复核'
      t._approvalState = 'pending_review'
      if (!t._approvalHistory) t._approvalHistory = []
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
      t._approvalHistory.push({
        time: now, action: '提交LEC评价', operator: '安全员',
        detail: 'L' + this.lecL + '×E' + this.lecE + '×C' + this.lecC + ' D=' + this.lecD + ' → ' + this.lecResult.level
      })
      alert('✅ 评价已提交：' + t.name + ' → ' + this.lecResult.level + '（D=' + this.lecD + '），流转至安环室复核')
    },
    chainDone(state) {
      if (!this.lecTarget) return false
      const order = ['draft', 'pending_review', 'pending_approval', 'approved']
      return order.indexOf(this.lecTarget._approvalState) > order.indexOf(state)
    },
    doApprove(type) {
      if (!this.lecTarget) return
      const t = this.lecTarget
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
      if (type === 'review') {
        t._approvalState = 'pending_approval'
        t.status = '待批准'
        t._approvalHistory.push({ time: now, action: '安环室复核通过', operator: '李明辉', detail: '风险等级判定准确，管控措施到位' })
        alert('✅ 安环室复核通过，流转至分管领导批准')
      } else if (type === 'approve') {
        t._approvalState = 'approved'
        t.status = '管控中'
        t.lastReview = new Date().toISOString().slice(0, 10)
        t._approvalHistory.push({ time: now, action: '分管领导批准', operator: '王志强', detail: '同意，按管控方案执行' })
        alert('✅ 分管领导已批准，风险点「' + t.name + '」正式生效归档')
      }
    },
    doReject(type) {
      if (!this.lecTarget) return
      const t = this.lecTarget
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
      const actor = type === 'review' ? '李明辉' : '王志强'
      const role = type === 'review' ? '安环室' : '分管领导'
      const reason = prompt(role + '驳回理由（选填）：')
      t._approvalState = 'rejected'
      t.status = '待补充措施'
      t._approvalHistory.push({ time: now, action: role + '驳回', operator: actor, detail: reason || '请重新评估' })
      alert('⛔ ' + role + '已驳回：' + (reason || '请重新评估'))
    },

    // ==== 风险告知卡 ====
    getRiskColor(level) {
      return { '重大': '#ef4444', '较大': '#f59e0b', '一般': '#eab308', '低': '#3b82f6' }[level] || '#94a3b8'
    },
    getEmergencyMeasures(risk) {
      const map = {
        '火灾爆炸': ['立即切断火源/电源', '使用灭火器/消防沙扑救初期火灾', '疏散附近人员至上风处', '拨打119并报告安环室'],
        '火灾': ['立即切断火源/电源', '使用灭火器材扑救初期火灾', '疏散附近人员', '拨打119并报告安环室'],
        '高处坠落': ['立即停止高处作业', '检查伤者意识与出血情况', '切勿随意移动疑似脊柱损伤者', '拨打120急救'],
        '车辆伤害': ['立即停车并拉手刹', '检查伤者情况', '保护事故现场', '拨打120急救并报告'],
        '中毒窒息': ['立即通风并撤离至安全区域', '佩戴防护装备后搜救', '对中毒者进行心肺复苏', '拨打120急救'],
        '职业危害': ['立即脱离噪声/粉尘环境', '检查听力/呼吸系统影响', '报告职业健康体检机构', '记录暴露时长与浓度']
      }
      return map[risk.category] || ['立即停止作业并撤离', '启动现场应急处置', '报告安环室（0351-6366XXX）', '拨打119/120（如需）']
    },
    getValidUntil(risk) {
      if (!risk.lastReview) return '—'
      const d = new Date(risk.lastReview)
      d.setFullYear(d.getFullYear() + 1)
      return d.toISOString().slice(0, 10)
    },
    printCard() {
      const style = document.createElement('style')
      style.textContent = '@media print{body>*:not(#riskCard){display:none!important}#riskCard{position:fixed;inset:20px;background:#fff}}'
      document.head.appendChild(style)
      window.print()
      setTimeout(() => document.head.removeChild(style), 500)
    },

    // ==== 四色图 ====
    onMapZoneClick({ zone, risks }) {
      this.selectedZone = this.selectedZone === zone.name ? '' : zone.name
    },

    // ==== APP 风险地图 ====
    appSelectRisk(id) { this.appSelectedRiskId = id },
    appRpIndex(id) { return this.appRiskPoints.findIndex(p => p.id === id) + 1 },
    appStatusClass(status) { return status === '正常' ? 'st-ok' : 'st-warn' },
    appGo(key) {
      if (key === 'risk-map') { this.appView = 'risk-map'; return }
      if (key === 'profile' || key === '个人中心') { this.appView = 'profile'; return }
      if (key === 'inspection' || key === 'guardian') { this.appView = 'tasks'; return }
      const m = this.appHomeMenu.find(x => x.key === key)
      this.appModuleLabel = m ? m.label : '功能模块'
      this.appView = 'module'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.tab-bar {
  display: inline-flex; gap: 6px; margin-bottom: $space-lg;
  background: #fff; border-radius: 14px; padding: 5px;
  box-shadow: 0 2px 12px rgba(15,23,42,.06); border: 1px solid rgba(15,23,42,.06);
}
.tab-btn {
  padding: 9px 22px; border: 0; background: transparent;
  border-radius: 10px; cursor: pointer; font-size: $font-sm; color: $text-secondary;
  transition: all .2s; font-weight: 600;
  &.active { background: $primary; color: #fff; box-shadow: 0 2px 8px rgba(26,95,220,.3); }
  &:hover:not(.active) { background: $gray-100; color: $text-primary; }
}

.stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: $space-md; margin-bottom: $space-lg; }
.stat-card {
  background: #fff; padding: $space-md $space-lg; border-radius: $radius-lg;
  text-align: center; box-shadow: $shadow-sm; border-left: 3px solid;
  &.red { border-color: $danger; } &.orange { border-color: $warning-500; }
  &.yellow { border-color: #eab308; } &.blue { border-color: $primary; } &.green { border-color: $accent-green; }
}
.stat-value { font-size: 28px; font-weight: 800; color: $text-primary; }
.stat-label { font-size: $font-xs; color: $text-secondary; margin-top: 4px; }

/* V2 gradient stat gallery */
.stat-gallery {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: $space-lg;
}
.sc-v2 {
  position: relative; background: #fff; border-radius: 16px; padding: 18px 16px;
  box-shadow: 0 2px 12px rgba(15,23,42,.06); overflow: hidden;
  animation: fadeInUp .45s both;
  transition: transform .2s, box-shadow .2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(15,23,42,.1); }
}
.scv2-glow {
  position: absolute; top: -24px; right: -24px; width: 70px; height: 70px;
  border-radius: 50%; opacity: .07; pointer-events: none;
}
.scv2-icon {
  width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center;
  justify-content: center; font-size: 18px; margin-bottom: 12px; opacity: .15;
}
.scv2-body { position: relative; z-index: 1; }
.scv2-label { font-size: 12px; color: $text-secondary; display: block; margin-bottom: 4px; }
.scv2-value { font-size: 30px; font-weight: 900; line-height: 1; }
.scv2-sub { font-size: 11px; color: $text-hint; display: block; margin-top: 4px; }
.scv2-border {
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px; opacity: .5;
}

@keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.section-card { background: #fff; border-radius: 16px; box-shadow: 0 2px 16px rgba(15,23,42,.06); margin-bottom: $space-lg; overflow: hidden; border: 1px solid rgba(15,23,42,.06); }
.section-head {
  padding: 16px 20px; border-bottom: 1px solid $gray-100;
  display: flex; align-items: baseline; gap: $space-md; flex-wrap: wrap;
  background: linear-gradient(to bottom, #fafbfc, #fff);
}
.section-title { font-size: $font-lg; font-weight: 700; color: $text-primary; }
.section-sub { font-size: $font-xs; color: $text-secondary; flex: 1; }

.btn-add-risk {
  margin-left: auto; padding: 6px 14px; border: 0; background: $primary; color: #fff;
  border-radius: $radius-base; cursor: pointer; font-size: $font-sm; font-weight: 600;
  white-space: nowrap;
  &:hover { background: $primary-dark; }
}

/* ====== 辨识布局 ====== */
.identify-layout { display: flex; height: 520px; }
.identify-left {
  width: 320px; min-width: 320px; border-right: 1px solid $border; display: flex; flex-direction: column;
}
.left-search { padding: 12px 16px; }
.search-input {
  width: 100%; padding: 7px 12px; border: 1px solid $border; border-radius: $radius-base;
  font-size: $font-sm; outline: none; box-sizing: border-box;
  &:focus { border-color: $primary; }
}
.unit-list { flex: 1; overflow-y: auto; }
.unit-row {
  padding: 12px 16px; cursor: pointer; border-bottom: 1px solid $gray-100; transition: background .12s;
  &:hover { background: $bg-page; }
  &.active { background: $primary-light; border-left: 3px solid $primary; padding-left: 13px; }
}
.unit-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.unit-name { font-size: $font-sm; font-weight: 700; color: $text-primary; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.unit-meta { font-size: $font-xs; color: $text-secondary; }
.empty-hint { padding: 40px 0; text-align: center; color: $text-secondary; font-size: $font-sm; }

.identify-right { flex: 1; overflow-y: auto; padding: 16px 20px; }
.identify-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: $text-secondary; font-size: $font-base; gap: 8px; text-align: center; }

/* 编辑区域 */
.edit-section { margin-bottom: 20px; }
.sec-head-row { margin-bottom: 10px; }
.sec-title {
  font-size: $font-base; font-weight: 800; color: $text-primary; margin: 0 0 4px; padding-left: 9px; border-left: 3px solid $primary; display: inline-block;
}
.sec-title-sm { font-size: $font-sm; font-weight: 700; color: $text-primary; margin: 12px 0 8px; }
.sec-desc { font-size: $font-xs; color: $text-secondary; display: block; margin-left: 12px; }

.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; }
.form-item {
  label { display: block; font-size: $font-xs; color: $text-secondary; margin-bottom: 4px; }
  input, select { width: 100%; padding: 7px 10px; border: 1px solid $border; border-radius: $radius-base; font-size: $font-sm; outline: none; box-sizing: border-box;
    &:focus { border-color: $primary; }
  }
}
.form-select { background: #fff; }
.input-disabled { background: $bg-page; color: $text-secondary; cursor: not-allowed; }
.required { color: $danger; }

/* 危险源编辑 */
.source-list-edit { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.source-row { display: flex; align-items: center; gap: 8px; }
.source-no { width: 22px; height: 22px; border-radius: 50%; background: $primary-light; color: $primary; font-size: $font-xs; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.source-input { flex: 1; padding: 6px 10px; border: 1px solid $border; border-radius: $radius-sm; font-size: $font-sm; outline: none; box-sizing: border-box;
  &:focus { border-color: $primary; }
}
.btn-icon-remove {
  width: 24px; height: 24px; border: 0; background: $danger-100; color: $danger; border-radius: 50%;
  cursor: pointer; font-size: 16px; line-height: 1; flex-shrink: 0;
  &:hover { background: #fee2e2; }
}
.add-row { display: flex; gap: 8px; align-items: center; margin-top: 8px; }
.add-input { flex: 1; padding: 6px 10px; border: 1px dashed $border; border-radius: $radius-sm; font-size: $font-sm; outline: none; box-sizing: border-box;
  &:focus { border-color: $primary; border-style: solid; }
}
.btn-add-sm {
  padding: 6px 14px; border: 1px solid $primary; background: #fff; color: $primary;
  border-radius: $radius-sm; cursor: pointer; font-size: $font-xs; font-weight: 600; white-space: nowrap;
  &:hover { background: $primary-light; }
  &:disabled { opacity: .4; cursor: not-allowed; }
}

/* 管控措施表格编辑 */
.mini-table {
  width: 100%; border-collapse: collapse; margin-top: 8px;
  th { background: $bg-page; color: $text-secondary; font-size: $font-xs; font-weight: 600; text-align: left; padding: 6px 8px; }
  td { padding: 4px 8px; border-bottom: 1px solid $border; font-size: $font-sm; }
}
.table-input {
  width: 100%; padding: 4px 6px; border: 1px solid transparent; border-radius: $radius-sm; font-size: $font-sm; outline: none; box-sizing: border-box; background: transparent;
  &:focus { border-color: $primary; background: #fff; }
}

.edit-actions { display: flex; gap: 8px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid $border; flex-wrap: wrap; }

/* 新增风险点弹窗 */
.dialog-mask { position: fixed; inset: 0; background: rgba(15,23,42,.36); z-index: 100; }
.dialog-card {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
  background: #fff; border-radius: $radius-xl; padding: 24px; width: 520px; max-width: 92vw;
  z-index: 101; box-shadow: 0 20px 60px rgba(15,23,42,.2);
  h4 { font-size: $font-lg; font-weight: 800; margin: 0 0 16px; }
}
.dialog-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }

/* 评价历史 */
.lec-history { margin-top: $space-lg; }
.history-list { display: flex; flex-direction: column; gap: 4px; }
.history-item { display: flex; gap: 12px; font-size: $font-xs; color: $text-secondary; padding: 4px 8px; background: $bg-page; border-radius: $radius-sm; }
.history-time { color: $text-secondary; min-width: 110px; }
.history-detail { font-weight: 600; flex: 1; }
.history-operator { color: $text-secondary; }

/* 表格 */
.table-wrap { overflow-x: auto; }
.data-table {
  width: 100%; border-collapse: collapse;
  th { background: $bg-page; color: $text-secondary; font-size: $font-xs; font-weight: 600; text-align: left; padding: 10px 12px; white-space: nowrap;
    &:first-child { padding-left: $space-lg; } &:last-child { padding-right: $space-lg; }
  }
  td { padding: 10px 12px; border-bottom: 1px solid $border; font-size: $font-sm; white-space: nowrap;
    &:first-child { padding-left: $space-lg; } &:last-child { padding-right: $space-lg; }
  }
  tr.clickable { cursor: pointer; transition: background .12s; }
  tr.clickable:hover { background: $bg-page; }
  tr:last-child td { border-bottom: none; }
}
.link { color: $primary; font-weight: 500; cursor: pointer; }

.tag {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: $radius-sm; font-size: $font-xs; font-weight: 600;
}
.tag-red { background: $danger-100; color: $danger; }
.tag-orange { background: #fff7ed; color: $warning-500; }
.tag-yellow { background: #fffbeb; color: #b7791f; }
.tag-blue { background: #e8f0fe; color: $primary; }
.tag-green { background: $success-100; color: $accent-green; }

.btn-sm { padding: 4px 10px; border: 1px solid $border; background: #fff; border-radius: $radius-sm; font-size: $font-xs; cursor: pointer; color: $primary;
  &:hover { border-color: $primary; background: $primary-light; }
}

/* LEC */
.lec-selector { padding: $space-lg $space-lg 0; display: flex; align-items: center; gap: $space-md;
  label { font-size: $font-sm; color: $text-secondary; }
}
.lec-select { padding: 6px 12px; border: 1px solid $border; border-radius: $radius-base; min-width: 260px; outline: none; font-size: $font-sm;
  &:focus { border-color: $primary; }
}
.lec-form { padding: 0 $space-lg $space-lg; }
.lec-params { display: grid; gap: $space-md; margin: $space-lg 0; }
.lec-label { font-size: $font-base; font-weight: 700; color: $text-primary; margin-bottom: $space-sm; }
.lec-options { display: flex; gap: 6px; flex-wrap: wrap; }
.lec-opt {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border: 1px solid $border; background: #fff;
  border-radius: $radius-base; cursor: pointer; font-size: $font-xs; transition: .15s;
  &.active { border-color: $primary; background: $primary-light; color: $primary; box-shadow: 0 0 0 2px rgba(26,95,220,.1); }
  &:hover:not(.active) { border-color: darken($border, 10%); }
}
.opt-num { font-weight: 800; font-size: $font-base; min-width: 16px; text-align: center; }
.opt-desc { color: $text-secondary; }
.opt-check { font-size: 10px; color: $primary; }

/* LEC V2 gauge result */
.lec-result-v2 {
  margin-top: $space-lg; padding: 20px; background: #fff; border-radius: 16px;
  border: 1px solid $gray-200; box-shadow: 0 2px 12px rgba(15,23,42,.04);
  display: flex; gap: 24px; align-items: center;
}
.result-gauge { position: relative; width: 110px; height: 110px; flex-shrink: 0; }
.gauge-svg { width: 100%; height: 100%; }
.gauge-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  font-size: 28px; font-weight: 900; text-align: center; line-height: 1; }
.gauge-sub { position: absolute; top: 62%; left: 50%; transform: translate(-50%, 0);
  font-size: 10px; color: $text-hint; }
.result-info-v2 { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.result-formula-v2 { font-size: 18px; color: $text-secondary;
  .r-l, .r-e, .r-c { font-weight: 800; margin: 0 2px; }
}
.result-level-v2 {
  padding: 6px 16px; border-radius: 999px; border: 2px solid;
  display: inline-flex; align-items: center; gap: 6px; font-size: 18px; font-weight: 800; align-self: flex-start;
}
.result-range-v2 { font-size: 12px; font-weight: 400; color: $text-secondary; }

/* Old LEC result hide */
.lec-result, .result-formula, .result-value, .result-level, .result-range, .result-actions { display: none; }

.btn-action-v2 {
  padding: 8px 20px; border-radius: 10px; border: 0;
  background: $gray-100; cursor: pointer; font-size: $font-sm; font-weight: 600; transition: .15s;
  display: inline-flex; align-items: center; gap: 6px;
  &.primary { background: $primary; color: #fff; box-shadow: 0 2px 8px rgba(26,95,220,.3);
    &:hover { background: $primary-dark; transform: translateY(-1px); }
  }
  &:disabled { opacity: .4; cursor: not-allowed; box-shadow: none; transform: none; }
}
.btn-action {
  padding: 8px 18px; border-radius: 999px; border: 1px solid $border;
  background: #fff; cursor: pointer; font-size: $font-sm; font-weight: 600; transition: .15s;
  &.primary { background: $primary; color: #fff; border-color: $primary; box-shadow: 0 2px 8px rgba(26,95,220,.25);
    &:hover { background: $primary-dark; transform: translateY(-1px); }
  }
  &.danger { color: $danger; border-color: $danger; }
  &.danger:hover { background: $danger-100; }
  &.outline { color: $primary; border-color: $primary; }
  &.outline:hover { background: $primary-light; }
  &:hover:not(.primary):not(.danger):not(.outline) { border-color: $primary; color: $primary; }
  &:disabled { opacity: .4; cursor: not-allowed; transform: none; box-shadow: none; }
}
.lec-empty { padding: $space-3xl; text-align: center; color: $text-secondary; font-size: $font-base; }

/* ====== APP 端风险地图（手机壳） ====== */
.app-risk-wrap { display: flex; gap: $space-2xl; align-items: flex-start; padding: 16px; flex-wrap: wrap; }
.phone-frame { width: 380px; flex-shrink: 0; background: #1a1a2e; border-radius: 36px; padding: 12px; box-shadow: 0 8px 40px rgba(0,0,0,.25); }
.phone-notch { width: 120px; height: 24px; background: #1a1a2e; margin: 0 auto 8px; border-radius: 0 0 18px 18px; }
.phone-screen { background: #f5f5f5; border-radius: 24px; overflow: hidden; height: 660px; max-height: 660px; display: flex; flex-direction: column; font-size: 12px; }
.app-statusbar { display: flex; justify-content: space-between; padding: 8px 20px; background: #2E7D32; color: #fff; font-size: 10px; }
.app-navbar { display: flex; align-items: center; padding: 8px 16px; background: #fff; border-bottom: 1px solid #eee; min-height: 36px; }
.app-navbar .an-back { font-size: 22px; color: #2E7D32; cursor: pointer; width: 24px; font-weight: 300; line-height: 1; flex-shrink: 0; }
.app-navbar .an-title { flex: 1; text-align: center; font-weight: 600; font-size: 13px; color: $text-primary; }
.app-body { flex: 1; overflow-y: auto; padding: 8px 12px; display: flex; flex-direction: column; gap: 8px; }

.mrm-legend { display: flex; align-items: center; gap: 10px; font-size: 10px; color: #666; flex-wrap: wrap; }
.mrl-item { display: flex; align-items: center; gap: 3px; }
.mrl-item .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.mrl-item .dot.major { background: #ef4444; }
.mrl-item .dot.larger { background: #f59e0b; }
.mrl-item .dot.normal { background: #eab308; }
.mrl-tip { margin-left: auto; color: #999; font-style: italic; }
.mrm-map { background: #fcfcfc; border-radius: 8px; border: 1px solid #eee; padding: 4px; }
.mrm-svg { width: 100%; height: auto; display: block; }
.mrm-point { cursor: pointer; }
.mrm-point:hover circle:first-child { stroke: #2E7D32; }
.mrm-pulse { animation: mrmPulse 1.6s ease-out infinite; }
@keyframes mrmPulse { 0% { r: 9; opacity: .8; } 100% { r: 18; opacity: 0; } }

.mrm-detail { background: #fff; border-radius: 8px; padding: 10px; border: 1px solid #e0e0e0; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
.mrmd-head { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
.mrmd-name { flex: 1; font-size: 13px; font-weight: 700; color: #333; }
.mrmd-close { font-size: 14px; color: #999; cursor: pointer; width: 18px; text-align: center; }
.mrmd-grid { display: flex; flex-direction: column; gap: 3px; margin-bottom: 8px; }
.mrmd-row { display: flex; justify-content: space-between; font-size: 11px; padding: 3px 0; border-bottom: 1px solid #f5f5f5; }
.mrmd-row span { color: #999; }
.mrmd-row b { color: #333; font-weight: 500; }
.mrmd-measures { background: #f0fdf4; border-radius: 6px; padding: 8px; }
.mrmdm-label { font-size: 10px; color: #43A047; font-weight: 600; margin-bottom: 3px; }
.mrmdm-text { font-size: 11px; color: #555; line-height: 1.5; }
.mrm-empty { text-align: center; font-size: 11px; color: #999; padding: 14px; background: #fff; border-radius: 8px; border: 1px dashed #ddd; }
.mrm-list { display: flex; flex-direction: column; gap: 4px; }
.mrmli { display: flex; align-items: center; gap: 8px; background: #fff; border-radius: 6px; padding: 7px 8px; font-size: 11px; cursor: pointer; border: 1px solid transparent; }
.mrmli.active { border-color: #43A047; background: #f0fdf4; }
.mrmli-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.mrmli-name { flex: 1; color: #333; }
.mrmli-level { font-size: 9px; padding: 1px 7px; border-radius: 9px; font-weight: 600; }
.lv-major { background: #fee2e2; color: #dc2626; }
.lv-larger { background: #fef3c7; color: #d97706; }
.lv-normal { background: #fef9c3; color: #a16207; }
.st-ok { color: #16a34a !important; }
.st-warn { color: #dc2626 !important; }

/* 底部 Tab 栏（标准手机导航） */
.app-bottom-bar { display: flex; border-top: 1px solid #e5e5e5; background: #fff; flex-shrink: 0; }
.abb-item { flex: 1; text-align: center; padding: 6px 0 8px; cursor: pointer; color: #9aa0a6; transition: color .15s; }
.abb-item.active { color: #2E7D32; }
.abb-icon { font-size: 17px; display: block; line-height: 1.2; }
.abb-label { font-size: 9px; display: block; margin-top: 1px; }

/* 移动工作台（前置页） */
.mob-user-card { background: linear-gradient(135deg, #43A047, #66BB6A); border-radius: 10px; padding: 12px; color: #fff; display: flex; align-items: center; gap: 10px; }
.muc-avatar { font-size: 30px; }
.muc-info { flex: 1; }
.muc-name { font-size: 14px; font-weight: 700; }
.muc-role { font-size: 10px; opacity: .85; }
.muc-status { font-size: 10px; background: rgba(255,255,255,.2); border-radius: 12px; padding: 3px 10px; font-weight: 500; }

.mob-menu-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.mm-item { background: #fff; border-radius: 8px; padding: 12px 6px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,.06); position: relative; cursor: pointer; &:active { background: #f0f0f0; } }
.mm-icon { font-size: 22px; margin-bottom: 4px; }
.mm-label { font-size: 10px; color: #333; font-weight: 500; }
.mm-badge { position: absolute; top: 4px; right: 4px; background: #F44336; color: #fff; font-size: 8px; min-width: 14px; height: 14px; line-height: 14px; border-radius: 7px; text-align: center; padding: 0 3px; }

.mob-banner { display: flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #e3f2fd, #f0f9ff); border: 1px solid #bfdbfe; border-radius: 10px; padding: 10px 12px; cursor: pointer; }
.mb-icon { font-size: 24px; }
.mb-text { flex: 1; }
.mb-title { font-size: 12px; font-weight: 700; color: #1565C0; }
.mb-desc { font-size: 10px; color: #555; margin-top: 1px; }
.mb-arrow { font-size: 20px; color: #1565C0; }

.mob-section-title { font-size: 12px; font-weight: 600; color: #333; padding-left: 2px; margin-top: 4px; }

.mob-task-card { background: #fff; border-radius: 10px; padding: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.06); cursor: pointer; &.done { opacity: .7; }
  .mtc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .mtc-title { font-size: 12px; font-weight: 600; color: #333; }
  .mtc-meta { font-size: 10px; color: #999; margin-bottom: 6px; }
  .mtc-bar { height: 4px; background: #e0e0e0; border-radius: 2px; overflow: hidden; }
  .mtc-fill { height: 100%; background: linear-gradient(90deg, #43A047, #66BB6A); border-radius: 2px; }
}
.mob-pending-card { display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 10px; padding: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.06); cursor: pointer; border-left: 3px solid #f59e0b;
  .mpc-icon { font-size: 24px; }
  .mpc-content { flex: 1; }
  .mpc-title { font-size: 12px; font-weight: 600; color: #333; }
  .mpc-desc { font-size: 10px; color: #666; }
  .mpc-time { font-size: 9px; color: #999; }
  .mpc-arrow { font-size: 18px; color: #ccc; }
}

/* 个人中心 */
.mob-profile { display: flex; flex-direction: column; gap: 10px; }
.mpf-top { background: linear-gradient(135deg, #43A047, #66BB6A); border-radius: 12px; padding: 16px; text-align: center; color: #fff; }
.mpf-avatar { font-size: 40px; }
.mpf-name { font-size: 16px; font-weight: 700; margin-top: 4px; }
.mpf-role { font-size: 11px; opacity: .85; }
.mpf-stats { display: flex; background: #fff; border-radius: 10px; padding: 12px 0; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
.mpf-stat { flex: 1; text-align: center; b { font-size: 18px; color: #2E7D32; display: block; } span { font-size: 9px; color: #999; } }
.mpf-list { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
.mpf-row { display: flex; justify-content: space-between; padding: 10px 12px; font-size: 11px; border-bottom: 1px solid #f5f5f5; &:last-child { border: none; } span { color: #999; } b { color: #333; } }

/* 模块占位 */
.mob-module { text-align: center; padding: 30px 16px; }
.mmd-icon { font-size: 44px; margin-bottom: 10px; }
.mmd-name { font-size: 16px; font-weight: 700; color: #333; margin-bottom: 8px; }
.mmd-desc { font-size: 11px; color: #999; line-height: 1.6; margin-bottom: 16px; }

.app-ui-notes { flex: 1; display: flex; flex-direction: column; gap: $space-base; min-width: 240px; }
.note-card { background: #fff; border-radius: $radius-base; padding: $space-base $space-lg; border: 1px solid $border; border-left: 3px solid #4CAF50; }
.note-card h4 { font-size: $font-sm; color: $text-primary; margin-bottom: $space-xs; }
.note-card p { font-size: $font-xs; color: $text-secondary; line-height: 1.5; }

/* Drawer */
.drawer-mask { position: fixed; inset: 0; background: rgba(15, 23, 42, .36); z-index: 90; }
.drawer {
  position: fixed; inset: 0 0 0 auto; width: min(720px, 94vw);
  background: #fff; z-index: 91; box-shadow: -16px 0 48px rgba(15, 23, 42, .16);
  display: flex; flex-direction: column; overflow-y: auto;
}
.drawer-head { padding: 20px 24px; border-bottom: 1px solid $border; display: flex; align-items: flex-start; justify-content: space-between; }
.drawer-title { font-size: $font-xl; font-weight: 800; }
.drawer-sub { font-size: $font-xs; color: $text-secondary; display: block; margin-top: 4px; }
.close-btn { width: 30px; height: 30px; border: 0; background: $bg-page; border-radius: 50%; cursor: pointer; font-size: 18px; color: $text-secondary; line-height: 1; }
.drawer-body { padding: 20px 24px; flex: 1; }
.drawer-foot { padding: 14px 24px; border-top: 1px solid $border; display: flex; gap: 8px; justify-content: flex-end; }

.detail-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-md; margin-bottom: $space-lg; }
.detail-item { padding: $space-sm $space-md; background: $bg-page; border-radius: $radius-base;
  dt { font-size: $font-xs; color: $text-secondary; margin-bottom: 4px; }
  dd { font-size: $font-sm; font-weight: 600; color: $text-primary; }
}

/* ====== V2 审批链步骤条 ====== */
.approval-chain-v2 {
  background: linear-gradient(135deg, #f8fafc, $gray-100); border-radius: 14px;
  padding: 16px 20px; margin-bottom: 20px; border: 1px solid $gray-200;
}
.chain-v2-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
  font-size: $font-sm; font-weight: 700; color: $text-primary;
}
.chain-v2-badge {
  padding: 3px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; color: #fff;
}
.chain-v2-track {
  display: flex; align-items: flex-start; position: relative; gap: 0;
  &::before {
    content: ''; position: absolute; top: 18px; left: 18px; right: 18px; height: 4px;
    background: $gray-200; border-radius: 2px; z-index: 0;
  }
}
.chain-v2-fill {
  position: absolute; top: 18px; left: 18px; height: 4px;
  background: linear-gradient(90deg, #3b82f6, $accent-green); border-radius: 2px;
  z-index: 1; transition: width .6s cubic-bezier(.4,0,.2,1);
}
.chain-v2-node {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;
  position: relative; z-index: 2;
}
.node-circle {
  width: 36px; height: 36px; border-radius: 50%; background: #fff; border: 3px solid $gray-200;
  display: flex; align-items: center; justify-content: center; font-size: 13px;
  font-weight: 700; color: $gray-400; transition: all .4s;
}
.chain-v2-node.done .node-circle {
  background: $accent-green; border-color: $accent-green; color: #fff;
}
.chain-v2-node.active .node-circle {
  background: #fff; border-color: $primary; color: $primary;
  box-shadow: 0 0 0 6px rgba(59,130,246,.12);
  animation: nodePulse 2s infinite;
}
@keyframes nodePulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(59,130,246,.12); }
  50% { box-shadow: 0 0 0 10px rgba(59,130,246,.06); }
}
.pulse-dot {
  width: 8px; height: 8px; border-radius: 50%; background: $primary; animation: dotPulse 1.2s infinite;
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .4; transform: scale(1.3); }
}
.node-text { text-align: center; }
.node-label { font-size: 11px; font-weight: 700; color: $text-primary; }
.node-role { font-size: 10px; color: $text-hint; margin-top: 1px; }
.chain-v2-node.done .node-label { color: $accent-green; }
.chain-v2-node.active .node-label { color: $primary; }

/* 旧审批链样式保留（兼容但隐藏） */
.approval-chain { display: none; }

.lec-readonly { padding: 16px 0; }
.readonly-params {
  display: flex; gap: 20px; flex-wrap: wrap; font-size: $font-sm; color: $text-secondary;
  padding: 12px 16px; background: #f8fafc; border-radius: 10px; border: 1px solid $gray-200;
}
.readonly-result { font-size: $font-base; margin-left: auto; }

.approval-actions { margin-top: 16px; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.approval-rejected { margin-top: 16px; padding: 14px 18px; background: $danger-100; border-radius: 12px;
  display: flex; align-items: center; gap: 12px; color: $danger; font-size: $font-sm; border: 1px solid #fecaca; }
.history-note { color: $text-secondary; font-size: $font-xs; flex: 1; text-align: right; }

/* ====== 四色图 ====== */
.map-wrap { padding: 12px 16px; overflow-x: auto; }
.factory-map { width: 100%; max-width: 900px; display: block; margin: 0 auto; }
.map-zone { cursor: pointer; transition: opacity .15s; }
.map-zone:hover { opacity: .8; }

/* ====== 风险告知卡 V2 ====== */
.card-body { padding: 16px 20px 20px; }
.risk-card {
  max-width: 700px; margin: 0 auto; background: #fff;
  border: 1px solid $gray-200; border-radius: 16px; overflow: hidden;
  box-shadow: 0 4px 24px rgba(15,23,42,.08);
}
.card-header {
  padding: 20px 24px; color: #fff; display: flex; justify-content: space-between; align-items: center;
  position: relative; overflow: hidden;
  &::after { content: ''; position: absolute; top: -30px; right: -20px; width: 100px; height: 100px;
    background: rgba(255,255,255,.1); border-radius: 50%; }
}
.card-badge { font-size: 22px; font-weight: 800; letter-spacing: 3px; position: relative; z-index: 1; }
.card-level { font-size: 30px; font-weight: 900; opacity: .9; position: relative; z-index: 1; }
.card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.card-cell { padding: 14px 18px; border-bottom: 1px solid $gray-100; border-right: 1px solid $gray-100;
  &:nth-child(even) { border-right: 0; }
}
.card-label { font-size: $font-xs; color: $text-secondary; margin-bottom: 3px; }
.card-value { font-size: $font-sm; font-weight: 700; color: $text-primary; }
.card-section { padding: 14px 18px; border-bottom: 1px solid $gray-100; }
.card-section-title { font-size: $font-base; font-weight: 800; margin-bottom: 8px; }
.card-list { display: flex; flex-direction: column; gap: 5px; padding-left: 4px; }
.card-list-item { font-size: $font-sm; color: $text-primary; display: flex; align-items: baseline; gap: 6px; }
.card-dot { font-size: 10px; flex-shrink: 0; color: $danger; }
.card-meta { color: $text-secondary; font-size: $font-xs; }
.card-footer-grid { display: grid; grid-template-columns: 1fr 1fr; }
.card-footer-grid .card-cell { border-bottom: 0; }
.card-date { padding: 12px 18px; font-size: $font-xs; color: $text-secondary; text-align: center; border-top: 1px solid $gray-100; background: $gray-50; }
.card-actions-bar { display: flex; justify-content: center; margin-top: 20px; }

@media print {
  .tab-bar, .stats-row, .section-head, .card-actions-bar, .sidebar, .lec-empty, .section-sub {
    display: none !important;
  }
  .section-card { box-shadow: none !important; border: 0 !important; }
  .risk-card { box-shadow: none !important; border: 1px solid #000 !important; }
}
</style>
