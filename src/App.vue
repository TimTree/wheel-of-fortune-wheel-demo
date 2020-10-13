<template>
  <div id="app">
    <div class="container" ref="container">
      <div class="topRight" v-bind:class="{topRightSmall :
          !this.$store.state.isTitleSlide}">
        <div class="guideButton" v-if="!this.$store.state.isTitleSlide"
         href="#" target="_blank" title="Guide">?</div>
        <div class="fullscreenToggle" v-on:click="toggleFullScreen">
          <div class="fullscreenButtonUp" v-bind:class="{fullscreenButtonDown :
          !fullscreenButtonStatus}" title="Toggle fullscreen">
            <div class="fullscreenArrowSW"></div>
            <div class="fullscreenArrowNE"></div>
          </div>
        </div>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Commissioner:wght@400;700&display=swap');
html { font-family: 'Commissioner', sans-serif; }

html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  height: 100%;
  line-height: 1.3;
  color: $white-text-color;
}

* {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
}

input {
  -webkit-touch-callout: default; /* iOS Safari */
  -webkit-user-select: text; /* Safari */
  user-select: text;
}

#app {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  flex-shrink: 0;
  width: 1280px;
  height: 720px;
  overflow: hidden;
  background-image: $primary-bg;
}

.topRight {
  position: absolute;
  right: 25px;
  top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.topRightSmall {
  right: 0;
  top: -1px;
  transform: scale(0.5);
}

.fullscreenToggle {
  position: relative;
  width: 30px;
  height:30px;
  cursor: pointer;
}

.fullscreenButtonUp, .fullscreenButtonDown {
  width: 30px;
  height: 30px;
}

.fullscreenArrowSW, .fullscreenArrowNE {
  width: 12px;
  height: 12px;
  position: absolute;
  background-image: url('assets/fullscreenArrow.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

.fullscreenArrowSW {
  top: 15px;
  left: 2px;
}

.fullscreenArrowNE {
  top: 2px;
  left: 15px;
  transform: rotate(180deg);
}

.fullscreenButtonUp:hover > .fullscreenArrowSW {
  top: 17px;
  left: 0;
}

.fullscreenButtonUp:hover > .fullscreenArrowNE {
  top: 0;
  left: 17px;
}

.fullscreenButtonDown > .fullscreenArrowSW {
  top: 17px;
  left: 0;
  transform: rotate(180deg);
}

.fullscreenButtonDown > .fullscreenArrowNE {
  top: 0;
  left: 17px;
  transform: rotate(0deg);
}

.fullscreenButtonDown:hover > .fullscreenArrowSW {
  top: 15px;
  left: 2px;
}

.fullscreenButtonDown:hover > .fullscreenArrowNE {
  top: 2px;
  left: 15px;
}

.guideButton {
  font-weight: 700;
  font-size: 30px;
  color: #e0e0e0;
  margin-right: 36px;
  cursor: pointer;
  transition: color 0.12s;
}

.guideButton:hover {
  color: rgb(253,207,18);
}

/* When an element animates in Chrome/Safari, any element with
a z-index higher than the element being animated becomes blurry.

To minimize (but not fully fix) the blur in Chrome, append this
class to the animated element so every other element's z-index
is lower.

Don't ask me why this happens. I'm just as annoyed as you are.
Worse, there's no known way to remove the blur on desktop Safari
with non-retina displays. */
.workaroundChromeBlur {
  z-index: 9999;
}

.fade-enter-active {
  transition: opacity .3s ease-in;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

<script>

export default {
  data() {
    return {
      fullscreenButtonStatus: true,
      publicPath: process.env.BASE_URL,
    };
  },
  methods: {
    onResize() {
      const areaMultiplier = this.$refs.container.offsetHeight
       / this.$refs.container.offsetWidth;
      const windowMultiplier = window.innerHeight / window.innerWidth;
      if (windowMultiplier < areaMultiplier) { // window is wider
        this.$refs.container.style.transform = `scale(${window.innerHeight / this.$refs.container.offsetHeight})`;
      } else {
        this.$refs.container.style.transform = `scale(${window.innerWidth / this.$refs.container.offsetWidth})`;
      }
    },
    isFullScreen() {
      const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement
       || document.webkitFullscreenElement || document.msFullscreenElement;
      if (fullscreenElement === null || fullscreenElement === undefined) {
        return false;
      } return true;
    },
    toggleFullScreen() {
      const canvas = document.body;
      if (!this.isFullScreen()) {
        if (canvas.requestFullscreen) {
          canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullScreen) {
          canvas.webkitRequestFullScreen();
        }
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
    onFullScreenChange() {
      if (!this.isFullScreen()) {
        this.fullscreenButtonStatus = true;
      } else {
        this.fullscreenButtonStatus = false;
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
    document.addEventListener('fullscreenchange', this.onFullScreenChange, false);
    document.addEventListener('webkitfullscreenchange', this.onFullScreenChange, false);
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    // eslint-disable-next-line no-unused-vars
    const audioCtx = new AudioContext();
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('fullscreenchange', this.onFullScreenChange, false);
    document.removeEventListener('webkitfullscreenchange', this.onFullScreenChange, false);
  },
};
</script>
