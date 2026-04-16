# Online CV Builder

**Online CV Builder** is a modern, full-stack web application designed to help users create, manage, and export professional resumes effortlessly. By bridging a sleek React frontend with a robust Spring Boot backend, the platform solves the hassle of manual CV formatting, offering dynamic templates and real-time safe previews securely backed by a normalized PostgreSQL database.

---

## ?? Features

### Authentication & Account Management
- **Secure Registration & Login:** JWT-based authentication.
- **Account Protection:** Brute-force protection with rate limiting and temporary blocks.
- **Data Privacy:** Passwords are fully hashed and salted before storage.

### Core CV Management
- **Interactive Editor:** Real-time form updates with an "Unsaved/Saving/Saved" auto-sync indicator.
- **Dynamic Relational Sections:** Add, edit, or remove entries for Education, Experience, Projects, Skills, and Certificates.
- **Template Gallery:** Browse and instantly swap between multiple professional templates (Modern, Classic, Creative, etc.).
- **Live Preview & Export:** Safely preview resumes and export them instantly to high-quality PDF formats. 

### Security Enhancements
- **Strict Data Ownership:** Users can only fetch, edit, or delete their own CV records natively enforced at the Service layer.
- **Input Sanitization:** Built-in logic to block XSS payloads from reaching the database.

### ?? Future Implementations (Next Sprints)
- **AI CV-to-JD Matching:** NLP algorithms parsing your CV tokens against Job Descriptions to provide Match Scores.
- **ATS Checker:** Smart suggestions based on missing skill keywords and formatting checks.

---

## ??? System Architecture

The application implements a classic client-server architecture mapped as follows:

**Client (React)** $\rightarrow$ **REST APIs** $\rightarrow$ **Controller Layer** $\rightarrow$ **Service Layer** $\rightarrow$ **Repository Layer** $\rightarrow$ **PostgreSQL**

1. **Frontend:** Dispatches structural payloads (DTOs) via the piService.
2. **Backend Controllers:** Route and validate HTTP requests (e.g., CVController, AuthController).
3. **Backend Services:** Execute business rules, merge nested collections, and handle Auth/Rate logic.
4. **Repositories:** Spring Data JPA interfaces interacting directly with the relational database.

> [Insert diagram: System architecture]

---

## ??? Database Design

The system relies on a fully normalized (1st to 3rd normal form) PostgreSQL Entity-Relationship structure rather than massive JSON columns to ensure data integrity.

**Main Entities:**
- **\User\**: Credentials and account status.
- **\Template\**: System-provided templates.
- **\CV\**: The root entity linking the User and Template. It cascades updates to all nested subsections.
- **\PersonalInformation\**: One-to-One mapping from \CV\.
- **\Education\, \Experience\, \Project\, \Certificate\, \Skill\**: One-to-Many child relationships owned by the \CV\.

> [Insert diagram: ERD image]

---

## ?? Tech Stack

### Frontend
- **Framework:** React.js (built with Vite)
- **UI Library:** Material UI (MUI) & Framer Motion (Animations)
- **Export Engine:** jsPDF & html2canvas

### Backend
- **Framework:** Java Spring Boot
- **Persistence:** Spring Data JPA / Hibernate
- **Security:** Spring Security & JWT 
- **Package Manager:** Maven

### Database
- PostgreSQL (Default)

---

## ?? Installation Guide

Follow these steps to run the application on your local machine.

### 1. Database Setup
1. Ensure **PostgreSQL** is installed and running on port 5432.
2. Create an empty database named CVBuilder.
3. The backend uses default credentials. Update ackend/src/main/resources/application.properties if yours are different:
   `properties
   spring.datasource.username=postgres
   spring.datasource.password=your_db_password
   `

### 2. Backend Setup
1. Open a terminal and navigate to the ackend folder:
   `ash
   cd backend
   `
2. Install dependencies & build the project:
   `ash
   mvn clean install
   `
3. Run the Spring Boot application (Server will start on port 8081):
   `ash
   mvn spring-boot:run
   `

