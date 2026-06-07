import { FileText, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Simplifly Finland',
  description: 'Terms and Conditions including payment, cancellation, and amendment policies for Simplifly Finland Oy.',
};

const tableOfContents = [
  { id: 'booking-cancellation', label: 'Booking & Cancellation' },
  { id: 'payment-methods', label: 'Payment Methods' },
  { id: 'bank-transfer', label: 'Bank / Telegraphic Transfer' },
  { id: 'significant-information', label: 'Significant Information' },
  { id: 'complaints-claims', label: 'Complaints & Claims' },
  { id: 'important-information', label: 'Important Information' },
  { id: 'professional-help', label: 'Professional Help' },
  { id: 'room-availability', label: 'Room Availability' },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">
      {/* ── HERO SECTION ── */}
      <section className="relative w-full h-[40vh] min-h-[350px] flex items-end pb-12 md:pb-16 justify-start overflow-hidden bg-[#041d3c]">
        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.15)_0%,_transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(26,132,255,0.1)_0%,_transparent_65%)] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-center text-center pt-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/10 border border-[#1a84ff]/20 text-white/90 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <FileText className="w-3.5 h-3.5 text-[#1a84ff]" />
            <span>Legal & Compliance</span>
          </div>
          <h1 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  drop-shadow-lg mb-6">
            Terms & Conditions
          </h1>
        </div>
      </section>

      {/* ── MAIN CONTENT (2 Columns) ── */}
      <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-[80px] lg:py-[100px]">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
          
          {/* LEFT: Sticky Table of Contents */}
          <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-[120px] bg-white rounded-[24px] shadow-[0_8px_32px_rgba(4,29,60,0.04)] border border-gray-100 p-8 hidden md:block z-10">
            <h3 className="text-[#041d3c] font-black text-[18px] mb-6">Table of Contents</h3>
            <nav className="flex flex-col gap-1">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="group flex items-center justify-between text-gray-500 hover:text-[#1a84ff] text-[14px] font-medium py-2.5 transition-colors duration-200 border-b border-gray-50 last:border-0"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </a>
              ))}
            </nav>
          </aside>

          {/* RIGHT: Legal Text */}
          <div className="flex-1 w-full max-w-4xl min-w-0 prose prose-lg prose-headings:text-[#041d3c] prose-headings:font-black prose-p:text-gray-600 prose-p:leading-[1.85] prose-p:font-normal prose-li:text-gray-600 prose-li:leading-[1.7] prose-a:text-[#1a84ff] prose-a:no-underline hover:prose-a:underline">
            
            {/* BOOKING & CANCELLATION */}
            <div id="booking-cancellation" className="scroll-mt-[120px]">
              <p>
                The general payment, cancellation and amendment policies that apply to most resorts are shown in the tables below. Though some resorts may have tighter rules because of their various and individual policies.
              </p>
              <p>
                Please inquire with your destination specialist about the resort's actual cancellation and alteration policies.
              </p>
              
              <div className="overflow-x-auto my-8">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 border border-gray-200 font-bold text-[#041d3c] text-[15px]">Time of Booking Confirmation</th>
                      <th className="p-4 border border-gray-200 font-bold text-[#041d3c] text-[15px]">Upon Confirmation</th>
                      <th className="p-4 border border-gray-200 font-bold text-[#041d3c] text-[15px]">Balance Due</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] text-gray-600">
                    <tr className="bg-white">
                      <td className="p-4 border border-gray-200">Bookings under USD 4,000</td>
                      <td className="p-4 border border-gray-200">100% of the Total Invoice</td>
                      <td className="p-4 border border-gray-200">N/A</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 border border-gray-200">1 – 60 Days prior to arrival</td>
                      <td className="p-4 border border-gray-200">75% of the Total Invoice</td>
                      <td className="p-4 border border-gray-200">30 Days prior to guest arrival</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-4 border border-gray-200">60 – 90 Days prior to arrival</td>
                      <td className="p-4 border border-gray-200">50% of the Total Invoice</td>
                      <td className="p-4 border border-gray-200">45 Days prior to guest arrival</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 border border-gray-200">90 Days or more prior to arrival</td>
                      <td className="p-4 border border-gray-200">25% of the Total Invoice</td>
                      <td className="p-4 border border-gray-200">45 Days prior to guest arrival</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto my-8">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 border border-gray-200 font-bold text-[#041d3c] text-[15px]">Bookings Falling on</th>
                      <th className="p-4 border border-gray-200 font-bold text-[#041d3c] text-[15px]">Payment Terms</th>
                      <th className="p-4 border border-gray-200 font-bold text-[#041d3c] text-[15px]">Conditions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] text-gray-600 bg-white">
                    <tr>
                      <td className="p-4 border border-gray-200"><strong>Peak Periods 15 Dec to 31 Dec</strong> and <strong>1 Jan to 15 Jan</strong></td>
                      <td className="p-4 border border-gray-200">100% Payment at the time of Confirmation</td>
                      <td className="p-4 border border-gray-200">Minimum of 7 room Nights must be booked (Varies in different resorts) 100% of the Invoice is chargeable.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-8">
                Any cancellations must be sent in writing to the sales department at Simplifly Finland OY; <a href="mailto:sales@simpliflyfinland.fi">sales@simpliflyfinland.fi</a>
              </p>

              <div className="overflow-x-auto my-8">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 border border-gray-200 font-bold text-[#041d3c] text-[15px]">Time of Booking Cancellation</th>
                      <th className="p-4 border border-gray-200 font-bold text-[#041d3c] text-[15px]">Cancellation Terms</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] text-gray-600">
                    <tr className="bg-white">
                      <td className="p-4 border border-gray-200">Prior to 60 days of arrival or more</td>
                      <td className="p-4 border border-gray-200">Full refund after less administrative fees of US$ 100 as bank charges and taxes</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 border border-gray-200">Prior to 30 – 60 days of arrival</td>
                      <td className="p-4 border border-gray-200">5% of the Invoice chargeable as cancellation fees and administrative fees of US$ 100 as bank charges and taxes</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-4 border border-gray-200">Within 30 days of arrival</td>
                      <td className="p-4 border border-gray-200">100% of the Invoice chargeable as cancellation fees</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-2xl mt-12 mb-6 uppercase text-[#041d3c]">Other Cancellation & No Show Conditions</h3>
              
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <tbody className="text-[14px] text-gray-600">
                    <tr className="bg-white">
                      <td className="p-4 border border-gray-200 font-semibold text-[#041d3c] w-1/2">Any Cancellation falling on peak periods</td>
                      <td className="p-4 border border-gray-200 w-1/2">100% of the Invoice chargeable as cancellation fees</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 border border-gray-200 font-semibold text-[#041d3c]">No shows for any period</td>
                      <td className="p-4 border border-gray-200">100% of the Invoice chargeable as cancellation fees</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAYMENT METHODS */}
            <div id="payment-methods" className="mt-16 scroll-mt-[120px]">
              <h2 className="text-3xl mb-6 uppercase">Payment Methods: Credit Card Payments Using A VISA, Mastercard, Or AMEX Card</h2>
              <p>
                To our below mentioned bank account, all payments must be made in accordance with the pro-forma invoice.
              </p>
              <p>
                On or before the due date, all invoices must be paid in full. Any error on our invoice should be reported to us within three days of receipt; under no circumstances is there any decrease permitted without prior approval or a credit note.
              </p>
              <ul className="list-disc pl-5 my-6 space-y-3">
                <li>Please be aware that all payments made with credit cards will incur "bank processing fees" of an extra 3.5% on the total invoice amount.</li>
                <li>Through our Finland Internet Payment Gateway operated by Stripe Payment, credit card payments can be processed.</li>
                <li>Through our Sri Lanka Internet Payment Gateway operated by Sampath Bank Plc, credit card payments can be processed.</li>
                <li>Once you have made the external remittance, please submit a copy of the remittance advice.</li>
              </ul>
            </div>

            {/* BANK / TELEGRAPHIC TRANSFER */}
            <div id="bank-transfer" className="mt-16 scroll-mt-[120px]">
              <h2 className="text-3xl mb-6 uppercase">Type Of Payment: Bank / Telegraphic Transfer (If You Are Paying Via Bank)</h2>
              <p>
                Telegraphic Transfer is to be made to the Simplifly Lanka (Pvt) Ltd & Simplifly Finland (Pvt) Ltd bank account as follows;
              </p>
              
              <div className="overflow-x-auto my-8">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 border border-gray-200 font-bold text-[#041d3c] text-[15px] w-1/4">Details</th>
                      <th className="p-4 border border-gray-200 font-bold text-[#041d3c] text-[15px] w-3/8">Sri Lanka</th>
                      <th className="p-4 border border-gray-200 font-bold text-[#041d3c] text-[15px] w-3/8">Finland</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] text-gray-600">
                    <tr className="bg-white">
                      <td className="p-4 border border-gray-200 font-semibold text-[#041d3c]">In Favor of</td>
                      <td className="p-4 border border-gray-200">SIMPLIFLY LANKA (PVT) LTD</td>
                      <td className="p-4 border border-gray-200">SIMPLIFLY FINLAND PRIVATE LTD OY</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 border border-gray-200 font-semibold text-[#041d3c]">Beneficiary Bank</td>
                      <td className="p-4 border border-gray-200">Sampath Bank PLC</td>
                      <td className="p-4 border border-gray-200">TURUN SEUDUN OSUUSPANKKI</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-4 border border-gray-200 font-semibold text-[#041d3c]">Beneficiary Bank Address</td>
                      <td className="p-4 border border-gray-200">High Level Rd, Pannipitiya, Sri Lanka</td>
                      <td className="p-4 border border-gray-200">Brahenkatu 11, PL 44, 20101 Turku</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 border border-gray-200 font-semibold text-[#041d3c]">Account No.</td>
                      <td className="p-4 border border-gray-200">5052XXXXXXXX</td>
                      <td className="p-4 border border-gray-200">FI 82 5710 XXXXXXXXXX</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-4 border border-gray-200 font-semibold text-[#041d3c]">SWIFT Code</td>
                      <td className="p-4 border border-gray-200 font-mono text-[13px] bg-gray-100 px-2 py-1 rounded inline-block mt-2">BSAMLKLX</td>
                      <td className="p-4 border border-gray-200 font-mono text-[13px] bg-gray-100 px-2 py-1 rounded inline-block mt-2">OKOYFIHH</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 border border-gray-200 font-semibold text-[#041d3c]">Name of Clearing Bank</td>
                      <td className="p-4 border border-gray-200">Sampath Bank PLC (052)</td>
                      <td className="p-4 border border-gray-200">TURUN SEUDUN OSUUSPANKKI</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-4 border border-gray-200 font-semibold text-[#041d3c]">Clearing Bank Code</td>
                      <td className="p-4 border border-gray-200">7278</td>
                      <td className="p-4 border border-gray-200">571004</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 border border-gray-200 font-semibold text-[#041d3c]">Currency</td>
                      <td className="p-4 border border-gray-200">United States Dollars (US$)</td>
                      <td className="p-4 border border-gray-200">United States Dollars (US$)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <hr className="my-16 border-gray-200" />

            {/* SIGNIFICANT INFORMATIONS */}
            <div id="significant-information" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-3xl mb-6 uppercase">Significant Informations</h2>
              <p>
                There could be some exceptions. Possibly excluding weeks with high demand or times with special event (Peak Season) restrictions.
              </p>
              <p>
                After the cancellation date, processing refunds could take up to 21 days.
              </p>
            </div>

            {/* COMPLAINTS & CLAIMS */}
            <div id="complaints-claims" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-3xl mb-6 uppercase">Complaints & Claims</h2>
              <p>
                If you have any problems while visiting the Sri Lanka, Maldives, Finland or other country you should notify it to Simplifly Finland (Pvt) Ltd in writing before leaving the country, or within three working days of leaving, whichever comes first.
              </p>
              <p>
                For complaints or claims received after the specified time limit, no action will be performed.
              </p>
            </div>

            {/* IMPORTANT INFORMATIONS */}
            <div id="important-information" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-3xl mb-6 uppercase">Important Informations</h2>
              <p>
                You can ask us to set up a conversation with one of our knowledgeable advisers to go through your luxury travel needs in more detail. Except on Sundays, our business hours are from 08:00Hrs to 18:00Hrs every day. For the convenience of our clients who have ongoing appointments, our office is only partially open on Sundays.
              </p>
            </div>

            {/* PROFESSIONAL HELP */}
            <div id="professional-help" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-3xl mb-6 uppercase">Professional Help</h2>
              <p>
                Most of the luxury resorts in our collection have been visited by our knowledgeable travel experts, who are well familiar with the luxury amenities offered there. Please let us know the most convenient time to call you if you need to speak with one of our travel consultants.
              </p>
            </div>

            {/* ROOM AVAILABILITY */}
            <div id="room-availability" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-3xl mb-6 uppercase">Room Availability</h2>
              <p>
                Please be aware that the hotel availability is only current as of the quotation. Reservations are subject to availability at the time of booking, and we are not holding any rooms on your behalf until we have provided you with a written confirmation.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
