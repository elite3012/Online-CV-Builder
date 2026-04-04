package com.cvbuilder.repository;

import com.cvbuilder.model.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
/**
 * CV Repository - Data access for CV entity
 * Includes ownership queries
 */
@Repository
public interface CVRepository extends JpaRepository<CV, Long> {
    List<CV> findByUserId(Long userId);
    Optional<CV> findByIdAndUserId(Long id, Long userId);
}
