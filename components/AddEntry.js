import React, {Component} from 'react';

import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';

import {Ionicons} from '@expo/vector-icons';

import {getMetricMetaInfo, timeToString, getDailyReminderValue} from '../utils/helpers';
import {submitEntry, removeEntry} from '../utils/api';
import {white, purple} from '../utils/colors';

import {addEntry} from '../actions';

import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import TextButton from './TextButton';


function SubmitBtn({onPress}) {
    return (
        <TouchableOpacity
            style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.AndroidSubmitBtn}
            onPress={onPress}
        >
            <Text style={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component {
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
        const {addEntry} = this.props;
        const key = timeToString();
        const entry = this.state;

        addEntry({
            [key]: entry
        });

        this.setState(() => ({run: 0, bike: 0, swim: 0, sleep: 0, eat: 0}));

        this.toHome();

        submitEntry({key, entry});

        // Clear local notification
    };

    handleReset = () => {
        const {addEntry} = this.props;
        const key = timeToString();

        addEntry({
            [key]: getDailyReminderValue()
        });

        this.toHome();

        removeEntry(key);
    };

    toHome = () => {
        this.props.navigation.dispatch(NavigationActions.back({key: 'AddEntry'}));
    };

    render() {
        const metaInfo = getMetricMetaInfo();

        if (this.props.alreadyLogged) {
            return (
                <View style={styles.center}>
                    <Ionicons
                        name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
                        size={100}
                    />
                    <Text>You already logged your information for today.</Text>
                    <TextButton
                        style={{padding: 10}}
                        onPress={this.handleReset}
                    >
                        Reset
                    </TextButton>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <DateHeader date={new Date().toLocaleDateString()}/>
                {Object.keys(metaInfo).map((key) => {
                    const {getIcon, type, ...rest} = metaInfo[key];
                    const value = this.state[key];

                    return (
                        <View
                            key={key}
                            style={styles.row}
                        >
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40,
    },
    AndroidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    },
});

function mapStateToProps(state) {
    const key = timeToString();

    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    };
}

const mapDispatchToProps = {
    addEntry
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEntry);