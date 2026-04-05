// src/data/mockResumes.js

export const mockResumesData = {
  // 1. MODERN
  1: {
    name: "Trần Phúc Quý",
    title: "Senior Frontend Developer",
    contact: { 
      email: "quy.tran@email.com", 
      phone: "0901 234 567", 
      address: "Ho Chi Minh City, VN",
      linkedin: "linkedin.com/in/quytran",
      website: "quytran.dev"
    },
    summary: "Passionate Frontend Developer with 4+ years of experience building scalable web applications. Specialized in React.js and modern UI/UX principles.",
    experience: [
      { company: "TechNova Solutions", role: "Frontend Engineer", duration: "2021 - Present", desc: "Redesigned the core dashboard, improving load time by 40% and user retention by 25%." },
      { company: "Webify Studio", role: "Web Developer", duration: "2019 - 2021", desc: "Developed responsive landing pages for over 30 international clients." }
    ],
    education: [
      { school: "University of Information Technology (UIT)", degree: "BSc in Software Engineering", duration: "2018 - 2022", desc: "Graduated with Honors. Focus on web development and software architecture." }
    ],
    projects: [
      { name: "Deejoy Web App", role: "Lead Frontend Developer", link: "deejoy.vn", desc: "Developed a dynamic platform recommending entertainment and dining spots using React and Tailwind CSS." }
    ],
    certificates: [
      { name: "Advanced React Patterns", organization: "Frontend Masters", date: "Aug 2023" },
      { name: "IELTS 8.0", organization: "British Council", date: "May 2022" }
    ],
    skills: ["React.js", "JavaScript/TypeScript", "Tailwind CSS", "Redux", "Framer Motion"]
  },

  // 2. MINIMAL
  2: {
    name: "Nguyễn Kiệt",
    title: "Senior Business Analyst",
    contact: { 
      email: "kiet.nguyen@email.com", 
      phone: "0987 654 321", 
      address: "Ho Chi Minh City, VN",
      linkedin: "linkedin.com/in/kietnguyen-ba",
      website: ""
    },
    summary: "Detail-oriented Business Analyst with a strong track record of optimizing business processes and bridging the gap between IT and operations.",
    experience: [
      { company: "Global FinTech Hub", role: "Lead Business Analyst", duration: "2020 - Present", desc: "Led a team of 5 BAs. Streamlined agile workflows, reducing project delivery time by 15%." },
      { company: "DataSync Corp", role: "Data Analyst", duration: "2017 - 2020", desc: "Gathered business requirements and created comprehensive data models." }
    ],
    education: [
      { school: "RMIT University Vietnam", degree: "Bachelor of Business", duration: "2013 - 2017", desc: "Major in Information Systems." }
    ],
    projects: [
      { name: "FinTech Workflow Automation", role: "Lead BA", link: "", desc: "Successfully mapped and automated 20+ core financial workflows." }
    ],
    certificates: [
      { name: "Certified ScrumMaster (CSM)", organization: "Scrum Alliance", date: "2021" }
    ],
    skills: ["Data Modeling", "Agile/Scrum", "SQL", "Tableau", "Process Optimization"]
  },

  // 3. CLASSIC
  3: {
    name: "Trần Phúc Quý",
    title: "Financial Auditor",
    contact: { 
      email: "quy.finance@email.com", 
      phone: "0912 345 678", 
      address: "Hanoi, VN",
      linkedin: "linkedin.com/in/quyfinance",
      website: ""
    },
    summary: "Certified Public Accountant (CPA) with 6 years of experience in corporate auditing, risk management, and financial reporting.",
    experience: [
      { company: "KPMG Vietnam", role: "Senior Auditor", duration: "2019 - Present", desc: "Conducted statutory audits for top-tier manufacturing and retail clients." },
      { company: "VietCapital Bank", role: "Internal Auditor", duration: "2016 - 2019", desc: "Evaluated internal controls and ensured compliance with national banking regulations." }
    ],
    education: [
      { school: "National Economics University", degree: "BSc in Accounting", duration: "2012 - 2016", desc: "GPA: 3.8/4.0." }
    ],
    projects: [
      { name: "Retail Audit Overhaul", role: "Project Lead", link: "", desc: "Redesigned the audit process for a major retail chain, saving 200+ man-hours annually." }
    ],
    certificates: [
      { name: "Certified Public Accountant (CPA)", organization: "Ministry of Finance", date: "2018" }
    ],
    skills: ["Financial Reporting", "Risk Assessment", "Tax Compliance", "SAP ERP", "Advanced Excel"]
  },

  // 4. CREATIVE
  4: {
    name: "Nguyễn Kiệt",
    title: "Art Director & Graphic Designer",
    contact: { 
      email: "kiet.design@email.com", 
      phone: "0934 567 890", 
      address: "Da Nang, VN",
      linkedin: "linkedin.com/in/kietart",
      website: "behance.net/kietdesign"
    },
    summary: "Award-winning Art Director passionate about visual storytelling, branding, and creating vibrant digital experiences.",
    experience: [
      { company: "Ogilvy Vietnam", role: "Art Director", duration: "2021 - Present", desc: "Directed digital campaigns for major FMCG brands, increasing social engagement by 300%." },
      { company: "Creative Minds Agency", role: "Graphic Designer", duration: "2018 - 2021", desc: "Designed brand identities, packaging, and marketing collaterals." }
    ],
    education: [
      { school: "University of Architecture", degree: "Bachelor of Fine Arts", duration: "2014 - 2018", desc: "Specialized in Graphic Design." }
    ],
    projects: [
      { name: "Fantasy Book Cover Series", role: "Illustrator", link: "behance.net/fantasy-series", desc: "Designed a series of book covers inspired by contemporary fantasy literature." },
      { name: "Prisma Visions Brand Identity", role: "Lead Designer", link: "", desc: "Complete rebranding including logo, color palette, and marketing materials." }
    ],
    certificates: [
      { name: "Advanced Adobe Illustrator", organization: "Adobe", date: "2020" }
    ],
    skills: ["Adobe Creative Suite", "Figma", "Brand Identity", "Typography", "Video Editing"]
  },

  // 5. PROFESSIONAL
  5: {
    name: "Trần Phúc Quý",
    title: "Backend Software Engineer",
    contact: { 
      email: "quy.dev@email.com", 
      phone: "0999 888 777", 
      address: "Singapore",
      linkedin: "linkedin.com/in/quybackend",
      website: "github.com/quydev"
    },
    summary: "Results-driven Software Engineer specialized in building robust and scalable microservices for enterprise-level applications.",
    experience: [
      { company: "Shopee", role: "Backend Engineer", duration: "2022 - Present", desc: "Architected high-throughput payment gateways handling 10k+ TPS." },
      { company: "VNG Corporation", role: "Java Developer", duration: "2019 - 2022", desc: "Maintained and optimized legacy backend systems." }
    ],
    education: [
      { school: "National University of Singapore (NUS)", degree: "MSc in Computer Science", duration: "2018 - 2020", desc: "Focus on Distributed Systems." }
    ],
    projects: [
      { name: "AI-Powered CV Builder", role: "Backend Architect", link: "github.com/quydev/cv-builder", desc: "Developed a scalable RESTful API handling dynamic PDF generation and user authentication." }
    ],
    certificates: [
      { name: "AWS Certified Solutions Architect", organization: "Amazon Web Services", date: "2021" }
    ],
    skills: ["Java", "Spring Boot", "Golang", "Microservices", "Docker/Kubernetes"]
  },

  // 6. ELEGANT
  6: {
    name: "Nguyễn Kiệt",
    title: "Chief Marketing Officer (CMO)",
    contact: { 
      email: "kiet.cmo@email.com", 
      phone: "0900 111 222", 
      address: "Ho Chi Minh City, VN",
      linkedin: "linkedin.com/in/kiet-marketing",
      website: ""
    },
    summary: "Visionary marketing executive with 12+ years of experience driving multi-million dollar growth strategies for e-commerce brands.",
    experience: [
      { company: "E-Com Giant VN", role: "CMO", duration: "2018 - Present", desc: "Grew annual recurring revenue (ARR) by 150% through aggressive multi-channel marketing." },
      { company: "Retail Innovators", role: "Marketing Director", duration: "2014 - 2018", desc: "Managed a $5M annual marketing budget and a team of 40 professionals." }
    ],
    education: [
      { school: "Foreign Trade University", degree: "Bachelor of International Business", duration: "2006 - 2010", desc: "Top 5% of class." }
    ],
    projects: [
      { name: "Market Expansion Strategy 2024", role: "CMO", link: "", desc: "Successfully launched the brand into 3 new Southeast Asian markets." }
    ],
    certificates: [
      { name: "Digital Marketing Masterclass", organization: "Google", date: "2016" }
    ],
    skills: ["Strategic Planning", "Market Expansion", "P&L Management", "Brand Positioning"]
  },

  // 7. CLASSIC 2
  7: {
    name: "Trần Phúc Quý",
    title: "Senior Product Manager",
    contact: { 
      email: "quy.pm@email.com", 
      phone: "0911 222 333", 
      address: "Ho Chi Minh City, VN",
      linkedin: "linkedin.com/in/quypm",
      website: ""
    },
    summary: "Customer-centric Product Manager excelling in agile environments, bridging engineering and business teams to launch successful SaaS products.",
    experience: [
      { company: "SaaS Innovate", role: "Lead Product Manager", duration: "2020 - Present", desc: "Launched 3 flagship enterprise products. Defined roadmap and PRDs." },
      { company: "Tech Startup X", role: "Product Owner", duration: "2017 - 2020", desc: "Prioritized product backlog and managed bi-weekly sprint planning." }
    ],
    education: [
      { school: "Hanoi University of Science and Technology", degree: "BSc in Computer Science", duration: "2012 - 2016", desc: "" }
    ],
    projects: [
      { name: "B2B SaaS Dashboard Redesign", role: "Product Lead", link: "", desc: "Led cross-functional team to redesign core dashboard, resulting in 40% higher user engagement." }
    ],
    certificates: [
      { name: "Certified Scrum Product Owner (CSPO)", organization: "Scrum Alliance", date: "2019" }
    ],
    skills: ["Product Strategy", "Agile/Scrum", "User Research", "Wireframing", "Data Analysis"]
  },

  // 8. PROFESSIONAL 2
  8: {
    name: "Nguyễn Kiệt",
    title: "Corporate Legal Counsel",
    contact: { 
      email: "kiet.legal@email.com", 
      phone: "0955 444 333", 
      address: "Hanoi, VN",
      linkedin: "linkedin.com/in/kietlegal",
      website: ""
    },
    summary: "Experienced attorney specializing in corporate law, mergers and acquisitions (M&A), and intellectual property protection.",
    experience: [
      { company: "Baker McKenzie", role: "Senior Associate", duration: "2019 - Present", desc: "Advised multinational corporations on cross-border M&A deals valued over $50M." },
      { company: "VN Law Firm", role: "Legal Consultant", duration: "2015 - 2019", desc: "Drafted and reviewed commercial contracts and ensured regulatory compliance." }
    ],
    education: [
      { school: "Hanoi Law University", degree: "Bachelor of Laws (LLB)", duration: "2010 - 2014", desc: "Graduated Excellent." }
    ],
    projects: [
      { name: "Cross-Border Acquisition Deal", role: "Lead Counsel", link: "", desc: "Successfully navigated regulatory hurdles for a $70M tech company acquisition." }
    ],
    certificates: [
      { name: "Lawyer Practicing Certificate", organization: "Vietnam Bar Federation", date: "2016" }
    ],
    skills: ["Corporate Law", "M&A", "Contract Negotiation", "Intellectual Property", "Compliance"]
  },

  // 9. MODERN 2
  9: {
    name: "Trần Phúc Quý",
    title: "Fullstack Web Developer",
    contact: { 
      email: "quy.fullstack@email.com", 
      phone: "0988 777 666", 
      address: "Remote",
      linkedin: "linkedin.com/in/quyfullstack",
      website: "quydev.com"
    },
    summary: "Versatile Fullstack Developer with expertise in the MERN stack. I love building end-to-end solutions from database design to pixel-perfect UIs.",
    experience: [
      { company: "Freelance", role: "Fullstack Developer", duration: "2021 - Present", desc: "Developed custom web applications for startups globally using React and Node.js." },
      { company: "Digital Agency Y", role: "Junior Web Developer", duration: "2019 - 2021", desc: "Assisted in building E-commerce platforms and integrated third-party APIs." }
    ],
    education: [
      { school: "FPT University", degree: "BSc in Software Engineering", duration: "2016 - 2020", desc: "Capstone Project: Real-time collaborative platform." }
    ],
    projects: [
      { name: "English Tutoring Platform", role: "Solo Developer", link: "englishtutor.vn", desc: "Built a platform for scheduling and delivering online English classes." },
      { name: "Fitness Tracker App", role: "Fullstack Developer", link: "", desc: "Developed a PWA tracking gym workouts and diet plans." }
    ],
    certificates: [
      { name: "Meta Full-Stack Engineer Certificate", organization: "Coursera", date: "2023" }
    ],
    skills: ["MongoDB", "Express.js", "React.js", "Node.js", "RESTful APIs", "AWS"]
  }
};