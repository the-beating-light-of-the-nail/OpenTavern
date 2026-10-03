/**
 * 导出辅助：文件下载 + 角色卡/世界书导出。
 */

import type { CharacterCard } from './types';
import { toV2, toV3, characterBookToWorldInfo } from './convert';
import { writePngCard, dataUrlToBytes, makePlaceholderPng } from './png';

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadJson(filename: string, data: unknown) {
  downloadBlob(filename, new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
}

export function safeFilename(name: string): string {
  const clean = (name || 'character').replace(/[\\/:*?"<>|\n\r]+/g, '_').trim();
  return clean.slice(0, 80) || 'character';
}

/** 导出 V2/V3 JSON */
export function exportCardJson(card: CharacterCard, spec: 'v2' | 'v3') {
  const data = spec === 'v3' ? toV3(card) : toV2(card);
  downloadJson(`${safeFilename(card.data?.name)}.json`, data);
}

/** 导出 PNG 角色卡：头像（或占位图）+ 双写 chara/ccv3 */
export async function exportCardPng(card: CharacterCard, avatarDataUrl: string | null | undefined) {
  const avatar = avatarDataUrl || (await makePlaceholderPng(card.data?.name || ''));
  const bytes = writePngCard(dataUrlToBytes(avatar), {
    v3Card: toV3(card),
    v2Card: toV2(card),
  });
  const copy = new Uint8Array(bytes);
  downloadBlob(`${safeFilename(card.data?.name)}.png`, new Blob([copy.buffer as ArrayBuffer], { type: 'image/png' }));
}

/** 导出卡内 character_book 为 ST 世界书 JSON */
export function exportCardWorldbook(card: CharacterCard): boolean {
  const book = card.data?.character_book;
  if (!book || !Array.isArray(book.entries) || !book.entries.length) return false;
  downloadJson(`${safeFilename(card.data?.name)}_worldbook.json`, characterBookToWorldInfo(book));
  return true;
}
