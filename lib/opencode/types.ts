/**
 * Type definitions for OpenCode Agent System
 */

// Voice Command Types
export type VoiceIntent =
  | 'create_project'
  | 'debug_app'
  | 'decompile'
  | 'build'
  | 'sign'
  | 'fix_error'
  | 'help'
  | 'status'
  | 'cancel'
  | 'confirm'
  | 'unknown';

export interface VoiceCommand {
  raw: string;
  intent: VoiceIntent;
  entities: Record<string, string>;
  confidence: number;
  timestamp: number;
}

// Agent State Types
export type AgentState = 'idle' | 'planning' | 'executing' | 'observing' | 'fixing' | 'waiting_confirmation';

export interface AgentStep {
  id: string;
  type: 'plan' | 'execute' | 'observe' | 'fix';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
  error?: string;
  timestamp: number;
  duration?: number;
}

export interface AgentTask {
  id: string;
  command: string;
  state: AgentState;
  steps: AgentStep[];
  startTime: number;
  endTime?: number;
  result?: string;
  error?: string;
}

// MCP Tool Types
export type MCPToolName =
  | 'android.shell.exec'
  | 'android.fs.read'
  | 'android.fs.write'
  | 'android.apk.decompile'
  | 'android.apk.compile'
  | 'android.apk.sign'
  | 'android.gradle.run';

export interface MCPToolCall {
  id: string;
  tool: MCPToolName;
  params: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
  timestamp: number;
}

// Terminal Output Types
export type OutputType = 'info' | 'success' | 'error' | 'warning' | 'command' | 'system' | 'agent';

export interface TerminalLine {
  id: string;
  type: OutputType;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  path: string;
  type: 'new' | 'decompiled';
  apkPath?: string;
  createdAt: number;
  lastModified: number;
}

export interface ProjectFile {
  path: string;
  name: string;
  type: 'file' | 'directory';
  extension?: string;
  size?: number;
  isModified?: boolean;
}

// Session Types
export interface Session {
  id: string;
  name: string;
  projectId?: string;
  createdAt: number;
  lastActive: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isVoice?: boolean;
  toolCalls?: MCPToolCall[];
}

// Voice State
export type VoiceState = 'inactive' | 'listening' | 'processing' | 'speaking' | 'error';

export interface VoiceStatus {
  state: VoiceState;
  transcript?: string;
  confidence?: number;
  error?: string;
}

// APK Types
export interface APKInfo {
  path: string;
  name: string;
  packageName?: string;
  versionName?: string;
  versionCode?: number;
  size: number;
  minSdk?: number;
  targetSdk?: number;
  permissions?: string[];
}

export interface DecompileResult {
  success: boolean;
  outputPath: string;
  smaliPath?: string;
  javaPath?: string;
  resourcesPath?: string;
  errors?: string[];
}

export interface BuildResult {
  success: boolean;
  outputApk?: string;
  errors?: string[];
  warnings?: string[];
}

// Model Types
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  isDefault?: boolean;
}

export const availableModels: AIModel[] = [
  { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', provider: 'Anthropic', isDefault: true },
  { id: 'claude-4-opus', name: 'Claude 4 Opus', provider: 'Anthropic' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google' },
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI' },
];
