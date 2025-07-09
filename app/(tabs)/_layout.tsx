import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { Link, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import * as Outline from "react-native-heroicons/outline";
import * as Solid from "react-native-heroicons/solid";
import colors from "tailwindcss/colors";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const [assets] = useAssets([require("@/assets/images/Pokemon-Logo.png")]);

  const headerLogoFn = () => (
    <Link href="/">
      <Image
        source={assets![0]}
        style={{ width: 100, height: 40 }}
        className="mr-4"
      />
    </Link>
  );

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
          headerRight: headerLogoFn,
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
          headerRight: headerLogoFn,
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
