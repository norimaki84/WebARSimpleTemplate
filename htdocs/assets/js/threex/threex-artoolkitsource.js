var ARjs=ARjs||{},THREEx=THREEx||{};ARjs.Source=THREEx.ArToolkitSource=function(e){function t(e){if(void 0!==e)for(var t in e){var r=e[t];if(void 0!==r){var o=i.parameters[t];void 0!==o&&(i.parameters[t]=r)}}}var i=this;this.ready=!1,this.domElement=null,this.parameters={sourceType:"webcam",sourceUrl:null,sourceWidth:640,sourceHeight:480,displayWidth:640,displayHeight:480},t(e)},ARjs.Source.prototype.init=function(e,t){function i(){document.body.appendChild(r.domElement),r.ready=!0,e&&e()}var r=this;if("image"===this.parameters.sourceType)var o=this._initSourceImage(i,t);else if("video"===this.parameters.sourceType)var o=this._initSourceVideo(i,t);else if("webcam"===this.parameters.sourceType)var o=this._initSourceWebcam(i,t);return this.domElement=o,this.domElement.style.position="absolute",this.domElement.style.top="0px",this.domElement.style.left="0px",this.domElement.style.zIndex="-2",this},ARjs.Source.prototype._initSourceImage=function(e){var t=document.createElement("img");t.src=this.parameters.sourceUrl,t.width=this.parameters.sourceWidth,t.height=this.parameters.sourceHeight,t.style.width=this.parameters.displayWidth+"px",t.style.height=this.parameters.displayHeight+"px";var i=setInterval(function(){t.naturalWidth&&(e(),clearInterval(i))},20);return t},ARjs.Source.prototype._initSourceVideo=function(e){var t=document.createElement("video");t.src=this.parameters.sourceUrl,t.style.objectFit="initial",t.autoplay=!0,t.webkitPlaysinline=!0,t.controls=!1,t.loop=!0,t.muted=!0,document.body.addEventListener("click",function r(){document.body.removeEventListener("click",r),t.play()}),t.width=this.parameters.sourceWidth,t.height=this.parameters.sourceHeight,t.style.width=this.parameters.displayWidth+"px",t.style.height=this.parameters.displayHeight+"px";var i=setInterval(function(){t.videoWidth&&(e(),clearInterval(i))},20);return t},ARjs.Source.prototype._initSourceWebcam=function(e,t){var i=this;t=t||function(e){};var r=document.createElement("video");if(r.setAttribute("autoplay",""),r.setAttribute("muted",""),r.setAttribute("playsinline",""),r.style.width=this.parameters.displayWidth+"px",r.style.height=this.parameters.displayHeight+"px",void 0===navigator.mediaDevices||void 0===navigator.mediaDevices.enumerateDevices||void 0===navigator.mediaDevices.getUserMedia){if(void 0===navigator.mediaDevices)var o="navigator.mediaDevices";else if(void 0===navigator.mediaDevices.enumerateDevices)var o="navigator.mediaDevices.enumerateDevices";else if(void 0===navigator.mediaDevices.getUserMedia)var o="navigator.mediaDevices.getUserMedia";return t({name:"",message:"WebRTC issue-! "+o+" not present in your browser"}),null}return navigator.mediaDevices.enumerateDevices().then(function(o){var a={audio:!1,video:{facingMode:"environment",width:{ideal:i.parameters.sourceWidth},height:{ideal:i.parameters.sourceHeight}}};navigator.mediaDevices.getUserMedia(a).then(function(t){r.srcObject=t,document.body.addEventListener("click",function(){r.play()});var i=setInterval(function(){r.videoWidth&&(e(),clearInterval(i))},20)})["catch"](function(e){t({name:e.name,message:e.message})})})["catch"](function(e){t({message:e.message})}),r},ARjs.Source.prototype.hasMobileTorch=function(){var e=arToolkitSource.domElement.srcObject;if(e instanceof MediaStream==!1)return!1;void 0===this._currentTorchStatus&&(this._currentTorchStatus=!1);var t=e.getVideoTracks()[0];if(void 0===t.getCapabilities)return!1;var i=t.getCapabilities();return!!i.torch},ARjs.Source.prototype.toggleMobileTorch=function(){var e=arToolkitSource.domElement.srcObject;if(e instanceof MediaStream!=!1){void 0===this._currentTorchStatus&&(this._currentTorchStatus=!1);var t=e.getVideoTracks()[0],i=t.getCapabilities();i.torch&&(this._currentTorchStatus=this._currentTorchStatus===!1,t.applyConstraints({advanced:[{torch:this._currentTorchStatus}]})["catch"](function(e){}))}},ARjs.Source.prototype.domElementWidth=function(){return parseInt(this.domElement.style.width)},ARjs.Source.prototype.domElementHeight=function(){return parseInt(this.domElement.style.height)},ARjs.Source.prototype.onResizeElement=function(){var e=window.innerWidth,t=window.innerHeight;if("IMG"===this.domElement.nodeName)var i=this.domElement.naturalWidth,r=this.domElement.naturalHeight;else if("VIDEO"===this.domElement.nodeName)var i=this.domElement.videoWidth,r=this.domElement.videoHeight;var o=i/r,a=e/t;if(a<o){var s=o*t;this.domElement.style.width=s+"px",this.domElement.style.marginLeft=-(s-e)/2+"px",this.domElement.style.height=t+"px",this.domElement.style.marginTop="0px"}else{var n=1/(o/e);this.domElement.style.height=n+"px",this.domElement.style.marginTop=-(n-t)/2+"px",this.domElement.style.width=e+"px",this.domElement.style.marginLeft="0px"}},ARjs.Source.prototype.copyElementSizeTo=function(e){window.innerWidth>window.innerHeight?(e.style.width=this.domElement.style.width,e.style.height=this.domElement.style.height,e.style.marginLeft=this.domElement.style.marginLeft,e.style.marginTop=this.domElement.style.marginTop):(e.style.height=this.domElement.style.height,e.style.width=4*parseInt(e.style.height)/3+"px",e.style.marginLeft=(window.innerWidth-parseInt(e.style.width))/2+"px",e.style.marginTop=0)},ARjs.Source.prototype.copySizeTo=function(){this.copyElementSizeTo.apply(this,arguments)},ARjs.Source.prototype.onResize=function(e,t,i){if(3!==arguments.length)return this.onResizeElement.apply(this,arguments);var r=e.parameters.trackingBackend;if("artoolkit"===r){this.onResizeElement();var o=!!t.domElement.dataset.aframeCanvas;o===!1&&this.copyElementSizeTo(t.domElement),null!==e.arController&&this.copyElementSizeTo(e.arController.canvas)}else"aruco"===r?(this.onResizeElement(),this.copyElementSizeTo(t.domElement),this.copyElementSizeTo(e.arucoContext.canvas)):"tango"===r&&t.setSize(window.innerWidth,window.innerHeight);if("artoolkit"===r)null!==e.arController&&i.projectionMatrix.copy(e.getProjectionMatrix());else if("aruco"===r)i.aspect=t.domElement.width/t.domElement.height,i.updateProjectionMatrix();else if("tango"===r){var a=e._tangoContext.vrDisplay;a&&"Tango VR Device"===a.displayName&&THREE.WebAR.resizeVRSeeThroughCamera(a,i)}};