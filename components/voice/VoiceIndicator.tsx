/**
 * VoiceIndicator - Animated voice status indicator
 * Shows listening/processing/speaking states
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { terminalColors, terminalAnimations } from '@/constants/terminal-design';
import type { VoiceState } from '@/lib/opencode/types';

interface VoiceIndicatorProps {
  state: VoiceState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: { outer: 32, inner: 20, dot: 8 },
  md: { outer: 48, inner: 32, dot: 12 },
  lg: { outer: 80, inner: 56, dot: 20 },
  xl: { outer: 120, inner: 88, dot: 32 },
};

export function VoiceIndicator({ state, size = 'md' }: VoiceIndicatorProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;
  
  const dimensions = sizes[size];
  
  // Get color based on state
  const getColor = () => {
    switch (state) {
      case 'listening':
        return terminalColors.voiceListening;
      case 'processing':
        return terminalColors.voiceProcessing;
      case 'speaking':
        return terminalColors.voiceActive;
      case 'error':
        return terminalColors.voiceError;
      default:
        return terminalColors.textMuted;
    }
  };
  
  useEffect(() => {
    // Reset animations
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
    
    if (state === 'listening') {
      // Pulsing animation for listening
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: terminalAnimations.voicePulse / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: terminalAnimations.voicePulse / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Opacity animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: terminalAnimations.voicePulse / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: terminalAnimations.voicePulse / 2,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (state === 'processing') {
      // Rotating animation for processing
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else if (state === 'speaking') {
      // Faster pulse for speaking
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    
    return () => {
      pulseAnim.stopAnimation();
      rotateAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [state]);
  
  const color = getColor();
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <View style={[styles.container, { width: dimensions.outer, height: dimensions.outer }]}>
      {/* Outer ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            width: dimensions.outer,
            height: dimensions.outer,
            borderRadius: dimensions.outer / 2,
            borderColor: color,
            transform: [{ scale: pulseAnim }, { rotate: state === 'processing' ? spin : '0deg' }],
            opacity: opacityAnim,
          },
        ]}
      />
      
      {/* Inner circle */}
      <Animated.View
        style={[
          styles.innerCircle,
          {
            width: dimensions.inner,
            height: dimensions.inner,
            borderRadius: dimensions.inner / 2,
            backgroundColor: color,
            transform: [{ scale: state === 'speaking' ? pulseAnim : 1 }],
            opacity: state === 'inactive' ? 0.3 : 0.2,
          },
        ]}
      />
      
      {/* Center dot */}
      <View
        style={[
          styles.centerDot,
          {
            width: dimensions.dot,
            height: dimensions.dot,
            borderRadius: dimensions.dot / 2,
            backgroundColor: state === 'inactive' ? terminalColors.textMuted : color,
          },
        ]}
      />
      
      {/* Processing segments */}
      {state === 'processing' && (
        <Animated.View
          style={[
            styles.processingRing,
            {
              width: dimensions.outer - 8,
              height: dimensions.outer - 8,
              borderRadius: (dimensions.outer - 8) / 2,
              borderColor: color,
              transform: [{ rotate: spin }],
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'solid',
  },
  innerCircle: {
    position: 'absolute',
  },
  centerDot: {},
  processingRing: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
