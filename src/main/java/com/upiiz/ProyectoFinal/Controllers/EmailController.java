package com.upiiz.ProyectoFinal.Controllers;

import com.upiiz.ProyectoFinal.Models.EmailModel;
import com.upiiz.ProyectoFinal.Services.AspiranteService;
import com.upiiz.ProyectoFinal.Services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/api/email")
public class EmailController {

    private final EmailService emailService;
    private final AspiranteService aspiranteService;

    @Autowired
    public EmailController(EmailService emailService, AspiranteService aspiranteService) {
        this.emailService = emailService;
        this.aspiranteService = aspiranteService;
    }

    @PostMapping("/enviar")
    public ResponseEntity<Map<String, Object>> enviarCorreo(@RequestBody EmailModel emailData) {
        try {
            // Validación básica
            if (emailData.getEmail() == null || emailData.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "estado", 0,
                        "mensaje", "El email del destinatario es requerido"
                ));
            }

            // Enviar el correo
            emailService.sendEmail(
                    emailData.getEmail(),
                    emailData.getAsunto(),
                    emailData.getMensaje()
            );

            return ResponseEntity.ok(Map.of(
                    "estado", 1,
                    "mensaje", "Correo enviado con éxito"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "estado", 0,
                    "mensaje", "Error al enviar el correo: " + e.getMessage()
            ));
        }
    }
    @PostMapping("/enviar-masivo")
    public ResponseEntity<Map<String, Object>> enviarCorreoMasivo(
            @RequestParam String asunto,
            @RequestParam String mensaje) {
        try {
            // Obtener todos los emails de aspirantes
            List<String> emails = aspiranteService.obtenerTodosEmails();

            if (emails.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                        "estado", 0,
                        "mensaje", "No hay destinatarios disponibles"
                ));
            }

            emailService.enviarCorreoMasivo(emails, asunto, mensaje);

            return ResponseEntity.ok(Map.of(
                    "estado", 1,
                    "mensaje", "Correos enviados con éxito",
                    "total_enviados", emails.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "estado", 0,
                    "mensaje", "Error al enviar correos masivos: " + e.getMessage()
            ));
        }
    }
}
