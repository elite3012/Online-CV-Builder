package com.cvbuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * User entity - represents registered users
 * Used in UC1 Register, UC2 Login
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;  // Login email

    @Column(nullable = false)
    private String password;  // Hashed password

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Getters and setters
}
