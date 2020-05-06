import React from 'react';
import $ from "jquery";
// One day I'll remove jquery from this codebase...

export default class Overlay extends React.Component {
  componentDidMount(){
    $(document).ready(function($) {
      var margin = (($(document).height()/3)/2)-($("#speed").height()/2);
      $("#speed").css("margin-top", margin);
    });
  }

  render() {
  	const docWidth = $(document).width();
  	const docHeight = $(document).height();

    var clearBackground = {
      backgroundColor: "rgba(0, 0, 0, 0)",
    }

    var Overlaystyle = {
      backgroundColor: "rgba(0, 0, 0, 0)",
      position:"fixed",
      height: docHeight,
      width: docWidth > 1000 ? docWidth : 1000,
      top:"0px",
      zIndex:"1000",
    }
    var pathStyle = {
      fill: "rgba(175, 255, 180, .7)",
      stroke: "none",
    }

    var border = {
      position: "relative",
      height: docHeight+5,
      top:"-5px",
    };

    var sidePanels = {
      backgroundColor: "rgba(175, 255, 180, .7)",
      height: docHeight,
    }

    const panelRowStyle= {
      height: (docHeight/3),
      borderBottom: "2px solid black"
    }

    var left = $.extend({}, border)
    left.float = "left";
    var right = $.extend({}, border)
    right.float = "right";

    if (this.props.screenTooSmall) {
    	return (
    		<div style={{position: 'fixed', height: docHeight, width: docWidth}}>
    			<h1 style={{fontSize: 60, textAlign: 'center'}}>Please Make Screen Wider</h1>
        </div>
      );
    }

    return (
      React.createElement("div", {style: Overlaystyle},
        React.createElement("div", {className: "container-fluid", style: clearBackground},
          React.createElement("div", {className: "col-md-1", style: sidePanels},
            React.createElement("div", {className: "row", style: panelRowStyle},
              React.createElement("img", {id: "logo", src: "../img/dragonLogo.png", alt: "logo", style: {maxWidth: "100%"}})
            ),
            React.createElement("div", {className: "row", style: panelRowStyle},
              React.createElement(Speedo, {velocity: this.props.velocity, gameState: this.props.gameState})
            )
          ),

          React.createElement("div", {className: "col-md-1"},
            React.createElement("svg", {version: "1.1", viewBox: "0 0 5 50", style: left},
              React.createElement("path", {style: pathStyle, d: "M-0,50h5c-3.174-7.356-5-15.89-5-25V50z"}),
              React.createElement("path", {style: pathStyle, d: "M-0,0v25c0-9.11,1.826-17.644,5-25H-0.147z"})
            )
          ),

          React.createElement("div", {className: "col-md-8", id: "overScreen"},
            React.createElement(HUD, {x: this.props.x, y: this.props.y, rotation: this.props.rotation})
          ),

          React.createElement("div", {className: "col-md-1"},
            React.createElement("svg", {version: "1.1", viewBox: "0 0 5 50", style: right},
              React.createElement("path", {style: pathStyle, d: "M5,50h-5c3.174-7.356,5-15.89,5-25V50z"}),
              React.createElement("path", {style: pathStyle, d: "M5,0v25c0-9.11-1.826-17.644-5-25H4.854z"})
            )
          ),

          React.createElement("div", {className: "col-md-1", style: sidePanels},
            React.createElement("div", {className: "row", style: panelRowStyle},
              React.createElement(LaunchControl, {start: this.props.start, loaded: this.props.loaded, thrust: this.props.thrust, thrustControl: this.props.thrustControl})
            ),

            React.createElement("div", {className: "row", style: panelRowStyle},
              React.createElement(Altitude, {altitude: Math.round(this.props.y)})
            ),

            React.createElement("div", {className: "row", style: panelRowStyle},
              React.createElement(Console, {x: this.props.x, y: this.props.y, rotation: this.props.rotation})
            )

          )
        )
      )
    );
  }
}

class Speedo extends React.Component {
  constructor(props) {
    	super(props);
    	this.state = this.props;
  	}
  
  getInitialState() {
    return this.props
  }

  componentWillReceiveProps(newProp) {
    if(newProp.gameState !== 1){
      clearInterval(this.state.interval)
      this.setState({
        velocity: 0,
      });
      for (var i = -2; i < 3 ; i++) {
        $("#speed").children().eq(i+2).text(i);
      }
    }else{
      this.setState(newProp);
    }
  }

  componentDidMount() {
    $(document).ready(function($) {
      var margin = (($(document).height()/3)/2)-($("#speed").height()/2);
      $("#speed").css("margin-top", margin);
    });
    this.startInterval()
  }

  startInterval() {
    var comp = this;
    var speed = $("#speed");
    var speedoInterval = setInterval(function(){
      if(speed.children().eq(2).text()<comp.state.velocity){
        speed.children().eq(4).hide(100, function(){ this.remove(); })
        $("<li class='meters-per-sec'>"+(comp.state.velocity+2)+'</li>').hide().prependTo(speed).show(100);
      }else if(speed.children().eq(2).text()>comp.state.velocity){
        speed.children().eq(0).hide(100, function(){ this.remove(); })
        $("<li class='meters-per-sec'>"+(comp.state.velocity-2)+'</li>').hide().appendTo(speed).show(100);
      }
    }, 200);
    this.setState({
      interval: speedoInterval,
    })
  }

