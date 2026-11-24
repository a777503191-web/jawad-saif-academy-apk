import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Mic, MicOff, Volume2, Award, Settings, Sparkles, CheckCircle2, RotateCcw, ArrowRight, Lock } from 'lucide-react';

interface ArabicLetter {
  id: number;
  char: string;
  name: string;
  key: string;
  word: string;
  aliases: string[];
}

const ARABIC_LETTERS: ArabicLetter[] = [
  { id: 1, char: 'أ', name: 'ألف', key: 'a', word: 'أرنب', aliases: ['الف', 'ألف', 'أ', 'ا'] },
  { id: 2, char: 'ب', name: 'باء', key: 'b', word: 'بجعة', aliases: ['باء', 'با', 'ب'] },
  { id: 3, char: 'ت', name: 'تاء', key: 'c', word: 'تفاحة', aliases: ['تاء', 'تا', 'ت'] },
  { id: 4, char: 'ث', name: 'ثاء', key: 'd', word: 'ثعلب', aliases: ['ثاء', 'ثا', 'ث'] },
  { id: 5, char: 'ج', name: 'جيم', key: 'e', word: 'جمل', aliases: ['جيم', 'ج'] },
  { id: 6, char: 'ح', name: 'حاء', key: 'f', word: 'حمامة', aliases: ['حاء', 'حا', 'ح'] },
  { id: 7, char: 'خ', name: 'خاء', key: 'g', word: 'خروف', aliases: ['خاء', 'خا', 'خ'] },
  { id: 8, char: 'د', name: 'دال', key: 'h', word: 'دجاجة', aliases: ['دال', 'د'] },
  { id: 9, char: 'ذ', name: 'ذال', key: 'i', word: 'ذئب', aliases: ['ذال', 'ذ'] },
  { id: 10, char: 'ر', name: 'راء', key: 'j', word: 'رمان', aliases: ['راء', 'را', 'ر'] },
  { id: 11, char: 'ز', name: 'زاي', key: 'k', word: 'زرافة', aliases: ['زاي', 'زين', 'ز'] },
  { id: 12, char: 'س', name: 'سين', key: 'l', word: 'سمكة', aliases: ['سين', 'س'] },
  { id: 13, char: 'ش', name: 'شين', key: 'm', word: 'شمس', aliases: ['شين', 'ش'] },
  { id: 14, char: 'ص', name: 'صاد', key: 'n', word: 'صقر', aliases: ['صاد', 'ص'] },
  { id: 15, char: 'ض', name: 'ضاد', key: 'o', word: 'ضفدع', aliases: ['ضاد', 'ض'] },
  { id: 16, char: 'ط', name: 'طاء', key: 'p', word: 'طائرة', aliases: ['طاء', 'طا', 'ط'] },
  { id: 17, char: 'ظ', name: 'ظاء', key: 'q', word: 'ظرف', aliases: ['ظاء', 'ظا', 'ظ'] },
  { id: 18, char: 'ع', name: 'عين', key: 'r', word: 'عصفور', aliases: ['عين', 'ع'] },
  { id: 19, char: 'غ', name: 'غين', key: 's', word: 'غراب', aliases: ['غين', 'غ'] },
  { id: 20, char: 'ف', name: 'فاء', key: 't', word: 'فيل', aliases: ['فاء', 'فا', 'ف'] },
  { id: 21, char: 'ق', name: 'قاف', key: 'u', word: 'قرد', aliases: ['قاف', 'ق'] },
  { id: 22, char: 'ك', name: 'كاف', key: 'v', word: 'كلب', aliases: ['كاف', 'ك'] },
  { id: 23, char: 'ل', name: 'لام', key: 'w', word: 'لقلق', aliases: ['لام', 'ل'] },
  { id: 24, char: 'م', name: 'ميم', key: 'x', word: 'موز', aliases: ['ميم', 'م'] },
  { id: 25, char: 'ن', name: 'نون', key: 'y', word: 'نعامة', aliases: ['نون', 'ن'] },
  { id: 26, char: 'هـ', name: 'هاء', key: 'z', word: 'هدهد', aliases: ['هاء', 'ها', 'ه'] },
  { id: 27, char: 'و', name: 'واو', key: 'zy', word: 'وردة', aliases: ['واو', 'و'] },
  { id: 28, char: 'ي', name: 'ياء', key: 'zz', word: 'يد', aliases: ['ياء', 'يا', 'ي'] },
];

