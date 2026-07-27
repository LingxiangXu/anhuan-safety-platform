import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import ProductCenter from '@/views/ProductCenter.vue';
import SafetyIndex from '@/views/safety-platform/Index.vue';

import Overview from '@/views/safety-platform/Overview.vue';
import SystemArchitecture from '@/views/safety-platform/SystemArchitecture.vue';
import Roles from '@/views/safety-platform/Roles.vue';

import Dashboard from '@/views/safety-platform/Dashboard.vue';
import HazardSupervision from '@/views/safety-platform/HazardSupervision.vue';
import InspectionManagement from '@/views/safety-platform/InspectionManagement.vue';
import SpecialWork from '@/views/safety-platform/SpecialWork.vue';
import RiskManagement from '@/views/safety-platform/RiskManagement.vue';
import TrainingManagement from '@/views/safety-platform/TrainingManagement.vue';
import BpmIntegration from '@/views/safety-platform/BpmIntegration.vue';

import MobileField from '@/views/safety-platform/MobileField.vue';
import WorkTicket from '@/views/safety-platform/WorkTicket.vue';
import CheckIn from '@/views/safety-platform/CheckIn.vue';
import MessageCenter from '@/views/safety-platform/MessageCenter.vue';
import RiskMap from '@/views/safety-platform/RiskMap.vue';
import PersonalCenter from '@/views/safety-platform/PersonalCenter.vue';
import FeaturePanorama from '@/views/safety-platform/FeaturePanorama.vue';
import Plan from '@/views/safety-platform/Plan.vue';

const routes = [
  {
    path: '/',
    name: 'ProductCenter',
    component: ProductCenter
  },
  {
    path: '/safety-platform',
    component: SafetyIndex,
    redirect: '/safety-platform/overview',
    children: [
      { path: 'overview', name: 'SafetyOverview', component: Overview },
      { path: 'architecture/system', name: 'SafetyArchitecture', component: SystemArchitecture },
      { path: 'roles', name: 'SafetyRoles', component: Roles },

      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'hazard-supervision', name: 'HazardSupervision', component: HazardSupervision },
      { path: 'inspection-management', name: 'InspectionManagement', component: InspectionManagement },
      { path: 'special-work', name: 'SpecialWork', component: SpecialWork },
      { path: 'risk-management', name: 'RiskManagement', component: RiskManagement },
      { path: 'bpm-integration', name: 'BpmIntegration', component: BpmIntegration },
      { path: 'training-management', name: 'TrainingManagement', component: TrainingManagement },

      { path: 'mobile-field', name: 'MobileField', component: MobileField },
      { path: 'work-ticket', name: 'WorkTicket', component: WorkTicket },
      { path: 'check-in', name: 'CheckIn', component: CheckIn },
      { path: 'message-center', name: 'MessageCenter', component: MessageCenter },
      { path: 'risk-map', name: 'RiskMap', component: RiskMap },
      { path: 'personal-center', name: 'PersonalCenter', component: PersonalCenter },
      { path: 'feature-panorama', name: 'FeaturePanorama', component: FeaturePanorama },
      { path: 'plan', name: 'SafetyPlan', component: Plan }
    ]
  }
];

const router = new VueRouter({
  mode: 'hash',
  routes,
  // 路由切换后滚动复位：
  // 1) 浏览器前进/后退时保留原位置（savedPosition）；
  // 2) 平台页内容在内部容器 .pl-content 中滚动（非 window），需手动归零；
  // 3) 顶层页面（如产品中心）走 window 滚动，由 {x:0,y:0} 复位。
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (typeof document !== 'undefined') {
      const content = document.querySelector('.pl-content');
      if (content) content.scrollTop = 0;
    }
    return { x: 0, y: 0 };
  }
});

export default router;
