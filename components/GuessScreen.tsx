
import React from 'react';
import { UI_STRINGS } from '../constants';
import { Guess } from '../types';

interface GuessScreenProps {
    guess: Guess;
    onConfirm: (isCorrect: boolean) => void;
}

const SurenessCircle: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-36 h-36">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-gray-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-cyan-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-bold text-white">
                    {Math.round(percentage)}%
                </span>
                <span className="text-sm font-medium text-cyan-200">{UI_STRINGS.sureness}</span>
            </div>
        </div>
    );
};


const GuessScreen: React.FC<GuessScreenProps> = ({ guess, onConfirm }) => {
    return (
        <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-cyan-200 mb-6">{UI_STRINGS.isThisYourCharacter}</h2>
            
            <SurenessCircle percentage={guess.sureness} />

            <p className="text-4xl font-bold text-white mt-6 mb-2">{guess.name}</p>

            <p className="text-base text-gray-300 mb-8 h-24 overflow-y-auto px-2">{guess.description}</p>


            <div className="flex justify-center gap-4 w-full">
                <button
                    onClick={() => onConfirm(true)}
                    className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-500 transition-all duration-300 transform hover:scale-105"
                >
                    {UI_STRINGS.yesCorrect}
                </button>
                <button
                    onClick={() => onConfirm(false)}
                    className="flex-1 bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-red-500 transition-all duration-300 transform hover:scale-105"
                >
                    {UI_STRINGS.noWrong}
                </button>
            </div>
        </div>
    );
};

export default GuessScreen;
