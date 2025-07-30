import { useState } from "react";
import { useParams } from "react-router-dom";
import { Ellipsis, Pencil, ArrowDownToLine, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatBytes } from "../lib/utils/formatBytes";
import { formatDate } from "../lib/utils/formatDate";
import { Checkbox } from "@/components/checkboxs/checkbox";
import { Button } from "@/components/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  const clientId = Number(id);

  const {
    data,
    isLoading: isAttachmentsLoading,
    error: attachmentsError,
  } = useClientAttachments(clientId);

  const attachments = data?.attachments || [];
  const clientName = data?.clientName || "";

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(attachments.map((a) => a.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    // Confirm & send API call to delete selectedIds
  };

  if (isAttachmentsLoading)
    return (
      <div className="p-4 text-gray-600">Loading client Attachments...</div>
    );

  if (attachmentsError)
    return (
      <div className="p-4 text-red-600">
        There was error while loading client Attachments...
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.topBtnContainer}>
        <h3>{`Client Attachments: ${clientName}`}</h3>
        <div className="flex gap-2">
          <Button
            size="md"
            variant="danger"
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
          >
            Delete Selected
          </Button>
          <Button size="md" onClick={selectAll}>
            Select All
          </Button>
          <Button size="md" onClick={clearAll} variant="outline">
            Clear
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={selectedIds.length === attachments.length}
                  onChange={() => {
                    if (selectedIds.length === attachments.length) {
                      clearAll();
                    } else {
                      selectAll();
                    }
                  }}
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
            {attachments.map((file: Attachment) => (
              <TableRow key={file.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(file.id)}
                    onChange={() => toggleSelect(file.id)}
                    aria-label={`Select file ${file.filename}`}
                  />
                </TableCell>
                <TableCell className={styles.tableCellText}>
                  {file.filename}
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
                      onOpenChange={(open) => {
                        setOpenPopoverId(open ? Number(file.id) : null);
                      }}
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
                          <li>
                            <ArrowDownToLine size={13} /> Download
                          </li>
                          <li>
                            <Pencil size={13} /> Rename
                          </li>
                          <li
                            className=" text-red-600"
                            onClick={() => {
                              setOpenPopoverId(null);
                            }}
                          >
                            <Trash size={13} /> Delete
                          </li>
                        </ul>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
