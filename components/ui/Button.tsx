import { PlatformPressable } from "@react-navigation/elements";
import { Text } from "react-native";

export interface TextButtonProps {
  children?: string;
  className?: string;
  filled?: boolean;
  onPress?: () => void;
}

export function TextButton({
  children: text = "",
  className = "",
  filled = true,
  onPress = () => {},
}: TextButtonProps) {
  if (filled) {
    return (
      <PlatformPressable
        android_ripple={{ foreground: true }}
        className={`overflow-hidden rounded-full px-3 py-2 bg-gray-700 ${className}`}
        onPress={() => onPress()}
      >
        <Text className="text-center text-lg font-bold text-gray-100">
          {text}
        </Text>
      </PlatformPressable>
    );
  } else {
    return (
      <PlatformPressable
        android_ripple={{ foreground: true }}
        className={`overflow-hidden px-3 py-2 border rounded-full border-gray-300 ${className}`}
        onPress={() => onPress()}
      >
        <Text className="text-center text-lg font-bold">{text}</Text>
      </PlatformPressable>
    );
  }
}
