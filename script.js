const pattern = /[-|+|*|=|\/|%|Enter]/;

const keys = document.querySelectorAll(".key");
const smallScreen = document.querySelector(".intermediate");
const mainScreen = document.querySelector(".result");
const opSign = document.querySelector(".operator");

let input = '';
let store1 = 0;
let store2 = 0;
let last;
let operator = '';


// eventListeners
window.addEventListener("keydown", keypad );
keys.forEach( (key) => { key.addEventListener("click", keypad ); })


function keypad(e) {
  // map click event to key events
  if(e.type =='click') {
    e.key = e.target.dataset.key;
    e.code = e.target.dataset.code;
  }
  // capture reset/clear inputs
  if( e.code === "Escape" || e.code === "Delete" || e.code === "Backspace" ) {
    console.log("Reset Function: ", e.code);
    resets(e.code);
  }

  // filter out all input that is not from the keypad or the % sign
  if( !(e.key.includes("%") || e.code.includes("Numpad")) ) return;

  // separate operators from digits
  if( e.key.match(pattern)  ) {

    if( store1 === 0 ) { store1 = Number(input); }
    else if( store1 !== 0  && store2 === 0 ) { store2 = Number(input);}
    if( operator === '' ) operator = e.key;

    switch( e.key ) {
      case "+": 
      case "-":
      case "*":
      case "/":      
        if( store1 !== 0 && operator !== "" && store2 !== 0 ) {
          store1 = operate(operator, store1, store2);
          operator = e.key;
          store2 = 0;
          input = '';
          last = store1;
        }
        updateSmallScreen();
        // console.log("op exit vals", store1, store2, input, operator, e.key, last)
        break;
      case "Enter" : console.log("S/C",  e.key); break;
      case "%" : 
        console.log("%",  e.key); 
        // percentage(e);
        break;
      case "=" : 
        // console.log("EQL", e.key);
        // console.log("eq init vals", store1, store2, operator, e.key, input, last);
        opSign.textContent = e.key;
        smallScreen.textContent = `${store1} ${operator} ${store2}`;
        store1 = operate(operator, store1, store2);        
        updateMainScreen(store1);
        store2 = 0;
        operator = "";
        input = '';
        console.log("eq exit vals", store1, store2, operator, e.key, input, last);
        break;
      default: console.log("How are we here?"); break;
    }
  } else {
    // console.log("Over here!", e.key);
    if(input.length >= 12) return;
    input = ( input === "0" ) ?  e.key : input + e.key;   
    updateMainScreen(input);
  }
}


const updateSmallScreen = () => {
  opSign.textContent = operator;
  smallScreen.textContent = store1;
  input = '';
}

const updateMainScreen = (result) => {
  if( result.toString().length > 12 ) {
    console.log("res length", result.toString().length );
    let whole = result.toString().split(".")[0];
    let fractions = result.toString().split(".")[1];
    if( !fractions ) fractions = "0";
    if ( whole.length > fractions.length ) {
      result = result.toPrecision(8);
    } else {
      result = result.toLocaleString('fullwide', { minimumFractionDigits:0, maximumFractionDigits:10, 
                      minimumSignificantDigits:1, maximumSignificantDigits:10, userGrouping:false });
    }
  }
  mainScreen.textContent = result;
}

const add = (n1, n2) => {
  return Number(n1) + Number(n2);
}

const subtract = (n1, n2) => {
  return Number(n1) - Number(n2);
}

const multiply = (n1, n2) => {
  return  Number(n1) * Number(n2);
}

const divide = (n1, n2) => {
  return Number(n1) / Number(n2);
}


function operate( operator, n1, n2){
  switch(operator) {
    case "+" : 
      return add(n1, n2);
    case "-" :
      return subtract(n1, n2);
    case "*" :
      return multiply(n1, n2);
    case "/" :
      return divide(n1, n2);
    default : break;
  }
}

function resets(code){
  switch(code) {
    case "Escape" :
      mainScreen.textContent = "";
      smallScreen.textContent = "";
      opSign.textContent = "";
      store1 = 0;
      store2 = 0;
      input = '';
      operator = '';
      mainScreen.textContent = (input === '') ? 0 : input;
      break;
    case "Delete" :
      mainScreen.textContent = "";
      input = ''
      mainScreen.textContent = (input === '') ? 0 : input;
      break;
    case "Backspace" :
      input = input.slice(0, -1);
      mainScreen.textContent = (input === '') ? 0 : input;
      break;
  }
}
