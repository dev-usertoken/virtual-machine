import React from 'react';
import { renderReact } from 'hypernova-react';

let meme = 25;
const valueArray = ['tianyang', 'los angeles', 'male', 'ucla'];
const keyArray = ['name', 'location', 'gender', 'school'];

function Attribute(props) {
  return (
    <span className="reveal">
      {props.name} ": " {props.value}
      <button className="reveal" onClick={props.onClick}>
        reveal
      </button>
    </span>
  );
}

// function SimpleComponent({ name }) {
//  return (
//    <div onClick={() => alert("Click handlers work.")}>
//      Hello, {meme++}, {name}!
//    </div>
//  );
// }
//
// export default renderReact("SimpleComponent", SimpleComponent);

class Identity extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      revealArray: Array(4).fill(false),
    };
  }

  handleClick(i) {
    const reveal = this.state.revealArray.slice();
    if (reveal[i]) {
      return;
    }
    reveal[i] = true;
    this.setState({
      revealArray: reveal,
    });
  }

  renderAttribute(i) {
    return (
      <Attribute
        name={keyArray[i]}
        value={this.state.revealArray[i] ? valueArray[i] : ''}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render(){
    return(
      <div>
        {this.renderAttribute(0)}
        <br />
        {this.renderAttribute(1)}
        <br />
        {this.renderAttribute(2)}
        <br />
        {this.renderAttribute(3)}
      </div>


    );


  }
}



// const MyComponent = ({ name }) => (
//   //  renderReact("SimpleComponent", name =>
//   <div onClick={() => alert('Click handlers work.')}>
//     Hello, {meme++}, {name}!
//   </div>
// );
//  );

// export const SimpleComponent = renderReact("SimpleComponent", MyComponent);

// export default SimpleComponent;

export default renderReact('SimpleComponent', Identity);
// export default SimpleComponent;
