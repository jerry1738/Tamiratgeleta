
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Guess, Question } from './types';
import * as geminiService from './services/geminiService';
import { UI_STRINGS, INITIAL_USER_PROMPT, WRONG_GUESS_PROMPT, LOCAL_STORAGE_SCORES_KEY } from './constants';
import StartScreen from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import GuessScreen from './components/GuessScreen';
import LoadingSpinner from './components/LoadingSpinner';
import { VoodooIcon } from './components/icons';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.NOT_STARTED);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [currentGuess, setCurrentGuess] = useState<Guess | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [questionCount, setQuestionCount] = useState<number>(0);
    const [lives, setLives] = useState<number>(5);
    const [scores, setScores] = useState<number[]>([]);

    useEffect(() => {
        try {
            const storedScores = localStorage.getItem(LOCAL_STORAGE_SCORES_KEY);
            if (storedScores) {
                setScores(JSON.parse(storedScores));
            }
        } catch (e) {
            console.error("Failed to parse scores from localStorage", e);
        }
    }, []);

    const handleStartGame = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setCurrentGuess(null);
        setCurrentQuestion(null);
        setQuestionCount(0);
        setLives(5);
        geminiService.startNewGame();
        
        const response = await geminiService.getGeminiResponse(INITIAL_USER_PROMPT);
        
        if (response.type === 'question') {
            setCurrentQuestion({ text: response.question, answers: response.answers });
            setGameState(GameState.IN_PROGRESS);
            setQuestionCount(1);
        } else {
            setError(UI_STRINGS.errorDetails);
            setGameState(GameState.ERROR);
        }
        setIsLoading(false);
    }, []);

    const handleAnswer = useCallback(async (answer: string) => {
        setIsLoading(true);
        setError(null);

        const response = await geminiService.getGeminiResponse(answer);

        if (response.type === 'question') {
            setCurrentQuestion({ text: response.question, answers: response.answers });
            setQuestionCount(prev => prev + 1);
            setGameState(GameState.IN_PROGRESS);
        } else if (response.type === 'guess') {
            setGameState(GameState.GUESSING);
            setCurrentGuess({
                name: response.character,
                description: response.description || "መግለጫ አልተገኘም።", // Fallback description
                sureness: response.sureness || 0 // Fallback sureness
            });
        } else {
            setError(UI_STRINGS.errorDetails);
            setGameState(GameState.ERROR);
        }

        setIsLoading(false);
    }, []);

    const handleGuessResponse = useCallback(async (isCorrect: boolean) => {
        if (isCorrect) {
            const newScores = [...scores, questionCount];
            setScores(newScores);
            try {
                localStorage.setItem(LOCAL_STORAGE_SCORES_KEY, JSON.stringify(newScores));
            } catch (e) {
                console.error("Failed to save scores to localStorage", e);
            }
            setGameState(GameState.GAME_OVER_WIN);
        } else {
            const newLives = lives - 1;
            setLives(newLives);

            if (newLives <= 0) {
                setGameState(GameState.GAME_OVER_LOSS);
                return;
            }

            setIsLoading(true);
            setError(null);
            setCurrentGuess(null);
            const response = await geminiService.getGeminiResponse(WRONG_GUESS_PROMPT);
            if (response.type === 'question') {
                setCurrentQuestion({ text: response.question, answers: response.answers });
                setGameState(GameState.IN_PROGRESS);
            } else {
                setError(UI_STRINGS.errorDetails);
                setGameState(GameState.ERROR);
            }
            setIsLoading(false);
        }
    }, [lives, scores, questionCount]);
    
    const handleTryAgain = () => {
        setError(null);
        setGameState(GameState.NOT_STARTED);
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-4">
                    <LoadingSpinner />
                    <p className="text-cyan-200 mt-4 text-lg">{UI_STRINGS.thinking}</p>
                </div>
            );
        }

        switch (gameState) {
            case GameState.NOT_STARTED:
                return <StartScreen onStart={handleStartGame} scores={scores} />;
            case GameState.IN_PROGRESS:
                return currentQuestion && <QuestionScreen question={currentQuestion} questionCount={questionCount} lives={lives} onAnswer={handleAnswer} />;
            case GameState.GUESSING:
                return currentGuess && <GuessScreen guess={currentGuess} onConfirm={handleGuessResponse} />;
            case GameState.GAME_OVER_WIN:
                return (
                    <div className="flex flex-col items-center justify-center text-center p-4 text-white">
                        <VoodooIcon className="w-28 h-28 text-purple-400 mb-4 animate-voodoo-pulse" />
                        <h2 className="text-3xl font-bold text-purple-300 mb-4">{UI_STRINGS.iWonFun}</h2>
                        <p className="text-5xl font-extrabold mb-4" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>{currentGuess?.name}</p>
                        <p className="text-lg text-cyan-200 mb-8">{UI_STRINGS.guessedInQuestions.replace('{count}', String(questionCount))}</p>
                        <button
                            onClick={handleStartGame}
                            className="bg-cyan-500 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/50 hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
                        >
                            {UI_STRINGS.playAgain}
                        </button>
                    </div>
                );
            case GameState.GAME_OVER_LOSS:
                return (
                    <div className="flex flex-col items-center justify-center text-center p-4 text-white">
                        <h2 className="text-4xl font-bold text-red-400 mb-2">{UI_STRINGS.iLost}</h2>
                        <p className="text-lg text-gray-300 mb-8">{UI_STRINGS.mindHardToRead}</p>
                        <button
                            onClick={handleStartGame}
                            className="bg-cyan-500 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/50 hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
                        >
                            {/* Fix: Corrected typo from UI_STRINA to UI_STRINGS. */}
                            {UI_STRINGS.playAgain}
                        </button>
                    </div>
                );
            case GameState.ERROR:
                 return (
                    <div className="flex flex-col items-center justify-center text-center p-4 text-white">
                        <h2 className="text-3xl font-bold text-red-500 mb-2">{UI_STRINGS.error}</h2>
                        <p className="text-lg text-red-200 mb-8">{error}</p>
                        <button
                            onClick={handleTryAgain}
                            className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-yellow-500/50 hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
                        >
                            {UI_STRINGS.tryAgain}
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
         <div className="bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen flex flex-col items-center justify-center p-4 text-white antialiased">
            <h1 className="text-5xl font-bold text-white mb-8 text-center" style={{ textShadow: '0 0 15px rgba(56, 189, 248, 0.7)' }}>
                ታምራት ገለታ
            </h1>
            <div className="w-full max-w-3xl min-h-[500px] bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl shadow-2xl flex items-center justify-center border border-cyan-500/20">
                {renderContent()}
            </div>
        </div>
    );
};

export default App;
