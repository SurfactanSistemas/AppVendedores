import React from 'react';
import {StyleSheet, View, Dimensions, PixelRatio} from 'react-native';
import MenuHeaderButton from './MenuHeaderButton';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, Spinner, Icon, Header, Item, Input, Picker } from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Config from '../config/config.js';
import _ from 'lodash';

export default class DetallesCtaCteCliente extends React.PureComponent{
    
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: () =>  <HeaderNav />,
            headerRight: () =>  <MenuHeaderButton navigation={navigation} />
        };
    };

    state = {
        datos: [],
        refrescando : true,
        ultimo: 0,
        urlConsulta: '',
        idVendedor: global.idVendedor,
        Cliente: this.props.navigation.getParam('Cliente', -1),
        heightDevice: Dimensions.get('screen').height,
        mostrarDatos: null,
        opacityValue: 0,
        AnioConsulta: (new Date()).getFullYear(),
        Anios: [],
        textFilter: '',
        itemsFiltrados: [],
        DesCliente: '',
        Productos: [],
        ProductosFiltrados: [],
        primeraVez: true,
        moneda: this.props.navigation.getParam('Moneda', 1),
    }

    componentDidMount(){
        this.setState(
            {
                refrescando: true
            },
            this._ReGenerarItems()
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

    _ReGenerarItems(){

        if (this.state.idVendedor <= 0) return;

        Config.Consultar(`CtasCtes/${this.state.idVendedor}/${this.state.Cliente}`, (resp) => {
            resp.then((response) => response.json())
                .then((responseJson) => {
                    let _datos = [];

                    const {error, resultados} = responseJson;

                    if (resultados.length > 0) {
                        _datos = resultados;
                    }

                    if (this.state.primeraVez && _datos.length > 0){
                        
                        this.setState({
                            itemsFiltrados: _datos,
                            DesCliente: _datos[0].DesCliente,
                            Productos: _datos[0].Datos,
                            ProductosFiltrados: _datos[0].Datos,
                        });
                    }

                    this.setState({
                        primeraVez: false,
                        refrescando: false,
                        datos: _datos
                    });

                })
                .catch((error) => console.error(error));
        });

        this.setState({refrescando: false});
    }

    _handleChangeTextFiltro(val){
        this.setState({textFilter: val.trim()});

        let _Productos = [];
        if (val.trim() == ""){
            _Productos = this.state.Productos;
        }else{
            const regex1 = new RegExp(val.toUpperCase());
            let filtrados = _.filter(this.state.Productos, (Producto) => {
                return regex1.test(Producto.Terminado.toUpperCase()) || regex1.test(Producto.DesTerminado.toUpperCase()) ;
            });

            _Productos = filtrados;
        }

        this.setState({ProductosFiltrados: _Productos});
    }

    RenderProducto = (Prod, key) => {
        return (
            <Row key={key} style={styles.row}>
                <Col size={2} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1}]}>
                    <Row>
                        <Text style={[styles.textoBloqueBlanco,{fontSize: 10 / PixelRatio.getFontScale()}]}>{Prod.Impre} </Text>
                        <Text style={[styles.textoBloqueBlanco,{fontSize: 10 / PixelRatio.getFontScale()}]}>{Prod.Numero.toString().padStart(6, '0')}</Text>
                    </Row>
                </Col>
                <Col size={3} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1, alignItems: 'center'}]}>
                    <View>
                        <Text style={[styles.textoBloqueBlanco, {paddingLeft: 5}]}>{Prod.Fecha}</Text>
                    </View>
                </Col>
                <Col size={1} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1, alignItems: 'center'}]}>
                    <View>
                        <Text style={styles.textoBloqueBlanco}>{`${Prod.Paridad.toFixed(2)}`}</Text>
                    </View>
                </Col>
                <Col size={3} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1, alignItems: 'flex-end', paddingEnd: 5}]}>
                    <View>
                        <Text style={styles.textoBloqueBlanco}>{this.state.moneda > 1 ? `${Prod.TotalUs.toFixed(2)} U$S` : `${Prod.Total.toFixed(2)} $`}</Text>
                    </View>
                </Col>
                <Col size={3} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1, alignItems: 'flex-end', paddingEnd: 5}]}>
                    <View>
                        <Text style={styles.textoBloqueBlanco}>{this.state.moneda > 1 ? `${Prod.SaldoUs.toFixed(2)} U$S` : `${Prod.Saldo.toFixed(2)} $`}</Text>
                    </View>
                </Col>
            </Row>
        )
    }

    render(){
        return (
            <Container>
                <Header searchBar rounded  style={{backgroundColor: Config.bgColorSecundario}}>
                <Grid>
                        <Col>
                            <Item style={{flex: 2}}>
                                <Icon name="ios-search" />
                                <Input placeholder="Search" onChangeText={(val) => {this._handleChangeTextFiltro(val)}} value={this.state.textFilter}/>
                            </Item>
                        </Col>
                        <Col>
                            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', paddingLeft: 20, minWidth: 80}}>
                                <Text style={{color: '#fff', fontSize: 12 / PixelRatio.getFontScale() }}>Periodo:</Text>
                                <Picker
                                iosHeader="Select one"
                                mode="dropdown"
                                selectedValue={this.state.moneda}
                                style={{color: '#fff' }}
                                // onValueChange={this.onValueChange.bind(this)}
                                onValueChange={(e) => this.setState({moneda: e})}
                                >
                                    <Picker.Item key={'$'} label={' $ '} value={1} />
                                    <Picker.Item key={'U$S'} label={'U$S'} value={2} />
                                </Picker>
                            </View>
                        </Col>
                    </Grid>
                </Header>
                <Content style={styles.container}>
                {this.state.refrescando ? <Spinner color={Config.bgColorTerciario}/> : 
                    <Grid>
                        <Row style={[styles.row, {marginTop: 30}]}>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Cliente</Text>
                            </Col>
                            <Col size={2} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{this.state.Cliente}</Text>
                            </Col>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Razón</Text>
                            </Col>
                            <Col size={6} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{this.state.DesCliente}</Text>
                            </Col>
                        </Row>
                        <Row style={styles.row}>
                            <Col size={2} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Row>
                                    <Text style={[styles.textoBloqueazul, {fontSize: 10 / PixelRatio.getFontScale()}]}>Comprob.</Text>
                                </Row>
                            </Col>
                            <Col size={3} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12 / PixelRatio.getFontScale()}]}>Fecha</Text>
                            </Col>
                            <Col size={1} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12 / PixelRatio.getFontScale()}]}>Par.</Text>
                            </Col>
                            <Col size={3} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12 / PixelRatio.getFontScale()}]}>Total</Text>
                            </Col>
                            <Col size={3} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12 / PixelRatio.getFontScale()}]}>Saldo</Text>
                            </Col>
                        </Row>
                        {this.state.ProductosFiltrados.map(this.RenderProducto)}
                    </Grid>
                    }
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
        fontSize: 11 / PixelRatio.getFontScale(),
    },
    textoBloqueazul: {
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12 / PixelRatio.getFontScale()
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