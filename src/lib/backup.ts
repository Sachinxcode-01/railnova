import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'railnova-db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const MAX_BACKUPS = 10;

export interface BackupEntry {
  fileName: string;
  sizeBytes: number;
  createdAt: string;
}

export async function createDatabaseBackup(): Promise<BackupEntry> {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const raw = await fs.readFile(DB_PATH, 'utf8');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `railnova-db-${stamp}.json`;
  const dest = path.join(BACKUP_DIR, fileName);
  await fs.writeFile(dest, raw, 'utf8');

  // Rotate old backups beyond MAX_BACKUPS
  const entries = (await fs.readdir(BACKUP_DIR))
    .filter((f) => f.startsWith('railnova-db-') && f.endsWith('.json'))
    .sort();
  while (entries.length > MAX_BACKUPS) {
    const oldest = entries.shift();
    if (oldest) {
      await fs.unlink(path.join(BACKUP_DIR, oldest)).catch(() => {});
    }
  }

  const stat = await fs.stat(dest);
  return {
    fileName,
    sizeBytes: stat.size,
    createdAt: stat.mtime.toISOString(),
  };
}

export async function listDatabaseBackups(): Promise<BackupEntry[]> {
  try {
    const files = (await fs.readdir(BACKUP_DIR))
      .filter((f) => f.startsWith('railnova-db-') && f.endsWith('.json'))
      .sort()
      .reverse();

    const result: BackupEntry[] = [];
    for (const fileName of files) {
      const stat = await fs.stat(path.join(BACKUP_DIR, fileName));
      result.push({
        fileName,
        sizeBytes: stat.size,
        createdAt: stat.mtime.toISOString(),
      });
    }
    return result;
  } catch {
    return [];
  }
}
