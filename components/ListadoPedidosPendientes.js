import React from 'react';
import { View, Dimensions, StyleSheet, PixelRatio } from 'react-native';
import MenuHeaderButton from './MenuHeaderButton';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, List, ListItem, Spinner } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import Config from '../config/config.js';
import _ from 'lodash';
import moment from 'moment';

const LabelEncabezado = ({ texto, customStyles }) => (
    <Text style={[{ color: '#fff', fontSize: 14 / PixelRatio.getFontScale(), fontStyle: 'italic' }, customStyles]}>

        {texto}

    </Text>
)

const BloqueEncabezado = ({ content, size, style }) => (
    <Col size={size} style={[{ backgroundColor: Config.bgColorSecundario, justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 10 }, style]}>
        {content}
    </Col>
)

export default class ListadoPedidosPendientes extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <HeaderNav section="Pendientes" />,
            headerRight: <MenuHeaderButton navigation={navigation} />
        };
    };

    state = {
        datos: [],
        refrescando: true,
        ultimo: 0,
        urlConsulta: '',
        idVendedor: global.idVendedor,
        heightDevice: Dimensions.get('screen').height,
        mostrarDatos: null,
        opacityValue: 0,
        AnioConsulta: moment().format('YYYY'),
        Anios: [],
        textFilter: '',
        itemsFiltrados: [],
        primeraVez: true,
        date: moment().format('DD-MM-YYYY')
    }

    async componentDidMount() {
        this.ConsultarAniosPosibles();
        this._ReGenerarItems();
        this.setState({ heightDevice: Dimensions.get('screen').height });
    }

    ConsultarAniosPosibles() {
        Config.Consultar('AniosFiltro/Pedidos/' + global.idVendedor, (resp) => {
            resp.then((res) => res.json())
                .then((resJson) => {
                    this.setState({ Anios: resJson.resultados });
                })
                .catch(err => console.log(err));
        });
    }

    async _ReGenerarItems() {

        if (this.state.idVendedor <= 0) return;

        this.setState({ refrescando: true, primeraVez: true });

        return Config.Consultar(`Pedidos/Pendientes/${global.idVendedor}`, (resp) => {
            resp.then(response => response.json())
                .then(responseJson => {

                    let _datos = [];

                    const { error, resultados } = responseJson;

                    if (resultados.length > 0) {
                        _datos = resultados;
                    }

                    if (this.state.primeraVez)
                        this.state.itemsFiltrados = _datos;

                    this.setState({
                        primeraVez: false,
                        refrescando: false,
                        datos: _datos
                    });

                })
                .catch((error) => console.error(error));
        })
    }

    _handlePickAnio = (val) => {
        this.setState({ AnioConsulta: val, textFilter: '', primeraVez: true }, this._ReGenerarItems);
    }

    _handleChangeTextFiltro = (val) => {
        this.setState({ textFilter: val.trim() });

        let _itemsFiltrados = [];
        if (val.trim() == "") {
            _itemsFiltrados = this.state.datos;
        } else {
            const regex1 = new RegExp(val.toUpperCase());
            _.forEach(this.state.datos, (vendedor) => {
                let filtrados = _.filter(vendedor.Datos, (Cliente) => {
                    return regex1.test(Cliente.Razon.toUpperCase()) || regex1.test(Cliente.Cliente.toUpperCase());
                });
                if (filtrados.length > 0)
                    _itemsFiltrados.push({ Vendedor: vendedor.Vendedor, DesVendedor: vendedor.DesVendedor, Datos: filtrados });
            });
        }
        this.setState({ itemsFiltrados: _itemsFiltrados });
    }

    handleOnPressDetalles = (Pedido) => this.props.navigation.navigate('DetallesPedidoPendiente', { Pedido: Pedido });

    RenderPedido = ({ Pedido, Fecha, Cliente, Razon, Productos }) => (

        <Row key={Pedido} onPress={() => this.handleOnPressDetalles(Pedido)} style={{ alignItems: 'center', borderBottomColor: '#aaa', borderBottomWidth: 0.5 }} >
            <BloqueEncabezado
                size={2}
                content={
                    <LabelEncabezado texto={Pedido} customStyles={{ fontSize: 11  / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos} />
            <BloqueEncabezado
                size={2}
                content={
                    <LabelEncabezado texto={Fecha} customStyles={{ fontSize: 11  / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos2} />
            <BloqueEncabezado
                size={6}
                content={
                    <LabelEncabezado texto={`( ${Cliente} )  ${Razon}`} customStyles={{ fontSize: 12  / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos2} />
            <BloqueEncabezado
                size={1}
                content={
                    <LabelEncabezado texto={Productos.length} customStyles={{ fontSize: 11  / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos} />
        </Row>
    )

    RenderVendedor = item => (
        <View key={item.Vendedor}>
            <ListItem itemHeader key={item.Vendedor} style={{ backgroundColor: Config.bgColorSecundario, justifyContent: 'center', borderBottomColor: '#ccc', borderBottomWidth: 0.5 }}>
                <Text style={{ color: '#fff', fontSize: 20 / PixelRatio.getFontScale(), marginTop: 10 }}>{item.DescVendedor}</Text>
            </ListItem>
            <Grid>
                <Col>
                    <Row style={{ borderBottomColor: '#aaa', borderBottomWidth: 0.5 }} >
                        <BloqueEncabezado
                            size={2}
                            content={
                                <LabelEncabezado texto='Pedido' customStyles={{ fontSize: 12  / PixelRatio.getFontScale(), color: '#000' }} />
                            } style={styles.EncabezadoPedidos} />
                        <BloqueEncabezado
                            size={2}
                            content={
                                <LabelEncabezado texto='Fecha' customStyles={{ fontSize: 11  / PixelRatio.getFontScale(), color: '#000' }} />
                            } style={styles.EncabezadoPedidos} />
                        <BloqueEncabezado
                            size={6}
                            content={
                                <LabelEncabezado texto='Cliente' customStyles={{ fontSize: 12  / PixelRatio.getFontScale(), color: '#000' }} />
                            } style={styles.EncabezadoPedidos} />
                        <BloqueEncabezado
                            size={1}
                            content={
                                <LabelEncabezado texto='Items' customStyles={{ fontSize: 11  / PixelRatio.getFontScale(), color: '#000' }} />
                            } style={styles.EncabezadoPedidos} />
                    </Row>
                    <Row>
                        <List
                            dataArray={item.Datos}
                            renderRow={this.RenderPedido}>
                        </List>
                    </Row>
                </Col>
            </Grid>
        </View>
    )

    handleOnPressDate = d => {
        if (d.toLocaleString() != this.state.date.toLocaleString()) {
            this.setState({ date: d }, this._ReGenerarItems)
        }
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#fff' }}>
                <Content style={{ borderTopColor: '#ccc', borderTopWidth: 1 }}>
                    {
                        this.state.refrescando ? <Spinner /> :
                        <List
                            dataArray={this.state.itemsFiltrados}
                            renderRow={this.RenderVendedor}
                        />
                    }
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    EncabezadoPedidos: {
        backgroundColor: '#ddd',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#bbb',
        alignItems: 'center'
    },
    RenglonPedidos: {
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        paddingVertical: 10,
        alignItems: 'flex-end'
    },
    RenglonPedidos2: {
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        paddingVertical: 5,
        justifyContent: 'flex-start'
    }
});