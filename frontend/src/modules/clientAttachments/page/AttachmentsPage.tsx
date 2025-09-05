import { useState } from "react";
import { Ellipsis, Pencil, ArrowDownToLine, Trash } from "lucide-react";
import { stripExtension } from "@/lib/stripExtension";
import { truncateFileName } from "@/lib/truncate";
import { ModalType } from "@/types/ModalType";
import { usePersistentClientId } from "@/hooks/PersistValues/usePersistentClientId";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatBytes } from "../lib/utils/formatBytes";
import { formatDate } from "../lib/utils/formatDate";
import { Checkbox } from "@/components/checkboxs/checkbox";
import { Button } from "@/components/button/Button";
import { handleDownloadFile } from "@/lib/api/attachment/get.single.attachment.client.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/useModal";
import { useClientAttachments } from "@/hooks/attachment/useClientAttachments";
import styles from "./index.module.css";
import { getFileIcon } from "@/lib/ConditionalIcons/getFileIcon";
import { useClient } from "@/hooks/useClient";

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
  const clientId = usePersistentClientId();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const {
    fileID,
    warning,
    addFile,
    setEditFileId,
    setEditFileName,
    openModal,
    editFileName,
  } = useModal();
  const { setClientId } = useClient();

  const { data, isLoading, error } = useClientAttachments(clientId);

  const attachments = data?.attachments || [];
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
    setClientId(clientId);
    warning();
    setOpenPopoverId(null);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      fileID(selectedIds);
      setClientId(clientId);
      warning();
      setSelectedIds([]);
    }
  };

  const editButtonFun = (fileName: string, fileId: number) => {
    const striptedExtension = stripExtension(fileName);
    setEditFileId(fileId);
    setClientId(clientId);
    setEditFileName(striptedExtension);
    openModal("editFileName", ModalType.EditFileName);
    setOpenPopoverId(null);
  };

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

  if (attachments.length === 0) {
    return (
      <div className={styles.uploadAttachmentsContainer}>
        <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-2xl text-center bg-[var(--card)]">
          <h3 className="text-lg font-semibold text-[var(--primary)] mb-2">
            No attachments found
          </h3>
          <p className="text-sm text-[var(--label)] mb-4">
            You haven’t uploaded any files yet. Click the button below to add
            your first attachment.
          </p>
          <Button
            size="md"
            onClick={() => openModal("addFile", ModalType.AddFile)}
            className="px-6"
          >
            Upload Files
          </Button>
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
            <Button onClick={addFile} size="md" variant="outline">
              Upload File
            </Button>
          )}
          {selectedIds.length !== 0 && (
            <Button size="md" variant="danger" onClick={handleBulkDelete}>
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
                  <TableCell
                    className={`${styles.tableCellText} flex items-center gap-1 `}
                  >
                    {getFileIcon(file.type)}
                    <div>
                      <Tooltip>
                        <TooltipTrigger>
                          {truncateFileName(file.filename)}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{file.filename}</p>
                        </TooltipContent>
                      </Tooltip>
                      <p className={styles.fileTypeText}>
                        {file.type?.split("/")[1]?.toUpperCase() || "FILE"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className={styles.tableCellText}>
                    {formatBytes(file.size)}
                  </TableCell>
                  <TableCell className={styles.tableCellText}>
                    {formatDate(file.uploadedAt)}
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
    </div>
  );
};
