import React from 'react';

export default class EndScreen extends React.Component {
  render(){
    var Overlaystyle = {
      backgroundColor: "rgba(250, 250, 250, .5)",
      position:"fixed",
      height: this.props.height,
      width: this.props.width,
      top:"0px",
      zIndex:"2000",
      textAlign: "center",
    }
    if(this.props.state !== 1){
      return (      
        React.createElement("div", {style: Overlaystyle},
          React.createElement("h1", null, this.props.state),
          React.createElement("button", {onClick: this.props.reset}, "Reset")
        )
      );
    }else{
      return (
        React.createElement("div", null)
      )
    }
  }
}