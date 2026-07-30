package com.taizhong.safety;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PilotControllerTest {
    @Autowired
    MockMvc mockMvc;

    @Test
    void returnsMachiningPilotBaseline() throws Exception {
        mockMvc.perform(get("/api/v1/system/pilot"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.company").value("铸锻件分公司"))
            .andExpect(jsonPath("$.data.workArea").value("机加工作业区"));
    }
}
