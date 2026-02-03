/**
 * OpenCode Agent Store - Zustand state management
 * Manages agent state, terminal output, voice status, and sessions
 */

import { create } from 'zustand';
import type {
  AgentState,
  AgentTask,
  AgentStep,
  TerminalLine,
  VoiceState,
  VoiceCommand,
  Session,
  ChatMessage,
  Project,
  MCPToolCall,
  AIModel,
} from './types';
import { availableModels } from './types';

interface OpenCodeStore {
  // Agent State
  agentState: AgentState;
  currentTask: AgentTask | null;
  taskHistory: AgentTask[];
  
  // Terminal
  terminalLines: TerminalLine[];
  inputValue: string;
  
  // Voice
  voiceEnabled: boolean;
  voiceState: VoiceState;
  voiceTranscript: string;
  
  // Sessions
  sessions: Session[];
  currentSession: Session | null;
  
  // Project
  currentProject: Project | null;
  
  // Model
  currentModel: AIModel;
  
  // Onboarding
  isOnboarding: boolean;
  onboardingStep: number;
  
  // UI State
  isDrawerOpen: boolean;
  isModelPickerOpen: boolean;
  isFileExplorerOpen: boolean;
  
  // Actions - Agent
  setAgentState: (state: AgentState) => void;
  startTask: (command: string) => void;
  addStep: (step: Omit<AgentStep, 'id' | 'timestamp'>) => void;
  updateStep: (stepId: string, updates: Partial<AgentStep>) => void;
  completeTask: (result?: string, error?: string) => void;
  
  // Actions - Terminal
  addTerminalLine: (type: TerminalLine['type'], content: string) => void;
  addStreamingLine: (content: string) => void;
  updateStreamingLine: (content: string) => void;
  completeStreamingLine: () => void;
  clearTerminal: () => void;
  setInputValue: (value: string) => void;
  
  // Actions - Voice
  setVoiceEnabled: (enabled: boolean) => void;
  setVoiceState: (state: VoiceState) => void;
  setVoiceTranscript: (transcript: string) => void;
  processVoiceCommand: (command: VoiceCommand) => void;
  
