package com.upiiz.ProyectoFinal.Services;

import com.upiiz.ProyectoFinal.Models.CarrerasModel;
import com.upiiz.ProyectoFinal.Repositories.CarrerasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Service
public class CarreraService implements CarrerasRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<CarrerasModel> findAllCarreras() {
        return jdbcTemplate.query("SELECT * FROM carreras",
                new BeanPropertyRowMapper<>(CarrerasModel.class));
    }

    @Override
    public CarrerasModel findCarrerasById(Integer idCarrera) {
        return jdbcTemplate.query("SELECT * FROM carreras WHERE idCarrera=?",
                        new BeanPropertyRowMapper<>(CarrerasModel.class), idCarrera)
                .stream().findFirst().orElse(new CarrerasModel());
    }

    @Override
    public CarrerasModel saveCarreras(CarrerasModel carrera) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO carreras(nombreCarrera, semestreCarrera, observacionCarrera) VALUES (?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, carrera.getNombreCarrera());
            ps.setInt(2, carrera.getSemestreCarrera());
            ps.setString(3, carrera.getObservacionCarrera());
            return ps;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();
        if (generatedId != null) {
            carrera.setIdCarrera(generatedId.intValue());
        } else {
            carrera.setIdCarrera(0);
        }

        return carrera;
    }

    @Override
    public Integer updateCarreras(CarrerasModel carrera) {
        return jdbcTemplate.update(
                "UPDATE carreras SET nombreCarrera=?, semestreCarrera=?, observacionCarrera=? WHERE idCarrera=?",
                carrera.getNombreCarrera(),
                carrera.getSemestreCarrera(),
                carrera.getObservacionCarrera(),
                carrera.getIdCarrera());
    }

    @Override
    public Integer deleteCarreras(Integer idCarrera) {
        return jdbcTemplate.update("DELETE FROM carreras WHERE idCarrera=?", idCarrera);
    }
}
