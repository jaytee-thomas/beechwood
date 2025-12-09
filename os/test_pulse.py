"""
Test script to verify PULSE is working
"""

import sys
from pathlib import Path

# Add the parent directory to Python path so imports work
sys.path.insert(0, str(Path(__file__).parent))

from pulse.coordinator import pulse


def test_pulse():
    """Test basic PULSE functionality"""
    
    print("\n" + "="*60)
    print("🧪 TESTING PULSE COORDINATOR")
    print("="*60 + "\n")
    
    # Test 1: Get status
    print("📊 PULSE Status:")
    status = pulse.get_status()
    for key, value in status.items():
        print(f"  {key}: {value}")
    
    print("\n" + "-"*60 + "\n")
    
    # Test 2: Send a message to PULSE
    print("💬 Sending test message to PULSE...")
    
    response = pulse.process_request(
        "PULSE, introduce yourself and confirm you're operational. What's your primary function?"
    )
    
    if response["success"]:
        print("\n✅ PULSE Response:")
        print(response["response"])
        print(f"\n📊 Tokens used: {response['tokens_used']}")
    else:
        print("\n❌ Error:")
        print(response["response"])
    
    print("\n" + "="*60)
    print("🎉 PULSE TEST COMPLETE")
    print("="*60 + "\n")


if __name__ == "__main__":
    test_pulse()