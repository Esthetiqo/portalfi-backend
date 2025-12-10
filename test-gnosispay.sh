#!/bin/bash

# GnosisPay API Testing Script
# This script demonstrates how to interact with the GnosisPay API

BASE_URL="http://localhost:3000/gnosispay"
API_BASE_URL="https://api.gnosispay.com"

echo "================================================"
echo "   GnosisPay API Integration Tests"
echo "================================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ==================== AUTHENTICATION ====================
echo -e "${YELLOW}[1] Testing Authentication Flow${NC}"
echo "---"

# Step 1: Generate Nonce
echo -e "${GREEN}Step 1: Generate Nonce${NC}"
echo "curl -X GET $BASE_URL/auth/nonce"
echo ""

# Step 2: Verify SIWE Challenge (requires signing)
echo -e "${GREEN}Step 2: Verify SIWE Challenge${NC}"
cat << 'EOF'
curl -X POST $BASE_URL/auth/challenge \
  -H "Content-Type: application/json" \
  -d '{
    "message": "example.com wants you to sign in with your Ethereum account...",
    "signature": "0x1234567890abcdef...",
    "ttlInSeconds": 3600
  }'
EOF
echo ""

# Step 3: Signup (requires JWT token from our auth)
echo -e "${GREEN}Step 3: Signup User${NC}"
cat << 'EOF'
curl -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "authEmail": "user@example.com",
    "otp": "123456",
    "referralCouponCode": "FRIEND2024"
  }'
EOF
echo ""
echo ""

# ==================== KYC FLOW ====================
echo -e "${YELLOW}[2] Testing KYC Flow${NC}"
echo "---"

# Get KYC Questions
echo -e "${GREEN}Get KYC Questions (Source of Funds)${NC}"
cat << 'EOF'
curl -X GET $BASE_URL/kyc/questions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""

# Submit KYC Answers
echo -e "${GREEN}Submit KYC Answers${NC}"
cat << 'EOF'
curl -X POST $BASE_URL/kyc/answers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "answers": [
      {
        "question": "What is your source of funds?",
        "answer": "Employment income"
      }
    ]
  }'
EOF
echo ""

# Get KYC Access Token (for Sumsub SDK)
echo -e "${GREEN}Get KYC Access Token (Sumsub)${NC}"
cat << 'EOF'
curl -X GET $BASE_URL/kyc/access-token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""

# Get KYC Status
echo -e "${GREEN}Get KYC Status${NC}"
cat << 'EOF'
curl -X GET $BASE_URL/kyc/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""

# Get Complete KYC Flow Status
echo -e "${GREEN}Get Complete KYC Flow Status${NC}"
cat << 'EOF'
curl -X GET $BASE_URL/kyc/flow-status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""

# Phone Verification
echo -e "${GREEN}Send Phone Verification OTP${NC}"
cat << 'EOF'
curl -X POST $BASE_URL/kyc/phone/send-otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "phone": "+1234567890"
  }'
EOF
echo ""

echo -e "${GREEN}Verify Phone OTP${NC}"
cat << 'EOF'
curl -X POST $BASE_URL/kyc/phone/verify-otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "otp": "123456"
  }'
EOF
echo ""
echo ""

# ==================== CARD MANAGEMENT ====================
echo -e "${YELLOW}[3] Testing Card Management${NC}"
echo "---"

# Get All Cards
echo -e "${GREEN}Get All Cards${NC}"
cat << 'EOF'
curl -X GET $BASE_URL/cards \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""

# Create Virtual Card
echo -e "${GREEN}Create Virtual Card${NC}"
cat << 'EOF'
curl -X POST $BASE_URL/cards/virtual \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""

# Get Card by ID
echo -e "${GREEN}Get Card by ID${NC}"
cat << 'EOF'
curl -X GET $BASE_URL/cards/CARD_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""

# Activate Card
echo -e "${GREEN}Activate Card${NC}"
cat << 'EOF'
curl -X POST $BASE_URL/cards/CARD_ID/activate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""

# Freeze Card
echo -e "${GREEN}Freeze Card${NC}"
cat << 'EOF'
curl -X POST $BASE_URL/cards/CARD_ID/freeze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""

# Unfreeze Card
echo -e "${GREEN}Unfreeze Card${NC}"
cat << 'EOF'
curl -X POST $BASE_URL/cards/CARD_ID/unfreeze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""

# Report Card Lost
echo -e "${GREEN}Report Card as Lost${NC}"
cat << 'EOF'
curl -X POST $BASE_URL/cards/CARD_ID/report-lost \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""

# Get Card Transactions
echo -e "${GREEN}Get Card Transactions${NC}"
cat << 'EOF'
curl -X GET $BASE_URL/cards/CARD_ID/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
EOF
echo ""
echo ""

# ==================== DIRECT API TESTS ====================
echo -e "${YELLOW}[4] Direct GnosisPay API Tests${NC}"
echo "---"

# Direct Nonce Generation
echo -e "${GREEN}Direct API: Generate Nonce${NC}"
cat << 'EOF'
curl -X GET https://api.gnosispay.com/api/v1/auth/nonce
EOF
echo ""

echo ""
echo "================================================"
echo "   Test Script Complete"
echo "================================================"
echo ""
echo "To run actual tests, replace:"
echo "  - YOUR_JWT_TOKEN with your actual JWT token"
echo "  - CARD_ID with actual card IDs"
echo ""
echo "View Swagger documentation at: http://localhost:3000/api"
echo ""
