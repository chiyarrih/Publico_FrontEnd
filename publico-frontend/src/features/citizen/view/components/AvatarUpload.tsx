import React, { useRef, useState } from "react";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarChange?: (url: string | null) => void;
  disabled?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatarUrl, 
  onAvatarChange, 
  disabled = false 
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl || null);

  const pickFile = () => {
    if (!disabled) {
      fileRef.current?.click();
    }
  };

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    const url = URL.createObjectURL(f);
    setAvatarUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    onAvatarChange?.(url);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <img
          src={
            avatarUrl ||
            "https://images.unsplash.com/photo-1603415526960-f7e0328d13a7?q=80&w=300&auto=format&fit=crop"
          }
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
