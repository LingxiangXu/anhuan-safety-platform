<template>
  <div class="plan-page">
    <div class="page-header">
      <h2>建设规划</h2>
      <p class="page-subtitle">分两期交付，一期覆盖6大核心模块预算50万，二期按产品功能清单扩展7大能力模块</p>
    </div>
    <!-- 分期总览 -->
    <section class="ov-section">
      <h3 class="section-title">分期总览</h3>
      <div class="phase-overview">
        <div class="po-phase current">
          <div class="pop-badge">一期</div>
          <div class="pop-title">核心流程上线</div>
          <div class="pop-time">2026 Q3-Q4 · 3个月</div>
          <div class="pop-items">
            <div class="popi" v-for="item in phase1Items" :key="item">{{ item }}</div>
          </div>
        </div>
        <div class="po-arrow">→</div>
        <div class="po-phase future">
          <div class="pop-badge">二期</div>
          <div class="pop-title">深度能力扩展</div>
          <div class="pop-time">2027 Q1-Q2 · 3个月</div>
          <div class="pop-items">
            <div class="popi" v-for="item in phase2Items" :key="item">{{ item }}</div>
          </div>
        </div>
      </div>
    </section>
    <!-- 一期详细规划 -->
    <section class="ov-section">
      <h3 class="section-title">一期：核心流程线上化（2026 Q3-Q4）</h3>
      <div class="phase-detail">
        <div class="pd-goal">
          <strong>目标：</strong>将隐患治理、集团督办、特殊作业管控、风险管理、BPM审批对接、培训管理六大核心模块全面线上化，打通集团-公司-现场三级数据链路，实现安全管理"从纸质到数字"的跨越。
        </div>
        <div class="pd-milestones">
          <div class="pdm-item" v-for="(m, i) in phase1Milestones" :key="i">
            <div class="pdmi-dot"></div>
            <div class="pdmi-content">
              <div class="pdmi-header">
                <span class="pdmi-name">M{{ i + 1 }}: {{ m.name }}</span>
                <span class="pdmi-week">{{ m.week }}</span>
              </div>
              <div class="pdmi-desc">{{ m.desc }}</div>
              <div class="pdmi-deliverables">
                <span class="pdmid-label">交付物：</span>
                <span v-for="(d, di) in m.deliverables" :key="di" class="pdmid-tag">{{ d }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 二期详细规划 -->
    <section class="ov-section">
      <h3 class="section-title">二期：深度能力扩展（2027 Q1-Q2）</h3>
      <div class="phase-detail">
        <div class="pd-goal">
          <strong>目标：</strong>在一期数据积累基础上，引入AI智能预警、多维度数据报表分析、应急管理等深度能力，将安全管理从"数字化"升级为"数智化"。
        </div>
        <div class="pd-milestones">
          <div class="pdm-item" v-for="(m, i) in phase2Milestones" :key="i">
            <div class="pdmi-dot future"></div>
            <div class="pdmi-content">
              <div class="pdmi-header">
                <span class="pdmi-name">M{{ i + 1 }}: {{ m.name }}</span>
                <span class="pdmi-week">{{ m.week }}</span>
              </div>
              <div class="pdmi-desc">{{ m.desc }}</div>
              <div class="pdmi-deliverables">
                <span class="pdmid-label">交付物：</span>
                <span v-for="(d, di) in m.deliverables" :key="di" class="pdmid-tag future">{{ d }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 人力资源需求 -->
    <section class="ov-section">
      <h3 class="section-title">人力资源规划</h3>
      <div class="section-card" style="padding:0; overflow:hidden">
        <table class="data-table">
          <thead>
            <tr><th>角色</th><th>一期人数</th><th>二期人数</th><th>职责说明</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>项目经理</strong></td><td>1</td><td>1</td><td>整体项目推进、干系人沟通、里程碑管理</td>
            </tr>
            <tr>
              <td><strong>产品经理</strong></td><td>1</td><td>1</td><td>需求分析、原型设计、用户验收</td>
            </tr>
            <tr>
              <td><strong>前端开发</strong></td><td>2</td><td>2</td><td>Vue.js Web端 + 移动APP端开发</td>
            </tr>
            <tr>
              <td><strong>后端开发</strong></td><td>2</td><td>2</td><td>API服务、数据模型、流程引擎</td>
            </tr>
            <tr>
              <td><strong>测试工程师</strong></td><td>1</td><td>1</td><td>功能测试、集成测试、UAT支持</td>
            </tr>
            <tr>
              <td><strong>UI设计师</strong></td><td>1</td><td>0.5</td><td>界面设计、交互规范（一期为主）</td>
            </tr>
            <tr>
              <td><strong>数据工程师</strong></td><td>0</td><td>1</td><td>数据分析模型、报表开发（二期新增）</td>
            </tr>
            <tr style="background:#f9fafb">
              <td><strong>合计</strong></td>
              <td><strong>8人</strong></td>
              <td><strong>8.5人</strong></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <!-- 风险与应对 -->
    <section class="ov-section">
      <h3 class="section-title">关键风险与应对</h3>
      <div class="risk-cards">
        <div class="rc-card">
          <div class="rcc-header">
            <span class="rcc-level high">高</span>
            <span class="rcc-title">用户接受度不足</span>
          </div>
          <div class="rcc-body">
            <p>一线人员对移动端操作不熟悉，可能抵触使用。</p>
            <div class="rcc-measure"><strong>应对：</strong>分角色培训（集团/公司/现场），制作操作手册与视频教程，设置1个月并行过渡期（纸质+线上并用）。</div>
          </div>
        </div>
        <div class="rc-card">
          <div class="rcc-header">
            <span class="rcc-level mid">中</span>
            <span class="rcc-title">数据迁移复杂度</span>
          </div>
          <div class="rcc-body">
            <p>历史隐患数据/人员资质数据散布在Excel/纸质/旧系统中，格式不统一。</p>
            <div class="rcc-measure"><strong>应对：</strong>一期先上线新系统+新数据，历史数据筛选后批量导入；提供Excel导入模板供各部门自行整理。</div>
          </div>
        </div>
        <div class="rc-card">
          <div class="rcc-header">
            <span class="rcc-level mid">中</span>
            <span class="rcc-title">组织变革阻力</span>
          </div>
          <div class="rcc-body">
            <p>现有线下审批流程根深蒂固，部分领导不愿放弃"纸质签字"习惯。</p>
            <div class="rcc-measure"><strong>应对：</strong>由集团安环部牵头发文，明确系统上线后必须线上审批；过渡期后纸质审批不具效力。</div>
          </div>
        </div>
        <div class="rc-card">
          <div class="rcc-header">
            <span class="rcc-level low">低</span>
            <span class="rcc-title">系统集成复杂度</span>
          </div>
          <div class="rcc-body">
            <p>后续可能需要与HR系统（人员数据）、ERP系统（设备数据）对接。</p>
            <div class="rcc-measure"><strong>应对：</strong>预留标准API接口，一期独立运行不依赖外部系统，二期按需对接。</div>
          </div>
        </div>
      </div>
    </section>
    <!-- ====== 项目报价 ====== -->
    <section class="ov-section">
      <h3 class="section-title">项目报价</h3>
      <p class="section-note">以下报价基于当前 Demo 功能范围，按照行业标准人天单价 ¥2,500/天 估算，实际价格以商务合同为准。</p>
      <!-- 一期 PC 端 -->
      <div class="pricing-block">
        <h4 class="pricing-subtitle"><span class="ps-badge phase1">一期</span> PC端核心模块</h4>
        <div class="section-card" style="padding:0; overflow:hidden">
          <table class="data-table pricing-table">
            <thead>
              <tr><th style="width:60px">序号</th><th>模块</th><th style="width:180px">核心功能</th><th style="width:80px">工作量<br/>(人天)</th><th style="width:90px">单价<br/>(元/天)</th><th style="width:90px">小计<br/>(万元)</th></tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in pricingPcModules" :key="'pc'+i">
                <td class="tc">{{ i + 1 }}</td>
                <td><strong>{{ item.name }}</strong></td>
                <td class="td-func">{{ item.func }}</td>
                <td class="tc">{{ item.days }}</td>
                <td class="tc">2,500</td>
                <td class="tc tr"><strong>{{ (item.days * 0.25).toFixed(1) }}</strong></td>
              </tr>
              <tr class="sum-row">
                <td colspan="3" class="tr"><strong>PC端合计</strong></td>
                <td class="tc"><strong>{{ pricingPcTotal }}</strong></td>
                <td></td>
                <td class="tc tr"><strong>{{ (pricingPcTotal * 0.25).toFixed(1) }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 一期 APP 端 -->
      <div class="pricing-block">
        <h4 class="pricing-subtitle"><span class="ps-badge app">一期</span> APP移动现场模块</h4>
        <div class="section-card" style="padding:0; overflow:hidden">
          <table class="data-table pricing-table">
            <thead>
              <tr><th style="width:60px">序号</th><th>模块</th><th style="width:180px">核心功能</th><th style="width:80px">工作量<br/>(人天)</th><th style="width:90px">单价<br/>(元/天)</th><th style="width:90px">小计<br/>(万元)</th></tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in pricingAppModules" :key="'app'+i">
                <td class="tc">{{ i + 1 }}</td>
                <td><strong>{{ item.name }}</strong></td>
                <td class="td-func">{{ item.func }}</td>
                <td class="tc">{{ item.days }}</td>
                <td class="tc">2,500</td>
                <td class="tc tr"><strong>{{ (item.days * 0.25).toFixed(1) }}</strong></td>
              </tr>
              <tr class="sum-row">
                <td colspan="3" class="tr"><strong>APP端合计</strong></td>
                <td class="tc"><strong>{{ pricingAppTotal }}</strong></td>
                <td></td>
                <td class="tc tr"><strong>{{ (pricingAppTotal * 0.25).toFixed(1) }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 二期模块 -->
      <div class="pricing-block">
        <h4 class="pricing-subtitle"><span class="ps-badge phase2">二期</span> 深度能力扩展</h4>
        <div class="section-card" style="padding:0; overflow:hidden">
          <table class="data-table pricing-table">
            <thead>
              <tr><th style="width:60px">序号</th><th>模块</th><th style="width:180px">核心功能</th><th style="width:80px">工作量<br/>(人天)</th><th style="width:90px">单价<br/>(元/天)</th><th style="width:90px">小计<br/>(万元)</th></tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in pricingPhase2Modules" :key="'p2'+i">
                <td class="tc">{{ i + 1 }}</td>
                <td><strong>{{ item.name }}</strong></td>
                <td class="td-func">{{ item.func }}</td>
                <td class="tc">{{ item.days }}</td>
                <td class="tc">2,500</td>
                <td class="tc tr"><strong>{{ (item.days * 0.25).toFixed(1) }}</strong></td>
              </tr>
              <tr class="sum-row">
                <td colspan="3" class="tr"><strong>二期合计</strong></td>
                <td class="tc"><strong>{{ pricingPhase2Total }}</strong></td>
                <td></td>
                <td class="tc tr"><strong>{{ (pricingPhase2Total * 0.25).toFixed(1) }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 费用汇总 -->
      <div class="pricing-block">
        <h4 class="pricing-subtitle">费用汇总</h4>
        <div class="section-card" style="padding:0; overflow:hidden">
          <table class="data-table pricing-table">
            <thead>
              <tr><th style="width:60px">序号</th><th>费用项</th><th style="width:200px">计算说明</th><th style="width:100px">金额 (万元)</th><th>备注</th></tr>
            </thead>
            <tbody>
              <tr>
                <td class="tc">1</td><td><strong>一期开发费 (PC端)</strong></td>
                <td>{{ pricingPcTotal }} 人天 × ¥2,500</td>
                <td class="tc tr"><strong>{{ (pricingPcTotal * 0.25).toFixed(1) }}</strong></td>
                <td>含需求分析、UI设计、前后端开发</td>
              </tr>
              <tr>
                <td class="tc">2</td><td><strong>一期开发费 (APP端)</strong></td>
                <td>{{ pricingAppTotal }} 人天 × ¥2,500</td>
                <td class="tc tr"><strong>{{ (pricingAppTotal * 0.25).toFixed(1) }}</strong></td>
                <td>含H5混合APP适配、移动端特有交互</td>
              </tr>
              <tr>
                <td class="tc">3</td><td><strong>二期开发费</strong></td>
                <td>{{ pricingPhase2Total }} 人天 × ¥2,500</td>
                <td class="tc tr"><strong>{{ (pricingPhase2Total * 0.25).toFixed(1) }}</strong></td>
                <td>制度化管理、应急管理、目标职责、设备设施、职业健康、相关方、双控统计</td>
              </tr>
              <tr style="background:#f9fafb">
                <td class="tc"></td><td><strong>开发费小计</strong></td><td>{{ pricingPcTotal + pricingAppTotal + pricingPhase2Total }} 人天</td>
                <td class="tc tr" style="font-size:15px"><strong>{{ ((pricingPcTotal + pricingAppTotal + pricingPhase2Total) * 0.25).toFixed(1) }}</strong></td><td></td>
              </tr>
              <tr>
                <td class="tc">4</td><td><strong>项目管理费</strong></td>
                <td>开发费的 12%</td>
                <td class="tc tr">{{ ((pricingPcTotal + pricingAppTotal + pricingPhase2Total) * 0.25 * 0.12).toFixed(1) }}</td>
                <td>项目经理、质量管理、文档管理</td>
              </tr>
              <tr>
                <td class="tc">5</td><td><strong>测试与实施费</strong></td>
                <td>开发费的 10%</td>
                <td class="tc tr">{{ ((pricingPcTotal + pricingAppTotal + pricingPhase2Total) * 0.25 * 0.10).toFixed(1) }}</td>
                <td>功能测试、集成测试、UAT、部署培训</td>
              </tr>
              <tr>
                <td class="tc">6</td><td><strong>税费</strong></td>
                <td>(开发+管理+测试) × 6%</td>
                <td class="tc tr">{{ ((pricingPcTotal + pricingAppTotal + pricingPhase2Total) * 0.25 * 1.22 * 0.06).toFixed(1) }}</td>
                <td>增值税及附加（软件产品即征即退另计）</td>
              </tr>
              <tr class="total-row">
                <td colspan="2" class="tr"><strong>项目总报价</strong></td>
                <td>一 + 二期合计</td>
                <td class="tc tr" style="font-size:18px"><strong>{{ ((pricingPcTotal + pricingAppTotal + pricingPhase2Total) * 0.25 * 1.22 * 1.06).toFixed(1) }}</strong></td>
                <td><strong>万元（含税）</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 服务与维保 -->
      <div class="pricing-block">
        <h4 class="pricing-subtitle">服务与维保（可选）</h4>
        <div class="section-card" style="padding:0; overflow:hidden">
          <table class="data-table pricing-table">
            <thead>
              <tr><th style="width:60px">序号</th><th>服务项</th><th style="width:200px">服务内容</th><th style="width:100px">费用 (万元/年)</th><th>备注</th></tr>
            </thead>
            <tbody>
              <tr>
                <td class="tc">1</td><td><strong>基础维保</strong></td>
                <td>Bug修复、安全补丁、小版本迭代</td>
                <td class="tc tr">{{ ((pricingPcTotal + pricingAppTotal) * 0.25 * 0.15).toFixed(1) }}</td>
                <td>合同额的 15%/年，赠送首年</td>
              </tr>
              <tr>
                <td class="tc">2</td><td><strong>云服务器资源</strong></td>
                <td>4核16G × 2 + MySQL + Redis + OSS + CDN</td>
                <td class="tc tr">3.0 ~ 5.0</td>
                <td>视并发量选配，按年计费</td>
              </tr>
              <tr>
                <td class="tc">3</td><td><strong>短信/通知服务</strong></td>
                <td>预警短信、待办提醒推送（预充值）</td>
                <td class="tc tr">1.0 ~ 2.0</td>
                <td>按实际用量结算，预估</td>
              </tr>
              <tr>
                <td class="tc">4</td><td><strong>高德地图 API</strong></td>
                <td>定位签到、风险地图渲染（商用授权）</td>
                <td class="tc tr">0.5 ~ 1.0</td>
                <td>按 QPS 和调用量计费</td>
              </tr>
              <tr>
                <td class="tc">5</td><td><strong>定制化开发</strong></td>
                <td>超出标准功能的额外需求开发</td>
                <td class="tc tr">按人天另计</td>
                <td>¥2,500/人天，按实际需求评估</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 报价说明 -->
      <div class="pricing-notes">
        <h4 class="pricing-subtitle">报价说明</h4>
        <ul>
          <li><strong>计价标准：</strong>行业标准人天单价 ¥2,500/天（含需求分析、UI设计、前后端开发、联调自测），不含差旅费。</li>
          <li><strong>含税说明：</strong>总价为含税价，增值税率 6%（软件产品可享受即征即退优惠，实际税负约 3%）。</li>
          <li><strong>首年维保：</strong>一期上线验收后赠送 12 个月基础维保（Bug修复 + 安全补丁）。</li>
          <li><strong>不含项：</strong>服务器/域名/SSL证书等基础设施费用、第三方API调用费、定制化开发超出标准模块的部分。</li>
          <li><strong>报价有效期：</strong>本报价自出具之日起 60 个自然日内有效，实际开发周期和范围以签署的 SOW 为准。</li>
          <li><strong>付款方式建议：</strong>合同签订 30% → 一期上线验收 40% → 二期上线验收 30%。</li>
        </ul>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: 'SafetyPlan',
  data() {
    return {
      phase1Items: [
        '隐患全生命周期治理',
        '集团督办独立流转',
        '特殊作业票全流程管控',
        '驾驶舱与风险四色图',
        '风险管理与BPM审批对接',
        '培训管理与证书预警',
        'APP移动巡检与随手拍',
        '组织架构与角色权限'
      ],
      phase2Items: [
        '应急管理（物资/预案/演练）',
        '制度化管理（法规/规章/规程）',
        '目标职责深化（履职/全员参与）',
        '设备设施安全管理（6类特种设备）',
        '职业健康与劳保用品',
        '双控数据统计与预测预警',
        '相关方管理（名录/人员/项目监控）'
      ],
      phase1Milestones: [
        { name: '基础平台搭建', week: '第1-2周', desc: '组织架构与权限体系、数据模型设计、技术框架搭建', deliverables: ['组织架构配置', '6角色权限体系', 'API框架'] },
        { name: '隐患治理模块', week: '第3-5周', desc: '隐患上报→受理→整改→复查→闭环全流程', deliverables: ['隐患台账', '详情时间线', '整改任务流程'] },
        { name: '集团督办模块', week: '第6-7周', desc: '督办发起→接收→反馈→关闭，关联隐患互查', deliverables: ['督办清单', '反馈记录', '独立闭环逻辑'] },
        { name: '特殊作业管控', week: '第8-10周', desc: '作业票申请→资格校验→审核→审批→监护确认→验收→归档', deliverables: ['6步流程链', '资格闸门', '高危作业阻断'] },
        { name: '驾驶舱与风险图', week: '第7-9周', desc: '驾驶舱看板、风险四色图、指标统计', deliverables: ['风险四色图SVG', 'KPI卡片', '公司对比面板'] },
        { name: '移动现场APP', week: '第8-10周', desc: '巡检任务、隐患随手拍、监护人确认', deliverables: ['巡检打勾', '随手拍上报', '监护确认'] },
        { name: '联调测试与上线', week: '第11-12周', desc: '系统集成测试、用户验收测试、培训与上线', deliverables: ['UAT报告', '操作手册', '培训记录'] }
      ],
      phase2Milestones: [
        { name: '制度化管理', week: '第1-3周', desc: '法律法规库建设、适用识别、内部规章制度与安全规程管理', deliverables: ['法律法规库', '适用识别引擎', '规章制度管理'] },
        { name: '应急管理', week: '第2-5周', desc: '应急物资台账、应急预案管理、演练计划与记录', deliverables: ['应急物资管理', '应急预案', '演练记录'] },
        { name: '目标职责深化', week: '第4-6周', desc: '岗位安全履职清单、个人履职记录、全员参与率统计', deliverables: ['履职清单', '履职记录', '登录率/参与率看板'] },
        { name: '设备设施安全', week: '第5-9周', desc: '锅炉/压力容器/管道/车辆/电梯/起重机械台账，检测周期与到期提醒', deliverables: ['设备台账', '检测周期预警', '维保记录'] },
        { name: '职业健康与劳保', week: '第7-9周', desc: '接害因素设置、体检计划/记录、劳保配备标准与分发记录', deliverables: ['接害因素监测', '体检档案', '劳保配置标准'] },
        { name: '相关方管理', week: '第8-10周', desc: '相关方名录、人员资质、绩效评价、项目安全监控', deliverables: ['相关方名录', '持证台账', '项目安全监控'] },
        { name: '双控统计与预测预警', week: '第9-12周', desc: '漏查率/自查率/排查率统计、治理报表、AI预测预警', deliverables: ['双控统计报表', '预测预警引擎', '治理趋势分析'] }
      ],
      // ==== 报价数据 ====
      pricingPcModules: [
        { name: '基础平台搭建', func: '组织架构、6角色权限、API框架、数据字典、日志审计', days: 16 },
        { name: '集团驾驶舱', func: '综合看板、统计卡片、ECharts趋势图、公司对比面板', days: 13 },
        { name: '风险管理', func: '风险辨识、LEC 3级审批链、四色图、告知卡、风险矩阵', days: 15 },
        { name: '隐患治理与集团督办', func: '登记→受理→整改→复查→闭环，集团督办独立流转', days: 17 },
        { name: '特殊作业管控', func: '6步全流程（申请→审核→审批→监护→作业→验收→归档）', days: 15 },
        { name: 'BPM审批对接', func: '对接已有BPM系统、审批流程映射、状态同步、超时预警', days: 12 },
        { name: '培训管理', func: '培训计划、证书预警、成绩追踪、进度可视化', days: 10 }
      ],
      pricingAppModules: [
        { name: '移动工作台', func: '巡检任务、隐患随手拍、监护人确认、代办列表', days: 14 },
        { name: '作业票', func: '作业票列表、安全措施核查、拍照留证、完工上报', days: 12 },
        { name: '到岗签到', func: 'GPS定位、地图显示、人脸验证、签到历史', days: 5 },
        { name: '应急求助', func: 'SOS一键报警、6类紧急分类、响应追踪、应急指引', days: 7 },
        { name: '消息中心', func: '预警/待办/通知/信息4类消息、分类筛选、未读标记', days: 5 },
        { name: '风险地图', func: 'SVG厂区四色标注、风险点定位、图例标识、统计卡', days: 7 },
        { name: '个人中心', func: '个人信息、资质证书(到期提醒)、培训记录、安全积分、出勤日历', days: 6 }
      ],
      pricingPhase2Modules: [
        { name: '制度化管理', func: '法律法规库、适用识别、规章制度、安全规程', days: 10 },
        { name: '应急管理', func: '应急物资台账、应急预案管理、演练计划与记录', days: 12 },
        { name: '目标职责深化', func: '岗位安全履职清单、个人履职记录、全员参与统计', days: 10 },
        { name: '设备设施安全', func: '锅炉/压力容器/管道/车辆/电梯/起重机械台账、检测周期预警', days: 14 },
        { name: '职业健康与劳保', func: '接害因素监测、体检计划/档案、劳保配备标准/分发记录', days: 10 },
        { name: '相关方管理', func: '相关方名录、人员资质、绩效评价、项目安全监控、奖惩记录', days: 12 },
        { name: '双控统计与预测预警', func: '漏查率/自查率/排查率统计、治理报表、AI趋势预测预警', days: 12 }
      ]
    };
  },
  computed: {
    pricingPcTotal() {
      return this.pricingPcModules.reduce((sum, m) => sum + m.days, 0);
    },
    pricingAppTotal() {
      return this.pricingAppModules.reduce((sum, m) => sum + m.days, 0);
    },
    pricingPhase2Total() {
      return this.pricingPhase2Modules.reduce((sum, m) => sum + m.days, 0);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
.plan-page { max-width: 960px; }
.page-header {
  margin-bottom: $space-xl;
  h2 { font-size: $font-2xl; font-weight: 600; color: $text-primary; margin-bottom: $space-xs; }
  .page-subtitle { font-size: $font-sm; color: $text-hint; }
}
.ov-section { margin-bottom: $space-2xl; }
.section-title { font-size: $font-md; font-weight: 600; color: $text-primary; margin-bottom: $space-lg; padding-left: 12px; border-left: 3px solid $primary; }
.section-card { background: #fff; border-radius: $radius-lg; padding: $space-lg $space-xl; border: 1px solid $border; }
// Phase Overview
.phase-overview { display: flex; align-items: flex-start; gap: $space-xl; }
.po-phase {
  flex: 1; background: #fff; border-radius: $radius-lg; padding: $space-xl; border: 1px solid $border;
  &.current { border-color: $primary; border-width: 2px; }
  &.future { border-color: $info; }
}
.pop-badge { display: inline-block; font-size: $font-xs; font-weight: 700; padding: 3px 14px; border-radius: 12px; margin-bottom: $space-sm;
  .current & { background: $primary; color: #fff; }
  .future & { background: $info; color: #fff; }
}
.pop-title { font-size: $font-lg; font-weight: 700; color: $text-primary; margin-bottom: $space-xs; }
.pop-time { font-size: $font-xs; color: $text-hint; margin-bottom: $space-base; }
.pop-items { display: flex; flex-direction: column; gap: 4px; }
.popi { font-size: $font-xs; color: $text-secondary; padding: 3px 0; &::before { content: '▸ '; color: $primary; } }
.po-arrow { font-size: 28px; color: $text-hint; padding-top: 40px; flex-shrink: 0; }
// Phase Detail
.phase-detail { background: #fff; border-radius: $radius-lg; border: 1px solid $border; padding: $space-xl; }
.pd-goal { font-size: $font-sm; color: $text-secondary; line-height: 1.8; margin-bottom: $space-xl; padding: $space-base $space-lg; background: #f0f7ff; border-radius: $radius-base; border-left: 3px solid $info;
  strong { color: $primary; }
}
.pd-milestones { position: relative; padding-left: $space-xl; }
.pd-milestones::before { content: ''; position: absolute; left: 9px; top: 8px; bottom: 8px; width: 2px; background: $border; }
.pdm-item { display: flex; gap: $space-lg; padding-bottom: $space-lg; position: relative;
  &:last-child { padding-bottom: 0; }
}
.pdmi-dot { width: 20px; height: 20px; border-radius: 50%; background: $primary; border: 3px solid #fff; box-shadow: 0 0 0 2px $primary; flex-shrink: 0; position: relative; z-index: 1;
  &.future { background: $info; box-shadow: 0 0 0 2px $info; }
}
.pdmi-content { flex: 1; }
.pdmi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: $space-xs; }
.pdmi-name { font-size: $font-base; font-weight: 600; color: $text-primary; }
.pdmi-week { font-size: $font-xs; color: $text-hint; background: $gray-100; padding: 2px 10px; border-radius: 10px; }
.pdmi-desc { font-size: $font-sm; color: $text-secondary; margin-bottom: $space-sm; line-height: 1.6; }
.pdmi-deliverables { display: flex; align-items: center; gap: $space-xs; flex-wrap: wrap; }
.pdmid-label { font-size: $font-xs; color: $text-hint; }
.pdmid-tag { font-size: 10px; padding: 1px 8px; border-radius: 4px; background: #e8f0fe; color: #1d4ed8;
  &.future { background: #dbeafe; color: $brand-600; }
}
// Data Table
.data-table { width: 100%; border-collapse: collapse; font-size: $font-sm;
  th { background: $gray-50; padding: 10px $space-md; text-align: left; font-weight: 600; color: $text-primary; border-bottom: 2px solid $border; }
  td { padding: 10px $space-md; border-bottom: 1px solid #f0f0f0; color: $text-secondary; }
  tr:hover td { background: $gray-50; }
}
// Risk Cards
.risk-cards { display: grid; grid-template-columns: 1fr 1fr; gap: $space-base; }
.rc-card { background: #fff; border-radius: $radius-lg; border: 1px solid $border; overflow: hidden; }
.rcc-header { display: flex; align-items: center; gap: $space-md; padding: $space-base $space-lg; border-bottom: 1px solid #f0f0f0; }
.rcc-level { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff;
  &.high { background: $danger; }
  &.mid { background: $warning; }
  &.low { background: $info; }
}
.rcc-title { font-size: $font-base; font-weight: 600; color: $text-primary; }
.rcc-body { padding: $space-base $space-lg;
  p { font-size: $font-xs; color: $text-secondary; margin-bottom: $space-sm; line-height: 1.6; }
}
.rcc-measure { font-size: $font-xs; color: $text-secondary; background: $gray-50; padding: $space-sm; border-radius: $radius-sm; line-height: 1.6;
  strong { color: $primary; }
}
// ====== 报价模块 ======
.section-note { font-size: $font-xs; color: $text-hint; margin-bottom: $space-xl; }
.pricing-block { margin-bottom: $space-xl; }
.pricing-subtitle { font-size: $font-base; font-weight: 600; color: $text-primary; margin-bottom: $space-base; display: flex; align-items: center; gap: $space-sm; }
.ps-badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 10px; color: #fff;
  &.phase1 { background: $primary; }
  &.phase2 { background: $info; }
  &.app { background: $accent-green; }
}
.pricing-table {
  th { font-size: 11px; text-align: center; padding: 10px $space-sm; }
  td { font-size: 12px; padding: 9px $space-sm; vertical-align: middle; }
  .tc { text-align: center; }
  .tr { text-align: right; }
  .td-func { font-size: 11px; color: $text-hint; line-height: 1.5; }
}
.sum-row { background: #f0f7ff;
  td { font-size: 13px; color: $primary; }
}
.total-row { background: linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 100%);
  td { font-size: 14px; color: $primary; padding: 14px $space-sm; }
}
.pricing-notes {
  background: #fff; border-radius: $radius-lg; border: 1px solid $border; padding: $space-lg $space-xl;
  ul { margin: 0; padding-left: 18px; }
  li { font-size: $font-xs; color: $text-secondary; line-height: 2; margin-bottom: 2px;
    strong { color: $text-primary; }
  }
}
</style>
