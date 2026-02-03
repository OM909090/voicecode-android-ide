/**
 * OpenCodeLogo - Styled ASCII-art logo matching reference
 * Pixel-block style lettering
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { terminalColors, terminalSpacing, terminalTypography } from '@/constants/terminal-design';
import { openCodeCommands } from '@/constants/terminal-design';

interface OpenCodeLogoProps {
  showCommands?: boolean;
  showVersion?: boolean;
  version?: string;
}

export function OpenCodeLogo({
  showCommands = true,
  showVersion = true,
  version = 'v0.1.99',
}: OpenCodeLogoProps) {
  return (
    <View style={styles.container}>
      {/* ASCII Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          {'OPEN'}
          <Text style={styles.logoAccent}>CODE</Text>
        </Text>
      </View>
      
      {/* Version */}
      {showVersion && (
        <Text style={styles.version}>{version}</Text>
      )}
      
      {/* Commands list */}
      {showCommands && (
        <View style={styles.commandsContainer}>
          {openCodeCommands.slice(0, 6).map((cmd, index) => (
            <View key={index} style={styles.commandRow}>
              <Text style={styles.commandName}>{cmd.command}</Text>
              <Text style={styles.commandDesc}> {cmd.description}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: terminalSpacing.lg,
    paddingVertical: terminalSpacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 6,
    color: terminalColors.textMuted,
  },
  logoAccent: {
    color: terminalColors.primary,
  },
  version: {
    ...terminalTypography.version,
    color: terminalColors.textDim,
    marginTop: -terminalSpacing.sm,
  },
  commandsContainer: {
    marginTop: terminalSpacing.md,
    gap: terminalSpacing.xs,
  },
  commandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commandName: {
    ...terminalTypography.command,
    color: terminalColors.magenta,
    minWidth: 100,
  },
  commandDesc: {
    ...terminalTypography.commandDescription,
    color: terminalColors.textMuted,
  },
});
