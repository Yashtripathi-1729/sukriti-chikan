// Browser-only helpers for the admin panel

export function getAdminPass() {
  return sessionStorage.getItem("admin_pass") || "";
}

export function logout() {
  sessionStorage.removeItem("admin_pass");
  window.location.href = "/admin/login";
}

// fetch with the admin password attached; redirects to login on 401, throws on other errors
export async function adminFetch(url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("x-admin-password", getAdminPass());
  const res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    logout();
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res;
}

export async function adminJson<T = unknown>(url: string, method: string, body: unknown): Promise<T> {
  const res = await adminFetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// Shrink phone photos so uploads stay under the hosting request limit (~4.5MB)
export async function compressImage(file: File, maxSize = 1600, quality = 0.85): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file; // browser can't decode it (e.g. HEIC on desktop) — upload as-is
  }
}

export async function uploadImages(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  const res = await adminFetch("/api/upload", { method: "POST", body: formData });
  return (await res.json()).urls;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
