"""
AI营销助手前端UI自动化测试
使用Playwright进行端到端测试
"""
import pytest
import time
import json
from playwright.sync_api import Page, expect
from utils.test_data_manager import TestDataManager, get_regression_test_params, get_high_priority_test_params
from utils.assertion_helpers import AssertionHelper

class TestUIAutomation:
    """UI自动化测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.test_data_manager = TestDataManager()
        self.assertion_helper = AssertionHelper()
        self.base_url = "http://localhost:8084"
        self.api_url = "http://localhost:8003"
    
    def test_page_load_and_api_connection(self, page: Page):
        """测试页面加载和API连接"""
        # 导航到增强版测试页面
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 验证页面标题
        expect(page).to_have_title("AI营销助手测试工具 - 增强版")
        
        # 验证关键元素存在
        expect(page.locator("#api-url")).to_be_visible()
        expect(page.locator("#connect-api")).to_be_visible()
        expect(page.locator("#query-input")).to_be_visible()
        expect(page.locator("#analyze-customer")).to_be_visible()
        
        # 设置API地址并连接
        page.fill("#api-url", self.api_url)
        page.click("#connect-api")
        
        # 等待连接状态更新
        page.wait_for_timeout(2000)
        
        # 验证连接状态
        connection_status = page.locator("#connection-status")
        expect(connection_status).to_contain_text("已连接")
        expect(connection_status).to_have_class("status-indicator status-connected")
    
    def test_manual_customer_analysis(self, page: Page):
        """测试手动客户分析功能"""
        # 页面设置
        page.goto(f"{self.base_url}/index_enhanced.html")
        page.fill("#api-url", self.api_url)
        page.click("#connect-api")
        page.wait_for_timeout(2000)
        
        # 输入测试问题
        test_question = "我是郑州的应届毕业生，想买人生第一台车，预算6-8万"
        advisor_notes = "客户是应届毕业生，首次购车，预算有限"
        
        page.fill("#query-input", test_question)
        page.fill("#advisor-notes", advisor_notes)
        
        # 点击分析按钮
        page.click("#analyze-customer")
        
        # 等待AI回答
        page.wait_for_selector(".ai-response-container", timeout=30000)
        
        # 验证回答内容
        response_container = page.locator(".ai-response-container").last()
        expect(response_container).to_be_visible()
        
        response_text = response_container.inner_text()
        assert len(response_text) > 50, "AI回答内容太短"
        
        # 验证关键信息
        assert any(keyword in response_text.lower() for keyword in ["客户画像", "置信度", "推荐策略"]), \
            "回答中缺少关键信息"
    
    @pytest.mark.parametrize(
        "test_id,question,expected_keywords,forbidden_keywords,check_source,priority,timeout",
        get_high_priority_test_params()
    )
    def test_high_priority_regression_cases(self, page: Page, test_id, question, 
                                          expected_keywords, forbidden_keywords, 
                                          check_source, priority, timeout):
        """测试高优先级回归用例"""
        # 页面设置
        page.goto(f"{self.base_url}/index_enhanced.html")
        page.fill("#api-url", self.api_url)
        page.click("#connect-api")
        page.wait_for_timeout(2000)
        
        # 构建测试用例
        test_case = {
            'test_id': test_id,
            'question': question,
            'expected_keywords': expected_keywords,
            'forbidden_keywords': forbidden_keywords,
            'check_source': check_source,
            'priority': priority,
            'timeout': timeout
        }
        
        # 输入问题
        page.fill("#query-input", question)
        page.fill("#advisor-notes", f"自动化测试用例: {test_id}")
        
        # 点击分析
        page.click("#analyze-customer")
        
        # 执行断言
        result = self.assertion_helper.assert_test_case(page, test_case)
        
        # 验证测试结果
        assert result['passed'], f"测试用例 {test_id} 失败: {result.get('error_message', '未知错误')}"
        
        # 验证关键词检查
        if result['keyword_check']:
            keyword_result = result['keyword_check']
            assert keyword_result['passed'], \
                f"关键词检查失败 - 缺少: {keyword_result['missing_keywords']}, " \
                f"禁用词: {keyword_result['forbidden_found']}"
        
        # 验证来源检查（如果需要）
        if check_source and result['source_check']:
            source_result = result['source_check']
            assert source_result['has_source'], "缺少引用来源"
    
    def test_automated_regression_suite(self, page: Page):
        """测试自动化回归测试套件"""
        # 页面设置
        page.goto(f"{self.base_url}/index_enhanced.html")
        page.fill("#api-url", self.api_url)
        page.click("#connect-api")
        page.wait_for_timeout(2000)
        
        # 点击运行高优先级测试
        page.click("#run-high-priority-tests")
        
        # 等待测试开始
        page.wait_for_timeout(2000)
        
        # 验证测试状态
        test_status = page.locator("#test-status")
        expect(test_status).to_contain_text("正在运行")
        
        # 验证进度条
        progress_bar = page.locator("#test-progress")
        expect(progress_bar).to_be_visible()
        
        # 等待测试完成（最多5分钟）
        page.wait_for_function(
            "document.getElementById('test-status').textContent.includes('测试完成')",
            timeout=300000
        )
        
        # 验证测试结果
        test_results = page.locator("#test-results .test-result-item")
        result_count = test_results.count()
        assert result_count > 0, "没有生成测试结果"
        
        # 统计通过率
        passed_count = page.locator("#test-results .test-result-item.passed").count()
        pass_rate = passed_count / result_count if result_count > 0 else 0
        
        # 验证通过率（至少60%）
        assert pass_rate >= 0.6, f"测试通过率过低: {pass_rate:.1%} ({passed_count}/{result_count})"
    
    def test_single_test_execution(self, page: Page):
        """测试单个测试执行功能"""
        # 页面设置
        page.goto(f"{self.base_url}/index_enhanced.html")
        page.fill("#api-url", self.api_url)
        page.click("#connect-api")
        page.wait_for_timeout(2000)
        
        # 模拟点击单个测试按钮（需要处理prompt）
        test_question = "伊兰特的安全配置如何？"
        
        # 使用JavaScript直接调用函数避免prompt
        page.evaluate(f"runSingleTest('{test_question}')")
        
        # 等待测试结果
        page.wait_for_selector("#test-results .test-result-item", timeout=30000)
        
        # 验证结果
        result_item = page.locator("#test-results .test-result-item").last()
        expect(result_item).to_be_visible()
        expect(result_item).to_contain_text("MANUAL-001")
    
    def test_chat_interface_functionality(self, page: Page):
        """测试聊天界面功能"""
        # 页面设置
        page.goto(f"{self.base_url}/index_enhanced.html")
        page.fill("#api-url", self.api_url)
        page.click("#connect-api")
        page.wait_for_timeout(2000)
        
        # 测试清空对话功能
        page.fill("#query-input", "测试消息")
        page.fill("#advisor-notes", "测试备注")
        page.click("#clear-chat")
        
        # 验证输入框已清空
        expect(page.locator("#query-input")).to_have_value("")
        expect(page.locator("#advisor-notes")).to_have_value("")
        
        # 测试多轮对话
        questions = [
            "伊兰特的价格是多少？",
            "有什么优惠政策吗？",
            "适合家庭使用吗？"
        ]
        
        for i, question in enumerate(questions):
            page.fill("#query-input", question)
            page.click("#analyze-customer")
            
            # 等待回答
            page.wait_for_selector(f".ai-response-container:nth-child({i+2})", timeout=30000)
            
            # 验证消息数量
            messages = page.locator(".message, .ai-response-container")
            assert messages.count() >= (i + 1) * 2, f"消息数量不正确，第{i+1}轮对话"
    
    def test_error_handling(self, page: Page):
        """测试错误处理"""
        # 页面设置
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 测试未连接API时的错误处理
        page.fill("#query-input", "测试问题")
        page.click("#analyze-customer")
        
        # 应该显示错误提示
        page.wait_for_function(
            "document.querySelector('.message.ai') !== null",
            timeout=5000
        )
        
        error_message = page.locator(".message.ai").last()
        expect(error_message).to_contain_text("请先连接API")
        
        # 测试无效API地址
        page.fill("#api-url", "http://invalid-url:9999")
        page.click("#connect-api")
        page.wait_for_timeout(3000)
        
        # 验证连接失败状态
        connection_status = page.locator("#connection-status")
        expect(connection_status).to_contain_text("连接失败")
    
    def test_responsive_design(self, page: Page):
        """测试响应式设计"""
        # 测试桌面视图
        page.set_viewport_size({"width": 1200, "height": 800})
        page.goto(f"{self.base_url}/index_enhanced.html")
        
        # 验证桌面布局
        expect(page.locator(".container")).to_be_visible()
        expect(page.locator(".input-group")).to_be_visible()
        
        # 测试移动视图
        page.set_viewport_size({"width": 375, "height": 667})
        page.wait_for_timeout(1000)
        
        # 验证移动布局仍然可用
        expect(page.locator(".container")).to_be_visible()
        expect(page.locator("#api-url")).to_be_visible()
        expect(page.locator("#query-input")).to_be_visible()
        
        # 测试平板视图
        page.set_viewport_size({"width": 768, "height": 1024})
        page.wait_for_timeout(1000)
        
        # 验证平板布局
        expect(page.locator(".automation-buttons")).to_be_visible()

class TestPerformance:
    """性能测试类"""
    
    def test_page_load_performance(self, page: Page):
        """测试页面加载性能"""
        start_time = time.time()
        page.goto("http://localhost:8082/index_enhanced.html")
        
        # 等待页面完全加载
        page.wait_for_load_state("networkidle")
        load_time = time.time() - start_time
        
        # 验证加载时间（应该在5秒内）
        assert load_time < 5.0, f"页面加载时间过长: {load_time:.2f}秒"
    
    def test_api_response_performance(self, page: Page):
        """测试API响应性能"""
        # 页面设置
        page.goto("http://localhost:8082/index_enhanced.html")
        page.fill("#api-url", "http://localhost:8003")
        page.click("#connect-api")
        page.wait_for_timeout(2000)
        
        # 测试简单查询的响应时间
        start_time = time.time()
        page.fill("#query-input", "伊兰特的价格")
        page.click("#analyze-customer")
        
        # 等待回答
        page.wait_for_selector(".ai-response-container", timeout=30000)
        response_time = time.time() - start_time
        
        # 验证响应时间（应该在10秒内）
        assert response_time < 10.0, f"API响应时间过长: {response_time:.2f}秒"

class TestAccessibility:
    """可访问性测试类"""
    
    def test_keyboard_navigation(self, page: Page):
        """测试键盘导航"""
        page.goto("http://localhost:8082/index_enhanced.html")
        
        # 测试Tab键导航
        page.keyboard.press("Tab")  # API地址输入框
        expect(page.locator("#api-url")).to_be_focused()
        
        page.keyboard.press("Tab")  # 连接按钮
        expect(page.locator("#connect-api")).to_be_focused()
        
        # 继续Tab到查询输入框
        for _ in range(5):  # 跳过中间的元素
            page.keyboard.press("Tab")
        
        expect(page.locator("#query-input")).to_be_focused()
    
    def test_form_labels(self, page: Page):
        """测试表单标签"""
        page.goto("http://localhost:8082/index_enhanced.html")
        
        # 验证重要输入框有标签
        api_label = page.locator("label[for='api-url']")
        expect(api_label).to_be_visible()
        expect(api_label).to_contain_text("API地址")
        
        # 验证查询输入框有标签
        query_label = page.locator("label[for='query-input']")
        expect(query_label).to_be_visible()
        expect(query_label).to_contain_text("客户问题")
