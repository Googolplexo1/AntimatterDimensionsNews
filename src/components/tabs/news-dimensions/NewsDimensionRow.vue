<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";

import { NewsDimension, buySingleNewsDimension } from "@/core/dimensions/news-dimension";

export default {
  name: "NewsDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: 0,
      rateOfChange: new Decimal(0),
      cost: new Decimal(0),
      isAvailableForPurchase: false,
    };
  },
  computed: {
    name() {
      return `${NewsDimension(this.tier).shortDisplayName} News Dimension`;
    },
    tooltipContents() {
      return `Purchased ${quantifyInt("time", this.bought)}`;
    },
    costText() {
      return `Cost: ${quantify("paperclip", this.cost)}`;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = NewsDimension(tier);
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.amount);
      this.bought = dimension.bought;
      if (tier < 4) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
    },
    buyNewsDimension() {
      buySingleNewsDimension(this.tier);
    },
  }
};
</script>

<template>
  <div
    class="c-dimension-row l-dimension-single-row l-dimension-row-news-dim"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 1)"
      :amount-text="format(amount, 2)"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container">
      <PrimaryButton
        :enabled="isAvailableForPurchase"
        class="o-primary-btn--buy-td o-primary-btn--buy-dim c-dim-tooltip-container"
        @click="buyNewsDimension"
      >
        {{ costText }}
        <div class="c-dim-purchase-count-tooltip">
          <span v-html="tooltipContents" />
        </div>
      </PrimaryButton>
    </div>
  </div>
</template>
