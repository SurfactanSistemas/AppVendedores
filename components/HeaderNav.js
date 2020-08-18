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
            <Grid style={[styles.header, { }]}>
                {/* <Col style={{ alignItems: 'flex-end', marginHorizontal: 15, marginVertical: 4 }}>
                    <Image style = {{height: 50, width: 75}} source={require('../assets/img/surfaclogo.png')} />
                </Col> */}
                <Col style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 55, paddingVertical: 8  }}>
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
        fontSize: 17  / PixelRatio.getFontScale(),
        color: '#FFF',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tituloSecundario: {
        // fontWeight: 'bold',
        fontSize: 13 / PixelRatio.getFontScale(),
        color: '#FFF',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
        // textAlign: 'center',
        // marginLeft: 10
    },
    header: {
            backgroundColor: '#133c74',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            // flex: 1,
            // minHeight: responsiveHeight(3),
        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc'
    }
});