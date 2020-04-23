    const URL = "/*add you mode*/";
    let model, webcam, ctx, labelContainer, maxPredictions;
    document.getElementById('start').addEventListener('click', init);
    const wakif = document.getElementById("wa9if");
    const roko3e = document.getElementById("roko3");
    const sojod = document.getElementById("sojod");
    const iyem = document.getElementById("9iyem sojod");
    const takbie = document.getElementById("takbie");
      const textnum = document.getElementById("textnum");
    var wakifC;
    var roko3eC;
    var sojodC;
    var iyemC;
    var takbieC;
    var wakifS=false;
    var roko3eS=false;
    var sojodS=false;
    var iyemS=false;
    var takbieS=false;
var rakaa;
    async function init() {
       wakifC=0;
       roko3eC=0;
       sojodC=0;
       iyemC=0;
       takbieC=0;
       rakaa=0;

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const size = 600;
        const flip = true; // whether to flip the webcam
        webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);
        // append/get elements to the DOM
        const canvas = document.getElementById("canvas");
        canvas.width = size;
        canvas.height = size;
        ctx = canvas.getContext("2d");
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop(timestamp) {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    async function predict() {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        // Prediction 2: run input through teachable machine classification model
        const prediction = await model.predict(posenetOutput);
        var wakifV = await prediction[0].probability.toFixed(2)*100;
        var roko3eV =await prediction[1].probability.toFixed(2)*100;
        var sojodV =await prediction[2].probability.toFixed(2)*100;
        var iyemV = await prediction[3].probability.toFixed(2)*100;
        var takbieV =await prediction[4].probability.toFixed(2)*100;
        wakif.style.width =await (prediction[0].probability.toFixed(2)*100)+"%";
        roko3e.style.width =await (prediction[1].probability.toFixed(2)*100)+"%";
        sojod.style.width =await (prediction[2].probability.toFixed(2)*100)+"%";
        iyem.style.width =await (prediction[3].probability.toFixed(2)*100)+"%";
        takbie.style.width =await (prediction[4].probability.toFixed(2)*100)+"%";
        wakif.textContent =await (prediction[0].probability.toFixed(2)*100)+"%";
        roko3e.textContent =await (prediction[1].probability.toFixed(2)*100)+"%";
        sojod.textContent =await (prediction[2].probability.toFixed(2)*100)+"%";
        iyem.textContent =await (prediction[3].probability.toFixed(2)*100)+"%";
        takbie.textContent =await (prediction[4].probability.toFixed(2)*100)+"%";

        if(takbieV>70)
        {
          wakifC=0;
          sojodC=0;
          await takbieC++;
          if(takbieC>3)
          {
             takbieC=0;
             takbieS=true;
             rakaa=1;
             textnum.innerHTML = rakaa.toString() ;
          }
        }
        if((wakifV>70)&&takbieS)
        {
          sojodC=0;
          await wakifC++;
          if(wakifC>10)
          {
             wakifC=0;
             wakifS=true;
          if(sojodS)
          {
            await rakaa++;
            sojodS=false;
            textnum.innerHTML = await rakaa.toString() ;
          }
          }
        }
        if(sojodV>70)
        {
          wakifC=0;
          await sojodC++;
          if(sojodC>5)
          {
             sojodC=0;
             sojodS=true;}
        }

        // finally draw the poses
        drawPose(pose);
    }

    function drawPose(pose) {
        if (webcam.canvas) {
            ctx.drawImage(webcam.canvas, 0, 0);
            // draw the keypoints and skeleton
            if (pose) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
            }
        }
    }
