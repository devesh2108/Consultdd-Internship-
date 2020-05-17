import React from "react";
import DatePicker from "react-datetime";
import 'antd/dist/antd.css';
import moment from "moment-timezone";
import "react-datetime/css/react-datetime.css";


class CalendarDatePicker extends React.Component {
    constructor(props){
        super(props);
    }
    state = {
        starDate: null,
        startString: '',
        view: 'day'
    };

    onChange = (field, value) => {
        this.setState({
            [field]: moment(value).tz("America/Toronto"),
        });

    };

    onDateChange = (value, dateString) => {
        this.onChange('startDate', value);
        this.onChange('startString', dateString);
        this.props.onOk(value)
    };

    render() {
        const {startDate} = this.state;
        return (
            <div>
                <DatePicker
                    displayTimeZone="America/New_York"
                    defaultValue={moment(new Date()).tz("America/Toronto")}
                    autoFocus={true}
                    open={this.props.open}
                    format="YYYY-MM-DD"
                    value={moment(startDate).tz("America/Toronto") || moment(this.props.startDate).tz("America/Toronto")}
                    placeholder="Select Date"
                    onChange={this.onDateChange}
                />
            </div>
        );
    }
}

export default CalendarDatePicker;
