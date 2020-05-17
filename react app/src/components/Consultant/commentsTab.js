import React from 'react';
import 'antd/dist/antd.css';
import {Comment, Avatar, Form, Button, List, Input} from 'antd';
import moment from 'moment';
import {addComment, getComments} from "../../services/service";

const {TextArea} = Input;


const Editor = ({onChange, onSubmit, submitting, value}) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value}/>
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </div>
);

export default class CommentsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            submitting: false,
            childSubmitting: false,
            parent: '',
            childComment: '',
            openEditor: false,
            openChildEditor: [false],
            parentId: null,
            status: false
        };
    }

    getComments(consultantId) {
        getComments(consultantId)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res);
                this.setState({
                    comments: res.results,
                    status: true
                })

            })
            .catch(error => {
                console.log(error)
            });

    }

    componentDidMount() {
        this.getComments(this.props.consultantId)
    }


    handleSubmit = (i) => {
        if (!this.state.parent) {
            return;
        }

        this.setState({
            submitting: true,
        });
        const body={
            'comment_text':this.state.parent,
            'parent_comment':''
        }
        addComment(this.props.consultantId,body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                setTimeout(() => {
                    this.state.comments.push(res.result)
                    this.setState({
                        submitting: false,
                        parent: '',
                        openEditor: false
                    });
                }, 1000);            })
            .catch(error => {
                console.log(error)
            });

    };
    handleChildSubmit = (i, id) => {
        console.log("parent",id)
        if (!this.state.childComment) {
            return;
        }

        this.setState({
            childSubmitting: true,
        });
        const body={
            'comment_text': this.state.childComment,
            'parent_comment':id
        }
        addComment(this.props.consultantId,body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                setTimeout(() => {
                    this.setState({
                        childSubmitting: false,
                        childComment: '',
                        openChildEditor: [false],
                    });
                }, 1000);
                this.getComments(this.props.consultantId)
            })
            .catch(error => {
                console.log(error)
            });
    };
    handleChange = e => {
        this.setState({
            parent: e.target.value,
        });
    };
    handleChildChange = e => {
        this.setState({
            childComment: e.target.value,
        });
    };
    changeCommentOpenEditor = (i) => {
        let arr = [false]
        arr[i] = true
        this.setState({openEditor: true})

    }
    changeChildCommentOpenEditor = (i, comment_id) => {
        console.log(i, "----i")
        let arr = [false]
        arr[i] = true
        this.setState({openChildEditor: arr, parentId: comment_id})

    }

    render() {
        const data = JSON.parse(localStorage.getItem('DATA'));
        const name = data.employee_name;
        const {comments, submitting, value} = this.state;
        return (
            this.state.status &&
            <div>
                {comments.length > 0 && comments.map((comment, i) => (

                    <Comment
                        key={comment.id}
                        actions={[<span key="comment-nested-reply-to"
                                        onClick={() => this.changeChildCommentOpenEditor(i, comment.parent_comment)}>Reply to</span>]}
                        author={<a>{comment.user.employee_name}</a>}
                        avatar={
                            <Avatar style={{backgroundColor:'#3881bf',color:'#fff'}}>{comment.user.employee_name.split(" ")[0].charAt(0).toUpperCase()+comment.user.employee_name.split(" ")[1].charAt(0).toUpperCase()}</Avatar>
                        }
                        content={
                            <p>
                                {comment.comment_text}
                            </p>
                        }
                    >
                        {comment.child_comment.length > 0 && comment.child_comment.map((childComment, j) =>
                            <div>
                                <Comment
                                    key={childComment.id}
                                    author={<a>{childComment.user.employee_name}</a>}
                                    avatar={
                                        <Avatar style={{backgroundColor:'#3881bf',color:'#fff'}}>{childComment.user.employee_name.split(" ")[0].charAt(0).toUpperCase()+childComment.user.employee_name.split(" ")[1].charAt(0).toUpperCase()}</Avatar>

                                    }
                                    content={
                                        <p>
                                            {childComment.comment_text}
                                        </p>
                                    }
                                />
                            </div>
                        )
                        }
                        {this.state.openChildEditor[i] &&
                        <div>
                            <Comment
                                avatar={
                                    <Avatar style={{backgroundColor:'#3881bf',color:'#fff'}}>{name.split(" ")[0].charAt(0).toUpperCase()+name.split(" ")[1].charAt(0).toUpperCase()}</Avatar>

                                }
                                author={<a>{name}</a>}
                                content={this.state.openChildEditor[i]}
                            />
                            <Editor
                                onChange={this.handleChildChange}
                                onSubmit={() => this.handleChildSubmit(i, comment.id)}
                                submitting={this.state.childSubmitting}
                                value={this.state.childComment}
                            />
                        </div>
                        }
                    </Comment>
                ))
                }
                {!this.state.openEditor &&
                <Button key="comment-nested-reply-to" onClick={() => this.changeCommentOpenEditor()}>Add
                    comment</Button>}
                {this.state.openEditor &&
                <div>
                    <Comment
                        avatar={
                            <Avatar style={{backgroundColor:'#3881bf',color:'#fff'}}>{name.split(" ")[0].charAt(0).toUpperCase()+name.split(" ")[1].charAt(0).toUpperCase()}</Avatar>

                        }
                        author={<a>{name}</a>}
                        content={this.state.openEditor}
                    />
                    <Editor
                        onChange={this.handleChange}
                        onSubmit={() => this.handleSubmit("")}
                        submitting={this.state.submitting}
                        value={this.state.parent}
                    />
                </div>
                }

            </div>
        );
    }
}

