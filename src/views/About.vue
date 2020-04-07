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
        const stats = data.decisions.filter((value) => !!value.date);
        vm.areaChart.xAxis.data = stats
          .map((value) => value.date)
          .filter((value, index, self) => self.indexOf(value) === index);
        vm.areaChart.series[1].data = stats
          .filter((value) => value.applied === true)
          .map((value) => value.count);
        vm.areaChart.series[0].data = stats
          .filter((value) => value.applied === false)
          .map((value) => value.count);

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
