import React from 'react';
import { View, Dimensions, StyleSheet, PixelRatio, FlatList } from 'react-native';
import MenuHeaderButton from './MenuHeaderButton';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, List, Spinner, Header } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import Config from '../config/config.js';
import _ from 'lodash';
import moment from 'moment';

const LabelEncabezado = ({ texto, customStyles }) => (
    <Text style={[{ color: '#fff', fontSize: 12 / PixelRatio.getFontScale(), fontStyle: 'italic' }, customStyles]}>

        {`${texto.toString().padEnd(25, ' ').slice(0, 26).trim()}`}

    </Text>
)

const BloqueEncabezado = ({ content, size, style }) => (
    <Col size={size} style={[{ backgroundColor: Config.bgColorSecundario, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 15, paddingVertical: 10 }, style]}>
        {content}
    </Col>
)

export default class DetallePedidoPendiente extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <HeaderNav section="Detalle" />,
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
        date: moment().format('DD-MM-YYYY'),
        pedido: this.props.navigation.getParam('Pedido', -1),
        hojaRuta: this.props.navigation.getParam('HojaRuta', -1)
    }

    async componentDidMount() {
        //this.ConsultarAniosPosibles();
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
        
        return Config.Consultar(`Pedidos/Pendientes/Detalles/${this.state.pedido}`, (resp) => {
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

    handleOnPressDetalles = (parameters) => this.props.navigation.navigate('Detalles', parameters);

    RenderPedido = ({ Producto, DescProducto, Cantidad, Facturado }) => (

        <Row key={Producto}>
            <BloqueEncabezado
                size={3}
                content={
                    <LabelEncabezado texto={Producto} customStyles={{ fontSize: 10 / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos} />
            <BloqueEncabezado
                size={3}
                content={
                    <LabelEncabezado texto={DescProducto} customStyles={{ fontSize: 8 / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos2} />
            <BloqueEncabezado
                size={2}
                content={
                    <LabelEncabezado texto={parseFloat(Cantidad).toFixed(2)} customStyles={{ fontSize: 9 / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos} />
            <BloqueEncabezado
                size={2}
                content={
                    <LabelEncabezado texto={parseFloat(Facturado).toFixed(2)} customStyles={{ fontSize: 9 / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos} />
            <BloqueEncabezado
                size={2}
                content={
                    <LabelEncabezado texto={parseFloat(Cantidad - Facturado).toFixed(2)} customStyles={{ fontSize: 9 / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos} />
        </Row>
    )

    RenderDetalles = ({ item: { Pedido, Fecha, Cliente, Razon, Productos, FechaEntrega, Autorizado } }) => (
        <Grid>
            <Col>
                <Row style={{borderBottomColor: '#eee', borderBottomWidth: 1}}>
                    <BloqueEncabezado
                        size={2}
                        content={
                            <LabelEncabezado texto='Nro'/>
                        } style={{ alignItems: 'center' }} />
                    <BloqueEncabezado
                        size={2}
                        content={
                            <LabelEncabezado texto={Pedido} customStyles={{ fontSize: 12 / PixelRatio.getFontScale(), color: Autorizado === 'N' ? '#fff' : '#000' }} />
                        } style={{ backgroundColor: Autorizado === 'N' ? 'red' : '#fff' }} />
                    <BloqueEncabezado
                        size={2}
                        content={
                            <LabelEncabezado texto='Fecha' />
                        } style={{ alignItems: 'center' }} />    
                    <BloqueEncabezado
                        size={2}
                        content={
                            <LabelEncabezado texto={Fecha} customStyles={{ fontSize: 10 / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={{ backgroundColor: '#fff' }} />
                </Row>
                <Row>
                    <BloqueEncabezado
                        size={1}
                        content={
                            <LabelEncabezado texto='Clte' customStyles={{ fontSize: 10 / PixelRatio.getFontScale() }} />
                        } style={{ alignItems: 'center' }} />
                    <BloqueEncabezado
                        size={7}
                        content={
                            <LabelEncabezado texto={`${Cliente}  ${Razon}`} customStyles={{ fontSize: 9 / PixelRatio.getFontScale(), color: '#000', fontWeight: 'bold' }} />
                        }  style={{ backgroundColor: '#fff', alignItems: 'flex-start' }}  />
                    <BloqueEncabezado
                        size={1}
                        content={
                            <LabelEncabezado texto='Ent.' customStyles={{ fontSize: 10 / PixelRatio.getFontScale() }} />
                        } style={{ alignItems: 'center' }} />
                    <BloqueEncabezado
                        size={3}
                        content={
                            <LabelEncabezado texto={FechaEntrega} customStyles={{ fontSize: 9 / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={{ backgroundColor: '#fff' }} />
                </Row>
                <Row style={{marginTop: 5}}>
                    <BloqueEncabezado
                        size={3}
                        content={
                            <LabelEncabezado texto='Producto' customStyles={{ fontSize: 10 / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={styles.EncabezadoPedidos} />
                    <BloqueEncabezado
                        size={3}
                        content={
                            <LabelEncabezado texto='Descripción' customStyles={{ fontSize: 10 / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={styles.EncabezadoPedidos} />
                    <BloqueEncabezado
                        size={2}
                        content={
                            <LabelEncabezado texto='Cant.' customStyles={{ fontSize: 11 / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={styles.EncabezadoPedidos} />
                    <BloqueEncabezado
                        size={2}
                        content={
                            <LabelEncabezado texto='Fact.' customStyles={{ fontSize: 11 / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={styles.EncabezadoPedidos} />
                    <BloqueEncabezado
                        size={2}
                        content={
                            <LabelEncabezado texto='Saldo' customStyles={{ fontSize: 10 / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={styles.EncabezadoPedidos} />
                </Row>
                <Grid>
                    {_.sortBy(Productos, 'DescProducto').map(this.RenderPedido)}
                </Grid>
            </Col>
        </Grid>
    )
    
    _KeyExtractor = () => Math.random().toString();
    
    render() {
        return (
            <Container>
                <Header searchBar rounded style={{ backgroundColor: Config.bgColorSecundario, borderTopColor: '#ccc', borderTopWidth: 1 }}>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 20, minWidth: 80 }}>
                        <Text style={{ fontSize: 14 / PixelRatio.getFontScale(), color: '#fff' }}>
                            Detalles de Pedido Pendiente.
                        </Text>
                    </View>
                </Header>
                <Content style={{ borderTopColor: '#ccc', borderTopWidth: 1 }}>
                    {this.state.refrescando ? <Spinner /> :
                        // <List
                        //     dataArray={this.state.itemsFiltrados}
                        //     renderRow={this.RenderDetalles}
                        // /> 
                        <FlatList
                            data={this.state.itemsFiltrados}
                            renderItem={this.RenderDetalles}
                            keyExtractor={this._KeyExtractor}/>
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
        borderBottomWidth: 1,
        borderColor: '#bbb',
        alignItems: 'center'
    },
    RenglonPedidos: {
        backgroundColor: '#fff',
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingVertical: 10, 
    },
    RenglonPedidos2: {
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingVertical: 10,
        alignItems: 'flex-start' 
    }
});