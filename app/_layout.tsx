import "@/global.css";
import { persistor, store } from "@/state/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import colors from "tailwindcss/colors";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const screenOptions: NativeStackNavigationOptions =
    colorScheme === "light"
      ? {
          headerTintColor: colors.black,
          headerStyle: {
            backgroundColor: colors.white,
          },
        }
      : {
          headerTintColor: colors.white,
          headerStyle: {
            backgroundColor: colors.black,
          },
        };

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <PersistGate persistor={persistor}>
            <SafeAreaView className="flex-1">
              <Stack screenOptions={screenOptions}>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="pinPokeSelect"
                  options={{
                    headerShown: true,
                    title: "Add Pin",
                    presentation: "modal",
                  }}
                />
              </Stack>
            </SafeAreaView>
          </PersistGate>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
