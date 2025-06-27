package com.upiiz.ProyectoFinal.Services;


import com.upiiz.ProyectoFinal.Models.AspirantesModel;
import com.upiiz.ProyectoFinal.Repositories.AspirantesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    @Autowired
    private AspirantesRepository aspirantesRepository;


    public void sendIndividualEmail(Integer aspiranteId, String subject, String content) {
        AspirantesModel aspirante = aspirantesRepository.findAspirantesById(aspiranteId);

        if (aspirante == null) {
            throw new RuntimeException("Aspirante no encontrado con ID: " + aspiranteId);
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(aspirante.getEmailAspirante());
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }

    // Método para enviar correo masivo
    public void sendMassEmail(String subject, String content) {
        List<AspirantesModel> aspirantes = aspirantesRepository.findAllAspirantes();

        if (aspirantes == null || aspirantes.isEmpty()) {
            throw new RuntimeException("No hay aspirantes registrados");
        }

        for (AspirantesModel aspirante : aspirantes) {
            if (aspirante.getEmailAspirante() != null && !aspirante.getEmailAspirante().isEmpty()) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(aspirante.getEmailAspirante());
                message.setSubject(subject);
                message.setText(content);

                mailSender.send(message);
            }
        }
    }




}
