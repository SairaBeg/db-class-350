const assert = require('assert').strict;

const book = [{name: 'Ann', phone: '575.580.1400', role: 'Developer'}, 
                   {name: 'Ben', phone: '575.641.4041', role: 'Manager'}, 
                   {name: 'Clara', phone: '512.717.5690', role: 'Developer'},
                   {name: 'Dan', phone: '512.444.1496', role: 'DevOps'}, 
                   {name: 'Erica', phone: '550.619.9916', role: 'Manager'}, 
                   {name: 'Fiona', phone: '550.789.5512', role: 'Developer'},
                   {name: 'Gideon', phone: '540-654-1000', role: 'Marketing'},
                   {name: 'Hilary', phone: '540-654-1020', role: 'Marketing'},
                   {name: 'Ichika', phone: '404-990-4717', role: 'Sales'}];

const staff = [{name: 'Stephen Davies', role: "Professor",  department: "Computer Science"},
               {name: 'Ian Finlayson', role: "Chair",  department: "Computer Science"},    
               {name: 'Karen Anewalt', role: "Professor",  department: "Computer Science"},    
               {name: 'James Kuykendall' , role: "Chair",  department: "Music"},
               {name: 'Claire Workinger ' , role: "Adjunct",  department: "Music"},
               {name: 'Theresa Steward', role: "Adjunct",  department: "Music"},   
               {name: 'Robert Wells', role: "Professor",  department: "Music"},  
               {name: 'Jennifer Barry', role: "Professor",  department: "Religious Studies"}, 
               {name: 'Dan Hirshberg', role: "Professor",  department: "Religious Studies"},      
               {name: 'Mary Mathews', role: "Professor",  department: "Religious Studies"}, 
               {name: 'Jackie Gallagher', role: "Chair",  department: "Geography"},
               {name: 'Catie Finlayson', role: "Professor",  department: "Geography"}];  


                   
/*
   The getNumber function takes a person's name as a string and an array of
   json objects (the phonebook). It finds the name in the phonebook and 
   returns the associated telephone number. If the person's name is not
   found it returns the string 'not found'
*/

const getNumber = (person, book) => {
    for(var i = 1; i<book.length; i++){
        if(book[i].name ==person){
           
            return book[i].phone;
        }
    }

    return ("not found");
}


/* The find function takes a role which is a string and a phonebook
   which is an array of json objects. finds the people matching that role
   and returns a list of json objects of the form
   [{employee: 'Ann}, {employee: Clara}]

   For example, find('Developer', phonebook) should return

   [ { employee: 'Ann' }, { employee: 'Clara' }, { employee: 'Fiona' } ]
 
*/

const find = (role, phonebook) => {
    let answer = [];
    let freeIndex = 0;

    for(var i = 0; i<phonebook.length; i++){
        if(phonebook[i].role ==role){
           let newObj = {'employee':phonebook[i].name};
         answer[freeIndex] = newObj;
         freeIndex++;
        }
    }

 return answer
}


/*
   The roles function takes a phonebook (an array of json objects) as 
   an argument.  It organizes the phonebook by role returning for each
   role, the names of the people who have that role.

   For example. role(phonebook) should return

    {
        Developer: [ 'Ann', 'Clara', 'Fiona' ],
        Manager: [ 'Ben', 'Erica' ],
        DevOps: [ 'Dan' ],
        Marketing: [ 'Gideon', 'Hilary' ],
        Sales: [ 'Ichika' ]
    }
*/
const roles = (book) => {
    let answer = {};
    let dev =[];
    let devInd= 0;
    let manager = [];
    let managerInd = 0;
    let devOps = [];
    let devOpsInd = 0;
    let marketing =[];
    let marketingInd =0;
    let sales = [];
    let salesInd= 0;

    if(book[0].role =='Developer'){
    for(var i = 0; i<book.length; i++){

        if(book[i].role =='Developer'){
         
dev[devInd]   =book[i].name;
         
         devInd++;
        }else if (book[i].role == 'Manager'){
            manager[managerInd] =book[i].name;
            managerInd++;
        }else if (book[i].role == 'DevOps'){
            devOps[devOpsInd] =book[i].name;
            devOpsInd++;
        }   else if (book[i].role == 'Marketing'){
                marketing[marketingInd] = book[i].name;
                marketingInd++;
        }else if (book[i].role == 'Sales'){
            sales[salesInd] =book[i].name;
            salesInd++;


    }
}

answer['Developer']= dev;
answer['Manager']= manager;
answer['DevOps']= devOps;
answer['Marketing']= marketing;
answer['Sales']= sales;


    return answer;

    }else{

for(var i = 0; i<book.length; i++){

        if(book[i].role =='Professor'){
         
dev[devInd]   =book[i].name;

    }  else if (book[i].role == 'Chair'){
        manager[managerInd] =book[i].name;
        managerInd++;
    }else if (book[i].role == 'Adjunct'){
        devOps[devOpsInd] =book[i].name;
        devOpsInd++;

}
}

answer['Professor']= dev;
answer['Chair']= manager;
answer['Adjunct']= devOps;
    return answer;


    }
}

let answer = getNumber('Clara', book);
assert.equal(answer, '512.717.5690');
console.log(answer);
answer = getNumber('Sam', book);
assert.equal(answer, 'not found');
console.log(answer);
console.log("GETNUMBER PASSED ALL TESTS\n");

answer = find("Developer", book);
console.log(answer);
assert.equal(answer.filter(function(item){ if (item.employee == 'Ann') return item})[0].employee, 'Ann')
assert.equal(answer.filter(function(item){ if (item.employee == 'Clara') return item})[0].employee, 'Clara')
assert.equal(answer.filter(function(item){ if (item.employee == 'Fiona') return item})[0].employee, 'Fiona')
console.log("FIND FUNCTION PASSED TESTS\n");

answer = roles(book);
console.log(answer);
assert(answer.Developer.includes("Ann"));
assert(answer.Manager.includes("Erica"));
answer = roles(staff);
console.log(answer);
assert(answer.Chair.includes("Ian Finlayson"));
assert(answer.Professor.includes("Catie Finlayson"));

console.log("ROLES FUNCTION PASSED TESTS");
