    package com.upiiz.ProyectoFinal.Models;

    public class AspirantesModel {
        private Integer idAspirante;
        private String nombreAspirante;
        private String telefonoAspirante;
        private String emailAspirante;
        private Integer carreraId;
        private String nombreCarrera;

    public AspirantesModel() {
    }

    public AspirantesModel(Integer idAspirante, String nombreAspirante, String telefonoAspirante, String emailAspirante, Integer carreraId, String nombreCarrera) {
        this.idAspirante = idAspirante;
        this.nombreAspirante = nombreAspirante;
        this.telefonoAspirante = telefonoAspirante;
        this.emailAspirante = emailAspirante;
        this.carreraId = carreraId;
        this.nombreCarrera = nombreCarrera;
    }

    public String getNombreCarrera() {
        return nombreCarrera;
    }
    public void setNombreCarrera(String nombreCarrera) {
        this.nombreCarrera = nombreCarrera;
    }

    public Integer getIdAspirante() {
        return idAspirante;
    }

    public void setIdAspirante(Integer idAspirante) {
        this.idAspirante = idAspirante;
    }

    public String getNombreAspirante() {
        return nombreAspirante;
    }

    public void setNombreAspirante(String nombreAspirante) {
        this.nombreAspirante = nombreAspirante;
    }

    public String getTelefonoAspirante() {
        return telefonoAspirante;
    }

    public void setTelefonoAspirante(String telefonoAspirante) {
        this.telefonoAspirante = telefonoAspirante;
    }

    public String getEmailAspirante() {
        return emailAspirante;
    }

    public void setEmailAspirante(String emailAspirante) {
        this.emailAspirante = emailAspirante;
    }

    public Integer getCarreraId() {
        return carreraId;
    }

    public void setCarreraId(Integer carreraId) {
        this.carreraId = carreraId;
    }
}
