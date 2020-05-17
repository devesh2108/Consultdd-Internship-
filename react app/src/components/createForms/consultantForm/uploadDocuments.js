import React, {Component} from 'react';
import {
    addAttachment,
    deleteAttachment,
} from "../../../services/service";
import {Upload, Popconfirm, Select, Modal,Button,Drawer} from "antd";
import {PlusOutlined,DownloadOutlined,FileOutlined,UploadOutlined,InfoCircleOutlined,DeleteOutlined} from "@ant-design/icons"
import {BASE_URL} from "../../../services/httpService";
import EducationForm from "../../Consultant/popupForm/educationForm";
import ExperienceForm from "../../Consultant/popupForm/experienceForm";
import MarketingForm from "./marketingForm";

const server_url = BASE_URL;

const FILE_TYPE = [
    {key: 'ssn', label: 'SSN'},
    {key: 'visa', label: 'Visa Docs'},
    {key: 'misc', label: 'Miscellaneous'},
    {key: 'academic', label: 'Academic Docs'},
    {key: 'photo_id', label: 'Photo ID'},
    {key: 'results', label: 'Assessment Results'},
    {key: 'resume', label: 'Resume'},
];

class UploadDocuments extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            status: false,
            modalEdu: false,
            modalExp: false,
            editEdu: false,
            editExp: false,
            selectedExperience: null,
            selectedEducation: null,
            attachments: [],
            fileList: [],
            attachmentType: '',
            expArr:[],
            eduArr:[],
            openMarketing:false
        }
        this.setEducation = this.setEducation.bind(this);
        this.setExperience = this.setExperience.bind(this);
        this.updateEducation = this.updateEducation.bind(this);
        this.updateExperience = this.updateExperience.bind(this);
    }

    handleUpload = (e) => {
        const formData = new FormData();
        formData.append('obj_type', 'consultant');
        formData.append('object_id', this.props.consultantId);
        formData.append('file', e.file);
        formData.append('attachment_type', this.state.attachmentType);
        addAttachment(formData)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res);
                this.state.attachments.push(res.result);
                this.setState({status: status});

            })
            .catch(error => {
                console.log(error)
            });
    };

    deleteAttachment = (id) => {
        let arr = [];
        deleteAttachment(id)
            .then((response) => {
                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res);
                arr = this.state.attachments.filter(function (item) {

                    return item.id !== id;
                });
                this.setState({
                    status: status,
                    attachments: arr
                });

            })
            .catch(error => {
                console.log(error);
            });
    };

    handleClose = () => {
        this.setState({
            modalEdu: false,
            modalExp: false,
        });
    };

    async setExperience(data) {
        console.log("----data-------",data);
        this.state.expArr.push(data);
        await this.setState({status:true})
    };

    updateExperience(data) {
        let obj = this.state.expArr, temp = {}, arrExp = [];
        // eslint-disable-next-line array-callback-return
        obj.map(exp=> {
            if (exp.id === data.id) {
                temp = data;
                arrExp.push(data);
            } else {
                arrExp.push(exp);
            }
        })
        this.setState({expArr:arrExp})
    };

    setEducation(data) {
        console.log("edu data",data)
        this.state.eduArr.push(data)
        this.setState({status:true})
    };

    updateEducation(data) {
        let obj = this.state.eduArr, temp = {}, arrEdu = [];
        // eslint-disable-next-line array-callback-return
        obj.map(edu => {
            if (edu.id === data.id) {
                temp = data;
                arrEdu.push(data)
            } else {
                arrEdu.push(edu)
            }
        })
        this.setState({eduArr:arrEdu})
    };

    openModal =()=>{
        this.setState({
            openMarketing :true
        })
    }
    closeModal=()=>{
        this.setState({
            openMarketing:false
        },()=>this.props.handleClose())
    }
    render() {
        const {attachments, fileList} = this.state;
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
            defaultFileList: attachments,
            listType: "picture",
            showUploadList: false
        };
        return (

            <div>
                <div className="col-md-12">

                    <div className="addconsultantsec">

                        <div className="mainform2">

                            <div className="head_edu">
                                <h2>Education
                                    <PlusOutlined type="plus" onClick={() => this.setState({modalEdu: true})}/>
                                </h2>
                                {this.state.eduArr.length!== 0 && this.state.eduArr.map((edu,index)=>
                                    <div>
                                        {edu.title}
                                        <br/>
                                        {edu.org_name}

                                    </div>
                                )}
                            </div>

                            <div className="head_edu">
                                <h2>Work Experience
                                    <PlusOutlined onClick={() => this.setState({modalExp: true})}/>
                                </h2>
                                {this.state.expArr.length!== 0 && this.state.expArr.map((edu,index)=>
                                    <div>
                                        {edu.title}
                                        <br/>
                                        {edu.company}

                                    </div>
                                )}
                            </div>
                            {this.state.modalEdu &&
                            <Modal
                                title={this.state.editEdu ? "Edit Education" : "Add Education"}
                                visible={this.state.modalEdu}
                                footer={null}
                                onCancel={this.handleClose}
                            >
                                <EducationForm
                                    setEducation={this.setEducation}
                                    updateEducation={this.updateEducation}
                                    handleClose={this.handleClose}
                                    consultantId={this.props.consultantId}
                                    eduObj={this.state.selectedEducation}
                                    editEdu={this.state.editEdu}/>
                            </Modal>
                            }
                            {this.state.modalExp &&
                            <Modal
                                title={this.state.editExp ? "Edit Experience" : "Add Experience"}
                                visible={this.state.modalExp}
                                footer={null}
                                onCancel={this.handleClose}
                            >
                                <ExperienceForm
                                    setExperience={this.setExperience}
                                    updateExperience={this.updateExperience}
                                    handleClose={this.handleClose}
                                    consultantId={this.props.consultantId}
                                    expObj={this.state.selectedExperience}
                                    editExp={this.state.editExp}/>
                            </Modal>
                            }


                        </div>

                    </div>

                </div>


                <div className="col-md-6">
                    <div className="rightupload">
                        <label>
                            <p> File Type: </p>
                            <Select
                                value={this.state.attachmentType}
                                className="form-control"
                                placeholder="Select File Type"
                                style={{width:'100px'}}
                                onChange={(e) => this.setState({attachmentType: e})}>
                                {FILE_TYPE.map((item, i) => <Select.Option key={i}
                                                                           value={item.key}>{item.label}</Select.Option>)}

                            </Select>
                        </label>
                        <Upload className="porightbutton2" {...props}>
                            Upload <UploadOutlined/>
                        </Upload>
                    </div>
                </div>


                <br/>

                <div className="col-md-6">
                    {this.state.attachments.map((item, i) =>
                        item.attachment_file !== null ?
                            <div className="resumesection subpopresume2">
                                <FileOutlined style={{fontSize: '11px'}}/>

                                {item.attachment_file !== null ? <span
                                    style={{
                                        marginLeft: '5px',
                                        fontSize: '11px'
                                    }}>{item.attachment_file.split("/")[5]}</span> : null}
                                <span style={{marginLeft: '15px'}}>{item.attachment_type}</span>

                                <a target="#resume" download
                                   href={server_url + item.attachment_file}>
                                    <DownloadOutlined />
                                </a>

                                <Popconfirm
                                    placement="bottom"
                                    icon={<InfoCircleOutlined style={{color: 'black'}}/>}
                                    title="Are you sure you want to delete this file?"
                                    onCancel={() => console.log("No")}
                                    onConfirm={() => this.deleteAttachment(item.id)}
                                    okText="Submit"
                                    cancelText="Cancel">
                                    <DeleteOutlined/>
                                </Popconfirm>

                            </div>
                            :
                            null
                    )}
                </div>
                <div className="addprofilebuttons">
                    <div>
                        <Popconfirm
                            title="Do you want to start marketing the consultant?"
                            onConfirm={this.openModal}
                            onCancel={this.props.handleClose}
                            okText="Yes"
                            cancelText="No"
                        >

                            <Button color="primary">
                                Done
                            </Button>
                        </Popconfirm>
                    </div>

                </div>
                {
                    this.state.openMarketing &&
                        <Drawer
                            title="Marketing Details"
                            width={1020}
                            maskClosable={false}
                            closable={false}
                            onClose={this.closeModal}
                            visible={this.state.openMarketing}
                        >
                            <MarketingForm closeModal={this.closeModal}/>
                        </Drawer>
                }
            </div>


        );
    }
}

export default UploadDocuments;
