"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { recordMedia } from "@/app/admin/actions";

const MAX_IMAGE_MB = 15;
const MAX_VIDEO_MB = 50;
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm";

function safeName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  const base = (dot > 0 ? name.slice(0, dot) : name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "file";
  return `${base}.${ext}`;
}

/** Uploads straight from the browser to Supabase Storage (staff session), then records the asset. */
export default function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [tags, setTags] = useState("");
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const supabase = getBrowserClient();
    if (!supabase) {
      setError("Storage isn't configured.");
      return;
    }
    setError("");
    let done = 0;
    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      const limit = (isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB) * 1024 * 1024;
      if (!ACCEPT.split(",").includes(file.type)) {
        setError(`${file.name}: use JPG, PNG, WebP, AVIF, MP4 or WebM.`);
        continue;
      }
      if (file.size > limit) {
        setError(`${file.name} is too large (max ${isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB} MB). Compress videos to 1080p H.264 first.`);
        continue;
      }
      setProgress(`Uploading ${file.name}…`);
      const path = `${isVideo ? "videos" : "images"}/${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 8)}-${safeName(file.name)}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, cacheControl: "31536000" });
      if (upErr) {
        setError(`${file.name}: ${upErr.message}`);
        continue;
      }
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      const res = await recordMedia({
        kind: isVideo ? "video" : "image",
        storagePath: path,
        url: data.publicUrl,
        alt: alt || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        bytes: file.size,
      });
      if (res.error) setError(res.error);
      else done++;
    }
    setProgress(done ? `${done} file${done === 1 ? "" : "s"} uploaded.` : "");
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  };

  return (
    <div className="card space-y-4 p-6">
      <h2 className="font-semibold text-slate-900">Upload photos and videos</h2>
      <p className="text-sm text-slate-500">
        Only upload media you own or have permission to use, showing the place it will be captioned as. Videos: 1080p MP4 (H.264), under {MAX_VIDEO_MB} MB, ideally 10–30 seconds.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Description (alt text)</span>
          <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Blue train on the Nine Arch Bridge, Ella" className="field-input" />
        </label>
        <label className="block">
          <span className="field-label">Tags (comma separated)</span>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ella, train, hero" className="field-input" />
        </label>
      </div>
      <input ref={inputRef} type="file" accept={ACCEPT} multiple onChange={(e) => upload(e.target.files)} className="hidden" id="media-file" />
      <label htmlFor="media-file" className="btn-primary cursor-pointer">
        {progress.startsWith("Uploading") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Choose files
      </label>
      {progress && <p className="text-sm text-slate-600">{progress}</p>}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
