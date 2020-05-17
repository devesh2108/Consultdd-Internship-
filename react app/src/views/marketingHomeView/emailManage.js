import React, {Component} from 'react';
import "../../App.css"
import {
    Table, Input, Button, Divider, Tabs, Drawer, Modal, message, Select, Dropdown, Menu, Switch
} from 'antd';
import {PlusOutlined,ShareAltOutlined,CloseOutlined} from "@ant-design/icons"
import AddEmail from '../../components/createForms/addEmailForm'
import EditEmail from '../../components/editForms/editEmailForm'
import {
    getAssetData,
    deleteAssetData,
    fetchGuestList,
    shareAssetData,
    getSpecificAssetData,
    unshareAssetData,
    getMyAssetData,
    bulkUpload
} from '../../services/service'
import EmailAsset from "../../components/Assets/emailAsset";
import SocialAsset from "../../components/Assets/socialAsset";
import JBAsset from "../../components/Assets/jBAsset";
import PhoneAsset from "../../components/Assets/phoneAsset";

const {TabPane} = Tabs;
const {confirm} = Modal;

class EmailManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDrawer: false,
            edit: false,
            type: 'email',
            selected_type: 'email',
            emailData: [],
            socialData: [],
            phoneData: [],
            jobData: [],
            share: false,
            shareAll: false,
            unshare: false,
            text: 'Show',
            delete: false,
            openShareModal: false,
            asset_id: '',
            userList: [],
            guest: [],
            status: false,
            selectedRowKeys: [],
            shareassetList: []
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getData = this.getData.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.deleteAssets = this.deleteAssets.bind(this);
        this.confirm = this.confirm.bind(this);
        this.fetchGuestList = this.fetchGuestList.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.onUpdateChange = this.onUpdateChange.bind(this);
        this.addData = this.addData.bind(this);
        this.toggleAsset = this.toggleAsset.bind(this);
        this.reset = this.reset.bind(this);
        this.getSpecificAssetData = this.getSpecificAssetData.bind(this);

    }

    componentDidMount() {
        this.fetchGuestList("");
        this.getData()
    }

    openModal(type) {
        this.setState({
            openDrawer: true,
            type: type,
        })
    }

    closeModal() {
        this.setState({
            openDrawer: false,
            edit: false,
            share: false,
            delete: false,
            unshare: false,
            text: 'Show'
        })
    }

    emailData(data) {
        this.setState({
            edit: true,
            asset_id: data.id,
            assetObj: data,
            selected_type: 'email'
        })
    }

    phoneData(data) {
        this.setState({
            edit: true,
            asset_id: data.id,
            assetObj: data,
            selected_type: 'phone number'
        })
    }

    socialData(data) {
        this.setState({
            edit: true,
            asset_id: data.id,
            assetObj: data,
            selected_type: 'social'
        })
    }

    jobData(data) {
        this.setState({
            edit: true,
            asset_id: data.id,
            assetObj: data,
            selected_type: 'job_board'
        })
    }

    getData() {

        getAssetData()
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

                if (status === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    this.setState({
                        emailData: res.results.email_asset,
                        socialData: res.results.social_asset,
                        phoneData: res.results.number_asset,
                        jobData: res.results.job_board_asset,
                        status: status
                    })

                }

            })
            .catch(error => {
                console.log(error)
            })
    }

    fetchGuestList(params) {
        fetchGuestList(params)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

                const data = res.results.map(user => ({
                    text: `${user.name}`,
                    value: user.id,
                }));
                this.setState({data});

            })
            .catch(error => {
                console.log(error)
            });

    }

    onUpdateChange(id, type, asset) {
        let temp = [];
        if (type === 'email') {
            temp = this.state.emailData
        } else if (type === 'social') {
            temp = this.state.socialData
        } else if (type === 'job_board') {
            temp = this.state.jobData
        } else {
            temp = this.state.phoneData
        }
        let chInd = -1;
        let temp_assetData;
        temp_assetData = asset
        console.log("update temp interview data", temp_assetData)

        for (let i in temp) {
            if (temp[i].id === id) {
                chInd = i
            }
        }

        temp[chInd] = temp_assetData;
        console.log(temp)
        if (type === 'email') {
            this.setState({
                emailData: temp,

            })
        } else if (type === 'social') {
            this.setState({
                socialData: temp,

            })
        } else if (type === 'job_board') {
            this.setState({
                jobData: temp,

            })
        } else {
            this.setState({
                phoneData: temp,

            })
        }


    }

    handleChangeSelect = (value) => {
        this.setState({
            userList: value,
        });
    }

    getSpecificAssetData(id) {
        console.log(id)
        this.state.selectedRowKeys.push(id)
        getSpecificAssetData(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 400) {
                    message.error("Not found")
                } else if (status === 200) {
                    this.setState({
                        shareassetList: res.result.shared_to,
                        openShareModal: true,
                        share: true, asset_id: id, shareAll: false
                    })
                } else {
                    message.error("Internal Server error")
                }


            })
            .catch(error => {
                console.log(error)
            });

    }

    showDeleteConfirm(id, type) {
        const self = this;
        confirm({
            title: 'Are you sure delete this ' + type + '?',
            visible: this.state.delete,
            okText: 'Submit',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                self.setState({delete: true})
                self.deleteAssets(id)
            },
            onCancel() {
                self.setState({delete: false})
                console.log('Cancel')
            },
        });
    }

    deleteAssets(asset_id) {


        console.log(asset_id)
        deleteAssetData(asset_id)
            .then((response) => {

                const statusCode = response.status;
                if (statusCode === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    message.success("Deleted Asset.");
                    this.getData();
                }
            })
            .catch(error => {
                console.log(error)
            })


    }

    confirm(asset_id) {
        console.log(asset_id)
        const userArr = []
        this.state.userList.map((data, i) =>
            userArr.push(data.key))

        const body = {
            'assets': asset_id,
            'users': userArr

        }
        console.log(body)
        shareAssetData(body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    if (status === 202) {
                        this.setState({
                            share: false,
                            userList: [],
                            selectedEmailData: [],
                            selectedEmailDataStr: '',
                            selectedPhoneData: [],
                            selectedPhoneDataStr: '',
                            selectedSocialData: [],
                            selectedSocialDataStr: '',
                            selectedJobData: [],
                            selectedJobDataStr: '',
                            unshare: false,
                            text: 'Show'
                        })
                        message.success("Shared your asset with the users.");

                        this.closeModal()
                    } else {
                        message.error("Something went wrong.")
                    }

                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    addData(type, obj, status) {
        if (type === 'email') {
            this.state.emailData.push(obj)
        } else if (type === 'social') {
            this.state.socialData.push(obj)
        } else if (type === 'job_board') {
            this.state.jobData.push(obj)
        } else {
            this.state.phoneData.push(obj)
        }
        this.setState({status})
    }

    onSelectEmailChange = (selectedRowKeys) => {
        let self = this;
        let tempArr = []
        selectedRowKeys.forEach(function (ele) {
            console.log(ele)

            self.state.emailData.map((item, i) => {

                    if (item.id === parseInt(ele)) {
                        tempArr.push(ele);

                    }
                }
            )


        });

        this.setState({selectedRowKeys: tempArr})

    }

    onSelectPhoneChange = (selectedRowKeys) => {
        console.log(selectedRowKeys)
        let self = this;
        let tempArr = []
        selectedRowKeys.forEach(function (ele) {
            console.log(ele)
            self.state.phoneData.map((item, i) => {

                    if (item.id === parseInt(ele)) {
                        tempArr.push(ele);

                    }
                }
            )


        });

        this.setState({selectedRowKeys: tempArr})

    }

    onSelectSocialChange = (selectedRowKeys) => {
        console.log(selectedRowKeys)
        let self = this;
        let tempArr = []
        selectedRowKeys.forEach(function (ele) {
            console.log(ele)

            self.state.socialData.map((item, i) => {

                    if (item.id === parseInt(ele)) {
                        tempArr.push(ele);

                    }
                }
            )


        });

        this.setState({selectedRowKeys: tempArr})

    }

    onSelectJobChange = (selectedRowKeys) => {
        let self = this;
        let tempArr = []
        selectedRowKeys.forEach(function (ele) {
            console.log(ele)

            self.state.jobData.map((item, i) => {

                    if (item.id === parseInt(ele)) {
                        tempArr.push(ele);

                    }
                }
            )


        });

        this.setState({selectedRowKeys: tempArr})

    }

    uploadBulk(e) {
        let fd;
        if (e.target.files[0].type === 'text/csv' || e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            fd = new FormData();
            fd.append('file', e.target.files[0])
            bulkUpload(fd)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(status)
                    if (status === 401) {
                        localStorage.removeItem('TOKEN');
                        localStorage.removeItem('TEAM');
                        localStorage.removeItem('ROLE');
                        localStorage.removeItem('ID');
                        localStorage.removeItem('NAME');
                        this.props.history.push('/login')
                    } else {
                        if (status === 404) {
                            message.warn(res.result)
                        } else if (status === 400) {
                            message.error(res.error)

                        } else if (status === 201) {
                            message.success("File uploaded")
                        } else {
                            message.error("Internal server error")
                        }

                    }
                })
                .catch(error => {
                    message.success(error)
                })

        } else {
            message.error("Please select a CSV file")
        }
    }

    unShareData(user_id, asset_id) {
        const body = {
            'user': user_id
        }
        unshareAssetData(body, parseInt(asset_id.toString()))
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    if (status === 202) {
                        console.log(res.result)
                        this.setState({shareassetList: res.result.shared_to})
                        message.success("Asset is unshared!");

                    } else {
                        message.error("Something went wrong.")
                    }

                }
            })
            .catch(error => {
                console.log(error)
            })

    }

    toggleAsset(e) {
        console.log(e)
        let status = ''
        if (e) {
            status = 'shared'
        } else {
            status = 'my'
        }

        getMyAssetData(status)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 401) {
                    localStorage.removeItem('TOKEN');
                    localStorage.removeItem('TEAM');
                    localStorage.removeItem('ROLE');
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    this.setState({
                        emailData: res.results.email_asset,
                        socialData: res.results.social_asset,
                        phoneData: res.results.number_asset,
                        jobData: res.results.job_board_asset,
                        status: status
                    })

                }
            })
            .catch(error => {
                console.log(error)
            })

    }

    reset() {
        this.setState({selectedRowKeys: []})
    }


    render() {
        const {data, userList, type} = this.state;

        const menu = (
            <Menu>
                <Menu.Item key="email">
                  <span onClick={() => this.openModal('email')}>
                       Email
                  </span>

                </Menu.Item>
                <Menu.Item key="social">
                  <span onClick={() => this.openModal('social')}>
                       Social
                  </span>

                </Menu.Item>
                <Menu.Item key="phone_number">
                  <span onClick={() => this.openModal('number')}>
                       Phone
                  </span>
                </Menu.Item>
                <Menu.Item key="job_board">
                  <span onClick={() => this.openModal('job_board')}>
                       Job Board
                  </span>

                </Menu.Item>
            </Menu>
        );
        return (
            <div style={{marginTop: '80px', marginLeft: '20px'}}>

                <h2> Asset Management </h2>

                <div className="test">

                    <ul>
                        <li>
                            <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
                                <PlusOutlined className="addAsset"/>
                            </Dropdown>
                        </li>
                        <li>
                            <Switch
                                className="toggleAsset"
                                onChange={this.toggleAsset}
                                checkedChildren={"Shared"}
                                unCheckedChildren={"My"}
                            />
                        </li>
                    </ul>

                </div>


                <div>

                    <label className="uploadbuttonnew"
                           style={{}}>Bulk Upload
                        <input type="file" style={{visibility: 'hidden', width: '50px'}}
                               onChange={(e) => this.uploadBulk(e)}/>
                    </label>


                    <Button className="sharebuttonnew" onClick={() => {
                        if (
                            this.state.selectedRowKeys.length !== 0
                            ) {
                            this.setState({
                                share: true, userList: [], shareAll: true
                            })
                        } else {
                            message.error("Select atleast one asset to share")
                        }
                    }
                    }>
                        <ShareAltOutlined style={{fontSize: 18, color: '#fff', float: 'left'}}/>
                        Share
                    </Button>

                </div>


                {this.state.status === 200 ?
                    <Tabs defaultActiveKey="1" onChange={() => this.reset()}>
                        <TabPane tab="Email" key="email">
                            <EmailAsset
                                showDeleteConfirm={this.showDeleteConfirm}
                                getSpecificAssetData={this.getSpecificAssetData}
                                onSelectEmailChange={this.onSelectEmailChange}
                                selectedRowKeys={this.state.selectedRowKeys}
                                emailData={this.emailData}
                                data={this.state.emailData}
                            />

                        </TabPane>
                        <TabPane tab="Social" key="social">
                            <SocialAsset
                                showDeleteConfirm={this.showDeleteConfirm}
                                getSpecificAssetData={this.getSpecificAssetData}
                                onSelectSocialChange={this.onSelectSocialChange}
                                selectedRowKeys={this.state.selectedRowKeys}
                                socialData={this.socialData}
                                data={this.state.socialData}
                            />


                        </TabPane>

                        <TabPane tab="Phone" key="phone_number">
                            <PhoneAsset
                                showDeleteConfirm={this.showDeleteConfirm}
                                getSpecificAssetData={this.getSpecificAssetData}
                                onSelectPhoneChange={this.onSelectPhoneChange}
                                selectedRowKeys={this.state.selectedRowKeys}
                                phoneData={this.phoneData}
                                data={this.state.phoneData}
                            />
                        </TabPane>
                        <TabPane tab="Job Board" key="job_board">
                            <JBAsset
                                showDeleteConfirm={this.showDeleteConfirm}
                                getSpecificAssetData={this.getSpecificAssetData}
                                onSelectJobChange={this.onSelectJobChange}
                                selectedRowKeys={this.state.selectedRowKeys}
                                phoneData={this.jobData}
                                data={this.state.jobData}
                            />

                        </TabPane>
                    </Tabs>
                    : null
                }
                {this.state.openDrawer && <Drawer
                    title={"Add New " + this.state.type}
                    width={720}
                    onClose={this.closeModal}
                    visible={this.state.openDrawer}
                >
                    <AddEmail addData={this.addData} handleClose={this.closeModal} type={this.state.type}/>

                </Drawer>
                }
                {this.state.share &&

                <Modal
                    title="Share asset with others"
                    onCancel={this.closeModal}
                    visible={this.state.share}
                    footer={[
                        <Button key="submit" type="primary"
                                onClick={() => {
                                    let asset_array = []
                                    console.log(type)
                                    if (type === 'email') {
                                        asset_array = this.state.selectedEmailData

                                    } else if (type === 'social') {
                                        asset_array = this.state.selectedSocialData

                                    } else if (type === 'job_board') {
                                        asset_array = this.state.selectedJobData

                                    } else {
                                        asset_array = this.state.selectedPhoneData

                                    }
                                    this.confirm(asset_array)
                                }}>
                            Submit
                        </Button>,
                    ]}
                >
                    <div style={{position: 'relative', left: 30, top: 20}}>
                        <label> Add Users : </label> <br/>
                        <Select
                            mode="multiple"
                            labelInValue
                            value={userList}
                            placeholder="Select users"
                            filterOption={false}
                            onSearch={this.fetchGuestList}
                            onChange={this.handleChangeSelect}
                            style={{
                                whiteSpace: 'nowrap',
                                width: '87%',
                                height: '50px',
                                marginBottom: '10px',
                                textOverflow: 'ellipsis',
                                minHeight: '50px',
                                maxHeight: '50px',
                                overflow: 'hidden',
                                overflowY: 'scroll'
                            }}
                        >
                            {data.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)}

                        </Select>
                        {
                            !this.state.shareAll &&
                            <span className="popshare" onClick={() => {
                                this.setState({
                                    unshare: !this.state.unshare
                                });
                                if (this.state.unshare) {
                                    this.setState({text: 'Show'})
                                } else {
                                    this.setState({text: 'Hide'})
                                }
                            }

                            }>
                                {this.state.text} shared with
                        </span>
                        }
                        <div>
                            {this.state.unshare ?
                                <div className="linebr">
                                    {this.state.shareassetList.length !== 0 ?
                                        this.state.shareassetList.map((item, i) =>
                                            <div className="popshare2">
                                                <span>{item.full_name}</span>
                                                <CloseOutlined
                                                      style={{
                                                          fontSize: 14,
                                                          color: '#535353',
                                                          position: 'absolute',
                                                          right: 70
                                                      }}
                                                      onClick={() => {
                                                          let asset_array = []
                                                          if (type === 'email') {
                                                              asset_array = this.state.selectedEmailData

                                                          } else if (type === 'social') {
                                                              asset_array = this.state.selectedSocialData

                                                          } else if (type === 'job_board') {
                                                              asset_array = this.state.selectedJobData

                                                          } else {
                                                              asset_array = this.state.selectedPhoneData

                                                          }
                                                          this.unShareData(item.id, asset_array)
                                                      }}/>


                                            </div>
                                        ) :
                                        <div>
                                            No assets found
                                        </div>
                                    }
                                </div>

                                : null}

                        </div>

                    </div>

                </Modal>
                }
                <Drawer
                    title={"Edit " + this.state.selected_type}
                    width={720}
                    onClose={this.closeModal}
                    visible={this.state.edit}
                >
                    <EditEmail
                        handleClose={this.closeModal}
                        onUpdateChange={this.onUpdateChange}
                        asset_id={this.state.asset_id}
                        assetObj={this.state.assetObj}
                        selected_type={this.state.selected_type}/>

                </Drawer>
            </div>
        )
    }
}

export default EmailManage;
