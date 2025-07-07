import { Tabs } from "expo-router";
import * as Outline from "react-native-heroicons/outline";
import * as Solid from "react-native-heroicons/solid";
import colors from "tailwindcss/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gray["700"],
        // headerRight: () => (
        //   <View className="p-5">
        //     <Link href="/settings">
        //       <Outline.Cog6ToothIcon size={28} />
        //     </Link>
        //   </View>
        // ),
      }}
    >
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
