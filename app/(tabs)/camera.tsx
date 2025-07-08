import { PokeImage } from "@/components/PokeImage";
import { TextButton } from "@/components/ui/Button";
import { useAppSelector } from "@/state/hooks";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Camera,
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

export default function CameraLayout() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraDevice = useCameraDevice("back");
  const cameraFormat = useCameraFormat(cameraDevice, [{ fps: 10 }]);
  const { detectFaces } = useFaceDetector({ minFaceSize: 0.05 });
  const [facePos, setFacePos] = useState<[x: number, y: number] | undefined>();
  const favPokeName = useAppSelector((state) => state.favPoke.name);

  const onGrantPress = async () => {
    await requestPermission();
  };

  const handleFaces = Worklets.createRunOnJS((faces: Face[]) => {
    // console.log("Detected faces: ", faces);
    for (const face of faces) {
      const { x, y, width, height } = face.bounds;
      const centerX = x + (0 * width) / 2 - 50;
      const centerY = y + (0 * height) / 2 - 50;
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
        <Text className="text-center text-xl font-bold dark:text-white">{`Permission needed to use the camera.`}</Text>
        <TextButton
          className="mt-5"
          onPress={onGrantPress}
        >{`Grant permission`}</TextButton>
      </View>
    );
  }

  if (cameraDevice === undefined) {
    return (
      <View className="h-full p-5 flex-col justify-center dark:bg-black">
        <Text className="text-center text-xl font-bold dark:text-white">{`No camera found`}</Text>
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
        fps={10}
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
    </View>
  );
}
