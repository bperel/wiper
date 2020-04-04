<template>
  <div class="about">
    <p>
      WiPeR (stands for WikiPedia Remote editor) allows you to contribute to
      Wikipedia by simply accepting or refusing suggestions.
      <br />
      Each decision counts for one contribution on Wikipedia.
    </p>
    <chart :options="areaChart"></chart>
  </div>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "HelloWorld",
  computed: {
    ...mapState(["LANGUAGETOOL_ENDPOINT_ROOT"]),
  },
  data: () => ({
    areaChart: {
      xAxis: {
        data: [],
      },
      yAxis: {
        type: "value",
      },
      legend: {
        data: ["Approved", "Denied"],
      },
      tooltip: {
        show: true,
        trigger: "axis",
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
          restore: { show: true },
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      series: [
        {
          name: "Approved",
          type: "line",
          stack: "Decisions",
          areaStyle: {
            color: "green",
          },
          data: [],
        },
        {
          name: "Denied",
          type: "line",
          stack: "Decisions",
          areaStyle: {
            color: "red",
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
        const stats = data.stats.filter((value) => !!value.date);
        vm.areaChart.xAxis.data = stats
          .map((value) => value.date)
          .filter((value, index, self) => self.indexOf(value) === index);
        vm.areaChart.series[0].data = stats
          .filter((value) => value.applied === true)
          .map((value) => value.count);
        vm.areaChart.series[1].data = stats
          .filter((value) => value.applied === false)
          .map((value) => value.count);
      })
      .catch(() => {
        vm.error = "Something wrong occurred while fetching the statistics";
      });
  },
};
</script>
