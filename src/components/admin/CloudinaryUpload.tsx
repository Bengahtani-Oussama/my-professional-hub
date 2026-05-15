import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, X, FileText } from "lucide-react";
import { toast } from "sonner";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

type Kind = "image" | "raw" | "auto";

async function uploadToCloudinary(file: File, kind: Kind): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.",
    );
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${kind}/upload`, {
    method: "POST",
    body: fd,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "Upload failed");
  return json.secure_url as string;
}

interface SingleProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  kind?: Kind;
  accept?: string;
  preview?: "image" | "file";
}

export function CloudinaryUpload({
  label,
  value,
  onChange,
  kind = "image",
  accept,
  preview = "image",
}: SingleProps) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const url = await uploadToCloudinary(file, kind);
      onChange(url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
        <input
          ref={ref}
          type="file"
          accept={accept ?? (kind === "image" ? "image/*" : undefined)}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => ref.current?.click()}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
      {value && preview === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-24 w-24 rounded-lg border border-border object-cover"
        />
      )}
      {value && preview === "file" && (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex items-center gap-2 text-xs text-primary hover:underline"
        >
          <FileText className="h-3.5 w-3.5" /> View file
        </a>
      )}
    </div>
  );
}

interface MultiProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
}

export function CloudinaryGallery({ label, value, onChange }: MultiProps) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setBusy(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map((f) => uploadToCloudinary(f, "image")),
      );
      onChange([...value, ...urls]);
      toast.success(`${urls.length} uploaded`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <input
          ref={ref}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => ref.current?.click()}>
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          Add images
        </Button>
      </div>
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((url, i) => (
            <div key={url + i} className="group relative">
              <img src={url} alt="" className="h-24 w-full rounded-lg border border-border object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition group-hover:opacity-100"
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}