package com.cvbuilder.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.stereotype.Service;

import com.cvbuilder.model.CV;
import com.cvbuilder.model.Certificate;
import com.cvbuilder.model.Education;
import com.cvbuilder.model.Experience;
import com.cvbuilder.model.PersonalInformation;
import com.cvbuilder.model.Project;
import com.cvbuilder.model.Skill;

/**
 * Export Service - Handles CV export to PDF/DOCX
 * Must validate CV and load template before export
 */
@Service
public class ExportService {

    private static final float PDF_MARGIN = 50f;
    private static final float PDF_LINE_HEIGHT = 16f;
    private static final int PDF_TEXT_WRAP = 95;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public byte[] exportCvToPdf(CV cv) {
        try (PDDocument document = new PDDocument();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PDFont normalFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDFont headingFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

            List<PdfLine> lines = buildPdfLines(cv);

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            float y = page.getMediaBox().getHeight() - PDF_MARGIN;

            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            for (PdfLine line : lines) {
                List<String> wrapped = line.text().isBlank()
                        ? List.of("")
                        : wrapText(line.text(), PDF_TEXT_WRAP);

                for (String wrappedLine : wrapped) {
                    if (y <= PDF_MARGIN) {
                        contentStream.close();
                        page = new PDPage(PDRectangle.A4);
                        document.addPage(page);
                        contentStream = new PDPageContentStream(document, page);
                        y = page.getMediaBox().getHeight() - PDF_MARGIN;
                    }

                    contentStream.beginText();
                    contentStream.setFont(line.heading() ? headingFont : normalFont, line.heading() ? 12 : 11);
                    contentStream.newLineAtOffset(PDF_MARGIN, y);
                    contentStream.showText(wrappedLine);
                    contentStream.endText();

                    y -= PDF_LINE_HEIGHT;
                }

                if (line.text().isBlank()) {
                    y -= 4f;
                }
            }

            contentStream.close();
            document.save(outputStream);
            return outputStream.toByteArray();
        } catch (IOException ex) {
            throw new RuntimeException("Failed to export CV to PDF", ex);
        }
    }

    public byte[] exportCvToDocx(CV cv) {
        try (XWPFDocument document = new XWPFDocument();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            String fullName = valueOrEmpty(cv.getPersonalInformation() != null ? cv.getPersonalInformation().getFullName() : null);
            String title = valueOrEmpty(cv.getTitle());

            XWPFParagraph titleParagraph = document.createParagraph();
            titleParagraph.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun titleRun = titleParagraph.createRun();
            titleRun.setBold(true);
            titleRun.setFontSize(18);
            titleRun.setText(!fullName.isBlank() ? fullName : (!title.isBlank() ? title : "CV"));

            if (!title.isBlank()) {
                XWPFParagraph subtitle = document.createParagraph();
                subtitle.setAlignment(ParagraphAlignment.CENTER);
                XWPFRun subtitleRun = subtitle.createRun();
                subtitleRun.setItalic(true);
                subtitleRun.setFontSize(12);
                subtitleRun.setText(title);
            }

            addDocxContactSection(document, cv.getPersonalInformation());
            addDocxTextSection(document, "Summary", cv.getSummary());
            addDocxExperienceSection(document, cv.getExperiences());
            addDocxEducationSection(document, cv.getEducations());
            addDocxProjectsSection(document, cv.getProjects());
            addDocxCertificatesSection(document, cv.getCertificates());
            addDocxSkillsSection(document, cv.getSkills());

            document.write(outputStream);
            return outputStream.toByteArray();
        } catch (IOException ex) {
            throw new RuntimeException("Failed to export CV to DOCX", ex);
        }
    }

