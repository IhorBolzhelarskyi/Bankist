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

let currentAccount;

btnLogin.addEventListener(`click`, e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.newUsername === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginPin.value = inputLoginUsername.value = ``;
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener(`click`, e => {
  e.preventDefault();
  const loanAmount = +inputLoanAmount.value;
  if (loanAmount > 0) {
    console.log(loanAmount);
    const loan = currentAccount.movements
      .filter(mov => mov > 0)
      .some(mov => mov > (loanAmount / 100) * 10);
    console.log(loan);
    if (loan) {
      currentAccount.movements.push(loanAmount);
      updateUI(currentAccount);
    }
  }
  inputLoanAmount.value = ``;
});

btnClose.addEventListener(`click`, e => {
  e.preventDefault();
  console.log(1);
  if (
    currentAccount.newUsername === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.newUsername === currentAccount.newUsername
    );

    //Delete account
    accounts.splice(index, 1);
    console.log(index);
    console.log(accounts);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ``;
});

const updateUI = function (acc) {
  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
};
btnTransfer.addEventListener(`click`, e => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.newUsername === inputTransferTo.value
  );
  const currBalance = currentAccount.movements.reduce(
    (acc, mov) => acc + mov,
    0
  );
  inputTransferAmount.value = inputTransferTo.value = ``;
  if (
    amount > 0 &&
    receiverAcc &&
    currBalance > amount &&
    receiverAcc?.newUsername !== currentAccount.newUsername
  ) {
    currentAccount.movements.push(-amount);
    console.log(currentAccount.movements);
    updateUI(currentAccount);
    receiverAcc.movements.push(Math.abs(amount));
  } else {
    console.log(`No!!!`);
  }

  // console.log(amount, receiverAcc);
});

