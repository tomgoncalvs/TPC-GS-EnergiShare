package com.gs.EnergiShare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class EnergiShareApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().load();
		System.setProperty("OPEN_AI_API_KEY", dotenv.get("OPEN_AI_API_KEY"));

		SpringApplication.run(EnergiShareApplication.class, args);
	}

	public String home(){
		return "TPC - Global Solution 2024";
	}

}
