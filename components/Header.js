import React from 'react';
import {Text, Image, View, StyleSheet, PixelRatio} from 'react-native';

export default class Header extends React.Component {
    render(){
        return (
            <View style={styles.header}>
                <Text style={styles.titulo}>Muestras</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({ 
    titulo: {
        fontSize: 25 / PixelRatio.getFontScale(),
        color: '#FFF',
        flex: 1,
        textAlign: 'center'
    },
    header: {
        backgroundColor: '#133c74',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //marginTop: 65
    }
});