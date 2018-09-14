import React from 'react';
import { View, StyleSheet, Alert, PixelRatio } from 'react-native';
import HeaderNav from './HeaderNav.js';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Text, Textarea, Button, Spinner, Container } from 'native-base';
import Config from '../config/config';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { ScrollView } from 'react-native-gesture-handler';

export default class Observacion extends React.PureComponent {

    static navigationOptions = {
        headerTitle: <HeaderNav />,
    };

    constructor(props){
        super(props);
        this.state = {
            Observaciones: '',
            loading: false,
            Sending: false
        }
        this.Pedido = this.props.navigation.getParam('Pedido', '');
        this.Producto = this.props.navigation.getParam('Producto', '');
        this.Cliente = this.props.navigation.getParam('Cliente', '');
        this.txtObservacion = '';
    }

    _TraerObservaciones(){
        Config.Consultar('Muestras/Observaciones/' + this.Pedido + '/' + this.Producto, (resp) => {
            resp.then(resp => resp.json())
                .then(respJson => {
                    const {error, resultados, ErrorMsg} = respJson;

                    const observacion = resultados.length > 0 ? resultados[0].Observacion : "";

                    if (error) throw 'Hubo un error al querer traer la observación del Producto ' + this.Producto + '. Motivo: ' + ErrorMsg;

                    this.setState({Observaciones: observacion, loading: false});
                })
                .catch((err) => console.error(err));
        });
    }

    componentDidMount(){
        this.setState({loading: true}, this._TraerObservaciones);
    }

    handleOnPress(){
        // Validamos que se tenga contenido para ser guardado.
        //if (this.state.Observaciones.trim() == '') return;

        // Indicamos que vamos a comenzar con la rutina para el grabado de la Observacion
        // mostrando el spinner al costado del boton de 'Grabar'.
        this.setState({Sending: true});
        fetch(Config.BASE_URL + 'Muestras/Observaciones', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Pedido: this.Pedido,
                Producto: this.Producto,
                Observacion: this.state.Observaciones,
            })
        })
        .then(resp => resp.json())
        .then(respJson => {
            if (respJson.Error) throw 'Error al quere guardar la observacion para el producto ' + this.Producto + ' para el Pedido ' + this.Pedido;
            this.setState({Sending: false}, () => {
                this.props.navigation.goBack();
            });
        })
        .catch(err => console.log(err));
    }

    goBack = () => {
        // if (!confirm("Si sale sin grabar los cambios, estos se perderán. ¿Desea salir igualmente?")) return;
        Alert.alert('Confirmación', 'Si sale sin grabar los cambios, estos se perderán. ¿Desea salir igualmente?',
        [
            {text: 'Cancelar', onPress: () => {}},
            {text: 'Aceptar', onPress: () => this.props.navigation.goBack()},
        ]);
    };

    ContenidoBoton(){
        if (this.state.Sending) return (<Spinner color={Config.bgColorSecundario} />);
        return (<Text style={{ fontSize: 13 / PixelRatio.getFontScale() }} >Grabar</Text>);
    }
    render(){
        if (this.state.loading) return (<View><Spinner/></View>);

        return (
            <ScrollView>
                <Container style={{flex: 1, backgroundColor: '#eee', paddingHorizontal: responsiveWidth(2), minHeight: 300}}>
                    <Grid style={{ minHeight: 400 }} >
                        <Col>
                            <Row size={1} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: Config.bgColorSecundario}}>
                                <Text style={{fontSize: 20 / PixelRatio.getFontScale(), fontWeight: 'bold', color: '#fff'}}>
                                    OBSERVACIONES
                                </Text>
                            </Row>
                            <Row size={1} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                <Col size={1}  style={[{ paddingVertical: 5, alignItems: 'center', borderTopColor: '#ccc', borderTopWidth: 1,backgroundColor: Config.bgColorSecundario, justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={[styles.WhiteText, {fontSize: 15 / PixelRatio.getFontScale()}]} >Cliente</Text>
                                </Col>
                                <Col size={2} style={{  paddingVertical: 5, alignItems: 'center',backgroundColor: '#fff' }}>
                                    <Text style={{ fontSize: 13 / PixelRatio.getFontScale() }}>
                                        {this.Cliente}
                                    </Text>
                                </Col>
                            </Row>
                            <Row size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Col size={3}  style={[{ paddingVertical: 5, alignItems: 'center', borderTopColor: '#ccc', borderTopWidth: 1,backgroundColor: Config.bgColorSecundario, justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={[styles.WhiteText, {fontSize: 15 / PixelRatio.getFontScale()}]} >Producto</Text>
                                </Col>
                                <Col size={3} style={{ paddingVertical: 5, alignItems: 'center', backgroundColor: '#fff' }}>
                                    <Text style={{ fontSize: 13 / PixelRatio.getFontScale() }}>
                                        {this.Producto}
                                    </Text>
                                </Col>
                                <Col size={3}  style={[{ paddingVertical: 5, alignItems: 'center', borderTopColor: '#ccc', borderTopWidth: 1,backgroundColor: Config.bgColorSecundario, justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={[styles.WhiteText, {fontSize: 15 / PixelRatio.getFontScale()}]} >Pedido</Text>
                                </Col>
                                <Col size={3} style={{ paddingVertical: 5, alignItems: 'center', backgroundColor: '#fff' }}>
                                    <Text style={{ fontSize: 13 / PixelRatio.getFontScale() }}>
                                        {this.Pedido}
                                    </Text>
                                </Col>
                            </Row>
                            <Row size={9}>
                                <Col>
                                    <Row size={8}>
                                        <Col>
                                            <Text style={{ textAlign: 'right', fontStyle: 'italic', fontSize: 10 / PixelRatio.getFontScale(), color: '#000', marginHorizontal: 5, marginRight: 10}}>Caracteres Restantes: {200 - this.state.Observaciones.length} / 200</Text>
                                            <Textarea maxLength={200} style={{ borderColor: '#aaa', flex: 1, paddingVertical: 10 , alignItems: 'center', backgroundColor: '#fff', borderRadius: 5}} bordered placeholder="Observación..." autoFocus onChangeText={(t) => this.setState({Observaciones: t})} value={this.state.Observaciones} >
                                            </Textarea>
                                        </Col>
                                    </Row>
                                    <Row size={4} style={{ marginTop: 10, marginBottom: 20, justifyContent: 'space-around' }}>
                                        <Button block title="" onPress={this.handleOnPress.bind(this)} disabled={this.state.Sending} style={{ maxWidth: 200 }}>
                                            {this.ContenidoBoton()}
                                        </Button>
                                        <Button block title="" warning onPress={this.goBack} style={{ maxWidth: 200 }}>
                                            <Text style={{ fontSize: 13 / PixelRatio.getFontScale() }}>Cancelar</Text>
                                        </Button>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Grid>
                </Container>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    WhiteText: {
        color: '#FFF'
    },
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