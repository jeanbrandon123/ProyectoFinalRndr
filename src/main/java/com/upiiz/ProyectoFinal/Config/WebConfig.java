package com.upiiz.ProyectoFinal.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SesionInterceptor())
                .addPathPatterns("/administrador/**", "/aspirantes/**", "/carreras/**")
                .excludePathPatterns("/login", "/api/login", "/css/**", "/js/**", "/images/**", "/webjars/**");
    }
}
