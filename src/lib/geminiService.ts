import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserFormData, GeneratedContent } from '../types';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ VITE_GEMINI_API_KEY is not set. AI generation will not work.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Use Gemini 1.5 Flash for fast, cost-effective generation
const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });

interface GeminiGenerationOptions {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

/**
 * Generate landing page content using Gemini AI
 */
export async function generateLandingPageContent(
  formData: Partial<UserFormData>,
  options: GeminiGenerationOptions = {}
): Promise<GeneratedContent> {
  if (!model) {
    throw new Error('Gemini API is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  const {
    temperature = 0.9, // Higher creativity
    maxOutputTokens = 2048,
    topP = 0.95,
    topK = 40,
  } = options;

  // Build the prompt
  const prompt = buildPrompt(formData);

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens,
        topP,
        topK,
      },
    });

    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    const content = parseGeminiResponse(text, formData);
    
    return content;
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    
    // Fallback to template-based generation if AI fails
    console.warn('⚠️ Falling back to template-based generation');
    return generateFallbackContent(formData);
  }
}

/**
 * Build an effective prompt for Gemini
 */
function buildPrompt(formData: Partial<UserFormData>): string {
  const {
    productName = 'Product',
    industry = 'Technology',
    tone = 'professional',
    keyFeatures = [],
    targetAudience = 'businesses',
    uniqueValue = 'innovative solution',
    brandColor = '#3B82F6',
  } = formData;

  return `You are an expert landing page copywriter and marketing specialist. Generate compelling, conversion-optimized content for a landing page.

**Product Information:**
- Product Name: ${productName}
- Industry: ${industry}
- Target Audience: ${targetAudience}
- Tone: ${tone}
- Unique Value Proposition: ${uniqueValue}
- Key Features: ${keyFeatures.join(', ') || 'Not specified'}
- Brand Color: ${brandColor}

**Requirements:**
1. Create a powerful hero section with an attention-grabbing headline and compelling subheadline
2. Write an engaging "About" section that explains the product's value
3. Generate 4 unique feature descriptions with creative titles
4. Create 3 authentic-sounding customer testimonials with realistic names, roles, and companies
5. Use persuasive, benefit-focused language
6. Match the ${tone} tone throughout
7. Tailor content specifically for ${targetAudience}
8. Emphasize the unique value: ${uniqueValue}

**Output Format (JSON only, no markdown):**
{
  "hero": {
    "headline": "Main headline (max 12 words, compelling and benefit-driven)",
    "subhead": "Supporting text (max 25 words, explains what product does and why it matters)",
    "imageUrl": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
  },
  "about": {
    "title": "About section title (engaging, max 8 words)",
    "content": "2-3 sentences explaining the product story, mission, or approach"
  },
  "features": [
    {
      "id": "feature-1",
      "title": "Feature name (max 4 words)",
      "description": "Benefit-focused description (max 20 words)",
      "icon": "Zap"
    },
    {
      "id": "feature-2",
      "title": "Feature name",
      "description": "Benefit-focused description",
      "icon": "Shield"
    },
    {
      "id": "feature-3",
      "title": "Feature name",
      "description": "Benefit-focused description",
      "icon": "Rocket"
    },
    {
      "id": "feature-4",
      "title": "Feature name",
      "description": "Benefit-focused description",
      "icon": "Star"
    }
  ],
  "testimonials": [
    {
      "id": "testimonial-1",
      "name": "Realistic full name",
      "role": "Job title",
      "company": "Company name",
      "quote": "Authentic testimonial (max 30 words, specific benefits mentioned)",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    },
    {
      "id": "testimonial-2",
      "name": "Realistic full name",
      "role": "Job title",
      "company": "Company name",
      "quote": "Authentic testimonial",
      "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    },
    {
      "id": "testimonial-3",
      "name": "Realistic full name",
      "role": "Job title",
      "company": "Company name",
      "quote": "Authentic testimonial",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    }
  ]
}

Generate ONLY the JSON object. Do not include any markdown formatting, code blocks, or explanatory text.`;
}

/**
 * Parse Gemini's response and extract structured content
 */
