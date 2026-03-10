# Non-Functional Requirements (NFR)

## NFR1: Performance

**NFR1.1** The system shall load the dashboard page within 2 seconds on a standard broadband connection  
**NFR1.2** CV editor shall respond to user input within 500ms  
**NFR1.3** CV preview generation shall complete within 3 seconds  
**NFR1.4** PDF/DOCX export shall complete within 5 seconds for a standard-length CV  
**NFR1.5** The system shall support at least 50 concurrent users without performance degradation

**Measurement:**
- Response time monitoring using browser developer tools
- Load testing with simulated concurrent users
- Performance profiling during development

---

## NFR2: Usability

**NFR2.1** The user interface shall be intuitive and require no training for basic operations  
**NFR2.2** The system shall provide clear navigation between all major features  
**NFR2.3** Error messages shall be clear, specific, and actionable  
**NFR2.4** The system shall provide visual feedback for all user actions (loading states, success/error messages)  
**NFR2.5** The CV editor shall use familiar UI patterns (forms, buttons, modals)

**Measurement:**
- User testing with target audience (job seekers)
- Task completion rate and time
- User satisfaction surveys
- Usability heuristics evaluation

---

## NFR3: Reliability

**NFR3.1** The system shall have an uptime of at least 95% during demo period  
**NFR3.2** The system shall handle errors gracefully without crashing  
**NFR3.3** The system shall prevent data loss through auto-save or explicit save prompts  
**NFR3.4** The system shall recover from database connection failures  
**NFR3.5** The system shall log errors for debugging purposes

**Measurement:**
- Uptime monitoring
- Error rate tracking
- Data loss incident count
- Recovery time measurement

---

## NFR4: Security

**NFR4.1** User passwords shall be hashed using bcrypt or similar strong hashing algorithm  
**NFR4.2** The system shall use JWT tokens for authentication with appropriate expiration  
**NFR4.3** The system shall enforce ownership checks: users can only access/modify their own CVs  
**NFR4.4** The system shall protect against common web vulnerabilities (SQL injection, XSS, CSRF)  
**NFR4.5** The system shall use HTTPS in production environment  
**NFR4.6** The system shall not log sensitive data (passwords, tokens)

**Measurement:**
- Security audit checklist
- Penetration testing results
- Code review for security best practices
- OWASP Top 10 compliance check

---

## NFR5: Maintainability

**NFR5.1** Code shall follow consistent naming conventions and formatting  
**NFR5.2** Backend shall use layered architecture (Controller, Service, Repository)  
**NFR5.3** Frontend shall use component-based architecture  
**NFR5.4** Code shall include comments for complex logic  
**NFR5.5** The system shall have separation of concerns (business logic separate from presentation)  
**NFR5.6** Database schema shall use proper foreign keys and constraints

**Measurement:**
- Code review quality scores
- Cyclomatic complexity metrics
- Code duplication percentage
- Documentation completeness

---

## NFR6: Scalability

**NFR6.1** The database schema shall support multiple CVs per user  
**NFR6.2** The system architecture shall allow easy addition of new CV sections  
**NFR6.3** The template system shall allow easy addition of new templates  
**NFR6.4** The system shall handle CVs with up to 10 education entries, 10 experience entries, and 20 skills without performance issues

**Measurement:**
- Load testing with large datasets
- Database query performance analysis
- Code extensibility assessment

---

## NFR7: Compatibility

**NFR7.1** The system shall work on modern browsers: Chrome (latest), Firefox (latest), Edge (latest)  
**NFR7.2** The system shall be responsive and usable on desktop (1920x1080) and laptop (1366x768) screens  
**NFR7.3** Exported PDFs shall be compatible with common PDF readers  
**NFR7.4** Exported DOCX files shall be compatible with Microsoft Word 2016+

**Measurement:**
- Cross-browser testing results
- Responsive design testing on different screen sizes
- Export file compatibility testing

---

## NFR8: Portability

**NFR8.1** The backend shall be deployable on any platform supporting Java 17+  
**NFR8.2** The frontend shall be deployable on any static web server  
**NFR8.3** The system shall use SQLite for easy local deployment and testing  
**NFR8.4** Configuration shall be externalized (application.properties, environment variables)

**Measurement:**
- Successful deployment on at least 2 different environments
- Setup time documentation
- Dependency documentation completeness

---

## NFR9: Testability

**NFR9.1** Backend services shall have unit test coverage of at least 60%  
**NFR9.2** Critical paths (authentication, CV save) shall have integration tests  
**NFR9.3** API endpoints shall be testable independently using tools like Postman  
**NFR9.4** The system shall support automated testing

**Measurement:**
- Code coverage reports
- Number of unit tests vs. total methods
- Integration test success rate

---

## NFR10: Cost

**NFR10.1** The system shall use only free and open-source libraries  
**NFR10.2** The system shall not require paid API subscriptions  
**NFR10.3** The system shall be deployable without incurring hosting costs (can run locally)  
**NFR10.4** Development tools shall be free (VS Code, community editions)

**Measurement:**
- Audit of all dependencies for licensing
- Verification of zero external API costs
- Hosting cost calculation (should be $0 for demo)
