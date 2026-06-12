import { decompressFromUTF16 } from "lz-string";
import {
  createEmptyWorkspace,
  exportWorkspaceJson,
  importWorkspaceJson,
  normalizeWorkspace,
  type ProjectRepository,
  type WorkspaceData,
} from "@ophan/core";

const DEFAULT_DB_NAME = "ophan";
const DEFAULT_STORE_NAME = "workspace";
const DEFAULT_WORKSPACE_KEY = "current";
const LEGACY_STORAGE_KEY = "project-idea-collection.v1";
const LEGACY_COMPRESSED_PREFIX = "lz:";

export class IndexedDbProjectRepository implements ProjectRepository {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor(
    private readonly deviceId: string,
    private readonly dbName = DEFAULT_DB_NAME,
    private readonly storeName = DEFAULT_STORE_NAME,
    private readonly workspaceKey = DEFAULT_WORKSPACE_KEY
  ) {}

  async loadWorkspace(): Promise<WorkspaceData> {
    if (!this.canUseIndexedDb()) {
      return createEmptyWorkspace(this.deviceId);
    }

    const db = await this.openDb();
    const stored = await this.getValue(db, this.workspaceKey);
    return stored ? normalizeWorkspace(stored, this.deviceId) : createEmptyWorkspace(this.deviceId);
  }

  async saveWorkspace(data: WorkspaceData): Promise<void> {
    if (!this.canUseIndexedDb()) {
      return;
    }

    const db = await this.openDb();
    await this.putValue(db, this.workspaceKey, normalizeWorkspace(data, this.deviceId));
  }

  exportWorkspace(data: WorkspaceData): string {
    return exportWorkspaceJson(data);
  }

  async importWorkspace(json: string): Promise<WorkspaceData> {
    const workspace = importWorkspaceJson(json, this.deviceId);
    await this.saveWorkspace(workspace);
    return workspace;
  }

  async clear(): Promise<WorkspaceData> {
    const workspace = createEmptyWorkspace(this.deviceId);
    await this.saveWorkspace(workspace);
    return workspace;
  }

  private canUseIndexedDb() {
    return typeof indexedDB !== "undefined";
  }

  private openDb() {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });

    return this.dbPromise;
  }

  private getValue(db: IDBDatabase, key: string) {
    return new Promise<unknown>((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readonly");
      const request = tx.objectStore(this.storeName).get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private putValue(db: IDBDatabase, key: string, value: WorkspaceData) {
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export class LocalStorageLegacyImporter {
  constructor(
    private readonly deviceId: string,
    private readonly storageKey = LEGACY_STORAGE_KEY
  ) {}

  hasLegacyData() {
    return this.readRaw() !== null;
  }

  loadLegacyWorkspace() {
    const raw = this.readRaw();
    if (!raw) {
      throw new Error("No legacy Project Idea Studio data was found.");
    }

    const decoded = this.decodeLegacyPayload(raw);
    return importWorkspaceJson(decoded, this.deviceId);
  }

  private readRaw() {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(this.storageKey);
  }

  private decodeLegacyPayload(raw: string) {
    if (!raw.startsWith(LEGACY_COMPRESSED_PREFIX)) {
      return raw;
    }

    const compressed = raw.slice(LEGACY_COMPRESSED_PREFIX.length);
    const decoded = decompressFromUTF16(compressed);
    if (!decoded) {
      throw new Error("Legacy data is compressed but could not be decoded.");
    }
    return decoded;
  }
}
