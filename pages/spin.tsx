import React, { useState, useRef, useEffect } from 'react';
import { Loader2, X, Clock, Trophy, RotateCcw } from 'lucide-react';

const SpinWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [questions, setQuestions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const wheelRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const categories = [
    {
      name: 'Use Cases',
      color: '#FF6B6B',
      paragraph: 'Explore real-world applications and practical scenarios where innovative solutions meet business challenges. Discover how technology transforms ideas into actionable implementations.'
    },
    {
      name: 'IdeaFlux',
      color: '#4ECDC4',
      paragraph: 'Dive into the creative process of ideation and innovation. Learn how to generate, refine, and validate ideas that can disrupt markets and create value.'
    },
    {
      name: 'Ignite Startup',
      color: '#FFE66D',
      paragraph: 'Embark on the entrepreneurial journey from concept to launch. Understand the essential steps, strategies, and mindset needed to build a successful startup.'
    },
    {
      name: 'Know Your Enterprise',
      color: '#95E1D3',
      paragraph: 'Master the fundamentals of enterprise architecture, business processes, and organizational dynamics. Learn to navigate complex corporate environments effectively.'
    }
  ];

  // Timer effect
  useEffect(() => {
    if (showModal && !quizCompleted && questions.length > 0) {
      if (timeLeft > 0) {
        timerRef.current = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
      } else {
        // Time's up - mark as wrong and move to next
        handleTimeUp();
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, showModal, quizCompleted, currentQuestionIndex]);
const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedCategory(null);
    setQuestions([]);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizCompleted(false);

    // Calculate random spin (2-3 full rotations for slower spin + random segment)
    const spins = 2 + Math.random() * 1; // Reduced rotations for slower effect
    const randomDegree = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + randomDegree;
    
    setRotation(totalRotation);

    // Determine which category was selected after 5 seconds
    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const segmentAngle = 360 / categories.length; // 90 degrees per segment
      
      // Since we now draw segments starting from 0 degrees (top), 
      // we simply find which segment is at 0 after rotation
      const effectiveAngle = (360 - normalizedRotation) % 360;
      let categoryIndex = Math.floor(effectiveAngle / segmentAngle);
      
      // Ensure index is within bounds
      categoryIndex = categoryIndex % categories.length;
      
      const selected = categories[categoryIndex];
      console.log('Rotation:', normalizedRotation, 'Category Index:', categoryIndex, 'Selected:', selected.name);
      setSelectedCategory(selected);
      setIsSpinning(false);
      
      // Send to backend
      fetchQuestions(selected.paragraph);
    }, 5000); // Changed to 5 seconds
  };

  const fetchQuestions = async (paragraph:any) => {
    setIsLoading(true);
    
    try {
      // Replace with your actual API endpoint
    //   const response = await fetch('YOUR_API_ENDPOINT_HERE', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ paragraph })
    //   });

    //   const data = await response.json();

      const mockQuestions:any = [
        {
          question: 'What is the primary goal of use case analysis?',
          options: ['Design UI', 'Understand requirements', 'Write code', 'Test software'],
          answer: 'Understand requirements'
        },
        {
          question: 'Which methodology focuses on iterative development?',
          options: ['Waterfall', 'Agile', 'V-Model', 'Spiral'],
          answer: 'Agile'
        },
        {
          question: 'What does MVP stand for in startup context?',
          options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Market Validation Process'],
          answer: 'Minimum Viable Product'
        },
        {
          question: 'What is a key component of enterprise architecture?',
          options: ['Social media', 'Business processes', 'Gaming systems', 'Consumer apps'],
          answer: 'Business processes'
        },
        {
          question: 'What is the main benefit of cloud computing?',
          options: ['Higher costs', 'Scalability', 'Less security', 'Slower performance'],
          answer: 'Scalability'
        }
      ];
      setQuestions(mockQuestions);
      setShowModal(true);
      setCurrentQuestionIndex(0);
      setTimeLeft(30);
      setSelectedAnswer(null);
      
    //   if (data?.questions) {
    //     setQuestions(data.questions);
    //     setShowModal(true);
    //     setCurrentQuestionIndex(0);
    //     setTimeLeft(30);
    //     setSelectedAnswer(null);
    //   }
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Mock data for demonstration
      const mockQuestions:any = [
        {
          question: 'What is the primary goal of use case analysis?',
          options: ['Design UI', 'Understand requirements', 'Write code', 'Test software'],
          answer: 'Understand requirements'
        },
        {
          question: 'Which methodology focuses on iterative development?',
          options: ['Waterfall', 'Agile', 'V-Model', 'Spiral'],
          answer: 'Agile'
        },
        {
          question: 'What does MVP stand for in startup context?',
          options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Market Validation Process'],
          answer: 'Minimum Viable Product'
        },
        {
          question: 'What is a key component of enterprise architecture?',
          options: ['Social media', 'Business processes', 'Gaming systems', 'Consumer apps'],
          answer: 'Business processes'
        },
        {
          question: 'What is the main benefit of cloud computing?',
          options: ['Higher costs', 'Scalability', 'Less security', 'Slower performance'],
          answer: 'Scalability'
        }
      ];
      setQuestions(mockQuestions);
      setShowModal(true);
      setCurrentQuestionIndex(0);
      setTimeLeft(30);
      setSelectedAnswer(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUp = () => {
    const currentQuestion:any = questions[currentQuestionIndex];
    const newAnsweredQuestions:any = [...answeredQuestions, {
      question: currentQuestion.question,
      selectedAnswer: null,
      correctAnswer: currentQuestion.answer,
      isCorrect: false,
      timedOut: true
    }];
    setAnsweredQuestions(newAnsweredQuestions);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleAnswerSelect = (option:any) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(option);
    
    const currentQuestion:any = questions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    const newAnsweredQuestions:any = [...answeredQuestions, {
      question: currentQuestion.question,
      selectedAnswer: option,
      correctAnswer: currentQuestion.answer,
      isCorrect,
      timedOut: false
    }];
    setAnsweredQuestions(newAnsweredQuestions);

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(30);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1500);
  };

  const closeModal = () => {
    setShowModal(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(30);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizCompleted(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const restartQuiz = () => {
    setShowModal(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(30);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizCompleted(false);
    setSelectedCategory(null);
  };

  const getOptionStyle = (option:any) => {
    if (selectedAnswer === null) {
      return 'bg-white hover:bg-blue-50 border-gray-300';
    }
    
    const currentQuestion:any = questions[currentQuestionIndex];
    if (option === currentQuestion.answer) {
      return 'bg-green-100 border-green-500';
    }
    if (option === selectedAnswer && option !== currentQuestion.answer) {
      return 'bg-red-100 border-red-500';
    }
    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
          Spin the Wheel Challenge
        </h1>

        {/* Wheel Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          <div className="relative">
            {/* Needle - Fixed at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-20">
              <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[60px] border-t-red-600 drop-shadow-lg"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full shadow-lg"></div>
            </div>

            {/* Wheel */}
            <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] mx-auto">
              <svg
                ref={wheelRef}
                className="w-full h-full transition-transform duration-[4000ms] ease-out"
                style={{ transform: `rotate(${rotation}deg)` }}
                viewBox="0 0 200 200"
              >
                <g transform="translate(100, 100)">
                  {categories.map((category, index) => {
                    const angle = (360 / categories.length) * index;
                    const nextAngle = (360 / categories.length) * (index + 1);
                    
                    const startAngle = (angle - 90) * (Math.PI / 180);
                    const endAngle = (nextAngle - 90) * (Math.PI / 180);
                    
                    const x1 = 90 * Math.cos(startAngle);
                    const y1 = 90 * Math.sin(startAngle);
                    const x2 = 90 * Math.cos(endAngle);
                    const y2 = 90 * Math.sin(endAngle);
                    
                    const largeArc = nextAngle - angle > 180 ? 1 : 0;
                    
                    const pathData = `M 0 0 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`;
                    
                    const textAngle = angle + (360 / categories.length) / 2;
                    const textRadius = 55;
                    const textX = textRadius * Math.cos((textAngle - 90) * (Math.PI / 180));
                    const textY = textRadius * Math.sin((textAngle - 90) * (Math.PI / 180));
                    
                    return (
                      <g key={index}>
                        <path
                          d={pathData}
                          fill={category.color}
                          stroke="white"
                          strokeWidth="3"
                        />
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="11"
                          fontWeight="bold"
                          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                        >
                          {category.name}
                        </text>
                      </g>
                    );
                  })}
                  {/* Center circle */}
                  <circle cx="0" cy="0" r="20" fill="white" stroke="#333" strokeWidth="3" />
                </g>
              </svg>
            </div>

            {/* Spin Button */}
            <div className="text-center mt-8">
              <button
                onClick={spinWheel}
                disabled={isSpinning || isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSpinning ? 'Spinning...' : isLoading ? 'Loading...' : 'SPIN THE WHEEL'}
              </button>
            </div>

            {selectedCategory && !showModal && (
              <div className="text-center mt-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="text-2xl">👉</div>
                  <div 
                    className="inline-block px-6 py-3 rounded-lg text-white font-semibold text-xl shadow-lg"
                    style={{ backgroundColor: selectedCategory.color }}
                  >
                    {selectedCategory.name}
                  </div>
                  <div className="text-2xl">👈</div>
                </div>
                <p className="text-white mt-3 text-lg font-medium">Selected Category!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {!quizCompleted ? (
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div 
                        className="inline-block px-4 py-2 rounded-lg text-white font-semibold mb-2"
                        style={{ backgroundColor: selectedCategory?.color }}
                      >
                        {selectedCategory?.name}
                      </div>
                      <p className="text-gray-600 text-sm">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Timer */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-700">Time Left:</span>
                      </div>
                      <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-purple-600'}`}>
                        {timeLeft}s
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-500' : 'bg-purple-600'}`}
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      {questions[currentQuestionIndex]?.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                      {questions[currentQuestionIndex]?.options.map((option:any, index:any) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all ${getOptionStyle(option)} ${selectedAnswer === null ? 'hover:shadow-md cursor-pointer' : 'cursor-not-allowed'}`}
                        >
                          <span className="font-semibold text-gray-700">{String.fromCharCode(65 + index)}.</span> {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-center text-gray-600">
                    <span className="font-semibold">Current Score: {score}/{questions.length}</span>
                  </div>
                </div>
              ) : (
                // Results Screen
                <div className="p-6 md:p-8">
                  <div className="text-center mb-6">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
                    <p className="text-gray-600">Here's how you did</p>
                  </div>

                  {/* Final Score */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 mb-6 text-center">
                    <p className="text-lg mb-2">Your Score</p>
                    <p className="text-5xl font-bold">{score}/{questions.length}</p>
                    <p className="text-lg mt-2">{Math.round((score / questions.length) * 100)}%</p>
                  </div>

                  {/* Answer Review */}
                  <div className="space-y-4 mb-6">
                    {answeredQuestions.map((answer:any, index:any) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border-2 ${answer.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}
                      >
                        <p className="font-semibold text-gray-800 mb-2">Q{index + 1}: {answer.question}</p>
                        <div className="text-sm">
                          {answer.timedOut ? (
                            <p className="text-red-600">⏰ Time's up! No answer selected</p>
                          ) : (
                            <p className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                              Your answer: {answer.selectedAnswer}
                            </p>
                          )}
                          {!answer.isCorrect && (
                            <p className="text-green-600">Correct answer: {answer.correctAnswer}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={restartQuiz}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Spin Again
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinWheel;