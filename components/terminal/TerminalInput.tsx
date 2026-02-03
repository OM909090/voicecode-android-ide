/**
 * TerminalInput - OpenCode-style command input
 * With blinking cursor and submit functionality
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { terminalColors, terminalSpacing, terminalBorderRadius, terminalTypography, terminalAnimations } from '@/constants/terminal-design';

interface TerminalInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  showVoiceButton?: boolean;
  onVoicePress?: () => void;
  voiceActive?: boolean;
}

export function TerminalInput({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Type a command...',
  disabled,
  showVoiceButton,
  onVoicePress,
  voiceActive,
}: TerminalInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);
  
  // Blinking cursor animation
  useEffect(() => {
    if (isFocused && !value) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(cursorOpacity, {
            toValue: 0,
            duration: terminalAnimations.cursorBlink,
            easing: Easing.step0,
            useNativeDriver: true,
          }),
          Animated.timing(cursorOpacity, {
            toValue: 1,
            duration: terminalAnimations.cursorBlink,
            easing: Easing.step0,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isFocused, value]);
  
  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit();
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Input area */}
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        {/* Prompt */}
        <Text style={styles.prompt}>{'>'}</Text>
        
        {/* Text input */}
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={handleSubmit}
            placeholder={placeholder}
            placeholderTextColor={terminalColors.textDim}
            editable={!disabled}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          
          {/* Blinking cursor when empty and focused */}
          {isFocused && !value && (
            <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
          )}
        </View>
        
        {/* Voice button */}
        {showVoiceButton && (
          <Pressable
            onPress={onVoicePress}
            style={({ pressed }) => [
              styles.voiceButton,
              voiceActive && styles.voiceButtonActive,
              pressed && styles.buttonPressed,
            ]}
          >
            <Ionicons
              name={voiceActive ? 'mic' : 'mic-outline'}
              size={20}
              color={voiceActive ? terminalColors.voiceListening : terminalColors.textMuted}
            />
          </Pressable>
        )}
      </View>
      
      {/* Footer hints */}
      <View style={styles.footer}>
        <Text style={styles.hint}>
          <Text style={styles.hintKey}>enter</Text> send
        </Text>
        <View style={styles.modelInfo}>
          <Text style={styles.modelProvider}>Anthropic</Text>
          <Text style={styles.modelName}> Claude 4 Sonnet</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: terminalSpacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: terminalColors.backgroundInput,
    borderRadius: terminalBorderRadius.md,
    paddingHorizontal: terminalSpacing.md,
    paddingVertical: terminalSpacing.md,
    borderWidth: 1,
    borderColor: terminalColors.border,
    gap: terminalSpacing.sm,
  },
  inputContainerFocused: {
    borderColor: terminalColors.primary,
  },
  prompt: {
    ...terminalTypography.input,
    color: terminalColors.primary,
    fontWeight: '600',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    ...terminalTypography.input,
    color: terminalColors.text,
    padding: 0,
    margin: 0,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
    }),
  },
  cursor: {
    width: 8,
    height: 18,
    backgroundColor: terminalColors.primary,
    marginLeft: 2,
  },
  voiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: terminalColors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonActive: {
    backgroundColor: terminalColors.voiceListening + '30',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: terminalSpacing.xs,
  },
  hint: {
    ...terminalTypography.caption,
    color: terminalColors.textDim,
  },
  hintKey: {
    color: terminalColors.textMuted,
    fontWeight: '500',
  },
  modelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelProvider: {
    ...terminalTypography.caption,
    color: terminalColors.textDim,
  },
  modelName: {
    ...terminalTypography.caption,
    color: terminalColors.cyan,
    fontWeight: '500',
  },
});
