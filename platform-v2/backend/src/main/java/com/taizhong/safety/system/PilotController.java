package com.taizhong.safety.system;

import com.taizhong.safety.common.ApiResponse;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/system")
public class PilotController {
    @GetMapping("/pilot")
    ApiResponse<Map<String, Object>> pilot() {
        return ApiResponse.ok(Map.of(
            "company", "铸锻件分公司",
            "workArea", "机加工作业区",
            "phase", "生产底座与首条闭环",
            "focus", List.of("机械伤害", "起重吊装", "临时用电", "设备点检", "油液泄漏", "通道管理")
        ));
    }
}
