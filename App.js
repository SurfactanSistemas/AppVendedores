import {createStackNavigator} from 'react-navigation-stack';
import ListadoMuestras from './components/ListadoMuestras.js';
import ListadoEstadisticas from './components/ListadoEstadisticas';
import ListadoPedidos from './components/ListadoPedidos';
import ListadoPedidosPendientes from './components/ListadoPedidosPendientes';
import ListadoPrecios from './components/ListadoPrecios';
import DetallesPedidoMuestras from './components/DetallesPedidoMuestras.js';
import DetallesPedido from './components/DetallePedido.js';
import DetallesPedidoPendiente from './components/DetallePedidoPendiente.js';
import DetallesVentasProductos from './components/DetallesVentasProductos';
import DetallesPreciosPorCliente from './components/DetallesPreciosPorCliente';
import DetallesPreciosVentasProductos from './components/DetallesPreciosVentasProductos';
import Observacion from './components/Observacion';
import Login from './components/Login';
import Menu from './components/Menu';

import './config/globals.js';
import { createAppContainer } from 'react-navigation';

import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

const stack = createStackNavigator({
  Home: Login,
  Listado: ListadoMuestras,
  Estadisticas: ListadoEstadisticas,
  Precios: ListadoPrecios,
  Pedidos: ListadoPedidos,
  PedidosPendientes: ListadoPedidosPendientes,
  Detalles: DetallesPedidoMuestras,
  DetallesPedido: DetallesPedido,
  DetallesPedidoPendiente: DetallesPedidoPendiente,
  DetallesVentasProductos: DetallesVentasProductos,
  DetallesPreciosVentasProductos: DetallesPreciosVentasProductos,
  DetallesPreciosPorCliente: DetallesPreciosPorCliente,
  Observaciones: Observacion,
  Menu: Menu
});

export default createAppContainer(stack);