<script setup lang="ts">
const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner layout-boundary">
      <p class="site-footer__copyright">
        {{ t('footer.copyright', { year: currentYear }) }}
      </p>

      <div class="site-footer__legal" aria-label="Footer legal links">
        <span class="site-footer__legal-item">{{ t('footer.terms') }}</span>
        <span class="site-footer__legal-separator" aria-hidden="true">·</span>
        <span class="site-footer__legal-item">{{ t('footer.privacy') }}</span>
      </div>
    </div>
  </footer>
</template>
