"""
Test script for Engineering AI
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from agents.engineering_ai import engineering_ai


def test_engineering_ai():
    """Test Engineering AI functionality"""
    
    print("\n" + "="*60)
    print("🧪 TESTING ENGINEERING AI")
    print("="*60 + "\n")
    
    # Test 1: Get status
    print("📊 Engineering AI Status:")
    status = engineering_ai.get_status()
    for key, value in status.items():
        print(f"  {key}: {value}")
    
    print("\n" + "-"*60 + "\n")
    
    # Test 2: Give Engineering AI a simple coding task
    print("💬 Assigning task to Engineering AI...")
    print("Task: Create a simple Python function to calculate factorial\n")
    
    response = engineering_ai.execute_task(
        "Create a Python function called 'calculate_factorial' that takes a number and returns its factorial. Include error handling and docstring."
    )
    
    if response["success"]:
        print("✅ Engineering AI Response:")
        print(response["output"])
        print(f"\n📊 Tokens used: {response['tokens_used']}")
    else:
        print("❌ Error:")
        print(response["output"])
    
    print("\n" + "="*60)
    print("🎉 ENGINEERING AI TEST COMPLETE")
    print("="*60 + "\n")


if __name__ == "__main__":
    test_engineering_ai()

