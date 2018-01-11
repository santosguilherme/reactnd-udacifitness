import React from 'react';

import {View, Text, Slider} from 'react-native';


export default function UdaciSlider({value, unit, step, max, onChange}) {
    return (
        <View>
            <Slider
                value={value}
                step={step}
                maximumValue={max}
                minimumValue={0}
                onValueChange={onChange}
            />
            <Text>{value}</Text>
            <Text>{unit}</Text>
        </View>
    );
}