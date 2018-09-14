import React from 'react';
import {StyleSheet, View, Dimensions, PixelRatio} from 'react-native';
import MenuHeaderButton from './MenuHeaderButton';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, Spinner, Header, Item } from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Config from '../config/config.js';
import _ from 'lodash';

export default class DetallesPreciosVentasProductos extends React.PureComponent{
    
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: <HeaderNav section="Ventas" />,
            headerRight: <MenuHeaderButton navigation={navigation} />
        };
    };

    state = {
        datos: [],
        refrescando : true,
        ultimo: 0,
        urlConsulta: '',
        idVendedor: global.idVendedor,
        heightDevice: Dimensions.get('screen').height,
        mostrarDatos: null,
        opacityValue: 0,
        AnioConsulta: (new Date()).getFullYear(),
        Anios: [],
        textFilter: '',
        itemsFiltrados: [],
        primeraVez: true,
    }

    componentDidMount(){
        this.setState(
            {
                refrescando: false,
                heightDevice: Dimensions.get('screen').height,
                itemsFiltrados: this.props.navigation.getParam('Producto', [])
            }
        );
    }

    ConsultarAniosPosibles(){
        Config.Consultar('AniosFiltro/' + this.state.idVendedor, (resp) => {
            resp.then((res) => res.json())
                .then((resJson) => {
                    this.setState({Anios: resJson});
                });
        });
    }

    _handleChangeTextFiltro(val){
        this.setState({textFilter: val.trim()});
        let _itemsFiltrados = [];
        if (val.trim() == ""){
            _itemsFiltrados = this.state.datos;
        }else{
            const regex1 = new RegExp(val.toUpperCase());
            _.forEach(this.state.datos, (vendedor) => {
                let filtrados = _.filter(vendedor.Datos, (Cliente) => {
                    return regex1.test(Cliente.Razon.toUpperCase()) || regex1.test(Cliente.Cliente.toUpperCase()) ;
                });

                if (filtrados.length > 0)
                    _itemsFiltrados.push({Vendedor: vendedor.Vendedor, DesVendedor: vendedor.DesVendedor, Datos: filtrados});
            });
        }

        this.setState({itemsFiltrados: _itemsFiltrados});
    }

    render(){
        if (this.state.refrescando) return (
            <Container>
                <Content>
                        <Spinner color={Config.bgColorTerciario}/>
                </Content>
            </Container>
        );
        const Producto = this.state.itemsFiltrados;
        const {Cliente, Razon} = Producto.Datos[0];
        const WCantidadTotal = Producto.Datos.reduce((total, d) => total + d.Cantidad,0);

        return (
            <Container>
                <Header style={{backgroundColor: Config.bgColorSecundario}}>
                    <Text style={{ fontSize: 15 / PixelRatio.getFontScale(), color: '#fff', fontWeight: 'bold' }}>
                        DETALLES
                    </Text>
                </Header>
                <Content style={styles.container}>
                    <Grid>
                        <Row style={[styles.row, {marginTop: 30}]}>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Código</Text>
                            </Col>
                            <Col size={3} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{Producto.Producto}</Text>
                            </Col>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Producto</Text>
                            </Col>
                            <Col size={5} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{Producto.Datos[0].DesTerminado}</Text>
                            </Col>
                        </Row>
                        <Row style={styles.row}>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Cliente</Text>
                            </Col>
                            <Col size={2} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{Cliente}</Text>
                            </Col>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Razón</Text>
                            </Col>
                            <Col size={6} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{Razon}</Text>
                            </Col>
                        </Row>
                        <Row style={styles.row}>
                            <Col size={3} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12 / PixelRatio.getFontScale()}]}>Fecha</Text>
                            </Col>
                            <Col size={4} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12 / PixelRatio.getFontScale()}]}>Cantidad (kg)</Text>
                            </Col>
                            <Col size={3} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12 / PixelRatio.getFontScale()}]}>$</Text>
                            </Col>
                            <Col size={2} style={[styles.bloqueAzul]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12 / PixelRatio.getFontScale()}]}>u$s</Text>
                            </Col>
                        </Row>
                        {Producto.Datos.map((Prod, key) => (
                            <Row key={key} style={styles.row}>
                                <Col size={3} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1}]}>
                                    <Text style={[styles.textoBloqueBlanco, { fontSize: 10 / PixelRatio.getFontScale() }]}>{Prod.Fecha}</Text>
                                </Col>
                                <Col size={4} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1, justifyContent: 'flex-end'}]}>
                                    <Text style={styles.textoBloqueBlanco}>{parseFloat(Prod.Cantidad).toFixed(2)}</Text>
                                </Col>
                                <Col size={3} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1}]}>
                                    <Text style={styles.textoBloqueBlanco}>{parseFloat(Prod.Precio).toFixed(2)}</Text>
                                </Col>
                                <Col size={2} style={styles.bloqueBlanco}>
                                    <Text style={styles.textoBloqueBlanco}>{parseFloat(Prod.PrecioUs).toFixed(2)}</Text>
                                </Col>
                            </Row>
                        ))}

                        <Row style={[styles.row, {marginTop: 20, marginBottom: 30}]}>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Total Kilos</Text>
                            </Col>
                            <Col size={4} style={styles.bloqueBlanco}>
                                <Text style={[styles.textoBloqueBlanco, {fontSize: 20}]}>{parseFloat(WCantidadTotal).toFixed(2)} Kgs</Text>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    row: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginHorizontal: 5
    },
    textoBloqueBlanco: {
        fontSize: 12 / PixelRatio.getFontScale(),
    },
    textoBloqueazul: {
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12 /PixelRatio.getFontScale()
    },
    bloqueAzul: {
        backgroundColor: Config.bgColorSecundario,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    },
    bloqueBlanco: {
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    }
});