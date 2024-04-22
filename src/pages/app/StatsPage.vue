<script setup>

  import {useQuery} from "@vue/apollo-composable";
  import {gql} from "@apollo/client/core";
  import {onMounted, ref} from "vue";
  import {date} from "quasar";
  import {deserializeTravelMethod} from "src/js/typesFormatter";
  import {safeRefetch, safeUseQuery} from "src/js/GQL";

  const GET_STATS_GQL = gql(`
    query getStats ($unit: TimeUnit, $delta: Int!, $separateMethods: Boolean!) {
      stats(unit: $unit, delta: $delta) {
        labels
        emissions(separateMethods: $separateMethods) {
          name
          data
        }
        distances(separateMethods: false) {
          name
          data
        }
      }
    }
  `)
  const OVERALL_STATS_GQL = gql(`
    query overallStats {
      overallStats {
        totalEmission
        totalDistance
        totalTravels

        methodsUsed
        methodDistribution
        emissionDistribution
      }
    }`)

  const { refetch } = safeUseQuery(GET_STATS_GQL, {
    unit: "WEEK",
    delta: 0,
    separateMethods: true
  })

  const {loading, error, result: overallResult, onResult: onOverallResult} = safeUseQuery(OVERALL_STATS_GQL)

  const chartOptions1 = ref({})
  const series1 = ref([])

  const chartOptions2 = ref({})
  const series2 = ref([])

  const overallChartOptionsMethod = ref({})
  const overallChartOptionsEmission = ref({})
  const overallSeriesMethod = ref([])
  const overallSeriesEmission = ref([])

  const delta = ref(0)
  const unit = ref("WEEK")
  const separateMethods = ref(true)

  onOverallResult((result) => {
    if (result.loading) return;

    const piePlotOptionsFormatter = (f) => { return {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: "15px",
              label: 'Total',
              formatter: function (w) {
                return f(w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0))
              }
            },
            value: {
              show: true,
              fontSize: '25px',
              fontFamily: 'Anton, Arial, sans-serif',
              offsetY: 0,
            },
          }
        }
      }
    } }

    overallChartOptionsEmission.value = {
      labels: result.data["overallStats"]["methodsUsed"].map(deserializeTravelMethod),
      title: {
        text: 'Overall Emission Distribution (kg)',
        align: 'left',
        style: { fontSize: '18px' }
      },
      plotOptions: piePlotOptionsFormatter(f => f.toFixed(2)),

    }
    overallChartOptionsMethod.value = {
      labels: result.data["overallStats"]["methodsUsed"].map(deserializeTravelMethod),
      title: {
        text: 'Overall Method Distribution (km)',
        align: 'left',
        style: { fontSize: '18px' }
      },
      plotOptions: piePlotOptionsFormatter(f => Math.floor(f))
    }

    overallSeriesEmission.value = result.data["overallStats"]["emissionDistribution"]
    overallSeriesMethod.value = result.data["overallStats"]["methodDistribution"]
  })

  function onRequest() {
    safeRefetch(refetch, {
      unit: unit.value,
      delta: delta.value,
      separateMethods: separateMethods.value
    }).then((result) => {
      let totalEmissions = [100]
      if (result.data["stats"]["emissions"].length !== 0) {
        totalEmissions = result.data["stats"]["emissions"][0]["data"].map((e, i) =>
          result.data["stats"]["emissions"].reduce((acc, v) => acc + v["data"][i], 0)
        )
      }

      const subtitle = formatSubtitle(result.data["stats"]["labels"][0], unit.value);
      const y_min = 0;
      const y_max = Math.max(...totalEmissions);

      chartOptions1.value = {
        chart: {
          id: "stats",
          stacked: true,
        },
        xaxis: {
          categories: result.data["stats"]["labels"].map(d => formatDate(d, unit.value))
        },
        yaxis: [
          {title: {text: 'Distance (km)'}, decimalsInFloat: 0,},
          {
            opposite: true,
            min: y_min,
            max: y_max,
            decimalsInFloat: 2,
            title: {text: 'Emission (kg)'}
          },
          ...new Array(10).fill({
            show: false,
            min: y_min,
            max: y_max,
          })
        ],
        stroke: {
          curve: 'straight',
          width: [4, ...new Array(50).fill(0)]
        },
        dataLabels: {enabled: false},
        title: {
          text: 'CO2 Emission and Distance Travelled (' + subtitle + ")",
          align: 'left',
          style: {fontSize: '18px'}
        }
      }
      chartOptions2.value = {
        chart: {
          id: "stats_ratio",
        },
        xaxis: {
          categories: result.data["stats"]["labels"].map(d => formatDate(d, unit.value))
        },
        yaxis: [
          {title: {text: 'Ratio (g/km)'}, decimalsInFloat: 2},
        ],
        stroke: {
          curve: 'straight',
          width: 4
        },
        dataLabels: {enabled: false},
        title: {
          text: 'CO2 Emission per km (' + subtitle + ')',
          align: 'left',
          style: {fontSize: '18px'}
        }
      }

      series1.value = []

      if (result.data["stats"]["distances"].length !== 0)
        series1.value.push(...formatStat(result.data["stats"]["distances"], "line"))

      if (result.data["stats"]["emissions"].length !== 0) {
        series1.value.push(...formatStat(result.data["stats"]["emissions"], "column"))

        series2.value = [{
          name: "Ratio",
          data: totalEmissions.map((e, i) => {
            const d = result.data["stats"]["distances"][0]["data"][i]
            if (d === 0) return 0;
            else return e / d
          })
        }]
      }
    })
  }

  function formatDate(dateString, unit) {
    let format;
    switch (unit) {
      case "WEEK": format = "ddd DD/MM"; break;
      case "MONTH": format = "DD"; break;
      case "YEAR": format = "MMMM"; break;
    }

    return date.formatDate(dateString, format);
  }

  function formatSubtitle(dateString, unit) {
    switch (unit) {
      case "WEEK": return "Week " + date.formatDate(dateString, "ww");
      case "MONTH": return date.formatDate(dateString, "MMMM YYYY")
      case "YEAR": return date.formatDate(dateString, "YYYY")
    }
  }

  function formatStat(stat, type) {
    return stat.map(s => ({
      ...s,
      type: type}
    ));
  }

  onMounted(() => {
    onRequest({pagination :{page: 1, rowsPerPage:3, descending:true}})
  })