  // Actions - Sessions
  createSession: (name?: string) => void;
  switchSession: (sessionId: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  
  // Actions - Project
  setCurrentProject: (project: Project | null) => void;
  
  // Actions - Model
  setCurrentModel: (model: AIModel) => void;
  
  // Actions - Onboarding
  setIsOnboarding: (value: boolean) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  
  // Actions - UI
  toggleDrawer: () => void;
  toggleModelPicker: () => void;
  toggleFileExplorer: () => void;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useOpenCodeStore = create<OpenCodeStore>((set, get) => ({
  // Initial State
  agentState: 'idle',
  currentTask: null,
  taskHistory: [],
  
  terminalLines: [
    {
      id: generateId(),
      type: 'system',
      content: 'VoiceCode Android IDE initialized.',
      timestamp: Date.now(),
    },
  ],
  inputValue: '',
  
  voiceEnabled: true,
  voiceState: 'inactive',
  voiceTranscript: '',
  
  sessions: [],
  currentSession: null,
  
  currentProject: null,
  
  currentModel: availableModels[0],
  
  isOnboarding: true,
  onboardingStep: 0,
  
  isDrawerOpen: false,
  isModelPickerOpen: false,
  isFileExplorerOpen: false,
  
  // Agent Actions
  setAgentState: (state) => set({ agentState: state }),
  
  startTask: (command) => {
    const task: AgentTask = {
      id: generateId(),
      command,
      state: 'planning',
      steps: [],
      startTime: Date.now(),
    };
    
    set({
      currentTask: task,
      agentState: 'planning',
    });
    
    get().addTerminalLine('command', `> ${command}`);
    get().addTerminalLine('agent', '⚡ Planning task...');
  },
  
  addStep: (step) => {
    const { currentTask } = get();
    if (!currentTask) return;
    
    const newStep: AgentStep = {
      ...step,
      id: generateId(),
      timestamp: Date.now(),
    };
    
    set({
      currentTask: {
        ...currentTask,
        steps: [...currentTask.steps, newStep],
      },
    });
  },
  
  updateStep: (stepId, updates) => {
    const { currentTask } = get();
    if (!currentTask) return;
    
    set({
      currentTask: {
        ...currentTask,
        steps: currentTask.steps.map((s) =>
          s.id === stepId ? { ...s, ...updates } : s
        ),
      },
    });
  },
  
  completeTask: (result, error) => {
    const { currentTask, taskHistory } = get();
    if (!currentTask) return;
    
    const completedTask: AgentTask = {
      ...currentTask,
      state: 'idle',
      endTime: Date.now(),
      result,
      error,
    };
    
    set({
      currentTask: null,
      taskHistory: [...taskHistory, completedTask],
      agentState: 'idle',
    });
    
    if (error) {
      get().addTerminalLine('error', `❌ Task failed: ${error}`);
    } else {
      get().addTerminalLine('success', `✓ Task completed${result ? `: ${result}` : ''}`);
    }
  },
  
  // Terminal Actions
  addTerminalLine: (type, content) => {
    set((state) => ({
      terminalLines: [
        ...state.terminalLines,
        {
          id: generateId(),
          type,
          content,
          timestamp: Date.now(),
        },
      ],
    }));
  },
  
  addStreamingLine: (content) => {
    set((state) => ({
      terminalLines: [
        ...state.terminalLines,
        {
          id: generateId(),
          type: 'agent',
          content,
          timestamp: Date.now(),
          isStreaming: true,
        },
      ],
    }));
  },
  
  updateStreamingLine: (content) => {
    set((state) => {
      const lines = [...state.terminalLines];
      const lastIndex = lines.length - 1;
      if (lastIndex >= 0 && lines[lastIndex].isStreaming) {
        lines[lastIndex] = { ...lines[lastIndex], content };
      }
      return { terminalLines: lines };
    });
  },
  
  completeStreamingLine: () => {
    set((state) => {
      const lines = [...state.terminalLines];
      const lastIndex = lines.length - 1;
      if (lastIndex >= 0 && lines[lastIndex].isStreaming) {
        lines[lastIndex] = { ...lines[lastIndex], isStreaming: false };
      }
      return { terminalLines: lines };
    });
  },
  
  clearTerminal: () => {
    set({
      terminalLines: [
        {
          id: generateId(),
          type: 'system',
          content: 'Terminal cleared.',
          timestamp: Date.now(),
        },
      ],
    });
  },
  
  setInputValue: (value) => set({ inputValue: value }),
  
  // Voice Actions
  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
  setVoiceState: (state) => set({ voiceState: state }),
  setVoiceTranscript: (transcript) => set({ voiceTranscript: transcript }),
  
  processVoiceCommand: (command) => {
    get().addTerminalLine('info', `🎤 Voice: "${command.raw}"`);
    get().startTask(command.raw);
  },
  
  // Session Actions
  createSession: (name) => {
    const session: Session = {
      id: generateId(),
      name: name || `Session ${get().sessions.length + 1}`,
      createdAt: Date.now(),
      lastActive: Date.now(),
      messages: [],
    };
    
    set((state) => ({
      sessions: [...state.sessions, session],
      currentSession: session,
    }));
    
    get().addTerminalLine('system', `📁 New session: ${session.name}`);
  },
  
  switchSession: (sessionId) => {
    const session = get().sessions.find((s) => s.id === sessionId);
    if (session) {
      set({ currentSession: session });
      get().addTerminalLine('system', `📁 Switched to: ${session.name}`);
    }
  },
  
  addMessage: (message) => {
    const { currentSession } = get();
    if (!currentSession) return;
    
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    };
    
    set((state) => ({
      currentSession: {
        ...currentSession,
        messages: [...currentSession.messages, newMessage],
        lastActive: Date.now(),
      },
      sessions: state.sessions.map((s) =>
        s.id === currentSession.id
          ? { ...s, messages: [...s.messages, newMessage], lastActive: Date.now() }
          : s
      ),
    }));
  },
  
  // Project Actions
  setCurrentProject: (project) => set({ currentProject: project }),
  
  // Model Actions
  setCurrentModel: (model) => {
    set({ currentModel: model });
    get().addTerminalLine('system', `🤖 Model switched to: ${model.name}`);
  },
  
  // Onboarding Actions
  setIsOnboarding: (value) => set({ isOnboarding: value }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  completeOnboarding: () => {
    set({ isOnboarding: false, onboardingStep: 0 });
    get().createSession('Main Session');
  },
  
  // UI Actions
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  toggleModelPicker: () => set((state) => ({ isModelPickerOpen: !state.isModelPickerOpen })),
  toggleFileExplorer: () => set((state) => ({ isFileExplorerOpen: !state.isFileExplorerOpen })),
}));
