package com.cvbuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
/**
 * CV entity - represents a CV document
 * Used in UC3 Create New CV, UC4 Edit CV
 * FIX: Must include templateID (FK) for preview/export consistency
 */
@Entity
@Data
@Table(name = "cvs")
public class CV {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // Ownership link

    @ManyToOne
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;  // FIX: Added for consistency

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Getters and setters
}
