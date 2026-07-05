package com.cvbuilder;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.cvbuilder.dto.ImportedCvResult;
import com.cvbuilder.model.Template;
import com.cvbuilder.model.User;
import com.cvbuilder.repository.CVRepository;
import com.cvbuilder.repository.TemplateRepository;
import com.cvbuilder.repository.UserRepository;
import com.cvbuilder.service.CVImportService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

@SpringBootTest
@ActiveProfiles("test")
class CVImportServiceIntegrationTests {

    private static HttpServer aiServer;
    private static int aiPort;

    @Autowired
    private CVImportService cvImportService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private CVRepository cvRepository;

    @DynamicPropertySource
    static void aiServiceProperties(DynamicPropertyRegistry registry) throws IOException {
        startFakeAiImportServer();
        registry.add("ai.service.url", () -> "http://127.0.0.1:" + aiPort);
        registry.add("ai.service.importTimeoutMs", () -> "5000");
    }

    @AfterAll
    static void stopFakeAiImportServer() {
        if (aiServer != null) {
            aiServer.stop(0);
        }
    }

    @BeforeEach
    void resetDatabase() {
        cvRepository.deleteAll();
        userRepository.deleteAll();
        templateRepository.deleteAll();
    }

    @Test
    void importCvPersistsParsedResumeSections() {
        User user = new User();
        user.setEmail("import-test@example.com");
        user.setFullName("Import Tester");
        user.setPassword("hashed-password");
        userRepository.save(user);

        Template template = new Template();
        template.setTemplateName("Modern 2");
        template = templateRepository.save(template);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "resume.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "fake docx bytes".getBytes(StandardCharsets.UTF_8));

        ImportedCvResult result = cvImportService.importCv(file, template.getId(), "", user.getEmail());

        assertThat(result.getDetectedRole()).isEqualTo("AI Integration Intern / Applied AI Intern");
        assertThat(result.getSuggestedTemplate()).isEqualTo("Modern 2");
        assertThat(result.getCv().getTitle()).isEqualTo("Tran Phuc Quy - AI Integration Intern / Applied AI Intern");
        assertThat(result.getCv().getPersonalInformation().getEmail()).isEqualTo("quyphuctran1@gmail.com");
        assertThat(result.getCv().getSkills()).hasSize(2);
        assertThat(result.getCv().getEducations()).hasSize(1);
        assertThat(result.getCv().getProjects()).hasSize(3);
        assertThat(result.getCv().getCertificates()).hasSize(1);
        assertThat(result.getCv().getProjects())
                .extracting("projectName")
                .containsExactly("Online CV Builder", "RecruitAI - Recruitment Decision Support System",
                        "Continual Learning System");
    }

    private static void startFakeAiImportServer() throws IOException {
        if (aiServer != null) {
            return;
        }

        aiServer = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        aiServer.createContext("/import-cv", CVImportServiceIntegrationTests::handleImportRequest);
        aiServer.start();
        aiPort = aiServer.getAddress().getPort();
    }

    private static void handleImportRequest(HttpExchange exchange) throws IOException {
        exchange.getRequestBody().transferTo(OutputStream.nullOutputStream());
        byte[] response = fakeImportResponse().getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, response.length);
        exchange.getResponseBody().write(response);
        exchange.close();
    }

    private static String fakeImportResponse() {
        return """
                {
                  "title": "Tran Phuc Quy - AI Integration Intern / Applied AI Intern",
                  "summary": "Computer Science undergraduate focused on applied AI integration.",
                  "detectedRole": "AI Integration Intern / Applied AI Intern",
                  "suggestedTemplate": "Modern 2",
                  "confidence": 0.85,
                  "personalInformation": {
                    "fullName": "Tran Phuc Quy",
                    "jobTitle": "AI Integration Intern / Applied AI Intern",
                    "email": "quyphuctran1@gmail.com",
                    "phone": "0923876268",
                    "location": "",
                    "linkedIn": "",
                    "website": ""
                  },
                  "skills": ["Python", "FastAPI"],
                  "educations": [
                    {
                      "school": "Vietnam National University - International University (HCMIU)",
                      "degree": "Bachelor of Computer Science",
                      "startDate": "2023-01-01T00:00:00",
                      "endDate": "2027-01-01T00:00:00",
                      "description": ""
                    }
                  ],
                  "experiences": [],
                  "projects": [
                    {
                      "projectName": "Online CV Builder",
                      "role": "React, Spring Boot, FastAPI, PostgreSQL, sentence-transformers, Docker",
                      "link": "",
                      "description": "Full-stack CV platform with AI import and semantic matching."
                    },
                    {
                      "projectName": "RecruitAI - Recruitment Decision Support System",
                      "role": "FastAPI, sentence-transformers, SQLAlchemy, React, Docker",
                      "link": "",
                      "description": "Explainable AI-assisted ranking workflow."
                    },
                    {
                      "projectName": "Continual Learning System",
                      "role": "PyTorch, Streamlit, Plotly, OpenCV, Transformers",
                      "link": "",
                      "description": "Interactive ML experimentation system."
                    }
                  ],
                  "certificates": [
                    {
                      "certificateName": "IELTS Academic 7.0",
                      "organization": "IDP",
                      "issueDate": null
                    }
                  ],
                  "insights": ["Import confidence: 85%", "Detected 3 project blocks that you can tailor per role."]
                }
                """;
    }
}
