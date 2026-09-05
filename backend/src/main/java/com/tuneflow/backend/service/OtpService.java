package com.tuneflow.backend.service;

import com.tuneflow.backend.dto.RegisterRequest;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;

    private static final long OTP_EXPIRY_MINUTES = 5;

    private static final long RESEND_COOLDOWN_SECONDS = 60;

    private final SecureRandom secureRandom = new SecureRandom();

    private final EmailService emailService;

    private final Map<String, OtpData> otpStore =
            new ConcurrentHashMap<>();

    private final Map<String, PendingRegistration> pendingRegistrations =
            new ConcurrentHashMap<>();

    public OtpService(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Starts registration.
     *
     * The user details are temporarily kept in memory.
     * The actual database user is created only after OTP verification.
     */
    public void startRegistration(RegisterRequest request) {

        String email = normalizeEmail(request.getEmail());

        validateResendCooldown(email);

        String otp = generateOtp();

        PendingRegistration pendingRegistration =
                new PendingRegistration(
                        request.getFullName(),
                        email,
                        request.getPassword()
                );

        pendingRegistrations.put(email, pendingRegistration);

        otpStore.put(
                email,
                new OtpData(
                        otp,
                        Instant.now(),
                        Instant.now().plus(Duration.ofMinutes(OTP_EXPIRY_MINUTES))
                )
        );

        emailService.sendOtpEmail(email, otp);
    }

    /**
     * Sends OTP for an already pending registration.
     */
    public void sendOtp(String email) {

        email = normalizeEmail(email);

        PendingRegistration pending =
                pendingRegistrations.get(email);

        if (pending == null) {
            throw new RuntimeException(
                    "No pending registration found for this email"
            );
        }

        validateResendCooldown(email);

        String otp = generateOtp();

        otpStore.put(
                email,
                new OtpData(
                        otp,
                        Instant.now(),
                        Instant.now().plus(Duration.ofMinutes(OTP_EXPIRY_MINUTES))
                )
        );

        emailService.sendOtpEmail(email, otp);
    }

    /**
     * Verifies OTP and returns pending registration data.
     */
    public PendingRegistration verifyOtp(String email, String otp) {

        email = normalizeEmail(email);

        OtpData otpData = otpStore.get(email);

        if (otpData == null) {
            throw new RuntimeException(
                    "OTP not found. Please request a new OTP."
            );
        }

        if (Instant.now().isAfter(otpData.expiresAt())) {

            otpStore.remove(email);

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }

        if (!otpData.otp().equals(otp)) {
            throw new RuntimeException(
                    "Invalid OTP. Please check the code and try again."
            );
        }

        PendingRegistration pending =
                pendingRegistrations.get(email);

        if (pending == null) {
            throw new RuntimeException(
                    "Registration session expired. Please register again."
            );
        }

        otpStore.remove(email);
        pendingRegistrations.remove(email);

        return pending;
    }

    public PendingRegistration getPendingRegistration(String email) {

        return pendingRegistrations.get(
                normalizeEmail(email)
        );
    }

    private void validateResendCooldown(String email) {

        OtpData existingOtp = otpStore.get(email);

        if (existingOtp == null) {
            return;
        }

        long secondsSinceLastOtp =
                Duration.between(
                        existingOtp.createdAt(),
                        Instant.now()
                ).getSeconds();

        if (secondsSinceLastOtp < RESEND_COOLDOWN_SECONDS) {

            long remaining =
                    RESEND_COOLDOWN_SECONDS - secondsSinceLastOtp;

            throw new RuntimeException(
                    "Please wait " + remaining +
                    " seconds before requesting another OTP."
            );
        }
    }

    private String generateOtp() {

        int otp =
                secureRandom.nextInt(900000) + 100000;

        return String.valueOf(otp);
    }

    private String normalizeEmail(String email) {

        return email.trim().toLowerCase();
    }

    private record OtpData(
            String otp,
            Instant createdAt,
            Instant expiresAt
    ) {
    }

    public record PendingRegistration(
            String fullName,
            String email,
            String password
    ) {
    }
}