import { useState, useRef } from "react";
import { toast } from "sonner";
import { stripExtension } from "@/lib/stripExtension";
import { isAllowedFile } from "@/lib/FileValidation/isAllowedFile";
import { useUploadAttachments } from "@/hooks/attachment/useUploadAttachments";

type FileType = {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
  file: File;
};

const MAX_FILES = 5;

export const useLocalUpload = (
  clientId?: number,
  onUploadStart?: () => void,
  onUploadEnd?: () => void
) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileType[]>([]);
  const [uploadQueue, setUploadQueue] = useState<
    {
      id: number;
      name: string;
      progress: number;
      loaded: number;
      total: number;
    }[]
  >([]);
  const [uploadControllers, setUploadControllers] = useState<
    Record<string, AbortController>
  >({});
  const controllerRef = useRef<AbortController | null>(null);

  const { mutateAsync: uploadAttachment } = useUploadAttachments(clientId ?? 0);

  // --- Add new files ---
  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const currentCount = uploadedFiles.length + uploadQueue.length;

    Array.from(files).forEach((file, index) => {
      if (currentCount + index >= MAX_FILES) {
        toast.warning(`You can only upload up to ${MAX_FILES} files.`);
        return;
      }
      if (!isAllowedFile(file)) return;

      const id = parseInt(
        crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(0, 9)
      );

      const newFile: FileType = {
        id,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        file,
      };
      setUploadedFiles((prev) => [...prev, newFile]);
    });
  };

  // --- Delete file ---
  const deleteFile = (id: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    setUploadQueue((prev) => prev.filter((f) => f.id !== id));
    setUploadControllers((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // --- Rename file ---
  const renameFile = (id: number, newName: string) => {
    if (!newName) return;
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName } : f))
    );
  };

  // --- Cancel all uploads ---
  const cancelAll = () => {
    Object.values(uploadControllers).forEach((controller) =>
      controller.abort()
    );
    setUploadQueue([]);
    setUploadedFiles([]);
    setUploadControllers({});
  };

  // --- Start uploading ---
  const uploadAll = async () => {
    if (!uploadedFiles.length) return;
    onUploadStart?.();

    for (const file of uploadedFiles) {
      const controller = new AbortController();
      controllerRef.current = controller;
      setUploadControllers((prev) => ({ ...prev, [file.id]: controller }));

      setUploadQueue((prev) => [
        ...prev,
        {
          id: file.id,
          name: file.name,
          progress: 0,
          loaded: 0,
          total: file.size,
        },
      ]);

      const formData = new FormData();
      const filename = stripExtension(file.name) || "Untitled";
      formData.append("files", file.file);
      formData.append("type", file.type);
      formData.append("originalname", file.name);
      formData.append("filename", filename);
      if (clientId) formData.append("clientId", clientId.toString());

      try {
        await uploadAttachment({
          formData,
          signal: controller.signal,
          onProgress: ({ percent, loaded, total }) => {
            setUploadQueue((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? { ...f, progress: percent, loaded, total }
                  : f
              )
            );
          },
        });
        toast.success(`${file.name} uploaded successfully`);
      } catch (err) {
        if (controller.signal.aborted) {
          toast.warning(`${file.name} upload canceled`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
          console.error(err);
        }
      } finally {
        setUploadQueue((prev) => prev.filter((f) => f.id !== file.id));
        setUploadControllers((prev) => {
          const copy = { ...prev };
          delete copy[file.id];
          return copy;
        });
      }
    }

    setUploadedFiles([]);
    onUploadEnd?.();
  };

  return {
    uploadedFiles,
    uploadQueue,
    addFiles,
    deleteFile,
    renameFile,
    cancelAll,
    uploadAll,
    uploadControllers,
  };
};
