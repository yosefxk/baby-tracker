export type Role = 'parent' | 'caregiver' | 'viewer';

export interface User {
  id: string;
  username: string; // unique username (no email required)
  name: string;
  password: string; // password or PIN
  is_system_admin: boolean;
  created_at: string;
}

export interface Baby {
  id: string;
  owner_user_id: string;
  name: string;
  gender: 'boy' | 'girl';
  birth_date: string; // ISO date string (YYYY-MM-DD)
  due_date?: string;
  photo_url?: string;
  notes?: string;
  created_at: string;
}

export interface BabyPermission {
  id: string;
  baby_id: string;
  user_id: string;
  role: Role; // 'parent' | 'caregiver' | 'viewer'
  created_at: string;
}

export interface Invitation {
  id: string;
  code: string; // Unique token used in link /invite/[code]
  created_by_user_id: string;
  created_by_name: string;
  target_role: Role;
  target_baby_ids: string[]; // List of baby IDs, or ['*'] for all children, or [] for new user
  invite_type?: 'co_parent' | 'new_user';
  allow_create_baby?: boolean;
  label?: string;
  max_uses: number;
  used_count: number;
  expires_at?: string;
  created_at: string;
}

export type LogType =
  | 'nursing'
  | 'bottle'
  | 'sleep'
  | 'diaper'
  | 'pumping'
  | 'solids'
  | 'medication'
  | 'temperature'
  | 'growth'
  | 'tummy_time'
  | 'milestone';

export interface LogEntry {
  id: string;
  baby_id: string;
  user_id: string;
  user_name: string;
  type: LogType;
  start_time: string; // ISO string
  end_time?: string;   // ISO string (optional for duration events)
  details: Record<string, any>;
  notes?: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  baby_id: string;
  title: string;
  time: string; // e.g. "09:00"
  type: 'vitamin_d' | 'iron' | 'medication' | 'feeding' | 'custom';
  is_active: boolean;
  notes?: string;
}

export interface DatabaseSchema {
  users: User[];
  babies: Baby[];
  permissions: BabyPermission[];
  invitations: Invitation[];
  logs: LogEntry[];
  reminders: Reminder[];
}
