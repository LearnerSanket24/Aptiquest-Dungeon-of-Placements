import 'package:flutter/material.dart';
import 'dungeon_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                "APTIQUEST",
                style: TextStyle(
                  fontSize: 48,
                  fontWeight: FontWeight.w900,
                  fontStyle: FontStyle.italic,
                  letterSpacing: -2,
                ),
              ),
              const Text(
                "DUNGEON OF PLACEMENTS",
                style: TextStyle(
                  color: Colors.emerald,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 4,
                ),
              ),
              const SizedBox(height: 48),
              const Text(
                "Master quantitative aptitude, logical reasoning, and verbal ability in this turn-based RPG dungeon crawler.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white60),
              ),
              const SizedBox(height: 64),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const DungeonScreen()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 20),
                  shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                ),
                child: const Text(
                  "ENTER THE DUNGEON",
                  style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
