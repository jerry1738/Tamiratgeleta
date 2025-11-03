import React from 'react';
import { UI_STRINGS } from '../constants';
import { VoodooIcon } from './icons';

interface StartScreenProps {
    onStart: () => void;
    scores: number[];
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, scores }) => {
    const bestScore = scores.length > 0 ? Math.min(...scores) : null;
    
    return (
        <div className="flex flex-col items-center justify-center text-center p-4">
            <VoodooIcon className="w-24 h-24 text-purple-400 mb-6 animate-voodoo-pulse" />
            <p className="text-lg md:text-xl text-cyan-200 mb-4">{UI_STRINGS.subtitle}</p>

            <div className="max-w-md mb-6 text-cyan-200 bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30">
                <p className="text-base">{UI_STRINGS.howItWorks}</p>
            </div>

            {bestScore && (
                <div className="mb-6">
                    <p className="text-lg text-yellow-300">{UI_STRINGS.bestScore}</p>
                    <p className="text-3xl font-bold text-white">{bestScore} <span className="text-xl">{UI_STRINGS.questionsUnit}</span></p>
                </div>
            )}

            <button
                onClick={onStart}
                className="bg-cyan-500 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/50 hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
            >
                {UI_STRINGS.startGame}
            </button>
        </div>
    );
};

export default StartScreen;