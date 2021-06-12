'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//passing the movement array into the callback function
//sorting the values
const displayMovements = function (movements, sort = false) {
  //removing previously present elements
  containerMovements.innerHTML = '';

  //sorting the movements array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  //executing funtion for each array element
  movs.forEach(function (mov, i) {
    // checking whether deposit/withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //adding elements to the movement row
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
   </div>`;

    console.log(type);
    // adding elements in a particular pattern/position
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//////////////////BALANCE///////////

//recieving elements from movements array
const displayBalance = function (acc) {
  //reducing all the array elemet to a singal value
  //creating a new property in acc
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  //getting balance value class
  labelBalance.textContent = `${acc.balance}€`;
};

////////SUMIN SUMOUT INTREST////////

//calling the function with movements
const displaySummary = function (acc) {
  //sumin value
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  //sumout
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`; //removing negative sign

  //intrest
  const intrest = acc.movements
    .filter(mov => mov > 0)
    .map(int => (int * acc.interestRate) / 100) //calculating intrest
    .filter((int, i, arr) => {
      //filtering element based on condition
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${intrest}€`;
};

//////////USERNAME///////////

const createUsername = function (accs) {
  //applying the forEach method to the elements
  accs.forEach(function (acc) {
    //creating a new property 'username'
    acc.username = acc.owner
      .toLowerCase() //changing to lower case
      .split(' ') //splitting names by space
      .map(name => name[0]) //getting the 1st letter
      .join(''); //joining the elements recieved
  });
};
createUsername(accounts);

const displayUI = function () {
  //display movements,summary,balance
  displayMovements(currentAccount.movements);

  displayBalance(currentAccount);

  displaySummary(currentAccount);
};

/////////////TIMER

//creating timer
const startLogOutTimer = function () {
  //creating countdown process
  const tick = function () {
    //creating min sec
    const min = String(Math.trunc(time / 60)).padStart(2, 0);

    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    //displaying the values
    labelTimer.textContent = `${min} : ${sec}`;

    //logging out
    if (time === 0) {
      //clearing timer
      clearInterval(timer);

      //logout message
      labelWelcome.textContent = 'Log in to get started';

      //changing opacity
      containerApp.style.opacity = 0;
    }

    //decreasing the timer by 1
    time--;
  };
  //setting time for timer
  let time = 120;

  //immediately calling the callback function
  tick();

  //setting interval
  const timer = setInterval(tick, 1000);

  return timer;
};

/////////////LOGIN
//creating global varibles
let currentAccount, timer;

//creating the click event
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  //checking username
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  //checking pin
  if (currentAccount?.pin === Number(inputLoginPin.value))
    //displaying the message

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

  // displaying contents
  containerApp.style.opacity = 100;
  //empting input box
  inputLoginUsername.value = inputLoginPin.value = '';

  //bluring the input box
  inputLoginPin.blur();

  //clearing existing  timer
  if (timer) clearInterval(timer);

  //starting the timer
  timer = startLogOutTimer;

  displayUI(currentAccount);
});

//////////////TRANSFER

//click event to the arrow
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  //converting amount to number
  const amount = Number(inputTransferAmount.value);

  //checking the username
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //emptying input box
  inputTransferAmount.value = inputTransferTo.value = '';

  //checking conditions for transfer
  if (
    amount > 0 && //checking if amount is greater than 0
    recieverAcc && //checking for valid account
    currentAccount.balance >= amount && //checking if there is enough balance to transfer
    recieverAcc?.username !== currentAccount.username //checking if transfer to username is valid
  ) {
    //adding and subtracting amounts
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    //resetting time
    clearInterval(timer);

    timer = startLogOutTimer;

    displayUI(currentAccount);
  }
});

///////////REQUEST LOAN

//CLICK event
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  //converting to number
  const amount = Number(inputLoanAmount.value);

  //checking conditions of amount entered
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //adding amount of loan
    currentAccount.movements.push(amount);
  }
  //clearing value
  inputLoanAmount.value = '';

  displayUI(currentAccount);
});

////////////////CLOSE ACCOUNT

//click event
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  //checking username and pin
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    //getting index value
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //removing the index value
    accounts.splice(index, 1);

    //changing opacity
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

/////////////SORT BUTTON

//storing the value of sort
let sorted = false;

//click event
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  //displaying the sorted value
  displayMovements(currentAccount.movements, !sorted);

  //flipping the values
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
