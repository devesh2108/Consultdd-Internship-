import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import {
    Form, Input, Select, Tag, Tooltip,message
} from 'antd';
import {
    getVendorCompanySuggestions,
    addLead,
    getAllVendorByCompany, getCities, jdParser,
} from "../../../services/service";


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

class AddLead extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            error: null,
            vendor: '',
            status: 0,
            companyId: 0,
            leadId: 0,
            vendorList: [],
            jobDesc: '',
            location: '',
            company: '',
            addCompany: false,
            addVendor: false,
            companyList: [],
            vendorId: null,
            skill: '',
            jobTitle: '',
            cityList: [],
            parseCityList: [],
            selected: [false],
            companyValid:false,
            jdValid:false,
            locationValid:false,
            skillValid:false,
            jtValid:false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.getCompanySuggestions = this.getCompanySuggestions.bind(this);
        this.getCitySuggestions = this.getCitySuggestions.bind(this);
        this.onSelectCompany = this.onSelectCompany.bind(this);
        this.selectCompany = this.selectCompany.bind(this);
        this.onSelectSkill = this.onSelectSkill.bind(this);
        this.onSelectCity = this.onSelectCity.bind(this);
        this.selectVendor = this.selectVendor.bind(this);
        this.parser = this.parser.bind(this);
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
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });

    }

    componentWillMount() {
        this.getCompanySuggestions("")
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
            company: data.split(",")[1],
            companyId: data.split(",")[0],
            companyValid:false
        })
        //this.setState({companyId:id})
        this.getAllVendorByCompany(data.split(",")[0])
    }

    onSelectCity(data) {
        console.log(data)
        this.setState({
            location: data,
            locationValid:false
        })

    }

    onSelectSkill(data, i) {
        console.log(data)
        let selected = [];
        selected[i] = true
        this.setState({
            skill: data,
            selected: selected,
            skillValid:false,
        })

    }

    handleChange(event) {
        console.log("handle change", event.target.value)

        this.setState({
            [event.target.name]: event.target.value,
            companyValid:false,
            jdValid:false,
            skillValid:false,
            locationValid:false,
            jtValid:false,
        })
    };

    handleClose = () => {
        this.setState({open: false, addCompany: false, addVendor: false});

    };

    addLead(company, id, flag) {
        console.log(company)
        const body = {
            'job_desc': this.state.jobDesc,
            'location': this.state.location,
            'skill': this.state.skill,
            'job_title': this.state.jobTitle,
            'vendor_company': company,
            "status": 'new'
        };
        if (company && this.state.jobDesc && this.state.location && this.state.skill && this.state.jobTitle) {
            addLead(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    if(status === 201){
                        if (flag) {
                            this.props.getLead(res.result)
                            this.props.changeStepCount(2, res.result.id, id);
                        }
                        else {
                            message.success("Requirement Added.")
                            this.props.getLead(res.result)
                            this.props.handleClose()
                        }
                    }
                    else{
                        message.error("Something went wrong.")
                    }

                })
                .catch(error => {
                    console.log(error)
                });
        } else {
            if (company === 0) {
                this.setState({companyValid:true})
            }
             if (this.state.jobDesc === '') {
                this.setState({jdValid:true})
            }
             if (this.state.skill === '') {
                this.setState({skillValid:true})
            }
             if (this.state.location === '') {
                this.setState({locationValid:true})
            }
             if (this.state.jobTitle === '') {
                this.setState({jtValid:true})
            }
        }

    }

    selectCompany(obj) {
        console.log("obj", obj)
        this.state.companyList.push(obj)
        this.setState({
            company: obj.name,
            companyId: obj.id,
            companyValid:false

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
                    error: res.error || null,
                    loading: false,
                });

                this.setState({status: status})
            })
            .catch(error => {
                console.log(error)
            });

    }

    parser(value) {
        console.log(value)
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
                this.setState({
                    jobTitle: res.results.ROLE,
                    parseCityList: res.results.LOCATION
                })
                if (res.results.LOCATION.length === 0) {
                    this.getCitySuggestions()
                }

            })
            .catch(error => {
                console.log(error)
            });

    }

    render() {
        console.log(this.state.jobDesc)
        return (

            <div className="addleadform">
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <div className="testform">

                        <Form layout='vertical'>
                            <Button style={{
                                backgroundColor: this.state.jobDesc !== undefined && this.state.jobDesc !== '' ?
                                    'green' : 'gray',
                                zIndex: 10
                             }}
                                    onClick={() => {
                                        console.log(this.state.jobDesc)

                                        if (this.state.jobDesc !== undefined && this.state.jobDesc !== '') {
                                            this.parser(this.state.jobDesc)
                                        }
                                    }
                                    }>Parse</Button>

                            <Form.Item label={<span><span style={{color:'red',fontSize:9}}>*</span> Job Description</span>}>

                                    <div>
                                    <TextArea
                                        onChange={this.handleChange}
                                        name="jobDesc"
                                        value={this.state.jobDesc}
                                        placeholder="Job Description" className="nweleadjd"
                                              style={{width: '100%'}}
                                              autosize={{minRows: 10, maxRows: 25}}/>
                                    </div>
                                {this.state.jdValid && <label><span style={{color:'red',fontSize:11}}>Job Description cannot be null</span></label>}
                            </Form.Item>

                        </Form>

                    </div>
                <div>

                    <label><span style={{color:'red',fontSize:9}}>*</span>Primary Skill:</label>
                    <div style={{borderWidth: 1, borderColor: 'black'}}>

                        {skillList.map((tag, index) => {
                            const isLongTag = tag.value > 20;
                            const tagElem = (
                                <div onClick={() => this.onSelectSkill(tag.value, index)}>
                                    <Tag
                                        style={{
                                            width: '20%',
                                            fontSize: 11,
                                            marginTop:'8px',
                                            color: this.state.selected[index] ? 'white' : '#007ae2',
                                            backgroundColor: this.state.selected[index] ? '#007ae2' : 'white'
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
                    
                     {this.state.skillValid && <label style={{ width:'100%' }}> <span style={{color:'red',fontSize:11}}>Select a skill</span> </label>}

                  </div>

                </div>

                <div class="col-md-6 col-sm-6 col-xs-12">
                    <div className="testform testformright">
                        <div class="row">
                            <div class="col-md-12">
                                <Form.Item label={<span><span style={{color:'red',fontSize:9}}>*</span> Job Location</span>}>
                                    
                                    <div style={{borderWidth: 1, borderColor: 'black'}}>
                                        {this.state.parseCityList.map((tag, index) => {
                                            const isLongTag = tag.name.length > 20;
                                            const tagElem = (
                                                <div onClick={() => this.onSelectCity(tag.name)}>
                                                    <Tag className="view_sec_tab"
                                                         key={tag.name} closable={false}>
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
                                        showSearch
                                        value={this.state.location}
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
                                    {this.state.locationValid && <label>
                                        <span style={{color:'red',fontSize:11}}>Job Location Cannot be empty</span>
                                    </label>}
                                </Form.Item>

                                <br/>

                                <label>
                                    <span style={{color:'red',fontSize:9}}>*</span> Job Title:
                                    <input
                                        required
                                        id="outlined-required"
                                        className="form-control"
                                        placeholder="Job Title"
                                        name="jobTitle"
                                        value={this.state.jobTitle}
                                        onChange={this.handleChange}/>
                                    {this.state.jtValid && <label><span style={{color:'red',fontSize:11}}>Job Title Cannot be empty</span></label>}
                                </label>

                                <div className="row">

                                    <div class="col-md-12 col-sm-6 col-xs-12">

                                        <div className="VCompany">
                                            <label> <span style={{color:'red',fontSize:9}}>*</span> Vendor Company: </label>
                                            <Select
                                                //allowClear
                                                showSearch
                                                value={this.state.company}
                                                style={{width: '90%'}}
                                                placeholder="Vendor company"
                                                optionFilterProp="children"
                                                onChange={(e) => this.onSelectCompany(e)}
                                                onSelect={(e) => this.onSelectCompany(e)}
                                                onSearch={(e) => this.getCompanySuggestions(e)}
                                            >
                                                {this.state.companyList.map((item, i) => (
                                                 <Select.Option
                                                        value={item.id + "," + item.name}>{item.name}</Select.Option>
                                                ))}
                                                </Select>

                                          {/*<Icon className="formbutton" variant="outlined" color="secondary"*/}
                                                    {/*onClick={() => this.setState({addCompany: true})}>*/}
                                                    {/*add*/}
                                                {/*</Icon>*/}
                                        </div>
                                        {this.state.companyValid && <label><span style={{color:'red',fontSize:11}}>Select Vendor Company</span></label>}

                                    </div>



                                </div>



                                {/*{this.state.vendorList.length != 0 ?*/}
                                    {/*<div>*/}
                                        {/*<div className="col-md-12 col-md-12 col-xs-12">*/}
                                            {/*<div className="row">*/}
                                                {/*<div className="vname">*/}
                                                    {/*<label> Vendor Contact: </label>*/}
                                                    {/*<Select*/}
                                                        {/*//showSearch*/}
                                                        {/*allowClear*/}
                                                        {/*style={{width: '100%'}}*/}
                                                        {/*placeholder="Select vendor"*/}
                                                        {/*optionFilterProp="children"*/}
                                                        {/*onChange={(e) => this.setState({vendorId: e})}*/}
                                                        {/*onSelect={(e) => this.setState({vendorId: e})}*/}
                                                    {/*>*/}
                                                        {/*{this.state.vendorList.map((item, i) => (*/}
                                                            {/*<Select.Option value={item.id}>{item.name}</Select.Option>*/}
                                                        {/*))}*/}
                                                    {/*</Select>*/}
                                                    {/*<Icon className="new_vendor" variant="outlined" color="secondary"*/}
                                                        {/*onClick={() => this.setState({addVendor: true})}>*/}
                                                        {/*add*/}
                                                    {/*</Icon>*/}
                                                {/*</div>*/}
                                            {/*</div>*/}
                                          {/*</div>*/}

                                        {/*<div className="col-md-12">*/}
                                            {/*<div className="row">*/}
                                                {/*{console.log(this.state.addVendor)}*/}
                                                {/*{this.state.addVendor &&*/}
                                                {/*<Drawer*/}
                                                    {/*title="Add New Vendor"*/}
                                                    {/*width={320}*/}
                                                    {/*onClose={this.handleClose}*/}
                                                    {/*visible={this.state.addVendor}*/}
                                                {/*>*/}
                                                    {/*<CreateVendorData*/}
                                                        {/*handleClose={this.handleClose}*/}
                                                        {/*companyName={this.state.company}*/}
                                                        {/*companyId={this.state.companyId}*/}
                                                        {/*vendorList={this.state.vendorList}*/}
                                                        {/*selectVendor={this.selectVendor}*/}
                                                    {/*/>*/}
                                                {/*</Drawer>}*/}
                                            {/*</div>*/}
                                        {/*</div>*/}

                                    {/*</div>*/}
                                    {/*:*/}
                                    {/*this.state.companyId != '' ?*/}

                                        {/*<div className="col-md-12" id="vendorn">*/}
                                            {/*<div className="row">*/}

                                                {/*<label>*/}
                                                    {/*Vendor Contact:*/}
                                                    {/*<Icon className="new_vendor" variant="outlined" color="secondary"*/}
                                                            {/*onClick={() => this.setState({addVendor: true})}>*/}
                                                        {/*add*/}
                                                    {/*</Icon>*/}
                                                {/*</label>*/}

                                                {/*{console.log(this.state.addVendor)}*/}
                                                {/*{this.state.addVendor &&*/}
                                                {/*<Drawer*/}
                                                    {/*title="Add New Vendor"*/}
                                                    {/*width={320}*/}
                                                    {/*onClose={this.handleClose}*/}
                                                    {/*visible={this.state.addVendor}*/}
                                                {/*>*/}
                                                {/*<CreateVendorData*/}
                                                                  {/*handleClose={this.handleClose}*/}
                                                                  {/*companyName={this.state.company}*/}
                                                                  {/*companyId={this.state.companyId}*/}
                                                                  {/*vendorList={this.state.vendorList}*/}
                                                                  {/*selectVendor={this.selectVendor}*/}
                                                {/*/>*/}
                                                {/*</Drawer>}*/}
                                                {/**/}
                                            {/*</div>*/}
                                        {/*</div>*/}

                                        {/*: null*/}
                                {/*}*/}


                                {/*<div>*/}


                                    {/*{this.state.addCompany &&*/}
                                    {/*<Drawer*/}
                                        {/*title="Add New Company"*/}
                                        {/*width={320}*/}
                                        {/*onClose={this.handleClose}*/}
                                        {/*visible={this.state.addCompany}*/}
                                    {/*>*/}
                                        {/*<CreateVendorCompany*/}
                                            {/*modalIsOpen={this.state.addCompany}*/}
                                            {/*handleClose={this.handleClose}*/}
                                            {/*selectCompany={this.selectCompany}*/}
                                        {/*/>*/}
                                    {/*</Drawer>*/}
                                    {/*// <Modal*/}
                                    {/*//     isOpen={this.state.addCompany}*/}
                                    {/*//     //onRequestClose={this.handleClose}*/}
                                    {/*//     ariaHideApp={false}*/}
                                    {/*//     contentLabel="Add Company"*/}
                                    {/*//     style={{*/}
                                    {/*//         overlay: {*/}
                                    {/*//             position: 'fixed',*/}
                                    {/*//             top: 0,*/}
                                    {/*//             left: 0,*/}
                                    {/*//             right: 0,*/}
                                    {/*//             bottom: 0,*/}
                                    {/*//             backgroundColor: 'rgba(255, 255, 255, 0.5)'*/}
                                    {/*//         },*/}
                                    {/*//         content: {*/}
                                    {/*//             position: 'absolute',*/}
                                    {/*//             top: '200px',*/}
                                    {/*//             width: '25%',*/}
                                    {/*//             height: '40%',*/}
                                    {/*//             left: '0px',*/}
                                    {/*//             right: '0px',*/}
                                    {/*//             bottom: '4xs0px',*/}
                                    {/*//             border: '3px solid #ccc',*/}
                                    {/*//             background: '#fff',*/}
                                    {/*//             overflow: 'auto',*/}
                                    {/*//             WebkitOverflowScrolling: 'touch',*/}
                                    {/*//             borderRadius: '10px',*/}
                                    {/*//             outline: 'none',*/}
                                    {/*//             padding: '10px'*/}
                                    {/*//         }*/}
                                    {/*//     }}*/}
                                    {/*// >*/}
                                    {/*//     <Icon style={{position: 'absolute', top: 10, right: 12}}*/}
                                    {/*//           onClick={this.handleClose}>cancel</Icon>*/}
                                    {/*//     <CreateVendorCompany*/}
                                    {/*//         modalIsOpen={this.state.addCompany}*/}
                                    {/*//         handleClose={this.handleClose}*/}
                                    {/*//         selectCompany={this.selectCompany}*/}
                                    {/*//     />*/}
                                    {/*//     <br/>*/}
                                    {/*// </Modal>*/}
                                    {/*}*/}
                                {/*</div>*/}


                            </div>


                        </div>
                    </div>

                </div>

                <br/>

                <div className="col-md-12">
                    <div className="savenextbutton">
                        <Button variant="outlined" color="primary"
                                onClick={() => this.addLead(this.state.companyId, this.state.vendorId, false)}>
                            Save and Exit
                        </Button>
                        <Button className="rightbutton" variant="outlined" color="primary"
                                onClick={() => this.addLead(this.state.companyId, this.state.vendorId, true)}>
                            Save and Submit Resume
                        </Button>
                    </div>
                </div>
            </div>

        );
    }
}

const AddLeadForm = Form.create({name: 'dynamic_rule'})(AddLead);

export default class ViewLead extends Component {
    constructor(props, context) {
        super(props, context);

    }

    render() {
        return <AddLeadForm getLead={this.props.getLead} handleClose={this.props.handleClose}
                            changeStepCount={this.props.changeStepCount}/>
    }
}
