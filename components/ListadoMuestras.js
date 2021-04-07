import React from 'react';
import { View, Dimensions, PixelRatio, FlatList} from 'react-native';
import MenuHeaderButton from './MenuHeaderButton';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, List, ListItem, Spinner, Icon, Header, Item, Input, Picker } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import Config from '../config/config.js';
import _ from 'lodash';

export default class ListadoMuestras extends React.Component{
    
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: () =>  <HeaderNav section="Muestras"/>,
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
    }

    async componentDidMount(){
        //this.setState({idVendedor: this.props.navigation.getParam('idVendedor', -1)});
        // Obtenemos los años para el Picker.
        this.setState({heightDevice: Dimensions.get('screen').height});
        await this.ConsultarAniosPosibles();
        await this._ReGenerarItems();
    }

    ConsultarAniosPosibles(){
        Config.Consultar('AniosFiltro/' + global.idVendedor, (resp) => {
            resp.then((res) => res.json())
                .then((resJson) => {
                    this.setState({Anios: resJson.resultados});
                })
                .catch(err => console.log(err));
        });
    }

    ConsultarUrlConsulta() {
        return fetch('https://raw.githubusercontent.com/fergthh/surfac/master/muestrasDBURL.json')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({urlConsulta: responseJson[0].url + '/todas/' + this.state.idVendedor});
                    })
    }

    async _ReGenerarItems(){

        if (this.state.idVendedor <= 0) return;

        this.setState({refrescando: true});

        return Config.Consultar('Muestras/' + global.idVendedor + '/' + this.state.AnioConsulta, (resp) => {
            resp.then(response => response.json())
                .then(responseJson => {

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
        })
    }

    _KeyExtractor = (item, index) => index.toString();

    _handlePickAnio = (val) => {
        if (val != this.state.AnioConsulta) this.setState({AnioConsulta: val, textFilter: '', primeraVez: true}, this._ReGenerarItems);
    }

    _handleChangeTextFiltro = (val) => {
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

    handleOnPressDetalles = (parameters) => this.props.navigation.navigate('Detalles', parameters); 

    RenderCliente = ({ item: itemCliente }) => {
        return (
            <ListItem key={Math.random()} onPress={() => this.handleOnPressDetalles({Cliente: itemCliente})}>
                <View key={Math.random()} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 10 / PixelRatio.getFontScale(), fontStyle: 'italic'}}>
                            ({itemCliente.Cliente})
                        </Text>
                        <Text style={{marginLeft: 10, maxWidth: 220, fontSize: 13 / PixelRatio.getFontScale() }}>
                            {itemCliente.Razon.toString().padEnd(20, ' ').slice(0, 22).trim()}
                        </Text>
                    </View>
                    
                    <Text style={{fontSize: 10 / PixelRatio.getFontScale(), fontStyle: 'italic'}}>

                        {itemCliente.Datos.length} Ped(s)

                    </Text>
                </View>
            </ListItem>
        ); 
    }

    RenderVendedor = ({ item }) => (
        <View key={item.Vendedor}>
            <ListItem itemHeader key={item.Vendedor} style={{backgroundColor: Config.bgColorSecundario, justifyContent: 'center'}}>
                <Text style={{color: '#fff', fontSize: 18 / PixelRatio.getFontScale(), marginTop: 10}}>{item.DesVendedor}</Text>
            </ListItem>
            <FlatList
                data={item.Datos}
                renderItem={this.RenderCliente}
                keyExtractor={this._KeyExtractor}/>
            {/* <List
                dataArray={item.Datos}
                renderRow={this.RenderCliente}>
            </List> */}
        </View>
    )

    render(){
        return (
            <Container>
                <Header searchBar rounded  style={{backgroundColor: Config.bgColorSecundario, borderBottomColor: '#ccc', borderBottomWidth: 1}}>
                    <Grid>
                        <Col>
                            <Item style={{ marginVertical: 2 }}>
                                <Icon name="ios-search" />
                                <Input placeholder="Search" onChangeText={this._handleChangeTextFiltro} value={this.state.textFilter}/>
                            </Item>
                        </Col>
                        <Col>
                            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', paddingLeft: 20, minWidth: 100}}>
                                <Text style={{color: '#fff', fontSize: 18 / PixelRatio.getFontScale() }}>Periodo:</Text>
                                <Picker
                                iosHeader="SELECCIONE"
                                mode="dropdown"
                                selectedValue={this.state.AnioConsulta}
                                // style={{color: '#fff' }}
                                style={{color: '#fff', width: 100, minHeight: 50, fontSize: 18 / PixelRatio.getFontScale() }}
                                // onValueChange={this.onValueChange.bind(this)}
                                onValueChange={this._handlePickAnio}
                                >
                                    {this.state.Anios.map(anio => <Picker.Item key={anio.Anio} label={anio.Anio} value={anio.Anio} /> )}
                                </Picker>
                            </View>
                        </Col>
                    </Grid>
                </Header>
                <Content>
                    {this.state.refrescando ? <Spinner/> : 
                    <FlatList
                        data={this.state.itemsFiltrados}
                        renderItem={this.RenderVendedor}
                        keyExtractor={this._KeyExtractor}/>}
                    {/* // <List
                    //     dataArray={this.state.itemsFiltrados}
                    //     renderRow={this.RenderVendedor}
                    // >

                    // </List>} */}
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