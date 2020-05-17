import React, {Component} from 'react';
import {
    Form, Input, Button, DatePicker, Upload, Icon, message, Popconfirm, Checkbox, Select, Modal, Spin
} from 'antd';
import {addAttachment, deleteAttachment, updatePO,} from "../../services/service";
import {BASE_URL,} from "../../services/httpService";
import moment from 'moment-timezone'
import POCancel from './poCancel'
import POTerminate from './poTerminate'

const {TextArea} = Input;
const {confirm} = Modal;
const server_url = BASE_URL;

const PO_STATUS =[
    {name: 'new', value: 'New'},
    {name: 'received', value: 'Received'},
    {name: 'cancelled', value: 'Cancelled'},
    {name: 'signed', value: 'Signed'},
    {name: 'on_boarded', value: 'On Boarded'},
    {name: 'joined', value: 'Joined'},
    {name: 'terminated', value: 'Terminated'},
    {name: 'client-cancelled',value:'Client Cancelled'},
    {name: 'dual-offer',value:'Dual Offer'},
    {name: 'candidate-absconded',value:'Candidate Absconded'},
    {name: 'candidate-denied-rate',value:'Candidate Denied: Rate'},
    {name: 'candidate-denied-location',value:'Candidate Denied: Location'},
    {name: 'candidate-denied-jd',value:'Candidate Denied: JD'},
    {name: 'contract-conflicts',value:'Contract Conflicts'},
    {name: 'client-fired-budget',value:'Client Fired: Budget'},
    {name: 'client-fired-performance',value:'Client Fired: Performance'},
    {name: 'client-fired-security',value:'Client Fired: Security'},
    {name: 'resigned-rate',value:'Resigned: Rate'},
    {name: 'resigned-technology',value:'Resigned: Technology'},
    {name: 'resigned-full_time',value:'Resigned: Full-time'},
    {name: 'resigned-location',Resigned: Location},
    {name: 'completed',value:'Completed'},
    {name: 'extension',value:'Extension'},
]
class TabPo extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            duration: '',
            start_date: '',
            end_date: new Date(),
            payment_term: '10',
            invoicing_period: '7',
            reporting_details: '',
            end_reason: '',
            consultant_joined: null,
            status: '',
            vendor_address: '',
            client_address: '',
            consultant_id: -1,
            flag: '',
            fileList: [],
            uploading: false,
            attachment_type: 'work_order',
            attachments: [],
            msa_status: false,
            wo_status: false,
            clientAdd_status: false,
            vendorAdd_status: false,
            check_list: {},
            disabled: false,
            offer_status: false,
            reporting_details_status: false,
            status_list: [],
            checked: false,
            checked_string: 'Unsigned',
            cancel: false,
            terminate: false,
            cancel_status: false,
            terminat_status: false,
            loading: false

        };
        //console.log(this.props.handleClose)
        this.handleChange = this.handleChange.bind(this);
        this.editPO = this.editPO.bind(this);
        this.handleAttachmentChange = this.handleAttachmentChange.bind(this);
        this.signedCheck = this.signedCheck.bind(this);

    }

    componentDidMount() {
        const data = JSON.parse(localStorage.getItem('DATA'));
        const marketer = data.employee_name;
        this.getStatus();
        this.setState({
            attachments: this.props.poData.attachments,
            duration: this.props.poData.duration,
            check_list: this.props.poData.check_list,
            disabled: this.props.poData.marketer_name.toLowerCase() !== marketer.toLowerCase()
            ||
            ((this.props.poData.status.includes('client')
                || this.props.poData.status.includes('resigned')
                || this.props.poData.status.includes('candidate')
                || this.props.poData.status.includes('other')
                || this.props.poData.status.includes('dual')
                || this.props.poData.status.includes('contract')
            )),
            offer_status: this.props.poData.check_list.status,

        })
        //console.log(this.props.poData.check_list.work_order)
        if (this.props.poData.check_list.msa_signed >= 1) {
            this.setState({msa_status: true})
        }
        if (this.props.poData.check_list.work_order_signed >= 1) {
            this.setState({wo_status: true})
        }
        if (this.props.poData.check_list.client_address >= 1) {
            this.setState({clientAdd_status: true})
        }
        if (this.props.poData.check_list.vendor_address >= 1) {
            this.setState({vendorAdd_status: true})
        }
        if (this.props.poData.check_list.reporting_details >= 1) {
            this.setState({reporting_details_status: true})
        }

        //console.log("---------", this.props.poData)
        this.props.form.setFieldsValue({

            start_date: this.props.poData.start_date === null ? null : moment(this.props.poData.start_date),
            end_date: this.props.poData.end_date === null ? null : moment(this.props.poData.end_date).format("YYYY-MM-DD"),
            payment_term: this.props.poData.payment_term === null ? '10' : this.props.poData.payment_term,
            reporting_details: this.props.poData.reporting_details,
            invoicing_period: this.props.poData.invoicing_period === null ? '7' : this.props.poData.invoicing_period,
            end_reason: this.props.poData.end_reason === undefined ? null : this.props.poData.end_reason,
            consultant_joined: this.props.poData.consultant_joined,
            status: PO_STATUS.map((status,i)=>{if(status.name === this.props.poData.status) return status.value}),
            client_address: this.props.poData.client_address,
            vendor_address: this.props.poData.vendor_address
        });

    }

    getStatus() {
        if (this.props.poData.check_list.status) {
            let status = [
                {name: 'new', value: 'New'},
                {name: 'received', value: 'Received'},
                {name: 'cancelled', value: 'Cancelled'},
                {name: 'signed', value: 'Signed'},
                {name: 'on_boarded', value: 'On Boarded'},
                {name: 'joined', value: 'Joined'},
                {name: 'terminated', value: 'Terminated'},

                // {name: 'client-cancelled'},
                // {name: 'dual-offer'},
                // {name: 'candidate-absconded'},
                // {name: 'candidate-denied-rate'},
                // {name: 'candidate-denied-location'},
                // {name: 'candidate-denied-jd'},
                // {name: 'contract-conflicts'},
                // {name: 'client-fired-budget'},
                // {name: 'client-fired-performance'},
                // {name: 'client-fired-security'},
                // {name: 'resigned-rate'},
                // {name: 'resigned-technology'},
                // {name: 'resigned-full_time'},
                // {name: 'resigned-location'},
                // {name: 'completed'},
                // {name: 'extension'},
            ]
            this.setState({status_list: status})
            // getStatus()
            //  .then((response) => {
            //
            //  const statusCode = response.status;
            //  const res = response.json();
            //  return Promise.all([statusCode, res]);
            //  })
            //  .then(([status, res]) => {
            //
            //  console.log("status", res)
            //  this.setState({status_list: res.results})
            //
            //  })
        }
        else {
            let status = [
                {name: 'new', value: 'New'},
                {name: 'received', value: 'Received'},
                {name: 'cancelled', value: 'Cancelled'},
                {name: 'terminated', value: 'Terminated'},

            ]
            this.setState({status_list: status})
        }
    }

    editPO() {

        const body = {
            "project_id": this.props.poData.id,
            "duration": this.state.duration,
            "start_date": moment(this.props.form.getFieldsValue().start_date).format("YYYY-MM-DD"),
            "end_date": this.props.form.getFieldsValue().end_date === null ? null : moment(this.props.form.getFieldsValue().end_date).format("YYYY-MM-DD"),
            "payment_term": parseInt(this.props.form.getFieldsValue().payment_term),
            "invoicing_period": this.props.form.getFieldsValue().invoicing_period,
            //"end_reason": this.props.form.getFieldsValue().end_reason,
            "consultant_joined": this.state.consultant_joined,
            "status": this.props.form.getFieldsValue().status,
            "reporting_details": this.props.form.getFieldsValue().reporting_details,
            "vendor_address": this.props.form.getFieldsValue().vendor_address,
            "client_address": this.props.form.getFieldsValue().client_address
        }
        //console.log(body)
        if (this.props.form.getFieldsValue().status === 'cancelled') {
            this.showCancelConfirm(this.props.poData.id)

        }
        else if (this.props.form.getFieldsValue().status === 'terminated') {
            this.showTerminateConfirm(this.props.poData.id)

        } else {
            updatePO(body, this.props.poData.id)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    // console.log(res)
                    if (status !== 202) {
                        message.error("Something Went Wrong.")
                    }
                    else {
                        message.success("PO Updated.")
                        this.props.checklistStatus(res.result.check_list, res.result.id)
                        this.props.onUpdateChange(res.result, res.result.id)
                        this.props.handleClose();

                    }

                })
                .catch(error => {
                    console.log(error)
                });
        }

    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value})
        if (event.target.name === 'duration' && event.target.value !== '') {
            let start_date = moment(this.props.form.getFieldsValue().start_date).format("YYYY-MM-DD")
            let end_date = moment(start_date).add(event.target.value || this.props.form.getFieldsValue().duration, 'months')
            //console.log(end_date.format("YYYY-MM-DD"))
            this.props.form.setFieldsValue({

                end_date: end_date.format("YYYY-MM-DD")
            })
        }

    }

    onConsultantChange(value) {
        this.setState({consultant_joined: value})
        //console.log(`selected ${value}`);
    }

    disabledStartDate = (startValue) => {
        const endValue = this.props.form.getFieldsValue().start_date;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() < endValue.valueOf();
    };

    disabledEndDate = (endValue) => {
        const startValue = this.props.form.getFieldsValue().start_date;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onStartChange = (value) => {
        this.props.form.setFieldsValue({
            start_date: value
        });
    };

    onEndChange = (value) => {
        if (value !== '') {
            //console.log("else")
            let start_date = moment(this.props.form.getFieldsValue().start_date).format("YYYY-MM-DD")
            let end_date = moment(value)
            //console.log(end_date)
            //console.log(moment.duration(end_date.diff(start_date)))

        }
        this.props.form.setFieldsValue({
            end_date: value
        });
    };

    handleAttachmentChange = (e) => {
        this.setState({
            attachment_type: e
        });
    };

    cancel(e) {
        message.error('Click on No');
    }

    signedCheck(e) {
        //console.log(`checked = ${e.target.checked}`);
        this.setState({
            checked: e.target.checked,
            checked_string: e.target.checked ? 'Signed' : 'Unsigned'
        })
    }

    showCancelConfirm(id) {
        const self = this;
        confirm({
            title: 'Are you sure cancel this PO?',
            visible: this.state.cancel,
            okText: 'Submit',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                self.setState({cancel: true, cancel_status: true})
                //self.showCancel(id)
            },
            onCancel() {
                self.setState({cancel: false, cancel_status: false})
                //console.log('Cancel')
            },
        });
    }

    showTerminateConfirm(id) {
        const self = this;
        confirm({
            title: 'Are you sure terminate this PO?',
            visible: this.state.terminate,
            okText: 'Submit',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                self.setState({terminate: true, terminat_status: true})
                //self.showTerminate(id)
            },
            onCancel() {
                self.setState({terminate: false, terminat_status: false})
                //console.log('Cancel')
            },
        });
    }

    handleUpload = (e) => {
        this.setState({loading: true})
        let type = this.state.attachment_type;
        if (this.state.checked) {
            type = type + '_signed'
        }
        else {
            type = type
        }
        const formData = new FormData();
        formData.append('obj_type', 'project')
        formData.append('object_id', this.props.poData.id)
        formData.append('file', e.file);
        formData.append('attachment_type', type)
        //console.log(type)
        addAttachment(formData)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                //console.log(res);
                let count = 0;
                this.state.attachments.push(res.result);
                res.check_list.msa_signed >= 1 ? this.setState({msa_status: true}) : this.setState({msa_status: false})
                res.check_list.work_order_signed >= 1 ? this.setState({wo_status: true}) : this.setState({wo_status: false})
                res.check_list.client_address >= 1 ? this.setState({clientAdd_status: true}) : this.setState({clientAdd_status: false})
                res.check_list.vendor_address >= 1 ? this.setState({vendorAdd_status: true}) : this.setState({vendorAdd_status: false})
                res.check_list.reporting_details >= 1 ? this.setState({reporting_details_status: true}) : this.setState({reporting_details_status: false})
                count = res.check_list.msa_signed + res.check_list.work_order_signed + res.check_list.client_address + res.check_list.vendor_address + res.check_list.start_date + res.check_list.reporting_details
                this.props.checklistStatus(res.check_list, this.props.poId)
                //console.log("status", status)
                this.setState({
                    check_list: res.result.check_list,
                    offer_status: count === 6 ?
                        true : false,
                    loading: false
                })
            })
            .catch(error => {
                console.log(error)
            });
    };

    deleteAttachment(id) {
        this.setState({loading: true})
        let arr = [];
        deleteAttachment(id)
            .then((response) => {
                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                //console.log(res)
                arr = this.state.attachments.filter(function (item) {

                    return item.id !== id
                })
                res.check_list.msa_signed >= 1 ? this.setState({msa_status: true}) : this.setState({msa_status: false})
                res.check_list.work_order_signed >= 1 ? this.setState({wo_status: true}) : this.setState({wo_status: false})
                this.props.checklistStatus(res.check_list, this.props.poId)
                this.setState({
                    check_list: res.check_list,
                    status: status,
                    attachments: arr,
                    loading: false
                })

            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {uploading, fileList} = this.state;
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
            onChange: file => this.handleUpload(file),
            fileList,
            defaultFileList: this.state.attachments,
            listType: "picture",
            showUploadList: false
        };

        return (

            <div>
                <div className="viewsubform viewsubformnew">

                    <Form layout='vertical'>

                        <div>

                            <div className="">

                                <div className="col-md-6 col-sm-6 col-xs-12">

                                    <div>

                                        <Form.Item className="col-md-6 col-sm-6 col-xs-12">
                                            <Form.Item label="Duration">

                                                <Input value={this.state.duration} onChange={this.handleChange}
                                                       name="duration" disabled={this.state.disabled}
                                                       style={{width: '100%'}}/>
                                            </Form.Item>
                                            <Form.Item
                                                label="Start Date:"
                                            >
                                                {getFieldDecorator('start_date',
                                                    {
                                                        setFieldsValue: this.state.start_date,
                                                        onChange: this.onStartChange,
                                                    })(
                                                    <DatePicker
                                                        disabled={this.state.disabled}
                                                        format="YYYY-MM-DD"
                                                        placeholder="Project Start"
                                                    />
                                                )}

                                            </Form.Item>
                                            <Form.Item
                                                label="Pay Term:"
                                            >
                                                {getFieldDecorator('payment_term',
                                                    {
                                                        onChange: this.handleChange,
                                                        setFieldsValue: this.state.payment_term
                                                    })(
                                                    <select
                                                        disabled={this.state.disabled}
                                                        required
                                                        className="form-control"
                                                    >
                                                        <option value="10">NET-10</option>
                                                        <option value="15">NET-15</option>
                                                        <option value="20">NET-20</option>
                                                        <option value="30">NET-30</option>
                                                        <option value="45">NET-45</option>
                                                    </select>
                                                )}

                                            </Form.Item>
                                            <Form.Item
                                                label="Client Address:"
                                            >
                                                {getFieldDecorator('client_address',
                                                    {
                                                        onChange: this.handleChange,
                                                        setFieldsValue: this.state.client_address
                                                    })(
                                                    <Input disabled={this.state.disabled} style={{width: '100%'}}/>
                                                )}

                                            </Form.Item>
                                            <Form.Item
                                                label="Reporting Details:"
                                            >
                                                {getFieldDecorator('reporting_details',
                                                    {
                                                        onChange: this.handleChange,
                                                        setFieldsValue: this.state.reporting_details
                                                    })(
                                                    <TextArea disabled={this.state.disabled} style={{width: '100%'}}/>
                                                )}

                                            </Form.Item>
                                            {/*<Form.Item*/}
                                            {/*label="Consultant Joined:"*/}
                                            {/*>*/}
                                            {/*<Select*/}
                                            {/*disabled={this.state.disabled}*/}
                                            {/*showSearch*/}
                                            {/*allowClear*/}
                                            {/*style={{width: '100%'}}*/}
                                            {/*placeholder="Select a consultant"*/}
                                            {/*optionFilterProp="children"*/}
                                            {/*onChange={(e) => {*/}
                                            {/*console.log(e)*/}
                                            {/*this.onConsultantChange(e);*/}
                                            {/*}}*/}
                                            {/*filterOption={(input, option) =>*/}
                                            {/*option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0*/}
                                            {/*}*/}
                                            {/*>*/}
                                            {/*{this.props.consultantList.map((item, i) => (*/}
                                            {/*<Select.Option value={item.id}>{item.name}</Select.Option>*/}
                                            {/*))}*/}
                                            {/*</Select>*/}
                                            {/*</Form.Item>*/}
                                        </Form.Item>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                            <Form.Item

                                                label="Invoicing Term"
                                            >
                                                {getFieldDecorator('invoicing_period',
                                                    {
                                                        onChange: this.handleChange,
                                                        setFieldsValue: this.state.invoicing_period
                                                    })(
                                                    <select
                                                        disabled={this.state.disabled}
                                                        required
                                                        className="form-control"
                                                    >
                                                        <option value="7">Weekly</option>
                                                        <option value="15">Bi-Weekly</option>
                                                        <option value="30">Monthly</option>
                                                    </select>
                                                )}

                                            </Form.Item>
                                            <Form.Item
                                                label="Estimated End Date:"
                                            >
                                                {getFieldDecorator('end_date',
                                                    {
                                                        setFieldsValue: this.state.end_date,
                                                    })(
                                                    <Input
                                                        readOnly={true}
                                                        placeholder="Project End"
                                                    />
                                                )}

                                            </Form.Item>
                                            <Form.Item
                                                label="Status:"
                                            >
                                                {getFieldDecorator('status',
                                                    {
                                                        onChange: this.handleChange,
                                                        setFieldsValue: this.state.status,
                                                    })(
                                                    <select
                                                        disabled={this.state.disabled}
                                                        className="form-control"

                                                    >
                                                        {
                                                            ((this.props.poData.status.includes('client')
                                                                || this.props.poData.status.includes('resigned')
                                                                || this.props.poData.status.includes('candidate')
                                                                || this.props.poData.status.includes('other')
                                                                || this.props.poData.status.includes('dual')
                                                                || this.props.poData.status.includes('contract')
                                                            )) ?
                                                                PO_STATUS.map((item, i) => (

                                                                    <option
                                                                        key={i + 1}
                                                                        value={item.name}>{item.value}</option>

                                                                ))
                                                                : null
                                                        }
                                                        {this.state.status_list.map((item, i) => (

                                                            <option
                                                                key={i + 1}
                                                                value={item.name}>{item.value}</option>

                                                        ))}
                                                    </select>
                                                )}

                                            </Form.Item>

                                            <Form.Item
                                                label="Vendor Address:"
                                            >
                                                {getFieldDecorator('vendor_address',
                                                    {
                                                        onChange: this.handleChange,
                                                        setFieldsValue: this.state.vendor_address
                                                    })(
                                                    <Input disabled={this.state.disabled} style={{width: '100%'}}/>
                                                )}

                                            </Form.Item>

                                            {/*<Form.Item*/}
                                            {/*    label="End Reason:"*/}
                                            {/*>*/}
                                            {/*    {getFieldDecorator('end_reason',*/}
                                            {/*        {*/}
                                            {/*            onChange: this.handleChange,*/}
                                            {/*            setFieldsValue: this.state.client*/}
                                            {/*        })(*/}
                                            {/*        <Input disabled={this.state.disabled} style={{width: '100%'}}/>*/}
                                            {/*    )}*/}

                                            {/*</Form.Item>*/}

                                        </div>

                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                            <div className="row">

                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <div className="col-md-6 col-sm-6 col-xs-12">

                                    <div className="poformbox">

                                        <div>
                                            <Select
                                                disabled={this.state.disabled}
                                                style={{width: '39%', marginRight: '10px', marginTop: '32px'}}
                                                onChange={(e) => this.handleAttachmentChange(e)}
                                                value={this.state.attachment_type}>
                                                <Select.Option value="work_order">Work Order</Select.Option>
                                                <Select.Option value="msa">MSA</Select.Option>
                                                <Select.Option value="work_order_msa">Work Order and MSA</Select.Option>
                                            </Select>

                                            <Checkbox className="porightbutton"
                                                      onChange={this.signedCheck}>{this.state.checked_string}</Checkbox>

                                            <Upload className="porightbutton2" {...props}
                                                    disabled={this.state.disabled}>
                                                <Icon type="upload"/> Upload
                                            </Upload>
                                        </div>
                                        <br/>
                                        <div>

                                            { !this.state.loading ?
                                                this.state.attachments.map((item, i) =>
                                                    item.attachment_file !== null ?
                                                        <div className="resumesection subpopresume2" key={i}>
                                                            <Icon type="file"/>

                                                            {item.attachment_file !== null ?
                                                                <span
                                                                    style={{marginLeft: '5px'}}>{item.attachment_file.split("/")[5]}</span> : null}
                                                            <span
                                                                style={{marginLeft: '15px'}}>{item.attachment_type}</span>
                                                            <a target="#resume" download
                                                               href={server_url + item.attachment_file}>
                                                                <Icon type="download"></Icon>
                                                            </a>
                                                            <Popconfirm
                                                                placement="bottom"
                                                                icon={<Icon type="info-circle"
                                                                            style={{color: 'black'}}/>}
                                                                title="Are you sure you want to delete this file?"
                                                                onCancel={this.cancel}
                                                                onConfirm={() => this.deleteAttachment(item.id)}
                                                                okText="Submit"
                                                                cancelText="Cancel">
                                                                <Icon type="delete"/>
                                                            </Popconfirm>

                                                        </div>

                                                        : <Spin style={{alignItems: 'center'}} tip="Loading..."
                                                                size="large"/>
                                                ) :
                                                <Spin style={{alignItems: 'center'}} tip="Loading..." size="large"/>
                                            }
                                        </div>
                                    </div>

                                    <div className="ponewtab" style={{marginTop: '20px'}}>
                                        Check List
                                        <div className="po1">
                                            Uploaded Signed MSA
                                            {!this.state.msa_status ?
                                                <Icon type="close"/> :
                                                <Icon type="check"/>}
                                        </div>
                                        <div className="po2">
                                            Uploaded Signed WO
                                            {!this.state.wo_status ?
                                                <Icon type="close"/> :
                                                <Icon type="check"/>}
                                        </div>
                                        <div className="po3">
                                            Added Client Address
                                            {!this.state.clientAdd_status ?
                                                <Icon type="close"/> :
                                                <Icon type="check"/>}
                                        </div>
                                        <div className="po4">
                                            Added Vendor Address
                                            {!this.state.vendorAdd_status ?
                                                <Icon type="close"/> :
                                                <Icon type="check"/>}
                                        </div>
                                        <div className="po4">
                                            Added Reporting Details
                                            {!this.state.reporting_details_status ?
                                                <Icon type="close"/> :
                                                <Icon type="check"/>}
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="formbutoon2 poformbutoon">
                            <Button disabled={this.state.disabled} onClick={this.editPO}>Submit</Button>
                            <Button onClick={this.props.handleClose}>Cancel</Button>
                        </div>

                    </Form>
                    <Modal
                        title="Termination Feedback"
                        visible={ this.state.terminat_status }
                        footer={null}
                    >
                        <POTerminate
                            handleClose={this.props.handleClose}
                            poId={this.props.poData.id}/>
                    </Modal>
                    <Modal
                        title="Cancelled Feedback"
                        visible={ this.state.cancel_status }
                        footer={null}
                    >
                        <POCancel
                            handleClose={this.props.handleClose}
                            poId={this.props.poData.id}/>
                    </Modal>
                </div>
            </div>

        );
    }
}

const PoTabPoForm = Form.create({name: 'view_po'})(TabPo);

export default class PoTabPo extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {

        return (

            <PoTabPoForm
                checklistStatus={this.props.checklistStatus}
                onUpdateChange={this.props.onUpdateChange}
                poData={this.props.poData}
                poId={this.props.poId}
                handleClose={this.props.handleClose}/>
        )

    }
}
