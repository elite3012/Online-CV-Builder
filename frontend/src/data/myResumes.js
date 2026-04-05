// src/data/myResumes.js
export const myResumes = [
  {
    id: "cv-1",
    title: "Software Engineer Role",
    templateName: "Modern", 
    lastEdited: "10 mins ago",

    formData: {
      personalInfo: { fullName: "PeppaPig", jobTitle: "Frontend Developer", email: "quy@email.com", phone: "0901 234 567", location: "Ho Chi Minh City", linkedin: "linkedin.com/in/quy", website: "" },
      summary: "Passionate Frontend Developer with 4+ years of experience building scalable web applications. Specialized in React.js and modern UI/UX principles.",
      education: [{ school: "UIT", degree: "Software Engineering", startDate: "2018", endDate: "2022", description: "Graduated with Honors." }],
      experience: [{ company: "TechNova", role: "Frontend Engineer", startDate: "2022", endDate: "Present", description: "Redesigned the core dashboard, improving load time by 40%." }],
      skills: "React.js, Tailwind CSS, Redux, Node.js",
      projects: [{ name: "meomeo", role: "Lead Dev", link: "meomeo.vn", description: "Entertainment platform." }],
      certificates: [{ name: "Advanced React", organization: "Frontend Masters", date: "2023" }],
    }
  },
  {
    id: "cv-2",
    title: "Business Analyst Resume",
    templateName: "Minimal", 
    lastEdited: "2 days ago",
    formData: {
      personalInfo: { fullName: "Nguyễn Kiệt", jobTitle: "Business Analyst", email: "kiet@email.com", phone: "0987 654 321", location: "Da Nang", linkedin: "", website: "" },
      summary: "Detail-oriented BA with a track record of optimizing business processes.",
      education: [{ school: "RMIT", degree: "Bachelor of Business", startDate: "2015", endDate: "2019", description: "" }],
      experience: [{ company: "FinTech Hub", role: "Lead BA", startDate: "2020", endDate: "Present", description: "Streamlined agile workflows." }],
      skills: "Data Modeling, Agile, SQL, Tableau",
      projects: [],
      certificates: [],
    }
  }
];