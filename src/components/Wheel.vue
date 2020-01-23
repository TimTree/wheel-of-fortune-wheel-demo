<template>
  <div>
    <div class="demoTitle">
      Wheel of Fortune for Web - Wheel Demo
    </div>
    <div class="strength">
      STRENGTH
      <div class="strengthBox">
        <div class="strengthMeter" ref="strengthMeter"
        v-bind:class="{strengthMeterAnimation : isStrengthening}">
        </div>
      </div>
      <div class="strengthPercentage" ref="strengthPercentage">
      </div>
    </div>
    <div class="wheelValue" v-show="!isStrengthening && !isSpinning && wheelAngle > 0">
      You landed on
      <div class="amount" ref="amount">
      </div>
    </div>
    <div class="wheelInstructions">
      Click/hold the wheel to spin!
    </div>
    <div class="aboutFooter">
      <p>©2020 Games by Tim.
         <a href='https://github.com/TimTree/wheel-of-fortune-wheel-demo' target='_blank'>Source</a></p>
      <p><a href='https://forms.gle/oBiGSo1aivxQbdHp7' target='_blank'>Complete the survey!</a></p>
      <p style="font-size:10px;">"Wheel of Fortune" is a registered trademark of Califon
         Productions, Inc, which was not involved in the production of, and does not endorse, this
          product. For more information about the game show, visit www.wheeloffortune.com.</p>
      <p style="font-size:10px;">Wheel wedges created by
         <a href='http://buyavowel.boards.net/thread/6608/all-wheel-wedges' target='_blank'>MarioGS</a>/
        <a href='https://www.deviantart.com/wheelgenius' target='_blank'>wheelgenius</a>,
         used with permission.</p>
    </div>
    <div class="wheelTicker">
    </div>
    <div class="wheelOutline" v-bind:class="{charging : isStrengthening, noClick : isSpinning,
     workaroundChromeBlur : isSpinning}"
     v-touch:start="mouseDown" v-touch:end="spin" ref="wheelOutline">
      <div class="wedges" v-for="wedge in generateWedges()" v-bind:key="wedge.id">
        <img :src="wedge" />
      </div>
    </div>
  </div>
</template>

<script>
import wheels from '@/assets/wheels.json';

export default {
  data() {
    return {
      wheelAngle: 0,
      isStrengthening: false,
      isSpinning: false,
      valuesMatrix: [],
    };
  },
  methods: {
    generateWedges() {
      const wheelSet = 'normalRound2019';
      const specialWedges = [2500, 3500, 5000, '10000', 'Bankrupt', 'Lose_a_Turn', 'Free_Play', 'Express', 'Jackpot', 'Mystery'];
      const wedgesArray = [];
      for (let i = 0; i < 24; i += 1) {
        if (specialWedges.includes(wheels[wheelSet].values[i])) {
          wedgesArray.push(`/wedges/${wheels[wheelSet].values[i]}.png`);
        } else {
          wedgesArray.push(`/wedges/${wheels[wheelSet].values[i]}_${wheels[wheelSet].colors[i]}.png`);
        }
      }
      return wedgesArray;
    },
    generateValuesMatrix() {
      this.valuesMatrix = [];
      const wheelSet = 'normalRound2019';
      for (let i = 23; i > -1; i -= 1) {
        if (wheels[wheelSet].values[i] === '10000') {
          this.valuesMatrix.push('Bankrupt', '10000', 'Bankrupt');
        } else {
          this.valuesMatrix.push(wheels[wheelSet].values[i],
            wheels[wheelSet].values[i], wheels[wheelSet].values[i]);
        }
      }
    },
    mouseDown() {
      if (!this.isSpinning && !this.isStrengthening) {
        this.$refs.strengthPercentage.innerHTML = '';
        this.isStrengthening = true;
      }
    },
    spin() {
      if (!this.isSpinning && this.isStrengthening) {
        this.isStrengthening = false;
        this.isSpinning = true;
        const strengthMeterWidth = parseFloat(window.getComputedStyle(this.$refs.strengthMeter).getPropertyValue('width'));
        const strengthMeterPercent = Math.round(strengthMeterWidth / 250 * 1000) / 10;
        this.$refs.strengthMeter.style.width = `${strengthMeterWidth}px`;
        this.$refs.strengthPercentage.innerHTML = `${strengthMeterPercent}%`;
        const spinDegrees = 3600 + (32400 * strengthMeterPercent / 100)
         + this.cryptoRandom(0, 3599);
        // spinTime ranges from 3 to 5 seconds
        const spinTime = 3 + (spinDegrees - 3600) / 35999 * 2;
        // bezierY1 ranges from 0 to 1
        const bezierY1 = 0 + (spinDegrees - 3600) / 35999;
        // bezierX2 ranges from 0.3 to 0.05
        const bezierX2 = 0.3 - (spinDegrees - 3600) / 35999 * 0.25;
        this.$refs.wheelOutline.style.transition = `transform ${spinTime}s`;
        this.$refs.wheelOutline.style.transitionTimingFunction = `cubic-bezier(0,${bezierY1},${bezierX2},1)`;
        this.$refs.wheelOutline.style.transform = `rotate(${this.wheelAngle + spinDegrees / 10}deg)`;
        this.wheelAngle += spinDegrees / 10;
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
      if (e.keyCode === 32) {
        this.mouseDown();
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.keyCode === 32) {
        this.spin();
      }
    });
    this.generateValuesMatrix();
  },
  beforeDestroy() {
    window.removeEventListener('keydown', (e) => {
      if (e.keyCode === 32) {
        this.mouseDown();
      }
    });
    window.removeEventListener('keyup', (e) => {
      if (e.keyCode === 32) {
        this.spin();
      }
    });
  },
  destroyed() {
    clearTimeout(this.wheelTimeout);
  },
};
</script>

