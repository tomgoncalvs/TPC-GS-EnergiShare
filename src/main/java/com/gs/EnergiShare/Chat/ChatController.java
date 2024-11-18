package com.gs.EnergiShare.Chat;

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

    @GetMapping
    public String chatForm(Model model) {
        model.addAttribute("message", new ChatMessage());
        return "chat";
    }

    @PostMapping
    public String sendMessage(@ModelAttribute ChatMessage message, Model model) {
        String response = chatService.sendToAi(message.getContent());
        message.setResponse(response);
        model.addAttribute("message", message);

        return "chat";
    }
}
