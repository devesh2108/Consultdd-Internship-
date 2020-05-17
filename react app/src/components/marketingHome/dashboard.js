import React from 'react'
import "react-tabs/style/react-tabs.css";
import "react-tabs/style/react-tabs.css";
import {Link} from 'react-router-dom'
import {logout, notify, unReadNotify, markAllRead} from "../../services/service";
import 'antd/dist/antd.css';
import {Menu, Dropdown, Layout, Avatar} from 'antd';
import {UserOutlined,FormOutlined,BookOutlined,SnippetsOutlined,LogoutOutlined,MenuOutlined,NotificationOutlined,HomeOutlined,TeamOutlined,BankOutlined} from "@ant-design/icons"
import Home from "../../views/marketingHomeView/home";
import Archive from "../../views/marketingHomeView/archive";
import OldSubmission from "../../views/marketingHomeView/oldsubmission";
import AddUser from "../createForms/addUser";
import EmailManagement from "../../views/marketingHomeView/emailManage";
import Bench from "../../views/consultant";
import Profile from "../../views/userForms/profile";
import Finance from "../../views/marketingHomeView/finance";
import Notify from "../Notify/notify";
import firebase from "firebase";

const {Header, Sider} = Layout;

class Dashboard extends React.Component {

    constructor(props, context) {
        let isFinance = false, isUser = false,financeRole="";
        const data = JSON.parse(localStorage.getItem('DATA'));
        const role = data.roles;
        role.map((r, i) => {
            if (r === "finance") {
                financeRole="finance"
                isFinance = true
            }
        })
        super(props, context);
        this.state = {
            collapsed: false,
            home: isFinance ? false : true,
            old: false,
            user: false,
            archive: false,
            profile: false,
            vendor: false,
            assets: false,
            bench: false,
            finance: isFinance ? true : false,
            key: isFinance ? '4' : '1',
            consultant: false,
            users: [],
            prevData: [],
            notificationList: [],
            counter: 0,
            financeRole:financeRole

        };
        if (!data) {
            this.props.history.push("/login")
        }
        else if (isFinance) {
            this.props.history.push("/home/finance")
        }
        else {
            this.props.history.push("/home")
        }
        this.logout = this.logout.bind(this);
        this.setArchive = this.setArchive.bind(this);
        this.setBench = this.setBench.bind(this);
        this.setProfile = this.setProfile.bind(this);
        this.setUser = this.setUser.bind(this);
        this.setOld = this.setOld.bind(this);
        this.setVendor = this.setVendor.bind(this);
        this.setHome = this.setHome.bind(this);
        this.setAssets = this.setAssets.bind(this);
        this.setFinance = this.setFinance.bind(this);
        this.setConsultant = this.setConsultant.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }


    componentDidMount() {
        //this.userDetails()
        this.notify();
    }

    foregroundPushNotify() {
        console.log('foreground notify');
        const messaging = firebase.messaging();
        messaging.onMessage((payload) => {
            console.log("payload", payload)
            // const title = payload.notification.title;
            // console.log('lopayload', title);
        })
    }

