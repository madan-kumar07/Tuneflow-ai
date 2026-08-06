package com.tuneflow.backend.service;

import com.tuneflow.backend.dto.AuthResponse;
import com.tuneflow.backend.dto.LoginRequest;
import com.tuneflow.backend.dto.RegisterRequest;
import com.tuneflow.backend.entity.Role;
import com.tuneflow.backend.entity.User;
import com.tuneflow.backend.repository.RoleRepository;
import com.tuneflow.backend.repository.UserRepository;
import com.tuneflow.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {

    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already exists");
    }

    Role role = roleRepository
            .findByName("ROLE_USER")
            .orElseThrow(() ->
                    new RuntimeException("ROLE_USER not found"));

    User user = new User();

    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPassword(
            passwordEncoder.encode(request.getPassword())
    );
    user.setRole(role);

    userRepository.save(user);

    String token = jwtService.generateToken(user.getEmail());

    return new AuthResponse(
            token,
            user.getEmail(),
            user.getRole().getName()
    );
}

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().getName()
        );
    }
}