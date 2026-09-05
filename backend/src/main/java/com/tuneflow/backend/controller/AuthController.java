package com.tuneflow.backend.controller;

import com.tuneflow.backend.dto.AuthResponse;
import com.tuneflow.backend.dto.LoginRequest;
import com.tuneflow.backend.dto.RegisterRequest;
import com.tuneflow.backend.dto.SendOtpRequest;
import com.tuneflow.backend.dto.VerifyOtpRequest;
import com.tuneflow.backend.service.AuthService;
import com.tuneflow.backend.service.OtpService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    public AuthController(
            AuthService authService,
            OtpService otpService) {

        this.authService = authService;
        this.otpService = otpService;
    }

    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(request);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message",
                        "Registration started. OTP sent to your email."
                )
        );
    }

    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    // =========================================================
    // SEND / RESEND OTP
    // =========================================================

    @PostMapping("/otp/send")
    public ResponseEntity<?> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        otpService.sendOtp(request.getEmail());

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message",
                        "OTP sent successfully to your email."
                )
        );
    }

    // =========================================================
    // VERIFY OTP
    // =========================================================

    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        OtpService.PendingRegistration pending =
                otpService.verifyOtp(
                        request.getEmail(),
                        request.getOtp()
                );

        AuthResponse response =
                authService.completeRegistration(pending);

        return ResponseEntity.ok(response);
    }
}