// localStorage'a güvenli erişim için yardımcı fonksiyon
const isBrowser = () => typeof window !== 'undefined';

const getLocalStorage = (key) => {
  if (isBrowser()) {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key, value) => {
  if (isBrowser()) {
    localStorage.setItem(key, value);
  }
};

// Basit bir Eliza framework taklidi
// Gerçek uygulamada MultiversX AI Agent Kit ve Eliza Framework kullanılabilir

class ElizaService {
  constructor() {
    this.userName = '';
    this.userLevel = null; // 'beginner', 'intermediate', 'advanced'
    this.currentStep = 'greeting'; // 'greeting', 'introduction', 'assessment', 'learning'
    this.assessmentQuestions = [
      {
        question: "How would you introduce yourself in English?",
        options: ["Me name is...", "I am...", "My name is...", "I called..."],
        correctAnswer: 2,
      },
      {
        question: "What is the past tense of 'go'?",
        options: ["goed", "went", "gone", "going"],
        correctAnswer: 1,
      },
      {
        question: "Choose the correct sentence:",
        options: [
          "I have been to Paris last year.",
          "I went to Paris last year.",
          "I have gone to Paris last year.",
          "I did go to Paris last year."
        ],
        correctAnswer: 1,
      },
      {
        question: "What does 'nevertheless' mean?",
        options: ["never less", "however", "moreover", "therefore"],
        correctAnswer: 1,
      },
      {
        question: "Which sentence uses the present perfect correctly?",
        options: [
          "I have seen that movie yesterday.",
          "I have been seeing that movie.",
          "I have seen that movie three times.",
          "I have saw that movie."
        ],
        correctAnswer: 2,
      }
    ];
    
    this.questions = {
      beginner: [
        {
          question: "What is the opposite of 'big'?",
          options: ["small", "large", "huge", "tall"],
          correctAnswer: 0,
        },
        {
          question: "Complete the sentence: 'She ___ to school every day.'",
          options: ["go", "goes", "going", "gone"],
          correctAnswer: 1,
        },
        {
          question: "What color is the sky?",
          options: ["red", "green", "blue", "yellow"],
          correctAnswer: 2,
        },
        {
          question: "How do you say 'hello' in English?",
          options: ["goodbye", "hello", "thank you", "please"],
          correctAnswer: 1,
        },
        {
          question: "What is 'apple' in English?",
          options: ["apple", "banana", "orange", "grape"],
          correctAnswer: 0,
        }
      ],
      intermediate: [
        {
          question: "Choose the correct phrasal verb: 'I need to ___ this task soon.'",
          options: ["carry out", "carry on", "carry off", "carry in"],
          correctAnswer: 0,
        },
        {
          question: "What is the past participle of 'write'?",
          options: ["wrote", "written", "writed", "writing"],
          correctAnswer: 1,
        },
        {
          question: "Which word is a synonym for 'happy'?",
          options: ["sad", "angry", "joyful", "tired"],
          correctAnswer: 2,
        },
        {
          question: "Complete the sentence: 'If I ___ rich, I would buy a big house.'",
          options: ["am", "was", "were", "be"],
          correctAnswer: 2,
        },
        {
          question: "What does the idiom 'break a leg' mean?",
          options: ["get injured", "good luck", "run away", "dance well"],
          correctAnswer: 1,
        }
      ],
      advanced: [
        {
          question: "Which sentence contains a dangling modifier?",
          options: [
            "Walking down the street, the birds sang loudly.",
            "The birds sang loudly as I walked down the street.",
            "While walking down the street, I heard birds singing loudly.",
            "Down the street I walked, listening to birds singing loudly."
          ],
          correctAnswer: 0,
        },
        {
          question: "What is the subjunctive mood used for?",
          options: [
            "To express facts",
            "To express wishes, suggestions, or hypothetical situations",
            "To give commands",
            "To ask questions"
          ],
          correctAnswer: 1,
        },
        {
          question: "Which of these is an example of a portmanteau word?",
          options: ["Sunshine", "Brunch", "Happiness", "Quickly"],
          correctAnswer: 1,
        },
        {
          question: "What literary device is used in 'The wind whispered through the trees'?",
          options: ["Metaphor", "Simile", "Personification", "Alliteration"],
          correctAnswer: 2,
        },
        {
          question: "Complete the sentence with the correct form: 'By this time next year, I ___ my degree.'",
          options: [
            "will complete",
            "will have completed",
            "will be completing",
            "am completing"
          ],
          correctAnswer: 1,
        }
      ]
    };
    
    this.currentQuestionIndex = 0;
    this.correctAnswers = 0;
    this.tokens = 0;
    
    // LocalStorage'dan token bakiyesini yükle
    this.loadTokensFromStorage();
  }

  // Kullanıcı ile etkileşim başlatma
  getInitialGreeting() {
    return "Merhaba! Ben ET, İngilizce öğrenmenize yardımcı olacak yapay zeka asistanınızım. Başlamadan önce sizi biraz tanımak istiyorum. İsminiz nedir?";
  }

  // Kullanıcı yanıtını işleme
  processUserInput(input) {
    switch (this.currentStep) {
      case 'greeting':
        this.userName = input.trim();
        this.currentStep = 'introduction';
        return `Memnun oldum, ${this.userName}! İngilizce öğrenme yolculuğunuzda size yardımcı olmak için buradayım. İngilizce seviyenizi belirlemek için birkaç soru sormak istiyorum. Hazır mısınız? (Evet/Hayır)`;
      
      case 'introduction':
        if (input.toLowerCase().includes('evet')) {
          this.currentStep = 'assessment';
          return this.getNextAssessmentQuestion();
        } else {
          return "Hazır olduğunuzda 'Evet' diyerek başlayabilirsiniz.";
        }
      
      case 'assessment':
        // Değerlendirme sorularını işle
        const assessmentResult = this.processAssessmentAnswer(parseInt(input));
        if (this.userLevel) {
          // Değerlendirme tamamlandı, öğrenme aşamasına geç
          this.currentStep = 'learning';
          return assessmentResult + " " + this.getNextLearningQuestion();
        }
        return assessmentResult;
      
      case 'learning':
        // Öğrenme sorularını işle
        return this.processLearningAnswer(parseInt(input));
      
      default:
        return "Üzgünüm, bir şeyler yanlış gitti. Tekrar başlayalım.";
    }
  }

  // Değerlendirme sorusu alma
  getNextAssessmentQuestion() {
    if (this.currentQuestionIndex < this.assessmentQuestions.length) {
      const question = this.assessmentQuestions[this.currentQuestionIndex];
      let response = `Soru ${this.currentQuestionIndex + 1}/${this.assessmentQuestions.length}: ${question.question}\n`;
      
      question.options.forEach((option, index) => {
        response += `${index}: ${option}\n`;
      });
      
      return response;
    } else {
      // Değerlendirme tamamlandı, seviyeyi belirle
      this.determineUserLevel();
      return `Değerlendirme tamamlandı! ${this.correctAnswers} doğru cevap verdiniz. Seviyeniz: ${this.getLevelInTurkish()}.`;
    }
  }

  // Değerlendirme cevabını işleme
  processAssessmentAnswer(answerIndex) {
    const currentQuestion = this.assessmentQuestions[this.currentQuestionIndex];
    let response = "";
    
    if (answerIndex === currentQuestion.correctAnswer) {
      response = "Doğru cevap! ";
      this.correctAnswers++;
    } else {
      response = `Yanlış cevap. Doğru cevap: ${currentQuestion.options[currentQuestion.correctAnswer]}. `;
    }
    
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex < this.assessmentQuestions.length) {
      return response + this.getNextAssessmentQuestion();
    } else {
      // Değerlendirme tamamlandı, seviyeyi belirle
      this.determineUserLevel();
      return `${response}Değerlendirme tamamlandı! ${this.correctAnswers} doğru cevap verdiniz. Seviyeniz: ${this.getLevelInTurkish()}.`;
    }
  }

  // Kullanıcı seviyesini belirleme
  determineUserLevel() {
    if (this.correctAnswers <= 1) {
      this.userLevel = 'beginner';
    } else if (this.correctAnswers <= 3) {
      this.userLevel = 'intermediate';
    } else {
      this.userLevel = 'advanced';
    }
    
    // Değerlendirme sonrası değerleri sıfırla
    this.currentQuestionIndex = 0;
    this.correctAnswers = 0;
  }

  // Seviyeyi Türkçe olarak döndürme
  getLevelInTurkish() {
    switch (this.userLevel) {
      case 'beginner':
        return 'Başlangıç';
      case 'intermediate':
        return 'Orta';
      case 'advanced':
        return 'İleri';
      default:
        return 'Belirsiz';
    }
  }

  // Öğrenme sorusu alma
  getNextLearningQuestion() {
    if (!this.userLevel) {
      return "Önce seviyenizi belirlememiz gerekiyor.";
    }
    
    if (this.currentQuestionIndex < this.questions[this.userLevel].length) {
      const question = this.questions[this.userLevel][this.currentQuestionIndex];
      let response = `Soru ${this.currentQuestionIndex + 1}/${this.questions[this.userLevel].length}: ${question.question}\n`;
      
      question.options.forEach((option, index) => {
        response += `${index}: ${option}\n`;
      });
      
      return response;
    } else {
      // Tüm soruları tamamladık, tekrar başlat
      this.currentQuestionIndex = 0;
      const question = this.questions[this.userLevel][this.currentQuestionIndex];
      let response = `Tebrikler! Bir soru setini tamamladınız. Yeni bir set başlıyor.\n\nSoru ${this.currentQuestionIndex + 1}/${this.questions[this.userLevel].length}: ${question.question}\n`;
      
      question.options.forEach((option, index) => {
        response += `${index}: ${option}\n`;
      });
      
      return response;
    }
  }

  // Öğrenme cevabını işleme
  processLearningAnswer(answerIndex) {
    const currentQuestion = this.questions[this.userLevel][this.currentQuestionIndex];
    let response = "";
    
    if (answerIndex === currentQuestion.correctAnswer) {
      response = "Doğru cevap! ";
      this.correctAnswers++;
      this.tokens++; // Her doğru cevap için 1 token
      
      // Her 10 soruda bir ekstra 10 token
      if (this.correctAnswers % 10 === 0) {
        this.tokens += 10;
        response += "Tebrikler! 10 soru doğru cevapladınız ve ekstra 10 ET token kazandınız! ";
      }
      
      // Token bakiyesini kaydet
      this.saveTokensToStorage();
    } else {
      response = `Yanlış cevap. Doğru cevap: ${currentQuestion.options[currentQuestion.correctAnswer]}. `;
    }
    
    this.currentQuestionIndex++;
    
    return response + this.getNextLearningQuestion();
  }

  // Token bakiyesini alma
  getTokenBalance() {
    return this.tokens;
  }

  // Kullanıcı seviyesini alma
  getUserLevel() {
    return this.userLevel;
  }

  // Kullanıcı adını alma
  getUserName() {
    return this.userName;
  }

  // Mevcut durumu alma
  getCurrentStep() {
    return this.currentStep;
  }
  
  // Token bakiyesini LocalStorage'a kaydet
  saveTokensToStorage() {
    setLocalStorage('elizaTokens', this.tokens.toString());
  }
  
  // Token bakiyesini LocalStorage'dan yükle
  loadTokensFromStorage() {
    const storedTokens = getLocalStorage('elizaTokens');
    if (storedTokens) {
      this.tokens = parseInt(storedTokens, 10);
    }
  }
}

export default new ElizaService(); 