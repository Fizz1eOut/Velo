<script setup lang="ts">
  import { inject, nextTick, ref, watch } from 'vue';
  import AppInput from '~/components/inputs/AppInput.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import { chatSearchKey } from '~/composables/useChatSearch';

  const search = inject(chatSearchKey);
  if (!search) throw new Error('ChatSearch must be used within a ChatWindow (chatSearch not provided)');

  const inputRef = ref<InstanceType<typeof AppInput> | null>(null);

  watch(
    () => search.isOpen.value,
    async (open) => {
      if (!open) return;
      await nextTick();
      inputRef.value?.focus();
    }
  );

  const onInput = (e: Event) => {
    search.setQuery((e.target as HTMLInputElement).value);
  };
</script>

<template>
  <div class="chat-search">
    <Transition name="search" mode="out-in">
      <div
        v-if="!search.isOpen.value"
        key="icon"
        class="chat-search__icon"
        @click="search.open()"
      >
        <app-icon
          name="search"
          color="var(--text-secondary)"
          size="var(--fs-xl)"
        />
      </div>

      <div
        v-else
        key="bar"
        class="chat-search__bar"
      >
        <app-input
          ref="inputRef"
          :model-value="search.query.value"
          type="text"
          placeholder="Search messages..."
          class="chat-search__input"
          @input="onInput"
        />

        <span v-if="search.query.value" class="chat-search__count">
          {{ search.matches.value.length ? search.currentIndex.value + 1 : 0 }}
          / {{ search.matches.value.length }}
        </span>

        <app-button
          :secondary="!!search.matches.value.length"
          :disabled="!search.matches.value.length"
          class="chat-search__prev chat-search__button"
          @click="search.prev()"
        >
          <app-icon
            name="chevron"
            size="var(--fs-lg)"
            color="var(--text-primary)"
          />
        </app-button>

        <app-button
          :secondary="!!search.matches.value.length"
          :disabled="!search.matches.value.length"
          class="chat-search__next chat-search__button"
          @click="search.next()"
        >
          <app-icon
            name="chevron"
            size="var(--fs-lg)"
            color="var(--text-primary)"
            class="chevron-down"
          />
        </app-button>

        <app-button
          class="chat-search__close chat-search__button"
          @click="search.close()"
        >
          <app-icon
            name="cross"
            size="var(--fs-lg)"
            color="var(--text-secondary)"
          />
        </app-button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .chat-search__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 34px;
    cursor: pointer;
    transition: background-color var(--transition-slow);
    border-radius: var(--radius-sm);
  }
  .chat-search__icon:hover {
    background-color: var(--bg-surface-2);
  }
  .chat-search__bar {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .chat-search__count {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    white-space: nowrap;
  }
  .chat-search__button {
    max-width: 34px;
    height: 34px;
    width: 100%;
  }
  .chevron-down {
    transform: rotate(180deg);
  }
  .search-enter-active,
  .search-leave-active {
    transition: all var(--transition-base);
  }

  .search-enter-from,
  .search-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }

  .search-enter-to,
  .search-leave-from {
    opacity: 1;
    transform: scale(1);
  }
</style>
