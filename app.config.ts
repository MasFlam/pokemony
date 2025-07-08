import { ConfigContext, ExpoConfig } from "@expo/config";
import * as dotenv from "dotenv";

dotenv.config();

export default ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const cfg = { ...config };
  cfg.android!.config!.googleMaps!.apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  return cfg;
};
