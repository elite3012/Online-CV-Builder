package com.cvbuilder.model;

import jakarta.persistence.*;

/**
 * Template entity - stores CV template definitions (UC5A, US7)
 */
@Entity
@Table(name = "templates")
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
    
    private String thumbnailUrl;
    
    @Column(columnDefinition = "TEXT")
    private String layoutConfig;  // JSON or configuration for template layout

    // Getters and setters
}
