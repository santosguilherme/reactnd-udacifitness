import React from 'react';

import {View} from 'react-native';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import AddEntry from './components/AddEntry';

import reducers from './reducers';


export default class App extends React.Component {
    render() {
        return (
            <Provider store={createStore(reducers)}>
                <View>
                    <AddEntry/>
                </View>
            </Provider>
        );
    }
}