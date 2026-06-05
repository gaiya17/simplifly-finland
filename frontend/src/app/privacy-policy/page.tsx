import { ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy & Cookie Policy | Simplifly Finland',
  description: 'Learn how Simplifly Finland Oy collects, uses, and protects your personal information.',
};

const tableOfContents = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'information-we-collect', label: 'Information We Collect' },
  { id: 'how-we-use', label: 'How We Use Your Information' },
  { id: 'how-we-share', label: 'How We Share Your Information' },
  { id: 'retention', label: 'Retention Of Your Information' },
  { id: 'your-rights', label: 'Your Rights' },
  { id: 'security', label: 'Security' },
  { id: 'third-party-links', label: 'Third Party Links' },
  { id: 'grievance', label: 'Grievance Officer' },
  { id: 'cookie-policy', label: 'Cookie Policy' },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">
      {/* ── HERO SECTION ── */}
      <section className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-[#041d3c]">
        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.15)_0%,_transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(26,132,255,0.1)_0%,_transparent_65%)] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-center text-center pt-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/10 border border-[#1a84ff]/20 text-white/90 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1a84ff]" />
            <span>Legal & Compliance</span>
          </div>
          <h1 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  drop-shadow-lg mb-6">
            Privacy & Cookie Policy
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-white/60 text-[13px] font-semibold uppercase tracking-wider">
            <span>Last Updated: 10-Jan-2026</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#1a84ff]" />
            <span>Effective Date: 10-Jan-2026</span>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT (2 Columns) ── */}
      <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-[80px] lg:py-[100px]">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
          
          {/* LEFT: Sticky Table of Contents */}
          <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-[120px] bg-white rounded-[24px] shadow-[0_8px_32px_rgba(4,29,60,0.04)] border border-gray-100 p-8 hidden md:block">
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
          <div className="flex-1 w-full max-w-3xl prose prose-lg prose-headings:text-[#041d3c] prose-headings:font-black prose-p:text-gray-600 prose-p:leading-[1.85] prose-p:font-normal prose-li:text-gray-600 prose-li:leading-[1.7] prose-a:text-[#1a84ff] prose-a:no-underline hover:prose-a:underline">
            
            {/* Introduction */}
            <div id="introduction" className="scroll-mt-[120px]">
              <p>
                This Privacy Policy describes the policies of <strong>Simplifly Finland Oy</strong>, Kardinaalinkatu 4C 20, Turku, Southern Finland 20540, Finland, email: <strong>buddhika.simpliflyfinland@gmail.com</strong>, phone: <strong>+94 71 523 3845</strong>, on the collection, use and disclosure of your information that we collect when you use our website (<a href="https://simpliflyfinland.fi">https://simpliflyfinland.fi</a>) (the "Service").
              </p>
              <p>
                By accessing or using the Service, you are consenting to the collection, use and disclosure of your information in accordance with this Privacy Policy. If you do not consent to the same, please do not access or use the Service.
              </p>
              <p>
                We may modify this Privacy Policy at any time without any prior notice to you and will post the revised Privacy Policy on the Service. The revised Policy will be effective 180 days from when the revised Policy is posted in the Service and your continued access or use of the Service after such time will constitute your acceptance of the revised Privacy Policy. We therefore recommend that you periodically review this page.
              </p>
            </div>

            {/* Information We Collect */}
            <div id="information-we-collect" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-2xl mb-6">Information We Collect</h2>
              <p>We will collect and process the following personal information about you:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-6 list-none pl-0">
                {['Name', 'Email', 'Mobile', 'Date of Birth', 'Payment Info', 'Nationality'].map((item) => (
                  <li key={item} className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#1a84ff] before:rounded-full">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div id="how-we-use" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-2xl mb-6">How We Use Your Information</h2>
              <p>We will use the information that we collect about you for the following purposes:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-6 list-none pl-0">
                {[
                  'Marketing / Promotional',
                  'Testimonials',
                  'Customer feedback collection',
                  'Enforce Terms & Conditions',
                  'Processing payment',
                  'Support',
                  'Administration info',
                  'Targeted advertising',
                  'Manage customer orders',
                  'Site protection',
                  'Dispute resolution',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#1a84ff] before:rounded-full">
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                If we want to use your information for any other purpose, we will ask you for consent and will use your information only on receiving your consent and then, only for the purpose(s) for which grant consent unless we are required to do otherwise by law.
              </p>
            </div>

            {/* How We Share Your Information */}
            <div id="how-we-share" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-2xl mb-6">How We Share Your Information</h2>
              <p>We will not transfer your personal information to any third party without seeking your consent, except in limited circumstances as described below:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-6 list-none pl-0">
                {['Ad service', 'Marketing agencies', 'Analytics', 'Data collection & process'].map((item) => (
                  <li key={item} className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#1a84ff] before:rounded-full">
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                We require such third party's to use the personal information we transfer to them only for the purpose for which it was transferred and not to retain it for longer than is required for fulfilling the said purpose.
              </p>
              <p>
                We may also disclose your personal information for the following: (1) to comply with applicable law, regulation, court order or other legal process; (2) to enforce your agreements with us, including this Privacy Policy; or (3) to respond to claims that your use of the Service violates any third-party rights. If the Service or our company is merged or acquired with another company, your information will be one of the assets that is transferred to the new owner.
              </p>
            </div>

            {/* Retention Of Your Information */}
            <div id="retention" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-2xl mb-6">Retention Of Your Information</h2>
              <p>
                We will retain your personal information with us for 90 days to 2 years after collection or for as long as we need it to fulfill the purposes for which it was collected as detailed in this Privacy Policy. We may need to retain certain information for longer periods such as record-keeping / reporting in accordance with applicable law or for other legitimate reasons like enforcement of legal rights, fraud prevention, etc. Residual anonymous information and aggregate information, neither of which identifies you (directly or indirectly), may be stored indefinitely.
              </p>
            </div>

            {/* Your Rights */}
            <div id="your-rights" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-2xl mb-6">Your Rights</h2>
              <p>
                Depending on the law that applies, you may have a right to access and rectify or erase your personal data or receive a copy of your personal data, restrict or object to the active processing of your data, ask us to share (port) your personal information to another entity, withdraw any consent you provided to us to process your data, a right to lodge a complaint with a statutory authority and such other rights as may be relevant under applicable laws. To exercise these rights, you can write to us at <a href="mailto:buddhika.simpliflyfinland@gmail.com">buddhika.simpliflyfinland@gmail.com</a>. We will respond to your request in accordance with applicable law.
              </p>
              <p>
                You may opt-out of direct marketing communications or the profiling we carry out for marketing purposes by writing to us at <a href="mailto:buddhika.simpliflyfinland@gmail.com">buddhika.simpliflyfinland@gmail.com</a>.
              </p>
              <p>
                Do note that if you do not allow us to collect or process the required personal information or withdraw the consent to process the same for the required purposes, you may not be able to access or use the services for which your information was sought.
              </p>
            </div>

            {/* Security */}
            <div id="security" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-2xl mb-6">Security</h2>
              <p>
                The security of your information is important to us and we will use reasonable security measures to prevent the loss, misuse or unauthorized alteration of your information under our control. However, given the inherent risks, we cannot guarantee absolute security and consequently, we cannot ensure or warrant the security of any information you transmit to us and you do so at your own risk.
              </p>
            </div>

            {/* Third Party Links */}
            <div id="third-party-links" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-2xl mb-6">Third Party Links & Use Of Your Information</h2>
              <p>
                Our Service may contain links to other websites that are not operated by us. This Privacy Policy does not address the privacy policy and other practices of any third parties, including any third party operating any website or service that may be accessible via a link on the Service. We strongly advise you to review the privacy policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
              </p>
            </div>

            {/* Grievance / Data Protection Officer */}
            <div id="grievance" className="mt-12 scroll-mt-[120px]">
              <h2 className="text-2xl mb-6">Grievance / Data Protection Officer</h2>
              <p>
                If you have any queries or concerns about the processing of your information that is available with us, you may email our Grievance Officer at <strong>Simplifly Finland Oy, Kardinaalinkatu 4C 20, Turku</strong>, email: <a href="mailto:buddhika.simpliflyfinland@gmail.com">buddhika.simpliflyfinland@gmail.com</a>. We will address your concerns in accordance with applicable law.
              </p>
            </div>

            <hr className="my-16 border-gray-200" />

            {/* ── COOKIE POLICY ── */}
            <div id="cookie-policy" className="mt-12 scroll-mt-[120px]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 border border-[#1a84ff]/10">
                <span>✦ COOKIE POLICY</span>
              </div>
              <h2 className="text-3xl mb-8">What are cookies?</h2>
              <p>
                This Cookie Policy explains what cookies are and how we use them, the types of cookies we use i.e, the information we collect using cookies and how that information is used, and how to manage the cookie settings.
              </p>
              <p>
                Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, provide better user experience, and understand how the website performs and to analyze what works and where it needs improvement.
              </p>

              <h3 className="text-2xl mt-12 mb-6">How do we use cookies?</h3>
              <p>
                As most of the online services, our website uses first-party and third-party cookies for several purposes. First-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.
              </p>
              <p>
                The third-party cookies used on our website are mainly for understanding how the website performs, how you interact with our website, keeping our services secure, providing advertisements that are relevant to you, and all in all providing you with a better and improved user experience and help speed up your future interactions with our website.
              </p>

              <h3 className="text-2xl mt-12 mb-6">Manage cookie preferences</h3>
              <p>
                In addition to managing settings via our cookie banner, different browsers provide different methods to block and delete cookies used by websites. You can change the settings of your browser to block/delete the cookies. Listed below are the links to the support documents on how to manage and delete cookies from the major web browsers:
              </p>
              <ul className="grid grid-cols-1 gap-3 mb-6 list-none pl-0 mt-4">
                <li className="flex items-center gap-3 bg-white p-4 rounded-[12px] shadow-sm border border-gray-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <strong>Chrome:</strong> <a href="https://support.google.com/accounts/answer/32050" target="_blank" rel="noopener noreferrer" className="ml-auto text-[14px]">Support Document</a>
                </li>
                <li className="flex items-center gap-3 bg-white p-4 rounded-[12px] shadow-sm border border-gray-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <strong>Safari:</strong> <a href="https://support.apple.com/en-in/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="ml-auto text-[14px]">Support Document</a>
                </li>
                <li className="flex items-center gap-3 bg-white p-4 rounded-[12px] shadow-sm border border-gray-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <strong>Firefox:</strong> <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noopener noreferrer" className="ml-auto text-[14px]">Support Document</a>
                </li>
                <li className="flex items-center gap-3 bg-white p-4 rounded-[12px] shadow-sm border border-gray-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <strong>Internet Explorer / Edge:</strong> <a href="https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc" target="_blank" rel="noopener noreferrer" className="ml-auto text-[14px]">Support Document</a>
                </li>
              </ul>
              <p className="mt-4">
                If you are using any other web browser, please visit your browser's official support documents.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
