// DOM
const keys = document.querySelectorAll(".key");
const smallScreen = document.querySelector(".intermediate");
const mainScreen = document.querySelector(".result");
const opSign = document.querySelector(".operator");
const help = document.querySelector("#help");
const exit = document.querySelector(".exit");

// RegEx
const exclude = /[Insert|End|ArrowDown|PageDown|ArrowLeft|Unidentified|ArrowRight|Home|ArrowUp|Delete|PageUp|NumLock]/;
const basicOperator = /[+|-|*\/]/;

// Variables
let input = '';
let op1 = '';
let op2 = '';
let reg1 = '';
let reg2 = '';
let result = 0;
let sign = "+";


function operate( operator, number1, number2){
  switch(operator) {    
    case "+" : return add(number1, number2);
    case "-" : return subtract(number1, number2);
    case "*" : return multiply(number1, number2);
    case "/" : return divide(number1, number2);      
    default : break;
  }
}

function resets(code){
  switch(code) {
    case "Escape" : return allClear();
    case "Delete" : return clear();
    case "Backspace" : return backspace();
    default: break;
  }
}

// There are serveral possible input conditions and influences behavior
// This makes things more complicated since, we have to account for them.
// Condition 1: Nothing is stored in variables, so input is just stored.
// Condition 2a: Expected inputs - number and operator and a number and operator already stored
// Condition 2b: Unexpected inputs - only operator and number and operators already stored
// Because of this, it is not possible to always have just one function for the operation.

function keypad(e){
  e.preventDefault();

  // map click event to key events
  if(e.type =='click') {
    e.key = e.target.dataset.key;
    e.code = e.target.dataset.code;
  }
  
  // Show/Hide help overlay
  if( e.code === "Space") hideOverlay();
  if( e.code === "Slash") showOverlay();

  // capture reset/clear inputs early
  if( e.code === "Escape" || e.code === "Delete" || e.code === "Backspace" ) resets(e.code);

  // Filter keyboad input, limited to Numpad Numbers, Operations and the % sign.  Enter is mapped to sign change
  if( !(e.key.includes("%") || e.key === "Enter" || (e.code.includes("Numpad") && !e.key.match(exclude) ) ) ) return;

  // get input and separate operators from digits
  if( e.key.match(/[-|+|*|=|\/|%|Enter]/)  ) {
    if( reg1 && !op1 && e.key !== '=') { op1 = e.key; return; }
    if( reg1 === '' && op1 === '' && reg2 === ''  && op2 === ''){
      input = (!input && e.key !== "Enter") ? result.toString() : input;
      // Mostly input saving some edge cases
      switch(e.key){
        case "+" :
        case "-" :
        case "*" :
        case "/" : return condition1Basic(e);
        case "Enter" : return signChange(e);
        case "%" : return condition1Percent(e);
        case "=" : return condition1Equals(e);
        default : break;
      }
    } else if( reg1 !== '' && op1 !== '' && reg2 === ''  && op2 === '' ){
      if( input && e.key ){
        // happy path expected inputs, both inputs and operators
        switch(e.key){
          case "+" :
          case "-" :
          case "*" :
          case "/" : return condition2BasicA(e);
          case "Enter" : return signChange(e);
          case "%" : return condition2PercentA(e);
          case "=" : return condition2EqualsA(e);
          default: break;
        }
      } else if( !input && e.key){
        // mostly edge cases, one input and two operators
        switch(e.key){
          case "+" :
          case "-" :
          case "*" :
          case "/" : return condition2BasicB(e);
          case "Enter" : return signChange2(e);
          case "%" : return condition2PercentB(e);
          case "=" : return condition2EqualsB(e);
          default: break;
        } 
      }
    }
  } else {
    // input transformations
    if( smallScreen.textContent == "🙄 ➗ 0️⃣ 🤦‍♀️") clearSmallScreen();
    if(input === '' && e.key.match(/[+|-|*|\/]/));
    if( (input === '' || input === "0") && e.key === "." ) input = "0."; // pad small decimals with 0   
    if(input.includes(".") && e.key == ".") return;  // Allow only one '.' for Decimals/floats
    if( input.match(/-0[0-9]*/) && !input.includes(".")) input = input.replace("-0", '-'); // remove the 0 pad 
    if(input.length >= 12) return; // Maximum number of digits allowed
    input = ( input === "0" ) ?  e.key : input + e.key;
    updateMainScreen(input);   
  }
}

// Display Modifying Functions
const allClear = () => {
  mainScreen.textContent = '';
  smallScreen.textContent = '';
  opSign.textContent = '';
  reg1 = '';
  reg2 = '';
  op1 = '';
  op2 = '';
  input = '';
  result = 0;
  mainScreen.textContent = result;
}

const clear = () => {
  mainScreen.textContent = '';
  input = '';
  result = 0;
  mainScreen.textContent = result;
}

const backspace = () => {
  input = input.slice(0, -1);
  if(input === '-') input = '';
  mainScreen.textContent = (input === '') ? 0 : input;
}  

const clearSmallScreen = () => {
  smallScreen.textContent = '';
  opSign.textContent = '';
}

const updateSmallScreen = (operator, inputs) => {
  opSign.textContent = operator;
  smallScreen.textContent = inputs;
}

const updateMainScreen = (value) => {  
  if( !value ) return;
  mainScreen.textContent = value;
}

// operation functions
const add = (number1, number2) => {
  return Number(number1) + Number(number2);
}

const subtract = (number1, number2) => {
  return Number(number1) - Number(number2);
}

