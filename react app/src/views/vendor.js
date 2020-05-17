import React, {Component} from 'react';
import "../App.css"
import {
    Button, Drawer
} from 'antd';
import {PlusCircleOutlined} from "@ant-design/icons"
import CreateVendorContact from "../components/createForms/vendorForm/createVendorContact";


class Vendor extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            vendorList: [],
            current_page: 1,
            current_size: 10,
            total: 20,
            createContact: false,
            loading: false
        }
        this.onPageChange = this.onPageChange.bind(this)
        this.showCreateContactModal = this.showCreateContactModal.bind(this)
        this.closeCreateContactModal = this.closeCreateContactModal.bind(this)


    }

    showCreateContactModal = () => {
        console.log("onClicked")
        this.setState({
            createContact: true,
        });
    };
    closeCreateContactModal = () => {
        this.setState({
            createContact: false,
        });
    };
    handleOk = () => {
        this.setState({loading: true});
        setTimeout(() => {
            this.setState({loading: false, createContact: false});
        }, 3000);
    };


    onPageChange = (page, size) => {
        this.setState({
            current_page: page,
            current_size: size
        });
    };


    render() {
        const createContact = this.state.createContact
        const loading = this.state.loading
        const columns = [
            {
                title: 'Vendor Name',
                dataIndex: 'vendor',
                key: 'vendor',
                width: '20%',

                render: (text, record) => (
                    <span>{text}</span>
                ),
            }

        ];
        return (
            <Container-fluid>
                <div style={{marginTop: '80px'}}>

                    <h2 style={{marginLeft: '10px'}}>Vendor Management</h2>
                    <br/>
                    <div>
                        <Button style={{
                            fontSize: 16,
                            position: 'absolute',
                            right: 40,
                            top: 100,
                            alignItems: 'center',
                        }}
                                onClick={() => this.showCreateContactModal()}
                        >
                            <span style={{textAlign: 'center', top: 2, position: 'relative'}}>Create contact</span>
                            <PlusCircleOutlined
                                  style={{
                                      fontSize: 20,
                                      color: 'white',
                                      borderRadius: '15px',
                                      marginLeft: '5px'
                                  }}/>
                        </Button>
                        <Drawer
                            title="Create Contact"
                            width={520}
                            onClose={this.closeCreateContactModal}
                            visible={createContact}
                        >
                            <CreateVendorContact closeCreateContactModal={this.closeCreateContactModal}/>
                        </Drawer>


                    </div>

                </div>
            </Container-fluid>


        );
    }
}

export default Vendor;
