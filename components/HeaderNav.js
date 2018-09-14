import React from 'react';
import {Text, Image, View, StyleSheet, PixelRatio} from 'react-native';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { Grid, Col, Row } from 'react-native-easy-grid';

export default class HeaderNav extends React.PureComponent {

    static defaultProps = {
        section: null
    }

    constructor(props){
        super(props);
    }
    
    render(){
        return (
            <Grid style={[styles.header, { flex: 1 }]}>
                <Col style={{ alignItems: 'flex-end', marginRight: 10 }}>
                    <Image style = {{height: 50, width: 75}} source={require('../assets/img/surfaclogo.png')} />
                </Col>
                <Col style={{ alignItems: 'flex-start', marginLeft: 10 }}>
                    <Row>
                        <Text style={styles.titulo}>
                            SURFACTAN S.A.
                        </Text>
                    </Row>
                    <Row>
                        <Text style={styles.tituloSecundario}>
                            {this.props.section}
                        </Text>
                    </Row>
                </Col>
            </Grid>
            // <View style={[styles.header, {flexDirection: 'row', flex: 1, justifyContent: 'space-around'}]}>
            //     <View>
            //     </View>
            // </View>
        )
    }
}

const styles = StyleSheet.create({ 
    titulo: {
        fontWeight: 'bold',
        fontSize: 20  / PixelRatio.getFontScale(),
        color: '#FFF',
        flex: 1,
    },
    tituloSecundario: {
        // fontWeight: 'bold',
        fontSize: 15 / PixelRatio.getFontScale(),
        color: '#FFF',
        flex: 1,
        // textAlign: 'center',
        marginLeft: 10
    },
    header: {
        backgroundColor: '#133c74',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: responsiveHeight(5),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    }
});