import asyncio
import random
from typing import Dict, Any, List
from textblob import TextBlob
import openai
import os
from .base_agent import BaseAgent
from ..models.interview import AgentMessage, BehavioralResponse

class BehavioralAgent(BaseAgent):
    """Handles behavioral interview questions using STAR methodology"""
    
    def __init__(self, session_id: str):
        super().__init__(session_id)
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.questions_asked = []
        self.responses_collected = []
        
        self.question_bank = [
            {
                "id": 1,
                "question": "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
                "category": "Teamwork",
                "competencies": ["collaboration", "conflict_resolution", "communication"],
                "follow_up": "What would you do differently if faced with a similar situation?"
            },
            {
                "id": 2,
                "question": "Describe a situation where you had to learn a new technology quickly to complete a project. What was your approach?",
                "category": "Learning Agility",
                "competencies": ["adaptability", "learning", "problem_solving"],
                "follow_up": "How do you typically stay updated with new technologies?"
            },
            {
                "id": 3,
                "question": "Give me an example of a time when you had to make a decision with incomplete information. What was the outcome?",
                "category": "Decision Making",
                "competencies": ["decision_making", "risk_assessment", "leadership"],
                "follow_up": "How do you typically handle uncertainty in your work?"
            },
            {
                "id": 4,
                "question": "Tell me about a project where you had to meet a tight deadline. How did you manage your time and resources?",
                "category": "Time Management",
                "competencies": ["time_management", "prioritization", "stress_management"],
                "follow_up": "What tools or techniques do you use for project management?"
            },
            {
                "id": 5,
                "question": "Describe a situation where you had to give constructive feedback to a colleague. How did you approach it?",
                "category": "Leadership",
                "competencies": ["leadership", "communication", "empathy"],
                "follow_up": "How do you handle receiving feedback yourself?"
            }
        ]
    
    async def initialize(self, config: Any) -> AgentMessage:
        """Initialize behavioral assessment"""
        await self.log_activity("Initializing behavioral assessment")
        
        # Randomize question order to prevent memorization
        random.shuffle(self.question_bank)
        
        self.initialized = True
        
        return await self.send_message(
            "system",
            "Behavioral assessment initialized. Ready to conduct STAR methodology interviews.",
            {"question_count": len(self.question_bank)}
        )
    
    async def handle_message(self, action: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle behavioral agent actions"""
        if action == "begin_assessment":
            return await self.begin_assessment()
        elif action == "ask_question":
            return await self.ask_question(payload)
        elif action == "process_response":
            return await self.process_response(payload)
        elif action == "get_summary":
            return await self.get_assessment_summary()
        else:
            return {"error": f"Unknown action: {action}"}
    
    async def begin_assessment(self) -> Dict[str, Any]:
        """Begin the behavioral assessment"""
        if not self.question_bank:
            return {"error": "No questions available"}
        
        first_question = self.question_bank[0]
        self.questions_asked.append(first_question)
        
        await self.log_activity("Starting behavioral assessment", {
            "first_question_id": first_question["id"],
            "category": first_question["category"]
        })
        
        return {
            "action": "question_presented",
            "question": first_question,
            "instructions": "Please use the STAR method: Situation, Task, Action, Result"
        }
    
    async def ask_question(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Ask a specific behavioral question"""
        question_index = payload.get("question_index", len(self.questions_asked))
        
        if question_index >= len(self.question_bank):
            return {"action": "assessment_complete", "message": "All questions completed"}
        
        question = self.question_bank[question_index]
        self.questions_asked.append(question)
        
        return {
            "action": "question_presented",
            "question": question,
            "question_number": len(self.questions_asked),
            "total_questions": min(3, len(self.question_bank))  # Limit to 3 questions
        }
    
    async def process_response(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process candidate's behavioral response"""
        response_text = payload.get("response", "")
        question_id = payload.get("question_id")
        
        if not response_text:
            return {"error": "No response provided"}
        
        # Analyze response using AI and sentiment analysis
        analysis = await self.analyze_response(response_text, question_id)
        
        # Store response
        self.responses_collected.append({
            "question_id": question_id,
            "response": response_text,
            "analysis": analysis,
            "timestamp": asyncio.get_event_loop().time()
        })
        
        await self.log_activity("Response processed", {
            "question_id": question_id,
            "sentiment_score": analysis["sentiment"]["score"],
            "keyword_count": len(analysis["keywords"])
        })
        
        # Determine next action
        if len(self.responses_collected) < 3:  # Ask up to 3 questions
            next_question = await self.ask_question({"question_index": len(self.questions_asked)})
            return {
                "action": "continue_assessment",
                "analysis": analysis,
                "next_question": next_question
            }
        else:
            summary = await self.get_assessment_summary()
            return {
                "action": "assessment_complete",
                "analysis": analysis,
                "summary": summary
            }
    
    async def analyze_response(self, response_text: str, question_id: int) -> Dict[str, Any]:
        """Analyze behavioral response using AI and NLP"""
        
        # Sentiment analysis using TextBlob
        blob = TextBlob(response_text)
        sentiment_score = blob.sentiment.polarity  # -1 to 1
        
        # Extract keywords related to competencies
        competency_keywords = [
            "team", "collaboration", "leadership", "problem", "solution", "challenge",
            "success", "failure", "learn", "improve", "communicate", "manage",
            "deliver", "quality", "deadline", "customer", "user", "technical",
            "decision", "responsibility", "initiative", "conflict", "resolution"
        ]
        
        found_keywords = []
        response_lower = response_text.lower()
        for keyword in competency_keywords:
            if keyword in response_lower:
                found_keywords.append(keyword)
        
        # Use OpenAI for deeper analysis
        try:
            ai_analysis = await self.get_ai_analysis(response_text, question_id)
        except Exception as e:
            await self.log_activity(f"AI analysis failed: {e}")
            ai_analysis = {"star_completeness": 0.5, "competency_demonstration": "moderate"}
        
        return {
            "sentiment": {
                "score": sentiment_score,
                "polarity": "positive" if sentiment_score > 0.1 else "negative" if sentiment_score < -0.1 else "neutral"
            },
            "keywords": found_keywords,
            "word_count": len(response_text.split()),
            "star_analysis": ai_analysis.get("star_completeness", 0.5),
            "competency_score": ai_analysis.get("competency_demonstration", "moderate"),
            "ai_insights": ai_analysis.get("insights", [])
        }
    
    async def get_ai_analysis(self, response_text: str, question_id: int) -> Dict[str, Any]:
        """Get AI-powered analysis of the response"""
        
        question = next((q for q in self.questions_asked if q["id"] == question_id), None)
        if not question:
            return {}
        
        prompt = f"""
        Analyze this behavioral interview response for a {question['category']} question.
        
        Question: {question['question']}
        Response: {response_text}
        
        Evaluate on:
        1. STAR method completeness (Situation, Task, Action, Result) - score 0-1
        2. Competency demonstration for: {', '.join(question['competencies'])}
        3. Specific insights and strengths
        4. Areas for improvement
        
        Respond in JSON format:
        {{
            "star_completeness": 0.8,
            "competency_demonstration": "strong|moderate|weak",
            "insights": ["insight1", "insight2"],
            "improvement_areas": ["area1", "area2"]
        }}
        """
        
        try:
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            import json
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            await self.log_activity(f"OpenAI analysis error: {e}")
            return {
                "star_completeness": 0.5,
                "competency_demonstration": "moderate",
                "insights": ["Response provided with reasonable detail"],
                "improvement_areas": ["Could provide more specific examples"]
            }
    
    async def get_assessment_summary(self) -> Dict[str, Any]:
        """Generate summary of behavioral assessment"""
        if not self.responses_collected:
            return {"error": "No responses to summarize"}
        
        # Calculate aggregate scores
        total_sentiment = sum(r["analysis"]["sentiment"]["score"] for r in self.responses_collected)
        avg_sentiment = total_sentiment / len(self.responses_collected)
        
        total_keywords = sum(len(r["analysis"]["keywords"]) for r in self.responses_collected)
        
        star_scores = [r["analysis"]["star_analysis"] for r in self.responses_collected]
        avg_star_completeness = sum(star_scores) / len(star_scores)
        
        # Competency coverage
        all_keywords = []
        for response in self.responses_collected:
            all_keywords.extend(response["analysis"]["keywords"])
        
        unique_competencies = list(set(all_keywords))
        
        return {
            "responses_count": len(self.responses_collected),
            "average_sentiment": avg_sentiment,
            "sentiment_category": "positive" if avg_sentiment > 0.1 else "negative" if avg_sentiment < -0.1 else "neutral",
            "total_keywords": total_keywords,
            "unique_competencies": unique_competencies,
            "star_completeness": avg_star_completeness,
            "overall_score": min(100, int((avg_sentiment + 1) * 30 + avg_star_completeness * 40 + min(len(unique_competencies) * 5, 30))),
            "strengths": self.identify_strengths(),
            "improvement_areas": self.identify_improvements()
        }
    
    def identify_strengths(self) -> List[str]:
        """Identify candidate strengths from responses"""
        strengths = []
        
        # Analyze patterns in responses
        high_sentiment_responses = [r for r in self.responses_collected if r["analysis"]["sentiment"]["score"] > 0.3]
        if len(high_sentiment_responses) >= 2:
            strengths.append("Demonstrates positive attitude and confidence")
        
        keyword_counts = {}
        for response in self.responses_collected:
            for keyword in response["analysis"]["keywords"]:
                keyword_counts[keyword] = keyword_counts.get(keyword, 0) + 1
        
        frequent_keywords = [k for k, v in keyword_counts.items() if v >= 2]
        if "leadership" in frequent_keywords:
            strengths.append("Shows consistent leadership experience")
        if "problem" in frequent_keywords and "solution" in frequent_keywords:
            strengths.append("Strong problem-solving orientation")
        if "team" in frequent_keywords or "collaboration" in frequent_keywords:
            strengths.append("Excellent teamwork and collaboration skills")
        
        return strengths[:3]  # Return top 3 strengths
    
    def identify_improvements(self) -> List[str]:
        """Identify areas for improvement"""
        improvements = []
        
        # Check STAR completeness
        star_scores = [r["analysis"]["star_analysis"] for r in self.responses_collected]
        avg_star = sum(star_scores) / len(star_scores)
        
        if avg_star < 0.6:
            improvements.append("Practice using the STAR method more completely in responses")
        
        # Check response length
        word_counts = [r["analysis"]["word_count"] for r in self.responses_collected]
        avg_words = sum(word_counts) / len(word_counts)
        
        if avg_words < 50:
            improvements.append("Provide more detailed examples and context in responses")
        elif avg_words > 200:
            improvements.append("Focus on being more concise while maintaining key details")
        
        # Check competency diversity
        all_keywords = []
        for response in self.responses_collected:
            all_keywords.extend(response["analysis"]["keywords"])
        
        if len(set(all_keywords)) < 5:
            improvements.append("Demonstrate a broader range of competencies and skills")
        
        return improvements[:3]  # Return top 3 improvement areas
