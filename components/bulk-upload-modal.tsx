"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadSection } from "@/components/upload-section";
import { FileSpreadsheet, Info } from "lucide-react";

const MAX_SIZE_MB = 10;

interface BulkUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect?: (file: File) => void;
}

export function BulkUploadModal({
  open,
  onOpenChange,
  onFileSelect,
}: BulkUploadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            Upload Bulk Excel
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file to run risk assessments for multiple properties
            at once.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <UploadSection onFileSelect={onFileSelect} />
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
            <p className="text-[12px] font-medium text-blue-900 flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              File requirements
            </p>
            <ul className="text-[11px] text-blue-700 space-y-1 pl-6 list-disc">
              <li>Accepted formats: .xlsx, .xls only</li>
              <li>Maximum file size: {MAX_SIZE_MB}MB</li>
              <li>
                Required columns: <strong>Location</strong>,{" "}
                <strong>Property Value</strong>
              </li>
              <li>Each row generates a separate risk assessment</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
