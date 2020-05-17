import React, {Component} from 'react';
import "../../App.css";
import FileViewer from 'react-file-viewer';
import {getAttachments} from "../../services/service";
import {Card} from "antd";
import {VerticalAlignBottomOutlined} from "@ant-design/icons"

const fileArr = [
    'http://68.183.87.215:8000/media/attachments/marketing_submission/549/Ashish_Mayank_Doppa_Guidewire_resume.docx',
    'http://68.183.87.215:8000/media/attachments/marketing_submission/549/Ashish_Mayank_Doppa_Guidewire_resume.docx',
    'http://68.183.87.215:8000/media/attachments/marketing_submission/549/Ashish_Mayank_Doppa_Guidewire_resume.docx'
]

class DocumentTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileArr: [],
            fileStatus: [false],
            status: false
        }
    }

    componentDidMount() {
        let fileStatus = [false];
        fileStatus[0] = true;
        this.setState({fileStatus: fileStatus})
        this.getAttachments(this.props.consultantId);
    }

    onError(e) {
        console.log(e, 'error in file-viewer');
    }

    setFile(i) {
        let fileStatus = [false];
        fileStatus[i] = true;
        this.setState({fileStatus: fileStatus})
    }

    getAttachments(id) {
        getAttachments(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([res, statusCode]);
            }).then(([response, status]) => {
            console.log(response)
            this.setState({fileArr: response.results, status: true})
        })
    }


    render() {
        return (

            <div>
                {this.state.status ?
                    <div class="row">

                        <div className="col-md-5 col-ms-5 col-xs-12">


                            <div className="left_document_tab">
                                {this.state.fileArr.map((file, i) => (
                                    <div class="transperent_block">
                                        <Card onClick={() => this.setFile(i)}>
                                            {file.file_name}
                                        </Card>

                                        <VerticalAlignBottomOutlined/>

                                        <div class="black_hover_block">
                                            <div class="blur"></div>
                                            <div class="black_hover_block_text">
                                                <ul class="pad0 bg_black">
                                                    <li class="float-left pad0">
                                                        <Card onClick={() => this.setFile(i)}>
                                                            {file.file_name}
                                                        </Card>
                                                    </li>
                                                    <div class="clearfix"></div>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                ))}


                            </div>


                        </div>


                        <div className="col-md-7 col-ms-7 col-xs-12">

                            <div className="documentsection_tab">

                                {
                                    fileArr.map((file, i) => (
                                        this.state.fileStatus[i] &&

                                        <div>

                                            <FileViewer
                                                fileType={file.split("/")[7].split(".")[1]}
                                                filePath={file}
                                                onError={this.onError}/>

                                        </div>
                                    ))
                                }


                            </div>

                        </div>


                    </div>
                    :
                    <div>Loading....</div>
                }
            </div>


        )
    }
}

export default DocumentTab;