const multiply = (number1, number2) => {
  return  Number(number1) * Number(number2);
}

const divide = (number1, number2) => {
  if( number2 === 0) {
    smallScreen.textContent = "🙄 ➗ 0️⃣ 🤦‍♀️";
    mainScreen.textContent = "😱💣🤯💔🪦";
    opSign.textContent = '';
    return ;
  }
  return Number(number1) / number2;
}

const percent = (number) => {
  return Number(number) / 100;
}

// Decisions based on input conditions

// Basic Opertors (+,-,*,/)
const condition1Basic = (e) => {
  reg1 = Number(input);
  op1 = e.key;
  input = '';
  updateSmallScreen(op1, reg1);
}

const condition2BasicA = (e) => {
  reg2 = Number(input);
  op2 = e.key;
  result = operate(op1, reg1, reg2);
  result = checkOveflow(result);
  reg1 = result;
  op1 = op2;
  reg2 = '';
  op2 = '';
  updateSmallScreen(op1, result);
  input = '';
}

// Maybe combine these 2, only diff seems to be reg2 value, a conditional will work
const condition2BasicB = (e) => {
  reg2 = reg1;
  op2 = e.key;
  result = operate(op1, reg1, reg2);
  result = checkOveflow(result);
  reg1 = result;
  op1 = op2;
  reg2 = '';
  op2 = '';
  updateSmallScreen(op1, result);
  input = '';
}

// Equals
const condition1Equals = (e) => {
  result = Number(input);
  updateMainScreen(result);
  input = '';
}

const condition2EqualsA = (e) => {
  reg2 = Number(input);
  op2 = e.key;
  let template = `${reg1} ${op1} ${reg2}`;
  result = operate(op1, reg1, reg2);
  result = (result === 0) ? "0" : result;
  
  if( !(op1 === '/' && reg2 === 0) ){ 
    updateSmallScreen(op2, template);
    result = checkOveflow(result);
    reg1 = Number(result);
  } else{
    reg1 = '';
  }

  op1 = '';
  reg2 = '';
  op2 = '';
  updateMainScreen(result);
  result = '';
  input = '';
}

const condition2EqualsB = (e) => { 
  reg2 = reg1;
  let template = `${reg1} ${op1} ${reg2}`;
  result = operate(op1, reg1, reg2);
  result = checkOveflow(result);
  reg1 = result;
  reg2 = '';
  updateSmallScreen(e.key, template);
  updateMainScreen(result);
}

// Percent
const condition1Percent = (e) => {
  result = percent(input);
  result = checkOveflow(result);
  input = result.toString();
  updateMainScreen(result);
}

const condition2PercentA = (e) => {
  reg2 = Number(input)/100;

  if(op1.match(/[+|-]/)){
    result = ( reg2) * reg1
  } else {
    result = reg2;
  }

  op2 = e.key;
  op2 = '';
  reg2 = '';
  input = result.toString();
}

const condition2PercentB = (e) => {
  if(input === '') input = reg1.toString();
  reg2 = input/100;
  if(op1.match(/[+|-]/)){
    result = reg1 + reg2;
  } else {
    result = reg1 * reg2;
  }

  input = reg2.toString();
  reg2 = '';
  op2 = '';
}

// Sign Change
const signChange = (e) => {
  genSignChange(e);
  result = input;
  updateMainScreen(input);
}

const signChange2 = (e) => {
  input = reg1.toString();
  genSignChange(e);
  input = checkOveflow(input);
  updateMainScreen(input);
  result = Number(input);
  reg1 = result;
  op1 = '';
  input = '';
  clearSmallScreen();
}

const genSignChange = (e) => {
  if ( (input === "" || input === "0") && sign === "+") {
    input = "-0"
  } else if ( input.includes(".") && !input.includes("-")){
    input = "-"+input;
  } else if ( input.includes(".") && input.includes("-")){ 
    input = input.replace("-", "");
  } else {
    input = (input * -1).toString();
  }
  sign = (sign === "+") ?  "-" : sign = "+";
  opSign.textContent =  ''; //"±";
}

// Check that the answer is within the 12 digits limit
const checkOveflow = (results) => {  
  if( results.toString().includes("e+") || results.toString().includes("e-") ){
    if( typeof results === "number" ) {
      results = results.toExponential(6);
      results = results.toString();
    } else {
      results = results.toString();
    }
  }

  // check the result so it won't oveflow 
  if( results.toString().length > 12 ) {
    let whole = results.toString().split(".")[0];
    let fractions = results.toString().split(".")[1];
    if( !fractions ) fractions = "0";
    if ( whole.length > fractions.length ) {
      results = Number(results);
      results = results.toPrecision(whole.length - 8);
    } else {
      if( results.toString().includes("e+") || results.toString().includes("e-") ){
        results = Number(results);
        results = results.toPrecision(fractions.length - 8);
      } else {
        if(results.toString().includes("e+") || results.toString().includes("e-") ){
          results = Number(result);
        } else {
        results = results.toLocaleString('fullwide', { minimumFractionDigits:0, maximumFractionDigits:8, 
                      minimumSignificantDigits:1, maximumSignificantDigits:10, userGrouping:false })
        }
      }
    }
  }
  return results;
}

// Toggle Help Overlay
const showOverlay = (e) => { overlay.style.display = "block"; }
const hideOverlay = (e) => { overlay.style.display = ''; }

// EventListeners
exit.addEventListener("click", hideOverlay);
help.addEventListener("click", showOverlay);
window.addEventListener("keydown", keypad );
keys.forEach( (key) => { key.addEventListener("click", keypad ); });
