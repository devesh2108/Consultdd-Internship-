import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Button, Menu, Dropdown, Select, DatePicker, Checkbox, message} from "antd";
import moment from "moment-timezone";
import {editMarketing,getCities} from "../../../services/service";

const skillList = [
    {id: 1, value: 'Java'},
    {id: 2, value: 'Python'},
    {id: 3, value: 'AWS'},
    {id: 4, value: 'DevOps'},
    {id: 6, value: 'Salesforce'},
    {id: 7, value: 'Peoplesoft'},
    {id: 8, value: 'Workday'},
    {id: 9, value: 'Kronos'},
    {id: 10, value: 'Lawson'},
    {id: 11, value: 'BA'},
    {id: 12, value: 'Full Stack'},
    {id: 13, value: 'Others'},
]

class MarketingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marketing_start:null,
            preferred_location:'',
            rtg:false,
            in_pool:false,
            cityList:[]

        };
        this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount() {
        this.setState({
            marketing_start:moment(this.props.data.start),
            preferred_location:this.props.data.preferred_location,
            rtg:this.props.data.rtg,
            in_pool:this.props.data.in_pool,
        })
        this.getCitySuggestions("")
    }

    getCitySuggestions(param){
        getCities(param)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                this.setState({
                    cityList: res.results,
                    error: res.error || null,
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });

    }

    onSelectCity =(data)=>{
        this.setState({
            preferred_location:data
        })

    }
    rtgChecked = (e) => {
        this.setState({
            rtg: e.target.checked,
        })
    }
    inPoolChecked = (e) => {
        this.setState({
            in_pool: e.target.checked,
        })

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onStartChange = (value) => {
        this.setState({marketing_start: value})
    }

    onSubmit = e => {
        const body = {
            'start':moment(this.state.marketing_start).format("YYYY-MM-DD"),
            'preferred_location':this.state.preferred_location,
            'rtg':false,
            in_pool:false


        }
        editMarketing(this.props.marketingId,body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.props.setMarketing(res.result)
                this.props.handleClose()

            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        return (
            <div>
                <div className="row">


                    <div className="col-md-6 col-sm-6 col-xs-12">


                        <div className="profileformnew2">

                            <label><span style={{color: 'red', fontSize: 9}}>*</span>Preferred Location:
                                <Select
                                    showSearch
                                    value={this.state.preferred_location}
                                    style={{width: '100%'}}
                                    placeholder="Job Location"
                                    optionFilterProp="children"
                                    onChange={(e) => console.log(e)}
                                    onSelect={(e) => this.onSelectCity(e)}
                                    onSearch={(e) => this.getCitySuggestions(e)}
                                >
                                    {
                                        this.state.cityList.map((item, i) => (
                                            <Select.Option
                                                value={item.name + "," + item.state}>{item.name + " ," + item.state}</Select.Option>
                                        ))}
                                </Select>

                            </label>

                            <label><span style={{color: 'red', fontSize: 9}}>*</span>Marketing Start
                                <br/>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    value={this.state.marketing_start}
                                    placeholder="Marketing Start"
                                    onChange={this.onStartChange}
                                />
                            </label>


                        </div>


                    </div>


                    <div className="col-md-6 col-sm-6 col-xs-12">


                        <div className="profileformnew2">




                            <label><span style={{color: 'red', fontSize: 9}}>*</span>RTG
                                <Checkbox
                                    checked={this.state.rtg}
                                    onChange={this.rtgChecked}/>
                            </label>


                            <label><span style={{color: 'red', fontSize: 9}}>*</span>In Pool

                                <Checkbox
                                    checked={this.state.in_pool}
                                    onChange={this.inPoolChecked}/>
                            </label>


                            <Button onClick={this.onSubmit}>Submit</Button>

                        </div>

                    </div>


                </div>


            </div>
        )

    }
}

export default MarketingForm;
