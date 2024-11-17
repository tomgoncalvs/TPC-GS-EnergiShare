package com.gs.EnergiShare.Auth;

import com.gs.EnergiShare.Cliente.Cliente;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class AuthorizationFilter extends OncePerRequestFilter {

    private final TokenService tokenService;

    public AuthorizationFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            var token = header.replace("Bearer ", "");
            Cliente cliente = tokenService.getClienteFromToken(token);

            var auth = new UsernamePasswordAuthenticationToken(
                    cliente.getEmail(),
                    null,
                    List.of(new SimpleGrantedAuthority("USER"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.setStatus(403);
            response.addHeader("Content-Type", "application/json");
            response.getWriter().write("""
                    {
                        "message": "%s"
                    }
                    """.formatted(e.getMessage()));
        }
    }
}
