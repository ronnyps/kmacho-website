<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner layout-boundary">
      <p>{{ t('footer.line') }}</p>
    </div>
  </footer>
</template>
