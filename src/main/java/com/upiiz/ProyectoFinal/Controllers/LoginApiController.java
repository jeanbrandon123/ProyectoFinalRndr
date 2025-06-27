    package com.upiiz.ProyectoFinal.Controllers;


    import jakarta.servlet.http.HttpSession;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.HashMap;
    import java.util.Map;

    @RestController
    @RequestMapping("/api")
    public class LoginApiController {

        @PostMapping("/login")
        public ResponseEntity<Map<String,Object>> login(
                @RequestBody Map<String, String> datos,
                HttpSession session) {

            String email = datos.get("email");
            String password = datos.get("password");
            Map<String, Object> resp = new HashMap<>();

            // Aquí va la lógica real de validación (BD, servicios, etc.)
            if ("equipo5tdwadm@gmail.com".equals(email) && "equipo5adm%".equals(password)) {
                session.setAttribute("usuario", email);
                resp.put("success", true);
                return ResponseEntity.ok(resp);
            } else {
                resp.put("success", false);
                resp.put("message", "Correo o contraseña incorrectos.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
            }
        }

        @GetMapping("/logout")
        public ResponseEntity<Void> logout(HttpSession session) {
            session.invalidate();
            return ResponseEntity.ok().build();
        }
    }



