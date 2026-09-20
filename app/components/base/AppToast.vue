<script setup lang="ts">
import { toasts, removeToast } from '~/stores/toastStore';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

const W = 260, H = 74, R = 12;
const PERIMETER = 2 * ((W - 2 * R) + (H - 2 * R) + Math.PI * R);
</script>

<template>
  <div class="toast">
    <transition-group name="slide">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast__item"
        @click="removeToast(toast.id)"
      >
        <svg class="toast__border" viewBox="0 0 260 74" fill="none">
          <rect x="1" y="1" width="258" height="72" rx="12" class="toast__border-base" />
          <rect
            x="1" y="1" width="258" height="72" rx="12"
            class="toast__border-progress"
            :style="{
              strokeDasharray: PERIMETER,
              animationDuration: `${toast.duration}ms`
            }"
          />
        </svg>

        <div class="toast__avatar">
          <img v-if="toast.avatar" :src="toast.avatar" :alt="toast.name" />
          <span v-else>{{ getInitials(toast.name) }}</span>
          <span class="toast__online" />
        </div>

        <div class="toast__body">
          <div class="toast__header">
            <span class="toast__name">{{ toast.name }}</span>
            <span class="toast__time">{{ toast.time }}</span>
          </div>
          <div class="toast__message">{{ toast.message }}</div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
  .toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 1000;
  }
  .toast__item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--bg-surface);
    border-radius: 12px;
    padding: 20px 14px;
    width: 260px;
    cursor: pointer;
  }
  .toast__border {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
  }
  .toast__border-base {
    fill: none;
    stroke: var(--border);
    stroke-width: 1.5;
  }
  .toast__border-progress {
    fill: none;
    stroke: var(--primary);
    stroke-width: 2;
    stroke-linecap: round;
    animation: drain linear forwards;
  }

  @keyframes drain {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: v-bind(PERIMETER); }
  }

  .toast__avatar {
    position: relative;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    overflow: hidden;
  }
  .toast__avatar img { 
    width: 100%; height: 100%;
    object-fit: cover;
  }
  .toast__online {
    position: absolute;
    bottom: 5px;
    right: 4px;
    width: 10px;
    height: 9px;
    border-radius: 50%;
    background: var(--success);
    border: 1.5px solid var(--bg-surface-3);
  }
  .toast__body { 
    flex: 1; 
    min-width: 0; 
  }
  .toast__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }
  .toast__name { 
    font-size: 13px; 
    font-weight: 500; 
    color: var(--text-primary); 
  }
  .toast__time { 
    font-size: 11px; 
    color: var(--text-secondary); }
  .toast__message {
    font-size: 12px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .slide-enter-active, .slide-leave-active { 
    transition: all 0.3s ease; 
  }
  .slide-enter-from, .slide-leave-to { 
    opacity: 0; transform: translateX(20px); 
  }
</style>