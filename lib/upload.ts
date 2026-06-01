const maxUploadSize = 8 * 1024 * 1024;

const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

export function validateUpload(file: File) {
  if (file.size > maxUploadSize) {
    throw new Error("File is too large. Maximum upload size is 8 MB.");
  }
  if (!allowedTypes.has(file.type)) {
    throw new Error("Unsupported file type. Upload PDF, DOC, DOCX, or TXT.");
  }
}

export async function storeUpload(file: File) {
  validateUpload(file);

  const buffer = Buffer.from(await file.arrayBuffer());
  const extractedText =
    file.type === "text/plain" ? buffer.toString("utf8") : null;

  return {
    fileName: file.name,
    filePath: `metadata-only/${file.name}`,
    fileType: file.type || "application/octet-stream",
    fileSize: file.size,
    extractedText,
  };
}
