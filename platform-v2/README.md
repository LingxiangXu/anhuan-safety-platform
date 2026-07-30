# 安全管理平台生产版

首个样板区：铸锻件分公司机加工作业区。

本目录是从演示原型转向生产系统的独立工程，原 Vue 2 演示页面继续保留用于需求核对。

## 工程结构

- `backend/`：Java 17 + Spring Boot 3.5 + MyBatis + Flyway
- `web/`：Vue 3 + Vite
- `docs/`：架构、数据模型和迭代说明
- `compose.yaml`：本地 MySQL 与 MinIO

## 首批建设边界

1. 登录、组织、用户、角色和作业区数据权限。
2. 风险台账与风险点。
3. 巡检计划、任务和执行记录。
4. 隐患发现、整改、复查与关闭。
5. 附件、操作日志和消息提醒。

特殊作业、培训、驾驶舱大屏及外部 OA 集成不进入首批代码。

## 本地启动

```bash
docker compose up -d
cd backend && mvn spring-boot:run
cd web && npm install && npm run dev
```

本地开发需要 JDK 17、Maven 3.9+、Node.js 22+ 与 Docker。
生产环境必须通过环境变量覆盖数据库、对象存储和令牌密钥。
