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


const showOverlay = (e) => { overlay.style.display = "block"; }
const hideOverlay = (e) => { overlay.style.display = ''; }


// EventListeners
exit.addEventListener("click", hideOverlay);
help.addEventListener("click", showOverlay);
window.addEventListener("keydown", keypad );
keys.forEach( (key) => { key.addEventListener("click", keypad ); });




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
  if( !(e.key.includes("%") || e.key === "Enter"  || (e.code.includes("Numpad") && !e.key.match(exclude) ) ) ) return;

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
        // mostly edge cases, both inputs and one operator
        switch(e.key){
          case "+" :
          case "-" :
          case "*" :
          case "/" : return condition2BasicB(e);
          case "Enter" : return signChange(e);
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
    if( input.match(/-0[0-9]*/) && !input.includes(".")) input = input.replace("-0", '-');  // remove the 0 padding after 1st number
    if(input.length >= 12) return; // Maximum number of digits allowed
    input = ( input === "0" ) ?  e.key : input + e.key;
    updateMainScreen(input);   
  }
}



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
  if( !value ) return;  // if empty just leave
  mainScreen.textContent = value;
}


// individual operation functions
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
  // handle divide by 0 and display message
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



// Decisions 

// With basic operators ( +, -, * and /)
const condition1Basic = (e) => {
  console.log("B1a: input and basicOps", e.key);
  reg1 = Number(input);
  op1 = e.key;
  input = '';
  updateSmallScreen(op1, reg1);
}

const condition2BasicA = (e) => {
  console.log("B2a: input and basicOps");
  console.log("input: ", input);
  console.log("in ",reg1, reg2, op1, op2, result, input, e.key);
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
  console.log("out", reg1, reg2, op1, op2, result, input, e.key);
}

// Maybe combine these 2, only diff seems to be reg2 value, a conditional will work

const condition2BasicB = (e) => {
  console.log("B2b: no input and basicOps");
  console.log("input: ", input);
  console.log("in ",reg1, reg2, op1, op2, result, input, e.key);
  reg2 = reg1;
  op2 = e.key;
  console.log(op1, reg1, reg2, op2);
  result = operate(op1, reg1, reg2);
  result = checkOveflow(result);
  reg1 = result;
  op1 = op2;
  reg2 = '';
  op2 = '';
  updateSmallScreen(op1, result);
  input = '';
  console.log("out", reg1, reg2, op1, op2, result, input, e.key);
}



const condition1Equals = (e) => {
  console.log("E1a: input and '=' ", e.key);
  result = Number(input);
  updateMainScreen(result);
  input = '';
}

const condition2EqualsA = (e) => {
  console.log("E2a: input and '=' ");
  console.log(reg1, reg2, op1, op2, result, input, e.key);
  let template = '';
  reg2 = Number(input);
  op2 = e.key;
  template = `${reg1} ${op1} ${reg2}`;
  console.log(reg1, reg2, op1, op2, result, input, e.key);
  result = operate(op1, reg1, reg2);
  if( !(op1 === '/' && reg2 === 0) ){ 
    updateSmallScreen(op2, template);
    result = checkOveflow(result);
    reg1 = result;
  } else{
    reg1 = '';
  }
  op1 = '';
  reg2 = '';
  op2 = '';
  
  updateMainScreen(result);
  result = '';
  input = '';
  console.log(reg1, reg2, op1, op2, result, input, e.key);
}

const condition2EqualsB = (e) => { 
  console.log("E2b: no input and '=' ");
  console.log(reg1, reg2, op1, op2, result, input, e.key);
  let template = '';
  reg2 = reg1;
  template = `${reg1} ${op1} ${reg2}`;
  result = operate(op1, reg1, reg2);
  result = checkOveflow(result);
  reg1 = result;
  reg2 = '';
  updateSmallScreen(e.key, template);
  updateMainScreen(result);
  console.log(reg1, reg2, op1, op2, result, input, e.key);
}

const condition1Percent = (e) => {
  console.log("P1a: input and '%' ", e.key);
  console.log("%", result, input);
  result = percent(input);
  result = checkOveflow(result);
  input = result;
  console.log("%", result, input);
  updateMainScreen(result);
}

const condition2PercentA = (e) => {
  console.log("P2a: input and '%' ");
  console.log(reg1, reg2, op1, op2, result, input, e.key);
  let template;

  reg2 = Number(input)/100;
  if(op1.match(/[+|-]/)){
    console.log("+,-");
    result = ( reg2) * reg1
  } else {
    console.log('*,/');
    result = reg2;
  }
  console.log(reg1, reg2, op1, op2, result, input, e.key);
  op2 = e.key;
  template = `${reg1} ${op1} ${reg2}`;
  op2 = '';
  reg2 = '';
  // updateSmallScreen(e.key, template)
  // updateMainScreen(result);
  input = result.toString();
  console.log(reg1, reg2, op1, op2, result, input, e.key);
}

const condition2PercentB = (e) => {
  console.log("P2b: no input and '%' ");
  console.log(reg1, reg2, op1, op2, result, input, e.key);
  let template; 
  
  if(input === '') input = reg1.toString();
  reg2 = input/100;
  if(op1.match(/[+|-]/)){
    console.log("+,-");
    result = reg1 + reg2;
  } else {
    console.log('*,/');
    result = reg1 * reg2;
  }

  template = `${reg1} ${op1} ${reg2}`;
  input = reg2.toString();
  reg2 = '';
  op2 = '';
  
  console.log(reg1, reg2, op1, op2, result, input, e.key);
}


const signChange = (e) => {
  console.log("SC1a: '+/-' ", e.key);
  console.log("+/- in", reg1, reg2, op1, op2, result, input, e.key, sign);
  
  if ( (input === "" || input === "0") && sign === "+") {
    input = "-0"
  } else if ( input.includes(".") && !input.includes("-")){
    input = "-"+input;
  } else if ( input.includes(".") && input.includes("-")){ 
    input = input.replace("-", "");
  }else {
    input = (input * -1).toString();
  }
  sign = (sign === "+") ?  "-" : sign = "+";
  opSign.textContent =  ''; //"±";

  result = input;
  // input = '';  
  updateMainScreen(input);
  console.log("+/- out", reg1, reg2, op1, op2, result, input, e.key);
}



const checkOveflow = (results) => {
  console.log(results);
  // is this in exponential form?
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
    console.log("res length", results.toString().length );
    let whole = results.toString().split(".")[0];
    let fractions = results.toString().split(".")[1];
    if( !fractions ) fractions = "0";
    if ( whole.length > fractions.length ) {
      console.log("whole", whole.length);
      results = Number(results);
      results = results.toPrecision(whole.length - 8);
    } else {
      console.log("fraction", fractions.length, results);
      if( results.toString().includes("e+") || results.toString().includes("e-") ){
        results = Number(results);
        results = results.toPrecision(fractions.length - 8);
      } else {
        console.log("This?");
        // result = Number(result);
        if(results.toString().includes("e+") || results.toString().includes("e-") ){
          results = Number(result);
        } else {
        results = results.toLocaleString('fullwide', { minimumFractionDigits:0, maximumFractionDigits:10, 
                      minimumSignificantDigits:1, maximumSignificantDigits:10, userGrouping:false });
        }
      }
    }
  }
  return results;
}






