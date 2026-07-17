package com.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.demo.dto.RegisterRequest;
import com.demo.entity.User;
import com.demo.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ==========================
    // Register User
    // ==========================
    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        return "Registration Successful";
    }

    // ==========================
    // Add User
    // ==========================
    public User saveUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    // ==========================
    // Get All Users
    // ==========================
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ==========================
    // Get User By ID
    // ==========================
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Get User By Email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ==========================
    // Delete User
    // ==========================
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}