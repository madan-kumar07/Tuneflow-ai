package com.tuneflow.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate;
    private final JavaMailSender mailSender;

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${app.mail.from:onboarding@resend.dev}")
    private String fromEmail;

    @Value("${resend.from.email:onboarding@resend.dev}")
    private String resendFromEmail;

    public EmailService(RestTemplate restTemplate, ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.restTemplate = restTemplate;
        this.mailSender = mailSenderProvider.getIfAvailable();
    }

    public boolean sendOtpEmail(String toEmail, String otp) {
        log.info("\n=================================================\n=== GENERATED OTP FOR {}: [{}] ===\n=================================================", toEmail, otp);

        String subject = "TuneFlow AI - Email Verification OTP";

        String textContent =
                "Hi,\n\n" +
                "Welcome to TuneFlow AI! 🎵\n\n" +
                "Your email verification OTP is: " + otp + "\n\n" +
                "This OTP is valid for 5 minutes.\n\n" +
                "If you did not request this verification, please ignore this email.\n\n" +
                "Regards,\n" +
                "TuneFlow AI Team";

        String htmlContent =
                "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; background-color: #0f172a; color: #f8fafc; border-radius: 8px;\">" +
                "<h2 style=\"color: #8b5cf6; margin-bottom: 20px;\">TuneFlow AI 🎵</h2>" +
                "<p>Hi,</p>" +
                "<p>Welcome to TuneFlow AI! Your email verification OTP is:</p>" +
                "<div style=\"background-color: #1e1b4b; padding: 16px; border-radius: 6px; text-align: center; margin: 20px 0;\">" +
                "<span style=\"font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #a78bfa;\">" + otp + "</span>" +
                "</div>" +
                "<p>This OTP is valid for <strong>5 minutes</strong>.</p>" +
                "<p style=\"color: #94a3b8; font-size: 14px; margin-top: 30px;\">If you did not request this verification, you can safely ignore this email.</p>" +
                "<hr style=\"border: none; border-top: 1px solid #334155; margin: 20px 0;\" />" +
                "<p style=\"color: #64748b; font-size: 12px;\">Regards,<br/>TuneFlow AI Team</p>" +
                "</div>";

        // Strategy 1: Try Brevo HTTP REST API (Best for Render free tier, sends from Gmail to any recipient)
        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            try {
                sendEmailViaBrevo(toEmail, subject, textContent, htmlContent);
                log.info("OTP email delivered successfully to {} via Brevo REST API", toEmail);
                return true;
            } catch (Exception e) {
                log.warn("Brevo REST API delivery to {} failed: {}. Falling back to next provider...", toEmail, e.getMessage());
            }
        }

        // Strategy 2: Try Resend REST API
        if (resendApiKey != null && !resendApiKey.isBlank()) {
            try {
                sendEmailViaResend(toEmail, subject, textContent, htmlContent);
                log.info("OTP email delivered successfully to {} via Resend REST API", toEmail);
                return true;
            } catch (Exception e) {
                log.warn("Resend API delivery to {} failed: {}. OTP [{}] is saved in session.", toEmail, e.getMessage(), otp);
            }
        }

        // Strategy 3: Try SMTP (Gmail)
        if (mailSender != null && mailUsername != null && !mailUsername.isBlank()) {
            try {
                sendEmailViaSmtp(toEmail, subject, textContent);
                log.info("OTP email delivered successfully to {} via Gmail SMTP", toEmail);
                return true;
            } catch (Exception e) {
                log.warn("SMTP delivery to {} failed: {}.", toEmail, e.getMessage());
            }
        }

        log.warn("Could not deliver email to {}. Generated OTP [{}] is active in memory session.", toEmail, otp);
        return false;
    }

    public void sendLoginNotification(String toEmail, String userName) {
        String name = (userName != null && !userName.isBlank()) ? userName : "User";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy, hh:mm a z");
        String loginTimeStr = ZonedDateTime.now().format(formatter);

        String subject = "TuneFlow AI - New Login Detected";

        String textContent =
                "Hi " + name + ",\n\n" +
                "A successful login to your TuneFlow AI account was detected.\n\n" +
                "Login time:\n" + loginTimeStr + "\n\n" +
                "If you recognize this activity, no action is required.\n\n" +
                "If you did not perform this login, please change your password and secure your account.\n\n" +
                "Regards,\n" +
                "TuneFlow AI Team";

        String htmlContent =
                "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; background-color: #0f172a; color: #f8fafc; border-radius: 8px;\">" +
                "<h2 style=\"color: #8b5cf6; margin-bottom: 20px;\">TuneFlow AI 🎵</h2>" +
                "<p>Hi <strong>" + name + "</strong>,</p>" +
                "<p>A successful login to your TuneFlow AI account was detected.</p>" +
                "<p><strong>Login time:</strong> " + loginTimeStr + "</p>" +
                "<p style=\"color: #94a3b8; font-size: 14px; margin-top: 20px;\">If you recognize this activity, no action is required.</p>" +
                "<hr style=\"border: none; border-top: 1px solid #334155; margin: 20px 0;\" />" +
                "<p style=\"color: #64748b; font-size: 12px;\">Regards,<br/>TuneFlow AI Team</p>" +
                "</div>";

        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            try {
                sendEmailViaBrevo(toEmail, subject, textContent, htmlContent);
                return;
            } catch (Exception ignored) {}
        }

        if (resendApiKey != null && !resendApiKey.isBlank()) {
            try {
                sendEmailViaResend(toEmail, subject, textContent, htmlContent);
                return;
            } catch (Exception ignored) {}
        }

        if (mailSender != null && mailUsername != null && !mailUsername.isBlank()) {
            try {
                sendEmailViaSmtp(toEmail, subject, textContent);
            } catch (Exception ignored) {}
        }
    }

    private void sendEmailViaSmtp(String toEmail, String subject, String textContent) {
        SimpleMailMessage message = new SimpleMailMessage();
        String sender = (fromEmail != null && !fromEmail.isBlank()) ? fromEmail : mailUsername;
        message.setFrom(sender);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(textContent);
        mailSender.send(message);
    }

    private void sendEmailViaResend(String toEmail, String subject, String textContent, String htmlContent) {
        String formattedFrom = (resendFromEmail != null && !resendFromEmail.isBlank()) ? resendFromEmail : "onboarding@resend.dev";
        if (!formattedFrom.contains("<") && !formattedFrom.contains(">")) {
            formattedFrom = "TuneFlow AI <" + formattedFrom.trim() + ">";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey.trim());

        Map<String, Object> body = new HashMap<>();
        body.put("from", formattedFrom);
        body.put("to", List.of(toEmail.trim()));
        body.put("subject", subject);
        body.put("text", textContent);
        body.put("html", htmlContent);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                RESEND_API_URL,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        log.info("Resend API response code: {}", response.getStatusCode());
    }

    private void sendEmailViaBrevo(String toEmail, String subject, String textContent, String htmlContent) {
        String senderEmail = (mailUsername != null && !mailUsername.isBlank()) ? mailUsername : "raguvaran0234@gmail.com";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey.trim());
        headers.set("Accept", "application/json");

        Map<String, Object> senderMap = Map.of("name", "TuneFlow AI", "email", senderEmail.trim());
        Map<String, Object> recipientMap = Map.of("email", toEmail.trim());

        Map<String, Object> body = new HashMap<>();
        body.put("sender", senderMap);
        body.put("to", List.of(recipientMap));
        body.put("subject", subject);
        body.put("textContent", textContent);
        body.put("htmlContent", htmlContent);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                BREVO_API_URL,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        log.info("Brevo API response code: {}", response.getStatusCode());
    }
}
