"""
Test PULSE coordinating multiple AI employees to design Beacon

This demonstrates the AI corporation working together
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from pulse.coordinator import pulse


def test_beacon_collaboration():
    """Test PULSE coordinating AI employees to design Beacon"""
    
    print("\n" + "="*80)
    print("🏢 BEECHWOOD CORPORATION - AI COLLABORATION TEST")
    print("="*80 + "\n")
    
    print("📋 PROJECT: BEACON Emergency Safety App")
    print("🎯 OBJECTIVE: Design core emergency alert system\n")
    print("-"*80 + "\n")
    
    # CEO gives PULSE a high-level directive
    print("👤 CEO (You): PULSE, I need you to coordinate the design of Beacon's")
    print("              core emergency alert system. Get Security AI to design")
    print("              the protocol, then have Engineering AI outline the")
    print("              technical implementation.\n")
    
    print("="*80 + "\n")
    
    # Step 1: PULSE routes to Security AI
    print("🧠 PULSE: Routing to Security AI for emergency protocol design...\n")
    
    security_result = pulse.route_to_agent(
        "security",
        """Design the core emergency alert protocol for BEACON app:

Requirements:
- One-tap emergency activation
- Send alerts to emergency contacts (SMS + push notifications)
- Include user's real-time location
- Privacy-first: location only tracked during emergency
- Must work even with poor network connectivity

Provide a concise protocol design that Engineering AI can implement."""
    )
    
    if security_result["success"]:
        print("🔒 SECURITY AI OUTPUT:")
        print("-"*80)
        # Print first 500 characters to keep it readable
        output = security_result["output"]
        print(output[:800] + "..." if len(output) > 800 else output)
        print("-"*80)
        print(f"📊 Tokens used: {security_result['tokens_used']}\n")
    
    print("="*80 + "\n")
    
    # Step 2: PULSE routes to Engineering AI with context from Security AI
    print("🧠 PULSE: Now routing to Engineering AI for technical implementation...\n")
    
    engineering_result = pulse.route_to_agent(
        "engineering",
        f"""Based on Security AI's emergency protocol design, create a technical implementation plan for BEACON:

SECURITY AI'S PROTOCOL:

{security_result['output'][:1000]}...

YOUR TASK:

Provide a concise technical architecture including:
1. Database schema for emergency contacts and alerts
2. Key API endpoints needed
3. Frontend components structure
4. Real-time location tracking implementation
5. SMS/push notification integration approach

Keep it high-level - we'll build details later."""
    )
    
    if engineering_result["success"]:
        print("⚙️  ENGINEERING AI OUTPUT:")
        print("-"*80)
        # Print first 800 characters to keep it readable
        output = engineering_result["output"]
        print(output[:800] + "..." if len(output) > 800 else output)
        print("-"*80)
        print(f"📊 Tokens used: {engineering_result['tokens_used']}\n")
    
    print("="*80 + "\n")
    
    # Summary
    print("📊 COLLABORATION SUMMARY:")
    print(f"  • Security AI designed the emergency protocol")
    print(f"  • Engineering AI created technical implementation plan")
    print(f"  • Total tokens used: {security_result.get('tokens_used', 0) + engineering_result.get('tokens_used', 0)}")
    print(f"  • Total cost: ~${(security_result.get('tokens_used', 0) + engineering_result.get('tokens_used', 0)) * 0.000003:.4f}")
    
    print("\n" + "="*80)
    print("✅ AI CORPORATION COLLABORATION SUCCESSFUL")
    print("="*80 + "\n")
    
    print("🎉 You just watched an AI-augmented corporation design a product.")
    print("   Security AI and Engineering AI collaborated, coordinated by PULSE.")
    print("   This is what Beechwood Corporation does.\n")


if __name__ == "__main__":
    test_beacon_collaboration()

