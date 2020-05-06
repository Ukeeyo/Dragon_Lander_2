import React from 'react';
import $ from "jquery";
// One day I'll remove jquery from this codebase...

export default class Loader extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      message: "LOADING..."
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.hide===true){
      $("#loadScreen").hide(500)
    }else if(nextProps.hide===false){
      $("#loadScreen").show(500);
    }
    if(nextProps.loaded===true)
      this.setState({
        message: "READY FOR RENTRY..."
      })
  }

  render() {
    var Overlaystyle = {
      backgroundColor: "black",
      position:"fixed",
      height: $(document).height(),
      width: $(document).width(),
      top:"0px",
      zIndex:"1000",
      textAlign: "center",
    }

    var infoOverlay = {
      backgroundColor:"rgba(0,0,0,0)",
      position:"fixed",
      top:"0px",
      zIndex:"2000",
      marginLeft: $(document).width()*(1/12),
    }

    var pathStyle = {
      stroke: "rgba(175, 255, 180, .7)",
      fill: "rgba(0,0,0,0)"
    }

    if (this.props.screenTooSmall) {
      return null;
    }


    return (
      React.createElement("div", {id: "loadScreen", style: Overlaystyle},
        React.createElement("h1", null, this.state.message),
        React.createElement("svg", {height: window.innerHeight, width: window.innerWidth*(10/12), viewBox: "0 0 400 400", preserveAspectRatio: "none", className: "svg-content", style: infoOverlay},
          React.createElement("text", {transform: "matrix(1 0 0 1 237.25 117.02)", style: pathStyle}, "W"),
          React.createElement("rect", {x: "234.5", y: "106.5", style: pathStyle, width: "15.5", height: "15.5"}),
          React.createElement("text", {transform: "matrix(1 0 0 1 252.6738 132.52)", style: pathStyle}, "D"),
          React.createElement("rect", {x: "249.924", y: "122", style: pathStyle, width: "15.5", height: "15.5"}),
          React.createElement("text", {transform: "matrix(1 0 0 1 222.1104 132.52)", style: pathStyle}, "A"),
          React.createElement("rect", {x: "219.36", y: "122", style: pathStyle, width: "15.5", height: "15.5"}),
          React.createElement("text", {transform: "matrix(1 0 0 1 200 152.4336)", style: pathStyle}, "Keyboard Controls"),
          React.createElement("text", {transform: "matrix(1 0 0 1 191.75 130.52)", style: pathStyle}, "Left"),
          React.createElement("text", {transform: "matrix(1 0 0 1 269.4238 130.52)", style: pathStyle}, "Right"),
          React.createElement("text", {transform: "matrix(1 0 0 1 228.2988 99.27)", style: pathStyle}, "Thrust"),
          React.createElement("text", {style: pathStyle, transform: "matrix(1 0 0 1 93.2793 162.4775)"}, "Current Velocity"),
          React.createElement("text", {style: pathStyle, transform: "matrix(1 0 0 1 219.3604 254.4785)"}, "Current Altitude"),
          React.createElement("polyline", {style: pathStyle, points: "0,200 28.5,200 28.5,165.478 172.838,165.478 "}),
          React.createElement("polyline", {style: pathStyle, points: "400,200 377,200 377,257.479 219.36,257.479 "}),
          React.createElement("text", {style: pathStyle, transform: "matrix(1 0 0 1 317.6738 28)"}, "Launch"),
          React.createElement("polyline", {style: pathStyle, points: "400,12 377,12 377,31 317.674,31 "}),
          React.createElement("text", {transform: "matrix(1 0 0 1 138.5498 305.0195)", style: pathStyle}, "Distance to Landing Pad")
        )
      )
    );
  }
}


