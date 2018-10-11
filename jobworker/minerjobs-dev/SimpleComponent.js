import React from 'react';
import { renderReact } from 'hypernova-react';

let meme = 25;

//function SimpleComponent({ name }) {
//  return (
//    <div onClick={() => alert("Click handlers work.")}>
//      Hello, {meme++}, {name}!
//    </div>
//  );
//}
//
//export default renderReact("SimpleComponent", SimpleComponent);

const MyComponent = ({ name }) =>
  //  renderReact("SimpleComponent", name =>
  {
    return (
      <div onClick={() => alert('Click handlers work.')}>
        Hello, {meme++}, {name}!
      </div>
    );
  };
//  );

//export const SimpleComponent = renderReact("SimpleComponent", MyComponent);

//export default SimpleComponent;

export default renderReact('SimpleComponent', MyComponent);
//export default SimpleComponent;
