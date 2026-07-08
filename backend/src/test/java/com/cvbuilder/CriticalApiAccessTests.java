package com.cvbuilder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.cvbuilder.model.CV;
import com.cvbuilder.model.PersonalInformation;
import com.cvbuilder.model.Skill;
import com.cvbuilder.model.Template;
import com.cvbuilder.model.User;
import com.cvbuilder.repository.CVRepository;
import com.cvbuilder.repository.TemplateRepository;
import com.cvbuilder.repository.UserRepository;
import com.cvbuilder.security.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = "ai.service.enabled=false")
class CriticalApiAccessTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private UserRepository userRepository;

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
    void protectedEndpointsReturn401WithoutSession() throws Exception {
        mockMvc.perform(get("/api/cv"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/export/pdf/1"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/ai/analyze-jd")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void cvOwnershipIsEnforcedAcrossReadUpdateAndDelete() throws Exception {
        Template template = seedTemplate("Harvard");
        TestUser owner = seedUser("owner@example.com");
        TestUser intruder = seedUser("intruder@example.com");
        CV cv = seedCv(owner.user(), template, "Owner Resume");

        mockMvc.perform(get("/api/cv/{id}", cv.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer(intruder.token())))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("CV not found or you do not have access."));

        mockMvc.perform(put("/api/cv/{id}", cv.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer(intruder.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Stolen Resume\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("CV not found or you do not have access."));

        mockMvc.perform(delete("/api/cv/{id}", cv.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer(intruder.token())))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("CV not found or you do not have access."));
    }

    @Test
    void exportPdfAndDocxReturnDownloadableFilesForOwnerOnly() throws Exception {
        Template template = seedTemplate("Harvard");
        TestUser owner = seedUser("export-owner@example.com");
        TestUser intruder = seedUser("export-intruder@example.com");
        CV cv = seedCv(owner.user(), template, "Applied AI Resume");

        MvcResult pdfResult = mockMvc.perform(get("/api/export/pdf/{id}", cv.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer(owner.token())))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, containsString("applied-ai-resume.pdf")))
                .andReturn();

        assertThat(pdfResult.getResponse().getContentAsByteArray())
                .startsWith("%PDF".getBytes(StandardCharsets.US_ASCII));

        MvcResult docxResult = mockMvc.perform(get("/api/export/docx/{id}", cv.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer(owner.token())))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE,
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, containsString("applied-ai-resume.docx")))
                .andReturn();

        assertThat(docxResult.getResponse().getContentAsByteArray())
                .startsWith(new byte[] { 'P', 'K' });

        mockMvc.perform(get("/api/export/pdf/{id}", cv.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer(intruder.token())))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("CV not found or you do not have access."));
    }

    @Test
    void aiControllerRejectsOtherUsersCvAndSupportsAtsOnlyMode() throws Exception {
        Template template = seedTemplate("Harvard");
        TestUser owner = seedUser("ai-owner@example.com");
        TestUser intruder = seedUser("ai-intruder@example.com");
        CV cv = seedCv(owner.user(), template, "AI Resume");

        String jdMatchBody = """
                {
                  "cvId": %d,
                  "jdText": "Python LangChain semantic search Docker",
                  "engine": "auto"
                }
                """.formatted(cv.getId());

        mockMvc.perform(post("/api/ai/analyze-jd")
                        .header(HttpHeaders.AUTHORIZATION, bearer(intruder.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jdMatchBody))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("CV not found or you do not have access."));

        String atsOnlyBody = """
                {
                  "cvId": %d,
                  "atsOnly": true,
                  "engine": "auto"
                }
                """.formatted(cv.getId());

        mockMvc.perform(post("/api/ai/analyze-jd")
                        .header(HttpHeaders.AUTHORIZATION, bearer(owner.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(atsOnlyBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.analysisEngine").value("java-ats-fallback"))
                .andExpect(jsonPath("$.score").isNumber());
    }

    private TestUser seedUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setFullName("Test User");
        user.setPassword(passwordEncoder.encode("Password123!"));
        User savedUser = userRepository.save(user);
        return new TestUser(savedUser, jwtUtil.generateToken(email, savedUser.getTokenVersion()));
    }

    private Template seedTemplate(String templateName) {
        Template template = new Template();
        template.setTemplateName(templateName);
        return templateRepository.save(template);
    }

    private CV seedCv(User owner, Template template, String title) {
        CV cv = new CV();
        cv.setUser(owner);
        cv.setTemplate(template);
        cv.setTitle(title);
        cv.setSummary("Built AI resume tooling with Python, semantic matching, Docker, and clear engineering docs.");

        PersonalInformation personalInformation = new PersonalInformation();
        personalInformation.setCv(cv);
        personalInformation.setFullName("Tran Phuc Quy");
        personalInformation.setJobTitle("Applied AI Intern");
        personalInformation.setEmail(owner.getEmail());
        personalInformation.setPhone("0923876268");
        personalInformation.setLocation("Ho Chi Minh City");
        cv.setPersonalInformation(personalInformation);

        Skill skill = new Skill();
        skill.setCv(cv);
        skill.setSkillName("Python");
        cv.getSkills().add(skill);

        return cvRepository.save(cv);
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private record TestUser(User user, String token) {
    }
}
