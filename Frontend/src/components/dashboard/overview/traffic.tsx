'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Desktop as DesktopIcon } from '@phosphor-icons/react/dist/ssr/Desktop';
import { DeviceTablet as DeviceTabletIcon } from '@phosphor-icons/react/dist/ssr/DeviceTablet';
import { Phone as PhoneIcon } from '@phosphor-icons/react/dist/ssr/Phone';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@/components/core/chart';
import { Circle } from '@phosphor-icons/react';

const iconMapping = { Desktop: DesktopIcon, Tablet: DeviceTabletIcon, Phone: PhoneIcon } as Record<string, Icon>;

export interface TrafficProps {
  chartSeries: number[];
  labels: string[];
  sx?: SxProps;
}

export function Traffic({ chartSeries, labels, sx }: TrafficProps): React.JSX.Element {
  const chartOptions = useChartOptions(labels);

  return (
    <Card sx={sx}>
      <CardHeader title="What is your current BTC/INR sentiment?" />
      <CardContent>
        <Stack spacing={2}>
          <Chart height={300} options={chartOptions} series={chartSeries} type="donut" width="100%" />
          <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            {chartSeries.map((item, index) => {
              const label = labels[index]
              const color = chartOptions.colors ? chartOptions.colors[index % chartOptions.colors.length] : '#000';
              return (
                <Stack key={label} spacing={1}>
                  <Button variant='outlined'
                  startIcon={<Circle style={{ width: 16, height: 16, backgroundColor:color, borderRadius: '50%', marginRight: 1 }} />}
                  sx={{ width:250, color: color , borderColor: "#313746",justifyContent:"left"}}>
                  <Typography variant="h6">{label}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    &#160;&#160;{item}
                  </Typography>
                  </Button>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent' },
    colors: ["#0ECB81", "#32D993","#F0B90B","#FF707E","#F6465D"],
    dataLabels: { enabled: false },
    labels,
    legend: { show: true },
    plotOptions: { pie: { expandOnClick: true } },
    states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
    stroke: { width: 2 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: true },
  };
}
