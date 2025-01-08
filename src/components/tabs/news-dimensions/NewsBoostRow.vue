<script>
import { boostMultiplier } from "@/core/dimensions/news-dimension";

export default {
  name: "NewsBoostRow",
  data() {
    return {
      cost: new Decimal(0),
      isBuyable: false,
      purchasedBoosts: 0,
      effect: new Decimal(0),
    };
  },
  computed: {
    classObject() {
      return {
        "o-primary-btn o-primary-btn--new o-primary-btn--dimension-reset": true,
        "o-primary-btn--disabled": !this.isBuyable,
      };
    }
  },
  methods: {
    update() {
      this.purchasedBoosts = player.news.specialTickerData.boosts;
      this.cost = Decimal.pow(10, Math.pow(10, this.purchasedBoosts) * 9);
      this.isBuyable = player.antimatter.gte(this.cost);
      this.effect = boostMultiplier();
    },
    buyBoost() {
      if (!this.isBuyable) return;
      player.news.specialTickerData.boosts++;
      Currency.antimatter.subtract(this.cost);
    }
  }
};
</script>

<template>
  <div class="reset-container dimboost">
    <h4>News Boost ({{ purchasedBoosts }})</h4>
    <span>Cost: {{ format(this.cost) }} antimatter</span>
    <button
      :class="classObject"
      @click="buyBoost()"
    >
      Make all News Dimensions {{ formatPercents(0.5) }} stronger
      <br>
      Currently: {{ formatX(effect, 2, 1) }}
    </button>
  </div>
</template>
