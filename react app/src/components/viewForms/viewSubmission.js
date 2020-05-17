import React, {Component} from 'react';
import {
    Form, Input, Button, Select, Popconfirm, Upload, Drawer, message, Tag, Tooltip
} from 'antd';
import {PlusCircleOutlined,CheckCircleOutlined,CloseCircleOutlined,UploadOutlined,FileOutlined,DownloadOutlined,InfoCircleOutlined,DeleteOutlined} from "@ant-design/icons"
import {
    updateSubmission, getUniqueSubmission, editResume, deleteAttachment, addAttachment,
    getAllVendorByCompany, getVendorCompanySuggestions, addLayer, getLayer, editLayer, deleteLayer, didyoumean
} from "../../services/service";
import CreateVendorData from "../createForms/vendorForm/createVendorData";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import arrayMove from "array-move";
import {BASE_URL} from "../../services/httpService";

const server_url = BASE_URL;
const {TextArea} = Input;


const SortableItem = SortableElement(({value, index, onRemove, key, disabled}) => <div className="dragsec"
                                                                                       style={{padding: 5}}>
    <span style={{fontSize: 13}}>{value}</span>

    <button disabled={disabled} style={{backgroundColor: 'white', color: 'black', position: 'absolute', right: 10}}
            onClick={() => onRemove(index, key)}>x
    </button>
</div>);

const SortableList = SortableContainer(({items, onRemove, disabled}) => {
    return (
        <ul>
            {items.map((item, index) => (
                <SortableItem disabled={disabled} key={item.id} index={index} value={item.name}
                              onRemove={(index) => onRemove(index, item.id)}/>
            ))}
        </ul>
    );
});


