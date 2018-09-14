import React from 'react';
import { Text, View, TouchableHighlight, PixelRatio} from 'react-native';
import HeaderNav from './HeaderNav.js';
import { Container, Content, List, Badge } from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Config from '../config/config';
import { responsiveWidth } from 'react-native-responsive-dimensions';

export default class DetallesPedido extends React.PureComponent{
	
	static navigationOptions = {
		headerTitle: <HeaderNav section="Detalles" />,
	};

	state = {
		datos: this.props.navigation.getParam('Cliente', undefined),
		refrescando : false,
		ultimo: 0,
		urlConsulta: ''
	}

	_KeyExtractor = (item, index) => index + '';

	Row(texto, contenido, _fontSize = 20){
		_fontSize /= PixelRatio.getFontScale();
		return (
			<View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
				<Text style={{fontSize: _fontSize, flex: 1, backgroundColor: '#133c74', color: 'white', paddingLeft: 10, paddingVertical: 5 + Math.ceil((20 - _fontSize)/2)}}>{texto} </Text><Text style={{textAlign: 'left', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#eee', fontSize: 20 / PixelRatio.getFontScale(), flex: 3, fontStyle: 'italic'}}>{contenido}</Text>
			</View>
		);
	}

	RenderEstado(WRemito) {
		return (
			<Col size={2} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: (WRemito != 0 ? 'green' : 'red')}}>
				<Text style={{color: '#fff', paddingHorizontal: 5, fontSize: 13 / PixelRatio.getFontScale() }}>{(WRemito != 0 ? 'Enviado' : 'No Enviado')}</Text>
			</Col>
		);
	}

	render(){
		if (this.state.datos){
			let Cliente = this.state.datos;
			
			return (
				<Container>
					<Content contentContainerStyle={{flex: 1, backgroundColor: '#fff'}}>
						<Grid>
							<Row size={1}>
								<Col style={{backgroundColor: Config.bgColorSecundario}}>
									<Row style={{alignItems: 'center', justifyContent: 'center', padding: 10}}>
										<Text style={{fontWeight: 'bold', color: '#fff', fontSize: 20 / PixelRatio.getFontScale(), textAlign: 'center'}}>{Cliente.Razon}</Text>
									</Row>
									<Row style={{alignItems: 'center', justifyContent: 'center'}}>
										<Text style={{fontStyle: 'italic', color: '#fff', fontSize: 15 / PixelRatio.getFontScale()}}>{Cliente.Datos[0].Datos[0].DesVendedor}</Text>
									</Row>
								</Col>
							</Row>
							<Row size={6} style={{ paddingHorizontal: responsiveWidth(2) }} >
								<Col>
									<List
										dataArray={Cliente.Datos}
										renderRow={(Pedido) => {
											let Productos = [];
											Pedido.Datos.map((dato) => Productos.push({Codigo: dato.Producto, Descripcion: dato.DesProducto , Cantidad: Config.NormalizarNumero(dato.Cantidad)}) );
											let Fecha = Pedido.Datos[0].Fecha;
											let Remito = Pedido.Datos[0].Remito;
											return (
												<Col>
													
														
														{/* Encabezado */}
														<Row size={1} style={{backgroundColor: Config.bgColorTerciario, height: 60, marginTop: 20,  borderTopColor: '#eee', borderTopWidth: 2, borderBottomColor: '#eee', borderBottomWidth: 2}}>
															<Col size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
																<Text style={{color: '#fff', fontSize: 15 / PixelRatio.getFontScale(), fontWeight: 'bold'}}> Pedido</Text>
															</Col>
															<Col size={2} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
																<Text>{Pedido.Pedido}</Text>
															</Col>
														</Row>
														<Row size={1} style={{backgroundColor: Config.bgColorTerciario, height: 40, borderBottomColor: '#eee', borderBottomWidth: 2}}>
															<Col size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
																<Text style={{color: '#fff', fontSize: 15 / PixelRatio.getFontScale(), fontWeight: 'bold'}}>Estado</Text>
															</Col>
															{ this.RenderEstado(Remito) }
															<Col size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
																<Text style={{color: '#fff', fontSize: 15 / PixelRatio.getFontScale(), fontWeight: 'bold'}}>Fecha:</Text>
															</Col>
															<Col size={2} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
																<Text style={{ fontSize: 12 / PixelRatio.getFontScale() }} >{Fecha}</Text>
															</Col>
														</Row>
														
														<Row size={1} style={{backgroundColor: Config.bgColorSecundario, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#eee', borderBottomWidth: 2}}>
															<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15 / PixelRatio.getFontScale(), fontStyle: 'italic', marginVertical: 5}}>
																Items
															</Text>
														</Row>
														<Row size={2}>
															{/* Listado de Items */}
															<Col>
																<Row style={{backgroundColor: Config.bgColorTerciario, paddingVertical: 10}}>
																	<Col size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
																		<Text style={{fontSize: 13 / PixelRatio.getFontScale(), color: '#fff', fontWeight: 'bold'}}>Codigo</Text>
																	</Col>
																	<Col size={3} style={{justifyContent: 'center', alignItems: 'center'}}>
																		<Text style={{fontSize: 13 / PixelRatio.getFontScale(), color: '#fff', fontWeight: 'bold'}}>Descripción</Text>
																	</Col>
																	<Col size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
																		<Text style={{fontSize: 12 / PixelRatio.getFontScale(), color: '#fff', fontWeight: 'bold'}}>Cant. (Kgs)</Text>
																	</Col>
																</Row>
																{Productos.map((producto) => {
																	const DatosClienteObservaciones = {
																		Pedido: Pedido.Pedido,
																		Producto: producto.Codigo,
																		Cliente: Cliente.Razon
																	};

																	return (
																		<TouchableHighlight  key={producto.Codigo} onPress={() => {this.props.navigation.navigate('Observaciones', DatosClienteObservaciones)}}>
																			<Row key={producto.Codigo} style={{backgroundColor: '#eee', padding: 10, borderBottomColor: '#aaa', borderBottomWidth: 1}}>
																				<Col size={1} style={{minWidth: 30, justifyContent: 'center'}}>
																					<Text style={{fontSize: 12 / PixelRatio.getFontScale()}}>({producto.Codigo})</Text>
																				</Col>
																				<Col size={3} style={{paddingLeft: 5, justifyContent: 'center'}}>
																					<Text style={{ fontSize: 15 / PixelRatio.getFontScale() }} >{producto.Descripcion}</Text>
																				</Col>
																				<Col size={1} style={{ justifyContent: 'center' }} >
																					<Text style={{textAlign: 'right', paddingRight: 5}}>{producto.Cantidad}</Text>
																				</Col>
																			</Row>
																		</TouchableHighlight>
																	)
																})}
																<Row style={{borderBottomColor: '#ccc', borderBottomWidth: 2, marginTop: 30, marginBottom: 10, marginHorizontal: 60 }}></Row>
															</Col>
														</Row>

												</Col>
											)
										}}
									>

									</List>
								</Col>
							</Row>
						</Grid>
					</Content>
				</Container>
			)
		}
	}
}