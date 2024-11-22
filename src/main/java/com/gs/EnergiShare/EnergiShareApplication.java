package com.gs.EnergiShare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class EnergiShareApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().load();
		String apiKey = dotenv.get("OPEN_AI_API_KEY");
		
		if (apiKey == null || apiKey.isEmpty()) {
			throw new IllegalStateException("A chave da API OpenAI não foi encontrada no arquivo .env");
		}
	
		System.setProperty("OPEN_AI_API_KEY", apiKey);
	
		SpringApplication.run(EnergiShareApplication.class, args);
	}
}	
