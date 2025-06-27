package com.upiiz.ProyectoFinal.Controllers;

import com.upiiz.ProyectoFinal.Models.CarrerasModel;
import com.upiiz.ProyectoFinal.Services.CarreraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
import java.util.List;


@Controller
public class CarrerasController {

    @Autowired
    private CarreraService carreraService;

    @GetMapping("/carreras")
    public String carreras() {
        return "carreras";
    }

    @GetMapping("/v1/api/carreras")
    public ResponseEntity<Map<String, Object>> getAllCarreras() {
        List<CarrerasModel> carreras = carreraService.findAllCarreras();
        return ResponseEntity.ok(Map.of(
                "estado", 1,
                "mensaje", "Listado de carreras",
                "carreras", carreras
        ));
    }

    @PostMapping("/v1/api/carreras")
    public ResponseEntity<Map<String, Object>> carreraPost(@RequestBody Map<String, Object> objetoCarrera) {
        CarrerasModel carrera = new CarrerasModel();
        carrera.setNombreCarrera(objetoCarrera.get("nombreCarrera").toString());
        carrera.setSemestreCarrera(Integer.parseInt(objetoCarrera.get("semestreCarrera").toString()));
        carrera.setObservacionCarrera(objetoCarrera.getOrDefault("observacionCarrera", "").toString());

        CarrerasModel guardada = carreraService.saveCarreras(carrera);

        if (guardada.getIdCarrera() > 0) {
            return ResponseEntity.ok(Map.of(
                    "estado", 1,
                    "mensaje", "Carrera guardada correctamente",
                    "carrera", guardada
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                    "estado", 0,
                    "mensaje", "No se pudo guardar la carrera",
                    "carrera", objetoCarrera
            ));
        }
    }

    @PostMapping("/v1/api/carreras/eliminar")
    public ResponseEntity<Map<String, Object>> carreraDelete(@RequestBody Map<String, Object> objetoCarrera) {
        int id = Integer.parseInt(objetoCarrera.get("id").toString());

        if (carreraService.deleteCarreras(id) > 0) {
            return ResponseEntity.ok(Map.of(
                    "estado", 1,
                    "mensaje", "Carrera eliminada correctamente"
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                    "estado", 0,
                    "mensaje", "No se pudo eliminar la carrera"
            ));
        }
    }

    @GetMapping("/v1/api/carreras/actualizar/{id}")
    public ResponseEntity<Map<String, Object>> obtenerCarrera(@PathVariable int id) {
        CarrerasModel carrera = carreraService.findCarrerasById(id);
        return ResponseEntity.ok(Map.of(
                "estado", 1,
                "mensaje", "Carrera encontrada",
                "carrera", carrera
        ));
    }

    @PostMapping("/v1/api/carreras/actualizar/{id}")
    public ResponseEntity<Map<String, Object>> actualizarCarrera(
            @PathVariable int id,
            @RequestBody Map<String, Object> objetoCarrera) {

        CarrerasModel carrera = new CarrerasModel();
        carrera.setIdCarrera(id);
        carrera.setNombreCarrera(objetoCarrera.get("nombreCarrera").toString());
        carrera.setSemestreCarrera(Integer.parseInt(objetoCarrera.get("semestreCarrera").toString()));
        carrera.setObservacionCarrera(objetoCarrera.getOrDefault("observacionCarrera", "").toString());

        if (carreraService.updateCarreras(carrera) > 0) {
            return ResponseEntity.ok(Map.of(
                    "estado", 1,
                    "mensaje", "Carrera actualizada correctamente",
                    "carrera", carrera
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                    "estado", 0,
                    "mensaje", "No se pudo actualizar la carrera",
                    "carrera", objetoCarrera
            ));
        }
    }

}