### 3. Frontend Setup
1. Open a new terminal and navigate to the rontend folder:
   `ash
   cd frontend
   `
2. Install Node packages (using npm, yarn, or bun):
   `ash
   yarn install
   # or npm install
   `
3. Start the Vite development server:
   `ash
   yarn dev
   # or npm run dev
   `
4. Access the web app at http://localhost:5173.

---

## ?? How to Use (User Guide)

1. **Register an Account:** Head to the auth page and create a new account safely.
   > [Insert screenshot: Registration page]
2. **Login:** Use your credentials to access the personalized Dashboard.
   > [Insert screenshot: Login page]
3. **Create CV:** Click "Create New", select a template, and an empty draft will be initialized.
   > [Insert screenshot: Template selection]
4. **Edit Sections:** Fill out the forms (Personal Info, Experience, Skills, etc.). The app will auto-sync changes every few seconds.
   > [Insert screenshot: Editor screen]
5. **Live Preview:** Tap "Preview" in the toolbar to see exactly how your document will look.
6. **Export:** Click "Export" to download a perfectly formatted PDF to your hard drive.

---

## ?? API Overview

A quick look at the main REST endpoints bridging the application:

*   **Auth Endpoints**
    *   \POST /api/auth/register\ - Register user
    *   \POST /api/auth/login\ - Login & receive JWT
*   **CV Endpoints**
    *   \GET  /api/cv\ - Fetch all CVs for the authenticated user
    *   \GET  /api/cv/{id}\ - Read a specific CV 
    *   \POST /api/cv\ - Initialize a new CV with a template ID
    *   \PUT  /api/cv/{id}\ - Update nested sections of the CV via structured DTOs
    *   \DELETE /api/cv/{id}\ - Delete a CV record
*   **Template Endpoints**
    *   \GET /api/templates\ - Retrieve active templates
*   **AI/Matching Endpoints (In-progress)**
    *   \POST /api/ai/analyze-jd\ - Evaluate CV against a Job Description string

---

## ?? Project Structure

`	ext
Online-CV-Builder/
+-- backend/
¦   +-- src/main/java/com/cvbuilder/
¦   ¦   +-- controller/   # REST API Entry points
¦   ¦   +-- dto/          # Data Transfer Objects
¦   ¦   +-- model/        # JPA Entities (CV, User, Education, etc.)
¦   ¦   +-- repository/   # DB Interfaces
¦   ¦   +-- security/     # JWT Filters & Config
¦   ¦   +-- service/      # Business Logic & DB Transactions
¦   +-- src/main/resources/
¦       +-- application.properties # Server & DB Config
+-- frontend/
    +-- src/
    ¦   +-- components/   # Modular React Components (Editor, Navbar, Templates)
    ¦   +-- pages/        # High-level Views (Dashboard, EditorPage, Auth)
    ¦   +-- services/     # apiService.js for Fetch calls
    ¦   +-- utils/        # Helper logic
    +-- package.json
`

---

## ??? Security Highlights

- **Password Hashing:** Passwords are cryptographically hashed via Bcrypt before DB insertion.
- **Stateless Sessions (JWT):** No server-side sessions. All secure requests require an actively valid Authorization: Bearer <token> header.
- **Ownership Validation:** All CRUD operations inside CVService explicitly verify that cv.getUserId() == currentUser.getId() preventing ID-Insecure Direct Object Reference (IDOR).
- **Rate-Limiting:** Multiple failed login attempts trigger an IP/User-based cooldown block, neutralizing brute-force dictionary attacks.
- **XSS Protection:** The backend alidationService actively scans PUT payloads to reject malicious HTML/JS tags, combined with SafePreviewText.jsx rendering logic on the React side.

---

## ?? Contribution

Contributions are welcome!
1. Fork the repo.
2. Create a new branch (git checkout -b feature/AmazingFeature).
3. Commit your changes (git commit -m 'Add some AmazingFeature').
4. Push to the branch (git push origin feature/AmazingFeature).
5. Open a Pull Request.

---

## ?? License

This project is open-source and available under the [MIT License](LICENSE).
