package com.upiiz.ProyectoFinal.Controllers;


import com.upiiz.ProyectoFinal.Services.EmailService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Controller
@RestController("/api/email")
public class EmailController {

    private EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    // Endpoint para enviar correo individual
    @PostMapping("/individual")
    public Map<String, String> sendIndividualEmail(
            @RequestParam Integer aspiranteId,
            @RequestParam String subject,
            @RequestParam String content) {

        emailService.sendIndividualEmail(aspiranteId, subject, content);

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Correo enviado exitosamente");
        return response;
    }

    // Endpoint para enviar correo masivo
    @PostMapping("/masivo")
    public Map<String, String> sendMassEmail(
            @RequestParam String subject,
            @RequestParam String content) {

        emailService.sendMassEmail(subject, content);

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Correos masivos enviados exitosamente");
        return response;
    }
}
