import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'railnova-db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const MAX_BACKUPS = 10;

async function main() {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const raw = await fs.readFile(DB_PATH, 'utf8');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `railnova-db-${stamp}.json`;
  const dest = path.join(BACKUP_DIR, fileName);
  await fs.writeFile(dest, raw, 'utf8');

  const files = (await fs.readdir(BACKUP_DIR))
    .filter((f) => f.startsWith('railnova-db-') && f.endsWith('.json'))
    .sort();
  while (files.length > MAX_BACKUPS) {
    const oldest = files.shift();
    if (oldest) await fs.unlink(path.join(BACKUP_DIR, oldest));
  }

  console.log(`Backup created: ${dest}`);
}

main().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});
