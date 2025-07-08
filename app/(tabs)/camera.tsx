import { PokeImage } from "@/components/PokeImage";
import { TextButton } from "@/components/ui/Button";
import { useAppSelector } from "@/state/hooks";
import { PlatformPressable } from "@react-navigation/elements";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ArrowUturnLeftIcon } from "react-native-heroicons/solid";
import {
  Camera,
  CameraPosition,
  runAsync,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";
import {
  Face,
  useFaceDetector,
} from "react-native-vision-camera-face-detector";
import { Worklets } from "react-native-worklets-core";
import colors from "tailwindcss/colors";

export default function CameraLayout() {
  const { colorScheme } = useColorScheme();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>("front");
  const cameraDevice = useCameraDevice(cameraPosition);
  const cameraFormat = useCameraFormat(cameraDevice, [{ fps: 10 }]);
  const { detectFaces } = useFaceDetector({ minFaceSize: 0.05 });
  const [facePos, setFacePos] = useState<[x: number, y: number] | undefined>();
  const favPokeName = useAppSelector((state) => state.favPoke.name);

  const onGrantPress = async () => {
    await requestPermission();
  };

  const swapCamera = () => {
    if (cameraPosition === "front") {
      setCameraPosition("back");
    } else {
      setCameraPosition("front");
    }
  };

  const handleFaces = Worklets.createRunOnJS((faces: Face[]) => {
    // console.log("Detected faces: ", faces);
    for (const face of faces) {
      const { x, y, width, height } = face.bounds;
      const centerX = x + (-1 * width) / 2 - 0 * 50;
      const centerY = y + (-1 * height) / 2 - 0 * 50;
      console.log(`Face at (${x}, ${y}) --> (${centerX}, ${centerY})`);
      setFacePos([centerX, centerY]);
    }
  });

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      runAsync(frame, () => {
        "worklet";
        const faces = detectFaces(frame);
        handleFaces(faces);
      });
    },
    [handleFaces]
  );

  if (!hasPermission) {
    return (
      <View className="h-full p-5 flex-col justify-center dark:bg-black">
        <Text className="text-center text-xl font-bold dark:text-white">
          Permission needed to use the camera.
        </Text>
        <TextButton className="mt-5" onPress={onGrantPress}>
          Grant permission
        </TextButton>
      </View>
    );
  }

  if (cameraDevice === undefined) {
    return (
      <View className="h-full p-5 flex-col justify-center dark:bg-black">
        <Text className="text-center text-xl font-bold dark:text-white">
          No camera found
        </Text>
      </View>
    );
  }

  return (
    <View className="dark:bg-black" style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={cameraDevice}
        isActive={true}
        frameProcessor={frameProcessor}
        fps={20}
        format={cameraFormat}
      />
      {favPokeName && (
        <View
          style={{
            position: "absolute",
            bottom: facePos?.[1],
            right: facePos?.[0],
          }}
        >
          <PokeImage pokemonName={favPokeName} />
        </View>
      )}
      <PlatformPressable
        android_ripple={{ foreground: true }}
        style={{
          position: "absolute",
          zIndex: 2,
        }}
        className="overflow-hidden absolute right-5 bottom-5 py-3 px-4 rounded-full bg-zinc-50 dark:bg-zinc-800"
        onPress={swapCamera}
      >
        <ArrowUturnLeftIcon
          size={24}
          color={colorScheme === "light" ? colors.black : colors.white}
        />
      </PlatformPressable>
    </View>
  );
}
