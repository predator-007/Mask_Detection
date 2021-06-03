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
  const [cmode,setcmode]=useState(true);
  var Model;
  var imgtensor;
  const captureimg = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setimage(imageSrc);
      setcmode(false);
    },

    [webcamRef]
  );

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
      <pre className="titleborder">
     <h1 className="title">
      Mask Detection</h1></pre>
    {
      cmode?
    
    <div className="cam" 
    style={{
      display:"block"
    }}
    >
    
    <Webcam
        audio={false}
        height={400}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={460}
        videoConstraints={videoConstraints}
        style={{display:"block",
              marginLeft:"auto",
              marginRight:"auto",
      }}
        
    />
    
    <Button
    variant="contained"
    color="primary"
    style={{
      display:"block",
      marginLeft:"auto",
      marginRight:"auto",
      fontFamily:"sans-serif"
    }}
    onClick={(e)=>{e.preventDefault();captureimg();}}
    > <i class="fas fa-camera"></i> capture</Button>
    
    </div>
    :
    <div className="capturedmode">
    <img className="capturedimg" src={image} width="260" height="280"
    style={{
      display:"block",
      marginLeft:"auto",
      marginRight:"auto"
    }}
    ></img>
    <div className="buttons"
    style={
      {
        marginTop:"2%",
        display:"flex",
        justifyContent:"center",
      }
    }
    >
    <Button
    variant="contained"
    color="primary"
    style={{
        marginRight:"6%",
    }} 
    onClick={()=>setcmode(true)}
    ><i class="fas fa-redo"> Retake</i></Button>
    
    <Button
    variant="contained"
    color="secondary"
    style={{
    
    }} 
    onClick={()=>pred()}
    >Predict</Button>
    </div>
    {
      loading?
      <div>
      <img src={"https://acegif.com/wp-content/uploads/loading-42.gif"}
      style={
        {
          width:"15%",
          height:"10%",
          display:"block",
          marginLeft:"auto",
          marginRight:"auto"
        }
      }
      ></img>
      </div>
      :(prediction=="with mask" )?
      <h2 style={{
        marginTop:"2%",
        color:"darkblue",
        textAlign:"center",
        animation:"shrink 5s linear infinite"
        }}>{prediction}</h2>
      :
      <h2 style={{
        marginTop:"2%",
        color:"darkblue",
        textAlign:"center",
        animation:"shrink 5s linear infinite"
      }}>{prediction}</h2>
    }
    </div>

    }    
    </div>
        
  );
}


export default App;
