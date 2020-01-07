import React from 'react';
import { View, Dimensions, StyleSheet, TouchableOpacity, PixelRatio, FlatList } from 'react-native';
import MenuHeaderButton from './MenuHeaderButton';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, List, ListItem, Spinner, Icon, Header, Item, Input, Picker } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import DatePicker from 'react-native-datepicker';
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

export default class ListadoPedidos extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <HeaderNav section="Hojas de Ruta" />,
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

        return Config.Consultar(`Pedidos/${global.idVendedor}/${this.state.date}`, (resp) => {
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

    handleOnPressDetalles = (HojaRuta, Pedido) => this.props.navigation.navigate('DetallesPedido', { HojaRuta: HojaRuta, Pedido: Pedido });

    RenderPedido = ({ Pedido, HojaRuta, Cliente, Razon, CantItems }) => (

        <Row key={Pedido} onPress={() => this.handleOnPressDetalles(HojaRuta, Pedido)} style={{ borderBottomColor: '#aaa', borderBottomWidth: 0.5 }} >
            <BloqueEncabezado
                size={2}
                content={
                    <LabelEncabezado texto={Pedido} customStyles={{ fontSize: 13  / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos} />
            <BloqueEncabezado
                size={2}
                content={
                    <LabelEncabezado texto={Cliente} customStyles={{ fontSize: 13  / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos} />
            <BloqueEncabezado
                size={6}
                content={
                    <LabelEncabezado texto={Razon} customStyles={{ fontSize: 13  / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos2} />
            <BloqueEncabezado
                size={2}
                content={
                    <LabelEncabezado texto={CantItems} customStyles={{ fontSize: 13  / PixelRatio.getFontScale(), color: '#000' }} />
                } style={styles.RenglonPedidos} />
        </Row>
    )

    RenderHojaRuta = ({ item }) => (
        // <ListItem key={item.Cliente} style={{ marginLeft: 0, paddingHorizontal: 5, borderBottomColor: '#aaa', borderBottomWidth: 2 }}>
        <Row style={{ marginLeft: 0, marginTop: 5, paddingHorizontal: 2, borderBottomColor: '#aaa', borderBottomWidth: 1 }}>
            <Col>
                <Row>
                    <BloqueEncabezado
                        size={4}
                        content={
                            <LabelEncabezado texto='Hoja de Ruta' />
                        } />
                    <BloqueEncabezado
                        size={4}
                        content={
                            <LabelEncabezado texto={item.HojaRuta} customStyles={{ fontSize: 20 / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={{ backgroundColor: '#fff' }} />
                    {/* <BloqueEncabezado
                        size={2}
                        content={
                            <LabelEncabezado texto='Fecha' />
                        } /> */}
                    <BloqueEncabezado
                        size={4}
                        content={
                            <LabelEncabezado texto={item.Fecha} customStyles={{ fontSize: 12  / PixelRatio.getFontScale() }} />
                        }/>
                </Row>
                <Row>
                    <BloqueEncabezado
                        size={2}
                        content={
                            <LabelEncabezado texto='Pedido' customStyles={{ fontSize: 13  / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={styles.EncabezadoPedidos} />
                    <BloqueEncabezado
                        size={2}
                        content={
                            <LabelEncabezado texto='Cliente' customStyles={{ fontSize: 13  / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={styles.EncabezadoPedidos} />
                    <BloqueEncabezado
                        size={6}
                        content={
                            <LabelEncabezado texto='Razón' customStyles={{ fontSize: 13  / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={styles.EncabezadoPedidos} />
                    <BloqueEncabezado
                        size={2}
                        content={
                            <LabelEncabezado texto='Cant. Items' customStyles={{ fontSize: 13  / PixelRatio.getFontScale(), color: '#000' }} />
                        } style={styles.EncabezadoPedidos} />
                </Row>
                {/* <Grid> */}
                    {_.sortBy(item.Datos, 'Razon').map(this.RenderPedido)}
                {/* </Grid> */}
            </Col>
        </Row>
        //</ListItem>
    )

    RenderVendedor = ({ item }) => (
        <View key={item.Vendedor}>
            <ListItem itemHeader key={item.Vendedor} style={{ backgroundColor: Config.bgColorSecundario, justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 20 / PixelRatio.getFontScale(), marginTop: 10 }}>{item.DesVendedor}</Text>
            </ListItem>
            <Grid>
                {/* <List
                    dataArray={item.Datos}
                    renderRow={this.RenderHojaRuta}>
                </List> */}
                <Col>
                    <FlatList
                        data={item.Datos}
                        renderItem={this.RenderHojaRuta}
                        keyExtractor={this._KeyExtractor}/>
                </Col>
            </Grid>
        </View>
    )

    handleOnPressDate = d => {
        if (d.toLocaleString() != this.state.date.toLocaleString()) {
            this.setState({ date: d }, this._ReGenerarItems)
        }
    }

    _KeyExtractor = () => Math.random().toString();

    render() {
        return (
            <Container>
                <Header searchBar rounded style={{ backgroundColor: Config.bgColorSecundario, borderTopColor: '#ccc', borderTopWidth: 1 }}>
                    {/* <Item style={{ flex: 2 }}>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" onChangeText={this._handleChangeTextFiltro} value={this.state.textFilter} />
                    </Item> */}
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', paddingLeft: 20, minWidth: 80 / PixelRatio.getFontScale() }}>
                        <Text style={{ color: '#fff' }}>Fecha:</Text>
                        <DatePicker
                            minDate={`${Math.min(...this.state.Anios.map(a => a.Anio))}-01-01`}
                            maxDate={moment().format('DD-MM-YYYY')}
                            onDateChange={this.handleOnPressDate}
                            //style={{ width: 130 / PixelRatio.getFontScale() }}
                            customStyles={{
                                dateText: { color: '#FFF' },
                                dateInput: { borderWidth: 0 }
                            }}
                            date={this.state.date}
                            mode="date"
                            format="DD-MM-YYYY" />
                    </View>
                </Header>
                <Content style={{ borderTopColor: '#ccc', borderTopWidth: 1 }}>
                    {this.state.refrescando ? <Spinner /> :
                        <FlatList
                            data={this.state.itemsFiltrados}
                            renderItem={this.RenderVendedor}
                            keyExtractor={this._KeyExtractor}/>}
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
        borderColor: '#bbb'
    },
    RenglonPedidos: {
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        // paddingVertical: 10
    },
    RenglonPedidos2: {
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingVertical: 10,
        justifyContent: 'flex-start'
    }
});