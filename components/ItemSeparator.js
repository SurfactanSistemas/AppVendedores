import React from 'react';
import {View, StyleSheet} from 'react-native';

export default class ItemSeparator extends React.Component {
    render(){
        return (
            <View  style={styles.item}>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#00FF00',
        marginTop: 5,
        padding: 10,
    }
});