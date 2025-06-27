package com.upiiz.ProyectoFinal.Models;

public class CarrerasModel {
    private int idCarrera;
    private String nombreCarrera;
    private Integer semestreCarrera;
    private String observacionCarrera;

    public CarrerasModel() {
    }

    public CarrerasModel(int idCarrera, String nombreCarrera, Integer semestreCarrera, String observacionCarrera) {
        this.idCarrera = idCarrera;
        this.nombreCarrera = nombreCarrera;
        this.semestreCarrera = semestreCarrera;
        this.observacionCarrera = observacionCarrera;
    }

    public int getIdCarrera() {
        return idCarrera;
    }

    public void setIdCarrera(int idCarrera) {
        this.idCarrera = idCarrera;
    }

    public String getNombreCarrera() {
        return nombreCarrera;
    }

    public void setNombreCarrera(String nombreCarrera) {
        this.nombreCarrera = nombreCarrera;
    }

    public Integer getSemestreCarrera() {
        return semestreCarrera;
    }

    public void setSemestreCarrera(Integer semestreCarrera) {
        this.semestreCarrera = semestreCarrera;
    }

    public String getObservacionCarrera() {
        return observacionCarrera;
    }

    public void setObservacionCarrera(String observacionCarrera) {
        this.observacionCarrera = observacionCarrera;
    }
}
