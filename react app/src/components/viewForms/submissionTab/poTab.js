import React, {Component} from 'react';
import "../../../App.css";
import moment from "moment-timezone";
import {addAttachment, deleteAttachment, updatePO} from "../../../services/service";
import {Button, Checkbox, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Spin, Upload} from "antd";
import {EditOutlined,UploadOutlined,FileOutlined,DownloadOutlined,CloseOutlined,CheckOutlined,InfoCircleOutlined,DeleteOutlined} from "@ant-design/icons"
import POTerminate from "../../PO/poTerminate";
import POCancel from "../../PO/poCancel";
import {BASE_URL} from "../../../services/httpService";

const {TextArea} = Input;
const {confirm} = Modal;
const server_url = BASE_URL;
const PO_STATUS = [
    {name: 'new', value: 'New'},
    {name: 'received', value: 'Received'},
    {name: 'cancelled', value: 'Cancelled'},
    {name: 'signed', value: 'Signed'},
    {name: 'on_boarded', value: 'On Boarded'},
    {name: 'joined', value: 'Joined'},
    {name: 'terminated', value: 'Terminated'},
    {name: 'client-cancelled', value: 'Client Cancelled'},
    {name: 'dual-offer', value: 'Dual Offer'},
    {name: 'candidate-absconded', value: 'Candidate Absconded'},
    {name: 'candidate-denied-rate', value: 'Candidate Denied: Rate'},
    {name: 'candidate-denied-location', value: 'Candidate Denied: Location'},
    {name: 'candidate-denied-jd', value: 'Candidate Denied: JD'},
    {name: 'contract-conflicts', value: 'Contract Conflicts'},
    {name: 'client-fired-budget', value: 'Client Fired: Budget'},
    {name: 'client-fired-performance', value: 'Client Fired: Performance'},
    {name: 'client-fired-security', value: 'Client Fired: Security'},
    {name: 'resigned-rate', value: 'Resigned: Rate'},
    {name: 'resigned-technology', value: 'Resigned: Technology'},
    {name: 'resigned-full_time', value: 'Resigned: Full-time'},
    {name: 'resigned-location', value:'Resigned: Location'},
    {name: 'completed', value: 'Completed'},
    {name: 'extension', value: 'Extension'},
]
class SubPOTab extends Component {
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
            loading: false,
            client_location: '',
            durationValid: false,
            editPo: false,

        };
        this.handleChange = this.handleChange.bind(this);
        this.editPO = this.editPO.bind(this);
        this.handleAttachmentChange = this.handleAttachmentChange.bind(this);
        this.signedCheck = this.signedCheck.bind(this);

    }

    componentDidMount() {
        this.setData()

    }

    setData = () => {
        const data = JSON.parse(localStorage.getItem('DATA'));
        const marketer = data.employee_name;
        console.log("------disabled",this.props.poData.marketer_name.toLowerCase() !== marketer.toLowerCase()
            ||
            ((this.props.poData.project.status.includes('client')
            || this.props.poData.project.status.includes('resigned')
            || this.props.poData.project.status.includes('candidate')
            || this.props.poData.project.status.includes('other')
            || this.props.poData.project.status.includes('dual')
            || this.props.poData.project.status.includes('contract'))))
        this.getStatus();
        this.setState({
            attachments: this.props.poData.attachments,
            duration: this.props.poData.project.duration,
            check_list: this.props.poData.project.check_list,
            disabled: this.props.poData.marketer_name.toLowerCase() !== marketer.toLowerCase()
            ||
            ((this.props.poData.project.status.includes('client')
                || this.props.poData.project.status.includes('resigned')
                || this.props.poData.project.status.includes('candidate')
                || this.props.poData.project.status.includes('other')
                || this.props.poData.project.status.includes('dual')
                || this.props.poData.project.status.includes('contract')
            )),
            offer_status: this.props.poData.project.check_list.status,

        })
        //console.log(this.props.poData.check_list.work_order)
        if (this.props.poData.project.check_list.msa_signed >= 1) {
            this.setState({msa_status: true})
        }
        if (this.props.poData.project.check_list.work_order_signed >= 1) {
            this.setState({wo_status: true})
        }
        if (this.props.poData.project.check_list.client_address >= 1) {
            this.setState({clientAdd_status: true})
        }
        if (this.props.poData.project.check_list.vendor_address >= 1) {
            this.setState({vendorAdd_status: true})
        }
        if (this.props.poData.project.check_list.reporting_details >= 1) {
            this.setState({reporting_details_status: true})
        }
        PO_STATUS.map((status, i) => {
            if (status.name === this.props.poData.project.status) {
                this.setState({
                    status: status.value

                })
            }
        })
        //console.log("---------", this.props.poData)
        this.setState({

            start_date: this.props.poData.project.start_date === null ? null : moment(this.props.poData.project.start_date),
            end_date: this.props.poData.project.end_date === null ? null : moment(this.props.poData.project.end_date).format("YYYY-MM-DD"),
            payment_term: this.props.poData.project.payment_term === null ? '10' : this.props.poData.project.payment_term,
            reporting_details: this.props.poData.project.reporting_details,
            invoicing_period: this.props.poData.project.invoicing_period === null ? '7' : this.props.poData.project.invoicing_period,
            end_reason: this.props.poData.project.end_reason === undefined ? null : this.props.poData.project.end_reason,
            client_address: this.props.poData.project.client_address,
            vendor_address: this.props.poData.project.vendor_address,
            client_location: this.props.poData.project.city,
            durationValid: true,
        });
    }

    getStatus() {
        if (this.props.poData.project.check_list.status) {
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
        }
    }

    editPO() {

        const body = {
            "project_id": this.props.poData.project.id,
            "duration": this.state.duration,
            "start_date": moment(this.state.start_date).format("YYYY-MM-DD"),
            "end_date": this.state.end_date === null ? null : moment(this.state.end_date).format("YYYY-MM-DD"),
            "payment_term": parseInt(this.state.payment_term),
            "invoicing_period": this.state.invoicing_period,
            //"end_reason": this.state.end_reason,
            "status": this.state.status,
            "reporting_details": this.state.reporting_details,
            "vendor_address": this.state.vendor_address,
            "client_address": this.state.client_address,
            "city": this.state.client_location,
        }
        //console.log(body)
        if (this.state.status === 'cancelled') {
            this.showCancelConfirm(this.props.poData.project.id)

        }
        else if (this.state.status === 'terminated') {
            this.showTerminateConfirm(this.props.poData.project.id)

        } else if (this.state.durationValid) {
            updatePO(body, this.props.poData.project.id)
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
                        this.setState({
                            editPo: false
                        })

                    }

                })
                .catch(error => {
                    console.log(error)
                });
        }


    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value},
            () => {
                let durationValid;
                if (this.state.duration !== '') {
                    durationValid = /^\d+$/.test(this.state.duration)
                }
                this.setState({
                    durationValid: durationValid
                })
                if (durationValid) {
                    let start_date = moment(this.state.start_date).format("YYYY-MM-DD")
                    let end_date = moment(start_date).add(this.state.duration, 'months')
                    //console.log(end_date.format("YYYY-MM-DD"))
                    this.setState({

                        end_date: end_date.format("YYYY-MM-DD")
                    })
                }
            })


    }

    onConsultantChange(value) {
        this.setState({consultant_joined: value})
        //console.log(`selected ${value}`);
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.start_date;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() < endValue.valueOf();
    };

    disabledEndDate = (endValue) => {
        const startValue = this.state.start_date;
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
            let start_date = moment(this.state.start_date).format("YYYY-MM-DD")
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
    };

    onChangeInvoicingPeriod = (data) => {
        this.setState({
            invoicing_period: data
        })
    }
    onChangePayment = (data) => {
        this.setState({
            payment_term: data
        })
    }
    onChangeStatus = (data) => {
        this.setState({
            status: data
        })
    }
    setEdit = () => {
        this.setState({
            editPo: true
        })
    }
    handleClose = () => {
        this.setState({
            editPo: false
        }, () => this.setData())

    }

    render() {
        const {fileList} = this.state;
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
                {
                    this.props.is_active &&
                    <EditOutlined onClick={this.setEdit}/>
                }
                {
                    this.state.editPo ?
                        <div>
                            <div className="viewsubform viewsubformnew">

                                <Form layout='vertical'>

                                    <div>

                                        <div className="">

                                            <div className="col-md-6 col-sm-6 col-xs-12">

                                                <div>

                                                    <Form.Item className="col-md-6 col-sm-6 col-xs-12">
                                                        <Form.Item label="Duration">

                                                            <Input value={this.state.duration}
                                                                   onChange={this.handleChange}
                                                                   name="duration"
                                                                   style={{width: '100%'}}/>
                                                            <br/>
                                                            <br/>
                                                            {!this.state.durationValid && <span
                                                                style={{
                                                                    fontSize: 9,
                                                                    color: 'red'
                                                                }}>Accepts only number</span>}
                                                        </Form.Item>
                                                        <Form.Item label="Start Date:">
                                                            <DatePicker
                                                                value={this.state.start_date}
                                                                onChange={this.onStartChange}

                                                                format="YYYY-MM-DD"
                                                                placeholder="Project Start"
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Pay Term:">
                                                            <Select
                                                                value={this.state.payment_term}
                                                                onChange={this.onChangePayment}

                                                                required
                                                                className="form-control"
                                                            >
                                                                <Select.Option value="10">NET-10</Select.Option>
                                                                <Select.Option value="15">NET-15</Select.Option>
                                                                <Select.Option value="20">NET-20</Select.Option>
                                                                <Select.Option value="30">NET-30</Select.Option>
                                                                <Select.Option value="45">NET-45</Select.Option>
                                                            </Select>

                                                        </Form.Item>
                                                        <Form.Item label="Client Address:">

                                                            <Input name="client_address"
                                                                   value={this.state.client_address}
                                                                   onChange={this.handleChange}
                                                                   style={{width: '100%'}}/>

                                                        </Form.Item>
                                                        <Form.Item label="Reporting Details:">

                                                    <TextArea name="reporting_details"
                                                              value={this.state.reporting_details}
                                                              onChange={this.handleChange} style={{width: '100%'}}/>

                                                        </Form.Item>

                                                    </Form.Item>
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <Form.Item

                                                            label="Invoicing Term"
                                                        >
                                                            <Select
                                                                value={this.state.invoicing_period}
                                                                onChange={this.onChangeInvoicingPeriod}

                                                                required
                                                                className="form-control"
                                                            >
                                                                <Select.Option value="7">Weekly</Select.Option>
                                                                <Select.Option value="15">Bi-Weekly</Select.Option>
                                                                <Select.Option value="30">Monthly</Select.Option>
                                                            </Select>

                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Estimated End Date:"
                                                        >
                                                            <Input
                                                                value={this.state.end_date}
                                                                readOnly={true}
                                                                placeholder="Project End"
                                                            />

                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Status:"
                                                        >
                                                            <Select
                                                                name="status"
                                                                value={this.state.status}
                                                                onChange={this.onChangeStatus}
                                                                //disabled={this.state.disabled}
                                                                className="form-control"

                                                            >
                                                                {
                                                                    ((this.props.poData.project.status.includes('client')
                                                                        || this.props.poData.project.status.includes('resigned')
                                                                        || this.props.poData.project.status.includes('candidate')
                                                                        || this.props.poData.project.status.includes('other')
                                                                        || this.props.poData.project.status.includes('dual')
                                                                        || this.props.poData.project.status.includes('contract')
                                                                    )) ?

                                                                        PO_STATUS.map((item, i) => (

                                                                            <Select.Option
                                                                                value={item.name}>{item.value}</Select.Option>


                                                                        )) :  this.state.status_list.map((item, i) => (

                                                                        <Select.Option
                                                                            key={i + 1}
                                                                            value={item.name}>{item.value}</Select.Option>

                                                                    ))
                                                                }

                                                            </Select>

                                                        </Form.Item>

                                                        <Form.Item
                                                            label="Vendor Address:"
                                                        >
                                                            <Input name="vendor_address"
                                                                   value={this.state.vendor_address}
                                                                   onChange={this.handleChange}

                                                                   style={{width: '100%'}}/>

                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Client Location:"
                                                        >
                                                            <Input name="client_location"
                                                                   value={this.state.client_location}
                                                                   onChange={this.handleChange}

                                                                   style={{width: '100%'}}/>

                                                        </Form.Item>

                                                        {/*<Form.Item*/}
                                                        {/*    label="End Reason:"*/}
                                                        {/*>*/}
                                                        {/*    {getFieldDecorator('end_reason',*/}
                                                        {/*        {*/}
                                                        {/*            onChange: this.handleChange,*/}
                                                        {/*            setFieldsValue: this.state.client*/}
                                                        {/*        })(*/}
                                                        {/*        <Input style={{width: '100%'}}/>*/}
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

                                                            style={{
                                                                width: '39%',
                                                                marginRight: '10px',
                                                                marginTop: '32px'
                                                            }}
                                                            onChange={(e) => this.handleAttachmentChange(e)}
                                                            value={this.state.attachment_type}>
                                                            <Select.Option value="work_order">Work Order</Select.Option>
                                                            <Select.Option value="msa">MSA</Select.Option>
                                                            <Select.Option value="work_order_msa">Work Order and
                                                                MSA</Select.Option>
                                                        </Select>

                                                        <Checkbox className="porightbutton"
                                                                  onChange={this.signedCheck}>{this.state.checked_string}</Checkbox>

                                                        <Upload className="porightbutton2" {...props}
                                                        >
                                                            <UploadOutlined/> Upload
                                                        </Upload>
                                                    </div>
                                                    <br/>
                                                    <div>

                                                        { !this.state.loading ?
                                                            this.state.attachments.map((item, i) =>
                                                                item.attachment_type !== "resume" || item.attachment_type === "other" ?
                                                                    item.file_name !== null ?
                                                                        <div className="resumesection subpopresume2"
                                                                             key={i}>
                                                                            <FileOutlined/>

                                                                            {item.file_name !== null ?
                                                                                <span
                                                                                    style={{marginLeft: '5px'}}>{item.file_name.split("/")[5]}</span> : null}
                                                                            <span
                                                                                style={{marginLeft: '15px'}}>{item.attachment_type}</span>
                                                                            <a target="#resume" download
                                                                               href={server_url + item.file_name}>
                                                                                <DownloadOutlined />
                                                                            </a>
                                                                            <Popconfirm
                                                                                placement="bottom"
                                                                                icon={<InfoCircleOutlined
                                                                                            style={{color: 'black'}}/>}
                                                                                title="Are you sure you want to delete this file?"
                                                                                onCancel={this.cancel}
                                                                                onConfirm={() => this.deleteAttachment(item.id)}
                                                                                okText="Submit"
                                                                                cancelText="Cancel">
                                                                                <DeleteOutlined />
                                                                            </Popconfirm>

                                                                        </div>
                                                                        :
                                                                        <Spin style={{alignItems: 'center'}}
                                                                              tip="Loading..."
                                                                              size="large"/>
                                                                    :
                                                                    <div>No documents found</div>
                                                            )
                                                            :
                                                            <Spin style={{alignItems: 'center'}} tip="Loading..."
                                                                  size="large"/>

                                                        }
                                                    </div>
                                                </div>

                                                <div className="ponewtab" style={{marginTop: '20px'}}>
                                                    Check List
                                                    <div className="po1">
                                                        Uploaded Signed MSA
                                                        {!this.state.msa_status ?
                                                            <CloseOutlined/> :
                                                            <CheckOutlined/>}
                                                    </div>
                                                    <div className="po2">
                                                        Uploaded Signed WO
                                                        {!this.state.wo_status ?
                                                            <CloseOutlined/> :
                                                            <CheckOutlined/>}
                                                    </div>
                                                    <div className="po3">
                                                        Added Client Address
                                                        {!this.state.clientAdd_status ?
                                                            <CloseOutlined/> :
                                                            <CheckOutlined/>}
                                                    </div>
                                                    <div className="po4">
                                                        Added Vendor Address
                                                        {!this.state.vendorAdd_status ?
                                                            <CloseOutlined/> :
                                                            <CheckOutlined/>}
                                                    </div>
                                                    <div className="po4">
                                                        Added Reporting Details
                                                        {!this.state.reporting_details_status ?
                                                            <CloseOutlined/> :
                                                            <CheckOutlined/>}
                                                    </div>

                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="formbutoon2 poformbutoon">
                                        <Button onClick={this.editPO}>Submit</Button>
                                        <Button onClick={this.handleClose}>Cancel</Button>
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
                        :
                        <div>
                            <div className="viewsubform viewsubformnew">

                                <Form layout='vertical'>

                                    <div>

                                        <div className="">

                                            <div className="col-md-6 col-sm-6 col-xs-12">

                                                <div>

                                                    <Form.Item className="col-md-6 col-sm-6 col-xs-12">
                                                        <Form.Item label="Duration">

                                                            <span>{this.state.duration}</span>

                                                        </Form.Item>
                                                        <Form.Item label="Start Date:">
                                                            <span>{moment(this.state.start_date).format("YYYY-MM-DD")}</span>
                                                        </Form.Item>
                                                        <Form.Item label="Pay Term:">
                                                            <span>NET - {this.state.payment_term}</span>

                                                        </Form.Item>
                                                        <Form.Item label="Client Address:">

                                                            <span>{this.state.client_address}</span>

                                                        </Form.Item>
                                                        <Form.Item label="Reporting Details:">

                                                            <span>{this.state.reporting_details}</span>

                                                        </Form.Item>

                                                    </Form.Item>
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <Form.Item label="Invoicing Term">
                                                            <span>{this.state.invoicing_period}</span>

                                                        </Form.Item>
                                                        <Form.Item label="Estimated End Date:">
                                                            <span>{moment(this.state.end_date).format("YYYY-MM-DD")}</span>

                                                        </Form.Item>
                                                        <Form.Item label="Status:">
                                                            <span>{this.state.status}</span>

                                                        </Form.Item>

                                                        <Form.Item label="Vendor Address:">
                                                            <span>{this.state.vendor_address}</span>

                                                        </Form.Item>
                                                        <Form.Item label="Client Location:">
                                                            <span>{this.state.client_location}</span>

                                                        </Form.Item>

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

                                                        {
                                                            this.state.attachments.map((item, i) =>
                                                                item.attachment_type !== "resume" || item.attachment_type === "other" ?
                                                                    item.file_name !== null ?
                                                                        <div className="resumesection subpopresume2"
                                                                             key={i}>
                                                                            <FileOutlined/>

                                                                            {item.file_name !== null ?
                                                                                <span
                                                                                    style={{marginLeft: '5px'}}>{item.file_name.split("/")[5]}</span> : null}
                                                                            <span
                                                                                style={{marginLeft: '15px'}}>{item.attachment_type}</span>

                                                                        </div>
                                                                        :
                                                                        <Spin style={{alignItems: 'center'}}
                                                                              tip="Loading..."
                                                                              size="large"/>
                                                                    :
                                                                    <div>No documents found</div>
                                                            )


                                                        }
                                                    </div>
                                                </div>

                                                <div className="ponewtab" style={{marginTop: '20px'}}>
                                                    Check List
                                                    <div className="po1">
                                                        Uploaded Signed MSA
                                                        {!this.state.msa_status ?
                                                            <CloseOutlined/> :
                                                            <CheckOutlined/>}
                                                    </div>
                                                    <div className="po2">
                                                        Uploaded Signed WO
                                                        {!this.state.wo_status ?
                                                            <CloseOutlined/> :
                                                            <CheckOutlined/>}
                                                    </div>
                                                    <div className="po3">
                                                        Added Client Address
                                                        {!this.state.clientAdd_status ?
                                                            <CloseOutlined/> :
                                                            <CheckOutlined/>}
                                                    </div>
                                                    <div className="po4">
                                                        Added Vendor Address
                                                        {!this.state.vendorAdd_status ?
                                                            <CloseOutlined/> :
                                                            <CheckOutlined/>}
                                                    </div>
                                                    <div className="po4">
                                                        Added Reporting Details
                                                        {!this.state.reporting_details_status ?
                                                            <CloseOutlined/> :
                                                            <CheckOutlined/>}
                                                    </div>

                                                </div>
                                            </div>

                                        </div>

                                    </div>


                                </Form>

                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default SubPOTab;