    private List<PdfLine> buildPdfLines(CV cv) {
        List<PdfLine> lines = new ArrayList<>();

        PersonalInformation info = cv.getPersonalInformation();
        String title = valueOrEmpty(cv.getTitle());

        if (info != null && hasText(info.getFullName())) {
            lines.add(new PdfLine(info.getFullName(), true));
        } else if (hasText(title)) {
            lines.add(new PdfLine(title, true));
        } else {
            lines.add(new PdfLine("CV", true));
        }

        if (info != null && hasText(info.getJobTitle())) {
            lines.add(new PdfLine(info.getJobTitle(), false));
        }

        lines.add(new PdfLine("", false));

        if (info != null) {
            lines.add(new PdfLine("CONTACT", true));
            addPdfField(lines, "Email", info.getEmail());
            addPdfField(lines, "Phone", info.getPhone());
            addPdfField(lines, "Location", info.getLocation());
            addPdfField(lines, "LinkedIn", info.getLinkedIn());
            addPdfField(lines, "Website", info.getWebsite());
            lines.add(new PdfLine("", false));
        }

        if (hasText(cv.getSummary())) {
            lines.add(new PdfLine("SUMMARY", true));
            lines.add(new PdfLine(cv.getSummary(), false));
            lines.add(new PdfLine("", false));
        }

        if (cv.getExperiences() != null && !cv.getExperiences().isEmpty()) {
            lines.add(new PdfLine("EXPERIENCE", true));
            for (Experience experience : cv.getExperiences()) {
                String heading = valueOrEmpty(experience.getJobTitle());
                if (hasText(experience.getCompany())) {
                    heading = heading.isBlank() ? experience.getCompany() : heading + " - " + experience.getCompany();
                }
                if (heading.isBlank()) {
                    heading = "Experience";
                }
                lines.add(new PdfLine("- " + heading, false));

                String duration = formatRange(experience.getStartDate(), experience.getEndDate());
                if (hasText(duration)) {
                    lines.add(new PdfLine("  " + duration, false));
                }

                if (hasText(experience.getDescription())) {
                    lines.add(new PdfLine("  " + experience.getDescription(), false));
                }
            }
            lines.add(new PdfLine("", false));
        }

        if (cv.getEducations() != null && !cv.getEducations().isEmpty()) {
            lines.add(new PdfLine("EDUCATION", true));
            for (Education education : cv.getEducations()) {
                String heading = valueOrEmpty(education.getDegree());
                if (hasText(education.getSchool())) {
                    heading = heading.isBlank() ? education.getSchool() : heading + " - " + education.getSchool();
                }
                if (heading.isBlank()) {
                    heading = "Education";
                }
                lines.add(new PdfLine("- " + heading, false));

                String duration = formatRange(education.getStartDate(), education.getEndDate());
                if (hasText(duration)) {
                    lines.add(new PdfLine("  " + duration, false));
                }

                if (hasText(education.getDescription())) {
                    lines.add(new PdfLine("  " + education.getDescription(), false));
                }
            }
            lines.add(new PdfLine("", false));
        }

        if (cv.getProjects() != null && !cv.getProjects().isEmpty()) {
            lines.add(new PdfLine("PROJECTS", true));
            for (Project project : cv.getProjects()) {
                String heading = valueOrEmpty(project.getProjectName());
                if (hasText(project.getRole())) {
                    heading = heading.isBlank() ? project.getRole() : heading + " - " + project.getRole();
                }
                if (heading.isBlank()) {
                    heading = "Project";
                }
                lines.add(new PdfLine("- " + heading, false));

                if (hasText(project.getLink())) {
                    lines.add(new PdfLine("  " + project.getLink(), false));
                }

                if (hasText(project.getDescription())) {
                    lines.add(new PdfLine("  " + project.getDescription(), false));
                }
            }
            lines.add(new PdfLine("", false));
        }

        if (cv.getCertificates() != null && !cv.getCertificates().isEmpty()) {
            lines.add(new PdfLine("CERTIFICATES", true));
            for (Certificate certificate : cv.getCertificates()) {
                String heading = valueOrEmpty(certificate.getCertificateName());
                if (heading.isBlank()) {
                    heading = "Certificate";
                }
                lines.add(new PdfLine("- " + heading, false));

                if (hasText(certificate.getOrganization())) {
                    lines.add(new PdfLine("  " + certificate.getOrganization(), false));
                }

                if (certificate.getIssueDate() != null) {
                    lines.add(new PdfLine("  " + formatDate(certificate.getIssueDate()), false));
                }
            }
            lines.add(new PdfLine("", false));
        }

        if (cv.getSkills() != null && !cv.getSkills().isEmpty()) {
            lines.add(new PdfLine("SKILLS", true));
            for (Skill skill : cv.getSkills()) {
                if (hasText(skill.getSkillName())) {
                    lines.add(new PdfLine("- " + skill.getSkillName(), false));
                }
            }
        }

        return lines;
    }

    private void addPdfField(List<PdfLine> lines, String field, String value) {
        if (hasText(value)) {
            lines.add(new PdfLine(field + ": " + value, false));
        }
    }

    private void addDocxContactSection(XWPFDocument document, PersonalInformation info) {
        if (info == null) {
            return;
        }

        addDocxHeading(document, "Contact");
        addDocxText(document, "Email", info.getEmail());
        addDocxText(document, "Phone", info.getPhone());
        addDocxText(document, "Location", info.getLocation());
        addDocxText(document, "LinkedIn", info.getLinkedIn());
        addDocxText(document, "Website", info.getWebsite());
    }

    private void addDocxTextSection(XWPFDocument document, String heading, String text) {
        if (!hasText(text)) {
            return;
        }

        addDocxHeading(document, heading);
        XWPFParagraph paragraph = document.createParagraph();
        XWPFRun run = paragraph.createRun();
        run.setText(text.trim());
    }

    private void addDocxExperienceSection(XWPFDocument document, List<Experience> experiences) {
        if (experiences == null || experiences.isEmpty()) {
            return;
        }

        addDocxHeading(document, "Experience");

        for (Experience experience : experiences) {
            String heading = valueOrEmpty(experience.getJobTitle());
            if (hasText(experience.getCompany())) {
                heading = heading.isBlank() ? experience.getCompany() : heading + " - " + experience.getCompany();
            }
            addDocxBullet(document, heading.isBlank() ? "Experience" : heading);

            String duration = formatRange(experience.getStartDate(), experience.getEndDate());
            if (hasText(duration)) {
                addDocxIndentedLine(document, duration);
            }

            if (hasText(experience.getDescription())) {
                addDocxIndentedLine(document, experience.getDescription());
            }
        }
    }

