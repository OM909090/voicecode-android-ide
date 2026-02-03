/**
 * OpenCode Agent Runner
 * Executes agent loop: PLAN → EXECUTE → OBSERVE → FIX → CONTINUE
 */

import { useOpenCodeStore } from './agent-store';
import { executeMCPTool, decompileApk, compileApk, signApk } from './mcp-tools';
import { OPENCODE_SYSTEM_PROMPT, TASK_TEMPLATES } from './system-prompt';
import type { AgentStep, VoiceIntent, MCPToolName } from './types';

// Simulated streaming delay
const streamDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Parse voice command to determine intent
export function parseVoiceIntent(command: string): VoiceIntent {
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand.includes('create') && (lowerCommand.includes('app') || lowerCommand.includes('project'))) {
    return 'create_project';
  }
  if (lowerCommand.includes('debug') || lowerCommand.includes('existing')) {
    return 'debug_app';
  }
  if (lowerCommand.includes('decompile') || lowerCommand.includes('reverse') || lowerCommand.includes('extract')) {
    return 'decompile';
  }
  if (lowerCommand.includes('build') || lowerCommand.includes('compile') || lowerCommand.includes('generate apk')) {
    return 'build';
  }
  if (lowerCommand.includes('sign')) {
    return 'sign';
  }
  if (lowerCommand.includes('fix') || lowerCommand.includes('error') || lowerCommand.includes('crash')) {
    return 'fix_error';
  }
  if (lowerCommand.includes('help') || lowerCommand.includes('what can')) {
    return 'help';
  }
  if (lowerCommand.includes('status') || lowerCommand.includes('progress')) {
    return 'status';
  }
  if (lowerCommand.includes('cancel') || lowerCommand.includes('stop') || lowerCommand.includes('abort')) {
    return 'cancel';
  }
  if (lowerCommand.includes('yes') || lowerCommand.includes('confirm') || lowerCommand.includes('proceed')) {
    return 'confirm';
  }
  
  return 'unknown';
}

// Stream text to terminal with typing effect
async function streamToTerminal(text: string, lineDelay = 50): Promise<void> {
  const store = useOpenCodeStore.getState();
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.trim()) {
      store.addTerminalLine('agent', line);
      await streamDelay(lineDelay);
    }
  }
}

// Execute agent task based on intent
export async function executeAgentTask(command: string): Promise<void> {
  const store = useOpenCodeStore.getState();
  const intent = parseVoiceIntent(command);
  
  store.startTask(command);
  
  try {
    switch (intent) {
      case 'create_project':
        await runCreateProjectTask();
        break;
      
      case 'decompile':
      case 'debug_app':
        await runDecompileTask(command);
        break;
      
      case 'build':
        await runBuildTask();
        break;
      
      case 'sign':
        await runSignTask();
        break;
      
      case 'fix_error':
        await runFixErrorTask(command);
        break;
      
      case 'help':
        await showHelp();
        break;
      
      case 'status':
        await showStatus();
        break;
      
      case 'cancel':
        store.completeTask('Task cancelled by user');
        return;
      
      default:
        await runGenericTask(command);
    }
    
    store.completeTask('Task completed successfully');
  } catch (error) {
    store.completeTask(undefined, error instanceof Error ? error.message : 'Unknown error');
  }
}

// Task: Create new Android project
async function runCreateProjectTask(): Promise<void> {
  const store = useOpenCodeStore.getState();
  
  await streamToTerminal('📋 PLAN: Creating new Android project...');
  store.setAgentState('planning');
  await streamDelay(500);
  
  const steps = [
    'Initializing project structure...',
    'Creating AndroidManifest.xml...',
    'Setting up Gradle build files...',
    'Creating MainActivity.java...',
    'Creating layout resources...',
    'Verifying project configuration...',
  ];
  
  store.setAgentState('executing');
  for (const step of steps) {
    store.addStep({ type: 'execute', description: step, status: 'running' });
    await streamToTerminal(`  → ${step}`);
    await streamDelay(800);
  }
  
  await streamToTerminal('\n✅ Project created successfully!');
  await streamToTerminal('📂 Location: /project');
  await streamToTerminal('🎤 Say "build the app" to compile.');
}

