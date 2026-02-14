import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ColorValue, StyleSheet, ViewStyle } from "react-native";

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: [ColorValue, ColorValue, ...ColorValue[]];
  style?: ViewStyle;
}

export function GradientBackground({
  children,
  colors = ["#0A3A5C", "#0D4C73", "#1A6FA0"],
  style,
}: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    minHeight: "100%",
  },
});

export default GradientBackground;
