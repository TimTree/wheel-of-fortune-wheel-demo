<template>
  <div>
    <audio ref="spinSound" preload="auto">
    <source src="@/assets/spin.mp3" type="audio/mpeg">
    </audio>
    <div class="demoTitle">
      Wheel of Fortune for Web - Wheel Demo
    </div>
    <div class="wheelValue" v-show="!isSpinning && wheelAngle > 0">
      You landed on
      <div class="amount" ref="amount">
      </div>
    </div>
    <div class="wheelInstructions">
      Click the wheel to spin!
    </div>
    <div class="aboutFooter">
      <p>©2020 Games by Tim.
         <a href='https://github.com/TimTree/wheel-of-fortune-wheel-demo' target='_blank' rel="noopener noreferrer">Source code</a></p>
      <p style="font-size:10px;">"Wheel of Fortune" is a registered trademark of Califon
         Productions, Inc, which was not involved in the production of, and does not endorse, this
          product. For more information about the game show, visit www.wheeloffortune.com.</p>
    </div>
    <div class="wheelTicker">
    </div>
    <div class="wheelSpinRegion">
      <div class="clickSpinArea" v-if="!isSpinning" v-on:mousedown="spin"></div>
      <div class="wheelOutline" ref="wheelOutline"
       v-bind:class="{workaroundChromeBlur : isSpinning}">
        <div class="wedges" v-for="wedge in generateWedges()" v-bind:key="wedge.id">
          <span :style="{color: wedge[0], display: 'flex', justifyContent: 'center'}">
            <svg width="116.69" height="271.51" version="1.1" viewBox="0 0 30.874 71.838">
            <g transform="translate(-101.62 -74.108)">
              <path transform="rotate(-97.5)"
              d="m-123.46 90.941a82.55 82.55 0 0 1-2.8128 21.366"
              fill="none" stroke="currentColor" stroke-width="71.438"/>
            </g>
            </svg>
            <img :src="wedge[1]"/>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wheels from '@/assets/wheels.json';
// 2500 = #69dff9
// 3500 = #ff2fab
// 5000 = #ddd

export default {
  data() {
    return {
      wheelAngle: 0,
      isKeyDown: false,
      isSpinning: false,
      valuesMatrix: [],
    };
  },
  methods: {
    generateWedges() {
      const wheelSet = 'normalRound2019';
      const wedges = [];
      for (let i = 0; i < 24; i += 1) {
        wedges.push([`${wheels[wheelSet].colors[i]}`, `/wedges/Wheel${wheels[wheelSet].values[i]}.svg`]);
      }
      return wedges;
    },
    generateValuesMatrix() {
      this.valuesMatrix = [];
      const wheelSet = 'normalRound2019';
      for (let i = 0; i < 24; i += 1) {
        if (wheels[wheelSet].values[i] === '10000') {
          this.valuesMatrix.push('Bankrupt', '10000', 'Bankrupt');
        } else {
          this.valuesMatrix.push(wheels[wheelSet].values[i],
            wheels[wheelSet].values[i], wheels[wheelSet].values[i]);
        }
      }
    },
    spin() {
      if (!this.isSpinning) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        this.$refs.spinSound.play();
        audioCtx.close();
        // Set event markers
        this.isSpinning = true;
        // Determine spin degrees by the 0.1
        const spinDegrees = 360 * 2 + (this.cryptoRandom(1, 3600) / 10);
        const spinTime = 3.7;
        this.$refs.wheelOutline.style.transition = `transform ${spinTime}s`;
        this.$refs.wheelOutline.style.transitionTimingFunction = 'cubic-bezier(0.2,0.05,0.1,1)';
        this.$refs.wheelOutline.style.transform = `rotate(${this.wheelAngle + spinDegrees}deg)`;
        this.wheelAngle += spinDegrees;
        this.determineValue(this.wheelAngle);
        this.wheelTimeout = setTimeout(() => { this.isSpinning = false; }, spinTime * 1000 + 100);
      }
    },
    determineValue(angle) {
      const theValue = this.valuesMatrix[Math.ceil((angle % 360) / 5) - 1];
      let dollarSign = '';
      if (typeof theValue === 'number' || theValue === '10000') {
        dollarSign = '$';
      }
      this.$refs.amount.innerHTML = dollarSign
       + theValue.toString().replace(/_/g, ' ');
    },
    cryptoRandom(min, max) {
      // Create an unsigned 32-bit array, required for crypto.getRandomValues
      // Unsigned 32-bit numbers range from 0 to 4,294,967,295.
      // The 1 means we're going to generate one number.
      const cryptoRandomSet = new Uint32Array(1);
      // Generate a crypto-random number from 0 to 4,294,967,295.
      window.crypto.getRandomValues(cryptoRandomSet);
      // Convert the generated number to math.random() format.
      // aka a number from 0-1 (including 0, but not 1)
      // To get this, we divide the generated number by 4,294,967,295, plus 1.
      // We need to add 1 to the denominator so we'll never get 1 as the result.
      const cryptoRandomNumber = cryptoRandomSet[0] / (4294967295 + 1);
      // Return the random integer based on prior math.random() logic
      return Math.floor(cryptoRandomNumber * (max - min + 1)) + min;
    },
  },
  created() {
    window.addEventListener('keydown', (e) => {
      if (!this.isKeyDown) {
        this.isKeyDown = true;
        if (e.keyCode === 32) {
          this.spin();
        }
      }
    });
    window.addEventListener('keyup', () => {
      this.isKeyDown = false;
    });
    this.generateValuesMatrix();
  },
  beforeDestroy() {
    window.removeEventListener('keydown', (e) => {
      if (!this.isKeyDown) {
        this.isKeyDown = true;
        if (e.keyCode === 32) {
          this.spin();
        }
      }
    });
    window.removeEventListener('keyup', () => {
      this.isKeyDown = false;
    });
  },
  destroyed() {
    clearTimeout(this.wheelTimeout);
  },
};
</script>

