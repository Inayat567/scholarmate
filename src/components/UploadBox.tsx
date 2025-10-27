"use client";

import { useState, DragEvent } from "react";
import { Upload, FileIcon, X } from "lucide-react";

export default function FileUploader({
  onFilesChange,
  acceptedTypes = ".pdf,.csv,.jpg,.jpeg,.png",
  multiple = true,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updated = [...files, ...newFiles];
      setFiles(updated);
      onFilesChange(updated);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      const updated = [...files, ...newFiles];
      setFiles(updated);
      onFilesChange(updated);
      e.dataTransfer.clearData();
    }
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Dropzone Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          id="file-upload"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <Upload className="h-8 w-8 text-primary" />
          <span className="text-sm text-muted-foreground">
            Drag & drop your files here, or{" "}
            <span className="text-primary font-medium">browse</span>
          </span>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <ul className="text-sm text-muted-foreground space-y-1">
          {files.map((file, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between bg-muted/40 px-3 py-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-primary" />
                <span className="truncate max-w-[200px]">{file.name}</span>
              </div>
              <button
                onClick={() => handleRemoveFile(idx)}
                className="text-muted-foreground hover:text-destructive transition"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
