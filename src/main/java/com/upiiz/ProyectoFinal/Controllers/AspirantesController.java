package com.upiiz.ProyectoFinal.Controllers;

import com.upiiz.ProyectoFinal.Models.AspirantesModel;
import com.upiiz.ProyectoFinal.Services.AspiranteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class AspirantesController {

    @Autowired
    private AspiranteService aspiranteService;

    @GetMapping("/aspirantes")
    public String aspirantes() {
        return "aspirantes";
    }

    @GetMapping("/v1/api/aspirantes")
    public ResponseEntity<Map<String, Object>> getAllAspirantes() {
        List<AspirantesModel> lista = aspiranteService.findAllAspirantes();
        return ResponseEntity.ok(Map.of(
                "estado", 1,
                "mensaje", "Listado de aspirantes",
                "aspirantes", lista
        ));
    }

    @GetMapping("/v1/api/aspirantes/{id}")
    public ResponseEntity<Map<String, Object>> getAspiranteById(@PathVariable Integer id) {
        AspirantesModel aspirante = aspiranteService.findAspirantesById(id);
        if (aspirante.getIdAspirante() == null || aspirante.getIdAspirante() == 0) {
            return ResponseEntity.ok(Map.of(
                    "estado", 0,
                    "mensaje", "Aspirante no encontrado"
            ));
        }
        return ResponseEntity.ok(Map.of(
                "estado", 1,
                "mensaje", "Aspirante encontrado",
                "aspirante", aspirante
        ));
    }

}
