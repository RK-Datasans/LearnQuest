import { query, execute } from './db';

export const XP_REWARDS = {
  EASY_QUESTION: 15,
  MEDIUM_QUESTION: 25,
  HARD_QUESTION: 40,
  QUEST_STAGE: 25,
  QUEST_COMPLETION: 50,
  BOSS_BATTLE: 100,
  STREAK_BONUS: 20,
};

export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / 100) + 1;
}

export async function awardXp(
  studentId: number,
  amount: number,
  sourceType: string,
  description: string
): Promise<{ newTotalXp: number; newLevel: number; leveledUp: boolean }> {
  // Insert XP event
  await execute(
    'INSERT INTO xp_events (student_id, amount, source_type, description) VALUES (?, ?, ?, ?)',
    [studentId, amount, sourceType, description]
  );

  // Fetch current XP
  const rows = await query<any>('SELECT total_xp, level FROM student_profiles WHERE id = ?', [studentId]);
  const currentXp = rows[0]?.total_xp || 0;
  const currentLevel = rows[0]?.level || 1;

  const newTotalXp = currentXp + amount;
  const newLevel = calculateLevel(newTotalXp);
  const leveledUp = newLevel > currentLevel;

  // Update profile
  await execute(
    'UPDATE student_profiles SET total_xp = ?, level = ? WHERE id = ?',
    [newTotalXp, newLevel, studentId]
  );

  return { newTotalXp, newLevel, leveledUp };
}

export async function unlockBadge(
  studentId: number,
  badgeCode: string
): Promise<{ unlocked: boolean; badge: any | null }> {
  // Find badge
  const badges = await query<any>('SELECT id, code, name, description, icon, category FROM badges WHERE code = ?', [badgeCode]);
  if (badges.length === 0) return { unlocked: false, badge: null };

  const badge = badges[0];

  // Check if already unlocked
  const existing = await query<any>(
    'SELECT id FROM student_badges WHERE student_id = ? AND badge_id = ?',
    [studentId, badge.id]
  );

  if (existing.length > 0) {
    return { unlocked: false, badge };
  }

  // Insert unlock
  await execute(
    'INSERT INTO student_badges (student_id, badge_id, unlocked_at) VALUES (?, ?, NOW())',
    [studentId, badge.id]
  );

  return { unlocked: true, badge };
}
