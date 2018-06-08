module.exports = {
    users: [
        { id: 123, userName: "John123",firstName: "John1", lastName: "Worg1", email:"www@www.com", userType:"MANAGER", classId: "111"  },
        { id: 321, userName: "John321",firstName: "John2", lastName: "Worg2", email:"www@www.com", userType:"MANAGER", classId: "111" },
        { id: 222, userName: "John222",firstName: "John3", lastName: "Worg3", email:"www@www.com", userType:"MANAGER", classId: "111"  },
        { id: 333, userName: "John333",firstName: "John4", lastName: "Worg4", email:"www@www.com", userType:"MANAGER", classId: "111"  }
    ],
    classes: [
        { id: 111, level: 1, number: 1, name: "אגוז" },
        { id: 222, level: 2, number: 2, name: "אשוח" }
    ]
}


/*
export default class User {
    id: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: UserType;
    _class: string;
  }
*/