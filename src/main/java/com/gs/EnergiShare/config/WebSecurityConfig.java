package com.gs.EnergiShare.config;

import com.gs.EnergiShare.Auth.AuthorizationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class WebSecurityConfig {

    private final AuthorizationFilter authorizationFilter;

    public WebSecurityConfig(AuthorizationFilter authorizationFilter) {
        this.authorizationFilter = authorizationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // CSRF desabilitado (não necessário para APIs JWT)
            .cors().configurationSource(corsConfigurationSource()) // Configuração de CORS
            .and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/login",
                    "/clientes/**",
                    "/fornecedores/**",
                    "/energia/**",
                    "transacoes/**",
                    "/ws/**",
                    "/error",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll() // Permite acesso público às rotas especificadas
                .anyRequest().authenticated() // Exige autenticação para outras rotas
            )
            .addFilterBefore(authorizationFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class); // Adiciona o filtro JWT
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000")); // Origem permitida (frontend)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Métodos HTTP permitidos
        config.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Cabeçalhos permitidos
        config.setAllowCredentials(true); // Permite envio de credenciais (cookies, auth headers, etc.)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Aplica a configuração de CORS para todas as rotas
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Encoder de senhas (BCrypt)
    }
}