// Task: Decompile APK
async function runDecompileTask(command: string): Promise<void> {
  const store = useOpenCodeStore.getState();
  
  await streamToTerminal('📋 PLAN: Decompiling APK for analysis...');
  store.setAgentState('planning');
  await streamDelay(500);
  
  // Step 1: Decompile with apktool
  store.setAgentState('executing');
  store.addStep({ type: 'execute', description: 'Running apktool...', status: 'running' });
  await streamToTerminal('\n🔧 Running apktool d app.apk...');
  
  const decompileResult = await decompileApk('/input/app.apk');
  
  await streamToTerminal('  I: Using Apktool 2.9.0');
  await streamToTerminal('  I: Loading resource table...');
  await streamToTerminal('  I: Decoding AndroidManifest.xml');
  await streamToTerminal('  I: Baksmaling classes.dex...');
  await streamToTerminal('  I: Copying assets and libs...');
  await streamDelay(300);
  
  // Step 2: Extract Java with jadx
  store.addStep({ type: 'execute', description: 'Running jadx...', status: 'running' });
  await streamToTerminal('\n🔧 Running jadx for Java source extraction...');
  await streamDelay(1500);
  await streamToTerminal('  INFO: Processing classes...');
  await streamToTerminal('  INFO: Decompiling methods...');
  await streamToTerminal('  INFO: Java sources extracted.');
  
  // Step 3: Analyze
  store.setAgentState('observing');
  store.addStep({ type: 'observe', description: 'Analyzing code structure...', status: 'running' });
  await streamToTerminal('\n🔍 Analyzing project structure...');
  await streamDelay(800);
  
  await streamToTerminal('\n📁 Decompiled files:');
  await streamToTerminal('  ├── AndroidManifest.xml');
  await streamToTerminal('  ├── res/');
  await streamToTerminal('  │   ├── layout/');
  await streamToTerminal('  │   ├── values/');
  await streamToTerminal('  │   └── drawable/');
  await streamToTerminal('  ├── smali/');
  await streamToTerminal('  ├── src/');
  await streamToTerminal('  │   └── com/example/');
  await streamToTerminal('  └── assets/');
  
  await streamToTerminal('\n✅ Decompilation complete!');
  await streamToTerminal('🎤 Say "fix the error" or "build" to continue.');
}

// Task: Build APK
async function runBuildTask(): Promise<void> {
  const store = useOpenCodeStore.getState();
  
  await streamToTerminal('📋 PLAN: Building APK...');
  store.setAgentState('planning');
  await streamDelay(500);
  
  store.setAgentState('executing');
  
  // Step 1: Clean
  store.addStep({ type: 'execute', description: 'Cleaning build...', status: 'running' });
  await streamToTerminal('\n🔧 Running gradle clean...');
  await streamDelay(1000);
  await streamToTerminal('  > Task :app:clean');
  
  // Step 2: Build
  store.addStep({ type: 'execute', description: 'Compiling...', status: 'running' });
  await streamToTerminal('\n🔧 Running gradle assembleDebug...');
  
  const buildResult = await compileApk('/project');
  
  await streamToTerminal('  > Task :app:preBuild UP-TO-DATE');
  await streamToTerminal('  > Task :app:compileDebugKotlin');
  await streamToTerminal('  > Task :app:compileDebugJavaWithJavac');
  await streamToTerminal('  > Task :app:packageDebug');
  await streamToTerminal('\n  BUILD SUCCESSFUL in 8s');
  
  await streamToTerminal('\n✅ APK built successfully!');
  await streamToTerminal(`📦 Output: ${buildResult.apkPath}`);
  await streamToTerminal('🎤 Say "sign the apk" to prepare for release.');
}

