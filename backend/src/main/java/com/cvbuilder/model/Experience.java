package com.cvbuilder.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "experience")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cv_id")
    @JsonIgnore
    private CV cv;

    private String company;
    @Column(name = "job_title")
    private String jobTitle;
    @Column(name = "experience_start_date")
    private String experienceStartDate;
    @Column(name = "experience_end_date")
    private String experienceEndDate;
    @Column(columnDefinition = "TEXT")
    private String description;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public CV getCv() { return cv; }
    public void setCv(CV cv) { this.cv = cv; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getExperienceStartDate() { return experienceStartDate; }
    public void setExperienceStartDate(String experienceStartDate) { this.experienceStartDate = experienceStartDate; }
    public String getExperienceEndDate() { return experienceEndDate; }
    public void setExperienceEndDate(String experienceEndDate) { this.experienceEndDate = experienceEndDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
