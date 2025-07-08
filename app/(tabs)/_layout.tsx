import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import * as Outline from "react-native-heroicons/outline";
import * as Solid from "react-native-heroicons/solid";
import colors from "tailwindcss/colors";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();

  const screenOptions: BottomTabNavigationOptions =
    colorScheme === "light"
      ? {
          tabBarActiveTintColor: colors.gray[700],
          tabBarInactiveTintColor: colors.gray[400],
          headerTintColor: colors.black,
          tabBarStyle: {
            backgroundColor: colors.white,
          },
          headerStyle: {
            backgroundColor: colors.white,
          },
        }
      : {
          tabBarActiveTintColor: colors.gray[200],
          tabBarInactiveTintColor: colors.gray[400],
          headerTintColor: colors.white,
          tabBarStyle: {
            backgroundColor: colors.black,
          },
          headerStyle: {
            backgroundColor: colors.black,
          },
        };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => {
            if (focused) {
              return <Solid.HomeIcon size={28} color={color} />;
            } else {
              return <Outline.HomeIcon size={28} color={color} />;
            }
          },
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ focused, color }) => {
            if (focused) {
              return <Solid.CameraIcon size={28} color={color} />;
            } else {
              return <Outline.CameraIcon size={28} color={color} />;
            }
          },
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused, color }) => {
            if (focused) {
              return <Solid.MapIcon size={28} color={color} />;
            } else {
              return <Outline.MapIcon size={28} color={color} />;
            }
          },
        }}
      />
    </Tabs>
  );
}
