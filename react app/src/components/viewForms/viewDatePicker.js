import React from "react";
import {DatePicker} from "antd";
import 'antd/dist/antd.css';
import moment from "moment-timezone";


class ViewDatePicker extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            startValue: moment(this.props.startDate).add(1, 'days').tz("America/Toronto"),
            endValue: moment( this.props.endDate).add(1, 'days').tz("America/Toronto"),
            endOpen: false,
            startString:'',
            endString:''
        };
    }

    componentDidMount(){
        let startTime=moment(this.state.startValue).tz("America/Toronto")
        let endTime=moment(this.state.endValue).tz("America/Toronto")
        let start=moment(this.state.startValue).tz("America/Toronto").format("HH:mm")
        let end=moment(this.state.endValue).tz("America/Toronto").format("HH:mm")
        if(this.props.tz === -330) {
            if (start >= "00:00") {
                if (start <= "14:00" && end <= "14:29") {
                    startTime = moment(this.state.startValue).subtract(1, 'days').tz("America/Toronto")
                    endTime = moment(this.state.endValue).subtract(1, 'days').tz("America/Toronto")
                }
                else {
                    startTime = startTime
                    endTime = endTime
                }
            }
        }
        else {
            if (start >= "00:00") {
                if (start <= "14:00" && end <= "14:29") {

                    startTime = moment(this.state.startValue).subtract(1, 'days').tz("America/Toronto")
                    endTime = moment(this.state.endValue).subtract(1, 'days').tz("America/Toronto")
                }
                else {

                    startTime = moment(this.state.startValue).subtract(1, 'days').tz("America/Toronto")
                    endTime = moment(this.state.endValue).subtract(1, 'days').tz("America/Toronto")
                }
            }
        }


        this.setState({
            startValue:startTime,
            endValue:endTime,
        })

    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };

    onStartChange = (value, dateString) => {
        this.onChange('startValue', value);
        this.onChange('startString', dateString);
    };

    onEndChange = (value, dateString) => {
        this.onChange('endValue', value);
        this.onChange('endString', dateString);
    };

    onOk = () => {
        this.props.onOk(this.state.startValue , this.state.endValue );
    };

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    };

    render() {
        const { startValue, endValue, endOpen } = this.state;


        return (
            <div className="row">
                <div className="col-md-12">

                    Start:
                    <DatePicker
                        showTime
                        use12Hours
                        format="YYYY-MM-DD hh:mm A"
                        disabled={this.props.disabled}
                        value={moment(startValue).tz("America/Toronto")}
                        placeholder="Start"
                        onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange}
                    />
                </div>
                <div className="col-md-12">
                    End:
                    <DatePicker
                        showTime
                        use12Hours
                        format="YYYY-MM-DD hh:mm A"
                        disabled={this.props.disabled}
                        value={moment(endValue).tz("America/Toronto")}
                        placeholder="End"
                        onChange={this.onEndChange}
                        open={endOpen}
                        onOpenChange={this.handleEndOpenChange}
                        onOk = {this.onOk}
                    /></div>

            </div>
        );
    }
}

export default ViewDatePicker;
