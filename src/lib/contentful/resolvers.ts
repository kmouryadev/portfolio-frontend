import type { CDAAsset, CDAEntry, CDALink } from "./types";

export type AssetMap = Map<string, CDAAsset>;
export type EntryMap = Map<string, CDAEntry<Record<string, unknown>>>;

export function buildAssetMap(assets: CDAAsset[] = []): AssetMap {
  return new Map(assets.map((asset) => [asset.sys.id, asset]));
}

export function buildEntryMap(
  entries: CDAEntry<Record<string, unknown>>[] = [],
): EntryMap {
  return new Map(entries.map((entry) => [entry.sys.id, entry]));
}

export function resolveAssetUrl(
  ref: CDALink | undefined | null,
  assetMap: AssetMap,
): string | null {
  if (!ref || ref.sys.type !== "Link" || ref.sys.linkType !== "Asset")
    return null;
  const fileUrl = assetMap.get(ref.sys.id)?.fields?.file?.url;
  return fileUrl ? `https:${fileUrl}` : null;
}

export function resolveEntries<F = Record<string, unknown>>(
  refs: (CDALink | undefined | null)[] = [],
  entryMap: EntryMap,
): CDAEntry<F>[] {
  const results: CDAEntry<F>[] = [];
  for (const ref of refs) {
    if (!ref || ref.sys.type !== "Link" || ref.sys.linkType !== "Entry")
      continue;
    const entry = entryMap.get(ref.sys.id);
    if (entry) results.push(entry as CDAEntry<F>);
  }
  return results;
}
