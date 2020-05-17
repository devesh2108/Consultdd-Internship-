import React from "react";
import {DatePicker} from "antd";
import 'antd/dist/antd.css';
import moment from "moment-timezone";


class DateRangePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start_time: null,
            end_time: null,
            endOpen: false,
            startString: '',
            endString: ''
        };
    }

    componentDidMount() {
        let startTime = this.props.start_time
        let endTime = this.props.end_time

        this.setState({
            start_time: startTime,
            end_time: endTime,
        })

    }

    disabledStartDate = (start_time) => {
        const end_time = this.state.end_time;
        if (!start_time || !end_time) {
            return false;
        }
        return start_time.valueOf() > end_time.valueOf();
    };

    disabledEndDate = (end_time) => {
        const start_time = this.state.start_time;
        if (!end_time || !start_time) {
            return false;
        }
        return end_time.valueOf() <= start_time.valueOf();
    };

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };

    onStartChange = (value, dateString) => {
        this.onChange('start_time', value);
        this.onChange('startString', dateString);
    };

    onEndChange = (value, dateString) => {
        this.onChange('end_time', value);
        this.onChange('endString', dateString);
    };

    onOk = () => {
        let start_time = moment(this.state.start_time).tz("America/Toronto").format("YYYY-MM-DDTHH:mm")
        let end_time = moment(this.state.end_time).tz("America/Toronto").format("YYYY-MM-DDTHH:mm")
        console.log("date range picker", start_time, end_time)
        this.props.onOk(start_time, end_time);
    };

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    };

    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    };

    render() {
        const {start_time, end_time, endOpen} = this.state;

        console.log(moment(this.state.end_time).tz("America/Toronto").format("YYYY-MM-DDTHH:mm"))
        console.log(moment(this.state.start_time).tz("America/Toronto").format("YYYY-MM-DDTHH:mm"))
        return (
            <div className="row">
                <div className="col-md-12">

                    Start:
                    <DatePicker
                        disabled={this.props.disabled}
                        showTime
                        use12Hours
                        format="YYYY-MM-DD hh:mm A"
                        value={moment(start_time).tz("America/Toronto")}
                        placeholder="Start"
                        onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange}
                    />
                </div>
                <div className="col-md-12">
                    End:
                    <DatePicker
                        disabled={this.props.disabled}
                        showTime
                        use12Hours
                        format="YYYY-MM-DD hh:mm A"
                        value={moment(end_time).tz("America/Toronto")}
                        placeholder="End"
                        onChange={this.onEndChange}
                        open={endOpen}
                        onOpenChange={this.handleEndOpenChange}
                        onOk={this.onOk}
                    /></div>

            </div>
        );
    }
}

export default DateRangePicker;
