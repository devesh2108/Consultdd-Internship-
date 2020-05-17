import React, {Component} from 'react';
import {
    Form, Input, Button, message
} from 'antd';
import {
    getAllVendorByCompany,
    getCities,
    getVendorCompanySuggestions,
    jdParser,
    updateLead
} from "../../services/service";
import {Select, Tag, Tooltip} from "antd";

const {TextArea} = Input;
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


export default class ViewLead extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            job_desc: '',
            location: '',
            job_title: '',
            vendor_company: this.props.leadDetails.company_name,
            vendor_name: this.props.leadDetails.vendor__name,
            vendor_contact: this.props.leadDetails.vendor__number,
            vendor_email: this.props.leadDetails.vendor__email,
            cityList: [],
            parseCityList: [],
            status: null,
            companyList: [],
            companyId: this.props.leadDetails.company_id,
            vendorId: this.props.leadDetails.vendor_id,
            vendorList: [],
            addCompany: false,
            addVendor: false,
            skill: '',
            selected: [false],
            disabled: false

        };

        console.log(this.props.leadDetails);
        this.handleChange = this.handleChange.bind(this);
        this.getCompanySuggestions = this.getCompanySuggestions.bind(this);
        this.editLead = this.editLead.bind(this);
        this.onSelectSkill = this.onSelectSkill.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onSelectCompany = this.onSelectCompany.bind(this);
        this.selectCompany = this.selectCompany.bind(this);
        this.selectVendor = this.selectVendor.bind(this);
    }

    componentDidMount() {

        this.setState({
            job_desc: this.props.leadDetails.job_desc,
            location: this.props.leadDetails.city,
            job_title: this.props.leadDetails.job_title,
        });
        this.setState({disabled: this.props.leadDetails.project === null})

        if (this.props.leadDetails.primary_skill !== null) {
            skillList.map((skill, index) => {
                    if (skill.value.toLowerCase() === this.props.leadDetails.primary_skill.toLowerCase()) {

                        let selected = [];
                        selected[index] = true
                        this.setState({
                            skill: this.props.leadDetails.primary_skill,
                            selected: selected
                        })
                    }
                }
            )
        }

        this.getCitySuggestions("");
        this.getCompanySuggestions("");
        if (this.props.leadDetails.company_id !== null) {
            this.getAllVendorByCompany(this.props.leadDetails.company_id);
        }

    }

    getCompanySuggestions(query) {

        getVendorCompanySuggestions(query)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                this.setState({
                    companyList: res.results,
                    error: res.error || null,
                    loading: false,
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });
    };

    onSelectCompany(data) {
        this.setState({
            vendor_company: data.split(",")[1],
            companyId: data.split(",")[0]
        })
        //this.setState({companyId:id})
        this.getAllVendorByCompany(data.split(",")[0])
    }

    onSelectVendor(data) {
        this.setState({
            vendor_name: data.name,
            vendor_email: data.email,
            vendor_contact: data.number,
            vendorId: data.id
        })
    }

    onSelectSkill(data, i) {
        console.log(data)
        let selected = [];
        selected[i] = true
        this.setState({
            skill: data,
            selected: selected
        })

    }

    selectCompany(obj) {
        console.log("obj", obj)
        this.state.companyList.push(obj)
        this.setState({
            vendor_company: obj.name,
            companyId: obj.id,

        }, () =>
            this.getAllVendorByCompany(obj.id))

    }

    selectVendor(obj) {
        console.log("--------------", obj)
        //this.state.vendorList.push(obj)
    }

    getAllVendorByCompany(id) {
        console.log(id, "addsubmission")
        getAllVendorByCompany(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.setState({
                    vendorList: res.results,
                    vendorId: -1,
                    vendor_name: '',
                    vendor_email: '',
                    vendor_contact: '',
                    error: res.error || null,
                    loading: false,
                });

                this.setState({status: status})
            })
            .catch(error => {
                console.log(error)
            });

    }

    handleChange(event) {
        console.log(event.target.value)

        this.setState({[event.target.name]: event.target.value})

    }

    handleClose() {
        this.setState({addCompany: false, addVendor: false});

    }

    editLead() {
        console.log(this.state.location)
        const body = {
            'lead_id': this.props.leadDetails.id,
            'job_desc': this.state.job_desc,
            'city': this.state.location,
            'job_title': this.state.job_title,
            'vendor_company': this.state.companyId,
            'primary_skill': this.state.skill,
        };
        if (this.state.job_desc && this.state.location && this.state.job_title && this.state.companyId && this.state.skill) {
            updateLead(body, this.props.leadDetails.id)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    if (status !== 202) {
                        message.error("Something went wrong.")
                    } else {
                        message.success("Requirement updated")
                        this.props.setStatus();
                        this.props.onUpdateChange(res.result.id, res.result)
                        this.props.handleClose();
                    }

                })
                .catch(error => {
                    console.log(error)
                });
        } else
            message.error("Please fill all the details")

    }

    getCitySuggestions(query) {
        getCities(query)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                this.setState({
                    cityList: res.results,
                    error: res.error || null,
                    status: status
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });

    }

    onSelectCity(data) {
        console.log(data)
        this.props.form.setFieldsValue({
            location: data,
        });

    }

    parser(value) {
        const body = {
            "jd": value
        }
        console.log(body)
        jdParser(body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.props.form.setFieldsValue({
                    job_title: res.results.ROLE,
                })
                this.setState({parseCityList: res.results.LOCATION})
                if (res.results.LOCATION.length === 0) {
                    this.getCitySuggestions()
                }

            })
            .catch(error => {
                console.log(error)
            });

    }


    render() {
        return (

            <div>


                <div className="viewleadform">


                    <Form layout='vertical'>


                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <Form.Item label="Job Description">
                                {/*<Button disabled={!this.state.disabled} className="parsebtn"*/}
                                        {/*style={{*/}
                                            {/*backgroundColor: this.state.job_desc !== undefined && this.state.job_desc !== '' ?*/}
                                                {/*'green' : 'gray',*/}
                                        {/*}}*/}
                                        {/*onClick={() => {*/}
                                            {/*if (this.state.job_desc !== undefined && this.state.job_desc !== '') {*/}
                                                {/*this.parser(this.state.job_desc)*/}
                                            {/*}*/}
                                        {/*}*/}
                                        {/*}>Parse</Button>*/}

                                    <TextArea value={this.state.job_desc} name="job_desc" onChange={this.handleChange} disabled={!this.state.disabled} style={{width: '100%'}}
                                              autosize={{minRows: 10, maxRows: 25}}/>
                            </Form.Item>

                            <label>Skills:</label>
                            <div style={{borderWidth: 1, borderColor: 'black'}}>
                                {skillList.map((tag, index) => {
                                    const isLongTag = tag.value > 20;
                                    const tagElem = (
                                        <div
                                            onClick={() => this.state.disabled ? this.onSelectSkill(tag.value, index) : null}>
                                            <Tag
                                                style={{
                                                    width: '20%',
                                                    fontSize: 11,
                                                    marginTop: '8px',
                                                    color: this.state.selected[index] ? 'white' : '#2688db ',
                                                    backgroundColor: this.state.selected[index] ? '#2688db' : 'white'
                                                }}
                                                key={tag.value} closable={false}>
                                                {isLongTag ? `${tag.value.slice(0, 20)}...` : tag.value}
                                            </Tag>
                                        </div>
                                    );
                                    return isLongTag ? (
                                        <Tooltip title={tag.value} key={tag}>
                                            {tagElem}
                                        </Tooltip>
                                    ) : (
                                        tagElem
                                    );
                                })}
                            </div>
                        </div>


                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="row">
                                <div className="col-md-12 col-sm-12 col-xs-12">
                                    <div className="view_leadjt">
                                        <Form.Item
                                            label="Job Title:"
                                        >

                                                <Input name="job_title" value={this.state.job_title} onChange={this.handleChange} disabled={!this.state.disabled} style={{width: '100%'}}/>

                                        </Form.Item>
                                    </div>
                                </div>


                                <div className="col-md-12 col-sm-12 col-xs-12">

                                    <Form.Item
                                        label="Location:"
                                    >
                                            <div>
                                                <div style={{borderWidth: 1, borderColor: 'black'}}>

                                                    {this.state.parseCityList.map((tag, index) => {
                                                        const isLongTag = tag.name.length > 20;
                                                        const tagElem = (
                                                            <div onClick={() => this.onSelectCity(tag.name)}>
                                                                <Tag className="view_sec_tab" key={tag.name}
                                                                     closable={false}>
                                                                    {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
                                                                </Tag>
                                                            </div>
                                                        );
                                                        return isLongTag ? (
                                                            <Tooltip title={tag.name} key={tag}>
                                                                {tagElem}
                                                            </Tooltip>
                                                        ) : (
                                                            tagElem
                                                        );
                                                    })}
                                                </div>
                                                <Select
                                                    disabled={!this.state.disabled}
                                                    value={this.state.location}
                                                    showSearch
                                                    style={{width: '100%'}}
                                                    placeholder="Job Location"
                                                    optionFilterProp="children"
                                                    onChange={(e) => console.log(e)}
                                                    onSelect={(e) => this.onSelectCity(e)}
                                                    onSearch={(e) => this.getCitySuggestions(e)}
                                                >
                                                    {this.state.cityList.map((item, i) => (
                                                        <Select.Option
                                                            value={item.name + "," + item.state}>{item.name + " ," + item.state}</Select.Option>
                                                    ))}
                                                </Select>
                                            </div>

                                    </Form.Item>

                                </div>


                                <div className="col-md-12 col-sm-12 col-xs-12">
                                    <Form.Item
                                        label="Vendor Company:"
                                    >
                                        <Select
                                            //allowClear
                                            disabled={!this.state.disabled}
                                            showSearch
                                            value={this.state.vendor_company}
                                            className="Vendorcompanysec"
                                            style={{width: '79%'}}
                                            placeholder="Vendor company"
                                            optionFilterProp="children"
                                            onChange={(e) => this.onSelectCompany(e)}
                                            onSelect={(e) => this.onSelectCompany(e)}
                                            // filterOption={(input, option) =>
                                            //     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            // }
                                            onSearch={(e) => this.getCompanySuggestions(e)}
                                        >
                                            {this.state.companyList.map((item, i) => (
                                                <Select.Option
                                                    value={item.id + "," + item.name}>{item.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>


                            </div>

                        </div>


                        <div className="col-md-12">
                            <div className="formbutoon1">
                                <Button disabled={!this.state.disabled} onClick={this.editLead}>Submit</Button>
                                <Button disabled={!this.state.disabled} onClick={this.props.handleClose}>Cancel</Button>
                            </div>
                        </div>

                    </Form>

                </div>
            </div>


        );
    }
}


