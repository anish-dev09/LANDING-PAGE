
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserFormData, GeneratedContent, PageSection, ThemeConfig } from '../types';
import { exportToHTML } from '../lib/htmlExporter';
import { createShareableData } from '../lib/shareUtils';
import { generateLandingPageContent } from '../lib/geminiService';
import { toast } from 'sonner';


interface AppState {
  // Form state
  currentStep: number;
  formData: Partial<UserFormData>;
  isGenerating: boolean;

  // Content state
  generatedContent: GeneratedContent | null;
  sections: PageSection[];

  // Theme state
  theme: ThemeConfig;

  // UI state
  previewMode: 'desktop' | 'tablet' | 'mobile';



  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<UserFormData>) => void;
  setIsGenerating: (generating: boolean) => void;
  setGeneratedContent: (content: GeneratedContent) => void;
  updateSections: (sections: PageSection[]) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  generateContent: () => Promise<void>;
  addCustomSection: (description: string) => Promise<void>;
  exportToHTML: () => string;
  generateShareData: () => any;


}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 0,
      formData: {},
      isGenerating: false,
      generatedContent: null,
      sections: [],
      theme: {
        mode: 'light',
        brandColor: '#3B82F6',
        preset: 'default'
      },
      previewMode: 'desktop',

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),

      updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),

      setIsGenerating: (generating) => set({ isGenerating: generating }),

      setGeneratedContent: (content) => {
        const sections: PageSection[] = [
          {
            id: 'hero',
            type: 'hero',
            title: 'Hero Section',
            order: 0,
            content: content.hero,
            isVisible: true
          },
          {
            id: 'about',
            type: 'about',
            title: 'About Section',
            order: 1,
            content: content.about,
            isVisible: true
          },
          {
            id: 'features',
            type: 'features',
            title: 'Features Section',
            order: 2,
            content: content.features,
            isVisible: true
          },
          {
            id: 'testimonials',
            type: 'testimonials',
            title: 'Testimonials Section',
            order: 3,
            content: content.testimonials,
            isVisible: true
          }
        ];

        set({
          generatedContent: content,
          sections: sections.sort((a, b) => a.order - b.order)
        });
      },

      updateSections: (sections) => set({ sections }),

      updateTheme: (themeUpdate) => set((state) => ({
        theme: { ...state.theme, ...themeUpdate }
      })),

      setPreviewMode: (mode) => set({ previewMode: mode }),

      generateContent: async () => {
        const { formData } = get();
        set({ isGenerating: true });

        try {
          // Show loading toast
          toast.loading('🤖 AI is generating your landing page...', { id: 'generate' });

          // Generate content using Gemini AI
          const content = await generateLandingPageContent(formData, {
            temperature: 0.9, // Higher creativity
            maxOutputTokens: 2048,
          });

          get().setGeneratedContent(content);
          set({ isGenerating: false });

          // Success toast
          toast.success('✨ Landing page generated successfully!', { id: 'generate' });
        } catch (error) {
          console.error('❌ Content generation failed:', error);
          set({ isGenerating: false });

          // Error toast with helpful message
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          if (errorMessage.includes('API key')) {
            toast.error('⚠️ Gemini API key is not configured. Please check your .env file.', { id: 'generate' });
          } else if (errorMessage.includes('quota')) {
            toast.error('⚠️ API quota exceeded. Please try again later.', { id: 'generate' });
          } else {
            toast.error('❌ Failed to generate content. Using fallback template.', { id: 'generate' });
          }
        }
      },

      addCustomSection: async (description) => {
        set({ isGenerating: true });

        // Simulate content generation
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { sections } = get();
        const newSection: PageSection = {
          id: `custom-${Date.now()}`,
          type: 'custom',
          title: description,
          order: sections.length,
          content: {
            title: description,
            content: `This is a custom section: "${description}". You can edit this content to match your needs.`
          },
          isVisible: true
        };

        set({
          sections: [...sections, newSection],
          isGenerating: false
        });
      },

      exportToHTML: () => {
        const { sections, theme, formData } = get();
        return exportToHTML({
          sections,
          theme,
          formData,
          includeStyles: true,
          includeScripts: true
        });
      },

      generateShareData: () => {
        const { sections, theme, formData } = get();
        return createShareableData(sections, theme, formData);
      },


    }),
    {
      name: 'landing-page-generator',
      partialize: (state) => ({
        formData: state.formData,
        theme: state.theme,
        sections: state.sections,
        generatedContent: state.generatedContent
      })
    }
  )
);
