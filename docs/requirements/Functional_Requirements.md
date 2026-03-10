# Functional Requirements

## FR1: User Authentication and Authorization

**FR1.1** The system shall allow users to register with email, password, and full name  
**FR1.2** The system shall validate email format during registration  
**FR1.3** The system shall ensure email uniqueness (no duplicate registrations)  
**FR1.4** The system shall hash passwords before storing in database  
**FR1.5** The system shall allow registered users to log in with email and password  
**FR1.6** The system shall generate JWT token upon successful login  
**FR1.7** The system shall allow users to log out and invalidate session  
**FR1.8** The system shall verify JWT token on all protected endpoints  
**Related Use Cases:** UC1, UC2  
**Related User Stories:** US1

---

## FR2: CV Management

**FR2.1** The system shall allow authenticated users to create new CV with title  
**FR2.2** The system shall associate each CV with the user who created it  
**FR2.3** The system shall allow users to view list of their own CVs  
**FR2.4** The system shall allow users to edit only CVs they own  
**FR2.5** The system shall allow users to delete only CVs they own  
**FR2.6** The system shall enforce ownership checks on all CV operations  
**Related Use Cases:** UC3, UC4  
**Related User Stories:** US2, US11

---

## FR3: CV Section Editing

**FR3.1** The system shall allow editing Personal Information section with fields: full name, contact email, phone, address, LinkedIn, portfolio  
**FR3.2** The system shall allow adding, editing, and deleting Education entries  
**FR3.3** Each Education entry shall include: institution, degree, field of study, start date, end date, description  
**FR3.4** The system shall allow adding, editing, and deleting Experience entries  
**FR3.5** Each Experience entry shall include: company, position, start date, end date, description  
**FR3.6** The system shall allow adding, editing, and deleting Skills  
**FR3.7** Each Skill shall include: skill name, proficiency level  
**FR3.8** The system shall persist all CV section changes to database  
**Related Use Cases:** UC4, UC8, UC9  
**Related User Stories:** US3, US4, US5, US6

---

## FR4: Template Management

**FR4.1** The system shall provide multiple CV templates for user selection  
**FR4.2** The system shall display template gallery with thumbnails  
**FR4.3** The system shall allow users to select template for their CV  
**FR4.4** The system shall store template selection (CV.templateID) in database  
**FR4.5** The system shall allow users to change template at any time  
**Related Use Cases:** UC5A  
**Related User Stories:** US7

---

## FR5: CV Preview and Export

**FR5.1** The system shall generate CV preview with selected template applied  
**FR5.2** The system shall load template layout/styling using CV.templateID  
**FR5.3** The system shall validate CV data before generating preview  
**FR5.4** The system shall allow users to export CV to PDF format  
**FR5.5** The system shall allow users to export CV to DOCX format  
**FR5.6** Export shall include ownership verification  
**FR5.7** Export shall apply selected template formatting  
**Related Use Cases:** UC5B  
**Related User Stories:** US8

---

## FR6: Data Validation

**FR6.1** The system shall validate email format (user email and contact email)  
**FR6.2** The system shall validate required fields are not empty  
**FR6.3** The system shall validate date ranges (start date before end date)  
**FR6.4** The system shall validate password minimum length (8 characters)  
**FR6.5** The system shall provide real-time validation feedback on input fields  
**FR6.6** The system shall display clear error messages near invalid fields  
**FR6.7** Error messages shall be specific and actionable  
**Related Use Cases:** UC6  
**Related User Stories:** US12

---

## FR7: Data Persistence

**FR7.1** The system shall save CV data to SQLite database  
**FR7.2** The system shall implement auto-save functionality (optional)  
**FR7.3** The system shall allow users to reload previously saved CVs  
**FR7.4** The system shall maintain data integrity across sessions  
**FR7.5** The system shall handle concurrent updates gracefully  
**Related Use Cases:** UC4  
**Related User Stories:** US11

---

## FR8: ATS Assistance (P2 - Optional)

**FR8.1** The system shall provide rule-based ATS checklist  
**FR8.2** The system shall check CV for ATS-friendly formatting  
**FR8.3** The system shall identify missing keywords against job description  
**FR8.4** The system shall provide explainable suggestions (no black-box AI)  
**FR8.5** ATS features shall not require paid API calls  
**Related Use Cases:** UC7  
**Related User Stories:** US13, US14
