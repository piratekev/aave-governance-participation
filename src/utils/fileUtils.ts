import * as fs from "fs";

export const writeDataToFile = async (fileName: string, data: any) => {
  fs.writeFileSync(fileName, JSON.stringify(data), "utf-8");
};

export const loadDataFromFile = (fileName: string) => {
  try {
    const fileStr = fs.readFileSync(fileName, "utf8");
    if (fileStr) {
      return new Map(JSON.parse(fileStr));
    }
  } catch (err) {
    return false;
  }
};
