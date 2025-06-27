package com.upiiz.ProyectoFinal.Repositories;

import com.upiiz.ProyectoFinal.Models.CarrerasModel;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarrerasRepository {
    public List<CarrerasModel> findAllCarreras();
    public CarrerasModel findCarrerasById(Integer id);
    public CarrerasModel saveCarreras(CarrerasModel model);
    public Integer updateCarreras(CarrerasModel model);
    public Integer deleteCarreras(Integer id);
}
