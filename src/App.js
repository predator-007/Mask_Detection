import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import * as tfjs from "@tensorflow/tfjs";
import Webcam from 'react-webcam';
import { Button } from '@material-ui/core';
function App() {
  
  const videoConstraints = {
    width: 260,
    height: 200,
    facingMode: "user"
  };
  const [prediction,setprediction]=useState("");
  const webcamRef=useRef(null);
  const [loading,setloading]=useState(false);
  const clas=['with mask','without mask']
        
  const [image,setimage]=useState(null);
  var Model;
  var imgtensor;
  const loadmodel=async()=>{
  Model=await tfjs.loadLayersModel("/mymodeljs/model.json");
  console.log("model loaded");
  }
  const captureimg = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setimage(imageSrc);
      console.log(image);

    },

    [webcamRef]
  );
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const stoi=(a)=>{
    var index=parseInt(a[0]);
      setprediction(clas[index]);
      setloading(false);
      return clas[index];   
  }
  const pred=async()=>{
    if(image==null)
    {
      setprediction("capture the image");
      return;
    }
    setloading(true);
    Model=await tfjs.loadLayersModel("/mymodeljs/model.json");
    var img=new Image();
    img.crossOrigin='anonymous';
    img.src=image;
    img.width=150; 
    img.height=150;
    imgtensor=tfjs.browser.fromPixels(img).expandDims(0);
    console.log("predict"+imgtensor);
    //await sleep(7000);
    try{

    const res= await Model.predict(imgtensor);
    const s=res.toString().substring(14,res.toString().length-3).split(", ");
    console.log(s);
    console.log(stoi(s));
    }
    catch(err){
      console.log(imgtensor);
      console.log(err);
    }
  }
  return (
    <div className="App" >
     <h1
            style={
                {
                    display:"block",
                    textAlign:"center",
                    color:"darkred",
                    textShadow:"5px 5px 10px #00FF00",
                    
                }
            }>
      mask detection</h1>
    <div className="cam" 
    >
    <Webcam
        audio={false}
        height={400}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={460}
        videoConstraints={videoConstraints}
        style={{marginRight:"10px"}}
      />
    <img className="capturedimg" src={image} width="260" height="200"
    style={{
      marginBottom:"8%"
    }}
    ></img>
    </div>
    <Button
    variant="contained"
    color="primary"
    onClick={(e)=>{e.preventDefault();captureimg();}}
    >capture</Button>
    <Button
    variant="contained"
    color="secondary"
    style={{marginLeft:"10%"}} 
    onClick={()=>pred()}
    >predict</Button>
    {
      loading?
      <div>
      <img src={"https://wpamelia.com/wp-content/uploads/2018/11/ezgif-2-6d0b072c3d3f.gif"}
      style={
        {
          width:"15%",
          height:"10%",
          display:"inline-block",
          marginLeft:"auto",
          marginRight:"auto",
        }
      }
      ></img>
      </div>
      :(prediction=="with mask" )?
      <h2 style={{color:"green",boxShadow:"rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}>{prediction}</h2>
      :
      <h2 style={{color:"red",boxShadow:"rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}>{prediction}</h2>
    }
    
    
    </div>
        
  );
}


export default App;
