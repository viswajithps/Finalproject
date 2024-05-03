import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { Sales } from '@/components/dashboard/overview/sales';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

type DataProps = {
  PredictedPrice: number;
  prediction: number[];
  original: number[];
  accuracy: number;
} | undefined;

export default async function Page(): Promise<React.JSX.Element>{
  let data;

  try{
    data = await fetch('http://127.0.0.1:8000', {method: 'GET', cache: 'no-store',  headers: {'Content-Type': 'application/json'}}).then(res => res.json()) as DataProps
  
  }
  catch(e){
    console.log('api not working')
    console.log(e)
    
  }
  const formattedValue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data?.PredictedPrice || 0);
  const model_accuracy = data?.accuracy || 0; 
  let CurrExRate;
  try{
    CurrExRate = await fetch('https://api.twelvedata.com/exchange_rate?symbol=BTC/INR&timezone=Asia/Kolkata&apikey=e76157c75c3a42649e168c5c206e88ca', {method: 'GET', cache: 'no-store',  headers: {'Content-Type': 'application/json'}}).then(res => res.json())
    CurrExRate = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(CurrExRate?.rate|| 0);
  }
  catch(e){
    console.log('couldnt get current exchange rate')
    console.log(e)
    
  }
  return (
    <Grid container spacing={3}>
      <Grid lg={4} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value={formattedValue} />
      </Grid>
      <Grid lg={4} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={CurrExRate} />
      </Grid>
      
      <Grid lg={4} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value={model_accuracy} />
      </Grid>
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'Actual Price', data: data?.prediction || [] },
            { name: 'Predicted Price', data: data?.original || [] }
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}> 
        <Traffic chartSeries={[259, 910, 428, 136, 784]} labels={['very bullish',"bullish","neutral","bearish","very bearish"]} sx={{ height: '100%' }} />
      </Grid>
    </Grid>
  );
}
