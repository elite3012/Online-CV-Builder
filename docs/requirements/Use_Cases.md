# Use Case Specifications

## UC1: Register Account

**Use Case ID:** UC1  
**Use Case Name:** Register Account  
**Actor:** User (unauthenticated)  
**Priority:** P0 (Must Have)  
**Related User Story:** US1

### Preconditions
- User is not logged in
- User has valid email address

### Postconditions
- New user account is created
- User receives confirmation
- User can log in with new credentials

### Normal Flow
1. User navigates to registration page
2. System displays registration form
3. User enters email, password, and full name
4. User submits registration form
5. System validates input data
6. System checks email is not already registered
7. System hashes password
8. System creates new user account in database
9. System displays success message
10. System redirects to login page

### Alternative Flows
**A1: Email already exists**
- At step 6, if email already registered, system displays error message
- User can try different email or go to login page

**A2: Validation fails**
- At step 5, if validation fails, system displays specific error messages
- User corrects input and resubmits

### Exception Flows
**E1: Database error**
- System displays generic error message
- User is asked to retry

---

## UC2: Log In

**Use Case ID:** UC2  
**Use Case Name:** Log In  
**Actor:** User (unauthenticated)  
**Priority:** P0 (Must Have)  
**Related User Story:** US1

### Preconditions
- User has registered account
- User is not logged in

### Postconditions
- User is authenticated
- JWT token is generated and stored
- User is redirected to dashboard

### Normal Flow
1. User navigates to login page
2. System displays login form
3. User enters email and password
4. User submits login form
5. System validates credentials against database
6. System generates JWT token
7. System returns token to client
8. Client stores token in local storage
9. System redirects to dashboard

### Alternative Flows
**A1: Invalid credentials**
- At step 5, if credentials invalid, system displays error message
- User can retry or go to registration

---

## UC3: Create New CV

**Use Case ID:** UC3  
**Use Case Name:** Create New CV  
**Actor:** Authenticated User  
**Priority:** P0 (Must Have)  
**Related User Story:** US2

### Preconditions
- User is logged in
- User is on dashboard

### Postconditions
- New CV record is created in database
- CV is associated with user
- User is redirected to CV editor

### Normal Flow
1. User clicks "Create New CV" button
2. System prompts for CV title
3. User enters title
4. User confirms creation
5. System validates input
6. System creates CV record with user ownership
7. **Include UC5A (Choose Template)** - User selects initial template
8. System saves CV with selected template
9. System redirects to CV editor
10. System displays success message

### Alternative Flows
**A1: User cancels**
- At step 4, user can cancel and return to dashboard

---

## UC4: Edit CV Section and Save

**Use Case ID:** UC4  
**Use Case Name:** Edit CV Section and Save  
**Actor:** Authenticated User  
**Priority:** P0 (Must Have)  
**Related User Stories:** US3, US4, US5, US6

### Preconditions
- User is logged in
- User has created a CV
- User is on CV editor page

### Postconditions
- CV data is updated in database
- User sees confirmation of save

### Normal Flow
1. User navigates to specific CV section (Personal Info, Education, Experience, Skills)
2. System displays current section data
3. User modifies fields
4. System validates input in real-time (UC6)
5. User clicks "Save" button
6. System sends PUT request to `/api/cv/{id}` with auth token
7. Backend validates JWT token
8. Backend checks CV ownership (CV belongs to authenticated user)
9. Backend validates data
10. Backend updates CV section in database
11. System returns success response
12. Client displays success message

### Alternative Flows
**A1: Validation fails**
- At step 9, if validation fails, system returns error messages
- User corrects input and resubmits

**A2: Ownership check fails**
- At step 8, if CV doesn't belong to user, system returns 403 Forbidden
- User is redirected to dashboard

**A3: Autosave**
- System can automatically save changes after delay
- User sees "Saved" indicator

---

## UC5A: Choose Template

**Use Case ID:** UC5A  
**Use Case Name:** Choose Template  
**Actor:** Authenticated User  
**Priority:** P0 (Must Have)  
**Related User Story:** US7

### Preconditions
- User is logged in
- User has created a CV or is creating new CV

### Postconditions
- Template is selected for CV
- CV.templateID is updated in database