    notify = () => {
        notify()
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
                    this.props.history.push("/login")
                } else {
                    console.log(res.results)
                    let counter = 0, color = [], fontWeight = [],
                        prevData = this.state.notificationList.length === 0 ? res.results : this.state.notificationList;

                    res.results.map((notify, i) => {
                        if (notify.unread) {
                            counter++;
                            color[i] = '#edf2f9'
                            fontWeight[i] = '400'
                        } else {
                            color[i] = '#fff'
                            fontWeight[i] = '900'
                        }
                    })
                    this.setState({
                        prevData: prevData,
                        notificationList: res.results,
                        counter: counter,
                        color: color,
                        fontWeight: fontWeight,
                    })


                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    unReadNotify = (id, target_id) => {
        unReadNotify(id)
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
                    this.props.history.push("/login")
                } else {
                    console.log(res)
                    localStorage.setItem('CID', target_id)
                    this.props.history.push('/timesheet')
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    markAllRead = () => {
        markAllRead()
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
                    this.props.history.push("/login")
                } else {
                    let tempColorArr = [], tempFontArr = [];
                    this.state.color.map((ele, i) => {
                        ele = '#fff';
                        tempColorArr.push(ele)
                    })
                    this.state.fontWeight.map((ele, i) => {
                        ele = '900';
                        tempFontArr.push(ele)
                    })
                    this.setState({
                        counter: 0,
                        color: tempColorArr,
                        fontWeight: tempFontArr
                    })
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    logout() {
        logout()
            .then((response) => {

                const statusCode = response.status;

                localStorage.removeItem('DATA')
                localStorage.removeItem('CID');
                this.props.history.replace("/login")
                //window.location.reload(true)


            })
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    closeModal() {
        this.setState({modalIsOpen: false, consultant: false});

    }

    setArchive() {
        this.setState({
            archive: true,
            old: false,
            user: false,
            home: false,
            profile: false,
            vendor: false,
            bench: false,
            assets: false,
            consultant: false,
            finance: false,
        })
    }

    setHome() {
        this.setState({
            home: true,
            archive: false,
            old: false,
            user: false,
            profile: false,
            vendor: false,
            bench: false,
            assets: false,
            consultant: false,
            finance: false,

        })
    }

    setConsultant() {
        this.setState({
            home: false,
            consultant: true,
            archive: false,
            old: false,
            user: false,
            profile: false,
            vendor: false,
            bench: false,
            assets: false,
            finance: false,

        })
    }

    setOld() {
        this.setState({
            old: true,
            archive: false,
            user: false,
            home: false,
            profile: false,
            vendor: false,
            bench: false,
            assets: false,
            consultant: false,
            finance: false,
        })
    }

    setUser() {
        this.setState({
            user: true,
            archive: false,
            old: false,
            home: false,
            profile: false,
            vendor: false,
            bench: false,
            assets: false,
            consultant: false,
            finance: false,
        })
    }

    setProfile() {
        this.setState({
            user: false,
            archive: false,
            old: false,
            home: false,
            profile: true,
            vendor: false,
            bench: false,
            assets: false,
            consultant: false,
            finance: false,
        })
    }


    setVendor() {
        this.setState({
            profile: false,
            user: false,
            archive: false,
            old: false,
            home: false,
            vendor: true,
            bench: false,
            assets: false,
            consultant: false,
            finance: false,
        })
    }

    setBench() {
        this.setState({
            profile: false,
            user: false,
            archive: false,
            old: false,
            home: false,
            vendor: false,
            bench: true,
            assets: false,
            consultant: false,
            finance: false,
        })
    }

    setAssets() {
        this.setState({
            profile: false,
            user: false,
            archive: false,
            old: false,
            home: false,
            vendor: false,
            bench: false,
            assets: true,
            consultant: false,
            finance: false,
        })
    }

    setFinance() {
        this.setState({
            profile: false,
            user: false,
            archive: false,
            old: false,
            home: false,
            vendor: false,
            bench: false,
            assets: false,
            consultant: false,
            finance: true,
        })
    }


    render() {

        const data = JSON.parse(localStorage.getItem('DATA'));
        const role = data.roles;
        const team = data.team;
        const name = data.employee_name;
        const menu = (
            <Menu className="profilesec">
                {name !== null && team !== null ?
                    <Menu.Item key="0">

                        <span style={{fontSize: 16, fontWeight: '700'}}> <UserOutlined /> {name}</span>
                        <br/>
                        Team:<span style={{fontSize: 14, fontWeight: '300'}}>{team}</span>
                    </Menu.Item>
                    : null}
                <Menu.Divider/>
                <Menu.Item key="1" onClick={() => this.setProfile()}>

                    <FormOutlined />
                    <span>View Profile</span>
                </Menu.Item>
                { role.map(r => r === "superadmin") ?

                    <Menu.Item key="3" onClick={this.setUser}>
                        <UserOutlined />
                        <span onClick={this.setUser}>Add
                                        User</span>
                    </Menu.Item>


                    : null}
                <Menu.Item key="4" onClick={this.setAssets}>
                    <BookOutlined />
                    <span onClick={this.setAssets}>Assets</span>
                </Menu.Item>
                <Menu.Item key="5" onClick={this.setOld}>
                    <SnippetsOutlined />

                    <span className="navoldbuttton" onClick={this.setOld}>
                        Old Submission
                                </span>
                </Menu.Item>
                <Menu.Item key="6" onClick={this.logout}>
                    <LogoutOutlined />
                    <span>Logout</span>
                </Menu.Item>
            </Menu>
        );


        return (

            <Layout>
                <Header>
                    <Menu className="mainnavbar" mode="horizontal">
                    <Menu.Item key="trigger">
                        <MenuOutlined
                            style={{fontSize: 28, position: 'fixed', left: 30, bottom: 15, top: 15, color: 'white'}}
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />

                    </Menu.Item>
                    <Menu.Item key="logo">
                        <img style={{width: '60px', position: 'fixed', left: 100, bottom: 38, top: 10}}
                             src="../../icon_white.png"/>

                    </Menu.Item>

                    <Menu.Item>
                        <Dropdown
                            className="notify_new"
                            overlay={(
                                <Notify
                                    markAllRead={this.markAllRead}
                                    notifications={this.state.notificationList}
                                    history={this.props.history}
                                    unReadNotify={this.unReadNotify}
                                    color={this.state.color}
                                    fontWeight={this.state.fontWeight}
                                />
                            )} trigger={['click']}>
                            <div className="div-notify">
                                <NotificationOutlined  type="bell" style={{fontSize: 28}}/>
                                <div className="notify-open">
                                    <span className="notify-open-span">{this.state.counter}</span>
                                </div>
                            </div>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item key="profile">
                        <Dropdown overlay={menu} trigger={['click']}>
                            {/*<Icon style={{fontSize: 22, color: 'white'}} theme="outlined">settings</Icon>*/}
                            {name !== null ?
                                <Avatar style={{
                                    backgroundColor: '#ffbf00',
                                    verticalAlign: 'middle',
                                    position: 'fixed',
                                    right: 15,
                                    top: 15,
                                    bottom: 15,
                                }} size="large">
                                    {name.split(" ").length >= 2 ?
                                        name.split(" ")[0].charAt(0) + name.split(" ")[1].charAt(0) : name.split(" ")[0].charAt(0)
                                    }
                                </Avatar>
                                : null}
                        </Dropdown>
                    </Menu.Item>

                </Menu>

                </Header>


                <Layout>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed}>


                                <Menu style={{backgroundColor: '#2688db', color: 'white'}} mode="inline"
                                      defaultSelectedKeys={[this.state.key]}
                                      defaultOpenKeys={[this.state.key]}>
                                    <Menu.Item key="home" onClick={this.setHome}>
                                        <Link to={"/home"}>
                                            <HomeOutlined />
                                            <span className="navoldbuttton" onClick={this.setHome}>
                                   Marketing Home
                                </span>
                                        </Link>
                                    </Menu.Item>


                                    <Menu.Item key="bench" onClick={this.setBench}>
                                        <Link to={"/home/bench"}>
                                            <TeamOutlined />
                                            <span onClick={this.setBench}>Consultant</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="finance" onClick={this.setFinance}>
                                        <Link to={"/home/finance"}>
                                            <BankOutlined />
                                            <span onClick={this.setFinance}>Finance</span>
                                        </Link>
                                    </Menu.Item>

                                </Menu>

                    </Sider>

                    <Layout>
                        {this.state.home && <Home setArchive={this.setArchive} history={this.props.history}/>
                        }
                        {this.state.old &&
                        <OldSubmission history={this.props.history}/>
                        }
                        {this.state.user && <AddUser history={this.props.history}/>
                        }
                        {this.state.profile && <Profile history={this.props.history}/>
                        }
                        {this.state.archive &&
                        <Container-fluid>
                            <h2 style={{marginTop: 70, marginRight: 10, marginLeft: 10}}>Archived Leads</h2>
                            <Archive history={this.props.history}/>
                        </Container-fluid>

                        }
                        {this.state.assets &&
                        <EmailManagement history={this.props.history}/>
                        }
                        {this.state.bench &&
                        <Bench history={this.props.history}/>
                        }
                        {role.map(r => r === "finance") && this.state.finance &&
                        <Finance history={this.props.history}/>}

                    </Layout>
                </Layout>
            </Layout>

        );
    }
}

export default Dashboard
