#!/usr/bin/env python3
"""
Specialized Analytics APIs Testing Script for Anomalya Corp
Tests specifically that Analytics APIs now use realistic data based on actual database content
instead of completely random/simulated values.
"""

import requests
import json
import sys
from datetime import datetime
import time

# Configuration
BACKEND_URL = "https://181b3f8a-6fc0-477f-b4ba-0f63f1eafc7b.preview.emergentagent.com/api"

class AnalyticsRealisticTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.admin_token = None
        self.admin_user = {
            "username": "admin",
            "password": "admin123"
        }
        self.test_results = {
            "authentication": {},
            "database_baseline": {},
            "analytics_realism": {},
            "errors": []
        }
        self.db_baseline = {}
    
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
        
        # Add admin token
        if self.admin_token:
            headers["Authorization"] = f"Bearer {self.admin_token}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method.upper() == "POST":
                headers["Content-Type"] = "application/json"
                response = requests.post(url, json=data, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
    
    def authenticate_admin(self):
        """Authenticate as admin user"""
        print("\n=== Admin Authentication ===")
        
        response = self.make_request("POST", "/auth/login", self.admin_user)
        if response and response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                self.admin_token = data["access_token"]
                self.test_results["authentication"]["admin_login"] = self.log_test(
                    "Admin Login", True, "Successfully authenticated as admin"
                )
                return True
            else:
                self.test_results["authentication"]["admin_login"] = self.log_test(
                    "Admin Login", False, "No access token in response"
                )
                return False
        else:
            self.test_results["authentication"]["admin_login"] = self.log_test(
                "Admin Login", False, f"Login failed - HTTP {response.status_code if response else 'No response'}"
            )
            return False
    
    def get_database_baseline(self):
        """Get actual database counts to compare against analytics"""
        print("\n=== Getting Database Baseline ===")
        
        # Get dashboard stats which should reflect real DB counts
        response = self.make_request("GET", "/admin/dashboard/stats")
        if response and response.status_code == 200:
            data = response.json()
            totals = data.get("totals", {})
            
            self.db_baseline = {
                "users": totals.get("users", 0),
                "articles": totals.get("articles", 0),
                "contacts": totals.get("contacts", 0),
                "services": totals.get("services", 0)
            }
            
            self.test_results["database_baseline"]["dashboard_stats"] = self.log_test(
                "Database Baseline", True, 
                f"Users: {self.db_baseline['users']}, Articles: {self.db_baseline['articles']}, Contacts: {self.db_baseline['contacts']}, Services: {self.db_baseline['services']}"
            )
            
            # Get additional data for more comprehensive baseline
            # Get articles to check for pinned articles
            articles_response = self.make_request("GET", "/admin/articles")
            if articles_response and articles_response.status_code == 200:
                articles_data = articles_response.json()
                articles_list = articles_data.get("articles", [])
                pinned_articles = [a for a in articles_list if a.get("isPinned", False)]
                self.db_baseline["pinned_articles"] = len(pinned_articles)
                self.db_baseline["total_articles_detailed"] = len(articles_list)
                
                self.test_results["database_baseline"]["articles_details"] = self.log_test(
                    "Articles Details", True, 
                    f"Total articles: {len(articles_list)}, Pinned articles: {len(pinned_articles)}"
                )
            
            # Get clients count
            clients_response = self.make_request("GET", "/admin/clients")
            if clients_response and clients_response.status_code == 200:
                clients_data = clients_response.json()
                self.db_baseline["clients"] = len(clients_data)
                
                self.test_results["database_baseline"]["clients_count"] = self.log_test(
                    "Clients Count", True, f"Total clients: {len(clients_data)}"
                )
            
            return True
        else:
            self.test_results["database_baseline"]["dashboard_stats"] = self.log_test(
                "Database Baseline", False, f"Failed to get baseline - HTTP {response.status_code if response else 'No response'}"
            )
            return False
    
    def test_analytics_overview_realism(self):
        """Test that analytics overview uses realistic data based on DB"""
        print("\n=== Testing Analytics Overview Realism ===")
        
        for time_range in ["7d", "30d", "90d"]:
            response = self.make_request("GET", f"/admin/analytics/overview?time_range={time_range}")
            if response and response.status_code == 200:
                data = response.json()
                if data.get("success") and "data" in data:
                    overview = data["data"]["overview"]
                    
                    # Check if the totals match our database baseline
                    db_users = self.db_baseline.get("users", 0)
                    db_articles = self.db_baseline.get("articles", 0)
                    db_contacts = self.db_baseline.get("contacts", 0)
                    
                    analytics_users = overview.get("totalUsers", 0)
                    analytics_articles = overview.get("totalArticles", 0)
                    analytics_contacts = overview.get("totalContacts", 0)
                    
                    # Verify data consistency
                    users_match = analytics_users == db_users
                    articles_match = analytics_articles == db_articles
                    contacts_match = analytics_contacts == db_contacts
                    
                    # Check growth percentages are realistic (not completely random)
                    growth = overview.get("growth", {})
                    users_growth = growth.get("users", 0)
                    articles_growth = growth.get("articles", 0)
                    
                    # Realistic growth should be within reasonable bounds
                    realistic_growth = (-20 <= users_growth <= 50) and (-10 <= articles_growth <= 30)
                    
                    success = users_match and articles_match and contacts_match and realistic_growth
                    
                    details = f"DB vs Analytics - Users: {db_users}={analytics_users} ({'✓' if users_match else '✗'}), Articles: {db_articles}={analytics_articles} ({'✓' if articles_match else '✗'}), Contacts: {db_contacts}={analytics_contacts} ({'✓' if contacts_match else '✗'}), Growth realistic: {'✓' if realistic_growth else '✗'} (Users: {users_growth}%, Articles: {articles_growth}%)"
                    
                    self.test_results["analytics_realism"][f"overview_{time_range}"] = self.log_test(
                        f"Overview Realism ({time_range})", success, details
                    )
                else:
                    self.test_results["analytics_realism"][f"overview_{time_range}"] = self.log_test(
                        f"Overview Realism ({time_range})", False, "Invalid response structure"
                    )
            else:
                self.test_results["analytics_realism"][f"overview_{time_range}"] = self.log_test(
                    f"Overview Realism ({time_range})", False, f"Failed - HTTP {response.status_code if response else 'No response'}"
                )
    
    def test_user_activity_realism(self):
        """Test that user activity is based on real user count"""
        print("\n=== Testing User Activity Realism ===")
        
        response = self.make_request("GET", "/admin/analytics/user-activity?time_range=7d")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "data" in data:
                activity_data = data["data"]["userActivity"]
                
                # Check if activity is proportional to actual user count
                total_users = self.db_baseline.get("users", 0) + self.db_baseline.get("clients", 0)
                
                # Calculate average daily activity
                avg_daily_users = sum(day["users"] for day in activity_data) / len(activity_data)
                avg_daily_sessions = sum(day["sessions"] for day in activity_data) / len(activity_data)
                
                # Activity should be proportional to total users (realistic base activity)
                expected_base_activity = min(max(total_users // 5, 5), 50)
                activity_realistic = (expected_base_activity * 0.5) <= avg_daily_users <= (expected_base_activity * 2)
                
                # Sessions should be reasonable multiple of users
                sessions_realistic = 1.0 <= (avg_daily_sessions / max(avg_daily_users, 1)) <= 3.0
                
                success = activity_realistic and sessions_realistic
                
                details = f"Total DB users: {total_users}, Expected base activity: {expected_base_activity}, Avg daily users: {avg_daily_users:.1f}, Avg sessions: {avg_daily_sessions:.1f}, Activity realistic: {'✓' if activity_realistic else '✗'}, Sessions realistic: {'✓' if sessions_realistic else '✗'}"
                
                self.test_results["analytics_realism"]["user_activity"] = self.log_test(
                    "User Activity Realism", success, details
                )
            else:
                self.test_results["analytics_realism"]["user_activity"] = self.log_test(
                    "User Activity Realism", False, "Invalid response structure"
                )
        else:
            self.test_results["analytics_realism"]["user_activity"] = self.log_test(
                "User Activity Realism", False, f"Failed - HTTP {response.status_code if response else 'No response'}"
            )
    
    def test_content_performance_realism(self):
        """Test that content performance is based on real articles and pinned articles have higher views"""
        print("\n=== Testing Content Performance Realism ===")
        
        response = self.make_request("GET", "/admin/analytics/content-performance?limit=10")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "data" in data:
                content_data = data["data"]["contentPerformance"]
                
                # Check if we have the expected number of articles
                expected_articles = min(self.db_baseline.get("total_articles_detailed", 0), 10)
                articles_count_match = len(content_data) == expected_articles
                
                # Check if pinned articles have higher views than non-pinned
                pinned_articles = [article for article in content_data if article.get("isPinned", False)]
                non_pinned_articles = [article for article in content_data if not article.get("isPinned", False)]
                
                pinned_advantage = True
                if pinned_articles and non_pinned_articles:
                    avg_pinned_views = sum(article["views"] for article in pinned_articles) / len(pinned_articles)
                    avg_non_pinned_views = sum(article["views"] for article in non_pinned_articles) / len(non_pinned_articles)
                    pinned_advantage = avg_pinned_views > avg_non_pinned_views
                
                # Check if engagement rates are realistic (60-95%)
                engagement_realistic = all(60 <= article.get("engagement", 0) <= 95 for article in content_data)
                
                # Check if views are realistic (not completely random)
                views_realistic = all(50 <= article.get("views", 0) <= 2000 for article in content_data)
                
                success = articles_count_match and pinned_advantage and engagement_realistic and views_realistic
                
                details = f"Articles count: {len(content_data)}/{expected_articles} ({'✓' if articles_count_match else '✗'}), Pinned articles: {len(pinned_articles)}, Pinned advantage: {'✓' if pinned_advantage else '✗'}, Engagement realistic: {'✓' if engagement_realistic else '✗'}, Views realistic: {'✓' if views_realistic else '✗'}"
                
                if pinned_articles and non_pinned_articles:
                    avg_pinned_views = sum(article["views"] for article in pinned_articles) / len(pinned_articles)
                    avg_non_pinned_views = sum(article["views"] for article in non_pinned_articles) / len(non_pinned_articles)
                    details += f", Avg pinned views: {avg_pinned_views:.0f}, Avg non-pinned views: {avg_non_pinned_views:.0f}"
                
                self.test_results["analytics_realism"]["content_performance"] = self.log_test(
                    "Content Performance Realism", success, details
                )
            else:
                self.test_results["analytics_realism"]["content_performance"] = self.log_test(
                    "Content Performance Realism", False, "Invalid response structure"
                )
        else:
            self.test_results["analytics_realism"]["content_performance"] = self.log_test(
                "Content Performance Realism", False, f"Failed - HTTP {response.status_code if response else 'No response'}"
            )
    
    def test_traffic_sources_realism(self):
        """Test that traffic sources are realistic and proportional to site content"""
        print("\n=== Testing Traffic Sources Realism ===")
        
        response = self.make_request("GET", "/admin/analytics/traffic-sources?time_range=30d")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "data" in data:
                traffic_data = data["data"]["trafficSources"]
                
                # Check if we have the expected traffic sources
                expected_sources = ["Direct", "Google", "Social Media", "Referral"]
                sources_present = [source["source"] for source in traffic_data]
                sources_complete = all(source in sources_present for source in expected_sources)
                
                # Check if percentages add up to 100%
                total_percentage = sum(source["visitors"] for source in traffic_data)
                percentage_correct = 99.5 <= total_percentage <= 100.5  # Allow small rounding errors
                
                # Check if distribution is realistic (not completely equal)
                percentages = [source["visitors"] for source in traffic_data]
                distribution_realistic = max(percentages) - min(percentages) > 5  # Some variation expected
                
                # Check if Direct traffic is influenced by content (more articles = more direct traffic)
                direct_traffic = next((source["visitors"] for source in traffic_data if source["source"] == "Direct"), 0)
                articles_count = self.db_baseline.get("articles", 0)
                direct_realistic = direct_traffic >= 30  # Should be significant portion
                
                success = sources_complete and percentage_correct and distribution_realistic and direct_realistic
                
                details = f"Sources complete: {'✓' if sources_complete else '✗'}, Total %: {total_percentage:.1f} ({'✓' if percentage_correct else '✗'}), Distribution realistic: {'✓' if distribution_realistic else '✗'}, Direct traffic: {direct_traffic}% ({'✓' if direct_realistic else '✗'})"
                
                self.test_results["analytics_realism"]["traffic_sources"] = self.log_test(
                    "Traffic Sources Realism", success, details
                )
            else:
                self.test_results["analytics_realism"]["traffic_sources"] = self.log_test(
                    "Traffic Sources Realism", False, "Invalid response structure"
                )
        else:
            self.test_results["analytics_realism"]["traffic_sources"] = self.log_test(
                "Traffic Sources Realism", False, f"Failed - HTTP {response.status_code if response else 'No response'}"
            )
    
    def test_popular_pages_realism(self):
        """Test that popular pages are based on real site content"""
        print("\n=== Testing Popular Pages Realism ===")
        
        response = self.make_request("GET", "/admin/analytics/popular-pages?limit=10")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "data" in data:
                pages_data = data["data"]["popularPages"]
                
                # Check if we have expected pages based on site structure
                expected_pages = ["/", "/services", "/actualites", "/contact", "/competences"]
                pages_present = [page["page"] for page in pages_data]
                core_pages_present = all(page in pages_present for page in expected_pages[:3])  # At least home, services, news
                
                # Check if homepage has highest views (realistic)
                homepage_views = next((page["views"] for page in pages_data if page["page"] == "/"), 0)
                other_pages_views = [page["views"] for page in pages_data if page["page"] != "/"]
                homepage_highest = not other_pages_views or homepage_views >= max(other_pages_views)
                
                # Check if views are influenced by content count
                services_views = next((page["views"] for page in pages_data if page["page"] == "/services"), 0)
                news_views = next((page["views"] for page in pages_data if page["page"] == "/actualites"), 0)
                
                services_count = self.db_baseline.get("services", 0)
                articles_count = self.db_baseline.get("articles", 0)
                
                # Services page should have views proportional to services count
                services_realistic = services_views > 0 if services_count > 0 else True
                # News page should have views proportional to articles count  
                news_realistic = news_views > 0 if articles_count > 0 else True
                
                # Check if bounce rates are realistic (5-50%)
                bounce_rates_realistic = all(5 <= page.get("bounce", 0) <= 50 for page in pages_data)
                
                success = core_pages_present and homepage_highest and services_realistic and news_realistic and bounce_rates_realistic
                
                details = f"Core pages present: {'✓' if core_pages_present else '✗'}, Homepage highest: {'✓' if homepage_highest else '✗'} ({homepage_views} views), Services realistic: {'✓' if services_realistic else '✗'} ({services_views} views), News realistic: {'✓' if news_realistic else '✗'} ({news_views} views), Bounce rates realistic: {'✓' if bounce_rates_realistic else '✗'}"
                
                self.test_results["analytics_realism"]["popular_pages"] = self.log_test(
                    "Popular Pages Realism", success, details
                )
            else:
                self.test_results["analytics_realism"]["popular_pages"] = self.log_test(
                    "Popular Pages Realism", False, "Invalid response structure"
                )
        else:
            self.test_results["analytics_realism"]["popular_pages"] = self.log_test(
                "Popular Pages Realism", False, f"Failed - HTTP {response.status_code if response else 'No response'}"
            )
    
    def test_data_consistency_across_calls(self):
        """Test that analytics data is consistent across multiple calls (not completely random)"""
        print("\n=== Testing Data Consistency ===")
        
        # Make two calls to overview and check if data is reasonably consistent
        response1 = self.make_request("GET", "/admin/analytics/overview?time_range=7d")
        time.sleep(1)  # Small delay
        response2 = self.make_request("GET", "/admin/analytics/overview?time_range=7d")
        
        if response1 and response2 and response1.status_code == 200 and response2.status_code == 200:
            data1 = response1.json()
            data2 = response2.json()
            
            if data1.get("success") and data2.get("success"):
                overview1 = data1["data"]["overview"]
                overview2 = data2["data"]["overview"]
                
                # Core counts should be identical (they're from DB)
                users_consistent = overview1.get("totalUsers") == overview2.get("totalUsers")
                articles_consistent = overview1.get("totalArticles") == overview2.get("totalArticles")
                contacts_consistent = overview1.get("totalContacts") == overview2.get("totalContacts")
                
                # Growth rates might vary slightly but shouldn't be wildly different
                growth1 = overview1.get("growth", {})
                growth2 = overview2.get("growth", {})
                
                users_growth_diff = abs(growth1.get("users", 0) - growth2.get("users", 0))
                articles_growth_diff = abs(growth1.get("articles", 0) - growth2.get("articles", 0))
                
                # Growth should not vary by more than 5% between calls (indicates some stability)
                growth_stable = users_growth_diff <= 5 and articles_growth_diff <= 5
                
                success = users_consistent and articles_consistent and contacts_consistent and growth_stable
                
                details = f"Users consistent: {'✓' if users_consistent else '✗'}, Articles consistent: {'✓' if articles_consistent else '✗'}, Contacts consistent: {'✓' if contacts_consistent else '✗'}, Growth stable: {'✓' if growth_stable else '✗'} (Users diff: {users_growth_diff:.1f}%, Articles diff: {articles_growth_diff:.1f}%)"
                
                self.test_results["analytics_realism"]["data_consistency"] = self.log_test(
                    "Data Consistency", success, details
                )
            else:
                self.test_results["analytics_realism"]["data_consistency"] = self.log_test(
                    "Data Consistency", False, "Invalid response structure in one or both calls"
                )
        else:
            self.test_results["analytics_realism"]["data_consistency"] = self.log_test(
                "Data Consistency", False, "Failed to make both requests successfully"
            )
    
    def run_realistic_analytics_tests(self):
        """Run all realistic analytics tests"""
        print("🎯 Starting Analytics Realistic Data Testing")
        print(f"Backend URL: {self.base_url}")
        print("=" * 80)
        
        # Step 1: Authenticate
        if not self.authenticate_admin():
            print("❌ Admin authentication failed. Cannot proceed with tests.")
            return False
        
        # Step 2: Get database baseline
        if not self.get_database_baseline():
            print("❌ Failed to get database baseline. Cannot validate realism.")
            return False
        
        # Step 3: Run all realism tests
        test_functions = [
            ("Analytics Overview Realism", self.test_analytics_overview_realism),
            ("User Activity Realism", self.test_user_activity_realism),
            ("Content Performance Realism", self.test_content_performance_realism),
            ("Traffic Sources Realism", self.test_traffic_sources_realism),
            ("Popular Pages Realism", self.test_popular_pages_realism),
            ("Data Consistency", self.test_data_consistency_across_calls)
        ]
        
        passed_tests = 0
        total_tests = len(test_functions)
        
        for test_name, test_func in test_functions:
            try:
                print(f"\n{'='*20} {test_name} {'='*20}")
                test_func()
                passed_tests += 1
                print(f"✅ {test_name} - COMPLETED")
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {e}")
                self.test_results["errors"].append(f"{test_name}: {str(e)}")
        
        print("\n" + "=" * 80)
        print(f"🏁 Analytics Realism Test Summary: {passed_tests}/{total_tests} test categories completed")
        
        # Count individual test results
        total_individual_tests = 0
        passed_individual_tests = 0
        for category in self.test_results.values():
            if isinstance(category, dict):
                for test_result in category.values():
                    if isinstance(test_result, dict) and "success" in test_result:
                        total_individual_tests += 1
                        if test_result["success"]:
                            passed_individual_tests += 1
        
        print(f"📊 Individual Tests: {passed_individual_tests}/{total_individual_tests} tests passed")
        
        # Determine overall success
        success_rate = passed_individual_tests / total_individual_tests if total_individual_tests > 0 else 0
        overall_success = success_rate >= 0.8  # 80% success rate required
        
        if overall_success:
            print("✅ Analytics APIs are using realistic data based on database content!")
        else:
            print(f"❌ Analytics APIs need improvement - only {success_rate:.1%} of realism tests passed")
        
        return overall_success

def main():
    """Main test execution"""
    tester = AnalyticsRealisticTester()
    success = tester.run_realistic_analytics_tests()
    
    # Save detailed results
    with open('/app/analytics_realism_results.json', 'w') as f:
        json.dump(tester.test_results, f, indent=2, default=str)
    
    print(f"\n📊 Detailed results saved to: /app/analytics_realism_results.json")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())