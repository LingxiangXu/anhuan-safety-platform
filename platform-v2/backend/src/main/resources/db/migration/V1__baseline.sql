CREATE TABLE sys_org (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT NULL,
    org_code VARCHAR(64) NOT NULL UNIQUE,
    org_name VARCHAR(128) NOT NULL,
    org_type VARCHAR(32) NOT NULL,
    enabled TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_org_parent FOREIGN KEY (parent_id) REFERENCES sys_org(id)
);

CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    org_id BIGINT NOT NULL,
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    real_name VARCHAR(64) NOT NULL,
    mobile VARCHAR(32),
    enabled TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_org FOREIGN KEY (org_id) REFERENCES sys_org(id)
);

CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_code VARCHAR(64) NOT NULL UNIQUE,
    role_name VARCHAR(64) NOT NULL,
    data_scope VARCHAR(32) NOT NULL DEFAULT 'SELF',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sys_user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES sys_user(id),
    CONSTRAINT fk_user_role_role FOREIGN KEY (role_id) REFERENCES sys_role(id)
);

CREATE TABLE safety_risk (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    org_id BIGINT NOT NULL,
    risk_code VARCHAR(64) NOT NULL UNIQUE,
    risk_name VARCHAR(200) NOT NULL,
    risk_category VARCHAR(64) NOT NULL,
    risk_level VARCHAR(16) NOT NULL,
    location VARCHAR(200) NOT NULL,
    control_measures TEXT NOT NULL,
    owner_user_id BIGINT,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_risk_org FOREIGN KEY (org_id) REFERENCES sys_org(id),
    CONSTRAINT fk_risk_owner FOREIGN KEY (owner_user_id) REFERENCES sys_user(id)
);

CREATE TABLE inspection_plan (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    org_id BIGINT NOT NULL,
    plan_code VARCHAR(64) NOT NULL UNIQUE,
    plan_name VARCHAR(200) NOT NULL,
    cycle_type VARCHAR(32) NOT NULL,
    executor_role_id BIGINT,
    enabled TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_plan_org FOREIGN KEY (org_id) REFERENCES sys_org(id),
    CONSTRAINT fk_plan_role FOREIGN KEY (executor_role_id) REFERENCES sys_role(id)
);

CREATE TABLE inspection_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    plan_id BIGINT NOT NULL,
    risk_id BIGINT,
    item_name VARCHAR(300) NOT NULL,
    standard_text TEXT NOT NULL,
    sort_no INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_item_plan FOREIGN KEY (plan_id) REFERENCES inspection_plan(id),
    CONSTRAINT fk_item_risk FOREIGN KEY (risk_id) REFERENCES safety_risk(id)
);

CREATE TABLE inspection_task (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    plan_id BIGINT NOT NULL,
    org_id BIGINT NOT NULL,
    task_code VARCHAR(64) NOT NULL UNIQUE,
    assignee_user_id BIGINT,
    planned_start DATETIME NOT NULL,
    planned_end DATETIME NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    completed_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_plan FOREIGN KEY (plan_id) REFERENCES inspection_plan(id),
    CONSTRAINT fk_task_org FOREIGN KEY (org_id) REFERENCES sys_org(id),
    CONSTRAINT fk_task_assignee FOREIGN KEY (assignee_user_id) REFERENCES sys_user(id)
);

CREATE TABLE hazard (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    org_id BIGINT NOT NULL,
    task_id BIGINT,
    hazard_code VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    hazard_level VARCHAR(16) NOT NULL,
    location VARCHAR(200) NOT NULL,
    reporter_user_id BIGINT NOT NULL,
    responsible_user_id BIGINT,
    deadline DATETIME,
    status VARCHAR(32) NOT NULL DEFAULT 'REPORTED',
    reported_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at DATETIME,
    CONSTRAINT fk_hazard_org FOREIGN KEY (org_id) REFERENCES sys_org(id),
    CONSTRAINT fk_hazard_task FOREIGN KEY (task_id) REFERENCES inspection_task(id),
    CONSTRAINT fk_hazard_reporter FOREIGN KEY (reporter_user_id) REFERENCES sys_user(id),
    CONSTRAINT fk_hazard_responsible FOREIGN KEY (responsible_user_id) REFERENCES sys_user(id)
);

CREATE TABLE hazard_action (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hazard_id BIGINT NOT NULL,
    action_type VARCHAR(32) NOT NULL,
    action_note TEXT NOT NULL,
    operator_user_id BIGINT NOT NULL,
    action_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_action_hazard FOREIGN KEY (hazard_id) REFERENCES hazard(id),
    CONSTRAINT fk_action_operator FOREIGN KEY (operator_user_id) REFERENCES sys_user(id)
);

CREATE TABLE sys_attachment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    biz_type VARCHAR(64) NOT NULL,
    biz_id BIGINT NOT NULL,
    object_key VARCHAR(300) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    file_size BIGINT NOT NULL,
    uploader_user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_uploader FOREIGN KEY (uploader_user_id) REFERENCES sys_user(id)
);

CREATE TABLE sys_operation_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    module_name VARCHAR(64) NOT NULL,
    action_name VARCHAR(64) NOT NULL,
    biz_id VARCHAR(64),
    request_id VARCHAR(64),
    result_code VARCHAR(32) NOT NULL,
    operated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_operation_time (operated_at),
    INDEX idx_operation_biz (module_name, biz_id)
);

INSERT INTO sys_org (id, parent_id, org_code, org_name, org_type)
VALUES (1, NULL, 'ZDJ', '铸锻件分公司', 'COMPANY');

INSERT INTO sys_org (id, parent_id, org_code, org_name, org_type)
VALUES
  (11, 1, 'ZDJ-JJ', '机加工作业区', 'WORK_AREA'),
  (12, 1, 'ZDJ-TZ', '涂装中心', 'WORK_AREA'),
  (13, 1, 'ZDJ-RCL', '热处理区', 'WORK_AREA'),
  (14, 1, 'ZDJ-JG', '加工作业区', 'WORK_AREA'),
  (15, 1, 'ZDJ-LHCF', '联合厂房', 'WORK_AREA'),
  (16, 1, 'ZDJ-DZ', '吊装作业区', 'WORK_AREA');