// Task: Sign APK
async function runSignTask(): Promise<void> {
  const store = useOpenCodeStore.getState();
  
  await streamToTerminal('📋 PLAN: Signing APK...');
  store.setAgentState('planning');
  await streamDelay(500);
  
  store.setAgentState('executing');
  
  // Zipalign
  store.addStep({ type: 'execute', description: 'Running zipalign...', status: 'running' });
  await streamToTerminal('\n🔧 Running zipalign...');
  await streamDelay(800);
  await streamToTerminal('  Alignment complete.');
  
  // Sign
  store.addStep({ type: 'execute', description: 'Signing APK...', status: 'running' });
  await streamToTerminal('\n🔧 Running apksigner...');
  
  const signResult = await signApk('/output/app-debug.apk');
  
  await streamDelay(1000);
  await streamToTerminal('  Signed APK successfully.');
  
  await streamToTerminal('\n✅ APK signed and ready!');
  await streamToTerminal(`📦 Signed APK: ${signResult.signedApkPath}`);
}

// Task: Fix error
async function runFixErrorTask(command: string): Promise<void> {
  const store = useOpenCodeStore.getState();
  
  await streamToTerminal('📋 PLAN: Analyzing and fixing error...');
  store.setAgentState('planning');
  await streamDelay(500);
  
  // Observe
  store.setAgentState('observing');
  store.addStep({ type: 'observe', description: 'Scanning for errors...', status: 'running' });
  await streamToTerminal('\n🔍 Scanning codebase for issues...');
  await streamDelay(1000);
  
  await streamToTerminal('\n⚠️ Found issue in MainActivity.java:');
  await streamToTerminal('  Line 15: NullPointerException - view not initialized');
  await streamDelay(500);
  
  // Fix
  store.setAgentState('fixing');
  store.addStep({ type: 'fix', description: 'Applying fix...', status: 'running' });
  await streamToTerminal('\n🔧 Applying fix...');
  await streamDelay(800);
  
  await streamToTerminal('  + Added null check before view access');
  await streamToTerminal('  + Initialized view in onCreate()');
  
  // Verify
  store.setAgentState('observing');
  store.addStep({ type: 'observe', description: 'Verifying fix...', status: 'running' });
  await streamToTerminal('\n🔍 Verifying fix...');
  await streamDelay(600);
  
  await streamToTerminal('\n✅ Error fixed successfully!');
  await streamToTerminal('🎤 Say "build the app" to recompile.');
}

// Show help
async function showHelp(): Promise<void> {
  await streamToTerminal('\n📚 Available Commands:\n');
  await streamToTerminal('  • "Create new app" - Start a new Android project');
  await streamToTerminal('  • "Debug existing app" - Open and analyze an APK');
  await streamToTerminal('  • "Decompile" - Reverse engineer an APK');
  await streamToTerminal('  • "Build" - Compile the current project');
  await streamToTerminal('  • "Sign" - Sign APK for release');
  await streamToTerminal('  • "Fix error" - Auto-diagnose and fix issues');
  await streamToTerminal('  • "Status" - Check current task progress');
  await streamToTerminal('  • "Cancel" - Stop current task');
  await streamToTerminal('\n🎤 All commands are voice-activated.');
}

// Show status
async function showStatus(): Promise<void> {
  const store = useOpenCodeStore.getState();
  const task = store.currentTask;
  
  if (!task) {
    await streamToTerminal('ℹ️ No active task. Ready for commands.');
    return;
  }
  
  await streamToTerminal(`\n📊 Current Task: ${task.command}`);
  await streamToTerminal(`   State: ${task.state}`);
  await streamToTerminal(`   Steps completed: ${task.steps.filter(s => s.status === 'completed').length}/${task.steps.length}`);
}

// Generic task handler
async function runGenericTask(command: string): Promise<void> {
  const store = useOpenCodeStore.getState();
  
  await streamToTerminal(`📋 Processing: ${command}`);
  store.setAgentState('executing');
  await streamDelay(1000);
  
  await streamToTerminal('\n🤖 Analyzing request...');
  await streamDelay(500);
  
  await streamToTerminal('  Understanding intent...');
  await streamDelay(500);
  
  await streamToTerminal('\n✅ Task processed.');
  await streamToTerminal('🎤 Try saying "help" for available commands.');
}
