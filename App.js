import React from 'react';

import {View} from 'react-native';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import History from './components/History';

import reducers from './reducers';


export default class App extends React.Component {
    render() {
        return (
            <Provider store={createStore(reducers)}>
                <View style={{flex: 1}}>
                    <History/>
                </View>
            </Provider>
        );
    }
}