class Submission extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            job_desc: '',
            location: '',
            job_title: '',
            client: '',
            consultant__consultant__name: '',
            employer: '',
            rate: 0,
            resume: null,
            file: new FormData(),
            vendor_company: '',
            vendor_name: '',
            vendor_contact: '',
            vendor_email: '',
            status: 0,
            flag: false,
            attachment_id: 0,
            attachment_type: 'resume',
            attachments: [],
            fileList: [],
            companyList: [],
            vendorList: [],
            companyId: null,
            vendorId: null,
            addCompany: false,
            addVendor: false,
            disabled: false,
            marketing_email: null,
            marketing_phone: null,
            layer: false,
            layers: [],
            new_vendor_company: '',
            new_companyId: '',
            hide: false,
            statusCode: null,
            edit: [false],
            levels: [],
            items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"],
            clientList: [],
            selected: [false],

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.editSubmission = this.editSubmission.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.getCompanySuggestions = this.getCompanySuggestions.bind(this);
        this.onSelectCompany = this.onSelectCompany.bind(this);
        this.onSelectVendor = this.onSelectVendor.bind(this);
        this.getAllVendorByCompany = this.getAllVendorByCompany.bind(this);
        this.editLayer = this.editLayer.bind(this);
        this.editLayerInput = this.editLayerInput.bind(this);
        this.remove = this.remove.bind(this);
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        console.log(oldIndex)
        console.log(newIndex)
        let item = this.state.levels
        this.setState(({levels}) => ({
            levels: arrayMove(levels, oldIndex, newIndex)
        }));
        console.log(this.state.levels)
        let sub_id = this.props.submission_details.results.id
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

    componentDidMount() {
        const company = localStorage.getItem('TEAM');
        console.log("---------", this.props.submission_details)
        console.log("-----*********layers----", this.props.layers)
        this.getLayer(this.props.submission_details.results.id)
        const marketer = localStorage.getItem('NAME');
        console.log(marketer)
        console.log(this.props.submission_details)
        this.props.submission_details.results.attachments.map((item, i) => (
            this.state.attachments.push(item),
            item.attachment_type === 'resume' && item.attachment_file != null ? (

                        this.setState({
                            attachment_id: item.id,
                            resume: item.attachment_file,
                            flag: true
                        })

                )
                : null

        ))
        this.setState({
            vendor_company: this.props.submission_details.results.lead.vendor_company_name,
            employer: this.props.submission_details.results.employer || company,
            companyId: this.props.submission_details.results.lead.vendor_company_id,
            client: this.props.submission_details.results.client,
            disabled: (this.props.submission_details.results.lead.marketer.toLowerCase() !== marketer.toLowerCase())
        })
        if (this.props.submission_details.results.vendor_contact === null) {
            this.setState({
                vendor_name: '',
                vendor_contact: '',
                vendor_email: '',

            })
        }
        else if (this.props.submission_details.results.vendor_contact.length !== 0) {
            this.setState({
                vendorId: this.props.submission_details.results.vendor_contact.id,
                vendor_name: this.props.submission_details.results.vendor_contact.name,
                vendor_contact: this.props.submission_details.results.vendor_contact.number,
                vendor_email: this.props.submission_details.results.vendor_contact.email,


            })
        }
        else {
            this.setState({
                vendor_name: '',
                vendor_contact: '',
                vendor_email: '',

            })
        }

        this.props.form.setFieldsValue({
            location: this.props.submission_details.results.lead.location,
            job_desc: this.props.submission_details.results.lead.job_desc,
            job_title: this.props.submission_details.results.lead.job_title,
            consultant__consultant__name: this.props.submission_details.results.consultant.name,
            rate: this.props.submission_details.results.rate,
            marketing_phone: this.props.submission_details.results.marketing_phone,
            marketing_email: this.props.submission_details.results.marketing_email,

        });
        //this.getCompanySuggestions("");
        if (this.props.submission_details.results.lead.vendor_company_id !== null) {
            this.getAllVendorByCompany(this.props.submission_details.results.lead.vendor_company_id);
        }

    }

    remove(index, id) {
        console.log("remove", index, id)
        const items = this.state.levels;
        items.splice(index, 1);

        this.setState({levels: this.state.levels})
        deleteLayer(id)
            .then((response) => {

                const statusCode = response.status;
                if (statusCode === 204) {
                    message.success("Vendor Deleted.")
                }
                else {
                    message.error("Something went wrong.")
                }
            })

            .catch(error => {
                console.log(error)
            });
    }

    getLayer(id) {
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
                        'name': item.company.name
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
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value})
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

    onSelectNewCompany(data) {
        this.setState({
            new_vendor_company: data.split(",")[1],
            new_companyId: data.split(",")[0]
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

    onSelectNewVendor(data) {
        this.setState({
            new_vendor_name: data.name,
            new_vendor_email: data.email,
            new_vendor_contact: data.number,
            new_vendorId: data.id
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

    addLayer() {
        let sub_id = this.props.submission_details.results.id
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
                    'name': res.result.company.name
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

    editLayerInput(i, name) {
        let a = this.state.edit.slice();
        a[i] = true;
        this.setState({edit: a, new_vendor_company: name})
        // addLayer(body)
        //     .then((response) => {
        //
        //         const statusCode = response.status;
        //         const res = response.json();
        //         return Promise.all([statusCode, res]);
        //     })
        //     .then(([status, res]) => {
        //         console.log(res)
        //     })
        //     .catch(error => {
        //         console.log(error)
        //     });

    }

    editLayer(id, i, name) {
        let sub_id = this.props.submission_details.results.id
        let a = this.state.edit.slice();
        a[i] = true;
        this.setState({edit: a, new_vendor_company: name})
        const body = {

            'company': parseInt(id)
        }
        console.log(body)
        editLayer(sub_id, body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
            })
            .catch(error => {
                console.log(error)
            });

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
                    // vendorId: -1,
                    // vendor_name: '',
                    // vendor_email: '',
                    // vendor_contact: '',
                    error: res.error || null,
                    loading: false,
                });

                this.setState({status: status})
            })
            .catch(error => {
                console.log(error)
            });

    }

    editSubmission() {
        let sub_id = this.props.submission_details.results.id
        const body = {
            'sub_id': this.props.submission_details.results.id,
            'client': this.state.client,
            'rate': this.props.form.getFieldsValue().rate,
            'employer': this.state.employer,
            'vendor_contact': this.state.vendorId,
            'marketing_email': this.props.form.getFieldsValue().marketing_email,
            'marketing_phone': this.props.form.getFieldsValue().marketing_phone,

        };
        console.log(body)
        updateSubmission(body, sub_id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 202) {
                    console.log(res)
                    message.success("Submission Updated.")
                    this.props.onUpdateChange(res.result.id, res.result);
                    this.props.handleClose();
                }
                else {
                    message.error("Something went wrong.")
                }
            })
            .catch(error => {
                console.log(error)
            });

    }

    handleClose() {
        this.setState({addCompany: false, addVendor: false});

    }

    handleChangeFile(event) {
        console.log(event.file)
        const formData = new FormData();
        formData.append("object_id", this.props.submission_details.results.id)
        formData.append("obj_type", "submission");
        formData.append("attachment_type", this.state.attachment_type);
        formData.append('file', event.file);
        addAttachment(formData)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.state.attachments.push(res.result);
                this.setState({flag: true, status: status})
                console.log(this.state.attachments)

            })
            .catch(error => {
                console.log(error)
            });
    }

    deleteAttachment(id) {
        let arr = [];
        deleteAttachment(id)
            .then((response) => {

                const statusCode = response.status;

                arr = this.state.attachments.filter(function (item) {
                    return item.id !== id
                })
                this.setState({attachments: arr})

                return Promise.all([statusCode, response]);
            })
            .catch(error => {
                console.log(error)
            });
    }

    // handleChangeFile(event) {
    //     console.log(event.file)
    //     this.setState({resume: ''})
    //     this.state.new_resume.append('file', event.file);
    //     this.state.new_resume.append('id', this.state.attachment_id);
    //     editResume(this.state.new_resume)
    //         .then((response) => {
    //
    //             const statusCode = response.status;
    //             const res = response.json();
    //             return Promise.all([statusCode, res]);
    //         })
    //         .then(([status, res]) => {
    //             console.log(res)
    //             //this.state.attachments.push(res.result);
    //             this.setState({flag:true})
    //
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         });
    // }
    didYouMean(client) {
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
                }
                else {
                    message.error("Something Went Wrong!")
                }

            })
            .catch(error => {
                console.log(error)
            });
    };

    onSelectClient(data, i) {
        console.log(data)
        let selected = [];
        selected[i] = true
        this.setState({
            client: data,
            selected: selected,
        })

    }

    render() {

        const company = localStorage.getItem('TEAM');
        const {getFieldDecorator} = this.props.form;
        const {attachments, fileList} = this.state
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },

            onChange: file => this.handleChangeFile(file),
            attachments,
            defaultFileList: attachments,
            listType: "picture",
            showUploadList: false
        };
        return (


            <div>
                {console.log(company)}
                <div className="viewsubform">
                    <Form layout='vertical'>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <Form.Item label="Job Description">
                                {getFieldDecorator('job_desc',
                                    {
                                        setFieldsValue: this.state.job_desc
                                    })(
                                    <TextArea className="sub_jd" disabled={true} style={{width: '100%'}}
                                              autosize={{minRows: 10, maxRows: 25}}/>
                                )}
                            </Form.Item>

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Item
                                        label="Job Title:"
                                    >
                                        {getFieldDecorator('job_title',
                                            {
                                                setFieldsValue: this.state.job_title
                                            })(
                                            <Input disabled={true} style={{width: '100%'}}/>
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-md-6">
                                    <Form.Item
                                        label="Job Location:"
                                    >
                                        {getFieldDecorator('location',
                                            {
                                                setFieldsValue: this.state.location
                                            })(
                                            <Input disabled={true} style={{width: '100%'}}/>
                                        )}
                                    </Form.Item>
                                </div>
                            </div>


                            <div className="viewlead22 mainviewlead">

                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <Form.Item
                                        label="Vendor Company:"
                                    >
                                        <Input value={this.state.vendor_company} disabled={true}/>
                                        {/*<Icon*/}
                                        {/*type="info"*/}
                                        {/*className="new_vendor" variant="outlined" color="secondary"*/}
                                        {/*/>*/}


                                        {/*<Input disabled={this.state.vendor_company ? false:true} value={this.state.vendor_company} style={{width: '100%'}}/>*/}
                                    </Form.Item>
                                    <Form.Item
                                        label="Email:"
                                    >
                                        <Input disabled={true}
                                               value={this.state.vendor_email} style={{width: '100%'}}/>
                                    </Form.Item>
                                </div>

                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <Form.Item
                                        label="Contact Name:"
                                    >
                                        <div>

                                            <div>
                                                <div>
                                                    {console.log(this.state.vendor_name)}

                                                    <Select
                                                        //showSearch
                                                        //allowClear
                                                        disabled={this.state.disabled}
                                                        value={this.state.vendor_name}
                                                        style={{width: '90%'}}
                                                        placeholder="Select vendor"
                                                        optionFilterProp="children"
                                                        onChange={(e) => this.onSelectVendor(e)}
                                                        onSelect={(e) => this.onSelectVendor(e)}
                                                    >
                                                        {this.state.vendorList.map((item, i) => (
                                                            <Select.Option key={i}
                                                                           value={item}>{item.name}</Select.Option>
                                                        ))}
                                                    </Select>

                                                    <PlusCircleOutlined
                                                          className="new_vendor" variant="outlined" color="secondary"
                                                          onClick={() => {
                                                              if (!this.state.disabled) {
                                                                  this.setState({addVendor: true})
                                                              }
                                                          }
                                                          }
                                                    />

                                                </div>

                                            </div>


                                            <div className="col-md-12">
                                                <div className="row">
                                                    {console.log(this.state.addVendor)}
                                                    {this.state.addVendor &&
                                                    <Drawer
                                                        title="Add New Vendor"
                                                        width={320}
                                                        className="vendorsecpop"
                                                        onClose={this.handleClose}
                                                        visible={this.state.addVendor}
                                                    >
                                                        <CreateVendorData
                                                            handleClose={this.handleClose}
                                                            companyName={this.state.vendor_company}
                                                            companyId={this.state.companyId}
                                                            vendorList={this.state.vendorList}
                                                            selectVendor={this.selectVendor}
                                                        />
                                                    </Drawer>}
                                                </div>
                                            </div>

                                        </div>


                                        <div>

                                        </div>
                                        {/*<Input disabled={this.state.vendor_name ? false : true}*/}
                                        {/*value={this.state.vendor_name} style={{width: '100%'}}/>*/}
                                    </Form.Item>

                                    <Form.Item
                                        label="Phone:"
                                    >
                                        <Input disabled={true}
                                               value={this.state.vendor_contact} style={{width: '100%'}}/>
                                    </Form.Item>

                                </div>

                            </div>


                            <br clear="all"/>
                            {(this.state.statusCode === 200 || this.state.statusCode === 201) &&
                            <div className="viewlead22 main_view_lead">
                                <p>Vendor Layers</p>
                                <div className="newviewlead">
                                    <SortableList disabled={this.state.disabled} items={this.state.levels}
                                                  onSortEnd={this.onSortEnd}
                                                  onRemove={(index, id) => this.remove(index, id)}/>
                                </div>

                                {!this.state.hide &&
                                <Button disabled={this.state.disabled}
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

                        </div>


                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <Form.Item
                                label="Employer:"
                            >

                                <select value={this.state.employer} onChange={this.handleChange} name="employer"
                                        className="form-control" disabled={this.state.disabled}>
                                    <option key={company.toLowerCase() === 'consultadd' ? '0' : '1'}
                                            value={company}>{company}</option>

                                    {company.toLowerCase() !== 'consultadd' ? this.state.employer.toLowerCase() !== company.toLowerCase() ?
                                            <option key={this.state.employer}
                                                    value={this.state.employer}>{this.state.employer}</option> : null
                                        : null}
                                    {company.toLowerCase() === 'consultadd' || this.state.employer.toLowerCase() !== 'consultadd' ?
                                        <option key="0" value="consultadd">Consultadd</option> : null}

                                </select>

                            </Form.Item>
                            <Form.Item
                                label="Client:"
                            >

                                <div>
                                    <Input disabled={this.state.disabled} name="client" onChange={this.handleChange}
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

                            <Form.Item
                                label="Rate:(Only Number)"
                            >
                                {getFieldDecorator('rate',
                                    {
                                        onChange: this.handleChange,
                                        setFieldsValue: this.state.rate
                                    })(
                                    <Input addonBefore="$" placeholder="$" disabled={this.state.disabled} style={{width: '100%'}}/>
                                )}

                            </Form.Item>
                            <Form.Item

                                label="Marketing Email:"
                            >
                                {getFieldDecorator('marketing_email',
                                    {
                                        onChange: this.handleChange,
                                        setFieldsValue: this.state.marketing_email
                                    })(
                                    <Input disabled={this.state.disabled} style={{width: '100%'}}/>
                                )}

                            </Form.Item>
                            <Form.Item

                                label="Marketer Phone:"
                            >
                                {getFieldDecorator('marketing_phone',
                                    {
                                        onChange: this.handleChange,
                                        setFieldsValue: this.state.marketing_phone
                                    })(
                                    <Input disabled={this.state.disabled} style={{width: '100%'}}/>
                                )}

                            </Form.Item>


                            <Form.Item
                                label="Attachments:"
                            >
                                <div>

                                    <div className="subpopresume">
                                        < Select
                                            disabled={this.state.disabled}
                                            style={{width: '90%', marginRight: '10px'}}
                                            onChange={(e) => this.setState({attachment_type: e})}
                                            value={this.state.attachment_type}>
                                            <Select.Option key="1" value="resume">Resume</Select.Option>
                                            <Select.Option key="2" value="misc">Others</Select.Option>
                                        </Select>

                                        <Upload {...props} disabled={this.state.disabled}>
                                            <UploadOutlined/>
                                        </Upload>
                                    </div>
                                    {console.log("----------------",this.state.attachments)}
                                    <div>
                                        {this.state.attachments.map((item, i) =>
                                            <div>
                                                <div key={item.id} className="subpopresume2">
                                                    <ul>
                                                        <li><FileOutlined/></li>
                                                        <li><span>{item.attachment_file.split("/")[5]}</span></li>
                                              <li>
                                                    <span style={{marginLeft: 15}}>{item.attachment_type}</span>
                                                    <a target="_blank" download style={{marginLeft:3}}
                                                       href={server_url + item.attachment_file}>
                                                        <DownloadOutlined/>
                                                    </a>
                                              </li>
                                                    </ul>
                                                    {item.attachment_type !== "resume" &&
                                                    <Popconfirm
                                                        placement="bottom"
                                                        icon={<InfoCircleOutlined
                                                                    style={{color: 'black', float: 'right'}}/>}
                                                        title="Are you sure you want to delete this file?"
                                                        onCancel={this.cancel}
                                                        onConfirm={() => this.deleteAttachment(item.id)}
                                                        okText="Submit"
                                                        cancelText="Cancel">
                                                        <DeleteOutlined/>
                                                    </Popconfirm>
                                                    }


                                                </div>
                                                <br/><br/>
                                            </div>
                                        )}
                                    </div>

                                </div>

                            </Form.Item>


                        </div>


                        <div className="formbutoon2">

                            <Button onClick={this.props.handleClose}>Cancel</Button>
                            <Button disabled={
                                this.state.disabled
                            }
                                    onClick={this.editSubmission}>Submit</Button>
                        </div>


                    </Form>

                </div>

            </div>


        )
            ;
    }
}

const ViewSubmissionForm = Form.create({name: 'view_submission'})(Submission);

export default class ViewSubmission extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            submission_details: {},
            layers: {},
            status: null,
            flag: null,
        }
        this.getUniqueSubmission = this.getUniqueSubmission.bind(this);

    }

    componentDidMount() {
        this.getUniqueSubmission(this.props.sub_id);

    }

    getUniqueSubmission(id) {
        getUniqueSubmission(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                this.setState({submission_details: res, status: status})
            })
            .catch(error => {
                console.log(error)
            });
    }


    render() {

        return (

            this.state.status === 200 ?

                <ViewSubmissionForm onUpdateChange={this.props.onUpdateChange}
                                    submission_details={this.state.submission_details}
                                    layers={this.state.layers}
                                    handleClose={this.props.handleClose}/>
                : null
        )

    }
}
