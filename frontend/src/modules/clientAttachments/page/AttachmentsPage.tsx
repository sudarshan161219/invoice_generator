import { useState } from "react";
import { useParams } from "react-router-dom";
import { Ellipsis, Pencil, ArrowDownToLine, Trash } from "lucide-react";
import { stripExtension } from "@/lib/stripExtension";
import { truncateFileName } from "@/lib/truncate";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatBytes } from "../lib/utils/formatBytes";
import { formatDate } from "../lib/utils/formatDate";
import { Checkbox } from "@/components/checkboxs/checkbox";
import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { EditFileInfoModal } from "@/components/modal/editFileInfoModal";
import { ModalType } from "@/types/ModalType";
import { UploadFileButton } from "@/components/modal/UploadFileButton";
import { handleDownloadFile } from "@/lib/api/attachment/get.single.attachment.client.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNotesModal } from "@/hooks/useNotesModal";
import { useClientAttachments } from "../hooks/useClientAttachments";
import styles from "./index.module.css";

type Attachment = {
  id: string;
  filename: string;
  size: number;
  uploadedAt: Date | string;
  updatedAt: Date | string;
  url: string;
  type: string;
  client: { name: string };
};

export const AttachmentsPage = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const {
    fileID,
    openWarning,
    openAddFile,
    activeModal,
    setEditedValue,
    setEditingId,
    openModal,
  } = useNotesModal();
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);

  const { data, isLoading, error } = useClientAttachments(clientId);

  const attachments = data?.attachments || [];
  // const clientName = data?.clientName || "";
  const isAllSelected = selectedIds.length === attachments.length;

  // Selection handlers
  const toggleSelect = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const selectAll = () =>
    setSelectedIds(attachments.map((file: Attachment) => file.id));

  const clearAll = () => setSelectedIds([]);

  const handleDeleteFile = (fileId: number) => {
    fileID(fileId);
    openWarning();
    setOpenPopoverId(null);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      fileID(selectedIds);
      openWarning();
    }
  };

  const editButtonFun = (fileName: string, fileId: number) => {
    const striptedExtension = stripExtension(fileName);
    setEditingId("fileInfo", fileId);
    setEditedValue("fileInfo", striptedExtension);
    openModal(ModalType.EditFileInfo);
    setOpenPopoverId(null);
  };

  // Handle loading and error states early
  if (isLoading) {
    return (
      <div className="p-4 text-gray-600">Loading client attachments...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        There was an error while loading attachments...
      </div>
    );
  }

  if (!isLoading && !error && (attachments.length === 0 || isUploading)) {
    return (
      <div className={styles.uploadAttachmentsContainer}>
        {attachments.length === 0 && !isUploading && (
          <h3 className="mb-4 font-semibold text-lg">
            No attachments found. Upload new files:
          </h3>
        )}
        <div className={styles.UploadFileButton}>
          <UploadFileButton
            onUploadStart={() => setIsUploading(true)}
            onUploadEnd={() => setIsUploading(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBtnContainer}>
        {/* <h3>{`Client Attachments: ${clientName}`}</h3> */}
        <div className="flex gap-2">
          {selectedIds.length === 0 && (
            <Button onClick={openAddFile} size="md" variant="outline">
              Upload File
            </Button>
          )}
          {selectedIds.length !== 0 && (
            <Button
              size="md"
              variant="danger"
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
            >
              Delete Selected
            </Button>
          )}
          <Button size="md" onClick={selectAll}>
            Select All
          </Button>

          {selectedIds.length !== 0 && (
            <Button size="md" onClick={clearAll} variant="outline">
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  className={styles.checkBox}
                  checked={isAllSelected}
                  onChange={() => (isAllSelected ? clearAll() : selectAll())}
                />
              </TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attachments.map((file: Attachment) => {
              const fullFileName = `${file.filename}.${
                file.type?.split("/")[1]
              }`;

              return (
                <TableRow key={file.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(Number(file.id))}
                      onChange={() => toggleSelect(Number(file.id))}
                      aria-label={`Select file ${file.filename}`}
                      className={styles.checkBox}
                    />
                  </TableCell>
                  <TableCell className={styles.tableCellText}>
                    {truncateFileName(file.filename)}
                    <p className={styles.fileTypeText}>
                      {file.type?.split("/")[1]?.toUpperCase() || "FILE"}
                    </p>
                  </TableCell>
                  <TableCell className={styles.tableCellText}>
                    {formatBytes(file.size)}
                  </TableCell>
                  <TableCell className={styles.tableCellText}>
                    {formatDate(file.uploadedAt)}
                  </TableCell>
                  <TableCell className={styles.tableCellText}>
                    {formatDate(file.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <Popover
                        open={openPopoverId === Number(file.id)}
                        onOpenChange={(open) =>
                          setOpenPopoverId(open ? Number(file.id) : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <button className={styles.moreOptionsBtn}>
                            <Ellipsis size={18} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="bottom"
                          align="end"
                          className="w-40 p-0"
                        >
                          <ul className={styles.moreMenu}>
                            <li
                              onClick={() =>
                                handleDownloadFile(
                                  Number(file.id),
                                  fullFileName
                                )
                              }
                            >
                              <ArrowDownToLine size={13} /> Download
                            </li>
                            <li
                              onClick={() =>
                                editButtonFun(file.filename, Number(file.id))
                              }
                            >
                              <Pencil size={13} /> Rename
                            </li>
                            <li
                              className="text-red-600"
                              onClick={() => handleDeleteFile(Number(file.id))}
                            >
                              <Trash size={13} /> Delete
                            </li>
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Modal />

      {activeModal === ModalType.EditFileInfo && (
        <EditFileInfoModal type="fileInfo" />
      )}
    </div>
  );
};
