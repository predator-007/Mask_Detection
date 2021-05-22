import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import * as tfjs from "@tensorflow/tfjs";
import Webcam from 'react-webcam';
function App() {
  
  const videoConstraints = {
    width: 260,
    height: 200,
    facingMode: "user"
  };
  const [prediction,setprediction]=useState("");
  const webcamRef=useRef(null);

  const clas=['with mask','without mask']
        
  const [image,setimage]=useState(null);
  var Model;
  var imgtensor;
  const loadmodel=async()=>{
  Model=await tfjs.loadLayersModel("/modeljs/model.json");
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
      return clas[index];   
  }
  const pred=async()=>{
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
    <div className="App">
    <h1>mask detection</h1>
    <Webcam
        audio={false}
        height={400}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={460}
        videoConstraints={videoConstraints}
        style={{marginRight:"10px"}}
      />
    <img src={image} width="260" height="200"></img>
    <button
    onClick={(e)=>{e.preventDefault();captureimg();}}
    >capture</button>
    <button onClick={()=>pred()}
    >predict</button>
    { prediction=="with mask"?
      <h2 style={{color:"green"}}>{prediction}</h2>
      :
      <h2 style={{color:"red"}}>{prediction}</h2>
    }
    
    </div>
        
  );
}


export default App;
