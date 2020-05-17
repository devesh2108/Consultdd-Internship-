import {addExperience, editExperience} from "../services/service";
import moment from "moment";

export async function addExp (props,consultantId) {
    const body = {
        'title': props.title,
        'remark': props.remark || null,
        'city': props.city,
        'company': props.company,
        'exp_type': props.type,
        'start_date': moment(props.start_date).format("YYYY-MM-DD"),
        'end_date': moment(props.end_date).format("YYYY-MM-DD"),
    }
    await addExperience(consultantId, body)
        .then((response) => {
            const statusCode = response.status;
            const res = response.json();
            return Promise.all([statusCode, res]);
        })
        .then(([status, res]) => {
            return body
        })
        .catch(error => {
            return error
        });
}

export async function editExp (props,obj) {

    const body = {
        'id':obj.id,
        'title': props.title,
        'remark': props.remark,
        'city': props.city,
        'company': props.company,
        'exp_type': props.type,
        'start_date': moment(props.start_date).format("YYYY-MM-DD"),
        'end_date': moment(props.end_date).format("YYYY-MM-DD"),
    }
    console.log("--------body------",body)
    await editExperience(obj.id, body)
        .then((response) => {
            const statusCode = response.status;
            const res = response.json();
            return Promise.all([statusCode, res]);
        })
        .then(([status, res]) => {
           return body
        })
        .catch(error => {
            console.log(error)
        });
}
