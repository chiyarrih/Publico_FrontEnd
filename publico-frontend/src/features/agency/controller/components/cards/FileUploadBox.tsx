import { useState } from "react";

export default function FileUploadBox() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  return (
    <div className="col-span-2">
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center justify-center p-5 text-sm text-center border-2 border-dashed rounded-lg cursor-pointer border-slate-300 text-slate-600 hover:bg-slate-50"
      >
        <p className="mb-1">Upload supporting docs</p>
        <p className="text-xs text-slate-500">(PDF, JPG, PNG up to 10MB)</p>
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </label>

      {files.length > 0 && (
        <ul className="mt-3 text-xs text-left text-slate-600">
          {files.map((file, idx) => (
            <li key={idx} className="flex items-center gap-2">
              📄 {file.name}{" "}
              <span className="text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
