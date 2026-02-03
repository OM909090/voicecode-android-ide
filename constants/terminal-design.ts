/**
 * Terminal Design System for VoiceCode Android IDE
 * Dark, futuristic aesthetic matching OpenCode interface
 */

// Terminal color palette
export const terminalColors = {
  // Background hierarchy
  background: '#1A1B26', // Main terminal background (dark navy)
  backgroundSecondary: '#16161E', // Deeper background
  backgroundTertiary: '#1F2335', // Elevated surfaces
  backgroundInput: '#24283B', // Input field background
  
  // Text hierarchy
  text: '#A9B1D6', // Primary text (soft blue-white)
  textBright: '#C0CAF5', // Bright text
  textMuted: '#565F89', // Muted text
  textDim: '#3B4261', // Dim text
  
  // Accent colors
  primary: '#7AA2F7', // Primary accent (blue)
  primaryDark: '#5A7BD4',
  secondary: '#9ECE6A', // Success/positive (green)
  accent: '#BB9AF7', // Highlight (purple)
  
  // Semantic colors
  success: '#9ECE6A',
  error: '#F7768E',
  warning: '#E0AF68',
  info: '#7DCFFF',
  
  // Special colors
  cyan: '#7DCFFF',
  magenta: '#BB9AF7',
  yellow: '#E0AF68',
  green: '#9ECE6A',
  red: '#F7768E',
  orange: '#FF9E64',
  
  // Border colors
  border: '#292E42',
  borderLight: '#3B4261',
  borderBright: '#545C7E',
  
  // Voice indicator colors
  voiceActive: '#7AA2F7',
  voiceListening: '#9ECE6A',
  voiceProcessing: '#E0AF68',
  voiceError: '#F7768E',
  
  // Overlay
  overlay: 'rgba(26, 27, 38, 0.95)',
  overlayLight: 'rgba(26, 27, 38, 0.8)',
};

// Terminal-specific spacing
export const terminalSpacing = {
  // Padding scales
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  
  // Component-specific
  inputPadding: 16,
  cardPadding: 16,
  screenPadding: 16,
  sectionGap: 24,
};

// Terminal typography (monospace-focused)
export const terminalTypography = {
  logo: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 4,
    fontFamily: 'monospace',
  },
  version: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: 'monospace',
  },
  command: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  commandDescription: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  input: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: 'monospace',
    lineHeight: 24,
  },
  output: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  status: {
    fontSize: 12,
    fontWeight: '500' as const,
    fontFamily: 'monospace',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 1,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  voiceText: {
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 28,
  },
};

// Border radius for terminal aesthetic
export const terminalBorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Animation constants
export const terminalAnimations = {
  cursorBlink: 530,
  fadeIn: 200,
  fadeOut: 150,
  slideIn: 300,
  ripple: 400,
  voicePulse: 1500,
};

// OpenCode commands
export const openCodeCommands = [
  { command: '/help', description: 'show help' },
  { command: '/sessions', description: 'list sessions' },
  { command: '/new', description: 'start a new session' },
  { command: '/model', description: 'switch model' },
  { command: '/theme', description: 'switch theme' },
  { command: '/exit', description: 'exit the app' },
  { command: '/voice', description: 'toggle voice mode' },
  { command: '/apk', description: 'manage APK files' },
  { command: '/build', description: 'build current project' },
  { command: '/decompile', description: 'decompile APK' },
];

// Voice command intents
export const voiceIntents = {
  CREATE_PROJECT: 'create_project',
  DEBUG_APP: 'debug_app',
  DECOMPILE: 'decompile',
  BUILD: 'build',
  SIGN: 'sign',
  FIX_ERROR: 'fix_error',
  HELP: 'help',
  STATUS: 'status',
  CANCEL: 'cancel',
  CONFIRM: 'confirm',
} as const;

// MCP Server tools
export const mcpTools = {
  'android.shell.exec': 'Execute shell commands',
  'android.fs.read': 'Read file system',
  'android.fs.write': 'Write to file system',
  'android.apk.decompile': 'Decompile APK using apktool/jadx',
  'android.apk.compile': 'Compile APK',
  'android.apk.sign': 'Sign APK with apksigner',
  'android.gradle.run': 'Run Gradle tasks',
} as const;
