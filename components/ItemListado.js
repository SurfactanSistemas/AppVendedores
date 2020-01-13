import React from 'react';
import {Button, View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, PixelRatio } from 'react-native';
import { createStackNavigator} from 'react-navigation-stack';

export default class ItemListado extends React.Component {
    render(){
        return (
            <View>
                <TouchableOpacity  onPress = {() => {this.props.nav.navigate('Detalles', {Pedido: this.props.item.Pedido})}}>
                    <View  style={styles.item} >
                        <View style={styles.headerCliente}>
                            <Text style={styles.codCliente}>{this.props.item.Cliente}</Text>
                            <Text style={styles.desCliente}>{this.props.item.Razon}</Text>
                        </View>
                        <View style = {styles.cuerpo}>
                            {/* <Text style = {{fontSize: 10, flex: 1}}>Items:</Text> */}
                            <FlatList
                                data = {this.props.item.Productos}
                                keyExtractor = {(item, index) => index + ''}
                                renderItem = {({item}) => <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}><Text style = {{fontSize: 15 / PixelRatio.getFontScale(), flex: 3}}>- {item.DesProducto}</Text><Text style={{fontSize: 10 / PixelRatio.getFontScale(), flex: 1}}>(Cant: {parseFloat(item.Cantidad).toFixed(2)} Kgs)</Text></View>}
                            />
                        </View>
                        <View style={styles.footer}>
                            <Text style={{flex: 3, color: '#133c74'}}>Pedido Nº: {this.props.item.Pedido}</Text>
                            <Text style={{flex: 1, color: '#133c74'}}>{this.props.item.Fecha}</Text>
                        </View>
                    </View>
                </TouchableOpacity >
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerCliente: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#aaa',
    },
    codCliente: {
        fontSize: 20 / PixelRatio.getFontScale(),
        backgroundColor: '#133c74',
        color: '#FFF',
        padding: 10
    },
    desCliente: {
        fontSize: 18 / PixelRatio.getFontScale(),
        paddingLeft: 20,
        fontStyle: 'italic',
        color: '#FFF',
        flex: 1,
    },
    footer: {
        backgroundColor: '#d6deeb',
        padding: 10,
        flexDirection: 'row'
    },
    cuerpo: {
        flex: 1,
        minHeight: 100,
        borderColor: '#133c74',
        borderStyle: 'solid',
        borderWidth: 2,
        padding: 10,
        paddingLeft: 20,
        justifyContent: 'center'
    },
    item: {
        marginTop: 5,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 30
    }
});