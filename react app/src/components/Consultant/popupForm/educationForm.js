import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Button, Select, DatePicker, message} from "antd";
import moment from "moment";
import {addEdu, editEdu} from "../../../functions/onEducation";
import {getCities} from "../../../services/service";

const MAJOR = [
    "IT",
    "NON-IT",
    "MANAGEMENT"
];
const EDUCATION_TYPE = [
    "Diploma",
    "Bachelors",
    "Masters",
    "Certification"
];

class EducationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            remark: '',
            city: '',
            major: '',
            org_name: '',
            type: '',
            start_date: '',
            end_date: '',
            cityList:[]
        }
        this.addEdu = this.addEdu.bind(this);
    }

    componentDidMount() {
        console.log("consultantId", this.props.consultantId)
        if (this.props.editEdu) {
            this.setState({
                title: this.props.eduObj.title,
                remark: this.props.eduObj.deu_remark,
                city: this.props.eduObj.city,
                major: this.props.eduObj.major,
                org_name: this.props.eduObj.org_name,
                type: this.props.eduObj.type,
                start_date: moment(this.props.eduObj.start_date),
                end_date: moment(this.props.eduObj.end_date)
            })
        } else {
            this.setState({
                title: '',
                remark: '',
                city: '',
                major: '',
                org_name: '',
                type: '',
                start_date: '',
                end_date: ''
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
    onEduStartChange = (value) => {
        console.log("start date", value)
        this.setState({start_date: value})
    };
    onEduEndChange = (value) => {
        this.setState({end_date: value})
    };

    async editEdu(obj) {
        await editEdu(this.state, obj);
        this.props.updateEducation(this.state)
        this.props.handleClose()
        message.success("Education Updated Successfully.")
    }

    async addEdu() {
        await addEdu(this.state, this.props.consultantId);
        this.props.setEducation(this.state)
        this.props.handleClose()
        message.success("Education Added Successfully.")
    }

    render() {
        return (
            <div>

                <div className="row">

                    <div className="col-md-6">

                        <div className="experience_tab">
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
                            Education Major:
                            <Select
                                value={this.state.major}
                                className="form-control"
                                placeholder="Education Major"
                                onChange={(e) => this.setState({major: e})}>
                                {MAJOR.map((item, i) => <Select.Option key={i}
                                                                       value={item}>{item}</Select.Option>)}

                            </Select>
                        </label>

                        <label>
                            Education Remark:
                            <input
                                id="outlined-required"
                                className="form-control"
                                name="remark"
                                placeholder="Additional Remarks"
                                value={this.state.remark}
                                onChange={this.handleChange}/>
                        </label>

                        <label>
                            Education Start Date:
                            <br/>
                            <DatePicker
                                format="YYYY-MM-DD"
                                value={this.state.start_date}
                                placeholder="Education Start Date"
                                onChange={this.onEduStartChange}
                            />
                        </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                    <div className="experience_tab">
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
                            Education Org Name:
                            <input
                                id="outlined-required"
                                className="form-control"
                                name="org_name"
                                placeholder="Education Org Name"
                                value={this.state.org_name}
                                onChange={this.handleChange}/>
                        </label>

                        <label>
                            Education Type:
                            <br/>
                            <Select
                                value={this.state.type}
                                className="form-control"
                                placeholder="Education Type"
                                onChange={(e) => this.setState({type: e})}>
                                {EDUCATION_TYPE.map((item, i) => <Select.Option key={i}
                                                                                value={item}>{item}</Select.Option>)}

                            </Select>
                        </label>

                        <label>
                            Education End Date:
                            <br/>
                            <DatePicker
                                format="YYYY-MM-DD"
                                value={this.state.end_date}
                                placeholder="Education End Date"
                                onChange={this.onEduEndChange}
                            />
                        </label>

                        <div className="subbutton">
                            <Button onClick={() =>
                                this.props.editEdu ? this.editEdu(this.props.eduObj) : this.addEdu()}>Submit
                                Education </Button>
                        </div>
              </div>
                    </div>

                </div>

            </div>
        )

    }
}

export default EducationForm;
