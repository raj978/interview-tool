import aiohttp
import asyncio
import base64
import os
from typing import Dict, Any, Optional

class Judge0Service:
    """Service for executing code using Judge0 API"""
    
    def __init__(self):
        self.api_url = os.getenv("JUDGE0_API_URL", "https://judge0-ce.p.rapidapi.com")
        self.api_key = os.getenv("JUDGE0_API_KEY")
        self.headers = {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json"
        }
        
        # Language ID mappings for Judge0
        self.language_ids = {
            "python": 71,  # Python 3.8.1
            "java": 62,    # Java 13.0.1
            "cpp": 54,     # C++ 17
            "javascript": 63,  # Node.js 12.14.0
            "c": 50        # C 11
        }
    
    async def execute_code(self, source_code: str, language: str, test_cases: list, time_limit: int = 5) -> Dict[str, Any]:
        """Execute code with test cases"""
        
        if not self.api_key:
            return self.simulate_execution(source_code, language, test_cases)
        
        language_id = self.language_ids.get(language.lower())
        if not language_id:
            return {"error": f"Unsupported language: {language}"}
        
        results = []
        
        async with aiohttp.ClientSession() as session:
            for i, test_case in enumerate(test_cases):
                try:
                    # Prepare submission
                    submission_data = {
                        "source_code": base64.b64encode(source_code.encode()).decode(),
                        "language_id": language_id,
                        "stdin": base64.b64encode(test_case.get("input", "").encode()).decode(),
                        "expected_output": base64.b64encode(test_case.get("expected", "").encode()).decode(),
                        "cpu_time_limit": time_limit,
                        "memory_limit": 256000  # 256 MB
                    }
                    
                    # Submit code
                    async with session.post(
                        f"{self.api_url}/submissions",
                        json=submission_data,
                        headers=self.headers
                    ) as response:
                        if response.status != 201:
                            results.append({
                                "test_case": i + 1,
                                "status": "error",
                                "error": f"Submission failed: {response.status}"
                            })
                            continue
                        
                        submission = await response.json()
                        token = submission["token"]
                    
                    # Wait for execution and get result
                    result = await self.get_submission_result(session, token)
                    results.append({
                        "test_case": i + 1,
                        "status": result.get("status", {}).get("description", "Unknown"),
                        "passed": result.get("stdout", "").strip() == test_case.get("expected", "").strip(),
                        "output": result.get("stdout", ""),
                        "error": result.get("stderr", ""),
                        "time": result.get("time", 0),
                        "memory": result.get("memory", 0)
                    })
                    
                except Exception as e:
                    results.append({
                        "test_case": i + 1,
                        "status": "error",
                        "error": str(e)
                    })
        
        # Calculate summary
        passed_tests = sum(1 for r in results if r.get("passed", False))
        total_tests = len(test_cases)
        pass_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        avg_time = sum(r.get("time", 0) for r in results) / len(results) if results else 0
        max_memory = max(r.get("memory", 0) for r in results) if results else 0
        
        return {
            "results": results,
            "summary": {
                "passed": passed_tests,
                "total": total_tests,
                "pass_rate": pass_rate,
                "avg_execution_time": avg_time,
                "max_memory_usage": max_memory,
                "overall_status": "passed" if passed_tests == total_tests else "failed"
            }
        }
    
    async def get_submission_result(self, session: aiohttp.ClientSession, token: str, max_wait: int = 30) -> Dict[str, Any]:
        """Get submission result with polling"""
        
        for _ in range(max_wait):
            try:
                async with session.get(
                    f"{self.api_url}/submissions/{token}",
                    headers=self.headers
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        
                        # Check if execution is complete
                        status_id = result.get("status", {}).get("id")
                        if status_id not in [1, 2]:  # Not "In Queue" or "Processing"
                            return result
                
                await asyncio.sleep(1)
                
            except Exception as e:
                print(f"Error polling submission {token}: {e}")
                break
        
        return {"status": {"description": "Timeout"}, "error": "Execution timeout"}
    
    def simulate_execution(self, source_code: str, language: str, test_cases: list) -> Dict[str, Any]:
        """Simulate code execution when Judge0 API is not available"""
        
        import random
        import time
        
        results = []
        
        for i, test_case in enumerate(test_cases):
            # Simulate execution with random results
            passed = random.choice([True, True, False])  # 66% pass rate
            exec_time = random.uniform(0.1, 2.0)
            memory_usage = random.randint(1000, 50000)
            
            results.append({
                "test_case": i + 1,
                "status": "Accepted" if passed else "Wrong Answer",
                "passed": passed,
                "output": test_case.get("expected", "") if passed else "Different output",
                "error": "" if passed else "Output doesn't match expected result",
                "time": exec_time,
                "memory": memory_usage
            })
        
        passed_tests = sum(1 for r in results if r["passed"])
        total_tests = len(test_cases)
        pass_rate = (passed_tests / total_tests) * 100
        
        return {
            "results": results,
            "summary": {
                "passed": passed_tests,
                "total": total_tests,
                "pass_rate": pass_rate,
                "avg_execution_time": sum(r["time"] for r in results) / len(results),
                "max_memory_usage": max(r["memory"] for r in results),
                "overall_status": "passed" if passed_tests == total_tests else "failed"
            },
            "simulated": True
        }
    
    async def health_check(self) -> bool:
        """Check if Judge0 service is available"""
        if not self.api_key:
            return False
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.api_url}/system_info",
                    headers=self.headers,
                    timeout=aiohttp.ClientTimeout(total=5)
                ) as response:
                    return response.status == 200
        except:
            return False
