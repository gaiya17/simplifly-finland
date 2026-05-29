import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "What services does Simplifly Finland Oy offer?",
    answer: "At Simplifly Finland Oy, we provide a wide range of travel services to make your holiday seamless and unforgettable:\n\n• Tailor-made tour packages\n• Hotel bookings\n• Airport transfers\n• Guided tours to explore the best attractions in Sri Lanka"
  },
  {
    id: 2,
    question: "Can I customize my travel itinerary?",
    answer: "At Simplifly Finland, we specialize in crafting personalized itineraries tailored to your preferences, interests, and budget, ensuring a unique and unforgettable travel experience."
  },
  {
    id: 3,
    question: "What is the best time to visit Sri Lanka?",
    answer: "Sri Lanka is a year-round destination, but the ideal time to visit depends on the region:\n\n• West & South Coasts + Hill Country: November to April\n• East Coast: May to September\n\nWith its diverse climate, you can plan your trip according to your preferred region and activities for a perfect holiday experience."
  },
  {
    id: 4,
    question: "Do you provide airport pickup and drop-off?",
    answer: "We offer reliable Airport Transfer services to ensure a smooth and stress-free start to your journey. Upon arrival, the Simplifly Finland Team will warmly welcome you at the airport in a traditional Sri Lankan manner, making your holiday experience special from the very first moment."
  },
  {
    id: 5,
    question: "How can I book a tour with Simplifly Finland Oy?",
    answer: "Booking your dream holiday is easy! Simply contact us via our website, email, or phone, and share your travel preferences. Our friendly team will guide you through the process and help you plan the perfect tour tailored just for you."
  },
  {
    id: 6,
    question: "Are your tours suitable for families?",
    answer: "All Simplifly Finland tour packages are thoughtfully designed to suit families, couples, solo travelers, honeymooners and groups, ensuring comfort, flexibility, and memorable experiences for everyone."
  },
  {
    id: 7,
    question: "What safety measures Simplifly Finland OY follow?",
    answer: "Simplifly Finland proudly operates as a fully accredited travel agency, holding registrations with the PATA Finland Chapter, the Finnish Competition and Consumer Authority (KKV), and the Association of Finnish Travel Industry (SMAL) - ensuring reliability, professionalism, and trusted service for every traveler.\n\nYour safety is our top priority. We work exclusively with licensed guides, ensure well-maintained, sanitized vehicles, and strictly follow all essential safety protocols to guarantee you a secure and worry-free travel experience."
  },
  {
    id: 8,
    question: "Do you provide Travel Insurance?",
    answer: "Travel insurance is not included in the package; however, we highly recommend obtaining one to ensure a worry-free and secure journey."
  },
  {
    id: 9,
    question: "Do I need to pay in full at the time of booking?",
    answer: "No, you don’t! As a premium travel company, we offer flexible payment options to make your holiday planning easier and more convenient. For more details or personalized assistance, please contact Team Simplifly - we’re here to help you every step of the way."
  },
  {
    id: 10,
    question: "Can I cancel or reschedule my trip?",
    answer: "Yes, you can! We understand that plans may change, so you’re welcome to amend your travel dates according to your requirements. Please note that all changes and cancellations are subject to our cancellation policy and availability at the time of the request."
  }
];

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1); // Default open the first one

  return (
    <section className="bg-transparent py-[100px] w-full">
      <div className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[48px] leading-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-600 text-lg font-normal max-w-2xl">
            From quick answers to detailed guidance, we’re here to ensure you feel confident, informed, and ready to plan your perfect holiday with Simplifly Finland Oy.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden hover:-translate-y-2 hover:shadow-[0_12px_35px_rgba(4,29,60,0.06)] transition-all duration-300 ease-out border border-transparent cursor-pointer"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
              >
                <div className="p-6 md:px-8 md:py-6 flex items-start justify-between group">
                  <h3 className={`text-base md:text-lg font-medium transition-colors duration-300 mt-1 ${isOpen ? 'text-[#041d3c]' : 'text-gray-800 group-hover:text-[#041d3c]'}`}>
                    {faq.question}
                  </h3>
                  <div className="ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 bg-[#041d3c] text-white">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <div
                  className={`px-6 md:px-8 transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[800px] opacity-100 pb-6 md:pb-8' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-700 text-sm md:text-base font-normal leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}