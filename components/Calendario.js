import React from 'react';
import DatePicker from '@react-native-community/datetimepicker';

export default class Calendario extends React.Component {

    static defaultProps = {
        show: null
    }

    state = {
        show: false
    }

    constructor(props){
        super(props);
    }

    async componentDidMount(){
        this.state.setState({
            show: this.props.show
        });
    }

    handleOnPressDate = (e, d) => {
        d = d ?? this.state.date;
        if (d.toLocaleString() != this.state.date.toLocaleString()) this.setState({ date: d, show: false }, this._ReGenerarItems);
    }
    
    render(){
        return (
            this.state.show && <DatePicker value={this.state.date}
                            mode="date"
                            is24Hour={true}
                            display="calendar"
                            // minimumDate={`${Math.min(...this.state.Anios.map(a => a.Anio))}-01-01`}
                            maximumDate={new Date()}
                            locale="es-ES"
                            onChange={this.handleOnPressDate}
                            onTouchCancel={(e, d) => this.setState({show: false})} />
        )
    }
}