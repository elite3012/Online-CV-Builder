package com.cvbuilder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.cvbuilder.repository.CVRepository;
import com.cvbuilder.repository.TemplateRepository;
import com.cvbuilder.repository.UserRepository;
import com.cvbuilder.security.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void clearDatabase() {
        cvRepository.deleteAll();
        templateRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void loginUsesHttpOnlyCookieWithoutLeakingJwtInJson() throws Exception {
        registerUser("cookie-login@example.com", "Password123!");

        String loginBody = """
                {
                  "email": "cookie-login@example.com",
                  "password": "Password123!"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(cookie().exists(JwtUtil.AUTH_COOKIE_NAME))
                .andExpect(cookie().httpOnly(JwtUtil.AUTH_COOKIE_NAME, true))
                .andExpect(jsonPath("$.token").doesNotExist())
                .andExpect(jsonPath("$.email").value("cookie-login@example.com"));
    }

    @Test
    void registerRejectsInvalidAndDuplicateAccounts() throws Exception {
        String invalidEmailBody = """
                {
                  "fullName": "Security Tester",
                  "email": "not-an-email",
                  "password": "Password123!",
                  "confirmPassword": "Password123!"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidEmailBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid email format"));

        registerUser("duplicate@example.com", "Password123!");

        String duplicateBody = """
                {
                  "fullName": "Security Tester",
                  "email": "duplicate@example.com",
                  "password": "Password123!",
                  "confirmPassword": "Password123!"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(duplicateBody))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email already exists"));
    }

    @Test
    void repeatedLoginFailuresAreRateLimited() throws Exception {
        registerUser("rate-limit@example.com", "Password123!");

        String loginBody = """
                {
                  "email": "rate-limit@example.com",
                  "password": "WrongPassword123!"
                }
                """;

        for (int attempt = 0; attempt < 3; attempt++) {
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(loginBody))
                    .andExpect(status().isUnauthorized());
        }

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.message").value("Too many login attempts. Please try again later."))
                .andExpect(jsonPath("$.retryAfterSeconds").isNumber());
    }

    @Test
    void changePasswordInvalidatesPreviousCookieToken() throws Exception {
        Cookie originalCookie = registerUser("password-rotation@example.com", "Password123!");

        String changePasswordBody = """
                {
                  "currentPassword": "Password123!",
                  "newPassword": "NewPassword123!",
                  "confirmPassword": "NewPassword123!"
                }
                """;

        MvcResult result = mockMvc.perform(put("/api/auth/password")
                        .cookie(originalCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(changePasswordBody))
                .andExpect(status().isOk())
                .andExpect(cookie().exists(JwtUtil.AUTH_COOKIE_NAME))
                .andExpect(cookie().httpOnly(JwtUtil.AUTH_COOKIE_NAME, true))
                .andExpect(jsonPath("$.token").doesNotExist())
                .andReturn();

        Cookie rotatedCookie = result.getResponse().getCookie(JwtUtil.AUTH_COOKIE_NAME);
        assertThat(rotatedCookie).isNotNull();
        assertThat(rotatedCookie.getValue()).isNotBlank();
        assertThat(rotatedCookie.getValue()).isNotEqualTo(originalCookie.getValue());

        mockMvc.perform(get("/api/auth/me").cookie(originalCookie))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/auth/me").cookie(rotatedCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("password-rotation@example.com"));
    }

    @Test
    void logoutRevokesExistingCookieToken() throws Exception {
        Cookie authCookie = registerUser("logout-revoke@example.com", "Password123!");

        mockMvc.perform(get("/api/auth/me").cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("logout-revoke@example.com"));

        mockMvc.perform(post("/api/auth/logout").cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge(JwtUtil.AUTH_COOKIE_NAME, 0));

        mockMvc.perform(get("/api/auth/me").cookie(authCookie))
                .andExpect(status().isUnauthorized());
    }

    private Cookie registerUser(String email, String password) throws Exception {
        String registerBody = """
                {
                  "fullName": "Security Tester",
                  "email": "%s",
                  "password": "%s",
                  "confirmPassword": "%s"
                }
                """.formatted(email, password, password);

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated())
                .andExpect(cookie().exists(JwtUtil.AUTH_COOKIE_NAME))
                .andExpect(cookie().httpOnly(JwtUtil.AUTH_COOKIE_NAME, true))
                .andExpect(jsonPath("$.token").doesNotExist())
                .andReturn();

        Cookie cookie = result.getResponse().getCookie(JwtUtil.AUTH_COOKIE_NAME);
        assertThat(cookie).isNotNull();
        assertThat(cookie.getValue()).isNotBlank();
        return cookie;
    }
}
