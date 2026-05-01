<template>
  <h2 class="title">
    <slot></slot>
  </h2>
</template>
<style scoped>
  .title {
    font-family: var(--ff-display);
    font-size: var(--fs-xl);
    font-weight: var(--fw-bold);
    color: var(--text-primary);  
  } 
  @media (max-width: 768px) {
    .title {
      font-size: var(--fs-lg);
    }
  }
</style>