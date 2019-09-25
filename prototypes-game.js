function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Hero = function (name, xp) {
  this.health = 100;
  this.name = name;
  this.xp = xp;
  this.attacker = {};
};

Hero.prototype.gainXp = function (amount) {
  console.log(`${this.name} gained ${amount} experience points`);
  this.xp += amount;
};


Hero.prototype.dead = function () {
  this.xp -= 50;
  console.log(`${this.name} was killed by ${this.attacker.name}`);
  this.attacker.gainXp(200);
};

Hero.prototype.getDamage = function (damage) {
  this.health -= damage;

  if (this.health <= 0) {
    this.dead();
  } else {
    console.log(`${this.name} has ${this.health}hp`);
  }
};

const weapons = {
  sword1: { minDamage: 5, maxDamage: 20 },
  sword2: { minDamage: 10, maxDamage: 30 },
  sword3: { minDamage: 300, maxDamage: 450 },
};

const Warrior = function (name, xp, weapon) {
  Hero.call(this, name, xp);

  this.weapon = weapon;
};

Warrior.prototype = Object.create(Hero.prototype);
Warrior.prototype.constructor = Warrior;

Warrior.prototype.attack = function (hero) {
  if (hero.health > 0) {
    const damage = getRandomInt(this.weapon.minDamage, this.weapon.maxDamage); // Хардкод
    console.log(`${this.name} attacks ${hero.name}  on ${damage}dmg`);
    hero.attacker = this;
    hero.getDamage(damage);
  } else {
    console.log(`${hero.name} is dead`);
  }
};

const Defender = function (name, xp, weapon, sheld) {
  Warrior.call(this, name, xp, weapon);
  this.sheld = sheld;
};

Defender.prototype = Object.create(Warrior.prototype);
Defender.prototype.constructor = Defender;

Defender.prototype.defence = function (damage) {
  this.sheld -= damage;
  console.log(`${this.name} defended, sheld is ${this.sheld}`);
};

Defender.prototype.getDamage = function (damage) {
  if (this.sheld > 0) {
    this.defence(damage);
  } else if (this.health > 0) {
    Hero.prototype.getDamage.call(this, damage);
  }
};

const poly = new Warrior('Poly', 200, weapons.sword3);

const tank = new Defender('Tank', 200, weapons.sword1, 300);
const ork = new Warrior('Ork', 100, weapons.sword1);

// poly.attack(tank);
// poly.attack(ork);
// ork.attack(poly);
// poly.attack(tank);
// poly.attack(tank);

const field = document.querySelector('.arena');

const addNewEnemy = function () {
  const element = document.createElement('div');
  element.classList.add('enemy');
  const enemy = new Warrior('Poly', 200, weapons.sword3);
  element.addEventListener('click', (e) => {
  // console.log(enemy);
  // poly.attack(enemy);
    poly.attack(enemy);
    alert(enemy.health);
  });

  field.appendChild(element);
};

addNewEnemy();

//
