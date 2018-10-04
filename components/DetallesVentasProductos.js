import React from 'react';
import { View, Dimensions, PixelRatio} from 'react-native';
import MenuHeaderButton from './MenuHeaderButton';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, List, ListItem, Spinner, Icon, Header, Item, Input } from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Config from '../config/config.js';
import _ from 'lodash';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const RenderProducto = ({producto, navigation}) => (
    <ListItem key={producto.Cliente} onPress={() => {navigation.navigate('DetallesPreciosVentasProductos', {Producto: producto})}}>
        <Grid>
            <Row key={producto.Cliente}>
                <Col size={3} style={{alignItems: 'flex-start', justifyContent: 'center'}}>
                    <View>
                        <Text style={{fontSize: 10 / PixelRatio.getFontScale(), fontStyle: 'italic', marginRight: 10}}>
                            ({producto.Producto})
                        </Text>
                    </View>
                </Col>
                <Col size={7} style={{alignItems: 'flex-start', justifyContent: 'center'}}>
                    <View style={{maxWidth: 230}}>
                        <Text style={{ fontSize: 20 / PixelRatio.getFontScale() }}>
                            {producto.Datos[0].DesTerminado}
                        </Text>
                    </View>
                </Col>
                <Col size={2} style={{alignItems: 'flex-end', justifyContent: 'center'}}>
                    <View>
                        <Text style={{fontSize: 10 / PixelRatio.getFontScale(), fontStyle: 'italic'}}>
                            {producto.Datos.reduce((total, d) => {
                               return total + d.Cantidad
                            },0)} Kg(s)
                        </Text>
                    </View>
                </Col>
            </Row>
        </Grid>
    </ListItem>
)

const RenderVentas = ({item: {Datos: [Cliente]}, navigation}) => (
    <View key={Cliente.Cliente}>
        <ListItem itemHeader key={Cliente.Cliente} style={{backgroundColor: Config.bgColorSecundario, justifyContent: 'center', alignItems: 'center'}}>
            <Grid>
                <Col>
                    <Text style={{color: '#fff', fontSize: 20 / PixelRatio.getFontScale(), marginTop: 10}}>{Cliente.DesCliente}</Text>
                </Col>
            </Grid>
        </ListItem>
        <List
            dataArray={Cliente.Datos}
            renderRow={(dato) => <RenderProducto producto={dato} navigation={navigation}/>}>
        </List>
    </View>
)

export default class DetallesVentasProductos extends React.PureComponent{
    
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
        idCliente: this.props.navigation.getParam('Cliente', ''),
        AnioConsulta: this.props.navigation.getParam('Anio', (new Date()).getFullYear()),
        Anios: [],
        textFilter: '',
        itemsFiltrados: [],
        primeraVez: true,
    }

    async componentDidMount(){
        //this.setState({idVendedor: this.props.navigation.getParam('idVendedor', -1)});
        // Obtenemos los años para el Picker.
        //this.ConsultarAniosPosibles();
        await this._ReGenerarItems();
        // this.setState(
        //     {
        //         refrescando: false,
        //         heightDevice: Dimensions.get('screen').height,
        //         itemsFiltrados: [],
        //         datos: []
        //     }
        // );
    }

    async _ReGenerarItems(){

        if (this.state.idVendedor <= 0) return;

        this.setState({refrescando: true});

        return Config.Consultar(`Estadisticas/Productos/${this.state.idVendedor}/${this.state.idCliente}/${this.state.AnioConsulta}`, (resp) => {
            resp.then(response => response.json())
                .then(responseJson => {

                    let _datos = [];

                    const {error, resultados, ErrorMsg} = responseJson;

                    if (error) console.log(ErrorMsg);

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
        });

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

        let itemsOriginales = this.state.datos;
        let _itemsFiltrados = [];
        if (val.trim() == ""){
            _itemsFiltrados = this.state.datos;
        }else{

            _.forEach(this.state.datos, (Productos) => {
                let exist = false;

                const regex1 = new RegExp(val.toUpperCase());
                let filtrados = _.filter(Productos.Datos, (Producto) => {
                    return regex1.test(Producto.Producto.toUpperCase()) || regex1.test(Producto.DesProducto.toUpperCase()) ;
                });

                if (filtrados.length > 0)
                    _itemsFiltrados.push({Cliente: Productos.Cliente, DesCliente: Productos.DesCliente, Datos: filtrados});

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

        return (
            <Container>
                <Header searchBar rounded  style={{backgroundColor: Config.bgColorSecundario, borderBottomColor: '#ccc', borderBottomWidth: 1}}>
                    <Item style={{flex: 2}}>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" onChangeText={(val) => {this._handleChangeTextFiltro(val)}} value={this.state.textFilter}/>
                    </Item>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', paddingLeft: 20, minWidth: 80}}>
                        {/* <Text style={{color: '#fff'}}>Periodo:</Text> */}
                        {/* <Picker
                        iosHeader="Select one"
                        mode="dropdown"
                        selectedValue={this.state.AnioConsulta}
                        style={{color: '#fff'}}
                        // onValueChange={this.onValueChange.bind(this)}
                        onValueChange={(val) => this._handlePickAnio(val)}
                        >
                        <Picker.Item key='2018' label='2018' value='2018' />
                        </Picker> */}
                    </View>
                </Header>
                <Content>
                <List
                        dataArray={this.state.itemsFiltrados}
                        renderRow={(item) => <RenderVentas item={item} {...this.props}/> }
                    >

                    </List>
                </Content>
            </Container>
        )
    }
}