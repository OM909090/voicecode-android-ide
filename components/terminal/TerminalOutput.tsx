/**
 * TerminalOutput - Displays terminal/agent output lines
 * Color-coded by type with scrolling
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { terminalColors, terminalSpacing, terminalTypography } from '@/constants/terminal-design';
import type { TerminalLine, OutputType } from '@/lib/opencode/types';

interface TerminalOutputProps {
  lines: TerminalLine[];
  maxHeight?: number;
}

const getLineColor = (type: OutputType): string => {
  switch (type) {
    case 'command':
      return terminalColors.primary;
    case 'success':
      return terminalColors.success;
    case 'error':
      return terminalColors.error;
    case 'warning':
      return terminalColors.warning;
    case 'system':
      return terminalColors.cyan;
    case 'agent':
      return terminalColors.text;
    default:
      return terminalColors.textMuted;
  }
};

const getLinePrefix = (type: OutputType): string => {
  switch (type) {
    case 'command':
      return '';
    case 'success':
      return '';
    case 'error':
      return '';
    case 'warning':
      return '';
    case 'system':
      return '';
    case 'agent':
      return '';
    default:
      return '';
  }
};

function TerminalLineItem({ line }: { line: TerminalLine }) {
  const color = getLineColor(line.type);
  const prefix = getLinePrefix(line.type);
  
  return (
    <View style={styles.lineContainer}>
      <Text style={[styles.lineText, { color }]}>
        {prefix}{line.content}
        {line.isStreaming && <Text style={styles.cursor}>▊</Text>}
      </Text>
    </View>
  );
}

export function TerminalOutput({ lines, maxHeight }: TerminalOutputProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Auto-scroll to bottom on new lines
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [lines.length]);
  
  return (
    <ScrollView
      ref={scrollViewRef}
      style={[styles.container, maxHeight ? { maxHeight } : undefined]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={true}
    >
      {lines.map((line) => (
        <TerminalLineItem key={line.id} line={line} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: terminalSpacing.md,
    gap: terminalSpacing.xs,
  },
  lineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lineText: {
    ...terminalTypography.output,
    color: terminalColors.text,
  },
  cursor: {
    color: terminalColors.primary,
    marginLeft: 2,
  },
});
