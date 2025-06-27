package com.upiiz.ProyectoFinal.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@Controller
@RequestMapping("/registro")
public class RegistroController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping
    public String mostrarFormularioRegistro() {
        return "registro";
    }

    @PostMapping
    public String guardarAspirante(
        @RequestParam String nombreAspirante,
        @RequestParam String telefonoAspirante,
        @RequestParam String emailAspirante,
        @RequestParam Integer carreraId
    ){
        String sql = "INSERT INTO aspirantes (nombreAspirante, telefonoAspirante, emailAspirante, carreraId) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, nombreAspirante, telefonoAspirante, emailAspirante, carreraId);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("equipo5tdwadm@gmail.com"); 
        message.setSubject("Nuevo registro de aspirante");
        message.setText("Se ha registrado un nuevo aspirante:\nNombre: " + nombreAspirante +
                        "\nTeléfono: " + telefonoAspirante +
                        "\nEmail: " + emailAspirante +
                        "\nCarrera ID: " + carreraId);
        mailSender.send(message);

        return "redirect:/registro?exito";
    }

    @PostMapping("/verificar-email")
    @ResponseBody
    public Map<String, Boolean> verificarEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean existe = false;
        if (email != null && !email.isEmpty()) {
            existe = existeEmail(email);
        }
        return Collections.singletonMap("existe", existe);
    }

    private boolean existeEmail(String email) {
    String sql = "SELECT COUNT(*) FROM aspirantes WHERE emailAspirante = ?";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
    return count != null && count > 0;
}
}

