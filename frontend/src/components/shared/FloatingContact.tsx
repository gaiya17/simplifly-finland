import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { chatbotApi } from '../../lib/chatbotApi';

// ── FLOW DEFINITION ────────────────────────────────────────────────────────────
interface FlowNode {
  id: string;
  from: 'bot' | 'user';
  message: string;
  options?: { label: string; next: string }[];
  action?: 'whatsapp' | 'restart';
  whatsappText?: string;
}

const WA_NUMBER = '94715233845';

const FLOW: Record<string, FlowNode> = {
  start: {
    id: 'start',
    from: 'bot',
    message: '👋 Ayubowan! Welcome to Simplifly Finland.\n\nI\'m your travel concierge. How can I help you today?',
    options: [
      { label: '🌴 Sri Lanka Tours', next: 'sriLanka' },
      { label: '🐠 Maldives Resorts', next: 'maldives' },
      { label: '✈️ Sri Lanka + Maldives', next: 'combo' },
      { label: '📞 Talk to our team', next: 'contact' },
    ],
  },

  // ── SRI LANKA ────────────────────────────────────────────────────────────────
  sriLanka: {
    id: 'sriLanka',
    from: 'bot',
    message: '🇱🇰 Great choice! What kind of Sri Lanka experience are you looking for?',
    options: [
      { label: '🏔️ Adventure & Nature', next: 'sl_adventure' },
      { label: '🏛️ Culture & Heritage', next: 'sl_culture' },
      { label: '🐘 Wildlife Safari', next: 'sl_wildlife' },
      { label: '👨‍👩‍👧 Family Tours', next: 'sl_family' },
      { label: '💑 Romantic / Honeymoon', next: 'sl_romantic' },
      { label: '🌿 Wellness & Ayurveda', next: 'sl_wellness' },
    ],
  },
  sl_adventure: {
    id: 'sl_adventure',
    from: 'bot',
    message: '🏔️ Adventure & Nature — Whitewater rafting, trekking Ella highlands, and camping under the stars in Sinharaja!\n\nHow many travellers?',
    options: [
      { label: '1–2 People', next: 'sl_budget' },
      { label: '3–5 People', next: 'sl_budget' },
      { label: '6+ People / Group', next: 'sl_budget' },
    ],
  },
  sl_culture: {
    id: 'sl_culture',
    from: 'bot',
    message: '🏛️ Culture & Heritage — Sigiriya Rock, Temple of the Tooth, ancient Anuradhapura, and more!\n\nHow many travellers?',
    options: [
      { label: '1–2 People', next: 'sl_budget' },
      { label: '3–5 People', next: 'sl_budget' },
      { label: '6+ People / Group', next: 'sl_budget' },
    ],
  },
  sl_wildlife: {
    id: 'sl_wildlife',
    from: 'bot',
    message: '🐘 Wildlife Safari — Spot leopards in Yala, witness the Minneriya Elephant Gathering, and explore national parks!\n\nHow many travellers?',
    options: [
      { label: '1–2 People', next: 'sl_budget' },
      { label: '3–5 People', next: 'sl_budget' },
      { label: '6+ People / Group', next: 'sl_budget' },
    ],
  },
  sl_family: {
    id: 'sl_family',
    from: 'bot',
    message: '👨‍👩‍👧 Family Tours — Kid-friendly resorts, turtle hatcheries, elephant encounters, and golden beaches!\n\nHow many travellers?',
    options: [
      { label: '3–4 People', next: 'sl_budget' },
      { label: '5–7 People', next: 'sl_budget' },
      { label: '8+ People', next: 'sl_budget' },
    ],
  },
  sl_romantic: {
    id: 'sl_romantic',
    from: 'bot',
    message: '💑 Romantic Tours — Private beach dinners, tea-country sunsets, Galle Fort evenings, and boutique hideaways!\n\nHow many travellers?',
    options: [
      { label: '2 People (Couple)', next: 'sl_budget' },
    ],
  },
  sl_wellness: {
    id: 'sl_wellness',
    from: 'bot',
    message: '🌿 Wellness & Ayurveda — Ancient healing retreats, Panchakarma detox, ocean-side yoga, and herbal cuisine!\n\nHow many travellers?',
    options: [
      { label: '1–2 People', next: 'sl_budget' },
      { label: '3–5 People', next: 'sl_budget' },
    ],
  },
  sl_budget: {
    id: 'sl_budget',
    from: 'bot',
    message: '💰 What is your approximate budget per person?',
    options: [
      { label: '€500 – €1,000', next: 'sl_duration' },
      { label: '€1,000 – €2,000', next: 'sl_duration' },
      { label: '€2,000 – €3,500', next: 'sl_duration' },
      { label: '€3,500+', next: 'sl_duration' },
    ],
  },
  sl_duration: {
    id: 'sl_duration',
    from: 'bot',
    message: '📅 How long would you like the trip to be?',
    options: [
      { label: '3–5 Days', next: 'sl_ready' },
      { label: '6–9 Days', next: 'sl_ready' },
      { label: '10–14 Days', next: 'sl_ready' },
      { label: '15+ Days', next: 'sl_ready' },
    ],
  },
  sl_ready: {
    id: 'sl_ready',
    from: 'bot',
    message: '✅ Perfect! We have everything we need to craft your ideal Sri Lanka itinerary.\n\nOur travel experts are ready to build your personalised tour. Would you like to connect with us on WhatsApp?',
    options: [
      { label: '💬 Yes, chat on WhatsApp!', next: 'wa_srilanka' },
      { label: '🔙 Start over', next: 'restart' },
    ],
  },
  wa_srilanka: {
    id: 'wa_srilanka',
    from: 'bot',
    message: '🎉 Redirecting you to WhatsApp to speak with our Sri Lanka travel expert right now!',
    action: 'whatsapp',
    whatsappText: 'Hi! I\'m interested in a Sri Lanka tour package. Can you help me plan my trip?',
  },

  // ── MALDIVES ─────────────────────────────────────────────────────────────────
  maldives: {
    id: 'maldives',
    from: 'bot',
    message: '🐠 The Maldives! What kind of resort experience are you dreaming of?',
    options: [
      { label: '🏝️ Overwater Villa', next: 'mv_detail' },
      { label: '💑 Honeymoon / Romantic', next: 'mv_detail' },
      { label: '👨‍👩‍👧 Family Resort', next: 'mv_detail' },
      { label: '🤿 Diving & Snorkeling', next: 'mv_detail' },
      { label: '💆 Luxury Wellness Spa', next: 'mv_detail' },
    ],
  },
  mv_detail: {
    id: 'mv_detail',
    from: 'bot',
    message: '🌊 Wonderful! How many nights are you thinking?',
    options: [
      { label: '3–5 Nights', next: 'mv_budget' },
      { label: '6–8 Nights', next: 'mv_budget' },
      { label: '9–12 Nights', next: 'mv_budget' },
      { label: '12+ Nights', next: 'mv_budget' },
    ],
  },
  mv_budget: {
    id: 'mv_budget',
    from: 'bot',
    message: '💰 What is your budget per person for the Maldives stay?',
    options: [
      { label: '€1,500 – €3,000', next: 'mv_ready' },
      { label: '€3,000 – €5,000', next: 'mv_ready' },
      { label: '€5,000 – €8,000', next: 'mv_ready' },
      { label: '€8,000+', next: 'mv_ready' },
    ],
  },
  mv_ready: {
    id: 'mv_ready',
    from: 'bot',
    message: '✅ Excellent! We can match you with the perfect Maldivian resort at the right price.\n\nConnect with our Maldives specialist on WhatsApp?',
    options: [
      { label: '💬 Yes, chat on WhatsApp!', next: 'wa_maldives' },
      { label: '🔙 Start over', next: 'restart' },
    ],
  },
  wa_maldives: {
    id: 'wa_maldives',
    from: 'bot',
    message: '🎉 Connecting you with our Maldives specialist now!',
    action: 'whatsapp',
    whatsappText: 'Hi! I\'m interested in a Maldives resort package. Can you help me choose the perfect resort?',
  },

  // ── COMBO ─────────────────────────────────────────────────────────────────────
  combo: {
    id: 'combo',
    from: 'bot',
    message: '✈️ The ultimate combo! Experience Sri Lanka\'s culture + the Maldives\' paradise in one trip.\n\nHow many travellers?',
    options: [
      { label: '2 People', next: 'combo_duration' },
      { label: '3–5 People', next: 'combo_duration' },
      { label: '6+ People', next: 'combo_duration' },
    ],
  },
  combo_duration: {
    id: 'combo_duration',
    from: 'bot',
    message: '📅 How many total days for both destinations?',
    options: [
      { label: '8–10 Days', next: 'combo_ready' },
      { label: '11–14 Days', next: 'combo_ready' },
      { label: '15+ Days', next: 'combo_ready' },
    ],
  },
  combo_ready: {
    id: 'combo_ready',
    from: 'bot',
    message: '✅ A Sri Lanka + Maldives combo is one of our most popular packages!\n\nSpeak to our expert on WhatsApp to get a tailored quote?',
    options: [
      { label: '💬 Yes, WhatsApp me a quote!', next: 'wa_combo' },
      { label: '🔙 Start over', next: 'restart' },
    ],
  },
  wa_combo: {
    id: 'wa_combo',
    from: 'bot',
    message: '🎉 Connecting you now for your Sri Lanka + Maldives package!',
    action: 'whatsapp',
    whatsappText: 'Hi! I\'m interested in a Sri Lanka + Maldives combination package. Can you help me plan it?',
  },

  // ── CONTACT ──────────────────────────────────────────────────────────────────
  contact: {
    id: 'contact',
    from: 'bot',
    message: '📞 Our team is available to help you plan the perfect journey!\n\nHow would you like to reach us?',
    options: [
      { label: '💬 WhatsApp (fastest!)', next: 'wa_general' },
      { label: '📧 Email us', next: 'email' },
      { label: '🔙 Back to main menu', next: 'restart' },
    ],
  },
  wa_general: {
    id: 'wa_general',
    from: 'bot',
    message: '🎉 Opening WhatsApp to connect you with our team right now!',
    action: 'whatsapp',
    whatsappText: 'Hi! I\'d like to know more about your travel packages to Sri Lanka and the Maldives.',
  },
  email: {
    id: 'email',
    from: 'bot',
    message: '📧 You can reach us at:\n\n🇫🇮 sales@simpliflyfinland.fi\n🇱🇰 sales@simpliflysrilanka.com\n🏝️ sales@simpliflymaldives.com\n\nOr chat directly on WhatsApp for the fastest reply!',
    options: [
      { label: '💬 Switch to WhatsApp', next: 'wa_general' },
      { label: '🔙 Main Menu', next: 'restart' },
    ],
  },
  restart: {
    id: 'restart',
    from: 'bot',
    message: '👋 Ayubowan! Welcome back. How can I help you plan your dream journey?',
    options: [
      { label: '🌴 Sri Lanka Tours', next: 'sriLanka' },
      { label: '🐠 Maldives Resorts', next: 'maldives' },
      { label: '✈️ Sri Lanka + Maldives', next: 'combo' },
      { label: '📞 Talk to our team', next: 'contact' },
    ],
  },
};

