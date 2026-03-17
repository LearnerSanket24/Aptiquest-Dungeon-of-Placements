class Player {
  int hp;
  int maxHp;
  int xp;
  int level;
  int roomsCleared;

  Player({
    this.hp = 100,
    this.maxHp = 100,
    this.xp = 0,
    this.level = 1,
    this.roomsCleared = 0,
  });

  void gainXP(int value) {
    xp += value;
    if (xp >= 100) {
      level++;
      xp = xp - 100;
      maxHp += 20;
      hp = maxHp; // Full heal on level up
    }
  }

  void takeDamage(int damage) {
    hp = (hp - damage).clamp(0, maxHp);
  }

  void heal(int value) {
    hp = (hp + value).clamp(0, maxHp);
  }
}
