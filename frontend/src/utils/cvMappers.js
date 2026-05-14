export const toDateDisplay = (value) => {
  const v = String(value ?? '').trim();
  const match = v.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : v;
};

export const formatDateRange = (startDate, endDate) => {
  const start = toDateDisplay(startDate);
  const end = toDateDisplay(endDate);
  if (start && end) return `${start} - ${end}`;
  return start || end || '';
};

export const mapCvFromApi = (cv) => ({
  id: cv.id,
  title: cv.title,
  updatedAt: cv.updatedAt ?? '',
  summary: cv.summary || '',
  template: cv.template || { templateName: 'Modern' },
  templateName: cv.template?.templateName || 'Modern',
  personalInfo: cv.personalInformation || {},
  education: cv.educations || [],
  experience: cv.experiences || [],
  projects: cv.projects || [],
  certificates:
    cv.certificates?.map((cert) => ({
      ...cert,
      date: toDateDisplay(cert.date ?? cert.issueDate),
    })) || [],
  skills: cv.skills || [],
});

export const getPreviewData = (cv) => ({
  name: cv.personalInfo?.fullName,
  title: cv.personalInfo?.jobTitle,
  template: {
    templateName: cv.template?.templateName || cv.templateName || 'Modern',
  },
  contact: {
    email: cv.personalInfo?.email,
    phone: cv.personalInfo?.phone,
    address: cv.personalInfo?.location,
    linkedIn: cv.personalInfo?.linkedIn,
    website: cv.personalInfo?.website,
  },
  summary: cv.summary,
  experience:
    cv.experience
      ?.filter((e) => e.company)
      .map((exp) => ({
        company: exp.company,
        jobTitle: exp.jobTitle,
        duration: formatDateRange(exp.startDate, exp.endDate),
        desc: exp.description,
      })) || [],
  skills: cv.skills?.map((s) => s.skillName),
  education:
    cv.education
      ?.filter((e) => e.school)
      .map((edu) => ({
        school: edu.school,
        degree: edu.degree,
        duration: formatDateRange(edu.startDate, edu.endDate),
        desc: edu.description,
      })) || [],
  projects:
    cv.projects
      ?.filter((p) => p.projectName)
      .map((proj) => ({
        projectName: proj.projectName,
        role: proj.role,
        link: proj.link,
        desc: proj.description,
      })) || [],
  certificates:
    cv.certificates
      ?.filter((c) => c.certificateName)
      .map((cert) => ({
        certificateName: cert.certificateName,
        organization: cert.organization,
        date: toDateDisplay(cert.date ?? cert.issueDate),
      })) || [],
});
