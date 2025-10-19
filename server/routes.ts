import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Conversations
  app.get("/api/conversations", async (_req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(data);
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(400).json({ error: "Failed to create conversation" });
    }
  });

  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteConversation(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Conversation not found" });
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Messages
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getMessages(id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Chat endpoint with streaming
  app.post("/api/chat", async (req, res) => {
    try {
      const {
        conversationId,
        message,
        provider,
        model,
        apiKey,
      } = req.body;

      if (!conversationId || !message || !provider || !model) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      // Save user message
      await storage.createMessage({
        conversationId,
        role: "user",
        content: message,
        provider: null,
      });

      // Load full conversation history
      const history = await storage.getMessages(conversationId);

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let fullResponse = "";

      try {
        if (provider === "openai") {
          // Use user's API key if provided, otherwise use Replit AI Integrations
          const openai = new OpenAI({
            apiKey: apiKey || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
            baseURL: apiKey ? undefined : process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
          });

          // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
          // Convert history to OpenAI format
          const messages = history.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }));

          const stream = await openai.chat.completions.create({
            model,
            messages,
            stream: true,
          });

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullResponse += content;
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          }
        } else if (provider === "anthropic") {
          if (!apiKey) {
            throw new Error("Anthropic API key is required");
          }

          const anthropic = new Anthropic({ apiKey });

          // The newest Anthropic model is "claude-sonnet-4-20250514"
          // Convert history to Anthropic format  
          const messages = history.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: [{ type: "text" as const, text: msg.content }],
          }));

          const stream = await anthropic.messages.stream({
            model,
            max_tokens: 4096,
            messages,
          });

          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              const content = chunk.delta.text;
              fullResponse += content;
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          }
        } else if (provider === "gemini") {
          if (!apiKey) {
            throw new Error("Gemini API key is required");
          }

          const genai = new GoogleGenAI({ apiKey });

          // Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
          // Convert history to Gemini format
          const contents = history.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          }));

          const response = await genai.models.generateContentStream({
            model,
            contents,
          });

          for await (const chunk of response) {
            // Extract text from candidates
            const content = chunk.candidates?.[0]?.content?.parts?.[0]?.text || chunk.text || "";
            if (content) {
              fullResponse += content;
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          }
        } else {
          throw new Error(`Unsupported provider: ${provider}`);
        }

        // Save assistant message
        await storage.createMessage({
          conversationId,
          role: "assistant",
          content: fullResponse,
          provider: model,
        });

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (error) {
        console.error("Error during chat:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
      }
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to process chat request" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
