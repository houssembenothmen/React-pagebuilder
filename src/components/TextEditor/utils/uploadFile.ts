import { EditorMediaConfig } from "../config/editorConfigTypes";
import { getByPath } from "./objectPath";
import { joinUrl } from "./url";

type UploadConfig = Pick<
    EditorMediaConfig,
    "storageURL" | "uploadEndpoint" | "uploadToken" | "responseFilePaths"
>;
export async function uploadToExternalStorage(
    file: File,
    config: UploadConfig
): Promise<string> {
    const {
        storageURL = "",
        uploadEndpoint = "api/bo/content/upload/media",
        uploadToken,
        responseFilePaths = ["url", "media"],
    } = config;

    const formData = new FormData();
    formData.append("media", file);

    const res = await fetch(joinUrl(storageURL, uploadEndpoint), {
        method: "POST",
        body: formData,
        headers: uploadToken ? { Authorization: `Bearer ${uploadToken}` } : {},
    });

    if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
    }

    const data = await res.json();

    for (const path of responseFilePaths) {
        const value = getByPath(data, path);
        if (typeof value === "string" && value.length > 0) {
            return value.startsWith("http") ? value : `${storageURL}${value}`;
        }
    }

    throw new Error(
        `Upload response did not match any configured responseFilePaths: [${responseFilePaths.join(", ")}]`
    );
}