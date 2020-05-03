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
    <b-card-group deck>
      <b-card title="Decision breakdown">
        <chart :options="areaChart"></chart>
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
  </div>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";

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
  computed: {
    ...mapState(["LANGUAGETOOL_ENDPOINT_ROOT"]),
  },
  data: () => ({
    pendingSuggestions: [],
    contributors: [],
    areaChart: {
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
  }),

  mounted() {
    let vm = this;
    axios
      .get(`${this.LANGUAGETOOL_ENDPOINT_ROOT}/stats`)
      .then(({ data }) => {
        vm.contributors = data.contributors;
        vm.pendingSuggestions = data.pendingSuggestions;

        let currentDate = new Date(data.decisions[0].date);
        while (currentDate <= new Date().addDay()) {
          vm.areaChart.xAxis.data.push(currentDate.toShortISOString());
          [false, true].forEach((applied, serieIndex) => {
            vm.areaChart.series[serieIndex].data.push(
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
<style scoped lang="scss">
.echarts {
  display: inline-block;
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
</style>
