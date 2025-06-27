package com.upiiz.ProyectoFinal.Repositories;

import com.upiiz.ProyectoFinal.Models.AspirantesModel;
import com.upiiz.ProyectoFinal.Models.CarrerasModel;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AspirantesRepository {
    public List<AspirantesModel> findAllAspirantes();
    public AspirantesModel findAspirantesById(Integer id);
    public AspirantesModel saveAspirantes (AspirantesModel model);
    public Integer updateAspirantes (AspirantesModel model);
    public Integer deleteAspirantes (Integer id);

}
