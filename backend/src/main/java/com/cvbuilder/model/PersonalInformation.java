package com.cvbuilder.model;

import jakarta.persistence.*;

/**
 * PersonalInformation entity - stores personal details section
 * Used in US3 Edit Personal Info
 * FIX: contactEmail renamed to avoid confusion with User.email
 */
@Entity
@Table(name = "personal_information")
public class PersonalInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "cv_id", nullable = false)
    private CV cv;

    private String fullName;
    
    @Column(name = "contact_email")  // FIX: Renamed from email
    private String contactEmail;
    
    private String phone;
    private String address;
    private String linkedIn;
    private String portfolio;

    // Getters and setters
}
