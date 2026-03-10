# User Stories - Product Backlog

## Priority 0 (P0) - Must Have (MVP)

### US1: User Authentication
**As a** job seeker  
**I want to** register an account, log in, and log out  
**So that** I can securely access and manage my CV data across sessions

**Acceptance Criteria:**
- User can register with email and password
- User can log in with valid credentials
- User receives clear error messages for invalid credentials
- User can log out and session is terminated
- Password is securely hashed and stored

---

### US2: Create New CV
**As an** authenticated user  
**I want to** create a new CV  
**So that** I can start building my professional resume

**Acceptance Criteria:**
- User can create a new CV with a title
- User is redirected to CV editor after creation
- CV is saved with default empty sections
- User sees confirmation message after creation

---

### US3: Edit Personal Information
**As an** authenticated user editing a CV  
**I want to** add and edit my personal information  
**So that** employers can see my contact details and basic info

**Acceptance Criteria:**
- User can input: full name, contact email, phone, address, LinkedIn, portfolio
- Changes are saved automatically or on explicit save action
- Validation ensures required fields are filled
- Clear error messages for invalid inputs

---

### US4: Edit Education
**As an** authenticated user editing a CV  
**I want to** add, edit, and remove education entries  
**So that** I can showcase my academic background

**Acceptance Criteria:**
- User can add multiple education entries
- Each entry includes: institution, degree, field of study, start date, end date, description
- User can edit and delete existing education entries
- Entries are displayed in chronological order

---

### US5: Edit Experience
**As an** authenticated user editing a CV  
**I want to** add, edit, and remove work experience entries  
**So that** I can highlight my professional background

**Acceptance Criteria:**
- User can add multiple experience entries
- Each entry includes: company, position, start date, end date, description
- User can edit and delete existing experience entries
- Entries are displayed in chronological order

---

### US6: Edit Skills
**As an** authenticated user editing a CV  
**I want to** add, edit, and remove skills  
**So that** I can showcase my technical and soft skills

**Acceptance Criteria:**
- User can add multiple skills
- Each skill includes: skill name, proficiency level
- User can edit and delete existing skills
- Skills are categorized or listed clearly

---

### US7: Choose Template
**As an** authenticated user  
**I want to** select from available CV templates  
**So that** my CV has a professional appearance

**Acceptance Criteria:**
- User can view template gallery with thumbnails
- User can select a template for their CV
- Template selection is saved with the CV
- User can change template at any time

---

### US8: Preview CV
**As an** authenticated user  
**I want to** preview my CV in the selected template  
**So that** I can see how it will look before exporting

**Acceptance Criteria:**
- User can view CV with selected template applied
- Preview updates when CV data changes
- Preview is formatted for print/export

---

### US11: Save and Reload Persisted Data
**As an** authenticated user  
**I want to** save my CV data and reload it later  
**So that** I don't lose my work and can continue editing

**Acceptance Criteria:**
- CV data is automatically saved to database
- User can access previously created CVs from dashboard
- All CV sections are persisted correctly
- User sees loading states during data fetch

---

### US12: Validation and Clear Error Messages
**As a** user interacting with the system  
**I want to** receive clear validation feedback  
**So that** I know what needs to be corrected in my input

**Acceptance Criteria:**
- Required fields show clear validation messages
- Email format is validated
- Date ranges are validated (start date < end date)
- Error messages are displayed near relevant fields
- Success messages confirm saved changes

---

## Priority 1 (P1) - Should Have

*To be added: responsive polish, better UX states (loading/empty/error), CV versioning/duplicate*

---

## Priority 2 (P2) - Nice to Have

### US13: ATS Checklist
**As an** authenticated user  
**I want to** receive an ATS checklist for my CV  
**So that** I can optimize my CV for applicant tracking systems

**Acceptance Criteria:**
- System provides rule-based checklist (no paid AI)
- Checklist includes common ATS requirements
- User sees suggestions for improvement
- Checklist is explainable and transparent

---

### US14: Keyword Matching
**As an** authenticated user  
**I want to** compare my CV against a job description  
**So that** I can identify missing keywords and improve match

**Acceptance Criteria:**
- User can paste job description
- System highlights matching and missing keywords
- Suggestions are rule-based (no paid AI)
- Results are clear and actionable
