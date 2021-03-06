import React from "react";
import { View, Dimensions, PixelRatio, FlatList } from "react-native";
import MenuHeaderButton from "./MenuHeaderButton";
import HeaderNav from "./HeaderNav.js";
import {
  Container,
  Text,
  Content,
  List,
  ListItem,
  Spinner,
  Icon,
  Header,
  Item,
  Input,
  Picker
} from "native-base";
import Config from "../config/config.js";
import _ from "lodash";
import {
  responsiveFontSize,
  responsiveWidth
} from "react-native-responsive-dimensions";
import { Col, Grid, Row } from "react-native-easy-grid";

const RenderItem = ({ itemCliente, navigation, Anio }) => {
  return (
    <ListItem
      style={{ marginLeft: 0, paddingHorizontal: 0 }}
      key={itemCliente.Cliente}
      onPress={() => {
        navigation.navigate("DetallesVentasProductos", {
          Cliente: itemCliente.Cliente,
          Anio: Anio
        });
      }}
    >
        <Grid>
            <Col>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center'}}>
                    <Col size={2}>
                        <Text
                            style={{
                                fontSize: 10 / PixelRatio.getFontScale(),
                                fontStyle: "italic"
                            }}
                            >
                            ({itemCliente.Cliente})
                        </Text>
                    </Col>
                    
                    <Col size={8}>
                        <Row style={{ justifyContent: 'flex-start' }}>
                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontSize: 15
                                }}
                                >
                                {itemCliente.DesCliente}
                            </Text>
                        </Row>
                    </Col>
                    <Col size={2}>
                        <Text
                            style={{
                                fontSize: 10 / PixelRatio.getFontScale(),
                                fontStyle: "italic",
                                textAlign: "right",
                                paddingRight: 10
                            }}
                            >
                            {itemCliente.CantProductos} Prod.
                        </Text>
                    </Col>
                </Row>
            </Col>
        </Grid>
    </ListItem>
  );
};

const RenderVendedor = ({ item, navigation, AnioConsulta }) => {
  return (
    <View key={item.Vendedor}>
      <ListItem
        itemHeader
        key={item.Vendedor}
        style={{
          backgroundColor: Config.bgColorSecundario,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 25 / PixelRatio.getFontScale(),
            marginTop: 10
          }}
        >
          {item.DesVendedor.toString().toUpperCase()}
        </Text>
      </ListItem>
      {/* <List
        style={{ padding: 0 }}
        dataArray={item.Datos}
        renderRow={item => (
          <RenderItem
            itemCliente={item}
            Anio={AnioConsulta}
            navigation={navigation}
          />
        )}
      /> */}
      <FlatList
        data={item.Datos}
        renderItem={({ item, index }) => <RenderItem key={index} itemCliente={item} Anio={AnioConsulta} navigation={navigation} />}
        keyExtractor={() => Math.random().toString()}/>
    </View>
  );
};

