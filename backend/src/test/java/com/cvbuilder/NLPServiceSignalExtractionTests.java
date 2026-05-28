package com.cvbuilder;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.cvbuilder.service.NLPService;

class NLPServiceSignalExtractionTests {

    private final NLPService nlpService = new NLPService();

    @Test
    void extractMatchSignalsPrefersMeaningfulPhrasesOverLooseTokens() {
        String jd = """
                Job Title: AI Agent Intern

                Company / Industry: Microsoft ecosystem

                Responsibilities: Your tasks
                Support the development of AI Agents for Engineering use cases using Microsoft Copilot Studio, Python, and LangChain framework.
                Understand core components of AI Agent architecture, including prompt design, tool integration, memory management, and evaluation of responses.
                Design and implement data ingestion pipelines, connecting to enterprise data sources (e.g., SharePoint, databases, APIs) to enable intelligent retrieval and summarization.

                Required Skills: Your profile
                Familiarity with Python frameworks (e.g., LangChain), REST APIs, or Microsoft platforms (Power Platform, Azure) is a plus.

                Qualifications: Join as
                Student
                """;

        List<String> signals = nlpService.extractMatchSignals(jd);

        assertTrue(signals.contains("ai agent"));
        assertTrue(signals.contains("microsoft copilot studio"));
        assertTrue(signals.contains("langchain framework"));
        assertTrue(signals.contains("prompt design"));
        assertTrue(signals.contains("tool integration"));

        assertFalse(signals.contains("your"));
        assertFalse(signals.contains("tasks"));
        assertFalse(signals.contains("owners"));
        assertFalse(signals.contains("e"));
        assertFalse(signals.contains("g"));
    }

    @Test
    void matchesSignalChecksPhrasePresenceWithoutBreakingSingleWordSkills() {
        String cvText = """
                Built AI agents with Microsoft Copilot Studio and LangChain framework.
                Designed retrieval workflows over SharePoint and internal APIs.
                """;

        String normalizedCvText = nlpService.normalizeForMatching(cvText);
        Set<String> tokenSet = nlpService.buildTokenSet(cvText);

        assertTrue(nlpService.matchesSignal("microsoft copilot studio", normalizedCvText, tokenSet));
        assertTrue(nlpService.matchesSignal("langchain framework", normalizedCvText, tokenSet));
        assertTrue(nlpService.matchesSignal("sharepoint", normalizedCvText, tokenSet));
        assertFalse(nlpService.matchesSignal("power platform", normalizedCvText, tokenSet));
    }
}
