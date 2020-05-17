import React, {Component} from 'react';
import "../../../App.css";
import {
    deleteLayer,
    getLayer,
    editLayer,
    addLayer,
    didyoumean,
    getVendorCompanySuggestions, updateSubmission,
} from "../../../services/service";
import {Button, Form, Input, message, Select, Tag, Tooltip} from "antd";
import {EditOutlined,CloseCircleOutlined,CheckCircleOutlined} from "@ant-design/icons"
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import arrayMove from "array-move";


const SortableItem = SortableElement(({value, index, onRemove, key}) => <div className="dragsec"
                                                                             style={{padding: 5}}>
    <span style={{fontSize: 13}}>{value}</span>

    <button style={{backgroundColor: 'white', color: 'black', position: 'absolute', right: 10}}
            onClick={() => onRemove(index, key)}>x
    </button>
</div>);

const SortableList = SortableContainer(({items, onRemove}) => {
    return (
        <ul>
            {items.map((item, index) => (
                <SortableItem key={item.id} index={index} value={item.name}
                              onRemove={(index) => onRemove(index, item.id)}/>
            ))}
        </ul>
    );
});


class SubmissionTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            levels: [],
            layers: [],
            clientList: [],
            companyList: [],
            status: "",
            selected: [false],
            employer: "",
            client: "",
            rate: 0,
            marketing_email: "",
            marketing_phone: "",
            vendor_contact:{},
            statusCode: "",
            layer: false,
            hide: false,
            new_vendor_company: '',
            new_companyId: '',
            editSub: false,
            canEdit: false,

        }
    }

    componentDidMount() {
        this.setState({
                employer: this.props.submissionData.employer,
                client: this.props.submissionData.client,
                rate: this.props.submissionData.rate,
                marketing_email: this.props.submissionData.email,
                marketing_phone: this.props.submissionData.phone,
            vendor_contact: this.props.submissionData.vendor_contact,
            }, () => this.getLayer(this.props.submissionData.id)
        )
    };

    handleCancel = () => {
        this.setState({
            employer: this.props.submissionData.employer,
            client: this.props.submissionData.client,
            rate: this.props.submissionData.rate,
            marketing_email: this.props.submissionData.email,
            marketing_phone: this.props.submissionData.phone,
            vendor_contact: this.props.submissionData.vendor_contact,
            editSub: false,
            canEdit: false,
        })

    }

    //assign new company layer
    onSelectNewCompany(data) {
        this.setState({
            new_vendor_company: data.split(",")[1],
            new_companyId: data.split(",")[0]
        })

    }

    //get all company suggestions
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
                });
            })
            .catch(error => {
                console.log(error)
            });
    };

    //add Layer
    addLayer() {
        let sub_id = this.props.submissionData.id
        const body = {
            'submission': sub_id,
            'company': parseInt(this.state.new_companyId)
        }
        console.log(body)
        addLayer(body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                console.log(status)
                let level = {}
                level = {
                    'level': res.result.level,
                    'id': res.result.id,
                    'name': res.result.vendor_company.name
                }
                this.state.layers.push(res.result)
                this.state.levels.push(level)
                this.setState({statusCode: status, hide: false})
                message.success("Vendor Added")
            })
            .catch(error => {
                console.log(error)
            });

    }

    //edit Layer
    onSortEnd = ({oldIndex, newIndex}) => {
        console.log(oldIndex)
        console.log(newIndex)
        let item = this.state.levels
        this.setState(({levels}) => ({
            levels: arrayMove(levels, oldIndex, newIndex)
        }));
        console.log(this.state.levels)
        let sub_id = this.props.submissionData.id
        const body = {

            'data': this.state.levels
        }
        console.log(body)
        editLayer(sub_id, body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                message.success("Vendor Updated")
            })
            .catch(error => {
                console.log(error)
            });
    };
    //remove Layer
    remove = (index, id) => {
        console.log("remove", index, id)
        const items = this.state.levels;
        items.splice(index, 1);

        this.setState({levels: this.state.levels})
        deleteLayer(id)
            .then((response) => {

                const statusCode = response.status;
                if (statusCode === 204) {
                    message.success("Vendor Deleted.")
                } else {
                    message.error("Something went wrong.")
                }
            })

            .catch(error => {
                console.log(error)
            });
    };
    //get Layer
    getLayer = (id) => {
        getLayer(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(status)
                let level = {
                    'level': 0,
                    'id': '',
                    'name': ''
                }
                let levels = []
                res.results.map((item, i) => {
                    level = {
                        'level': item.level,
                        'id': item.id,
                        'name': item.vendor_company.name
                    }
                    levels.push(level)

                })
                console.log(levels)
                this.setState({
                    levels: levels,
                    layers: res.results,
                    statusCode: status
                })
            })
            .catch(error => {
                console.log(error)
            });
    };

    //client did you mean
    didYouMean=(client)=> {
        didyoumean(client)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log("didyoumean response", res)
                if (status === 200) {
                    this.setState({
                        clientList: res.result
                    })
                } else {
                    message.error("Something Went Wrong!")
                }

            })
            .catch(error => {
                console.log(error)
            });
    };

    // Select client based on did you mean
    onSelectClient=(data, i)=> {
        console.log(data)
        let selected = [];
        selected[i] = true
        this.setState({
            client: data,
            selected: selected,
        })

    } ;

    //edit Submission
    editSubmission=()=> {
        const body = {
            'sub_id': this.props.submissionData.id,
            'client': this.state.client,
            'rate': this.state.rate,
            'employer': this.state.employer,
            'email': this.state.marketing_email,
            'phone': this.state.marketing_phone,

        };
        console.log(body)
        updateSubmission(body, this.props.submissionData.id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 202) {
                    console.log(res)
                    this.setState({
                        employer: this.state.employer,
                        client: this.state.client,
                        rate: this.state.rate,
                        marketing_email: this.state.marketing_email,
                        marketing_phone: this.state.marketing_phone,
                        editSub: false,
                        canEdit: false,
                    })
                    message.success("Submission Updated.")


                } else {
                    message.error("Something went wrong.")
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }
    onSelectEmployer = (data) => {
        this.setState({
            employer: data
        })
    }
    setEdit = () => {
        this.setState({
            editSub: true
        })
    }
    setCanEdit = () => {
        this.setState({
            canEdit: true
        })
    }


    render() {
        const data = JSON.parse(localStorage.getItem('DATA'));
        const company = data.team;
        const role = data.roles;
        const marketer = data.employee_name;
        return (
            <div>
                {this.props.is_active && this.props.canEdit === "sub" && <EditOutlined type="edit" onClick={this.setEdit}/>}
                {this.props.canEdit !== "sub" && <EditOutlined onClick={this.setCanEdit}/>}
                {this.state.editSub ?
                    <div>
                        <Form.Item label="Employer:">

                            <Select value={this.state.employer} onChange={this.onSelectEmployer}
                                    className="form-control">
                                <Select.Option key={company.toLowerCase() === 'consultadd' ? '0' : '1'}
                                               value={company}>{company}</Select.Option>

                                {company.toLowerCase() !== 'consultadd' ? this.state.employer.toLowerCase() !== company.toLowerCase() ?
                                    <Select.Option key={this.state.employer}
                                                   value={this.state.employer}>{this.state.employer}</Select.Option> : null
                                    : null}
                                {/*{company.toLowerCase() === 'consultadd' || this.state.employer.toLowerCase() !== 'consultadd' ?*/}
                                {/*    <Select.Option key="0" value="consultadd">Consultadd2</Select.Option> : null}*/}

                            </Select>

                        </Form.Item>
                        <Form.Item label="Client:">

                            <div>
                                <Input name="client" onChange={this.handleChange}
                                       value={this.state.client} style={{width: '100%'}}
                                       onBlur={() => this.didYouMean(this.state.client)}/>
                                {this.state.clientList.length !== 0 &&
                                <div className="view_sub_btnnew"><span>Did you mean:</span>
                                    <div style={{borderWidth: 1, borderColor: 'black'}}>

                                        {this.state.clientList.map((tag, index) => {
                                            const isLongTag = tag > 20;
                                            const tagElem = (
                                                <div style={{
                                                    color: this.state.selected[index] ? 'white' : '#007ae2',
                                                    backgroundColor: this.state.selected[index] ? '#007ae2' : 'white'
                                                }} onClick={() => this.onSelectClient(tag, index)}>
                                                    <Tag
                                                        style={{
                                                            width: '20%',
                                                            fontSize: 9,
                                                            marginTop: '8px',
                                                            color: this.state.selected[index] ? 'white' : '#007ae2',
                                                            backgroundColor: this.state.selected[index] ? '#007ae2' : 'white'
                                                        }}
                                                        key={tag} closable={false}>
                                                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                    </Tag>
                                                </div>
                                            );

                                            return isLongTag ? (
                                                <Tooltip title={tag} key={tag}>
                                                    {tagElem}
                                                </Tooltip>
                                            ) : (
                                                tagElem
                                            );
                                        })}

                                    </div>
                                </div>}
                            </div>

                        </Form.Item>
                        <Form.Item label="Rate:(Only Number)">

                            <Input
                                name="rate"
                                onChange={this.handleChange}
                                value={this.state.rate}
                                addonBefore="$"
                                placeholder="$"
                                style={{width: '100%'}}/>


                        </Form.Item>
                        {
                            this.state.vendor_contact === null ?
                                <Form.Item label="Vendor Contact:">

                                    Hidden

                                </Form.Item>  :
                                <Form.Item label="Vendor Contact:">

                                    Email: {this.state.vendor_contact.email}
                                    Name: {this.state.vendor_contact.name}
                                    Number:{this.state.vendor_contact.number}

                                </Form.Item>
                        }
                        <Form.Item label="Marketer Email:">

                            <Input
                                name="marketing_email"
                                onChange={this.handleChange}
                                value={this.state.marketing_email} style={{width: '100%'}}/>


                        </Form.Item>
                        <Form.Item label="Marketer Phone:">

                            <Input
                                name="marketing_phone"
                                onChange={this.handleChange}
                                value={this.state.marketing_phone}
                                style={{width: '100%'}}/>


                        </Form.Item>
                        {(this.state.statusCode === 200 || this.state.statusCode === 201) &&
                        <div>
                            <p>Vendor Layers</p>
                            <div className="newviewlead">
                                <SortableList items={this.state.levels}
                                              onSortEnd={this.onSortEnd}
                                              onRemove={(index, id) => this.remove(index, id)}/>
                            </div>
                            {!this.state.hide &&
                            <Button
                                onClick={() => this.setState({layer: true, hide: true})}>Add More</Button>}

                            {this.state.layer && this.state.hide &&
                            <div>
                                <br/>
                                <span>Vendor Company:</span>
                                <br/>
                                <Select
                                    //allowClear
                                    showSearch
                                    value={this.state.new_vendor_company}
                                    style={{width: '60%'}}
                                    placeholder="Vendor company"
                                    optionFilterProp="children"
                                    onChange={(e) => this.onSelectNewCompany(e)}
                                    onSelect={(e) => this.onSelectNewCompany(e)}
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
                                <CheckCircleOutlined className="formbutton" variant="outlined"
                                      style={{fontSize: 20, color: 'green', marginLeft: '10px'}}
                                      onClick={() => {
                                          console.log(this.state.new_companyId, this.state.new_vendor_company)
                                          this.addLayer()
                                      }
                                      }/>
                                <CloseCircleOutlined className="formbutton" variant="outlined"
                                      style={{fontSize: 20, color: 'red', marginLeft: '10px'}}
                                      onClick={() => {
                                          this.setState({hide: false})
                                      }
                                      }/>
                                {/*<Icon type="plus-circle" className="formbutton" variant="outlined"*/}
                                {/*color="secondary"*/}
                                {/*onClick={() => {*/}
                                {/*this.setState({addCompany: true})*/}
                                {/*}*/}
                                {/*}/>*/}

                            </div>


                            }
                        </div>
                        }
                        <div className="formbutoon2">

                            <Button onClick={this.handleCancel}>Cancel</Button>
                            <Button onClick={this.editSubmission}>Submit</Button>
                        </div>
                    </div>
                    :
                    this.state.canEdit?
                    <div>
                        <Form.Item label="Employer:">

                            <Select value={this.state.employer} onChange={this.onSelectEmployer}
                                    className="form-control">
                                <Select.Option key={company.toLowerCase() === 'consultadd' ? '0' : '1'}
                                               value={company}>{company}</Select.Option>

                                {company.toLowerCase() !== 'consultadd' ? this.state.employer.toLowerCase() !== company.toLowerCase() ?
                                    <Select.Option key={this.state.employer}
                                                   value={this.state.employer}>{this.state.employer}</Select.Option> : null
                                    : null}
                                {/*{company.toLowerCase() === 'consultadd' || this.state.employer.toLowerCase() !== 'consultadd' ?*/}
                                {/*    <Select.Option key="0" value="consultadd">Consultadd2</Select.Option> : null}*/}

                            </Select>

                        </Form.Item>
                        <Form.Item label="Client:">

                            <div>
                                <Input name="client" onChange={this.handleChange}
                                       value={this.state.client} style={{width: '100%'}}
                                       onBlur={() => this.didYouMean(this.state.client)}/>
                                {this.state.clientList.length !== 0 &&
                                <div className="view_sub_btnnew"><span>Did you mean:</span>
                                    <div style={{borderWidth: 1, borderColor: 'black'}}>

                                        {this.state.clientList.map((tag, index) => {
                                            const isLongTag = tag > 20;
                                            const tagElem = (
                                                <div style={{
                                                    color: this.state.selected[index] ? 'white' : '#007ae2',
                                                    backgroundColor: this.state.selected[index] ? '#007ae2' : 'white'
                                                }} onClick={() => this.onSelectClient(tag, index)}>
                                                    <Tag
                                                        style={{
                                                            width: '20%',
                                                            fontSize: 9,
                                                            marginTop: '8px',
                                                            color: this.state.selected[index] ? 'white' : '#007ae2',
                                                            backgroundColor: this.state.selected[index] ? '#007ae2' : 'white'
                                                        }}
                                                        key={tag} closable={false}>
                                                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                    </Tag>
                                                </div>
                                            );

                                            return isLongTag ? (
                                                <Tooltip title={tag} key={tag}>
                                                    {tagElem}
                                                </Tooltip>
                                            ) : (
                                                tagElem
                                            );
                                        })}

                                    </div>
                                </div>}
                            </div>

                        </Form.Item>
                        <Form.Item label="Rate:(Only Number)">

                            <Input
                                name="rate"
                                onChange={this.handleChange}
                                value={this.state.rate}
                                addonBefore="$"
                                placeholder="$"
                                style={{width: '100%'}}/>


                        </Form.Item>
                        <Form.Item label="Marketer Email:">

                            {this.state.marketing_email}

                        </Form.Item>
                        <Form.Item label="Marketer Phone:">

                            {this.state.marketing_phone}

                        </Form.Item>
                        {
                            this.state.vendor_contact === null ?
                                <Form.Item label="Vendor Contact:">

                                    Hidden

                                </Form.Item>  :
                                <Form.Item label="Vendor Contact:">

                                    Email: {this.state.vendor_contact.email}
                                    Name: {this.state.vendor_contact.name}
                                    Number:{this.state.vendor_contact.number}

                                </Form.Item>
                        }

                        <Form.Item label="Vendor Layers:">

                            <ul>
                                {this.state.levels.map((layer, i) =>
                                    <li>
                                        <span><p>{layer.name}</p> Level:{layer.level}</span>
                                    </li>)}
                            </ul>
                        </Form.Item>
                        <div className="formbutoon2">

                            <Button onClick={this.handleCancel}>Cancel</Button>
                            <Button onClick={this.editSubmission}>Submit</Button>
                        </div>

                    </div>:
                        <div>
                            <Form.Item label="Employer:">

                                {this.state.employer}

                            </Form.Item>
                            <Form.Item label="Marketer Email:">

                                {this.state.marketing_email}

                            </Form.Item>
                            <Form.Item label="Marketer Phone:">

                                {this.state.marketing_phone}

                            </Form.Item>
                            <Form.Item label="Client:">

                                {this.state.client}

                            </Form.Item>
                            {
                                this.state.vendor_contact === null ?
                                    <Form.Item label="Vendor Contact:">

                                        Hidden

                                    </Form.Item>  :
                                    <Form.Item label="Vendor Contact:">

                                        Email: {this.state.vendor_contact.email}
                                        Name: {this.state.vendor_contact.name}
                                        Number:{this.state.vendor_contact.number}

                                    </Form.Item>
                            }
                            <Form.Item label="Rate:">

                                ${this.state.rate}

                            </Form.Item>
                            <Form.Item label="Vendor Layers:">

                                <ul>
                                    {this.state.levels.map((layer, i) =>
                                        <li>
                                            <span><p>{layer.name}</p> Level:{layer.level}</span>
                                        </li>)}
                                </ul>
                            </Form.Item>


                        </div>
                }
            </div>

        )
    }
}

export default SubmissionTab;
