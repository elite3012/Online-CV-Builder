package com.cvbuilder.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cvbuilder.model.CV;
import com.cvbuilder.model.Template;
import com.cvbuilder.model.User;
import com.cvbuilder.repository.CVRepository;
import com.cvbuilder.repository.TemplateRepository;
import com.cvbuilder.repository.UserRepository;

@Service
public class CVService {

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TemplateRepository templateRepository;

    @Transactional
    public CV createCV(Long templateId, String summary, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        CV cv = new CV();
        cv.setUser(user);
        cv.setTemplate(template);
        cv.setSummary(summary);
        cv.setCreatedAt(LocalDateTime.now());
        cv.setUpdatedAt(LocalDateTime.now());

        return cvRepository.save(cv);
    }

    public List<CV> getAllCVsForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cvRepository.findByUserId(user.getId());
    }

    public CV getCVByIdAndOwner(Long cvId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cvRepository.findByIdAndUserId(cvId, user.getId())
                .orElseThrow(() -> new RuntimeException("CV not found or unauthorized access"));
    }

    @Transactional
    public CV updateCV(Long cvId, com.cvbuilder.controller.CVController.UpdateCVRequest request, String userEmail) {
        CV cv = getCVByIdAndOwner(cvId, userEmail);
        
        if (request.title != null && request.summary == null) {
            cv.setSummary(request.title); // Fallback for frontend compatibility
        }
        if (request.summary != null) {
            cv.setSummary(request.summary);
        }
        
        if (request.personalInformation != null) {
            request.personalInformation.setCv(cv);
            cv.setPersonalInformation(request.personalInformation);
        }
        
        if (request.educations != null) {
            cv.getEducations().clear();
            request.educations.forEach(edu -> {
                edu.setCv(cv);
                cv.getEducations().add(edu);
            });
        }
        
        if (request.experiences != null) {
            cv.getExperiences().clear();
            request.experiences.forEach(exp -> {
                exp.setCv(cv);
                cv.getExperiences().add(exp);
            });
        }
        
        if (request.projects != null) {
            cv.getProjects().clear();
            request.projects.forEach(proj -> {
                proj.setCv(cv);
                cv.getProjects().add(proj);
            });
        }
        
        if (request.certificates != null) {
            cv.getCertificates().clear();
            request.certificates.forEach(cert -> {
                cert.setCv(cv);
                cv.getCertificates().add(cert);
            });
        }
        
        if (request.skills != null) {
            cv.getSkills().clear();
            request.skills.forEach(skill -> {
                skill.setCv(cv);
                cv.getSkills().add(skill);
            });
        }
        
        cv.setUpdatedAt(LocalDateTime.now());
        return cvRepository.save(cv);
    }

    @Transactional
    public void deleteCV(Long cvId, String userEmail) {
        CV cv = getCVByIdAndOwner(cvId, userEmail);
        cvRepository.delete(cv);
    }
}