<style lang="scss" scoped>
  a {
    color:#aee7ff;
  }

  .wheelTicker {
    position:absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    width:0;
    height:0;
    top:22px;
    border-left: 13px solid transparent;
    border-right: 13px solid transparent;
    border-top: 39px solid #f8f8f8;
    z-index:10000;

  }

  .wheelOutline {
    position:relative;
    width:630px;
    height:630px;
    background:#62666b;
    background-image: radial-gradient(#2b9377 28%, #717a85 28%);
    border-radius:315px;
    border:3px solid #111;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
    cursor: pointer;
    overflow:hidden;
  }

 .wheelOutline:hover {
    background-image: radial-gradient(#2b9377 28%, #b39350 28%);
  }

  .charging, .charging:hover {
    background-image: radial-gradient(#2b9377 28%, #c24130 28%);
  }

  .noClick {
    cursor:default;
  }

  .noClick:hover {
    background-image: radial-gradient(#2b9377 28%, #717a85 28%);
  }

  .strength {
    position:absolute;
    left:30px;
    top:100px;
    color:$white-text-color;
  }

  .strengthBox {
    width:250px;
    height:32px;
    border-left:2px solid #c0c0c0;
    border-right:2px solid #c0c0c0;
    margin-top:10px;
    display:flex;
    align-items:center;
  }

  .strengthMeter {
    height:24px;
    width:0px;
    background:orange;
  }

  .strengthMeterAnimation {
    animation: osc 0.6s;
    animation-iteration-count:infinite;
    animation-timing-function:cubic-bezier(0.67,0,1,1);
    animation-direction: alternate;
  }

  @keyframes osc {0%{width:0px;} 100%{width:250px;}}

  .demoTitle {
    position:absolute;
    left:30px;
    top:20px;
    color:$white-text-color;
    transition: transform 2s;
  }

  .wheelInstructions {
    position:absolute;
    left:970px;
    top:100px;
    background:rgba(255,255,255,0.3);
    padding:10px 20px;
    color:#000;
    font-size:27px;
    font-weight:700;
    width:200px;
    text-align:center;
    border-radius:8px;
  }

  .wheelValue {
    position:absolute;
    left:38px;
    top:310px;
    background:rgba(255,255,255,0.3);
    padding:10px 20px;
    color:#000;
    font-size:18px;
    font-weight:700;
    width:200px;
    text-align:center;
    border-radius:8px;
  }

  .amount {
    font-size:34px;
    margin-top:5px;
  }

  .aboutFooter {
    position:absolute;
    left:935px;
    top:510px;
    width:300px;
    color:$white-text-color;
    z-index:2;
    padding:10px;
  }

  .wedges {
    position:absolute;
    width: 620px;
    height: 620px;
    text-align:center;
  }

  .wedges:nth-child(1) {
    transform:rotate(7.5deg);
  }

  .wedges:nth-child(2) {
    transform:rotate(22.5deg);
  }

  .wedges:nth-child(3) {
    transform:rotate(37.5deg);
  }

  .wedges:nth-child(4) {
    transform:rotate(52.5deg);
  }

  .wedges:nth-child(5) {
    transform:rotate(67.5deg);
  }

  .wedges:nth-child(6) {
    transform:rotate(82.5deg);
  }

  .wedges:nth-child(7) {
    transform:rotate(97.5deg);
  }

  .wedges:nth-child(8) {
    transform:rotate(112.5deg);
  }

  .wedges:nth-child(9) {
    transform:rotate(127.5deg);
  }

  .wedges:nth-child(10) {
    transform:rotate(142.5deg);
  }

  .wedges:nth-child(11) {
    transform:rotate(157.5deg);
  }

  .wedges:nth-child(12) {
    transform:rotate(172.5deg);
  }

  .wedges:nth-child(13) {
    transform:rotate(187.5deg);
  }

  .wedges:nth-child(14) {
    transform:rotate(202.5deg);
  }

  .wedges:nth-child(15) {
    transform:rotate(217.5deg);
  }

  .wedges:nth-child(16) {
    transform:rotate(232.5deg);
  }

  .wedges:nth-child(17) {
    transform:rotate(247.5deg);
  }

  .wedges:nth-child(18) {
    transform:rotate(262.5deg);
  }

  .wedges:nth-child(19) {
    transform:rotate(277.5deg);
  }

  .wedges:nth-child(20) {
    transform:rotate(292.5deg);
  }

  .wedges:nth-child(21) {
    transform:rotate(307.5deg);
  }

  .wedges:nth-child(22) {
    transform:rotate(322.5deg);
  }

  .wedges:nth-child(23) {
    transform:rotate(337.5deg);
  }

  .wedges:nth-child(24) {
    transform:rotate(352.5deg);
  }

  img {
    height:188px;
  }
</style>
