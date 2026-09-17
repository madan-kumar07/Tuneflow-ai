package com.tuneflow.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("TuneFlow AI - Email Verification OTP");

        message.setText(
                "Hi,\n\n" +
                "Welcome to TuneFlow AI! 🎵\n\n" +
                "Your email verification OTP is:\n\n" +
                otp + "\n\n" +
                "This OTP is valid for 10 minutes.\n\n" +
                "If you did not request this verification, you can safely ignore this email.\n\n" +
                "Regards,\n" +
                "TuneFlow AI Team"
        );

        mailSender.send(message);
    }

    public void sendLoginNotification(String toEmail, String userName) {

        String name = (userName != null && !userName.isBlank()) ? userName : "User";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy, hh:mm a z");
        String loginTimeStr = ZonedDateTime.now().format(formatter);

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("TuneFlow AI - New Login Detected");

        message.setText(
                "Hi " + name + ",\n\n" +
                "A successful login to your TuneFlow AI account was detected.\n\n" +
                "Login time:\n" +
                loginTimeStr + "\n\n" +
                "If you recognize this activity, no action is required.\n\n" +
                "If you did not perform this login, please change your password and secure your account.\n\n" +
                "Regards,\n" +
                "TuneFlow AI Team"
        );

        mailSender.send(message);
    }
}