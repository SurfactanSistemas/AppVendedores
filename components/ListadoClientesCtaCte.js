import React from 'react';
import { View, FlatList, Dimensions, PixelRatio} from 'react-native';
import MenuHeaderButton from './MenuHeaderButton';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, List, ListItem, Spinner, Icon, Header, Item, Input, Picker } from 'native-base';
import Config from '../config/config.js';
import _ from 'lodash';
import { Grid, Col, Row } from 'react-native-easy-grid';

export default class ListadoClientesCtaCte extends React.Component{
    
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: () =>  <HeaderNav section="Cuentas Corrientes" />,
            headerRight: () =>  <MenuHeaderButton navigation={navigation} />
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
        moneda: 1,
    }

    componentDidMount(){
        this._ReGenerarItems();
        this.setState({refrescando: false, heightDevice: Dimensions.get('screen').height});
    }

    ConsultarAniosPosibles(){
        Config.Consultar('AniosFiltro/' + this.state.idVendedor, (resp) => {
            resp.then((res) => res.json())
                .then((resJson) => {
                    this.setState({Anios: resJson.resultados});
                });
        });
    }

    _ReGenerarItems(){

        if (this.state.idVendedor <= 0) return;

        this.setState({refrescando: true});

        return Config.Consultar(`CtasCtes/${this.state.idVendedor}` , (resp) => {
            resp.then((response) => response.json())
                .then((responseJson) => {
                    let _datos = [];

                    const {error, resultados} = responseJson;

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

    _KeyExtractor = () => Math.random().toString();

    _handlePickAnio(val){
        this.setState({AnioConsulta: val, textFilter: '', primeraVez: true}, this._ReGenerarItems);
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
                    return regex1.test(Cliente.DesCliente.toUpperCase()) || regex1.test(Cliente.Cliente.toUpperCase()) ;
                });
                if (filtrados.length > 0)
                    _itemsFiltrados.push({Vendedor: vendedor.Vendedor, DesVendedor: vendedor.DesVendedor, Datos: filtrados});
            });
        }

        this.setState({itemsFiltrados: _itemsFiltrados});
    }

    RenderCliente = ({ item }) => {
        return (
             <ListItem key={item.Cliente}>
                <Grid>
                        <Row style={{ }}  onPress={() => {this.props.navigation.navigate('DetallesCtaCteCliente', {Cliente: item.Cliente, Moneda: this.state.moneda})}}>
                            <Col size={2} style={{ justifyContent: 'center' }}>
                                <Text style={{fontSize: 10 / PixelRatio.getFontScale(), fontStyle: 'italic'}}>
                                    ({item.Cliente})
                                </Text>
                            </Col>
                            <Col size={7} style={{ justifyContent: 'center' }}>
                                <Row>
                                    <Text style={{maxWidth: 200, fontSize: 12 / PixelRatio.getFontScale()}}>
                                        {item.Razon.toString().padEnd(30, ' ').substring(0, 30).trim()}
                                    </Text>
                                </Row>
                            </Col>
                            <Col size={3} style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12 / PixelRatio.getFontScale(), fontStyle: 'italic', fontWeight: 'bold', color: item.Total > 0 ? 'red' : 'green' }}>

                                    {this.state.moneda > 1 ? `${item.TotalUs.toFixed(2)} U$S` : `${item.Total.toFixed(2)} $`}

                                </Text>
                            </Col>
                        </Row>
                </Grid>
                 {/* <View key={item.Cliente} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                     <View style={{flexDirection: 'row'}}>
                     </View>
                     
                 </View> */}
             </ListItem>
        ) 
     }

    RenderClientes = ({ item }) => {
        return (
            <View key={item.Vendedor}>
                <ListItem itemHeader key={item.Vendedor} style={{backgroundColor: Config.bgColorSecundario, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: 20 / PixelRatio.getFontScale(), marginTop: 10}}>{item.DesVendedor.toString().trim()}</Text>
                </ListItem>
                <FlatList
                    data={item.Datos}
                    extraData={this.state}
                    renderItem={this.RenderCliente}
                    keyExtractor={this._KeyExtractor}/>
            </View>
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
                                    style={{color: '#fff', width: 20 }}
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
                <Content>
                    {
                        this.state.refrescando ? <Spinner color={Config.bgColorTerciario}/> : 
                        <FlatList
                            data={this.state.itemsFiltrados}
                            extraData={this.state}
                            renderItem={this.RenderClientes}
                            keyExtractor={this._KeyExtractor}/>
                    }
                </Content>
            </Container>
        )
    }
}

// const styles = StyleSheet.create({
//     container: {
//         // backgroundColor: '#d6deeb'
//     }
// });