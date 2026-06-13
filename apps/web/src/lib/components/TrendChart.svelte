<script lang="ts">
  import { onMount } from "svelte";
  import type { EChartsType } from "echarts/core";
  import type { CompletionLogEntry } from "@ophan/core";
  import {
    aggregateCompletionTrend,
    type TrendPoint,
  } from "../charts/completion-trend";
  import { t } from "../state/i18n.svelte";
  import { ui } from "../state/ui.svelte";

  let { entries }: { entries: CompletionLogEntry[] } = $props();

  let container: HTMLDivElement | undefined = $state();
  let ready = $state(false);
  let chart: EChartsType | null = null;

  const cssVar = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const buildOption = (data: TrendPoint[]) => {
    const accent = cssVar("--accent");
    const muted = cssVar("--muted");
    const border = cssVar("--border");
    return {
      animationDuration: 300,
      grid: { left: 4, right: 8, top: 10, bottom: 2, containLabel: true },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((point) => point.label),
        axisLine: { lineStyle: { color: border } },
        axisTick: { show: false },
        axisLabel: {
          color: muted,
          fontSize: 9,
          fontFamily: "Chiron GoRound TC",
        },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        splitLine: { lineStyle: { color: border } },
        axisLabel: {
          color: muted,
          fontSize: 9,
          fontFamily: "Chiron GoRound TC",
        },
      },
      series: [
        {
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 4,
          data: data.map((point) => point.count),
          lineStyle: { width: 2, color: accent },
          itemStyle: { color: accent },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${accent}55` },
                { offset: 1, color: `${accent}00` },
              ],
            },
          },
        },
      ],
    };
  };

  onMount(() => {
    let observer: ResizeObserver | undefined;
    let disposed = false;
    (async () => {
      const { echarts } = await import("../charts/echarts-lite");
      if (disposed || !container) return;
      chart = echarts.init(container);
      observer = new ResizeObserver(() => chart?.resize());
      observer.observe(container);
      ready = true;
    })();
    return () => {
      disposed = true;
      observer?.disconnect();
      chart?.dispose();
      chart = null;
    };
  });

  $effect(() => {
    ui.theme;
    const data = aggregateCompletionTrend(entries, 14);
    if (!ready || !chart) return;
    chart.setOption(buildOption(data));
  });
</script>

<div class="trend-card">
  <span class="trend-label">{t("chart.last14Days")}</span>
  {#if !ready}
    <div class="skeleton trend-skeleton" aria-hidden="true"></div>
  {/if}
  <div class="trend-chart" class:pending={!ready} bind:this={container}></div>
</div>
