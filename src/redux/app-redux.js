import { createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as firebase from 'firebase'
import { ReactReduxContext } from 'react-redux'

//Initial State
const initialState = {
    userInfo: { },
    email: '',
    username: '',
    userClasses: [],
    classCode: '',
    documentList: [],
    posts: [],
    postKey: '',
    comments: [],
    assignmentList: [],
    studentAsignmentList: [],
    assignmentKey: '',
    attendanceKey: '',
    studentList: [],
    attended: '',
    totalAttendance: '',
}

//Reducer
const reducer = (state= initialState, action) => {
    switch(action.type){
        case "setUserInfo":
            return {...state, userInfo: action.value};
        case "setEmail":
            return {...state, email: action.value};
        case "setUsername":
            return {...state, username: action.value};
        case "setUserClasses":
            return {...state, userClasses: action.value};
        case "setClassCode":
            return {...state, classCode: action.value};
        case "setDocumentList":
            return {...state, documentList: action.value};
        case "setAnnnouncements":
            return {...state, posts: action.value};
        case "setPostKey":
            return {...state, postKey: action.value};
        case "setComments":
            return {...state, comments: action.value};
        case "setAssignmentList":
            return {...state, assignmentList: action.value};
        case "setStudentAssignmentList":
            return {...state, studentAsignmentList: action.value};
        case "setAssignmentKey":
            return {...state, assignmentKey: action.value};
        case "setAttendanceKey":
            return {...state, attendanceKey: action.value};
        case "setStudentList":
            return {...state, studentList: action.value};
        case "setAttended":
            return {...state, attended: action.value};
        case "setTotal":
            return {...state, totalAttendance: action.value};
        default:
            return state;
    }
}

//Store
const store = createStore(reducer, applyMiddleware(thunkMiddleware))
export {store}

//Action Creators

const setUserInfo = (userInfo) => {
    return {
        type: "setUserInfo",
        value: userInfo
    }
}

const setEmail = (email) => {
    return {
        type: "setEmail",
        value: email
    }
}

const setUsername = (username) => {
    return {
        type: "setUsername",
        value: username
    }
}

const setAttended = (attended) => {
    return {
        type: "setAttended",
        value: attended
    }
}

const watchUserInfo = (email) => {

    return function(dispatch){

        const userRef = firebase.database().ref("User");
    
        const query = userRef.orderByChild('email').equalTo(email)
         query.once('value').then(snapshot => {
            //take user
            var userInfo = snapshot.val()
            dispatch(setUserInfo(userInfo))
            
            snapshot.forEach(child => {
                dispatch(setEmail(child.val().email))
                dispatch(setUsername(child.val().username))
            })
            
        })

    }
   
}

const watchUserAttendance = (classCode) => {

    return function ( dispatch ) {
        const userRef = firebase.database().ref('User');
             userRef.once('value').then(user => {
                user.forEach(child => {  
                    firebase.database().ref()
                    .child("User/" + child.key + "/classes")
                    .once('value', (snapshot) => {
                        snapshot.forEach(snapshotchild =>{
                            if(classCode == snapshotchild.child("classCode").val() && child.child("userType").val() == 'Student'){
                                console.log(snapshotchild)
                                dispatch(setAttended(snapshotchild.val().attendance))
                            }
                        })
                    })    
                })
              })
    }
}


const setUserClasses = (userClasses) => {
    return {
        type: "setUserClasses",
        value: userClasses
    }
}

const setDocumentList = (documentList) =>{
    return {
        type: "setDocumentList",
        value: documentList
    }
}

const setClassCode = (classCode) => {
    return {
        type: "setClassCode",
        value: classCode
    }
}

const setAssignmentList = (assignmentList) =>{
    return {
        type: "setAssignmentList",
        value: assignmentList
    }
}

const setStudentAssignmentList = (studentAsignmentList) =>{
    return {
        type: "setStudentAssignmentList",
        value: studentAsignmentList
    }
}

const setAssignmentKey = (assignmentKey) => {
    return {
        type: "setAssignmentKey",
        value: assignmentKey
    }
}

const setStudentList = (studentList) => {
    return {
        type: "setStudentList",
        value: studentList
    }
}

const wathUserClasses = (email) => {

    return function ( dispatch ) {

        const classesList = []
        
            const userRef = firebase.database().ref("User");
            const query = userRef.orderByChild('email').equalTo(email)
            return query.once('value').then(user => {  
                const promises = []
                user.forEach(userChild => {
                    userChild.child('classes').forEach(classesChild => {
                        var classCode = classesChild.val().classCode
                        const request = firebase.database().ref('Classes')
                        .orderByChild('classCode').equalTo(classCode)
                        .once('value').then(actualClass => {
                            actualClass.forEach(classChild => {
                                classesList.push({
                                    name: classChild.val().className,
                                    courseField: classChild.val().classField,
                                    instructue: classChild.val().instructure,
                                    classCode: classChild.val().classCode,
                                    theme: 'deepskyblue'
                                })
                            }) 
                        })
                        promises.push(request)
                    })
                })
                return Promise.all(promises)
            }).then(() => {
                dispatch(setUserClasses(classesList))
            })
                
    }
}

const watchDocuments = (classCode) =>{
    
    return function ( dispatch ) {

        const documentList = []
      
        const classesRef = firebase.database().ref('Classes');
        const query = classesRef.orderByChild('classCode').equalTo(classCode);
        return query.once('value').then(snapshot => {
            const promises = []
            snapshot.forEach(child => {
                const ref = firebase.database().ref()
                .child("Classes/" + child.key + "/Documents")
                .once('value', (snapshot) => {
                snapshot.forEach(snapshotchild =>{
                    documentList.push({
                        name: snapshotchild.child("name").val(),
                        title: snapshotchild.child("title").val(),
                        description: snapshotchild.child("description").val(),
                        uri: snapshotchild.child("uri").val()
                    })
                })
            })
            promises.push(ref)
            })
            return Promise.all(promises)
        }).then(() => {
            dispatch(setDocumentList(documentList))
        })
    }
}

const setAnnnouncements = (posts) => {
    return {
        type: "setAnnnouncements",
        value: posts
    }
}

const watchAnnouncements = (classCode) => {

    return function ( dispatch ) {

        const posts = []
      
        const classesRef = firebase.database().ref('Classes');
        const query = classesRef.orderByChild('classCode').equalTo(classCode);
        return query.once('value').then(snapshot => {
            const promises = []
            snapshot.forEach(child => {
                const ref = firebase.database().ref()
                .child("Classes/" + child.key + "/Announcements")
                .once('value', (snapshot) => {
                snapshot.forEach(snapshotchild =>{
                    posts.push({
                        post: snapshotchild.val().post,
                        username: snapshotchild.val().username,
                        email: snapshotchild.val().email,
                        key: snapshotchild.val().key
                    })
                })
            })
            promises.push(ref)
            })
            return Promise.all(promises)
        }).then(() => {
            dispatch(setAnnnouncements(posts.reverse()))
        })
    }
}

const watchAssignments = (classCode) =>{
    return function ( dispatch ) {

        const assignmentList = []
      
        const classesRef = firebase.database().ref('Classes');
        const query = classesRef.orderByChild('classCode').equalTo(classCode);
        return query.once('value').then(snapshot => {
            const promises = []
            snapshot.forEach(child => {
                const ref = firebase.database().ref()
                .child("Classes/" + child.key + "/Assignments")
                .once('value', (snapshot) => {
                snapshot.forEach(snapshotchild =>{
                    assignmentList.push({
                        name: snapshotchild.child("name").val(),
                        title: snapshotchild.child("title").val(),
                        uri: snapshotchild.child("uri").val(),
                        deadline: snapshotchild.child("deadline").val(),
                        key: snapshotchild.child("key").val()
                    })
                })
            })
            promises.push(ref)
            })
            return Promise.all(promises)
        }).then(() => {
            dispatch(setAssignmentList(assignmentList))
        })
    }
}

const watchStudentAssignments = (classCode, assignmentKey) =>{
    return function ( dispatch ) {
    
        const assignmentList = []
      
        const classesRef = firebase.database().ref('Classes');
        const query = classesRef.orderByChild('classCode').equalTo(classCode);
        return query.once('value').then(snapshot => {
            const promises = []
            snapshot.forEach(child => {
                const ref = firebase.database().ref()
                .child("Classes/" + child.key + "/Assignments/" + assignmentKey + "/StudentAssignments")
                .once('value', (snapshot) => {
                snapshot.forEach(snapshotchild =>{
                    assignmentList.push({
                        comment: snapshotchild.child("comment").val(),
                        name: snapshotchild.child("name").val(),
                        uri: snapshotchild.child("uri").val(),
                        studentName: snapshotchild.child("studentName").val(),
                        assignmentKey: snapshotchild.child("assignmentKey").val()
                    })
                })
            })
            promises.push(ref)
            })
            return Promise.all(promises)
        }).then(() => {
            dispatch(setStudentAssignmentList(assignmentList))
        })
    }
}

const watchStudentList = (classCode) =>{
    return function ( dispatch ) {
    const studentList = []
    const userRef = firebase.database().ref('User');
        return userRef.once('value').then(user => {
            const promises = []
            user.forEach(child => {  
                const ref = firebase.database().ref()
                .child("User/" + child.key + "/classes")
                .once('value', (snapshot) => {
                    snapshot.forEach(snapshotchild =>{
                        if(classCode == snapshotchild.child("classCode").val() && child.child("userType").val() == 'Student'){
                            studentList.push({
                                name:child.child("username").val(),
                                attended: snapshotchild.child("attendance").val()
                            })
                        }
                    })
                })    
                promises.push(ref)
            })
            return Promise.all(promises)
          }).then(() => {
            dispatch(setStudentList(studentList))
          })
}
}

const setPostKey = (postKey) => {
    return {
        type: "setPostKey",
        value: postKey
    }
}

const setComments = (comments) => {
    return {
        type: "setComments",
        value: comments
    }
}

const watchComments = (classCode, postKey) => {

    return function ( dispatch ) {

        const comments = []
      
        const classesRef = firebase.database().ref('Classes');
        const query = classesRef.orderByChild('classCode').equalTo(classCode);
        return query.once('value').then(snapshot => {
            const promises = []
            snapshot.forEach(child => {
                const ref = firebase.database().ref()
                .child("Classes/" + child.key + "/Announcements/" + postKey + '/Comments')
                .once('value', (snapshot) => {
                snapshot.forEach(snapshotchild =>{
                    comments.push({
                        comment: snapshotchild.val().comment,
                        username: snapshotchild.val().username,
                        email: snapshotchild.val().email,
                        postKey: snapshotchild.val().postKey,
                        commentKey: snapshotchild.val().commentKey,
                    })
                })
            })
            promises.push(ref)
            })
            return Promise.all(promises)
        }).then(() => {
            dispatch(setComments(comments.reverse()))
        })
    }

}

const setAttendanceKey = (key) => {
    return {
        type: "setAttendanceKey",
        value: key
    }
}

const setTotal = (total) => {
    return {
        type: "setTotal",
        value: total
    }
}

const watchAttendance = (classCode) => {

    return function ( dispatch ) {

        var totalAttendance = ''
      
        const classesRef = firebase.database().ref('Classes');
        const query = classesRef.orderByChild('classCode').equalTo(classCode);
        return query.once('value').then(snapshot => {
            const promises = []
            snapshot.forEach(child => {
                const ref = firebase.database().ref()
                .child("Classes/" + child.key + "/Attendance")
                .once('value', (snapshot) => {
                snapshot.forEach(snapshotchild =>{
                    totalAttendance++
                })
            })
            promises.push(ref)
            })
            return Promise.all(promises)
        }).then(() => {
            dispatch(setTotal(totalAttendance))
        })
    }
}


export {
    setUserInfo, 
    watchUserInfo, 
    wathUserClasses, 
    setClassCode, 
    watchDocuments, 
    watchAnnouncements,
    setPostKey,
    watchComments,
    watchAssignments, 
    watchStudentAssignments, 
    setAssignmentKey,
    setAttendanceKey,
    watchStudentList,
    watchAttendance,
    watchUserAttendance
}