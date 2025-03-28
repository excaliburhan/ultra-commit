import * as vscode from 'vscode';
import axios from 'axios';
import { ConfigurationManager } from './config';
import { ChatCompletion } from 'openai/resources';

// AI Studio API 的基础 URL
const AI_STUDIO_API_URL = 'https://idealab.alibaba-inc.com/api/openai/v1/chat/completions';

interface AiStudioMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AiStudioRequest {
  model: string;
  messages: AiStudioMessage[];
}

interface AiStudioResponse extends ChatCompletion {}

export function createAiStudioClient() {
  const config = ConfigurationManager.getInstance().getAiStudioConfig();

  return axios.create({
    baseURL: AI_STUDIO_API_URL,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    }
  });
}

export async function AiStudioAPI(messages: Array<{ role: string; content: string }>) {
  try {
    const config = ConfigurationManager.getInstance().getAiStudioConfig();
    const client = createAiStudioClient();

    const requestBody: AiStudioRequest = {
      model: config.model,
      messages: messages.map((msg) => ({
        role: msg.role === 'system' ? 'system' : msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    };

    const response = await client.post<AiStudioResponse>('', requestBody);

    if (response.data && response.data.choices) {
      return response.data.choices[0]!.message?.content;
    }

    throw new Error('Invalid response from AiStudio API');
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred';
    if (error.response?.status) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'Invalid AI Studio API key or unauthorized access';
          break;
        case 429:
          errorMessage = 'Rate limit exceeded. Please try again later';
          break;
        case 500:
          errorMessage = 'AI Studio server error. Please try again later';
          break;
        case 503:
          errorMessage = 'AI Studio service is temporarily unavailable';
          break;
      }
    }
    if (error.response) {
      const errorCode = error.response.status;
      throw new Error(`AiStudio API error (${errorCode}): ${errorMessage}`);
    }
    throw error;
  }
}
