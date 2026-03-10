# Online CV Builder - AI Assisted CV Builder Website

A web application that helps job seekers create professional CVs quickly by editing sections, choosing templates, previewing, exporting, and receiving basic AI assistance with zero monetary cost.

## Project Overview

- **Timeline:** 2 months
- **Team:** 6 members
- **Constraints:** Free tools and open-source libraries only
- **Tech Stack:** React (Frontend) + Java Spring Boot (Backend) + SQLite (Database)

## Features

### P0 (Must Have - MVP)
- ✅ User Registration, Login, and Logout
- ✅ Create and manage multiple CVs
- ✅ Edit CV sections: Personal Info, Education, Experience, Skills
- ✅ Choose from multiple professional templates
- ✅ Preview CV with selected template
- ✅ Export CV to PDF and DOCX
- ✅ Input validation with clear error messages
- ✅ Data persistence and reload

### P2 (Nice to Have)
- 🔄 Rule-based ATS checklist
- 🔄 Keyword matching vs job description

## Project Structure

```
Online-CV-Builder/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API and auth services
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
├── backend/              # Java Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/cvbuilder/
│   │   │   │   ├── controller/    # REST controllers
│   │   │   │   ├── service/       # Business logic
│   │   │   │   ├── repository/    # Data access
│   │   │   │   ├── model/         # JPA entities
│   │   │   │   ├── dto/           # Data transfer objects
│   │   │   │   └── security/      # JWT and security config
│   │   │   └── resources/
│   │   └── test/         # Unit and integration tests
│   └── pom.xml           # Maven dependencies
├── docs/                 # Documentation and Lab 2 artefacts
│   ├── requirements/     # User stories, use cases, FR, NFR
│   ├── diagrams/         # Architecture, ERD, class, sequence diagrams
│   ├── sprint/           # Sprint backlog and planning
│   └── prototypes/       # UI/UX prototypes
├── LICENSE
└── README.md
```

## Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite 5
- **Routing:** React Router 6
- **HTTP Client:** Axios
- **Styling:** CSS (TBD: Tailwind/Material-UI)

### Backend
- **Framework:** Spring Boot 3.2
- **Language:** Java 17
- **Security:** Spring Security + JWT
- **Database:** SQLite (development), JPA/Hibernate
- **Export Libraries:** 
  - Apache PDFBox (PDF export)
  - Apache POI (DOCX export)

### Development Tools
- **Version Control:** Git
- **IDEs:** VS Code, IntelliJ IDEA
- **API Testing:** Postman / Thunder Client
- **Diagram Tools:** Draw.io, PlantUML

## Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Java JDK** 17+
- **Maven** 3.8+
- Git

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/your-team/Online-CV-Builder.git
cd Online-CV-Builder
```

#### 2. Setup Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend will run on `http://localhost:8080`

#### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`

### Environment Variables

#### Backend (application.properties)
```properties
server.port=8080
spring.datasource.url=jdbc:sqlite:cvbuilder.db
jwt.secret=your-secret-key-change-this
jwt.expiration=86400000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080/api
```

## Development Workflow

### Sprint 1 (Current) - Documentation Focus
- Complete Lab 2 requirements specification
- Create all required diagrams
- Define user stories, use cases, FR, NFR
- Prepare prototypes and change logs

### Sprint 2+ - Implementation
- Implement authentication and user management
- Build CV editor with all sections
- Implement template system
- Add export functionality
- Testing and refinement

## Team

- **Quy (Leader):** Project Manager, Integration, Report consolidation
- **Minh:** Backend Architecture, ERD, API design, Security
- **Cap:** UI/UX Design, Prototypes, User stories, Template gallery
- **Duc:** Full-stack Development, Module integration
- **Kiet:** Non-functional requirements, Editor sections
- **Khang:** QA/Testing, Documentation, Test cases

## Documentation

All Lab 2 documentation is in the `docs/` folder:
- [Requirements Specification](docs/requirements/Lab2_Requirements_Specification.md)
- [User Stories](docs/requirements/User_Stories.md)
- [Use Cases](docs/requirements/Use_Cases.md)
- [Functional Requirements](docs/requirements/Functional_Requirements.md)
- [Non-Functional Requirements](docs/requirements/Non_Functional_Requirements.md)
- [Sprint 1 Backlog](docs/sprint/Sprint1_Backlog.md)

## API Endpoints (Planned)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### CV Management
- `GET /api/cv` - Get all CVs for authenticated user
- `GET /api/cv/{id}` - Get specific CV
- `POST /api/cv` - Create new CV
- `PUT /api/cv/{id}` - Update CV
- `DELETE /api/cv/{id}` - Delete CV

### Templates
- `GET /api/template` - Get all templates
- `GET /api/template/{id}` - Get specific template

### Export
- `POST /api/export/{cvId}/pdf` - Export CV to PDF
- `POST /api/export/{cvId}/docx` - Export CV to DOCX

## Database Schema

### Key Entities
- **User:** User accounts (email, password, fullName)
- **CV:** CV documents (title, templateID, userID)
- **PersonalInformation:** Contact details (contactEmail, phone, address)
- **Education:** Education entries (institution, degree, dates)
- **Experience:** Work experience (company, position, dates)
- **Skill:** Skills (skillName, proficiencyLevel)
- **Template:** CV templates (name, layout configuration)

See [ERD diagram](docs/diagrams/) for full schema.

## Contributing

1. Create feature branch from `main`
2. Make changes following code style guidelines
3. Write/update tests
4. Submit pull request for review
5. Require at least one approval before merge

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Course: [Course Name]
- Instructor: [Instructor Name]
- Institution: [University Name]
- Lab: Lab 2 - Requirements and Artefacts

---

**Status:** 🟢 Sprint 1 (Documentation) in progress  
**Last Updated:** March 10, 2026


