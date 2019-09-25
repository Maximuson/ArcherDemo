/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */


function getRandomInt(min, max) {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}

function getCordsElement(element) {
  const {
    x, y, width, height,
  } = element.getBoundingClientRect();

  const result = { x: (x + width / 2), y: (y + height / 2) };

  return result;
}


function getLenghtBetweenPoints(x_1, y_1, x_2, y_2) {
  return Math.sqrt(Math.pow((x_2 - x_1), 2) + Math.pow((y_2 - y_1), 2));
}

function getGradsFromTopCircle(katet, gipoten, isEnemyOnTop) {
  const cosL = gipoten / (2 * katet);

  // sin если враг внизу сos если вверху
  let grads;
  if (isEnemyOnTop) {
    grads = Math.acos(cosL) * (180 / Math.PI);
  } else {
    grads = Math.asin(cosL) * (180 / Math.PI);
  }

  return 180 - 2 * Number.parseInt(grads);
}

function rotateToPlayer(gradsEnemy, isEnemyOnLeft) {
  if (isEnemyOnLeft) {
    return (360 - (gradsEnemy - 180));
  }
  return (gradsEnemy - 180);
}
// враг находится на 45 градусов по кругу с верху
rotateToPlayer(getGradsFromTopCircle(4, 5.65));

function rotateEnemy(playerElem, enemyElem) {
  const playerCords = getCordsElement(playerElem);
  const enemyCords = getCordsElement(enemyElem);
  let isEnemyOnTop = false;
  let isEnemyOnLeft = false;
  if (enemyCords.y >= playerElem.y) {
    isEnemyOnTop = true;
  }
  if (enemyCords.x < playerCords.x) {
    isEnemyOnLeft = true;
  }

  const radius = getLenghtBetweenPoints(playerCords.x, playerCords.y, enemyCords.x, enemyCords.y);
  const gipoten = getLenghtBetweenPoints(playerCords.x, playerCords.y + radius, enemyCords.x, enemyCords.y);
  const rotateOn = rotateToPlayer(getGradsFromTopCircle(radius, gipoten, isEnemyOnTop), isEnemyOnLeft);
  enemyElem.style.transform = ` rotate(${rotateOn}deg)`;
}

const weapons = {
  sword1: { minDamage: 5, maxDamage: 20 },
  sword2: { minDamage: 10, maxDamage: 30 },
  sword3: { minDamage: 300, maxDamage: 450 },
};

const enemies = [];

class Hero {
  constructor(name, health) {
    this._health = health;
    this._name = name;
    this._xp = 0;
    this._attacker = {};
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get attacker() {
    return this._attacker;
  }

  set attacker(value) {
    this._attacker = value;
  }

  gainXp(amount) {
    console.log(`${this.name} gained ${amount} experience points`);
    this._xp += amount;
  }

  dead() {
    this._xp -= 50;
    console.log(`${this.name} was killed by ${this.attacker.name}`);
    this.attacker.gainXp(200);
  }

  getDamage(damage) {
    this._health -= damage;

    if (this._health <= 0) {
      this.dead();
    } else {
      console.log(`${this._name} has ${this._health}hp`);
    }
  }
}

class Warrior extends Hero {
  constructor(name, health, weapon) {
    super(name, health);
    this._weapon = weapon;
  }

  attack(hero) {
    if (hero._health > 0) {
      const damage = getRandomInt(this._weapon.minDamage, this._weapon.maxDamage); // Хардкод
      console.log(`${this._name} attacks ${hero.name}  on ${damage}dmg`);
      hero._attacker = this;
      hero.getDamage(damage);
    } else {
      console.log(`${hero.name} is dead`);
    }
  }

  shot(playerElement, targetElement, arrow, hero) {
    const startX = playerElement.getBoundingClientRect().x;
    const endX = targetElement.getBoundingClientRect().x;
    const startY = playerElement.getBoundingClientRect().y;
    const endY = targetElement.getBoundingClientRect().y;


    const rangeX = endX - startX;
    const rangeY = endY - startY;
    arrow.style.transform = `translateX(${rangeX}px) translateY(${rangeY}px)`;
    this.attack(hero);
  }
}

class Defender extends Warrior {
  constructor(name, health, weapon, sheld) {
    super(name, health, weapon);
    this._sheld = sheld;
  }

  defence(damage) {
    this._sheld -= damage;
    console.log(`${this._name} defended, sheld is ${this._sheld}`);
  }

  getDamage(damage) {
    if (this._sheld > 0) {
      this.defence(damage);
    } else if (this._health > 0) {
      super.getDamage(damage);
    }
  }
}

const field = document.querySelector('.arena');
const playerElement = document.querySelector('.person');
// const arrowElement = document.querySelector('.arrow');

const player = new Warrior('Maximuson', 500, weapons.sword2);
const tank = new Defender('Tank', 200, weapons.sword1, 300);
const ork = new Warrior('Ork', 100, weapons.sword1);

const addNewEnemyToField = function () {
  const enemy = new Warrior('Ork', 100, weapons.sword1);
  enemy.id = enemies.length + 1;
  const element = document.createElement('div');
  element.classList.add('enemy');

  enemies.push(enemy);
  element.id = `enemy-${enemy.id}`;
  element.innerText = enemy._health;


  element.addEventListener('click', (e) => {
    const arrowElement = document.createElement('div');
    arrowElement.classList.add('arrow');
    playerElement.appendChild(arrowElement);
    player.shot(playerElement, element, arrowElement, enemy);
    element.innerText = enemy._health;

    if (enemy._health <= 0) {
      field.removeChild(element);
    }
  });

  field.appendChild(element);
  // rotateEnemy(playerElement, element);
};

addNewEnemyToField();
addNewEnemyToField();
addNewEnemyToField();

const enemy1 = document.querySelector('#enemy-1');
const enemy2 = document.querySelector('#enemy-2');
const enemy3 = document.querySelector('#enemy-3');
document.addEventListener('click', (e) => {
  console.log(e);
  playerElement.style.transform = `translateX(${e.clientX}px) translateY(${e.clientY}px)`;
  console.log(playerElement.classList);
  rotateEnemy(playerElement, enemy1);
  rotateEnemy(playerElement, enemy1);
  rotateEnemy(playerElement, enemy2);
  rotateEnemy(playerElement, enemy3);
});
// Сделать масивом

function draw() {
  rotateEnemy(playerElement, enemy1);
  rotateEnemy(playerElement, enemy2);
  rotateEnemy(playerElement, enemy3);
  requestAnimationFrame(draw);
}
// Запуск всего
draw();
