import 'package:flutter/material.dart';
import 'dart:math';
import '../main.dart';
import '../models/player.dart';
import '../models/monster.dart';
import '../models/question.dart';
import '../widgets/stat_bar.dart';

class BattleScreen extends StatefulWidget {
  final Player player;
  final Monster monster;

  const BattleScreen({super.key, required this.player, required this.monster});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  late Question currentQuestion;
  bool? isCorrect;
  bool showHint = false;
  List<String> logs = [];

  @override
  void initState() {
    super.initState();
    _pickNewQuestion();
    logs.add("A wild ${widget.monster.name} appeared!");
  }

  void _pickNewQuestion() {
    setState(() {
      currentQuestion = allQuestions[Random().nextInt(allQuestions.length)];
      isCorrect = null;
      showHint = false;
    });
  }

  void _handleAnswer(int index) {
    if (isCorrect != null) return;

    setState(() {
      isCorrect = index == currentQuestion.correctAnswerIndex;
      if (isCorrect!) {
        int damage = 20 + (widget.player.level * 5);
        widget.monster.takeDamage(damage);
        logs.insert(0, "You dealt $damage damage!");
        if (widget.monster.hp <= 0) {
          _handleVictory();
        } else {
          Future.delayed(const Duration(seconds: 2), _pickNewQuestion);
        }
      } else {
        int damage = 10 + (widget.monster.level * 2);
        widget.player.takeDamage(damage);
        logs.insert(0, "${widget.monster.name} hit you for $damage!");
        if (widget.player.hp <= 0) {
          _handleGameOver();
        } else {
          Future.delayed(const Duration(seconds: 2), _pickNewQuestion);
        }
      }
    });
  }

  void _handleVictory() {
    widget.player.gainXP(50 * widget.monster.level);
    widget.player.roomsCleared++;
    widget.player.heal(20);
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text("VICTORY!"),
        content: const Text("You defeated the monster and gained XP!"),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context, widget.player);
            },
            child: const Text("CONTINUE"),
          )
        ],
      ),
    );
  }

  void _handleGameOver() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text("DEFEATED"),
        content: const Text("The dungeon claimed another soul. Study harder!"),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            child: const Text("RETRY"),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Stats Header
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Row(
                children: [
                  Expanded(child: StatBar(label: "PLAYER HP", value: widget.player.hp, maxValue: widget.player.maxHp, color: Colors.red)),
                  const SizedBox(width: 40),
                  Expanded(child: StatBar(label: "MONSTER HP", value: widget.monster.hp, maxValue: widget.monster.maxHp, color: Colors.orange)),
                ],
              ),
            ),
            
            // Monster Visual
            Expanded(
              flex: 2,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(widget.monster.image, style: const TextStyle(fontSize: 80)),
                  const SizedBox(height: 10),
                  Text(widget.monster.name.toUpperCase(), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                ],
              ),
            ),

            // Question Section
            Expanded(
              flex: 5,
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.emerald.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        currentQuestion.category.toUpperCase(),
                        style: const TextStyle(color: Colors.emerald, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(currentQuestion.text, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w500)),
                    const SizedBox(height: 24),
                    ...List.generate(currentQuestion.options.length, (index) {
                      Color btnColor = Colors.white.withOpacity(0.05);
                      if (isCorrect != null) {
                        if (index == currentQuestion.correctAnswerIndex) {
                          btnColor = Colors.emerald.withOpacity(0.2);
                        } else if (index != currentQuestion.correctAnswerIndex && isCorrect == false) {
                           // highlight wrong if needed
                        }
                      }
                      
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: InkWell(
                          onTap: () => _handleAnswer(index),
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: btnColor,
                              border: Border.all(color: Colors.white10),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(currentQuestion.options[index]),
                          ),
                        ),
                      );
                    }),
                    
                    if (isCorrect == null)
                      Center(
                        child: TextButton(
                          onPressed: () {
                            if (widget.player.hp > 5) {
                              setState(() {
                                widget.player.takeDamage(5);
                                showHint = true;
                              });
                            }
                          },
                          child: Text(showHint ? currentQuestion.explanation : "USE HINT (-5 HP)", style: const TextStyle(color: Colors.emerald, fontSize: 12)),
                        ),
                      )
                  ],
                ),
              ),
            ),
            
            // Battle Log
            Container(
              height: 100,
              width: double.infinity,
              color: Colors.black,
              padding: const EdgeInsets.all(12),
              child: ListView.builder(
                itemCount: logs.length,
                itemBuilder: (context, index) => Text("> ${logs[index]}", style: const TextStyle(color: Colors.white38, fontSize: 12, fontFamily: 'monospace')),
              ),
            )
          ],
        ),
      ),
    );
  }
}
