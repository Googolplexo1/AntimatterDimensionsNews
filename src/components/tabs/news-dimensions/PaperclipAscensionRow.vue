<script>
import { NewsDimensions, resetNewsDimensions } from "@/core/dimensions/news-dimension";

export default {
  name: "PaperclipAscensionRow",
  data() {
    return {
      isBuyable: false,
      purchasedAscensions: 0,
      effect: new Decimal(0),
    };
  },
  computed: {
    classObject() {
      return {
        "o-primary-btn o-primary-btn--new o-primary-btn--dimension-reset": true,
        "o-primary-btn--disabled": !this.isBuyable
      };
    }
  },
  methods: {
    update() {
      this.purchasedAscensions = player.news.specialTickerData.ascensions;
      this.isBuyable = NewsDimensions.capReached();
      this.effect = Decimal.pow(3, this.purchasedAscensions)
    },
    ascend() {
      if (!this.isBuyable) return;
      resetNewsDimensions();
    }
  }
};
</script>

<template>
  <div class="reset-container dimboost">
    <h4>Paperclip Ascension ({{ purchasedAscensions }})</h4>
    <span>Requires capping the news scrolling speed</span>
    <button
      :class="classObject"
      @click="ascend()"
    >
      Reset non-purchased News Dimensions and slow the news down by a factor of 10,
      but triple paperclip gain
      <br>
      Currently: {{ formatX(effect, 2, 1) }}
    </button>
  </div>
</template>
