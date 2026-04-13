import { useState, useEffect } from 'react';
import { Send, ArrowLeft, X, ChevronRight } from 'lucide-react';
import { MENTORS } from './mentors';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_live_51TLmIhAis1rAntIhLOPu4DNmy2tt6pCBlOozaibuvrdiCodK6x0eVkX8fXI2NGsON5bLbfk373E4D0BbzJNDiQbY00o77tpXmD');
const MENTOR_IMAGES = {
  carnegie: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ3l2LJg1CQ4-UtyhJ59CArSB0ZfYEnk0nig&s',
  jobs: 'https://goinswriter.com/wp-content/uploads/2011/10/steve-jobs.jpg',
  marcus: 'https://img.freepik.com/premium-photo/portrait-stoic-marcus-aurelius-black-white-film-grain-highly-detailed-masterpiece_1097265-29435.jpg?w=360',
  napoleon: 'https://cdn.britannica.com/28/247228-138-D7EB7659/how-did-Napoleon-become-a-legend.jpg?w=800&h=450&c=crop',
  seneca: 'https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/3/5/1425578092907/Seneca-009.jpg?width=700&quality=85&auto=format&fit=max&s=b3c3a72c9309cf0f716cb835e9c50eb2',
  rockefeller: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk-WsA34oY-ji2shDxo9ri3C73dftQNa0W3w&s',
  nietzsche: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Nietzsche187c.jpg/250px-Nietzsche187c.jpg'
};

const MENTOR_INFO = {
  carnegie: {
    knownFor: 'From telegram boy to richest man in America',
    bestWith: 'Built a steel empire from nothing. Mastered vertical integration, pricing power, and strategic partnerships. If you want to know how to turn pennies into billions - and keep it - he wrote the playbook.'
  },
  jobs: {
    knownFor: 'Fired from Apple. Came back. Changed everything.',
    bestWith: 'The man who made "insanely great" a business strategy. Product design, market creation, and why saying NO is more important than saying yes. If you need to know whether your idea is revolutionary or derivative, ask him.'
  },
  marcus: {
    knownFor: 'Led Rome while writing the ultimate survival guide',
    bestWith: 'Emperor and philosopher. Fought wars, managed crises, never lost his mind. Stoic principles for leadership under pressure, self-mastery when everything\'s burning, and finding peace when you have none.'
  },
  napoleon: {
    knownFor: 'Conquered Europe by 30. Lost it by 45.',
    bestWith: 'Military genius who rewrote the rules of strategy. Speed, positioning, and seizing initiative. If you need to know when to attack, when to retreat, and how to win when outnumbered, he\'s run the scenario.'
  },
  seneca: {
    knownFor: 'Advised emperors. Survived Nero. Barely.',
    bestWith: 'The philosopher who had everything and lost it twice. Time management, dealing with adversity, and living deliberately when life doesn\'t cooperate. If you\'re wasting your days, he\'ll tell you exactly how.'
  },
  rockefeller: {
    knownFor: 'First billionaire. Built the oil monopoly.',
    bestWith: 'The man who controlled 90% of American oil through ruthless efficiency and long-term thinking. Competitive moats, systematic dominance, and why patience beats aggression. If you want to own your market, study him.'
  },
  nietzsche: {
    knownFor: 'Declared God dead. Championed the Übermensch.',
    bestWith: 'The philosopher who breaks you down to rebuild you stronger. Will to power, self-overcoming, and why comfort is your enemy. If you\'re stuck being mediocre, he\'ll make you uncomfortable enough to change.'
  }
};

const THEMES = {
  dark: {
    bg: 'radial-gradient(ellipse at top, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)',
    bgSolid: '#0a0a0a',
    text: '#fff',
    textSecondary: '#ccc',
    textTertiary: '#888',
    textMuted: '#666',
    accent: '#d4af37',
    accentLight: '#f8e5a0',
    card: 'rgba(20, 20, 20, 0.6)',
    cardBorder: 'rgba(212, 175, 55, 0.1)',
    input: '#1a1a1a',
    inputBorder: '#333',
    orb1: 'rgba(212, 175, 55, 0.1)',
    orb2: 'rgba(212, 175, 55, 0.08)',
    noise: 0.03
  },
  light: {
    bg: 'radial-gradient(ellipse at top, #ffffff 0%, #f5f5f5 50%, #eeeeee 100%)',
    bgSolid: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#333',
    textTertiary: '#666',
    textMuted: '#999',
    accent: '#c49a3a',
    accentLight: '#d4af37',
    card: 'rgba(255, 255, 255, 0.8)',
    cardBorder: 'rgba(196, 154, 58, 0.2)',
    input: '#f5f5f5',
    inputBorder: '#ddd',
    orb1: 'rgba(196, 154, 58, 0.08)',
    orb2: 'rgba(196, 154, 58, 0.06)',
    noise: 0.015
  }
};

