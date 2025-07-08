import "@/global.css";
import { persistor, store } from "@/state/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <PersistGate persistor={persistor}>
            <SafeAreaView className="flex-1">
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
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