const ARABIC_NUMBERS = [
  { num: 1, ar: '١', name: 'واحد', aliases: ['واحد', '1', '١'] },
  { num: 2, ar: '٢', name: 'اثنان', aliases: ['اثنان', 'اتنين', 'اثنين', '2', '٢'] },
  { num: 3, ar: '٣', name: 'ثلاثة', aliases: ['ثلاثة', 'تلاتة', '3', '٣'] },
  { num: 4, ar: '٤', name: 'أربعة', aliases: ['أربعة', 'اربعة', '4', '٤'] },
  { num: 5, ar: '٥', name: 'خمسة', aliases: ['خمسة', '5', '٥'] },
  { num: 6, ar: '٦', name: 'ستة', aliases: ['ستة', '6', '٦'] },
  { num: 7, ar: '٧', name: 'سبعة', aliases: ['سبعة', '7', '٧'] },
  { num: 8, ar: '٨', name: 'ثمانية', aliases: ['ثمانية', 'تمانية', '8', '٨'] },
  { num: 9, ar: '٩', name: 'تسعة', aliases: ['تسعة', '9', '٩'] },
  { num: 10, ar: '١٠', name: 'عشرة', aliases: ['عشرة', '10', '١٠'] },
];

const SAIF_MOTIVATION_LINES = [
  "أنا سيف! هيا يا جواد أخي نتعلم معاً، لا تترك التعليم.. سيحبني أبي أكثر منك!",
  "لقد تعلمت أمس أكثر منك يا جواد، وأعطاني أبي اليوم هدية جميلة! هيا أرني شطارتك!",
  "انظر يا جواد ما هذا الحرف؟ انطقه بصوت عالٍ حتى نكسب هدية أبي!",
  "ممتاز يا بطل! استمر هكذا يا جواد، أبي فخور بنا جداً!",
  "هيا يا جواد، من يتعلم أكثر اليوم يحصل على النجمة الذهبية من أبي!"
];

