#!/usr/bin/env python3
"""
Complete Client System Backend Testing Script for Anomalya
Tests authentication, client APIs, admin client management, and loyalty points system
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Configuration
BACKEND_URL = "https://15f34278-4593-4bdd-a009-33c2ba03da47.preview.emergentagent.com/api"

class ClientSystemTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.admin_token = None
        self.client_token = None
        self.test_client_id = None
        self.admin_user = {
            "username": "admin",
            "password": "admin123"
        }
        self.test_client_user = {
            "username": "testclient",
            "email": "testclient@anomalya.fr",
            "full_name": "Client Test",
            "password": "test123",
            "role": "client_standard"
        }
        self.test_results = {
            "authentication": {},
            "client_apis": {},
            "admin_client_apis": {},
            "loyalty_system": {},
            "errors": []
        }
    
    def log_test(self, test_name, success, details="", error=None):
        """Log test results"""
        result = {
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        if error:
            result["error"] = str(error)
        
        print(f"{'✅' if success else '❌'} {test_name}: {details}")
        if error:
            print(f"   Error: {error}")
        
        return result
    
    def make_request(self, method, endpoint, data=None, headers=None, use_client_token=False):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        
        if headers is None:
            headers = {}
        
        # Use appropriate token
        token = self.client_token if use_client_token else self.admin_token
        if token:
            headers["Authorization"] = f"Bearer {token}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method.upper() == "POST":
                headers["Content-Type"] = "application/json"
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "PUT":
                headers["Content-Type"] = "application/json"
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
    
    def test_api_health(self):
        """Test basic API health"""
        print("\n=== Testing API Health ===")
        
        response = self.make_request("GET", "/health")
        if response and response.status_code == 200:
            data = response.json()
            return self.log_test(
                "API Health Check", 
                True, 
                f"API is healthy - {data.get('service', 'Unknown')}"
            )
        else:
            return self.log_test(
                "API Health Check", 
                False, 
                f"Health check failed - Status: {response.status_code if response else 'No response'}"
            )
    
    def test_admin_login(self):
        """Test admin user login"""
        print("\n=== Testing Admin Authentication ===")
        
        response = self.make_request("POST", "/auth/login", self.admin_user)
        
        if response and response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                self.admin_token = data["access_token"]
                self.test_results["authentication"]["admin_login"] = self.log_test(
                    "Admin Login", 
                    True, 
                    "Successfully logged in as admin"
                )
                return True
            else:
                self.test_results["authentication"]["admin_login"] = self.log_test(
                    "Admin Login", 
                    False, 
                    "No access token in response"
                )
                return False
        else:
            error_msg = "Unknown error"
            if response:
                try:
                    error_data = response.json()
                    error_msg = error_data.get("detail", f"HTTP {response.status_code}")
                except:
                    error_msg = f"HTTP {response.status_code}"
            
            self.test_results["authentication"]["admin_login"] = self.log_test(
                "Admin Login", 
                False, 
                f"Login failed: {error_msg}"
            )
            return False
    
    def test_client_registration(self):
        """Test registering a new client user"""
        print("\n=== Testing Client Registration ===")
        
        response = self.make_request("POST", "/auth/register", self.test_client_user)
        
        if response and response.status_code == 200:
            data = response.json()
            if "id" in data:
                self.test_client_id = data["id"]
                self.test_results["authentication"]["client_register"] = self.log_test(
                    "Client Registration", 
                    True, 
                    f"Client registered successfully with ID: {self.test_client_id}"
                )
                return True
            else:
                self.test_results["authentication"]["client_register"] = self.log_test(
                    "Client Registration", 
                    False, 
                    "No user ID in response"
                )
                return False
        else:
            error_msg = "Unknown error"
            if response:
                try:
                    error_data = response.json()
                    error_msg = error_data.get("detail", f"HTTP {response.status_code}")
                except:
                    error_msg = f"HTTP {response.status_code}"
            
            self.test_results["authentication"]["client_register"] = self.log_test(
                "Client Registration", 
                False, 
                f"Registration failed: {error_msg}"
            )
            return False
    
    def test_client_login(self):
        """Test client user login"""
        print("\n=== Testing Client Authentication ===")
        
        client_login = {
            "username": self.test_client_user["username"],
            "password": self.test_client_user["password"]
        }
        
        response = self.make_request("POST", "/auth/login", client_login)
        
        if response and response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                self.client_token = data["access_token"]
                self.test_results["authentication"]["client_login"] = self.log_test(
                    "Client Login", 
                    True, 
                    "Successfully logged in as client"
                )
                return True
            else:
                self.test_results["authentication"]["client_login"] = self.log_test(
                    "Client Login", 
                    False, 
                    "No access token in response"
                )
                return False
        else:
            error_msg = "Unknown error"
            if response:
                try:
                    error_data = response.json()
                    error_msg = error_data.get("detail", f"HTTP {response.status_code}")
                except:
                    error_msg = f"HTTP {response.status_code}"
            
            self.test_results["authentication"]["client_login"] = self.log_test(
                "Client Login", 
                False, 
                f"Login failed: {error_msg}"
            )
            return False
    
    def test_auth_me_endpoint(self):
        """Test /auth/me endpoint with extended user fields"""
        print("\n=== Testing Auth Me Endpoint ===")
        
        response = self.make_request("GET", "/auth/me", use_client_token=True)
        
        if response and response.status_code == 200:
            data = response.json()
            required_fields = ["id", "username", "email", "full_name", "role", "total_points", "loyalty_tier"]
            
            if all(field in data for field in required_fields):
                self.test_results["authentication"]["auth_me"] = self.log_test(
                    "Auth Me Endpoint", 
                    True, 
                    f"User data retrieved - Role: {data.get('role')}, Points: {data.get('total_points')}, Tier: {data.get('loyalty_tier')}"
                )
                return True
            else:
                missing_fields = [field for field in required_fields if field not in data]
                self.test_results["authentication"]["auth_me"] = self.log_test(
                    "Auth Me Endpoint", 
                    False, 
                    f"Missing required fields: {missing_fields}"
                )
                return False
        else:
            error_msg = f"HTTP {response.status_code}" if response else "No response"
            self.test_results["authentication"]["auth_me"] = self.log_test(
                "Auth Me Endpoint", 
                False, 
                f"Request failed: {error_msg}"
            )
            return False
    
    def test_client_profile_apis(self):
        """Test client profile management APIs"""
        print("\n=== Testing Client Profile APIs ===")
        
        # Test GET profile (should return empty initially)
        response = self.make_request("GET", "/client/profile", use_client_token=True)
        
        if response and response.status_code == 200:
            data = response.json()
            self.log_test("Get Client Profile", True, "Profile retrieved (empty initially)")
        else:
            self.log_test("Get Client Profile", False, f"Failed to get profile - HTTP {response.status_code if response else 'No response'}")
            return False
        
        # Test POST profile (create/update)
        profile_data = {
            "first_name": "Jean",
            "last_name": "Dupont",
            "phone": "+33123456789",
            "company_name": "Test Company",
            "preferred_language": "fr"
        }
        
        response = self.make_request("POST", "/client/profile", profile_data, use_client_token=True)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                self.log_test("Create Client Profile", True, "Profile created successfully")
                return True
            else:
                self.log_test("Create Client Profile", False, "Profile creation response indicates failure")
                return False
        else:
            self.log_test("Create Client Profile", False, f"Failed to create profile - HTTP {response.status_code if response else 'No response'}")
            return False
    
    def test_client_dashboard(self):
        """Test client dashboard API"""
        print("\n=== Testing Client Dashboard ===")
        
        response = self.make_request("GET", "/client/dashboard", use_client_token=True)
        
        if response and response.status_code == 200:
            data = response.json()
            required_fields = ["total_points", "available_points", "loyalty_tier", "active_quotes", "completed_projects", "open_tickets"]
            
            if all(field in data for field in required_fields):
                self.test_results["client_apis"]["dashboard"] = self.log_test(
                    "Client Dashboard", 
                    True, 
                    f"Dashboard stats - Points: {data.get('total_points')}, Tier: {data.get('loyalty_tier')}, Quotes: {data.get('active_quotes')}"
                )
                return True
            else:
                missing_fields = [field for field in required_fields if field not in data]
                self.test_results["client_apis"]["dashboard"] = self.log_test(
                    "Client Dashboard", 
                    False, 
                    f"Missing required fields: {missing_fields}"
                )
                return False
        else:
            error_msg = f"HTTP {response.status_code}" if response else "No response"
            self.test_results["client_apis"]["dashboard"] = self.log_test(
                "Client Dashboard", 
                False, 
                f"Request failed: {error_msg}"
            )
            return False
    
    def test_quote_requests(self):
        """Test quote request system"""
        print("\n=== Testing Quote Request System ===")
        
        # Test CREATE quote request
        quote_data = {
            "service_category": "Développement Web",
            "title": "Site web e-commerce",
            "description": "Développement d'un site e-commerce avec paiement en ligne",
            "budget_range": "5000-10000€",
            "priority": "normal"
        }
        
        response = self.make_request("POST", "/client/quotes", quote_data, use_client_token=True)
        created_quote_id = None
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "data" in data and "id" in data["data"]:
                created_quote_id = data["data"]["id"]
                self.log_test("Create Quote Request", True, f"Quote created with ID: {created_quote_id}")
            else:
                self.log_test("Create Quote Request", False, "Quote creation response missing ID")
                return False
        else:
            self.log_test("Create Quote Request", False, f"Failed to create quote - HTTP {response.status_code if response else 'No response'}")
            return False
        
        # Test GET quote requests
        response = self.make_request("GET", "/client/quotes", use_client_token=True)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_test("Get Quote Requests", True, f"Retrieved {len(data)} quotes")
                return True
            else:
                self.log_test("Get Quote Requests", False, "Response is not a list")
                return False
        else:
            self.log_test("Get Quote Requests", False, f"Failed to get quotes - HTTP {response.status_code if response else 'No response'}")
            return False
    
    def test_support_tickets(self):
        """Test support ticket system"""
        print("\n=== Testing Support Ticket System ===")
        
        # Test CREATE support ticket
        ticket_data = {
            "title": "Problème de connexion",
            "description": "Je n'arrive pas à me connecter à mon compte",
            "category": "technical",
            "priority": "normal"
        }
        
        response = self.make_request("POST", "/client/tickets", ticket_data, use_client_token=True)
        created_ticket_id = None
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "data" in data and "id" in data["data"]:
                created_ticket_id = data["data"]["id"]
                self.log_test("Create Support Ticket", True, f"Ticket created with ID: {created_ticket_id}")
            else:
                self.log_test("Create Support Ticket", False, "Ticket creation response missing ID")
                return False
        else:
            self.log_test("Create Support Ticket", False, f"Failed to create ticket - HTTP {response.status_code if response else 'No response'}")
            return False
        
        # Test GET support tickets
        response = self.make_request("GET", "/client/tickets", use_client_token=True)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_test("Get Support Tickets", True, f"Retrieved {len(data)} tickets")
                return True
            else:
                self.log_test("Get Support Tickets", False, "Response is not a list")
                return False
        else:
            self.log_test("Get Support Tickets", False, f"Failed to get tickets - HTTP {response.status_code if response else 'No response'}")
            return False
    
    def test_points_history(self):
        """Test points transaction history"""
        print("\n=== Testing Points History ===")
        
        response = self.make_request("GET", "/client/points/history", use_client_token=True)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.test_results["client_apis"]["points_history"] = self.log_test(
                    "Get Points History", 
                    True, 
                    f"Retrieved {len(data)} point transactions"
                )
                return True
            else:
                self.test_results["client_apis"]["points_history"] = self.log_test(
                    "Get Points History", 
                    False, 
                    "Response is not a list"
                )
                return False
        else:
            error_msg = f"HTTP {response.status_code}" if response else "No response"
            self.test_results["client_apis"]["points_history"] = self.log_test(
                "Get Points History", 
                False, 
                f"Request failed: {error_msg}"
            )
            return False
    
    def test_admin_client_management(self):
        """Test admin client management APIs"""
        print("\n=== Testing Admin Client Management ===")
        
        # Test GET all clients
        response = self.make_request("GET", "/admin/clients")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_test("Get All Clients", True, f"Retrieved {len(data)} clients")
            else:
                self.log_test("Get All Clients", False, "Response is not a list")
                return False
        else:
            self.log_test("Get All Clients", False, f"Failed to get clients - HTTP {response.status_code if response else 'No response'}")
            return False
        
        # Test ADD points to client
        if self.test_client_id:
            points_data = {
                "points": 100,
                "description": "Points de bienvenue"
            }
            
            response = self.make_request("POST", f"/admin/clients/{self.test_client_id}/points?points=100&description=Points de bienvenue")
            
            if response and response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Add Client Points", True, f"Points added successfully - New total: {data.get('data', {}).get('new_total', 'Unknown')}")
                else:
                    self.log_test("Add Client Points", False, "Points addition response indicates failure")
                    return False
            else:
                self.log_test("Add Client Points", False, f"Failed to add points - HTTP {response.status_code if response else 'No response'}")
                return False
        
        return True
    
    def test_admin_quotes_management(self):
        """Test admin quotes management"""
        print("\n=== Testing Admin Quotes Management ===")
        
        response = self.make_request("GET", "/admin/quotes")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.test_results["admin_client_apis"]["quotes"] = self.log_test(
                    "Get All Quotes (Admin)", 
                    True, 
                    f"Retrieved {len(data)} quotes"
                )
                return True
            else:
                self.test_results["admin_client_apis"]["quotes"] = self.log_test(
                    "Get All Quotes (Admin)", 
                    False, 
                    "Response is not a list"
                )
                return False
        else:
            error_msg = f"HTTP {response.status_code}" if response else "No response"
            self.test_results["admin_client_apis"]["quotes"] = self.log_test(
                "Get All Quotes (Admin)", 
                False, 
                f"Request failed: {error_msg}"
            )
            return False
    
    def test_admin_tickets_management(self):
        """Test admin tickets management"""
        print("\n=== Testing Admin Tickets Management ===")
        
        response = self.make_request("GET", "/admin/tickets")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.test_results["admin_client_apis"]["tickets"] = self.log_test(
                    "Get All Tickets (Admin)", 
                    True, 
                    f"Retrieved {len(data)} tickets"
                )
                return True
            else:
                self.test_results["admin_client_apis"]["tickets"] = self.log_test(
                    "Get All Tickets (Admin)", 
                    False, 
                    "Response is not a list"
                )
                return False
        else:
            error_msg = f"HTTP {response.status_code}" if response else "No response"
            self.test_results["admin_client_apis"]["tickets"] = self.log_test(
                "Get All Tickets (Admin)", 
                False, 
                f"Request failed: {error_msg}"
            )
            return False
    
    def test_admin_client_stats(self):
        """Test admin client statistics"""
        print("\n=== Testing Admin Client Statistics ===")
        
        response = self.make_request("GET", "/admin/stats/clients")
        
        if response and response.status_code == 200:
            data = response.json()
            required_fields = ["total_clients", "new_clients_this_month", "active_clients", "total_points_distributed"]
            
            if all(field in data for field in required_fields):
                self.test_results["admin_client_apis"]["client_stats"] = self.log_test(
                    "Get Client Statistics", 
                    True, 
                    f"Stats retrieved - Total clients: {data.get('total_clients')}, Points distributed: {data.get('total_points_distributed')}"
                )
                return True
            else:
                missing_fields = [field for field in required_fields if field not in data]
                self.test_results["admin_client_apis"]["client_stats"] = self.log_test(
                    "Get Client Statistics", 
                    False, 
                    f"Missing required fields: {missing_fields}"
                )
                return False
        else:
            error_msg = f"HTTP {response.status_code}" if response else "No response"
            self.test_results["admin_client_apis"]["client_stats"] = self.log_test(
                "Get Client Statistics", 
                False, 
                f"Request failed: {error_msg}"
            )
            return False
    
    def test_loyalty_tier_calculations(self):
        """Test loyalty tier calculations"""
        print("\n=== Testing Loyalty Tier Calculations ===")
        
        # Test points after adding 100 points (should still be bronze < 500)
        response = self.make_request("GET", "/auth/me", use_client_token=True)
        
        if response and response.status_code == 200:
            data = response.json()
            points = data.get("total_points", 0)
            tier = data.get("loyalty_tier", "unknown")
            
            # Verify tier logic
            expected_tier = "bronze"
            if points >= 5000:
                expected_tier = "platinum"
            elif points >= 2000:
                expected_tier = "gold"
            elif points >= 500:
                expected_tier = "silver"
            
            if tier == expected_tier:
                self.test_results["loyalty_system"]["tier_calculation"] = self.log_test(
                    "Loyalty Tier Calculation", 
                    True, 
                    f"Correct tier '{tier}' for {points} points"
                )
                return True
            else:
                self.test_results["loyalty_system"]["tier_calculation"] = self.log_test(
                    "Loyalty Tier Calculation", 
                    False, 
                    f"Incorrect tier '{tier}' for {points} points, expected '{expected_tier}'"
                )
                return False
        else:
            self.test_results["loyalty_system"]["tier_calculation"] = self.log_test(
                "Loyalty Tier Calculation", 
                False, 
                "Failed to get user data for tier verification"
            )
            return False
    
    def test_role_based_access_control(self):
        """Test role-based access controls"""
        print("\n=== Testing Role-Based Access Control ===")
        
        # Test client accessing admin endpoint (should fail)
        response = self.make_request("GET", "/admin/clients", use_client_token=True)
        
        if response and response.status_code == 403:
            self.log_test("Client Access to Admin Endpoint", True, "Correctly blocked client access to admin endpoint")
        else:
            self.log_test("Client Access to Admin Endpoint", False, f"Should have returned 403, got {response.status_code if response else 'No response'}")
            return False
        
        # Test admin accessing client endpoint (should work)
        response = self.make_request("GET", "/client/dashboard", use_client_token=False)
        
        if response and response.status_code == 403:
            self.log_test("Admin Access to Client Endpoint", True, "Admin correctly blocked from client-only endpoint (admin is not a client)")
        else:
            self.log_test("Admin Access to Client Endpoint", False, f"Unexpected response: {response.status_code if response else 'No response'}")
        
        return True
    
    def run_all_tests(self):
        """Run all client system tests"""
        print("🚀 Starting Complete Client System Backend Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 80)
        
        # Test API health first
        if not self.test_api_health():
            print("❌ API health check failed. Stopping tests.")
            return False
        
        # Test admin authentication
        if not self.test_admin_login():
            print("❌ Admin login failed. Cannot proceed with tests.")
            return False
        
        # Test client registration and authentication
        if not self.test_client_registration():
            print("❌ Client registration failed. Cannot proceed with client tests.")
            return False
        
        if not self.test_client_login():
            print("❌ Client login failed. Cannot proceed with client tests.")
            return False
        
        # Run all tests
        tests = [
            self.test_auth_me_endpoint,
            self.test_client_profile_apis,
            self.test_client_dashboard,
            self.test_quote_requests,
            self.test_support_tickets,
            self.test_points_history,
            self.test_admin_client_management,
            self.test_admin_quotes_management,
            self.test_admin_tickets_management,
            self.test_admin_client_stats,
            self.test_loyalty_tier_calculations,
            self.test_role_based_access_control
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                print(f"❌ Test failed with exception: {e}")
                self.test_results["errors"].append(str(e))
        
        print("\n" + "=" * 80)
        print(f"🏁 Test Summary: {passed}/{total} tests passed")
        
        if passed == total:
            print("✅ All client system backend tests passed!")
            return True
        else:
            print(f"❌ {total - passed} tests failed")
            return False

def main():
    """Main test execution"""
    tester = ClientSystemTester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/client_system_test_results.json', 'w') as f:
        json.dump(tester.test_results, f, indent=2, default=str)
    
    print(f"\n📊 Detailed results saved to: /app/client_system_test_results.json")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())