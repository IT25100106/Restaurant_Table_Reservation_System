package com.restaurant.service;

import com.restaurant.model.AdminUser;
import com.restaurant.model.CustomerUser;
import com.restaurant.model.User;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public User registerCustomer(String name, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered: " + email);
        }
        CustomerUser customer = new CustomerUser(null, name, email, password);
        return userRepository.save(customer);
    }

    public User registerAdmin(String name, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered: " + email);
        }
        AdminUser admin = new AdminUser(null, name, email, password);
        return userRepository.save(admin);
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    public List<User> searchByName(String name) {
        return userRepository.findByNameContaining(name);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found for: " + email));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Incorrect password");
        }

        System.out.println("Login: " + user.display() + " | Role: " + user.getRole());
        return user;
    }


    public User updateUser(String id, String name, String email, String password) {
        User user = getUserById(id);

        if (name != null && !name.isBlank()) user.setName(name);

        if (email != null && !email.isBlank() && !email.equals(user.getEmail())) {
            if (userRepository.existsByEmail(email)) {
                throw new RuntimeException("Email already in use: " + email);
            }
            user.setEmail(email);
        }

        if (password != null && !password.isBlank()) user.setPassword(password);

        return userRepository.save(user);
    }


    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }
}
