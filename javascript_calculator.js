
const CIRCLES = document.getElementsByClassName('circles');
const MAIN_OUTPUT = document.querySelector('.final-result');
const SECONDARY_OUTPUT = document.querySelector('.memory-input');
const INPUT_WRAPPER = document.querySelector('.input-wrapper');

const OPERATORS = ['+', '-', 'x', '÷'];


var totalInput = [];


createCircles(CIRCLES);
initializeBtns();



//***************************************************************************************************

function createCircles(DOMElements){

	DOMElements[0].style.width = '.5rem';
	DOMElements[0].style.height = '.5rem';
	DOMElements[0].style['background-color'] = 'white';
	DOMElements[0].style['border-radius'] = '50%';

	var regexp = /^[0-9]*[\.\d]*/

	for(var i = 1; i < DOMElements.length; i++){

	    DOMElements[i].style['background-color'] = 'white';
	    DOMElements[i].style['border-radius'] = '50%';

	    console.log(DOMElements[i-1].style.width.match(regexp));
	    

		if(i <= 3){
		  let number = Number(DOMElements[i-1].style.width.match(regexp));
		  DOMElements[i].style.width = number + 0.75 + 'rem';
		  DOMElements[i].style.height = DOMElements[i].style.width;
		}

		else {
		  let number = Number(DOMElements[i-1].style.width.match(regexp));
		  DOMElements[i].style.width = number - 0.75 + 'rem';
		  DOMElements[i].style.height = DOMElements[i].style.width;
		}
	}
}



function isFloating(num){

	if(num.match(/\./)) return true
	else return false;
}



function calcResult(exp){

	var mapObj = {
		'+': function add(x, y){ return Number(x) + Number(y)},
		'-': function subtract(x, y){ return Number(x) - Number(y)},
		'x': function multiply(x, y){ return Number(x) * Number(y)},
		'÷': function divide(x, y){ return Number(x) / Number(y)}
	}

	for(var i in mapObj){
		if(i == exp[1]){
		  return mapObj[i](exp[0], exp[2]);
		}
	}
}


function updateAndCalc(exp, inputarr, newinput){


//	console.log('calc started, Expression is: ', exp);

	if(newinput == '='){
	  MAIN_OUTPUT.textContent = calcResult(exp);

	  if(inputarr[inputarr.length - 1] == '=') {
	  	inputarr.push(calcResult(exp));
	  }

	  else inputarr[inputarr.length - 1] = calcResult(exp);

	  SECONDARY_OUTPUT.textContent = inputarr.join('');
	  exp = MAIN_OUTPUT.textContent;

	  return exp;
	}

	

	else {
	  MAIN_OUTPUT.textContent = calcResult(exp);
	  exp = MAIN_OUTPUT.textContent;
	  SECONDARY_OUTPUT.textContent = inputarr.join('');

	  return exp;
	}
}


function updateWithoutCalc(lastinp, inputarr){

	lastinp = inputarr[inputarr.length - 1];
	MAIN_OUTPUT.textContent = lastinp;
	SECONDARY_OUTPUT.textContent = inputarr.join('');
}



