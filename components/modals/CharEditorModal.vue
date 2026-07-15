<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';

const store = useAppStore();
const ui = useUiStore();
const { t } = useI18n();

const editingId = ref<string | null>(null);
const errors = ref<Record<string, string>>({});

const form = reactive({
  name: '',
  roleType: '',
  description: '',
  personality: '',
  relationship: '',
  first_mes: '',
  // Advanced Prompt
  system_prompt: '',
  post_history_instructions: '',
  mes_example: '',
});

const isEditMode = computed(() => !!editingId.value);

function resetForm() {
  form.name = '';
  form.roleType = '';
  form.description = '';
  form.personality = '';
  form.relationship = '';
  form.first_mes = '';
  form.system_prompt = '';
  form.post_history_instructions = '';
  form.mes_example = '';
  editingId.value = null;
  errors.value = {};
}

// 弹窗打开时：有 payload = 编辑模式（预填），无 payload = 创建模式（清空）
watch(() => ui.isOpen('charEditor'), (open) => {
  if (!open) return;
  resetForm();
  const payload = ui.payload('charEditor');
  if (payload && payload.id && payload.data) {
    editingId.value = payload.id;
    const d = payload.data;
    form.name = String(d.name || '');
    form.roleType = String(d.role || '');
    form.description = String(d.description || '');
    form.personality = String(d.personality || '');
    form.relationship = String(d.scenario || '');
    form.first_mes = String(d.first_mes || '');
    form.system_prompt = String(d.system_prompt || '');
    form.post_history_instructions = String(d.post_history_instructions || '');
    form.mes_example = String(d.mes_example || '');
  }
});

function validate(): boolean {
  errors.value = {};
  if (!form.name.trim()) errors.value.name = 'Name is required.';
  if (!form.description.trim()) errors.value.description = 'Description is required.';
  if (!form.personality.trim()) errors.value.personality = 'Personality is required.';
  if (!form.first_mes.trim()) errors.value.first_mes = 'Opening message is required.';
  return Object.keys(errors.value).length === 0;
}

function compileCharacter(): Record<string, any> {
  return {
    name: form.name.trim(),
    role: form.roleType.trim(),
    description: form.description.trim(),
    personality: form.personality.trim(),
    scenario: form.relationship.trim(),
    first_mes: form.first_mes.trim(),
    system_prompt: form.system_prompt.trim(),
    post_history_instructions: form.post_history_instructions.trim(),
    mes_example: form.mes_example.trim(),
    tags: form.roleType.trim() ? [form.roleType.trim()] : [],
    creator_notes: '',
    alternate_greetings: [],
    extensions: {},
  };
}

function onSave() {
  if (!validate()) return;
  const data = compileCharacter();
  if (editingId.value) {
    // 保留已有 avatar（编辑时不重传）
    const existing = store.characters[editingId.value];
    if (existing?.data?.avatar) data.avatar = existing.data.avatar;
    store.updateCharacter(editingId.value, data);
  } else {
    store.addCharacter(data);
  }
  ui.close('charEditor');
}

function onCancel() {
  ui.close('charEditor');
}
</script>

<template>
  <AppModal modal-id="charEditorModal" name="charEditor" max-width="max-w-2xl">
    <h2 class="text-lg font-bold text-zinc-100 mb-5">{{ isEditMode ? 'Edit Character' : 'Create New Character' }}</h2>

    <div class="space-y-4 pr-1">
      <!-- Name + Role Type -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Name <span class="text-red-400">*</span></label>
          <input v-model="form.name" type="text" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all" placeholder="e.g. Adrian Vale">
          <p v-if="errors.name" class="text-[10px] text-red-400 mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Role Type</label>
          <input v-model="form.roleType" type="text" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all" placeholder="e.g. Cold Doctor, Vampire Prince">
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Description <span class="text-red-400">*</span></label>
        <textarea v-model="form.description" rows="5" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" placeholder="Who is this character? Their backstory, appearance, what makes them unique..." />
        <p v-if="errors.description" class="text-[10px] text-red-400 mt-1">{{ errors.description }}</p>
      </div>

      <!-- Personality -->
      <div>
        <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Personality <span class="text-red-400">*</span></label>
        <textarea v-model="form.personality" rows="3" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" placeholder="How do they behave? Cold but caring, sarcastic, gentle..." />
        <p v-if="errors.personality" class="text-[10px] text-red-400 mt-1">{{ errors.personality }}</p>
      </div>

      <!-- Relationship / How you meet -->
      <div>
        <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Relationship / How you meet</label>
        <textarea v-model="form.relationship" rows="3" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" placeholder="How does the user meet this character? What's the initial dynamic?" />
      </div>

      <!-- Opening Message -->
      <div>
        <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Opening Message <span class="text-red-400">*</span></label>
        <textarea v-model="form.first_mes" rows="4" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" placeholder="The first message the character sends to start the conversation..." />
        <p v-if="errors.first_mes" class="text-[10px] text-red-400 mt-1">{{ errors.first_mes }}</p>
      </div>

      <!-- Advanced Prompt (折叠) -->
      <details class="group mt-2 border-t border-white/5 pt-3">
        <summary class="cursor-pointer text-[10px] font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors select-none list-none flex items-center gap-1">
          Advanced Prompt
          <span class="ml-auto transition-transform group-open:rotate-90">→</span>
        </summary>
        <div class="mt-3 space-y-3">
          <div>
            <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">System Prompt</label>
            <textarea v-model="form.system_prompt" rows="2" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" placeholder="Optional custom system-level instructions..." />
          </div>
          <div>
            <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Post-History Instructions</label>
            <textarea v-model="form.post_history_instructions" rows="2" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" placeholder="Optional instructions injected after chat history..." />
          </div>
          <div>
            <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Example Messages</label>
            <textarea v-model="form.mes_example" rows="3" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" placeholder="Example dialogue to guide the AI's style..." />
          </div>
        </div>
      </details>
    </div>

    <div class="flex gap-3 mt-5">
      <button class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-zinc-300 transition-all" @click="onCancel">{{ t('char_editor_cancel') }}</button>
      <button class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all" @click="onSave">{{ isEditMode ? 'Update' : 'Create' }}</button>
    </div>
  </AppModal>
</template>
