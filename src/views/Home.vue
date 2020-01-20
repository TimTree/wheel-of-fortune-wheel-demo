<template>
  <div class="slide">
    <Wheel />
  </div>
</template>

<script>
// @ is an alias to /src
import Wheel from '@/components/Wheel.vue';

export default {
  name: 'home',
  components: {
    Wheel,
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
  .slide {
    height:100%;
    overflow: hidden;
    background-image: $primary-bg;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
  }
</style>
