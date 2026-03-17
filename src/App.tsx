import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, Shield, Heart, Trophy, Skull, ArrowRight, RefreshCw } from 'lucide-react';
import { Player, Monster, Question, GameState } from './types';
import { QUESTIONS } from './data/questions';
import { StatBar } from './components/StatBar';
import { cn } from './lib/utils';

const INITIAL_PLAYER: Player = {
  hp: 100,
  maxHp: 100,
  xp: 0,
  level: 1,
  roomsCleared: 0,
  shieldActive: false,
};

const MONSTERS: Monster[] = [
  { name: "Slime of Logic", hp: 50, maxHp: 50, image: "🧪", level: 1 },
  { name: "Math Goblin", hp: 80, maxHp: 80, image: "👺", level: 2 },
  { name: "Grammar Ghost", hp: 100, maxHp: 100, image: "👻", level: 3 },
  { name: "Aptitude Dragon", hp: 200, maxHp: 200, image: "🐲", level: 5 },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('HOME');
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong', message: string } | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const startNewGame = () => {
    setPlayer(INITIAL_PLAYER);
    setGameState('DUNGEON');
  };

  const enterBattle = (monsterIndex: number) => {
    const monster = { ...MONSTERS[monsterIndex] };
    setCurrentMonster(monster);
    setGameState('BATTLE');
    setBattleLog([`A wild ${monster.name} appeared!`]);
    pickNewQuestion();
  };

  const pickNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
    setCurrentQuestion(QUESTIONS[randomIndex]);
    setFeedback(null);
    setShowHint(false);
  };

  const toggleHint = () => {
    if (!showHint && player.hp > 5) {
      setPlayer(prev => ({ ...prev, hp: prev.hp - 5 }));
      setBattleLog(prev => ["You used a hint! (-5 HP)", ...prev]);
      setShowHint(true);
    } else if (showHint) {
      setShowHint(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuestion || !currentMonster || feedback) return;

    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const damage = 20 + (player.level * 5);
      const newMonsterHp = Math.max(0, currentMonster.hp - damage);
      setCurrentMonster({ ...currentMonster, hp: newMonsterHp });
      setFeedback({ type: 'correct', message: `Correct! You dealt ${damage} damage!` });
      setBattleLog(prev => [`You dealt ${damage} damage to ${currentMonster.name}!`, ...prev]);

      if (newMonsterHp === 0) {
        setTimeout(() => handleVictory(), 1500);
      } else {
        setTimeout(() => pickNewQuestion(), 1500);
      }
    } else {
      const monsterDamage = 10 + (currentMonster.level * 2);
      const newPlayerHp = Math.max(0, player.hp - monsterDamage);
      setPlayer({ ...player, hp: newPlayerHp });
      setFeedback({ type: 'wrong', message: `Wrong! ${currentMonster.name} attacked for ${monsterDamage} damage!` });
      setBattleLog(prev => [`${currentMonster.name} attacked you for ${monsterDamage} damage!`, ...prev]);

      if (newPlayerHp === 0) {
        setTimeout(() => setGameState('GAMEOVER'), 1500);
      } else {
        setTimeout(() => pickNewQuestion(), 1500);
      }
    }
  };

  const handleVictory = () => {
    const xpGained = 50 * (currentMonster?.level || 1);
    let newXp = player.xp + xpGained;
    let newLevel = player.level;
    
    if (newXp >= 100) {
      newLevel += 1;
      newXp = newXp - 100;
    }

    setPlayer({
      ...player,
      xp: newXp,
      level: newLevel,
      roomsCleared: player.roomsCleared + 1,
      hp: Math.min(player.maxHp, player.hp + 20) // Small heal on victory
    });
    setGameState('RESULT');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {gameState === 'HOME' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <div className="mb-8 relative">
              <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full" />
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none mb-2 relative">
                Apti<span className="text-emerald-500">Quest</span>
              </h1>
              <p className="text-emerald-500/60 font-mono text-sm tracking-widest uppercase">Dungeon of Placements</p>
            </div>
            
            <div className="max-w-md mb-12 text-white/60 leading-relaxed">
              Master quantitative aptitude, logical reasoning, and verbal ability in this turn-based RPG dungeon crawler.
            </div>

            <button 
              onClick={startNewGame}
              className="group relative px-12 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Enter the Dungeon <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        )}

        {gameState === 'DUNGEON' && (
          <motion.div 
            key="dungeon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto p-6 pt-12"
          >
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-black uppercase italic tracking-tight">Dungeon Floor</h2>
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Rooms Cleared: {player.roomsCleared}</p>
              </div>
              <div className="flex flex-col items-end gap-4 w-64">
                <StatBar label="Health" value={player.hp} maxValue={player.maxHp} color="bg-red-500" />
                <StatBar label={`Level ${player.level} XP`} value={player.xp} maxValue={100} color="bg-emerald-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MONSTERS.map((monster, idx) => {
                const isLocked = idx > player.roomsCleared;
                return (
                  <button
                    key={monster.name}
                    disabled={isLocked}
                    onClick={() => enterBattle(idx)}
                    className={cn(
                      "relative group p-8 border border-white/10 rounded-2xl transition-all duration-300 text-left overflow-hidden",
                      isLocked ? "opacity-40 cursor-not-allowed bg-white/5" : "hover:border-emerald-500/50 hover:bg-white/5 bg-white/[0.02]"
                    )}
                  >
                    <div className="relative z-10">
                      <div className="text-4xl mb-4">{isLocked ? "🔒" : monster.image}</div>
                      <h3 className="text-xl font-bold uppercase mb-1">{monster.name}</h3>
                      <p className="text-white/40 text-sm mb-4">Level {monster.level} Guardian</p>
                      {!isLocked && (
                        <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          Challenge <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    {!isLocked && (
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sword className="w-12 h-12" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {gameState === 'BATTLE' && currentMonster && currentQuestion && (
          <motion.div 
            key="battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto p-6 min-h-screen flex flex-col"
          >
            {/* Battle Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase">{player.level} LVL Player</h3>
                <StatBar label="HP" value={player.hp} maxValue={player.maxHp} color="bg-red-500" />
              </div>
              
              <div className="flex flex-col items-center">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-8xl mb-4"
                >
                  {currentMonster.image}
                </motion.div>
                <div className="text-center">
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">{currentMonster.name}</h3>
                  <p className="text-white/40 text-xs font-mono">LVL {currentMonster.level}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase text-right">Monster</h3>
                <StatBar label="HP" value={currentMonster.hp} maxValue={currentMonster.maxHp} color="bg-orange-500" />
              </div>
            </div>

            {/* Question Area */}
            <div className="flex-grow flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
              <div className="w-full bg-white/[0.03] border border-white/10 p-8 rounded-3xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                  {currentQuestion.category}
                </span>
                <h4 className="text-2xl font-medium leading-relaxed mb-8">
                  {currentQuestion.text}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={!!feedback}
                      className={cn(
                        "p-5 text-left border rounded-2xl transition-all duration-200 font-medium",
                        feedback 
                          ? idx === currentQuestion.correctAnswer 
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                            : "bg-white/5 border-white/5 opacity-50"
                          : "bg-white/5 border-white/10 hover:border-white/40 hover:bg-white/10"
                      )}
                    >
                      <span className="text-white/30 mr-3 font-mono">{String.fromCharCode(65 + idx)}.</span>
                      {option}
                    </button>
                  ))}
                </div>

                {currentQuestion.explanation && !feedback && (
                  <div className="mt-8 flex justify-center">
                    <button 
                      onClick={toggleHint}
                      className="text-xs font-bold uppercase tracking-widest text-emerald-500/60 hover:text-emerald-500 transition-colors flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" /> {showHint ? "Hide Hint" : "Use Hint (Cost: 5 HP)"}
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {showHint && currentQuestion.explanation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-sm text-emerald-500/80 italic overflow-hidden"
                    >
                      💡 {currentQuestion.explanation}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "w-full p-4 rounded-2xl text-center font-bold uppercase tracking-widest mb-8",
                      feedback.type === 'correct' ? "bg-emerald-500 text-black" : "bg-red-500 text-white"
                    )}
                  >
                    {feedback.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Battle Log */}
            <div className="h-32 overflow-y-auto bg-black/40 border-t border-white/10 p-4 font-mono text-xs text-white/40 space-y-1">
              {battleLog.map((log, i) => (
                <div key={i} className={i === 0 ? "text-white/80" : ""}>
                  {`> ${log}`}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'RESULT' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              <Trophy className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-6xl font-black uppercase italic mb-4">Victory!</h2>
            <p className="text-white/60 mb-12 max-w-md">
              You defeated the guardian and gained valuable experience. Your placement skills are growing stronger.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-12 w-full max-w-sm">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-emerald-500 font-black text-2xl">+50</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">XP Gained</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-red-500 font-black text-2xl">+20</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">HP Restored</div>
              </div>
            </div>

            <button 
              onClick={() => setGameState('DUNGEON')}
              className="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all duration-300"
            >
              Continue Journey
            </button>
          </motion.div>
        )}

        {gameState === 'GAMEOVER' && (
          <motion.div 
            key="gameover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-red-950/20"
          >
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-8">
              <Skull className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-6xl font-black uppercase italic mb-4">Defeated</h2>
            <p className="text-white/60 mb-12 max-w-md">
              The dungeon was too much this time. Study harder and return to claim your placement.
            </p>
            
            <button 
              onClick={startNewGame}
              className="flex items-center gap-2 px-12 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <RefreshCw className="w-5 h-5" /> Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