function initializeBtns(){

	var tempExp = [];
	var tempArr = [];

	INPUT_WRAPPER.addEventListener('click', function inputHandler(e){

		var lastInputVal = totalInput[totalInput.length - 1];

		if(e.target.classList.contains('btn')){

			if(e.target.textContent == 'AC'){
				totalInput = [];
				tempArr = [];
				lastInputVal = totalInput[totalInput.length - 1];
				MAIN_OUTPUT.textContent = '0';
				SECONDARY_OUTPUT.textContent = '0';
			}
			
			//If the button hit is this CE button and there's not yet a '=' sign in the totalInput (it's
			// not finished yet: when deleting a math operator and trying to re-type a number while tempArr
			// already has a result in it, it just concats the new number to the last of totalInput and to the
			// result in tempArr. ONLY SOLUTION UNTIL NOW: it should calculate tempArr from totalInput, not from
			// user input directly)
			else if(e.target.textContent == 'CE' && totalInput[totalInput.length - 2] != '='){

				if(MAIN_OUTPUT.textContent != '0'){
				  if(tempArr.length > 1 || tempArr[0] == totalInput[0]) tempArr.pop();
				  totalInput.pop();

				  lastInputVal = totalInput[totalInput.length - 1];
				  MAIN_OUTPUT.textContent = '0';
				  SECONDARY_OUTPUT.textContent = totalInput.join('');
				}
			}

			else {

				switch(true){
					//If there's no input yet and the button hit is a number, but not 0
				    case totalInput.length == 0 && !(Number.isNaN(Number(e.target.textContent)) && e.target.textContent != '0'):
					  totalInput.push(e.target.textContent);
					  tempArr.push(e.target.textContent);
					  updateWithoutCalc(lastInputVal, totalInput)
					  break;

					// If there's some Input already, the last Input value is a math operator and the button hit is a number, but not a decimal dot
					case totalInput.length > 0 && OPERATORS.includes(lastInputVal) && !(Number.isNaN(Number(e.target.textContent)) && e.target.textContent != '.'):
					  totalInput.push(e.target.textContent);
					  tempArr.push(e.target.textContent);
					  updateWithoutCalc(lastInputVal, totalInput)
					  break;

					// If there's some input already, the last input value is an integer and the button his is a decimal dot
					case totalInput.length > 0 && !(Number.isNaN(Number(lastInputVal))) && !(isFloating(lastInputVal)) && e.target.textContent == '.':
					  totalInput[totalInput.length - 1] += e.target.textContent;
					  tempArr[tempArr.length - 1] += e.target.textContent;
					  updateWithoutCalc(lastInputVal, totalInput)
					  break;

					// If there's some input already, the last input value is a number and the button hit is a number too
					case totalInput.length > 0 && !(Number.isNaN(Number(lastInputVal))) && !(Number.isNaN(Number(e.target.textContent))):
					  totalInput[totalInput.length - 1] += e.target.textContent;
					  tempArr[tempArr.length - 1] += e.target.textContent;
					  updateWithoutCalc(lastInputVal, totalInput)
					  break;


					case (OPERATORS.includes(lastInputVal) && e.target.textContent == '=') || (OPERATORS.includes(lastInputVal) && OPERATORS.includes(e.target.textContent)):
					  var originalText = MAIN_OUTPUT.textContent;
					  MAIN_OUTPUT.textContent = 'Type Error!';

					  var resetErrorInt = setTimeout(function errorInt(){
					  	MAIN_OUTPUT.textContent = originalText;
					  }, 800);
					  break;



					// If there's some input already and the button hit is a math operator, ONLY HERE THE CALCULATION STARTS!
					case totalInput.length > 0 && (OPERATORS.includes(e.target.textContent) || e.target.textContent == '='):

					  	totalInput.push(e.target.textContent);
					  	tempArr.push(e.target.textContent);
					    updateWithoutCalc(lastInputVal, totalInput)


					  switch(true){
					  	case totalInput.length >= 4 && lastInputVal != '=' && !(OPERATORS.includes(lastInputVal)) && e.target.textContent == '=':

						  if(totalInput.length == 4){
						  	tempExp = tempArr.slice(0, 4);
						  	updateAndCalc(tempExp, totalInput, e.target.textContent);
						  	tempArr = [];
						    totalInput = [];
						    lastInputVal = totalInput[totalInput.length - 1];
						  }

						  else if(totalInput.length > 4){
						  	if(tempArr.length == 6){
							  tempExp = tempArr.slice(2, 5);
					       	  tempArr = [tempArr[0], tempArr[1], updateAndCalc(tempExp, totalInput, e.target.textContent), e.target.textContent];
					       	  tempExp = tempArr.slice(0, 3);
					       	  updateAndCalc(tempExp, totalInput, e.target.textContent);
						  	}

						  	else if(tempArr.length == 4){
						  	  tempExp = tempArr.slice(0, 4);
					       	  updateAndCalc(tempExp, totalInput, e.target.textContent);
						  	}

						    tempArr = [];
						    totalInput = [];
						    lastInputVal = totalInput[totalInput.length - 1];
						}
						  break;

						// ha az input tömb hossza legalább 3 és a lenyomott gomb +-*/ 
					    case totalInput.length >= 4 && OPERATORS.includes(e.target.textContent):

					      if(tempArr.length == 4){
					        tempExp = tempArr.slice(0, 3);

					        if((tempExp.includes('x') || tempExp.includes('÷')) || ((tempExp.includes('+') || tempExp.includes('-')) && (e.target.textContent == '+' || e.target.textContent == '-'))){
					      	  tempArr = [updateAndCalc(tempExp, totalInput, e.target.textContent), e.target.textContent];
					        }

					        lastInputVal = totalInput[totalInput.length - 1];
					       }


					      else if(tempArr.length == 6){
					       	if(e.target.textContent == 'x' || e.target.textContent == '÷'){
					       		tempExp = tempArr.slice(2, 5);
					       		tempArr = [tempArr[0], tempArr[1], updateAndCalc(tempExp, totalInput, e.target.textContent), e.target.textContent];
					       	}

					       	else if(e.target.textContent == '+' || e.target.textContent == '-'){
					       		tempExp = tempArr.slice(2, 5);
					       		tempArr = [tempArr[0], tempArr[1], updateAndCalc(tempExp, totalInput, e.target.textContent), e.target.textContent];
					       		tempExp = tempArr.slice(0, 3);
					       		tempArr = [updateAndCalc(tempExp, totalInput, e.target.textContent), e.target.textContent];
					       	}
					       	lastInputVal = totalInput[totalInput.length - 1];
					       }
					      break;
					  }
					  break;
	              }
			}
		}
	})
}
			


