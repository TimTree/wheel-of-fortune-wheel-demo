<template>
  <transition name="fade" appear>
  <div class="slide">
    <h1>This is an about page</h1>
  </div>
  </transition>
</template>

<style lang="scss" scoped>
  .slide {
    height: 100%;
    overflow: hidden;
    background-image: $primary-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: $white-text-color;
  }
</style>

<script>

export default {
  data() {
    return {
    };
  },
  created() {
    this.$store.commit('isTitleSlide', false);
  },
};
</script>
