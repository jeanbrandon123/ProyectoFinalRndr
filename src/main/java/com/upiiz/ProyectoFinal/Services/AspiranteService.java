package com.upiiz.ProyectoFinal.Services;

import com.upiiz.ProyectoFinal.Models.AspirantesModel;
import com.upiiz.ProyectoFinal.Repositories.AspirantesRepository;
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
public class AspiranteService implements AspirantesRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<AspirantesModel> findAllAspirantes() {
        String sql = "SELECT a.*, c.nombreCarrera FROM aspirantes a " +
                "JOIN carreras c ON a.carreraId = c.idCarrera";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            AspirantesModel a = new AspirantesModel();
            a.setIdAspirante(rs.getInt("idAspirante"));
            a.setNombreAspirante(rs.getString("nombreAspirante"));
            a.setTelefonoAspirante(rs.getString("telefonoAspirante"));
            a.setEmailAspirante(rs.getString("emailAspirante"));
            a.setCarreraId(rs.getInt("carreraId"));
            a.setNombreCarrera(rs.getString("nombreCarrera")); // campo extra agregado
            return a;
        });
    }

    @Override
    public AspirantesModel findAspirantesById(Integer idAspirante) {
        String sql = "SELECT a.*, c.nombreCarrera FROM aspirantes a " +
                "JOIN carreras c ON a.carreraId = c.idCarrera " +
                "WHERE a.idAspirante = ?";

        return jdbcTemplate.query(sql,
                        new BeanPropertyRowMapper<>(AspirantesModel.class), idAspirante)
                .stream().findFirst().orElse(new AspirantesModel());
    }

    @Override
    public AspirantesModel saveAspirantes(AspirantesModel aspirante) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO aspirantes(nombreAspirante, telefonoAspirante, emailAspirante, carreraId) VALUES (?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, aspirante.getNombreAspirante());
            ps.setString(2, aspirante.getTelefonoAspirante());
            ps.setString(3, aspirante.getEmailAspirante());
            ps.setInt(4, aspirante.getCarreraId());
            return ps;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();
        if (generatedId != null) {
            aspirante.setIdAspirante(generatedId.intValue());
        } else {
            aspirante.setIdAspirante(0);
        }

        return aspirante;
    }

    @Override
    public Integer updateAspirantes(AspirantesModel aspirante) {
        return jdbcTemplate.update(
                "UPDATE aspirantes SET nombreAspirante=?, telefonoAspirante=?, emailAspirante=?, carreraId=? WHERE idAspirante=?",
                aspirante.getNombreAspirante(),
                aspirante.getTelefonoAspirante(),
                aspirante.getEmailAspirante(),
                aspirante.getCarreraId(),
                aspirante.getIdAspirante());
    }

    @Override
    public Integer deleteAspirantes(Integer idAspirante) {
        return jdbcTemplate.update("DELETE FROM aspirantes WHERE idAspirante=?", idAspirante);
    }
    public List<String> obtenerTodosEmails() {
        String sql = "SELECT emailAspirante FROM aspirantes";
        return jdbcTemplate.queryForList(sql, String.class);
    }
}
