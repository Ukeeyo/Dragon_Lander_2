import React from 'react';
import * as THREE from 'three';
import $ from "jquery";
// One day I'll remove jquery from this codebase...
import EndScreen from "./EndScreen";
import Loader from "./Loader";
import Overlay from "./Overlay";

const initialState = {
  thrustToggle: 1,
  thrustMod: 0.08,
  start: false,
  hideLoader: false,
  loaded: false,
  gameState: 1,
  screenTooSmall: false,
  rendererHeight: window.innerHeight,
  rendererWidth: window.innerWidth,
  camera: {
    x:0,
    y:0,
    z:2000
  },
  ship: {
    x: Math.random()*(10000-200+1)+200,
    y: 25000,
    z: 0,
    xv: 0,
    yv: 0,
    zv: 0,
    xRotation: 0.2,
    zRotation: 0,
  },
};

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.setupWebGl();
    this.setupControls();
    window.addEventListener( 'resize', this.updateSize.bind(this), false );
  }

  setupControls() {
    var ship = this.state.ship;
    var keys = {};

    $(document).keydown((event) => {
      keys[event.which] = true;
    }).keyup((event) => {
      delete keys[event.which];
      this.setState({
        thrustToggle: 1,
      })
    });
    const gameLoop = () => {
      if (keys[65] || this.state.screenTooSmall) {
        ship.zRotation+=1;
        this.setState({
          ship: ship
        });
      }
      if (keys[68]) {
        ship.zRotation-=1;
        this.setState({
          ship: ship
        });
      }
      if (keys[87]) {
        this.setState({
          thrustToggle: 2,
        })
        var degrees = ship.zRotation*0.01*360;
        var rad = degrees*0.0174532925;
        ship.xv-=parseFloat((Math.sin(rad) * this.state.thrustMod).toFixed(4));
        ship.yv+=parseFloat((Math.cos(rad) * this.state.thrustMod).toFixed(4));
        ship.xRotation = ship.xRotation * -1;
        ship.zRotation -= ship.xRotation;
        this.setState({
          ship: ship,
        });
      }
      this.updateState();
      setTimeout(gameLoop, 5);
    }
    gameLoop();
  }

  thrustControl(modifier){
    this.setState({
      thrustMod: this.state.thrustMod + modifier
    });
  }

  updateState() {
    if (!this.state.start) {
      return;
    }
    if(this.state.ship.y < 0){
      this.setState({
        start: false,
        gameState: "Crashed",
      });
    }else if((this.state.ship.y-100)<2 && Math.abs(this.state.ship.x)<200 && this.state.ship.yv>-5){
      var ship = this.state.ship;
      ship.y = 55;
      this.setState({
        start: false,
        ship: ship,
        gameState: "Landed"
      });
    }else if((this.state.ship.y-100)<2 && Math.abs(this.state.ship.x)<200 && this.state.ship.yv<-5){
      this.setState({
        start: false,
        gameState: "CRASHED, YOUR APPROACH SPEED WAS TOO HIGH"
      });
    }else{
      const newVals = this.state;
      newVals.ship.y += newVals.ship.yv;
      newVals.ship.yv -= 0.01;
      newVals.ship.x += newVals.ship.xv;
      this.setState(newVals);
    }
  }

  start(){
    this.setState({
      start: true,
      hideLoader: true,
    });
  }

  reset(){
    const { ship } = this.state;
    ship.y = 25000;
    ship.yv = 0;
    this.setState({
      ship: ship,
      hideLoader: false,
      start: false,
      gameState: 1,
    });
  }

  updateSize() {
    const newHeight = window.innerHeight;
    const newWidth = window.innerWidth;
    let screenTooSmall = false
    if (newWidth < 1000) {
      this.reset();
      screenTooSmall = true;
    }
    if (this.renderer && this.renderer.setSize) {
      this.renderer.setSize( newWidth, newHeight);
    }
    if (this.camera) {
      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();
    }

    if (this.setState) {
      this.setState({
        rendererHeight: newHeight,
        rendererWidth: newWidth,
        screenTooSmall
      });
    }
  }

  appendRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      canvas: document.getElementById('renderer')
    } );
    this.renderer.setClearColor( 0x000000, 0 );
    this.updateSize();
    return this.renderer;
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 10000 );
    return this.camera;
  }

  landingPad() {
    var geometry = new THREE.BoxGeometry(400, 100, 400);
    var material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
    return new THREE.Mesh(geometry, material);
  }

  setupWebGl(){
    var renderer = this.appendRenderer();
    var camera = this.setupCamera();
    var scene = new THREE.Scene();
    var landingPad = this.landingPad();
    var loader = new THREE.JSONLoader();
    var ship = new THREE.Mesh();
    var nose = new THREE.Mesh();
    var planes = [new THREE.Mesh(), new THREE.Mesh(), new THREE.Mesh()];
    var cloudsx = [new THREE.Mesh(), new THREE.Mesh(), new THREE.Mesh()];
    var cloudsy = [new THREE.Mesh(), new THREE.Mesh()];
    var light = new THREE.AmbientLight( 0x404040 );
    var tracker = new THREE.Mesh();


    const randomNum = (min,max) => {
      return Math.random()*(max-min+1)+min;
    }

    var particleCount = 2000;
    var particles1 = new THREE.Geometry();
    var particles2 = new THREE.Geometry();
    var pMaterial = new THREE.PointCloudMaterial({
      color: 0xE25822,
      size: 0.3,
    });
    for (var p = 0; p < particleCount; p++) {
      var pX = randomNum(1, 1);
      var pY = randomNum(0, 0);
      var pZ = randomNum(0, 0);
      var particle1 = new THREE.Vector3(pX, pY, pZ);
      var particle2 = new THREE.Vector3(-pX, pY, pZ);
      particle1.velocity = new THREE.Vector3(0, -Math.random(),0);
      particle2.velocity = new THREE.Vector3(0, -Math.random(),0);
      particles1.vertices.push(particle1);
      particles2.vertices.push(particle2);
    }
    var particleSystem1 = new THREE.PointCloud(particles1, pMaterial);
    var particleSystem2 = new THREE.PointCloud(particles2, pMaterial);
    particleSystem1.sortParticles = true;
    particleSystem2.sortParticles = true;

    loader.load("renderAssets/dragon.json", (geometry) => {
      var texture = THREE.ImageUtils.loadTexture("../img/skin.png", null, () => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshBasicMaterial({ map: texture, color: 0xFFFFFF });
        ship = new THREE.Mesh(geometry, material);
        ship.scale.set(6,6,6);
        ship.add(particleSystem1);
        ship.add(particleSystem2);
        scene.add(ship);
        this.setState({
          loaded: true,
        });
      });
    });

    loader.load("/renderAssets/nose.json", (geometry) => {
      var texture = THREE.ImageUtils.loadTexture("../img/noseSkin.png", null, () => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshBasicMaterial({ map: texture, color: 0xFFFFFF });
        nose = new THREE.Mesh(geometry, material);
        nose.scale.set(6,6,6);
        scene.add(nose);
      });
    });

    var planeTex = THREE.ImageUtils.loadTexture("../img/sandTexture.jpg", null, () => {
      planeTex.wrapS = planeTex.wrapT = THREE.RepeatWrapping;
      planeTex.repeat.set( 1, 1 );
      var geometry = new THREE.PlaneBufferGeometry( 1000, 1000, 10, 10 );
      var material = new THREE.MeshBasicMaterial({
        map: planeTex,
        color: 0xFFFFFF,
        combine: THREE.MixOperation,
      });

      for (var i = -1; i < 2; i++) {
        planes[i+1] = new THREE.Mesh( geometry, material );
        planes[i+1].scale.set( 1, 1, 1 );
        planes[i+1].rotation.x = - Math.PI / 2;
        planes[i+1].position.setX(this.state.ship.x+(i*1000));
        scene.add( planes[i+1] );
      }
    });

    var cloudTex = THREE.ImageUtils.loadTexture("../img/cloud.png", null, () => {
      cloudTex.wrapS = planeTex.wrapT = THREE.RepeatWrapping;
      cloudTex.repeat.set( 1, 1 );
      var geometry = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
      var material = new THREE.MeshBasicMaterial({
        map: cloudTex,
        color: 0xFFFFFF,
        transparent: true,
        combine: THREE.MixOperation,
      });

      var cloudsyVals = [500, -500];

      for (var i = -1; i < 2; i++) {
        cloudsx[i+1] = new THREE.Mesh( geometry, material );
        cloudsx[i+1].scale.set( 1, 1, 1 );
        cloudsx[i+1].position.setX(this.state.ship.x+(i*1000));
        cloudsx[i+1].position.setZ(-200);
        scene.add( cloudsx[i+1] );
      }

      for (var i = 0; i < cloudsyVals.length; i++) {
        cloudsy[i] = new THREE.Mesh( geometry, material );
        cloudsy[i].scale.set( 1, 1, 1 );
        cloudsy[i].position.setY(this.state.ship.y+cloudsyVals[i]);
        cloudsy[i].position.setZ(-200);
        scene.add( cloudsy[i] );
      };
    });

    tracker.add( camera );
    camera.position.z = 70;
    camera.position.y = 25;
    camera.rotation.x = -20*0.0174532925;
    scene.add( tracker );
    scene.add( light );
    scene.add( landingPad );
    particleSystem1.rotation.z += 0.4;
    particleSystem1.position.y = -1;
    particleSystem2.rotation.z += -0.4;
    particleSystem2.position.y = -1;
    particleSystem1.rotation.y += -0.3;
    particleSystem2.rotation.y += 0.3;

    const draw = () => {
      requestAnimationFrame( draw );

      nose.position.set(this.state.ship.x, this.state.ship.y, this.state.ship.z);
      nose.rotation.z = this.state.ship.zRotation*0.0174532925*0.01*360;
      nose.rotation.x = this.state.ship.xRotation*0.0174532925;

      ship.position.set(this.state.ship.x, this.state.ship.y, this.state.ship.z);
      ship.rotation.z = this.state.ship.zRotation*0.0174532925*0.01*360;
      ship.rotation.x = this.state.ship.xRotation*0.0174532925;

      if(ship.position.x - planes[1].position.x > 1000 || ship.position.x - planes[1].position.x < -1000){
        for (var i = -1; i < 2; i++) {
          planes[i+1].position.setX(ship.position.x+(i*1000));
          cloudsx[i+1].position.setX(ship.position.x+(i*1000));
          cloudsy[0].position.setX(ship.position.y+1000);
          cloudsy[1].position.setX(ship.position.y-1000);
        }
      }
      if(ship.position.y - cloudsx[1].position.y > 1000){
        cloudsy[0].position.setY(ship.position.y+500);
        cloudsy[1].position.setY(ship.position.y-500);

        for (var i = 0; i < cloudsx.length; i++){
          cloudsx[i].position.setY(ship.position.y+500);
        }
      }
      if(ship.position.y - cloudsx[1].position.y < -1000){
        cloudsy[0].position.setY(ship.position.y+500);
        cloudsy[1].position.setY(ship.position.y-500);
        for (var i = 0; i < cloudsx.length; i++) {
          cloudsx[i].position.setY(ship.position.y-500);
        }
      }

      var pCount = particleCount;
      while (pCount--) {
        var particle1 = particles1.vertices[pCount];
        var particle2 = particles2.vertices[pCount];

        if (particle1.y > 0 || particle1.y < -2*this.state.thrustToggle) {
          particle1.y = -0;
          particle1.velocity.y = -Math.random()*(2-0.5+1)+0.5;;
        }

        if (particle2.y > 0 || particle2.y < -2*this.state.thrustToggle) {
          particle2.y = -0;
          particle2.velocity.y = -Math.random()*(2-0.5+1)+0.5;;
        }
        particle1.add(particle1.velocity);
        particle2.add(particle1.velocity);
      }

      tracker.position.set(this.state.ship.x, this.state.ship.y, this.state.ship.z);

      renderer.render( scene, camera );
    }
    draw();
  }

  render() {
    return(
      <div id={"background"}>
        <EndScreen 
          state={this.state.gameState}
          height={this.state.rendererHeight}
          width={this.state.rendererWidth}
          reset={this.reset.bind(this)}
        />
        <Loader 
          loaded={this.state.loaded} 
          hide={this.state.hideLoader} 
          screenTooSmall={this.state.screenTooSmall}
        />
        <Overlay
          start={this.start.bind(this)}
          x={this.state.ship.x}
          y={this.state.ship.y}
          rotation={this.state.ship.zRotation}
          velocity={Math.round(this.state.ship.yv)}
          loaded={this.state.loaded}
          thrust={this.state.thrustMod}
          thrustControl={this.thrustControl.bind(this)}
          gameState={this.state.gameState}
          screenTooSmall={this.state.screenTooSmall}
        />
        <div id={'view'} style={{
          backgroundColor: "rgba(255, 0, 0, 0)",
          height: '100vh'
        }}>
          <canvas 
            id={"renderer"} 
            height={this.state.rendererHeight} 
            width={this.state.rendererWidth}
            style={{
              height: this.state.rendererHeight,
              width: this.state.rendererWidth
            }}
          />
        </div>
      </div>
    )
  }
};



