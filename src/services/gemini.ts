import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateDecisionSupport = async (module: string, input: any) => {
  let prompt = "";
  let systemInstruction = "You are 'Cyber Program Decision Support Hub' – an AI assistant designed for Cybersecurity Program Managers operating in enterprise environments. Your purpose is to provide structured, governance-focused decision support across cybersecurity programs. This assistant does NOT perform deep technical analysis. It supports escalation clarity, business impact framing, and executive communication. Tone must be concise, executive-ready, and suitable for Singapore enterprise leadership. Do not use casual language. Do not provide unnecessary technical detail. Focus on clarity, structure, and governance alignment.";

  if (module === "A") {
    prompt = `Module A – Incident Impact & Escalation Advisor. 
    Incident Scenario: ${input.scenario}
    
    Respond in this format:
    🚨 Incident Impact Overview
    
    Incident Summary:
    - 2–3 lines structured description
    
    Business Impact Assessment:
    - Operational impact
    - Regulatory/compliance exposure
    - Reputational considerations
    
    Recommended Escalation Tier:
    - Informational - Management-Level - Executive-Level - Crisis-Level
    
    Stakeholders to Notify:
    - Roles (not names)
    
    Response Time Expectation:
    - Suggested SLA guidance
    
    Program Manager Considerations:
    - Dependencies
    - Cross-functional coordination
    - Communication checkpoints`;
  } else if (module === "B") {
    prompt = `Module B – AI-Powered Phishing Email Analyzer.
    Email Content: ${input.emailContent}
    
    Respond in this structure:
    🔍 Phishing Risk Analysis
    
    Risk Level:
    - [Low / Medium / High / Critical] with justification
    
    Suspicious Indicators:
    - List technical, psychological, or content-based red flags
    
    Sender Authenticity:
    - Analysis of sender details and potential spoofing
    
    Call-to-Action Assessment:
    - Evaluation of links, attachments, or requests for information
    
    Recommended Action:
    - Immediate steps for the user or SOC team
    
    Governance Note:
    - Alignment with organizational email security policy`;
  } else if (module === "C") {
    prompt = `Module C – Cyber Program Status Tracker.
    Program Name: ${input.name}
    Milestones: ${input.milestones}
    Key Risks: ${input.risks}
    Stakeholder Visibility: ${input.visibility}
    
    Respond in this structure:
    📅 Cyber Program Governance Tracker
    
    Program Overview & Objectives:
    - 2 lines on strategic alignment
    
    Milestone Tracking:
    - Status of key deliverables (Completed / In-Progress / Delayed)
    
    Risk & Issue Log:
    - Governance-focused view of blockers and mitigations
    
    Stakeholder Visibility Matrix:
    - Who is informed, consulted, or accountable
    
    Resource & Budget Health:
    - High-level status (On-track / Under-pressure)
    
    Next Governance Review:
    - Suggested focus for the next steering committee`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.2, // Low temperature for structured, consistent output
    },
  });

  return response.text;
};