  render() {
    return (
      React.createElement("div", {id: "speedo-container", style: {height: "100%"}},
        React.createElement("ul", {id: "speed"},
          React.createElement("li", {className: "meters-per-sec"}, this.state.velocity+2),
          React.createElement("li", {className: "meters-per-sec"}, this.state.velocity+1),
          React.createElement("li", {className: "meters-per-sec"}, this.state.velocity),
          React.createElement("li", {className: "meters-per-sec"}, this.state.velocity-1),
          React.createElement("li", {className: "meters-per-sec"}, this.state.velocity-2)
        )
      )
    );
  }
}

class HUD extends React.Component {
  tickMark(rotation) {
    return React.createElement("line", {y2: "390", x2: "200", y1: "350", x1: "200", strokeWidth: "2", stroke: "rgba(175, 255, 180, .7)", transform: "rotate("+rotation+" 200 200)"})
  }

  render() {
    var op = this.props.x;
    var hyp = Math.sqrt(Math.pow(op, 2)+Math.pow(this.props.y, 2));
    var angle = Math.asin(op/hyp)*57.2957795;
    var pointerStyle={fill:"rgba(175, 255, 180, .7)", stroke: "none"}
    return (
      React.createElement("svg", {height: window.innerHeight, width: window.innerWidth*(8/12), viewBox: "0 0 400 400", preserveAspectRatio: "none", className: "svg-content"},
        React.createElement("g", null,
          React.createElement("circle", {stroke: "rgba(175, 255, 180, .7)", strokeWidth: "1", fill: "none", cx: "200", cy: "200", r: "139.312"}),
          this.tickMark(90),
          this.tickMark(270)
        ),

        React.createElement("g", {transform: "rotate("+angle+" 200, 200)"},
          React.createElement("polyline", {style: pointerStyle, points: "200,338.746 219.36,338.746 200,378.34 180.64,338.746 200,338.746 "}),
          React.createElement("text", {transform: "matrix(1 0 0 1 187 336)", style: {fill: "rgba(175, 255, 180, .7)"}}, Math.round(hyp))
        ),

        React.createElement("g", {transform: "rotate("+(-(this.props.rotation*0.01)*360-90)+" 200, 200)"},
          React.createElement("line", {strokeWidth: "1", stroke: "rgba(175, 255, 180, .7)", y2: "0", x2: "200", y1: "100", x1: "200", strokeLinecap: "round"}),
          React.createElement("line", {strokeWidth: "1", stroke: "rgba(175, 255, 180, .7)", y2: "300", x2: "200", y1: "400", x1: "200", strokeLinecap: "round"})
        )

      )

    );
  }
}

class LaunchControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "red",
      thrust: this.props.thrust,
      start: function(e){
        e.preventDefault()
      },
    };
  }

  componentWillReceiveProps(newProps) {
    if( newProps.loaded === true ){
      this.setState({
        color: "rgba(175, 255, 180, .7)",
        start: this.props.start,
      });
      $("#launchButton").removeClass('disabled');
    }
    this.setState({
      thrust: newProps.thrust
    })
  }

  render() {
    var comp = this;
    var buttonStyle = {
      backgroundColor: "rgba(0, 0, 0, 0)",
      width: "100%",
    }

    var launchButtonStyle = $.extend({}, buttonStyle);
    launchButtonStyle.backgroundColor = this.state.color;

    function thrustUp(){
      comp.props.thrustControl(.01)
    }
    function thrustDown(){
      comp.props.thrustControl(-.01)
    }

    return (
      React.createElement("div", null,
        React.createElement("button", {id: "launchButton", type: "button", className: "btn btn-default disabled", style: launchButtonStyle, onClick: this.state.start}, "Launch"),
        React.createElement("p", null, "Thrust Modifier"),
        React.createElement("button", {type: "button", className: "btn btn-default", style: buttonStyle, onClick: thrustUp}, "UP"),
        React.createElement("button", {type: "button", className: "btn btn-default", style: buttonStyle}, Math.round(this.state.thrust*1000)+"%"),
        React.createElement("button", {type: "button", className: "btn btn-default", style: buttonStyle, onClick: thrustDown}, "Down")
      )

    );
  }
}

class Altitude extends React.Component {
  componentDidMount() {
    $(document).ready(function($) {
      var margin = (($(document).height()/3)/2)-($("#alt-display").height()/2);
      $("#alt-display").css("margin-top", margin);
    });
  }

  render() {
    return (
      React.createElement("div", {style: {height: "50%"}},
        React.createElement("div", {style: {textAlign: "center", fontSize: "2em"}, id: "alt-display"}, this.props.altitude+" m")
      )
    );
  }
}

class Console extends React.Component {
  render(){
    return (
      React.createElement("div", {style: {overflow: "hidden", width: "100%"}, id: "console-container"},
        React.createElement("p", null, "X = ", Math.round(this.props.x)),
        React.createElement("p", null, "Y = ", Math.round(this.props.y)),
        React.createElement("p", null, "R = ", Math.round(this.props.rotation)),
        React.createElement("p", null, "~:>")
      )
    );
  }
}