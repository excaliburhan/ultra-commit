import * as vscode from 'vscode';
import axios from 'axios';
import { ConfigurationManager } from './config';

// 百炼 API 的基础 URL
const BAILIAN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

interface BailianMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface BailianRequest {
  model: string;
  input: {
    messages: BailianMessage[];
  };
  parameters?: {
    result_format?: string;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    seed?: number;
    max_tokens?: number;
    stop?: string[];
    enable_search?: boolean;
    incremental_output?: boolean;
  };
}

interface BailianResponse {
  output: {
    text: string;
    finish_reason: string;
  };
  usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
  request_id: string;
}

export function createBailianClient() {
  const config = ConfigurationManager.getInstance().getBailianConfig();

  return axios.create({
    baseURL: BAILIAN_API_URL,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    }
  });
}

export async function BailianAPI(messages: Array<{ role: string; content: string }>) {
  try {
    const config = ConfigurationManager.getInstance().getBailianConfig();
    const client = createBailianClient();

    const requestBody: BailianRequest = {
      model: config.model,
      input: {
        messages: messages.map((msg) => ({
          role: msg.role === 'system' ? 'system' : msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      },
      parameters: {
        temperature: config.temperature,
        top_p: config.topP,
        result_format: 'text'
      }
    };

    const response = await client.post<BailianResponse>('', requestBody);

    if (response.data && response.data.output && response.data.output.text) {
      return response.data.output.text;
    }

    throw new Error('Invalid response from Bailian API');
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data.message || error.response.statusText;
      const errorCode = error.response.data.code || error.response.status;
      throw new Error(`Bailian API error (${errorCode}): ${errorMessage}`);
    }
    throw error;
  }
}
