package com.cvbuilder;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.cvbuilder.model.CV;
import com.cvbuilder.model.Template;
import com.cvbuilder.model.User;
import com.cvbuilder.repository.CVRepository;
import com.cvbuilder.repository.TemplateRepository;
import com.cvbuilder.repository.UserRepository;
import com.cvbuilder.security.JwtUtil;
import com.cvbuilder.service.CVService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CVControllerSerializationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CVService cvService;

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @BeforeEach
    void clearDatabase() {
        cvRepository.deleteAll();
        templateRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void getCvListStaysSerializableAfterCreatingCv() throws Exception {
        TestContext context = seedUserAndTemplate("list-user@example.com");
        cvService.createCV(context.templateId(), "Manual CV", context.email());

        mockMvc.perform(get("/api/cv")
                        .header("Authorization", bearer(context.token())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Manual CV"))
                .andExpect(jsonPath("$[0].template.templateName").value("Modern"))
                .andExpect(jsonPath("$[0].user").doesNotExist());
    }

    @Test
    void updateCvKeepsNestedSectionsSerializable() throws Exception {
        TestContext context = seedUserAndTemplate("update-user@example.com");
        CV createdCv = cvService.createCV(context.templateId(), "Imported Draft", context.email());

        String requestBody = """
                {
                  "title": "Imported Draft",
                  "summary": "Built an AI-assisted resume workflow.",
                  "personalInformation": {
                    "fullName": "Update User",
                    "jobTitle": "ML Engineer",
                    "email": "update-user@example.com",
                    "phone": "0123456789",
                    "location": "Ho Chi Minh City"
                  },
                  "educations": [
                    {
                      "school": "HCMIU",
                      "degree": "Bachelor",
                      "startDate": "2026-05-13T00:00:00",
                      "endDate": "2026-05-20T00:00:00",
                      "description": "Goat"
                    }
                  ],
                  "experiences": [],
                  "projects": [
                    {
                      "projectName": "ATS Builder",
                      "role": "Lead Developer",
                      "link": "https://example.com",
                      "description": "Built semantic CV tooling."
                    }
                  ],
                  "certificates": [],
                  "skills": [
                    {
                      "skillName": "Python"
                    }
                  ]
                }
                """;

        mockMvc.perform(put("/api/cv/{id}", createdCv.getId())
                        .with(csrf())
                        .header("Authorization", bearer(context.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.personalInformation.fullName").value("Update User"))
                .andExpect(jsonPath("$.educations[0].school").value("HCMIU"))
                .andExpect(jsonPath("$.skills[0].skillName").value("Python"))
                .andExpect(jsonPath("$.user").doesNotExist());
    }

    private TestContext seedUserAndTemplate(String email) {
        User user = new User();
        user.setEmail(email);
        user.setFullName("Test User");
        user.setPassword(passwordEncoder.encode("Password123!"));
        userRepository.save(user);

        Template template = new Template();
        template.setTemplateName("Modern");
        templateRepository.save(template);

        String token = jwtUtil.generateToken(email);
        return new TestContext(email, token, template.getId());
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private record TestContext(String email, String token, Long templateId) {
    }
}
