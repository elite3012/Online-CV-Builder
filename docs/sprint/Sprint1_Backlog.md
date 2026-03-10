# Sprint 1 Backlog

**Sprint Duration:** 2 weeks  
**Sprint Goal:** Complete Lab 2 documentation and establish consistent artefacts for CV Builder project

---

## Sprint Tasks

### Part 1: Project Overview (Assigned: Quy)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T1.1 | Write project overview section | Quy | 2 | Not Started | - |
| T1.2 | Document team roles and contributions | Quy | 1 | Not Started | - |
| T1.3 | Document resources and tools | Quy | 1 | Not Started | - |
| T1.4 | Document development process | Quy | 2 | Not Started | - |
| T1.5 | Define scope (in/out) | Quy | 2 | Not Started | - |

**Definition of Done:**
- Part 1 is complete with all required sections
- Reviewed by at least 2 team members
- Formatted in academic style

---

### Part 2A: User Stories (Assigned: Cap)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T2A.1 | Write P0 user stories in standard format | Cap | 4 | Not Started | - |
| T2A.2 | Define acceptance criteria for each story | Cap | 3 | Not Started | T2A.1 |
| T2A.3 | Add P1 and P2 user stories | Cap | 2 | Not Started | T2A.1 |
| T2A.4 | Review user stories with team | All | 1 | Not Started | T2A.2 |

**Definition of Done:**
- All P0 stories completed with acceptance criteria
- Stories follow "As a... I want... So that..." format
- Prioritization is clear
- Reviewed and approved by team

---

### Part 2B: Use Cases (Assigned: Cap, Minh, Kiet, Khang)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T2B.1 | Write UC1 (Register) and UC2 (Login) | Minh | 3 | Not Started | T2A.1 |
| T2B.2 | Write UC3 (Create CV) and UC4 (Edit CV) | Duc | 3 | Not Started | T2A.1 |
| T2B.3 | Write UC5A (Choose Template) and UC5B (Preview) | Cap | 3 | Not Started | T2A.1 |
| T2B.4 | Write UC6 (Validation) and UC7 (ATS) | Khang | 3 | Not Started | T2A.1 |
| T2B.5 | Write UC8 (Edit Skills) and UC9 (Edit Education) | Kiet | 3 | Not Started | T2A.1 |
| T2B.6 | Review all use cases for consistency | Cap, Minh | 2 | Not Started | T2B.1-T2B.5 |

**Definition of Done:**
- All use cases follow formal template (ID, name, actor, preconditions, postconditions, normal flow, alternative flows)
- Use cases map to user stories
- Flows are detailed and unambiguous
- Ownership checks and auth requirements documented

---

### Part 2C: Functional Requirements (Assigned: Minh)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T2C.1 | Extract FR from use cases | Minh | 4 | Not Started | T2B.6 |
| T2C.2 | Write FR in "shall" statement format | Minh | 3 | Not Started | T2C.1 |
| T2C.3 | Map FR to use cases and user stories | Minh | 2 | Not Started | T2C.2 |
| T2C.4 | Review FR for completeness | Minh, Quy | 1 | Not Started | T2C.3 |

**Definition of Done:**
- All FR written as "The system shall..." statements
- FR mapped to use cases
- No orphan requirements
- Reviewed and approved

---

### Part 2D: Non-Functional Requirements (Assigned: Kiet)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T2D.1 | Define performance NFR with measurable targets | Kiet | 3 | Not Started | - |
| T2D.2 | Define usability, reliability, security NFR | Kiet | 3 | Not Started | - |
| T2D.3 | Define maintainability, scalability NFR | Kiet | 2 | Not Started | - |
| T2D.4 | Define compatibility, portability, testability NFR | Kiet | 2 | Not Started | - |
| T2D.5 | Review NFR with team | Kiet, Quy | 1 | Not Started | T2D.1-T2D.4 |

**Definition of Done:**
- All NFR categories covered
- Each NFR has measurable target or success criteria
- NFR align with project constraints
- Reviewed and approved

---

