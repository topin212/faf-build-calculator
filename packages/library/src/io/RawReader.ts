export class Reader {
  /**
   *  This class reads raw data from the filename argument and stores result in JSON format in the `rawData` field
   */
  public jsonData: any

  constructor(rawData: string) {
    this.jsonData = JSON.parse(rawData)
  }
}