import React from 'react';

import {View, Platform, StatusBar} from 'react-native';
import {TabNavigator} from 'react-navigation';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {Constants} from 'expo';
import {FontAwesome, Ionicons} from '@expo/vector-icons';

import {purple, white} from './utils/colors';

import History from './components/History';
import AddEntry from './components/AddEntry';

import reducers from './reducers';


function UdaciStatusBar({backgroundColor, ...props}) {
    return (
        <View style={{backgroundColor, height: Constants.statusBarHeight}}>
            <StatusBar
                translucent
                backgroundColor={backgroundColor}
                {...props}
            />
        </View>
    );
}

const Tabs = TabNavigator({
    History: {
        screen: History,
        navigationOptions: {
            tabBarLabel: 'History',
            tabBarIcon: ({tintColor}) => <Ionicons name='ios-bookmarks' size={30} color={tintColor}/>
        }
    },
    AddEntry: {
        screen: AddEntry,
        navigationOptions: {
            tabBarLabel: 'Add Entry',
            tabBarIcon: ({tintColor}) => <FontAwesome name='plus-square' size={30} color={tintColor}/>
        }
    }
}, {
    navigationOptions: {
        header: null
    },
    tabBarOptions: {
        activeTintColor: Platform.OS === 'ios' ? purple : white,
        style: {
            height: 56,
            backgroundColor: Platform.OS === 'ios' ? white : purple,
            shadowColor: 'rgba(0, 0, 0, 0.24)',
            shadowOffset: {
                width: 0,
                height: 3
            },
            shadowRadius: 6,
            shadowOpacity: 1
        }
    }
});


export default class App extends React.Component {
    render() {
        return (
            <Provider store={createStore(reducers)}>
                <View style={{flex: 1}}>
                    <UdaciStatusBar
                        backgroundColor={purple}
                        barStyle="light-content"
                    />
                    <Tabs/>
                </View>
            </Provider>
        );
    }
}