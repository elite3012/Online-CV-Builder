import { Box, Typography } from "@mui/material";

const VARIANTS = {
  Modern: { accent: "#1f4e79" },
  "Modern 2": { accent: "#0f766e" },
  Minimal: { accent: "#111827" },
  Classic: { accent: "#111827" },
  "Classic 2": { accent: "#374151" },
  Creative: { accent: "#7f1d1d" },
  Professional: { accent: "#1f2937" },
  "Professional 2": { accent: "#0f3d3e" },
  Elegant: { accent: "#6b4f1d" },
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DATE_RANGE_RE =
  /(\d{4}(?:-\d{2}-\d{2})?\s*(?:-|to|\u2013|\u2014)\s*(?:\d{4}(?:-\d{2}-\d{2})?|present|expected)(?:\s*\([^)]*\))?)$/i;

const BODY_TEXT = {
  fontFamily: '"Times New Roman", Georgia, serif',
  fontSize: "13px",
  lineHeight: 1.42,
  color: "#1f2937",
};

const compact = (value) =>
  String(value ?? "")
    .replace(/(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}(?:\.\d+)?/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

const pick = (...values) => values.map(compact).find(Boolean) || "";

const formatSingleDate = (value) => {
  const source = compact(value);
  const match = source.match(/^(\d{4})(?:-(\d{2})-(\d{2}))?$/);
  if (!match) return source;

  const [, year, month, day] = match;
  if (!month || !day) return year;

  const monthName = MONTH_NAMES[Number(month) - 1];
  if (!monthName) return source;
  if (month === "01" && day === "01") return year;
  if (day === "01") return `${monthName} ${year}`;
  return `${monthName} ${Number(day)}, ${year}`;
};

const formatDateDisplay = (value) => {
  const source = compact(value);
  if (!source) return "";

  const range = source.match(
    /^(\d{4}(?:-\d{2}-\d{2})?)\s*(?:-|to|\u2013|\u2014)\s*(\d{4}(?:-\d{2}-\d{2})?|present|expected)(.*)$/i
  );
  if (range) {
    const end = /^(present|expected)$/i.test(range[2])
      ? range[2].replace(/^./, (char) => char.toUpperCase())
      : formatSingleDate(range[2]);
    const suffix = compact(range[3]);
    return `${formatSingleDate(range[1])} - ${end}${suffix ? ` ${suffix}` : ""}`;
  }

  return source.replace(/\d{4}-\d{2}-\d{2}/g, (date) => formatSingleDate(date));
};

const cleanFragment = (value) =>
  compact(value)
    .replace(/^[-:*.\s]+/, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();

const extractDateRange = (value) => {
  const match = compact(value).match(DATE_RANGE_RE);
  return match ? compact(match[1]) : "";
};

const stripTrailingDateRange = (value) => compact(value).replace(DATE_RANGE_RE, "").trim();

const splitTitleAndSchool = (school, degree) => {
  if (degree || !school.includes(" @ ")) {
    return { school, degree };
  }

  const [detectedDegree, ...schoolParts] = school.split(" @ ");
  return {
    school: schoolParts.join(" @ ").trim() || school,
    degree: detectedDegree.trim(),
  };
};

const splitTextToBullets = (text, maxItems = 4) => {
  const source = compact(text);
  if (!source) return [];

  const explicitItems = source
    .replace(/[\u2022\u00b7\u25aa\u25ab]/g, "\n- ")
    .replace(/\s+-\s+(?=[A-Z])/g, "\n- ")
    .split(/\n|(?:^|\s)-\s+/)
    .map(cleanFragment)
    .filter(Boolean);

  if (explicitItems.length > 1) {
    return explicitItems.slice(0, maxItems);
  }

  const sentenceItems = source
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map(cleanFragment)
    .filter(Boolean);

  if (sentenceItems?.length > 1) {
    return sentenceItems.slice(0, maxItems);
  }

  if (source.length > 210) {
    const clauseItems = source
      .split(/;\s+|,\s+(?=(?:and|with|using|including|built|implemented|deployed|integrating|grounded|public)\b)/i)
      .map(cleanFragment)
      .filter((item) => item.length > 24);

    if (clauseItems.length > 1) {
      return clauseItems.slice(0, maxItems);
    }
  }

  return [source];
};

const normalizeSkills = (skills = []) =>
  skills
    .map((skill) =>
      typeof skill === "string"
        ? compact(skill)
        : pick(skill.skillName, skill.name, skill.label, skill.title)
    )
    .filter(Boolean)
    .filter((skill, index, all) => all.findIndex((item) => item.toLowerCase() === skill.toLowerCase()) === index)
    .slice(0, 28);

const normalizeEducation = (education = []) =>
  education
    .map((item) => {
      const rawSchool = pick(item.school, item.institution, item.university);
      const rawDegree = pick(item.degree, item.major, item.fieldOfStudy);
      const duration = pick(item.duration, item.date, item.period, extractDateRange(rawSchool), extractDateRange(rawDegree));
      const split = splitTitleAndSchool(rawSchool, rawDegree);

      return {
        school: stripTrailingDateRange(split.school),
        degree: stripTrailingDateRange(split.degree),
        duration,
        description: pick(item.desc, item.description),
      };
    })
    .filter((item) => item.school || item.degree);

const normalizeExperience = (experience = []) =>
  experience
    .map((item) => ({
      role: pick(item.jobTitle, item.role, item.title, item.position),
      company: pick(item.company, item.organization, item.employer),
      duration: pick(item.duration, item.date, item.period),
      description: pick(item.desc, item.description, item.summary),
    }))
    .filter((item) => item.role || item.company || item.description);

const normalizeProjects = (projects = []) =>
  projects
    .map((item) => ({
      name: pick(item.projectName, item.name, item.title),
      role: pick(item.role, item.techStack, item.technologies),
      link: pick(item.link, item.url, item.website),
      description: pick(item.desc, item.description, item.summary),
    }))
    .filter((item) => item.name || item.description);

const normalizeCertificates = (certificates = []) =>
  certificates
    .map((item) => ({
      name: pick(item.certificateName, item.name, item.title),
      organization: pick(item.organization, item.issuer, item.authority),
      date: pick(item.date, item.issueDate, item.issuedAt),
    }))
    .filter((item) => item.name || item.organization);

function Section({ title, accent, children }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        sx={{
          fontFamily: '"Times New Roman", Georgia, serif',
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: accent,
          borderBottom: `1px solid ${accent}`,
          pb: 0.4,
          mb: 1.2,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function BulletList({ text, maxItems = 4 }) {
  const items = Array.isArray(text) ? text.map(cleanFragment).filter(Boolean) : splitTextToBullets(text, maxItems);
  if (!items.length) return null;

  return (
    <Box
      component="ul"
      sx={{
        m: 0,
        pl: "18px",
        "& li": {
          ...BODY_TEXT,
          mb: 0.45,
          pl: "2px",
          textAlign: "left",
        },
      }}
    >
      {items.map((item, index) => (
        <Box component="li" key={`${item}-${index}`}>
          {item}
        </Box>
      ))}
    </Box>
  );
}

function EntryHeader({ primary, secondary, date }) {
  const displayDate = formatDateDisplay(date);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "baseline" }}>
      <Box sx={{ minWidth: 0 }}>
        {primary && (
          <Typography sx={{ ...BODY_TEXT, fontWeight: 700, color: "#111827", wordBreak: "break-word" }}>
            {primary}
          </Typography>
        )}
        {secondary && (
          <Typography sx={{ ...BODY_TEXT, fontStyle: "italic", color: "#374151", wordBreak: "break-word" }}>
            {secondary}
          </Typography>
        )}
      </Box>
      {displayDate && (
        <Typography sx={{ ...BODY_TEXT, color: "#4b5563", whiteSpace: "nowrap", textAlign: "right" }}>
          {displayDate}
        </Typography>
      )}
    </Box>
  );
}

export default function HarvardCvTemplate({ data, variant = "Classic" }) {
  if (!data) return null;

  const accent = VARIANTS[variant]?.accent || VARIANTS.Classic.accent;
  const contact = [
    pick(data.contact?.email),
    pick(data.contact?.phone),
    pick(data.contact?.address, data.contact?.location),
    pick(data.contact?.linkedIn, data.contact?.linkedin),
    pick(data.contact?.website),
  ].filter(Boolean);
  const summaryItems = splitTextToBullets(data.summary, 3);
  const education = normalizeEducation(data.education);
  const experience = normalizeExperience(data.experience);
  const projects = normalizeProjects(data.projects);
  const certificates = normalizeCertificates(data.certificates);
  const skills = normalizeSkills(data.skills);

  return (
    <Box
      sx={{
        width: "794px",
        minHeight: "1122px",
        bgcolor: "#fff",
        color: "#111827",
        boxShadow: 3,
        mx: "auto",
        px: "52px",
        py: "44px",
        fontFamily: '"Times New Roman", Georgia, serif',
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ textAlign: "center", borderBottom: `2px solid ${accent}`, pb: 2.2, mb: 2.8 }}>
        <Typography
          sx={{
            fontFamily: '"Times New Roman", Georgia, serif',
            fontSize: "31px",
            fontWeight: 700,
            letterSpacing: "0.035em",
            lineHeight: 1.05,
            color: "#111827",
            textTransform: "uppercase",
            wordBreak: "break-word",
          }}
        >
          {pick(data.name) || "Your Name"}
        </Typography>
        {pick(data.title) && (
          <Typography sx={{ ...BODY_TEXT, mt: 1, fontSize: "15px", color: "#4b5563" }}>
            {pick(data.title)}
          </Typography>
        )}
        {contact.length > 0 && (
          <Typography sx={{ ...BODY_TEXT, mt: 1.2, fontSize: "12px", color: "#4b5563", wordBreak: "break-word" }}>
            {contact.join(" | ")}
          </Typography>
        )}
      </Box>

      {summaryItems.length > 0 && (
        <Section title="Summary" accent={accent}>
          <BulletList text={summaryItems} maxItems={3} />
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent={accent}>
          {education.map((item, index) => (
            <Box key={`${item.school}-${index}`} sx={{ mb: index === education.length - 1 ? 0 : 1.35 }}>
              <EntryHeader primary={item.school || item.degree} secondary={item.school ? item.degree : ""} date={item.duration} />
              {item.description && <BulletList text={item.description} maxItems={2} />}
            </Box>
          ))}
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" accent={accent}>
          {experience.map((item, index) => (
            <Box key={`${item.role}-${item.company}-${index}`} sx={{ mb: index === experience.length - 1 ? 0 : 1.7 }}>
              <EntryHeader
                primary={[item.role, item.company].filter(Boolean).join(", ")}
                secondary=""
                date={item.duration}
              />
              <BulletList text={item.description} maxItems={4} />
            </Box>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Selected Projects" accent={accent}>
          {projects.map((item, index) => (
            <Box key={`${item.name}-${index}`} sx={{ mb: index === projects.length - 1 ? 0 : 1.65 }}>
              <EntryHeader primary={item.name} secondary={item.role} date="" />
              {item.link && (
                <Typography sx={{ ...BODY_TEXT, color: "#4b5563", fontSize: "12px", wordBreak: "break-word" }}>
                  {item.link}
                </Typography>
              )}
              <BulletList text={item.description} maxItems={3} />
            </Box>
          ))}
        </Section>
      )}

      {certificates.length > 0 && (
        <Section title="Certifications" accent={accent}>
          {certificates.map((item, index) => (
            <EntryHeader
              key={`${item.name}-${index}`}
              primary={item.name}
              secondary={item.organization}
              date={item.date}
            />
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Core Competencies" accent={accent}>
          <Typography sx={{ ...BODY_TEXT, wordBreak: "break-word" }}>{skills.join(" | ")}</Typography>
        </Section>
      )}
    </Box>
  );
}
