const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DATE_RANGE_RE =
  /(\d{4}(?:-\d{2}-\d{2})?\s*(?:-|to|\u2013|\u2014)\s*(?:\d{4}(?:-\d{2}-\d{2})?|present|expected)(?:\s*\([^)]*\))?)$/i;

const compact = (value) =>
  String(value ?? "")
    .replace(/(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}(?:\.\d+)?/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

const pick = (...values) => values.map(compact).find(Boolean) || "";

const cleanFragment = (value) =>
  compact(value)
    .replace(/^[-*\u2022.\s]+/, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();

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

const extractDateRange = (value) => {
  const match = compact(value).match(DATE_RANGE_RE);
  return match ? formatDateDisplay(match[1]) : "";
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

const splitTextToItems = (value, maxItems) => {
  const source = compact(value);
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

  if (source.length > 220) {
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

const toBulletText = (value, maxItems = 4) => {
  const source = compact(value);
  if (!source || source === "Summary goes here...") return source;

  return splitTextToItems(source, maxItems)
    .map((item) => `\u2022 ${item}`)
    .join("\n");
};

const normalizeSkills = (skills = []) =>
  skills
    .map((skill) =>
      typeof skill === "string"
        ? compact(skill)
        : pick(skill.skillName, skill.name, skill.label, skill.title)
    )
    .filter(Boolean)
    .filter((skill, index, all) => all.findIndex((item) => item.toLowerCase() === skill.toLowerCase()) === index);

export const normalizeTemplateData = (data) => {
  if (!data) return data;

  return {
    ...data,
    name: pick(data.name, data.fullName),
    title: pick(data.title, data.jobTitle, data.role),
    contact: {
      ...(data.contact || {}),
      email: pick(data.contact?.email),
      phone: pick(data.contact?.phone),
      address: pick(data.contact?.address, data.contact?.location),
      linkedIn: pick(data.contact?.linkedIn, data.contact?.linkedin),
      linkedin: pick(data.contact?.linkedin, data.contact?.linkedIn),
      website: pick(data.contact?.website),
    },
    summary: toBulletText(data.summary, 3),
    experience:
      data.experience?.map((item) => {
        const role = pick(item.role, item.jobTitle, item.title, item.position);
        return {
          ...item,
          role,
          jobTitle: role,
          company: pick(item.company, item.organization, item.employer),
          duration: formatDateDisplay(pick(item.duration, item.date, item.period)),
          desc: toBulletText(pick(item.desc, item.description, item.summary), 4),
        };
      }) || [],
    education:
      data.education?.map((item) => {
        const rawSchool = pick(item.school, item.institution, item.university);
        const rawDegree = pick(item.degree, item.major, item.fieldOfStudy);
        const split = splitTitleAndSchool(rawSchool, rawDegree);

        return {
          ...item,
          school: stripTrailingDateRange(split.school),
          degree: stripTrailingDateRange(split.degree),
          duration: formatDateDisplay(
            pick(item.duration, item.date, item.period, extractDateRange(rawSchool), extractDateRange(rawDegree))
          ),
          desc: toBulletText(pick(item.desc, item.description), 2),
        };
      }) || [],
    projects:
      data.projects?.map((item) => {
        const name = pick(item.name, item.projectName, item.title);
        return {
          ...item,
          name,
          projectName: name,
          role: pick(item.role, item.techStack, item.technologies),
          link: pick(item.link, item.url, item.website),
          desc: toBulletText(pick(item.desc, item.description, item.summary), 3),
        };
      }) || [],
    certificates:
      data.certificates?.map((item) => {
        const name = pick(item.name, item.certificateName, item.title);
        return {
          ...item,
          name,
          certificateName: name,
          organization: pick(item.organization, item.issuer, item.authority),
          date: formatDateDisplay(pick(item.date, item.issueDate, item.issuedAt)),
        };
      }) || [],
    skills: normalizeSkills(data.skills),
  };
};
