package com.cvbuilder.service;

import com.cvbuilder.model.CV;
import com.cvbuilder.model.User;
import com.cvbuilder.model.Template;
import com.cvbuilder.repository.CVRepository;
import com.cvbuilder.repository.UserRepository;
// import com.cvbuilder.repository.TemplateRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CVService {

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private UserRepository userRepository;


    @Transactional
    public CV createCV(String title, Long templateId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Template template = templateRepository.findById(templateId)
        //        .orElseThrow(() -> new RuntimeException("Template not found"));

        CV cv = new CV();
        cv.setUser(user);
        // cv.setTemplate(template); 
        cv.setTitle(title);
        cv.setCreatedAt(LocalDateTime.now());
        cv.setUpdatedAt(LocalDateTime.now());
        
        // System initializes default sections here if applicable
        
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
    public CV updateCVTitle(Long cvId, String newTitle, String userEmail) {
        CV cv = getCVByIdAndOwner(cvId, userEmail); 
        cv.setTitle(newTitle);
        cv.setUpdatedAt(LocalDateTime.now());
        
        return cvRepository.save(cv);
    }

    @Transactional
    public void deleteCV(Long cvId, String userEmail) {
        CV cv = getCVByIdAndOwner(cvId, userEmail);
        cvRepository.delete(cv);
    }
}