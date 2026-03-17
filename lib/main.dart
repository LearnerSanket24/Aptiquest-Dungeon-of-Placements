import 'package:flutter/material.dart';
import '../models/player.dart';
import '../models/monster.dart';
import '../models/question.dart';
import 'home_screen.dart';

void main() {
  runApp(const AptiQuestApp());
}

class AptiQuestApp extends StatelessWidget {
  const AptiQuestApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AptiQuest',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.emerald,
        scaffoldBackgroundColor: const Color(0xFF0A0A0A),
        fontFamily: 'Inter',
      ),
      home: const HomeScreen(),
    );
  }
}

// Global Questions Data
final List<Question> allQuestions = [
  Question(
    text: "If a train runs at 60 km/h, it takes 15 hours to complete a journey. How much time will it take at 90 km/h?",
    options: ["10 hours", "12 hours", "8 hours", "9 hours"],
    correctAnswerIndex: 0,
    category: "Quantitative Aptitude",
    explanation: "Time = Distance / Speed. Distance = 60 * 15 = 900 km. New Time = 900 / 90 = 10 hours.",
  ),
  Question(
    text: "Find the missing number in the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswerIndex: 1,
    category: "Logical Reasoning",
    explanation: "The differences are 4, 6, 8, 10, so the next difference is 12. 30 + 12 = 42.",
  ),
  Question(
    text: "Choose the synonym for 'Abundant'.",
    options: ["Scarce", "Plentiful", "Rare", "Limited"],
    correctAnswerIndex: 1,
    category: "English",
    explanation: "Abundant means existing or available in large quantities; plentiful.",
  ),
];

final List<Monster> dungeonMonsters = [
  Monster(name: "Slime of Logic", hp: 50, maxHp: 50, image: "🧪", level: 1),
  Monster(name: "Math Goblin", hp: 80, maxHp: 80, image: "👺", level: 2),
  Monster(name: "Grammar Ghost", hp: 100, maxHp: 100, image: "👻", level: 3),
  Monster(name: "Aptitude Dragon", hp: 200, maxHp: 200, image: "🐲", level: 5),
];
