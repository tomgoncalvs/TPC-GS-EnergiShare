package com.gs.EnergiShare.Auth;

import com.gs.EnergiShare.Cliente.ClienteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthController(ClienteRepository clienteRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public Token login(@Valid @RequestBody Credentials credentials) {
        logger.info("Tentativa de login para o email: {}", credentials.email());

        var cliente = clienteRepository.findByEmail(credentials.email())
                .orElseThrow(() -> {
                    logger.warn("Falha no login: email não encontrado");
                    return new BadCredentialsException("Usuário ou senha inválidos");
                });

        if (!passwordEncoder.matches(credentials.password(), cliente.getSenhaHash())) {
            logger.warn("Falha no login: senha incorreta para o email {}", credentials.email());
            throw new BadCredentialsException("Usuário ou senha inválidos");
        }

        logger.info("Login bem-sucedido para o email: {}", credentials.email());
        return tokenService.create(cliente);
    }
}