### Part 3A: Architecture Model (Assigned: Minh)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T3A.1 | Design 3-tier architecture diagram | Minh | 3 | Not Started | - |
| T3A.2 | Document component interactions | Minh | 2 | Not Started | T3A.1 |
| T3A.3 | Document technology choices per layer | Minh | 1 | Not Started | T3A.1 |

**Definition of Done:**
- Architecture diagram clearly shows frontend, backend, database layers
- Component interactions documented
- Technology stack specified

---

### Part 3B: Entity Relationship Diagram (Assigned: Minh)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T3B.1 | Design ERD with all entities | Minh | 4 | Not Started | T2B.6 |
| T3B.2 | **FIX: Add Skills entity with cvID FK** | Minh | 1 | Not Started | T3B.1 |
| T3B.3 | **FIX: Rename email to contactEmail in PersonalInfo** | Minh | 0.5 | Not Started | T3B.1 |
| T3B.4 | **FIX: Add templateID FK to CV entity** | Minh | 0.5 | Not Started | T3B.1 |
| T3B.5 | Define all attributes and data types | Minh | 2 | Not Started | T3B.1-T3B.4 |
| T3B.6 | Review ERD for consistency with use cases | Minh, Cap | 1 | Not Started | T3B.5 |

**Definition of Done:**
- ERD includes all entities: User, CV, PersonalInformation, Education, Experience, Skills, Project, Certificate, Goal, Template
- All entities have proper attributes and foreign keys
- Cardinality relationships are correct
- Fixes from consistency check applied

---

### Part 3C: Use Case Diagram (Assigned: Cap)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T3C.1 | Create use case diagram with actors | Cap | 2 | Not Started | T2B.6 |
| T3C.2 | **FIX: Associate Logout with Authenticated User** | Cap | 0.5 | Not Started | T3C.1 |
| T3C.3 | **FIX: Add Choose Template as standalone use case** | Cap | 0.5 | Not Started | T3C.1 |
| T3C.4 | Add <<include>> and <<extend>> relationships | Cap | 1 | Not Started | T3C.1-T3C.3 |
| T3C.5 | Review diagram for completeness | Cap, Quy | 1 | Not Started | T3C.4 |

**Definition of Done:**
- Diagram shows User and Authenticated User actors
- All P0 use cases represented
- Relationships (include/extend) correct
- Fixes from consistency check applied

---

### Part 3D: Class Diagram (Assigned: Minh, Duc)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T3D.1 | Design class diagram for model layer | Minh | 3 | Not Started | T3B.6 |
| T3D.2 | Add service and controller classes | Duc | 2 | Not Started | T3D.1 |
| T3D.3 | **FIX: Add Skill class** | Minh | 0.5 | Not Started | T3D.1 |
| T3D.4 | **FIX: Add complete CRUD methods for all entities** | Duc | 2 | Not Started | T3D.1 |
| T3D.5 | **FIX: Clarify export responsibility (CV vs ExportService)** | Minh | 1 | Not Started | T3D.2 |
| T3D.6 | Review class diagram for consistency | Minh, Duc, Quy | 1 | Not Started | T3D.3-T3D.5 |

**Definition of Done:**
- Class diagram shows all model classes matching ERD
- Service and controller classes included
- Methods and relationships defined
- Export responsibility clarified
- Fixes from consistency check applied

---

### Part 3E: Sequence Diagrams (Assigned: Minh, Duc)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T3E.1 | Create sequence diagram for "Load & Edit CV" | Duc | 3 | Not Started | T3D.6 |
| T3E.2 | **FIX: Update endpoint to PUT /cv/{id} with auth token and ownership check** | Duc | 1 | Not Started | T3E.1 |
| T3E.3 | Create sequence diagram for "Export CV" | Minh | 3 | Not Started | T3D.6 |
| T3E.4 | **FIX: Add validation, template loading, auth+ownership checks to export** | Minh | 1 | Not Started | T3E.3 |
| T3E.5 | Create sequence diagram for "Login" | Duc | 2 | Not Started | T3D.6 |
| T3E.6 | Review all sequence diagrams | Minh, Duc, Quy | 1 | Not Started | T3E.2, T3E.4, T3E.5 |

**Definition of Done:**
- At least 3 sequence diagrams covering key flows
- Diagrams show all interactions between frontend, backend, database
- Auth and ownership checks documented
- Fixes from consistency check applied

