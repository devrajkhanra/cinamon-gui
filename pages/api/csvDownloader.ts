import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import environment from "@/utils/environment";
import userConfigModule, { UserConfig } from "@/utils/userConfig";
import folderGeneratorModule from "@/utils/folder";
import downloadCsvFile from "@/utils/downloader";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { value } = req.body;
    if (typeof value !== "undefined") {
      // Do something with the value
      console.log("Received value:", dayjs(value).format("DDMMYYYY"));
      const date = dayjs(value).format("DDMMYYYY");
      const userEnvironment = environment.detectUserEnvironment();

      if (userEnvironment) {
        const [userOS, homeDirectory] = userEnvironment;
        const data: boolean = fs.existsSync(path.join(homeDirectory, "data"));

        // Save user configuration to a JSON file
        if (!data) {
          const userConfig: UserConfig = {
            operatingSystem: userOS,
            homeDirectory,
            folder: {
              data: true,
              subfolders: {
                stock: false,
                indice: false,
                nifty: false,
              },
            },
          };

          await userConfigModule.saveUserConfig(userConfig);

          // Generate folders based on the user configuration
          await folderGeneratorModule.generateFolders(userConfig);
        } else {
          await downloadCsvFile(
            `https://archives.nseindia.com/content/indices/ind_close_all_${date}.csv`,
            `${homeDirectory}/data/subfolders/indice`,
            `ind_close_all_${date}`,
            date
          );
          await downloadCsvFile(
            `https://archives.nseindia.com/products/content/sec_bhavdata_full_${date}.csv`,
            `${homeDirectory}/data/subfolders/stock`,
            `sec_bhavdata_full_${date}`,
            date
          );

          await downloadCsvFile(
            `https://archives.nseindia.com/content/indices/ind_nifty50list.csv`,
            `${homeDirectory}/data/subfolders/nifty`,
            "ind_nifty50list"
          );
          await downloadCsvFile(
            `https://archives.nseindia.com/content/indices/ind_niftynext50list.csv`,
            `${homeDirectory}/data/subfolders/nifty`,
            "ind_niftynext50list"
          );
          await downloadCsvFile(
            `https://archives.nseindia.com/content/indices/ind_niftymidcap50list.csv`,
            `${homeDirectory}/data/subfolders/nifty`,
            "ind_niftymidcap50list"
          );
          await downloadCsvFile(
            `https://archives.nseindia.com/content/indices/ind_niftysmallcap50list.csv`,
            `${homeDirectory}/data/subfolders/nifty`,
            "ind_niftysmallcap50list"
          );
          await downloadCsvFile(
            `https://archives.nseindia.com/content/indices/ind_nifty500list.csv`,
            `${homeDirectory}/data/subfolders/nifty`,
            "ind_nifty500list"
          );

          res.status(200).json({ message: "Success" });
        }
      } else {
        // Handle the case when the operating system is unsupported
        console.error(
          "Exiting application due to unsupported operating system."
        );

        res.status(400).json({ error: "error" });
      }
    } else {
      res.status(400).json({ error: "Value is missing in the request body" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

// downloadCsvFile(
//   `https://archives.nseindia.com/content/indices/ind_nifty50list.csv`,
//   `${homeDirectory}/data/subfolders/nifty`,
//   "ind_nifty50list"
// );
// downloadCsvFile(
//   `https://archives.nseindia.com/content/indices/ind_niftynext50list.csv`,
//   `${homeDirectory}/data/subfolders/nifty`,
//   "ind_niftynext50list"
// );
// downloadCsvFile(
//   `https://archives.nseindia.com/content/indices/ind_niftymidcap50list.csv`,
//   `${homeDirectory}/data/subfolders/nifty`,
//   "ind_niftymidcap50list"
// );
// downloadCsvFile(
//   `https://archives.nseindia.com/content/indices/ind_niftysmallcap50list.csv`,
//   `${homeDirectory}/data/subfolders/nifty`,
//   "ind_niftysmallcap50list"
// );
// downloadCsvFile(
//   `https://archives.nseindia.com/content/indices/ind_nifty500list.csv`,
//   `${homeDirectory}/data/subfolders/nifty`,
//   "ind_nifty500list"
// );
// // FNO List
// downloadCsvFile(
//   `https://archives.nseindia.com/content/fo/fo_mktlots.csv`,
//   `${homeDirectory}/data/subfolders/nifty`,
//   "ind_niftyfnolist"
// );
