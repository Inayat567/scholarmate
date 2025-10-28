import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Updated fileToBase64 - No changes needed, but ensured pure Base64
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      let base64 = dataUrl.split(',')[1];

      if (!base64) {
        reject(new Error("Failed to extract Base64 data from file."));
        return;
      }

      base64 = base64.replace(/\s/g, '');

      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

// Improved isValidBase64 - Handles padding and common edge cases
export function isValidBase64(str: string): boolean {
  if (str.length === 0) return false;
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  const len = str.length;
  if (len % 4 === 1) {
    return false;
  }

  if (!base64Regex.test(str)) {
    return false;
  }

  return true;
}

export const acceptedMimeTypes = [
  "application/pdf",
  "text/csv",
  "image/jpeg",
  "image/jpg",
  "image/png",
];


export const inferMimeType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeMap: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'mp4': 'video/mp4',
    // Add more as needed
  };
  return mimeMap[ext || ''] || 'application/octet-stream';
};

export function parseCountFromText(text: string, keyword: string, defaultCount: number): number {
  const regex = new RegExp(`(${keyword.replace(/s$/, '')}\\s+(\\d+))|(\\d+)\\s+${keyword.replace(/s?$/, 's?')}`, 'i');
  const match = text.match(regex);
  if (match) {
    const num = parseInt(match[2] || match[3] || match[4], 10);
    return Math.max(1, Math.min(20, num));
  }
  return defaultCount;
}