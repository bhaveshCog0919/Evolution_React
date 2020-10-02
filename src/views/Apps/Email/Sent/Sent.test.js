import React from 'react';
import ReactDOM from 'react-dom';
import Sent from './Sent';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Sent />, div);
  ReactDOM.unmountComponentAtNode(div);
});