### Normal Flow
1. User clicks "Choose Template" button
2. System displays template gallery with thumbnails
3. System loads available templates from database
4. User browses templates
5. User selects a template
6. System updates CV with selected template ID
7. System saves change to database
8. System displays confirmation
9. Preview updates with new template

---

## UC5B: Preview CV

**Use Case ID:** UC5B  
**Use Case Name:** Preview CV  
**Actor:** Authenticated User  
**Priority:** P0 (Must Have)  
**Related User Story:** US8

### Preconditions
- User is logged in
- User has created a CV with data
- CV has template selected

### Postconditions
- User sees formatted CV preview

### Normal Flow
1. User clicks "Preview" button
2. System retrieves CV data from database
3. System validates CV data
4. System loads template using CV.templateID
5. System applies template layout/styling to CV data
6. System renders formatted preview
7. User views preview in modal or separate view

### Alternative Flows
**A1: Validation errors**
- At step 3, if CV has validation errors, system displays warnings
- User can still view preview or return to edit

---

## UC6: Validation and Clear Error Messages

**Use Case ID:** UC6  
**Use Case Name:** Validation and Clear Error Messages  
**Actor:** User (any state)  
**Assigned to:** Khang  
**Priority:** P0 (Must Have)  
**Related User Story:** US12

### Preconditions
- User is interacting with any form or input

### Postconditions
- User receives immediate feedback on input validity

### Normal Flow
1. User enters data in input field
2. System validates input in real-time
3. For invalid input, system displays error message near field
4. Error message is clear and actionable
5. For valid input, error message is removed
6. On form submission, system performs full validation
7. System displays summary of errors if any

### Validation Rules
- **Email**: Must match email format
- **Required fields**: Must not be empty
- **Dates**: Start date must be before end date
- **Password**: Minimum 8 characters

---

## UC7: ATS Checklist

**Use Case ID:** UC7  
**Use Case Name:** ATS Checklist  
**Actor:** Authenticated User  
**Assigned to:** Khang  
**Priority:** P2 (Nice to Have)  
**Related User Story:** US13

### Preconditions
- User is logged in
- User has created a CV with data

### Postconditions
- User receives ATS checklist with suggestions

### Normal Flow
1. User clicks "Check ATS" button
2. System analyzes CV using rule-based logic
3. System checks for:
   - Contact information completeness
   - Keyword density
   - Standard section headings
   - Date formatting
   - File format compatibility
4. System generates checklist report
5. System displays report with pass/fail items
6. User views suggestions for improvement

---

## UC8: Edit Skills

**Use Case ID:** UC8  
**Use Case Name:** Edit Skills  
**Actor:** Authenticated User  
**Assigned to:** Kiet  
**Priority:** P0 (Must Have)  
**Related User Story:** US6

### Preconditions
- User is logged in
- User has created a CV
- User is on CV editor page

### Postconditions
- Skills are added/updated/deleted in database

### Normal Flow
1. User navigates to Skills section
2. System displays current skills list
3. User clicks "Add Skill" button
4. System displays skill input form
5. User enters skill name and proficiency level
6. User saves skill
7. System validates input
8. System saves skill to database with CV association
9. System displays updated skills list

### Alternative Flows
**A1: Edit existing skill**
- User clicks edit on existing skill
- User modifies skill data
- System saves changes

**A2: Delete skill**
- User clicks delete on skill
- System confirms deletion
- System removes skill from database

---

## UC9: Edit Education

**Use Case ID:** UC9  
**Use Case Name:** Edit Education  
**Actor:** Authenticated User  
**Assigned to:** Kiet  
**Priority:** P0 (Must Have)  
**Related User Story:** US4

### Preconditions
- User is logged in
- User has created a CV
- User is on CV editor page

### Postconditions
- Education entries are added/updated/deleted in database

### Normal Flow
1. User navigates to Education section
2. System displays current education entries
3. User clicks "Add Education" button
4. System displays education input form
5. User enters: institution, degree, field of study, start date, end date, description
6. User saves education entry
7. System validates input (dates, required fields)
8. System saves education to database with CV association
9. System displays updated education list in chronological order

### Alternative Flows
**A1: Edit existing education**
- User clicks edit on existing entry
- User modifies education data
- System saves changes

**A2: Delete education**
- User clicks delete on entry
- System confirms deletion
- System removes education from database
