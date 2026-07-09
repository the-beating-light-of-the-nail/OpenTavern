import { ref, computed } from 'vue';
import { useUiStore } from '~/stores/ui';
import { isGroupChat, getGroupMembers } from '~/utils/group-helpers';

/**
 * 群聊 @ 提及的待定状态（pill UI）。
 * 逐字移植原版 setPendingGroupMention / clearPendingGroupMention / showGroupMentionPanel
 * （index.html byte 379461 / 380455 / 376394）。
 * 模块级单例：一次仅一个提及；选完即清除。
 */
const pendingGroupMention = ref<any>(null);

export function useGroupMention() {
  const ui = useUiStore();

  const hasPending = computed(() => !!pendingGroupMention.value);

  /** pill 紧凑显示名（去括号 + 限长，原版 setPendingGroupMention 逻辑） */
  const pillDisplayName = computed(() => {
    const char = pendingGroupMention.value;
    if (!char) return '';
    let display = char.name || '角色';
    if (display.includes('（')) display = display.split('（')[0];
    if (display.length > 5) display = display.slice(0, 4) + '…';
    return '@' + display;
  });

  /** 设置待定提及（原版 setPendingGroupMention，byte 379461） */
  function setPending(char: any): void {
    if (!char) return;
    pendingGroupMention.value = char;
  }

  /** 清除待定提及（原版 clearPendingGroupMention，byte 380455） */
  function clear(): void {
    pendingGroupMention.value = null;
  }

  /** 取出并清除（sendMessage 路由用） */
  function consume(): any {
    const c = pendingGroupMention.value;
    pendingGroupMention.value = null;
    return c;
  }

  /** 打开提及面板（原版 showGroupMentionPanel，byte 376394）；非群聊弹提示 */
  function openPanel(conv: any, tNoGroup: string): boolean {
    if (!isGroupChat(conv)) {
      ui.showDialog({ message: tNoGroup, showCancel: false });
      return false;
    }
    ui.open('groupMention', { convId: conv.id });
    return true;
  }

  /** 当前群组成员（供 GroupMentionModal 渲染） */
  function membersOf(conv: any): any[] {
    return getGroupMembers(conv);
  }

  return {
    pendingGroupMention,
    hasPending,
    pillDisplayName,
    setPending,
    clear,
    consume,
    openPanel,
    membersOf,
    isGroupChat,
  };
}