interface Message {
  from: 'bot' | 'user';
  text: string;
}

export const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [flow, setFlow] = useState<Record<string, FlowNode>>(FLOW);
  const [currentNode, setCurrentNode] = useState<FlowNode | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic flow from backend on mount
  useEffect(() => {
    const loadFlow = async () => {
      try {
        const dynamicFlow = await chatbotApi.getFlow();
        if (Object.keys(dynamicFlow).length > 0) {
          setFlow(dynamicFlow as Record<string, FlowNode>);
        }
      } catch (err) {
        console.error("Failed to load dynamic chatbot flow, using fallback.", err);
      }
    };
    loadFlow();
  }, []);

  const triggerBot = (node: FlowNode, delay = 0) => {
    if (!node) return;
    setShowOptions(false);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: node.message }]);
      setCurrentNode(node);
      if (node.action === 'whatsapp' && node.whatsappText) {
        setTimeout(() => setShowOptions(true), 800);
      } else {
        setTimeout(() => setShowOptions(true), 300);
      }
    }, delay || 900);
  };

  // Initialize
  useEffect(() => {
    if (isOpen && messages.length === 0 && flow['start']) {
      triggerBot(flow['start']);
    }
  }, [isOpen, flow]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showOptions]);


  const handleOption = (option: { label: string; next: string }) => {
    // Show user selection as a bubble
    setMessages(prev => [...prev, { from: 'user', text: option.label }]);
    setShowOptions(false);

    if (option.next === 'restart') {
      triggerBot(flow['restart'] || flow['start'], 600);
      return;
    }
    const next = flow[option.next];
    if (next) {
      if (next.action === 'whatsapp' && next.whatsappText) {
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(next.whatsappText)}`, '_blank');
      }
      triggerBot(next, 600);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setShowOptions(false);
    setIsTyping(false);
    setTimeout(() => triggerBot(flow['start'] || flow['restart'] || Object.values(flow)[0]), 200);
  };

  return (
    <>
      {/* ── WhatsApp floating button (left) ── */}
      <div className="fixed bottom-8 left-6 lg:bottom-10 lg:left-10 z-50">
        <div className="relative flex items-center group">
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-white text-[#041d3c] text-[12px] font-semibold rounded-[10px] shadow-lg opacity-0 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap border border-gray-100">
            WhatsApp Us
          </div>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Us"
            className="w-[52px] h-[52px] bg-gradient-to-br from-[#25D366] to-[#128c7e] text-white flex items-center justify-center rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* ── Chatbot (right) ── */}
      <div className="fixed bottom-8 right-6 lg:bottom-10 lg:right-10 z-50 flex flex-col items-end">

        {/* Chat window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="mb-4 w-[340px] sm:w-[370px] bg-white rounded-[20px] shadow-[0_24px_80px_rgba(4,29,60,0.18)] overflow-hidden border border-[#041d3c]/8 flex flex-col origin-bottom-right"
              style={{ maxHeight: '520px' }}
            >
              {/* Header */}
              <div className="bg-[#041d3c] px-5 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                    {/* Replace the src below with your SVG path */}
                    <img src="/images/simplifly-bird-logo.svg" alt="Simplifly" className="w-[90%] h-[90%] object-contain" />
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold text-[14px] leading-none">Travel Concierge</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-white/55 text-[11px] font-medium">Always online · Simplifly Finland</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="text-white/40 hover:text-white transition-colors p-1"
                    title="Start over"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/40 hover:text-white transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-[#f8fafc]" style={{ minHeight: 0 }}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.from === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-black overflow-hidden flex items-center justify-center shrink-0 mr-2 mt-0.5">
                        {/* Replace the src below with your SVG path */}
                        <img src="/images/simplifly-bird-logo.svg" alt="Bot" className="w-[90%] h-[90%] object-contain" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] px-4 py-3 rounded-[14px] text-[13px] font-medium leading-[1.65] whitespace-pre-line ${
                        msg.from === 'bot'
                          ? 'bg-white text-[#041d3c] shadow-[0_2px_12px_rgba(4,29,60,0.07)] border border-[#041d3c]/6 rounded-tl-[4px]'
                          : 'bg-[#1a84ff] text-white rounded-tr-[4px]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-7 h-7 rounded-[8px] bg-[#041d3c] flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="8" r="4"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
                      </svg>
                    </div>
                    <div className="bg-white border border-[#041d3c]/6 shadow-sm px-4 py-3 rounded-[14px] rounded-tl-[4px] flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#041d3c]/30 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Options */}
              <AnimatePresence>
                {showOptions && currentNode?.options && Array.isArray(currentNode.options) && currentNode.options.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4 pt-2 bg-white border-t border-[#041d3c]/6 shrink-0 space-y-2"
                  >
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Choose an option</p>
                    {currentNode.options.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => handleOption(opt as any)}
                        className="w-full flex items-center justify-between gap-2 text-left px-3.5 py-2.5 rounded-[11px] border border-[#041d3c]/10 bg-[#f8fafc] hover:bg-[#041d3c] hover:text-white hover:border-[#041d3c] text-[#041d3c] text-[12.5px] font-semibold transition-all duration-200 group"
                      >
                        <span>{opt.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 shrink-0" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* WhatsApp action footer */}
              <AnimatePresence>
                {showOptions && currentNode?.action === 'whatsapp' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-4 pb-4 bg-white space-y-2"
                  >
                    <a
                      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(currentNode.whatsappText || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white rounded-[12px] py-3 font-extrabold text-[12px] uppercase tracking-wider transition-all duration-300 hover:shadow-[0_8px_20px_rgba(7,94,84,0.3)]"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Open WhatsApp
                    </a>
                    <button
                      onClick={handleReset}
                      className="w-full text-center text-[11px] font-semibold text-gray-400 hover:text-[#041d3c] transition-colors py-1"
                    >
                      ↩ Start over
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <div className="relative flex items-center justify-end group">
          {!isOpen && (
            <div className="absolute right-full mr-3 px-3 py-1.5 bg-white text-[#041d3c] text-[12px] font-semibold rounded-[10px] shadow-lg opacity-0 pointer-events-none transition-all duration-300 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap border border-gray-100">
              Plan Your Trip
            </div>
          )}
          <button
            onClick={() => setIsOpen(prev => !prev)}
            aria-label="Open travel chatbot"
            className={`w-[52px] h-[52px] flex items-center justify-center rounded-full shadow-[0_8px_28px_rgba(4,29,60,0.22)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden ${
              isOpen ? 'bg-white text-[#041d3c] border border-[#041d3c]/10' : 'bg-[#041d3c] text-white'
            }`}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="chat" className="w-full h-full flex items-center justify-center" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  {/* Replace the src below with your SVG path */}
                  <img src="/images/simplifly-bird-logo.svg" alt="Chat" className="w-[90%] h-[90%] object-contain rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </>
  );
};