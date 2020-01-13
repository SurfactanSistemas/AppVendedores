import React from 'react';
import { StyleSheet, View, Image, Dimensions, PixelRatio } from 'react-native';
import Config from '../config/config.js';
import { Container, Text, Content, Form, Item, Input, Icon, Button, Spinner } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import * as Font from 'expo-font';

const MSG_CLAVE_ERRONEA = 'La clave indicada no es una cláve válida. Vuela a intentar.';

export default class Login extends React.PureComponent {

    static navigationOptions = {
        title: '',
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
            fontLoaded: false,
            Sending: false
        };
    }

    async componentDidMount(){
        await Font.loadAsync({
                    'Roboto': require('../node_modules/native-base/Fonts/Roboto.ttf'),
                    'Roboto_medium': require('../node_modules/native-base/Fonts/Roboto_medium.ttf'),
                    //'Ionicons': require('../node_modules/@expo/vector-icons/fonts/Ionicons.ttf'),
                });

        this.setState({ fontLoaded: true });
    }

    handleChangeDimensions = (dims) => {
        const value = dims.height > dims.width ? dims.width : dims.height;

        this.setState({ tamanioWidth: value - 50 });
    }

    async UNSAFE_componentWillMount() {
        
        global.idVendedor = -1;

        let { width, height } = Dimensions.get('window');
        this.handleChangeDimensions({ width: width, height: height });
    }

    handleOnChangeText = (text) => {
        this.setState({ passVendedor: text, msgError: '' })
    };

    handleOnPress = async () => {
        let Clave = this.state.passVendedor;
        
        if (Clave == "") return;

        this.setState({ showError: false, msgError: '', Sending: true });
        
        Config.Consultar('Login/' + Clave, (resp) => {
            resp.then(res => res.json())
                .then((resJson) => {
                    if (resJson.resultados.length > 0) {
                        const { Vendedor } = resJson.resultados[0];
                        global.idVendedor = Vendedor;
                        this.setState({ Sending: false, passVendedor: '' }, () => {
                            this.props.navigation.navigate('Menu');
                        });
                    } else {
                        this.setState({ showError: true, msgError: MSG_CLAVE_ERRONEA, Sending: false, passVendedor: '' });
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
        if (!this.state.fontLoaded) {
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
                                            <Item last style={{ flex: 1 }}>
                                                <Icon active name='key' style={styles.loginFormIconInput} />
                                                {/* <Label style={{ color: '#fff', marginLeft: 5 }}>Contraseña...</Label> */}
                                                <Input getRef={i => this.txtInput = i} secureTextEntry={true} style={[styles.InputText]}
                                                    onChangeText={this.handleOnChangeText}
                                                    onSubmitEditing={this.handleOnPress}
                                                    placeholder='Contraseña...'
                                                    placeholderTextColor='#fff'
                                                    value={this.state.passVendedor}
                                                />
                                            </Item>
                                        </Row>
                                        <Row>
                                            <Button style={{ flex: 1, marginTop: 15, justifyContent: 'center', alignItems: 'center' }} onPress={this.handleOnPress} disabled={this.state.Sending}>
                                                {this.textoBoton()}
                                            </Button>
                                        </Row>
                                        <Row>
                                            <Text style={{ color: 'yellow', fontSize: 14 / PixelRatio.getFontScale(), textAlign: 'center' }}>{this.state.msgError}</Text>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        </Col>
                    </Grid>
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
        //padding: 10,
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