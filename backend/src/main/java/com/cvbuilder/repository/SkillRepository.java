package com.cvbuilder.repository;

import com.cvbuilder.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Skill Repository - Data access for Skill entity (UC8, US6)
 */
@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByCvId(Long cvId);
}
