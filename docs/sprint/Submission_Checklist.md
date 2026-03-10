# Submission Checklist - Lab 2

**Project:** AI Assisted CV Builder Website (Online CV Builder)  
**Sprint:** Sprint 1 - Requirements and Artefacts  
**Date:** [To be filled]

---

## Part 1: Project Overview ✓

- [ ] Project name, goal, and constraints documented
- [ ] Team roles and contributions clearly defined
- [ ] Resources and tools listed
- [ ] Development process and environment described
- [ ] Scope (included and excluded items) defined
- [ ] Academic writing style maintained
- [ ] Reviewed by at least 2 team members

---

## Part 2: Requirements ✓

### User Stories
- [ ] All P0 user stories written in standard format ("As a... I want... So that...")
- [ ] Acceptance criteria defined for each story
- [ ] P1 and P2 stories included (if applicable)
- [ ] Stories prioritized clearly
- [ ] Reviewed and approved by team

### Use Cases
- [ ] UC1 (Register Account) complete
- [ ] UC2 (Log In) complete
- [ ] UC3 (Create New CV) complete
- [ ] UC4 (Edit CV Section and Save) complete
- [ ] UC5A (Choose Template) complete
- [ ] UC5B (Preview CV) complete
- [ ] UC6 (Validation and Clear Error Messages) complete
- [ ] UC7 (ATS Checklist) complete (P2)
- [ ] UC8 (Edit Skills) complete
- [ ] UC9 (Edit Education) complete
- [ ] All use cases follow formal template (ID, name, actor, preconditions, postconditions, normal flow, alternative flows)
- [ ] Use cases map to user stories
- [ ] Ownership checks and auth requirements documented

### Functional Requirements
- [ ] FR1 (User Authentication and Authorization) complete
- [ ] FR2 (CV Management) complete
- [ ] FR3 (CV Section Editing) complete
- [ ] FR4 (Template Management) complete
- [ ] FR5 (CV Preview and Export) complete
- [ ] FR6 (Data Validation) complete
- [ ] FR7 (Data Persistence) complete
- [ ] FR8 (ATS Assistance) complete (P2)
- [ ] All FR written as "The system shall..." statements
- [ ] FR mapped to use cases and user stories

### Non-Functional Requirements
- [ ] NFR1 (Performance) with measurable targets
- [ ] NFR2 (Usability) with measurable targets
- [ ] NFR3 (Reliability) with measurable targets
- [ ] NFR4 (Security) with measurable targets
- [ ] NFR5 (Maintainability) with measurable targets
- [ ] NFR6 (Scalability) with measurable targets
- [ ] NFR7 (Compatibility) with measurable targets
- [ ] NFR8 (Portability) with measurable targets
- [ ] NFR9 (Testability) with measurable targets
- [ ] NFR10 (Cost) with measurable targets
- [ ] All NFR aligned with project constraints

---

## Part 3: Diagrams ✓

### Architecture Model
- [ ] 3-tier architecture diagram included
- [ ] Component interactions documented
- [ ] Technology stack specified for each layer

### Entity Relationship Diagram (ERD)
- [ ] All entities included: User, CV, PersonalInformation, Education, Experience, Skills, Project, Certificate, Goal, Template
- [ ] ✓ FIX APPLIED: Skills entity added with cvID FK
- [ ] ✓ FIX APPLIED: contactEmail renamed in PersonalInformation
- [ ] ✓ FIX APPLIED: templateID FK added to CV entity
- [ ] All attributes and data types defined
- [ ] Cardinality relationships correct
- [ ] Primary keys and foreign keys marked

### Use Case Diagram
- [ ] User and Authenticated User actors shown
- [ ] All P0 use cases represented
- [ ] ✓ FIX APPLIED: Logout associated with Authenticated User
- [ ] ✓ FIX APPLIED: Choose Template as standalone use case
- [ ] <<include>> and <<extend>> relationships correct
- [ ] Diagram is clear and readable

### Class Diagram
- [ ] All model classes matching ERD included
- [ ] ✓ FIX APPLIED: Skill class added
- [ ] Service and controller classes included
- [ ] Attributes and methods defined
- [ ] ✓ FIX APPLIED: Complete CRUD methods for all entities
- [ ] ✓ FIX APPLIED: Export responsibility clarified
- [ ] Relationships and multiplicities correct

### Sequence Diagrams
- [ ] "Load & Edit CV" sequence diagram included
- [ ] ✓ FIX APPLIED: Update endpoint PUT /cv/{id} with auth token and ownership check
- [ ] "Export CV" sequence diagram included
- [ ] ✓ FIX APPLIED: Validation, template loading, auth+ownership checks added to export
- [ ] "Login" sequence diagram included
- [ ] At least 3 sequence diagrams covering key flows
- [ ] All interactions between frontend, backend, database shown

---

## Part 4: User Manual and Testing ✓

### User Manual Outline
- [ ] Manual structure created
- [ ] Getting started section
- [ ] Feature documentation for all P0 features
- [ ] Screenshot placeholders added
- [ ] Troubleshooting and FAQ section
- [ ] Reviewed for clarity

### Test Structure
- [ ] Test case template defined
- [ ] Test cases for authentication
- [ ] Test cases for CV CRUD operations
- [ ] Test cases for validation
- [ ] Test cases for export
- [ ] Expected results documented
- [ ] Test execution plan documented

---

## Prototypes ✓

- [ ] Quy: 2 prototypes with before/after based on peer feedback
- [ ] Minh: 2 prototypes with before/after based on peer feedback
- [ ] Cap: 2 prototypes with before/after based on peer feedback
- [ ] Duc: 2 prototypes with before/after based on peer feedback
- [ ] Kiet: 2 prototypes with before/after based on peer feedback
- [ ] Khang: 2 prototypes with before/after based on peer feedback
- [ ] Change log documents feedback and changes for each prototype
- [ ] All prototypes included in report with evidence section

---

## Sprint Management Artefacts ✓

- [ ] Sprint backlog with tasks, owners, estimates, dependencies
- [ ] Definition of done for each task
- [ ] Sprint planning meeting report included
- [ ] Submission checklist (this document) complete

---

## Integration and Quality ✓

- [ ] All parts integrated into single document
- [ ] Traceability matrix created (US → UC → FR/NFR)
- [ ] No orphan requirements (all FR/NFR map to use cases)
- [ ] Document formatted in academic style
- [ ] Consistent terminology throughout
- [ ] All diagrams have proper labels and legends
- [ ] Table of contents included
- [ ] Page numbers added
- [ ] References cited (if any)
- [ ] Proofread for grammar and spelling
- [ ] Consistency check completed: no contradictions between artefacts

---

## Final Checks ✓

- [ ] All team members have reviewed the document
- [ ] Sign-off from all team members
- [ ] Document exported to required format (PDF/DOCX)
- [ ] File naming convention followed
- [ ] Submission deadline noted and met
- [ ] Backup copy saved

---

## Team Sign-off

I have reviewed the Lab 2 submission and confirm it meets all requirements:

- [ ] Quy (Leader) - Date: ________
- [ ] Minh - Date: ________
- [ ] Cap - Date: ________
- [ ] Duc - Date: ________
- [ ] Kiet - Date: ________
- [ ] Khang - Date: ________

---

**Submission Date:** [To be filled]  
**Submitted By:** [Name]  
**Confirmation:** [Submission confirmation details]
