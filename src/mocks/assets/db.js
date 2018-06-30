const map = require('./map.mock');
module.exports = {
    ...map,
    users: [
        { id: 123, userName: "Rotem",firstName: "John1", lastName: "Worg1", email:"www@www.com", userType:"TEACHER", class_id: "111"  },
        { id: 321, userName: "John321",firstName: "John2", lastName: "Worg2", email:"www@www.com", userType:"TEACHER", class_id: "111" },
        { id: 222, userName: "John222",firstName: "John3", lastName: "Worg3", email:"www@www.com", userType:"MANAGER", class_id: "222"  },
        { id: 333, userName: "John333",firstName: "John4", lastName: "Worg4", email:"www@www.com", userType:"MANAGER", class_id: "222"  }
    ],
    classes: [
        { id: 111, level: 1, number: 1, name: "אגוז" },
        { id: 222, level: 2, number: 2, name: "אשוח" }
    ],
    students: [
        { id: 444, userName: "Eran", password: "1111", firstName: "Eran", lastName: "Leiser", gender:"MALE", class_id: "111"  },
        { id: 322, userName: "Liron", password: "1111" ,firstName: "Liron", lastName: "Leiser", gender:"FEMALE", class_id: "111" },
        { id: 467, userName: "Tomer", password: "1111" ,firstName: "Tomer", lastName: "Leiser", gender:"MALE", class_id: "222"  },
        { id: 654, userName: "Amit", password: "1111" ,firstName: "Amit", lastName: "Leiser", gender: "FEMALE", class_id: "222" }
    ],


}


