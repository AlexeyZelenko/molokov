import { storage } from "@/firebase/config";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import compressWithCompressor from "@/service/Compressor";

export default class FileUploader {
    static async uploadFile(file, path = "properties/") {
        try {
            if (!file) throw new Error("No file provided");

            if (file.size > 10 * 1024 * 1024) {
                throw new Error("File size exceeds limit of 10MB");
            }

            const compressedFile = await compressWithCompressor(file);
            const fileRef = storageRef(storage, `${path}${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(fileRef, compressedFile);
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error("File upload error:", error);
            throw error;
        }
    }
}