export default class ListadoEstadisticas extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () =>  <HeaderNav section="Ventas" />,
      headerRight: () =>  <MenuHeaderButton navigation={navigation} />
    };
  };

  state = {
    datos: [],
    refrescando: true,
    ultimo: 0,
    urlConsulta: "",
    idVendedor: global.idVendedor,
    heightDevice: Dimensions.get("window").height,
    mostrarDatos: null,
    opacityValue: 0,
    AnioConsulta: new Date().getFullYear(),
    Anios: [],
    textFilter: "",
    itemsFiltrados: [],
    primeraVez: true
  };

  async componentDidMount() {
    this.ConsultarAniosPosibles();
    this._ReGenerarItems();
  }

  ConsultarAniosPosibles() {
    Config.Consultar("AniosFiltro/" + this.state.idVendedor, resp => {
      resp.then(res => res.json()).then(resJson => {
        this.setState({ Anios: resJson.resultados });
      });
    });
  }

  async _ReGenerarItems() {
    if (this.state.idVendedor <= 0) return;

    this.setState({ refrescando: true });

    return Config.Consultar(
      "Estadisticas/" + this.state.idVendedor + "/" + this.state.AnioConsulta,
      resp => {
        resp
          .then(response => response.json())
          .then(responseJson => {
            let _datos = [];

            const { error, resultados, ErrorMsg } = responseJson;

            if (error) console.log(ErrorMsg);

            if (resultados.length > 0) {
              _datos = resultados;
            }

            if (this.state.primeraVez) this.state.itemsFiltrados = _datos;

            this.setState({
              primeraVez: false,
              refrescando: false,
              datos: _datos
            });
          })
          .catch(error => console.error(error));
      }
    );
  }

  _KeyExtractor = () => Math.random().toString();

  _handlePickAnio(val) {
    if (val == this.state.AnioConsulta) return;

    this.setState(
      { AnioConsulta: val, textFilter: "", primeraVez: true },
      this._ReGenerarItems
    );
  }

  _handleChangeTextFiltro(val) {
    this.setState({ textFilter: val.trim() });
    let _itemsFiltrados = [];
    if (val.trim() == "") {
      _itemsFiltrados = this.state.datos;
    } else {
      const regex1 = new RegExp(val.toUpperCase());
      _.forEach(this.state.datos, vendedor => {
        let filtrados = _.filter(vendedor.Datos, Cliente => {
          return (
            regex1.test(Cliente.DesCliente.toUpperCase()) ||
            regex1.test(Cliente.Cliente.toUpperCase())
          );
        });

        if (filtrados.length > 0)
          _itemsFiltrados.push({
            Vendedor: vendedor.Vendedor,
            DesVendedor: vendedor.DesVendedor,
            Datos: filtrados
          });
      });
    }
    this.setState({ itemsFiltrados: _itemsFiltrados });
  }

  render() {
    return (
      <Container>
        <Header
          searchBar
          rounded
          style={{
            backgroundColor: Config.bgColorSecundario,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1
          }}
        >
          <Item style={{ width: responsiveWidth(60) }}>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              onChangeText={val => {
                this._handleChangeTextFiltro(val);
              }}
              value={this.state.textFilter}
            />
          </Item>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
              paddingLeft: 20,
              width: responsiveWidth(40)
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 / PixelRatio.getFontScale() }}>
              Periodo:
            </Text>
            <Picker
              iosHeader="Select one"
              mode="dropdown"
              selectedValue={this.state.AnioConsulta}
              // style={{ color: "#fff" }}
              style={{color: '#fff', width: 100, minHeight: 50, fontSize: 18 / PixelRatio.getFontScale() }}
              // onValueChange={this.onValueChange.bind(this)}
              onValueChange={val => this._handlePickAnio(val)}
            >
              {this.state.Anios.map(anio => {
                return (
                  <Picker.Item
                    key={anio.Anio}
                    label={anio.Anio}
                    value={anio.Anio}
                  />
                );
              })}
            </Picker>
          </View>
        </Header>
        <Content>
          {this.state.refrescando ? (
            <Spinner color={Config.bgColorTerciario} />
          ) : (
            // <List
            //   dataArray={this.state.itemsFiltrados}
            //   renderRow={item => (
            //     <RenderVendedor
            //       item={item}
            //       AnioConsulta={this.state.AnioConsulta}
            //       {...this.props}
            //     />
            //   )}
            // />
            <FlatList
              data={this.state.itemsFiltrados}
              renderItem={({item, index}) => <RenderVendedor key={index} item={item} AnioConsulta={this.state.AnioConsulta} {...this.props} />}
              keyExtractor={this._KeyExtractor}/>
          )}
        </Content>
      </Container>
    );
  }
}

// const styles = StyleSheet.create({
//     container: {
//         // backgroundColor: '#d6deeb'
//     }
// });
