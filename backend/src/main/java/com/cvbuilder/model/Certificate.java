package com.cvbuilder.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Certificate entity - stores certification entries
 */
@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cv_id", nullable = false)
    private CV cv;

    private String certificateName;
    private String issuingOrganization;
    private LocalDate issueDate;
    private LocalDate expiryDate;

    // Getters and setters
}
