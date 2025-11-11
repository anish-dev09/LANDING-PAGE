# 🎯 Quick Start: Testing Your AI Landing Page Generator

## ⚡ Fastest Way to Test (2 Minutes)

### 1️⃣ Get API Key
Visit: https://makersuite.google.com/app/apikey
- Sign in with Google
- Click "Create API Key"
- Copy the key

### 2️⃣ Add to .env file
Open `.env` file and paste:
```
VITE_GEMINI_API_KEY=your_key_here
```

### 3️⃣ Start the app
```bash
npm run dev
```

### 4️⃣ Test it!
1. Go to http://localhost:8081
2. Click "Start Building"
3. Fill the form with ANY product idea
4. Click "Generate Page"
5. Wait 5-10 seconds
6. 🎉 See your AI-generated landing page!

---

## 🧪 Example Test Inputs

### Test 1: Tech Startup
- **Product**: "CloudSync Pro"
- **Industry**: "Technology"
- **Target Audience**: "Small businesses"
- **Tone**: "Professional"
- **Features**: "Real-time sync", "Team collaboration", "Secure storage"
- **Unique Value**: "10x faster than competitors"

### Test 2: Food Business
- **Product**: "FreshMeal Delivery"
- **Industry**: "Food & Beverage"
- **Target Audience**: "Busy professionals"
- **Tone**: "Friendly"
- **Features**: "Farm fresh", "Same-day delivery", "Custom meal plans"
- **Unique Value**: "Chef-prepared healthy meals"

### Test 3: Education Platform
- **Product**: "LearnHub"
- **Industry**: "Education"
- **Target Audience**: "Students"
- **Tone**: "Bold"
- **Features**: "Video courses", "Live tutoring", "Progress tracking"
- **Unique Value**: "AI-powered personalized learning"

---

## ✅ What to Check

After generation, verify:
- [ ] Headline is unique and relevant
- [ ] Subheadline explains the product
- [ ] 4 features are generated
- [ ] 3 testimonials with realistic names
- [ ] Content matches your tone selection
- [ ] No template-like generic text

---

## 🐛 Common Issues

**"API not configured"** → Check .env file has correct key
**"Quota exceeded"** → Wait 60 seconds, free tier: 15/min
**"Parse error"** → Check internet connection
**Generic content** → Try more specific inputs

---

## 🎉 Success!

If you see unique, tailored content that's different each time you generate with the same inputs, your AI integration is working perfectly!

Next: Customize prompts in `src/lib/geminiService.ts` for even better results.
