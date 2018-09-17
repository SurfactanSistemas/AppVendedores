import React from "react";
import { View, ScrollView, PixelRatio } from "react-native";
import HeaderNav from "./HeaderNav.js";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Text, Button, Spinner } from "native-base";
import Config from "../config/config";
import {
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

export default class Menu extends React.PureComponent {
  static navigationOptions = {
    headerTitle: <HeaderNav section="MENÚ" />
  };

  constructor(props) {
    super(props);
    this.state = {
      Observaciones: "",
      loading: false,
      idVendedor: global.idVendedor
    };
    this.Limite = 12;

    this.Items = [
      {
        Texto: "Consulta de Pedidos Pendientes",
        Ruta: "PedidosPendientes"
      },
      {
        Texto: "Consulta de Hojas de Ruta",
        Ruta: "Pedidos"
      },
      {
        Texto: "Muestras a Clientes",
        Ruta: "Listado"
      },
      {
        Texto: "Consulta de Ventas",
        Ruta: "Estadisticas"
      },
      {
        Texto: "Precios por Cliente",
        Ruta: "Precios"
      },
      {
        Texto: "Cerrar Sesión",
        Ruta: "Home"
      }
    ];
  }

  componentDidMount() {}

  GenerarItem(item, index) {
    return (
      <Row
        key={index}
        size={1}
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 15
        }}
      >
        <Button
          block
          onPress={() => {
            this.props.navigation.navigate(item.Ruta);
          }}
          style={{ flex: 1, maxWidth: responsiveWidth(90), marginVertical: 5 }}
        >
          <Text
            style={{
              flex: 1,
              color: "#fff",
              textAlign: "center",
              fontSize: 13 / PixelRatio.getFontScale()
            }}
          >
            {item.Texto}
          </Text>
        </Button>
      </Row>
    );
  }
  handleOnPress() {}

  goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    if (this.state.loading)
      return (
        <View>
          <Spinner />
        </View>
      );

    return (
      <ScrollView
        style={{ backgroundColor: Config.bgColorSecundario }}
      >
        <Grid style={{ marginTop: 20, justifyContent: 'center' }}>
            <Col style={{ maxWidth: responsiveWidth(90) }}>
                {this.Items.map((item, index) => {
                    return this.GenerarItem(item, index);
                })}
                <Row size={12 - this.Items.length} />
            </Col>
        </Grid>
      </ScrollView>
    );
  }
}
