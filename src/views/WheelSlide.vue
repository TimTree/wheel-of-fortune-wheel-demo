<template>
  <transition name="fade" appear>
  <div class="slide">
    <Wheel />
  </div>
  </transition>
</template>

<script>
// @ is an alias to /src
import Wheel from '@/components/Wheel.vue';

export default {
  name: 'wheelSlide',
  components: {
    Wheel,
  },
  data() {
    return {
    };
  },
  created() {
    this.$store.commit('isTitleSlide', true);
  },
};
</script>

<style lang="scss" scoped>
  .slide {
    height:100%;
    overflow: hidden;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
  }
</style>
