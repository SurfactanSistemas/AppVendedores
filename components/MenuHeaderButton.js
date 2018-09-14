import React from 'react';
import {View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { createStackNavigator} from 'react-navigation';

export default class MenuHeaderButton extends React.PureComponent {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('Menu', {idVendedor: this.props.navigation.getParam('idVendedor', -1)});
            }} >
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 15}}>
                    <Icon name='md-menu'/>        
                </View>
            </TouchableOpacity>
        )
    }
}