function parseGeminiResponse(
  responseText: string,
  formData: Partial<UserFormData>
): GeneratedContent {
  try {
    // Remove markdown code blocks if present
    let cleanedText = responseText.trim();
    
    // Remove ```json and ``` markers
    cleanedText = cleanedText.replace(/^```json\s*/i, '');
    cleanedText = cleanedText.replace(/^```\s*/i, '');
    cleanedText = cleanedText.replace(/\s*```$/i, '');
    cleanedText = cleanedText.trim();

    // Parse JSON
    const parsed = JSON.parse(cleanedText);

    // Validate and ensure all required fields exist
    const content: GeneratedContent = {
      hero: {
        headline: parsed.hero?.headline || `Transform Your ${formData.industry} Business`,
        subhead: parsed.hero?.subhead || 'Innovative solutions for modern challenges',
        imageUrl: parsed.hero?.imageUrl || 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
      },
      about: {
        title: parsed.about?.title || `About ${formData.productName}`,
        content: parsed.about?.content || 'We provide cutting-edge solutions tailored to your needs.',
      },
      features: Array.isArray(parsed.features) && parsed.features.length >= 4
        ? parsed.features.slice(0, 4).map((f: { id?: string; title?: string; description?: string; icon?: string }, idx: number) => ({
            id: f.id || `feature-${idx + 1}`,
            title: f.title || `Feature ${idx + 1}`,
            description: f.description || 'Amazing feature description',
            icon: f.icon || ['Zap', 'Shield', 'Rocket', 'Star'][idx],
          }))
        : generateDefaultFeatures(formData),
      testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length >= 3
        ? parsed.testimonials.slice(0, 3).map((t: { id?: string; name?: string; role?: string; company?: string; quote?: string; avatar?: string }, idx: number) => ({
            id: t.id || `testimonial-${idx + 1}`,
            name: t.name || 'Customer Name',
            role: t.role || 'User',
            company: t.company || 'Company',
            quote: t.quote || 'Great product!',
            avatar: t.avatar || `https://images.unsplash.com/photo-${['1472099645785-5658abf4ff4e', '1438761681033-6461ffad8d80', '1500648767791-00dcc994a43e'][idx]}?w=100&h=100&fit=crop`,
          }))
        : generateDefaultTestimonials(),
    };

    return content;
  } catch (error) {
    console.error('❌ Failed to parse Gemini response:', error);
    console.log('Raw response:', responseText);
    
    // Return fallback content
    return generateFallbackContent(formData);
  }
}

/**
 * Generate fallback content if AI fails
 */
function generateFallbackContent(formData: Partial<UserFormData>): GeneratedContent {
  const {
    productName = 'Product',
    industry = 'Technology',
    tone = 'professional',
    targetAudience = 'businesses',
    uniqueValue = 'innovative solution',
  } = formData;

  return {
    hero: {
      headline: `Transform Your ${industry} with ${productName}`,
      subhead: `${tone === 'professional' ? 'Professional-grade' : tone === 'friendly' ? 'User-friendly' : 'Cutting-edge'} tools designed for ${targetAudience}.`,
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    },
    about: {
      title: `About ${productName}`,
      content: `We're revolutionizing the ${industry} industry with ${uniqueValue}. Our mission is to empower ${targetAudience} with the tools they need to succeed.`,
    },
    features: generateDefaultFeatures(formData),
    testimonials: generateDefaultTestimonials(),
  };
}

function generateDefaultFeatures(formData: Partial<UserFormData>) {
  const features = formData.keyFeatures || [];
  
  if (features.length >= 4) {
    return features.slice(0, 4).map((feature, index) => ({
      id: `feature-${index + 1}`,
      title: feature,
      description: `Experience the power of ${feature.toLowerCase()} with our advanced platform.`,
      icon: ['Zap', 'Shield', 'Rocket', 'Star'][index] || 'CheckCircle',
    }));
  }

  return [
    {
      id: 'feature-1',
      title: 'Lightning Fast',
      description: 'Built for speed and performance that scales with your business.',
      icon: 'Zap',
    },
    {
      id: 'feature-2',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security to keep your data safe.',
      icon: 'Shield',
    },
    {
      id: 'feature-3',
      title: 'Rapid Growth',
      description: 'Tools designed to accelerate your business growth.',
      icon: 'Rocket',
    },
    {
      id: 'feature-4',
      title: 'Premium Quality',
      description: 'Top-tier solutions that exceed expectations.',
      icon: 'Star',
    },
  ];
}

function generateDefaultTestimonials() {
  return [
    {
      id: 'testimonial-1',
      name: 'Sarah Johnson',
      role: 'CEO',
      company: 'TechCorp Inc',
      quote: 'This solution transformed our business operations and boosted productivity by 200%.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
      id: 'testimonial-2',
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'InnovateNow',
      quote: 'The best investment we made this year. Our team loves using it every day.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
      id: 'testimonial-3',
      name: 'Emily Rodriguez',
      role: 'Founder',
      company: 'StartupHub',
      quote: 'Incredibly intuitive and powerful. Exactly what we needed to scale our business.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
  ];
}

/**
 * Test if Gemini API is properly configured
 */
export async function testGeminiConnection(): Promise<boolean> {
  if (!model) {
    console.error('❌ Gemini API not configured');
    return false;
  }

  try {
    const result = await model.generateContent('Hello');
    console.log('✅ Gemini API connection successful');
    return true;
  } catch (error) {
    console.error('❌ Gemini API connection failed:', error);
    return false;
  }
}
