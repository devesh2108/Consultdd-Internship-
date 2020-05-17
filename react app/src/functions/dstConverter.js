export function findFirstSundayNov(d) {
    var date= new Date(d.getFullYear(),10,1)
    var novDate = new Date (date.getFullYear(), date.getMonth(), 1, 0, 0, 0)
    if(date.getDay() == 0){
        novDate.setDate(date.getDate())
    }
    else{
        novDate.setDate(date.getDate() + 7   - date.getDay())
    }
    return novDate
}

export function findSecondSundayMar(d) {
    var date= new Date(d.getFullYear(),2,1)
    var marDate = new Date (date.getFullYear(), date.getMonth(), 1, 0, 0, 0)
    if(date.getDay() == 0){
        marDate.setDate(date.getDate()+7)
    }
    else{
        marDate.setDate(date.getDate() + 14  - date.getDay())
    }
    return marDate
}
