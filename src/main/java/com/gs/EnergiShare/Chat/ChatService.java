package com.gs.EnergiShare.Chat;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;

    // Chave da API OpenAI configurada diretamente no código (hardcoded)
    private static final String API_KEY = "API_KEY";

    public ChatService() {
        // Criando o modelo OpenAI diretamente
        OpenAiApi openAiApi = new OpenAiApi(API_KEY);
        OpenAiChatModel openAiChatModel = new OpenAiChatModel(openAiApi);

        // Construindo o cliente de chat
        this.chatClient = ChatClient.builder(openAiChatModel)
                .defaultSystem("""
                        Você é um assistente virtual da plataforma EnergiShare, especializado em conectar fornecedores de energia renovável a parceiros sociais em comunidades vulneráveis. Seu objetivo é auxiliar os fornecedores a doarem sua energia excedente de forma segura e eficiente, destacando os benefícios fiscais e sociais associados à doação.

                        **Instruções detalhadas para sua assistência:**
                        - Quando um fornecedor informar a quantidade de energia excedente, sugira os melhores parceiros (fictícios) para a doação, baseando-se em critérios como impacto social e localização.
                        - Explique de forma clara os benefícios fiscais proporcionais à quantidade de energia doada.
                        - Destaque o impacto positivo para as comunidades que receberão a energia doada, incluindo melhorias no acesso à energia limpa e na qualidade de vida.
                        - Sempre forneça respostas claras, objetivas e personalizadas, evitando bullets ou formatações complexas.
                        - Reforce que todas as transações são seguras e validadas pelo blockchain da EnergiShare.
                        """)
                .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                .build();
    }

    public String sendToAi(String message) {
        try {
            System.out.println("Enviando mensagem para IA: " + message);
            String response = chatClient
                    .prompt()
                    .user(message)
                    .call()
                    .content();
            System.out.println("Resposta da IA: " + response);
            return response;
        } catch (Exception e) {
            System.err.println("Erro ao chamar a IA: " + e.getMessage());
            e.printStackTrace();
            return "Não foi possível processar sua solicitação. Tente novamente mais tarde.";
        }
    }
}