</script>

<template>
  <q-page class="q-pa-sm">
    <h2 class="text-center">My Dashboard</h2>
    <h5 class="subtitle text-center">All the stats you will ever need</h5>

    <br/>

    <div class ="page-container">
      <p>On this page, you will find every statistic relevant to your recorded travel emissions.
        Whether it's the <b>carbon footprint</b> of your <i>flights</i>, the impact of your <i>daily commute,</i>
        or the emissions generated by your <i>road trips</i>, this comprehensive collection of data
        aims to provide you with a detailed overview of your <b>environmental impact</b> from travel.
        By presenting these statistics in one centralized location, you can gain valuable insights
        into your carbon footprint, allowing you to make informed decisions and take steps towards
        reducing your environmental footprint.</p>

      <div class="highlight-box" :style="'width: ' + ($q.platform.is.mobile ? '100%' : '75%')">
        <q-expansion-item>
          <template v-slot:header>
            <q-item-section id="number" avatar>
              {{loading ? '0.00' : overallResult["overallStats"]["totalEmission"].toFixed(2) }}kg
            </q-item-section>
            <q-item-section>
              of CO2 have been emitted by your transports.
            </q-item-section>
          </template>
          <q-card class="bg-secondary row">
              <div style="width: 25%"></div>
              <div style="width:75%">
                This information is the total of CO2 emission that has been recorded over your total of
                <b>{{ loading || error ? '0' : overallResult["overallStats"]["totalTravels"] }} travels</b>; and
                over a distance of <b>{{ loading || error ? '0' : overallResult["overallStats"]["totalDistance"].toFixed(2) }}km.</b>
              </div>
          </q-card>
        </q-expansion-item>
      </div>

      <br/>

      <div class="row" style="width:100%">
        <q-select class="col"
          filled
          v-model="unit"
          :options='["WEEK", "MONTH", "YEAR"]'
          label="Time Unit"
          stack-label
          @update:model-value="onRequest()"
        />
        <q-btn icon="arrow_left" @click="delta++; onRequest()"/>
        <q-btn icon="arrow_right" @click="delta--; onRequest()"/>

        <q-toggle
          v-model="separateMethods"
          color="green"
          label="Travel Methods"
          @update:model-value="onRequest()"
        />
      </div>

      <apexchart
        type="bar"
        :options="chartOptions1"
        :series="series1"
      ></apexchart>

      <apexchart
        type="line"
        :options="chartOptions2"
        :series="series2"
      ></apexchart>

      <div :class="!$q.platform.is.mobile && 'row'">
        <apexchart class="col" v-if="!(loading || error || overallResult['overallStats']['totalEmission'] === 0)"
          type="donut"
          :options="overallChartOptionsEmission"
          :series="overallSeriesEmission"
        ></apexchart>
        <apexchart class="col" v-if="!(loading || error || overallResult['overallStats']['totalDistance'] === 0)"
          type="donut"
          :options="overallChartOptionsMethod"
          :series="overallSeriesMethod"
        ></apexchart>
      </div>

    </div>
  </q-page>
</template>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

  #number
  {
    font-size: 40px;
    font-family: "Anton", sans-serif;
  }
</style>