function displayMovements(account, sort = false) {
  const sortedMov = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  containerMovements.innerHTML = '';
  sortedMov.forEach((mov, i) => {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = ` <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function calcDisplayBalance(account) {
  const balance = account.movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = `${balance}€`;
}

function calcDisplaySummary(account) {
  const deposits = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  const withdrawals = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + Math.abs(cur), 0);
  console.log(withdrawals);
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .reduce((acc, cur, i, arr) => {
      console.log(arr);
      return cur > 1 ? acc + cur : acc;
    }, 0);
  console.log(interest);
  labelSumIn.textContent = `${deposits}€`;
  labelSumOut.textContent = `${withdrawals}€`;
  labelSumInterest.textContent = `${interest}€`;
}
function createUsername(acc) {
  acc.forEach(c => {
    c.newUsername = c.owner
      .toLowerCase()
      .split(` `)
      .map(name => name[0])
      .join(``);
  });
}
createUsername(accounts);

let marker = false;

btnSort.addEventListener(`click`, e => {
  e.preventDefault();
  console.log(1);
  displayMovements(currentAccount, !marker);
  marker = !marker;
  console.log(marker);
});

// console.log(accounts);

// /////////////////////////////////////////////////////////
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const max = movements.reduce((acc, cur, i) => {
//   if (acc > cur) {
//     return acc;
//   }
//   return cur;
// }, movements[0]);
// console.log(max);

// const min = movements.reduce(
//   (acc, cur) => (acc < cur ? acc : cur),
//   movements[0]
// );
// console.log(min);
// const maximum = Math.min(...movements);

// console.log(maximum);

// const dogs1 = [5, 2, 4, 1, 15, 8, 3];
// const dogs2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = dogs => {
//   return dogs
//     .map(dog => (dog <= 2 ? 2 * dog : 16 + dog * 4))
//     .filter((dog, i, arr) => {
//       return dog >= 18;
//     })
//     .reduce((acc, dog, i, arr) => {
//       return acc + dog / arr.length;
//     }, 0);
// };
// console.log(calcAverageHumanAge(dogs2));
// console.log(calcAverageHumanAge(dogs1));

// const account = accounts.find(acc => acc.owner === `Steven Thomas Williams`);
// console.log(account);

// const movements = [200, 450, 400, 3000, 650, 130, 70, 1300];

// function someCheck(movements) {
//   for (let i = 0; i < movements.length; i++) {
//     if (movements[i] > 0) {
//     } else {
//       return false;
//     }
//   }
//   return true;
// }
// console.log(someCheck(movements));

// const overallBalance = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(overallBalance);

//////5 chalange

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// function codingChallenge(dogs) {
//   dogs.forEach(dog => {
//     dog.recommendedFood = Math.floor(dog.weight ** 0.75 * 28);
//   });
//   console.log(dogs);
//   const sarahDog = dogs.find(dog => dog.owners.includes(`Sarah`));
//   if (
//     // sarahDog.curFood > sarahDog.recommendedFood * 0.9 &&
//     // sarahDog.curFood < sarahDog.recommendedFood * 1.1
//     sarahDog.curFood > sarahDog.recommendedFood
//   ) {
//     console.log(`${sarahDog.owners[0]} dogs it to much`);
//   } else if (sarahDog.curFood < sarahDog.recommendedFood) {
//     console.log(`${sarahDog.owners[0]} dogs it to little`);
//   }
//   const ownersEatTooMuch = dogs
//     .filter(dog => dog.curFood > dog.recommendedFood)
//     .flatMap(dog => dog.owners);
//   const ownersEatTooLittle = dogs
//     .filter(dog => dog.curFood < dog.recommendedFood)
//     .flatMap(dog => dog.owners);
//   console.log(ownersEatTooMuch);
//   console.log(ownersEatTooLittle);

//   console.log(`${ownersEatTooMuch[0]} and
// ${ownersEatTooMuch[1]} and ${ownersEatTooMuch[2]} dogs eat too much!`);
//   console.log(`${ownersEatTooLittle[0]} and
//   ${ownersEatTooLittle[1]} and ${ownersEatTooLittle[2]} dogs eat too little!`);
// }
// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
// console.log(
//   dogs.some(
//     dog =>
//       dog.curFood > dog.recommendedFood * 0.9 &&
//       dog.curFood < dog.recommendedFood * 1.1
//   )
// );
// codingChallenge(dogs);

////// chalange 4

// Coding Challenge #4

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/

const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];
///1///
const { averageWeight: huskyWeight } = breeds.find(
  dog => dog.breed === `Husky`
);
console.log(huskyWeight);
///2///

const { breed: dogBothActivities } = breeds.find(
  dog => dog.activities.includes(`running`) && dog.activities.includes(`fetch`)
);
console.log(dogBothActivities);
///3///
const allActivities = breeds.flatMap(dog => dog.activities);
console.log(allActivities);
///4///
const uniqueActivities = [...new Set(allActivities)];
console.log(uniqueActivities);
///5///

const swimmingAdjacent = breeds
  .filter(act => act.activities.includes(`swimming`))
  .flatMap(dog => dog.activities)
  .filter((act, i, arr) => act !== `swimming` && arr.indexOf(act) === i);
console.log(swimmingAdjacent);
///6///

const weight = breeds.every(breed => breed.averageWeight >= 10);
console.log(weight);
///7///
const active = breeds.some(breed => breed.activities.length >= 3);
console.log(active);

///8///
const heaviestBreed = breeds
  .filter(breed => breed.activities.includes(`fetch`))
  .map(dog => dog.averageWeight);

console.log(Math.max(...heaviestBreed));

// /////

const owners = [`Jonas`, `Zach`, `Adam`, `Martha`];
const owners1 = owners.slice().sort();
console.log(owners1);

console.log([`Jonas`, `Zach`, `Adam`, `Martha`].sort((a, b) => b - a));

const movements = [200, 450, -400, 3000, 650, -130, 70, 1300];

const groupByMovements = Object.groupBy(movements, mov => {
  return mov > 0 ? `deposits` : `withdrawal`;
});
console.log(groupByMovements);
movements.push(100);
console.log(movements);

const groupAccounts = Object.groupBy(accounts, ({ pin }) => pin);
console.log(groupAccounts);
