import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

interface FunctionCardProps {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  buttonText: string;
  href: string;
  iconColor?: string;
}

export function FunctionCard({
  title,
  description,
  iconName,
  buttonText,
  href,
  iconColor = "#0D9488",
}: FunctionCardProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  return (
    <View style={isMobile ? styles.cardMobile : styles.card}>
      {/* Icon */}
      <View
        style={
          isMobile
            ? {
                ...styles.iconContainerMobile,
                backgroundColor: `${iconColor}15`,
              }
            : { ...styles.iconContainer, backgroundColor: `${iconColor}15` }
        }
      >
        <Ionicons name={iconName} size={isMobile ? 36 : 45} color={iconColor} />
      </View>

      {/* Title */}
      <Text style={isMobile ? styles.cardTitleMobile : styles.cardTitle}>
        {title}
      </Text>

      {/* Description */}
      <Text
        style={isMobile ? styles.cardDescriptionMobile : styles.cardDescription}
      >
        {description}
      </Text>

      {/* Button */}
      <Link href={href as any} asChild>
        <TouchableOpacity
          style={{ ...styles.cardButton, backgroundColor: iconColor }}
          activeOpacity={0.8}
        >
          <Text style={styles.cardButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 35,
    width: 300,
    minHeight: 380,
    alignItems: "center",
    justifyContent: "flex-start",
    margin: 15,
  },
  cardMobile: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 14,
  },

  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  iconContainerMobile: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D4C73",
    textAlign: "center",
    marginBottom: 15,
  },
  cardTitleMobile: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#0D4C73",
    textAlign: "center",
    marginBottom: 10,
  },

  cardDescription: {
    fontSize: 14,
    color: "#5A8CA8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  cardDescriptionMobile: {
    fontSize: 13,
    color: "#5A8CA8",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  cardButton: {
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
    marginTop: "auto",
  },

  cardButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
export default FunctionCard;
