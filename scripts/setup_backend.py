import os
import subprocess
import sys

def install_requirements():
    """Install required Python packages"""
    requirements = [
        "fastapi==0.104.1",
        "uvicorn==0.24.0",
        "openai==1.3.0",
        "anthropic==0.7.0",
        "requests==2.31.0",
        "python-multipart==0.0.6",
        "python-dotenv==1.0.0",
        "pydantic==2.5.0",
        "websockets==12.0",
        "numpy==1.24.3",
        "scikit-learn==1.3.0",
        "textblob==0.17.1",
        "asyncio-mqtt==0.13.0"
    ]
    
    for package in requirements:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✓ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"✗ Failed to install {package}")

def create_env_file():
    """Create .env file with required API keys"""
    env_content = """# AI API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Judge0 Configuration
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_here

# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key_here
LIVEKIT_API_SECRET=your_livekit_api_secret_here
LIVEKIT_WS_URL=wss://your-livekit-server.com

# Vector Database (Pinecone)
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment

# Database
DATABASE_URL=sqlite:///./interview_platform.db

# Application Settings
SECRET_KEY=your_secret_key_here
DEBUG=True
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✓ Created .env file - Please update with your actual API keys")

if __name__ == "__main__":
    print("Setting up AI Recruiter Backend...")
    install_requirements()
    create_env_file()
    print("\n🚀 Backend setup complete!")
    print("\n📝 Next steps:")
    print("1. Update .env file with your API keys")
    print("2. Run: python scripts/start_backend.py")
