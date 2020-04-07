import Vue from "vue";
import Echarts from "vue-echarts";

import "echarts/lib/chart/line";
import "echarts/lib/component/axisPointer";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/tooltip";

Vue.component("chart", Echarts);
