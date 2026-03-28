import React, { useState } from 'react';
import { Shield, AlertCircle, BarChart3, FileText, ChevronRight, Loader2, ArrowLeft, Mail, LayoutDashboard } from 'lucide-react';
import Markdown from 'react-markdown';
import { generateDecisionSupport } from './services/gemini';
import { motion, AnimatePresence } from 'motion/react';

type Module = 'MENU' | 'A' | 'B' | 'C';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('MENU');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    scenario: '',
    emailContent: '',
    programName: '',
    milestones: '',
    keyRisks: '',
    visibility: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      let input;
      if (activeModule === 'A') input = { scenario: formData.scenario };
      else if (activeModule === 'B') input = { emailContent: formData.emailContent };
      else input = { 
        name: formData.programName, 
        milestones: formData.milestones, 
        risks: formData.keyRisks, 
        visibility: formData.visibility 
      };

      const response = await generateDecisionSupport(activeModule, input);
      setResult(response || "No response generated.");
    } catch (error) {
      console.error("Error generating support:", error);
      setResult("An error occurred while generating the response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetModule = () => {
    setActiveModule('MENU');
    setResult(null);
    setFormData({
      scenario: '',
      emailContent: '',
      programName: '',
      milestones: '',
      keyRisks: '',
      visibility: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-semibold text-lg tracking-tight">Cyber Program Decision Support Hub</h1>
          </div>
          {activeModule !== 'MENU' && (
            <button 
              onClick={resetModule}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Menu
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeModule === 'MENU' ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-8"
            >
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Governance-Focused Decision Support</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">Select a module to begin structured analysis for your cybersecurity program.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { id: 'A', title: 'Incident Impact & Escalation Advisor', icon: AlertCircle, desc: 'Assess incident scenarios and determine escalation tiers.' },
                  { id: 'B', title: 'AI-Powered Phishing Email Analyzer', icon: Mail, desc: 'Lightweight AI tool designed to assess phishing risk based on email content.' },
                  { id: 'C', title: 'Cyber Program Status Tracker', icon: LayoutDashboard, desc: 'Governance-focused tracker outlining program milestones, risks, and stakeholder visibility structure.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id as Module)}
                    className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-left flex flex-col h-full"
                  >
                    <div className="bg-indigo-50 p-3 rounded-xl w-fit mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <item.icon className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="mt-8 flex items-center text-indigo-600 font-semibold text-sm">
                      Select Module <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-2 gap-12 items-start"
            >
              {/* Form Section */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  {activeModule === 'A' && <><AlertCircle className="text-indigo-600" /> Module A</>}
                  {activeModule === 'B' && <><Mail className="text-indigo-600" /> Module B</>}
                  {activeModule === 'C' && <><LayoutDashboard className="text-indigo-600" /> Module C</>}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {activeModule === 'A' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Describe the Incident Scenario</label>
                      <textarea
                        name="scenario"
                        required
                        value={formData.scenario}
                        onChange={handleInputChange}
                        placeholder="e.g., Potential data leakage detected on a cloud storage bucket containing PII..."
                        className="w-full h-40 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                      />
                    </div>
                  )}

                  {activeModule === 'B' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Paste Email Content for Analysis</label>
                      <textarea
                        name="emailContent"
                        required
                        value={formData.emailContent}
                        onChange={handleInputChange}
                        placeholder="Paste the full email text, including headers if available..."
                        className="w-full h-40 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                      />
                    </div>
                  )}

                  {activeModule === 'C' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Program Name</label>
                        <input
                          type="text"
                          name="programName"
                          required
                          value={formData.programName}
                          onChange={handleInputChange}
                          placeholder="e.g., Enterprise IAM Transformation"
                          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Key Milestones</label>
                        <textarea
                          name="milestones"
                          required
                          value={formData.milestones}
                          onChange={handleInputChange}
                          placeholder="List key milestones and current status..."
                          className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Key Risks</label>
                        <textarea
                          name="keyRisks"
                          required
                          value={formData.keyRisks}
                          onChange={handleInputChange}
                          placeholder="List top risks and blockers..."
                          className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stakeholder Visibility Structure</label>
                        <textarea
                          name="visibility"
                          required
                          value={formData.visibility}
                          onChange={handleInputChange}
                          placeholder="e.g., Steering Committee, Board, Internal SOC..."
                          className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Support...
                      </>
                    ) : (
                      'Generate Decision Support'
                    )}
                  </button>
                </form>
              </div>

              {/* Result Section */}
              <div className="space-y-6">
                <div className={`bg-white p-8 rounded-2xl border border-gray-200 shadow-sm min-h-[400px] relative transition-all ${!result && !loading ? 'opacity-50' : 'opacity-100'}`}>
                  {!result && !loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                      <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <Shield className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-medium">Input details and generate to see structured decision support here.</p>
                    </div>
                  ) : loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-600 p-8 text-center">
                      <Loader2 className="w-10 h-10 animate-spin mb-4" />
                      <p className="text-sm font-semibold animate-pulse">Analyzing governance alignment...</p>
                    </div>
                  ) : (
                    <div className="prose prose-indigo max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-li:text-gray-600">
                      <div className="markdown-body">
                        <Markdown>{result}</Markdown>
                      </div>
                    </div>
                  )}
                </div>
                
                {result && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      alert('Copied to clipboard!');
                    }}
                    className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    Copy to Clipboard
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto py-8 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Cyber Program Decision Support Hub • Enterprise Governance Framework
          </p>
        </div>
      </footer>
    </div>
  );
}
