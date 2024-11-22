package com.gs.EnergiShare.Cliente;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Adicionado para codificação de senha

    public Page<Cliente> listarClientes(String nome, Pageable pageable) {
        if (nome != null) {
            return clienteRepository.findByNomeContaining(nome, pageable);
        }
        return clienteRepository.findAll(pageable);
    }

    public Optional<Cliente> getClienteById(Integer id) {
        return clienteRepository.findById(id);
    }

    public Cliente createCliente(Cliente cliente) {
        // Codifica a senha antes de salvar
        cliente.setSenhaHash(passwordEncoder.encode(cliente.getSenhaHash()));
        return clienteRepository.save(cliente);
    }

    public Optional<Cliente> updateCliente(Integer id, Cliente clienteDetails) {
        return clienteRepository.findById(id).map(cliente -> {
            cliente.setNome(clienteDetails.getNome());
            cliente.setEmail(clienteDetails.getEmail());
            cliente.setTelefone(clienteDetails.getTelefone());
            cliente.setEndereco(clienteDetails.getEndereco());

            // Codifica a senha apenas se for fornecida
            if (clienteDetails.getSenhaHash() != null && !clienteDetails.getSenhaHash().isEmpty()) {
                cliente.setSenhaHash(passwordEncoder.encode(clienteDetails.getSenhaHash()));
            }

            return clienteRepository.save(cliente);
        });
    }

    public boolean deleteCliente(Integer id) {
        return clienteRepository.findById(id).map(cliente -> {
            clienteRepository.delete(cliente);
            return true;
        }).orElse(false);
    }
}
