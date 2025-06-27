package com.upiiz.ProyectoFinal.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.mail.subject.prefix:[UPIIZ] }")
    private String subjectPrefix;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String text) throws Exception {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subjectPrefix + subject);
            message.setText(text);

            mailSender.send(message);
        } catch (Exception e) {
            throw new Exception("Error al enviar el correo: " + e.getMessage());
        }
    }
    public void enviarCorreoMasivo(List<String> destinatarios, String asunto, String mensaje) throws Exception {
        try {
            if (destinatarios == null || destinatarios.isEmpty()) {
                throw new Exception("No hay destinatarios especificados");
            }

            for (String destinatario : destinatarios) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(destinatario);
                message.setSubject(subjectPrefix + asunto);
                message.setText(mensaje);
                mailSender.send(message);

                // Pequeña pausa para evitar ser marcado como spam
                Thread.sleep(1000);
            }
        } catch (Exception e) {
            throw new Exception("Error en envío masivo: " + e.getMessage());
        }
    }

}