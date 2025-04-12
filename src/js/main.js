import {keyValue} from "./external.js";



let obj = {
    firstName: 'Bob',
    lastName: 'Smith'
};

let obj2 = {
   ...obj,
   middleName: 'Rex'
};


let fn = () => console.log(obj2);

fn();

//console.log('Hello gulp! ....');

console.log(keyValue);

