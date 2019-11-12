var ARjs=ARjs||{},THREEx=THREEx||{};ARjs.Context=THREEx.ArToolkitContext=function(t){function e(t){if(void 0!==t)for(var e in t){var r=t[e];if(void 0!==r){var o=a.parameters[e];void 0!==o&&(a.parameters[e]=r)}}}var a=this;a._updatedAt=null,this.parameters={trackingBackend:"artoolkit",debug:!1,detectionMode:"mono",matrixCodeType:"3x3",cameraParametersUrl:ARjs.Context.baseURL+"parameters/camera_para.dat",maxDetectionRate:60,canvasWidth:640,canvasHeight:480,patternRatio:.5,imageSmoothingEnabled:!1},this.arController=null,this.arucoContext=null,a.initialized=!1,this._arMarkersControls=[],e(t)},Object.assign(ARjs.Context.prototype,THREE.EventDispatcher.prototype),ARjs.Context.baseURL="https://jeromeetienne.github.io/AR.js/three.js/",ARjs.Context.REVISION="1.6.0",ARjs.Context.createDefaultCamera=function(t){if("artoolkit"===t)var e=new THREE.Camera;else if("aruco"===t)var e=new THREE.PerspectiveCamera(42,renderer.domElement.width/renderer.domElement.height,.01,100);else if("tango"===t)var e=new THREE.PerspectiveCamera(42,renderer.domElement.width/renderer.domElement.height,.01,100);return e},ARjs.Context.prototype.init=function(t){function e(){a.dispatchEvent({type:"initialized"}),a.initialized=!0,t&&t()}var a=this;"artoolkit"===this.parameters.trackingBackend?this._initArtoolkit(e):"aruco"===this.parameters.trackingBackend?this._initAruco(e):"tango"===this.parameters.trackingBackend&&this._initTango(e)},ARjs.Context.prototype.update=function(t){if("artoolkit"===this.parameters.trackingBackend&&null===this.arController)return!1;var e=performance.now();return!(null!==this._updatedAt&&e-this._updatedAt<1e3/this.parameters.maxDetectionRate)&&(this._updatedAt=e,this._arMarkersControls.forEach(function(t){t.object3d.visible=!1}),"artoolkit"===this.parameters.trackingBackend?this._updateArtoolkit(t):"aruco"===this.parameters.trackingBackend?this._updateAruco(t):"tango"===this.parameters.trackingBackend&&this._updateTango(t),this.dispatchEvent({type:"sourceProcessed"}),!0)},ARjs.Context.prototype.addMarker=function(t){this._arMarkersControls.push(t)},ARjs.Context.prototype.removeMarker=function(t){var e=this.arMarkerControlss.indexOf(artoolkitMarker);this._arMarkersControls.splice(e,1)},ARjs.Context.prototype._initArtoolkit=function(t){var e=this;this._artoolkitProjectionAxisTransformMatrix=new THREE.Matrix4,this._artoolkitProjectionAxisTransformMatrix.multiply((new THREE.Matrix4).makeRotationY(Math.PI)),this._artoolkitProjectionAxisTransformMatrix.multiply((new THREE.Matrix4).makeRotationZ(Math.PI));var a=new ARCameraParam(e.parameters.cameraParametersUrl,function(){var r=new ARController(e.parameters.canvasWidth,e.parameters.canvasHeight,a);e.arController=r,r.ctx.mozImageSmoothingEnabled=e.parameters.imageSmoothingEnabled,r.ctx.webkitImageSmoothingEnabled=e.parameters.imageSmoothingEnabled,r.ctx.msImageSmoothingEnabled=e.parameters.imageSmoothingEnabled,r.ctx.imageSmoothingEnabled=e.parameters.imageSmoothingEnabled,e.parameters.debug===!0&&(r.debugSetup(),r.canvas.style.position="absolute",r.canvas.style.top="0px",r.canvas.style.opacity="0.6",r.canvas.style.pointerEvents="none",r.canvas.style.zIndex="-1");var o={color:artoolkit.AR_TEMPLATE_MATCHING_COLOR,color_and_matrix:artoolkit.AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX,mono:artoolkit.AR_TEMPLATE_MATCHING_MONO,mono_and_matrix:artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX},i=o[e.parameters.detectionMode];r.setPatternDetectionMode(i);var n={"3x3":artoolkit.AR_MATRIX_CODE_3x3,"3x3_HAMMING63":artoolkit.AR_MATRIX_CODE_3x3_HAMMING63,"3x3_PARITY65":artoolkit.AR_MATRIX_CODE_3x3_PARITY65,"4x4":artoolkit.AR_MATRIX_CODE_4x4,"4x4_BCH_13_9_3":artoolkit.AR_MATRIX_CODE_4x4_BCH_13_9_3,"4x4_BCH_13_5_5":artoolkit.AR_MATRIX_CODE_4x4_BCH_13_5_5},s=n[e.parameters.matrixCodeType];r.setMatrixCodeType(s),r.setPattRatio(e.parameters.patternRatio),t()});return this},ARjs.Context.prototype.getProjectionMatrix=function(t){var e=this.arController.getCameraMatrix(),a=(new THREE.Matrix4).fromArray(e);return a.multiply(this._artoolkitProjectionAxisTransformMatrix),a},ARjs.Context.prototype._updateArtoolkit=function(t){this.arController.process(t)},ARjs.Context.prototype._initAruco=function(t){this.arucoContext=new THREEx.ArucoContext,this.arucoContext.canvas.width=this.parameters.canvasWidth,this.arucoContext.canvas.height=this.parameters.canvasHeight;var e=this.arucoContext.canvas.getContext("2d");e.webkitImageSmoothingEnabled=this.parameters.imageSmoothingEnabled,e.msImageSmoothingEnabled=this.parameters.imageSmoothingEnabled,e.imageSmoothingEnabled=this.parameters.imageSmoothingEnabled,setTimeout(function(){t()},0)},ARjs.Context.prototype._updateAruco=function(t){var e=this,a=this._arMarkersControls,r=this.arucoContext.detect(t);r.forEach(function(t){for(var r=null,o=0;o<a.length;o++)if(a[o].parameters.barcodeValue===t.id){r=a[o];break}if(null!==r){var i=new THREE.Object3D;e.arucoContext.updateObject3D(i,r._arucoPosit,r.parameters.size,t),i.updateMatrix(),r.updateWithModelViewMatrix(i.matrix)}})},ARjs.Context.prototype._initTango=function(t){var e=this;navigator.getVRDisplays||navigator.getVRDevices,this._tangoContext={vrDisplay:null,vrPointCloud:null,frameData:new VRFrameData},navigator.getVRDisplays().then(function(a){0===a.length;var r=e._tangoContext.vrDisplay=a[0];"Tango VR Device"===r.displayName&&(e._tangoContext.vrPointCloud=new THREE.WebAR.VRPointCloud(r,(!0))),t()})},ARjs.Context.prototype._updateTango=function(t){var e=this,a=(this._arMarkersControls,this._tangoContext,this._tangoContext.vrDisplay);if(null!==a){if("Tango VR Device"===a.displayName){var r=!0,o=0;e._tangoContext.vrPointCloud.update(r,o,!0)}if(0!==this._arMarkersControls.length){var i=this._arMarkersControls[0],n=this._tangoContext.frameData;if(a.getFrameData(n),null!==n.pose.position&&null!==n.pose.orientation){var s=(new THREE.Vector3).fromArray(n.pose.position),l=(new THREE.Quaternion).fromArray(n.pose.orientation),m=new THREE.Vector3(1,1,1),p=(new THREE.Matrix4).compose(s,l,m),c=new THREE.Matrix4;c.getInverse(p),i.updateWithModelViewMatrix(c)}}}};