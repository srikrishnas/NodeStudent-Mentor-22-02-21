const express = require('express')
const app = express()

app.use(express.json());

var student = [
    {
        "student_id": "stu4",
        "student_name": "d",
        "student_email": "d@gmail.com",
        "student_contact": 400,
        "mentor": "" //student can have only one mentor
    },
    {
        "student_id": "stu5",
        "student_name": "e",
        "student_email": "e@gmail.com",
        "student_contact": 500,
        "mentor": "mente1"
    },
    {
        "student_id": "stu6",
        "student_name": "f",
        "student_email": "f@gmail.com",
        "student_contact": 600,
        "mentor": "mente1"
    }
]

var mentor = [
    {
        "mentor_id": "mente1",
        "mentor_name": "venkat",
        "mentor_email": "venkat@guvi.in",
        "mentor_contact": 1234567890,
        "students": [
            {
                "student_id": "stu1",
                "student_name": "a",
                "student_email": "a@gmail.com",
                "student_contact": 100,
                "mentor": "mente1"
            },
            {
                "student_id": "stu2",
                "student_name": "b",
                "student_email": "b@gmail.com",
                "student_contact": 200,
                "mentor": "mente1"
            }
        ] //one mentor can have n number of students
    },
    {
        "mentor_id": "mente2",
        "mentor_name": "banu",
        "mentor_email": "banu@guvi.in",
        "mentor_contact": 1234567890,
        "students": [
            {
                "student_id": "stu3",
                "student_name": "c",
                "student_email": "c@gmail.com",
                "student_contact": 300,
                "mentor": "mente2"
            }
        ]
    }

]

// 1. API to create Mentor
app.post('/create-mentor', function (req, res) {
    try {
        mentor.push(req.body);
        console.log(mentor);
        res.status(200).send("sudent saved")
    }
    catch {
        res.status(200).send("Mentor not saved!")
    }

})

// 2. API to create Student
app.post('/create-student', function (req, res) {
    try {
        student.push(req.body)
        console.log(student)
        res.status(200).send("Student saved")
    }
    catch {
        res.status(200).send("Student not saved!")
    }
})

// 3. API to assign student to a mentor
app.post('/assign-student-to-mentor', (req, res) => {
    console.log(req.body)
    let { studentList, mentor_id } = req.body;
    console.log(studentList)
    try {

        studentList.forEach(student_id => {
            //assigning mentor to student in student json
            let stuIndex = student.findIndex((item) => item.student_id == student_id)
            student[stuIndex].mentor = mentor_id;

            //assigning mentor with student details(inserting)
            let menteIndex = mentor.findIndex((item) => item.mentor_id == student[stuIndex].mentor)
            mentor[menteIndex].students.push(student[stuIndex])

            //deleteing student details from student json after entry
            student.splice(stuIndex, 1);

        });

        console.log(student);
        console.log(mentor[0]);
        res.status(200).send("updated the entry")
    }
    catch {
        res.status(200).send("Couldn't update")
    }
    // try {
    //     var { student_id, mentor_id } = req.body;

    //     //assigning mentor to student in student json
    //     let stuIndex = student.findIndex((item) => item.student_id == student_id)
    //     student[stuIndex].mentor = mentor_id;

    //     //assigning mentor with student details(inserting)
    //     let menteIndex = mentor.findIndex((item) => item.mentor_id == student[stuIndex].mentor)
    //     mentor[menteIndex].students.push(student[stuIndex])

    //     //deleteing student details from student json after entry
    //     student.splice(stuIndex, 1);

    //     console.log(student);
    //     console.log(mentor);
    //     res.status(200).send("updated the entry")
    // }
    // catch {
    //     res.status(200).send("Couldn't update")
    // }
})

function assignMentortoStu(req, res) {
    let { student_id, new_mentor_id } = req.body;

    //1.if student in student list

    //check student in student json
    let stuIndex = student.findIndex((item) => item.student_id == student_id)

    let menteIndex = mentor.findIndex((item) => item.mentor_id == new_mentor_id)
    console.log(menteIndex);

    if (stuIndex != -1) {

        student[stuIndex].mentor = new_mentor_id;

        let menteeIndex = mentor.findIndex((item) => item.mentor_id == new_mentor_id);
        console.log(menteeIndex)

        if (menteeIndex != -1) {
            mentor[menteeIndex].students.push(student[stuIndex]);
        }

        student.splice(stuIndex, 1);

        return 1;
    }
    else if (menteIndex != -1) {
        let stuInmentIndex;
        let stuIndexOldMntee;

        //find where is student in all mentors list
        for (let i = 0; i < mentor.length; i++) {
            stuInmentIndex = mentor[i].students.findIndex((item) => item.student_id == student_id)
            stuIndexOldMntee = i; // this will  give old mentor index
            if (stuInmentIndex != -1) { break; }
        }

        //assigning mentor
        mentor[stuIndexOldMntee].students[stuInmentIndex].mentor = new_mentor_id;
        console.log(mentor[stuIndexOldMntee].students[stuInmentIndex])

        //move student to new mentor
        //got new menteIndex from ouside
        mentor[menteIndex].students.push(mentor[stuIndexOldMntee].students[stuInmentIndex])
        console.log(mentor[menteIndex].students)

        //delete from old mentor
        mentor[stuIndexOldMntee].students.splice(stuInmentIndex, 1);
        return 1;
    }
    else {
        return 0;
    }


}

// 4. API to assign or to change mentor for student
app.put('/assign-mentor-or-change', (req, res) => {
    try {
        op = assignMentortoStu(req, res);
        res.status(200).send("updated")
    }
    catch {
        res.status(200).send("Couldn't update")
    }
})

// 5. API to show all students of a mentor
app.get('/get-mentor-student-list', function (req, res) {
    try {
        let index = mentor.findIndex((item) => item.mentor_id == req.body.mentor_id)
        console.log(index)
        res.status(200).send(mentor[index].students)
    }
    catch {
        res.status(200).send(" Mentor Not Found ")
    }
})

app.listen(3000)

