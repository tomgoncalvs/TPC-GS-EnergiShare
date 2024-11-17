package com.gs.EnergiShare.Auth;

import com.gs.EnergiShare.Cliente.ClienteRepository;
import com.gs.EnergiShare.Cliente.Cliente;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    private final ClienteRepository clienteRepository;
    private final Algorithm algorithm;

    public TokenService(ClienteRepository clienteRepository, @Value("${jwt.secret}") String secret) {
        this.clienteRepository = clienteRepository;
        this.algorithm = Algorithm.HMAC256(secret);
    }

    public Token create(Cliente cliente) {
        var expiresAt = LocalDateTime.now().plusHours(1).toInstant(ZoneOffset.ofHours(-3));

        String token = JWT.create()
                .withIssuer("EnergiShare")
                .withSubject(cliente.getEmail())
                .withClaim("role", "user")
                .withExpiresAt(expiresAt)
                .sign(algorithm);

        return new Token(token);
    }

    public Cliente getClienteFromToken(String token) {
        var email = JWT.require(algorithm)
                .withIssuer("EnergiShare")
                .build()
                .verify(token)
                .getSubject();

        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Cliente não encontrado"));
    }
}
