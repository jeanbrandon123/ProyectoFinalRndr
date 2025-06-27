package com.upiiz.ProyectoFinal.Controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class    AdministradorController {

    // Página protegida: solo accesible si hay sesión iniciada
    @GetMapping("/administrador")
    public String administrador(HttpSession session) {
        // Verificar si existe la sesión del usuario
        if (session.getAttribute("usuario") == null) {
            // Si no hay sesión, redirigir al login
            return "redirect:/login";
        }
        return "administrador";
    }

    // Página de login (accesible públicamente)
    @GetMapping("/login")
    public String login() {
        return "administrador";
    }

    // Cierre de sesión
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }




}

