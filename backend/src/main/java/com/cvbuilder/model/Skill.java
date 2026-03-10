package com.cvbuilder.model;

import jakarta.persistence.*;

/**
 * Skill entity - stores skills (UC8, US6)
 * FIX: Added missing Skills entity from ERD
 */
@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cv_id", nullable = false)
    private CV cv;

    private String skillName;
    private String proficiencyLevel;  // e.g., Beginner, Intermediate, Advanced, Expert

    // Getters and setters
}
