#!/usr/bin/env python3
"""
Backend API Testing Script for Anomalya Admin Panel
Tests JWT authentication and all admin endpoints
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Configuration
BACKEND_URL = "https://15f34278-4593-4bdd-a009-33c2ba03da47.preview.emergentagent.com/api"

class AdminPanelTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.access_token = None
        self.admin_user = {
            "username": "admin",
            "password": "admin123"
        }
        self.test_results = {
            "authentication": {},
            "admin_endpoints": {},
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
    
    def make_request(self, method, endpoint, data=None, headers=None):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        
        if headers is None:
            headers = {}
        
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        
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
    
    def test_health_check(self):
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
                self.access_token = data["access_token"]
                self.test_results["authentication"]["login"] = self.log_test(
                    "Admin Login", 
                    True, 
                    "Successfully logged in as admin"
                )
                return True
            else:
                self.test_results["authentication"]["login"] = self.log_test(
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
            
            self.test_results["authentication"]["login"] = self.log_test(
                "Admin Login", 
                False, 
                f"Login failed: {error_msg}"
            )
            return False
    
    def test_dashboard_stats(self):
        """Test admin dashboard stats endpoint"""
        print("\n=== Testing Dashboard Stats ===")
        
        response = self.make_request("GET", "/admin/dashboard/stats")
        
        if response and response.status_code == 200:
            data = response.json()
            required_keys = ["totals", "recent_contacts", "recent_articles"]
            
            if all(key in data for key in required_keys):
                totals = data["totals"]
                self.test_results["admin_endpoints"]["dashboard_stats"] = self.log_test(
                    "Dashboard Stats", 
                    True, 
                    f"Stats retrieved - Articles: {totals.get('articles', 0)}, Users: {totals.get('users', 0)}, Contacts: {totals.get('contacts', 0)}"
                )
                return True
            else:
                self.test_results["admin_endpoints"]["dashboard_stats"] = self.log_test(
                    "Dashboard Stats", 
                    False, 
                    f"Missing required keys in response: {required_keys}"
                )
                return False
        else:
            error_msg = f"HTTP {response.status_code}" if response else "No response"
            self.test_results["admin_endpoints"]["dashboard_stats"] = self.log_test(
                "Dashboard Stats", 
                False, 
                f"Request failed: {error_msg}"
            )
            return False
    
    def test_articles_crud(self):
        """Test articles CRUD operations"""
        print("\n=== Testing Articles CRUD ===")
        
        # Test GET articles
        response = self.make_request("GET", "/admin/articles")
        if response and response.status_code == 200:
            data = response.json()
            self.log_test("Get Articles", True, f"Retrieved {data.get('total', 0)} articles")
        else:
            self.log_test("Get Articles", False, f"Failed to get articles - HTTP {response.status_code if response else 'No response'}")
            return False
        
        # Test CREATE article
        test_article = {
            "title": "Test Article - Admin Panel",
            "category": "Technologie",
            "excerpt": "Article de test créé par le système d'administration",
            "content": "Contenu détaillé de l'article de test pour vérifier le bon fonctionnement du CRUD.",
            "image": "https://via.placeholder.com/800x400",
            "author": "Admin Test",
            "readTime": "3 min",
            "tags": ["test", "admin", "crud"],
            "isPinned": False
        }
        
        response = self.make_request("POST", "/admin/articles", test_article)
        created_article_id = None
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "data" in data and "id" in data["data"]:
                created_article_id = data["data"]["id"]
                self.log_test("Create Article", True, f"Article created with ID: {created_article_id}")
            else:
                self.log_test("Create Article", False, "Article creation response missing ID")
                return False
        else:
            self.log_test("Create Article", False, f"Failed to create article - HTTP {response.status_code if response else 'No response'}")
            return False
        
        # Test UPDATE article
        if created_article_id:
            update_data = {
                "title": "Test Article - Updated",
                "excerpt": "Article de test mis à jour"
            }
            
            response = self.make_request("PUT", f"/admin/articles/{created_article_id}", update_data)
            if response and response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Update Article", True, "Article updated successfully")
                else:
                    self.log_test("Update Article", False, "Update response indicates failure")
            else:
                self.log_test("Update Article", False, f"Failed to update article - HTTP {response.status_code if response else 'No response'}")
        
        # Test DELETE article
        if created_article_id:
            response = self.make_request("DELETE", f"/admin/articles/{created_article_id}")
            if response and response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Delete Article", True, "Article deleted successfully")
                else:
                    self.log_test("Delete Article", False, "Delete response indicates failure")
            else:
                self.log_test("Delete Article", False, f"Failed to delete article - HTTP {response.status_code if response else 'No response'}")
        
        return True
    
    def test_contacts_management(self):
        """Test contacts management endpoint"""
        print("\n=== Testing Contacts Management ===")
        
        response = self.make_request("GET", "/admin/contacts")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.test_results["admin_endpoints"]["contacts"] = self.log_test(
                    "Get Contacts", 
                    True, 
                    f"Retrieved {len(data)} contacts"
                )
                return True
            else:
                self.test_results["admin_endpoints"]["contacts"] = self.log_test(
                    "Get Contacts", 
                    False, 
                    "Response is not a list"
                )
                return False
        else:
            error_msg = f"HTTP {response.status_code}" if response else "No response"
            self.test_results["admin_endpoints"]["contacts"] = self.log_test(
                "Get Contacts", 
                False, 
                f"Request failed: {error_msg}"
            )
            return False
    
    def test_services_management(self):
        """Test services management endpoints"""
        print("\n=== Testing Services Management ===")
        
        # Test GET services
        response = self.make_request("GET", "/admin/services")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_test("Get Services", True, f"Retrieved {len(data)} services")
            else:
                self.log_test("Get Services", False, "Response is not a list")
                return False
        else:
            self.log_test("Get Services", False, f"Failed to get services - HTTP {response.status_code if response else 'No response'}")
            return False
        
        # Test CREATE service
        test_service = {
            "title": "Service de Test",
            "icon": "🧪",
            "description": "Service créé pour tester l'API d'administration",
            "features": ["Test feature 1", "Test feature 2", "Test feature 3"],
            "price": "Sur devis"
        }
        
        response = self.make_request("POST", "/admin/services", test_service)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                self.log_test("Create Service", True, "Service created successfully")
                return True
            else:
                self.log_test("Create Service", False, "Service creation response indicates failure")
                return False
        else:
            self.log_test("Create Service", False, f"Failed to create service - HTTP {response.status_code if response else 'No response'}")
            return False
    
    def test_users_endpoints(self):
        """Test user-related endpoints"""
        print("\n=== Testing User Management ===")
        
        # Test GET users
        response = self.make_request("GET", "/auth/users")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_test("Get Users", True, f"Retrieved {len(data)} users")
            else:
                self.log_test("Get Users", False, "Response is not a list")
                return False
        else:
            self.log_test("Get Users", False, f"Failed to get users - HTTP {response.status_code if response else 'No response'}")
            return False
        
        # Test GET user stats
        response = self.make_request("GET", "/auth/stats")
        
        if response and response.status_code == 200:
            data = response.json()
            required_keys = ["total_users", "active_users", "by_role"]
            
            if all(key in data for key in required_keys):
                self.log_test("Get User Stats", True, f"Stats retrieved - Total: {data.get('total_users', 0)}, Active: {data.get('active_users', 0)}")
                return True
            else:
                self.log_test("Get User Stats", False, f"Missing required keys in response: {required_keys}")
                return False
        else:
            self.log_test("Get User Stats", False, f"Failed to get user stats - HTTP {response.status_code if response else 'No response'}")
            return False
    
    def test_authentication_security(self):
        """Test authentication security"""
        print("\n=== Testing Authentication Security ===")
        
        # Test accessing admin endpoint without token
        temp_token = self.access_token
        self.access_token = None
        
        response = self.make_request("GET", "/admin/dashboard/stats")
        
        if response and response.status_code == 401:
            self.log_test("Unauthorized Access Protection", True, "Correctly blocked unauthorized access")
        else:
            self.log_test("Unauthorized Access Protection", False, f"Should have returned 401, got {response.status_code if response else 'No response'}")
        
        # Restore token
        self.access_token = temp_token
        
        # Test token refresh
        response = self.make_request("POST", "/auth/refresh-token")
        
        if response and response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                self.log_test("Token Refresh", True, "Token refreshed successfully")
                return True
            else:
                self.log_test("Token Refresh", False, "No access token in refresh response")
                return False
        else:
            self.log_test("Token Refresh", False, f"Token refresh failed - HTTP {response.status_code if response else 'No response'}")
            return False
    
    def run_all_tests(self):
        """Run all admin panel tests"""
        print("🚀 Starting Admin Panel Backend Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test API health first
        if not self.test_health_check():
            print("❌ API health check failed. Stopping tests.")
            return False
        
        # Test admin authentication
        if not self.test_admin_login():
            print("❌ Admin login failed. Cannot proceed with admin tests.")
            return False
        
        # Run all admin endpoint tests
        tests = [
            self.test_dashboard_stats,
            self.test_articles_crud,
            self.test_contacts_management,
            self.test_services_management,
            self.test_users_endpoints,
            self.test_authentication_security
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
        
        print("\n" + "=" * 60)
        print(f"🏁 Test Summary: {passed}/{total} tests passed")
        
        if passed == total:
            print("✅ All admin panel backend tests passed!")
            return True
        else:
            print(f"❌ {total - passed} tests failed")
            return False

def main():
    """Main test execution"""
    tester = AdminPanelTester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_results_detailed.json', 'w') as f:
        json.dump(tester.test_results, f, indent=2, default=str)
    
    print(f"\n📊 Detailed results saved to: /app/test_results_detailed.json")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())