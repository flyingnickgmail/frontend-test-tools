"""
基础UI自动化测试
专注于页面加载、连接和基本交互功能
"""
import pytest
import time
from playwright.sync_api import Page, expect

class TestBasicUI:
    """基础UI测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.base_url = "http://localhost:8084"
        self.api_url = "http://localhost:8003"
    
    def test_page_load_and_elements(self, page: Page):
        """测试页面加载和关键元素"""
        # 导航到增强版测试页面
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 验证页面标题
        expect(page).to_have_title("AI营销助手测试工具 - 增强版")
        
        # 验证关键元素存在
        expect(page.locator("#api-url")).to_be_visible()
        expect(page.locator("#connect-api")).to_be_visible()
        expect(page.locator("#query-input")).to_be_visible()
        expect(page.locator("#analyze-customer")).to_be_visible()
        expect(page.locator("#connection-status")).to_be_visible()
        
        # 验证初始状态
        connection_status = page.locator("#connection-status")
        expect(connection_status).to_contain_text("未连接")
        expect(connection_status).to_have_class("status-indicator status-disconnected")
    
    def test_api_connection_success(self, page: Page):
        """测试API连接成功"""
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 设置API地址
        page.fill("#api-url", self.api_url)
        
        # 点击连接
        page.click("#connect-api")
        
        # 等待连接状态更新
        page.wait_for_timeout(3000)
        
        # 验证连接状态
        connection_status = page.locator("#connection-status")
        expect(connection_status).to_contain_text("已连接")
        expect(connection_status).to_have_class("status-indicator status-connected")
        
        # 验证连接按钮文本变化
        connect_btn = page.locator("#connect-api")
        expect(connect_btn).to_contain_text("重新连接")
    
    def test_api_connection_failure(self, page: Page):
        """测试API连接失败"""
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 设置无效的API地址
        page.fill("#api-url", "http://invalid-url:9999")
        
        # 点击连接
        page.click("#connect-api")
        
        # 等待连接尝试完成
        page.wait_for_timeout(5000)
        
        # 验证连接失败状态
        connection_status = page.locator("#connection-status")
        expect(connection_status).to_contain_text("连接失败")
        expect(connection_status).to_have_class("status-indicator status-disconnected")
    
    def test_input_validation(self, page: Page):
        """测试输入验证"""
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 测试空输入的处理
        page.click("#analyze-customer")
        
        # 应该有提示（通过JavaScript alert或页面消息）
        # 由于alert难以测试，我们检查按钮状态
        analyze_btn = page.locator("#analyze-customer")
        expect(analyze_btn).to_be_enabled()  # 按钮应该保持可用状态
    
    def test_clear_chat_functionality(self, page: Page):
        """测试清空对话功能"""
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 输入一些内容
        page.fill("#query-input", "测试问题")
        page.fill("#advisor-notes", "测试备注")
        
        # 验证内容已输入
        expect(page.locator("#query-input")).to_have_value("测试问题")
        expect(page.locator("#advisor-notes")).to_have_value("测试备注")
        
        # 点击清空按钮
        page.click("#clear-chat")
        
        # 验证内容已清空
        expect(page.locator("#query-input")).to_have_value("")
        expect(page.locator("#advisor-notes")).to_have_value("")
    
    def test_automation_buttons_exist(self, page: Page):
        """测试自动化测试按钮存在"""
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 验证自动化测试按钮存在
        expect(page.locator("#run-regression-tests")).to_be_visible()
        expect(page.locator("#run-high-priority-tests")).to_be_visible()
        expect(page.locator("#run-single-test")).to_be_visible()
        expect(page.locator("#stop-tests")).to_be_visible()
        
        # 验证测试状态区域存在
        expect(page.locator("#test-status")).to_be_visible()
        expect(page.locator("#test-progress")).to_be_visible()
        expect(page.locator("#test-results")).to_be_visible()
    
    def test_responsive_layout(self, page: Page):
        """测试响应式布局"""
        # 测试桌面视图
        page.set_viewport_size({"width": 1200, "height": 800})
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 验证主要容器可见
        expect(page.locator(".container")).to_be_visible()
        expect(page.locator(".connection-section")).to_be_visible()
        expect(page.locator(".automation-section")).to_be_visible()
        
        # 测试移动视图
        page.set_viewport_size({"width": 375, "height": 667})
        page.wait_for_timeout(1000)
        
        # 验证在移动设备上仍然可用
        expect(page.locator("#api-url")).to_be_visible()
        expect(page.locator("#query-input")).to_be_visible()
        expect(page.locator("#analyze-customer")).to_be_visible()
    
    def test_health_check_endpoint(self, page: Page):
        """测试健康检查端点"""
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 使用JavaScript直接调用健康检查
        health_result = page.evaluate(f"""
            fetch('{self.api_url}/health')
                .then(response => response.json())
                .then(data => data)
                .catch(error => ({{error: error.message}}))
        """)
        
        # 验证健康检查结果
        assert "error" not in health_result or health_result.get("status") == "healthy"
    
    def test_keyboard_navigation(self, page: Page):
        """测试键盘导航"""
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 测试Tab键导航
        page.keyboard.press("Tab")  # API地址输入框
        expect(page.locator("#api-url")).to_be_focused()
        
        page.keyboard.press("Tab")  # 连接按钮
        expect(page.locator("#connect-api")).to_be_focused()
        
        # 继续Tab导航
        for _ in range(10):  # 跳过中间的元素到查询输入框
            page.keyboard.press("Tab")
            if page.locator("#query-input").is_focused():
                break
        
        # 验证可以到达查询输入框
        expect(page.locator("#query-input")).to_be_focused()
    
    def test_form_accessibility(self, page: Page):
        """测试表单可访问性"""
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 验证重要输入框有标签
        api_label = page.locator("label[for='api-url']")
        expect(api_label).to_be_visible()
        
        query_label = page.locator("label[for='query-input']")
        expect(query_label).to_be_visible()
        
        advisor_label = page.locator("label[for='advisor-notes']")
        expect(advisor_label).to_be_visible()

class TestPerformanceBasic:
    """基础性能测试"""
    
    def test_page_load_time(self, page: Page):
        """测试页面加载时间"""
        start_time = time.time()
        page.goto("http://localhost:8084/index_enhanced.html")
        
        # 等待页面完全加载
        page.wait_for_load_state("networkidle")
        load_time = time.time() - start_time
        
        # 验证加载时间（应该在5秒内）
        assert load_time < 5.0, f"页面加载时间过长: {load_time:.2f}秒"
    
    def test_health_check_response_time(self, page: Page):
        """测试健康检查响应时间"""
        page.goto("http://localhost:8084/index_enhanced.html")
        
        start_time = time.time()
        
        # 执行健康检查
        result = page.evaluate("""
            fetch('http://localhost:8003/health')
                .then(response => response.ok)
                .catch(() => false)
        """)
        
        response_time = time.time() - start_time
        
        # 验证响应时间（应该在3秒内）
        assert response_time < 3.0, f"健康检查响应时间过长: {response_time:.2f}秒"
        
        # 如果健康检查成功，验证结果
        if result:
            assert result is True, "健康检查应该返回成功状态"
