import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Button, Menu, Dropdown, Select, DatePicker, message} from "antd";
import Icon from "@ant-design/icons"
import {addExp, editExp} from "../../../functions/onExperience";
import {getCities} from "../../../services/service";
import moment from "moment";

const EXPERIENCE_TYPE = [
    "Intership",
    "Full Time",
    "Part Time"
]

class ExperienceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            remark: '',
            city: '',
            company: '',
            type: '',
            start_date: null,
            end_date: null,
            cityList:[]

        }
    }

    componentDidMount() {
        if (this.props.editExp) {
            this.setState({
                title: this.props.expObj.title,
                remark: this.props.expObj.remark,
                city: this.props.expObj.city,
                company: this.props.expObj.org_name,
                type: this.props.expObj.exp_type,
                start_date: moment(this.props.expObj.start_date),
                end_date: moment(this.props.expObj.end_date)
            })
        } else {
            this.setState({
                title: '',
                remark: '',
                city: '',
                company: '',
                type: '',
                start_date: null,
                end_date: null,
            })
        }
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
            city:data
        })

    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    onExpStartChange = (value) => {
        this.setState({start_date: value})
    };
    onExpEndChange = (value) => {
        this.setState({end_date: value})
    };

    async editExp(obj) {
        await editExp(this.state, obj);
        message.success("Experience Updated Successfully");
        this.props.updateExperience(this.state)
        this.props.handleClose()

    }

    async addExp() {
        await addExp(this.state, this.props.consultantId);
        message.success("Experience Added Successfully");
        this.props.setExperience(this.state)
        this.props.handleClose()
    }

    render() {
        return (
            <div>

                <div className="row">

                    <div className="experience_tab">

                        <div className="col-md-6">
                            <label>
                                Title:
                                <input
                                    id="outlined-required"
                                    className="form-control"
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                />
                            </label>


                            <label>
                                Experience Remark:
                                <input
                                    id="outlined-required"
                                    className="form-control"
                                    name="remark"
                                    placeholder="Additional Remarks"
                                    value={this.state.remark}
                                    onChange={this.handleChange}/>
                            </label>

                            <label>
                                Experience Start Date:
                                <br/>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    value={this.state.start_date}
                                    placeholder="Experience Start Date"
                                    onChange={this.onExpStartChange}
                                />
                            </label>

                            <label>
                                Experience End Date:
                                <br/>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    value={this.state.end_date}
                                    placeholder="Experience End Date"
                                    onChange={this.onExpEndChange}
                                />
                            </label>

                        </div>


                        <div className="col-md-6">

                            <label>
                                City:
                                <br/>
                                <Select
                                    showSearch
                                    value={this.state.city}
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

                            <label>
                                Experience Company:
                                <input
                                    id="outlined-required"
                                    className="form-control"
                                    name="company"
                                    placeholder="Experience Company"
                                    value={this.state.company}
                                    onChange={this.handleChange}/>
                            </label>

                            <label>
                                Experience Type:
                                <br/>
                                <Select
                                    value={this.state.type}
                                    className="form-control"
                                    style={{width: "100%"}}
                                    placeholder="Experience Type"
                                    onChange={(e) => this.setState({type: e})}>
                                    {EXPERIENCE_TYPE.map((item, i) => <Select.Option key={i}
                                                                                     value={item}>{item}</Select.Option>)}

                                </Select>
                            </label>


                            <div className="subbutton">
                                <Button onClick={() =>
                                    this.props.editExp ? this.editExp(this.props.expObj) : this.addExp()}>Submit
                                    Experience</Button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        )

    }
}

export default ExperienceForm;
