"""
Test script for Security AI
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from agents.security_ai import security_ai


def test_security_ai():
    """Test Security AI functionality"""
    
    print("\n" + "="*60)
    print("🧪 TESTING SECURITY AI")
    print("="*60 + "\n")
    
    # Test 1: Get status
    print("📊 Security AI Status:")
    status = security_ai.get_status()
    for key, value in status.items():
        print(f"  {key}: {value}")
    
    print("\n" + "-"*60 + "\n")
    
    # Test 2: Ask Security AI to design a simple emergency alert system
    print("💬 Assigning task to Security AI...")
    print("Task: Design emergency alert protocol for a safety app\n")
    
    response = security_ai.execute_task(
        """Design a simple but robust emergency alert protocol for a mobile safety app. 

        The system needs to:
        - Allow users to trigger an emergency alert with one tap
        - Send SMS alerts to 3 emergency contacts
        - Include the user's location in the alert
        - Be privacy-first (location only shared during emergency)

        Keep it concise - just the core protocol design."""
    )
    
    if response["success"]:
        print("✅ Security AI Response:")
        print(response["output"])
        print(f"\n📊 Tokens used: {response['tokens_used']}")
    else:
        print("❌ Error:")
        print(response["output"])
    
    print("\n" + "="*60)
    print("🎉 SECURITY AI TEST COMPLETE")
    print("="*60 + "\n")


if __name__ == "__main__":
    test_security_ai()

