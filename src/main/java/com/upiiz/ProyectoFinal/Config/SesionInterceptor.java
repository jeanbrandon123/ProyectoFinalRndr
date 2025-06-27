package com.upiiz.ProyectoFinal.Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class SesionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        boolean estaLogueado = (session != null && session.getAttribute("usuario") != null);

        if (!estaLogueado) {
            response.sendRedirect("/login");
            return false;
        }
        return true;
    }
}
