package com.cvbuilder.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Experience entity - stores work experience entries (US5)
 */
@Entity
@Table(name = "experience")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cv_id", nullable = false)
    private CV cv;

    private String company;
    private String position;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;

    // Getters and setters
}
