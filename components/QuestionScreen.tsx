import React from 'react';
import { UI_STRINGS } from '../constants';
import { Question } from '../types';
import { HeartIcon } from './icons';

interface QuestionScreenProps {
    question: Question;
    questionCount: number;
    lives: number;
    onAnswer: (answer: string) => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ question, questionCount, lives, onAnswer }) => {
    
    const renderAnswers = () => {
        if (question.answers && question.answers.length > 0) {
            // Custom answers view: A responsive flex grid for variable answers
            return (
                <div className="flex flex-wrap justify-center gap-4 w-full">
                    {question.answers.map(answer => (
                        <button
                            key={answer}
                            onClick={() => onAnswer(answer)}
                            className="flex-1 min-w-[140px] bg-sky-700 hover:bg-sky-600 text-white text-lg font-semibold py-3 px-5 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            {answer}
                        </button>
                    ))}
                </div>
            );
        }

        // Default answers view with a clear visual hierarchy
        return (
            <div className="w-full flex flex-col items-center gap-5">
                {/* Primary Answers: Large and prominent */}
                <div className="grid grid-cols-2 gap-4 w-full">
                    <button
                        onClick={() => onAnswer(UI_STRINGS.yes)}
                        className="text-xl font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 bg-green-600 hover:bg-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        {UI_STRINGS.yes}
                    </button>
                    <button
                        onClick={() => onAnswer(UI_STRINGS.no)}
                        className="text-xl font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 bg-red-600 hover:bg-red-500 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        {UI_STRINGS.no}
                    </button>
                </div>

                {/* Secondary Answers: Smaller and less prominent */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    <button
                        onClick={() => onAnswer(UI_STRINGS.probably)}
                        className="text-base font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 bg-green-800 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                        {UI_STRINGS.probably}
                    </button>
                    <button
                        onClick={() => onAnswer(UI_STRINGS.probablyNot)}
                        className="text-base font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 bg-red-800 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                        {UI_STRINGS.probablyNot}
                    </button>
                     <button
                        onClick={() => onAnswer(UI_STRINGS.dontKnow)}
                        className="sm:col-span-1 text-base font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 bg-gray-600 hover:bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        {UI_STRINGS.dontKnow}
                    </button>
                </div>
            </div>
        );
    };
    
    return (
        <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center text-center">
            <div className="w-full flex justify-between items-center mb-8 px-2">
                <div className="text-left">
                    <p className="text-lg text-cyan-300 font-bold">{UI_STRINGS.question} {questionCount}</p>
                </div>
                <div className="flex items-center gap-2" title={UI_STRINGS.livesLeft}>
                    <p className="text-lg text-red-400 font-bold">{lives}</p>
                    <HeartIcon className="w-6 h-6 text-red-500" />
                </div>
            </div>
            
            <div className="mb-8 min-h-[7rem] flex items-center justify-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-white leading-relaxed">{question.text}</h2>
            </div>

            <div className="w-full">
                {renderAnswers()}
            </div>
        </div>
    );
};

export default QuestionScreen;