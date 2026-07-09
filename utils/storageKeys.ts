/**
 * 存储键名常量 —— 与原版逐字一致，确保现有用户数据无缝识别。
 * 来源：原 index.html STORAGE_KEY / STORAGE_CLEAR_KEY / STORAGE_BACKUP_PREFIX /
 *       UI_THEME_CACHE_KEY / ANNOUNCE_KEY / OPFS 文件名 / legacy IDB 库名。
 */
export const STORAGE_KEY = 'opentavern-data-v1';
export const STORAGE_CLEAR_KEY = 'opentavern-cleared-at';
export const STORAGE_BACKUP_PREFIX = 'opentavern-data-v1-backup-';
export const UI_THEME_CACHE_KEY = 'opentavern-ui-theme';
export const ANNOUNCE_KEY = 'opentavern_announce_dismissed_v1';
export const LAST_BACKUP_KEY = 'opentavern-last-backup';

/** OPFS 中数据文件名 */
export const OPFS_DATA_FILE = 'opentavern-data.json';

/** legacy IndexedDB 库名（Safari 快照后端，恢复扫描时读取） */
export const LEGACY_IDB_SNAPSHOT_DB = 'OpenTavernSnapshotDB';
export const LEGACY_IDB_SNAPSHOT_STORE = 'snapshots';
export const LEGACY_IDB_SNAPSHOT_KEY = 'main';
/** 更早期的 IndexedDB 库名 */
export const LEGACY_IDB_OLD_DB = 'OpenTavernDB';
