import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, X, ChevronRight } from 'lucide-react';
import { MENTORS } from './mentors';

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
    bg: 'radial-gradient(ellipse at top, #1a1614 0%, #0d0c0a 60%, #0d0c0a 100%)',
    bgSolid: '#0d0c0a',
    text: '#fff',
    textSecondary: '#ccc',
    textTertiary: '#888',
    textMuted: '#555',
    accent: '#c9a84c',
    accentLight: '#e8d08a',
    card: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.06)',
    input: '#141210',
    inputBorder: '#2a2825',
    orb1: 'rgba(201, 168, 76, 0.05)',
    orb2: 'rgba(201, 168, 76, 0.04)',
    noise: 0
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
    cardBorder: 'rgba(201, 168, 76, 0.2)',
    input: '#f5f5f5',
    inputBorder: '#ddd',
    orb1: 'rgba(201, 168, 76, 0.08)',
    orb2: 'rgba(201, 168, 76, 0.06)',
    noise: 0.015
  }
};

const READING_LIST = {
  carnegie: [
    { title: 'The Gospel of Wealth', author: 'Andrew Carnegie', reason: 'I wrote it. Read what I actually believed about money and responsibility.' },
    { title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', reason: 'Master people. Everything else follows.' },
    { title: 'The Autobiography of Benjamin Franklin', author: 'Benjamin Franklin', reason: 'The original self-made man. Study him.' },
    { title: 'Think and Grow Rich', author: 'Napoleon Hill', reason: 'He interviewed me. The principles are sound.' },
    { title: 'The Score Takes Care of Itself', author: 'Bill Walsh', reason: 'Systems beat talent every time. This is why.' },
  ],
  jobs: [
    { title: "Zen Mind, Beginner's Mind", author: 'Shunryu Suzuki', reason: "See everything fresh. Experts are blind to what's obvious." },
    { title: "The Innovator's Dilemma", author: 'Clayton Christensen', reason: "Understand why great companies die. Then don't." },
    { title: 'Autobiography of a Yogi', author: 'Paramahansa Yogananda', reason: "Changed my life at 17. Still the most important book I've read." },
    { title: 'King Lear', author: 'Shakespeare', reason: 'Power, betrayal, vision. Everything about building something great is in here.' },
    { title: 'Only the Paranoid Survive', author: 'Andy Grove', reason: "Stay hungry. Stay paranoid. They're the same thing." },
  ],
  marcus: [
    { title: 'Meditations', author: 'Marcus Aurelius', reason: 'My private notes. Not written for you — which is exactly why you should read them.' },
    { title: 'Letters from a Stoic', author: 'Seneca', reason: 'My contemporary. Sharper than most give him credit for.' },
    { title: 'The Obstacle Is the Way', author: 'Ryan Holiday', reason: 'A modern translation of what we actually meant.' },
    { title: 'Discourses', author: 'Epictetus', reason: 'He was a slave who understood freedom better than any emperor.' },
    { title: "Man's Search for Meaning", author: 'Viktor Frankl', reason: 'Stoicism tested in the worst conditions imaginable. He passed.' },
  ],
  napoleon: [
    { title: 'The Art of War', author: 'Sun Tzu', reason: 'I read it. Then I improved on it.' },
    { title: 'Julius Caesar', author: 'Shakespeare', reason: "Study Caesar's mistakes. I did." },
    { title: 'On War', author: 'Carl von Clausewitz', reason: 'He wrote about me. The principles are correct.' },
    { title: 'The 48 Laws of Power', author: 'Robert Greene', reason: 'Every law is something I either used or had used against me.' },
    { title: 'Genghis Khan and the Making of the Modern World', author: 'Jack Weatherford', reason: 'The greatest conqueror. Understand his system.' },
  ],
  seneca: [
    { title: 'Letters from a Stoic', author: 'Seneca', reason: 'Start here. Everything I believed is in these letters.' },
    { title: 'Meditations', author: 'Marcus Aurelius', reason: 'My student emperor. He listened better than most.' },
    { title: 'The Shortness of Life', author: 'Seneca', reason: 'You are wasting time reading this list instead of living. Go.' },
    { title: 'Essays', author: 'Michel de Montaigne', reason: 'He understood that self-knowledge is the only knowledge worth having.' },
    { title: 'The Death of Ivan Ilyich', author: 'Leo Tolstoy', reason: 'A man who realised too late he had lived wrong. Do not be him.' },
  ],
  rockefeller: [
    { title: 'Random Reminiscences of Men and Events', author: 'John D. Rockefeller', reason: 'My own words. Unfiltered.' },
    { title: 'Titan', author: 'Ron Chernow', reason: 'The most accurate account of how I actually operated.' },
    { title: 'The Outsiders', author: 'William Thorndike', reason: 'Capital allocation is the only skill that truly compounds. This book proves it.' },
    { title: "Poor Charlie's Almanack", author: 'Charlie Munger', reason: 'Mental models built wealth for Buffett. They will for you too.' },
    { title: 'The Richest Man in Babylon', author: 'George S. Clason', reason: 'Simple principles. Almost nobody actually follows them.' },
  ],
  nietzsche: [
    { title: 'Thus Spoke Zarathustra', author: 'Friedrich Nietzsche', reason: 'My masterpiece. You will not understand it the first time. Read it anyway.' },
    { title: 'Beyond Good and Evil', author: 'Friedrich Nietzsche', reason: 'Everything you were taught about morality is a cage. This is the key.' },
    { title: 'The Will to Power', author: 'Friedrich Nietzsche', reason: 'My unfinished work. The most honest thing I ever wrote.' },
    { title: 'Antifragile', author: 'Nassim Taleb', reason: 'He understood what I meant by what does not kill me.' },
    { title: 'The Trial', author: 'Franz Kafka', reason: 'A man destroyed by systems he never questioned. Do not be Josef K.' },
  ],
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
  const [openFaq, setOpenFaq] = useState(null);
  const [userTier, setUserTier] = useState(() => {
    try { return localStorage.getItem('mentor_plan') || 'monthly'; } catch { return 'monthly'; }
  });
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (window.location.pathname === '/success') {
      localStorage.setItem('mentor_access', 'true');
      setStep('success');
    } else if (localStorage.getItem('mentor_access') === 'true') {
      setStep('chat');
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading || !selectedMentor) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt: selectedMentor.systemPrompt,
          email: userName,
          mentorId: selectedMentor.id,
        }),
      });
      if (response.status === 403) {
        const data = await response.json();
        if (data.error === 'limit_reached') {
          setUpgradeMessage("You've used all your messages for this week. Upgrade to continue.");
        } else if (data.error === 'mentor_locked') {
          setUpgradeMessage('This mentor is locked on your current plan. Upgrade to unlock all 7 mentors.');
        }
        setShowUpgrade(true);
        setMessages(prev => prev.slice(0, -1));
        return;
      }
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'My apologies, I seem to be having difficulty connecting. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Success Page
  if (step === 'success') {
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
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px'
        }}>
          <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px auto',
              fontSize: '36px',
              boxShadow: '0 0 40px rgba(201, 168, 76, 0.3)',
              animation: 'fadeIn 0.6s ease-out'
            }}>
              ✓
            </div>
            <h1 style={{ fontSize: '28px', color: t.text, marginBottom: '12px', fontWeight: '700', animation: 'fadeIn 0.6s ease-out 0.2s backwards' }}>
              You're in.
            </h1>
            <p style={{ fontSize: '16px', color: t.textSecondary, marginBottom: '8px', lineHeight: '1.6', animation: 'fadeIn 0.6s ease-out 0.3s backwards' }}>
              Your access is now unlocked.
            </p>
            <p style={{ fontSize: '14px', color: t.textMuted, marginBottom: '48px', lineHeight: '1.6', animation: 'fadeIn 0.6s ease-out 0.4s backwards' }}>
              The greatest minds in history are waiting.
            </p>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setStep('chat');
              }}
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
                boxShadow: '0 4px 16px rgba(201, 168, 76, 0.3)',
                animation: 'fadeIn 0.6s ease-out 0.5s backwards'
              }}
            >
              Meet your mentors →
            </button>
            <div style={{ marginTop: '24px', animation: 'fadeIn 0.6s ease-out 0.7s backwards' }}>
              <p style={{ fontSize: '12px', color: t.textMuted, margin: '0 0 4px 0' }}>
                Add to your home screen for the best experience.
              </p>
              <p style={{ fontSize: '12px', color: t.textMuted, margin: 0, lineHeight: '1.5' }}>
                {/iphone|ipad|ipod/i.test(navigator.userAgent)
                  ? 'Tap the share button below then tap Add to Home Screen.'
                  : 'Tap the menu button then Add to Home Screen.'}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Mentor Grid (post-payment)
  if (step === 'chat' && !selectedMentor) {
    const t = THEMES[theme];
    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <button
          onClick={() => setStep('settings')}
          aria-label="Settings"
          style={{
            position: 'fixed', top: '20px', left: '20px', width: '56px', height: '56px',
            borderRadius: '50%',
            background: theme === 'dark' ? 'linear-gradient(145deg, #1a1a1a 0%, #141414 100%)' : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
            border: '1px solid rgba(201, 168, 76, 0.25)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: theme === 'dark' ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.1)',
            zIndex: 1000, fontSize: '22px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          ⚙️
        </button>
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{
          minHeight: '100vh',
          background: t.bg,
          padding: '40px 20px 60px',
          overflow: 'auto'
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h1 className="gradient-text" style={{
                fontSize: '42px',
                fontWeight: '500',
                margin: '0 0 12px 0',
                letterSpacing: '2px',
                fontFamily: "'Cormorant Garamond', serif"
              }}>
                Mentor
              </h1>
              <p style={{ fontSize: '16px', color: t.textTertiary, margin: 0 }}>
                Choose your mentor. Ask anything.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              {MENTORS.map((mentor, i) => (
                <div
                  key={mentor.id}
                  onClick={() => {
                    setSelectedMentor(mentor);
                    setMessages([]);
                  }}
                  style={{
                    background: t.card,
                    border: `1px solid ${t.cardBorder}`,
                    borderRadius: '16px',
                    padding: '28px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start',
                    animation: `slideUp 0.4s ease-out ${i * 0.05}s backwards`
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = t.card;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img
                    src={MENTOR_IMAGES[mentor.id]}
                    alt={mentor.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      filter: 'grayscale(100%)',
                      border: `2px solid ${t.accent}`,
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '11px', color: t.textMuted, margin: '0 0 4px 0', letterSpacing: '0.5px' }}>
                      {mentor.era}
                    </p>
                    <h3 style={{ fontSize: '20px', color: t.text, margin: '0 0 4px 0', fontWeight: '500', fontFamily: "'Cormorant Garamond', serif" }}>
                      {mentor.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: t.accent, margin: '0 0 10px 0', fontWeight: '400' }}>
                      {MENTOR_INFO[mentor.id]?.knownFor}
                    </p>
                    <p style={{ fontSize: '13px', color: t.textTertiary, margin: 0, lineHeight: '1.6' }}>
                      {MENTOR_INFO[mentor.id]?.bestWith}
                    </p>
                  </div>
                </div>
              ))}
              <div
                onClick={() => setStep('readingListIntro')}
                style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '36px 28px', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', textAlign: 'center', animation: 'slideUp 0.4s ease-out 0.35s backwards' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = t.card; }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px', lineHeight: 1 }}>📚</div>
                <h3 style={{ fontSize: '20px', color: t.text, margin: '0 0 8px 0', fontWeight: '500', fontFamily: "'Cormorant Garamond', serif" }}>Reading List</h3>
                <p style={{ fontSize: '14px', color: t.textTertiary, margin: 0, lineHeight: '1.6' }}>The exact books each mentor says shaped their thinking. 35 books. Zero fluff.</p>
                <span style={{ position: 'absolute', bottom: '20px', right: '24px', fontSize: '16px', color: `rgba(201,168,76,0.5)` }}>→</span>
              </div>
              <div
                onClick={() => setStep('warRoom')}
                style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '36px 28px', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', textAlign: 'center', animation: 'slideUp 0.4s ease-out 0.4s backwards' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = t.card; }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px', lineHeight: 1 }}>⚔️</div>
                <h3 style={{ fontSize: '20px', color: t.text, margin: '0 0 8px 0', fontWeight: '500', fontFamily: "'Cormorant Garamond', serif" }}>The War Room</h3>
                <p style={{ fontSize: '14px', color: t.textTertiary, margin: 0, lineHeight: '1.6' }}>Bring every mentor into one room. One question. Seven answers.</p>
                <span style={{ position: 'absolute', bottom: '20px', right: '24px', fontSize: '16px', color: `rgba(201,168,76,0.5)` }}>→</span>
              </div>
              <div
                onClick={() => setStep('dailyDrop')}
                style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '36px 28px', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', textAlign: 'center', animation: 'slideUp 0.4s ease-out 0.45s backwards' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = t.card; }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px', lineHeight: 1 }}>🔥</div>
                <h3 style={{ fontSize: '20px', color: t.text, margin: '0 0 8px 0', fontWeight: '500', fontFamily: "'Cormorant Garamond', serif" }}>Daily Drop</h3>
                <p style={{ fontSize: '14px', color: t.textTertiary, margin: 0, lineHeight: '1.6' }}>One mentor. One insight. Every day.</p>
                <span style={{ position: 'absolute', bottom: '20px', right: '24px', fontSize: '16px', color: `rgba(201,168,76,0.5)` }}>→</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Reading List Intro Screen
  if (step === 'warRoom') {
    return <WarRoomScreen theme={theme} setTheme={setTheme} setStep={setStep} />;
  }

  if (step === 'dailyDrop') {
    return <DailyDropScreen theme={theme} setTheme={setTheme} setStep={setStep} setSelectedMentor={setSelectedMentor} />;
  }

  if (step === 'readingListIntro') {
    const t = THEMES[theme];
    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <button
              onClick={() => setStep('chat')}
              style={{ background: 'none', border: 'none', color: t.textTertiary, cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', marginBottom: '40px' }}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeIn 0.6s ease-out' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>📚</div>
              <h1 style={{ fontSize: '32px', color: t.text, margin: '0 0 20px 0', fontWeight: '600', fontFamily: "'Cormorant Garamond', serif", lineHeight: '1.2' }}>
                The Books That Built Them
              </h1>
              <p style={{ fontSize: '16px', color: t.textSecondary, lineHeight: '1.7', margin: '0 0 20px 0' }}>
                Every mentor on this app was shaped by what they read. These aren't generic recommendations. These are the specific books each historical figure read, studied, or wrote — explained in their own voice, with the reason it mattered.
              </p>
              <p style={{ fontSize: '16px', color: t.textSecondary, lineHeight: '1.7', margin: 0 }}>
                Stop buying books you never read. Start with the ones that actually changed history.
              </p>
            </div>
            <button
              onClick={() => setStep('readingList')}
              style={{ width: '100%', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`, color: theme === 'dark' ? '#000' : '#fff', border: 'none', borderRadius: '30px', padding: '18px', fontSize: '17px', fontWeight: '600', cursor: 'pointer', boxShadow: theme === 'dark' ? '0 4px 16px rgba(201, 168, 76, 0.3)' : '0 4px 16px rgba(201, 168, 76, 0.25)', animation: 'fadeIn 0.6s ease-out 0.3s backwards' }}
            >
              Show me the books →
            </button>
          </div>
        </div>
      </>
    );
  }

  // Reading List Screen
  if (step === 'readingList') {
    const t = THEMES[theme];
    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{ minHeight: '100vh', background: t.bg, padding: '40px 20px 60px', overflow: 'auto' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
              <button
                onClick={() => setStep('chat')}
                style={{ background: 'none', border: 'none', color: t.textTertiary, cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="gradient-text" style={{ fontSize: '28px', fontWeight: '500', margin: 0, letterSpacing: '2px', fontFamily: "'Cormorant Garamond', serif" }}>
                Reading List
              </h1>
            </div>

            {MENTORS.map((mentor, mi) => (
              <div key={mentor.id} style={{ marginBottom: '40px', animation: `slideUp 0.4s ease-out ${mi * 0.05}s backwards` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <img
                    src={MENTOR_IMAGES[mentor.id]}
                    alt={mentor.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(100%)', border: `2px solid ${t.accent}`, flexShrink: 0 }}
                  />
                  <div>
                    <h2 style={{ fontSize: '17px', color: t.accent, margin: '0 0 2px 0', fontWeight: '600' }}>{mentor.name}</h2>
                    <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>{mentor.era}</p>
                  </div>
                </div>
                <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '16px', overflow: 'hidden' }}>
                  {READING_LIST[mentor.id].map((book, bi) => (
                    <div key={bi} style={{ padding: '16px 20px', borderBottom: bi < READING_LIST[mentor.id].length - 1 ? `1px solid ${t.inputBorder}` : 'none' }}>
                      <p style={{ fontSize: '14px', color: t.textSecondary, margin: '0 0 2px 0', fontWeight: '600' }}>{book.title}</p>
                      <p style={{ fontSize: '12px', color: t.textMuted, margin: '0 0 6px 0' }}>{book.author}</p>
                      <p style={{ fontSize: '13px', color: t.textTertiary, margin: 0, lineHeight: '1.5', fontStyle: 'italic' }}>"{book.reason}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Chat Interface
  if (step === 'chat' && selectedMentor) {
    const t = THEMES[theme];
    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{
          height: '100vh',
          background: t.bg,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${t.cardBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            flexShrink: 0
          }}>
            <button
              onClick={() => { setSelectedMentor(null); setMessages([]); }}
              style={{
                background: 'none',
                border: 'none',
                color: t.textTertiary,
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => setStep('settings')}
              aria-label="Settings"
              style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', fontSize: '18px' }}
            >
              ⚙️
            </button>
            <img
              src={MENTOR_IMAGES[selectedMentor.id]}
              alt={selectedMentor.name}
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
              <h3 style={{ fontSize: '16px', color: t.text, margin: 0, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {selectedMentor.name}
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c9a84c', display: 'inline-block', flexShrink: 0, animation: 'pulse-dot 1.8s ease-in-out infinite' }} />
              </h3>
              <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>
                {selectedMentor.title}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '40px', animation: 'fadeIn 0.6s ease-out' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{selectedMentor.avatar}</div>
                <h3 style={{ fontSize: '20px', color: t.text, marginBottom: '8px', fontWeight: '500' }}>
                  {selectedMentor.name}
                </h3>
                <p style={{ fontSize: '14px', color: t.textTertiary, maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                  {selectedMentor.specialty}
                </p>
                <p style={{ fontSize: '13px', color: t.textMuted, maxWidth: '400px', margin: '16px auto 0', lineHeight: '1.6' }}>
                  Ask me anything. Be specific — the more context you give, the better my advice.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'slideUp 0.3s ease-out'
                }}
              >
                {msg.role === 'assistant' && (
                  <img
                    src={MENTOR_IMAGES[selectedMentor.id]}
                    alt={selectedMentor.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      filter: 'grayscale(100%)',
                      border: `1px solid ${t.accent}`,
                      marginRight: '8px',
                      flexShrink: 0,
                      alignSelf: 'flex-end'
                    }}
                  />
                )}
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user'
                    ? 'rgba(255,255,255,0.08)'
                    : (theme === 'dark' ? '#141210' : '#ffffff'),
                  border: msg.role === 'assistant' ? `1px solid ${t.inputBorder}` : '1px solid rgba(255,255,255,0.1)',
                  color: t.textSecondary,
                  fontSize: '15px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={MENTOR_IMAGES[selectedMentor.id]}
                  alt={selectedMentor.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%)',
                    border: `1px solid ${t.accent}`
                  }}
                />
                <div style={{
                  background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                  border: `1px solid ${t.inputBorder}`,
                  borderRadius: '18px',
                  padding: '12px 16px',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: t.accent,
                      animation: `bounce 1.4s infinite ease-in-out both ${delay}s`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Upgrade Banner */}
          {showUpgrade && (
            <div style={{
              padding: '12px 20px',
              background: theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
              borderTop: `1px solid ${t.cardBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexShrink: 0
            }}>
              <p style={{ fontSize: '13px', color: t.accent, margin: 0, lineHeight: '1.5' }}>{upgradeMessage}</p>
              <button
                onClick={() => { setStep('paywall'); setShowUpgrade(false); }}
                style={{ background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`, color: theme === 'dark' ? '#000' : '#fff', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                Upgrade Plan →
              </button>
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '16px 20px',
            borderTop: `1px solid ${t.cardBorder}`,
            background: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', gap: '12px', maxWidth: '700px', margin: '0 auto' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Ask ${selectedMentor.name} anything...`}
                style={{
                  flex: 1,
                  background: t.input,
                  border: `1px solid ${t.inputBorder}`,
                  borderRadius: '32px',
                  padding: '14px 20px',
                  fontSize: '15px',
                  color: t.text,
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: (input.trim() && !loading)
                    ? `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`
                    : t.inputBorder,
                  border: 'none',
                  cursor: (input.trim() && !loading) ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}
              >
                <Send size={18} color={input.trim() && !loading ? '#000' : '#666'} />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

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
              fontSize: '72px',
              fontWeight: '500',
              margin: '0 0 24px 0',
              letterSpacing: '4px',
              fontFamily: "'Cormorant Garamond', serif",
            }}>
              Mentor
            </h1>
            <p style={{
              fontSize: '20px',
              color: t.textTertiary,
              maxWidth: '480px',
              margin: '0 auto 64px',
              lineHeight: '1.8',
              fontWeight: '300',
              letterSpacing: '0.01em',
              opacity: 0,
              animation: 'fadeIn 1s ease-out 0.3s forwards'
            }}>
              History's greatest minds. Whenever you want from the comfort of your home.
            </p>
            <button
              className="btn-primary"
              onClick={() => setStep('sales')}
              style={{
                background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 50%, ${t.accent} 100%)`,
                backgroundSize: '200% 200%',
                color: '#000',
                border: 'none',
                borderRadius: '30px',
                padding: '16px 48px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '0.03em',
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
              fontSize: '48px',
              color: t.text,
              marginBottom: '56px',
              textAlign: 'center',
              fontWeight: '400',
              fontFamily: "'Cormorant Garamond', serif",
              lineHeight: '1.2',
              animation: 'fadeIn 0.8s ease-out'
            }}>
              You know you're capable of more.<br />But you're figuring it out alone.
            </h2>

            <div style={{ marginBottom: '0', animation: 'slideUp 0.6s ease-out' }}>
              <p style={{ fontSize: '18px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '16px' }}>
                You're ambitious. You want to build something. Achieve something. Become someone.
              </p>
              <p style={{ fontSize: '18px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '16px' }}>
                But the path isn't clear. Should you start that business? Ask for the raise? Quit and bet on yourself?
              </p>
              <p style={{ fontSize: '18px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '0' }}>
                You're making life-changing decisions with YouTube videos and Reddit threads.
              </p>
            </div>

            <div style={{ height: '1px', background: `linear-gradient(to right, transparent, ${t.accent}, transparent)`, opacity: 0.2, margin: '48px 0' }} />

            <div style={{ marginBottom: '0', animation: 'slideUp 0.6s ease-out 0.2s backwards' }}>
              <p style={{ fontSize: '18px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '16px' }}>
                Meanwhile, people who aren't smarter than you are winning.
              </p>
              <p style={{ fontSize: '18px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '16px' }}>
                They have mentors. People who've been there. Who know what works and what's a waste of time.
              </p>
              <p style={{ fontSize: '18px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '16px' }}>
                You? You're Googling it. Trial and error. Learning the hard way.
              </p>
              <p style={{ fontSize: '28px', color: t.text, lineHeight: '1.4', margin: '0', fontFamily: "'Cormorant Garamond', serif", fontWeight: '400' }}>
                The gap isn't talent. It's guidance.
              </p>
            </div>

            <div style={{ height: '1px', background: `linear-gradient(to right, transparent, ${t.accent}, transparent)`, opacity: 0.2, margin: '48px 0' }} />

            <div style={{ marginBottom: '48px', animation: 'slideUp 0.6s ease-out 0.4s backwards' }}>
              <p style={{ fontSize: '18px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '16px' }}>
                What if you could ask someone who's already done what you're trying to do?
              </p>
              <p style={{ fontSize: '18px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '16px' }}>
                Not some guru selling courses. Not ChatGPT giving you safe, generic advice.
              </p>
              <p style={{ fontSize: '18px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '16px' }}>
                Real people who built real things. Who failed, learned, and won.
              </p>
              <p style={{ fontSize: '18px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '16px' }}>
                Ask Steve Jobs if your idea is worth pursuing. Get Carnegie's take on pricing your work. Napoleon on handling competition. Marcus Aurelius when the pressure feels like too much.
              </p>
              <p style={{ fontSize: '18px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '0' }}>
                Not theory. Real frameworks from people who actually did it.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setStep('examples')}
              style={{
                background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 50%, ${t.accent} 100%)`,
                backgroundSize: '200% 200%',
                color: '#000',
                border: 'none',
                borderRadius: '30px',
                padding: '16px 48px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                letterSpacing: '0.03em',
                animation: 'shimmer 3s linear infinite',
              }}
            >
              See how it works →
            </button>
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
        <div style={{ minHeight: '100vh', background: t.bg, padding: '40px 20px 60px', overflow: 'auto' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', color: t.accent, marginBottom: '32px', textAlign: 'center', fontWeight: '400' }}>
              Here's how it works:
            </h2>

            <div className="glass-card" style={{ borderRadius: '16px', padding: '24px', marginBottom: '24px', animation: 'slideUp 0.6s ease-out', background: t.card, border: `1px solid ${t.cardBorder}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src={MENTOR_IMAGES.jobs} alt="Steve Jobs" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(100%)', border: `2px solid ${t.accent}` }} />
                <div>
                  <p style={{ fontSize: '14px', color: t.accent, margin: 0, fontWeight: '600' }}>Steve Jobs</p>
                  <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>Building & Creating</p>
                </div>
              </div>
              <div style={{ background: theme === 'dark' ? '#0a0a0a' : '#f0f0f0', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                <p style={{ fontSize: '14px', color: t.text, margin: 0, lineHeight: '1.5' }}>
                  <strong>You:</strong> "I have an idea for a side project but I'm scared no one will care. How do I know if it's worth building?"
                </p>
              </div>
              <div style={{ background: theme === 'dark' ? '#1a1a1a' : '#ffffff', border: `1px solid ${t.inputBorder}`, borderRadius: '12px', padding: '14px' }}>
                <p style={{ fontSize: '14px', color: t.textSecondary, margin: 0, lineHeight: '1.6' }}>
                  <strong>Jobs:</strong> "You don't know. That's the point. Build it anyway. Not because you're sure it'll work—because you can't stop thinking about it. The worst case? You learn something. Best case? You make something people love. Stop asking for permission."
                </p>
              </div>
            </div>

            <div className="glass-card" style={{ borderRadius: '16px', padding: '24px', marginBottom: '24px', animation: 'slideUp 0.6s ease-out 0.2s backwards', background: t.card, border: `1px solid ${t.cardBorder}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src={MENTOR_IMAGES.marcus} alt="Marcus Aurelius" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(100%)', border: `2px solid ${t.accent}` }} />
                <div>
                  <p style={{ fontSize: '14px', color: t.accent, margin: 0, fontWeight: '600' }}>Marcus Aurelius</p>
                  <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>Mindset & Resilience</p>
                </div>
              </div>
              <div style={{ background: theme === 'dark' ? '#0a0a0a' : '#f0f0f0', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                <p style={{ fontSize: '14px', color: t.text, margin: 0, lineHeight: '1.5' }}>
                  <strong>You:</strong> "I feel like I'm behind everyone else my age. They're further ahead and I'm just getting started. How do I deal with this?"
                </p>
              </div>
              <div style={{ background: theme === 'dark' ? '#1a1a1a' : '#ffffff', border: `1px solid ${t.inputBorder}`, borderRadius: '12px', padding: '14px' }}>
                <p style={{ fontSize: '14px', color: t.textSecondary, margin: 0, lineHeight: '1.6' }}>
                  <strong>Marcus:</strong> "You're comparing your chapter 1 to someone else's chapter 20. Stop. The only race is against yesterday's version of yourself. Focus there. Everything else is distraction posing as wisdom."
                </p>
              </div>
            </div>

            <div className="glass-card" style={{ borderRadius: '16px', padding: '24px', marginBottom: '32px', animation: 'slideUp 0.6s ease-out 0.4s backwards', background: t.card, border: `1px solid ${t.cardBorder}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src={MENTOR_IMAGES.carnegie} alt="Andrew Carnegie" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(100%)', border: `2px solid ${t.accent}` }} />
                <div>
                  <p style={{ fontSize: '14px', color: t.accent, margin: 0, fontWeight: '600' }}>Andrew Carnegie</p>
                  <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>Money & Career</p>
                </div>
              </div>
              <div style={{ background: theme === 'dark' ? '#0a0a0a' : '#f0f0f0', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                <p style={{ fontSize: '14px', color: t.text, margin: 0, lineHeight: '1.5' }}>
                  <strong>You:</strong> "I'm doing freelance work but charging way less than I should because I'm scared clients will say no. How do I raise my rates?"
                </p>
              </div>
              <div style={{ background: theme === 'dark' ? '#1a1a1a' : '#ffffff', border: `1px solid ${t.inputBorder}`, borderRadius: '12px', padding: '14px' }}>
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
                boxShadow: theme === 'dark' ? '0 8px 24px rgba(201, 168, 76, 0.3)' : '0 8px 24px rgba(201, 168, 76, 0.25)',
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
      { id: 1, label: "First, what's your name?", placeholder: "Your name", key: 'name', type: 'short' },
      { id: 2, label: "What's your biggest challenge right now?", placeholder: "E.g., I'm stuck in a job I hate but scared to quit...", key: 'biggestChallenge', type: 'long' },
      { id: 3, label: "What are you actually trying to achieve?", placeholder: "E.g., Build a business that lets me quit my 9-5, get promoted, develop unshakeable discipline...", key: 'tryingToAchieve', type: 'long' },
      { id: 4, label: "What's keeping you stuck?", placeholder: "E.g., I don't know where to start, I'm afraid of failing, I lack the confidence...", key: 'stuckOn', type: 'long' },
      { id: 5, label: "What have you already tried that didn't work?", placeholder: "E.g., Watched YouTube videos, asked ChatGPT, read books but nothing stuck...", key: 'failedAt', type: 'long' }
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
      if (questionStep > 1) setQuestionStep(questionStep - 1);
    };

    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{ minHeight: '100vh', background: t.bg, padding: '40px 20px 60px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} style={{ width: '40px', height: '4px', background: s <= questionStep ? t.accent : t.inputBorder, borderRadius: '2px', transition: 'all 0.3s' }} />
              ))}
            </div>
            <p style={{ fontSize: '13px', color: t.textMuted, textAlign: 'center', marginBottom: '28px' }}>
              {[
                "Let's figure out where you are...",
                "Most people never ask this question...",
                "Getting clearer...",
                "Almost there...",
                "Last one. Make it count."
              ][questionStep - 1]}
            </p>

            <h2 style={{ fontSize: '24px', color: t.accent, marginBottom: '12px', textAlign: 'center', fontWeight: '400' }}>
              {questionStep === 1 ? "Let's personalize this for you." : `Question ${questionStep} of 5`}
            </h2>

            <p style={{ fontSize: '16px', color: t.textTertiary, marginBottom: '32px', textAlign: 'center', lineHeight: '1.6' }}>
              {currentQuestion.label}
            </p>

            {currentQuestion.type === 'short' ? (
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion.key]: e.target.value })}
                onKeyPress={(e) => { if (e.key === 'Enter' && currentAnswer.trim()) handleNext(); }}
                placeholder={currentQuestion.placeholder}
                autoFocus
                style={{ width: '100%', background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: '12px', padding: '16px', fontSize: '16px', color: t.text, outline: 'none', marginBottom: '24px' }}
              />
            ) : (
              <textarea
                value={currentAnswer}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion.key]: e.target.value })}
                placeholder={currentQuestion.placeholder}
                rows={5}
                autoFocus
                style={{ width: '100%', background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: '12px', padding: '16px', fontSize: '16px', color: t.text, outline: 'none', resize: 'none', fontFamily: 'inherit', marginBottom: '24px', lineHeight: '1.6' }}
              />
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              {questionStep > 1 && (
                <button onClick={handleBack} style={{ flex: 1, background: t.input, color: t.textTertiary, border: `1px solid ${t.inputBorder}`, borderRadius: '30px', padding: '16px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>
                  ← Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!currentAnswer.trim()}
                style={{
                  flex: questionStep > 1 ? 1 : 'auto',
                  width: questionStep === 1 ? '100%' : 'auto',
                  background: currentAnswer.trim() ? `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)` : t.inputBorder,
                  color: currentAnswer.trim() ? (theme === 'dark' ? '#000' : '#fff') : t.textMuted,
                  border: 'none',
                  borderRadius: '30px',
                  padding: '16px',
                  fontSize: '17px',
                  fontWeight: '600',
                  cursor: currentAnswer.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: currentAnswer.trim() ? (theme === 'dark' ? '0 4px 16px rgba(201, 168, 76, 0.25)' : '0 4px 16px rgba(201, 168, 76, 0.25)') : 'none'
                }}
              >
                {questionStep === 5 ? 'Continue →' : 'Next'}
              </button>
            </div>

            {currentQuestion.type === 'long' && (
              <p style={{ fontSize: '13px', color: t.textMuted, textAlign: 'center', marginTop: '16px', lineHeight: '1.5' }}>
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
        <div style={{ minHeight: '100vh', background: t.bg, padding: '40px 20px 60px', overflow: 'auto' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', color: t.accent, marginBottom: '12px', textAlign: 'center', fontWeight: '400' }}>
              Perfect, {userName}.
            </h2>
            <p style={{ fontSize: '16px', color: t.textTertiary, marginBottom: '32px', textAlign: 'center', lineHeight: '1.6' }}>
              Which type of mentor would help you most right now?
            </p>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
              {[
                { type: 'business', title: 'Business Mentor', desc: 'Strategy, pricing, growth, competition', mentors: 'Carnegie, Jobs, Rockefeller' },
                { type: 'mindset', title: 'Mindset Mentor', desc: 'Discipline, resilience, self-mastery', mentors: 'Marcus Aurelius, Seneca, Nietzsche' },
                { type: 'leadership', title: 'Leadership Mentor', desc: 'Decision-making, execution, vision', mentors: 'Napoleon, Jobs, Marcus Aurelius' }
              ].map(option => (
                <div
                  key={option.type}
                  onClick={() => { setMentorType(option.type); setStep('mentorProfile'); }}
                  style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'all 0.3s' }}
                >
                  <h3 style={{ fontSize: '18px', color: t.text, margin: '0 0 8px 0', fontWeight: '500' }}>{option.title}</h3>
                  <p style={{ fontSize: '14px', color: t.textTertiary, margin: '0 0 8px 0', lineHeight: '1.5' }}>{option.desc}</p>
                  <p style={{ fontSize: '12px', color: t.accent, margin: 0 }}>{option.mentors}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Mentor Profile
  if (step === 'mentorProfile') {
    const t = THEMES[theme];
    const mentorIdMap = { business: 'carnegie', mindset: 'marcus', leadership: 'napoleon' };
    const profileMentorId = mentorIdMap[mentorType] || 'carnegie';
    const profileMentor = MENTORS.find(m => m.id === profileMentorId);
    const traitsMap = {
      business: ['Strategic Thinker', 'Wealth Builder', 'Ruthless Executor'],
      mindset: ['Stoic Resilience', 'Self Mastery', 'Inner Clarity'],
      leadership: ['Bold Decisiveness', 'Strategic Vision', 'Controlled Aggression'],
    };
    const traits = traitsMap[mentorType] || traitsMap.business;
    const firstName = profileMentor.name.split(' ')[0];

    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />

        {/* Cinematic backdrop */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: `url(${MENTOR_IMAGES[profileMentorId]})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          filter: 'blur(40px) grayscale(100%)',
          opacity: theme === 'dark' ? 0.07 : 0.04,
          transform: 'scale(1.1)',
        }} />

        <div style={{ minHeight: '100vh', background: t.bg, padding: '60px 20px 80px', overflow: 'auto', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '460px', width: '100%', textAlign: 'center' }}>

            <p style={{ fontSize: '11px', color: t.accent, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 36px 0', animation: 'fadeIn 0.6s ease-out' }}>
              YOUR MENTOR PROFILE
            </p>

            {/* Photo with glow ring */}
            <div style={{ position: 'relative', width: '148px', height: '148px', margin: '0 auto 28px auto', animation: 'fadeIn 0.8s ease-out 0.15s backwards' }}>
              <div style={{ position: 'absolute', inset: '-3px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight}, ${t.accent})`, animation: 'glowPulse 3s ease-in-out infinite' }} />
              <img
                src={MENTOR_IMAGES[profileMentorId]}
                alt={profileMentor.name}
                style={{ width: '148px', height: '148px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(80%)', position: 'relative', zIndex: 1 }}
              />
            </div>

            <h1 className="gradient-text" style={{ fontSize: '38px', fontWeight: '500', margin: '0 0 10px 0', fontFamily: "'Cormorant Garamond', serif", animation: 'slideUp 0.6s ease-out 0.3s backwards' }}>
              {profileMentor.name}
            </h1>

            <p style={{ fontSize: '15px', color: t.textSecondary, margin: '0 0 24px 0', lineHeight: '1.6', animation: 'slideUp 0.6s ease-out 0.4s backwards' }}>
              Based on where you are, {profileMentor.name} is the mind you need right now.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px', animation: 'slideUp 0.6s ease-out 0.5s backwards' }}>
              {traits.map(trait => (
                <span key={trait} style={{ fontSize: '12px', color: t.accent, border: `1px solid rgba(201, 168, 76, 0.3)`, borderRadius: '20px', padding: '5px 14px', letterSpacing: '0.3px' }}>
                  {trait}
                </span>
              ))}
            </div>

            <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '20px 24px', marginBottom: '32px', textAlign: 'left', animation: 'slideUp 0.6s ease-out 0.6s backwards' }}>
              <p style={{ fontSize: '14px', color: t.textMuted, lineHeight: '1.7', margin: 0 }}>
                You said your biggest challenge is{' '}
                <em style={{ color: t.textSecondary, fontStyle: 'italic' }}>"{answers.biggestChallenge}"</em>.{' '}
                {firstName} has faced this. Here's the difference — he won.
              </p>
            </div>

            <button
              onClick={() => setStep('trial')}
              className="btn-primary"
              style={{ width: '100%', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`, color: theme === 'dark' ? '#000' : '#fff', border: 'none', borderRadius: '30px', padding: '18px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', boxShadow: theme === 'dark' ? '0 4px 16px rgba(201, 168, 76, 0.3)' : '0 4px 16px rgba(201, 168, 76, 0.3)', animation: 'slideUp 0.6s ease-out 0.7s backwards' }}
            >
              Meet {firstName} →
            </button>
          </div>
        </div>
      </>
    );
  }

  // Trial Question
  if (step === 'trial') {
    const t = THEMES[theme];
    
    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{ minHeight: '100vh', background: t.bg, padding: '40px 20px 60px', overflow: 'auto', position: 'relative' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', color: t.accent, marginBottom: '12px', textAlign: 'center', fontWeight: '400' }}>
              Try it right now.
            </h2>
            <p style={{ fontSize: '16px', color: t.textTertiary, marginBottom: '32px', textAlign: 'center', lineHeight: '1.6' }}>
              Ask one question. Be as specific as possible.
            </p>

            <div style={{ background: t.card, border: `1px solid ${t.accent}`, borderRadius: '16px', padding: '16px', marginBottom: '24px' }}>
              <p style={{ fontSize: '13px', color: t.accent, margin: 0, lineHeight: '1.5' }}>
                💡 Better question = better answer. Instead of "How do I grow my business?" try "I have 100 customers but revenue is flat. Should I raise prices or add features?"
              </p>
            </div>

            <div style={{ background: t.card, border: `1px solid ${t.inputBorder}`, borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: t.textTertiary, marginBottom: '12px', fontWeight: '500' }}>
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

              {trialQuestion.trim() && !trialResponse && (
                <div style={{ animation: 'slideUp 0.4s ease-out' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: t.textTertiary, marginBottom: '12px', fontWeight: '500' }}>
                    Your Email:
                  </label>
                  <input
                    type="email"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && userName.trim() && trialQuestion.trim()) {
                        document.getElementById('get-answer-btn').click();
                      }
                    }}
                    placeholder="your@email.com"
                    style={{ width: '100%', background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: '12px', padding: '14px 16px', fontSize: '16px', color: t.text, outline: 'none' }}
                  />
                  <p style={{ fontSize: '12px', color: t.textMuted, margin: '8px 0 0 0', lineHeight: '1.5' }}>
                    We'll send you the answer. No spam, unsubscribe anytime.
                  </p>
                </div>
              )}
            </div>

            {loading && (
              <div style={{ background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.accent, animation: `bounce 1.4s infinite ease-in-out both ${delay}s` }} />
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: t.textTertiary, margin: '12px 0 0 0' }}>
                  Getting your personalized answer from {mentorType === 'business' ? 'Carnegie' : mentorType === 'mindset' ? 'Marcus Aurelius' : 'Napoleon'}...
                </p>
              </div>
            )}

            {trialResponse && (
              <div style={{ background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: '12px', padding: '20px', marginBottom: '24px', animation: 'slideUp 0.6s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${t.inputBorder}` }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
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
                <p style={{ fontSize: '15px', color: t.textSecondary, margin: 0, lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
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
                        answers: answers
                      })
                    });
                  } catch (error) {
                    console.error('Loops error:', error);
                  }

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
                    ? (theme === 'dark' ? '0 4px 16px rgba(201, 168, 76, 0.25)' : '0 4px 16px rgba(201, 168, 76, 0.25)')
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
                  boxShadow: theme === 'dark' ? '0 4px 16px rgba(201, 168, 76, 0.25)' : '0 4px 16px rgba(201, 168, 76, 0.25)'
                }}
              >
                Continue →
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  // Pain Dig
  if (step === 'painDig') {
    const t = THEMES[theme];
    
    return (
      <>
        <GlobalStyles />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{ minHeight: '100vh', background: t.bg, padding: '40px 20px 60px', overflow: 'auto' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', color: t.accent, marginBottom: '24px', textAlign: 'center', fontWeight: '400' }}>
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

            <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
              <p style={{ fontSize: '16px', color: t.text, lineHeight: '1.6', marginBottom: '16px' }}><strong>Without Mentor:</strong></p>
              <p style={{ fontSize: '15px', color: t.textTertiary, lineHeight: '1.6', marginBottom: '8px' }}>→ You scroll Twitter looking for answers</p>
              <p style={{ fontSize: '15px', color: t.textTertiary, lineHeight: '1.6', marginBottom: '8px' }}>→ You watch YouTube videos and take notes</p>
              <p style={{ fontSize: '15px', color: t.textTertiary, lineHeight: '1.6', marginBottom: '8px' }}>→ You ask ChatGPT and get safe, generic responses</p>
              <p style={{ fontSize: '15px', color: t.textTertiary, lineHeight: '1.6', marginBottom: '24px' }}>→ You make the decision anyway. Hope it works out.</p>

              <p style={{ fontSize: '16px', color: t.text, lineHeight: '1.6', marginBottom: '16px' }}><strong>With Mentor:</strong></p>
              <p style={{ fontSize: '15px', color: t.accent, lineHeight: '1.6', marginBottom: '8px' }}>→ You ask someone who's solved your exact problem</p>
              <p style={{ fontSize: '15px', color: t.accent, lineHeight: '1.6', marginBottom: '8px' }}>→ You get direct, battle-tested frameworks</p>
              <p style={{ fontSize: '15px', color: t.accent, lineHeight: '1.6', marginBottom: '0' }}>→ You move forward with clarity and confidence</p>
            </div>

            <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '8px', textAlign: 'center' }}>
              This is what ambitious people have been paying for.
            </p>
            <p style={{ fontSize: '17px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '32px', textAlign: 'center' }}>
              Now you can get it for <strong style={{ color: t.accent }}>less than a coffee per day</strong>.
            </p>

            <button
              onClick={() => setStep('transformation')}
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
                boxShadow: theme === 'dark' ? '0 4px 16px rgba(201, 168, 76, 0.3)' : '0 4px 16px rgba(201, 168, 76, 0.3)'
              }}
            >
              Show me pricing →
            </button>
          </div>
        </div>
      </>
    );
  }

  // Transformation Screen
  if (step === 'transformation') {
    return <TransformationScreen theme={theme} setTheme={setTheme} setStep={setStep} />;
  }

  // Paywall
  if (step === 'paywall') {
    const t = THEMES[theme];
    
    const plans = {
      weekly: { priceId: 'price_1TM2hnAis1rAntIhstKTtpHk', price: '£7', period: '/week', label: 'Try it out' },
      monthly: { priceId: 'price_1TM2nSAis1rAntIhrzVU3kBi', price: '£19', period: '/month', label: 'Best value', savings: 'Save £9/month vs weekly' },
      yearly: { priceId: 'price_1TM2nrAis1rAntIhgHWzLP6j', price: '£297', period: '/year', label: 'One-time payment', savings: 'Never pay again' }
    };

    const handleCheckout = async () => {
      const plan = plans[selectedPlan];
      if (!plan) {
        alert('Please select a plan first.');
        return;
      }
      try {
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId: plan.priceId, email: userName }),
        });
        const data = await response.json();
        if (!data.url) {
          console.error('No URL returned from Stripe:', data);
          alert('Payment error. Please try again.');
          return;
        }
        window.location.href = data.url;
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
        <div style={{ minHeight: '100vh', background: t.bg, padding: '40px 20px 60px', overflow: 'auto' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', color: t.accent, marginBottom: '12px', textAlign: 'center', fontWeight: '400', fontFamily: "'Cormorant Garamond', serif" }}>
              Get unlimited access.
            </h2>
            <p style={{ fontSize: '15px', color: t.textTertiary, marginBottom: '40px', textAlign: 'center' }}>
              Choose your plan:
            </p>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
              <div onClick={() => setSelectedPlan('weekly')} style={{ background: selectedPlan === 'weekly' ? (theme === 'dark' ? '#0f0f0f' : '#ffffff') : t.card, border: selectedPlan === 'weekly' ? `2px solid ${t.accent}` : `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', color: t.text, margin: '0 0 4px 0', fontWeight: '500' }}>Weekly</h3>
                    <p style={{ fontSize: '13px', color: t.textMuted, margin: 0 }}>{plans.weekly.label}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '28px', color: t.text, margin: '0', fontWeight: '600' }}>{plans.weekly.price}</p>
                    <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>{plans.weekly.period}</p>
                  </div>
                </div>
                {['3 mentors (Carnegie, Marcus Aurelius, Napoleon)', '30 messages per week'].map(f => (
                  <p key={f} style={{ fontSize: '12px', color: t.textTertiary, margin: '0 0 4px 0', lineHeight: '1.5' }}>✓ {f}</p>
                ))}
                {selectedPlan === 'weekly' && (
                  <button onClick={(e) => { e.stopPropagation(); handleCheckout(); }} className="btn-primary" style={{ width: '100%', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`, color: theme === 'dark' ? '#000' : '#fff', border: 'none', borderRadius: '30px', padding: '16px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '16px' }}>
                    Start Now →
                  </button>
                )}
              </div>

              <div onClick={() => setSelectedPlan('monthly')} style={{ background: selectedPlan === 'monthly' ? (theme === 'dark' ? '#0f0f0f' : '#ffffff') : t.card, border: selectedPlan === 'monthly' ? `2px solid ${t.accent}` : `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '24px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: t.accent, color: theme === 'dark' ? '#000' : '#fff', padding: '4px 16px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' }}>
                  MOST POPULAR
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', color: t.text, margin: '0 0 4px 0', fontWeight: '500' }}>Monthly</h3>
                    <p style={{ fontSize: '13px', color: t.accent, margin: 0 }}>{plans.monthly.label}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '28px', color: t.text, margin: '0', fontWeight: '600' }}>{plans.monthly.price}</p>
                    <p style={{ fontSize: '12px', color: t.textTertiary, margin: 0 }}>{plans.monthly.period}</p>
                  </div>
                </div>
                {['All 7 mentors', 'Unlimited messages', 'Image uploads (coming soon)', 'Conversation history'].map(f => (
                  <p key={f} style={{ fontSize: '12px', color: t.textTertiary, margin: '0 0 4px 0', lineHeight: '1.5' }}>✓ {f}</p>
                ))}
                <p style={{ fontSize: '12px', color: t.textMuted, margin: '12px 0 0 0' }}>{plans.monthly.savings}</p>
                {selectedPlan === 'monthly' && (
                  <button onClick={(e) => { e.stopPropagation(); handleCheckout(); }} className="btn-primary" style={{ width: '100%', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`, color: theme === 'dark' ? '#000' : '#fff', border: 'none', borderRadius: '30px', padding: '16px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '16px' }}>
                    Start Now →
                  </button>
                )}
              </div>

              <div onClick={() => setSelectedPlan('yearly')} style={{ background: selectedPlan === 'yearly' ? (theme === 'dark' ? '#0f0f0f' : '#ffffff') : t.card, border: selectedPlan === 'yearly' ? `2px solid ${t.accent}` : `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', color: t.text, margin: '0 0 4px 0', fontWeight: '500' }}>Lifetime</h3>
                    <p style={{ fontSize: '13px', color: t.textMuted, margin: 0 }}>{plans.yearly.label}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '28px', color: t.text, margin: '0', fontWeight: '600' }}>{plans.yearly.price}</p>
                    <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>{plans.yearly.period}</p>
                  </div>
                </div>
                {['Everything in Monthly', 'Early access to new mentors', 'Request new mentors', 'Downloadable transcripts'].map(f => (
                  <p key={f} style={{ fontSize: '12px', color: t.textTertiary, margin: '0 0 4px 0', lineHeight: '1.5' }}>✓ {f}</p>
                ))}
                <p style={{ fontSize: '12px', color: t.textMuted, margin: '12px 0 0 0' }}>{plans.yearly.savings}</p>
                {selectedPlan === 'yearly' && (
                  <button onClick={(e) => { e.stopPropagation(); handleCheckout(); }} className="btn-primary" style={{ width: '100%', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`, color: theme === 'dark' ? '#000' : '#fff', border: 'none', borderRadius: '30px', padding: '16px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '16px' }}>
                    Start Now →
                  </button>
                )}
              </div>
            </div>

            <p style={{ fontSize: '12px', color: t.textMuted, textAlign: 'center', margin: 0, lineHeight: '1.5' }}>
              7-day money-back guarantee. Cancel anytime.
            </p>

            <div style={{ marginTop: '40px' }}>
              <p style={{ fontSize: '11px', color: t.textMuted, textAlign: 'center', marginBottom: '16px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>FAQ</p>
              {[
                { q: "Is this just ChatGPT?", a: "No. These mentors are trained to think, speak and reason exactly as the historical figure would — with their specific philosophies, frameworks and blind spots. You're not getting generic AI. You're getting Carnegie's actual worldview on your problem." },
                { q: "Will it actually help me or just sound good?", a: "That depends on what you bring to it. Vague questions get vague answers. Specific situations get specific frameworks. The more real you are with it, the more useful it becomes." },
                { q: "What if I don't know which mentor to ask?", a: "Start with the one whose life most resembles what you're trying to build. Building a business from nothing? Carnegie. Struggling with pressure and discipline? Marcus Aurelius. Making a big strategic decision? Napoleon." },
                { q: "Can I cancel anytime?", a: "Yes. No forms, no phone calls. Cancel in one click from your Stripe billing portal." },
                { q: "What if it's not for me?", a: "7-day money-back guarantee. If you don't find it useful in the first week, reply to your welcome email and I'll refund you in full. No questions asked." }
              ].map((faq, i) => (
                <div key={i} style={{ borderBottom: `1px solid ${t.inputBorder}` }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', background: 'none', border: 'none', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: '12px' }}
                  >
                    <span style={{ fontSize: '14px', color: t.textSecondary, fontWeight: '500' }}>{faq.q}</span>
                    <span style={{ fontSize: '20px', color: t.textMuted, flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block' }}>+</span>
                  </button>
                  {openFaq === i && (
                    <p style={{ fontSize: '14px', color: t.textTertiary, lineHeight: '1.6', margin: '0 0 16px 0' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (step === 'settings') {
    const t = THEMES[theme];
    const planLabels = { weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly', lifetime: 'Lifetime' };
    return (
      <>
        <GlobalStyles />
        <div className="noise" style={{ opacity: t.noise }} />
        <div style={{ minHeight: '100vh', background: t.bg, padding: '40px 20px 60px', overflow: 'auto' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <button
              onClick={() => setStep('chat')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'none', border: 'none', color: t.textTertiary,
                cursor: 'pointer', padding: '0', marginBottom: '32px', fontSize: '14px'
              }}
            >
              ← Back
            </button>

            <h1 style={{ fontSize: '36px', color: t.text, margin: '0 0 8px 0', fontWeight: '500', fontFamily: "'Cormorant Garamond', serif" }}>
              Settings
            </h1>
            <p style={{ fontSize: '14px', color: t.textTertiary, margin: '0 0 36px 0' }}>
              Manage your preferences and account.
            </p>

            <div style={{ display: 'grid', gap: '16px' }}>
              <section style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '20px', padding: '24px' }}>
                <h2 style={{ fontSize: '13px', color: t.textMuted, margin: '0 0 16px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Theme
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <p style={{ fontSize: '15px', color: t.text, margin: 0, fontWeight: '500' }}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </p>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    style={{
                      background: t.input, border: `1px solid ${t.cardBorder}`,
                      color: t.text, borderRadius: '999px', padding: '10px 18px',
                      cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                      flexShrink: 0, whiteSpace: 'nowrap'
                    }}
                  >
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>
              </section>

              <section style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '20px', padding: '24px' }}>
                <h2 style={{ fontSize: '13px', color: t.textMuted, margin: '0 0 16px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Subscription
                </h2>
                <p style={{ fontSize: '15px', color: t.text, margin: '0 0 4px 0', fontWeight: '500' }}>
                  {planLabels[userTier] || 'Monthly'} Plan
                </p>
                <p style={{ fontSize: '13px', color: t.accent, margin: '0 0 20px 0', fontWeight: '500' }}>Active</p>
                <button
                  onClick={() => window.open('https://billing.stripe.com/p/login/test_yourportallink', '_blank')}
                  style={{
                    background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`,
                    color: theme === 'dark' ? '#000' : '#fff',
                    border: 'none', borderRadius: '30px', padding: '14px 20px',
                    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(201, 168, 76, 0.3)'
                  }}
                >
                  Manage Subscription →
                </button>
              </section>

              <section style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '20px', padding: '24px' }}>
                <h2 style={{ fontSize: '13px', color: t.textMuted, margin: '0 0 16px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Account
                </h2>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                  padding: '14px 16px', borderRadius: '12px', background: t.input, border: `1px solid ${t.inputBorder}`
                }}>
                  <span style={{ fontSize: '13px', color: t.textMuted }}>Email</span>
                  <span style={{ fontSize: '14px', color: t.text, fontWeight: '500' }}>{userName || 'Not set'}</span>
                </div>
              </section>

              <button
                onClick={() => {
                  localStorage.removeItem('mentor_access');
                  setStep('hero');
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '10px', background: 'transparent',
                  border: `1px solid ${t.cardBorder}`, borderRadius: '16px',
                  padding: '16px 20px', color: t.textSecondary,
                  cursor: 'pointer', fontSize: '15px', fontWeight: '600', width: '100%'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <div>Loading...</div>;
}

// Daily Drop Screen Component
const DAY_MAP = [
  { mentorId: 'seneca',     theme: 'time and what actually matters',   themeLabel: 'Time & What Matters' },
  { mentorId: 'carnegie',   theme: 'money and pricing',                themeLabel: 'Money & Pricing' },
  { mentorId: 'napoleon',   theme: 'strategy and competition',         themeLabel: 'Strategy & Competition' },
  { mentorId: 'marcus',     theme: 'discipline and focus',             themeLabel: 'Discipline & Focus' },
  { mentorId: 'jobs',       theme: 'building and creating',            themeLabel: 'Building & Creating' },
  { mentorId: 'rockefeller',theme: 'systems and long-term thinking',   themeLabel: 'Systems & Long-Term' },
  { mentorId: 'nietzsche',  theme: 'identity and self-overcoming',     themeLabel: 'Identity & Self-Overcoming' },
];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DailyDropScreen = ({ theme, setTheme, setStep, setSelectedMentor }) => {
  const t = THEMES[theme];
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);

  const today = new Date().getDay();
  const dayConfig = DAY_MAP[today];
  const tomorrowConfig = DAY_MAP[(today + 1) % 7];
  const mentor = MENTORS.find(m => m.id === dayConfig.mentorId);
  const tomorrowMentor = MENTORS.find(m => m.id === tomorrowConfig.mentorId);
  const firstName = mentor.name.split(' ')[0];

  useEffect(() => {
    const dateKey = new Date().toISOString().split('T')[0];
    const cacheKey = `daily_drop_${dateKey}_${dayConfig.mentorId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) { setResponse(cached); setLoading(false); return; }

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: `Give me your single most important piece of unsolicited advice on ${dayConfig.theme} for an ambitious young person trying to build something great. Be direct, be specific, be challenging. No fluff.` }],
        systemPrompt: mentor.systemPrompt,
      }),
    })
      .then(r => r.json())
      .then(data => {
        const content = data.content || '';
        localStorage.setItem(cacheKey, content);
        setResponse(content);
        setLoading(false);
      })
      .catch(() => { setResponse('Something went wrong. Try again later.'); setLoading(false); });
  }, []);

  return (
    <>
      <GlobalStyles />
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <div className="noise" style={{ opacity: t.noise }} />
      <div style={{ minHeight: '100vh', background: t.bg, padding: '40px 20px 60px', overflow: 'auto' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

          <button onClick={() => setStep('chat')} style={{ background: 'none', border: 'none', color: t.textTertiary, cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
            <ArrowLeft size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeIn 0.6s ease-out' }}>
            <p style={{ fontSize: '11px', color: t.accent, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 24px 0' }}>
              {DAY_NAMES[today].toUpperCase()} DROP
            </p>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px auto' }}>
              <div style={{ position: 'absolute', inset: '-3px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight}, ${t.accent})`, animation: 'glowPulse 3s ease-in-out infinite' }} />
              <img src={MENTOR_IMAGES[dayConfig.mentorId]} alt={mentor.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(80%)', position: 'relative', zIndex: 1 }} />
            </div>
            <h1 className="gradient-text" style={{ fontSize: '34px', fontWeight: '500', margin: '0 0 12px 0', fontFamily: "'Cormorant Garamond', serif" }}>
              {mentor.name}
            </h1>
            <span style={{ fontSize: '12px', color: t.accent, border: `1px solid rgba(201, 168, 76, 0.3)`, borderRadius: '20px', padding: '5px 14px', letterSpacing: '0.3px' }}>
              {dayConfig.themeLabel}
            </span>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', animation: 'fadeIn 0.4s ease-out' }}>
              <img src={MENTOR_IMAGES[dayConfig.mentorId]} alt={mentor.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(100%)', border: `2px solid ${t.accent}`, animation: 'pulse 1.5s ease-in-out infinite', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '15px', color: t.textMuted, margin: 0 }}>
                {firstName} is preparing today's insight...
              </p>
            </div>
          )}

          {!loading && response && (
            <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
              <p style={{ fontSize: '16px', color: t.textSecondary, lineHeight: '1.8', margin: '0 0 40px 0', whiteSpace: 'pre-wrap' }}>
                {response}
              </p>
              <div style={{ height: '1px', background: `linear-gradient(to right, transparent, ${t.accent}, transparent)`, opacity: 0.3, marginBottom: '24px' }} />
              <p style={{ fontSize: '13px', color: t.textMuted, textAlign: 'center', marginBottom: '32px', lineHeight: '1.6' }}>
                Come back tomorrow for {tomorrowMentor.name}'s drop.
              </p>
              <button
                onClick={() => { setSelectedMentor(mentor); setStep('chat'); }}
                className="btn-primary"
                style={{ width: '100%', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`, color: theme === 'dark' ? '#000' : '#fff', border: 'none', borderRadius: '30px', padding: '18px', fontSize: '17px', fontWeight: '600', cursor: 'pointer', boxShadow: theme === 'dark' ? '0 4px 16px rgba(201, 168, 76, 0.3)' : '0 4px 16px rgba(201, 168, 76, 0.25)' }}
              >
                Ask {firstName} a follow-up →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

// War Room Screen Component
const WarRoomScreen = ({ theme, setTheme, setStep }) => {
  const t = THEMES[theme];
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [arrivedResponses, setArrivedResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleConsult = async () => {
    if (!question.trim() || isLoading) return;
    setIsLoading(true);
    setSubmitted(true);
    setArrivedResponses([]);

    const promises = MENTORS.map(mentor =>
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: question }],
          systemPrompt: mentor.systemPrompt,
        }),
      })
        .then(r => r.json())
        .then(data => {
          setArrivedResponses(prev => [...prev, { mentor, response: data.content || 'No response received.' }]);
        })
        .catch(() => {
          setArrivedResponses(prev => [...prev, { mentor, response: 'My apologies, I could not respond at this time.' }]);
        })
    );

    await Promise.allSettled(promises);
    setIsLoading(false);
  };

  const stillLoading = isLoading;
  const allDone = submitted && !isLoading && arrivedResponses.length === MENTORS.length;

  return (
    <>
      <GlobalStyles />
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <div className="noise" style={{ opacity: t.noise }} />
      <div style={{ minHeight: '100vh', background: t.bg, padding: '40px 20px 60px', overflow: 'auto' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>

          <button
            onClick={() => setStep('chat')}
            style={{ background: 'none', border: 'none', color: t.textTertiary, cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', marginBottom: '40px' }}
          >
            <ArrowLeft size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeIn 0.6s ease-out' }}>
            <p style={{ fontSize: '11px', color: t.accent, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 16px 0' }}>
              THE WAR ROOM
            </p>
            <h1 style={{ fontSize: '36px', color: t.text, margin: '0 0 12px 0', fontFamily: "'Cormorant Garamond', serif", fontWeight: '500' }}>
              Seven minds. One question.
            </h1>
            <p style={{ fontSize: '16px', color: t.textMuted, margin: 0 }}>
              Ask anything. Every mentor answers.
            </p>
          </div>

          {!submitted && (
            <div style={{ animation: 'slideUp 0.6s ease-out 0.2s backwards' }}>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask something worth debating..."
                rows={5}
                style={{ width: '100%', background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: '16px', padding: '16px', fontSize: '16px', color: t.text, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.6', marginBottom: '16px', boxSizing: 'border-box' }}
              />
              <button
                onClick={handleConsult}
                disabled={!question.trim()}
                style={{ width: '100%', background: question.trim() ? `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)` : t.inputBorder, color: question.trim() ? (theme === 'dark' ? '#000' : '#fff') : t.textMuted, border: 'none', borderRadius: '30px', padding: '16px', fontSize: '17px', fontWeight: '600', cursor: question.trim() ? 'pointer' : 'not-allowed', boxShadow: question.trim() ? (theme === 'dark' ? '0 4px 16px rgba(201, 168, 76, 0.3)' : '0 4px 16px rgba(201, 168, 76, 0.25)') : 'none' }}
              >
                Consult All Mentors →
              </button>
            </div>
          )}

          {submitted && (
            <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '16px 20px', marginBottom: '32px', animation: 'fadeIn 0.4s ease-out' }}>
              <p style={{ fontSize: '11px', color: t.textMuted, margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Your question</p>
              <p style={{ fontSize: '15px', color: t.textSecondary, margin: 0, lineHeight: '1.6' }}>{question}</p>
            </div>
          )}

          {submitted && stillLoading && (
            <div style={{ textAlign: 'center', marginBottom: '32px', animation: 'fadeIn 0.4s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {MENTORS.map((mentor, i) => {
                  const hasArrived = arrivedResponses.some(r => r.mentor.id === mentor.id);
                  return (
                    <img
                      key={mentor.id}
                      src={MENTOR_IMAGES[mentor.id]}
                      alt={mentor.name}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(100%)', border: `2px solid ${hasArrived ? t.accent : t.inputBorder}`, animation: hasArrived ? 'none' : `pulse 1.5s ease-in-out infinite`, animationDelay: `${i * 0.2}s`, opacity: hasArrived ? 1 : 0.6, transition: 'all 0.4s' }}
                    />
                  );
                })}
              </div>
              <p style={{ fontSize: '14px', color: t.textMuted, margin: 0 }}>
                The council is deliberating... ({arrivedResponses.length}/{MENTORS.length})
              </p>
            </div>
          )}

          <div>
            {arrivedResponses.map((item) => (
              <div
                key={item.mentor.id}
                style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '20px', marginBottom: '16px', animation: 'slideUp 0.5s ease-out' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '14px', borderBottom: `1px solid ${t.inputBorder}` }}>
                  <img src={MENTOR_IMAGES[item.mentor.id]} alt={item.mentor.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(100%)', border: `2px solid ${t.accent}`, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '15px', color: t.accent, margin: 0, fontWeight: '600' }}>{item.mentor.name}</p>
                    <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>{item.mentor.title}</p>
                  </div>
                </div>
                <p style={{ fontSize: '15px', color: t.textSecondary, margin: 0, lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {item.response}
                </p>
              </div>
            ))}
          </div>

          {allDone && (
            <button
              onClick={() => { setSubmitted(false); setArrivedResponses([]); setQuestion(''); setIsLoading(false); }}
              style={{ width: '100%', background: 'none', border: `1px solid ${t.cardBorder}`, borderRadius: '30px', padding: '14px', fontSize: '15px', color: t.textTertiary, cursor: 'pointer', marginTop: '8px', transition: 'all 0.2s' }}
            >
              Ask another question
            </button>
          )}

        </div>
      </div>
    </>
  );
};

// Transformation Screen Component
const TransformationScreen = ({ theme, setTheme, setStep }) => {
  const t = THEMES[theme];
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const featuresRef = useRef(null);
  const [visible, setVisible] = useState([false, false, false]);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    const items = [
      { ref: ref0, index: 0 },
      { ref: ref1, index: 1 },
      { ref: ref2, index: 2 },
    ];
    const observers = items.map(({ ref, index }) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(prev => { const n = [...prev]; n[index] = true; return n; }), index * 150);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      if (ref.current) observer.observe(ref.current);
      return observer;
    });

    const featObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setFeaturesVisible(true); featObs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (featuresRef.current) featObs.observe(featuresRef.current);

    return () => { observers.forEach(o => o.disconnect()); featObs.disconnect(); };
  }, []);

  const outcomes = [
    { num: '01', title: 'You stop guessing.', body: 'Every decision you make right now is a coin flip. With Mentor, every answer comes from someone who has already solved your exact problem. The guesswork ends.' },
    { num: '02', title: 'You move faster.', body: "The biggest cost in building anything isn't money. It's time lost to indecision and wrong turns. One conversation with Carnegie or Napoleon can save you months." },
    { num: '03', title: 'You become someone different.', body: "This isn't information. It's identity. Spending time inside the minds of the greatest people who ever lived changes how you think, how you carry yourself, and what you believe is possible." },
  ];

  const refs = [ref0, ref1, ref2];

  const features = [
    '7 legendary mentors', 'Unlimited conversations', 'Reading List — 35 books',
    'Image uploads (coming soon)', 'Conversation history', 'Downloadable transcripts',
    'Early access to new mentors', 'Request new mentors',
  ];

  return (
    <>
      <GlobalStyles />
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <div className="noise" style={{ opacity: t.noise }} />
      <div style={{ minHeight: '100vh', background: t.bg, padding: '80px 20px 80px', overflow: 'auto' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '80px', animation: 'fadeIn 0.8s ease-out' }}>
            <p style={{ fontSize: '11px', color: t.textMuted, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 20px 0' }}>
              THE DIFFERENCE
            </p>
            <h1 className="gradient-text" style={{ fontSize: '42px', fontWeight: '500', margin: '0 0 16px 0', fontFamily: "'Cormorant Garamond', serif", lineHeight: '1.2' }}>
              This is what changes.
            </h1>
            <p style={{ fontSize: '16px', color: t.textMuted, fontWeight: '300', margin: 0, animation: 'fadeIn 0.8s ease-out 0.3s backwards' }}>
              When you finally have the right people in your corner.
            </p>
          </div>

          {outcomes.map((o, i) => (
            <div key={i}>
              <div
                ref={refs[i]}
                style={{
                  position: 'relative',
                  padding: '40px 0',
                  opacity: visible[i] ? 1 : 0,
                  transform: visible[i] ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ease-out, transform 0.6s ease-out`,
                }}
              >
                <div style={{ position: 'absolute', top: '10px', left: '-8px', fontSize: '96px', fontWeight: '700', color: t.accent, opacity: 0.12, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif", userSelect: 'none', animation: 'float 6s ease-in-out infinite' }}>
                  {o.num}
                </div>
                <h2 style={{ fontSize: '22px', color: t.text, margin: '0 0 12px 0', fontWeight: '700', position: 'relative' }}>
                  {o.title}
                </h2>
                <p style={{ fontSize: '15px', color: t.textTertiary, lineHeight: '1.7', margin: 0, position: 'relative' }}>
                  {o.body}
                </p>
              </div>
              {i < 2 && (
                <div style={{ height: '1px', background: `linear-gradient(to right, transparent, ${t.accent}, transparent)`, opacity: 0.25 }} />
              )}
            </div>
          ))}

          <div
            ref={featuresRef}
            style={{ marginTop: '80px', opacity: featuresVisible ? 1 : 0, transform: featuresVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out' }}
          >
            <p style={{ fontSize: '11px', color: t.accent, letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 32px 0', textAlign: 'center' }}>
              INSIDE MENTOR
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px 32px', marginBottom: '64px' }}>
              {features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: t.accent, fontSize: '14px', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '15px', color: t.textSecondary }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setStep('paywall')}
              className="btn-primary"
              style={{ width: '100%', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentLight} 100%)`, color: theme === 'dark' ? '#000' : '#fff', border: 'none', borderRadius: '30px', padding: '18px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', marginBottom: '16px', boxShadow: theme === 'dark' ? '0 4px 16px rgba(201, 168, 76, 0.3)' : '0 4px 16px rgba(201, 168, 76, 0.3)' }}
            >
              Show me pricing →
            </button>
            <p style={{ fontSize: '13px', color: t.textMuted, margin: 0 }}>
              Join the people who stopped figuring it out alone.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

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
        ? '1px solid rgba(201, 168, 76, 0.25)'
        : '1px solid rgba(201, 168, 76, 0.25)',
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
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; }}
  >
    {theme === 'dark' ? '☀️' : '🌙'}
  </button>
);

// Global Styles Component
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; overflow-x: hidden; font-weight: 300; line-height: 1.8; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    @keyframes glowPulse {
      0%, 100% { box-shadow: 0 0 20px rgba(201, 168, 76, 0.4), 0 0 40px rgba(201, 168, 76, 0.1); }
      50% { box-shadow: 0 0 40px rgba(201, 168, 76, 0.8), 0 0 80px rgba(201, 168, 76, 0.3); }
    }
    @keyframes pulse-dot {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }

    .gradient-text {
      background: linear-gradient(135deg, #c9a84c 0%, #e8d08a 50%, #c9a84c 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }
    .glass-card {
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.06);
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
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201, 168, 76, 0.35) !important; }
    .btn-primary:active::before { width: 300px; height: 300px; }
    textarea::placeholder, input::placeholder { color: #555; opacity: 1; }
    .noise { display: none; }
  `}</style>
);

export default App;