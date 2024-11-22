package com.gs.EnergiShare.Chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Rotas HTTP
    @GetMapping
    public String chatForm(Model model) {
        model.addAttribute("message", new ChatMessage());
        return "chat";
    }

    @PostMapping
    public String sendMessage(@ModelAttribute ChatMessage message, Model model) {
        String response;
        if (message.isToAi()) { // Verifica se é para a IA
            response = chatService.sendToAi(message.getContent());
        } else {
            response = "Mensagem enviada ao chat de grupo ou usuário específico.";
        }
        message.setResponse(response);
        model.addAttribute("message", message);

        return "chat";
    }

    // Rotas WebSocket (STOMP)
    @MessageMapping("/chat/ai")
    @SendTo("/topic/chat")
    public String handleAiMessage(ChatMessage message) {
        return chatService.sendToAi(message.getContent());
    }

    @MessageMapping("/chat/user")
    @SendTo("/topic/chat")
    public String handleUserMessage(ChatMessage message) {
        return message.getContent(); // Apenas retransmite a mensagem
    }
}
