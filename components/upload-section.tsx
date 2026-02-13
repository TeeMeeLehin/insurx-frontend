"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, X, HelpCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UploadSectionProps {
  /** Called when a valid file is selected */
  onFileSelect?: (file: File) => void;
  /** Compact mode shows a single-row drop zone (used in context panel) */
  compact?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MAX_SIZE_MB = 10;
const ACCEPTED_EXTENSIONS = [".xlsx", ".xls"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function UploadSection({ onFileSelect, compact = false }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ----- validation ----- */
  const validateFile = (file: File): boolean => {
    setError(null);
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setError("Invalid file type. Please upload .xlsx or .xls files only.");
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return false;
    }
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------------------------------------------------------------- */
  /*  Compact variant (single row)                                     */
  /* ---------------------------------------------------------------- */
  if (compact) {
    return (
      <div className="space-y-2">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            dragActive
              ? "border-blue-400 bg-blue-50/50"
              : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Upload className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            {selectedFile ? (
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-[12px] font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="ml-auto flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            ) : (
              <>
                <p className="text-[12px] font-medium text-gray-700">
                  Upload bulk file
                </p>
                <p className="text-[11px] text-gray-400">
                  .xlsx / .xls &middot; max {MAX_SIZE_MB}MB
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        {error && (
          <p className="text-[11px] text-red-500 flex items-center gap-1 px-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
          </p>
        )}
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Full variant (card with drag-drop area)                          */
  /* ---------------------------------------------------------------- */
  return (
    <div className="space-y-3">
      {/* Header with tooltip */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-900">Bulk Upload</h3>
        <div className="group relative">
          <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-[11px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-lg pointer-events-none">
            <p className="font-medium mb-1">How to upload:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-gray-300">
              <li>Prepare an Excel file with Location and Property Value columns</li>
              <li>Drag &amp; drop the file below, or click to browse</li>
              <li>Accepted formats: .xlsx, .xls</li>
              <li>Maximum file size: {MAX_SIZE_MB}MB</li>
            </ol>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          dragActive
            ? "border-blue-400 bg-blue-50/50 scale-[1.01]"
            : "border-gray-200 hover:border-blue-300 bg-white"
        }`}
      >
        {selectedFile ? (
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="text-gray-500"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-blue-50 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Drag &amp; drop your Excel file here
            </p>
            <p className="text-[11px] text-gray-400">
              or{" "}
              <span className="text-blue-600 underline underline-offset-2">
                browse files
              </span>
            </p>
            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <FileSpreadsheet className="w-3 h-3" /> .xlsx / .xls
              </span>
              <span className="text-gray-300">|</span>
              <span>Max {MAX_SIZE_MB}MB</span>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] text-red-600 font-medium">{error}</p>
            <p className="text-[11px] text-red-400 mt-0.5">
              Please select a valid .xlsx or .xls file under {MAX_SIZE_MB}MB.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
