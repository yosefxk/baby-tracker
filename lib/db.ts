import fs from 'fs';
import path from 'path';
import { DatabaseSchema } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function getInitialData(): DatabaseSchema {
  return {
    users: [],
    babies: [],
    permissions: [],
    invitations: [],
    logs: [],
    reminders: [],
  };
}

export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (err) {
    console.error('Error reading db.json:', err);
    return getInitialData();
  }
}

export function writeDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}
