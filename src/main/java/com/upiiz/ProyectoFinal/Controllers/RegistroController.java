package com.upiiz.ProyectoFinal.Controllers;

import com.upiiz.ProyectoFinal.Models.CarrerasModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Collections;

@Controller
@RequestMapping("/registro")
public class RegistroController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping
    public String mostrarFormularioRegistro(Model model) {
        List<CarrerasModel> carreras = obtenerTodasCarreras();
        model.addAttribute("carreras", carreras);
        return "registro";
    }

    @PostMapping
    public String guardarAspirante(
            @RequestParam String nombreAspirante,
            @RequestParam String telefonoAspirante,
            @RequestParam String emailAspirante,
            @RequestParam Integer carreraId
    ) {
        String sql = "INSERT INTO aspirantes (nombreAspirante, telefonoAspirante, emailAspirante, carreraId) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, nombreAspirante, telefonoAspirante, emailAspirante, carreraId);

        // Obtener nombre de la carrera para el email
        String nombreCarrera = obtenerNombreCarrera(carreraId);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("equipo5tdwadm@gmail.com");
        message.setSubject("Nuevo registro de aspirante");
        message.setText("Se ha registrado un nuevo aspirante:\nNombre: " + nombreAspirante +
                "\nTeléfono: " + telefonoAspirante +
                "\nEmail: " + emailAspirante +
                "\nCarrera: " + nombreCarrera);
        mailSender.send(message);

        return "redirect:/registro?exito";
    }

    private List<CarrerasModel> obtenerTodasCarreras() {
        String sql = "SELECT idCarrera, nombreCarrera FROM carreras ORDER BY nombreCarrera";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            CarrerasModel carrera = new CarrerasModel();
            carrera.setIdCarrera(rs.getInt("idCarrera"));
            carrera.setNombreCarrera(rs.getString("nombreCarrera"));
            return carrera;
        });
    }

    private String obtenerNombreCarrera(Integer idCarrera) {
        String sql = "SELECT nombreCarrera FROM carreras WHERE idCarrera = ?";
        return jdbcTemplate.queryForObject(sql, String.class, idCarrera);
    }

    @PostMapping("/verificar-email")
    @ResponseBody
    public Map<String, Boolean> verificarEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean existe = existeEmail(email);
        return Collections.singletonMap("existe", existe);
    }

    private boolean existeEmail(String email) {
        String sql = "SELECT COUNT(*) FROM aspirantes WHERE emailAspirante = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }
}

