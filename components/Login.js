import React from 'react';
import { StyleSheet, View, Image, Dimensions, PixelRatio } from 'react-native';
import Config from '../config/config.js';
import { Container, Text, Content, Form, Item, Input, Label, Icon, Button, Spinner } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import RF from 'react-native-responsive-fontsize';
import {responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import ImageResponsive from 'react-native-responsive-image';

const MSG_CLAVE_ERRONEA = 'La clave indicada no es una cláve válida. Vuela a intentar.';

export default class DetallesPedido extends React.PureComponent {

    static navigationOptions = {
        headerStyle: {
            backgroundColor: Config.bgColor,
        },
    };

    constructor(props) {
        super(props);

        this.state = {
            urlConsulta: '',
            margenInput: 0,
            passVendedor: '',
            showError: false,
            msgError: '',
            tamanioWidth: 0, //Dimensions.get('window').width,
            fontLoaded: true,
            Sending: false
        };
    }



    handleChangeDimensions = (dims) => {
        const value = dims.height > dims.width ? dims.width : dims.height;

        this.setState({ tamanioWidth: value - 50 });
    }

    async componentWillMount() {
        await Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
        });

        global.idVendedor = -1;

        this.setState({ fontLoaded: false });

        let { width, height } = Dimensions.get('window');
        this.handleChangeDimensions({ width: width, height: height });
    }

    handleOnChangeText = (text) => {
        this.setState({ passVendedor: text, msgError: '' })
    };

    handleOnPress = async () => {
        this.setState({ showError: false, msgError: '', Sending: true });

        let Clave = this.state.passVendedor;

        //if (Clave == "") Clave = "carrozzo10";

        Config.Consultar('Login/' + Clave, (resp) => {
            resp.then(res => res.json())
                .then((resJson) => {
                    const { Vendedor } = resJson.resultados[0];
                    global.idVendedor = Vendedor;
                    if (Vendedor > 0) {
                        this.setState({ Sending: false }, () => {
                            this.props.navigation.navigate('Menu');
                        });
                    } else {
                        this.setState({ showError: true, msgError: MSG_CLAVE_ERRONEA, Sending: false });
                    }
                })
                .catch((err) => {
                    this.setState({ showError: true, msgError: err, Sending: false });
                });
        });
    };

    textoBoton() {
        if (!this.state.Sending) return (<Text style={{ color: '#fff' }}>Iniciar Sesión</Text>);
        return (<Spinner color={Config.bgColor} />);
    }
    render() {
        if (this.state.fontLoaded) {
            return (<Spinner />)
        }
        return (
            <Container>
                <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.container}>

                    <Grid style={{ flex: 1 }}>
                        <Col style={{}}>
                            <Row size={2}>
                                <Col style={{ paddingTop: 30 }}>
                                    <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={require('../assets/img/surfaclogo.png')} />
                                        <Text style={{ color: '#fff', fontSize: 20  / PixelRatio.getFontScale() }}>SURFACTAN S.A</Text>
                                    </Row>
                                    <Row style={{ justifyContent: 'center' }}>
                                        <Text style={[styles.titleHeader]}>Inicio de Sesión</Text>
                                    </Row>
                                </Col>
                            </Row>
                            <Row size={10} style={{ justifyContent: 'center' }}>
                                <Col style={{ maxWidth: responsiveWidth(80)}}>
                                    <Form style={styles.loginFormContainer}>
                                        <Row>
                                            <Item floatingLabel last style={{ flex: 1 }}>
                                                <Icon active name='key' style={styles.loginFormIconInput} />
                                                <Label style={{ color: '#fff', marginLeft: 5 }}>Contraseña...</Label>
                                                <Input getRef={i => this.txtInput = i} secureTextEntry={true} style={[styles.InputText]}
                                                    onChangeText={this.handleOnChangeText}
                                                    onSubmitEditing={this.handleOnPress}
                                                />
                                            </Item>
                                        </Row>
                                        <Row>
                                            <Button style={{ flex: 1, marginTop: 15, justifyContent: 'center', alignItems: 'center' }} onPress={this.handleOnPress} disabled={this.state.Sending}>
                                                {this.textoBoton()}
                                            </Button>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        </Col>
                    </Grid>
                    <View>
                        <Text style={{ color: 'yellow', fontSize: 10 / PixelRatio.getFontScale(), textAlign: 'center' }}>{this.state.msgError}</Text>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Config.bgColor,
        paddingHorizontal: 10
    },
    titleHeader: {
        color: '#fff',
        fontSize: 15 / PixelRatio.getFontScale()
    },
    InputText: {
        color: '#ccc',
        padding: 10,
        marginBottom: 2,
    },
    ButtonForm: {
        margin: 20
    },
    loginFormContainer: {
        // paddingLeft: 30,
        // paddingRight: 30
    },
    loginFormIconInput: {
        color: '#fff',
        marginRight: 5
    },
    loginFormIconInputRemove: {
        color: '#fff'
    }
});