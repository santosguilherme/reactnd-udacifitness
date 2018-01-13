import React, {Component} from 'react';

import {View, Text, TouchableOpacity} from 'react-native';


import {Ionicons} from '@expo/vector-icons';

import {getMetricMetaInfo, timeToString} from '../utils/helpers';
import {submitEntry, removeEntry} from '../utils/api';

import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import TextButton from './TextButton';


function SubmitBtn({onPress}) {
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <Text>SUBMIT</Text>
        </TouchableOpacity>
    )
}

export default class AddEntry extends Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0
    };

    handleIncrement = metric => {
        const {max, step} = getMetricMetaInfo(metric);

        this.setState((state) => {
            const count = state[metric] + step;

            return {
                [metric]: count > max ? max : count
            };
        })
    };

    handleDecrement = metric => {
        this.setState((state) => {
            const count = state[metric] - getMetricMetaInfo(metric).step;

            return {
                [metric]: count < 0 ? 0 : count
            }
        })
    };

    handleSlide = (metric, value) => {
        this.setState({
            [metric]: value
        });
    };

    handleSubmit = () => {
        const key = timeToString();
        const entry = this.state;

        // Update Redux

        this.setState(() => ({run: 0, bike: 0, swim: 0, sleep: 0, eat: 0}));

        // Navigate to home

        submitEntry({key, entry});

        // Clear local notification
    };

    handleReset = () => {
        const key = timeToString();

        // Update Redux

        // Route to Home

        removeEntry(key);
    };

    render() {
        const metaInfo = getMetricMetaInfo();

        if (this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons
                        name={'ios-happy-outline'}
                        size={100}
                    />
                    <Text>You already logged your information for today.</Text>
                    <TextButton onPress={this.handleReset}>
                        Reset
                    </TextButton>
                </View>
            );
        }

        return (
            <View>
                <DateHeader date={new Date().toLocaleDateString()}/>
                {Object.keys(metaInfo).map((key) => {
                    const {getIcon, type, ...rest} = metaInfo[key];
                    const value = this.state[key];

                    return (
                        <View key={key}>
                            {getIcon()}
                            {type === 'slider'
                                ? <UdaciSlider
                                    value={value}
                                    onChange={(value) => this.handleSlide(key, value)}
                                    {...rest}
                                />
                                : <UdaciSteppers
                                    value={value}
                                    onIncrement={() => this.handleIncrement(key)}
                                    onDecrement={() => this.handleDecrement(key)}
                                    {...rest}
                                />
                            }
                        </View>
                    )
                })}
                <SubmitBtn onPress={this.handleSubmit}/>
            </View>
        )
    }
}