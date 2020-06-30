<template>
  <div class="about">
    <p>
      WiPeR (stands for WikiPedia Remote editor) allows you to contribute to
      Wikipedia by simply accepting or refusing suggestions.
      <br />
      Each decision counts for one contribution on Wikipedia.
      <br /><br />
      Want to know more about this project or report issues?
      <br />
      The website's code is hosted on
      <a target="_blank" href="https://github.com/bperel/wiper">bperel/wiper</a>
      whereas the backend is based on
      <a target="_blank" href="https://languagetool.org">languagetool</a> and
      hosted on
      <a target="_blank" href="https://github.com/bperel/languagetool-wiper"
        >bperel/languagetool</a
      >.
    </p>
    <b-card-group deck columns>
      <b-card title="Decision breakdown">
        <chart :options="decisionsPerDay"></chart>
      </b-card>
      <b-card title="Decision percentage">
        <b-card-header
          >This represents the percentage of "Fix" decisions in proportion to
          the total amount of decisions made by users.<br />
          It is usually a good indicator of the quality of the
          suggestions.</b-card-header
        >
        <chart :options="decisionPercentagesPerWeek"></chart>
      </b-card>
      <b-card title="Top contributors">
        <b-table striped hover :items="contributors"></b-table>
      </b-card>
      <b-card class="pending-suggestions" title="Undecided suggestions">
        <div id="counters">
          <div
            class="counter"
            :key="pendingSuggestionForLanguage.language"
            v-for="pendingSuggestionForLanguage in pendingSuggestions"
          >
            <b-badge
              >Wikipedia {{ pendingSuggestionForLanguage.language }}</b-badge
            >
            <h2 class="timer count-title count-number">
              {{ pendingSuggestionForLanguage.count }}
            </h2>
          </div>
        </div>
      </b-card>
    </b-card-group>
    <b-card-group deck columns>
      <b-card
        id="top-refused-categories"
        title="Top refused suggestion categories (last 2 weeks)"
      >
        <b-table striped hover :items="mostRefusedSuggestionCategories">
          <template v-slot:cell(sampleSuggestionId)="data">
            <SuggestionDiff :suggestion-id="data.item.sampleSuggestionId" />
          </template>
          <template v-slot:head(sampleSuggestionId)>
            Sample
          </template>
        </b-table>
      </b-card>
    </b-card-group>
  </div>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
import SuggestionDiff from "../components/SuggestionDiff";

Date.prototype.addDay = function () {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + 1);
  return date;
};

Date.prototype.toShortISOString = function () {
  return this.toISOString().match(/^[^T]+/)[0];
};

export default {
  name: "About",
  components: {
    SuggestionDiff,
  },
  computed: {
    ...mapState(["LANGUAGETOOL_ENDPOINT_ROOT"]),
  },
  data: () => ({
    pendingSuggestions: [],
    contributors: [],
    mostRefusedSuggestionCategories: [],
    decisionsPerDay: {
      xAxis: {
        data: [],
      },
      yAxis: {
        type: "value",
      },
      tooltip: {
        show: true,
        trigger: "axis",
      },
      series: [
        {
          name: "Denied",
          type: "line",
          stack: "Decisions",
          areaStyle: {
            color: "#f00",
          },
          data: [],
        },
        {
          name: "Approved",
          type: "line",
          stack: "Decisions",
          areaStyle: {
            color: "#080",
          },
          data: [],
        },
      ],
    },
    decisionPercentagesPerWeek: {
      xAxis: {
        data: [],
      },
      yAxis: {
        type: "value",
      },
      tooltip: {
        show: true,
        trigger: "axis",
      },
      series: [
        {
          name: "Denied",
          type: "line",
          stack: "Decisions",
          areaStyle: {
            color: "#f00",
          },
          data: [],
        },
        {
          name: "Approved",
          type: "line",
          stack: "Decisions",
          areaStyle: {
            color: "#080",
          },
          data: [],
          label: {
            formatter: function (params) {
              return `${params.value}%`;
            },
            show: true,
            position: "bottom",
          },
        },
      ],
    },
  }),

  mounted() {
    let vm = this;
    axios
      .get(`${this.LANGUAGETOOL_ENDPOINT_ROOT}/stats`)
      .then(({ data }) => {
        vm.contributors = data.contributors;
        vm.mostRefusedSuggestionCategories =
          data.mostRefusedSuggestionCategories;
        vm.pendingSuggestions = data.pendingSuggestions;
        data.decisionPercentages.forEach(({ month, appliedPercentage }) => {
          vm.decisionPercentagesPerWeek.xAxis.data.push(month);
          let appliedPercentages = [100 - appliedPercentage, appliedPercentage];
          [false, true].forEach((applied, serieIndex) => {
            vm.decisionPercentagesPerWeek.series[serieIndex].data.push(
              Math.round(appliedPercentages[serieIndex])
            );
          });
        });

        let currentDate = new Date(data.decisions[0].date);
        while (currentDate <= new Date().addDay()) {
          vm.decisionsPerDay.xAxis.data.push(currentDate.toShortISOString());
          [false, true].forEach((applied, serieIndex) => {
            vm.decisionsPerDay.series[serieIndex].data.push(
              data.decisions
                .filter(
                  (value) =>
                    value.date === currentDate.toShortISOString() &&
                    value.applied === applied
                )
                .map((value) => value.count)[0] || 0
            );
          });
          currentDate = currentDate.addDay();
        }
      })
      .catch(() => {
        vm.error = "Something wrong occurred while fetching the statistics";
      });
  },
};
</script>
<style lang="scss">
.echarts {
  display: inline-block;
  width: 100% !important;

  > div,
  > canvas {
    max-width: 100% !important;
    width: initial !important;
  }
}

#counters {
  background-color: #f5f5f5;
  .counter {
    display: inline-block;
    padding: 20px;
    border-radius: 5px;

    .count-title {
      font-size: 40px;
      font-weight: normal;
      margin-top: 10px;
      margin-bottom: 0;
      text-align: center;
    }
  }
}

#top-refused-categories {
  err {
    text-decoration: underline;
  }
}
</style>
