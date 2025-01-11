<script>
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";
import PrimaryButton from "@/components/PrimaryButton";
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "NewsOptionsModal",
  components: {
    ModalOptionsToggleButton,
    ModalWrapperOptions,
    PrimaryButton,
    SliderComponent
  },
  data() {
    return {
      enabled: false,
      repeatBuffer: 40,
      AIChance: 0,
      speed: 1,
      includeAnimated: false,
    };
  },
  computed: {
    newsOnOffLabel() {
      return `News: ${this.enabled ? "On" : "Off"}`;
    },
    sliderPropsRepeatBuffer() {
      return {
        min: 0,
        max: 80,
        interval: 1,
        width: "98%",
        tooltip: false
      };
    },
    sliderPropsAIChance() {
      return {
        min: 0,
        max: 1,
        interval: 0.01,
        width: "98%",
        tooltip: false
      };
    },
  },
  watch: {
    type(newValue) {
      player.options.news.type = newValue;
    },
    repeatBuffer(newValue) {
      player.options.news.repeatBuffer = parseInt(newValue, 10);
    },
    AIChance(newValue) {
      player.options.news.AIChance = parseFloat(newValue, 10);
    },
    includeAnimated(newValue) {
      player.options.news.includeAnimated = newValue;
    },
  },
  methods: {
    update() {
      const options = player.options.news;
      this.enabled = options.enabled;
      this.repeatBuffer = options.repeatBuffer;
      this.AIChance = options.AIChance;
      this.includeAnimated = options.includeAnimated;
    },
    adjustSliderValueRepeatBuffer(value) {
      this.repeatBuffer = value;
      player.options.repeatBuffer = this.repeatBuffer;
    },
    adjustSliderValueAIChance(value) {
      this.AIChance = value;
      player.options.AIChance = this.AIChance;
    },
    toggleNews() {
      if (player.options.news.enabled) {
        if (SecretAchievement(33).isUnlocked) return;
        SecretAchievement(33).unlock();
      }
      GameOptions.toggleNews();
    }
  }
};
</script>

<template>
  <ModalWrapperOptions>
    <template #header>
      News Options
    </template>
    <PrimaryButton
      class="o-primary-btn o-primary-btn--option-wide"
      @click="toggleNews"
    >
      {{ newsOnOffLabel }}
    </PrimaryButton>
    <div class="o-primary-btn o-primary-btn--option-wide o-primary-btn--slider">
      <b>{{ formatInt(parseInt(repeatBuffer)) }} message repeat buffer</b>
      <SliderComponent
        class="o-primary-btn--slider__slider"
        v-bind="sliderPropsRepeatBuffer"
        :value="repeatBuffer"
        @input="adjustSliderValueRepeatBuffer($event)"
      />
    </div>
    <div class="o-primary-btn o-primary-btn--option-wide o-primary-btn--slider">
      <b>{{ formatPercents(parseFloat(AIChance)) }} AI messages</b>
      <SliderComponent
        class="o-primary-btn--slider__slider"
        v-bind="sliderPropsAIChance"
        :value="AIChance"
        @input="adjustSliderValueAIChance($event)"
      />
    </div>
    <ModalOptionsToggleButton
      v-model="includeAnimated"
      class="o-primary-btn o-primary-btn--option-wide"
      text="Animation Effects:"
    />
  </ModalWrapperOptions>
</template>
