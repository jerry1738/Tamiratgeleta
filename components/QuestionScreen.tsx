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

const AnswerButton: React.FC<{ onClick: () => void; children: React.ReactNode; color: string }> = ({ onClick, children, color }) => (
    <button
        onClick={onClick}
        className={`w-full md:w-auto flex-grow md:flex-none text-lg font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${color}`}
    >
        {children}
    </button>
);

const QuestionScreen: React.FC<QuestionScreenProps> = ({ question, questionCount, lives, onAnswer }) => {
    const defaultAnswers = [
        { text: UI_STRINGS.yes, color: "bg-green-600 hover:bg-green-500 text-white" },
        { text: UI_STRINGS.no, color: "bg-red-600 hover:bg-red-500 text-white" },
        { text: UI_STRINGS.dontKnow, color: "bg-gray-600 hover:bg-gray-500 text-white" },
        { text: UI_STRINGS.probably, color: "bg-green-800 hover:bg-green-700 text-white" },
        { text: UI_STRINGS.probablyNot, color: "bg-red-800 hover:bg-red-700 text-white" },
    ];

    const displayedAnswers = question.answers
        ? question.answers.map(ans => ({ text: ans, color: "bg-sky-700 hover:bg-sky-600 text-white" }))
        : defaultAnswers;
    
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
            
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-white leading-relaxed">{question.text}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row md:flex-wrap justify-center gap-4 w-full">
                {displayedAnswers.map(answer => (
                     <AnswerButton key={answer.text} onClick={() => onAnswer(answer.text)} color={answer.color}>
                        {answer.text}
                     </AnswerButton>
                ))}
            </div>
        </div>
    );
};

export default QuestionScreen;