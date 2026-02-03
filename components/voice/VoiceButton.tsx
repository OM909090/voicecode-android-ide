/**
 * VoiceButton - Main voice activation button
 * Press to speak, shows voice state
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { terminalColors, terminalSpacing, terminalBorderRadius, terminalTypography } from '@/constants/terminal-design';
import { VoiceIndicator } from './VoiceIndicator';
import type { VoiceState } from '@/lib/opencode/types';

interface VoiceButtonProps {
  state: VoiceState;
  transcript?: string;
  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
}

export function VoiceButton({
  state,
  transcript,
  onPress,
  onLongPress,
  disabled,
}: VoiceButtonProps) {
  const isActive = state === 'listening' || state === 'processing';
  
  const getStatusText = () => {
    switch (state) {
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'speaking':
        return 'Speaking...';
      case 'error':
        return 'Error. Tap to retry.';
      default:
        return 'Tap to speak';
    }
  };
  
  const getIconName = () => {
    switch (state) {
      case 'listening':
        return 'mic';
      case 'processing':
        return 'sync';
      case 'speaking':
        return 'volume-high';
      case 'error':
        return 'warning';
      default:
        return 'mic-outline';
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Voice indicator */}
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          isActive && styles.buttonActive,
          pressed && styles.buttonPressed,
          disabled && styles.buttonDisabled,
        ]}
      >
        <VoiceIndicator state={state} size="lg" />
        
        {/* Icon overlay */}
        <View style={styles.iconOverlay}>
          <Ionicons
            name={getIconName()}
            size={28}
            color={isActive ? terminalColors.text : terminalColors.textMuted}
          />
        </View>
      </Pressable>
      
      {/* Status text */}
      <Text style={styles.statusText}>{getStatusText()}</Text>
      
      {/* Transcript preview */}
      {transcript && state === 'listening' && (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcript} numberOfLines={2}>
            "{transcript}"
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: terminalSpacing.md,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: terminalColors.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: terminalColors.border,
  },
  buttonActive: {
    borderColor: terminalColors.voiceListening,
    backgroundColor: terminalColors.backgroundTertiary,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  iconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    ...terminalTypography.caption,
    color: terminalColors.textMuted,
    textAlign: 'center',
  },
  transcriptContainer: {
    backgroundColor: terminalColors.backgroundInput,
    paddingHorizontal: terminalSpacing.md,
    paddingVertical: terminalSpacing.sm,
    borderRadius: terminalBorderRadius.md,
    maxWidth: 280,
  },
  transcript: {
    ...terminalTypography.body,
    color: terminalColors.text,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
