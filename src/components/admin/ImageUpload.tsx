import { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

const IMAGE_BUCKET = "techogies-images";

interface ImageUploadProps {
  folder: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ folder, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFile(e.target.files[0]);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const uploadFile = async (file: File) => {
    try {
      setError("");
      setUploading(true);

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please upload a JPG, PNG, or WEBP.");
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB.");
      }

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      // Prefix filename with singular entity name (e.g. course, project) to follow instructions
      const prefix = folder.endsWith('s') ? folder.slice(0, -1) : folder;
      const fileName = `${prefix}-${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      console.log({
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        bucket: IMAGE_BUCKET,
        path: filePath
      });

      const { error: uploadError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filePath);
      onChange(data.publicUrl);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = () => {
    // Optionally delete from storage here if we tracked the path, 
    // but for simplicity and safety against accidentally deleting active images, 
    // we simply clear the URL from the form state.
    onChange("");
  };

  return (
    <div className="space-y-2">
      <div 
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          uploading ? "opacity-50 pointer-events-none" : "hover:bg-muted/50"
        } ${error ? "border-red-500/50 bg-red-500/5" : "border-muted-foreground/25"}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {value ? (
          <div className="relative w-full h-40 group rounded-md overflow-hidden bg-muted flex items-center justify-center">
            <img 
              src={value} 
              alt="Preview" 
              className="h-full w-full object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center cursor-pointer w-full" onClick={() => fileInputRef.current?.click()}>
            <div className="mb-3 rounded-full bg-muted p-3">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="text-sm font-medium text-foreground">
              {uploading ? "Uploading..." : "Click or drag image to upload"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports JPG, PNG, WEBP (Max 5MB)
            </p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp, image/jpg"
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