export default function App() {
  const [stageType, setStageType] = useState<'maze' | 'letters' | 'numbers' | 'dialog'>('dialog');
  const [mazeLevel, setMazeLevel] = useState<number>(1);
  const [letterIdx, setLetterIdx] = useState<number>(0);
  const [numberIdx, setNumberIdx] = useState<number>(0);
  const [stars, setStars] = useState<number>(() => Number(localStorage.getItem('jawad_stars') || 0));
  const [dailyLimitMode, setDailyLimitMode] = useState<boolean>(false);
  const [dailyCompletedCount, setDailyCompletedCount] = useState<number>(0);
  const [showParentModal, setShowParentModal] = useState<boolean>(false);

  const [saifText, setSaifText] = useState<string>(SAIF_MOTIVATION_LINES[0]);
  const [jawadTranscript, setJawadTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'retry'>('idle');
  const [traceProgress, setTraceProgress] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);

  useEffect(() => {
    localStorage.setItem('jawad_stars', String(stars));
  }, [stars]);

  const playSfx = (file: string) => {
    try {
      const audio = new Audio(`./assets/${file}`);
      audio.play().catch(() => {});
    } catch {}
  };

  const speakSaif = (text: string) => {
    setSaifText(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ar-SA';
      utter.rate = 0.92;
      utter.pitch = 1.25;
      window.speechSynthesis.speak(utter);
    }
  };

  const celebrateSuccess = (nextAction: () => void) => {
    setFeedbackStatus('correct');
    setStars((s) => s + 1);
    setDailyCompletedCount((c) => c + 1);
    playSfx('applause_greatjob.ogg');
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    speakSaif('أحسنت يا جواد أخي! إجابة صحيحة ورائعة! هيا للسؤال التالي!');
    setTimeout(() => {
      setFeedbackStatus('idle');
      setJawadTranscript('');
      setTraceProgress(0);
      nextAction();
    }, 2600);
  };

  const startMicRecognition = (expectedAliases: string[], onSuccess: () => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speakSaif('اضغط على زر التأكيد إذا نطقت الحرف بشكل صحيح يا جواد!');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    setIsListening(true);
    setFeedbackStatus('idle');
    recognition.start();

    recognition.onresult = (event: any) => {
      setIsListening(false);
      const spoken = Array.from(event.results[0])
        .map((r: any) => r.transcript.trim())
        .join(' ');
      setJawadTranscript(spoken);

      const matched = expectedAliases.some((alias) => spoken.includes(alias));
      if (matched) {
        celebrateSuccess(onSuccess);
      } else {
        setFeedbackStatus('retry');
        playSfx('wrong.ogg');
        speakSaif('حاول مرة أخرى يا جواد أخي، ركز وانطقها بصوت واضح!');
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    ctx.beginPath();
    ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffd700';
    ctx.shadowColor = '#d4af37';
    ctx.shadowBlur = 10;
    ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctx.stroke();

    setTraceProgress((prev) => {
      const next = Math.min(100, prev + 1.6);
      if (next >= 100 && feedbackStatus !== 'correct') {
        isDrawing.current = false;
        if (stageType === 'maze') {
          celebrateSuccess(() => setMazeLevel((m) => (m < 66 ? m + 1 : 1)));
        } else if (stageType === 'letters') {
          speakSaif(`رائع يا جواد! رسمت حرف ${ARABIC_LETTERS[letterIdx].name}! الآن قل لي بصوتك: ما هذا الحرف؟`);
        } else if (stageType === 'numbers') {
          speakSaif(`ممتاز يا جواد! رسمت رقم ${ARABIC_NUMBERS[numberIdx].name}! انطقه بصوتك الآن!`);
        }
      }
      return next;
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setTraceProgress(0);
  };

  useEffect(() => {
    clearCanvas();
  }, [stageType, mazeLevel, letterIdx, numberIdx]);

  const currentLetter = ARABIC_LETTERS[letterIdx];
  const currentNumber = ARABIC_NUMBERS[numberIdx];
  const isLockedByDailyLimit = dailyLimitMode && dailyCompletedCount >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050814] via-[#0a0f24] to-[#050814] text-white flex flex-col justify-between p-3 sm:p-5">
      <header className="flex items-center justify-between bg-[#111936]/90 border border-[#d4af37]/50 rounded-2xl px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#aa8822] to-[#ffd700] flex items-center justify-center text-[#050814] font-black text-xl shadow">
            ج
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-[#ffd700]">أكاديمية جواد وسيف</h1>
            <p className="text-xs text-slate-300">رحلة التحدي والذكاء والهدايا</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#050814] border border-[#ffd700] px-3 py-1.5 rounded-full">
            <Award className="w-5 h-5 text-[#ffd700]" />
            <span className="font-black text-[#ffd700] text-base">{stars}</span>
          </div>
          <button
            onClick={() => setShowParentModal(true)}
            className="p-2 rounded-xl bg-[#1b264f] hover:bg-[#26356b] border border-[#d4af37]/40"
            title="إعدادات الأب"
          >
            <Settings className="w-5 h-5 text-[#ffd700]" />
          </button>
        </div>
      </header>

      <section className="my-3 bg-gradient-to-r from-[#111936] to-[#1b264f] border-2 border-[#d4af37] rounded-3xl p-4 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src="./assets/kid3_gift.png"
            alt="سيف"
            className="w-20 h-28 object-contain drop-shadow-[0_0_12px_rgba(255,215,0,0.5)] animate-bounce"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="bg-[#ffd700] text-[#050814] text-xs font-black px-3 py-0.5 rounded-full">
                أخوك سيف يتحدث إليك:
              </span>
              <button
                onClick={() => speakSaif(saifText)}
                className="flex items-center gap-1 text-xs bg-[#050814]/70 border border-[#ffd700]/50 px-2.5 py-1 rounded-full text-[#ffd700]"
              >
                <Volume2 className="w-4 h-4" /> اسمع سيف
              </button>
            </div>
            <p className="text-sm sm:text-base font-bold leading-relaxed text-amber-100">
              "{saifText}"
            </p>
            {jawadTranscript && (
              <div className="mt-2 text-xs bg-[#050814]/80 border border-emerald-400/50 rounded-xl px-3 py-1.5 text-emerald-300">
                صوت جواد: <b>{jawadTranscript}</b>
              </div>
            )}
          </div>
          <img
            src="./assets/kid6_nogift.png"
            alt="جواد"
            className="w-20 h-28 object-contain hidden sm:block"
          />
        </div>
      </section>

      <nav className="grid grid-cols-4 gap-2 mb-3">
        <button
          onClick={() => {
            setStageType('dialog');
            speakSaif(SAIF_MOTIVATION_LINES[0]);
          }}
          className={`py-2.5 px-2 rounded-2xl font-extrabold text-xs sm:text-sm border transition ${
            stageType === 'dialog'
              ? 'bg-gradient-to-r from-[#aa8822] to-[#ffd700] text-[#050814] border-[#ffd700]'
              : 'bg-[#111936] text-slate-200 border-slate-700'
          }`}
        >
          🗣️ تحدي سيف وجواد
        </button>
        <button
          onClick={() => {
            setStageType('maze');
            speakSaif('هيا يا جواد! حرك إصبعك بدقة على الخط المنقط لتقوية عضلات يدك!');
          }}
          className={`py-2.5 px-2 rounded-2xl font-extrabold text-xs sm:text-sm border transition ${
            stageType === 'maze'
              ? 'bg-gradient-to-r from-[#aa8822] to-[#ffd700] text-[#050814] border-[#ffd700]'
              : 'bg-[#111936] text-slate-200 border-slate-700'
          }`}
        >
          ✍️ المتاهات (66)
        </button>
        <button
          onClick={() => {
            setStageType('letters');
            speakSaif(`انظر يا جواد ما هذا الحرف؟ إنه حرف ${currentLetter.name}! ارسمه وانطقه!`);
          }}
          className={`py-2.5 px-2 rounded-2xl font-extrabold text-xs sm:text-sm border transition ${
            stageType === 'letters'
              ? 'bg-gradient-to-r from-[#aa8822] to-[#ffd700] text-[#050814] border-[#ffd700]'
              : 'bg-[#111936] text-slate-200 border-slate-700'
          }`}
        >
          🔤 الحروف (28)
        </button>
        <button
          onClick={() => {
            setStageType('numbers');
            speakSaif(`هيا نعد معاً يا جواد! ما هذا الرقم؟ إنه رقم ${currentNumber.name}!`);
          }}
          className={`py-2.5 px-2 rounded-2xl font-extrabold text-xs sm:text-sm border transition ${
            stageType === 'numbers'
              ? 'bg-gradient-to-r from-[#aa8822] to-[#ffd700] text-[#050814] border-[#ffd700]'
              : 'bg-[#111936] text-slate-200 border-slate-700'
          }`}
        >
          🔢 الأرقام (1-10)
        </button>
      </nav>

      <main className="flex-1 bg-[#111936]/80 border border-[#d4af37]/40 rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
        {isLockedByDailyLimit ? (
          <div className="text-center space-y-3 p-6">
            <Lock className="w-12 h-12 text-[#ffd700] mx-auto" />
            <h3 className="text-xl font-black text-[#ffd700]">أحسنت يا جواد! أنهيت درس اليوم</h3>
            <p className="text-sm text-slate-300">نلتقي غداً مع حرف ورقم جديدين بإذن الله!</p>
          </div>
        ) : stageType === 'dialog' ? (
          <div className="text-center max-w-md w-full space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#050814] border border-[#ffd700] px-4 py-1.5 rounded-full text-sm text-[#ffd700] font-bold">
              <Sparkles className="w-4 h-4" /> سؤال سيف المباشر لجواد
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-2xl border-4 border-[#ffd700] flex flex-col items-center">
              <img
                src={`./assets/letter_${currentLetter.key}.png`}
                alt={currentLetter.name}
                className="h-44 object-contain"
              />
              <span className="mt-2 text-[#050814] font-black text-2xl">
                ما هذا الحرف يا جواد؟
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() =>
                  startMicRecognition(currentLetter.aliases, () =>
                    setLetterIdx((idx) => (idx + 1) % ARABIC_LETTERS.length)
                  )
                }
                className={`flex-1 py-4 px-5 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg transition ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-[#aa8822] to-[#ffd700] text-[#050814]'
                }`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                {isListening ? 'سيف يسمعك الآن... انطق الحرف!' : 'اضغط وتكلم يا جواد'}
              </button>

              <button
                onClick={() =>
                  celebrateSuccess(() => setLetterIdx((idx) => (idx + 1) % ARABIC_LETTERS.length))
                }
                className="py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-5 h-5" /> نطقها صح
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2 px-2">
              <span className="text-sm font-bold text-[#ffd700]">
                {stageType === 'maze' && `المرحلة ${mazeLevel} من 66 — تتبع المسار لتقوية اليد`}
                {stageType === 'letters' && `حرف (${currentLetter.name}) — المرحلة ${letterIdx + 1} من 28`}
                {stageType === 'numbers' && `رقم (${currentNumber.name}) — المرحلة ${numberIdx + 1} من 10`}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#050814] px-3 py-1 rounded-full text-emerald-400 font-bold">
                  الإنجاز: {Math.round(traceProgress)}%
                </span>
                <button
                  onClick={clearCanvas}
                  className="p-1.5 rounded-xl bg-[#050814] border border-slate-600 text-slate-200"
                  title="إعادة الرسم"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative w-full h-64 sm:h-80 bg-white rounded-3xl border-4 border-[#ffd700] overflow-hidden shadow-inner">
              <img
                src={
                  stageType === 'maze'
                    ? `./assets/trace_points_img_${mazeLevel}.png`
                    : stageType === 'letters'
                    ? `./assets/letter_${currentLetter.key}.png`
                    : `./assets/number${currentNumber.num}.png`
                }
                alt="Tracing Guide"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={340}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={() => (isDrawing.current = false)}
                className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
              />
            </div>

            <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-2">
              {stageType !== 'maze' && (
                <button
                  onClick={() =>
                    startMicRecognition(
                      stageType === 'letters' ? currentLetter.aliases : currentNumber.aliases,
                      () => {
                        if (stageType === 'letters') setLetterIdx((i) => (i + 1) % ARABIC_LETTERS.length);
                        else setNumberIdx((i) => (i + 1) % ARABIC_NUMBERS.length);
                      }
                    )
                  }
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#aa8822] to-[#ffd700] text-[#050814] font-black text-sm flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5" /> انطق {stageType === 'letters' ? currentLetter.name : currentNumber.name} بالمايك
                </button>
              )}

              <button
                onClick={() => {
                  if (stageType === 'maze') setMazeLevel((m) => (m < 66 ? m + 1 : 1));
                  if (stageType === 'letters') setLetterIdx((i) => (i + 1) % ARABIC_LETTERS.length);
                  if (stageType === 'numbers') setNumberIdx((i) => (i + 1) % ARABIC_NUMBERS.length);
                }}
                className="py-3 px-5 rounded-2xl bg-[#1b264f] hover:bg-[#283875] border border-[#ffd700]/40 text-[#ffd700] font-bold text-sm flex items-center gap-1"
              >
                المرحلة التالية <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {showParentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111936] border-2 border-[#ffd700] rounded-3xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-black text-[#ffd700]">⚙️ لوحة ضبط الأب (أبو جواد)</h2>
            <p className="text-sm text-slate-300">
              تحكم في وتيرة التعلم اليومية لجواد وسيف:
            </p>
            <label className="flex items-center justify-between bg-[#050814] p-3 rounded-xl border border-slate-700">
              <span className="text-sm font-bold">نظام حرف ورقم واحد يومياً</span>
              <input
                type="checkbox"
                checked={dailyLimitMode}
                onChange={(e) => setDailyLimitMode(e.target.checked)}
                className="w-5 h-5 accent-[#ffd700]"
              />
            </label>
            <div className="bg-[#050814] p-3 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
              <div>• إجمالي نجوم وهدايا جواد: <b className="text-[#ffd700]">{stars} نجمة</b></div>
              <div>• مراحل المتاهات وتقوية اليد: <b>66 مرحلة</b></div>
              <div>• مراحل الحروف العربية: <b>28 حرفاً × 3 مستويات</b></div>
              <div>• مراحل الأرقام العربية: <b>10 أرقام × 3 مستويات</b></div>
            </div>
            <button
              onClick={() => setShowParentModal(false)}
              className="w-full py-3 rounded-xl bg-[#ffd700] text-[#050814] font-black"
            >
              حفظ وإغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
