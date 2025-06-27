package com.upiiz.ProyectoFinal.Models;

public class EmailModel {
    private Integer idAspirante;
    private String email;
    private String asunto;
    private String mensaje;

    public EmailModel() {
    }

    public EmailModel(Integer idAspirante, String email, String asunto, String mensaje) {
        this.idAspirante = idAspirante;
        this.email = email;
        this.asunto = asunto;
        this.mensaje = mensaje;
    }

    public Integer getIdAspirante() {
        return idAspirante;
    }

    public void setIdAspirante(Integer idAspirante) {
        this.idAspirante = idAspirante;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
