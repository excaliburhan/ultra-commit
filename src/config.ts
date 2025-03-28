import * as vscode from 'vscode';
import { createOpenAIApi } from './openai-utils';

/**
 * Configuration keys used in the AI commit extension.
 * @constant {Object}
 * @property {string} OPENAI_API_KEY - The key for OpenAI API.
 * @property {string} OPENAI_BASE_URL - The base URL for OpenAI API.
 * @property {string} OPENAI_MODEL - The model used for OpenAI.
 * @property {string} AZURE_API_VERSION - The version of Azure API.
 * @property {string} AI_COMMIT_LANGUAGE - The language for AI commit messages.
 * @property {string} SYSTEM_PROMPT - The system prompt for generating commit messages.
 * @property {string} OPENAI_TEMPERATURE - The temperature setting for OpenAI API.
 */
export enum ConfigKeys {
  OPENAI_API_KEY = 'OPENAI_API_KEY',
  OPENAI_BASE_URL = 'OPENAI_BASE_URL',
  OPENAI_MODEL = 'OPENAI_MODEL',
  AZURE_API_VERSION = 'AZURE_API_VERSION',
  AI_COMMIT_LANGUAGE = 'AI_COMMIT_LANGUAGE',
  SYSTEM_PROMPT = 'AI_COMMIT_SYSTEM_PROMPT',
  OPENAI_TEMPERATURE = 'OPENAI_TEMPERATURE',

  BAILIAN_API_KEY = 'BAILIAN_API_KEY',
  BAILIAN_MODEL = 'BAILIAN_MODEL',
  BAILIAN_TEMPERATURE = 'BAILIAN_TEMPERATURE',
  BAILIAN_TOP_P = 'BAILIAN_TOP_P',

  AI_STUDIO_API_KEY = 'AI_STUDIO_API_KEY',
  AI_STUDIO_MODEL = 'AI_STUDIO_MODEL',

  AI_PROVIDER = 'AI_PROVIDER',

  GIT_DIFF_EXCLUDE = 'GIT_DIFF_EXCLUDE'
}

export const BAILIAN_MODELS = {
  QWEN_MAX: 'qwen-max',
  QWEN_PLUS: 'qwen-plus',
  QWEN_TURBO: 'qwen-turbo'
} as const;

export const AI_STUDIO_MODELS = {
  QWEN_MAX: 'qwen2.5-max',
  DEEPSEEK_R1_671B: 'DeepSeek-R1-671B',
  DEEPSEEK_V3: 'DeepSeek-V3-671B'
} as const;

export type AIProvider = 'bailian' | 'openai' | 'ai-studio';

/**
 * Manages the configuration for the AI commit extension.
 */
export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private configCache: Map<string, any> = new Map();
  private disposable: vscode.Disposable;
  private context: vscode.ExtensionContext;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.disposable = vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('ultra-commit')) {
        this.configCache.clear();

        if (
          event.affectsConfiguration('ultra-commit.OPENAI_BASE_URL') ||
          event.affectsConfiguration('ultra-commit.OPENAI_API_KEY')
        ) {
          this.updateOpenAIModelList();
        }
      }
    });
  }

  getAIProvider(): AIProvider {
    return this.getConfig<AIProvider>(ConfigKeys.AI_PROVIDER, 'bailian');
  }

  getBailianConfig() {
    return {
      apiKey: this.getConfig<string>(ConfigKeys.BAILIAN_API_KEY, ''),
      model: this.getConfig<string>(ConfigKeys.BAILIAN_MODEL, BAILIAN_MODELS.QWEN_MAX),
      temperature: this.getConfig<number>(ConfigKeys.BAILIAN_TEMPERATURE, 0.7),
      topP: this.getConfig<number>(ConfigKeys.BAILIAN_TOP_P, 0.8)
    };
  }

  getAiStudioConfig() {
    return {
      apiKey: this.getConfig<string>(ConfigKeys.AI_STUDIO_API_KEY, ''),
      model: this.getConfig<string>(ConfigKeys.AI_STUDIO_MODEL, AI_STUDIO_MODELS.QWEN_MAX)
    };
  }

  public getSupportedBailianModels(): string[] {
    return Object.values(BAILIAN_MODELS);
  }

  static getInstance(context?: vscode.ExtensionContext): ConfigurationManager {
    if (!this.instance && context) {
      this.instance = new ConfigurationManager(context);
    }
    return this.instance;
  }

  getConfig<T>(key: string, defaultValue?: T): T {
    if (!this.configCache.has(key)) {
      const config = vscode.workspace.getConfiguration('ultra-commit');
      this.configCache.set(key, config.get<T>(key, defaultValue));
    }
    return this.configCache.get(key);
  }

  dispose() {
    this.disposable.dispose();
  }

  /**
   * Updates the list of available OpenAI models.
   */
  private async updateOpenAIModelList() {
    try {
      const openai = createOpenAIApi();
      const models = await openai.models.list();

      // Save available models to extension state
      await this.context.globalState.update(
        'availableOpenAIModels',
        models.data.map((model) => model.id)
      );

      // Get the current selected model
      const config = vscode.workspace.getConfiguration('ultra-commit');
      const currentModel = config.get<string>('OPENAI_MODEL');

      // If the current selected model is not in the available list, set it to the default value
      const availableModels = models.data.map((model) => model.id);
      if (!availableModels.includes(currentModel)) {
        await config.update('OPENAI_MODEL', 'gpt-4', vscode.ConfigurationTarget.Global);
      }
    } catch (error) {
      console.error('Failed to fetch OpenAI models:', error);
    }
  }

  /**
   * Retrieves the list of available OpenAI models.
   * @returns {Promise<string[]>} The list of available OpenAI models.
   */
  public async getAvailableOpenAIModels(): Promise<string[]> {
    if (!this.context.globalState.get<string[]>('availableOpenAIModels')) {
      await this.updateOpenAIModelList();
    }
    return this.context.globalState.get<string[]>('availableOpenAIModels', []);
  }
}
