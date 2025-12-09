"""
Script to have Engineering AI generate Beacon's app structure
"""

import sys
from pathlib import Path

# Add OS directory to path
sys.path.insert(0, str(Path(__file__).parent / "os"))

from agents.engineering_ai import engineering_ai


def main():
    print("\n" + "="*80)
    print("🏗️  ENGINEERING AI - GENERATING BEACON APP STRUCTURE")
    print("="*80 + "\n")
    
    task = """Generate the complete app structure and core components for BEACON emergency app.

CONTEXT FROM SECURITY AI:

- One-tap emergency activation
- Emergency contact management (up to 3 contacts)
- Real-time location tracking (privacy-first, opt-in)
- SMS + push notification alerts
- 3-second countdown before alert sends (with cancel option)

TECH STACK:

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (will integrate later)

GENERATE:

1. **Main Page (app/page.tsx)** - The home screen with emergency button

2. **Core Components** - Complete, production-ready code:

   a) EmergencyButton component - Large, prominent one-tap trigger (red button)

   b) ContactsList component - Display emergency contacts

   c) EmergencyCountdown component - 3-second countdown modal with cancel button

3. **TypeScript Types (types/index.ts)** - EmergencyContact, EmergencySession, Location types

4. **Keep it simple for Phase 1** - We'll add Supabase integration in Phase 2

Provide complete file contents with exact file paths relative to the Next.js app root.

Use Tailwind CSS for all styling - make it look professional and emergency-appropriate (red theme for emergency button).
"""
    
    print("📤 Sending request to Engineering AI...\n")
    
    result = engineering_ai.execute_task(task)
    
    if result["success"]:
        print("✅ ENGINEERING AI RESPONSE:\n")
        print("="*80)
        print(result["output"])
        print("="*80)
        print(f"\n📊 Tokens used: {result['tokens_used']}")
        print(f"💰 Cost: ~${result['tokens_used'] * 0.000003:.4f}")
    else:
        print(f"❌ Error: {result['output']}")
    
    print("\n" + "="*80)
    print("✅ STRUCTURE GENERATION COMPLETE")
    print("="*80 + "\n")


if __name__ == "__main__":
    main()

