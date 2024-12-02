export interface Config {
    accessDriver: string;
    accessFile: string;
    store: string;
    showScanButton: boolean;
    scanner: {
        host: string,
        port: number,
        mdbReaderLoc: string
    };
}