    private void addDocxEducationSection(XWPFDocument document, List<Education> educations) {
        if (educations == null || educations.isEmpty()) {
            return;
        }

        addDocxHeading(document, "Education");

        for (Education education : educations) {
            String heading = valueOrEmpty(education.getDegree());
            if (hasText(education.getSchool())) {
                heading = heading.isBlank() ? education.getSchool() : heading + " - " + education.getSchool();
            }
            addDocxBullet(document, heading.isBlank() ? "Education" : heading);

            String duration = formatRange(education.getStartDate(), education.getEndDate());
            if (hasText(duration)) {
                addDocxIndentedLine(document, duration);
            }

            if (hasText(education.getDescription())) {
                addDocxIndentedLine(document, education.getDescription());
            }
        }
    }

    private void addDocxProjectsSection(XWPFDocument document, List<Project> projects) {
        if (projects == null || projects.isEmpty()) {
            return;
        }

        addDocxHeading(document, "Projects");

        for (Project project : projects) {
            String heading = valueOrEmpty(project.getProjectName());
            if (hasText(project.getRole())) {
                heading = heading.isBlank() ? project.getRole() : heading + " - " + project.getRole();
            }
            addDocxBullet(document, heading.isBlank() ? "Project" : heading);

            if (hasText(project.getLink())) {
                addDocxIndentedLine(document, project.getLink());
            }

            if (hasText(project.getDescription())) {
                addDocxIndentedLine(document, project.getDescription());
            }
        }
    }

    private void addDocxCertificatesSection(XWPFDocument document, List<Certificate> certificates) {
        if (certificates == null || certificates.isEmpty()) {
            return;
        }

        addDocxHeading(document, "Certificates");

        for (Certificate certificate : certificates) {
            addDocxBullet(document,
                    hasText(certificate.getCertificateName()) ? certificate.getCertificateName() : "Certificate");
            if (hasText(certificate.getOrganization())) {
                addDocxIndentedLine(document, certificate.getOrganization());
            }
            if (certificate.getIssueDate() != null) {
                addDocxIndentedLine(document, formatDate(certificate.getIssueDate()));
            }
        }
    }

    private void addDocxSkillsSection(XWPFDocument document, List<Skill> skills) {
        if (skills == null || skills.isEmpty()) {
            return;
        }

        addDocxHeading(document, "Skills");
        for (Skill skill : skills) {
            if (hasText(skill.getSkillName())) {
                addDocxBullet(document, skill.getSkillName());
            }
        }
    }

    private void addDocxHeading(XWPFDocument document, String title) {
        XWPFParagraph paragraph = document.createParagraph();
        XWPFRun run = paragraph.createRun();
        run.setBold(true);
        run.setFontSize(13);
        run.setText(title);
    }

    private void addDocxText(XWPFDocument document, String label, String value) {
        if (!hasText(value)) {
            return;
        }

        XWPFParagraph paragraph = document.createParagraph();
        XWPFRun run = paragraph.createRun();
        run.setText(label + ": " + value.trim());
    }

    private void addDocxBullet(XWPFDocument document, String text) {
        XWPFParagraph paragraph = document.createParagraph();
        XWPFRun run = paragraph.createRun();
        run.setText("- " + text);
    }

    private void addDocxIndentedLine(XWPFDocument document, String text) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setIndentationLeft(400);
        XWPFRun run = paragraph.createRun();
        run.setText(text);
    }

    private List<String> wrapText(String input, int maxChars) {
        if (input == null || input.isBlank()) {
            return List.of("");
        }

        List<String> lines = new ArrayList<>();
        String[] words = input.split("\\s+");
        StringBuilder currentLine = new StringBuilder();

        for (String word : words) {
            if (currentLine.length() == 0) {
                currentLine.append(word);
                continue;
            }

            if (currentLine.length() + 1 + word.length() <= maxChars) {
                currentLine.append(' ').append(word);
            } else {
                lines.add(currentLine.toString());
                currentLine = new StringBuilder(word);
            }
        }

        if (currentLine.length() > 0) {
            lines.add(currentLine.toString());
        }

        return lines;
    }

    private String formatRange(String start, String end) {
        if (!hasText(start) && !hasText(end)) {
            return "";
        }

        if (hasText(start) && hasText(end)) {
            return start + " - " + end;
        }

        return hasText(start) ? start : end;
    }

    private String formatRange(LocalDateTime start, LocalDateTime end) {
        if (start == null && end == null) {
            return "";
        }

        if (start != null && end != null) {
            return formatDate(start) + " - " + formatDate(end);
        }

        return start != null ? formatDate(start) : formatDate(end);
    }

    private String formatDate(LocalDateTime date) {
        return date == null ? "" : DATE_FORMAT.format(date);
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String valueOrEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    private record PdfLine(String text, boolean heading) {
    }
}
