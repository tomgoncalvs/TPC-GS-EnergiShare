package com.gs.EnergiShare.Auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthorizationFilter authorizationFilter) throws Exception {
        http
            // Desabilitando CSRF apenas para desenvolvimento
            .csrf(csrf -> csrf.disable())

            // Configuração de autorização
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/login").permitAll() // Permite acesso ao endpoint /login
                .requestMatchers(HttpMethod.POST, "/clientes").permitAll() // Permite cadastro de clientes
                .anyRequest().authenticated() // Exige autenticação para todos os outros endpoints
            )

            // Adicionando o filtro de autorização JWT antes do UsernamePasswordAuthenticationFilter
            .addFilterBefore(authorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