function App() {
  const [step, setStep] = useState('hero');
  const [theme, setTheme] = useState('dark');
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [userName, setUserName] = useState('');
  const [userGoal, setUserGoal] = useState('');
  const [mentorType, setMentorType] = useState('');
  const [trialQuestion, setTrialQuestion] = useState('');
  const [trialResponse, setTrialResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [questionStep, setQuestionStep] = useState(1);
  const [answers, setAnswers] = useState({
    name: '',
    biggestChallenge: '',
    tryingToAchieve: '',
    stuckOn: '',
    failedAt: ''
  });

  // Hero Screen
  if (step === 'hero') {
    const t = THEMES[theme];
    
    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{
          minHeight: '100vh',
          background: t.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${t.orb1} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: 'float 6s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, ${t.orb2} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'float 8s ease-in-out infinite reverse'
          }} />

          <div style={{
            position: 'relative',
            zIndex: 2,
            animation: 'fadeIn 1s ease-out'
          }}>
            <h1 className="gradient-text" style={{
              fontSize: '56px',
              fontWeight: '500',
              margin: '0 0 20px 0',
              letterSpacing: '3px',
              fontFamily: "'Cormorant Garamond', serif",
              textShadow: `0 0 40px ${t.orb1}`
            }}>
              Mentor
            </h1>
            <p style={{
              fontSize: '18px',
              color: t.textTertiary,
              maxWidth: '500px',
              margin: '0 auto 60px',
              lineHeight: '1.6',
              fontWeight: '300',
              opacity: 0,
              animation: 'fadeIn 1s ease-out 0.3s forwards'
            }}>
              History's greatest minds. On demand.
            </p>
            <button
              className="btn-primary"
              onClick={() => setStep('sales')}
              style={{
                background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 50%, ${t.accent} 100%)`,
                backgroundSize: '200% 200%',
                color: theme === 'dark' ? '#000' : '#fff',
                border: 'none',
                borderRadius: '30px',
                padding: '18px 56px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: theme === 'dark'
                  ? '0 8px 24px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  : '0 8px 24px rgba(196, 154, 58, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                opacity: 0,
                animation: 'fadeIn 1s ease-out 0.6s forwards, shimmer 3s linear infinite'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </>
    );
  }

  // Sales Page
  if (step === 'sales') {
    const t = THEMES[theme];
    
    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{
          minHeight: '100vh',
          background: t.bg,
          padding: '40px 20px 60px',
          overflow: 'auto',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontSize: '28px',
              color: t.accent,
              marginBottom: '40px',
              textAlign: 'center',
              fontWeight: '400',
              fontFamily: "'Cormorant Garamond', serif",
              animation: 'fadeIn 0.8s ease-out'
            }}>
              You know you're capable of more. But you're figuring it out alone.
            </h2>

            <div style={{ marginBottom: '32px', animation: 'slideUp 0.6s ease-out' }}>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '12px' }}>
                You're ambitious. You want to build something. Achieve something. Become someone.
              </p>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '12px' }}>
                But the path isn't clear. Should you start that business? Ask for the raise? Quit and bet on yourself?
              </p>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '24px' }}>
                You're making life-changing decisions with YouTube videos and Reddit threads.
              </p>
              <button
                className="btn-primary"
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                style={{
                  background: theme === 'dark'
                    ? 'linear-gradient(145deg, #1a1a1a 0%, #141414 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                  color: t.accent,
                  border: `1px solid ${t.cardBorder}`,
                  borderRadius: '30px',
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  boxShadow: theme === 'dark'
                    ? '0 4px 16px rgba(0, 0, 0, 0.3)'
                    : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                This sounds familiar
              </button>
            </div>

            <div style={{ marginBottom: '32px', animation: 'slideUp 0.6s ease-out 0.2s backwards' }}>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '12px' }}>
                Meanwhile, people who aren't smarter than you are winning.
              </p>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '12px' }}>
                They have mentors. People who've been there. Who know what works and what's a waste of time.
              </p>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '12px' }}>
                You? You're Googling it. Trial and error. Learning the hard way.
              </p>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '24px' }}>
                The gap isn't talent. It's guidance.
              </p>
              <button
                className="btn-primary"
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                style={{
                  background: theme === 'dark'
                    ? 'linear-gradient(145deg, #1a1a1a 0%, #141414 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                  color: t.accent,
                  border: `1px solid ${t.cardBorder}`,
                  borderRadius: '30px',
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  boxShadow: theme === 'dark'
                    ? '0 4px 16px rgba(0, 0, 0, 0.3)'
                    : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Show me the solution
              </button>
            </div>

            <div style={{ marginBottom: '32px', animation: 'slideUp 0.6s ease-out 0.4s backwards' }}>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '12px' }}>
                What if you could ask someone who's already done what you're trying to do?
              </p>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '12px' }}>
                Not some guru selling courses. Not ChatGPT giving you safe, generic advice.
              </p>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '12px' }}>
                Real people who built real things. Who failed, learned, and won.
              </p>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '12px' }}>
                Ask Steve Jobs if your idea is worth pursuing. Get Carnegie's take on pricing your work. Napoleon on handling competition. Marcus Aurelius when the pressure feels like too much.
              </p>
              <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '24px' }}>
                Not theory. Real frameworks from people who actually did it.
              </p>
              <button
                className="btn-primary"
                onClick={() => setStep('examples')}
                style={{
                  background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 50%, ${t.accent} 100%)`,
                  backgroundSize: '200% 200%',
                  color: theme === 'dark' ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '16px 32px',
                  fontSize: '17px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  boxShadow: theme === 'dark'
                    ? '0 8px 24px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 8px 24px rgba(196, 154, 58, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                  animation: 'shimmer 3s linear infinite',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                See how it works →
              </button>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, ${t.orb2} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'float 8s ease-in-out infinite',
            pointerEvents: 'none'
          }} />
        </div>
      </>
    );
  }

  // Examples Screen
  if (step === 'examples') {
    const t = THEMES[theme];
    
    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{
          minHeight: '100vh',
          background: t.bg,
          padding: '40px 20px 60px',
          overflow: 'auto'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '24px',
              color: t.accent,
              marginBottom: '32px',
              textAlign: 'center',
              fontWeight: '400'
            }}>
              Here's how it works:
            </h2>

            <div className="glass-card" style={{
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              animation: 'slideUp 0.6s ease-out',
              background: t.card,
              border: `1px solid ${t.cardBorder}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img 
                  src={MENTOR_IMAGES.jobs}
                  alt="Steve Jobs"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%)',
                    border: `2px solid ${t.accent}`
                  }}
                />
                <div>
                  <p style={{ fontSize: '14px', color: t.accent, margin: 0, fontWeight: '600' }}>
                    Steve Jobs
                  </p>
                  <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>
                    Building & Creating
                  </p>
                </div>
              </div>
              <div style={{
                background: theme === 'dark' ? '#0a0a0a' : '#f0f0f0',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '12px'
              }}>
                <p style={{ fontSize: '14px', color: t.text, margin: 0, lineHeight: '1.5' }}>
                  <strong>You:</strong> "I have an idea for a side project but I'm scared no one will care. How do I know if it's worth building?"
                </p>
              </div>
              <div style={{
                background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                border: `1px solid ${t.inputBorder}`,
                borderRadius: '12px',
                padding: '14px'
              }}>
                <p style={{ fontSize: '14px', color: t.textSecondary, margin: 0, lineHeight: '1.6' }}>
                  <strong>Jobs:</strong> "You don't know. That's the point. Build it anyway. Not because you're sure it'll work—because you can't stop thinking about it. The worst case? You learn something. Best case? You make something people love. Stop asking for permission."
                </p>
              </div>
            </div>

            <div className="glass-card" style={{
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              animation: 'slideUp 0.6s ease-out 0.2s backwards',
              background: t.card,
              border: `1px solid ${t.cardBorder}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img 
                  src={MENTOR_IMAGES.marcus}
                  alt="Marcus Aurelius"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%)',
                    border: `2px solid ${t.accent}`
                  }}
                />
                <div>
                  <p style={{ fontSize: '14px', color: t.accent, margin: 0, fontWeight: '600' }}>
                    Marcus Aurelius
                  </p>
                  <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>
                    Mindset & Resilience
                  </p>
                </div>
              </div>
              <div style={{
                background: theme === 'dark' ? '#0a0a0a' : '#f0f0f0',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '12px'
              }}>
                <p style={{ fontSize: '14px', color: t.text, margin: 0, lineHeight: '1.5' }}>
                  <strong>You:</strong> "I feel like I'm behind everyone else my age. They're further ahead and I'm just getting started. How do I deal with this?"
                </p>
              </div>
              <div style={{
                background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                border: `1px solid ${t.inputBorder}`,
                borderRadius: '12px',
                padding: '14px'
              }}>
                <p style={{ fontSize: '14px', color: t.textSecondary, margin: 0, lineHeight: '1.6' }}>
                  <strong>Marcus:</strong> "You're comparing your chapter 1 to someone else's chapter 20. Stop. The only race is against yesterday's version of yourself. Focus there. Everything else is distraction posing as wisdom."
                </p>
              </div>
            </div>

            <div className="glass-card" style={{
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              animation: 'slideUp 0.6s ease-out 0.4s backwards',
              background: t.card,
              border: `1px solid ${t.cardBorder}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img 
                  src={MENTOR_IMAGES.carnegie}
                  alt="Andrew Carnegie"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%)',
                    border: `2px solid ${t.accent}`
                  }}
                />
                <div>
                  <p style={{ fontSize: '14px', color: t.accent, margin: 0, fontWeight: '600' }}>
                    Andrew Carnegie
                  </p>
                  <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>
                    Money & Career
                  </p>
                </div>
              </div>
              <div style={{
                background: theme === 'dark' ? '#0a0a0a' : '#f0f0f0',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '12px'
              }}>
                <p style={{ fontSize: '14px', color: t.text, margin: 0, lineHeight: '1.5' }}>
                  <strong>You:</strong> "I'm doing freelance work but charging way less than I should because I'm scared clients will say no. How do I raise my rates?"
                </p>
              </div>
              <div style={{
                background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                border: `1px solid ${t.inputBorder}`,
                borderRadius: '12px',
                padding: '14px'
              }}>
                <p style={{ fontSize: '14px', color: t.textSecondary, margin: 0, lineHeight: '1.6' }}>
                  <strong>Carnegie:</strong> "You're not charging less because you're generous. You're charging less because you're scared. New clients get the new rate. Existing clients get a choice: new rate or we part ways professionally. The ones who stay value you. The ones who leave were never going to pay you what you're worth anyway."
                </p>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => setStep('questions')}
              style={{
                background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 50%, ${t.accent} 100%)`,
                backgroundSize: '200% 200%',
                color: theme === 'dark' ? '#000' : '#fff',
                border: 'none',
                borderRadius: '30px',
                padding: '16px 32px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                boxShadow: theme === 'dark'
                  ? '0 8px 24px rgba(212, 175, 55, 0.4)'
                  : '0 8px 24px rgba(196, 154, 58, 0.3)',
                animation: 'shimmer 3s linear infinite'
              }}
            >
              I need this →
            </button>
          </div>
        </div>
      </>
    );
  }

  // Questions Screen
  if (step === 'questions') {
    const t = THEMES[theme];

    const questions = [
      {
        id: 1,
        label: "First, what's your name?",
        placeholder: "Your name",
        key: 'name',
        type: 'short'
      },
      {
        id: 2,
        label: "What's your biggest challenge right now?",
        placeholder: "E.g., I'm stuck in a job I hate but scared to quit...",
        key: 'biggestChallenge',
        type: 'long'
      },
      {
        id: 3,
        label: "What are you actually trying to achieve?",
        placeholder: "E.g., Build a business that lets me quit my 9-5, get promoted, develop unshakeable discipline...",
        key: 'tryingToAchieve',
        type: 'long'
      },
      {
        id: 4,
        label: "What's keeping you stuck?",
        placeholder: "E.g., I don't know where to start, I'm afraid of failing, I lack the confidence...",
        key: 'stuckOn',
        type: 'long'
      },
      {
        id: 5,
        label: "What have you already tried that didn't work?",
        placeholder: "E.g., Watched YouTube videos, asked ChatGPT, read books but nothing stuck...",
        key: 'failedAt',
        type: 'long'
      }
    ];

    const currentQuestion = questions[questionStep - 1];
    const currentAnswer = answers[currentQuestion.key];

    const handleNext = () => {
      if (questionStep === 5) {
        setUserName(answers.name);
        setUserGoal(answers.tryingToAchieve);
        setStep('mentorSelect');
      } else {
        setQuestionStep(questionStep + 1);
      }
    };

    const handleBack = () => {
      if (questionStep > 1) {
        setQuestionStep(questionStep - 1);
      }
    };

    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{
          minHeight: '100vh',
          background: t.bg,
          padding: '40px 20px 60px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '40px',
              justifyContent: 'center'
            }}>
              {[1, 2, 3, 4, 5].map(step => (
                <div
                  key={step}
                  style={{
                    width: '40px',
                    height: '4px',
                    background: step <= questionStep ? t.accent : t.inputBorder,
                    borderRadius: '2px',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>

            <h2 style={{
              fontSize: '24px',
              color: t.accent,
              marginBottom: '12px',
              textAlign: 'center',
              fontWeight: '400'
            }}>
              {questionStep === 1 ? 'Let\'s personalize this for you.' : `Question ${questionStep} of 5`}
            </h2>

            <p style={{
              fontSize: '16px',
              color: t.textTertiary,
              marginBottom: '32px',
              textAlign: 'center',
              lineHeight: '1.6'
            }}>
              {currentQuestion.label}
            </p>

            {currentQuestion.type === 'short' ? (
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion.key]: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && currentAnswer.trim()) {
                    handleNext();
                  }
                }}
                placeholder={currentQuestion.placeholder}
                autoFocus
                style={{
                  width: '100%',
                  background: t.input,
                  border: `1px solid ${t.inputBorder}`,
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '16px',
                  color: t.text,
                  outline: 'none',
                  marginBottom: '24px'
                }}
              />
            ) : (
              <textarea
                value={currentAnswer}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion.key]: e.target.value })}
                placeholder={currentQuestion.placeholder}
                rows={5}
                autoFocus
                style={{
                  width: '100%',
                  background: t.input,
                  border: `1px solid ${t.inputBorder}`,
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '16px',
                  color: t.text,
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                  marginBottom: '24px',
                  lineHeight: '1.6'
                }}
              />
            )}

            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              {questionStep > 1 && (
                <button
                  onClick={handleBack}
                  style={{
                    flex: 1,
                    background: t.input,
                    color: t.textTertiary,
                    border: `1px solid ${t.inputBorder}`,
                    borderRadius: '30px',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!currentAnswer.trim()}
                style={{
                  flex: questionStep > 1 ? 1 : 'auto',
                  width: questionStep === 1 ? '100%' : 'auto',
                  background: currentAnswer.trim()
                    ? `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`
                    : t.inputBorder,
                  color: currentAnswer.trim() ? (theme === 'dark' ? '#000' : '#fff') : t.textMuted,
                  border: 'none',
                  borderRadius: '30px',
                  padding: '16px',
                  fontSize: '17px',
                  fontWeight: '600',
                  cursor: currentAnswer.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: currentAnswer.trim() ? (theme === 'dark' ? '0 4px 16px rgba(212, 175, 55, 0.3)' : '0 4px 16px rgba(196, 154, 58, 0.3)') : 'none'
                }}
              >
                {questionStep === 5 ? 'Continue →' : 'Next'}
              </button>
            </div>

            {currentQuestion.type === 'long' && (
              <p style={{
                fontSize: '13px',
                color: t.textMuted,
                textAlign: 'center',
                marginTop: '16px',
                lineHeight: '1.5'
              }}>
                The more specific you are, the better we can help you.
              </p>
            )}
          </div>
        </div>
      </>
    );
  }

  // Mentor Type Selection
  if (step === 'mentorSelect') {
    const t = THEMES[theme];
    
    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{
          minHeight: '100vh',
          background: t.bg,
          padding: '40px 20px 60px',
          overflow: 'auto'
        }}>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '24px',
              color: t.accent,
              marginBottom: '12px',
              textAlign: 'center',
              fontWeight: '400'
            }}>
              Perfect, {userName}.
            </h2>
            <p style={{
              fontSize: '16px',
              color: t.textTertiary,
              marginBottom: '32px',
              textAlign: 'center',
              lineHeight: '1.6'
            }}>
              Which type of mentor would help you most right now?
            </p>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
              {[
                { 
                  type: 'business', 
                  title: 'Business Mentor',
                  desc: 'Strategy, pricing, growth, competition',
                  mentors: 'Carnegie, Jobs, Rockefeller'
                },
                { 
                  type: 'mindset', 
                  title: 'Mindset Mentor',
                  desc: 'Discipline, resilience, self-mastery',
                  mentors: 'Marcus Aurelius, Seneca, Nietzsche'
                },
                { 
                  type: 'leadership', 
                  title: 'Leadership Mentor',
                  desc: 'Decision-making, execution, vision',
                  mentors: 'Napoleon, Jobs, Marcus Aurelius'
                }
              ].map(option => (
                <div
                  key={option.type}
                  onClick={() => {
                    setMentorType(option.type);
                    setStep('trial');
                  }}
                  style={{
                    background: t.card,
                    border: `1px solid ${t.cardBorder}`,
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  <h3 style={{
                    fontSize: '18px',
                    color: t.text,
                    margin: '0 0 8px 0',
                    fontWeight: '500'
                  }}>
                    {option.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: t.textTertiary,
                    margin: '0 0 8px 0',
                    lineHeight: '1.5'
                  }}>
                    {option.desc}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: t.accent,
                    margin: 0
                  }}>
                    {option.mentors}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Trial Question - Email Capture Version
if (step === 'trial') {
  const t = THEMES[theme];
  
  return (
    <>
      <GlobalStyles />
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <div className="noise" style={{ opacity: t.noise }} />
      <div style={{
        minHeight: '100vh',
        background: t.bg,
        padding: '40px 20px 60px',
        overflow: 'auto',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '24px',
            color: t.accent,
            marginBottom: '12px',
            textAlign: 'center',
            fontWeight: '400'
          }}>
            Try it right now.
          </h2>
          <p style={{
            fontSize: '16px',
            color: t.textTertiary,
            marginBottom: '32px',
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            Ask one question. Be as specific as possible.
          </p>

          <div style={{
            background: t.card,
            border: `1px solid ${t.accent}`,
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{
              fontSize: '13px',
              color: t.accent,
              margin: 0,
              lineHeight: '1.5'
            }}>
              💡 Better question = better answer. Instead of "How do I grow my business?" try "I have 100 customers but revenue is flat. Should I raise prices or add features?"
            </p>
          </div>

          {/* Question Input - Always Visible */}
          <div style={{
            background: t.card,
            border: `1px solid ${t.inputBorder}`,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: t.textTertiary,
              marginBottom: '12px',
              fontWeight: '500'
            }}>
              Your Question:
            </label>
            <textarea
              value={trialQuestion}
              onChange={(e) => setTrialQuestion(e.target.value)}
              placeholder="Type your question here..."
              rows={4}
              style={{
                width: '100%',
                background: t.input,
                border: `1px solid ${t.inputBorder}`,
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '16px',
                color: t.text,
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                marginBottom: trialQuestion.trim() ? '16px' : '0'
              }}
            />

            {/* Email Input - Shows when question is filled */}
            {trialQuestion.trim() && !trialResponse && (
              <div style={{ animation: 'slideUp 0.4s ease-out' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: t.textTertiary,
                  marginBottom: '12px',
                  fontWeight: '500'
                }}>
                  Your Email:
                </label>
                <input
                  type="email"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userName.trim() && trialQuestion.trim()) {
                      // Trigger get answer
                      document.getElementById('get-answer-btn').click();
                    }
                  }}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    background: t.input,
                    border: `1px solid ${t.inputBorder}`,
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '16px',
                    color: t.text,
                    outline: 'none'
                  }}
                />
                <p style={{
                  fontSize: '12px',
                  color: t.textMuted,
                  margin: '8px 0 0 0',
                  lineHeight: '1.5'
                }}>
                  We'll send you the answer. No spam, unsubscribe anytime.
                </p>
              </div>
            )}
          </div>

          {loading && (
            <div style={{
              background: t.input,
              border: `1px solid ${t.inputBorder}`,
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: t.accent,
                  animation: 'bounce 1.4s infinite ease-in-out both'
                }}></div>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: t.accent,
                  animation: 'bounce 1.4s infinite ease-in-out both 0.2s'
                }}></div>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: t.accent,
                  animation: 'bounce 1.4s infinite ease-in-out both 0.4s'
                }}></div>
              </div>
              <p style={{
                fontSize: '14px',
                color: t.textTertiary,
                margin: '12px 0 0 0'
              }}>
                Getting your personalized answer from {mentorType === 'business' ? 'Carnegie' : mentorType === 'mindset' ? 'Marcus Aurelius' : 'Napoleon'}...
              </p>
            </div>
          )}

          {trialResponse && (
            <div style={{
              background: t.input,
              border: `1px solid ${t.inputBorder}`,
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              animation: 'slideUp 0.6s ease-out'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: `1px solid ${t.inputBorder}`
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {mentorType === 'business' ? '💼' : mentorType === 'mindset' ? '🧘' : '⚔️'}
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: t.accent, margin: 0, fontWeight: '600' }}>
                    {mentorType === 'business' ? 'Andrew Carnegie' : mentorType === 'mindset' ? 'Marcus Aurelius' : 'Napoleon Bonaparte'}
                  </p>
                  <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>
                    {mentorType === 'business' ? 'Business Strategy' : mentorType === 'mindset' ? 'Stoic Philosophy' : 'Military Strategy'}
                  </p>
                </div>
              </div>
              <p style={{
                fontSize: '15px',
                color: t.textSecondary,
                margin: 0,
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap'
              }}>
                {trialResponse}
              </p>
            </div>
          )}

          {!trialResponse && (
            <button
              id="get-answer-btn"
              onClick={async () => {
                if (!trialQuestion.trim() || !userName.trim() || loading) return;
                
                setLoading(true);
                
                // Log the captured data
                // Send email to Loops via our API
try {
  await fetch('/api/capture-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userName,
      firstName: answers.name,
      source: 'Trial Question',
      userGroup: mentorType,
      trialQuestion: trialQuestion,
      answers: answers // Send all the qualification answers
    })
  });
  
  console.log('✅ Email captured in Loops:', userName);
} catch (error) {
  console.error('Loops error:', error);
  // Don't break the flow if email capture fails
}
                
                // TODO: Send to your email service here
                // Example:
                // await fetch('https://your-backend.com/api/capture-email', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify({
                //     email: userName,
                //     question: trialQuestion,
                //     mentorType,
                //     answers
                //   })
                // });
                
                let mentorId = 'jobs';
                if (mentorType === 'business') mentorId = 'carnegie';
                if (mentorType === 'mindset') mentorId = 'marcus';
                if (mentorType === 'leadership') mentorId = 'napoleon';
                
                const mentor = MENTORS.find(m => m.id === mentorId);
                
                try {
                  const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      messages: [{ role: 'user', content: trialQuestion }],
                      systemPrompt: mentor.systemPrompt,
                    }),
                  });

                  const data = await response.json();
                  setTrialResponse(data.content);
                } catch (error) {
                  console.error('Error:', error);
                  setTrialResponse('Sorry, something went wrong. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={!trialQuestion.trim() || !userName.trim() || loading}
              style={{
                width: '100%',
                background: (trialQuestion.trim() && userName.trim() && !loading)
                  ? `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`
                  : t.inputBorder,
                color: (trialQuestion.trim() && userName.trim() && !loading) ? (theme === 'dark' ? '#000' : '#fff') : t.textMuted,
                border: 'none',
                borderRadius: '30px',
                padding: '18px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: (trialQuestion.trim() && userName.trim() && !loading) ? 'pointer' : 'not-allowed',
                boxShadow: (trialQuestion.trim() && userName.trim() && !loading)
                  ? (theme === 'dark' ? '0 4px 16px rgba(212, 175, 55, 0.3)' : '0 4px 16px rgba(196, 154, 58, 0.3)') 
                  : 'none'
              }}
            >
              Get My Answer →
            </button>
          )}

          {trialResponse && (
            <button
              onClick={() => setStep('painDig')}
              style={{
                width: '100%',
                background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`,
                color: theme === 'dark' ? '#000' : '#fff',
                border: 'none',
                borderRadius: '30px',
                padding: '18px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: theme === 'dark' ? '0 4px 16px rgba(212, 175, 55, 0.3)' : '0 4px 16px rgba(196, 154, 58, 0.3)'
              }}
            >
              Continue →
            </button>
          )}

          <style>{`
            @keyframes bounce {
              0%, 80%, 100% { transform: scale(0); }
              40% { transform: scale(1); }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}

  // Pain Dig + Solution
  if (step === 'painDig') {
    const t = THEMES[theme];
    
    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{
          minHeight: '100vh',
          background: t.bg,
          padding: '40px 20px 60px',
          overflow: 'auto'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '24px',
              color: t.accent,
              marginBottom: '24px',
              textAlign: 'center',
              fontWeight: '400'
            }}>
              That answer you just got? That's the difference.
            </h2>

            <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '16px' }}>
              You asked: <span style={{ fontStyle: 'italic', color: t.accent }}>"{trialQuestion}"</span>
            </p>
            <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '16px' }}>
              And you got a real answer. Not "10 tips" or "here's what worked for me bro."
            </p>
            <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '32px' }}>
              Actual strategic thinking from someone who's been exactly where you are.
            </p>

            <div style={{
              background: t.card,
              border: `1px solid ${t.cardBorder}`,
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <p style={{ fontSize: '16px', color: t.text, lineHeight: '1.6', marginBottom: '16px' }}>
                <strong>Without Mentor:</strong>
              </p>
              <p style={{ fontSize: '15px', color: t.textTertiary, lineHeight: '1.6', marginBottom: '8px' }}>
                → You scroll Twitter looking for answers
              </p>
              <p style={{ fontSize: '15px', color: t.textTertiary, lineHeight: '1.6', marginBottom: '8px' }}>
                → You watch YouTube videos and take notes
              </p>
              <p style={{ fontSize: '15px', color: t.textTertiary, lineHeight: '1.6', marginBottom: '8px' }}>
                → You ask ChatGPT and get safe, generic responses
              </p>
              <p style={{ fontSize: '15px', color: t.textTertiary, lineHeight: '1.6', marginBottom: '24px' }}>
                → You make the decision anyway. Hope it works out.
              </p>

              <p style={{ fontSize: '16px', color: t.text, lineHeight: '1.6', marginBottom: '16px' }}>
                <strong>With Mentor:</strong>
              </p>
              <p style={{ fontSize: '15px', color: t.accent, lineHeight: '1.6', marginBottom: '8px' }}>
                → You ask someone who's solved your exact problem
              </p>
              <p style={{ fontSize: '15px', color: t.accent, lineHeight: '1.6', marginBottom: '8px' }}>
                → You get direct, battle-tested frameworks
              </p>
              <p style={{ fontSize: '15px', color: t.accent, lineHeight: '1.6', marginBottom: '0' }}>
                → You move forward with clarity and confidence
              </p>
            </div>

            <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '8px', textAlign: 'center' }}>
              This is what ambitious people have been paying for.
            </p>
            <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '32px', textAlign: 'center' }}>
              Now you can get it for <strong style={{ color: t.accent }}>less than a coffee per day</strong>.
            </p>

            <button
              onClick={() => setStep('paywall')}
              style={{
                width: '100%',
                background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`,
                color: theme === 'dark' ? '#000' : '#fff',
                border: 'none',
                borderRadius: '30px',
                padding: '18px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: theme === 'dark' ? '0 4px 16px rgba(212, 175, 55, 0.4)' : '0 4px 16px rgba(196, 154, 58, 0.4)'
              }}
            >
              Show me pricing →
            </button>
          </div>
        </div>
      </>
    );
  }

  // Paywall
if (step === 'paywall') {
  const t = THEMES[theme];
  
  const plans = {
    weekly: { priceId: 'price_1TLmQvAis1rAntIh0KlXXEeY', price: '£7', period: '/week', label: 'Try it out' },
    monthly: { priceId: 'price_1TLmUiAis1rAntIhKgDjWR8Q', price: '£19', period: '/month', label: 'Best value', savings: 'Save £9/month vs weekly' },
    yearly: { priceId: 'price_1TLmVcAis1rAntIhA2ug264E', price: '£297', period: '/year', label: 'One-time payment', savings: 'Never pay again' }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: plans[selectedPlan].priceId,
          email: userName
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe error:', error);
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  
  return (
    <>
      <GlobalStyles />
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <div className="noise" style={{ opacity: t.noise }} />
      <div style={{
        minHeight: '100vh',
        background: t.bg,
        padding: '40px 20px 60px',
        overflow: 'auto'
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            color: t.accent,
            marginBottom: '12px',
            textAlign: 'center',
            fontWeight: '400',
            fontFamily: "'Cormorant Garamond', serif"
          }}>
            Get unlimited access.
          </h2>
          <p style={{
            fontSize: '15px',
            color: t.textTertiary,
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Choose your plan:
          </p>

          <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
            {/* Weekly */}
            <div 
              onClick={() => setSelectedPlan('weekly')}
              style={{
                background: selectedPlan === 'weekly' ? (theme === 'dark' ? '#0f0f0f' : '#ffffff') : t.card,
                border: selectedPlan === 'weekly' ? `2px solid ${t.accent}` : `1px solid ${t.cardBorder}`,
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', color: t.text, margin: '0 0 4px 0', fontWeight: '500' }}>
                    Weekly
                  </h3>
                  <p style={{ fontSize: '13px', color: t.textMuted, margin: 0 }}>
                    {plans.weekly.label}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '28px', color: t.text, margin: '0', fontWeight: '600' }}>
                    {plans.weekly.price}
                  </p>
                  <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>
                    {plans.weekly.period}
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly - MOST POPULAR */}
            <div 
              onClick={() => setSelectedPlan('monthly')}
              style={{
                background: selectedPlan === 'monthly' ? (theme === 'dark' ? '#0f0f0f' : '#ffffff') : t.card,
                border: selectedPlan === 'monthly' ? `2px solid ${t.accent}` : `1px solid ${t.cardBorder}`,
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s'
              }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: t.accent,
                color: theme === 'dark' ? '#000' : '#fff',
                padding: '4px 16px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.5px'
              }}>
                MOST POPULAR
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', color: t.text, margin: '0 0 4px 0', fontWeight: '500' }}>
                    Monthly
                  </h3>
                  <p style={{ fontSize: '13px', color: t.accent, margin: 0 }}>
                    {plans.monthly.label}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '28px', color: t.text, margin: '0', fontWeight: '600' }}>
                    {plans.monthly.price}
                  </p>
                  <p style={{ fontSize: '12px', color: t.textTertiary, margin: 0 }}>
                    {plans.monthly.period}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: t.textMuted, margin: '12px 0 0 0' }}>
                {plans.monthly.savings}
              </p>
            </div>

            {/* Yearly */}
            <div 
              onClick={() => setSelectedPlan('yearly')}
              style={{
                background: selectedPlan === 'yearly' ? (theme === 'dark' ? '#0f0f0f' : '#ffffff') : t.card,
                border: selectedPlan === 'yearly' ? `2px solid ${t.accent}` : `1px solid ${t.cardBorder}`,
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', color: t.text, margin: '0 0 4px 0', fontWeight: '500' }}>
                    Yearly
                  </h3>
                  <p style={{ fontSize: '13px', color: t.textMuted, margin: 0 }}>
                    {plans.yearly.label}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '28px', color: t.text, margin: '0', fontWeight: '600' }}>
                    {plans.yearly.price}
                  </p>
                  <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>
                    {plans.yearly.period}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: t.textMuted, margin: '12px 0 0 0' }}>
                {plans.yearly.savings}
              </p>
            </div>
          </div>

          <div style={{
            background: t.card,
            border: `1px solid ${t.cardBorder}`,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <p style={{ fontSize: '14px', color: t.textSecondary, margin: '0 0 12px 0', fontWeight: '500' }}>
              What you get:
            </p>
            <p style={{ fontSize: '13px', color: t.textTertiary, margin: '0 0 8px 0', lineHeight: '1.6' }}>
              ✓ Unlimited questions to all 7 mentors
            </p>
            <p style={{ fontSize: '13px', color: t.textTertiary, margin: '0 0 8px 0', lineHeight: '1.6' }}>
              ✓ Save all your conversations
            </p>
            <p style={{ fontSize: '13px', color: t.textTertiary, margin: '0', lineHeight: '1.6' }}>
              ✓ Cancel anytime
            </p>
          </div>

          <button
            onClick={handleCheckout}
            className="btn-primary"
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`,
              color: theme === 'dark' ? '#000' : '#fff',
              border: 'none',
              borderRadius: '30px',
              padding: '18px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              marginBottom: '16px',
              boxShadow: theme === 'dark' ? '0 4px 16px rgba(212, 175, 55, 0.4)' : '0 4px 16px rgba(196, 154, 58, 0.4)'
            }}
          >
            Start Now →
          </button>

          <p style={{
            fontSize: '12px',
            color: t.textMuted,
            textAlign: 'center',
            margin: 0,
            lineHeight: '1.5'
          }}>
            7-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </>
  );
}

  return <div>Loading...</div>;
}

