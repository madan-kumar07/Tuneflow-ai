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
    private final OtpService otpService;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            OtpService otpService) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.otpService = otpService;
    }

    /**
     * Start registration.
     *
     * User is NOT saved to database yet.
     * OTP is generated and sent to the user's email.
     */
    public void register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        RegisterRequest normalizedRequest =
                new RegisterRequest(
                        request.getFullName(),
                        email,
                        request.getPassword()
                );

        otpService.startRegistration(normalizedRequest);
    }

    /**
     * Complete registration after successful OTP verification.
     */
    public AuthResponse completeRegistration(
            OtpService.PendingRegistration pending) {

        String email = pending.email()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository
                .findByName("ROLE_USER")
                .orElseThrow(() ->
                        new RuntimeException("ROLE_USER not found"));

        User user = new User();

        user.setFullName(pending.fullName());
        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(
                        pending.password()
                )
        );

        user.setRole(role);

        User savedUser = userRepository.save(user);

        String token =
                jwtService.generateToken(
                        savedUser.getEmail()
                );

        return new AuthResponse(
                token,
                savedUser.getEmail(),
                savedUser.getRole().getName()
        );
    }

    /**
     * Login existing user.
     */
    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().getName()
        );
    }
}