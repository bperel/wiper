<template>
  <div class="about">
    <p>
      WiPeR (stands for WikiPedia Remote editor) allows you to contribute to
      Wikipedia by simply accepting or refusing suggestions.
      <br />
      Each decision counts for one contribution on Wikipedia.
    </p>
    <b-card-group deck>
      <b-card title="Decision breakdown">
        <chart :options="areaChart"></chart>
      </b-card>
      <b-card title="Top contributors">
        <b-table striped hover :items="contributors"></b-table>
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
        const minDate = data.decisions[0].date;
        const maxDate = data.decisions[data.decisions.length - 1].date;
        let currentDate = new Date(minDate);
        while (currentDate <= new Date(maxDate)) {
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

        vm.contributors = data.contributors;
      })
      .catch(() => {
        vm.error = "Something wrong occurred while fetching the statistics";
      });
  },
};
</script>
<style scoped>
.echarts {
  display: inline-block;
}
</style>
