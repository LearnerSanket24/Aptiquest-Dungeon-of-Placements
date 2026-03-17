class Monster {
  final String name;
  int hp;
  final int maxHp;
  final String image;
  final int level;

  Monster({
    required this.name,
    required this.hp,
    required this.maxHp,
    required this.image,
    required this.level,
  });

  void takeDamage(int damage) {
    hp = (hp - damage).clamp(0, maxHp);
  }
}
