package com.cvbuilder.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Project entity - stores project entries
 */
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cv_id", nullable = false)
    private CV cv;

    private String projectName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String technologies;

    // Getters and setters
}
