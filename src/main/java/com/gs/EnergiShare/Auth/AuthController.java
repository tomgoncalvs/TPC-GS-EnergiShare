package com.gs.EnergiShare.Auth;

import com.gs.EnergiShare.Cliente.ClienteRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthController(ClienteRepository clienteRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public Token login(@RequestBody Credentials credentials) {
        var cliente = clienteRepository.findByEmail(credentials.email())
                .orElseThrow(() -> new RuntimeException("Access Denied"));

        if (!passwordEncoder.matches(credentials.password(), cliente.getSenhaHash()))
            throw new RuntimeException("Access Denied");

        return tokenService.create(cliente);
    }
}
