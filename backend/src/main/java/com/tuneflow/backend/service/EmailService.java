package com.tuneflow.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${app.mail.from:onboarding@resend.dev}")
    private String fromEmail;

    public EmailService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
    }

    private void sendEmail(String toEmail, String subject, String text) {

        if (resendApiKey == null || resendApiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY is not configured");
        }

        try {
            Map<String, Object> body = Map.of(
                    "from", fromEmail,
                    "to", List.of(toEmail),
                    "subject", subject,
                    "text", text
            );

            String json = objectMapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.error(
                        "Resend email failed. status={}, response={}",
                        response.statusCode(),
                        response.body()
                );

                throw new IllegalStateException(
                        "Email delivery failed with status " + response.statusCode()
                );
            }

            log.info("Email sent successfully via Resend to {}", toEmail);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Email delivery was interrupted", e);

        } catch (Exception e) {
            throw new IllegalStateException("Unable to send email via Resend", e);
        }
    }

    public void sendOtpEmail(String toEmail, String otp) {

        sendEmail(
                toEmail,
                "TuneFlow AI - Email Verification OTP",
                "Hi,\n\n" +
                "Welcome to TuneFlow AI! 🎵\n\n" +
                "Your email verification OTP is:\n\n" +
                otp + "\n\n" +
                "This OTP is valid for 5 minutes.\n\n" +
                "If you did not request this verification, you can safely ignore this email.\n\n" +
                "Regards,\n" +
                "TuneFlow AI Team"
        );
    }

    public void sendLoginNotification(String toEmail, String userName) {

        String name = (userName != null && !userName.isBlank())
                ? userName
                : "User";

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd MMMM yyyy, hh:mm a z");

        String loginTimeStr =
                ZonedDateTime.now().format(formatter);

        sendEmail(
                toEmail,
                "TuneFlow AI - New Login Detected",
                "Hi " + name + ",\n\n" +
                "A successful login to your TuneFlow AI account was detected.\n\n" +
                "Login time:\n" +
                loginTimeStr + "\n\n" +
                "If you recognize this activity, no action is required.\n\n" +
                "If you did not perform this login, please change your password and secure your account.\n\n" +
                "Regards,\n" +
                "TuneFlow AI Team"
        );
    }
}