from fastapi import FastAPI
import uvicorn
import pickle
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
import requests
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from keras.metrics import mean_absolute_percentage_error
from sklearn.metrics import mean_absolute_error,mean_squared_error

import asyncio
import nest_asyncio
from pyngrok import ngrok
import uvicorn

# Declaring our FastAPI instance
app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clf = pickle.load(open('new_model.pkl', 'rb'))

# Defining path operation for root endpoint
@app.get('/')

async def main():

    scaler=MinMaxScaler(feature_range=(0,1))
    timeinterval=24
    prediction=1

    i=0
    testapi='https://api.twelvedata.com/time_series?symbol=BTC/INR&interval=5min&outputsize=576&timezone=Asia/Kolkata&order=ASC&apikey=e76157c75c3a42649e168c5c206e88ca'
    testdata=requests.get(testapi).json()
    testdatafinal=pd.DataFrame(testdata['values'])

    bitcoinprice=pd.to_numeric(testdatafinal['close'],errors='coerce').values
    testinputs=testdatafinal['close'].values
    testinputs=testinputs.reshape(-1,1)
    modelinputs=scaler.fit_transform(testinputs)

    x_test=[]
    for x in range(timeinterval,len(modelinputs)):
        x_test.append(modelinputs[x-timeinterval:x,0])

    x_test=np.array(x_test)
    x_test=np.reshape(x_test,(x_test.shape[0],x_test.shape[1],1))
    prediction_price=clf.predict(x_test)
    prediction_price=scaler.inverse_transform(prediction_price)

    mape=mean_absolute_percentage_error(bitcoinprice[24:],prediction_price)
    avg_mape = tf.reduce_mean(mape)
    print("MEAN ABSOULTE ERROR :",mean_absolute_error(bitcoinprice[24:],prediction_price))
    print("AVERAGE MAE PERCENTAGE :",avg_mape.numpy(),"%")
    model_accuracy=100.0-float(avg_mape.numpy())

    lastdata=modelinputs[len(modelinputs)+1-timeinterval:len(modelinputs)+1,0]
    lastdata=np.array(lastdata)
    lastdata=np.reshape(lastdata,(1,lastdata.shape[0],1))
    prediction=clf.predict(lastdata)
    prediction=scaler.inverse_transform(prediction)
    pre=prediction[0][0]
    print("PREDICTION FOR NEXT HOUR",pre)
    prediction_price=prediction_price.reshape(-1)

    return {'PredictedPrice': np.float64(pre), 'prediction': prediction_price.tolist(), 'original': bitcoinprice[24:].tolist(),'accuracy': np.float64(model_accuracy)}


if __name__ == '__main__':
    nest_asyncio.apply()
    uvicorn.run(app,port=8000)




