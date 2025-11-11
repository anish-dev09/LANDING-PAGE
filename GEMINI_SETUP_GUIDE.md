# 🚀 AI-Powered Landing Page Generator - Setup Guide

This guide will help you configure and run the AI-powered landing page generator using Google Gemini API.

---

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Google Gemini API Key** (Free tier available)

---

## 🔑 Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key

**Free Tier Limits:**
- 15 requests per minute
- 1,500 requests per day
- Perfect for development and small projects!

---

## ⚙️ Step 2: Configure Environment Variables

1. **Create `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Add your Gemini API key** to `.env`:
   ```bash
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Important**: Never commit your `.env` file to version control!

---

## 📦 Step 3: Install Dependencies

```bash
npm install
```

This installs:
- `@google/generative-ai` - Gemini SDK
- All React, TypeScript, and UI dependencies

---

## 🏃‍♂️ Step 4: Run the Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:8081**

---

## 🧪 Step 5: Test AI Generation

1. **Open the app** in your browser
2. Click **"Start Building"**
3. **Fill in the form**:
   - Product Name: "EcoTrack"
   - Industry: "Technology"
   - Target Audience: "Environmental organizations"
   - Tone: "Professional"
   - Features: Add 3-5 features
   - Unique Value: "Real-time carbon footprint tracking"

4. Click **"Generate Page"**
5. Wait 5-10 seconds for AI generation
6. See your unique, AI-generated landing page!

---

## 🎨 Features of AI Generation

### What Gemini AI Creates:

✅ **Hero Section**
- Attention-grabbing headline (max 12 words)
- Compelling subheadline (max 25 words)
- Benefit-driven copy

✅ **About Section**
- Engaging title
- 2-3 sentences about product story/mission
- Tailored to your industry

✅ **Features Section**
- 4 unique feature descriptions
- Creative titles (max 4 words each)
- Benefit-focused descriptions (max 20 words)

✅ **Testimonials Section**
- 3 authentic testimonials
- Realistic names, roles, and companies
- Specific benefits mentioned (max 30 words)

---

## 🔧 Configuration Options

### Gemini Model Settings (in `geminiService.ts`):

```typescript
{
  temperature: 0.9,        // Creativity (0.0-1.0)
  maxOutputTokens: 2048,   // Response length
  topP: 0.95,              // Nucleus sampling
  topK: 40                 // Top-k sampling
}
```

### Adjust Creativity:
- **Higher temperature (0.9-1.0)**: More creative, varied content
- **Lower temperature (0.5-0.7)**: More focused, consistent content

---

## 🐛 Troubleshooting

### Issue: "Gemini API is not configured"
**Solution**: Check your `.env` file has `VITE_GEMINI_API_KEY` set correctly.

### Issue: "API quota exceeded"
**Solution**: 
- Wait for quota reset (resets every 60 seconds)
- Free tier: 15 requests/minute, 1,500/day
- Consider upgrading to paid tier if needed

### Issue: "Failed to parse response"
**Solution**: 
- Check your internet connection
- Gemini automatically falls back to template-based generation
- Check console for detailed error messages

### Issue: Response is incomplete
**Solution**: 
- Increase `maxOutputTokens` in `geminiService.ts`
- Simplify your input (shorter features list)

---

## 💡 Tips for Best Results

1. **Be Specific**: Provide detailed product information
2. **Use Clear Features**: List specific, measurable features
3. **Define Your Audience**: Be specific about who you're targeting
4. **Unique Value**: Clearly state what makes you different
5. **Choose Right Tone**: Match your brand personality

---

## 📊 API Usage Monitoring

Check your API usage at: [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## 🔐 Security Best Practices

1. ✅ Never commit `.env` file
2. ✅ Use `.env.example` for documentation
3. ✅ Add `.env` to `.gitignore`
4. ✅ Use environment variables in production
5. ✅ Rotate API keys periodically

---

## 🚀 Deployment

### Netlify/Vercel:
Add environment variable in dashboard:
```
VITE_GEMINI_API_KEY = your_key_here
```

### Docker:
```bash
docker build --build-arg VITE_GEMINI_API_KEY=your_key .
```

---

## 📚 Advanced Usage

### Custom Prompts
Edit `buildPrompt()` in `src/lib/geminiService.ts` to customize:
- Output format
- Content style
- Section types
- Word limits

### Multiple Models
Switch Gemini models:
```typescript
// Fast & cheap
getGenerativeModel({ model: 'gemini-1.5-flash' })

// More capable
getGenerativeModel({ model: 'gemini-1.5-pro' })
```

---

## 🆘 Support

**Issues?** 
1. Check console for errors
2. Verify API key is correct
3. Check network requests in DevTools
4. Review Gemini API status

**Documentation:**
- [Gemini API Docs](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)

---

## 📈 Upgrading from Template-Based

The old template-based system is now completely replaced with AI generation:
- ✅ Unique content for every generation
- ✅ Intelligent adaptation to inputs
- ✅ Professional copywriting
- ✅ Contextual testimonials
- ✅ Industry-specific language

**Fallback**: If AI fails, system automatically uses template generation to ensure the app always works.

---

## 🎉 You're Ready!

Your landing page generator is now powered by Google Gemini AI. Every generation creates unique, professional content tailored to your needs.

Happy building! 🚀