---

### Part 4A: User Manual Outline (Assigned: Khang)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T4A.1 | Create user manual structure | Khang | 2 | Not Started | T2B.6 |
| T4A.2 | Write getting started section | Khang | 2 | Not Started | T4A.1 |
| T4A.3 | Document each feature with screenshots placeholders | Khang | 4 | Not Started | T4A.1 |
| T4A.4 | Add troubleshooting and FAQ section | Khang | 2 | Not Started | T4A.3 |
| T4A.5 | Review manual for clarity | Khang, Cap | 1 | Not Started | T4A.4 |

**Definition of Done:**
- Manual outline covers all P0 features
- Steps are clear and actionable
- Screenshot placeholders added
- Reviewed for clarity

---

### Part 4B: Test Structure (Assigned: Khang)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| T4B.1 | Define test case template | Khang | 1 | Not Started | - |
| T4B.2 | Create test cases for authentication | Khang | 2 | Not Started | T2B.1, T4B.1 |
| T4B.3 | Create test cases for CV CRUD operations | Khang | 3 | Not Started | T2B.2, T4B.1 |
| T4B.4 | Create test cases for validation | Khang | 2 | Not Started | T2B.4, T4B.1 |
| T4B.5 | Create test cases for export | Khang | 2 | Not Started | T2B.3, T4B.1 |
| T4B.6 | Document test execution plan | Khang | 1 | Not Started | T4B.2-T4B.5 |

**Definition of Done:**
- Test case template defined
- Test cases cover all P0 use cases
- Test cases include expected results
- Execution plan documented

---

### Prototypes (All Members - 2 per person)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| TP.1 | Quy: Create 2 prototypes with before/after based on feedback | Quy | 4 | Not Started | - |
| TP.2 | Minh: Create 2 prototypes with before/after based on feedback | Minh | 4 | Not Started | - |
| TP.3 | Cap: Create 2 prototypes with before/after based on feedback | Cap | 4 | Not Started | - |
| TP.4 | Duc: Create 2 prototypes with before/after based on feedback | Duc | 4 | Not Started | - |
| TP.5 | Kiet: Create 2 prototypes with before/after based on feedback | Kiet | 4 | Not Started | - |
| TP.6 | Khang: Create 2 prototypes with before/after based on feedback | Khang | 4 | Not Started | - |
| TP.7 | Document prototype change log with peer feedback mapping | All | 2 | Not Started | TP.1-TP.6 |

**Definition of Done:**
- Each member has 2 prototypes (before and after)
- Change log documents feedback received and changes made
- All prototypes included in report

---

### Report Integration and Review (Assigned: Quy)

| Task ID | Task Description | Owner | Estimate (hrs) | Status | Dependencies |
|---------|------------------|-------|----------------|--------|--------------|
| TR.1 | Integrate all parts into single document | Quy | 3 | Not Started | All previous tasks |
| TR.2 | Create traceability matrix (US → UC → FR/NFR) | Quy | 2 | Not Started | T2A.4, T2B.6, T2C.4, T2D.5 |
| TR.3 | Format document in academic style | Quy | 2 | Not Started | TR.1 |
| TR.4 | Proofread and check for consistency | All | 2 | Not Started | TR.3 |
| TR.5 | Create submission checklist | Quy | 1 | Not Started | TR.4 |
| TR.6 | Final team review meeting | All | 1 | Not Started | TR.4 |

**Definition of Done:**
- All parts integrated
- Traceability matrix complete (no orphans)
- Document formatted consistently
- All diagrams included
- Submission checklist complete
- Report ready for submission

---

## Sprint Planning Summary

**Total Estimated Hours:** ~130 hours (distributed across 6 team members over 2 weeks)  
**Sprint Capacity:** ~160 hours (assuming 20 hours per person per week for 2 weeks, accounting for other commitments)

**Risk Factors:**
- Consistency check fixes may reveal more issues
- Diagram tools learning curve
- Coordination across multiple team members

**Mitigation:**
- Daily standup meetings (15 min)
- Clear ownership and dependencies documented
- Buffer time for review and integration
- Early identification of issues through peer review