// Theme Toggle Component
const ThemeToggle = ({ theme, setTheme }) => (
  <button
    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: theme === 'dark' 
        ? 'linear-gradient(145deg, #1a1a1a 0%, #141414 100%)'
        : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
      border: theme === 'dark' 
        ? '1px solid rgba(212, 175, 55, 0.3)'
        : '1px solid rgba(196, 154, 58, 0.3)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: theme === 'dark'
        ? '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
      zIndex: 1000,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '24px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
    }}
  >
    {theme === 'dark' ? '☀️' : '🌙'}
  </button>
);

// Global Styles Component
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
    
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    
    @keyframes fadeIn {
      from { 
        opacity: 0; 
        transform: translateY(20px);
      }
      to { 
        opacity: 1; 
        transform: translateY(0);
      }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    
    @keyframes bounce {
      0%, 80%, 100% { 
        transform: scale(0); 
      }
      40% { 
        transform: scale(1); 
      }
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #d4af37 0%, #f8e5a0 50%, #d4af37 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }
    
    .glass-card {
      background: rgba(20, 20, 20, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(212, 175, 55, 0.1);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }
    
    .btn-primary {
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .btn-primary::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
    
    .btn-primary:active::before {
      width: 300px;
      height: 300px;
    }
    
    textarea::placeholder,
    input::placeholder {
      color: #666;
      opacity: 1;
    }
    
    .noise {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E");
    }
  `}</style>
);

export default App;