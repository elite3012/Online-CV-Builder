package com.cvbuilder.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Education entity - stores education entries (UC9, US4)
 */
@Entity
@Table(name = "education")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cv_id", nullable = false)
    private CV cv;

    private String institution;
    private String degree;
    private String fieldOfStudy;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;

    // Getters and setters
}
