import 'package:flutter/material.dart';
import '../main.dart';
import '../models/player.dart';
import '../widgets/stat_bar.dart';
import 'battle_screen.dart';

class DungeonScreen extends StatefulWidget {
  const DungeonScreen({super.key});

  @override
  State<DungeonScreen> createState() => _DungeonScreenState();
}

class _DungeonScreenState extends State<DungeonScreen> {
  Player player = Player();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text("DUNGEON FLOOR", style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Rooms Cleared: ${player.roomsCleared}", style: const TextStyle(color: Colors.white38)),
                  ],
                ),
                SizedBox(
                  width: 150,
                  child: Column(
                    children: [
                      StatBar(label: "HP", value: player.hp, maxValue: player.maxHp, color: Colors.red),
                      const SizedBox(height: 8),
                      StatBar(label: "XP", value: player.xp, maxValue: 100, color: Colors.emerald),
                    ],
                  ),
                )
              ],
            ),
            const SizedBox(height: 40),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.8,
              ),
              itemCount: dungeonMonsters.length,
              itemBuilder: (context, index) {
                final monster = dungeonMonsters[index];
                final isLocked = index > player.roomsCleared;
                
                return GestureDetector(
                  onTap: isLocked ? null : () async {
                    final result = await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => BattleScreen(player: player, monster: monster),
                      ),
                    );
                    if (result != null) {
                      setState(() {
                        player = result as Player;
                      });
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.02),
                      border: Border.all(color: isLocked ? Colors.white10 : Colors.white24),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(isLocked ? "🔒" : monster.image, style: const TextStyle(fontSize: 40)),
                        const SizedBox(height: 12),
                        Text(
                          monster.name.toUpperCase(),
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: isLocked ? Colors.white24 : Colors.white,
                          ),
                        ),
                        Text(
                          "LVL ${monster.level}",
                          style: const TextStyle(fontSize: 10, color: Colors.white38),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
