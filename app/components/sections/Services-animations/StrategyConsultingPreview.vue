<template>
  <div class="srv-ani srv-ani--isometric" aria-hidden="true">
    <img class="srv-ani__img" src="/svg/ISOMETRIC.svg" alt="" loading="lazy" decoding="async">
  </div>
</template>

<style scoped>
.srv-ani {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: clamp(8px, 1.2vw, 14px);
  box-sizing: border-box;
}

.srv-ani__img {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
}
</style>
