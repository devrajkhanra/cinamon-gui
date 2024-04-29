// userConfig.ts

import * as fs from "fs";
import * as path from "path";
import { OperatingSystem } from "../environment";

// Define an interface for the user configuration
export interface UserConfig {
  operatingSystem: OperatingSystem;
  homeDirectory: string;
  folder: {
    data: boolean;
    subfolders: { [stock: string]: boolean; indice: boolean; nifty: boolean };
  };
}

// Define an interface for the user config module
export interface UserConfigModule {
  saveUserConfig: (config: UserConfig) => void;
}

// Implement the user config module
const userConfigModule: UserConfigModule = {
  saveUserConfig: (config: UserConfig) => {
    const dataFolder = path.join(config.homeDirectory, "data");

    // Create the Data folder if it doesn't exist
    if (!fs.existsSync(dataFolder)) {
      fs.mkdirSync(dataFolder);
    }

    const configFile = path.join(dataFolder, "userConfig.json");

    // Save the user configuration to the JSON file
    const jsonData = JSON.stringify(config, null, 2);
    try {
      // Write user configuration to file
      fs.writeFileSync(configFile, jsonData);
      console.log("User configuration saved to:", configFile);
      return true; // Indicates successful saving
    } catch (error) {
      throw new Error("Failed to save user configuration"); // Indicates failure in saving
    }
  },
};

export default userConfigModule;
