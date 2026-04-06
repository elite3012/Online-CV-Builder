package com.cvbuilder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cvbuilder.model.Template;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
}
