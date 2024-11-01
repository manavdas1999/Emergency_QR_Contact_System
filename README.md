# Emergency_QR_Contact_System
 
# Sprint 1: MVP (Basic System for QR Code and Contact Retrieval)
Duration: 1 week

Goal: Create a working system that generates a QR code with a token, stores emergency contact information, and retrieves this information when the QR is scanned.

Tasks:

1. QR Code Generation:
    Generate a unique token.
    Store the token and emergency contact data in a simple database (Firebase).
    Generate a QR code with the token embedded as a URL.
2. Backend Setup:
    Set up a simple Flask server.
    Create an endpoint (/verify/<token>) to validate the token and return emergency contact data.
3. Frontend for QR Scan:
    Set up a basic frontend (simple webpage or mobile app) that displays emergency contact data when the QR code is scanned.
    Outcome:

A QR code can be generated, and when scanned, emergency contact information is retrieved and displayed. This is the core MVP, focusing on functionality over security for now.

# Result: Successful

