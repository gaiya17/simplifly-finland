import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { Prisma } from '@prisma/client';

const INITIAL_FLOW = [
  {
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
  {
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
  {
    id: 'sl_adventure',
    from: 'bot',
    message: '🏔️ Adventure & Nature — Whitewater rafting, trekking Ella highlands, and camping under the stars in Sinharaja!\n\nHow many travellers?',
    options: [
      { label: '1–2 People', next: 'sl_budget' },
      { label: '3–5 People', next: 'sl_budget' },
      { label: '6+ People / Group', next: 'sl_budget' },
    ],
  },
  {
    id: 'sl_culture',
    from: 'bot',
    message: '🏛️ Culture & Heritage — Sigiriya Rock, Temple of the Tooth, ancient Anuradhapura, and more!\n\nHow many travellers?',
    options: [
      { label: '1–2 People', next: 'sl_budget' },
      { label: '3–5 People', next: 'sl_budget' },
      { label: '6+ People / Group', next: 'sl_budget' },
    ],
  },
  {
    id: 'sl_wildlife',
    from: 'bot',
    message: '🐘 Wildlife Safari — Spot leopards in Yala, witness the Minneriya Elephant Gathering, and explore national parks!\n\nHow many travellers?',
    options: [
      { label: '1–2 People', next: 'sl_budget' },
      { label: '3–5 People', next: 'sl_budget' },
      { label: '6+ People / Group', next: 'sl_budget' },
    ],
  },
  {
    id: 'sl_family',
    from: 'bot',
    message: '👨‍👩‍👧 Family Tours — Kid-friendly resorts, turtle hatcheries, elephant encounters, and golden beaches!\n\nHow many travellers?',
    options: [
      { label: '3–4 People', next: 'sl_budget' },
      { label: '5–7 People', next: 'sl_budget' },
      { label: '8+ People', next: 'sl_budget' },
    ],
  },
  {
    id: 'sl_romantic',
    from: 'bot',
    message: '💑 Romantic Tours — Private beach dinners, tea-country sunsets, Galle Fort evenings, and boutique hideaways!\n\nHow many travellers?',
    options: [
      { label: '2 People (Couple)', next: 'sl_budget' },
    ],
  },
  {
    id: 'sl_wellness',
    from: 'bot',
    message: '🌿 Wellness & Ayurveda — Ancient healing retreats, Panchakarma detox, ocean-side yoga, and herbal cuisine!\n\nHow many travellers?',
    options: [
      { label: '1–2 People', next: 'sl_budget' },
      { label: '3–5 People', next: 'sl_budget' },
    ],
  },
  {
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
  {
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
  {
    id: 'sl_ready',
    from: 'bot',
    message: '✅ Perfect! We have everything we need to craft your ideal Sri Lanka itinerary.\n\nOur travel experts are ready to build your personalised tour. Would you like to connect with us on WhatsApp?',
    options: [
      { label: '💬 Yes, chat on WhatsApp!', next: 'wa_srilanka' },
      { label: '🔙 Start over', next: 'restart' },
    ],
  },
  {
    id: 'wa_srilanka',
    from: 'bot',
    message: '🎉 Redirecting you to WhatsApp to speak with our Sri Lanka travel expert right now!',
    action: 'whatsapp',
    whatsappText: 'Hi! I\'m interested in a Sri Lanka tour package. Can you help me plan my trip?',
  },
  {
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
  {
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
  {
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
  {
    id: 'mv_ready',
    from: 'bot',
    message: '✅ Excellent! We can match you with the perfect Maldivian resort at the right price.\n\nConnect with our Maldives specialist on WhatsApp?',
    options: [
      { label: '💬 Yes, chat on WhatsApp!', next: 'wa_maldives' },
      { label: '🔙 Start over', next: 'restart' },
    ],
  },
  {
    id: 'wa_maldives',
    from: 'bot',
    message: '🎉 Connecting you with our Maldives specialist now!',
    action: 'whatsapp',
    whatsappText: 'Hi! I\'m interested in a Maldives resort package. Can you help me choose the perfect resort?',
  },
  {
    id: 'combo',
    from: 'bot',
    message: '✈️ The ultimate combo! Experience Sri Lanka\'s culture + the Maldives\' paradise in one trip.\n\nHow many travellers?',
    options: [
      { label: '2 People', next: 'combo_duration' },
      { label: '3–5 People', next: 'combo_duration' },
      { label: '6+ People', next: 'combo_duration' },
    ],
  },
  {
    id: 'combo_duration',
    from: 'bot',
    message: '📅 How many total days for both destinations?',
    options: [
      { label: '8–10 Days', next: 'combo_ready' },
      { label: '11–14 Days', next: 'combo_ready' },
      { label: '15+ Days', next: 'combo_ready' },
    ],
  },
  {
    id: 'combo_ready',
    from: 'bot',
    message: '✅ A Sri Lanka + Maldives combo is one of our most popular packages!\n\nSpeak to our expert on WhatsApp to get a tailored quote?',
    options: [
      { label: '💬 Yes, WhatsApp me a quote!', next: 'wa_combo' },
      { label: '🔙 Start over', next: 'restart' },
    ],
  },
  {
    id: 'wa_combo',
    from: 'bot',
    message: '🎉 Connecting you now for your Sri Lanka + Maldives package!',
    action: 'whatsapp',
    whatsappText: 'Hi! I\'m interested in a Sri Lanka + Maldives combination package. Can you help me plan it?',
  },
  {
    id: 'contact',
    from: 'bot',
    message: '📞 Our team is available to help you plan the perfect journey!\n\nHow would you like to reach us?',
    options: [
      { label: '💬 WhatsApp (fastest!)', next: 'wa_general' },
      { label: '📧 Email us', next: 'email' },
      { label: '🔙 Back to main menu', next: 'restart' },
    ],
  },
  {
    id: 'wa_general',
    from: 'bot',
    message: '🎉 Opening WhatsApp to connect you with our team right now!',
    action: 'whatsapp',
    whatsappText: 'Hi! I\'d like to know more about your travel packages to Sri Lanka and the Maldives.',
  },
  {
    id: 'email',
    from: 'bot',
    message: '📧 You can reach us at:\n\n🇫🇮 sales@simpliflyfinland.fi\n🇱🇰 sales@simpliflysrilanka.com\n🏝️ sales@simpliflymaldives.com\n\nOr chat directly on WhatsApp for the fastest reply!',
    options: [
      { label: '💬 Switch to WhatsApp', next: 'wa_general' },
      { label: '🔙 Main Menu', next: 'restart' },
    ],
  },
  {
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
];

export class ChatbotController {
  // Get all nodes, format them as a Record mapping id -> Node, and seed if empty
  static async getNodes(req: Request, res: Response) {
    try {
      let nodes = await prisma.chatbotNode.findMany();

      if (nodes.length === 0) {
        // Auto-seed
        console.log('Chatbot database empty, seeding initial flow...');
        for (const node of INITIAL_FLOW) {
          await prisma.chatbotNode.create({
            data: {
              id: node.id,
              from: node.from,
              message: node.message,
              options: node.options ? (node.options as Prisma.JsonArray) : Prisma.JsonNull,
              action: node.action,
              whatsappText: node.whatsappText,
            }
          });
        }
        nodes = await prisma.chatbotNode.findMany();
      }

      // Convert array to Record<string, ChatbotNode> for easier frontend usage
      const flowRecord: Record<string, any> = {};
      for (const node of nodes) {
        flowRecord[node.id] = node;
      }

      res.json(flowRecord);
    } catch (error) {
      console.error('Failed to get chatbot nodes:', error);
      res.status(500).json({ error: 'Failed to fetch chatbot flow' });
    }
  }

  // Get all nodes as Array for admin dashboard
  static async getNodesArray(req: Request, res: Response) {
    try {
      const nodes = await prisma.chatbotNode.findMany();
      res.json(nodes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chatbot nodes' });
    }
  }

  // Create Node
  static async createNode(req: Request, res: Response) {
    try {
      const { id, from, message, options, action, whatsappText } = req.body;
      
      const existing = await prisma.chatbotNode.findUnique({ where: { id } });
      if (existing) {
        res.status(400).json({ error: 'A node with this ID already exists.' });
        return;
      }

      const newNode = await prisma.chatbotNode.create({
        data: {
          id,
          from: from || 'bot',
          message,
          options: options || Prisma.JsonNull,
          action,
          whatsappText,
        },
      });
      res.status(201).json(newNode);
    } catch (error) {
      console.error('Create node error:', error);
      res.status(500).json({ error: 'Failed to create chatbot node' });
    }
  }

  // Update Node
  static async updateNode(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { message, options, action, whatsappText, from } = req.body;

      const updatedNode = await prisma.chatbotNode.update({
        where: { id },
        data: {
          from,
          message,
          options: options || Prisma.JsonNull,
          action,
          whatsappText,
        },
      });
      res.json(updatedNode);
    } catch (error) {
      console.error('Update node error:', error);
      res.status(500).json({ error: 'Failed to update chatbot node' });
    }
  }

  // Delete Node
  static async deleteNode(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Protect default important nodes from being completely wiped if needed,
      // but let's allow total freedom. The frontend should handle missing next gracefully.
      await prisma.chatbotNode.delete({ where: { id } });
      res.json({ success: true });
    } catch (error) {
      console.error('Delete node error:', error);
      res.status(500).json({ error: 'Failed to delete chatbot node' });
    }
  }
}
