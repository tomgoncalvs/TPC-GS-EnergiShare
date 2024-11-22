package com.gs.EnergiShare.Chat;

public class ChatMessage {
    private String content;
    private String response;
    private String email;
    private boolean toAi;

    // Getters e Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isToAi() {
        return toAi;
    }
    
    public void setToAi(boolean toAi) {
        this.toAi = toAi;
    }
}
