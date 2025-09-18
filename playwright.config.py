"""
Playwright配置文件
"""
from playwright.sync_api import Playwright

# Playwright配置
PLAYWRIGHT_CONFIG = {
    # 浏览器配置
    'browser_name': 'chromium',  # 可选: chromium, firefox, webkit
    'headless': True,  # 无头模式，设为False可以看到浏览器界面
    'slow_mo': 100,  # 操作间延迟（毫秒）
    
    # 视口配置
    'viewport': {
        'width': 1280,
        'height': 720
    },
    
    # 超时配置
    'timeout': 30000,  # 默认超时30秒
    'navigation_timeout': 30000,  # 导航超时
    'expect_timeout': 5000,  # 断言超时
    
    # 重试配置
    'retries': 2,  # 失败重试次数
    
    # 截图和视频
    'screenshot': 'only-on-failure',  # 失败时截图
    'video': 'retain-on-failure',  # 失败时保留视频
    
    # 其他配置
    'ignore_https_errors': True,  # 忽略HTTPS错误
    'java_script_enabled': True,  # 启用JavaScript
    'accept_downloads': True,  # 允许下载
}

# 测试环境配置
TEST_CONFIG = {
    'base_url': 'http://localhost:8082',
    'api_url': 'http://localhost:8003',
    'test_data_path': 'test_cases',
    'reports_path': 'reports',
    'screenshots_path': 'reports/screenshots',
    'videos_path': 'reports/videos',
}

# 浏览器上下文配置
CONTEXT_CONFIG = {
    'ignore_https_errors': True,
    'accept_downloads': True,
    'record_video_dir': TEST_CONFIG['videos_path'],
    'record_video_size': {'width': 1280, 'height': 720},
}

def configure_playwright(playwright: Playwright):
    """配置Playwright实例"""
    browser = playwright.chromium.launch(
        headless=PLAYWRIGHT_CONFIG['headless'],
        slow_mo=PLAYWRIGHT_CONFIG['slow_mo']
    )
    
    context = browser.new_context(
        viewport=PLAYWRIGHT_CONFIG['viewport'],
        **CONTEXT_CONFIG
    )
    
    # 设置默认超时
    context.set_default_timeout(PLAYWRIGHT_CONFIG['timeout'])
    context.set_default_navigation_timeout(PLAYWRIGHT_CONFIG['navigation_timeout'])
    
    return browser, context
