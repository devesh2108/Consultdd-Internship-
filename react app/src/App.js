import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectList: [
                {
                    "ostk_project_id": 1411,
                    "name": "Zimbra HFWs",
                    "regions": [
                        {
                            "ostk_region_id": 7,
                            "name": "CH2-H"
                        },
                        {
                            "ostk_region_id": 10,
                            "name": "HO-C"
                        }
                    ],
                    "created": "2019-09-04 11:50:32",
                    "modified": "2019-09-04 11:50:32"
                },
                {
                    "ostk_project_id": 1410,
                    "name": "Zeta",
                    "regions": [
                        {
                            "ostk_region_id": 3,
                            "name": "AS-C"
                        },
                        {
                            "ostk_region_id": 6,
                            "name": "CH2-G"
                        },
                        {
                            "ostk_region_id": 7,
                            "name": "CH2-H"
                        },
                        {
                            "ostk_region_id": 9,
                            "name": "HO-B"
                        }
                    ],
                    "created": "2019-09-04 11:50:32",
                    "modified": "2019-09-04 11:50:32"
                },
                {
                    "ostk_project_id": 1409,
                    "name": "ZaaS",
                    "regions": [
                        {
                            "ostk_region_id": 7,
                            "name": "CH2-H"
                        },
                        {
                            "ostk_region_id": 10,
                            "name": "HO-C"
                        },
                        {
                            "ostk_region_id": 11,
                            "name": "PO-A"
                        }
                    ],
                    "created": "2019-09-04 11:50:32",
                    "modified": "2019-09-04 11:50:32"
                },
                {
                    "ostk_project_id": 1408,
                    "name": "Yoda",
                    "regions": [
                        {
                            "ostk_region_id": 8,
                            "name": "HO-A"
                        }
                    ],
                    "created": "2019-09-04 11:50:32",
                    "modified": "2019-09-04 11:50:32"
                },
                {
                    "ostk_project_id": 1407,
                    "name": "Yellowjacket",
                    "regions": [
                        {
                            "ostk_region_id": 10,
                            "name": "HO-C"
                        }
                    ],
                    "created": "2019-09-04 11:50:32",
                    "modified": "2019-09-04 11:50:32"
                },
                {
                    "ostk_project_id": 1406,
                    "name": "Xwifi-Data",
                    "regions": [
                        {
                            "ostk_region_id": 7,
                            "name": "CH2-H"
                        }
                    ],
                    "created": "2019-09-04 11:50:32",
                    "modified": "2019-09-04 11:50:32"
                },
                {
                    "ostk_project_id": 1405,
                    "name": "xWiFi Kafka",
                    "regions": [
                        {
                            "ostk_region_id": 1,
                            "name": "AS-A"
                        },
                        {
                            "ostk_region_id": 6,
                            "name": "CH2-G"
                        },
                        {
                            "ostk_region_id": 8,
                            "name": "HO-A"
                        }
                    ],
                    "created": "2019-09-04 11:50:32",
                    "modified": "2019-09-04 11:50:32"
                },
            ],
            req: 0,
            arrReq: [],
            temp_data: [
                {
                    name: 'xyz',
                    tabDataByDate: [
                        {
                            date: '11-nov',
                            beg: 12000,
                            req: 500,
                            end: 11500
                        },
                        {
                            date: '12-nov',
                            beg: 1300,
                            req: 20,
                            end: 40
                        }

                    ]
                },
                {
                    name: 'abc',
                    tabDataByDate: [
                        {
                            date: '11-nov',
                            beg: 12000,
                            req: 0,
                            end: 0
                        },
                        {
                            date: '12-nov',
                            beg: 0,
                            req: 0,
                            end: 0
                        }

                    ]
                }
            ],
            updatedList: [],
            searchList: [],
            status: false
        }
    }

    componentDidMount() {
        let updatedList = [];
        this.state.projectList.map((project, i) => {
            updatedList.push(project.name);
        })
        this.setState({updatedList: updatedList, searchList: updatedList, status: true})

    }


    onSearch = (event) => {
        var searchList = this.state.updatedList;
        searchList = searchList.filter(function (item) {
            return item.toLowerCase().search(
                event.target.value.toLowerCase()) !== -1;
        });
        this.setState({searchList: searchList});


    };
    onChangeReq = (event, i,item) => {
      this.setState({arrReq:item})
      console.log(item)
      let arr = item;
      arr[i] = event.target.value;
      this.setState({
        arrReq: arr
      })
    };

    render() {


        return (
            <div>
                <table>
                    {this.state.temp_data.map((data, j) =>
                        <tr>

                            <tr>{data.name}</tr>

                            <tr>beg inv</tr>
                            <tr>req inv</tr>
                            <tr>end inv</tr>

                            <th>
                                {data.tabDataByDate.map((item, i) =>

                                    <th>
                                        <tr>
                                            <td>{item.date}</td>
                                        </tr>
                                        <tr>
                                            <td>{item.beg}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                              <input defaultValue={item.req}
                                                     key={j}
                                                       value={this.state.arrReq[j]}
                                                     onChange={(e) =>
                                                         this.onChangeReq(e, j, data.tabDataByDate[j])
                                                     }/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{item.end}</td>
                                        </tr>
                                    </th>
                                )}
                            </th>
                        </tr>
                    )}
                </table>
            </div>
        );


    }
}

export default App;


