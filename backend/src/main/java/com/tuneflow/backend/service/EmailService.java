package com.tuneflow.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:${MAIL_USERNAME:}}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private void sendEmail(String toEmail, String subject, String text) {

        if (fromEmail == null || fromEmail.isBlank()) {
            throw new IllegalStateException(
                    "MAIL_FROM or MAIL_USERNAME is not configured"
            );
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);

            log.info("Email sent successfully via SMTP to {}", toEmail);

        } catch (Exception e) {
            log.error(
                    "SMTP email failed. to={}, from={}",
                    toEmail,
                    fromEmail,
                    e
            );

            throw new IllegalStateException(
                    "Unable to send email via SMTP",
                    e
            );
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
