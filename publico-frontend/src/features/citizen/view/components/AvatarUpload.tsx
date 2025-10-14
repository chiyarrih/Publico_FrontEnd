import React, { useEffect, useRef, useState } from "react";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarChange?: (url: string | null) => void;
  disabled?: boolean;
}

const LS_KEY = "profile.avatarDataUrl";

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  onAvatarChange,
  disabled = false,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Initialize: prefer prop, then localStorage, else null
  useEffect(() => {
    if (currentAvatarUrl) {
      setAvatarUrl(currentAvatarUrl);
      return;
    }
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setAvatarUrl(saved);
    } catch {
      /* ignore localStorage errors */
    }
  }, [currentAvatarUrl]);

  const pickFile = () => {
    if (!disabled) fileRef.current?.click();
  };

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onPick: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    try {
      const dataUrl = await readFileAsDataURL(f);

      // Save to state + localStorage so it persists
      setAvatarUrl(dataUrl);
      try {
        localStorage.setItem(LS_KEY, dataUrl);
      } catch {
        /* ignore quota/permission issues */
      }

      // Keep your original callback behavior
      onAvatarChange?.(dataUrl);
    } catch {
      // If read fails, do nothing (keep previous avatar)
    } finally {
      // Allow picking the same file again later
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const fallback =
    "https://images.unsplash.com/photo-1603415526960-f7e0328d13a7?q=80&w=300&auto=format&fit=crop";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <img
          src={avatarUrl || fallback}
          alt="avatar"
          className="h-28 w-28 rounded-full object-cover border"
        />
        <button
          type="button"
          onClick={pickFile}
          disabled={disabled}
          className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#2563eb] text-white text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
          title="Change"
        >
          ✎
        </button>
      </div>

      <div className="text-xs text-slate-500">Profile Picture</div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onPick}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default AvatarUpload;
