import React, {Component} from 'react';
import "../../App.css";
import {Divider, Input, Table} from "antd";
import {DeleteOutlined,ShareAltOutlined} from "@ant-design/icons"

class PhoneAsset extends Component {


    render() {
        let selectedRowKeys = this.props.selectedRowKeys;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.props.onSelectPhoneChange,

        };
        const phoneColumns = [
            {
                title: 'Phone Number',
                dataIndex: 'number',
                key: 'email',
                width: '15%',

                render: (text, record) => (

                    <span onClick={() => this.props.phoneData(record)}>{text}</span>
                ),
            }, {
                title: 'Username',
                dataIndex: 'username',
                key: 'username',
                width: '15%',

                render: (text, record) => (
                    <span onClick={() => this.props.phoneData(record)}>{text}</span>

                ),
            },
            {
                title: 'Password',
                dataIndex: 'password',
                key: 'password',
                width: '15%',

                render: (text, record) => (
                    <Input.Password
                        value={text}
                        style={{border: 0}}
                        onClick={() => this.props.phoneData(record)}/>
                ),
            }, {
                title: 'Provider',
                dataIndex: 'provider',
                key: 'provider',
                width: '15%',

                render: (text, record) => (
                    <span onClick={() => this.props.phoneData(record)}>{text}</span>

                ),
            },
            {
                title: 'Owner',
                dataIndex: 'owner__full_name', //owner_name
                key: 'owner__full_name', //owner_name
                width: '12%',

                render: (text, record) => (
                    <span onClick={() => this.props.phoneData(record)}>{text}</span>
                ),
            },
            {
                title: 'Actions',
                key: "action",
                width: '12%',
                render: (text, record) => (
                    <span>
                     <ShareAltOutlined style={{fontSize: 18, color: '#2688db', float: 'left'}}
                            onClick={() => {
                                this.props.getSpecificAssetData(record.id)

                            }
                            }/>
                        <Divider type="vertical"/>
                        <DeleteOutlined style={{fontSize: 18, color: '#2688db', float: 'auto'}}
                              onClick={() => this.props.showDeleteConfirm(record.id, 'phone asset')}/>

        </span>
                )
            }];
        return (

            <div>
                <Table
                    className="assettable"
                    style={{width: '100%'}}
                    rowKey={(record) => record.id.toString()}
                    columns={phoneColumns}
                    rowSelection={rowSelection}
                    dataSource={this.props.data}
                    pagination={false}
                />
            </div>


        )
    }
}

export default PhoneAsset;
