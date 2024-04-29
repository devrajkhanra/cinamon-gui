import * as fs from "fs";
import * as path from "path";
import axios from "axios";

interface DownloadedFile {
  fileName: string;
  date: string;
}

const downloadCsvFile = async (
  url: string,
  folderPath: string,
  fileName: string,
  date: string = getCurrentDate()
): Promise<void> => {
  try {
    const response = await axios.get(url);
    const file = `${fileName}.csv`;
    const filePath = path.join(folderPath, file);

    // Write file asynchronously
    await fs.promises.writeFile(filePath, response.data);
    console.log(`File downloaded successfully: ${filePath}`);
    updateDownloadedFilesList(folderPath, file, date);
  } catch (error: any) {
    console.error(`Error downloading file from ${url}: ${error.message}`);
    throw new Error(`Failed to download file from ${url}`);
  }
};

const updateDownloadedFilesList = (
  folderPath: string,
  fileName: string,
  date: string
): void => {
  try {
    const jsonFilePath = path.join(folderPath, "downloadedFiles.json");
    let downloadedFiles: DownloadedFile[] = [];

    if (fs.existsSync(jsonFilePath)) {
      const jsonFileContent = fs.readFileSync(jsonFilePath, "utf-8");
      downloadedFiles = JSON.parse(jsonFileContent);
    }

    const newEntry: DownloadedFile = { fileName, date };

    const existingEntryIndex = downloadedFiles.findIndex(
      (entry) => entry.fileName === fileName
    );

    if (existingEntryIndex !== -1) {
      downloadedFiles[existingEntryIndex].date = date;
    } else {
      downloadedFiles.push(newEntry);
    }

    // Write file asynchronously
    fs.promises.writeFile(
      jsonFilePath,
      JSON.stringify(downloadedFiles, null, 2)
    );
    console.log(`Updated downloaded files list: ${jsonFilePath}`);
  } catch (error: any) {
    console.error(`Error updating downloaded files list: ${error.message}`);
  }
};

const getCurrentDate = (): string => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export default downloadCsvFile;
