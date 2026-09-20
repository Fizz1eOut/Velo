<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { searchUsers } from '~/api/users/searchUsers';
  import { debounce } from '~/utils/debounce';
  import AppInput from '~/components/inputs/AppInput.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import AppDropdown from '~/components/base/AppDropdown.vue';
  import type { Profile } from '~/interface/profile.interface';

  const query = ref('');
  const results = ref<Profile[]>([]);
  const isLoading = ref(false);
  const inputRef = ref<InstanceType<typeof AppInput> | null>(null);

  const focus = () => {
    inputRef.value?.focus();
  };
  defineExpose({ focus });

  const emit = defineEmits<{
    userId: [userId: string]
  }>();

  const isEmpty = computed(
    () => query.value.trim().length > 0 && !isLoading.value && results.value.length === 0
  );

  const performSearch = async (q: string) => {
    if (!q.trim()) {
      results.value = [];
      return;
    }

    isLoading.value = true;
    const { data } = await searchUsers(q);
    console.log('performSearch result:', data);
    results.value = data ?? [];
    isLoading.value = false;
  };

  const debouncedSearch = debounce(performSearch, 300);

  const onInput = (e: Event) => {
    query.value = (e.target as HTMLInputElement).value;
    debouncedSearch(query.value);
  };

  const close = () => {
    query.value = '';
    results.value = [];
  };

  const selectUser = async (user: Profile) => {
    close();
    console.log(user.id);
    
    emit('userId', user.id);
  };
</script>

<template>
  <div class="search" @click.stop>
    <app-input
      ref="inputRef"
      :model-value="query"
      type="text"
      placeholder="Search by name or username..."
      autofocus
      @input="onInput"
    >
      <template v-if="query" #icon-after>
        <app-button @click="close">
          <app-icon 
            name="cross"
            size="var(--fs-xs)"
            color="var(--text-primary)"
          />
        </app-button>
      </template>
    </app-input>

    <app-dropdown :active="!!query">
      <div v-if="isLoading">Searching...</div>

      <div v-else-if="isEmpty" class="search-empty">Users not found</div>

      <div
        v-for="user in results"
        v-else
        :key="user.id"
        class="search__item"
        @click="selectUser(user)"
      >
        <img :src="user.avatar_url || '/default-avatar.png'" :alt="user.username" >
      </div>
    </app-dropdown>
  </div>
</template>

<style scoped>
  .search {
    position: relative;
  }
  .search-empty {
    font-size: var(--fs-xs);
    color: var(--error);
  }
</style>
