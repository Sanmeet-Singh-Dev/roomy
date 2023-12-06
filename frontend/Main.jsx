import { View, Text } from 'react-native'
import store from './store';
import { Provider } from 'react-redux';
import React from 'react'
import App from './App';

Text.defaultProps = {
  ...Text.defaultProps,
  style: [{ fontFamily: 'YourChosenFont' }],
};

const Main = () => {
  return <App />;
}

export default Main