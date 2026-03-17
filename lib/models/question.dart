class Question {
  final String text;
  final List<String> options;
  final int correctAnswerIndex;
  final String category;
  final String explanation;

  Question({
    required this.text,
    required this.options,
    required this.correctAnswerIndex,
    required this.category,
    required this.explanation,
  });
}
