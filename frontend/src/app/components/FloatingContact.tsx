import React, { useState } from 'react';
import { MessageSquare, Bot, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const FloatingContact = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* WhatsApp Floating Button - Left Side */}
      <div className="fixed bottom-8 left-8 lg:bottom-12 lg:left-12 z-50">
        <div className="relative flex items-center group transition-transform duration-300 hover:-translate-y-1">
          <div className="absolute left-full ml-4 px-4 py-2 bg-white text-[#041d3c] text-sm font-medium rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] opacity-0 pointer-events-none transition-all duration-300 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap border border-[#f4f7fb]">
            WhatsApp Us
          </div>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-[#25D366] text-white flex items-center justify-center rounded-[16px] shadow-[0_8px_30px_rgba(37,211,102,0.3)] transition-colors duration-300"
            aria-label="WhatsApp Us"
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* AI Agent Floating Button & Chatbox - Right Side */}
      <div className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-50 flex flex-col items-end">
        <div className="relative flex items-center justify-end">
          
          {/* AI Chatbox Widget */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-[70px] right-0 w-[320px] sm:w-[350px] bg-white rounded-[16px] shadow-[0_20px_60px_rgba(4,29,60,0.15)] overflow-hidden border border-[#041d3c]/10 flex flex-col origin-bottom-right"
              >
                {/* Header */}
                <div className="bg-[#041d3c] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-[15px]">AI Concierge</h4>
                      <p className="text-white/70 text-[12px] font-medium">Always online</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsChatOpen(false)}
                    className="text-white/70 hover:text-white transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Area */}
                <div className="h-[300px] bg-[#f8fbff] p-4 flex flex-col gap-4 overflow-y-auto">
                  <div className="flex items-start gap-3 w-[85%]">
                    <div className="bg-[#eef4fa] p-3 rounded-[12px] rounded-tl-none text-[#041d3c] text-[13px] font-medium leading-relaxed shadow-sm border border-[#041d3c]/5">
                      Ayubowan! Welcome to Simplifly Finland. I'm your AI Concierge. How can I help you plan your dream luxury journey to Sri Lanka today?
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-[#041d3c]/10">
                  <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="text" 
                      placeholder="Ask me anything..." 
                      className="flex-1 bg-[#f8fbff] border border-[#041d3c]/10 rounded-[12px] px-4 py-2.5 text-[#041d3c] text-[13px] font-medium focus:outline-none focus:border-[#041d3c] transition-colors"
                    />
                    <button 
                      type="submit" 
                      className="bg-[#041d3c] text-white p-2.5 rounded-[12px] hover:bg-[#026fe6] transition-colors shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="group transition-transform duration-300 hover:-translate-y-1 relative flex items-center">
            <div className="absolute right-full mr-4 px-5 py-2.5 bg-white text-[#041d3c] text-sm font-medium rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] opacity-0 pointer-events-none transition-all duration-300 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap border border-[#f4f7fb]">
              Chat with AI Agent
            </div>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`w-14 h-14 flex items-center justify-center rounded-[16px] shadow-[0_8px_30px_rgba(4,29,60,0.25)] transition-all duration-300 ${isChatOpen ? 'bg-white text-[#041d3c]' : 'bg-[#041d3c] text-white hover:bg-[#026fe6]'}`}
              aria-label="AI Chatbox"
            >
              {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};