import { download } from "thirdweb/storage";
import { createThirdwebClient } from "thirdweb";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

function createFolder(folderName) {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
        console.log(`Created folder: ${folderName}`);
    } else {
        console.log(`Folder already exists: ${folderName}`);
    }
}

async function downloadFiles() {
    const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID });
    // Create the folder you want the files to be saved too.
    const folderName = 'DownloadedFiles';

    createFolder(folderName);
    
    // baseUri for the folder with the assets you wish to download
    const baseUri = "ipfs://bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna/"; // We are downloading pudgy penguins here
    const fileURIs = [];

    // In this case, we want to download the first 50 json files for the collection, but you can do full 10k collections at once.
    for (let i = 1; i <= 50; i++) {
        fileURIs.push(`${baseUri}${i}`);
    }

    for (const uri of fileURIs) {
        try {
            const response = await download({
                client,
                uri: uri,
            });

            const fileData = await response.arrayBuffer();

            const fileName = path.basename(uri);
            const filePath = path.join(folderName, fileName);
            fs.writeFileSync(filePath, Buffer.from(fileData));
            console.log(`Downloaded and saved ${fileName} in ${folderName}`);
        } catch (error) {
            console.error(`Failed to download ${uri}:`, error);
        }
    }
}

downloadFiles().catch(console.error);