<style lang="scss" scoped>
  a {
    color: #aee7ff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .wheelTicker {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    width:0;
    height:0;
    top: 22px;
    border-left: 13px solid transparent;
    border-right: 13px solid transparent;
    border-top: 39px solid #eee;
    z-index: 10000;

  }

  .wheelSpinRegion {
    position: relative;
    width: 636px;
    height: 636px;
  }

  .clickSpinArea {
    position: absolute;
    cursor: pointer;
    height: 636px;
    width: 636px;
    border-radius: 50%;
    z-index: 2;
  }

  .wheelOutline {
    position: absolute;
    width: 630px;
    height: 630px;
    background: #62666b;
    background-image: radial-gradient(#2b9377 28%, #717a85 28%);
    border-radius: 315px;
    border: 3px solid #111;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
  }

  .clickSpinArea:hover + .wheelOutline {
    background-image: radial-gradient(#2b9377 28%, #b39350 28%);
  }

  .demoTitle {
    position: absolute;
    left: 30px;
    top: 20px;
    color: $white-text-color;
    transition: transform 2s;
  }

  .wheelInstructions {
    position: absolute;
    left: 970px;
    top: 100px;
    background: rgba(255,255,255,0.3);
    padding: 10px 20px;
    color: #000;
    font-size: 27px;
    font-weight: 700;
    width: 210px;
    text-align: center;
    border-radius: 8px;
  }

  .wheelValue {
    position: absolute;
    left: 38px;
    top: 310px;
    background: rgba(255,255,255,0.3);
    padding: 10px 20px;
    color: #000;
    font-size: 18px;
    font-weight: 700;
    width: 200px;
    text-align: center;
    border-radius: 8px;
  }

  .amount {
    font-size: 34px;
    margin-top: 5px;
  }

  .aboutFooter {
    position: absolute;
    left: 935px;
    top: 530px;
    width: 300px;
    color: $white-text-color;
    z-index: 2;
    padding: 10px;
  }

  .wedges {
    position: absolute;
    width: 620px;
    height: 620px;
    display: flex;
    justify-content: center;
  }

  @for $i from 1 through 24 {
    .wedges:nth-child(#{$i}) {
      transform: rotate(#{(367.5-15*$i)}deg);
    }
  }

  svg, img {
    position: absolute;
    height: 188px;
  }
</style>
